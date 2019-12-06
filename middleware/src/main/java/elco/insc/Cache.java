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

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.component.ehcache.EhcacheConstants;
import org.apache.camel.util.ExchangeHelper;

import elco.exceptions.CacheException;

/**
 * EHCache manage utilities
 *
 * @author Roberto Rizzo
 */
public final class Cache {

	private Cache() {
	}

	/**
	 * Add object if not present
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param cacheURI
	 *            EHCache URI: cacheName[?options]
	 * @param key
	 *            Object key
	 * @param object
	 *            Object to cache
	 * @param type
	 *            Class type of the object
	 * @throws CacheException
	 */
	public static <T> void addObject(CamelContext camelcontext, String cacheURI, String key, T object, Class<T> type) throws CacheException {
		try {
			Map<String, Object> headers = new HashMap<>();
			headers.put(EhcacheConstants.ACTION, EhcacheConstants.ACTION_PUT_IF_ABSENT);
			headers.put(EhcacheConstants.KEY, key);

			operation(camelcontext, cacheURI, headers, object, type);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}

	/**
	 * Update object if present
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param cacheURI
	 *            EHCache URI: cacheName[?options]
	 * @param key
	 *            Object key
	 * @param object
	 *            Object to update in the cache
	 * @param type
	 *            Class type of the object
	 * @throws CacheException
	 */
	public static <T> void updateObject(CamelContext camelcontext, String cacheURI, String key, T object, Class<T> type) throws CacheException {
		try {
			Map<String, Object> headers = new HashMap<>();
			headers.put(EhcacheConstants.ACTION, EhcacheConstants.ACTION_REPLACE);
			headers.put(EhcacheConstants.KEY, key);

			operation(camelcontext, cacheURI, headers, object, type);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}

	/**
	 * Get object if present
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param cacheURI
	 *            EHCache URI: cacheName[?options]
	 * @param key
	 *            Object key
	 * @param type
	 *            Class type of the object
	 * @return Cached object or NULL if not present
	 * @throws CacheException
	 */
	public static <T extends Object> T getObject(CamelContext camelcontext, String cacheURI, String key, Class<T> type) throws CacheException {
		try {
			Map<String, Object> headers = new HashMap<>();
			headers.put(EhcacheConstants.ACTION, EhcacheConstants.ACTION_GET);
			headers.put(EhcacheConstants.KEY, key);

			Exchange exchange = operation(camelcontext, cacheURI, headers, null, null);
			Object response = ExchangeHelper.extractResultBody(exchange, exchange.getPattern());

			return camelcontext.getTypeConverter().convertTo(type, response);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}

	/**
	 * Check if object is present
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param cacheURI
	 *            EHCache URI: cacheName[?options]
	 * @param key
	 *            Object key
	 * @return true if object exists in the cache
	 * @throws CacheException
	 */
	public static boolean checkObjectExists(CamelContext camelcontext, String cacheURI, String key) throws CacheException {
		try {
			Map<String, Object> headers = new HashMap<>();
			headers.put(EhcacheConstants.ACTION, EhcacheConstants.ACTION_GET);
			headers.put(EhcacheConstants.KEY, key);

			Exchange exchange = operation(camelcontext, cacheURI, headers, null, null);

			return ExchangeHelper.getMandatoryHeader(exchange, EhcacheConstants.ACTION_HAS_RESULT, Boolean.class);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}

	/**
	 * Delete object
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param cacheURI
	 *            EHCache URI: cacheName[?options]
	 * @param key
	 *            Object key
	 * @throws CacheException
	 */
	public static void deleteObject(CamelContext camelcontext, String cacheURI, String key) throws CacheException {
		try {
			Map<String, Object> headers = new HashMap<>();
			headers.put(EhcacheConstants.ACTION, EhcacheConstants.ACTION_REMOVE);
			headers.put(EhcacheConstants.KEY, key);

			operation(camelcontext, cacheURI, headers, null, null);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}

	/**
	 * Clear the cache
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param cacheURI
	 *            EHCache URI: cacheName[?options]
	 * @throws CacheException
	 */
	public static void emptyCache(CamelContext camelcontext, String cacheURI) throws CacheException {
		try {
			Map<String, Object> headers = new HashMap<>();
			headers.put(EhcacheConstants.ACTION, EhcacheConstants.ACTION_CLEAR);

			operation(camelcontext, cacheURI, headers, null, null);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}

	private static <T> Exchange operation(CamelContext camelcontext, String cacheURI, Map<String, Object> headers, T body, Class<T> type) throws CacheException {
		try {
			return Camel.processMessage(camelcontext, "ehcache://" + cacheURI, headers, body, type);
		} catch (Exception ex) {
			throw new CacheException(ex);
		}
	}
}
