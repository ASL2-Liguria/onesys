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
package elco.middleware.camel.beans;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.commons.lang3.StringUtils;

import elco.crypt.CryptException;
import elco.crypt.CryptInterface;
import elco.insc.Constants;
import oracle.jdbc.OracleConnection;

/**
 * 'Oracle specific' connection pool based on 'org.apache.commons.dbcp2.BasicDataSource'
 *
 * @author Roberto Rizzo
 */
public final class ElcoOracleDataSource extends BasicDataSource implements ElcoOracleDataSourceInterface {

	private static final int DRIVER_VERSION = 12;
	private final String[] metrics = new String[OracleConnection.END_TO_END_STATE_INDEX_MAX];
	private final Properties properties = new Properties();
	private String cryptBeanID = null;

	/**
	 * Create a new oracle connection setting defaults for MODULE ('ElcoOracleDataSource'), CLIENTID ('UNKNOWN'), ACTION ('UNKNOWN')
	 * <p>
	 * Defaults:<br>
	 * remove abandoned on borrow = false<br>
	 * remove abandoned on maintenance = true<br>
	 * remove abandoned timeout = 2 minutes<br>
	 * test on borrow = true<br>
	 * test on return = false<br>
	 * test while idle = false<br>
	 * time between eviction = 15 seconds<br>
	 * minimum idle timeout = 3 minutes<br>
	 * maximum total connections = 50<br>
	 * maximum idle connections = 10<br>
	 * minimum idle connections = 0<br>
	 * initial size = 1<br>
	 * maximum time wait for a new connection = 10 seconds<br>
	 * validation query timeout = 10 seconds<br>
	 * pool prepared statements = true <br>
	 * max open prepared statements = 100<br>
	 * auto commit = true
	 * </p>
	 */
	public ElcoOracleDataSource() {
		init();
	}

	/**
	 * Create a new oracle connection setting defaults for MODULE ('ElcoOracleDataSource'), CLIENTID ('UNKNOWN'), ACTION ('UNKNOWN')
	 * <p>
	 * Defaults:<br>
	 * remove abandoned on borrow = false<br>
	 * remove abandoned on maintenance = true<br>
	 * remove abandoned timeout = 2 minutes<br>
	 * test on borrow = true<br>
	 * test on return = false<br>
	 * test while idle = false<br>
	 * time between eviction = 15 seconds<br>
	 * minimum idle timeout = 3 minutes<br>
	 * maximum total connections = 50<br>
	 * maximum idle connections = 10<br>
	 * minimum idle connections = 0<br>
	 * initial size = 1<br>
	 * maximum time wait for a new connection = 10 seconds<br>
	 * validation query timeout = 10 seconds<br>
	 * pool prepared statements = true <br>
	 * max open prepared statements = 100<br>
	 * auto commit = true
	 * </p>
	 *
	 * @param cryptBeanID
	 *            Bean used to decrypt password
	 */
	public ElcoOracleDataSource(String cryptBeanID) {
		this.cryptBeanID = cryptBeanID;
		init();
	}

	@Override
	public void setPassword(String password) {
		String newPassword = password;

		if (cryptBeanID != null) {
			CryptInterface crypt = Constants.camelRegistry.lookupByNameAndType(cryptBeanID, CryptInterface.class);
			if (crypt != null) {
				try {
					newPassword = crypt.deCrypt(password.getBytes());
				} catch (CryptException ex) { // NOSONAR
				}
			}
		}

		super.setPassword(newPassword);
	}

	@Override
	public Connection getConnection() throws SQLException {
		Connection connection = super.getConnection();
		setConnectionInfo(connection);

		return connection;
	}

	@Override
	public void setModule(String module) {
		metrics[OracleConnection.END_TO_END_MODULE_INDEX] = StringUtils.left(module, 48);
		properties.setProperty("OCSID.MODULE", StringUtils.left(module, 48));
	}

	@Override
	public void setClientID(String clientid) {
		metrics[OracleConnection.END_TO_END_CLIENTID_INDEX] = StringUtils.left(clientid, 64);
		properties.setProperty("OCSID.CLIENTID", StringUtils.left(clientid, 64));
	}

	@Override
	public void setAction(String action) {
		metrics[OracleConnection.END_TO_END_ACTION_INDEX] = StringUtils.left(action, 32);
		properties.setProperty("OCSID.ACTION", StringUtils.left(action, 32));
	}

	@SuppressWarnings("deprecation")
	private void setConnectionInfo(Connection pConnection) throws SQLException {
		int driverMajorVersion = pConnection.getMetaData().getDriverMajorVersion();

		OracleConnection connection = pConnection.unwrap(OracleConnection.class); // NOSONAR
		if (driverMajorVersion < DRIVER_VERSION) {
			connection.setEndToEndMetrics(metrics, (short) 0);
		} else {
			connection.setClientInfo(properties);
		}

		connection.pingDatabase();
	}

	private void init() {
		setRemoveAbandonedOnBorrow(false);
		setRemoveAbandonedOnMaintenance(true);
		setRemoveAbandonedTimeout(120);
		setTestOnBorrow(true);
		setTestOnReturn(false);
		setTestWhileIdle(false);
		setTimeBetweenEvictionRunsMillis(15000L);
		setMinEvictableIdleTimeMillis(180000L);
		setMaxTotal(50);
		setMaxIdle(10);
		setMinIdle(0);
		setInitialSize(0);
		setMaxWaitMillis(10000L);
		setValidationQueryTimeout(10);
		setPoolPreparedStatements(true);
		setMaxOpenPreparedStatements(100);
		setDefaultAutoCommit(true);

		metrics[OracleConnection.END_TO_END_MODULE_INDEX] = "ElcoOracleDataSource";
		metrics[OracleConnection.END_TO_END_CLIENTID_INDEX] = "UNKNOWN"; // NOSONAR
		metrics[OracleConnection.END_TO_END_ACTION_INDEX] = "UNKNOWN";

		properties.setProperty("OCSID.MODULE", "ElcoOracleDataSource");
		properties.setProperty("OCSID.CLIENTID", "UNKNOWN");
		properties.setProperty("OCSID.ACTION", "UNKNOWN");
	}
}
