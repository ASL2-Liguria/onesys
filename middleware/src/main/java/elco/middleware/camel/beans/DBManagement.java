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
import java.util.Map;

import javax.sql.DataSource;

import org.apache.camel.spi.Registry;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;

import elco.insc.Camel;
import elco.insc.DBUtils;
import elco.spring.StoredProcedureImpl;

/**
 * DB management bean
 *
 * @author Roberto Rizzo
 */
public final class DBManagement {

	private Config queries = null;
	private DataSource dataSource = null;
	private Registry registry = null;
	private QueryRunner queryRunner = null;

	private DBManagement(Registry registry, String beanName, boolean pmdKnownBroken) throws SQLException {
		queryRunner = new QueryRunner(pmdKnownBroken);
		this.registry = registry;
		dataSource = DBUtils.getDataSource(registry, beanName);
		if (dataSource == null) {
			throw new SQLException("DataSource " + beanName + " could not be found");
		}
	}

	private Connection getConnectionAndSetAutoCommitTrue() throws SQLException {
		Connection connection = dataSource.getConnection();
		connection.setAutoCommit(true);

		return connection;
	}

	private String getQuery(String query) {
		String useQuery = null;

		if (queries != null) {
			useQuery = queries.getStringQuietly(query);
		}

		if (useQuery == null) {
			useQuery = query;
		}

		return useQuery;
	}

	/**
	 * Return a DBManagement object<br>
	 * <br>
	 * pmdKnownBroken = false (since 7.0.3)
	 *
	 * @param registry
	 *            Camel registry object
	 * @param beanName
	 *            Pool bean name
	 * @return DBManagement object
	 * @throws SQLException
	 */
	public static DBManagement getDBManagement(Registry registry, String beanName) throws SQLException {
		return new DBManagement(registry, beanName, false);
	}

	/**
	 * Return a DBManagement object<br>
	 * since 6.0.9
	 *
	 * @param registry
	 *            Camel registry object
	 * @param beanName
	 *            Pool bean name
	 * @param pmdKnownBroken
	 *            Some drivers doesn't support java.sql.ParameterMetaData.getParameterType(int); if pmdKnownBroken is set to true, we won't even try it; if false, we'll try it, and
	 *            if it breaks, we'll remember not to use it again.
	 * @return DBManagement object
	 * @throws SQLException
	 */
	public static DBManagement getDBManagement(Registry registry, String beanName, boolean pmdKnownBroken) throws SQLException {
		return new DBManagement(registry, beanName, pmdKnownBroken);
	}

	/**
	 * Return a DBManagement object<br>
	 * since 7.0.3
	 *
	 * @param registry
	 *            Camel registry object
	 * @param beanName
	 *            Pool bean name
	 * @param queriesBean
	 *            Queries Config bean name. Can be NULL
	 * @return DBManagement object
	 * @throws SQLException
	 */
	public static DBManagement getDBManagement(Registry registry, String beanName, String queriesBean) throws SQLException {
		DBManagement dbm = DBManagement.getDBManagement(registry, beanName);
		if (queriesBean != null) {
			dbm.loadQueries(queriesBean);
		}

		return dbm;
	}

	/**
	 * Run a select and return an array of objects representing the rows
	 *
	 * @param query
	 *            sql select only or the name for a mapped one
	 * @param params
	 *            comma separated list of bind variables
	 * @return array of rows or null if there are no rows
	 * @throws SQLException
	 */
	private TableRow[] query(String query, Object... params) throws SQLException {
		Connection connection = null;
		TableRow[] tr = null;

		try {
			connection = getConnectionAndSetAutoCommitTrue();
			tr = DBUtils.query(queryRunner, getQuery(query), params, connection);
		} finally {
			DbUtils.closeQuietly(connection);
		}

		return tr;
	}

	/**
	 * Convenience's function. Simple call to query function
	 *
	 * @param query
	 *            sql select only or the name for a mapped one
	 * @param params
	 *            comma separated list of bind variables
	 * @return array of rows or null if there are no rows
	 * @throws SQLException
	 */
	public TableRow[] select(String query, Object... params) throws SQLException {
		return query(query, params);
	}

	/**
	 * Convenience's function. Simple call to query function
	 *
	 * @param query
	 *            sql select only or the name for a mapped one
	 * @param params
	 *            comma separated list of bind variables
	 * @return array of rows or an empty array if there are no rows
	 * @throws SQLException
	 */
	public TableRow[] selectEA(String query, Object... params) throws SQLException {
		TableRow[] rows = query(query, params);
		if (rows == null) {
			return new TableRow[] {};
		}

		return rows;
	}

	/**
	 * Run insert/update/delete
	 *
	 * @param query
	 *            only insert/update/delete query or the name for mapped one
	 * @param params
	 *            comma separated list of bind variables
	 * @return number of rows updated
	 * @throws SQLException
	 */
	public int update(String query, Object... params) throws SQLException {
		Connection connection = null;
		int rows = 0;

		try {
			connection = getConnectionAndSetAutoCommitTrue();
			rows = DBUtils.update(queryRunner, getQuery(query), params, connection);
		} finally {
			DbUtils.closeQuietly(connection);
		}

		return rows;
	}

	/**
	 * Convenience's function. Simple call to update function
	 *
	 * @param query
	 *            only insert/update/delete query or the name for a mapped one
	 * @param params
	 *            comma separated list of bind variables
	 * @return number of rows updated
	 * @throws SQLException
	 */
	public int insert(String query, Object... params) throws SQLException {
		return update(query, params);
	}

	/**
	 * Convenience's function. Simple call to update function
	 *
	 * @param query
	 *            only insert/update/delete query or the name for a mapped one
	 * @param params
	 *            comma separated list of bind variables
	 * @return number of rows updated
	 * @throws SQLException
	 */
	public int delete(String query, Object... params) throws SQLException {
		return update(query, params);
	}

	/**
	 * Return the current value of a sequence
	 *
	 * @param sequence
	 *            sequence name
	 * @return sequence current value
	 * @throws SQLException
	 */
	public String getSequenceVal(String sequence) throws SQLException {
		Connection connection = null;
		String seq = "";

		try {
			connection = getConnectionAndSetAutoCommitTrue();
			seq = DBUtils.getSequenceCurrVal(queryRunner, sequence, connection);
		} finally {
			DbUtils.closeQuietly(connection);
		}

		return seq;
	}

	/**
	 * Load queries
	 *
	 * @param beanName
	 *            Camel registry bean name
	 */
	public void loadQueries(String beanName) {
		if (queries == null) {
			queries = Camel.getConfigurationBean(registry, beanName);
		}
	}

	/**
	 * Call a stored procedure
	 *
	 * @param storedprocedure
	 *            StoredProcedureImpl object
	 * @param inputValues
	 *            MapSqlParameterSource of couples name <--> value of in/inOut parameters
	 * @return Map of couples name <--> value of out parameter
	 * @throws SQLException
	 */
	public Map<String, Object> callStoredProcedure(StoredProcedureImpl storedprocedure, MapSqlParameterSource inputValues) throws SQLException {
		Connection connection = null;
		Map<String, Object> result;

		try {
			connection = getConnectionAndSetAutoCommitTrue();
			result = DBUtils.callStoredProcedure(storedprocedure, inputValues, connection);
		} finally {
			DbUtils.closeQuietly(connection);
		}

		return result;
	}

	/**
	 * Call a stored function
	 *
	 * @param storedprocedure
	 *            StoredProcedureImpl object
	 * @param inputValues
	 *            MapSqlParameterSource of couples name <--> value of in/inOut parameters
	 * @return Map of couples name <--> value of out parameter
	 * @throws SQLException
	 */
	public Map<String, Object> callStoredFunction(StoredProcedureImpl storedprocedure, MapSqlParameterSource inputValues) throws SQLException {
		Connection connection = null;
		Map<String, Object> result;

		try {
			connection = getConnectionAndSetAutoCommitTrue();
			result = DBUtils.callStoredFunction(storedprocedure, inputValues, connection);
		} finally {
			DbUtils.closeQuietly(connection);
		}

		return result;
	}

	/**
	 * <p>
	 * Set MODULE, CLIENTID, ACTION to use on connections created by the pool
	 * </p>
	 * <p>
	 * <h1><font color='red'>Only works with an 'ElcoOracleDataSource2' or an 'ElcoOracleDataSource'</font></h1> </p>
	 *
	 * @param module
	 *            MODULE value
	 * @param clientid
	 *            CLIENTID value
	 * @param action
	 *            ACTION value
	 */
	public void setPoolModuleClientIDAction(String module, String clientid, String action) {
		if (dataSource instanceof ElcoOracleDataSourceInterface) {
			ElcoOracleDataSourceInterface eodsi = (ElcoOracleDataSourceInterface) dataSource;
			eodsi.setModule(module);
			eodsi.setClientID(clientid);
			eodsi.setAction(action);
		}
	}

	/**
	 * Return the data source used by DBManagement object
	 *
	 * @return javax.sql.DataSource
	 */
	public DataSource getDataSource() {
		return dataSource;
	}
}
