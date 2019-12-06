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
package elco.telnetd.shell;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.camel.CamelContext;
import org.apache.commons.collections4.queue.CircularFifoQueue;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.CamelMain;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.insc.GenericUtils;
import elco.telnetd.io.BasicTerminalIO;
import elco.telnetd.io.TerminalIO;
import elco.telnetd.net.Connection;
import elco.telnetd.net.ConnectionEvent;

/**
 * @author Roberto Rizzo
 */
public final class MiddlewareShell implements Shell {

	private static final Logger logger = LoggerFactory.getLogger(MiddlewareShell.class);
	private static final char ASTERISK = 42;
	private final StringBuilder inputLine = new StringBuilder();
	private final CircularFifoQueue<String> oldCommands = new CircularFifoQueue<>(10);
	private Connection mConnection;
	private BasicTerminalIO mIO;
	private boolean needpwd = true;
	private int ccIndex = 0;
	private StringTokenizer st;
	private String command;
	private boolean done = false;
	private String hostAddress;

	/**
	 * Method that runs a shell
	 *
	 * @param con
	 *            Connection that runs the shell.
	 */
	@Override
	public void run(Connection con) {
		try {
			mConnection = con;
			hostAddress = mConnection.getConnectionData().getHostAddress();
			mIO = mConnection.getTerminalIO();
			mConnection.addConnectionListener(this);

			clearScreen();

			writePositiveMessage("Connected to ELCOMiddleware telnet server from " + hostAddress + BasicTerminalIO.CRLF);
			mIO.flush();

			mainCycle();
		} catch (Exception ex) {
			logger.error("", ex);
		} finally {
			exitMessage();
		}
	}

	@Override
	public void connectionTimedOut(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION TIMEDOUT" + BasicTerminalIO.CRLF);
			exitMessage();
			FileUtils.safeClose(mIO);
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	@Override
	public void connectionIdle(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION IDLE" + BasicTerminalIO.CRLF);
			mIO.flush();
		} catch (IOException ex) {
			logger.error("", ex);
		}

	}

	@Override
	public void connectionLogoutRequest(ConnectionEvent ce) {
		done = true;
		logger.debug("Connection logout request");
	}

	@Override
	public void connectionSentBreak(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION BREAK" + BasicTerminalIO.CRLF);
			mIO.flush();
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	/**
	 * @return instance implementing Shell interface
	 */
	public static Shell createShell() {
		return new MiddlewareShell();
	}

	private void exitMessage() {
		try {
			mIO.write("Bye!" + BasicTerminalIO.CRLF + BasicTerminalIO.CRLF);
			mIO.flush();
		} catch (Exception ex) { // NOSONAR
		}
	}

	private void executeCommand(String command, StringTokenizer st) throws IOException { // NOSONAR
		switch (command) {
		case "h":
			help();
			break;
		case "rcl":
			resetContextClassLoader(st);
			break;
		case "clt":
			getCclCreationTime(st);
			break;
		case "rsc":
			reloadSpringConfigurations();
			break;
		case "lcs":
			listContexts();
			break;
		case "lcr":
			listContextRoutes(st);
			break;
		case "emc":
			emptyContextCache(st);
			break;
		case "mif":
			memoryInfo();
			break;
		case "cls":
			clearScreen();
			break;
		case "ssr":
			startStopRoute(st);
			break;
		case "lll":
			listLoggersLevel();
			break;
		case "sll":
			setLoggerLevel(st);
			break;
		case "aci":
			addContextInterceptor(st);
			break;
		case "rci":
			removeContextInterceptor(st);
			break;
		case "q":
			clearScreen();
			writePositiveMessage("Logout");
			done = true; // exit
			break;
		default:
			mIO.bell();
			writeError("Unknown command: " + command);
			writeEvidence("Try h for a list of commands");
		}
	}

	private void addContextInterceptor(StringTokenizer st) throws IOException {
		if (st.countTokens() != 1) {
			writeError("Usage: aci contextName");
			return;
		}

		String contextName = st.nextToken();
		boolean added = CamelMain.addContextInterceptor(contextName);
		if (added) {
			reloadSpringConfigurations();
			writeMessage("Added intercept strategy to context " + contextName);
		} else {
			writeError("Can't add intercept strategy to context " + contextName);
		}
	}

	private void removeContextInterceptor(StringTokenizer st) throws IOException {
		if (st.countTokens() != 1) {
			writeError("Usage: rci contextName");
			return;
		}

		String contextName = st.nextToken();
		boolean removed = CamelMain.removeContextInterceptor(contextName);
		if (removed) {
			reloadSpringConfigurations();
			writeMessage("Removed intercept strategy from context " + contextName);
		} else {
			writeError("Can't remove intercept strategy from context " + contextName);
		}
	}

	private void getCclCreationTime(StringTokenizer st) throws IOException {
		if (st.countTokens() != 1) {
			writeError("Usage: clt contextName");
			return;
		}

		String creationTime = CamelMain.getCclCreationTime(st.nextToken());
		if (!StringUtils.isEmpty(creationTime)) {
			writeMessage(creationTime);
		} else {
			writeError("Can't retrieve creation time");
		}
	}

	private void memoryInfo() throws IOException {
		Runtime runtime = Runtime.getRuntime();
		long maxMB = runtime.maxMemory() / Constants.ONEMBBYTES;
		long totalMB = runtime.totalMemory() / Constants.ONEMBBYTES;
		long freeMB = runtime.freeMemory() / Constants.ONEMBBYTES;
		writeMessage("Max memory = " + maxMB + " MB" + BasicTerminalIO.CRLF + "Total memory = " + totalMB + " MB" + BasicTerminalIO.CRLF + "Free memory = " + freeMB + " MB");
	}

	private void clearScreen() throws IOException {
		mIO.eraseScreen();
		mIO.homeCursor();
	}

	private void setLoggerLevel(StringTokenizer st) throws IOException {
		if (st.countTokens() != 2) {
			writeError("Usage: sll loggerName level");
			return;
		}

		String loggerName = st.nextToken();
		String logLevel = st.nextToken();
		CamelMain.setLoggerLevel(loggerName, logLevel);
	}

	private void listLoggersLevel() throws IOException {
		Map<String, String> loggersLevel = CamelMain.listLoggersLevel();
		Iterator<String> loggersName = loggersLevel.keySet().iterator();
		while (loggersName.hasNext()) {
			String name = loggersName.next();
			String logLevel = loggersLevel.get(name);
			writeMessage(name + ": " + logLevel);
		}
	}

	private void startStopRoute(StringTokenizer st) throws IOException {
		if (st.countTokens() != 3) {
			writeError("Usage: ssr contextName routeId command");
			return;
		}

		String contextName = st.nextToken();
		String routeId = st.nextToken();
		String command = st.nextToken(); // NOSONAR
		int status = CamelMain.startStopRoute(contextName, routeId, command);
		if (status == 0) {
			writePositiveMessage(command + " operation completed successefully");
		} else {
			writeError(command + " operation not completed");
		}
	}

	private void emptyContextCache(StringTokenizer st) throws IOException {
		if (st.countTokens() != 2) {
			writeError("Usage: emc contextName cacheUri");
			return;
		}

		String camelContextName = st.nextToken();
		String endPointUri = st.nextToken();
		int status = CamelMain.emptyCache(camelContextName, endPointUri);
		logger.debug("Cache {} for context {} cleared. Status = {}", endPointUri, camelContextName, status == 0 ? "OK" : "KO");
		if (status == 0) {
			writePositiveMessage("Cache empty");
		} else {
			writeError("Error emptying cache");
		}
	}

	private void reloadSpringConfigurations() throws IOException {
		writePositiveMessage("Configuration reload started");
		CamelMain.reloadCamelConfigurations();
		writePositiveMessage("Configuration reload done");
		writePositiveMessage("Starting AC service");
		boolean isACServiceStarted = CamelMain.isACServiceStarted();
		while (!isACServiceStarted) {
			GenericUtils.threadSleep(Constants.ONESECONDMILLISECONDS);
			isACServiceStarted = CamelMain.isACServiceStarted();
		}
		writePositiveMessage("AC service started");
	}

	private void listContexts() throws IOException {
		if (st.countTokens() != 0) {
			writeError("Usage: lcs");
			return;
		}

		List<CamelContext> contexts = CamelMain.listContexts();
		for (CamelContext ctx : contexts) {
			if (!ctx.getName().equals(Constants.camelManagerContext)) {
				writeMessage(ctx.getName());
			}
		}
	}

	private void listContextRoutes(StringTokenizer st) throws IOException {
		if (st.countTokens() != 1) {
			writeError("Usage: lcr contextName");
			return;
		}

		String contextName = st.nextToken();
		List<String> contextRoutes = CamelMain.listContextRoutes(contextName);
		for (String route : contextRoutes) {
			writeMessage(route);
		}
	}

	private void resetContextClassLoader(StringTokenizer st) throws IOException {
		if (st.countTokens() != 1) {
			writeError("Usage: rcl contextName");
			return;
		}

		String camelContextName = st.nextToken();
		logger.debug("Reset class loader for context {}", camelContextName);
		int status = CamelMain.resetCcl(camelContextName);
		logger.debug("Resetted class loader for context {}. Status = {}", camelContextName, status == 0 ? "OK" : "KO");
		if (status == 0) {
			writePositiveMessage("Class loader resetted");
		} else {
			writeError("Error resetting class loader");
		}
	}

	private void help() throws IOException {
		writeEvidence("Commands list:" + BasicTerminalIO.CRLF +
				"aci contextName (add a strategy interceptor to the context and reload spring's configurations)" + BasicTerminalIO.CRLF +
				"cls (clear screen)" + BasicTerminalIO.CRLF +
				"clt contextName (print class loader creation time)" + BasicTerminalIO.CRLF +
				"emc contextName cacheUri (empty context's cache)" + BasicTerminalIO.CRLF +
				"h (help)" + BasicTerminalIO.CRLF +
				"lcs (list configured contexts)" + BasicTerminalIO.CRLF +
				"lcr contextName (list context's routes)" + BasicTerminalIO.CRLF +
				"lll (list loggers's log level)" + BasicTerminalIO.CRLF +
				"mif (memory info)" + BasicTerminalIO.CRLF +
				"rci contextName (remove the strategy interceptor from the context and reload spring's configurations)" + BasicTerminalIO.CRLF +
				"rcl contextName (reset context's class loader)" + BasicTerminalIO.CRLF +
				"rsc (reload spring's configurations)" + BasicTerminalIO.CRLF +
				"sll loggerName level (set the log level of a logger)" + BasicTerminalIO.CRLF +
				"ssr contextName routeId command (start/stop a route)" + BasicTerminalIO.CRLF +
				"q (quit)");
	}

	private void deleteRow() throws IOException {
		for (int i = 0; i < inputLine.length(); i++) {
			deleteChar();
		}
		inputLine.setLength(0);
	}

	private void deleteChar() throws IOException {
		mIO.write((char) 8);
		mIO.write((char) 32);
		mIO.write((char) 8);
	}

	private void writeError(String message) throws IOException {
		writeMessage(message, BasicTerminalIO.RED);
	}

	private void writeEvidence(String message) throws IOException {
		writeMessage(message, BasicTerminalIO.YELLOW);
	}

	private void writePositiveMessage(String message) throws IOException {
		writeMessage(message, BasicTerminalIO.GREEN);
	}

	private void writeMessage(String message, int color) throws IOException {
		mIO.setBold(true);
		mIO.setForegroundColor(color);
		mIO.write(message + BasicTerminalIO.CRLF);
	}

	private void writeMessage(String message) throws IOException {
		writeMessage(message, BasicTerminalIO.WHITE);
	}

	private void mainCycle() throws IOException {
		while (!done) {
			if (needpwd) {
				mIO.write("password> "); // Print password prompt
			} else {
				mIO.write("command> "); // Print command prompt
			}
			mIO.flush();

			inputCycle();
			mIO.write(BasicTerminalIO.CRLF);
			mIO.flush();

			analyzeInputLine();
		}
	}

	private void inputCycle() throws IOException { // NOSONAR
		inputLine.setLength(0);

		int cr;
		while ((cr = mIO.read()) != TerminalIO.LF) { // 13 10
			if ((cr >= 32) && (cr <= 126)) {
				inputLine.append((char) cr);

				// I read the characters making the echo if I'm not requiring a password
				if (needpwd) {
					mIO.write(ASTERISK);
				} else {
					mIO.write((char) cr); // echo
				}
			} else if (cr == TerminalIO.UP && !oldCommands.isEmpty()) { // arrow up
				deleteRow();
				ccIndex = --ccIndex < 0 ? oldCommands.size() - 1 : ccIndex;
				inputLine.append(oldCommands.get(ccIndex));
				mIO.write(inputLine.toString());
			} else if (cr == TerminalIO.DOWN && !oldCommands.isEmpty()) { // arrow down
				deleteRow();
				ccIndex = ++ccIndex > oldCommands.size() - 1 ? 0 : ccIndex;
				inputLine.append(oldCommands.get(ccIndex));
				mIO.write(inputLine.toString());
			} else if ((cr == TerminalIO.DELETE || cr == TerminalIO.BACKSPACE) && inputLine.length() > 0) { // delete a character
				inputLine.setLength(inputLine.length() - 1);
				deleteChar();
			} else if (cr == TerminalIO.LEFT && !needpwd) {
				// mIO.moveLeft(1); NOSONAR
			} else if (cr == TerminalIO.RIGHT && !needpwd) {
				// mIO.moveRight(1); NOSONAR
			} else if (cr == TerminalIO.IOERROR) { // connection interrupted by the client
				throw new IOException("Connection with " + hostAddress + " reset by peer");
			} else if (cr == 0 && done) { // possible server shutdown in progress
				break;
			}
			mIO.flush();
		}
	}

	private void analyzeInputLine() throws IOException {
		if (inputLine.length() == 0) {
			return;
		}

		if (logger.isDebugEnabled() && !needpwd) {
			logger.debug("Read {} from {}", inputLine, hostAddress);
		}

		st = new StringTokenizer(inputLine.toString());
		if (st.hasMoreTokens()) {
			command = st.nextToken();
			if (needpwd) {
				if (!command.equals(Constants.DBPWD)) {
					mIO.eraseScreen();
					mIO.homeCursor();
					writeError("Login failed");
					mIO.flush();

					throw new IOException("Login from " + hostAddress + " failed");
				}
				needpwd = false;
				logger.info("Login from {} performed successfully", hostAddress);
				clearScreen();
				writePositiveMessage("Login performed successfully" + BasicTerminalIO.CRLF);
				mIO.flush();
			} else {
				String actualLine = inputLine.toString();
				oldCommands.remove(actualLine);
				oldCommands.add(actualLine);
				ccIndex = oldCommands.size();
				executeCommand(command, st);
				mIO.flush();
			}
		}
	}
}
