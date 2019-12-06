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

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import com.rits.cloning.Cloner;

import elco.insc.B64;

/**
 * Bean representing a row. Used in DBManagment bean
 *
 * @author Roberto Rizzo
 */
public final class TableRow {

	private final Map<String, Object> columns = new HashMap<>();

	/**
	 * Add a couple column/value
	 *
	 * @param name
	 *            column name
	 * @param value
	 *            column value
	 */
	public void add(String name, Object value) {
		columns.put(name.toUpperCase(), value);
	}

	/**
	 * Return a DATE column as a String formatted using 'SimpleDateFormat' patterns
	 *
	 * @param name
	 *            column name
	 * @param format
	 *            'SimpleDateFormat' patterns
	 * @return formatted String representing the date or an empty String in case of errors
	 */
	public String getDate(String name, String format) {
		Object value = getColumnValue(name);
		return convertDateToString(value, format);
	}

	/**
	 * Return the value of the column as String. The column value is considered as a String
	 *
	 * @param name
	 *            column name
	 * @return column value or NULL
	 */
	public String get(String name) {
		Object value = getColumnValue(name);
		if (value == null) {
			return null;
		}
		return value.toString();
	}

	/**
	 * Return the value of the column as int
	 *
	 * @param name
	 *            column name
	 * @return column value or Integer.MIN_VALUE if column is NULL
	 */
	public int getInteger(String name) {
		Object value = getColumnValue(name);
		if (value == null) {
			return Integer.MIN_VALUE;
		}
		return Integer.parseInt(value.toString());
	}

	/**
	 * Return the value of the column as float
	 *
	 * @param name
	 *            column name
	 * @return column value or Float.MIN_VALUE if column is NULL
	 */
	public float getFloat(String name) {
		Object value = getColumnValue(name);
		if (value == null) {
			return Float.MIN_VALUE;
		}
		return Float.parseFloat(value.toString());
	}

	/**
	 * Return the value of the column as byte[]. The column value is considered as a byte[]
	 *
	 * @param name
	 *            column name
	 * @return column value or NULL
	 */
	public byte[] getBytes(String name) {
		Object value = getColumnValue(name);
		return byte[].class.cast(value);
	}

	/**
	 * Return the value of the column as byte[]. If it is a base64 encoded column, it'll be decoded before return value. The column value is considered as a byte[]
	 *
	 * @deprecated use getBytesBase64(String name)
	 * @param name
	 *            column name
	 * @return column value or NULL
	 */
	@Deprecated
	public byte[] getBytes64(String name) {
		byte[] value = getBytes(name);
		if (value == null) {
			return value;
		}
		return decode64(value);
	}

	/**
	 * Return the value of the column as byte[] base64 decoded. The column value is considered as a byte[]
	 *
	 * @param name
	 *            column name
	 * @return column value or NULL
	 */
	public byte[] getBytesBase64(String name) {
		byte[] value = getBytes(name);
		if (value == null) {
			return value;
		}
		return B64.decodeB64(value);
	}

	/**
	 * Return the value of the column as String. If it is a base64 encoded column, it'll be decoded before return value. The column value is considered as a String
	 *
	 * @deprecated use getStringBase64(String name)
	 * @param name
	 *            column name
	 * @return column value or NULL
	 */
	@Deprecated
	public String getString64(String name) {
		String value = get(name);
		if (value == null) {
			return null;
		}
		return decode64(value);
	}

	/**
	 * Return the value of the column as String base64 decoded. The column value is considered as a String
	 *
	 * @param name
	 *            column name
	 * @return column value or NULL
	 */
	public String getStringBase64(String name) {
		String value = get(name);
		if (value == null) {
			return null;
		}
		return new String(B64.decodeB64(value));
	}

	/**
	 * Return a DATE column as a String formatted using 'SimpleDateFormat' patterns
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @param format
	 *            'SimpleDateFormat' patterns
	 * @return formatted String representing the date or an empty String in case of errors
	 */
	public String getDate(int position, String format) {
		Object value = getColumnValue(position);
		return convertDateToString(value, format);
	}

	/**
	 * Return the value of the column as String. The column value is considered as a String
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column value
	 */
	public String get(int position) {
		Object value = getColumnValue(position);
		if (value == null) {
			return null;
		}
		return value.toString();
	}

	/**
	 * Return the value of the column as int
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column value or Integer.MIN_VALUE if column is NULL
	 */
	public int getInteger(int position) {
		Object value = getColumnValue(position);
		if (value == null) {
			return Integer.MIN_VALUE;
		}
		return Integer.parseInt(value.toString());
	}

	/**
	 * Return the value of the column as float
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column value or Float.MIN_VALUE if column is NULL
	 */
	public float getFloat(int position) {
		Object value = getColumnValue(position);
		if (value == null) {
			return Float.MIN_VALUE;
		}
		return Float.parseFloat(value.toString());
	}

	/**
	 * Return the value of the column as byte[]. The column value is considered as a byte[]
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column value or NULL
	 */
	public byte[] getBytes(int position) {
		Object value = getColumnValue(position);
		return byte[].class.cast(value);
	}

	/**
	 * Return the value of the column as byte[]. If it is a base64 encoded column, it'll be decoded before return value. The column value is considered as a byte[]
	 *
	 * @deprecated use getBytesBase64(int position)
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column value or NULL
	 * @throws IndexOutOfBoundsException
	 */
	@Deprecated
	public byte[] getBytes64(int position) {
		byte[] value = getBytes(position);
		if (value == null) {
			return value;
		}
		return decode64(value);
	}

	/**
	 * Return the value of the column as byte[] base64 decoded. The column value is considered as a byte[]
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column value or NULL
	 * @throws IndexOutOfBoundsException
	 */
	public byte[] getBytesBase64(int position) {
		byte[] value = getBytes(position);
		if (value == null) {
			return value;
		}
		return B64.decodeB64(value);
	}

	/**
	 * Return the value of the column as String. If it is a base64 encoded column, it'll be decoded before return value. The column value is considered as a String
	 *
	 * @deprecated use getStringBase64(int position)
	 * @param position
	 *            column position
	 * @return column value or NULL
	 */
	@Deprecated
	public String getString64(int position) {
		String value = get(position);
		if (value == null) {
			return value;
		}
		return decode64(value);
	}

	/**
	 * Return the value of the column as String base64 decoded. The column value is considered as a String
	 *
	 * @param position
	 *            column position
	 * @return column value or NULL
	 */
	public String getStringBase64(int position) {
		String value = get(position);
		if (value == null) {
			return value;
		}
		return new String(B64.decodeB64(value));
	}

	/**
	 * Return an array of values
	 *
	 * @return array of values
	 */
	public Object[] values() {
		return columns.values().toArray();
	}

	/**
	 * Return an array of column names
	 *
	 * @return array of columns names
	 */
	public Object[] names() {
		return columns.keySet().toArray();
	}

	/**
	 * Return the name of a column
	 *
	 * @param position
	 *            column position >= 1 && <= columns number
	 * @return column name
	 */
	public Object name(int position) {
		if (position < 1) {
			throw new IndexOutOfBoundsException();
		}
		Object[] names = names();
		if (position > names.length) {
			throw new IndexOutOfBoundsException();
		}

		return names[position - 1];
	}

	/**
	 * Return the number of columns
	 *
	 * @return columns number
	 */
	public int getColumns() {
		return columns.size();
	}

	/**
	 * Return a deep clone of the internal HashMap<String, Object> representing the row
	 *
	 * @return object as Map<String, Object>
	 */
	public Map<String, Object> getAsMap() {
		Cloner cloner = new Cloner();

		return cloner.deepClone(columns);
	}

	private String convertDateToString(Object value, String format) {
		String converted = "";

		try {
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			converted = sdf.format(value);
		} catch (Exception ex) { // NOSONAR
			converted = "";
		}

		return converted;
	}

	@Deprecated
	private String decode64(String value) {
		if (B64.isB64(value)) {
			return new String(B64.decodeB64(value));
		}
		return value;
	}

	@Deprecated
	private byte[] decode64(byte[] value) {
		if (B64.isB64(value)) {
			return B64.decodeB64(value);
		}
		return value;
	}

	private Object getColumnValue(String name) {
		return columns.get(name.toUpperCase());
	}

	private Object getColumnValue(int position) {
		if (position < 1) {
			throw new IndexOutOfBoundsException();
		}
		Object[] values = values();
		if (position > values.length) {
			throw new IndexOutOfBoundsException();
		}

		return values[position - 1];
	}
}
