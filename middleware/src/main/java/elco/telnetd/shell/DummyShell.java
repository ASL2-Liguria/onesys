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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.io.BasicTerminalIO;
import elco.telnetd.io.TerminalIO;
import elco.telnetd.io.terminal.ColorHelper;
import elco.telnetd.io.terminal.TerminalManager;
import elco.telnetd.io.toolkit.BufferOverflowException;
import elco.telnetd.io.toolkit.Checkbox;
import elco.telnetd.io.toolkit.Editarea;
import elco.telnetd.io.toolkit.Editfield;
import elco.telnetd.io.toolkit.InputFilter;
import elco.telnetd.io.toolkit.Label;
import elco.telnetd.io.toolkit.Pager;
import elco.telnetd.io.toolkit.Point;
import elco.telnetd.io.toolkit.Selection;
import elco.telnetd.io.toolkit.Statusbar;
import elco.telnetd.io.toolkit.Titlebar;
import elco.telnetd.net.Connection;
import elco.telnetd.net.ConnectionData;
import elco.telnetd.net.ConnectionEvent;

/**
 * This class is an example implementation of a Shell.<br>
 * It is used for testing the system.<br>
 * At the moment you can see all io toolkit classes in action, pressing "t" at its prompt (instead of the enter, which is requested for logging out again).
 */
public class DummyShell implements Shell {

	private static Logger log = LoggerFactory.getLogger(DummyShell.class);
	private Connection mConnection;
	private BasicTerminalIO mIO;
	private Editfield mEF;

	// Constants
	private static final String LOGO = "/***\n" + "* \n" + "* TelnetD library (embeddable telnet daemon)\n" + "* Copyright (C) 2000-2005 Dieter Wimberger\n" + "***/\n"
			+ "A looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo" + "oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
			+ "oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo" + "ng line!";

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
			mIO = mConnection.getTerminalIO();
			// dont forget to register listener
			mConnection.addConnectionListener(this);

			// clear the screen and start from zero
			mIO.eraseScreen();
			mIO.homeCursor();

			// We just read any key
			mIO.write("Dummy Shell. Please press enter to logout!\r\n");
			mIO.flush();
			boolean done = false;
			while (!done) {
				int i = mIO.read();
				if (i == -1 || i == -2) {
					log.debug("Input(Code):" + i);
					done = true;
				}
				if (i == 10) {
					done = true;

				} else if (i == 117) {

					ConnectionData cd = mConnection.getConnectionData();
					// output header
					mIO.write(BasicTerminalIO.CRLF + "DEBUG: Active Connection" + BasicTerminalIO.CRLF);
					mIO.write("------------------------" + BasicTerminalIO.CRLF);

					// output connection data
					mIO.write("Connected from: " + cd.getHostName() + "[" + cd.getHostAddress() + ":" + cd.getPort() + "]" + BasicTerminalIO.CRLF);
					mIO.write("Guessed Locale: " + cd.getLocale() + BasicTerminalIO.CRLF);
					mIO.write(BasicTerminalIO.CRLF);
					// output negotiated terminal properties
					mIO.write("Negotiated Terminal Type: " + cd.getNegotiatedTerminalType() + BasicTerminalIO.CRLF);
					mIO.write("Negotiated Columns: " + cd.getTerminalColumns() + BasicTerminalIO.CRLF);
					mIO.write("Negotiated Rows: " + cd.getTerminalRows() + BasicTerminalIO.CRLF);

					// output of assigned terminal instance (the cast is a hack, please
					// do not copy for other TCommands, because it would break the
					// decoupling of interface and implementation!
					mIO.write(BasicTerminalIO.CRLF);
					mIO.write("Assigned Terminal instance: " + ((TerminalIO) mIO).getTerminal());
					mIO.write(BasicTerminalIO.CRLF);
					mIO.write("Environment: " + cd.getEnvironment().toString());
					mIO.write(BasicTerminalIO.CRLF);
					// output footer
					mIO.write("-----------------------------------------------" + BasicTerminalIO.CRLF + BasicTerminalIO.CRLF);

					mIO.flush();

				} else if (i == 'e') {
					// run editfield test
					Label l = new Label(mIO, "testedit", "TestEdit: ");
					mEF = new Editfield(mIO, "edit", 50);
					mEF.registerInputFilter(new InputFilter() {
						@Override
						public int filterInput(int key) throws IOException {
							if (key == 't') {
								try {
									mEF.setValue("Test");
								} catch (BufferOverflowException ex) {
									log.error("", ex);
								}
								return InputFilter.INPUT_HANDLED;
							} else if (key == 'c') {
								mEF.clear();
								return InputFilter.INPUT_HANDLED;
							} else {
								return key;
							}
						}
					});
					l.draw();
					mEF.run();
				} else if (i == 116) {
					// run test sequence
					Pager pg = new Pager(mIO);
					pg.setShowPosition(true);
					pg.page(LOGO + LOGO + LOGO + LOGO + LOGO + LOGO + LOGO + LOGO + LOGO + LOGO + LOGO);

					Label l = new Label(mIO, "label1");
					l.setText("Hello World!");
					l.setLocation(new Point(1, 5));
					l.draw();
					mIO.flush();

					mIO.homeCursor();
					mIO.eraseScreen();
					Titlebar tb = new Titlebar(mIO, "title 1");
					tb.setTitleText("MyTitle");
					tb.setAlignment(Titlebar.ALIGN_CENTER);
					tb.setBackgroundColor(ColorHelper.BLUE);
					tb.setForegroundColor(ColorHelper.YELLOW);
					tb.draw();

					Statusbar sb = new Statusbar(mIO, "status 1");
					sb.setStatusText("MyStatus");
					sb.setAlignment(Statusbar.ALIGN_LEFT);
					sb.setBackgroundColor(ColorHelper.BLUE);
					sb.setForegroundColor(ColorHelper.YELLOW);
					sb.draw();

					mIO.flush();

					mIO.setCursor(2, 1);

					Selection sel = new Selection(mIO, "selection 1");
					String[] tn = TerminalManager.getReference().getAvailableTerminals();

					for (int n = 0; n < tn.length; n++) {
						sel.addOption(tn[n]);
					}

					sel.setLocation(1, 10);
					sel.run();

					Checkbox cb = new Checkbox(mIO, "checkbox 1");
					cb.setText("Check me !");
					cb.setLocation(1, 12);
					cb.run();

					Editfield ef = new Editfield(mIO, "editfield 1", 20);
					ef.setLocation(1, 13);
					ef.run();
					try {
						ef.setValue("SETVALUE!");
					} catch (Exception ex) {
						log.error("", ex);
					}
					Editfield ef2 = new Editfield(mIO, "editfield 2", 8);
					ef2.setLocation(1, 14);
					ef2.setPasswordField(true);
					ef2.run();

					log.debug("Your secret password was:" + ef2.getValue());
					mIO.flush();

					// clear the screen and start from zero
					mIO.eraseScreen();
					mIO.homeCursor();
					Titlebar tb2 = new Titlebar(mIO, "title 1");
					tb2.setTitleText("jEditor v0.1");
					tb2.setAlignment(Titlebar.ALIGN_LEFT);
					tb2.setBackgroundColor(ColorHelper.BLUE);
					tb2.setForegroundColor(ColorHelper.YELLOW);
					tb2.draw();

					Statusbar sb2 = new Statusbar(mIO, "status 1");
					sb2.setStatusText("Status");
					sb2.setAlignment(Statusbar.ALIGN_LEFT);
					sb2.setBackgroundColor(ColorHelper.BLUE);
					sb2.setForegroundColor(ColorHelper.YELLOW);
					sb2.draw();

					mIO.setCursor(2, 1);

					Editarea ea = new Editarea(mIO, "area", mIO.getRows() - 2, 100);
					mIO.flush();
					ea.run();
					log.debug(ea.getValue());

					mIO.eraseScreen();
					mIO.homeCursor();
					mIO.write("Dummy Shell. Please press enter to logout!\r\n");
					mIO.flush();
				}
				// the next line is for debug reasons
				else {
					log.debug("Input(Code):" + i);
				}
			}
			mIO.homeCursor();
			mIO.eraseScreen();
			mIO.write("Goodbye!.\r\n\r\n");
			mIO.flush();

		} catch (Exception ex) {
			log.error("run()", ex);
		}
	}

	// this implements the ConnectionListener!
	@Override
	public void connectionTimedOut(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION_TIMEDOUT");
			mIO.flush();
			// close connection
			mConnection.close();
		} catch (Exception ex) {
			log.error("connectionTimedOut()", ex);
		}
	}

	@Override
	public void connectionIdle(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION_IDLE");
			mIO.flush();
		} catch (IOException e) {
			log.error("connectionIdle()", e);
		}

	}

	@Override
	public void connectionLogoutRequest(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION_LOGOUTREQUEST");
			mIO.flush();
		} catch (Exception ex) {
			log.error("connectionLogoutRequest()", ex);
		}
	}

	@Override
	public void connectionSentBreak(ConnectionEvent ce) {
		try {
			mIO.write("CONNECTION_BREAK");
			mIO.flush();
		} catch (Exception ex) {
			log.error("connectionSentBreak()", ex);
		}
	}

	public static Shell createShell() {
		return new DummyShell();
	}
}
