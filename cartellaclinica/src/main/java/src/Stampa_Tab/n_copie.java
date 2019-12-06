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
 * n_copie.java
 *
 * Created on 11 agosto 2006, 16.58
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
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
/**
 *
 * @author  fabioc
 */
public class n_copie {
    private CLogError           f_log;
    private HttpServletRequest  myRequest=null;
    private String              nCop="";
    /** Creates a new instance of n_copie */
    public n_copie(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
        myRequest=request;
        try {
            f_log=new CLogError(logged_user.db.getWebConnection(), request, "SL_Stampa_Tab", logged_user.login);
            f_log.setFileName("SceltaTabella");
            f_log.setClassName("src.ListeLavoro.SceltaTabella");
        } catch (Exception ex) {
        System.out.println("Errore nella creazione log errori per SceltaOrdinamento di SL_Stampa_Tab");}
    }
    public void creaTextnCopie(classFormHtmlObject form){

        int i=0;
        String numCopPrecedente="";
        ArrayList mieColonne = new ArrayList();
        ArrayList mieRighe = new ArrayList();
        classLabelHtmlObject label;
        classColDataTable  td;
        leggiDatiInput(myRequest);

try{
        //Crea la label
        label = new classLabelHtmlObject("", "", "insNcopie");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("width", "50%");
        td.addAttribute("class","classTdLabel");
        mieColonne.add(td);


        //creazione del campo text dove inserire il n° di copie da stampare, rimane se ricaricata la pagina
        int n=Integer.parseInt(nCop);
        classSelectHtmlObject ncopie= new classSelectHtmlObject("ncop",1);
        for (i=1; i<=10 ; i++)

        { if (i==n)
          { ncopie.addOption(Integer.toString(i),Integer.toString(i),true);
            numCopPrecedente=Integer.toString(i);
            ncopie.addEvent("onChange","javascript:document.formSta_Tab.NumCopNas.value=document.formSta_Tab.ncop.value");
          }
          else
              ncopie.addOption(Integer.toString(i),Integer.toString(i),false);
          ncopie.addEvent("onChange","javascript:document.formSta_Tab.NumCopNas.value=document.formSta_Tab.ncop.value");
        }
        td = new classColDataTable("TD", "", ncopie.toString());
        td.addAttribute("width", "50%");
        td.addAttribute("class","classTdField");
        mieColonne.add(td);
        classRowDataTable righe=new classRowDataTable("",mieColonne);
        mieRighe.add(righe);
        mieColonne.clear();
        classDataTable tabellaSudd= new classDataTable("classDataEntryTable",mieRighe);
        form.appendSome(tabellaSudd.toString());
        classInputHtmlObject nCop= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"NumCopNas",numCopPrecedente,"");
        form.appendSome(nCop.toString());
    }
catch (Exception ex){
    f_log.writeLog("Errore nella crezione del numero di copie da stampare",CLogError.LOG_ERROR);}
    }

    private void leggiDatiInput(HttpServletRequest myInputRequest)  {

        nCop= myInputRequest.getParameter("NumCopNas");
        if (nCop==null)
            nCop="1";
        if (nCop.equalsIgnoreCase(""))
            nCop="1";
    }
}
