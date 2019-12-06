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

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.BootException;
import elco.telnetd.util.StringUtil;

/**
 * This class implements a Manager Singleton that takes care for all shells to be offered.<br>
 * <p/>
 * The resources can be defined via properties that contain following information:
 * <ul>
 * <li>All system defined shells:
 * <ol>
 * <li>Login: first shell run on top of the connection.
 * <li>Queue: shell thats run for connections placed into the queue.
 * <li>Admin: shell for administrative tasks around the embedded telnetd.
 * </ol>
 * <li>Custom defined shells:<br>
 * Declared as value to the <em>customshells</em> key, in form of a comma seperated list of names. For each declared name there has to be an entry defining the shell.
 * </ul>
 * The definition of any shell is simply represented by a fully qualified class name, of a class that implements the shell interface. Please read the documentation of this
 * interface carefully.<br>
 * The properties are passed on creation through the factory method, which is called by the net.wimpi.telnetd.TelnetD class.
 *
 * @see elco.telnetd.shell.Shell
 */
public final class ShellManager {

	private static Logger logger = LoggerFactory.getLogger(ShellManager.class);
	private static ShellManager cSelf; // Singleton reference
	private HashMap<String, Class<?>> mShells; // data structure for shells

	private ShellManager() {
	}// constructor

	/**
	 * Private constructor, instance can only be created via the public factory method.
	 */
	private ShellManager(HashMap<String, String> shells) {
		cSelf = this;
		mShells = new HashMap<>(shells.size());
		setupShells(shells);
	}

	/**
	 * Accessor method for shells that have been set up.<br>
	 * Note that it uses a factory method that any shell should provide via a specific class operation.<br>
	 *
	 * @param key
	 *            String that represents a shell name.
	 * @return Shell instance that has been obtained from the factory method.
	 */
	public Shell getShell(String key) {
		Shell myShell = null;
		try {
			if (!mShells.containsKey(key)) {
				return null;
			}
			Class<?> shclass = mShells.get(key);
			Method factory = shclass.getMethod("createShell", (Class<?>[]) null);
			logger.debug("[Factory Method] " + factory.toString());
			myShell = (Shell) factory.invoke(shclass, (Object[]) null);
		} catch (Exception e) {
			logger.error("getShell()", e);
		}

		return myShell;
	}

	/**
	 * Method to initialize the system and custom shells whose names and classes are stored as keys within the shells.
	 * <p/>
	 * It allows other initialization routines to prepare shell specific resources. This is a similar procedure as used for Servlets.
	 */
	private void setupShells(HashMap<String, String> shells) {
		String sh;
		String shclassstr;
		// temporary storage for fully qualified classnames,
		// serves the purpose of not loading classes twice.
		HashMap<String, Class<?>> shellclasses = new HashMap<>(shells.size());

		for (Iterator<String> iter = shells.keySet().iterator(); iter.hasNext();) {
			try {
				// first we get the key
				sh = iter.next();
				// then the fully qualified shell class string
				shclassstr = shells.get(sh);
				logger.debug("Preparing Shell [" + sh + "] " + shclassstr);
				// now we check if the class is already loaded.
				// If,then we reference the same class object and thats it
				if (shellclasses.containsKey(shclassstr)) {
					mShells.put(sh, shellclasses.get(shclassstr));
					logger.debug("Class [" + shclassstr + "] already loaded, using cached class object.");
				} else {
					// we get the class object (e.g. load it because its new)
					Class<?> shclass = Class.forName(shclassstr);
					// and put it to the shells, plus our "class object cache"
					mShells.put(sh, shclass);
					shellclasses.put(shclassstr, shclass);
					logger.debug("Class [" + shclassstr + "] loaded and class object cached.");
				}
			} catch (Exception e) {
				logger.error("setupShells()", e);
			}
		}
	}

	/**
	 * Factory method for creating the Singleton instance of this class.<br>
	 * Note that this factory method is called by the net.wimpi.telnetd.TelnetD class.
	 *
	 * @param settings
	 *            Properties defining the shells as described in the class documentation.
	 * @return ShellManager Singleton instance.
	 */
	public static ShellManager createShellManager(Properties settings) throws BootException {
		// Loading and applying settings
		try {
			logger.debug("createShellManager()");
			HashMap<String, String> shells = new HashMap<>();
			// Custom shell definitions
			String sh = settings.getProperty("shells");
			if (sh != null) {
				String[] customshs = StringUtil.split(sh, ",");
				for (int z = 0; z < customshs.length; z++) {
					// we get the shell
					sh = settings.getProperty("shell." + customshs[z] + ".class");
					if (sh == null) {
						throw new BootException("Shell " + customshs[z] + " declared but not defined.");
					}
					shells.put(customshs[z], sh);
				}
			}

			// construct manager
			return new ShellManager(shells);
		} catch (Exception ex) {
			throw new BootException("Creating ShellManager Instance failed", ex);
		}
	}

	/**
	 * Accessor method for the Singleton instance of this class.<br>
	 * Note that it returns null if the instance was not properly created beforehand.
	 *
	 * @return ShellManager Singleton instance reference.
	 */
	public static ShellManager getReference() {
		return cSelf;
	}
}
