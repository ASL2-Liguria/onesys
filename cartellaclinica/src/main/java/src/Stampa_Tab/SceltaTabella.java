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
 * SceltaTabella.java
 *
 * Created on 11 agosto 2006, 9.57
 */

package src.Stampa_Tab;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author  fabioc
 */
public class SceltaTabella {
    private CLogError           f_log;
    private HttpServletRequest  myRequest=null;
    private String              SelTab="";
    /** Creates a new instance of SceltaTabella */
    public SceltaTabella(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
        myRequest=request;
        try {
            f_log=new CLogError(logged_user.db.getWebConnection(), request, "SL_Stampa_Tab", logged_user.login);
            f_log.setFileName("SceltaTabella");
            f_log.setClassName("src.ListeLavoro.SceltaTabella");
        } catch (Exception ex) {
            System.out.println("Errore nella creazione log errori per SceltaOrdinamento di SL_Stampa_Tab");
        	}
    }

    public void creaComboTabelle(classFormHtmlObject form){

        ArrayList mieColonne = new ArrayList();
        ArrayList mieRighe = new ArrayList();
        classLabelHtmlObject label;
        classColDataTable  td;
        classSelectHtmlObject in;
        classColDataTable  tdProv;
        leggiDatiInput(myRequest);
        try{
        //Crea Label
        label = new classLabelHtmlObject("", "", "scelta_Tab");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("width", "50%");
        td.addAttribute("class","classTdLabel");
        mieColonne.add(td);

        //Crea Combo box. Attenzione occorre aggiungere di qua le tabelle visualizzabili
        in = new classSelectHtmlObject("SceltaTab",1);
        boolean con1=false;
        boolean con2=false;
        boolean con3=false;
        boolean con4=false;
        if (SelTab.equalsIgnoreCase("TAB_ESA"))
            con1=true;
        if (SelTab.equalsIgnoreCase("TAB_PER"))
            con2=true;
        if (SelTab.equalsIgnoreCase("TAB_PRO"))
            con3=true;
        if (SelTab.equalsIgnoreCase("TARE_ESA"))
            con4=true;
        in.addOption("TAB_ESA","Tabella desc. Esami",con1);
        in.addOption("TAB_PER","Tabella Personale",con2);
        in.addOption("TAB_PRO","Tabella Provenienze",con3);
        in.addOption("TARE_ESA","Tabella collegamenti Sale Esami",con4);
        in.addEvent("onChange","javascript:aggiorna();changeCDC();");
        tdProv = new classColDataTable("TD", "", in);
        tdProv.addAttribute("class", "classTdField");
        td.addAttribute("class","classTdLabel");
        tdProv.addAttribute("width", "50%");
        mieColonne.add(tdProv);

        new classTabHeaderFooter("");
        classRowDataTable righe=new classRowDataTable("",mieColonne);
        mieRighe.add(righe);
        mieColonne.clear();
        classDataTable tabellaSudd= new classDataTable("classDataEntryTable",mieRighe);
        //header.addColumn("classDataEntryTable",tabellaSudd.toString());
        classInputHtmlObject Sel= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"SelTab",SelTab,"");
        form.appendSome(Sel);
        form.appendSome(tabellaSudd.toString());

    }
     catch (Exception ex){
    f_log.writeLog("Errore nella crezione della Scelta Tabella",CLogError.LOG_ERROR);}
    }


    private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        SelTab=myInputRequest.getParameter("SelTab");
        if (SelTab==null)
            SelTab="TAB_ESA";


    }

}

