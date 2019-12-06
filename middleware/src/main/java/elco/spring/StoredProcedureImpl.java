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
package elco.spring;

import org.springframework.jdbc.core.SqlParameter;

/**
 * The inherited sql property is the name of the stored procedure in the RDBMS.
 *
 * @author Roberto Rizzo
 */
public final class StoredProcedureImpl extends org.springframework.jdbc.object.StoredProcedure {

	/**
	 * Stored procedure or function name and parameters must be set using class's functions
	 */
	public StoredProcedureImpl() {
		super();
	}

	/**
	 * Parameters must be set using class's functions
	 *
	 * @param name
	 *            Stored procedure or function name
	 */
	public StoredProcedureImpl(String name) {
		this();
		setSql(name);
	}

	/**
	 * Stored procedure or function name and parameters can be set using this constructor<br>
	 * <font color='blue'><b><br> SqlParameter[] parameters = { new SqlParameter("P_IN", Types.INTEGER), new SqlParameter("PIN_CLOB", Types.CLOB), new SqlOutParameter("POUT_CLOB",
	 * Types.CLOB)};</b></font>
	 *
	 * @param name
	 *            Stored procedure or function name
	 * @param parameters
	 *            Parameters declaration. <font color='red'><b>The order of the parameters is paramount</b></font>
	 */
	public StoredProcedureImpl(String name, SqlParameter[] parameters) {
		this(name);
		setParameters(parameters);
	}
}
