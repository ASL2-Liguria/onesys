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
package elco.insc;

import java.io.InputStream;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.SQLXML;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.camel.spi.Registry;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.ReaderInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;

import elco.middleware.camel.beans.TableRow;
import elco.spring.StoredProcedureImpl;

/**
 * DBUtils utilities
 *
 * @author Roberto Rizzo
 */
public final class DBUtils {

	private static final Logger logger = LoggerFactory.getLogger(DBUtils.class); // since 5.0.2

	private DBUtils() {
	}

	/**
	 * Return a CLOB as String. Clob.free() is called
	 *
	 * @param rs
	 *            ResultSet object
	 * @param columnIndex
	 *            column index - the first column is 1, the second is 2, ...
	 * @return a String representation of the column or an empty String in any other case
	 */
	public static String getClobValueQuietly(ResultSet rs, int columnIndex) {
		String outputValue;

		try {
			outputValue = getClobValueQuietly(rs.getClob(columnIndex));
		} catch (Exception ex) { // NOSONAR
			outputValue = "";
		}

		return outputValue;
	}

	/**
	 * Return a CLOB as String. Clob.free() is called
	 *
	 * @param column
	 *            CLOB object
	 * @return a String representation of the column or an empty String in any other case
	 */
	public static String getClobValueQuietly(Clob column) {
		String outputValue;

		try { // NOSONAR
			outputValue = getStreamValueQuietly(new ReaderInputStream(column.getCharacterStream(), Constants.DEFAULT_VM_CHARSET));
		} catch (Exception ex) { // NOSONAR
			outputValue = "";
		} finally {
			freeQuietly(column);
		}

		return outputValue;
	}

	/**
	 * Return Stream content as String. InputStream will be closed
	 *
	 * @param iStream
	 *            InputStream from object
	 * @return a String representation of the column or an empty String in any other case
	 */
	public static String getStreamValueQuietly(InputStream iStream) {
		return getStreamValueQuietly(iStream, null);
	}

	/**
	 * Return Stream content as String. InputStream will be closed
	 *
	 * @param iStream
	 *            InputStream from object
	 * @param encoding
	 *            the encoding to use, null means platform default
	 * @return a String representation of the column or an empty String in any other case
	 */
	public static String getStreamValueQuietly(InputStream iStream, String encoding) {
		String outputValue;

		try {
			outputValue = IOUtils.toString(iStream, encoding);
		} catch (Exception ex) { // NOSONAR
			outputValue = "";
		} finally {
			IOUtils.closeQuietly(iStream);
		}

		return outputValue;
	}

	/**
	 * Return a BLOB as byte[]. Blob.free() is called
	 *
	 * @param rs
	 *            ResultSet object
	 * @param columnIndex
	 *            column index - the first column is 1, the second is 2, ...
	 * @return a byte[] representation of the column or NULL in any other case
	 */
	public static byte[] getBlobValueQuietly(ResultSet rs, int columnIndex) {
		byte[] outputValue;

		try {
			outputValue = getBlobValueQuietly(rs.getBlob(columnIndex));
		} catch (Exception ex) { // NOSONAR
			outputValue = null;
		}

		return outputValue;
	}

	/**
	 * Return a BLOB as byte[]. Blob.free() is called
	 *
	 * @param column
	 *            BLOB object
	 * @return a byte[] representation of the column or NULL in any other case
	 */
	public static byte[] getBlobValueQuietly(Blob column) {
		byte[] outputValue;

		try {
			outputValue = getBlobValueQuietly(column.getBinaryStream());
		} catch (Exception ex) { // NOSONAR
			outputValue = null;
		} finally {
			freeQuietly(column);
		}

		return outputValue;
	}

	/**
	 * Return a BLOB as byte[]. InputStream will be closed
	 *
	 * @param iStream
	 *            InputStream to BLOB object
	 * @return a byte[] representation of the column or NULL in any other case
	 */
	public static byte[] getBlobValueQuietly(InputStream iStream) {
		byte[] outputValue;

		try {
			outputValue = IOUtils.toByteArray(iStream);
		} catch (Exception ex) { // NOSONAR
			outputValue = null;
		} finally {
			IOUtils.closeQuietly(iStream);
		}

		return outputValue;
	}

	/**
	 * Return a SQLXML as String
	 *
	 * @param rs
	 *            ResultSet object
	 * @param columnIndex
	 *            column index - the first column is 1, the second is 2, ...
	 * @return a String representation of the column or an empty String in any other case
	 */
	public static String getSQLXMLValueQuietly(ResultSet rs, int columnIndex) {
		String outputValue;

		try {
			outputValue = getSQLXMLValueQuietly(rs.getSQLXML(columnIndex));
		} catch (Exception ex) { // NOSONAR
			outputValue = "";
		}

		return outputValue;
	}

	/**
	 * Return a SQLXML as String
	 *
	 * @param column
	 *            SQLXML object
	 * @return a String representation of the column or an empty String in any other case
	 */
	public static String getSQLXMLValueQuietly(SQLXML column) {
		String outputValue;

		try {
			outputValue = getStreamValueQuietly(column.getBinaryStream());
		} catch (Exception ex) { // NOSONAR
			outputValue = "";
		} finally {
			freeQuietly(column);
		}

		return outputValue;
	}

	/**
	 * Return a column as Object. BLOB as byte[], DATE as Date, TIME as Time, TIMESTAMP as Timestamp, others type as String
	 *
	 * @param rs
	 *            ResultSet object
	 * @param columnIndex
	 *            column index - the first column is 1, the second is 2, ...
	 * @return column value
	 * @throws SQLException
	 */
	public static Object getColumnAsObject(ResultSet rs, int columnIndex) throws SQLException {
		Object retValue;

		int type = rs.getMetaData().getColumnType(columnIndex);
		if (type == Types.CLOB) {
			retValue = getClobValueQuietly(rs, columnIndex);
		} else if (type == Types.BLOB) {
			retValue = getBlobValueQuietly(rs, columnIndex);
		} else if (type == Types.SQLXML) {
			retValue = getSQLXMLValueQuietly(rs, columnIndex);
		} else if (type == Types.DATE) {
			retValue = rs.getDate(columnIndex);
		} else if (type == Types.TIME) {
			retValue = rs.getTime(columnIndex);
		} else if (type == Types.TIMESTAMP) {
			retValue = rs.getTimestamp(columnIndex);
		} else {
			retValue = rs.getString(columnIndex);
		}

		return retValue;
	}

	/**
	 * Return a column as Object. BLOB as byte[], DATE as Date, TIME as Time, TIMESTAMP as Timestamp, others type as String
	 *
	 * @param rs
	 *            ResultSet object
	 * @param columnIndex
	 *            column index - the first column is 1, the second is 2, ...
	 * @return column value
	 */
	public static Object getColumnAsObjectSafe(ResultSet rs, int columnIndex) {
		Object retValue;

		try {
			retValue = getColumnAsObject(rs, columnIndex);
		} catch (Exception ex) { // NOSONAR
			retValue = "";
		}

		return retValue;
	}

	/**
	 * Free quietly the CLOB. No exceptions are thrown in any case
	 *
	 * @param clob
	 *            CLOB object
	 */
	public static void freeQuietly(Clob clob) {
		try {
			clob.free();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * Free quietly the BLOB. No exceptions are thrown in any case
	 *
	 * @param blob
	 *            BLOB object
	 */
	public static void freeQuietly(Blob blob) {
		try {
			blob.free();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * Free quietly the SQLXML. No exceptions are thrown in any case
	 *
	 * @param sqlxml
	 *            SQLXML object
	 */
	public static void freeQuietly(SQLXML sqlxml) {
		try {
			sqlxml.free();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * Set Clob value as String
	 *
	 * @param connection
	 *            connection used to create Clob
	 * @param value
	 *            Clob value
	 * @return Clob
	 * @throws SQLException
	 */
	public static Clob setClobValue(Connection connection, String value) throws SQLException {
		Clob clob = connection.createClob();
		clob.setString(1, value);

		return clob;
	}

	/**
	 * Set Blob value as bytes
	 *
	 * @param connection
	 *            connection used to create Blob
	 * @param value
	 *            Blob Value
	 * @return Blob
	 * @throws SQLException
	 */
	public static Blob setBlobValue(Connection connection, byte[] value) throws SQLException {
		Blob blob = connection.createBlob();
		blob.setBytes(1, value);

		return blob;
	}

	/**
	 * Execute a select and return an array of TableRow objects
	 *
	 * @param query
	 *            query to execute
	 * @param params
	 *            array of bind variables
	 * @param connection
	 *            database connection
	 * @return TableRow[]
	 * @throws SQLException
	 */
	public static TableRow[] query(String query, Object[] params, Connection connection) throws SQLException {
		QueryRunner run = new QueryRunner();
		return query(run, query, params, connection);
	}

	/**
	 * Execute a select and return an array of TableRow objects
	 *
	 * @param queryRunner
	 *            QueryRunner object
	 * @param query
	 *            query to execute
	 * @param params
	 *            array of bind variables
	 * @param connection
	 *            database connection
	 * @return TableRow[]
	 * @throws SQLException
	 */
	public static TableRow[] query(QueryRunner queryRunner, String query, Object[] params, Connection connection) throws SQLException {
		ResultSetHandler<TableRow[]> handler = new ResultSetHandler<TableRow[]>() { // NOSONAR
			@Override
			public TableRow[] handle(ResultSet rs) throws SQLException {
				if (!rs.next()) {
					DbUtils.closeQuietly(rs);
					return null; // NOSONAR
				}

				ArrayList<TableRow> rows = new ArrayList<>();
				ResultSetMetaData meta = rs.getMetaData();
				int cols = meta.getColumnCount();
				TableRow row;
				do {
					row = new TableRow();
					for (int index = 1; index <= cols; index++) {
						row.add(meta.getColumnLabel(index), DBUtils.getColumnAsObjectSafe(rs, index));
					}
					rows.add(row);
				} while (rs.next());
				DbUtils.closeQuietly(rs);

				return rows.toArray(new TableRow[rows.size()]);
			}
		};

		if (logger.isTraceEnabled()) {
			logger.trace("{}", formatQuery(query, params));
		}
		return queryRunner.query(connection, query, handler, params);
	}

	/**
	 * Execute an insert/update/delete
	 *
	 * @param query
	 *            query to execute
	 * @param params
	 *            array of bind variables
	 * @param connection
	 *            database connection
	 * @return number of rows inserted or updated
	 * @throws SQLException
	 */
	public static int update(String query, Object[] params, Connection connection) throws SQLException {
		QueryRunner run = new QueryRunner();
		return update(run, query, params, connection);
	}

	/**
	 * Execute an insert/update/delete
	 *
	 * @param queryRunner
	 *            QueryRunner object
	 * @param query
	 *            query to execute
	 * @param params
	 *            array of bind variables
	 * @param connection
	 *            database connection
	 * @return number of rows inserted or updated
	 * @throws SQLException
	 */
	public static int update(QueryRunner queryRunner, String query, Object[] params, Connection connection) throws SQLException {
		if (logger.isTraceEnabled()) {
			logger.trace("{}", formatQuery(query, params));
		}
		return queryRunner.update(connection, query, params);
	}

	/**
	 * Return current value of an oracle sequence
	 *
	 * @param sequence
	 *            sequence name
	 * @param connection
	 *            database connection
	 * @return sequence current value for the oracle session
	 * @throws SQLException
	 */
	public static String getSequenceCurrVal(String sequence, Connection connection) throws SQLException {
		return getSequenceCurrVal(new QueryRunner(), sequence, connection);
	}

	/**
	 * Return current value of an oracle sequence
	 *
	 * @param queryRunner
	 *            QueryRunner object
	 * @param sequence
	 *            sequence name
	 * @param connection
	 *            database connection
	 * @return sequence current value for the oracle session
	 * @throws SQLException
	 */
	public static String getSequenceCurrVal(QueryRunner queryRunner, String sequence, Connection connection) throws SQLException {
		String query = "select " + sequence + ".currval as value from dual";
		Object[] rows = query(queryRunner, query, null, connection);
		if (rows != null && rows.length == 1) {
			return ((TableRow) rows[0]).get("value");
		}

		return null;
	}

	/**
	 * Call a stored procedure
	 *
	 * @param storedProcedure
	 *            StoredProcedureImpl object
	 * @param inputValues
	 *            MapSqlParameterSource of couples name <--> value of in/inOut parameters
	 * @param connection
	 *            Database connection. Connection will NOT be closed
	 * @return Map of couples name <--> value of out parameter
	 */
	public static Map<String, Object> callStoredProcedure(StoredProcedureImpl storedProcedure, MapSqlParameterSource inputValues, Connection connection) {
		return callStored(storedProcedure, inputValues, connection, false);
	}

	/**
	 * Call a stored function
	 *
	 * @param storedProcedure
	 *            StoredProcedureImpl object
	 * @param inputValues
	 *            MapSqlParameterSource of couples name <--> value of in/inOut parameters
	 * @param connection
	 *            Database connection. Connection will NOT be closed
	 * @return Map of couples name <--> value of out parameter
	 */
	public static Map<String, Object> callStoredFunction(StoredProcedureImpl storedProcedure, MapSqlParameterSource inputValues, Connection connection) {
		return callStored(storedProcedure, inputValues, connection, true);
	}

	/**
	 * @param storedProcedure
	 *            StoredProcedureImpl object
	 * @param inputValues
	 *            MapSqlParameterSource of couples name <--> value of in/inOut parameters
	 * @param connection
	 *            Database connection. Connection will NOT be closed
	 * @param isFunction
	 *            Set whether this call is for a function
	 * @return Map of couples name <--> value of out parameter
	 */
	private static Map<String, Object> callStored(StoredProcedureImpl storedProcedure, MapSqlParameterSource inputValues, Connection connection, boolean isFunction) {
		storedProcedure.setDataSource(new SingleConnectionDataSource(connection, true));
		storedProcedure.setFunction(isFunction);
		return storedProcedure.execute(inputValues.getValues());
	}

	/**
	 * Safe close a connection
	 *
	 * @param connection
	 *            database connection
	 */
	public static void closeSafe(Connection connection) {
		DbUtils.closeQuietly(connection);
	}

	/**
	 * Safe close a statement
	 *
	 * @param statement
	 *            java statement
	 */
	public static void closeSafe(Statement statement) {
		DbUtils.closeQuietly(statement);
	}

	/**
	 * Safe close a resultset
	 *
	 * @param resultSet
	 *            java resultset
	 */
	public static void closeSafe(ResultSet resultSet) {
		DbUtils.closeQuietly(resultSet);
	}

	/**
	 * Commit and safe close a connection
	 *
	 * @param connection
	 *            database connection
	 */
	public static void commitAndCloseSafe(Connection connection) {
		DbUtils.commitAndCloseQuietly(connection);
	}

	/**
	 * Rollback and safe close a connection
	 *
	 * @param connection
	 *            database connection
	 */
	public static void rollbackAndCloseSafe(Connection connection) {
		DbUtils.rollbackAndCloseQuietly(connection);
	}

	/**
	 * Return a DataSource from a bean implementing javax.sql.DataSource
	 *
	 * @param registry
	 *            Registry object
	 * @param pool
	 *            pool name
	 * @return DataSource or NULL if it could not be found
	 */
	public static DataSource getDataSource(Registry registry, String pool) {
		return registry.lookupByNameAndType(pool, DataSource.class);
	}

	private static String formatQuery(String sql, Object[] params) {
		StringBuilder msg = new StringBuilder();

		msg.append("Query: ");
		msg.append(sql);
		msg.append(" Parameters: ");

		if (params == null) {
			msg.append("[]");
		} else {
			msg.append(Arrays.deepToString(params));
		}

		return msg.toString();
	}
}
