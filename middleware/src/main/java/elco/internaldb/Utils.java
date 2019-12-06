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
package elco.internaldb;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.dbutils.DbUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.Constants;

/**
 * @author Roberto Rizzo
 */
public final class Utils {

	private static final Logger logger = LoggerFactory.getLogger(Utils.class);

	private Utils() {
	}

	/**
	 * Execute a command on DB
	 *
	 * @param command
	 *            command to execute
	 * @throws SQLException
	 */
	public static void executeCommand(String command) throws SQLException {
		Connection conn = null;
		Statement stmt = null;

		try {
			conn = getConnection();
			stmt = conn.createStatement();
			stmt.execute(command);
		} catch (Exception ex) {
			throw new SQLException(ex);
		} finally {
			DbUtils.closeQuietly(conn, stmt, null);
		}
	}

	/**
	 * Execute initialization scripts
	 *
	 * @throws SQLException
	 */
	public static void executeInitScipts() throws SQLException {
		Connection conn = null;
		Statement stmt = null;
		PreparedStatement preStmt = null;
		ResultSet resultset = null;

		try {
			conn = getConnection();
			logger.info("Connected to internal DB");
			stmt = conn.createStatement();
			stmt.execute("RUNSCRIPT FROM 'classpath:META-INF/logback/logback_h2.sql'");
			DbUtils.closeQuietly(stmt);
			logger.info("Script logback_h2.sql executed");

			preStmt = conn.prepareStatement("select count(*) FT from INFORMATION_SCHEMA.SCHEMATA where SCHEMA_NAME = 'FT'", ResultSet.TYPE_FORWARD_ONLY);
			resultset = preStmt.executeQuery();
			if (resultset.next() && resultset.getInt("FT") == 0) {
				stmt = conn.createStatement();
				stmt.execute("RUNSCRIPT FROM 'classpath:META-INF/logback/logback_h2_full_text_search.sql'");
				logger.info("Script logback_h2_full_text_search.sql executed");
			}
		} catch (Exception ex) {
			throw new SQLException(ex);
		} finally {
			DbUtils.closeQuietly(stmt);
			DbUtils.closeQuietly(conn, preStmt, resultset);
		}
	}

	/**
	 * Connection to internal database
	 *
	 * @return Connection interface
	 * @throws SQLException
	 */
	public static Connection getConnection() throws SQLException {
		try {
			Class.forName(Constants.DBDRIVER);
			return DriverManager.getConnection(Constants.DBURL, Constants.DBUSER, Constants.DBPWD);
		} catch (Exception ex) {
			throw new SQLException(ex);
		}
	}
}
