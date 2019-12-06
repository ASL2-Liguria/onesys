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
 * GestioneProvenienza.java
 *
 * Created on 1 agosto 2006, 11.08
 */

package src.ListeLavoro;

import imago.a_sql.CLogError;
import imago.a_sql.CTabPro;
import imago.a_sql.CTabProData;
import imago.a_util.CContextParam;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classDivButton;
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
public class GestioneProvenienza {
    private baseUser  User=null;
     CLogError                           log=null;
    /** Creates a new instance of GestioneProvenienza */
    public GestioneProvenienza(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam) {
    User=logged_user;
     try {
    log=new CLogError(User.db.getWebConnection(), request,  "SERVLETLL", User.login);
     log.setFileName("GestioneProvenienza");
      log.setClassName("src.ListeLavoro.GestioneProvenienza");
     } catch (Exception ex) { }

    }
 public void creaProv(classFormHtmlObject form,String ElencoFiltri,String ElencoCdc){
        ArrayList mieColonne = new ArrayList();
        ArrayList mieRighe = new ArrayList();
        classLabelHtmlObject label;
        classColDataTable  td;
        classColDataTable  tdProv;
        classSelectHtmlObject in;
        try {
        label = new classLabelHtmlObject("", "", "Prov_da");
        td = new classColDataTable("TD", "", label);
       td.addAttribute("width", "22%");
       td.addAttribute("class","classTdLabel");
       mieColonne.add(td);

        in = new classSelectHtmlObject("Provda",5);
         in.setMultiple(true);
        //in.addAttribute("id","IDProvda");
        CTabPro Provda=null;
        CTabProData MyProvDaData=null;
        String[] ArrElencoFiltri=ElencoFiltri.split(",");
        String whereAgg="";

         String[] eleCDC=ElencoCdc.split(",");
        String CDCelenco="'"+eleCDC[0]+"'";
        for (int con=1;con<=eleCDC.length-1;con++)
        {CDCelenco=CDCelenco+",'"+eleCDC[con]+"'";}
	if (ArrElencoFiltri.length==0)
        {whereAgg="attivo='S'";}
        else{
            whereAgg="attivo='S' and INT_EST='"+ArrElencoFiltri[0]+"'";

            for (int i=1; i<ArrElencoFiltri.length;i++)
            {whereAgg=whereAgg+" or INT_EST='"+ArrElencoFiltri[i]+"'";
            }}
        try{
            Provda=new CTabPro(User.db.getDataConnection());

            Provda.loadDataIn(User,CDCelenco,whereAgg,"",true,false);
        }
        catch (Exception e){
        log.writeLog("Errore Connessione tabella Tab_pro o request non pervenuta",CLogError.LOG_ERROR);}
        ArrayList elencoProvda=Provda.getData();
         for (int i=0; i<elencoProvda.size();i++){
                    MyProvDaData=(CTabProData)elencoProvda.get(i);
                    String ProvIden=MyProvDaData.m_strDESCR;
                    String ProvDescr=Integer.toString(MyProvDaData.m_iIDEN);

                    in.addOption(ProvDescr,ProvIden);}

                in.addEvent("ondblClick","javascript:add_list_elements(\"Provda\",\"Prova\");");
        tdProv = new classColDataTable("TD", "", in);
        tdProv.addAttribute("class", "classTdField");
        td.addAttribute("class","classTdLabel");
        tdProv.addAttribute("width", "22%");
        mieColonne.add(tdProv);
        classColDataTable tdPuls = new classColDataTable("TD", "", label);
      tdPuls.addAttribute("width", "120");
      tdPuls.addAttribute("class","classTdLabel");
      classDivButton button_sel_all_sx = new classDivButton("", "pulsante", "javascript:sel_des(document.formLL.Provda,true)","bt_all_sx","");
      button_sel_all_sx.addAttribute("align","centre");
      tdPuls.appendSome(button_sel_all_sx);
      classDivButton button_sel_all_dx = new classDivButton("", "pulsante", "javascript:sel_des(document.formLL.Prova,true)","bt_all_dx","");
      tdPuls.appendSome(button_sel_all_dx);
      classDivButton button_include = new classDivButton("", "pulsante", "javascript:add_list_elements(\"Provda\",\"Prova\");","bt_incl","");
      tdPuls.appendSome(button_include);
      classDivButton button_esclude = new classDivButton("", "pulsante", "javascript:add_list_elements(\"Prova\",\"Provda\");","bt_escl","");
      tdPuls.appendSome(button_esclude);
      mieColonne.add(tdPuls);

        label = new classLabelHtmlObject("", "", "Prov_a");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class","classTdLabel");
        td.addAttribute("width", "22%");
        mieColonne.add(td);
        /*label = new classLabelHtmlObject("", "", "data_da");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class","classTdLabel");
        td.addAttribute("width", "25%");
        mieColonne.add(td);*/

       in = new classSelectHtmlObject("Prova",5);
       in.setMultiple(true);
       //in.addAttribute("id", "IDProva");
       in.addEvent("ondblClick","javascript:add_list_elements(\"Prova\",\"Provda\");");
       tdProv = new classColDataTable("TD", "", in);
        tdProv.addAttribute("class", "classTdField");
        td.addAttribute("class","classTdLabel");
        tdProv.addAttribute("width", "22%");
        mieColonne.add(tdProv);



        new classTabHeaderFooter("");
        classRowDataTable righe=new classRowDataTable("",mieColonne);
        mieRighe.add(righe);
        mieColonne.clear();
        classDataTable tabellaSudd= new classDataTable("classDataEntryTable",mieRighe);
        //header.addColumn("classDataEntryTable",tabellaSudd.toString());
        form.appendSome(tabellaSudd.toString());}
        catch (Exception e) {log.writeLog("Errore nella creazione della gestione della provenienza",CLogError.LOG_ERROR);}

    }

}
