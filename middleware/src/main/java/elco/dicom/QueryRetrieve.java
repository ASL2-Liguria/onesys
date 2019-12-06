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
import java.util.List;

import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.util.CloseUtils;

import elco.dicom.query.Query;
import elco.dicom.utils.ConstantsUtils.QueryRetrieveLevel;

/**
 * <p>
 * <b style="color:red">USE QueryRetrieve2</b>
 * </p>
 * DICOM query retrieve (c-find, c-move, c-get, echo)
 *
 * @author Roberto Rizzo
 * @deprecated
 */
@Deprecated
public final class QueryRetrieve implements Closeable { // NOSONAR

	private Query query = null;

	/**
	 * <p>
	 * Default query retrieve level: QueryRetrieveLevel.STUDY<br>
	 * Default relation QR: true
	 * </p>
	 *
	 * @param localAET
	 *            local AET
	 */
	public QueryRetrieve(String localAET) {
		query = new Query(localAET);
		query.setQueryLevel(QueryRetrieveLevel.STUDY);
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
	 * query remote node<br>
	 * move retrieved objects to destination
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
	 * Move objects using c-move
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
	 * Query remote DICOM node using c-find
	 * <p>
	 * query remote DICOM node
	 * </p>
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
	 *            ex. Tag.toTagPath("AccessionNumber")
	 */
	public void addReturnKey(int[] tagPath) {
		query.addReturnKey(tagPath);
	}

	/**
	 * Clear matching and return keys
	 */
	public void clearKeys() {
		query.clearKeys();
	}

	/**
	 * Set query retrieve level
	 * <p>
	 * QueryRetrieveLevel.PATIENT<br>
	 * QueryRetrieveLevel.STUDY<br>
	 * QueryRetrieveLevel.SERIES<br>
	 * QueryRetrieveLevel.IMAGE
	 * </p>
	 *
	 * @param qrLevel
	 *            query retrieve level
	 */
	public void setQueryLevel(QueryRetrieveLevel qrLevel) {
		query.setQueryLevel(qrLevel);
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
	 * Open association to remote DICOM node
	 *
	 * @throws IOException
	 */
	public void openAssociation() throws IOException {
		try {
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
	 * Quietly close association with remote DICOM node (no exception will be raised)
	 */
	public void closeQuietly() {
		CloseUtils.safeClose(this);
	}
}
