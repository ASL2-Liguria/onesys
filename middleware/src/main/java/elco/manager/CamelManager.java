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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.security.GeneralSecurityException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import javax.jms.Destination;
import javax.jms.QueueBrowser;
import javax.jms.QueueSession;
import javax.jms.Topic;
import javax.jms.TopicSession;
import javax.jms.TopicSubscriber;
import javax.management.JMX;
import javax.management.MBeanServerInvocationHandler;
import javax.management.ObjectName;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.broker.jmx.BrokerViewMBean;
import org.apache.activemq.broker.jmx.DurableSubscriptionViewMBean;
import org.apache.activemq.broker.jmx.QueueViewMBean;
import org.apache.activemq.broker.jmx.TopicViewMBean;
import org.apache.activemq.command.ActiveMQMessage;
import org.apache.activemq.command.ActiveMQQueue;
import org.apache.activemq.command.ActiveMQTextMessage;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.ExchangeProperty;
import org.apache.camel.Handler;
import org.apache.camel.Header;
import org.apache.camel.ServiceStatus;
import org.apache.camel.api.management.mbean.ManagedRouteMBean;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.model.ModelCamelContext;
import org.apache.camel.util.CastUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.SystemUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.xerces.dom.AttrNSImpl;
import org.apache.xerces.dom.ElementNSImpl;
import org.eclipse.jetty.util.MultiPartInputStreamParser;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.DescriptiveResource;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import elco.CamelMain;
import elco.dicom.utils.IOUtils;
import elco.exceptions.LambdaRuntimeException;
import elco.exceptions.ManagerException;
import elco.exceptions.XMLException;
import elco.insc.B64;
import elco.insc.Camel;
import elco.insc.Constants;
import elco.insc.DigestUtils;
import elco.insc.FileNameUtils;
import elco.insc.GenericUtils;
import elco.insc.HTTP;
import elco.insc.LogbackUtils;
import elco.insc.XML;
import elco.middleware.camel.beans.DBManagement;
import elco.middleware.camel.beans.TableRow;
import elco.middleware.camel.beans.XMLDocument;

/**
 * <p>
 * Camel Manager. HTTP protocol REST paradigm
 * </p>
 *
 * @author Roberto Rizzo
 */
public final class CamelManager extends BaseManager {

	private static final String STRUE = "1";
	private static final String SFALSE = "0";
	private static final String NEGATIVERESPONSE = "<RESPONSE><STATUS>0</STATUS><INFO>_</INFO></RESPONSE>";
	private static final String POSITIVERESPONSE = "<RESPONSE><STATUS>1</STATUS><INFO>_</INFO></RESPONSE>";
	private final AtomicReference<DBManagement> ardbm = new AtomicReference<>(null);
	private static final String QUEUECOLONREPLACESTRING = "_REPLACECOLON_";
	private static final String UNKNOWN = "UNKNOWN";
	private static final String ACTIVEMQNOTSTARTED = "<BROKER><NAME>ActiveMQ not started</NAME><TOPIC/></BROKER>";
	private static final String CONTEXTDIRFILESBCKEXTENSION = "bck";

	private enum CommandList {
		LISTCONTEXTDIRECTORY, SAVECONTEXTPROPERTIES, GETCONTEXTPROPERTIES, SAVECONTEXTBEANS, GETCONTEXTBEANS, ADDCONTEXT, WEBCONSOLE, ERROR, TREE, CONTEXTSTART, CONTEXTSTOP, CONTEXTCLRESET, CONTEXTERRORS, CONTEXTATTRIBUTES, ROUTESTART, ROUTESTOP, ROUTEERRORS, ROUTEXML, ROUTEADD, ROUTEREMOVE, ROUTERESET, ROUTEATTRIBUTES, SETLOGLEVEL, GETINFOS, GETROUTELOGS, GETROUTELOGCONTENT, GETDBLOGS, GETSCRIPTSLIST, GETSCRIPTCONTENT, GETINTEGRATIONERRORS, GETCONTEXTLOGS, GETCONTEXTLOGCONTENT, GETCONTEXTDBLOGS, ACKNOWLEDGE, ACKNOWLEDGEALL, ACTIVEMQQUEUE, ACTIVEMQQUEUESLIST, ACTIVEMQQUEUEREMOVE, ACTIVEMQBROKERDELETEMESSAGES, ACTIVEMQTOPIC, ACTIVEMQTOPICREMOVE, ACTIVEMQTOPICSLIST, ACTIVEMQADDSUBCRIBER, ACTIVEMQQUEUEREMOVEMESSAGE, ACTIVEMQADDTOPIC, ACTIVEMQREMOVESUBSCRIBER, SCRIPTUPLOAD
	}

	@Handler
	public final Object handler(Exchange exchange, CamelContext localContext, @Header(value = "callback") String callback, @Header(value = "CamelHttpUri") String camelHttpUri, // NOSONAR
			@Header(value = "context") String context, @Header(value = "route") String route, @Header(value = "spring") String spring,
			@Header(value = "responseType") String responseType, @Header(value = "logger") String loggerName, @Header(value = "level") String logLevel,
			@Header(value = "key") String key, @Header(value = "fileName") String fileName, @Header(value = "queue") String queueName, @Header(value = "topic") String topicName,
			@Header(value = "clientId") String clientId, @Header(value = "selector") String selector, @Header(value = "durableSubscriptionId") String durableSubscriptionId,
			@Header(value = "messageID") String messageID, @ExchangeProperty(value = "contextsList") List<CamelContext> contextsList) throws SQLException {
		if ("enabled".equalsIgnoreCase(Constants.ENABLEINTERNALDB) && ardbm.get() == null) {
			ardbm.compareAndSet(null, getDBManagementInternalDB(localContext));
		}

		// download file from context's directory
		if (camelHttpUri.contains("/manager/downloadContextFile/")) {
			try { // NOSONAR
				String filePath = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + camelHttpUri.replace("/manager/downloadContextFile/", "");

				verifyRequest(key);
				HttpServletResponse httpResponse = HTTP.getHttpServletResponse(exchange);
				OutputStream os = httpResponse.getOutputStream();
				httpResponse.setHeader("Set-Cookie", "fileDownload=true; path=/");
				httpResponse.setHeader("Content-Disposition", "attachment; filename=" + StringUtils.substringAfterLast(filePath, "/")); // NOSONAR
				InputStream is = new FileInputStream(filePath);
				IOUtils.safeCopy(is, os); // streams will be safe closed in the function
			} catch (Exception ex) {
				logger.error("", ex);
			}

			return null;
		} else if (camelHttpUri.contains("/manager/removeContextFile")) {
			try {
				String filePath = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + StringUtils.substringAfterLast(camelHttpUri, "filePath=/");
				String originalExtension = FileNameUtils.getExtension(filePath);
				String newPath = StringUtils.substringBeforeLast(filePath, ".") + "_" + originalExtension + "_" + GenericUtils.formatDate(new Date(), "yyyyMMddHHmmss") + "." // NOSONAR
						+ CONTEXTDIRFILESBCKEXTENSION;
				FileUtils.moveFile(new File(filePath), new File(newPath));
			} catch (IOException ex) {
				logger.error("", ex);
			}
		} else if (camelHttpUri.contains("/manager/uploadContextFile")) {
			String updateResponse = "<RESPONSE><INFO>_</INFO><STATUS>" + STRUE + "</STATUS><DESCRIPTION>Upload terminated successfully</DESCRIPTION></RESPONSE>";

			try { // NOSONAR
				HTTP.enableCrossDomain(exchange);
				HttpServletRequest request = HTTP.getHttpServletRequest(exchange);

				Object object = request.getAttribute("org.eclipse.jetty.servlet.MultiPartFile.multiPartInputStream");
				if (object != null && object instanceof MultiPartInputStreamParser) {
					MultiPartInputStreamParser parser = (MultiPartInputStreamParser) object;

					String contextName = exchange.getIn().getHeader("contextName", String.class);
					String filePath = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + contextName + File.separator;

					Part part = parser.getPart("selectedFile");
					filePath += part.getSubmittedFileName();

					if (elco.insc.FileUtils.exists(filePath)) { // NOSONAR
						String originalExtension = FileNameUtils.getExtension(filePath);
						String newPath = StringUtils.substringBeforeLast(filePath, ".") + "_" + originalExtension + "_" + GenericUtils.formatDate(new Date(), "yyyyMMddHHmmss")
								+ "." + CONTEXTDIRFILESBCKEXTENSION;
						FileUtils.moveFile(new File(filePath), new File(newPath));
					}

					InputStream inputStream = part.getInputStream();
					OutputStream outputStream = new FileOutputStream(filePath);
					IOUtils.safeCopy(inputStream, outputStream); // streams will be safe closed in the function
				}
			} catch (Exception ex) {
				logger.error("", ex);
				updateResponse = "<RESPONSE><INFO>_</INFO><STATUS>" + SFALSE + "</STATUS><DESCRIPTION>Upload terminated with errors</DESCRIPTION></RESPONSE>";
			}

			return XML.xml2json(updateResponse);
		}

		Object response = NEGATIVERESPONSE;
		try {
			String endPath = camelHttpUri.substring(camelHttpUri.lastIndexOf('/') + 1).toUpperCase();
			CommandList command = CommandList.valueOf(endPath);

			HttpServletRequest httpRequest = HTTP.getHttpServletRequest(exchange);
			HttpServletResponse httpResponse = HTTP.enableCrossDomain(exchange);
			HTTP.disableClientCache(httpRequest, httpResponse);

			MainSpring mainSpring = null;
			switch (command) { // NOSONAR
			case LISTCONTEXTDIRECTORY:
				verifyRequest(key);
				String directory = exchange.getIn().getHeader("dir", String.class);
				response = listContextDirectory(directory);
				break;
			case SAVECONTEXTBEANS:
				verifyRequest(key);
				mainSpring = (MainSpring) exchange.getProperty("MAINSPRING"); // NOSONAR
				response = saveContextBeans(context, spring, mainSpring);
				break;
			case GETCONTEXTBEANS:
				verifyRequest(key);
				response = getContextBeans(context);
				break;
			case SAVECONTEXTPROPERTIES:
				verifyRequest(key);
				response = saveContextProperties(context, spring, contextsList);
				break;
			case GETCONTEXTPROPERTIES:
				verifyRequest(key);
				response = getContextProperties(context);
				break;
			case ADDCONTEXT: // NOSONAR
				verifyRequest(key);
				mainSpring = (MainSpring) exchange.getProperty("MAINSPRING");
				if (!mainSpring.existContext(context)) {
					DefaultCamelContext newContext = new DefaultCamelContext(localContext.getRegistry());
					newContext.setName(context);
					mainSpring.configureContext(newContext);
					newContext.start();
					mainSpring.addContext(newContext);
				}

				response = POSITIVERESPONSE;
				break;
			case ACKNOWLEDGEALL:
				verifyRequest(key);
				response = acknowledgeAll(context, route);
				break;
			case ACKNOWLEDGE:
				verifyRequest(key);
				response = acknowledge(exchange.getIn().getHeader("id", String.class), exchange.getIn().getHeader("value", String.class).toUpperCase());
				break;
			case WEBCONSOLE:
				verifyRequest(key);
				httpResponse.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
				httpResponse.setHeader("Location", getDBWebServerSessionURL());
				break;
			case TREE:
				verifyRequest(key);
				response = tree(localContext, contextsList);
				break;
			case CONTEXTSTART:
				verifyRequest(key);
				mainSpring = (MainSpring) exchange.getProperty("MAINSPRING");
				response = contextStart(context, contextsList, mainSpring.getApplicationContext().getClassLoader());
				break;
			case CONTEXTSTOP:
				verifyRequest(key);
				response = contextSuspend(context, contextsList);
				break;
			case CONTEXTCLRESET:
				verifyRequest(key);
				mainSpring = (MainSpring) exchange.getProperty("MAINSPRING");
				response = contextCLReset(context, contextsList, mainSpring.getApplicationContext().getClassLoader());
				break;
			case CONTEXTERRORS:
				response = String.valueOf(getContextErrors(context) + getContextDBErrors(context));
				break;
			case CONTEXTATTRIBUTES:
				verifyRequest(key);
				response = contextAttributes(context, contextsList);
				break;
			case ROUTESTART:
				verifyRequest(key);
				response = routeStart(context, route, contextsList);
				break;
			case ROUTESTOP:
				verifyRequest(key);
				response = routeStop(context, route, contextsList);
				break;
			case ROUTEERRORS: // NOSONAR
				response = String.valueOf(getRouteErrors(context, route) + getRouteDBErrors(context, route));
				break;
			case ROUTEXML:
				verifyRequest(key);
				response = routeDumpAsXml(context, route);
				break;
			case ROUTEADD:
				verifyRequest(key);
				response = routeAdd(context, route, spring, contextsList);
				break;
			case ROUTEREMOVE:
				verifyRequest(key);
				response = routeRemove(context, route, contextsList);
				break;
			case ROUTERESET:
				verifyRequest(key);
				response = routeReset(context, route);
				break;
			case ROUTEATTRIBUTES:
				verifyRequest(key);
				response = routeAttributes(context, route, contextsList);
				break;
			case SETLOGLEVEL:
				verifyRequest(key);
				response = setLoggersLevel(loggerName, logLevel);
				break;
			case GETINFOS:
				verifyRequest(key);
				response = getInfos();
				break;
			case GETROUTELOGS:
				verifyRequest(key);
				response = getRouteLogs(context, route);
				break;
			case GETROUTELOGCONTENT: // NOSONAR
				verifyRequest(key);
				response = getRouteLogContent(context, route, fileName);
				httpResponse.setContentType("application/octet-stream");
				httpResponse.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
				httpResponse.setHeader("Content-Transfer-Encoding", "binary");
				break;
			case GETCONTEXTLOGS:
				verifyRequest(key);
				response = getContextLogs(context);
				break;
			case GETCONTEXTLOGCONTENT: // NOSONAR
				verifyRequest(key);
				response = getContextLogContent(context, fileName);
				httpResponse.setContentType("application/octet-stream");
				httpResponse.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
				httpResponse.setHeader("Content-Transfer-Encoding", "binary");
				break;
			case GETDBLOGS:
				verifyRequest(key);
				response = getRouteDBLogs(context, route);
				break;
			case GETCONTEXTDBLOGS:
				verifyRequest(key);
				response = getContextDBLogs(context);
				break;
			case GETSCRIPTSLIST:
				verifyRequest(key);
				response = getScriptsList(context);
				break;
			case GETSCRIPTCONTENT:
				verifyRequest(key);
				response = getScriptContent(fileName, context);
				break;
			case SCRIPTUPLOAD:
				verifyRequest(key);
				String contentB64 = (String) exchange.getIn().removeHeader("contentB64");
				response = saveScriptContent(fileName, context, contentB64);
				break;
			case GETINTEGRATIONERRORS: // monitoring
				response = "<html><body>[" + getRouteErrors(context, route) + getRouteDBErrors(context, route) + "]</body></html>";
				break;
			case ACTIVEMQQUEUESLIST:
				verifyRequest(key);
				response = activemqQueuesList();
				break;
			case ACTIVEMQQUEUE:
				verifyRequest(key);
				response = activemqQueue(queueName);
				break;
			case ACTIVEMQQUEUEREMOVE:
				verifyRequest(key);
				response = activemqQueueDelete(queueName);
				break;
			case ACTIVEMQBROKERDELETEMESSAGES:
				verifyRequest(key);
				response = activemqBrokerDeleteMessages();
				break;
			case ACTIVEMQTOPICSLIST:
				verifyRequest(key);
				response = activemqTopicsList();
				break;
			case ACTIVEMQTOPICREMOVE:
				verifyRequest(key);
				response = activemqTopicDelete(topicName);
				break;
			case ACTIVEMQTOPIC:
				verifyRequest(key);
				response = activemqTopic(topicName);
				break;
			case ACTIVEMQADDTOPIC:
			case ACTIVEMQADDSUBCRIBER:
				verifyRequest(key);
				response = activemqAddTopicSubcriber(topicName, clientId, selector, durableSubscriptionId);
				break;
			case ACTIVEMQQUEUEREMOVEMESSAGE:
				verifyRequest(key);
				response = activemqQueueRemoveMessage(queueName, messageID);
				break;
			case ACTIVEMQREMOVESUBSCRIBER:
				verifyRequest(key);
				response = activemqRemoveSubcriber(clientId, durableSubscriptionId);
				break;
			default:
				response = NEGATIVERESPONSE;
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}

		exchange.getIn().removeHeaders("*");

		if ("json".equalsIgnoreCase(responseType)) {
			if (callback != null) {
				return HTTP.xml2JsonCrossDomain(callback, (String) response);
			}

			return XML.xml2json((String) response);
		}

		return response;
	}

	private String listContextDirectory(String contextDirectory) {
		String response = "<ul class='jqueryFileTree' style='display: none;'>";

		try {
			String path = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + contextDirectory;
			Collection<File> files = FileUtils.listFiles(new File(path), null, false);
			for (File file : files) {
				String fileName = file.getName();
				String extension = FileNameUtils.getExtension(fileName);
				if (!CONTEXTDIRFILESBCKEXTENSION.equalsIgnoreCase(extension)) {
					response += "<li class='file ext_" + extension + "'>";
					response += "<a href='#' class='menu' rel='/" + contextDirectory + "/" + fileName + "'>" + fileName + "</a>";
					response += "</li>";
				}
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
		response += "</ul>";

		return response;
	}

	private String saveContextBeans(String context, String springBeans, MainSpring mainSpring) {
		String status = NEGATIVERESPONSE;
		int nbeans = 0;
		String errorMessage = "";

		try {
			String beansDir = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context + File.separator + "beans";
			elco.insc.FileUtils.mkDirQuietly(beansDir);

			String beansDefinition = new String(B64.decodeB64(springBeans)).trim();
			String beanDefinitionsToAdd = beansDefinition;
			if (!StringUtils.startsWithIgnoreCase(beansDefinition, "<beans")) { // NOSONAR
				beanDefinitionsToAdd = "<beans xmlns=\"http://www.springframework.org/schema/beans\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:util=\"http://ww.springframework.org/schema/util\" xmlns:context=\"http://www.springframework.org/schema/context\" xsi:schemaLocation=\"http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://camel.apache.org/schema/spring http://camel.apache.org/schema/spring/camel-spring.xsd http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd\">"
						+ beansDefinition + "</beans>";
			}

			GenericApplicationContext gac = (GenericApplicationContext) mainSpring.getApplicationContext();
			String xmlBeans = XML.removeXmlStringDefaultNamespace(beanDefinitionsToAdd);
			XMLDocument beansDoc = XML.getDocument(xmlBeans);
			List<?> beansList = beansDoc.getNodeList("//*/@id");
			beansList.forEach(attrs -> {
				String idValue = ((AttrNSImpl) attrs).getNodeValue();
				Camel.removeBeanDefinitionQuietly(gac, idValue);
				logger.info("Removed definition for bean {}", idValue);
			});
			XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(gac);
			nbeans = reader.registerBeanDefinitions(beansDoc.getDocument(), new DescriptiveResource("Loaded by CamelManager class"));
			logger.info("Loaded {} beans for Context {}", nbeans, context);
			CamelMain.setACClassLoader(gac.getBeanFactory());

			logger.info("Reload routes for Context {}", context);
			String contextsDir = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context;
			String routesDir = elco.insc.FileUtils.verifyPath(contextsDir) + "routes";
			if (elco.insc.FileUtils.exists(routesDir)) { // NOSONAR
				Iterator<File> it = elco.insc.FileUtils.iterateFiles(routesDir, false, "xml");
				it.forEachRemaining(file -> {
					try { // NOSONAR
						String routeDefinition = elco.insc.FileUtils.loadString(file.getAbsolutePath()).trim();
						if (!StringUtils.startsWithIgnoreCase(routeDefinition, "<routes")) { // NOSONAR
							routeDefinition = "<routes xmlns=\"http://camel.apache.org/schema/spring\">" + routeDefinition + "</routes>";
						}
						CamelContext contextObject = gac.getBean(context, CamelContext.class);
						String routeID = Camel.addRoute(contextObject, routeDefinition, true);
						logger.info("Route {}.{} added/updated", contextObject.getName(), routeID);
					} catch (Exception ex) {
						String message = ExceptionUtils.getMessage(ex);
						message = StringUtils.substringBetween(message, "for bean with name '", "' defined");
						if (StringUtils.isNotEmpty(message)) {
							Camel.removeBeanDefinitionQuietly(gac, message);
						}
						throw new LambdaRuntimeException(ex);
					}
				});
			}

			String newFilePath = elco.insc.FileUtils.verifyPath(beansDir) + "definitions";
			if (elco.insc.FileUtils.exists(newFilePath + ".xml")) {
				elco.insc.FileUtils.copyFile(newFilePath + ".xml", newFilePath + "_" + System.currentTimeMillis() + "." + CONTEXTDIRFILESBCKEXTENSION);
			}
			elco.insc.FileUtils.saveString(newFilePath + ".xml", beansDefinition);
			logger.info("Beans for Context {} saved", context);

			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
			errorMessage = ExceptionUtils.getMessage(ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			responseDoc.addChild(XMLDocument.root, "<CONTEXT>" + context + "</CONTEXT>"); // NOSONAR
			responseDoc.addChild(XMLDocument.root, "<NBEANS>" + nbeans + "</NBEANS>");
			if (errorMessage.length() > 0) {
				responseDoc.addChild(XMLDocument.root, "<ERRORMESSAGE>" + B64.encodeB64String(errorMessage.getBytes()) + "</ERRORMESSAGE>"); // NOSONAR
			}
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String getContextBeans(String context) {
		String status = NEGATIVERESPONSE;
		String result = "";

		try {
			String beansDir = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context + File.separator + "beans";
			String definitionsFile = beansDir + File.separator + "definitions.xml"; // NOSONAR
			if (elco.insc.FileUtils.exists(definitionsFile)) {
				result = elco.insc.FileUtils.loadString(definitionsFile);
			}
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			responseDoc.addChild(XMLDocument.root, "<CONTEXT>" + context + "</CONTEXT>");
			responseDoc.addChild(XMLDocument.root, "<RESULT>" + B64.encodeB64String(result.getBytes()) + "</RESULT>");
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String saveContextProperties(String contextName, String properties, List<CamelContext> contextsList) {
		String status = NEGATIVERESPONSE;
		String errorMessage = "";

		try {
			String propertiesFileDir = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + contextName + File.separator + "properties";
			elco.insc.FileUtils.mkDirQuietly(propertiesFileDir);

			String readProperties = new String(B64.decodeB64(properties)).trim();
			String propertiesDefinition = readProperties;
			if (!StringUtils.startsWithIgnoreCase(propertiesDefinition, "<properties")) {
				propertiesDefinition = "<properties>" + propertiesDefinition + "</properties>";
			}
			XMLDocument doc = XMLDocument.getDocument(propertiesDefinition, Constants.DEFAULT_VM_CHARSET);
			List<ElementNSImpl> propertiesList = CastUtils.cast(doc.getNodeList("//*/property"));
			Map<String, String> contextProperties = new HashMap<>();
			propertiesList.forEach(property -> {
				String key = property.getAttributeNode("key").getValue();
				String value = property.getAttributeNode("value").getValue();
				contextProperties.put(key, value);
			});
			if (!contextProperties.isEmpty()) {
				CamelContext context = getContext(contextName, contextsList);
				context.setGlobalOptions(contextProperties);
			}

			elco.insc.FileUtils.saveString(propertiesFileDir + File.separator + "definitions.xml", readProperties);
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
			errorMessage = ExceptionUtils.getMessage(ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			responseDoc.addChild(XMLDocument.root, "<CONTEXT>" + contextName + "</CONTEXT>"); // NOSONAR
			if (errorMessage.length() > 0) {
				responseDoc.addChild(XMLDocument.root, "<ERRORMESSAGE>" + B64.encodeB64String(errorMessage.getBytes()) + "</ERRORMESSAGE>");
			}
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String getContextProperties(String context) {
		String status = NEGATIVERESPONSE;
		String result = "";

		try {
			String propertiesFile = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context + File.separator + "properties" + File.separator
					+ "definitions.xml";
			if (elco.insc.FileUtils.exists(propertiesFile)) { // NOSONAR
				result = elco.insc.FileUtils.loadString(propertiesFile);
			}
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			responseDoc.addChild(XMLDocument.root, "<CONTEXT>" + context + "</CONTEXT>");
			responseDoc.addChild(XMLDocument.root, "<RESULT>" + B64.encodeB64String(result.getBytes()) + "</RESULT>");
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String activemqQueuesList() throws ManagerException {
		String responseString = "";

		try {
			if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
				return "<BROKER><NAME>ActiveMQ not started</NAME><QUEUE/></BROKER>";
			}

			XMLDocument broker = XML.getDocument("<BROKER/>"); // NOSONAR
			XMLDocument queueDoc;
			broker.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(CamelMain.getMiddlewareMain().getBrokerService().getBrokerName()) + "</NAME>"); // NOSONAR
			broker.add(XMLDocument.root, "<UNUSED>UNUSED</UNUSED>"); // NOSONAR

			for (ObjectName obn : CamelMain.getMiddlewareMain().getBrokerService().getAdminView().getQueues()) {
				String name = obn.getKeyProperty("destinationName"); // NOSONAR
				queueDoc = XML.getDocument("<QUEUE/>");
				queueDoc.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(name) + "</NAME>");
				queueDoc.add(XMLDocument.root, "<UNUSED>UNUSED</UNUSED>");
				broker.addChild(XMLDocument.root, queueDoc);
			}

			responseString = broker.toString();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return responseString;
	}

	private String activemqBrokerDeleteMessages() {
		if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
			return "<BROKER><NAME>ActiveMQ not started</NAME></BROKER>"; // NOSONAR
		}

		String response;
		String brokerName = CamelMain.getMiddlewareMain().getBrokerService().getBrokerName();
		try {
			CamelMain.getMiddlewareMain().getBrokerService().deleteAllMessages();
			response = "<BROKER><NAME>" + brokerName + "</NAME><DELETEDMESSAGES>true</DELETEDMESSAGES></BROKER>"; // NOSONAR
		} catch (Exception ex) {
			logger.error("", ex);
			response = "<BROKER><NAME>" + brokerName + "</NAME><DELETEDMESSAGES>false</DELETEDMESSAGES></BROKER>";
		}

		return response;
	}

	private String activemqQueueRemoveMessage(String queue, String messageID) {
		if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
			return "<BROKER><NAME>ActiveMQ not started</NAME></BROKER>";
		}

		String response = NEGATIVERESPONSE;
		try {
			BrokerViewMBean mbean = CamelMain.getMiddlewareMain().getBrokerService().getAdminView();
			for (ObjectName name : mbean.getQueues()) {
				if (name.getKeyProperty("destinationName").equals(queue)) {
					QueueViewMBean queueMbean = MBeanServerInvocationHandler.newProxyInstance(server, name, QueueViewMBean.class, false);
					if (!queueMbean.removeMessage(messageID.replaceAll(QUEUECOLONREPLACESTRING, ":"))) { // NOSONAR
						throw new ManagerException("Failed remove message: " + messageID.replaceAll(QUEUECOLONREPLACESTRING, ":"));
					}
					break;
				}
			}
			response = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
			response = NEGATIVERESPONSE;
		}

		return response;
	}

	private String activemqQueueDelete(String queueName) {
		if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
			return "<BROKER><NAME>ActiveMQ not started</NAME></BROKER>";
		}

		String response;
		String brokerName = CamelMain.getMiddlewareMain().getBrokerService().getBrokerName();
		try {
			CamelMain.getMiddlewareMain().getBrokerService().getAdminView().removeQueue(queueName);
			response = "<BROKER><NAME>" + brokerName + "</NAME><QUEUE>" + queueName + "</QUEUE><DELETED>true</DELETED></BROKER>";
		} catch (Exception ex) {
			logger.error("", ex);
			response = "<BROKER><NAME>" + brokerName + "</NAME><QUEUE>" + queueName + "</QUEUE><DELETED>false</DELETED></BROKER>";
		}

		return response;
	}

	private String activemqQueue(String queueName) throws ManagerException {
		String responseString = "";

		try {
			if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
				return "<BROKER><NAME>ActiveMQ not started</NAME><QUEUE/></BROKER>";
			}

			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(CamelMain.getMiddlewareMain().getBrokerService().getBroker().getVmConnectorURI());
			ActiveMQConnection qc = (ActiveMQConnection) connectionFactory.createConnection();
			qc.start();
			QueueSession qs = qc.createQueueSession(false, QueueSession.AUTO_ACKNOWLEDGE);

			XMLDocument broker = XML.getDocument("<BROKER/>");
			XMLDocument queueDoc;
			XMLDocument messageDoc;
			broker.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(CamelMain.getMiddlewareMain().getBrokerService().getBrokerName()) + "</NAME>");

			queueDoc = XML.getDocument("<QUEUE/>");
			queueDoc.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(queueName) + "</NAME>");

			String message;

			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			QueueBrowser qb = qs.createBrowser(new ActiveMQQueue(queueName));
			Enumeration<?> messagesInQueue = qb.getEnumeration();
			int count = 0;
			while (messagesInQueue.hasMoreElements() && count < 300) {
				ActiveMQMessage queueMessage = (ActiveMQMessage) messagesInQueue.nextElement();

				if (queueMessage instanceof ActiveMQTextMessage) {
					message = ((ActiveMQTextMessage) queueMessage).getText();
				} else {
					message = queueMessage.toString();
				}
				messageDoc = XML.getDocument("<MESSAGE/>");
				messageDoc.add(XMLDocument.root, "<ID>" + StringEscapeUtils.escapeXml11(queueMessage.getJMSMessageID().replaceAll(":", QUEUECOLONREPLACESTRING)) + "</ID>");
				messageDoc.add(XMLDocument.root, "<HEADERS>" + StringEscapeUtils.escapeXml11(queueMessageHeaders(queueMessage)) + "</HEADERS>");
				messageDoc.add(XMLDocument.root, "<TEXT>" + B64.encodeB64String(StringEscapeUtils.escapeXml11(message).getBytes()) + "</TEXT>");
				messageDoc.add(XMLDocument.root, "<TIMESTAMP>" + sdf.format(new Date(queueMessage.getTimestamp())) + "</TIMESTAMP>");
				queueDoc.addChild(XMLDocument.root, messageDoc);
				count++;
			}
			qb.close();
			broker.addChild(XMLDocument.root, queueDoc);

			qs.close();
			qc.stop();
			qc.close();

			responseString = broker.toString();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return responseString;
	}

	private String queueMessageHeaders(ActiveMQMessage queueMessage) {
		StringBuilder headers = new StringBuilder("JMSMessageID: ");
		headers.append(StringUtils.trimToEmpty(queueMessage.getJMSMessageID()));
		headers.append("<br><br>"); // NOSONAR
		headers.append("JMSDestination: ");

		Destination destination = queueMessage.getJMSDestination();
		if (destination != null) {
			headers.append(StringUtils.trimToEmpty(destination.toString()));
		}
		headers.append("<br><br>");
		headers.append("JMSCorrelationID: ");
		headers.append(StringUtils.trimToEmpty(queueMessage.getJMSCorrelationID()));
		headers.append("<br><br>");
		headers.append("JMSReplyTo: ");

		destination = queueMessage.getJMSReplyTo();
		if (destination != null) {
			headers.append(StringUtils.trimToEmpty(destination.toString()));
		}
		headers.append("<br><br>");
		headers.append("JMSType: ");
		headers.append(StringUtils.trimToEmpty(queueMessage.getJMSType()));
		headers.append("<br><br>");
		headers.append("JMSXMimeType: ");
		headers.append(StringUtils.trimToEmpty(queueMessage.getJMSXMimeType()));
		headers.append("<br><br>");
		headers.append("JMSExpiration: ");
		headers.append(StringUtils.trimToEmpty(String.valueOf(queueMessage.getJMSExpiration())));

		return headers.toString();
	}

	private String activemqAddTopicSubcriber(String topicName, String clientId, String selector, String durableSubscriptionId) throws ManagerException {
		try {
			if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
				return ACTIVEMQNOTSTARTED;
			}

			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(CamelMain.getMiddlewareMain().getBrokerService().getBroker().getVmConnectorURI());
			ActiveMQConnection connection = (ActiveMQConnection) connectionFactory.createConnection();
			connection.setClientID(clientId);
			connection.start();
			TopicSession session = connection.createTopicSession(false, QueueSession.CLIENT_ACKNOWLEDGE);
			Topic topic = session.createTopic(topicName); // Return an instance of the topic. Create it if not exists
			TopicSubscriber subscriber;
			if (durableSubscriptionId != null && durableSubscriptionId.trim().length() > 0) {
				if (selector != null && selector.trim().length() > 0) {
					subscriber = session.createDurableSubscriber(topic, durableSubscriptionId, selector, true);
				} else {
					subscriber = session.createDurableSubscriber(topic, durableSubscriptionId);
				}
			} else {
				subscriber = session.createSubscriber(topic);
			}
			subscriber.close();
			session.close();
			connection.stop();
			connection.close();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return POSITIVERESPONSE;
	}

	private String activemqRemoveSubcriber(String clientId, String durableSubscriptionId) throws ManagerException {
		try {
			if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
				return ACTIVEMQNOTSTARTED;
			}

			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(CamelMain.getMiddlewareMain().getBrokerService().getBroker().getVmConnectorURI());
			ActiveMQConnection connection = (ActiveMQConnection) connectionFactory.createConnection();
			connection.setClientID(clientId);
			connection.start();
			TopicSession session = connection.createTopicSession(false, QueueSession.CLIENT_ACKNOWLEDGE);
			try { // NOSONAR
				session.unsubscribe(durableSubscriptionId);
			} catch (Exception ex) {
				logger.warn("", ex);
			}
			session.close();
			connection.stop();
			connection.close();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return POSITIVERESPONSE;
	}

	private String activemqTopicsList() throws ManagerException {
		String responseString = "";

		try {
			if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
				return ACTIVEMQNOTSTARTED;
			}

			XMLDocument broker = XML.getDocument("<BROKER/>");
			XMLDocument topicDoc;
			broker.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(CamelMain.getMiddlewareMain().getBrokerService().getBrokerName()) + "</NAME>");
			broker.add(XMLDocument.root, "<UNUSED>UNUSED</UNUSED>");

			for (ObjectName obn : CamelMain.getMiddlewareMain().getBrokerService().getAdminView().getTopics()) {
				String name = obn.getKeyProperty("destinationName");
				topicDoc = XML.getDocument("<TOPIC/>");
				topicDoc.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(name) + "</NAME>");
				topicDoc.add(XMLDocument.root, "<UNUSED>UNUSED</UNUSED>");
				broker.addChild(XMLDocument.root, topicDoc);
			}

			responseString = broker.toString();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return responseString;
	}

	private String activemqTopicDelete(String topicName) {
		if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
			return "<BROKER><NAME>ActiveMQ not started</NAME></BROKER>";
		}

		String response;
		String brokerName = CamelMain.getMiddlewareMain().getBrokerService().getBrokerName();
		try {
			CamelMain.getMiddlewareMain().getBrokerService().getAdminView().removeTopic(topicName);
			CamelMain.getMiddlewareMain().getBrokerService().getAdminView().getBrokerName();
			response = "<BROKER><NAME>" + brokerName + "</NAME><TOPIC>" + topicName + "</TOPIC><DELETED>true</DELETED></BROKER>";
		} catch (Exception ex) {
			logger.error("", ex);
			response = "<BROKER><NAME>" + brokerName + "</NAME><TOPIC>" + topicName + "</TOPIC><DELETED>false</DELETED></BROKER>";
		}

		return response;
	}

	private String activemqTopic(String topicName) throws ManagerException {
		String responseString = "";

		try {
			if (CamelMain.getMiddlewareMain().getBrokerService() == null) {
				return ACTIVEMQNOTSTARTED;
			}

			String query = "org.apache.activemq:type=Broker,brokerName=" + Constants.internalActiveMQBrokerName + ",destinationType=Topic,destinationName=" + topicName;
			ObjectName objectInfoName = getObjectName(query, "org.apache.activemq:");

			TopicViewMBean tvb = JMX.newMBeanProxy(server, objectInfoName, TopicViewMBean.class, true);

			XMLDocument broker = XML.getDocument("<BROKER/>");
			XMLDocument topicDoc;
			XMLDocument infoDoc;
			broker.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(CamelMain.getMiddlewareMain().getBrokerService().getBrokerName()) + "</NAME>");

			topicDoc = XML.getDocument("<TOPIC/>");
			topicDoc.add(XMLDocument.root, "<NAME>" + StringEscapeUtils.escapeXml11(topicName) + "</NAME>");

			infoDoc = XML.getDocument("<INFO/>"); // NOSONAR
			infoDoc.add(XMLDocument.root, "<NAME>Consumer count</NAME>");
			infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(tvb.getConsumerCount())) + "</VALUE>"); // NOSONAR
			topicDoc.addChild(XMLDocument.root, infoDoc);

			infoDoc = XML.getDocument("<INFO/>");
			infoDoc.add(XMLDocument.root, "<NAME>Enqueue count</NAME>");
			infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(tvb.getEnqueueCount())) + "</VALUE>");
			topicDoc.addChild(XMLDocument.root, infoDoc);

			infoDoc = XML.getDocument("<INFO/>");
			infoDoc.add(XMLDocument.root, "<NAME>Dequeue count</NAME>");
			infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(tvb.getDequeueCount())) + "</VALUE>");
			topicDoc.addChild(XMLDocument.root, infoDoc);

			infoDoc = XML.getDocument("<INFO/>");
			infoDoc.add(XMLDocument.root, "<NAME>Dispatch count</NAME>");
			infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(tvb.getDispatchCount())) + "</VALUE>");
			topicDoc.addChild(XMLDocument.root, infoDoc);

			infoDoc = XML.getDocument("<INFO/>");
			infoDoc.add(XMLDocument.root, "<NAME>InFlight count</NAME>");
			infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(tvb.getInFlightCount())) + "</VALUE>");
			topicDoc.addChild(XMLDocument.root, infoDoc);

			infoDoc = XML.getDocument("<INFO/>");
			infoDoc.add(XMLDocument.root, "<NAME>Expired count</NAME>");
			infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(tvb.getExpiredCount())) + "</VALUE>");
			topicDoc.addChild(XMLDocument.root, infoDoc);

			for (ObjectName obj : tvb.getSubscriptions()) {
				DurableSubscriptionViewMBean dsvb = JMX.newMBeanProxy(server, obj, DurableSubscriptionViewMBean.class, true);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>SUBSCRIBER</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>SUBSCRIBER</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>ClientId</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getClientId())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>Subscription name</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getSubscriptionName())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>Selector</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getSelector() == null ? "" : dsvb.getSelector())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>Consumed count</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getConsumedCount())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>Enqueue counter</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getEnqueueCounter())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>Dequeue counter</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getDequeueCounter())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);

				infoDoc = XML.getDocument("<INFO/>");
				infoDoc.add(XMLDocument.root, "<NAME>Dispatched counter</NAME>");
				infoDoc.add(XMLDocument.root, "<VALUE>" + StringEscapeUtils.escapeXml11(String.valueOf(dsvb.getDispatchedCounter())) + "</VALUE>");
				topicDoc.addChild(XMLDocument.root, infoDoc);
			}

			broker.addChild(XMLDocument.root, topicDoc);
			responseString = broker.toString();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return responseString;
	}

	private String acknowledgeAll(String context, String routeId) {
		String response;

		try {
			String sqllbe;
			String sqllbem;
			List<Object> params = new ArrayList<>();

			params.add(context);
			if (routeId == null) {
				sqllbe = "UPDATE LOGBACK_EVENT set acknowledge='Y' WHERE context=? and route is null and acknowledge='N' and log_level in ('ERROR', 'WARN')";
				sqllbem = "UPDATE LOGBACK_EVENT_MESSAGES set acknowledge='Y' WHERE context=? and route is null and acknowledge='N' and log_level in ('ERROR', 'WARN')";
			} else {
				sqllbe = "UPDATE LOGBACK_EVENT set acknowledge='Y' WHERE context=? and route=? and acknowledge='N' and log_level in ('ERROR', 'WARN')";
				sqllbem = "UPDATE LOGBACK_EVENT_MESSAGES set acknowledge='Y' WHERE context=? and route=? and acknowledge='N' and log_level in ('ERROR', 'WARN')";

				params.add(routeId);
			}
			ardbm.get().update(sqllbe, params.toArray());
			ardbm.get().update(sqllbem, params.toArray());

			response = POSITIVERESPONSE;
		} catch (Exception ex) {
			response = NEGATIVERESPONSE;
			logger.info("", ex); // a log level greater than info try to log on db
		}

		return response;
	}

	private String acknowledge(String rowId, String value) {
		if (!"Y".equals(value) && !"N".equals(value)) {
			return "Error";
		}

		String response = value;

		try {
			List<Object> params = new ArrayList<>();

			String[] rowids = rowId.split("@");
			String sql = "UPDATE " + rowids[0] + " set acknowledge=? WHERE IDEN=?";
			params.add(value);
			params.add(Integer.parseInt(rowids[1]));
			ardbm.get().update(sql, params.toArray());
		} catch (Exception ex) {
			response = "Error";
			logger.info("", ex); // a log level greater than info try to log on db
		}

		return response;
	}

	private String getContextDBLogs(String contextName) {
		String response;

		try {
			List<Object> params = new ArrayList<>();

			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);
			XMLDocument rowsDoc = XML.getDocument("<ROWS/>");
			XMLDocument rowDoc;

			StringBuilder sql = new StringBuilder("select * from (select * from (");
			sql.append(
					"select 'LOGBACK_EVENT' TABLE_NAME, LOG_LEVEL, LOG_MESSAGE, DATE_TIME, ACKNOWLEDGE, IDEN from LOGBACK_EVENT where context = ? and route is null and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate) and log_level in ('ERROR', 'WARN')");
			sql.append(" UNION ALL ");
			sql.append(
					"select 'LOGBACK_EVENT_MESSAGES' TABLE_NAME, LOG_LEVEL, LOG_MESSAGE, DATE_TIME, ACKNOWLEDGE, IDEN from LOGBACK_EVENT_MESSAGES where context = ? and route is null and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate) and log_level in ('ERROR', 'WARN')");
			sql.append(") order by DATE_TIME desc) where rownum < 31");

			params.add(contextName);
			params.add(contextName);
			TableRow[] rows = ardbm.get().selectEA(sql.toString(), params.toArray());
			for (TableRow tr : rows) {
				rowDoc = XML.getDocument("<ROW/>");
				for (int index = 1; index <= tr.getColumns(); index++) {
					String value = StringEscapeUtils.escapeXml11(tr.get(index).trim().replaceAll(Constants.lineSeparator, "<br>"));
					value = B64.encodeB64String(value.getBytes());
					rowDoc.addChild(XMLDocument.root, "<" + tr.name(index) + ">" + value + "</" + tr.name(index) + ">");
				}
				rowsDoc.addChild(XMLDocument.root, rowDoc);
			}
			responseDoc.addChild(XMLDocument.root, rowsDoc);

			response = responseDoc.toString();
		} catch (Exception ex) {
			response = "";
			logger.info("", ex); // a log level greater than info try to log on db
		}

		return response;
	}

	private String getRouteDBLogs(String contextName, String routeId) {
		String response;
		List<Object> params = new ArrayList<>();

		try {
			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);
			XMLDocument rowsDoc = XML.getDocument("<ROWS/>");
			XMLDocument rowDoc;
			StringBuilder sql = new StringBuilder("select * from (select * from (");
			sql.append(
					"select 'LOGBACK_EVENT' TABLE_NAME, LOG_LEVEL, LOG_MESSAGE, DATE_TIME, ACKNOWLEDGE, IDEN from LOGBACK_EVENT where context = ? and route = ? and log_level in ('ERROR', 'WARN') and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate)");
			sql.append(" UNION ALL ");
			sql.append(
					"select 'LOGBACK_EVENT_MESSAGES' TABLE_NAME, LOG_LEVEL, LOG_MESSAGE, DATE_TIME, ACKNOWLEDGE, IDEN from LOGBACK_EVENT_MESSAGES where context = ? and route = ? and log_level in ('ERROR', 'WARN') and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate)");
			sql.append(") order by DATE_TIME desc) where rownum < 31");

			params.add(contextName);
			params.add(routeId);
			params.add(contextName);
			params.add(routeId);
			TableRow[] rows = ardbm.get().selectEA(sql.toString(), params.toArray());
			for (TableRow tr : rows) {
				rowDoc = XML.getDocument("<ROW/>");
				for (int index = 1; index <= tr.getColumns(); index++) {
					String value = StringEscapeUtils.escapeXml11(tr.get(index).trim().replaceAll(Constants.lineSeparator, "<br>"));
					value = B64.encodeB64String(value.getBytes());
					rowDoc.addChild(XMLDocument.root, "<" + tr.name(index) + ">" + value + "</" + tr.name(index) + ">");
				}
				rowsDoc.addChild(XMLDocument.root, rowDoc);
			}
			responseDoc.addChild(XMLDocument.root, rowsDoc);

			response = responseDoc.toString();
		} catch (Exception ex) {
			response = "";
			logger.info("", ex); // a log level greater than info try to log on db
		}

		return response;
	}

	private Object getRouteLogContent(String contextName, String routeId, String fileName) {
		Object response;

		try {
			String logDirPath = elco.insc.FileUtils.verifyPath(Constants.logsDirectory) + contextName + File.separator + routeId;
			String logFilePath = elco.insc.FileUtils.verifyPath(logDirPath) + fileName;

			response = new File(logFilePath);
		} catch (Exception ex) {
			response = NEGATIVERESPONSE;
			logger.error("", ex);
		}

		return response;
	}

	private Object getContextLogContent(String contextName, String fileName) {
		Object response;

		try {
			String logDirPath = elco.insc.FileUtils.verifyPath(Constants.logsDirectory) + contextName;
			String logFilePath = elco.insc.FileUtils.verifyPath(logDirPath) + fileName;
			response = new File(logFilePath);
		} catch (Exception ex) {
			response = NEGATIVERESPONSE;
			logger.error("", ex);
		}

		return response;
	}

	private Object getScriptContent(String fileName, String context) {
		String response = "ERROR READING SCRIPT";

		try {
			String scriptDirPath = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context + Constants.contextScripts;
			String scriptFilePath = scriptDirPath + fileName;
			response = elco.insc.FileUtils.loadString(scriptFilePath);
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return B64.encodeB64String(response.getBytes());
	}

	private String saveScriptContent(String fileName, String context, String contentB64) {
		String response = POSITIVERESPONSE;

		try {
			String content = new String(B64.decodeB64(contentB64));
			String scriptDirPath = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context + Constants.contextScripts;
			elco.insc.FileUtils.mkDirQuietly(scriptDirPath);
			String scriptFilePath = elco.insc.FileUtils.verifyPath(scriptDirPath) + fileName;

			String bckFileName = scriptDirPath + fileName + "." + getModificationTime() + "." + CONTEXTDIRFILESBCKEXTENSION;
			elco.insc.FileUtils.copyFileQuietly(scriptFilePath, bckFileName);
			elco.insc.FileUtils.saveString(scriptFilePath, content);
		} catch (IOException ex) {
			response = NEGATIVERESPONSE;
			logger.error("", ex);
		}

		return response;
	}

	private String getModificationTime() {
		return GenericUtils.longAsDate(System.currentTimeMillis(), "yyyyMMddHHmmss");
	}

	private String getContextLogs(String contextName) {
		String response;

		try {
			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);
			responseDoc.add(XMLDocument.root, "<CONTEXTNAME>" + contextName + "</CONTEXTNAME>");

			String logDirPath = elco.insc.FileUtils.verifyPath(Constants.logsDirectory) + contextName;
			XMLDocument dirsDoc = getDirFilesList(logDirPath);
			responseDoc.addChild(XMLDocument.root, dirsDoc);
			response = responseDoc.toString();
		} catch (Exception ex) {
			response = NEGATIVERESPONSE;
			logger.info("", ex);
		}

		return response;
	}

	private String getRouteLogs(String contextName, String routeId) {
		String response;

		try {
			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);
			responseDoc.add(XMLDocument.root, "<CONTEXTNAME>" + contextName + "</CONTEXTNAME>");
			responseDoc.add(XMLDocument.root, "<ROUTENAME>" + routeId + "</ROUTENAME>");

			String logDirPath = elco.insc.FileUtils.verifyPath(Constants.logsDirectory) + contextName + File.separator + routeId;
			XMLDocument dirsDoc = getDirFilesList(logDirPath);
			responseDoc.addChild(XMLDocument.root, dirsDoc);
			response = responseDoc.toString();
		} catch (Exception ex) {
			response = NEGATIVERESPONSE;
			logger.warn("", ex);
		}

		return response;
	}

	private XMLDocument getDirFilesList(String logDirPath) throws XMLException {
		XMLDocument dirsDoc = XML.getDocument("<FILES/>");
		File dirPath = new File(logDirPath);
		if (!dirPath.exists() || !dirPath.isDirectory()) {
			return dirsDoc;
		}

		String[] extensions = { "log", "zip" };
		File file;
		Iterator<File> it = FileUtils.iterateFiles(dirPath, extensions, false);
		XMLDocument dirDoc;
		while (it.hasNext()) {
			file = it.next();
			dirDoc = XML.getDocument("<FILE/>");
			dirDoc.add(XMLDocument.root, "<NAME>" + file.getName() + "</NAME>");
			dirDoc.add(XMLDocument.root, "<SIZE>" + file.length() / 1024 + "</SIZE>");
			dirsDoc.addChild(XMLDocument.root, dirDoc);
		}

		return dirsDoc;
	}

	private String getScriptsList(String context) {
		String response = NEGATIVERESPONSE;

		try {
			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);
			responseDoc.addChild(XMLDocument.root, XML.getDocument("<CONTEXT>" + context + "</CONTEXT>"));

			String scriptsDirPath = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context + Constants.contextScripts;
			elco.insc.FileUtils.mkDir(scriptsDirPath);
			String[] extensions = { "groovy", "js" };
			Iterator<File> it = FileUtils.iterateFiles(new File(scriptsDirPath), extensions, false);
			File file;
			XMLDocument dirsDoc = XML.getDocument("<FILES/>");
			XMLDocument dirDoc;
			while (it.hasNext()) {
				file = it.next();
				dirDoc = XML.getDocument("<FILE/>");
				String fileName = file.getName();
				String scriptType = "Unknown";
				if (fileName.toLowerCase().endsWith(".js")) {
					scriptType = "Javascript";
				} else if (fileName.toLowerCase().endsWith(".groovy")) {
					scriptType = "Groovy";
				}
				dirDoc.add(XMLDocument.root, "<TYPE>" + scriptType + "</TYPE>");
				dirDoc.add(XMLDocument.root, "<NAME>" + fileName + "</NAME>");
				dirDoc.add(XMLDocument.root, "<MODDATE>" + GenericUtils.longAsDate(file.lastModified(), "dd/MM/yyyy HH:mm:ss") + "</MODDATE>");
				dirsDoc.addChild(XMLDocument.root, dirDoc);
			}
			responseDoc.addChild(XMLDocument.root, dirsDoc);
			response = responseDoc.toString();
		} catch (Exception ex) {
			logger.warn("", ex);
		}

		return response;
	}

	private void verifyRequest(String sha1Input) throws GeneralSecurityException {
		String sha1 = DigestUtils.getSHA1("ELCOManager" + GenericUtils.getDate());
		if (!sha1.equals(sha1Input)) {
			throw new GeneralSecurityException("Invalid HTTP request");
		}
	}

	private String setLoggersLevel(String loggerName, String logLevel) {
		String result = NEGATIVERESPONSE;

		try {
			LogbackUtils.setLoggerLevel(loggerName, Level.valueOf(logLevel));
			result = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return result;
	}

	private String getInfos() {
		String result = NEGATIVERESPONSE;

		try {
			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);
			XMLDocument infos = XML.getDocument("<INFOS/>");
			XMLDocument loggers = XML.getDocument("<LOGGERS/>");

			LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
			lc.getLoggerList().stream().filter(logger -> logger.getLevel() != null).forEach(logger -> {
				String loggerName = logger.getName();
				Level loggerLevel = LogbackUtils.getLoggerEffectiveLevel(loggerName);
				loggers.addChild(XMLDocument.root, "<LOGGER><NAME>" + loggerName + "</NAME><LEVEL>" + loggerLevel.toString() + "</LEVEL></LOGGER>");
			});

			infos.addChild(XMLDocument.root, loggers);
			infos.addChild(XMLDocument.root, "<CHARSET><VALUE>" + Constants.DEFAULT_VM_CHARSET + "</VALUE></CHARSET>");
			infos.addChild(XMLDocument.root, "<JAVA_VENDOR><VALUE>" + SystemUtils.JAVA_VENDOR + "</VALUE></JAVA_VENDOR>");
			infos.addChild(XMLDocument.root, "<JAVA_VERSION><VALUE>" + SystemUtils.JAVA_VERSION + "</VALUE></JAVA_VERSION>");
			infos.addChild(XMLDocument.root, "<OS_ARCH><VALUE>" + SystemUtils.OS_ARCH + "</VALUE></OS_ARCH>");
			infos.addChild(XMLDocument.root, "<OS_NAME><VALUE>" + SystemUtils.OS_NAME + "</VALUE></OS_NAME>");
			infos.addChild(XMLDocument.root, "<OS_VERSION><VALUE>" + SystemUtils.OS_VERSION + "</VALUE></OS_VERSION>");
			infos.addChild(XMLDocument.root, "<USER_NAME><VALUE>" + SystemUtils.USER_NAME + "</VALUE></USER_NAME>");
			infos.addChild(XMLDocument.root, "<USER_COUNTRY><VALUE>" + SystemUtils.USER_COUNTRY + "</VALUE></USER_COUNTRY>");
			infos.addChild(XMLDocument.root, "<USER_LANGUAGE><VALUE>" + SystemUtils.USER_LANGUAGE + "</VALUE></USER_LANGUAGE>");
			infos.addChild(XMLDocument.root, "<USER_TIMEZONE><VALUE>" + SystemUtils.USER_TIMEZONE + "</VALUE></USER_TIMEZONE>");

			Runtime runtime = Runtime.getRuntime();
			infos.addChild(XMLDocument.root, "<JVM_MAX_MEMORY><VALUE>" + runtime.maxMemory() / Constants.ONEMBBYTES + "</VALUE></JVM_MAX_MEMORY>");
			infos.addChild(XMLDocument.root, "<JVM_TOTAL_MEMORY><VALUE>" + runtime.totalMemory() / Constants.ONEMBBYTES + "</VALUE></JVM_TOTAL_MEMORY>");
			infos.addChild(XMLDocument.root, "<JVM_FREE_MEMORY><VALUE>" + runtime.freeMemory() / Constants.ONEMBBYTES + "</VALUE></JVM_FREE_MEMORY>");
			infos.addChild(XMLDocument.root, "<JVM_AVAILABLE_PROCESSORS><VALUE>" + runtime.availableProcessors() + "</VALUE></JVM_AVAILABLE_PROCESSORS>");
			infos.addChild(XMLDocument.root, "<JVM_IO_TEMP_DIR><VALUE>" + SystemUtils.getJavaIoTmpDir().getAbsolutePath() + "</VALUE></JVM_IO_TEMP_DIR>");

			responseDoc.addChild(XMLDocument.root, infos);
			result = responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return result;
	}

	private String tree(CamelContext localContext, List<CamelContext> contextList) throws ManagerException {
		String responseString = "";

		try {
			XMLDocument responseDoc = XML.getDocument(POSITIVERESPONSE);

			contextList.stream().filter(context -> !context.equals(localContext)).forEach(context -> { // NOSONAR
				try { // NOSONAR
					String contextName = context.getName();
					XMLDocument contextDoc = XML.getDocument("<CONTEXT/>");
					contextDoc.add(XMLDocument.root, "<NAME>" + contextName + "</NAME>");
					contextDoc.add(XMLDocument.root, "<STATUS>" + isContextStarted(context) + "</STATUS>"); // NOSONAR
					contextDoc.add(XMLDocument.root, "<STATUS_STRING>" + getContextStatus(context) + "</STATUS_STRING>"); // NOSONAR
					contextDoc.add(XMLDocument.root, "<ERRORS>" + getContextErrors(contextName) + "</ERRORS>");

					context.getRoutes().forEach(route -> {
						try { // NOSONAR
							String routeId = route.getId();
							XMLDocument routeDoc = XML.getDocument("<ROUTE/>");
							routeDoc.add(XMLDocument.root, "<NAME>" + routeId + "</NAME>");
							routeDoc.add(XMLDocument.root, "<STATUS>" + isRouteStarted(context, routeId) + "</STATUS>");
							routeDoc.add(XMLDocument.root, "<STATUS_STRING>" + getRouteStatus(context, routeId) + "</STATUS_STRING>");
							routeDoc.add(XMLDocument.root, "<ERRORS>" + getRouteErrors(contextName, routeId) + getRouteDBErrors(contextName, routeId) + "</ERRORS>");

							contextDoc.addChild(XMLDocument.root, routeDoc);
						} catch (Exception ex) {
							throw new LambdaRuntimeException(ex);
						}
					});

					responseDoc.addChild(XMLDocument.root, contextDoc);
				} catch (Exception ex) {
					throw new LambdaRuntimeException(ex);
				}
			});

			responseString = responseDoc.toString();
		} catch (Exception ex) {
			throw new ManagerException(ex);
		}

		return responseString;
	}

	private String contextAttributes(String contextName, List<CamelContext> contextList) throws XMLException {
		CamelContext context = getContext(contextName, contextList);

		XMLDocument contextDoc = XML.getDocument("<CONTEXT/>");
		contextDoc.add(XMLDocument.root, "<NAME>" + contextName + "</NAME>");
		contextDoc.add(XMLDocument.root, "<STATUS>" + isContextStarted(context) + "</STATUS>");
		contextDoc.add(XMLDocument.root, "<STATUS_STRING>" + getContextStatus(context) + "</STATUS_STRING>");
		contextDoc.add(XMLDocument.root, "<CAMELVERSION>" + getContextAttribute(contextName, "CamelVersion") + "</CAMELVERSION>");
		contextDoc.add(XMLDocument.root, "<SHUTDOWNTIMEOUT>" + getShutdownTimeout(context) + "</SHUTDOWNTIMEOUT>");
		contextDoc.add(XMLDocument.root,
				"<SHUTDOWNNOWONTIMEOUT>" + String.valueOf(context.getShutdownStrategy().isShutdownNowOnTimeout()).toUpperCase() + "</SHUTDOWNNOWONTIMEOUT>");
		contextDoc.add(XMLDocument.root, "<SHUTDOWNROUTESINREVERSEORDER>" + String.valueOf(context.getShutdownStrategy().isShutdownRoutesInReverseOrder()).toUpperCase()
				+ "</SHUTDOWNROUTESINREVERSEORDER>");
		contextDoc.add(XMLDocument.root,
				"<FIRSTEXCHANGECOMPLETEDTIMESTAMP>" + getContextAttribute(contextName, "FirstExchangeCompletedTimestamp") + "</FIRSTEXCHANGECOMPLETEDTIMESTAMP>");
		contextDoc.add(XMLDocument.root,
				"<LASTEXCHANGECOMPLETEDTIMESTAMP>" + getContextAttribute(contextName, "LastExchangeCompletedTimestamp") + "</LASTEXCHANGECOMPLETEDTIMESTAMP>");
		contextDoc.add(XMLDocument.root, "<EXCHANGESTOTAL>" + getContextAttribute(contextName, "ExchangesTotal") + "</EXCHANGESTOTAL>");
		contextDoc.add(XMLDocument.root, "<EXCHANGESCOMPLETED>" + getContextAttribute(contextName, "ExchangesCompleted") + "</EXCHANGESCOMPLETED>");
		contextDoc.add(XMLDocument.root, "<EXCHANGESFAILED>" + getContextAttribute(contextName, "ExchangesFailed") + "</EXCHANGESFAILED>");
		contextDoc.add(XMLDocument.root, "<FAILURESHANDLED>" + getContextAttribute(contextName, "FailuresHandled") + "</FAILURESHANDLED>");
		contextDoc.add(XMLDocument.root, "<INFLIGHTS>" + getContextInflightMessages(context) + "</INFLIGHTS>");
		contextDoc.add(XMLDocument.root, "<MAXPROCESSINGTIME>" + GenericUtils.timeAsString(getContextAttribute(contextName, "MaxProcessingTime")) + "</MAXPROCESSINGTIME>");
		contextDoc.add(XMLDocument.root, "<MEANPROCESSINGTIME>" + GenericUtils.timeAsString(getContextAttribute(contextName, "MeanProcessingTime")) + "</MEANPROCESSINGTIME>");
		contextDoc.add(XMLDocument.root, "<MINPROCESSINGTIME>" + GenericUtils.timeAsString(getContextAttribute(contextName, "MinProcessingTime")) + "</MINPROCESSINGTIME>");
		contextDoc.add(XMLDocument.root, "<LASTPROCESSINGTIME>" + GenericUtils.timeAsString(getContextAttribute(contextName, "LastProcessingTime")) + "</LASTPROCESSINGTIME>");
		contextDoc.add(XMLDocument.root, "<TOTALPROCESSINGTIME>" + GenericUtils.timeAsString(getContextAttribute(contextName, "TotalProcessingTime")) + "</TOTALPROCESSINGTIME>");
		contextDoc.add(XMLDocument.root, "<UPTIME>" + getContextAttribute(contextName, "Uptime") + "</UPTIME>");
		String deleteTimeString = context.getGlobalOption("deleteOldLogFilesDays");
		int deleteTime = Constants.deleteOldLogFilesDays;
		if (deleteTimeString != null) {
			deleteTime = Integer.parseInt(deleteTimeString);
		}
		contextDoc.add(XMLDocument.root, "<DELETEOLDLOGFILESDAYS>" + deleteTime + "</DELETEOLDLOGFILESDAYS>");
		String deleteTimeStringDB = context.getGlobalOption("deleteOldLogDBDays");
		int deleteTimeDB = Constants.deleteOldLogDBDays;
		if (deleteTimeStringDB != null) {
			deleteTimeDB = Integer.parseInt(deleteTimeStringDB);
		}
		contextDoc.add(XMLDocument.root, "<DELETEOLDLOGDBDAYS>" + deleteTimeDB + "</DELETEOLDLOGDBDAYS>");
		ClassLoader classLoader = context.getApplicationContextClassLoader();
		if (classLoader != null && (classLoader instanceof JarFileClassLoader)) {
			JarFileClassLoader jfcl = (JarFileClassLoader) classLoader;
			contextDoc.add(XMLDocument.root, "<CLASSLOADERPATH>" + jfcl.getPaths() + "</CLASSLOADERPATH>");
		}

		return contextDoc.toString();
	}

	private String routeAttributes(String contextName, String beanId, List<CamelContext> contextList) throws IOException, XMLException {
		CamelContext context = getContext(contextName, contextList);

		XMLDocument routeDoc = XML.getDocument("<ROUTE/>");
		routeDoc.add(XMLDocument.root, "<NAME>" + beanId + "</NAME>");
		routeDoc.add(XMLDocument.root, "<STATUS>" + isRouteStarted(context, beanId) + "</STATUS>");
		routeDoc.add(XMLDocument.root, "<STATUS_STRING>" + getRouteStatus(context, beanId) + "</STATUS_STRING>");
		String endpointuri = URLDecoder.decode(getRouteAttribute(contextName, beanId, "EndpointUri"), Constants.UTF_8);
		routeDoc.add(XMLDocument.root, "<ENDPOINTURI>" + StringEscapeUtils.escapeHtml4(endpointuri) + "</ENDPOINTURI>");
		routeDoc.add(XMLDocument.root,
				"<FIRSTEXCHANGECOMPLETEDTIMESTAMP>" + getRouteAttribute(contextName, beanId, "FirstExchangeCompletedTimestamp") + "</FIRSTEXCHANGECOMPLETEDTIMESTAMP>");
		routeDoc.add(XMLDocument.root,
				"<LASTEXCHANGECOMPLETEDTIMESTAMP>" + getRouteAttribute(contextName, beanId, "LastExchangeCompletedTimestamp") + "</LASTEXCHANGECOMPLETEDTIMESTAMP>");
		routeDoc.add(XMLDocument.root, "<INFLIGHTS>" + getRouteInflightMessages(context, beanId) + "</INFLIGHTS>");
		routeDoc.add(XMLDocument.root, "<EXCHANGESTOTAL>" + getRouteAttribute(contextName, beanId, "ExchangesTotal") + "</EXCHANGESTOTAL>");
		routeDoc.add(XMLDocument.root, "<EXCHANGESCOMPLETED>" + getRouteAttribute(contextName, beanId, "ExchangesCompleted") + "</EXCHANGESCOMPLETED>");
		routeDoc.add(XMLDocument.root, "<EXCHANGESFAILED>" + getRouteAttribute(contextName, beanId, "ExchangesFailed") + "</EXCHANGESFAILED>");
		routeDoc.add(XMLDocument.root, "<FAILURESHANDLED>" + getRouteAttribute(contextName, beanId, "FailuresHandled") + "</FAILURESHANDLED>");
		routeDoc.add(XMLDocument.root, "<MAXPROCESSINGTIME>" + GenericUtils.timeAsString(getRouteAttribute(contextName, beanId, "MaxProcessingTime")) + "</MAXPROCESSINGTIME>");
		routeDoc.add(XMLDocument.root, "<MEANPROCESSINGTIME>" + GenericUtils.timeAsString(getRouteAttribute(contextName, beanId, "MeanProcessingTime")) + "</MEANPROCESSINGTIME>");
		routeDoc.add(XMLDocument.root, "<MINPROCESSINGTIME>" + GenericUtils.timeAsString(getRouteAttribute(contextName, beanId, "MinProcessingTime")) + "</MINPROCESSINGTIME>");
		routeDoc.add(XMLDocument.root, "<LASTPROCESSINGTIME>" + GenericUtils.timeAsString(getRouteAttribute(contextName, beanId, "LastProcessingTime")) + "</LASTPROCESSINGTIME>");
		routeDoc.add(XMLDocument.root,
				"<TOTALPROCESSINGTIME>" + GenericUtils.timeAsString(getRouteAttribute(contextName, beanId, "TotalProcessingTime")) + "</TOTALPROCESSINGTIME>");
		routeDoc.add(XMLDocument.root, "<DBERRORS>" + getRouteDBErrors(contextName, beanId) + "</DBERRORS>");

		return routeDoc.toString();
	}

	private String getRouteInflightMessages(CamelContext context, String routeID) {
		String inflights;

		try {
			inflights = String.valueOf(context.getInflightRepository().size(routeID));
		} catch (Exception ex) {
			logger.error("", ex);
			inflights = "";
		}

		return inflights;
	}

	private String routeDumpAsXml(String contextName, String beanId) {
		String result = "ERROR READING XML DEFINITION FOR ROUTE: " + contextName + "." + beanId;

		try {
			result = XML.removeXmlStringDefaultNamespace(getMRMBean(contextName, beanId).dumpRouteAsXml());
			XMLDocument doc = XMLDocument.getDocument(result, Constants.DEFAULT_VM_CHARSET);
			doc.removeAttribute("/route", "customId");
			result = XML.removeXmlStringPreamble(doc.toString(true, "\n"));
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return result;
	}

	private ManagedRouteMBean getMRMBean(String contextName, String beanId) {
		String query = "org.apache.camel:context=*" + contextName + ",type=routes,name=\"" + beanId + "\",*";
		ObjectName objectInfoName = getObjectName(query, null);

		return JMX.newMBeanProxy(server, objectInfoName, ManagedRouteMBean.class, true);
	}

	private String isRouteStarted(CamelContext context, String routeName) {
		ServiceStatus serviceStatus = context.getRouteStatus(routeName);
		if (serviceStatus == null) {
			return STRUE;
		}

		return serviceStatus.isStarted() ? STRUE : SFALSE;
	}

	private String getRouteStatus(CamelContext context, String routeName) {
		ServiceStatus serviceStatus = context.getRouteStatus(routeName);
		if (serviceStatus == null) {
			return "UNKNOWN";
		}

		return serviceStatus.name().toUpperCase();
	}

	private String routeAdd(String contextName, String routeId, String springRoute, List<CamelContext> contextList) {
		String status = NEGATIVERESPONSE;
		String addedRouteID = routeId;
		String errorMessage = "";

		try {
			logger.info("routeAdd: {}", springRoute);
			ModelCamelContext context = (ModelCamelContext) getContext(contextName, contextList);
			String routeDefinition = new String(B64.decodeB64(springRoute));
			String routeToAdd = routeDefinition;
			if (!StringUtils.startsWithIgnoreCase(routeDefinition, "<routes")) { // NOSONAR
				routeToAdd = "<routes xmlns=\"http://camel.apache.org/schema/spring\">" + routeDefinition + "</routes>";
			}
			String newRouteID = Camel.addRoute(context, routeToAdd, true);

			if (newRouteID != null) {
				logger.info("Route {} modified", newRouteID);
				String routesDir = elco.insc.FileUtils.verifyPath(Constants.runtimeFilesDirectory) + contextName + File.separator + "routes";
				elco.insc.FileUtils.mkDirQuietly(routesDir);
				String newFilePath = elco.insc.FileUtils.verifyPath(routesDir) + newRouteID;
				if (elco.insc.FileUtils.exists(newFilePath + ".xml")) {
					elco.insc.FileUtils.copyFile(newFilePath + ".xml", newFilePath + "_" + System.currentTimeMillis() + "." + CONTEXTDIRFILESBCKEXTENSION);
				}
				elco.insc.FileUtils.saveString(newFilePath + ".xml", routeDefinition);
				logger.info("Route {} saved", newRouteID);
				addedRouteID = newRouteID;
				status = POSITIVERESPONSE;
			}
		} catch (Exception ex) {
			logger.error("", ex);
			errorMessage = ExceptionUtils.getMessage(ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			responseDoc.addChild(XMLDocument.root, "<CONTEXT>" + contextName + "</CONTEXT>");
			responseDoc.addChild(XMLDocument.root, "<ROUTE>" + addedRouteID + "</ROUTE>");
			if (errorMessage.length() > 0) {
				responseDoc.addChild(XMLDocument.root, "<ERRORMESSAGE>" + B64.encodeB64String(errorMessage.getBytes()) + "</ERRORMESSAGE>");
			}
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String routeRemove(String contextName, String routeId, List<CamelContext> contextList) {
		String status = NEGATIVERESPONSE;

		try {
			CamelContext context = getContext(contextName, contextList);
			ServiceStatus serviceStatus = context.getRouteStatus(routeId);
			if (serviceStatus != null) {
				if (serviceStatus.isStoppable()) {
					context.stopRoute(routeId);
				}
				context.removeRoute(routeId);
			} else {
				logger.warn("Route {} doesn't exists", routeId); // NOSONAR
			}
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return status;
	}

	private String routeStart(String contextName, String routeId, List<CamelContext> contextList) {
		String status = NEGATIVERESPONSE;
		CamelContext context = null;
		ServiceStatus serviceStatus = null;

		try {
			context = getContext(contextName, contextList);
			serviceStatus = context.getRouteStatus(routeId);
			if (serviceStatus != null) {
				if (serviceStatus.isStartable()) {
					context.startRoute(routeId);
				} else {
					logger.warn("Route {} can't be started", routeId);
				}
				status = POSITIVERESPONSE;
			} else {
				logger.warn("Route {} doesn't exists", routeId);
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			String routeStatus = context != null ? context.getRouteStatus(routeId).toString().toUpperCase() : UNKNOWN;
			responseDoc.addChild(XMLDocument.root, "<SERVICE_STATUS>" + routeStatus + "</SERVICE_STATUS>"); // NOSONAR
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String routeStop(String contextName, String routeId, List<CamelContext> contextList) {
		String status = NEGATIVERESPONSE;
		CamelContext context = null;
		ServiceStatus serviceStatus = null;

		try {
			context = getContext(contextName, contextList);
			serviceStatus = context.getRouteStatus(routeId);
			if (serviceStatus != null) {
				if (serviceStatus.isStoppable()) {
					context.stopRoute(routeId);
				} else {
					logger.warn("Route {} can't be stopped", routeId);
				}
				status = POSITIVERESPONSE;
			} else {
				logger.warn("Route {} doesn't exists", routeId);
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			String routeStatus = context != null ? context.getRouteStatus(routeId).toString().toUpperCase() : UNKNOWN;
			responseDoc.addChild(XMLDocument.root, "<SERVICE_STATUS>" + routeStatus + "</SERVICE_STATUS>");
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String routeReset(String contextName, String routeId) {
		String status = NEGATIVERESPONSE;

		try {
			ManagedRouteMBean mrmb = getMRMBean(contextName, routeId);
			mrmb.reset();
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return status;
	}

	private String contextCLReset(String contextName, List<CamelContext> contextList, ClassLoader parent) {
		String status = NEGATIVERESPONSE;
		CamelContext context = null;

		try {
			context = getContext(contextName, contextList);
			logger.info("Start reset class loader for context {}", context.getName());
			JarFileClassLoader jfcl = new JarFileClassLoader(Constants.contextJars + context.getName(), parent); // create new class loader instance
			logger.info("New class loader for context {} ready", context.getName());
			context.setApplicationContextClassLoader(jfcl);
			logger.info("Resetted application context class loader for context {}", context.getName());
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			String contextStatus = context != null ? context.getStatus().toString().toUpperCase() : UNKNOWN;
			responseDoc.addChild(XMLDocument.root, "<SERVICE_STATUS>" + contextStatus + "</SERVICE_STATUS>");
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String contextStart(String contextName, List<CamelContext> contextList, ClassLoader parent) {
		String status = NEGATIVERESPONSE;
		CamelContext context = null;

		try {
			context = getContext(contextName, contextList);
			context.setApplicationContextClassLoader(new JarFileClassLoader(Constants.contextJars + context.getName(), parent));
			logger.info("Added new application context class loader to context {}", context.getName());
			if (context.getStatus().isSuspended()) {
				context.resume();
			} else if (context.getStatus().isStopped()) {
				context.start();
			} else {
				logger.info("Context {} already started", contextName);
			}
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			String contextStatus = context != null ? context.getStatus().toString().toUpperCase() : UNKNOWN;
			responseDoc.addChild(XMLDocument.root, "<SERVICE_STATUS>" + contextStatus + "</SERVICE_STATUS>");
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String contextSuspend(String contextName, List<CamelContext> contextList) {
		String status = NEGATIVERESPONSE;
		CamelContext context = null;

		try {
			context = getContext(contextName, contextList);
			if (context.getStatus().isSuspendable()) {
				context.suspend();
				context.setApplicationContextClassLoader(null);
				logger.info("Application context class loader set to NULL for context {}", context.getName());
			} else {
				logger.info("Context {} already suspended", contextName);
			}
			status = POSITIVERESPONSE;
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			XMLDocument responseDoc = XML.getDocument(status);
			String contextStatus = context != null ? context.getStatus().toString().toUpperCase() : UNKNOWN;
			if ("SUSPENDED".equals(contextStatus)) { // Camel modified its behavior
				contextStatus = "STOPPED";
			}
			responseDoc.addChild(XMLDocument.root, "<SERVICE_STATUS>" + contextStatus + "</SERVICE_STATUS>");
			return responseDoc.toString();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return NEGATIVERESPONSE;
	}

	private String isContextStarted(CamelContext context) {
		return context.getStatus().isStarted() ? STRUE : SFALSE;
	}

	private String getContextStatus(CamelContext context) {
		return context.getStatus().name().toUpperCase();
	}

	private CamelContext getContext(String contextName, List<CamelContext> contextList) {
		Optional<CamelContext> retContext = contextList.stream().filter(context -> context.getName().equals(contextName)).findFirst();
		return retContext.orElse(null);
	}

	private String getShutdownTimeout(CamelContext context) {
		return String.valueOf(context.getShutdownStrategy().getTimeout()) + " " + context.getShutdownStrategy().getTimeUnit().toString().toLowerCase();
	}

	private String getContextInflightMessages(CamelContext context) {
		String inflights = "";

		try {
			inflights = String.valueOf(context.getInflightRepository().size());
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return inflights;
	}

	private String getDBWebServerSessionURL() throws SQLException {
		return CamelMain.getDBWebServer().addSession(ardbm.get().getDataSource().getConnection());
	}

	private int getRouteDBErrors(String contextName, String routeId) {
		int errors = 0;

		if (CamelMain.getDBWebServer() == null) {
			return errors;
		}

		List<Object> params = new ArrayList<>();

		try {
			StringBuilder sql = new StringBuilder("select ");
			sql.append(
					"(select count(*) from LOGBACK_EVENT where context = ? and route = ? and log_level in ('ERROR', 'WARN') and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate) and ACKNOWLEDGE = 'N')");
			sql.append(" + ");
			sql.append(
					"(select count(*) from LOGBACK_EVENT_MESSAGES where context = ? and route = ? and log_level in ('ERROR', 'WARN') and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate) and ACKNOWLEDGE = 'N')");
			sql.append(" from dual");

			params.add(contextName);
			params.add(routeId);
			params.add(contextName);
			params.add(routeId);
			TableRow[] result = ardbm.get().select(sql.toString(), params.toArray());
			if (result != null) {
				errors = result[0].getInteger(1);
			}
		} catch (Exception ex) {
			logger.info("", ex); // a log level greater than info try to log on db
		}

		return errors;
	}

	private int getContextDBErrors(String contextName) {
		int errors = 0;

		if (CamelMain.getDBWebServer() == null) {
			return errors;
		}

		List<Object> params = new ArrayList<>();

		try {
			StringBuilder sql = new StringBuilder("select ");
			sql.append(
					"(select count(*) from LOGBACK_EVENT where context = ? and route is null and log_level in ('ERROR', 'WARN') and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate) and ACKNOWLEDGE = 'N')");
			sql.append(" + ");
			sql.append(
					"(select count(*) from LOGBACK_EVENT_MESSAGES where context = ? and route is null and log_level in ('ERROR', 'WARN') and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -7, sysdate) and ACKNOWLEDGE = 'N')");
			sql.append(" from dual");

			params.add(contextName);
			params.add(contextName);
			TableRow[] result = ardbm.get().select(sql.toString(), params.toArray());
			if (result != null) {
				errors = result[0].getInteger(1);
			}
		} catch (Exception ex) {
			logger.info("", ex); // a log level greater than info try to log on db
		}

		return errors;
	}
}
