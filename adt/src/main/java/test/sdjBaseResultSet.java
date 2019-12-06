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
package test;

import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URL;
import java.sql.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Hashtable;
import java.util.Map;

public abstract class sdjBaseResultSet<V> implements ResultSet
{
	private int 						posizione 	= -1;
	private boolean						set_valore  = false; // Flag per capire se ho trovato o no la colonna!
	private SQLWarning					warning		= null;
	private V							valore		= null;
	ArrayList<Hashtable<String, V>> 	dati 		= null;
	ResultSetMetaData 					meta		= null;

	protected V getValueMyData(String name) throws SQLException
	{
		this.valore = null;
		this.set_valore = false;

		if(this.dati != null && this.posizione > -1 && this.posizione < this.dati.size())
			if(this.dati.get(this.posizione).containsKey(name))
			{
		   		this.valore = this.dati.get(this.posizione).get(name);
				this.set_valore = true;
			}
			else
				throw new SQLException("Nome colonna non valido");
		else
			throw new SQLException("Posizione del cursore non valido (EOF) o dati non impostati");

		return this.valore;
	}

	protected V getValueMyData(int i) throws SQLException
	{
		if(meta != null)
			return this.getValueMyData(meta.getColumnName(i));
		else
			throw new SQLException("Metadata non definito");
	}
	
	public boolean next() throws SQLException
	{
		if(this.dati != null)
		{
			this.posizione++;
		
			return this.posizione < this.dati.size();
		}
		return false;
	}

	public void close() throws SQLException
	{
		this.posizione = -1;
		this.dati = null;
		this.meta = null;
	}

	public boolean wasNull() throws SQLException
	{
		if(this.set_valore)
			return valore == null;
		else
			throw new SQLException("Nessuna colonna selezionata");
	}

	public String getString(int i) throws SQLException
	{
		return this.getValueMyData(i).toString();
	}

	public boolean getBoolean(int i) throws SQLException
	{
		return Boolean.valueOf(this.getValueMyData(i).toString());
	}

	public byte getByte(int i) throws SQLException
	{
		return Byte.valueOf(this.getValueMyData(i).toString());
	}

	public short getShort(int i) throws SQLException
	{
		return Short.valueOf(this.getValueMyData(i).toString());
	}

	public int getInt(int i) throws SQLException
	{
		return Integer.valueOf(this.getValueMyData(i).toString());
	}

	public long getLong(int i) throws SQLException
	{
		return Long.getLong(this.getValueMyData(i).toString());
	}

	public float getFloat(int i) throws SQLException
	{
		return Float.valueOf(this.getValueMyData(i).toString());
	}

	public double getDouble(int i) throws SQLException
	{
		return Double.valueOf(this.getValueMyData(i).toString());
	}

	public BigDecimal getBigDecimal(int i, int i1) throws SQLException
	{
		return null;
	}

	public byte[] getBytes(int i) throws SQLException
	{
		return null;
	}

	public Date getDate(int i) throws SQLException
	{
		return Date.valueOf(this.getValueMyData(i).toString());
	}

	public Time getTime(int i) throws SQLException
	{
		return Time.valueOf(this.getValueMyData(i).toString());
	}

	public Timestamp getTimestamp(int i) throws SQLException
	{
		return Timestamp.valueOf(this.getValueMyData(i).toString());
	}

	public InputStream getAsciiStream(int i) throws SQLException
	{
		return null;
	}

	public InputStream getUnicodeStream(int i) throws SQLException
	{
		return null;
	}

	public InputStream getBinaryStream(int i) throws SQLException
	{
		return null;
	}

	public String getString(String s) throws SQLException
	{
		return this.getValueMyData(s).toString();
	}

	public boolean getBoolean(String s) throws SQLException
	{
		return Boolean.valueOf(this.getValueMyData(s).toString());
	}

	public byte getByte(String s) throws SQLException
	{
		return Byte.valueOf(this.getValueMyData(s).toString());
	}

	public short getShort(String s) throws SQLException
	{
		return Short.valueOf(this.getValueMyData(s).toString());
	}

	public int getInt(String s) throws SQLException
	{
		return Integer.valueOf(this.getValueMyData(s).toString());
	}

	public long getLong(String s) throws SQLException
	{
		return Long.valueOf(this.getValueMyData(s).toString());
	}

	public float getFloat(String s) throws SQLException
	{
		return Float.valueOf(this.getValueMyData(s).toString());
	}

	public double getDouble(String s) throws SQLException
	{
		return Double.valueOf(this.getValueMyData(s).toString());
	}

	public BigDecimal getBigDecimal(String s, int i) throws SQLException
	{
		return null;
	}

	public byte[] getBytes(String s) throws SQLException
	{
		return null;
	}

	public Date getDate(String s) throws SQLException
	{
		return Date.valueOf(this.getValueMyData(s).toString());
	}

	public Time getTime(String s) throws SQLException
	{
		return Time.valueOf(this.getValueMyData(s).toString());
	}

	public Timestamp getTimestamp(String s) throws SQLException
	{
		return Timestamp.valueOf(this.getValueMyData(s).toString());
	}

	public InputStream getAsciiStream(String s) throws SQLException
	{
		return null;
	}

	public InputStream getUnicodeStream(String s) throws SQLException
	{
		return null;
	}

	public InputStream getBinaryStream(String s) throws SQLException
	{
		return null;
	}

	public SQLWarning getWarnings() throws SQLException
	{
		return this.warning;
	}

	public void clearWarnings() throws SQLException
	{
		this.warning = null;
	}

	public String getCursorName() throws SQLException
	{
		return null;
	}

	public ResultSetMetaData getMetaData() throws SQLException
	{
		return this.meta;
	}

	public Object getObject(int i) throws SQLException
	{
		return this.getValueMyData(i);
	}

	public Object getObject(String s) throws SQLException
	{
		return this.getValueMyData(s);
	}

	public int findColumn(String s) throws SQLException
	{
		int ret = 0;
		
		if(this.meta != null && s != null)
			for(int i = 1; i <= this.meta.getColumnCount() && ret > 0; i++)
				if(s.equalsIgnoreCase(this.meta.getColumnName(i)))
					ret = i;
		else
			throw new SQLException("MetaData non settato");
		
		return ret;
	}

	public Reader getCharacterStream(int i) throws SQLException
	{
		return null;
	}

	public Reader getCharacterStream(String s) throws SQLException
	{
		return null;
	}

	public BigDecimal getBigDecimal(int i) throws SQLException
	{
		return null;
	}

	public BigDecimal getBigDecimal(String s) throws SQLException
	{
		return null;
	}

	public boolean isBeforeFirst() throws SQLException
	{
		if(this.dati != null)
			return this.posizione == -1;
		else
			throw new SQLException("Dati non impostati");
	}

	public boolean isAfterLast() throws SQLException
	{
		if(this.dati != null)
			return this.posizione >= this.dati.size();
		else
		    throw new SQLException("Dati non impostati");
	}

	public boolean isFirst() throws SQLException
	{
		if(this.dati != null)
			return this.posizione == 0;
		else
			throw new SQLException("Dati non impostati");
	}

	public boolean isLast() throws SQLException
	{
		if(this.dati != null)
			return this.posizione == (this.dati.size() - 1);
		else
			throw new SQLException("Dati non impostati"); 
	}

	public void beforeFirst() throws SQLException
	{
		if(this.dati != null)
			this.posizione = -1;
		else
			throw new SQLException("Dati non impostati");
	}

	public void afterLast() throws SQLException
	{
		if(this.dati != null)
			this.posizione = this.dati.size() + 1;
		else
			throw new SQLException("Dati non impostati");
	}

	public boolean first() throws SQLException
	{
		if(this.dati != null)
			return this.posizione == 0;
		else
			throw new SQLException("Dati non impostati");
	}

	public boolean last() throws SQLException
	{
		if(this.dati != null)
			return this.posizione == this.dati.size() - 1;
		else
			throw new SQLException("Dati non impostati");
	}

	public int getRow() throws SQLException
	{
		if(this.dati != null)
			return this.dati.size() + 1;
		else
			throw new SQLException("Dati non impostati");
	}

	public boolean absolute(int i) throws SQLException
	{
		return false;
	}

	public boolean relative(int i) throws SQLException
	{
		return false;
	}

	public boolean previous() throws SQLException
	{
		if(this.dati != null)
			return --this.posizione >= 0;
		else
			throw new SQLException("Dati non impostati");
	}

	public void setFetchDirection(int i) throws SQLException
	{
	}

	public int getFetchDirection() throws SQLException
	{
		return 0;
	}

	public void setFetchSize(int i) throws SQLException
	{
	}

	public int getFetchSize() throws SQLException
	{
		return 0;
	}

	public int getType() throws SQLException
	{
		return 0;
	}

	public int getConcurrency() throws SQLException
	{
		return 0;
	}

	public boolean rowUpdated() throws SQLException
	{
		return false;
	}

	public boolean rowInserted() throws SQLException
	{
		return false;
	}

	public boolean rowDeleted() throws SQLException
	{
		return false;
	}

	public void updateNull(int i) throws SQLException
	{
	}

	public void updateBoolean(int i, boolean b) throws SQLException
	{
	}

	public void updateByte(int i, byte b) throws SQLException
	{
	}

	public void updateShort(int i, short i1) throws SQLException
	{
	}

	public void updateInt(int i, int i1) throws SQLException
	{
	}

	public void updateLong(int i, long l) throws SQLException
	{
	}

	public void updateFloat(int i, float v) throws SQLException
	{
	}

	public void updateDouble(int i, double v) throws SQLException
	{
	}

	public void updateBigDecimal(int i, BigDecimal bigDecimal) throws SQLException
	{
	}

	public void updateString(int i, String s) throws SQLException
	{
	}

	public void updateBytes(int i, byte[] bytes) throws SQLException
	{
	}

	public void updateDate(int i, Date date) throws SQLException
	{
	}

	public void updateTime(int i, Time time) throws SQLException
	{
	}

	public void updateTimestamp(int i, Timestamp timestamp) throws SQLException
	{
	}

	public void updateAsciiStream(int i, InputStream inputStream, int i1) throws SQLException
	{
	}

	public void updateBinaryStream(int i, InputStream inputStream, int i1) throws SQLException
	{
	}

	public void updateCharacterStream(int i, Reader reader, int i1) throws SQLException
	{
	}

	public void updateObject(int i, Object o, int i1) throws SQLException
	{
	}

	public void updateObject(int i, Object o) throws SQLException
	{
	}

	public void updateNull(String s) throws SQLException
	{
	}

	public void updateBoolean(String s, boolean b) throws SQLException
	{
	}

	public void updateByte(String s, byte b) throws SQLException
	{
	}

	public void updateShort(String s, short i) throws SQLException
	{
	}

	public void updateInt(String s, int i) throws SQLException
	{
	}

	public void updateLong(String s, long l) throws SQLException
	{
	}

	public void updateFloat(String s, float v) throws SQLException
	{
	}

	public void updateDouble(String s, double v) throws SQLException
	{
	}

	public void updateBigDecimal(String s, BigDecimal bigDecimal) throws SQLException
	{
	}

	public void updateString(String s, String s1) throws SQLException
	{
	}

	public void updateBytes(String s, byte[] bytes) throws SQLException
	{
	}

	public void updateDate(String s, Date date) throws SQLException
	{
	}

	public void updateTime(String s, Time time) throws SQLException
	{
	}

	public void updateTimestamp(String s, Timestamp timestamp) throws SQLException
	{
	}

	public void updateAsciiStream(String s, InputStream inputStream, int i) throws SQLException
	{
	}

	public void updateBinaryStream(String s, InputStream inputStream, int i) throws SQLException
	{
	}

	public void updateCharacterStream(String s, Reader reader, int i) throws SQLException
	{
	}

	public void updateObject(String s, Object o, int i) throws SQLException
	{
	}

	public void updateObject(String s, Object o) throws SQLException
	{
	}

	public void insertRow() throws SQLException
	{
	}

	public void updateRow() throws SQLException
	{
	}

	public void deleteRow() throws SQLException
	{
	}

	public void refreshRow() throws SQLException
	{
	}

	public void cancelRowUpdates() throws SQLException
	{
	}

	public void moveToInsertRow() throws SQLException
	{
	}

	public void moveToCurrentRow() throws SQLException
	{
	}

	public Statement getStatement() throws SQLException
	{
		return null;
	}

	public Object getObject(int i, Map<String, Class<?>> stringClassMap) throws SQLException
	{
		return null;
	}

	public Ref getRef(int i) throws SQLException
	{
		return null;
	}

	public Blob getBlob(int i) throws SQLException
	{
		return null;
	}

	public Clob getClob(int i) throws SQLException
	{
		return null;
	}

	public Array getArray(int i) throws SQLException
	{
		return null;
	}

	public Object getObject(String s, Map<String, Class<?>> stringClassMap) throws SQLException
	{
		return null;
	}

	public Ref getRef(String s) throws SQLException
	{
		return null;
	}

	public Blob getBlob(String s) throws SQLException
	{
		return null;
	}

	public Clob getClob(String s) throws SQLException
	{
		return null;
	}

	public Array getArray(String s) throws SQLException
	{
		return null;
	}

	public Date getDate(int i, Calendar calendar) throws SQLException
	{
		return null;
	}

	public Date getDate(String s, Calendar calendar) throws SQLException
	{
		return null;
	}

	public Time getTime(int i, Calendar calendar) throws SQLException
	{
		return null;
	}

	public Time getTime(String s, Calendar calendar) throws SQLException
	{
		return null;
	}

	public Timestamp getTimestamp(int i, Calendar calendar) throws SQLException
	{
		return null;
	}

	public Timestamp getTimestamp(String s, Calendar calendar) throws SQLException
	{
		return null;
	}

	public URL getURL(int i) throws SQLException
	{
		return null;
	}

	public URL getURL(String s) throws SQLException
	{
		return null;
	}

	public void updateRef(int i, Ref ref) throws SQLException
	{
	}

	public void updateRef(String s, Ref ref) throws SQLException
	{
	}

	public void updateBlob(int i, Blob blob) throws SQLException
	{
	}

	public void updateBlob(String s, Blob blob) throws SQLException
	{
	}

	public void updateClob(int i, Clob clob) throws SQLException
	{
	}

	public void updateClob(String s, Clob clob) throws SQLException
	{
	}

	public void updateArray(int i, Array array) throws SQLException
	{
	}

	public void updateArray(String s, Array array) throws SQLException
	{
	}

	public RowId getRowId(int i) throws SQLException
	{
		return null;
	}

	public RowId getRowId(String s) throws SQLException
	{
		return null;
	}

	public void updateRowId(int i, RowId rowId) throws SQLException
	{
	}

	public void updateRowId(String s, RowId rowId) throws SQLException
	{
	}

	public int getHoldability() throws SQLException
	{
		return 0;
	}

	public boolean isClosed() throws SQLException
	{
		return this.dati == null;
	}

	public void updateNString(int i, String s) throws SQLException
	{
	}

	public void updateNString(String s, String s1) throws SQLException
	{
	}

	public void updateNClob(int i, NClob nClob) throws SQLException
	{
	}

	public void updateNClob(String s, NClob nClob) throws SQLException
	{
	}

	public NClob getNClob(int i) throws SQLException
	{
		return null;
	}

	public NClob getNClob(String s) throws SQLException
	{
		return null;
	}

	public SQLXML getSQLXML(int i) throws SQLException
	{
		return null;
	}

	public SQLXML getSQLXML(String s) throws SQLException
	{
		return null;
	}

	public void updateSQLXML(int i, SQLXML sqlxml) throws SQLException
	{
	}

	public void updateSQLXML(String s, SQLXML sqlxml) throws SQLException
	{
	}

	public String getNString(int i) throws SQLException
	{
		return this.getValueMyData(i).toString();
	}

	public String getNString(String s) throws SQLException
	{
		return this.getValueMyData(s).toString();
	}

	public Reader getNCharacterStream(int i) throws SQLException
	{
		return null;
	}

	public Reader getNCharacterStream(String s) throws SQLException
	{
		return null;
	}

	public void updateNCharacterStream(int i, Reader reader, long l) throws SQLException
	{
	}

	public void updateNCharacterStream(String s, Reader reader, long l) throws SQLException
	{
	}

	public void updateAsciiStream(int i, InputStream inputStream, long l) throws SQLException
	{
	}

	public void updateBinaryStream(int i, InputStream inputStream, long l) throws SQLException
	{
	}

	public void updateCharacterStream(int i, Reader reader, long l) throws SQLException
	{
	}

	public void updateAsciiStream(String s, InputStream inputStream, long l) throws SQLException
	{
	}

	public void updateBinaryStream(String s, InputStream inputStream, long l) throws SQLException
	{
	}

	public void updateCharacterStream(String s, Reader reader, long l) throws SQLException
	{
	}

	public void updateBlob(int i, InputStream inputStream, long l) throws SQLException
	{
	}

	public void updateBlob(String s, InputStream inputStream, long l) throws SQLException
	{
	}

	public void updateClob(int i, Reader reader, long l) throws SQLException
	{
	}

	public void updateClob(String s, Reader reader, long l) throws SQLException
	{
	}

	public void updateNClob(int i, Reader reader, long l) throws SQLException
	{
	}

	public void updateNClob(String s, Reader reader, long l) throws SQLException
	{
	}

	public void updateNCharacterStream(int i, Reader reader) throws SQLException
	{
	}

	public void updateNCharacterStream(String s, Reader reader) throws SQLException
	{
	}

	public void updateAsciiStream(int i, InputStream inputStream) throws SQLException
	{
	}

	public void updateBinaryStream(int i, InputStream inputStream) throws SQLException
	{
	}

	public void updateCharacterStream(int i, Reader reader) throws SQLException
	{
	}

	public void updateAsciiStream(String s, InputStream inputStream) throws SQLException
	{
	}

	public void updateBinaryStream(String s, InputStream inputStream) throws SQLException
	{
	}

	public void updateCharacterStream(String s, Reader reader) throws SQLException
	{
	}

	public void updateBlob(int i, InputStream inputStream) throws SQLException
	{
	}

	public void updateBlob(String s, InputStream inputStream) throws SQLException
	{
	}

	public void updateClob(int i, Reader reader) throws SQLException
	{
	}

	public void updateClob(String s, Reader reader) throws SQLException
	{
	}

	public void updateNClob(int i, Reader reader) throws SQLException
	{
	}

	public void updateNClob(String s, Reader reader) throws SQLException
	{
	}

	public <T> T getObject(int i, Class<T> tClass) throws SQLException
	{
		return null;
	}

	public <T> T getObject(String s, Class<T> tClass) throws SQLException
	{
		return null;
	}

	public <T> T unwrap(Class<T> tClass) throws SQLException
	{
		return null;
	}

	public boolean isWrapperFor(Class<?> aClass) throws SQLException
	{
		return false;
	}
}
