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
 * GestioneData.java
 *
 * Created on 1 agosto 2006, 11.19
 */

package src.ListeLavoro;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classAHtmlObject;
import imago.http.classColDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.html.Body;

/**
 *
 * @author  fabioc
 */
public class GestioneData {
    private String    DataFrom=null;
     private String    DataTo=null;
     private HttpServletRequest myRequest=null;
     CLogError              log=null;
    /** Creates a new instance of GestioneData */
    public GestioneData(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
        myRequest=request;
        try {
    log=new CLogError(logged_user.db.getWebConnection(), request,  "SERVLETLL", logged_user.login);
      log.setFileName("GestioneData");
      log.setClassName("src.ListeLavoro.GestioneData");
        } catch (Exception ex) {
        	System.out.println("Errore inizializzazione Errore Probabile Utente Nullo"); }
    }
    public void creaData(classFormHtmlObject form, Body inputBody){
        try {
        leggiDatiInput(myRequest);}
        catch (Exception E) {log.writeLog("Errore nella lettura del Request",CLogError.LOG_ERROR);}
        ArrayList mieColonne = new ArrayList();
        new ArrayList();
        String data_scad="";
        classLabelHtmlObject label;
        classColDataTable  td;
        classInputHtmlObject in;
        classRowDataTable tr;
        Calendar rightNow = Calendar.getInstance();
        String day="";
        String Month="";
        try{
        day=Integer.toString(rightNow.get(Calendar.DAY_OF_MONTH));
        if (day.length()==1)
        day="0"+day;
        Month=Integer.toString(rightNow.get(Calendar.MONTH)+1);
        if (Month.length()==1)
        Month="0"+Month;
        data_scad = day+"/"+Month+"/"+Integer.toString(rightNow.get(Calendar.YEAR));            }
        catch (Exception e) {log.writeLog("Errore Generazione Data Odierna",CLogError.LOG_ERROR);}
        if (DataFrom==null)
            {DataFrom=data_scad;}
        if (DataTo==null)
            {DataTo=data_scad;}


        try {
        label = new classLabelHtmlObject("", "", "data_da");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class","classTdLabel");
        td.addAttribute("width", "25%");
        mieColonne.add(td);


        in = new classInputHtmlObject("text", "txtDaData",DataFrom, "30", "10");
        in.addAttribute("id", "txtDaData");
        in.addAttribute("onBlur", "javascript:this.value=checkDate(this.value);");
        classAHtmlObject a = new classAHtmlObject();
        a.addAttribute("border", "0");
        a.addEvent("onMouseOver", "javascript:this.className=\"FILIMGDATAUP\";");
        a.addAttribute("name", "imgDaData");
        a.addAttribute("id", "imgDaData");
        a.addEvent("onMouseOut", "javascript:this.className=\"FILIMGDATA\";");
        a.addEvent("onClick", "javascript:clickOnData(document.all.txtDaData);");//
        //a.addEvent("onClick", "javascript:cal();");//
        a.addAttribute("class", "FILIMGDATA");
      //  in.appendSome(a);
        td = new classColDataTable("TD", "", in);
        td.addAttribute("class", "classTdField");
        td.addAttribute("width", "25%");
        mieColonne.add(td);



        label = new classLabelHtmlObject("", "", "data_a");
        classColDataTable td1 = new classColDataTable("TD", "", label);
        td1.addAttribute("class","classTdLabel");
        td1.addAttribute("width", "25%");
        mieColonne.add(td1);
        in = new classInputHtmlObject("text", "txtAData",DataTo, "30", "10");
        in.addAttribute("id", "txtAData");
        in.addAttribute("onBlur", "javascript:this.value=checkDate(this.value);");
        classAHtmlObject a2 = new classAHtmlObject();
        a2.addAttribute("border", "0");
        a2.addEvent("onMouseOver", "javascript:this.className=\"FILIMGDATAUP\";");
        a2.addAttribute("name", "imgDaData");
        a2.addAttribute("id", "imgDaData");
        a2.addEvent("onMouseOut", "javascript:this.className=\"FILIMGDATA\";");
        a2.addEvent("onClick", "clickOnData(document.all.txtAData);");
        //a2.addEvent("onClick", "javascript:cal2();");
        a2.addAttribute("class", "FILIMGDATA");
        //in.appendSome(a2);
        td1 = new classColDataTable("TD", "", in);
        td1.addAttribute("class", "classTdField");
        td1.addAttribute("width", "25%");
        mieColonne.add(td1);


        tr = new classRowDataTable("", mieColonne);
        classTabHeaderFooter header = new classTabHeaderFooter("");
        header.addColumn("classTabHeaderMiddleTitle",tr.toString());
        form.appendSome(header.toString());
        }
        //form.appendSome(tr.toString());
        catch (Exception e) {log.writeLog("Errore nel Generare La Grafica della Data",CLogError.LOG_ERROR);}
        mieColonne.clear();

        try {
        classFormHtmlObject formCal = new classFormHtmlObject("frmCalendar", "SL_Calendar", "POST");
        formCal.addAttribute("id", "frmCalendar");
        formCal.addAttribute("target", "Calendario");
        classInputHtmlObject dataCal = new classInputHtmlObject("hidden", "dataCal", "");
        classInputHtmlObject dataObj = new classInputHtmlObject("hidden", "dataObj", "");
        formCal.appendSome(dataCal);
        formCal.appendSome(dataObj);

        inputBody.addElement(formCal.toString());
        
        }
         catch (Exception e) {log.writeLog("Errore nell'Appendere la Data alla Pagina",CLogError.LOG_ERROR);}
    }

     private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        DataFrom=myInputRequest.getParameter("txtDaData");
        DataTo=myInputRequest.getParameter("txtAData");


    }
}
