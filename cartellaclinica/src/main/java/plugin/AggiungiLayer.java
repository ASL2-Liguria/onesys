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
package plugin;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFieldsetHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classLegendHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTextAreaHtmlObject;
import imago.http.classTypeInputHtmlObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class AggiungiLayer extends baseAttributeEngine{

	private classDivHtmlObject divRet = null;

	//@Override
	public void init(ServletContext arg0, HttpServletRequest arg1) {

		divRet=new classDivHtmlObject("divRet");

		super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);
		// TODO Auto-generated method stub

	}

	//@Override
	public void getValueContainer(String arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object get_attribute_engine() {
		// TODO Auto-generated method stub
		return divRet;
	}

	public void draw()
	{
		classFieldsetHtmlObject fieldset=null;
		classLegendHtmlObject Legend =null;
		classDataTable Table=null;
		classLabelHtmlObject label=null;
		classInputHtmlObject input=null;
		classTextAreaHtmlObject textarea=null;
		int contatore=0;


		classRowDataTable cRow=null;
		classColDataTable cCol=null;

		if(contatore==0 && super.db_dati.getField("txtAnno_" + contatore).getValue().equals("")){

			fieldset=new classFieldsetHtmlObject();
	        Legend = new classLegendHtmlObject ("Interventi");
	        fieldset.addAttribute("id", "fieldset_"+contatore);
	        fieldset.appendSome(Legend.toString());
			Table=new classDataTable("classDataEntryTable");
			Table.addAttribute("id", "oTable_" + contatore);

			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Anno");
			label.addAttribute("ID", "lblAnno_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			input=new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtAnno_"+contatore,"");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(input);
			cRow.addCol(cCol);
			Table.addRow(cRow);


			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Codice ICD");
			label.addAttribute("ID", "lblCodICD_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			input=new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtCodICD_"+contatore,"");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(input);
			cRow.addCol(cCol);
			Table.addRow(cRow);


			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Descrizione ICD");
			label.addAttribute("ID", "lblDescrICD_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			input=new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtDescrICD_"+contatore,"");
			input.addAttribute("size", "160");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(input);
			cRow.addCol(cCol);
			Table.addRow(cRow);


			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Descrizione");
			label.addAttribute("ID", "lblDescr_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			textarea=new classTextAreaHtmlObject("txtDescr_"+contatore,"4","");
			textarea.addAttribute("style","width:100%");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(textarea);
			cRow.addCol(cCol);
			Table.addRow(cRow);

			fieldset.appendSome(Table);
			this.divRet.appendSome(fieldset);

		}


		while(super.db_dati.getField("txtAnno_" + contatore).getValue() != null && !super.db_dati.getField("txtAnno_" + contatore).getValue().equals("")){

			fieldset=new classFieldsetHtmlObject();
			fieldset.addAttribute("id", "fieldset_"+contatore);
	        Legend= new classLegendHtmlObject ("Interventi");
	        fieldset.appendSome(Legend.toString());
			Table=new classDataTable("table_");
			Table.addAttribute("id", "oTable_" + contatore);

			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Anno");
			label.addAttribute("ID", "lblAnno_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			input=new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtAnno_"+contatore,"");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(input);
			cRow.addCol(cCol);
			Table.addRow(cRow);


			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Codice ICD");
			label.addAttribute("ID", "lblCodICD_"+contatore);
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			input=new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtCodICD_"+contatore,"");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(input);
			cRow.addCol(cCol);
			Table.addRow(cRow);


			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Descrizione ICD");
			label.addAttribute("ID", "lblDescrICD_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			input=new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtDescrICD_"+contatore,"");
			cCol.addAttribute("class", "classTdField");
			input.addAttribute("size", "160");
			cCol.appendSome(input);
			cRow.addCol(cCol);
			Table.addRow(cRow);


			cRow=new classRowDataTable();
			cCol=new classColDataTable("TD", "", "");
			label=new classLabelHtmlObject("Descrizione");
			label.addAttribute("ID", "lblDescr_"+contatore);
			cCol.addAttribute("class", "classTdLabel");
			cCol.appendSome(label);
			cRow.addCol(cCol);
			cCol=new classColDataTable("TD", "", "");
			textarea=new classTextAreaHtmlObject("txtDescr_"+contatore,"4","");
			textarea.addAttribute("style","width:100%");
			cCol.addAttribute("class", "classTdField");
			cCol.appendSome(textarea);
			cRow.addCol(cCol);
			Table.addRow(cRow);
			fieldset.appendSome(Table);
			this.divRet.appendSome(fieldset);

			contatore++;
		}

	}
}

