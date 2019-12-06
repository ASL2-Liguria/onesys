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

import java.util.Hashtable;

import javax.naming.ConfigurationException;
import javax.naming.Context;
import javax.naming.NameNotFoundException;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.PartialResultException;
import javax.naming.ReferralException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.apache.commons.lang3.StringUtils;

import elco.insc.FileUtils;

/**
 * @author Roberto Rizzo
 */
public final class LDAP {

	private String initialContextFactory = "com.sun.jndi.ldap.LdapCtxFactory"; // class for LDAP connection
	private final Hashtable<String, String> userEnvironment = new Hashtable<>(5); // NOSONAR
	private String baseDN = "";
	private String searchDN = "";
	private String bindUser = "ANONYMOUS";
	private String bindUserPwd = ""; // NOSONAR
	private LDAPUserProperties ldapUser = null;
	private String loginIdentificationType = "";
	private String searchIdentificationType = "";
	private String additionalFilters = "";
	private String groupAttribute = "";
	private String referral = "ignore";
	private static final String SIMPLEAUTHENTICATION = "simple";

	/**
	 * Default initial LDAP context factory: com.sun.jndi.ldap.LdapCtxFactory
	 */
	public LDAP() {
		// OK
	}

	/**
	 * Set referral
	 * <p>
	 * "follow" follow referrals automatically<br>
	 * "ignore" ignore referrals. PartialResultException is thrown to indicate an incomplete result<br>
	 * "throw" throw ReferralException when a referral is encountered<br>
	 * <br>
	 * <b>Default "ignore"</b>
	 * </p>
	 */
	public void setReferral(String referral) {
		this.referral = referral;
	}

	/**
	 * Set initial LDAP context factory (default: com.sun.jndi.ldap.LdapCtxFactory)
	 *
	 * @param initialContextFactory
	 *            factory class
	 */
	public void setInitialContextFactory(String initialContextFactory) {
		this.initialContextFactory = initialContextFactory.trim();
	}

	/**
	 * Set type of login
	 *
	 * @param identificationType
	 *            eg. cn, uid, ...
	 */
	public void setLoginIdentificationType(String identificationType) {
		loginIdentificationType = identificationType.trim();
	}

	/**
	 * Set type of user search
	 *
	 * @param searchIdentificationType
	 *            eg. userPrincipalName, cn, ...
	 */
	public void setSearchIdentificationType(String searchIdentificationType) {
		this.searchIdentificationType = searchIdentificationType.trim();
	}

	/**
	 * Set additional filters
	 *
	 * @param additionalFilters
	 *            eg. (shadowflag=0)(shadowinactive=0) or (objectClass=user)
	 */
	public void setAdditionalFilters(String additionalFilters) {
		this.additionalFilters = additionalFilters.trim();
	}

	/**
	 * Set LDAP group attribute
	 *
	 * @param groupAttribute
	 *            attribute that store users's groups on LDAP server (eg. memberOf or sharedgroup)
	 */
	public void setLDAPGroupAttribute(String groupAttribute) {
		this.groupAttribute = groupAttribute.trim();
	}

	/**
	 * Set use ssl protocol
	 */
	public void setSSL() {
		userEnvironment.put(Context.SECURITY_PROTOCOL, "ssl");
	}

	/**
	 * Set trust store path
	 *
	 * @param sslKeystore
	 *            keystore path
	 */
	public void setSslKeyStorePath(String sslKeystore) {
		System.setProperty("javax.net.ssl.trustStore", sslKeystore.trim());
	}

	/**
	 * Set trust store password
	 *
	 * @param sslKeystorePassword
	 *            keystore password
	 */
	public void setSslKeyStorePassword(String sslKeystorePassword) {
		System.setProperty("javax.net.ssl.trustStorePassword", sslKeystorePassword.trim());
	}

	/**
	 * Set base DN
	 *
	 * @param baseDN
	 */
	public void setBaseDN(String baseDN) {
		this.baseDN = baseDN.trim();
	}

	/**
	 * Set search DN
	 *
	 * @param udn
	 */
	public void setSearchDN(String udn) {
		searchDN = udn.trim();
	}

	/**
	 * Set bind user
	 *
	 * @param buser
	 *            bind user can be "ANONYMOUS" for anonymous login (default: ANONYMOUS)<br>
	 *            Set to NULL or "" for simple user login
	 */
	public void setBindUser(String buser) {
		bindUser = buser.trim();
	}

	/**
	 * Set bind user password
	 *
	 * @param bupwd
	 *            bind users password
	 */
	public void setBindUserPassword(String bupwd) {
		bindUserPwd = bupwd.trim();
	}

	/**
	 * Set ldap URLs
	 *
	 * @param urls
	 *            <p>
	 *            (eg. list of space separeted servers ldap://192.168.1.2:389 ldap://192.168.1.3:389<br>
	 *            (eg. ldap:///DC=elco,DC=local for automatic servers discover using DNS<br>
	 *            (eg. list of space separeted servers ldaps://192.168.1.2:389 ldaps://192.168.1.3:389<br>
	 *            (eg. ldaps:///DC=elco,DC=local for automatic servers discover using DNS
	 *            </p>
	 */
	public void setURLs(String urls) {
		userEnvironment.put(Context.INITIAL_CONTEXT_FACTORY, initialContextFactory);
		userEnvironment.put(Context.PROVIDER_URL, urls.trim());
		userEnvironment.put(Context.SECURITY_AUTHENTICATION, SIMPLEAUTHENTICATION);
	}

	/**
	 * Clear all settings
	 */
	public void clearSettings() {
		userEnvironment.clear();
	}

	/**
	 * Return user's data returned from LDAP
	 *
	 * @return LDAPUserProperties
	 */
	public LDAPUserProperties getLDAPUser() {
		return ldapUser;
	}

	// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * @param user
	 *            user
	 * @param userPasswd
	 *            user's password
	 * @throws NamingException
	 */
	public void verifyLogin(String user, String userPasswd) throws NamingException {
		LdapContext ctx = null;
		try {
			if (StringUtils.isEmpty(bindUser)) {
				prepareUserEnv4SimpleLogin(user.trim(), userPasswd.trim());
			} else {
				prepareUserEnv4ComplexLogin(user.trim(), userPasswd.trim());
			}
			ctx = new InitialLdapContext(userEnvironment, null);
		} finally {
			FileUtils.safeClose(ctx);
		}
	}

	/**
	 * Retrieve user information
	 *
	 * @param user
	 *            LDAP user
	 * @throws NamingException
	 */
	public void generateUserInfo(String user) throws NamingException {
		if (StringUtils.isEmpty(bindUser)) {
			throw new NamingException("Must set a bind user or ANONYMOUS");
		}

		prepareUserEnv4ComplexLogin(user.trim(), "NOT USED");
	}

	private void prepareUserEnv4SimpleLogin(String user, String userPasswd) {
		userEnvironment.put(Context.SECURITY_PRINCIPAL, createUser4Login(user));
		userEnvironment.put(Context.SECURITY_CREDENTIALS, userPasswd);
	}

	private void prepareUserEnv4ComplexLogin(String user, String userPasswd) throws NamingException {
		if (StringUtils.isEmpty(searchDN)) {
			throw new ConfigurationException("Search DN: invalid value");
		}
		if ("ANONYMOUS".equalsIgnoreCase(bindUser)) {
			userEnvironment.put(Context.SECURITY_AUTHENTICATION, "none");
		} else {
			userEnvironment.put(Context.SECURITY_PRINCIPAL, createBindUserForLogin(bindUser));
			userEnvironment.put(Context.SECURITY_CREDENTIALS, bindUserPwd);
			userEnvironment.put(Context.SECURITY_AUTHENTICATION, SIMPLEAUTHENTICATION);
		}

		LdapContext ctx = null;
		try {
			userEnvironment.put(Context.REFERRAL, referral);
			ctx = new InitialLdapContext(userEnvironment, null);
			searchUser(ctx, createSearchFilter(user), searchDN);
		} catch (PartialResultException | ReferralException ex) { // NOSONAR
			throw new NamingException(ex.getLocalizedMessage());
		} finally {
			FileUtils.safeClose(ctx);
		}

		userEnvironment.put(Context.SECURITY_PRINCIPAL, ldapUser.nameSpace);
		userEnvironment.put(Context.SECURITY_CREDENTIALS, userPasswd);
		userEnvironment.put(Context.SECURITY_AUTHENTICATION, SIMPLEAUTHENTICATION);
	}

	private void searchUser(LdapContext ctx, String filter, String searchDN) throws NamingException {
		Attributes sistemAttrs = ctx.getAttributes(searchDN); // System attributes
		Attribute maxPwdAge = sistemAttrs.get("maxPwdAge");
		long longMaxPwdAge = Long.MAX_VALUE;
		if (maxPwdAge != null) {
			longMaxPwdAge = Math.abs(Long.parseLong((String) maxPwdAge.get()));
		}

		SearchControls sctls = new SearchControls();
		sctls.setSearchScope(SearchControls.SUBTREE_SCOPE);

		NamingEnumeration<SearchResult> ne = ctx.search(searchDN, filter, sctls);
		if (ne.hasMore()) {
			ldapUser = new LDAPUserProperties(ne.next(), longMaxPwdAge, groupAttribute);
		} else {
			throw new NameNotFoundException("User not found");
		}
	}

	private String createSearchFilter(String user) {
		return "(&" + additionalFilters + "(" + searchIdentificationType + "=" + user + "))";
	}

	private String createUser4Login(String user) {
		String userPrincipal = "";

		if (!StringUtils.isEmpty(loginIdentificationType)) {
			userPrincipal += loginIdentificationType + "=";
		}
		userPrincipal += user;
		if (!StringUtils.isEmpty(baseDN)) {
			userPrincipal += "," + baseDN;
		}

		return userPrincipal;
	}

	private String createBindUserForLogin(String bindUser) {
		return createUser4Login(bindUser);
	}
}
