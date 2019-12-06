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
package elco.ldap;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.NoSuchAttributeException;
import javax.naming.directory.SearchResult;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Roberto Rizzo
 */
public final class LDAPUserProperties {

	private static Logger logger = LoggerFactory.getLogger(LDAPUserProperties.class);
	private static String attributesListSeparator = ",";
	private final String groupAttribute;
	private final HashMap<String, String> attributes = new HashMap<>(3);
	private final HashMap<String, String> ldapGroups = new HashMap<>(1);
	private static final int UF_ACCOUNTDISABLE = 0x00000002;
	private static final int UF_PASSWORD_EXPIRED = 0x00800000;
	private static final int UF_ACCOUNT_LOCKED = 0x00000010;
	private static final int UF_PASSWORD_NEVER_EXPIRE = 0x00010000;
	private static final Long UF_ACCOUNT_NEVER_EXPIRE = new Long("9223372036854775807");
	private long maxPwdAge = 0;
	private boolean passwordNeverExpire = false;
	public String nameSpace = null;
	public boolean accountDisabled = true;
	public boolean passwordExpired = true;
	public boolean accountLocked = true;
	public long daysAccountExpire = Integer.MAX_VALUE;
	public long daysPasswordExpire = Integer.MAX_VALUE;

	/**
	 * @param searchResult
	 *            LDAP search result
	 * @param maxPwdAge
	 *            max password age before expiration
	 * @param groupAttribute
	 * @throws NamingException
	 */
	public LDAPUserProperties(SearchResult searchResult, long maxPwdAge, String groupAttribute) throws NamingException {
		this.groupAttribute = groupAttribute;
		this.maxPwdAge = Math.abs(maxPwdAge);
		Attributes attrs = searchResult.getAttributes();
		if (attrs == null) {
			throw new NoSuchAttributeException("No attributes are present");
		}

		NamingEnumeration<? extends Attribute> eattrs = attrs.getAll();
		Attribute attr = null;
		while (eattrs.hasMore()) {
			try {
				attr = eattrs.next();
				String values = "";
				String separator = "";
				NamingEnumeration<?> egs = attr.getAll();
				while (egs.hasMore()) {
					String value = StringUtils.defaultIfEmpty(egs.next().toString(), "");
					values += separator + value;
					separator = attributesListSeparator;
				}
				attributes.put(attr.getID(), values);
			} catch (Exception ex) {
				String attrID = attr != null ? attr.getID() : "UNKNOWN";
				logger.warn("Problems inserting attribute " + attrID + " into HashMap of user's attributes", ex);
			}
		}

		// Maintain this sequence for methods call
		parseUserAccountControl();
		accountExpireDays();
		pwdExpireDays();
		getLDAPGroups();

		nameSpace = searchResult.getNameInNamespace();
	}

	/**
	 * Get attribute value
	 *
	 * @param key
	 *            key value
	 * @return attribute value
	 */
	public String getProperty(String key) {
		return StringUtils.defaultIfEmpty(attributes.get(key), "");
	}

	/**
	 * Get properties name
	 *
	 * @return an iterator over properties name
	 */
	public Iterator<String> getPropertiesName() {
		return attributes.keySet().iterator();
	}

	private void parseUserAccountControl() {
		try {
			int userAccountControl = Integer.parseInt(attributes.get("userAccountControl"));
			accountDisabled = (userAccountControl & UF_ACCOUNTDISABLE) == UF_ACCOUNTDISABLE;
			passwordExpired = (userAccountControl & UF_PASSWORD_EXPIRED) == UF_PASSWORD_EXPIRED;
			accountLocked = (userAccountControl & UF_ACCOUNT_LOCKED) == UF_ACCOUNT_LOCKED;
			passwordNeverExpire = (userAccountControl & UF_PASSWORD_NEVER_EXPIRE) == UF_PASSWORD_NEVER_EXPIRE;
		} catch (Exception ex) {
			passwordExpired = false;
			accountDisabled = false;
			accountLocked = false;
			logger.error("", ex);
		}
	}

	private void getLDAPGroups() {
		String groupsList = attributes.get(groupAttribute); // In Active Directory potrebbe non esistere se l'utente appartiene solamente al
															// gruppo di default
		logger.debug(groupAttribute + "=" + groupsList);
		if (groupsList != null) {
			String[] temps = groupsList.toUpperCase().split(attributesListSeparator);
			for (String group : temps) {
				int pos = group.indexOf('=') + 1;
				ldapGroups.put(group.substring(pos), group.substring(pos));
			}
		}
	}

	private void pwdExpireDays() {
		try {
			if (!passwordNeverExpire) {
				GregorianCalendar gcWin32Epoch = new GregorianCalendar(1601, Calendar.JANUARY, 1);
				Date dWin32EpochDate = gcWin32Epoch.getTime();
				GregorianCalendar today = new GregorianCalendar();
				Date todaysDate = today.getTime();
				long timeSinceWin32Epoch = 10000L * (todaysDate.getTime() - dWin32EpochDate.getTime());
				long userpwdChangeTime = Long.parseLong(attributes.get("pwdLastSet"));
				daysPasswordExpire = (maxPwdAge - (timeSinceWin32Epoch - userpwdChangeTime)) / 10000000L / 86400L;
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void accountExpireDays() {
		try {
			Long lWin32FileTime = new Long(attributes.get("accountExpires"));
			if (!lWin32FileTime.equals(UF_ACCOUNT_NEVER_EXPIRE)) {
				GregorianCalendar gcWin32Epoch = new GregorianCalendar(1601, Calendar.JANUARY, 1);
				Long lWin32Epoch = gcWin32Epoch.getTimeInMillis();
				Calendar calendar = Calendar.getInstance();
				calendar.setTimeInMillis((lWin32FileTime / 10000L) + lWin32Epoch);
				daysAccountExpire = calendar.getTimeInMillis() / 86400000L;
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
