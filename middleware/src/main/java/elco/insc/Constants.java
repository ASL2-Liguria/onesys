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

import java.io.File;
import java.lang.management.ManagementFactory;
import java.nio.charset.StandardCharsets;

import javax.management.MBeanServer;

import org.apache.camel.spi.Registry;

/**
 * Constants utilities
 *
 * @author Roberto Rizzo
 */
public final class Constants {

	/*
	 * platform mbean server (JMX)
	 */
	private static MBeanServer platformMBeanServer = null;

	public static final String camelManagerContext = "MiddlewareManagerContext";
	public static Registry camelRegistry = null; // NOSONAR

	public static final String INTERNALDBPOOLNAME = "internaldbPool";

	public static final String ISO_8859_1 = StandardCharsets.ISO_8859_1.name();
	public static final String ISO_8859_15 = "ISO-8859-15";
	public static final String UTF_8 = StandardCharsets.UTF_8.name();
	public static final String UTF_16 = StandardCharsets.UTF_16.name();
	public static String DEFAULT_VM_CHARSET; // NOSONAR
	public static final String SAXONTRANSFORMERFACTORY = "net.sf.saxon.TransformerFactoryImpl";
	public static final String DOCUMENTBUILDERFACTORY = "org.apache.xerces.jaxp.DocumentBuilderFactoryImpl";
	public static final String ZIPFILEEXTENSION = ".zip";
	public static final String SEVENZIPFILEEXTENSION = ".7z";
	public static final long MILLISECONDSINDAY = 86400000L;
	public static final int isValidConnectionTimeout = 5;
	public static final long ONESECONDNANOSECONDS = 1000000000L;
	public static final long ONESECONDMILLISECONDS = 1000L;

	public static final String mainSpringFile = "Main_Spring_file.xml";

	/**
	 * Absolute path to middleware root directory
	 */
	public static final String runningDir = FileUtils.verifyPath((new File("")).getAbsolutePath());
	public static final String configurationDirectory = "configs";
	public static final String springFilesDirectory = runningDir + configurationDirectory + File.separator + "spring";
	public static final String runtimeFilesDirectory = runningDir + FileUtils.verifyPath(configurationDirectory + File.separator + "spring" + File.separator + "runtime");
	public static final String logbackFilesDirectory = runningDir + configurationDirectory + File.separator + "middleware";
	public static final String messagesTemplates = runningDir + configurationDirectory + File.separator + "messagesTemplates";
	public static final String xsltFiles = runningDir + configurationDirectory + File.separator + "xsltFiles";
	public static final String contextJars = runtimeFilesDirectory;
	public static final String contextScripts = File.separator + "scripts" + File.separator;
	/**
	 * Absolute path to logs root directory
	 */
	public static final String logsDirectory = runningDir + "logs";
	public static final String externalJarsDir = runningDir + "externals" + File.separator + "jars" + File.separator;
	public static final String externalLibsDir = runningDir + "externals" + File.separator + "libs" + File.separator;

	public static final String DBDRIVER = "org.h2.Driver";
	public static String DBURL = "jdbc:h2:tcp://#address#:#port#/logs"; // NOSONAR
	// public static String dbUrl = "jdbc:h2:tcp://127.0.0.1:#port#/logs;TRACE_LEVEL_FILE=3;TRACE_LEVEL_SYSTEM_OUT=3"; NOSONAR
	public static final String DBUSER = "sa";
	public static String DBPWD = ""; // NOSONAR

	public static final long ROUTESHUTDOWNTIMEOUT = 60L;

	public static final String dicomDownloads = runningDir + File.separator + "dicomDownloads" + File.separator;
	public static final String dicomFileExtension = ".dcm";

	/**
	 * Default days used to delete old logs file
	 */
	public static final int deleteOldLogFilesDays = 15;

	/**
	 * Default days used to delete old external logs file
	 */
	public static final int deleteOldLogExternalFilesDays = 15;

	/**
	 * Default days used to delete old logs on db
	 */
	public static final int deleteOldLogDBDays = 7;

	/**
	 * Constant used to convert new line. "& #10;" Must be verified on Linux
	 */
	public static final String xml_newline = "&#10;";

	/**
	 * System line separator
	 */
	public static final String lineSeparator = System.getProperty("line.separator");

	/**
	 * Internal ActiveMQ broker's name
	 */
	public static final String internalActiveMQBrokerName = "ELCOMiddleware";

	/**
	 * Main configurations path
	 */
	public static final String mainConfigurationsFile = runningDir + configurationDirectory + File.separator + "middleware" + File.separator + "main.xml";

	/**
	 * ActiveMQ configurations path
	 */
	public static final String activemqConfigurationsFile = runningDir + configurationDirectory + File.separator + "middleware" + File.separator + "activemq.xml";

	/**
	 * running pid
	 */
	public static final String runningPidFile = runningDir + File.separator + "pid";

	/**
	 * Multicast configurations path
	 */
	public static final String multicastConfigurationsFile = runningDir + configurationDirectory + File.separator + "middleware" + File.separator + "multicast.xml";

	/**
	 * Internal multicast name for consumer
	 */
	public static final String MULTICASTNAMECONSUMER = "elcoMidllewareMulticastConsumer";

	/**
	 * Internal multicast name for producer
	 */
	public static final String MULTICASTNAMEPRODUCER = "elcoMidllewareMulticastProducer";

	/**
	 * Internal id for bean used to reset context class loader
	 */
	public static final String RESETCLASSLOADER = "ResetClassLoader";

	/**
	 * Internal database enabled or disabled
	 */
	public static String ENABLEINTERNALDB; // NOSONAR

	/**
	 * Internal multicast enabled or disabled
	 */
	public static String ENABLEMULTICASTPRODUCER; // NOSONAR

	/**
	 * Number of bytes present in 1 MB
	 */
	public static final long ONEMBBYTES = 1048576L;

	/**
	 * Minimum java specification version to use with Middleware
	 */
	public static final double MINIMUMJAVASPECIFICATIONVERSION = 1.8d; // since 5.1.1

	private Constants() {
	}

	public static MBeanServer getPlatformMBeanServer() {
		if (platformMBeanServer == null) {
			platformMBeanServer = ManagementFactory.getPlatformMBeanServer();
		}

		return platformMBeanServer;
	}
}
