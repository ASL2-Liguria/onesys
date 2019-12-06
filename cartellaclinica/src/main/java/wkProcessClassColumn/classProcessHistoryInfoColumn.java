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
package wkProcessClassColumn;

import imago.http.classColDataTable;
import imago.http.classDivButton;
import imagoCreateWk.IprocessDataTable;
import imagoView.ImagoViewException;
import imagoView.Iview;

public class classProcessHistoryInfoColumn implements IprocessDataTable {
	public classProcessHistoryInfoColumn() {
	}

	public String processData(Iview interfacciaVista) {
		classDivButton myDivInfo = null;
		myDivInfo = new classDivButton("&nbsp;", "classInfoIcon", "", "", "");
		try {
			myDivInfo.addAttributeToDiv("onclick", "javascript:showInfoLayerAboutExam('" + interfacciaVista.getField("IDEN").toString() + "',this);");
		} catch (ImagoViewException ex) {
		}
		return myDivInfo.toString();
	}

	public String processData(String oggetto) {
		return "&nbsp;";
	}

	public classColDataTable processColumn(classColDataTable oggetto) {
		// non faccio nessuna elaborazione sull oggetto
		return oggetto;
	}
}
