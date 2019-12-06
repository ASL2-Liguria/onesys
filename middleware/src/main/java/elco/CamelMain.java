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
package elco;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.management.ManagementFactory;
import java.net.BindException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.net.SocketException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;

import org.apache.activemq.broker.BrokerService;
import org.apache.activemq.broker.region.policy.ConstantPendingMessageLimitStrategy;
import org.apache.activemq.broker.region.policy.PolicyEntry;
import org.apache.activemq.broker.region.policy.PolicyMap;
import org.apache.activemq.store.jdbc.JDBCPersistenceAdapter;
import org.apache.activemq.usage.SystemUsage;
import org.apache.camel.CamelContext;
import org.apache.camel.LoggingLevel;
import org.apache.camel.ServiceStatus;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jetty.JettyHttpEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.spi.Registry;
import org.apache.camel.spring.spi.ApplicationContextRegistry;
import org.apache.camel.util.CastUtils;
import org.apache.camel.util.jsse.KeyManagersParameters;
import org.apache.camel.util.jsse.KeyStoreParameters;
import org.apache.camel.util.jsse.SSLContextParameters;
import org.apache.commons.io.filefilter.FalseFileFilter;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.SystemUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.xerces.dom.ElementNSImpl;
import org.eclipse.jetty.http.HttpVersion;
import org.eclipse.jetty.security.ConstraintMapping;
import org.eclipse.jetty.security.ConstraintSecurityHandler;
import org.eclipse.jetty.security.HashLoginService;
import org.eclipse.jetty.security.SecurityHandler;
import org.eclipse.jetty.security.authentication.BasicAuthenticator;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.SecureRequestCustomizer;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.gzip.GzipHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.security.Constraint;
import org.eclipse.jetty.util.security.Credential;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.h2.engine.SysProperties;
import org.h2.server.web.WebServer;
import org.h2.tools.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.FatalBeanException;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.w3c.dom.Node;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import elco.crypt.CryptInterface;
import elco.crypt.PBECryptString;
import elco.exceptions.MainException;
import elco.exceptions.NotSupportedJavaVersionException;
import elco.insc.Cache;
import elco.insc.Camel;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.insc.GenericUtils;
import elco.insc.LogbackUtils;
import elco.insc.TypesUtils;
import elco.insc.XML;
import elco.internaldb.Utils;
import elco.jetty.CamelPortHandler;
import elco.jetty.JettySessionHandler;
import elco.jetty.StaticResourceHandler;
import elco.manager.JarFileClassLoader;
import elco.manager.MainSpring;
import elco.manager.ManagerBeanFactory;
import elco.middleware.camel.beans.XMLDocument;
import elco.telnetd.TelnetD;

/**
 * <p>
 * Camel main class. Can be used for run an application as a service
 * </p>
 * <p>
 * start/stop command
 * </p>
 *
 * @author Roberto Rizzo
 */
public final class CamelMain extends Thread {
	static { // must be set here
		System.setProperty("java.awt.headless", "true"); // since 6.0.11
	}

	private MainSpring mainSpring = null;
	private TelnetD telnetDaemon;
	private BrokerService activeMQ = null;
	private static Logger logger = null;
	private static CamelMain server = null;
	private static String managerPort = "9111";
	private static String internalWebPort = "9101";
	private static boolean internalWebSSL = false;
	private static String internalDBPort = "9123";
	private static String internalDBWebPort = "9133";
	private static final String LOGBACKFILE = "logback.xml";
	private static final String CONTEXTSLIST = "contextsList";
	private static boolean loggerInitialized = false;
	private static Server serverDB = null;
	private static org.eclipse.jetty.server.Server serverJetty = null;
	private static WebServer dbWebServer = null;
	private static String internalDBBindAddress = null;
	private static String webinterfacepwd = "uk2ts5rj6IZxiuXr9Cs4nw"; // NOSONAR
	private static String networkMulticastInterface = null;
	private static String networkMulticastIP = "";
	private static String networkMulticastPort = "";
	private static String keyStore = "";
	private static String keyPassword = ""; // NOSONAR
	private static String mongoDBAppenderURI = "";
	private static String enabled = "enabled"; // enabled constant
	private static String disabled = "disabled"; // disabled constant
	private static String loggerStatusListener = disabled;
	private static String enableActiveMQ = disabled;
	private static String multicastMessage;
	private static String logbackMaxFileSize; // size in MB
	private static String telnetPort;
	private static ConcurrentHashMap<String, String> interceptStrategyContext = new ConcurrentHashMap<>();
	private static String loggerPattern = "%d: %level - %logger - %message%n";

	private CamelMain() throws MainException {
		try {
			GenericUtils.addDir2ClassPath(Constants.runningDir); // add main directory to classpath
			GenericUtils.addDir2ClassPath(Constants.externalLibsDir); // add native libraries directory to classpath
			GenericUtils.printClassPath(logger);
			logger.info("Classpath initialized");

			setMainSpring();

			Runtime.getRuntime().addShutdownHook(this); // add shutdown hook
			logger.info("Added Middleware shutdown hook");
		} catch (Exception ex) {
			throw new MainException(ex);
		}
	}

	@Override
	public void run() { // function for shutdown hook
		try {
			logger.info("Hung up signal received. Shutdown started");

			stopCamelService();
			stopActiveMQ();
			stopWebServer();
			stopInternalDB();
			stopTelnet();

			if (FileUtils.deleteFile(Constants.runningPidFile)) {
				logger.info("pid file deleted");
			} else {
				logger.warn("Can't delete pid file");
			}

			logger.info("Shutdown completed");
		} catch (Exception ex) {
			logger.error("", ex);
		}

		logger.info("Stop system logger");
		LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
		loggerContext.stop();
	}

	// Telnet commands
	public static Map<String, String> listLoggersLevel() {
		HashMap<String, String> loggersLevel = new HashMap<>();

		LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
		lc.getLoggerList().stream().filter(logger -> logger.getLevel() != null).forEach(logger -> {
			String loggerName = logger.getName();
			Level loggerLevel = LogbackUtils.getLoggerEffectiveLevel(loggerName);
			loggersLevel.put(loggerName, loggerLevel.toString());
		});

		return loggersLevel;
	}

	public static void setLoggerLevel(String loggerName, String logLevel) {
		LogbackUtils.setLoggerLevel(loggerName, Level.valueOf(logLevel));
	}

	public static int startStopRoute(String contextName, String routeId, String command) {
		int status = -1;

		try {
			CamelContext context = server.getContext(contextName);
			if (context != null) {
				ServiceStatus serviceStatus = context.getRouteStatus(routeId);
				if (serviceStatus != null) {
					if ("stop".equalsIgnoreCase(command)) { // NOSONAR
						if (serviceStatus.isStoppable()) { // NOSONAR
							context.stopRoute(routeId);
							status = 0;
						} else {
							logger.warn("Route {} can't be stopped", routeId);
						}
					} else if ("start".equalsIgnoreCase(command)) { // NOSONAR
						if (serviceStatus.isStartable()) { // NOSONAR
							context.startRoute(routeId);
							status = 0;
						} else {
							logger.warn("Route {} can't be started", routeId);
						}
					}
				} else {
					logger.warn("Route {} doesn't exists", routeId);
				}
			} else {
				logger.warn("Context {} doesn't exists", contextName);
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return status;
	}

	public static String getCclCreationTime(String contextName) {
		CamelContext context = server.getContext(contextName);
		if (context != null) {
			ClassLoader cl = context.getApplicationContextClassLoader();
			if (cl instanceof JarFileClassLoader) {
				return ((JarFileClassLoader) cl).getCreationTime();
			}
		}

		return "";
	}

	public static int resetCcl(String contextName) {
		int status = -1;

		try {
			CamelContext context = server.getContext(contextName);
			if (context != null) {
				// create new class loader instance
				JarFileClassLoader jfcl = new JarFileClassLoader(Constants.contextJars + context.getName(), server.mainSpring.getApplicationContext().getClassLoader());
				context.setApplicationContextClassLoader(jfcl);
				status = 0;
			}
		} catch (Exception ex) { // NOSONAR
			status = -1;
		}

		return status;
	}

	public static int emptyCache(String contextName, String endPointUri) {
		int status = -1;

		try {
			CamelContext context = server.getContext(contextName);
			if (context != null) {
				Cache.emptyCache(context, endPointUri);
				status = 0;
			}
		} catch (Exception ex) { // NOSONAR
			status = -1;
		}

		return status;
	}

	public static List<CamelContext> listContexts() {
		return server.getMainSpring().getCamelContexts();
	}

	public static List<String> listContextRoutes(String contextName) {
		ArrayList<String> routesName = new ArrayList<>();

		CamelContext context = server.getContext(contextName);
		if (context != null) {
			context.getRoutes().parallelStream().forEach(route -> {
				String routeId = route.getId();
				routesName.add(routeId + " - " + context.getRouteStatus(routeId));
			});
		}

		return routesName;
	}

	public static void reloadCamelConfigurations() {
		server.stopCamelService();
		server.setMainSpring();
		server.startCamelService();
	}

	public static boolean isACServiceStarted() {
		return server.getMainSpring().isStarted();
	}

	public static boolean addContextInterceptor(String contextName) {
		boolean added = false;
		if (!contextName.equals(Constants.camelManagerContext) && server.getContext(contextName) != null) {
			interceptStrategyContext.put(contextName, contextName);
			added = true;
		}

		return added;
	}

	public static boolean removeContextInterceptor(String contextName) {
		return interceptStrategyContext.remove(contextName) != null;
	}
	// Telnet commands

	/**
	 * @return internal activemq
	 */
	public BrokerService getBrokerService() {
		return activeMQ;
	}

	/**
	 * @return manager port
	 */
	public static String getManagerPort() {
		return managerPort;
	}

	/**
	 * @return internal db web server
	 */
	public static WebServer getDBWebServer() {
		return dbWebServer;
	}

	/**
	 * Set application context class loader
	 *
	 * @param beanFactory
	 */
	public static void setACClassLoader(ConfigurableListableBeanFactory beanFactory) {
		logger.info(">>> Start configuring AC's class loader for beans >>>");
		Stream.of(beanFactory.getBeanDefinitionNames()).forEach(beanName -> {
			MutablePropertyValues properties = beanFactory.getBeanDefinition(beanName).getPropertyValues();
			properties.getPropertyValueList().stream().filter(pValue -> "#accloader#".equalsIgnoreCase(TypesUtils.getTypedStringValueValue(pValue.getValue())))
					.forEach(pValue -> {
				String propertyName = pValue.getName();
				ClassLoader beanClassLoader = beanFactory.getBeanClassLoader();
				properties.add(propertyName, beanClassLoader);
				logger.info("Set class loader {} on bean {} using property {}", beanClassLoader.toString(), beanName, propertyName);
			});
		});
		logger.info("<<< AC's class loader configuration for beans terminated <<<");
	}

	private static void verifyMiddlewareAlreadyStarted() throws IOException {
		try (Socket socket = new Socket();) {
			socket.bind(new InetSocketAddress("0.0.0.0", Integer.parseInt(internalWebPort))); // NOSONAR
		} catch (BindException ex) { // NOSONAR
			throw new IOException("Middleware already started");
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	private static void managePID() throws IOException {
		String vmName = ManagementFactory.getRuntimeMXBean().getName();
		String pid = StringUtils.substringBefore(vmName, "@");
		String machineName = StringUtils.substringAfter(vmName, "@");
		FileUtils.saveString(Constants.runningPidFile, pid);
		logger.info("Middleware running with pid {} on machine {}", pid, machineName);
	}

	/**
	 * Main function
	 *
	 * @param args
	 *            start/stop command (mandatory)
	 */
	public static void main(String[] args) {
		try {
			// to exclude other configurations file present in the classpath. Must be set here
			System.setProperty("logback.configurationFile", "META-INF/logback/zeroConfigLogback.xml");

			Constants.DEFAULT_VM_CHARSET = Charset.defaultCharset().name();
			System.setProperty("org.apache.camel.default.charset", Constants.DEFAULT_VM_CHARSET);
			System.setProperty("java.net.preferIPv4Stack", "true"); // for multicast purpose
			Constants.getPlatformMBeanServer();

			FileUtils.mkDirQuietly(Constants.contextJars);
			FileUtils.mkDirQuietly(Constants.externalJarsDir);
			FileUtils.mkDirQuietly(Constants.externalLibsDir);

			readMainConfigurations();
			initializeLogger();

			logger.info("Middleware base directory: {}", Constants.runningDir);
			logger.info("Java Vendor: {}, Version: {}", SystemUtils.JAVA_VENDOR, SystemUtils.JAVA_VERSION);
			logger.info("Os Arch: {}, Name: {}, Version: {}", SystemUtils.OS_ARCH, SystemUtils.OS_NAME, SystemUtils.OS_VERSION);
			logger.info("User Name: {}, Country: {}, Language: {}", SystemUtils.USER_NAME, SystemUtils.USER_COUNTRY, SystemUtils.USER_LANGUAGE);
			logger.info("User time zone: {}", SystemUtils.USER_TIMEZONE);
			logger.info("Default VM charset: {}", Constants.DEFAULT_VM_CHARSET);
			logger.info("Default Middleware charset: {}", System.getProperty("org.apache.camel.default.charset"));
			logger.info("preferIPv4Stack: {}", System.getProperty("java.net.preferIPv4Stack"));
			logger.info("Head less: {}", java.awt.GraphicsEnvironment.isHeadless());
			logger.info("java.security.egd: {}", StringUtils.defaultString(System.getProperty("java.security.egd"), "NOT SET"));
			logger.info("java.io.tmpdir: {}", SystemUtils.getJavaIoTmpDir().getAbsolutePath());

			verifyMinimumRequirements(args);

			if ("start".equalsIgnoreCase(args[0]) && server == null) {
				verifyMiddlewareAlreadyStarted();
				readMulticastConfiguration();

				server = new CamelMain();
				server.startTelnet();
				server.startInternalDB(internalDBPort, internalDBWebPort);
				server.startWebServer(internalWebPort);
				server.startActiveMQ();
				server.startCamelService();

				managePID();
			} else if ("stop".equalsIgnoreCase(args[0])) {
				System.exit(0); // this command fire a call to the shutdown hook
			} else {
				throw new IllegalArgumentException("The server already exists");
			}
		} catch (JoranException ex) { // NOSONAR - logger initialization failed
			ex.printStackTrace(); // NOSONAR
			System.exit(1); // this command fire a call to the shutdown hook
		} catch (Throwable ex) { // NOSONAR
			logger.error("", ex);
			System.exit(2); // this command fire a call to the shutdown hook
		}
	}

	public static CamelMain getMiddlewareMain() {
		return server;
	}

	private CamelContext getContext(String contextName) {
		return mainSpring.getCamelContexts().stream().filter(ctx -> ctx.getName().equals(contextName)).findFirst().orElse(null);
	}

	private MainSpring getMainSpring() {
		return mainSpring;
	}

	private void startCamelService() {
		try {
			Thread th = new Thread(() -> {
				final Logger loggerACs = LoggerFactory.getLogger("STARTCAMELSERVICE");

				try { // NOSONAR
					server.readCamelConfigurations();
					mainSpring.run(); // start AC
				} catch (Exception ex) {
					loggerACs.error("", ex);
				}
			});
			th.start();
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void startTelnet() {
		try {
			int port = Integer.parseInt(telnetPort);
			if (port > 0) {
				telnetDaemon = TelnetD.createTelnetD(GenericUtils.getResourceURL("META-INF/telnetd.properties"));
				telnetDaemon.getPortListener("std").setPort(port);
				telnetDaemon.start();
			} else {
				logger.info("Middleware's telnet server is disabled");
			}
		} catch (Exception ex) { // NOSONAR
			logger.warn("Can't start telnet server", ex);
		}
	}

	private void stopTelnet() {
		if (telnetDaemon != null) {
			telnetDaemon.stop();
		}
	}

	private void setMainSpring() {
		mainSpring = new MainSpring();
		mainSpring.setInterceptStrategyContext(interceptStrategyContext);
	}

	private static void verifyMinimumRequirements(String[] args) throws NotSupportedJavaVersionException {
		if (Double.parseDouble(SystemUtils.JAVA_SPECIFICATION_VERSION) < Constants.MINIMUMJAVASPECIFICATIONVERSION) {
			throw new NotSupportedJavaVersionException("The minimum java specification version must be: " + Constants.MINIMUMJAVASPECIFICATIONVERSION);
		}

		if (args.length != 1) {
			throw new IllegalArgumentException("One argument required: start/stop");
		}

		if (!"start".equalsIgnoreCase(args[0]) && !"stop".equalsIgnoreCase(args[0])) {
			throw new IllegalArgumentException("Illegal argument: " + args[0]);
		}

		if (System.getSecurityManager() != null) {
			logger.warn("Found security manager. Application's actions can be restricted");
		}
	}

	private static synchronized void setJettyServer(org.eclipse.jetty.server.Server server) {
		serverJetty = server;
	}

	private static synchronized Server setServerDB(Server server) {
		serverDB = server;
		return serverDB;
	}

	private static synchronized void setWebServer(WebServer server) {
		dbWebServer = server;
	}

	private static synchronized void setCamelRegistry(Registry registry) { // NOSONAR
		Constants.camelRegistry = registry;
	}

	/**
	 * try to read main.xml config file
	 *
	 * @throws JoranException
	 */
	private static void readMainConfigurations() throws JoranException {
		try {
			XMLDocument mainConfigs = XML.getDocumentFromFile(Constants.mainConfigurationsFile);
			managerPort = mainConfigs.getString("//MAIN/INTERNALMANAGERPORT");
			internalWebPort = mainConfigs.getString("//MAIN/PUBLICWEBPORT");
			internalDBPort = mainConfigs.getString("//MAIN/INTERNALDBPORT");
			internalDBWebPort = mainConfigs.getString("//MAIN/INTERNALDBWEBCONSOLEPORT");
			internalDBBindAddress = mainConfigs.getString("//MAIN/INTERNALDBBINDADDRESS");
			mongoDBAppenderURI = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/MONGODBAPPENDERURI"), "");
			loggerStatusListener = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/LOGGERSTATUSLISTENER"), "");
			Constants.ENABLEINTERNALDB = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/INTERNALDB"), disabled);
			enableActiveMQ = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/ACTIVEMQ"), disabled);
			Constants.ENABLEMULTICASTPRODUCER = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/MULTICASTPRODUCER"), disabled);
			String webintpwd = mainConfigs.getString("//MAIN/WEBINTERFACEPWD");
			CryptInterface ci = new PBECryptString();

			if (!StringUtils.isEmpty(webintpwd)) {
				webinterfacepwd = ci.deCrypt(webintpwd.getBytes());
			} else {
				webinterfacepwd = ci.deCrypt(webinterfacepwd.getBytes());
			}
			Constants.DBPWD = webinterfacepwd;

			String useSSL = mainConfigs.getString("//MAIN/WEBSSL/ACTIVE");
			internalWebSSL = Boolean.parseBoolean(useSSL);
			if (internalWebSSL) {
				keyStore = mainConfigs.getString("//MAIN/WEBSSL/KESTORE");
				String keypwd = mainConfigs.getString("//MAIN/WEBSSL/KEYPASSWORD");
				if (StringUtils.isNotEmpty(keypwd)) {
					keyPassword = ci.deCrypt(keypwd.getBytes());
				}
			}

			logbackMaxFileSize = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/LOGBACKMAXFILESIZE"), "60"); // default 60 MB
			int logbackMaxFileSizeInt = NumberUtils.toInt(logbackMaxFileSize, 60); // the int represented by the string, or the default if conversion fails
			if (logbackMaxFileSizeInt < 60) {
				logbackMaxFileSize = "60"; // default 60 MB
			}

			telnetPort = StringUtils.defaultIfBlank(mainConfigs.getString("//MAIN/TELNETPORT"), "23");

			setSystemProperties(mainConfigs.getNodeList("//MAIN/SYSTEMPROPERTIES/PROPERTY"));

			String tempPattern = mainConfigs.getString("//MAIN/LOGBACKPATTERN");
			if (StringUtils.isNotEmpty(tempPattern)) {
				loggerPattern = tempPattern;
			}
		} catch (Exception ex) {
			throw new JoranException("", ex);
		}
	}

	/**
	 * Since 5.0.1
	 *
	 * @param properties
	 *            list of system properties to set. Can be NULL
	 */
	private static void setSystemProperties(List<?> properties) {
		properties.parallelStream().forEach(node -> {
			String property = ((Node) node).getFirstChild().getNodeValue();
			String[] propertyNameValue = property.split("=");
			if (propertyNameValue.length == 2) {
				System.setProperty(propertyNameValue[0], propertyNameValue[1]);
			}
		});
	}

	/**
	 * try to read multicast.xml config file
	 */
	private static void readMulticastConfiguration() {
		try {
			if (FileUtils.exists(Constants.multicastConfigurationsFile)) {
				XMLDocument multicastConfigs = XML.getDocumentFromFile(Constants.multicastConfigurationsFile);
				networkMulticastIP = multicastConfigs.getString("//MULTICAST/NETWORKMULTICASTIP");
				networkMulticastPort = multicastConfigs.getString("//MULTICAST/NETWORKMULTICASTPORT");
				networkMulticastInterface = multicastConfigs.getString("//MULTICAST/NETWORKMULTICASTINTERFACE");
				if (StringUtils.isEmpty(networkMulticastInterface)) {
					networkMulticastInterface = getDefaultNetworkInterfacesForMulticast();
				}
				multicastMessage = multicastConfigs.getString("//MULTICAST/MESSAGE");
				logger.info("Configured multicast IP and port -> {}:{}", networkMulticastIP, networkMulticastPort);
				logger.info("Using multicast interface -> {}", networkMulticastInterface);
				logger.info("Multicast message for producer -> {}", multicastMessage);
			} else {
				logger.info("multicast.xml configuration file not present");
			}
		} catch (Exception ex) {
			logger.debug("", ex);
			logger.warn("Error reading multicast.xml configuration file: {}", Constants.multicastConfigurationsFile);
		}
	}

	/**
	 * try to initialize system logger
	 *
	 * @throws JoranException
	 */
	private static void initializeLogger() throws JoranException {
		if (!loggerInitialized) {
			LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
			JoranConfigurator configurator = new JoranConfigurator();
			configurator.setContext(loggerContext);
			loggerContext.reset(); // reset configuration
			loggerContext.putProperty("elco.internaldb.poolname", Constants.INTERNALDBPOOLNAME);
			if (!StringUtils.isEmpty(mongoDBAppenderURI)) {
				loggerContext.putProperty("elco.mongodb.uri", mongoDBAppenderURI);
			}
			if (enabled.equalsIgnoreCase(loggerStatusListener)) {
				loggerContext.putProperty("elco.logback.statusListener", loggerStatusListener);
			}
			if (enabled.equalsIgnoreCase(Constants.ENABLEINTERNALDB)) {
				loggerContext.putProperty("elco.logback.internalDB", Constants.ENABLEINTERNALDB);
			}
			loggerContext.putProperty("elco.logback.maxFileSize", logbackMaxFileSize + "MB"); // size in MB
			loggerContext.putProperty("elco.logback.pattern", loggerPattern);

			verifyAdditionalLogbackFile(loggerContext);

			try (InputStream baseLogbackStream = GenericUtils.getResourceAsStream("META-INF/logback/baseLogback.xml");) {
				configurator.doConfigure(baseLogbackStream);
			} catch (IOException ex) {
				throw new JoranException("", ex);
			}

			if (logger == null) {
				logger = LoggerFactory.getLogger(CamelMain.class);
			}

			loggerInitialized = true;
			logger.info("Middleware logger initialized");
		}
	}

	private static void verifyAdditionalLogbackFile(LoggerContext loggerContext) {
		String additionalLogbackFile = FileUtils.verifyPath(Constants.logbackFilesDirectory) + LOGBACKFILE;
		loggerContext.putProperty("additionalConfigurationsFile", additionalLogbackFile);

		try {
			if (FileUtils.exists(additionalLogbackFile)) {
				String configurations = FileUtils.loadString(additionalLogbackFile);
				if (configurations.contains("<configuration>")) {
					configurations = configurations.replaceAll("<configuration>", "<included>").replaceAll("</configuration>", "</included>");
					FileUtils.saveString(additionalLogbackFile, configurations);
				}
			}
		} catch (Exception ex) { // NOSONAR
			System.err.println(ex.getLocalizedMessage()); // NOSONAR
		}
	}

	private static String getDefaultNetworkInterfacesForMulticast() throws SocketException {
		logger.info("Searching multicast interface");
		String defaultMulticastInterface = null;
		Enumeration<NetworkInterface> nets = NetworkInterface.getNetworkInterfaces();
		for (NetworkInterface netIf : Collections.list(nets)) {
			Enumeration<InetAddress> addrs = netIf.getInetAddresses();
			if (addrs.hasMoreElements() && netIf.isUp() && netIf.supportsMulticast() && !netIf.isLoopback() && !netIf.isPointToPoint()) { // NOSONAR
				String iDisplayName = netIf.getDisplayName();
				String iName = netIf.getName();
				InetAddress ia = addrs.nextElement();
				logger.info("Found multicast capable interface -> display name: {}, name: {}, address: {}", iDisplayName, iName, ia.getHostAddress());
				if (defaultMulticastInterface == null) { // NOSONAR
					defaultMulticastInterface = iName;
				}
			}
		}

		if (StringUtils.isEmpty(defaultMulticastInterface)) {
			logger.info("No multicast interface found");
		}

		return defaultMulticastInterface;
	}

	private void startActiveMQ() { // NOSONAR
		if (enabled.equalsIgnoreCase(enableActiveMQ)) {
			try {
				logger.info("Starting internal ActiveMQ server using configuration file {}", Constants.activemqConfigurationsFile);

				XMLDocument config = XML.getDocumentFromFile(Constants.activemqConfigurationsFile);
				String dataDirectory = config.getString("//ACTIVEMQ/DATADIRECTORY");
				String address = config.getString("//ACTIVEMQ/ADDRESS");
				String deleteAM = config.getString("//ACTIVEMQ/DELETEALLMESSAGESONSTARTUP");
				boolean deleteAllMessages = Boolean.parseBoolean(deleteAM);
				String pers = config.getString("//ACTIVEMQ/PERSISTENT");
				boolean persistent = Boolean.parseBoolean(pers);
				String advs = config.getString("//ACTIVEMQ/ADVISORYSUPPORT");
				boolean advisorySupport = Boolean.parseBoolean(advs);
				String stats = config.getString("//ACTIVEMQ/ENABLESTATISTICS");
				boolean enableStatistics = Boolean.parseBoolean(stats);
				String offlineTimeout = config.getString("//ACTIVEMQ/DURABLEOFFLINETIMEOUT");
				long durableOfflineTimeout = NumberUtils.toLong(offlineTimeout, 172800000L); // default 2 days
				String connPort = config.getString("//ACTIVEMQ/CONNECTORPORT");
				int connectorPort = NumberUtils.toInt(connPort, -1);
				String dlsPE = config.getString("//ACTIVEMQ/DEADLETTERSTRATEGY_PROCESSEXPIRED");
				boolean processExpired = Boolean.parseBoolean(dlsPE);
				String pmls = config.getString("//ACTIVEMQ/PENDINGMESSAGELIMITSTRATEGY");
				int pendingMessageLimitStrategy = NumberUtils.toInt(pmls, 50);

				activeMQ = new BrokerService();
				if (!StringUtils.isEmpty(dataDirectory)) {
					activeMQ.setDataDirectory(dataDirectory);
				}
				activeMQ.setBrokerName(Constants.internalActiveMQBrokerName);
				activeMQ.setAdvisorySupport(advisorySupport);
				activeMQ.setDeleteAllMessagesOnStartup(deleteAllMessages);
				activeMQ.setEnableStatistics(enableStatistics);
				activeMQ.setPersistent(persistent);
				activeMQ.setOfflineDurableSubscriberTimeout(durableOfflineTimeout);
				activeMQ.getManagementContext().setConnectorPort(connectorPort);
				activeMQ.setUseJmx(true);
				PolicyMap policyMap = new PolicyMap();
				PolicyEntry defaultEntry = new PolicyEntry();
				defaultEntry.getDeadLetterStrategy().setProcessExpired(processExpired);
				ConstantPendingMessageLimitStrategy cpmls = new ConstantPendingMessageLimitStrategy();
				cpmls.setLimit(pendingMessageLimitStrategy);
				defaultEntry.setPendingMessageLimitStrategy(cpmls);
				policyMap.setDefaultEntry(defaultEntry);
				activeMQ.setDestinationPolicy(policyMap);
				activeMQ.addConnector(address);
				SystemUsage su = activeMQ.getSystemUsage();
				String mu = config.getString("//ACTIVEMQ/MEMORYUSAGE");
				if (mu != null) {
					su.getMemoryUsage().setLimit(Long.parseLong(mu) * Constants.ONEMBBYTES);
				}
				String sl = config.getString("//ACTIVEMQ/STORELIMIT");
				if (sl != null) {
					su.getStoreUsage().setLimit(Long.parseLong(sl) * Constants.ONEMBBYTES);
				}
				String tsl = config.getString("//ACTIVEMQ/TEMPORARYSTORELIMIT");
				if (tsl != null) {
					su.getTempUsage().setLimit(Long.parseLong(tsl) * Constants.ONEMBBYTES);
				}

				verifyJDBCPersistenceAdapter(config);

				activeMQ.start();
				boolean activeMQStarted = activeMQ.waitUntilStarted();
				if (activeMQStarted) {
					logger.info("Internal ActiveMQ server started. Address: {}. Data directory: {}", address, activeMQ.getBrokerDataDirectory().getAbsolutePath());
					logger.info("ActiveMQ memory usage: {} MB", su.getMemoryUsage().getLimit() / Constants.ONEMBBYTES);
					logger.info("ActiveMQ store limit: {} MB", su.getStoreUsage().getLimit() / Constants.ONEMBBYTES);
					logger.info("ActiveMQ temporary store limit: {} MB", su.getTempUsage().getLimit() / Constants.ONEMBBYTES);
				} else {
					logger.warn("Can't startup internal ActiveMQ server. Address: {}. Data directory: {}", address, activeMQ.getBrokerDataDirectory().getAbsolutePath());
				}
			} catch (Exception ex) {
				logger.error("", ex);
			}
		} else {
			logger.info("Internal ActiveMQ server is disabled");
		}
	}

	private void verifyJDBCPersistenceAdapter(XMLDocument config) {
		try {
			XMLDocument jdbcConfig = config.getSubDocument("//ACTIVEMQ/JDBCPERSISTENCEADAPTER");
			String poolName = jdbcConfig.getString("//POOLNAME");
			poolName = StringUtils.isEmpty(poolName) ? Constants.INTERNALDBPOOLNAME : poolName;

			JDBCPersistenceAdapter jdbcPA = new JDBCPersistenceAdapter();
			jdbcPA.setUseLock(false);
			jdbcPA.setDataSource(Constants.camelRegistry.lookupByNameAndType(poolName, DataSource.class));
			activeMQ.setPersistenceAdapter(jdbcPA);
		} catch (Exception ex) { // NOSONAR
			logger.info("Activemq JDBCPersistenceAdapter not configured");
		}
	}

	private void stopActiveMQ() {
		if (activeMQ != null) {
			logger.info("Shutting down internal activemq server");
			try {
				activeMQ.stop();
				activeMQ.waitUntilStopped();
				logger.info("Internal activemq server stopped");
			} catch (Exception ex) {
				logger.warn("Can't shutdown internal activemq server", ex);
			}
		} else {
			logger.info("ActiveMQ has already stopped");
		}
	}

	private void startWebServer(String port) {
		if (serverJetty == null) {
			try {
				logger.info("Starting internal web server");
				setJettyServer(new org.eclipse.jetty.server.Server());

				StaticResourceHandler resourceHandler = new StaticResourceHandler();
				resourceHandler.setDirectoriesListed(false);
				resourceHandler.setWelcomeFiles(new String[] { "index.html" });
				resourceHandler.setBaseResource(Resource.newClassPathResource("META-INF/webapps"));
				JettySessionHandler jettySessionHandler = new JettySessionHandler();
				jettySessionHandler.getSessionManager().setMaxInactiveInterval(900);
				resourceHandler.setHandler(jettySessionHandler);

				ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
				context.setContextPath("/");
				context.addServlet(new ServletHolder(new CamelPortHandler()), "/camelport");

				GzipHandler gzipHandler = new GzipHandler();
				gzipHandler.addIncludedMimeTypes("text/html,text/plain,text/xml,application/xhtml+xml,text/css,application/javascript,text/javascript,image/svg+xml");
				gzipHandler.setMinGzipSize(0);
				HandlerList handlersGZip = new HandlerList();
				handlersGZip.setHandlers(new Handler[] { resourceHandler, context });
				gzipHandler.setHandler(handlersGZip);

				SecurityHandler securityHandler = basicAuth();
				securityHandler.setHandler(gzipHandler);

				serverJetty.setHandler(securityHandler);

				ServerConnector connector;
				if (!internalWebSSL) {
					connector = new ServerConnector(serverJetty); // NOSONAR
					connector.setPort(Integer.parseInt(port));
				} else {
					HttpConfiguration https = new HttpConfiguration();
					https.addCustomizer(new SecureRequestCustomizer());

					SslContextFactory sslContextFactory = new SslContextFactory();
					sslContextFactory.setKeyStorePath(Constants.runningDir + keyStore);
					sslContextFactory.setKeyStorePassword(keyPassword);
					sslContextFactory.setKeyManagerPassword(keyPassword);

					connector = new ServerConnector(serverJetty, new SslConnectionFactory(sslContextFactory, HttpVersion.HTTP_1_1.asString()), new HttpConnectionFactory(https)); // NOSONAR
					connector.setPort(Integer.parseInt(port));
				}

				serverJetty.setConnectors(new Connector[] { connector });
				serverJetty.start();

				logger.info("Internal web server started. Listening to port {}. Base directory: {}", port, resourceHandler.getResourceBase());
			} catch (Exception ex) {
				logger.warn("Can't startup internal web server", ex);
			}
		}
	}

	private SecurityHandler basicAuth() {
		String realm = "ELCOMiddleware";
		String admin = "admin";

		HashLoginService hls = new HashLoginService();
		hls.setName(realm);
		hls.putUser(admin, Credential.getCredential(webinterfacepwd), new String[] { admin }); // default administrator user

		XMLDocument mainConfigsUsers = null;
		try {
			CryptInterface ci = new PBECryptString();
			mainConfigsUsers = XML.getDocumentFromFile(Constants.mainConfigurationsFile);
			List<?> users = mainConfigsUsers.getNodeList("//MAIN/USERS/USER");
			users.forEach(user -> {
				try { // NOSONAR
					XMLDocument userDoc = XMLDocument.getDocument((Node) user, Constants.DEFAULT_VM_CHARSET);
					String userName = userDoc.getString("//NAME");
					String userPassword = ci.deCrypt(userDoc.getString("//PASSWORD").getBytes());
					String userRole = userDoc.getString("//ROLE");
					if (!admin.equals(userRole)) {
						hls.putUser(userName, Credential.getCredential(userPassword), new String[] { userRole });
					}
				} catch (Exception ex) {
					logger.warn("Error reading USER from main.xml config file", ex);
				}
			});
		} catch (Exception ex) {
			logger.warn("Error reading USERS from main.xml config file", ex);
		}

		Constraint constraint = new Constraint();
		constraint.setName(Constraint.__BASIC_AUTH);
		constraint.setRoles(new String[] { admin, "read" });
		constraint.setAuthenticate(true);

		ConstraintMapping cm = new ConstraintMapping();
		cm.setConstraint(constraint);
		cm.setPathSpec("/*");

		ConstraintSecurityHandler csh = new ConstraintSecurityHandler();
		csh.setAuthenticator(new BasicAuthenticator());
		csh.setRealmName(realm);
		csh.addConstraintMapping(cm);
		csh.setLoginService(hls);

		return csh;
	}

	private void stopWebServer() {
		if (serverJetty != null) {
			try {
				logger.info("Shutting down internal web server");
				serverJetty.stop();
				while (serverJetty.isRunning()) {
					logger.info("Waiting until web server shutdown");
					GenericUtils.threadSleep(Constants.ONESECONDMILLISECONDS);
				}
				logger.info("Internal web server stopped");
			} catch (Exception ex) {
				logger.warn("Can't shutdown web server", ex);
			}
		} else {
			logger.info("Internal web server has already stopped");
		}
	}

	private static void setInternalDBURL() {
		Constants.DBURL = Constants.DBURL.replace("#port#", internalDBPort); // set internal db port to use
		Constants.DBURL = Constants.DBURL.replace("#address#", internalDBBindAddress); // set internal db IP address to use
	}

	private void startInternalDB(String port, String webPort) {
		if (enabled.equals(Constants.ENABLEINTERNALDB)) {
			setInternalDBURL();
			if (serverDB == null) {
				try {
					if (internalDBBindAddress != null) { // NOSONAR
						System.setProperty("h2.bindAddress", internalDBBindAddress);
					}
					logger.info("Starting internal DB using bind address {}", SysProperties.BIND_ADDRESS);
					String baseDir = FileUtils.verifyPath(Constants.runningDir) + "internaldb";
					String[] configsDB = new String[] { "-baseDir", baseDir, "-tcpPort", port, "-tcpAllowOthers" };
					setServerDB(Server.createTcpServer(configsDB)).start();
					logger.info("Internal DB started. Listening to port {}. Base directory: {}", serverDB.getPort(), baseDir);
					logger.info("Configuring internal DB");
					Utils.executeInitScipts();
					logger.info("Internal DB tables, indexes and views are ready");
				} catch (Exception ex) {
					logger.warn("Can't startup internal DB: {}", ex);
				}
			}

			if (dbWebServer == null) {
				try {
					logger.info("Starting internal DB web server");
					String[] configsDBWebServer = new String[] { "-webPort", webPort, "-webAllowOthers" };
					setWebServer(new WebServer());
					Server dbWebserverTemp = new Server(dbWebServer, configsDBWebServer);
					dbWebserverTemp.start();
					logger.info("Internal DB web server started");
				} catch (Exception ex) {
					logger.warn("Can't startup internal DB web server: {}", ex);
				}
			}
		} else {
			logger.info("Internal database is disabled");
		}
	}

	private void stopInternalDB() {
		if (dbWebServer != null) {
			logger.info("Shutting down internal DB web server");
			dbWebServer.stop();
			while (dbWebServer.isRunning(false)) {
				logger.info("Waiting until internal DB web server shutdown");
				GenericUtils.threadSleep(Constants.ONESECONDMILLISECONDS);
			}
			logger.info("Internal DB web server stopped");
		} else {
			logger.info("Internal DB web server has already stopped");
		}

		if (serverDB != null) {
			logger.info("Shutting down internal DB");
			serverDB.stop();
			while (serverDB.isRunning(false)) {
				logger.info("Waiting until internal DB shutdown");
				GenericUtils.threadSleep(Constants.ONESECONDMILLISECONDS);
			}
			logger.info("Internal DB stopped");
		} else {
			logger.info("Internal DB is already stopped");
		}
	}

	/**
	 * @author Roberto Rizzo
	 */
	private class PostProcessor implements BeanFactoryPostProcessor {

		@Override
		public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException { // NOSONAR
			try {
				setACClassLoader(beanFactory);

				beanFactory.getBeansOfType(CamelContext.class).values().forEach(context -> { // NOSONAR
					logger.info(">>> Start configuration of context {} >>>", context.getName());
					mainSpring.configureContext(context);
					logger.info("<<< Context {} configured <<<", context.getName());
				});
			} catch (Exception ex) {
				throw new FatalBeanException("", ex);
			}
		}
	}

	private void readCamelConfigurations() { // NOSONAR
		try {
			logger.info(">>>>>>>>>>>>>>>>>>>> Read AC configurations >>>>>>>>>>>>>>>>>>>>");
			AnnotationConfigApplicationContext acac = new AnnotationConfigApplicationContext();
			acac.setAllowBeanDefinitionOverriding(false);
			acac.register(ManagerBeanFactory.class);
			mainSpring.setApplicationContext(acac);
			logger.info(">>> Start class loader initialization for application context: {} >>>", Constants.externalJarsDir);
			acac.setClassLoader(new JarFileClassLoader(Constants.externalJarsDir));
			logger.info("<<< End class loader initialization for application context <<<");
			acac.addBeanFactoryPostProcessor(new PostProcessor());

			logger.info(">>> Start create internal management context >>>");
			DefaultCamelContext camelManagerContext = new DefaultCamelContext(new ApplicationContextRegistry(acac));
			camelManagerContext.setName(Constants.camelManagerContext);
			Map<String, String> properties = GenericUtils.parameters2HashMap("deleteOldLogFilesDays=7&deleteOldLogDBDays=7");
			camelManagerContext.setGlobalOptions(properties);
			mainSpring.addContext(camelManagerContext);
			setCamelRegistry(camelManagerContext.getRegistry());
			logger.info("<<< End create internal management context <<<");

			try { // NOSONAR
				logger.info(">>> Start read configuration for external beans >>>");
				XmlBeanDefinitionReader configurationsXMLReader = new XmlBeanDefinitionReader(acac);
				String contextPath = FileUtils.verifyPath(Constants.springFilesDirectory) + Constants.mainSpringFile;
				int beansNumber = configurationsXMLReader.loadBeanDefinitions(new FileSystemResource(contextPath));
				logger.info("<<< End read configuration for external beans: {} <<<", beansNumber);
			} catch (Exception ex) {
				logger.error("", ex);
			}

			logger.info(">>> Start beans creation and initialization >>>");
			acac.refresh();
			camelManagerContext.start(); // must be started after refresh
			logger.info("<<< End beans creation and initialization <<<");

			readRuntimeConfigurations(acac, camelManagerContext);

			addMiddlewareRoutes(camelManagerContext);

			mainSpring.disableHangupSupport(); // hung up support is implemented by this class (CamelMain)
			logger.info("<<<<<<<<<<<<<<<<<<<< AC configurations read <<<<<<<<<<<<<<<<<<<<");
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void readRuntimeConfigurations(GenericApplicationContext gac, CamelContext camelManagerContext) { // NOSONAR
		try {
			logger.info(">>> Start read AC configurations added/updated at runtime >>>");
			if (FileUtils.exists(Constants.runtimeFilesDirectory)) {
				// create context if not exists
				File searchDir = new File(Constants.runtimeFilesDirectory);
				Collection<File> dirs = org.apache.commons.io.FileUtils.listFilesAndDirs(searchDir, FalseFileFilter.INSTANCE,
						new IOFileFilter() {
							@Override
							public boolean accept(File dir, String name) {
								return false;
							}

							@Override
							public boolean accept(File file) {
								return FileUtils.verifyPath(file.getParent()).equals(Constants.runtimeFilesDirectory);
							}
						});
				dirs.remove(searchDir);
				logger.info(">>> Start add contexts >>>");
				dirs.forEach(file -> { // NOSONAR
					try { // NOSONAR
						String contextName = StringUtils.substringAfterLast(file.getAbsolutePath(), File.separator);
						CamelContext context = Camel.getBeanQuietly(gac, contextName, CamelContext.class);
						if (context == null) { // NOSONAR
							DefaultCamelContext newContext = new DefaultCamelContext(camelManagerContext.getRegistry());
							newContext.setName(contextName);
							mainSpring.configureContext(newContext);
							mainSpring.addContext(newContext);
							newContext.start();
							logger.info("Context {} added", newContext.getName());
							context = newContext;
						}
						String propertiesFile = FileUtils.verifyPath(Constants.runtimeFilesDirectory) + contextName + File.separator + "properties" + File.separator
								+ "definitions.xml";
						if (FileUtils.exists(propertiesFile)) { // NOSONAR
							String propertiesDefinition = FileUtils.loadString(propertiesFile).trim();
							if (!StringUtils.startsWithIgnoreCase(propertiesDefinition, "<properties")) {
								propertiesDefinition = "<properties>" + propertiesDefinition + "</properties>";
							}
							XMLDocument doc = XMLDocument.getDocument(propertiesDefinition, Constants.DEFAULT_VM_CHARSET);
							List<ElementNSImpl> properties = CastUtils.cast(doc.getNodeList("//*/property"));
							Map<String, String> contextProperties = new HashMap<>();
							properties.forEach(property -> {
								String key = property.getAttributeNode("key").getValue();
								String value = property.getAttributeNode("value").getValue();
								contextProperties.put(key, value);
							});
							if (!contextProperties.isEmpty()) {
								context.setGlobalOptions(contextProperties);
							}
						}
					} catch (Exception ex) {
						logger.error("", ex);
					}
				});
				logger.info("<<< End add contexts <<<");

				// load beans and routes
				Map<String, CamelContext> contexts = gac.getBeansOfType(CamelContext.class);
				contexts.keySet().forEach(contextName -> { // NOSONAR
					String contextsDir = FileUtils.verifyPath(Constants.runtimeFilesDirectory) + contextName;
					if (FileUtils.exists(contextsDir)) {
						logger.info(">>> Start add beans for context {} >>>", contextName);
						int nbeans = 0;
						String beansDir = FileUtils.verifyPath(contextsDir) + "beans";
						if (FileUtils.exists(beansDir)) { // NOSONAR
							try { // NOSONAR
								XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(gac);
								String beanDefinitions = FileUtils.loadString(FileUtils.verifyPath(beansDir) + "definitions.xml").trim();
								if (!StringUtils.startsWithIgnoreCase(beanDefinitions, "<beans")) { // NOSONAR
									beanDefinitions = "<beans xmlns=\"http://www.springframework.org/schema/beans\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:util=\"http://ww.springframework.org/schema/util\" xmlns:context=\"http://www.springframework.org/schema/context\" xsi:schemaLocation=\"http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://camel.apache.org/schema/spring http://camel.apache.org/schema/spring/camel-spring.xsd http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd\">"
											+ beanDefinitions + "</beans>";
								}
								nbeans = reader.loadBeanDefinitions(new ByteArrayResource(beanDefinitions.getBytes()));
							} catch (Exception ex) {
								logger.warn("Beans: problem reading runtime configurations", ex);
							}
						}
						logger.info("Read {} beans for context {}", nbeans, contextName);
						setACClassLoader(gac.getBeanFactory());
						logger.info("<<< End add beans for context {} <<<", contextName);

						logger.info(">>> Start add routes for context {} >>>", contextName);
						String routesDir = FileUtils.verifyPath(contextsDir) + "routes";
						if (FileUtils.exists(routesDir)) { // NOSONAR
							Iterator<File> it = FileUtils.iterateFiles(routesDir, false, "xml");
							it.forEachRemaining(file -> {
								try { // NOSONAR
									String routeDefinition = FileUtils.loadString(file.getAbsolutePath()).trim();
									if (!StringUtils.startsWithIgnoreCase(routeDefinition, "<routes")) { // NOSONAR
										routeDefinition = "<routes xmlns=\"http://camel.apache.org/schema/spring\">" + routeDefinition + "</routes>";
									}
									CamelContext context = contexts.get(contextName);
									String routeID = Camel.addRoute(context, routeDefinition, true);
									logger.info("Route {}.{} added/updated", context.getName(), routeID);
								} catch (Exception ex) {
									logger.warn("Routes: problem reading runtime configurations", ex);
								}
							});
						}
						logger.info("<<< End add routes for context {} <<<", contextName);
					}
				});
			}
			logger.info("<<< End read AC configurations added/updated at runtime <<<");
		} catch (Exception ex) {
			logger.warn("Problem reading AC configurations added/updated at runtime: {}", ex);
		}
	}

	private void addMiddlewareRoutes(CamelContext camelManagerContext) { // NOSONAR
		if (camelManagerContext != null) {
			logger.info(">>> Start add internal routes >>>");
			addInternalDBRoute(camelManagerContext);
			addMiddlewareCompressRoute(camelManagerContext);
			addMiddlewareDeleteRoute(camelManagerContext);
			addMiddlewareSendInfoMail(camelManagerContext);
			addManagerRoute(camelManagerContext);
			addMiddlewareDeleteExternalLogsRoute(camelManagerContext);
			addMiddlewareMulticastConsumer(camelManagerContext);
			addMiddlewareMulticastProducer(camelManagerContext);
			logger.info("<<< End add internal routes <<<");
		} else {
			logger.error("Middleware context doesn't exists");
		}
	}

	private void stopCamelService() {
		try {
			mainSpring.shutdown();
			while (!mainSpring.isStopped()) {
				logger.info("Waiting AC service to stop. Current status: {}", mainSpring.getStatus().toString());
				GenericUtils.threadSleep(Constants.ONESECONDMILLISECONDS);
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addManagerRoute(CamelContext camelManagerContext) {
		try {
			String protocol = "http";
			SSLContextParameters scp = null;

			if (internalWebSSL) { // use SSL
				protocol = "https";

				KeyStoreParameters ksp = new KeyStoreParameters();
				ksp.setResource(Constants.runningDir + keyStore);
				ksp.setPassword(keyPassword);
				KeyManagersParameters kmp = new KeyManagersParameters();
				kmp.setKeyStore(ksp);
				kmp.setKeyPassword(keyPassword);
				scp = new SSLContextParameters();
				scp.setKeyManagers(kmp);
				// JettyHttpComponent jettyComponent = _camelManagerContext.getComponent("jetty", JettyHttpComponent.class); // NOSONAR
				// jettyComponent.setSslContextParameters(scp); // NOSONAR
			}

			final String fromUri = "jetty:" + protocol + "://0.0.0.0:" + managerPort // NOSONAR
					+ "/manager?matchOnUriPrefix=true&sessionSupport=true&requestBufferSize=65536&responseBufferSize=65536&responseHeaderSize=32768";

			if (scp != null) {
				JettyHttpEndpoint jettyEndpoint = camelManagerContext.getEndpoint(fromUri, JettyHttpEndpoint.class);
				jettyEndpoint.setSslContextParameters(scp);
			}

			camelManagerContext.addRoutes(new RouteBuilder() {
				@Override
				public void configure() {
					from(fromUri).routeId("MiddlewareManagerRoute").setProperty(CONTEXTSLIST).constant(mainSpring.getCamelContexts()).setProperty("MAINSPRING").constant(mainSpring)
							.log(LoggingLevel.DEBUG, "Web manager, request received: ${id} - ${header[CamelHttpUri]}").bean("camelManager");
				}
			});
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addInternalDBRoute(CamelContext camelManagerContext) {
		if (enabled.equals(Constants.ENABLEINTERNALDB)) {
			final String fromUri = "elcotimer://internaldbtimer?period=28700&delay=60";
			try {
				camelManagerContext.addRoutes(new RouteBuilder() {
					@Override
					public void configure() {
						from(fromUri).routeId("CamelInternalDBRoute").setProperty(CONTEXTSLIST).constant(mainSpring.getCamelContexts())
								.log(LoggingLevel.DEBUG, "Internal db: remove old logs").bean("deleteoldlogs");
					}
				});
			} catch (Exception ex) {
				logger.error("", ex);
			}
		}
	}

	private void addMiddlewareCompressRoute(CamelContext camelManagerContext) {
		final String fromUri = "elcotimer://oldlogscompressiontimer?period=7200&delay=120";
		try {
			camelManagerContext.addRoutes(new RouteBuilder() {
				@Override
				public void configure() {
					from(fromUri).routeId("MiddlewareCompressRoute").log(LoggingLevel.DEBUG, "File: compress old logs").bean("compressionoldfilelogs");
				}
			});
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addMiddlewareDeleteRoute(CamelContext camelManagerContext) {
		final String fromUri = "elcotimer://oldlogsdeletetimer?period=9000&delay=180";
		try {
			camelManagerContext.addRoutes(new RouteBuilder() {
				@Override
				public void configure() {
					from(fromUri).routeId("MiddlewareDeleteRoute").setProperty(CONTEXTSLIST).constant(mainSpring.getCamelContexts())
							.log(LoggingLevel.DEBUG, "File: delete old logs").bean("deleteoldfilelogs");
				}
			});
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addMiddlewareSendInfoMail(CamelContext camelManagerContext) {
		final String fromUri = "elcotimer://sendinfomail?period=300&delay=240";
		try {
			camelManagerContext.addRoutes(new RouteBuilder() {
				@Override
				public void configure() {
					from(fromUri).routeId("MiddlewareSendInfoMail").setProperty(CONTEXTSLIST).constant(mainSpring.getCamelContexts())
							.log(LoggingLevel.DEBUG, "Call sendInfoMail bean").bean("sendInfoMail");
				}
			});
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addMiddlewareDeleteExternalLogsRoute(CamelContext camelManagerContext) {
		final String fromUri = "elcotimer://oldlogsdeleteexternaltimer?period=28900&delay=300";
		try {
			camelManagerContext.addRoutes(new RouteBuilder() {
				@Override
				public void configure() {
					from(fromUri).routeId("MiddlewareDeleteExternalLogsRoute").log(LoggingLevel.DEBUG, "File: delete old external logs").bean("deleteoldexternalfilelogs");
				}
			});
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addMiddlewareMulticastConsumer(CamelContext camelManagerContext) {
		if (networkMulticastInterface != null) { // receive multicast message is enabled by default, if a capable network and multicast.xml file are present
			final String fromUri = "netty4:udp://" + networkMulticastIP + ":" + networkMulticastPort + "?decoders=#netty-length-decoder&sync=false&broadcast=true&networkInterface="
					+ networkMulticastInterface;
			try {
				camelManagerContext.addRoutes(new RouteBuilder() {
					@Override
					public void configure() {
						from(fromUri).routeId(Constants.MULTICASTNAMECONSUMER).bean("internalmulticastconsumer");
					}
				});
				logger.info("Multicast consumer started");
			} catch (Exception ex) {
				logger.error("", ex);
			}
		} else {
			logger.info("No multicast interface available for consumer");
		}
	}

	private void addMiddlewareMulticastProducer(CamelContext camelManagerContext) {
		if (enabled.equalsIgnoreCase(Constants.ENABLEMULTICASTPRODUCER)) {
			final String fromUri = "elcotimer://middlewaremulticastproducertimer?period=1&delay=1";
			final String toUri = "netty4:udp://" + networkMulticastIP + ":" + networkMulticastPort + "?useByteBuf=true&allowDefaultCodec=false&sync=false&broadcast=true";
			try {
				camelManagerContext.addRoutes(new RouteBuilder() {
					@Override
					public void configure() {
						from(fromUri).routeId(Constants.MULTICASTNAMEPRODUCER).setBody().constant(multicastMessage).log(LoggingLevel.TRACE, "Send multicast message").to(toUri);
					}
				});
			} catch (Exception ex) {
				logger.error("", ex);
			}
		} else {
			logger.info("Multicast producer disabled");
		}
	}
}
