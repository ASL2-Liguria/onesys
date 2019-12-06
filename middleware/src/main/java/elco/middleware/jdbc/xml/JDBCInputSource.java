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

import java.sql.Connection;
import java.util.List;

import org.xml.sax.InputSource;

/**
 * @author Roberto Rizzo
 */
public final class JDBCInputSource extends InputSource {

	private final String		query;
	private final Connection	connection;
	private List<BindVariable>	bindVariables;
	private String				maintag	= "";
	private String				rowtag	= "ROW";

	public JDBCInputSource(Connection connection, String query) {
		super(String.valueOf(System.currentTimeMillis()));
		this.query = query;
		this.connection = connection;
	}

	public String getQuery() {
		return query;
	}

	public Connection getConnection() {
		return connection;
	}

	public void setBindVariables(List<BindVariable> bindVariables) {
		this.bindVariables = bindVariables;
	}

	public List<BindVariable> getBindVariables() {
		return bindVariables;
	}

	public void setMainTag(String maintag) {
		this.maintag = maintag;
	}

	public String getMainTag() {
		return maintag;
	}

	public void setRowTag(String rowtag) {
		this.rowtag = rowtag;
	}

	public String getRowTag() {
		return rowtag;
	}
}
