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
package elco.dicom;

import java.io.Closeable;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.util.CloseUtils;

import elco.dicom.commons.TLSInterface;
import elco.dicom.query.ICStoreService;
import elco.dicom.query.Query;
import elco.dicom.utils.ConstantsUtils.QueryRetrieveLevel;

/**
 * DICOM query retrieve (c-find, c-move, c-get, echo)
 *
 * @author Roberto Rizzo
 */
public final class QueryRetrieve2 implements Closeable, TLSInterface {

	private Query query = null;

	/**
	 * <p>
	 * Default relation QR: true<br>
	 * <br>
	 * QueryRetrieveLevel.PATIENT<br>
	 * QueryRetrieveLevel.STUDY<br>
	 * QueryRetrieveLevel.SERIES<br>
	 * QueryRetrieveLevel.IMAGE
	 * </p>
	 *
	 * @param localAET
	 *            local AET
	 * @param qrLevel
	 *            query retrieve level
	 */
	public QueryRetrieve2(String localAET, QueryRetrieveLevel qrLevel) {
		query = new Query(localAET);
		query.setQueryLevel(qrLevel);
	}

	/**
	 * Get calling AETitle
	 *
	 * @return String representing calling AET
	 */
	public String getCallingAETitle() {
		return query.getCallingAETitle();
	}

	/**
	 * Set DICOM identifiers of the remote node to query
	 * <p>
	 * Reuse association to AETitle = true
	 * </p>
	 *
	 * @param aet
	 *            DICOM AET
	 * @param host
	 *            host name or ip
	 * @param port
	 *            port
	 */
	public void setRemoteNode(String aet, String host, int port) {
		setRemoteNode(aet, host, port, true);
	}

	/**
	 * Set DICOM identifiers of the remote node to query
	 *
	 * @param aet
	 *            DICOM AET
	 * @param host
	 *            host name or ip
	 * @param port
	 *            port
	 * @param reuse
	 *            true: reuse association to AETitle
	 */
	public void setRemoteNode(String aet, String host, int port, boolean reuse) {
		query.setRemoteAETitle(aet, reuse);
		query.setRemoteHost(host);
		query.setRemotePort(port);
	}

	/**
	 * Query retrieve using c-find/c-move
	 * <p>
	 * Actions sequence:<br>
	 * query remote node<br>
	 * move retrieved objects to "move destination"
	 * </p>
	 *
	 * @return number of DICOM objects found on remote node (found objects depend on query retrieve level and can be different from received objects)
	 * @throws IOException
	 */
	public int retrieveMove() throws IOException {
		try {
			List<DicomObject> queryResult = query.query();
			query.move(queryResult);

			return queryResult.size();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Query retrieve using c-find/c-get
	 * <p>
	 * Actions sequence:<br>
	 * query remote node<br>
	 * get retrieved objects
	 * </p>
	 *
	 * @return number of DICOM objects found on remote node (found objects depend on query retrieve level and can be different from received objects)
	 * @throws IOException
	 */
	public int retrieveGet() throws IOException {
		try {
			List<DicomObject> queryResult = query.query();
			query.get(queryResult);

			return queryResult.size();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Move objects to destination using c-move
	 *
	 * @param objectsList
	 *            List of objects DicomObject to move
	 * @throws IOException
	 */
	public void move(List<DicomObject> objectsList) throws IOException {
		try {
			query.move(objectsList);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Get objects using c-get
	 *
	 * @param objectsList
	 *            List of objects DicomObject to get
	 * @throws IOException
	 */
	public void get(List<DicomObject> objectsList) throws IOException {
		try {
			query.get(objectsList);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Query remote DICOM node using c-find
	 *
	 * @return List of DICOM objects found on remote node
	 * @throws IOException
	 */
	public List<DicomObject> query() throws IOException {
		try {
			return query.query();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Perform a DICOM echo
	 *
	 * @throws IOException
	 */
	public void echo() throws IOException {
		try {
			query.echo();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Set move destination
	 *
	 * @param aet
	 *            move destination AET
	 */
	public void setMoveDest(String aet) {
		query.setMoveDest(aet);
	}

	/**
	 * Add filter key for query retrieve
	 *
	 * @param tagName
	 *            e.g. AccessionNumber or 00080050
	 * @param value
	 */
	public void addMatchingKey(String tagName, String value) {
		query.addMatchingKey(Tag.toTagPath(tagName), value);
	}

	/**
	 * Add return key to c-find
	 *
	 * @param tagName
	 *            ex. AccessionNumber or 00080050
	 */
	public void addReturnKey(String tagName) {
		addReturnKey(Tag.toTagPath(tagName));
	}

	/**
	 * Add return key to c-find
	 *
	 * @param tagPath
	 *            ex. Tag.toTagPath("AccessionNumber"), Tag.toTagPath("AccessionNumber/PatientName/PatientSex")
	 */
	public void addReturnKey(int[] tagPath) {
		query.addReturnKey(tagPath);
	}

	/**
	 * Get matching and return keys for c-find
	 *
	 * @return keys
	 */
	public DicomObject getKeys() {
		return query.getKeys();
	}

	/**
	 * @return number of matching and return keys
	 */
	public int keysSize() {
		return query.keysSize();
	}

	/**
	 * Clear matching and return keys
	 */
	public void clearKeys() {
		query.clearKeys();
	}

	/**
	 * Set if to use relation QR
	 *
	 * @param use
	 *            true/false
	 */
	public void setRelationQR(boolean use) {
		query.setRelationQR(use);
	}

	/**
	 * Accept timeout
	 *
	 * @param timeout
	 *            timeout value in milliseconds (default: 90.000)
	 */
	public void setAcceptTimeout(int timeout) {
		query.setAcceptTimeout(timeout);
	}

	/**
	 * Connect timeout
	 *
	 * @param timeout
	 *            timeout value in milliseconds (default: 90.000)
	 */
	public void setConnectTimeout(int timeout) {
		query.setConnectTimeout(timeout);
	}

	/**
	 * Retrieve response timeout
	 *
	 * @param timeout
	 *            timeout value in milliseconds (default: 1.800.000)
	 */
	public void setRetrieveRspTimeout(int timeout) {
		query.setRetrieveRspTimeout(timeout);
	}

	/**
	 * @return Number of objects retrieved (without warnings)
	 */
	public int getTotalComplited() {
		return query.getTotalComplited();
	}

	/**
	 * @return Number of objects retrieved (can have warnings - same as getTotalComplited() + getWarning())
	 */
	public int getTotalRetrieved() {
		return query.getTotalRetrieved();
	}

	/**
	 * @return Number of objects completed with warnings
	 */
	public int getWarning() {
		return query.getWarning();
	}

	/**
	 * @return Number of objects failed
	 */
	public int getFailed() {
		return query.getFailed();
	}

	/**
	 * c-get configuration
	 *
	 * @param cuids
	 *            Abstracts syntax array
	 * @param tsuids
	 *            Transfers syntax array
	 * @param icstoreservice
	 *            Object implementing ICStoreService interface
	 */
	public void configureCGet(String[] cuids, String[] tsuids, ICStoreService icstoreservice) {
		query.addStoreTransferCapabilities(Arrays.asList(cuids), tsuids);
		query.setICStoreService(icstoreservice);
		query.setCGet(true);
	}

	/**
	 * @return c-get retrieved objects iterator
	 */
	public Iterator<DicomObject> iterator() {
		return query.iterator();
	}

	/**
	 * Open association to remote DICOM node
	 *
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public void openAssociation() throws IOException {
		try {
			if (query.isOpen()) {
				throw new IOException("Association already open");
			}

			query.configureTransferCapability(false); // must be called before open association
			query.open();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Close association with remote DICOM node
	 *
	 * @throws IOException
	 */
	@Override
	public void close() throws IOException {
		query.freeMemoryObjects();
		query.close();
	}

	/**
	 * <b style="color:red">USE elco.insc.FileUtils.safeClose</b>
	 *
	 * @deprecated
	 */
	@Deprecated
	public void closeQuietly() {
		CloseUtils.safeClose(this);
	}

	/**
	 * @param tlsProtocol
	 */
	@Override
	public void setTlsProtocol(String[] tlsProtocol) {
		query.setTlsProtocol(tlsProtocol);
	}

	@Override
	public void setTlsWithoutEncyrption() {
		query.setTlsWithoutEncyrption();
	}

	@Override
	public void setTls3DES_EDE_CBC() {
		query.setTls3DES_EDE_CBC();
	}

	@Override
	public void setTlsAES_128_CBC() {
		query.setTlsAES_128_CBC();
	}

	/**
	 * @param needClientAuth
	 */
	@Override
	public void setTlsNeedClientAuth(boolean needClientAuth) {
		query.setTlsNeedClientAuth(needClientAuth);
	}

	/**
	 * @param tlsCipherSuite
	 */
	@Override
	public void setTlsCipherSuite(String[] tlsCipherSuite) {
		query.setTlsCipherSuite(tlsCipherSuite);
	}

	/**
	 * @param key
	 * @param password
	 * @param trust
	 * @throws GeneralSecurityException
	 */
	@Override
	public void initDeviceTLS(KeyStore key, char[] password, KeyStore trust) throws GeneralSecurityException {
		query.initDeviceTLS(key, password, trust);
	}
}
