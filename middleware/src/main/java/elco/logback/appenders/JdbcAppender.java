/* Copyright (c) 2018, EL.CO. SRL.  All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED FREE OF CHARGE AND ON AN "AS IS" BASIS,
 * WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED INCLUDING
 * WITHOUT LIMITATION THE WARRANTIES THAT IT IS FREE OF DEFECTS, MERCHANTABLE,
 * FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING. THE ENTIRE RISK
 * AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU.
 * SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
 * NECESSARY SERVICING, REPAIR, OR CORRECTION.
 * IN NO EVENT SHALL ELCO SRL BE LIABLE TO YOU FOR DAMAGES, INCLUDING
 * ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING
 * OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING, BUT NOT
 * LIMITED TO, LOSS OF DATA, DATA BEING RENDERED INACCURATE, LOSS OF
 * BUSINESS PROFITS, LOSS OF BUSINESS INFORMATION, BUSINESS INTERRUPTIONS,
 * LOSS SUSTAINED BY YOU OR THIRD PARTIES, OR A FAILURE OF THE SOFTWARE
 * TO OPERATE WITH ANY OTHER SOFTWARE) EVEN IF ELCO SRL HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.
 */
package elco.logback.appenders;

import java.sql.Clob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.Iterator;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.slf4j.Marker;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import elco.exceptions.LogNullEmptyValueException;
import elco.insc.Constants;
import elco.insc.DBUtils;
import elco.insc.LogbackUtils;

/**
 * <p>
 * Logback jdbc appender
 * </p>
 * <p>
 * log - getLoggerName, getThreadName, getLevel, getFormattedMessage
 * </p>
 *
 * @author Roberto Rizzo
 */
public final class JdbcAppender extends AppenderBase<ILoggingEvent> {

	private static String[] primaryKey = { "IDENTITY" };
	private String sql;
	private String sqlReferences = "INSERT INTO logback_em_marker_references (iden_event, reference) VALUES (?, ?)";
	private DataSource bds = null;
	private final AtomicReference<DataSource> arbds = new AtomicReference<>(null);
	private String poolName;

	/**
	 * INSERT INTO table (logger_name, thread_name, log_level, log_message, context, route, marker) VALUES (?, ?, ?, ?, ?, ?, ?)
	 *
	 * @param table
	 *            log table
	 */
	public void setTable(String table) {
		sql = "INSERT INTO " + table + " (logger_name, thread_name, log_level, log_message, context, route, marker) VALUES (?, ?, ?, ?, ?, ?, ?)";
	}

	/**
	 * INSERT INTO table (iden_event, reference) VALUES (?, ?)
	 *
	 * @param table
	 *            log table (default: logback_em_marker_references)
	 */
	public void setMarkersTable(String table) {
		sqlReferences = "INSERT INTO " + table + " (iden_event, reference) VALUES (?, ?)";
	}

	/**
	 * @param poolName
	 *            Name of the pool to use to connect to database
	 */
	public void setPoolName(String poolName) {
		this.poolName = poolName;
	}

	@Override
	protected void append(ILoggingEvent eventObject) { // NOSONAR
		if (Constants.camelRegistry != null) {
			if (bds == null) {
				arbds.compareAndSet(null, Constants.camelRegistry.lookupByNameAndType(poolName, DataSource.class));
				bds = arbds.get();
			}

			Clob message = null;
			PreparedStatement statement = null;
			PreparedStatement statementReferences = null;
			Connection connection = null;

			try {
				String logText = LogbackUtils.getErrorDescription(eventObject);
				if (StringUtils.isBlank(logText)) {
					throw new LogNullEmptyValueException("Log an empty or NULL message is useless");
				}

				connection = bds.getConnection();

				statement = connection.prepareStatement(sql, primaryKey);
				statement.setString(1, StringUtils.substring(eventObject.getLoggerName(), 0, 4000));
				statement.setString(2, StringUtils.substring(eventObject.getThreadName(), 0, 4000));
				statement.setString(3, StringUtils.substring(eventObject.getLevel().toString(), 0, 50));

				message = DBUtils.setClobValue(connection, logText);
				statement.setClob(4, message);

				statement.setString(5, eventObject.getMDCPropertyMap().get("camel.contextId"));
				String camelRouteId = eventObject.getMDCPropertyMap().get("camel.routeId");
				if (camelRouteId != null) {
					statement.setString(6, camelRouteId);
				} else {
					statement.setNull(6, Types.VARCHAR);
				}
				Marker oMarker = eventObject.getMarker();
				if (oMarker != null) {
					statement.setString(7, oMarker.getName());
				} else {
					statement.setNull(7, Types.VARCHAR);
				}
				statement.executeUpdate();

				if (oMarker != null && oMarker.hasReferences()) { // insert event's markers if any
					int logIden = 0;
					ResultSet generetedKeys = statement.getGeneratedKeys();
					while (generetedKeys.next()) { // NOSONAR
						logIden = generetedKeys.getInt(1); // get event's iden
					}

					statementReferences = connection.prepareStatement(sqlReferences);
					Iterator<Marker> it = oMarker.iterator();
					while (it.hasNext()) { // NOSONAR
						Marker reference = it.next();
						statementReferences.setInt(1, logIden);
						statementReferences.setString(2, reference.getName());
						statementReferences.executeUpdate();
					}
				}
			} catch (Exception ex) { // NOSONAR
				System.err.println("elco.logback.appenders.JdbcAppender append: " + ex.getLocalizedMessage()); // NOSONAR
			} finally {
				DBUtils.freeQuietly(message);
				DbUtils.closeQuietly(statement);
				DbUtils.closeQuietly(connection, statementReferences, null);
			}
		}
	}
}
