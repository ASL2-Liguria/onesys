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
package elco.logback.appenders;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.bson.Document;
import org.dcm4che2.util.CloseUtils;
import org.json.simple.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import elco.exceptions.LogNullEmptyValueException;
import elco.insc.LogbackUtils;

/**
 * <p>
 * mongoDB appender
 * </p>
 * <p>
 * log - getLoggerName, getThreadName, getLevel, getFormattedMessage
 * </p>
 *
 * @author Roberto Rizzo
 */
public final class MongoDBAppender extends AppenderBase<ILoggingEvent> {

	private MongoClient mongoClient = null;
	private MongoDatabase mongoDB = null;
	private boolean enabled = false;
	private String host;
	private int port;
	private String database;
	private String collectionName;

	/**
	 * Set the URI to connect to MongoDB
	 *
	 * @param uri
	 *            URI to MongoDB (ex. IP:port?database=test&amp;collection=test)
	 */
	public void setURI(String uri) {
		host = StringUtils.substringBefore(uri, ":");
		port = Integer.parseInt(StringUtils.substringBetween(uri, ":", "?"));
		String[] remains = StringUtils.substringAfter(uri, "?").split("&");
		for (String param : remains) {
			if (param.contains("database=")) {
				database = StringUtils.substringAfter(param, "database=");
			}
			if (param.contains("collection=")) {
				collectionName = StringUtils.substringAfter(param, "collection=");
			}
		}

		@SuppressWarnings("unused")
		InitializeConnection ic = new InitializeConnection(); // NOSONAR
	}

	/*
	 * try to initialize connection to mongoDB server
	 */
	private final class InitializeConnection implements Runnable {

		private InitializeConnection() {
			Thread connThread = new Thread(this);
			connThread.start(); // try connection
		}

		@Override
		public void run() {
			try {
				mongoClient = new MongoClient(host, port);
				mongoDB = mongoClient.getDatabase(database);
				mongoDB.runCommand(new BasicDBObject("ping", "1"));
				enabled = true;
			} catch (Exception ex) { // NOSONAR
				System.err.println("elco.logback.appenders.MongoDBAppender initializeConnection.run: " + ex.getLocalizedMessage()); // NOSONAR
			}
		}
	}

	@Override
	protected void append(ILoggingEvent eventObject) {
		if (enabled) {
			try {
				String logText = LogbackUtils.getErrorDescription(eventObject);
				if (StringUtils.isBlank(logText)) {
					throw new LogNullEmptyValueException("Log an empty or NULL message is useless");
				}

				Map<String, String> message = new HashMap<>(6);
				message.put("loggerName", eventObject.getLoggerName());
				message.put("threadName", eventObject.getThreadName());
				message.put("logLevel", eventObject.getLevel().toString());
				message.put("camelContextId", eventObject.getMDCPropertyMap().get("camel.contextId"));
				message.put("camelRouteId", eventObject.getMDCPropertyMap().get("camel.routeId"));
				message.put("text", logText);

				mongoDB.getCollection(collectionName).insertOne(Document.parse(JSONObject.toJSONString(message)));
			} catch (Exception ex) { // NOSONAR
				System.err.println("elco.logback.appenders.MongoDBAppender append: " + ex.getLocalizedMessage()); // NOSONAR
			}
		}
	}

	@Override
	protected void finalize() throws Throwable { // NOSONAR
		CloseUtils.safeClose(mongoClient);
		super.finalize();
	}
}
