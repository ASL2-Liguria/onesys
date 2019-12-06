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
package elco.telnetd.io.terminal;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.BootException;
import elco.telnetd.util.StringUtil;

/**
 * Class that manages all available terminal implementations.<br>
 * Configuration is stored in a properties file (normally Terminals.properties).
 */
public class TerminalManager {

	private static Logger log = LoggerFactory.getLogger(TerminalManager.class);
	private static TerminalManager cSelf; // Singleton reference
	private final HashMap<String, Terminal> mTerminals; // datastructure for terminals
	private boolean mWindoofHack = false;

	/**
	 * Private constructor, instance can only be created via the public factory method.
	 */
	private TerminalManager() {
		cSelf = this;
		mTerminals = new HashMap<>(25);
	}// constructor

	/**
	 * Returns a reference to a terminal that has been set up, regarding to the key given as parameter.<br>
	 * If the key does not represent a terminal name or any alias for any terminal, then the returned terminal will be a default basic terminal (i.e. vt100 without color support).
	 *
	 * @param key
	 *            String that represents a terminal name or an alias.
	 * @return Terminal instance or null if the key was invalid.
	 */
	public Terminal getTerminal(String key) {
		Terminal term = null;

		try {
			if ("ANSI".equals(key) && mWindoofHack) {
				// this is a hack, sorry folks but the *grmpflx* *censored*
				// windoof telnet application thinks its uppercase ansi *brr*
				term = mTerminals.get("windoof");
			} else {
				key = key.toLowerCase();
				if (!mTerminals.containsKey(key)) {
					term = mTerminals.get("default");
				} else {
					term = mTerminals.get(key);
				}
			}
		} catch (Exception e) {
			log.error("getTerminal()", e);
		}

		return term;
	}// getTerminal

	public String[] getAvailableTerminals() {
		// unroll hashtable keys into string array
		// maybe not too efficient but well
		String[] tn = new String[mTerminals.size()];
		int i = 0;
		for (Iterator<String> iter = mTerminals.keySet().iterator(); iter.hasNext(); i++) {
			tn[i] = iter.next();
		}
		return tn;
	}// getAvailableTerminals

	private void setWindoofHack(boolean b) {
		mWindoofHack = b;
	}// setWinHack

	/**
	 * Loads the terminals and prepares an instance of each.
	 */
	private void setupTerminals(HashMap<String, Object[]> terminals) {
		String termname;
		String termclass;
		Terminal term;
		Object[] entry;

		for (Iterator<String> iter = terminals.keySet().iterator(); iter.hasNext();) {
			try {
				// first we get the name
				termname = iter.next();

				// then the entry
				entry = terminals.get(termname);

				// then the fully qualified class string
				termclass = (String) entry[0];
				log.debug("Preparing terminal [" + termname + "] " + termclass);

				// get a new class object instance (e.g. load class and instantiate it)
				term = (Terminal) Class.forName(termclass).newInstance();

				// and put an instance + references into myTerminals
				mTerminals.put(termname, term);
				String[] aliases = (String[]) entry[1];
				for (int i = 0; i < aliases.length; i++) {
					// without overwriting existing !!!
					if (!mTerminals.containsKey(aliases[i])) {
						mTerminals.put(aliases[i], term);
					}
				}

			} catch (Exception e) {
				log.error("setupTerminals()", e);
			}

		}
		// check if we got all
		log.debug("Terminals:");
		for (Iterator<String> iter = mTerminals.keySet().iterator(); iter.hasNext();) {
			String tn = iter.next();
			log.debug(tn + "=" + mTerminals.get(tn));
		}
	}// setupTerminals

	/**
	 * Factory method for creating the Singleton instance of this class.<br>
	 * Note that this factory method is called by the net.wimpi.telnetd.TelnetD class.
	 *
	 * @param settings
	 *            Properties defining the terminals as described in the class documentation.
	 * @return TerminalManager Singleton instance.
	 */
	public static TerminalManager createTerminalManager(Properties settings) throws BootException {
		HashMap<String, Object[]> terminals = new HashMap<>(20); // a storage for class
		// names and aliases

		boolean defaultFlag = false; // a flag for the default
		TerminalManager tmgr = new TerminalManager();

		// Loading and applying settings
		try {
			log.debug("Creating terminal manager.....");
			boolean winhack = Boolean.parseBoolean(settings.getProperty("terminals.windoof"));

			// Get the declared terminals
			String terms = settings.getProperty("terminals");
			if (terms == null) {
				log.debug("No terminals declared.");
				throw new BootException("No terminals declared.");
			}

			// split the names
			String[] tn = StringUtil.split(terms, ",");

			// load fully qualified class name and aliases for each
			// storing it in the Hashtable within an objectarray of two slots
			Object[] entry;
			String[] aliases;
			for (int i = 0; i < tn.length; i++) {
				entry = new Object[2];
				// load fully qualified classname
				entry[0] = settings.getProperty("term." + tn[i] + ".class");
				// load aliases and store as Stringarray
				aliases = StringUtil.split(settings.getProperty("term." + tn[i] + ".aliases"), ",");
				for (int n = 0; n < aliases.length; n++) {
					// ensure default declared only once as alias
					if (aliases[n].equalsIgnoreCase("default")) {
						if (!defaultFlag) {
							defaultFlag = true;
						} else {
							throw new BootException("Only one default can be declared.");
						}
					}
				}
				entry[1] = aliases;
				// store
				terminals.put(tn[i], entry);
			}
			if (!defaultFlag) {
				throw new BootException("No default terminal declared.");
			}

			// construct manager
			tmgr = new TerminalManager();
			tmgr.setWindoofHack(winhack);
			tmgr.setupTerminals(terminals);

			return tmgr;

		} catch (Exception ex) {
			log.error("createManager()", ex);
			throw new BootException("Creating TerminalManager Instance failed:\n" + ex.getMessage());
		}
	}// createManager

	/**
	 * Accessor method for the Singleton instance of this class.<br>
	 * Note that it returns null if the instance was not properly created beforehand.
	 *
	 * @return TerminalManager Singleton instance reference.
	 */
	public static TerminalManager getReference() {
		return cSelf;
	}// getReference
}
