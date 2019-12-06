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


package src.ListeLavoro;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imago_jack.imago_function.html.functionHTML;

import javax.servlet.http.HttpServletRequest;

public class GestioneStato {
    private CLogError           f_log;
    private HttpServletRequest  myRequest=null;
    private String              statOld="";
    public GestioneStato(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam){
        myRequest=request;
        try {
    f_log=new CLogError(logged_user.db.getWebConnection(), request,  "SERVLETLL", logged_user.login);
     f_log.setFileName("GestioneStato");
     f_log.setClassName("src.ListeLavoro.GestioneStato");
        } catch (Exception ex) { }

    }

    public void creaStato(classFormHtmlObject form){
        try {
        leggiDatiInput(myRequest);}
         catch (Exception e) {f_log.writeLog("Errore nella Lettura del Request",CLogError.LOG_ERROR);}


        classDivHtmlObject div = new classDivHtmlObject("div_stato","display='none'");
          functionHTML fHTML = new functionHTML();
           functionHTML fHTML1 = new functionHTML();
           functionHTML fHTML2 = new functionHTML();

        try {
        classInputHtmlObject input= new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"campoStatoEnt","");
        classInputHtmlObject input1= new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"campoStatoEnt","");
        classInputHtmlObject input2= new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"campoStatoEnt","");
        new classDataTable("myTab");

        classLabelHtmlObject label1;
        classLabelHtmlObject label2;
        classLabelHtmlObject label3;
        classLabelHtmlObject label4;
        classLabelHtmlObject label5;
        classLabelHtmlObject label6;
        classLabelHtmlObject label7;


        label1 = new classLabelHtmlObject("", "", "StatPre");
        label2 = new classLabelHtmlObject("", "", "StatAcc");
        label3 = new classLabelHtmlObject("", "", "StatEnt");
        input.appendSome(label1);
        input1.appendSome(label2);
        input2.appendSome(label3);
        classInputHtmlObject inputEse = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkEse", "ESEGUITO");
        label4 = new classLabelHtmlObject("", "", "StatEse");
        inputEse.appendSome(label4);
        classInputHtmlObject inputRef = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkRef", "REFERTATO");
        label5 = new classLabelHtmlObject("", "", "StatRef");
        inputRef.appendSome(label5);
        classInputHtmlObject inputFir = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkFir","FIRMATO");
        label6 = new classLabelHtmlObject("", "", "StatFir");
        inputFir.appendSome(label6);
        classInputHtmlObject inputCon = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkCon","CONSEGNATO");
        label7 = new classLabelHtmlObject("", "", "StatCon");
        inputCon.appendSome(label7);
        String statoTit="";
        if (statOld!=null)
            {
                if (!statOld.equalsIgnoreCase("")) {

                    if (statOld.length()>1 && statOld.substring(0, 1).equalsIgnoreCase("P") &&
                        !statOld.substring(1, 2).equalsIgnoreCase("A")) {
                        statoTit="Prenotati";
                        input.setChecked(true);
                    }
                    if (statOld.length()>1 && statOld.substring(0, 1).equalsIgnoreCase("P") &&
                        statOld.substring(1, 2).equalsIgnoreCase("A")) {
                        input2.setChecked(true);
                        statoTit="Prenotati,Accettati";
                    }
                    if (statOld.length()>=1 && !statOld.substring(0, 1).equalsIgnoreCase("P") &&
                        statOld.substring(1, 2).equalsIgnoreCase("A")) {
                        input1.setChecked(true);
                        statoTit="Accettati";
                    }


                    if (statOld.length()>=3 && statOld.substring(2, 3).equalsIgnoreCase("E")) {
                        inputEse.setChecked(true);
                        statoTit+=",Eseguiti";
                      }

                    if (statOld.length()>=10 && statOld.substring(9, 10).equalsIgnoreCase("R")) {
                        inputRef.setChecked(true);
                        statoTit+=",Refertati";
                    }

                    if (statOld.length()>=13 && statOld.substring(12, 13).equalsIgnoreCase("F")) {
                        inputFir.setChecked(true);
                        statoTit+=",Firmato";
                    }

                    if (statOld.length()>=9 && statOld.substring(8, 9).equalsIgnoreCase("K")) {
                        inputCon.setChecked(true);
                        statoTit+=",Consegnati";
                    }
                }
                else
                {
                    input1.setChecked(true);
                }
            }
            else
               {
                   input1.setChecked(true);
               }

        fHTML.creaColonnaField(input) ;
        fHTML.creaColonnaField(input1) ;
        fHTML.creaColonnaField(input2) ;
       fHTML.aggiungiRiga();


       fHTML1.creaColonnaField(inputEse) ;
       fHTML1.creaColonnaField(inputRef) ;
       fHTML1.aggiungiRiga();
       fHTML1.creaColonnaField(inputFir) ;
       fHTML1.creaColonnaField(inputCon) ;
       fHTML1.aggiungiRiga();
       classInputHtmlObject inputAll = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkALL", "ALL");
        classLabelHtmlObject labelAll = new classLabelHtmlObject("", "", "StatAll");
        inputAll.appendSome(labelAll);


       fHTML2.creaColonnaField(inputAll) ;
       fHTML2.aggiungiRiga();
        div.appendSome(fHTML.getTable());
        div.appendSome(fHTML1.getTable());
         div.appendSome(fHTML2.getTable());
        classLabelHtmlObject label_titolo=new classLabelHtmlObject("","","titoloStato");
        label_titolo.addAttribute("title",statoTit);
        classTabHeaderFooter header = new classTabHeaderFooter(label_titolo.toString());
        classDivButton apri_chiudi= new classDivButton("", "pulsante", "javascript:ApriChiudi('div_stato',10);", "apri_chiudiStato","");
        header.addColumn(label_titolo.toString(),label_titolo.toString());
        header.addColumn("classButtonHeader", apri_chiudi.toString());
        classTabHeaderFooter footer = new classTabHeaderFooter(" ");
        footer.setClasses("classTabHeader","classTabFooterSx","classTabHeaderMiddle","classTabFooterDx");
        classInputHtmlObject statOld= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"statOld","");
        form.appendSome(statOld);
        form.appendSome(header.toString());
        div.appendSome(footer.toString());
        form.appendSome(div);
        }
         catch (Exception e) {f_log.writeLog("Errore Appendendo lo stato",CLogError.LOG_ERROR);}

    }


    private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        statOld=myInputRequest.getParameter("statOld");



    }
}



