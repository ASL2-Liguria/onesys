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

import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

public abstract class sdjBaseMetaReultset<V> implements ResultSetMetaData
{
	private Hashtable<String, V> 	modello = null;
	private ArrayList<String>		elenco	= null;
	
	public sdjBaseMetaReultset(Hashtable<String, V> dato)
	{
		this.modello = dato;
		
		if(dato != null)
		{
			Enumeration<String> key_elenco = dato.keys();

			this.elenco = new ArrayList<String>();

			while(key_elenco.hasMoreElements())
			{
				String id  = key_elenco.nextElement();

				this.elenco.add(id);
			}
		}
	}

	public int getColumnCount() throws SQLException
	{
		if(this.modello != null && this.elenco != null)
			return this.elenco.size();
		else
			throw new SQLException("Set meta non valorizzato");
	}

	public boolean isAutoIncrement(int i) throws SQLException
	{
		return false;
	}

	public boolean isCaseSensitive(int i) throws SQLException
	{
		return false;
	}

	public boolean isSearchable(int i) throws SQLException
	{
		return false;
	}

	public boolean isCurrency(int i) throws SQLException
	{
		return false;
	}

	public int isNullable(int i) throws SQLException
	{
		return -1;
	}

	public boolean isSigned(int i) throws SQLException
	{
		return false;
	}

	public int getColumnDisplaySize(int i) throws SQLException
	{
		return -1;
	}

	public String getColumnLabel(int i) throws SQLException
	{
		return null;
	}

	public String getColumnName(int i) throws SQLException
	{
		if(this.modello != null && this.elenco != null && i >= 0 && i < this.elenco.size())
			return this.elenco.get(i);
		else
			throw new SQLException("Set meta non valorizzato o indice non valido");
	}

	public String getSchemaName(int i) throws SQLException
	{
		return null;
	}

	public int getPrecision(int i) throws SQLException
	{
		return -1;
	}

	public int getScale(int i) throws SQLException
	{
		return -1;
	}

	public String getTableName(int i) throws SQLException
	{
		return null;
	}

	public String getCatalogName(int i) throws SQLException
	{
		return null;
	}

	public int getColumnType(int i) throws SQLException
	{
		return -1;
	}

	public String getColumnTypeName(int i) throws SQLException
	{
		return null;
	}

	public boolean isReadOnly(int i) throws SQLException
	{
		return false;
	}

	public boolean isWritable(int i) throws SQLException
	{
		return false;
	}

	public boolean isDefinitelyWritable(int i) throws SQLException
	{
		return false;
	}

	public String getColumnClassName(int i) throws SQLException
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
