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

import org.apache.camel.Exchange;
import org.apache.camel.ExchangeProperty;
import org.apache.camel.Handler;
import org.apache.camel.Header;
import org.xml.sax.SAXException;

/**
 * @author Roberto Rizzo
 */
public final class JDBCXml {

	private boolean	jxIncludeEmptyValues	= true;
	private boolean	jxAddRowTag				= true;

	public void setJxIncludeEmptyValues(boolean jxIncludeEmptyValues) {
		this.jxIncludeEmptyValues = jxIncludeEmptyValues;
	}

	public boolean getJxIncludeEmptyValues() {
		return this.jxIncludeEmptyValues;
	}

	public void setJxAddRowTag(boolean jxAddRowTag) {
		this.jxAddRowTag = jxAddRowTag;
	}

	public boolean getJxAddRowTag() {
		return this.jxAddRowTag;
	}

	@Handler
	public String parse(Exchange exchange, @ExchangeProperty("jxBindVariables") List<BindVariable> bvList, @Header("dataSource") String dataSource,
			@Header("jxQuery") String query, @Header("jxMainTag") String mainTag, @Header("jxRowTag") String rowTag) throws SAXException {
		JDBCInputSource inputSource = new JDBCInputSource((Connection) exchange.getProperty(dataSource), query);
		inputSource.setBindVariables(bvList);
		inputSource.setMainTag(mainTag);
		inputSource.setRowTag(rowTag);

		JDBCSAXParser saxParser = new JDBCSAXParser();
		saxParser.setIncludeEmptyValues(jxIncludeEmptyValues);
		saxParser.setAddRowTag(jxAddRowTag);
		saxParser.parse(inputSource);

		return saxParser.getDocumentString();
	}
}
