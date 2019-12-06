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
 * GestioneSuddivisione.java
 *
 * Created on 1 agosto 2006, 9.56
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
/**
 *
 * @author  fabioc
 */
public class GestioneSuddivisione {
    private String Selezionato="";
    private HttpServletRequest myRequest=null;
    CLogError                           log=null;
    /** Creates a new instance of GestioneSuddivisione */
    public GestioneSuddivisione(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
    myRequest=request;
    try {
    log=new CLogError(logged_user.db.getWebConnection(), myRequest, "SERVLETLL", logged_user.login);
    log.setFileName("GestioneSuddivisione");
      log.setClassName("src.ListeLavoro.GestioneSuddivisione");
    } catch (Exception ex) { }
    }


    public void creaSudd(classFormHtmlObject form){

    leggiDatiInput(myRequest);
    try {
    ArrayList mieColonne = new ArrayList();
    ArrayList mieRighe = new ArrayList();
    classLabelHtmlObject label0;
        classLabelHtmlObject label1;
        classLabelHtmlObject label2;
        classLabelHtmlObject label3;
    if (Selezionato==null)
    {Selezionato="";}
        for (int Contatore=0;Contatore<=3; Contatore++){

         classColDataTable colonne=null;
        if(Contatore==0)
            {
             label0 = new classLabelHtmlObject("", "", "ContSudd0");
             colonne=new classColDataTable("TD","",label0.toString());}
        else{
        classInputHtmlObject input= new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"campoSudd","");

        if(Contatore==1)
                {   label1 = new classLabelHtmlObject("", "", "ContSudd1");
                    input.appendSome(label1);
                    if (Selezionato.equalsIgnoreCase("LL_PROV_STD") || Selezionato.equalsIgnoreCase("") || Selezionato==null)
                    {input.setChecked(true);                    }
                    input.addEvent("OnClick","javascript:document.formLL.stampaFunzioneStampa.value='LL_PROV_STD'");}
         if(Contatore==2)
                {   label2 = new classLabelHtmlObject("", "", "ContSudd2");
                    input.appendSome(label2);
         if (Selezionato.equalsIgnoreCase("LL_CDC_STD"))
                    input.setChecked(true);
         input.addEvent("OnClick","javascript:document.formLL.stampaFunzioneStampa.value='LL_CDC_STD'");}
         if(Contatore==3)
                {   label3 = new classLabelHtmlObject("", "", "ContSudd3");
                    input.appendSome(label3);
                    if (Selezionato.equalsIgnoreCase("LL_SALA_STD"))
                    input.setChecked(true);
                    input.addEvent("OnClick","javascript:document.formLL.stampaFunzioneStampa.value='LL_SALA_STD'");}
        colonne=new classColDataTable("TD","",input);}
        mieColonne.add(colonne);

    }
        classTabHeaderFooter header = new classTabHeaderFooter("");
        classRowDataTable righe=new classRowDataTable("",mieColonne);
        mieRighe.add(righe);
        mieColonne.clear();
        classDataTable tabellaSudd= new classDataTable("classDataEntryTable",mieRighe);
        header.addColumn("classTabHeaderMiddleTitle",tabellaSudd.toString());
        classInputHtmlObject funzStamp= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaFunzioneStampa","","");
        funzStamp.addAttribute("value", Selezionato);
        form.appendSome(header.toString());
        form.appendSome(funzStamp.toString());
    }
     catch (Exception e) {log.writeLog("Errore nella creazione della suddivisione Impossibile!!!!",CLogError.LOG_ERROR);}
}
     private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        Selezionato=myInputRequest.getParameter("stampaFunzioneStampa");



    }
}
