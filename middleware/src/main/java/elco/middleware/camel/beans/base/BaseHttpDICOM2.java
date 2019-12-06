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
package elco.middleware.camel.beans.base;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.Exchange;
import org.apache.camel.Handler;
import org.apache.camel.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.dicom.QueryRetrieve2;
import elco.dicom.utils.ConstantsUtils.QueryRetrieveLevel;
import elco.exceptions.BaseIntegrationException;
import elco.exceptions.ConfigurationException;
import elco.insc.Camel;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.insc.GenericUtils;
import elco.insc.HTTP;
import elco.middleware.camel.beans.Config;

/**
 * <p>
 * Base Camel bean for HTTP to DICOM query retrieve
 * </p>
 *
 * @deprecated
 * @author Roberto Rizzo
 */
@Deprecated
public abstract class BaseHttpDICOM2 { // NOSONAR

	protected final Logger LOG = LoggerFactory.getLogger(this.getClass());
	private String localAET = null;
	private String remoteAET = null;
	private String remoteHOST = null;
	private String remotePORT = null;
	private String moveDEST = null;
	private String queryRetrieveLevel = null;
	private String remoteAETsBean = null;
	private Config remoteAETsConfig = null;
	private boolean relationQR = true;

	/**
	 * Set default local AET. Can be overwritten by the value present in the URL
	 *
	 * @param localAET
	 *            local AET
	 */
	public void setLocalAET(String localAET) {
		this.localAET = localAET;
	}

	/**
	 * Get default local AET
	 *
	 * @return local AET
	 */
	public String getLocalAET() {
		return localAET;
	}

	/**
	 * Set default query retrieve level. Can be overwritten by the value present in the URL
	 *
	 * @param queryRetrieveLevel
	 *            query retrieve level
	 */
	public void setQueryRetrieveLevel(String queryRetrieveLevel) {
		this.queryRetrieveLevel = queryRetrieveLevel.toUpperCase();
	}

	/**
	 * Get default query retrieve LEVEL
	 *
	 * @return default query retrieve LEVEL
	 */
	public String getQueryRetrieveLevel() {
		return queryRetrieveLevel;
	}

	/**
	 * Set default move destination. Can be overwritten by the value present in the URL
	 *
	 * @param moveDEST
	 *            move destination
	 */
	public void setMoveDest(String moveDEST) {
		this.moveDEST = moveDEST;
	}

	/**
	 * Get default move destination
	 *
	 * @return move destinationL
	 */
	public String getMoveDest() {
		return moveDEST;
	}

	/**
	 * Set remote AETs configuration bean name
	 *
	 * @param beanName
	 *            bean name
	 */
	public void setRemoteAETsBean(String beanName) {
		remoteAETsBean = beanName;
		remoteAETsConfig = Camel.getConfigurationBean(Constants.camelRegistry, remoteAETsBean);
	}

	/**
	 * Get remote AETs configuration bean name
	 *
	 * @return bean name
	 */
	public String getRemoteAETsBean() {
		return remoteAETsBean;
	}

	/**
	 * Set relation QR
	 *
	 * @param relationQR
	 *            true/false
	 */
	public void setRelationQR(boolean relationQR) {
		this.relationQR = relationQR;
	}

	/**
	 * Get relation QR
	 *
	 * @return true/false
	 */
	public boolean getRelationQR() {
		return relationQR;
	}

	@Handler
	public final Object camelHandler(Exchange exchange, @Header(value = "CamelHttpQuery") String phttpParameters) throws BaseIntegrationException { // NOSONAR
		Object retValue = null;
		QueryRetrieve2 queryRetrieve = null;

		try {
			HttpServletRequest httpRequest = HTTP.getHttpServletRequest(exchange);
			HttpServletResponse httpResponse = HTTP.enableCrossDomain(exchange);
			HTTP.disableClientCache(httpRequest, httpResponse);

			Map<String, String> httpParameters = GenericUtils.parameters2HashMap(phttpParameters);

			QueryRetrieveLevel qrl = null;
			String urlQueryRetrieveLevel = httpParameters.remove("queryRetrieveLevel");
			if (urlQueryRetrieveLevel != null) {
				queryRetrieveLevel = urlQueryRetrieveLevel.toUpperCase();
			}
			if (queryRetrieveLevel == null) {
				throw new ConfigurationException("Query retrieve level not configured");
			}

			if (queryRetrieveLevel.equals(QueryRetrieveLevel.IMAGE.getCode())) {
				qrl = QueryRetrieveLevel.IMAGE;
			} else if (queryRetrieveLevel.equals(QueryRetrieveLevel.PATIENT.getCode())) {
				qrl = QueryRetrieveLevel.PATIENT;
			} else if (queryRetrieveLevel.equals(QueryRetrieveLevel.SERIES.getCode())) {
				qrl = QueryRetrieveLevel.SERIES;
			} else if (queryRetrieveLevel.equals(QueryRetrieveLevel.STUDY.getCode())) {
				qrl = QueryRetrieveLevel.STUDY;
			}

			String urlLocalAET = httpParameters.remove("localAET");
			if (urlLocalAET != null) {
				localAET = urlLocalAET;
			}
			if (localAET == null) {
				throw new ConfigurationException("Local AET not configured");
			}

			remoteAET = httpParameters.remove("remoteAET");
			if (remoteAET == null) {
				throw new ConfigurationException("Remote AET not configured");
			}
			if (remoteAETsConfig != null) {
				String[] hostPort = remoteAETsConfig.getString(remoteAET).split(":");
				if (hostPort != null) {
					remoteHOST = hostPort[0];
					remotePORT = hostPort[1];
				}
			}

			String urlRemoteHOST = httpParameters.remove("remoteHOST");
			if (urlRemoteHOST != null) {
				remoteHOST = urlRemoteHOST;
			}
			if (remoteHOST == null) {
				throw new ConfigurationException("Remote host not configured");
			}

			String urlRemotePORT = httpParameters.remove("remotePORT");
			if (urlRemotePORT != null) {
				remotePORT = urlRemotePORT;
			}
			if (remotePORT == null) {
				throw new ConfigurationException("Remote port not configured");
			}

			String urlMoveDEST = httpParameters.remove("moveDEST");
			if (urlMoveDEST != null) {
				moveDEST = urlMoveDEST;
			}
			if (moveDEST == null) {
				throw new ConfigurationException("Move destination not configured");
			}

			queryRetrieve = new QueryRetrieve2(localAET, qrl);
			queryRetrieve.setRemoteNode(remoteAET, remoteHOST, Integer.parseInt(remotePORT));
			queryRetrieve.setMoveDest(moveDEST);
			queryRetrieve.setRelationQR(relationQR);

			boolean addedMatchingKeys = false;
			for (String name : httpParameters.keySet()) {
				try {
					queryRetrieve.addMatchingKey(name, httpParameters.get(name)); // add a matching key if it's a standard dicom tag
					addedMatchingKeys = true;
				} catch (Exception ex) {
					LOG.debug("", ex);
				}
			}

			if (!addedMatchingKeys) {
				throw new ConfigurationException("Add at least one 'matching' key");
			}

			retValue = handler(queryRetrieve, exchange);
		} catch (Exception ex) {
			throw new BaseIntegrationException(ex);
		} finally {
			FileUtils.safeClose(queryRetrieve);
		}

		return retValue;
	}

	/**
	 * Called on a new HTTP message. This is the main function to use for HTTP to DICOM calls
	 * <p>
	 * Association will be closed on function return or if an Exception is raised.<br>
	 * No effect if the association is already closed
	 * </p>
	 *
	 * @param queryRetrieve
	 *            QueryRetrieve2 object
	 * @param exchange
	 *            Camel Exchange object
	 * @return response message
	 * @throws Exception
	 */
	protected abstract Object handler(QueryRetrieve2 queryRetrieve, Exchange exchange) throws Exception; // NOSONAR
}
