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
 * SceltaOrdinamento.java
 *
 * Created on 11 agosto 2006, 10.18
 */

package src.Stampa_Tab;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
/**
 *
 * @author  fabioc
 */
public class SceltaOrdinamento {
    private CLogError           f_log;
    private HttpServletRequest  myRequest=null;
    private String              TabSel="";
    /** Creates a new instance of SceltaOrdinamento */
    public SceltaOrdinamento(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
        myRequest=request;
        try {
            f_log=new CLogError(logged_user.db.getWebConnection(), request, "SL_Stampa_Tab", logged_user.login);
            f_log.setFileName("SceltaCDC");
            f_log.setClassName("src.ListeLavoro.SceltaCDC");
        } catch (Exception ex) {
        System.out.println("Errore nella creazione log errori per SceltaOrdinamento di SL_Stampa_Tab");
        }
    }


    public void creaListBoxOrdi(classFormHtmlObject form){
        int OggettiVisualizzati=5;    //variabile che specifica quanto vuole lunghe le list box
        ArrayList mieColonne = new ArrayList();
        ArrayList mieRighe = new ArrayList();
        classLabelHtmlObject label;
        classColDataTable  td;
        classSelectHtmlObject in;
        classColDataTable  tdProv;
        leggiDatiInput(myRequest);

      try{
        //Crea Prima Label
        label = new classLabelHtmlObject("", "", "ScelCampiSin");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("width", "25%");
        td.addAttribute("class","classTdLabel");
        mieColonne.add(td);

        //Crea La List dei campi selezionabili a seconda della tabella selezionata
        in = new classSelectHtmlObject("CampiSin",OggettiVisualizzati);
        if (TabSel==null)
        {TabSel="TAB_ESA";}
        if (TabSel.equalsIgnoreCase("TAB_ESA"))
        {in.addOption("DESCR","Descrizione");
         in.addOption("COD_ESA","Codice Esame");
         in.addOption("ATTIVO","Attivo s/n");
         in.addOption("COD_SIRM","Codice Sirm");}

        if (TabSel.equalsIgnoreCase("TAB_PRO"))
        {in.addOption("DESCR","Descrizione");
         in.addOption("COD_DEC","Codice Personale");
         in.addOption("ATTIVO","Attivo s/n");}

        if (TabSel.equalsIgnoreCase("TAB_PER"))
        {in.addOption("DESCR","Cognome e Nome");
         in.addOption("TIPO","Categoria");
         in.addOption("TIPO_MED","Categoria Medico");
         in.addOption("ATTIVO","Attivo s/n");
         in.addOption("COD_DEC","Codice");}

        in.addEvent("ondblClick","javascript:add_list_elements(\"CampiSin\",\"CampiDes\");");
        tdProv = new classColDataTable("TD", "", in);
        tdProv.addAttribute("class", "classTdField");
        td.addAttribute("class","classTdLabel");
        tdProv.addAttribute("width", "25%");
        mieColonne.add(tdProv);

        //Crea la seconda Label
        label = new classLabelHtmlObject("", "", "ScelCampiDes");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class","classTdLabel");
        td.addAttribute("width", "25%");
        mieColonne.add(td);

        //Crea la list di come si vuole l'ordinamento in ordine del modo in cui sono inseriti
        in = new classSelectHtmlObject("CampiDes",OggettiVisualizzati);
        //in.addAttribute("id", "IDProva");
        in.addEvent("ondblClick","javascript:add_list_elements(\"CampiDes\",\"CampiSin\");");
        tdProv = new classColDataTable("TD", "", in);
        tdProv.addAttribute("class", "classTdField");
        td.addAttribute("class","classTdLabel");
        tdProv.addAttribute("width", "25%");
        mieColonne.add(tdProv);


        new classTabHeaderFooter("");
        classRowDataTable righe=new classRowDataTable("",mieColonne);
        mieRighe.add(righe);
        mieColonne.clear();
        classDataTable tabellaSudd= new classDataTable("classDataEntryTable",mieRighe);
        //header.addColumn("classDataEntryTable",tabellaSudd.toString());
        form.appendSome(tabellaSudd.toString());

      }
    catch (Exception ex){
    f_log.writeLog("Errore nella crezione dell'ordinamento",CLogError.LOG_ERROR);}
    }


    private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        TabSel=myInputRequest.getParameter("SelTab");



    }
}
