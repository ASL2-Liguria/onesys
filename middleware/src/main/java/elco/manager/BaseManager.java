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
package elco.manager;

import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import javax.management.MBeanServer;
import javax.management.ObjectName;

import org.apache.camel.CamelContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.Constants;
import elco.middleware.camel.beans.DBManagement;

/**
 * @author Roberto Rizzo
 */
abstract class BaseManager {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	protected MBeanServer server = Constants.getPlatformMBeanServer();

	protected int getContextErrors(String contextName) {
		int errors = 0;

		try {
			errors = Integer.parseInt(getContextAttribute(contextName, "ExchangesFailed")) + Integer.parseInt(getContextAttribute(contextName, "FailuresHandled"));
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return errors;
	}

	protected DBManagement getDBManagementInternalDB(CamelContext context) throws SQLException {
		return DBManagement.getDBManagement(context.getRegistry(), Constants.INTERNALDBPOOLNAME);
	}

	protected String getContextAttribute(String contextName, String attribute) {
		String query = "org.apache.camel:type=context,name=\"" + contextName + "\",*";

		return getBeanAttribute(query, attribute);
	}

	protected String getBeanAttribute(String query, String attribute) {
		try {
			ObjectName objectInfoName = getObjectName(query, null);
			if (objectInfoName != null) {
				Object attributeValue = server.getAttribute(objectInfoName, attribute);
				if (attributeValue != null) {
					return Class.forName(attributeValue.getClass().getName()).cast(attributeValue).toString();
				}
			}
		} catch (Exception ex) {
			logger.info("getBeanAttribute", ex); // a log level greater than info try to log on db
		}

		return "";
	}

	protected void setContextAttribute(String contextName, String attribute, Object value) {
		String query = "org.apache.camel:type=context,name=\"" + contextName + "\",*";

		setBeanAttribute(query, attribute, value);
	}

	protected void setRouteAttribute(String contextName, String routeId, String attribute, Object value) {
		String query = "org.apache.camel:context=*" + contextName + ",type=routes,name=\"" + routeId + "\",*";

		setBeanAttribute(query, attribute, value);
	}

	protected void setBeanAttribute(String query, String attribute, Object value) {
		try {
			ObjectName objectInfoName = getObjectName(query, null);
			if (objectInfoName != null) {
				javax.management.Attribute attr = new javax.management.Attribute(attribute, value);
				server.setAttribute(objectInfoName, attr);
			}
		} catch (Exception ex) {
			logger.info("setBeanAttribute", ex); // a log level greater than info try to log on db
		}
	}

	protected String getRouteAttribute(String contextName, String routeId, String attribute) {
		String query = "org.apache.camel:context=*" + contextName + ",type=routes,name=\"" + routeId + "\",*";

		return getBeanAttribute(query, attribute);
	}

	protected ObjectName getObjectName(String query, String prefix) {
		ObjectName objectInfoName = null;

		try {
			ObjectName objName = new ObjectName(query);
			List<ObjectName> objsList = new LinkedList<>(server.queryNames(objName, null));
			if (!objsList.isEmpty()) {
				objName = objsList.get(0);
				String keyProps = objName.getCanonicalKeyPropertyListString();
				if (prefix == null) {
					objectInfoName = new ObjectName("org.apache.camel:" + keyProps);
				} else {
					objectInfoName = new ObjectName(prefix + keyProps);
				}
			}
		} catch (Exception ex) {
			logger.info("getObjectName", ex); // a log level greater than info try to log on db
		}

		return objectInfoName;
	}

	protected int getRouteErrors(String contextName, String routeId) {
		int errors = 0;

		try {
			errors = Integer.parseInt(getRouteAttribute(contextName, routeId, "ExchangesFailed")) + Integer.parseInt(getRouteAttribute(contextName, routeId, "FailuresHandled"));
		} catch (Exception ex) {
			logger.info("getRouteErrors", ex); // a log level greater than info try to log on db
		}

		return errors;
	}
}
