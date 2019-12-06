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
package elco.insc;

import java.io.InputStream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.IMarkerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.IThrowableProxy;

/**
 * Logback utility functions
 *
 * @author Roberto Rizzo
 */
public final class LogbackUtils {

	private LogbackUtils() {
	}

	/**
	 * Create a marker. If already exists will be detached
	 *
	 * @param name
	 *            Marker name
	 * @param params
	 *            References as comma separated list of String
	 * @return Marker object
	 */
	public static Marker getMarker(String name, Object... params) {
		IMarkerFactory factory = MarkerFactory.getIMarkerFactory();
		factory.detachMarker(name);

		Marker marker = factory.getMarker(name);
		for (int index = 0; index < params.length; index++) {
			Marker reference = factory.getMarker((String) params[index]);
			marker.add(reference);
		}

		return marker;
	}

	/**
	 * Set logger level
	 *
	 * @param logger
	 *            org.slf4j.Logger interface representing a ch.qos.logback.classic.Logger object
	 * @param level
	 *            ch.qos.logback.classic.Level
	 */
	public static void setLoggerLevel(Logger logger, Level level) {
		((ch.qos.logback.classic.Logger) logger).setLevel(level);
	}

	/**
	 * Set logger level
	 *
	 * @param loggerName
	 *            Logger name (ch.qos.logback.classic.Logger)
	 * @param level
	 *            ch.qos.logback.classic.Level
	 */
	public static void setLoggerLevel(String loggerName, Level level) {
		setLoggerLevel(LoggerFactory.getLogger(loggerName), level);
	}

	/**
	 * Get logger effective level
	 *
	 * @param logger
	 *            org.slf4j.Logger interface representing a ch.qos.logback.classic.Logger object
	 * @return ch.qos.logback.classic.Level object
	 */
	public static Level getLoggerEffectiveLevel(Logger logger) {
		return ((ch.qos.logback.classic.Logger) logger).getEffectiveLevel();
	}

	/**
	 * Get logger effective level
	 *
	 * @param loggerName
	 *            Logger name (ch.qos.logback.classic.Logger)
	 * @return ch.qos.logback.classic.Level object
	 */
	public static Level getLoggerEffectiveLevel(String loggerName) {
		return getLoggerEffectiveLevel(LoggerFactory.getLogger(loggerName));
	}

	/**
	 * Update context's configuration
	 *
	 * @param context
	 *            logger context to update
	 * @param configurationPath
	 *            Path to the configuration file read as a resource
	 */
	public static void updateConfiguration(LoggerContext context, String configurationPath) {
		JoranConfigurator configurator = new JoranConfigurator();
		configurator.setContext(context);
		try (InputStream baseLogbackStream = GenericUtils.getResourceAsStream(configurationPath);) {
			configurator.doConfigure(baseLogbackStream);
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * @param eventObject
	 * @return Text to log
	 */
	public static String getErrorDescription(ILoggingEvent eventObject) {
		String logText = eventObject.getFormattedMessage(); // log message
		IThrowableProxy thProxy = eventObject.getThrowableProxy(); // logged exception. Can be NULL
		if (thProxy != null) {
			logText += thProxy.getMessage() + StringUtils.join(thProxy.getStackTraceElementProxyArray());
		}

		return logText;
	}
}
