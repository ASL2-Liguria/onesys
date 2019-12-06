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

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.naming.ConfigurationException;

import org.apache.camel.CamelContext;
import org.apache.camel.CamelException;
import org.apache.camel.ConsumerTemplate;
import org.apache.camel.Endpoint;
import org.apache.camel.Exchange;
import org.apache.camel.ExchangePattern;
import org.apache.camel.Message;
import org.apache.camel.Producer;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.RuntimeCamelException;
import org.apache.camel.ServiceStatus;
import org.apache.camel.model.ModelCamelContext;
import org.apache.camel.model.RouteDefinition;
import org.apache.camel.model.RoutesDefinition;
import org.apache.camel.spi.Registry;
import org.apache.camel.util.URISupport;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.GenericApplicationContext;

import elco.middleware.camel.beans.Config;

/**
 * Camel utilities
 *
 * @author Roberto Rizzo
 */
public final class Camel {

	private Camel() {
	}

	/**
	 * @param exchange
	 *            Camel Exchange
	 * @param headerName
	 * @return String representation of the header value
	 * @throws ConfigurationException
	 */
	public static String getHeaderAsString(Exchange exchange, String headerName) throws ConfigurationException {
		String headerValue = (String) exchange.getIn().getHeader(headerName);
		if (StringUtils.isBlank(headerValue)) {
			throw new ConfigurationException(headerName + " not present or zero length");
		}

		return headerValue;
	}

	/**
	 * @param exchange
	 *            Camel Exchange
	 * @param headerName
	 * @return String representation of the header value or "" if is null or not exists
	 */
	public static String getHeaderAsStringSafe(Exchange exchange, String headerName) {
		String headerValue = "";

		try {
			headerValue = getHeaderAsString(exchange, headerName);
		} catch (Exception ex) { // NOSONAR
			headerValue = "";
		}

		return headerValue;
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param uri
	 *            remote URI
	 * @param timeout
	 *            wait timeout in milliseconds
	 * @param responseType
	 *            response type
	 * @return response
	 */
	public static <T extends Object> T from(CamelContext camelcontext, String uri, long timeout, Class<T> responseType) {
		T message;
		ConsumerTemplate consumerTemplate = camelcontext.createConsumerTemplate();
		message = consumerTemplate.receiveBody(uri, timeout, responseType);

		try {
			consumerTemplate.stop();
			GenericUtils.threadSleep(500L);
		} catch (Exception ex) {
			throw new RuntimeCamelException(ex);
		}

		return message;
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param uri
	 *            remote URI
	 * @param timeout
	 *            wait timeout in milliseconds
	 * @return response
	 */
	public static byte[] from(CamelContext camelcontext, String uri, long timeout) {
		return from(camelcontext, uri, timeout, byte[].class);
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param uri
	 *            destination URI
	 * @param data
	 *            data to send
	 * @param headers
	 *            Map of camel headers
	 * @param responseType
	 *            response type
	 * @return response
	 */
	public static <T extends Object> T to(CamelContext camelcontext, String uri, Object data, Map<String, Object> headers, Class<T> responseType) {
		T messageNew;
		ProducerTemplate producerTemplate = camelcontext.createProducerTemplate();
		if (headers != null) {
			messageNew = producerTemplate.requestBodyAndHeaders(uri, data, headers, responseType);
		} else {
			messageNew = producerTemplate.requestBody(uri, data, responseType);
		}

		try {
			producerTemplate.stop();
			GenericUtils.threadSleep(500L);
		} catch (Exception ex) {
			throw new RuntimeCamelException(ex);
		}

		return messageNew;
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param uri
	 *            destination URI
	 * @param data
	 *            data to send
	 * @param headers
	 *            Map of camel headers
	 * @return response as String object
	 */
	public static String to(CamelContext camelcontext, String uri, String data, Map<String, Object> headers) {
		return to(camelcontext, uri, data, headers, String.class);
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param uri
	 *            destination URI
	 * @param data
	 *            data to send
	 * @param headers
	 *            Map of camel headers
	 * @return response as byte[]
	 */
	public static byte[] to(CamelContext camelcontext, String uri, byte[] data, Map<String, Object> headers) {
		return to(camelcontext, uri, data, headers, byte[].class);
	}

	/**
	 * Default bean name: activemq
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param queues
	 *            e.g. FOO.BAR,FOO.TEST
	 * @param message
	 *            message to send
	 * @param headers
	 *            Map of camel headers
	 * @return response as String object
	 */
	public static String toActivemq(CamelContext camelcontext, String queues, String message, Map<String, Object> headers) {
		return toActivemq(camelcontext, "activemq", queues, message, headers);
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param bean
	 *            bean name (e.g. activemqlog)
	 * @param queues
	 *            e.g. FOO.BAR,FOO.TEST
	 * @param message
	 *            message to send
	 * @param headers
	 *            Map of camel headers
	 * @return response as String object
	 */
	public static String toActivemq(CamelContext camelcontext, String bean, String queues, String message, Map<String, Object> headers) {
		return to(camelcontext, bean + ":queue:" + queues + "?disableReplyTo=true&deliveryPersistent=true", message, headers);
	}

	/**
	 * @param headers
	 * @return headers deep clone
	 */
	public static Map<String, Object> duplicateHeaders(Map<String, Object> headers) {
		return GenericUtils.cloneObject(headers);
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param serviceName
	 *            service to call
	 * @param params
	 *            Object array of function parameters
	 * @param headers
	 * @param responseType
	 *            Class<T> to return
	 * @return Class<T>
	 */
	public static <T extends Object> T toCxf(CamelContext camelcontext, String serviceName, Object[] params, Map<String, Object> headers, Class<T> responseType) {
		return to(camelcontext, "cxf:bean:" + serviceName, Arrays.asList(params), headers, responseType);
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param serviceName
	 *            'service to call':'function to call'
	 * @param params
	 *            Object array of function parameters
	 * @param responseType
	 *            Class<T> to return
	 * @return Class<T>
	 */
	public static <T extends Object> T toCxf(CamelContext camelcontext, String serviceName, Object[] params, Class<T> responseType) {
		HashMap<String, Object> headers = null;
		String[] values = serviceName.split(":");
		if (values.length > 1) {
			headers = new HashMap<>();
			headers.put("operationname", values[1]);
		}

		return toCxf(camelcontext, values[0], params, headers, responseType);
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param serviceName
	 *            'service to call':'function to call'
	 * @param params
	 *            Object array of function parameters
	 * @return String
	 */
	public static String toCxf(CamelContext camelcontext, String serviceName, Object[] params) {
		return toCxf(camelcontext, serviceName, params, String.class);
	}

	/**
	 * @param path
	 *            ClassLoader path
	 * @param extensions
	 *            File extensions to search into for java classes
	 * @param recursive
	 *            Recursive search for jar files
	 * @return URLClassLoader or NULL
	 * @deprecated
	 */
	@Deprecated
	public static URLClassLoader getClassLoader(String path, String[] extensions, boolean recursive) {
		try {
			ArrayList<URL> aUrls = new ArrayList<>();
			Collection<File> jars = FileUtils.listFiles(new File(path), extensions, recursive);
			Iterator<File> it = jars.iterator();
			while (it.hasNext()) {
				aUrls.add(it.next().toURI().toURL());
			}
			URL[] urls = new URL[aUrls.size()];
			return new URLClassLoader(aUrls.toArray(urls));
		} catch (Exception ex) { // NOSONAR
		}

		return null;
	}

	/**
	 * Add or update a route
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param routeFilePath
	 *            Route file path
	 * @param update
	 *            true to update route if exists
	 * @return Route ID if the route has been added, NULL otherwise
	 * @throws CamelException
	 */
	public static String addRouteFromFile(CamelContext camelcontext, String routeFilePath, boolean update) throws CamelException {
		try {
			return addRoute(camelcontext, elco.insc.FileUtils.loadByteArray(routeFilePath), update);
		} catch (Exception ex) {
			throw new CamelException(ex);
		}
	}

	/**
	 * Add or update a route
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param springRoute
	 *            Route definition
	 * @param update
	 *            true to update route if exists
	 * @return Route ID if the route has been added, NULL otherwise
	 * @throws CamelException
	 */
	public static String addRoute(CamelContext camelcontext, String springRoute, boolean update) throws CamelException {
		return addRoute(camelcontext, springRoute.getBytes(), update);
	}

	/**
	 * Add or update a route
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param springRoute
	 *            Route definition
	 * @param update
	 *            true to update route if exists
	 * @return Route ID if the route has been added, NULL otherwise
	 * @throws CamelException
	 */
	public static String addRoute(CamelContext camelcontext, byte[] springRoute, boolean update) throws CamelException {
		try (InputStream routesIS = new ByteArrayInputStream(springRoute);) {
			String routeID = null;
			ModelCamelContext context = (ModelCamelContext) camelcontext;
			RoutesDefinition defs = context.loadRoutesDefinition(routesIS);
			for (RouteDefinition rdef : defs.getRoutes()) {
				if (!existsRouteDefinition(camelcontext, rdef.getId()) || update) {
					try { // NOSONAR
						context.addRouteDefinition(rdef);
						routeID = rdef.getId();
					} catch (Exception ex) {
						context.removeRouteDefinition(rdef);
						throw new CamelException(ex);
					}
				}
			}

			return routeID;
		} catch (Exception ex) {
			throw new CamelException(ex);
		}
	}

	/**
	 * Remove a route from a CamelContext
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param routeId
	 *            Route ID
	 * @return true if route has been removed
	 * @throws CamelException
	 */
	public static boolean removeRoute(CamelContext camelcontext, String routeId) throws CamelException {
		try {
			boolean value = false;

			ServiceStatus serviceStatus = camelcontext.getRouteStatus(routeId);
			if (serviceStatus != null) {
				if (serviceStatus.isStoppable()) {
					camelcontext.stopRoute(routeId);
				}
				value = camelcontext.removeRoute(routeId);
			}

			return value;
		} catch (Exception ex) {
			throw new CamelException(ex);
		}
	}

	/**
	 * Verify if a route definition is already present in a CamelContext
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param routeId
	 *            Route ID
	 * @return true if present
	 */
	public static boolean existsRouteDefinition(CamelContext camelcontext, String routeId) {
		return camelcontext.getRouteDefinition(routeId) == null ? false : true;
	}

	/**
	 * Get a configuration bean
	 *
	 * @param registry
	 *            Camel registry
	 * @param beanName
	 *            Configuration bean to load
	 * @return Config object or null if it could not be found
	 */
	public static Config getConfigurationBean(Registry registry, String beanName) {
		return registry.lookupByNameAndType(beanName, Config.class);
	}

	/**
	 * Get a configuration bean
	 *
	 * @param camelContext
	 *            Camel context
	 * @param beanName
	 *            Configuration bean to load
	 * @return Config object or null if it could not be found
	 */
	public static Config getConfigurationBean(CamelContext camelContext, String beanName) {
		return getConfigurationBean(camelContext.getRegistry(), beanName);
	}

	/**
	 * Process a message across an endpoint and return a body if present
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param pEndpoint
	 *            Endpoint name
	 * @param headers
	 *            Headers
	 * @param body
	 *            Body to send
	 * @param type
	 *            Body type
	 * @return Response body
	 * @throws Exception
	 */
	public static <T> Exchange processMessage(CamelContext camelcontext, String pEndpoint, Map<String, Object> headers, T body, Class<T> type) throws CamelException {
		Producer producer = null;

		try {
			Exchange exchange = null;

			Endpoint endpoint = camelcontext.getEndpoint(pEndpoint);
			exchange = endpoint.createExchange(ExchangePattern.InOut);
			Message in = exchange.getIn();
			in.setHeaders(headers);
			if (body != null) {
				in.setBody(body, type);
			}

			producer = endpoint.createProducer();
			producer.start();
			producer.process(exchange);

			return exchange;
		} catch (Exception ex) {
			throw new CamelException(ex);
		} finally {
			stopProducerSafe(producer); // NOSONAR
		}
	}

	/**
	 * Stop a Camel producer without rise any exception
	 *
	 * @param producer
	 *            Producer to close
	 */
	public static void stopProducerSafe(Producer producer) {
		try {
			producer.stop();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * Stop a Camel Endpoint without rise any exception
	 *
	 * @param endpoint
	 *            Endpoint to close
	 */
	public static void stopEndpointSafe(Endpoint endpoint) {
		try {
			endpoint.stop();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * @param aac
	 *            AbstractApplicationContext
	 * @param name
	 *            Bean name
	 * @param requiredType
	 *            Bean type
	 * @return An instance of the bean or NULL if the bean could not be created
	 */
	public static <T extends Object> T getBeanQuietly(AbstractApplicationContext aac, String name, Class<T> requiredType) {
		try {
			return aac.getBean(name, requiredType);
		} catch (Exception ex) { // NOSONAR
			return null;
		}
	}

	/**
	 * @param gac
	 *            GenericApplicationContext
	 * @param beanName
	 *            Bean name
	 */
	public static void removeBeanDefinitionQuietly(GenericApplicationContext gac, String beanName) {
		try {
			gac.removeBeanDefinition(beanName);
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * @param endpoint
	 *            The endpoint
	 * @return Parameters as key=value Map
	 * @throws URISyntaxException
	 */
	public static Map<String, Object> getEndpointURIParameters(Endpoint endpoint) throws URISyntaxException {
		return URISupport.parseParameters(new URI(endpoint.getEndpointUri()));
	}

	/**
	 * @param context
	 *            CamelContext
	 * @param resource
	 *            Resource name
	 * @return A URL object for reading the resource, or null if the resource could not be found or the invoker doesn't have adequate privileges to get the resource
	 */
	public static URL getContextResource(CamelContext context, String resource) {
		return context.getApplicationContextClassLoader().getResource(resource);
	}
}
