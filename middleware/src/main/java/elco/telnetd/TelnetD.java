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
package elco.telnetd;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;

import elco.telnetd.io.terminal.TerminalManager;
import elco.telnetd.net.PortListener;
import elco.telnetd.shell.ShellManager;
import elco.telnetd.util.PropertiesLoader;
import elco.telnetd.util.StringUtil;

/**
 * Class that implements a configurable and embeddable telnet daemon.
 */
public final class TelnetD {

	private static final String VERSION = "2.1";
	private static TelnetD cSelf = null; // reference of the running singleton
	private final List<PortListener> mListeners;
	private ShellManager mShellManager;

	/**
	 * Constructor creating a TelnetD instance.<br>
	 * Private so that only the factory method can create the singleton instance.
	 */
	private TelnetD() {
		cSelf = this; // sets the singleton reference
		mListeners = new ArrayList<>(5);
	}

	/**
	 * Start this telnet daemon, respectively all configured listeners.<br>
	 */
	public void start() {
		for (int i = 0; i < mListeners.size(); i++) {
			PortListener plis = mListeners.get(i);
			plis.start();
		}
	}

	/**
	 * Stop this telnet daemon, respectively all configured listeners.
	 */
	public void stop() {
		for (int i = 0; i < mListeners.size(); i++) {
			PortListener plis = mListeners.get(i);
			// shutdown the Portlistener resources
			plis.stop();
		}
	}

	/**
	 * Accessor method to version information.
	 *
	 * @return String that contains version information.
	 */
	public String getVersion() {
		return VERSION;
	}

	/**
	 * Method to prepare the ShellManager.<br>
	 * Creates and prepares a Singleton instance of the ShellManager, with settings from the passed in Properties.
	 *
	 * @param settings
	 *            Properties object that holds main settings.
	 * @throws BootException
	 *             if preparation fails.
	 */
	private void prepareShellManager(Properties settings) throws BootException {
		// use factory method for creating mgr singleton
		mShellManager = ShellManager.createShellManager(settings);
		if (mShellManager == null) {
			throw new BootException("Shell manager creation error");
		}
	}

	/**
	 * Method to prepare the PortListener.<br>
	 * Creates and prepares and runs a PortListener, with settings from the passed in Properties. Yet the Listener will not accept any incoming connections before startServing()
	 * has been called. this has the advantage that whenever a TelnetD Singleton has been factorized, it WILL 99% not fail any longer (e.g. serve its purpose).
	 *
	 * @param settings
	 *            Properties object that holds main settings.
	 * @throws BootException
	 *             if preparation fails.
	 */
	private void prepareListener(String name, Properties settings) throws BootException {
		// factorize PortListener
		PortListener listener = PortListener.createPortListener(name, settings);
		// start the Thread derived PortListener
		try {
			mListeners.add(listener);
		} catch (Exception ex) {
			throw new BootException("Failure while starting PortListener thread", ex);
		}
	}

	private void prepareTerminals(Properties terminals) throws BootException {
		TerminalManager.createTerminalManager(terminals);
	}

	/**
	 * Returns a {@link PortListener} for the given identifier.
	 *
	 * @param id
	 *            the identifier of the {@link PortListener} instance.
	 * @return {@link PortListener} instance or null if an instance with the given identifier does not exist.
	 */
	public PortListener getPortListener(String id) {
		if (StringUtils.isEmpty(id)) {
			return null;
		}
		for (Iterator<PortListener> iterator = mListeners.iterator(); iterator.hasNext();) {
			PortListener portListener = iterator.next();
			if (portListener.getName().equals(id)) {
				return portListener;
			}
		}

		return null;
	}

	/**
	 * Factory method to create a TelnetD Instance.
	 *
	 * @param main
	 *            Properties object with settings for the TelnetD.
	 * @return TenetD instance that has been properly set up according to the passed in properties, and is ready to start serving.
	 * @throws BootException
	 *             if the setup process fails.
	 */
	public static TelnetD createTelnetD(Properties main) throws BootException {
		if (cSelf == null) {
			TelnetD td = new TelnetD();
			td.prepareShellManager(main);
			td.prepareTerminals(main);
			String[] listnames = StringUtil.split(main.getProperty("listeners"), ",");
			for (int i = 0; i < listnames.length; i++) {
				td.prepareListener(listnames[i], main);
			}
			return td;
		}
		throw new BootException("Singleton already instantiated.");
	}

	/**
	 * Factory method to create a TelnetD singleton instance, loading the standard properties files from the given String containing an URL location.<br>
	 *
	 * @param urlprefix
	 *            String containing an URL prefix.
	 * @return TenetD instance that has been properly set up according to the passed in properties, and is ready to start serving.
	 * @throws BootException
	 *             if the setup process fails.
	 */
	public static TelnetD createTelnetD(String urlprefix) throws BootException {
		try {
			return createTelnetD(PropertiesLoader.loadProperties(urlprefix));
		} catch (IOException ex) {
			throw new BootException("Failed to load configuration from given URL", ex);
		}
	}

	public static TelnetD createTelnetD(URL url) throws BootException {
		try {
			return createTelnetD(PropertiesLoader.loadProperties(url));
		} catch (IOException ex) {
			throw new BootException("Failed to load configuration from given URL", ex);
		}
	}

	/**
	 * Accessor method for the Singleton instance of this class.<br>
	 *
	 * @return TelnetD Singleton instance reference.
	 */
	public static TelnetD getReference() {
		if (cSelf != null) {
			return cSelf;
		}
		return null;
	}
}
