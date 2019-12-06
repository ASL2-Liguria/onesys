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

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.dcm4che2.util.CloseUtils;
import org.eclipse.jetty.http.HttpHeader;
import org.eclipse.jetty.http.HttpVersion;

/**
 * HTTP utilities
 *
 * @author Roberto Rizzo
 */
public final class HTTP {

	private HTTP() {
	}

	/**
	 * HTTP get with credentials
	 *
	 * @param url
	 *            URL to call
	 * @param user
	 *            user name
	 * @param password
	 *            user password
	 * @param type
	 *            response type. Can be String or byte[]
	 * @return response or null
	 * @throws IOException
	 */
	public static <T extends Object> T getWithCredentials(String url, String user, String password, Class<T> type) throws IOException {
		CredentialsProvider credsProvider = new BasicCredentialsProvider();
		credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(user, password));
		CloseableHttpClient httpClient = HttpClients.custom().setDefaultCredentialsProvider(credsProvider).build();

		return baseCall(new HttpGet(url), httpClient, type);
	}

	/**
	 * HTTP get
	 *
	 * @param url
	 *            URL to call
	 * @param type
	 *            response type. Can be String or byte[]
	 * @return response or null
	 * @throws IOException
	 */
	public static <T extends Object> T get(String url, Class<T> type) throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();

		return baseCall(new HttpGet(url), httpClient, type);
	}

	/**
	 * HTTP post with credentials
	 *
	 * @param url
	 *            URL to call
	 * @param user
	 *            user name
	 * @param password
	 *            user password
	 * @param pEntity
	 *            HttpEntity to use
	 * @param type
	 *            response type. Can be String or byte[]
	 * @return response or null
	 * @throws IOException
	 */
	public static <T extends Object> T postWithCredentials(String url, String user, String password, HttpEntity pEntity, Class<T> type) throws IOException {
		CredentialsProvider credsProvider = new BasicCredentialsProvider();
		credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(user, password));
		CloseableHttpClient httpClient = HttpClients.custom().setDefaultCredentialsProvider(credsProvider).build();
		HttpPost httPost = new HttpPost(url);
		httPost.setEntity(pEntity);

		return baseCall(httPost, httpClient, type);
	}

	/**
	 * HTTP post
	 *
	 * @param url
	 *            URL to call
	 * @param pEntity
	 *            HttpEntity to use
	 * @param type
	 *            response type. Can be String or byte[]
	 * @return response or null
	 * @throws IOException
	 */
	public static <T extends Object> T post(String url, HttpEntity pEntity, Class<T> type) throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httPost = new HttpPost(url);
		httPost.setEntity(pEntity);

		return baseCall(httPost, httpClient, type);
	}

	/**
	 * @param uri
	 *            HTTP request object
	 * @param httpClient
	 *            The client will be closed
	 * @param type
	 *            response type. Can be String or byte[]
	 * @return response or null
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	private static <T extends Object> T baseCall(HttpUriRequest uri, CloseableHttpClient httpClient, Class<T> type) throws IOException {
		T response = null;
		HttpResponse httpResponse = null;
		try {
			httpResponse = httpClient.execute(uri);
			HttpEntity entity = httpResponse.getEntity();
			if (type.equals(String.class)) {
				response = (T) EntityUtils.toString(entity, Constants.DEFAULT_VM_CHARSET);
			} else if (type.equals(byte[].class)) {
				response = (T) EntityUtils.toByteArray(entity);
			} else {
				throw new IOException("Invalid response type. Must be String or byte[]");
			}
		} finally {
			CloseUtils.safeClose(httpClient);
		}

		return response;
	}

	/**
	 * Get HttpServletRequest from Exchange
	 *
	 * @param exchange
	 * @return HttpServletRequest object
	 */
	public static HttpServletRequest getHttpServletRequest(Exchange exchange) {
		return exchange.getIn().getBody(HttpServletRequest.class);
	}

	/**
	 * Get HttpServletResponse from Exchange
	 *
	 * @param exchange
	 * @return HttpServletResponse object
	 */
	public static HttpServletResponse getHttpServletResponse(Exchange exchange) {
		return exchange.getIn().getBody(HttpServletResponse.class);
	}

	/**
	 * Enable ajax cross domain
	 *
	 * @param exchange
	 *            Camel Exchange object
	 * @return HttpServletResponse object
	 */
	public static HttpServletResponse enableCrossDomain(Exchange exchange) {
		return enableCrossDomain(exchange.getIn().getBody(HttpServletRequest.class), exchange.getIn().getBody(HttpServletResponse.class));
	}

	/**
	 * Enable ajax cross domain
	 *
	 * @param httpServletRequest
	 *            HttpServletRequest object
	 * @param httpServletResponse
	 *            HttpServletResponse object
	 * @return HttpServletResponse object
	 */
	public static HttpServletResponse enableCrossDomain(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
		String httpOrigin = httpServletRequest.getHeader("Origin");
		if (httpOrigin == null) {
			httpOrigin = httpServletRequest.getHeader("Referer");
		}
		if (httpOrigin != null) {
			httpServletResponse.setHeader("Access-Control-Allow-Origin", httpOrigin);
		}

		return httpServletResponse;
	}

	/**
	 * Disable client cache
	 *
	 * @param exchange
	 *            Camel Exchange object
	 * @return HttpServletResponse object
	 */
	public static HttpServletResponse disableClientCache(Exchange exchange) {
		Message message = exchange.getIn();
		return disableClientCache(message.getBody(HttpServletRequest.class), message.getBody(HttpServletResponse.class));
	}

	/**
	 * Disable client cache
	 *
	 * @param httpServletRequest
	 *            HttpServletRequest object
	 * @param httpServletResponse
	 *            HttpServletResponse object
	 * @return HttpServletResponse object
	 */
	public static HttpServletResponse disableClientCache(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
		String protocol = httpServletRequest.getProtocol().toUpperCase();
		if (HttpVersion.HTTP_1_1.toString().equals(protocol)) {
			httpServletResponse.setHeader(HttpHeader.CACHE_CONTROL.asString(), "private, max-age=0, no-cache, no-store, must-revalidate");
		} else {
			httpServletResponse.setHeader(HttpHeader.PRAGMA.asString(), "no-cache");
			httpServletResponse.setDateHeader(HttpHeader.EXPIRES.asString(), 0L);
		}

		return httpServletResponse;
	}

	/**
	 * Create a json for cross domain
	 *
	 * @param callback
	 *            Callback function name
	 * @param xml
	 *            XML input
	 * @return cross domain JSON
	 */
	public static String xml2JsonCrossDomain(String callback, String xml) {
		return jsonCrossDomain(callback, XML.xml2json(xml));
	}

	/**
	 * Create a json for cross domain
	 *
	 * @param callback
	 *            Callback function name
	 * @param json
	 *            JSON input
	 * @return cross domain JSON
	 */
	public static String jsonCrossDomain(String callback, String json) {
		return callback + "(" + json + ")";
	}
}
