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
package elco.middleware.jdbc.xml;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Iterator;

import org.apache.commons.dbutils.DbUtils;
import org.xml.sax.ContentHandler;
import org.xml.sax.DTDHandler;
import org.xml.sax.EntityResolver;
import org.xml.sax.ErrorHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXNotRecognizedException;
import org.xml.sax.SAXNotSupportedException;
import org.xml.sax.XMLReader;

import elco.insc.DBUtils;

/**
 * @author Roberto Rizzo
 */
public final class JDBCSAXParser implements XMLReader {

	private SAXHandler contentHandler;
	private String mainTag;
	private String rowTag;
	private boolean includeEmptyValues = true;
	private boolean addRowTag = true;

	public String getDocumentString() {
		return contentHandler.getDocument();
	}

	public byte[] getDocumentBytes() {
		return getDocumentString().getBytes();
	}

	/**
	 * ByteArrayInputStream
	 *
	 * @return InputStream
	 */
	public InputStream getDocumentInputStream() {
		return new ByteArrayInputStream(getDocumentBytes());
	}

	public void setIncludeEmptyValues(boolean includeEmptyValues) {
		this.includeEmptyValues = includeEmptyValues;
	}

	public boolean getIncludeEmptyValues() {
		return includeEmptyValues;
	}

	public void setAddRowTag(boolean addRowTag) {
		this.addRowTag = addRowTag;
	}

	public boolean getAddRowTag() {
		return addRowTag;
	}

	@Override
	public void parse(InputSource source) throws SAXException {
		if (!(source instanceof JDBCInputSource)) {
			throw new SAXException("JDBCSAXParser can work only with source of JDBCInputSource type");
		}
		parse((JDBCInputSource) source);
	}

	@Override
	public void parse(String systemId) throws SAXException {
		throw new SAXException("JDBCSAXParser needs more information to connect to database");
	}

	private void statementSetVariables(BindVariable bVar, PreparedStatement pstmt, int position) throws SQLException {
		if (bVar.getType() == Types.VARCHAR) {
			pstmt.setString(position, bVar.getValue());
		} else if (bVar.getType() == Types.INTEGER) {
			pstmt.setInt(position, Integer.parseInt(bVar.getValue()));
		} else if (bVar.getType() == Types.FLOAT) {
			pstmt.setFloat(position, Float.parseFloat(bVar.getValue()));
		} else if (bVar.getType() == Types.DOUBLE) {
			pstmt.setDouble(position, Double.parseDouble(bVar.getValue()));
		} else if (bVar.getType() == Types.BOOLEAN) {
			pstmt.setBoolean(position, Boolean.parseBoolean(bVar.getValue()));
		}
	}

	protected void parse(JDBCInputSource source) throws SAXException {
		PreparedStatement pstmt = null;
		try {
			Connection connection = source.getConnection();
			if (connection == null) {
				throw new SAXException("Could not establish connection with database");
			}

			mainTag = source.getMainTag();
			rowTag = source.getRowTag();

			pstmt = connection.prepareStatement(source.getQuery());

			Iterator<BindVariable> bvi = source.getBindVariables().iterator();
			int index = 1;
			while (bvi.hasNext()) {
				statementSetVariables(bvi.next(), pstmt, index++);
			}

			parse(pstmt.executeQuery());
		} catch (Exception ex) {
			throw new SAXException(ex);
		} finally {
			DbUtils.closeQuietly(pstmt);
		}
	}

	protected void parse(ResultSet rs) throws SAXException, SQLException {
		if (contentHandler == null) {
			contentHandler = new SAXHandler();
		}

		ResultSetMetaData rsmd = rs.getMetaData();
		int numCols = rsmd.getColumnCount();

		contentHandler.startDocument();
		contentHandler.startElement("", "", mainTag, null);
		while (rs.next()) {
			if (addRowTag) {
				contentHandler.startElement("", "", rowTag, null);
			}
			for (int i = 1; i <= numCols; i++) {
				generateSAXEventForColumn(rsmd, rs, i);
			}
			if (addRowTag) {
				contentHandler.endElement("", "", rowTag);
			}
		}
		contentHandler.endElement("", "", mainTag);
		contentHandler.endDocument();
	}

	protected void generateSAXEventForColumn(ResultSetMetaData rsmd, ResultSet rs, int columnIndex) throws SAXException, SQLException {
		String columnValue;
		if (rsmd.getColumnType(columnIndex) == Types.CLOB) {
			columnValue = DBUtils.getClobValueQuietly(rs, columnIndex);
		} else {
			columnValue = rs.getString(columnIndex) == null ? "" : rs.getString(columnIndex);
		}
		if (!includeEmptyValues && columnValue.length() <= 0) { // se il valore è vuoto e non devono essere inclusi ugualmente, proseguo
			return;
		}

		String columnMarker = getColumnMarker(rsmd.getColumnLabel(columnIndex)).trim().toUpperCase();
		char[] columnValueChars = columnValue.toCharArray();
		contentHandler.startElement("", "", columnMarker, null);
		contentHandler.characters(columnValueChars, 0, columnValueChars.length);
		contentHandler.endElement("", "", columnMarker);
	}

	protected String getColumnMarker(String columnName) {
		return columnName;
	}

	@Override
	public ContentHandler getContentHandler() {
		return contentHandler;
	}

	@Override
	public DTDHandler getDTDHandler() {
		return null;
	}

	@Override
	public EntityResolver getEntityResolver() {
		return null;
	}

	@Override
	public ErrorHandler getErrorHandler() {
		return null;
	}

	@Override
	public boolean getFeature(String arg0) throws SAXNotRecognizedException, SAXNotSupportedException {
		return false;
	}

	@Override
	public Object getProperty(String arg0) throws SAXNotRecognizedException, SAXNotSupportedException {
		return null;
	}

	@Override
	public void setDTDHandler(DTDHandler arg0) {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void setEntityResolver(EntityResolver arg0) {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void setErrorHandler(ErrorHandler arg0) {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void setFeature(String arg0, boolean arg1) throws SAXNotRecognizedException, SAXNotSupportedException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void setProperty(String arg0, Object arg1) throws SAXNotRecognizedException, SAXNotSupportedException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void setContentHandler(ContentHandler handler) {
		// TODO Auto-generated method stub // NOSONAR
	}
}
