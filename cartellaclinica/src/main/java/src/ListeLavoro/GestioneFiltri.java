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
/*
 * GestioneFiltri.java
 *
 * Created on 1 agosto 2006, 10.17
 */

package src.ListeLavoro;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.html.Body;

/**
 * 
 * @author fabioc
 */
public class GestioneFiltri {
	private HttpServletRequest myRequest = null;

	private String SelFil = "";

	private String FilrtiSelezionati = "";

	CLogError log = null;

	/** Creates a new instance of GestioneFiltri */
	public GestioneFiltri(baseUser logged_user, HttpServletRequest request, CContextParam myConteParam) {
		myRequest = request;
		try {
			log = new CLogError(logged_user.db.getWebConnection(), request, "SERVLETLL", logged_user.login);
			log.setFileName("GestioneFiltri");
			log.setClassName("src.ListeLavoro.GestioneFiltri");
		} catch (Exception ex) {
		}
	}

	public void creaFiltri(classFormHtmlObject form, Body inputBody, int nCDC, int nAree) {

		int numeroCDC = 0;
		leggiDatiInput(myRequest);
		ArrayList mieColonne = new ArrayList();
		ArrayList mieRighe = new ArrayList();
		classLabelHtmlObject label0;
		classLabelHtmlObject label1;
		classLabelHtmlObject label2;
		classLabelHtmlObject label3;
		classLabelHtmlObject label4;
		classLabelHtmlObject label5;
		String NomeFiltro = "";
		numeroCDC = nCDC;
		try {
			if (SelFil == null) {
				SelFil = "1,1,1,1,1";
			}
			String[] ArrayFiltri = SelFil.split(",");
			ArrayFiltri = SelFil.split(",");

			classColDataTable colonne = null;

			label0 = new classLabelHtmlObject("", "", "ContFil0");
			colonne = new classColDataTable("TD", "", label0.toString());
			mieColonne.add(colonne);
			for (int Contatore = 0; Contatore <= 4; Contatore++) {
				classInputHtmlObject input = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "campoFiltri" + Contatore, "");
				if (Contatore == 0) {
					label1 = new classLabelHtmlObject("", "", "ContFil1");
					input.appendSome(label1);
					NomeFiltro = "I";
					input.addEvent("OnClick", "javascript:applicaLLFiltri('" + numeroCDC + "','" + nAree + "');");
				}
				if (Contatore == 1) {
					label2 = new classLabelHtmlObject("", "", "ContFil2");
					input.appendSome(label2);
					NomeFiltro = "E";
					input.addEvent("OnClick", "javascript:applicaLLFiltri('" + numeroCDC + "','" + nAree + "');");
				}
				if (Contatore == 2) {
					label3 = new classLabelHtmlObject("", "", "ContFil3");
					input.appendSome(label3);
					NomeFiltro = "O";
					input.addEvent("OnClick", "javascript:applicaLLFiltri('" + numeroCDC + "','" + nAree + "');");
				}
				if (Contatore == 3) {
					label4 = new classLabelHtmlObject("", "", "ContFil4");
					input.appendSome(label4);
					NomeFiltro = "P";
					input.addEvent("OnClick", "javascript:applicaLLFiltri('" + numeroCDC + "','" + nAree + "');");
				}
				if (Contatore == 4) {
					label5 = new classLabelHtmlObject("", "", "ContFil5");
					input.appendSome(label5);
					NomeFiltro = "L";
					input.addEvent("OnClick", "javascript:applicaLLFiltri('" + numeroCDC + "','" + nAree + "');");
				}
				if (ArrayFiltri[Contatore].equalsIgnoreCase("0")) {
					input.setChecked(false);
				} else {
					input.setChecked(true);
					if (FilrtiSelezionati.equalsIgnoreCase(""))
						FilrtiSelezionati = NomeFiltro;
					else
						FilrtiSelezionati = FilrtiSelezionati + "," + NomeFiltro;
				}
				colonne = new classColDataTable("TD", "", input);
				mieColonne.add(colonne);

			}
			classTabHeaderFooter header = new classTabHeaderFooter("");
			classRowDataTable righe = new classRowDataTable("", mieColonne);
			mieRighe.add(righe);
			mieColonne.clear();
			classDataTable tabellaSudd = new classDataTable("classDataEntryTable", mieRighe);
			mieRighe.clear();
			header.addColumn("classTabHeaderMiddleTitle", tabellaSudd.toString());
			form.appendSome(header.toString());
			classInputHtmlObject FILSELEZIONATI = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "ArrFil", "", "");
			form.appendSome(FILSELEZIONATI.toString());
		} catch (Exception e) {
			log.writeLog("Errore nella creazione dei filtri", CLogError.LOG_ERROR);
		}
	}

	public String getStringFiltriSel() {
		return FilrtiSelezionati;
	}

	private void leggiDatiInput(HttpServletRequest myInputRequest) {

		SelFil = myInputRequest.getParameter("ArrFil");

	}
}
