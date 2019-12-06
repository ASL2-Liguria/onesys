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
package elco.middleware.camel.components.dicomMWLSCP;

import java.util.ArrayList;
import java.util.List;

import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.data.VR;
import org.dcm4che2.net.Association;
import org.dcm4che2.net.DimseRSP;
import org.dcm4che2.net.Status;

/**
 * @author Roberto Rizzo
 */
public final class MultiFindRSP implements DimseRSP {

	private final List<DicomObject> dicomObjects = new ArrayList<>();
	private int current = 0;
	private final DicomObject response;
	private final DicomObject keys;
	private DicomObject mwl;

	public MultiFindRSP(DicomObject keys, DicomObject response) {
		this.keys = keys;
		// always return Specific Character Set
		if (!keys.contains(Tag.SpecificCharacterSet)) {
			keys.putNull(Tag.SpecificCharacterSet, VR.CS);
		}
		this.response = response;
	}

	public void addObject(DicomObject dObject) {
		dicomObjects.add(dObject);
	}

	@Override
	public synchronized boolean next() {
		if (current < 0) {
			return false;
		}

		if (dicomObjects.isEmpty()) {
			response.putInt(Tag.Status, VR.US, Status.Cancel);
		} else {
			try {
				while (current < dicomObjects.size()) {
					mwl = dicomObjects.get(current++);
					if (mwl.matches(keys, true)) { // NOSONAR
						// always return Specific Character Set
						if (!mwl.contains(Tag.SpecificCharacterSet)) {
							mwl.putNull(Tag.SpecificCharacterSet, VR.CS);
						}
						response.putInt(Tag.Status, VR.US, mwl.containsAll(keys) ? Status.Pending : Status.PendingWarning);
						return true;
					}
				}
				response.putInt(Tag.Status, VR.US, Status.Success);
			} catch (Exception ex) { // NOSONAR
				response.putInt(Tag.Status, VR.US, Status.ProcessingFailure);
				response.putString(Tag.ErrorComment, VR.LO, ex.getLocalizedMessage());
			}
		}

		mwl = null;
		current = -1;

		return true;
	}

	@Override
	public DicomObject getCommand() {
		return response;
	}

	@Override
	public DicomObject getDataset() {
		return mwl != null ? mwl.subSet(keys) : null;
	}

	@Override
	public synchronized void cancel(Association association) {
		dicomObjects.clear();
	}
}
