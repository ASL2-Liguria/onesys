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
package generic.utility.html;

import generic.statements.StatementFromFile;
import imago.http.classHeadHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpSession;

import com.rits.cloning.Cloner;

import core.cache.CacheTabExtFiles;

/**
 *
 * @author matteo.steccolini
 */
public class HeaderUtils {
	
	public static classHeadHtmlObject createHeadWithIncludes(String servletName, HttpSession session) throws SQLException, SqlQueryException, Exception {
		return createHeadWithIncludes(servletName, session, "getTabExtFiles");
	}
	
	public static classHeadHtmlObject createHeadWithIncludesNoDefault(String servletName, HttpSession session) throws SQLException, SqlQueryException, Exception {
		return createHeadWithIncludes(servletName, session, "getTabExtFilesNoDefault");
	}
	
	private static classHeadHtmlObject createHeadWithIncludes(String servletName, HttpSession session, String query) throws SQLException, SqlQueryException, Exception {
		Cloner cloner = new Cloner();

		classHeadHtmlObject cHead = (classHeadHtmlObject) CacheTabExtFiles.getObject(servletName);
		if (cHead == null) {
			cHead = new classHeadHtmlObject();
			StatementFromFile sff = null;
			ResultSet rs = null;
			try {
				sff = new StatementFromFile(session);
				rs = sff.executeQuery("configurazioni.xml", query,new String[]{servletName});
				while (rs.next()) {
					if (rs.getString("PATH_FILE").substring(rs.getString("PATH_FILE").length() - 2, rs.getString("PATH_FILE").length()).equals("js"))
						cHead.addJSLink(CacheTabExtFiles.addTimestamp(rs.getString("PATH_FILE")));
					else
						cHead.addCssLink(CacheTabExtFiles.addTimestamp(rs.getString("PATH_FILE")));
				}
				CacheTabExtFiles.setObject(servletName, cHead);
			} finally {
				try {rs.close();} catch (Exception e){new ElcoLoggerImpl(servletName).error(e);};
				try {sff.close();} catch (Exception e){new ElcoLoggerImpl(servletName).error(e);};
			}
		}

		return cloner.deepClone(cHead);

//		return cHead;
	}
}
