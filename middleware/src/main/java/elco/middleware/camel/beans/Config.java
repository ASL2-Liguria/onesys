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

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import elco.exceptions.NoValueException;

/**
 * Config management bean
 *
 * <pre>
 * {@code
 * <bean id="id1" class="elco.middleware.camel.beans.Config">
 * <property name="parameters">
 * 	<map>
 * 		<entry key="key1" value="value1"/>
 * 		<entry key="key2" value="value2"/>
 * 	</map>
 * </property>
 * </bean>
 * }
 * </pre>
 *
 * @author Roberto Rizzo
 */
public final class Config {

	private Map<String, String> parameters = null;

	/**
	 * Set HashMap of parameters
	 *
	 * @param parameters
	 *            HashMap
	 */
	public void setParameters(Map<String, String> parameters) {
		this.parameters = parameters;
	}

	/**
	 * Return value as String
	 *
	 * @param key
	 *            Parameter
	 * @return value
	 * @throws NoValueException
	 */
	public String getString(String key) throws NoValueException {
		return getValue(key);
	}

	/**
	 * Return value as String. NULL if no value is found
	 *
	 * @param key
	 *            Parameter
	 * @return value
	 */
	public String getStringQuietly(String key) {
		String value = null;
		try {
			value = getString(key);
		} catch (Exception ex) { // NOSONAR
			value = null;
		}

		return value;
	}

	/**
	 * Return value as integer
	 *
	 * @param key
	 *            Parameter
	 * @return value
	 * @throws NoValueException
	 */
	public int getInt(String key) throws NoValueException {
		return Integer.parseInt(getString(key));
	}

	/**
	 * Return value as boolean
	 *
	 * @param key
	 *            Parameter
	 * @return value
	 * @throws NoValueException
	 */
	public boolean getBoolean(String key) throws NoValueException {
		return Boolean.parseBoolean(getString(key));
	}

	/**
	 * Return value as float
	 *
	 * @param key
	 *            Parameter
	 * @return value
	 * @throws NoValueException
	 */
	public float getFloat(String key) throws NoValueException {
		return Float.parseFloat(getString(key));
	}

	/**
	 * Return an array of keys
	 *
	 * @return Array of Object
	 */
	public Object[] getKeys() {
		return parameters.keySet().toArray();
	}

	/**
	 * Return an array of keys
	 *
	 * @return Array of String
	 */
	public String[] getKeysAsString() {
		Set<String> keys = parameters.keySet();
		return keys.toArray(new String[keys.size()]);
	}

	/**
	 * Return an array of values
	 *
	 * @return Array of Object
	 */
	public Object[] getValues() {
		return parameters.values().toArray();
	}

	/**
	 * Return an array of values
	 *
	 * @return Array of String
	 */
	public String[] getValuesAsString() {
		Collection<String> values = parameters.values();
		return values.toArray(new String[values.size()]);
	}

	private String getValue(String key) throws NoValueException {
		String value = parameters.get(key);

		if (value == null) {
			throw new NoValueException("No value for the key: " + key);
		}

		return value;
	}
}
