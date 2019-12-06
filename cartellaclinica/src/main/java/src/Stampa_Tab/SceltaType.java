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
 * SceltaType.java
 *
 * Created on 11 agosto 2006, 11.43
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
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
/**
 *
 * @author  fabioc
 */
public class SceltaType {
    String      SelAttivi="",SelTypeOrd="";
    private CLogError           f_log;
    private HttpServletRequest  myRequest=null;
    /** Creates a new instance of SceltaType */
    public SceltaType(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
        myRequest=request;
        try {
            f_log=new CLogError(logged_user.db.getWebConnection(), request,  "SL_Stampa_Tab", logged_user.login);
            f_log.setFileName("SceltaTabella");
            f_log.setClassName("src.ListeLavoro.SceltaTabella");
        } catch (Exception ex) {
        System.out.println("Errore nella creazione log errori per SceltaOrdinamento di SL_Stampa_Tab");
        	}
    }



    public void creaRadio(classFormHtmlObject form){
        leggiDatiInput(myRequest);
        ArrayList mieColonneOrdi = new ArrayList();
        ArrayList mieColonneAtti = new ArrayList();
        ArrayList mieRigheOrdi = new ArrayList();
        ArrayList mieRigheAtti = new ArrayList();
        classLabelHtmlObject label0;
        classLabelHtmlObject label1;
        classLabelHtmlObject label2;
        classLabelHtmlObject label10;
        classLabelHtmlObject label11;
        classLabelHtmlObject label12;
        classColDataTable colonneOrd=null;
        classColDataTable colonneAtti=null;

        //Genera un ciclo che crea contemporaneamente i radio button
        // per la scelta del tipo di ordinamento e il filtraggio per attivi/non attivi
try{
        for (int i=0; i<=2; i++) {
            if(i==0)
            {label0 = new classLabelHtmlObject("", "", "ContTypeOrd0");
             colonneOrd=new classColDataTable("TD","",label0.toString());
             colonneOrd.addAttribute("width", "50%");
             colonneOrd.addAttribute("class","classTdLabel");
             label10= new classLabelHtmlObject("", "", "ContAtti0");
             colonneAtti=new classColDataTable("TD","",label10.toString());
             colonneAtti.addAttribute("width", "50%");
             colonneAtti.addAttribute("class","classTdLabel");
            }
            else
            {classInputHtmlObject TypeOrd= new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"campoTypeOrd","");
             classInputHtmlObject attivi= new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"campoAttivi","");
             if (i==1)
             {label1 = new classLabelHtmlObject("", "", "ContTypeOrd1");
              TypeOrd.appendSome(label1.toString());
              TypeOrd.addEvent("OnClick","javascript:document.formSta_Tab.SelTypeOrd.value='S'" );
              if (SelTypeOrd.equalsIgnoreCase("S"))
                  TypeOrd.setChecked(true);
              colonneOrd=new classColDataTable("TD","",TypeOrd);
              colonneOrd.addAttribute("width", "25%");
              colonneOrd.addAttribute("class","classTdField");
              label11 = new classLabelHtmlObject("", "", "ContAtti1");
              attivi.appendSome(label11.toString());
              attivi.addEvent("OnClick","javascript:document.formSta_Tab.SelAttivi.value='S'" );
              if (SelAttivi.equalsIgnoreCase("S"))
                  attivi.setChecked(true);

              colonneAtti=new classColDataTable("TD","",attivi);
              colonneAtti.addAttribute("width", "25%");
              colonneAtti.addAttribute("class","classTdField");}
             if (i==2)
             {label2 = new classLabelHtmlObject("", "", "ContTypeOrd2");
              TypeOrd.appendSome(label2.toString());
              TypeOrd.addEvent("OnClick","javascript:document.formSta_Tab.SelTypeOrd.value='N'" );
              if (SelTypeOrd.equalsIgnoreCase("N"))
                  TypeOrd.setChecked(true);
              colonneOrd=new classColDataTable("TD","",TypeOrd);
              colonneOrd.addAttribute("width", "25%");
              colonneOrd.addAttribute("class","classTdField");
              label12 = new classLabelHtmlObject("", "", "ContAtti2");
              attivi.appendSome(label12.toString());
              attivi.addEvent("OnClick","javascript:document.formSta_Tab.SelAttivi.value='N'" );
              if (SelAttivi.equalsIgnoreCase("N"))
                  attivi.setChecked(true);
              colonneAtti=new classColDataTable("TD","",attivi);
              colonneAtti.addAttribute("width", "25%");
              colonneAtti.addAttribute("class","classTdField");}
            }
            mieColonneOrdi.add(colonneOrd);
            mieColonneAtti.add(colonneAtti);
        }


        classRowDataTable righeOrdi=new classRowDataTable("",mieColonneOrdi);
        mieRigheOrdi.add(righeOrdi);
        mieColonneOrdi.clear();
        classDataTable tabellaOrdi= new classDataTable("classDataEntryTable",mieRigheOrdi);

        classRowDataTable righeAtti=new classRowDataTable("",mieColonneAtti);
        mieRigheAtti.add(righeAtti);
        mieColonneAtti.clear();
        classDataTable tabellaAtti= new classDataTable("classDataEntryTable",mieRigheAtti);
        //header.addColumn("classDataEntryTable",tabellaSudd.toString());
        form.appendSome(tabellaOrdi.toString());
        form.appendSome(tabellaAtti.toString());
        classInputHtmlObject TypeOrdi= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"SelAttivi",SelAttivi,"");
        classInputHtmlObject Attivi= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"SelTypeOrd",SelTypeOrd,"");
        form.appendSome(TypeOrdi);
        form.appendSome(Attivi);
    }
 catch (Exception ex){
    f_log.writeLog("Errore nella crezione dei Radio Button Tipo ordinamento e filtro Attivi",CLogError.LOG_ERROR);}
    }

    private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        SelAttivi=myInputRequest.getParameter("SelAttivi");
        if (SelAttivi==null)
            SelAttivi="S";
        SelTypeOrd=myInputRequest.getParameter("SelTypeOrd");
        if (SelTypeOrd==null)
            SelTypeOrd="S";

    }
}
