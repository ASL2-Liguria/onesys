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
 * GestioneSale.java
 *
 * Created on 1 agosto 2006, 9.25
 */

package src.ListeLavoro;

import imago.a_sql.CLogError;
import imago.a_sql.CTabSal;
import imago.a_sql.CTabSalData;
import imago.a_util.CContextParam;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
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
public class GestioneSale {
    private String              SelAre=null;
    private CLogError           f_log;
    private baseUser            myUser=null;
    private HttpServletRequest  myRequest=null;
    private int                  numeroArea=0;
    /** Creates a new instance of GestioneSale */
    public GestioneSale(baseUser logged_user,HttpServletRequest request,CContextParam myConteParam){
        myUser=logged_user;
        myRequest=request;
          try {
    f_log=new CLogError(myUser.db.getWebConnection(), myRequest, "SERVLETLL", myUser.login);
        f_log.setFileName("GestioneSale");
      f_log.setClassName("src.ListeLavoro.GestioneSale");
         } catch (Exception ex) { }
    }
    public void creaSale(classFormHtmlObject form, String CDCstringa,int nCDC){
        try {
        leggiDatiInput(myRequest);
        String      AreaSelezionata="";
        CTabSal myArea=null;
        CTabSalData MysalData=null;

	int numeroAreaSelezionate=0;
        String[] eleCDC=CDCstringa.split(",");
        String CDCelenco="'"+eleCDC[0]+"'";
        for (int con=1;con<=eleCDC.length-1;con++)
        {CDCelenco=CDCelenco+",'"+eleCDC[con]+"'";}


        try{
            myArea=new CTabSal(myUser.db.getDataConnection());

            myArea.loadDataIn(CDCelenco,"",true,true);
        }
        catch(Exception ex){
        f_log.writeLog("Errore Connessione tabella Tab_sal o richiesta non pervenuta",CLogError.LOG_ERROR);}
        ArrayList elencoArea=myArea.getData();
           String check="";
        numeroArea=elencoArea.size();
        int max=0;
        classDivHtmlObject div = new classDivHtmlObject("div_Area","display='none'");
        ArrayList mieColonne = new ArrayList();
        ArrayList mieRighe = new ArrayList();

        if (SelAre==null || SelAre.equalsIgnoreCase("") ) {
        for (int Contatore=0;Contatore<=numeroArea;Contatore=Contatore+3){
            if (check.equalsIgnoreCase("")) {
                if(numeroArea-Contatore>=3)
                { max=2;}
                else
                {max= numeroArea-Contatore-1;}
                     for (int i=0; i<=max;i++){
                    MysalData=(CTabSalData)elencoArea.get(Contatore+i);
                    String Area=MysalData.m_strDESCR;
                    int idenArea=MysalData.m_iIDEN;
                    if (AreaSelezionata.equalsIgnoreCase(""))
                    {AreaSelezionata=Area;}
                    else
                    {AreaSelezionata=AreaSelezionata+","+Area;}
                    classInputHtmlObject input= new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX,"campoSale"+(Contatore+i),"");
                    input.addEvent("OnClick","javascript:aggNsale("+nCDC+","+(numeroArea+nCDC)+");");
                    input.addAttribute("value",Integer.toString(idenArea));
                    input.setChecked(true);
                    input.appendSome(Area);
                    classInputHtmlObject nascIden= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"NascampoSale"+(Contatore+i),Area,"");
                    classColDataTable colonne=new classColDataTable("TD","33%",input);
                    colonne.appendSome(nascIden);
                    colonne.addAttribute("class", "classTdLabelSta");
                    mieColonne.add(colonne);

                }
                  if (max<2)
                {for (int x=max; x<2; x++)
                 {classColDataTable colovuo=new classColDataTable("TD","33%","");
                    colovuo.addAttribute("class", "classTdLabelSta");
                    mieColonne.add(colovuo); }}
                classRowDataTable righe=new classRowDataTable("",mieColonne);
                mieRighe.add(righe);
                mieColonne.clear();
                numeroAreaSelezionate=numeroArea;
            }

        }}

        else{String[] ArrayAre=null;

             ArrayAre=SelAre.split(",");
             for (int Contatore=0;Contatore<=numeroArea-1;Contatore=Contatore+3){
             if(numeroArea-Contatore>=3)
             { max=2;}
             else
             {max= numeroArea-Contatore-1;}
             for (int i=0; i<=max;i++){
                 MysalData=(CTabSalData)elencoArea.get(Contatore+i);
                 String Centro=MysalData.m_strDESCR;
                 classInputHtmlObject input= new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX,"campoSale"+(Contatore+i),"");
                 String Area=MysalData.m_strDESCR;
                 int idenArea=MysalData.m_iIDEN;
                 input.addAttribute("value",Integer.toString(idenArea));
                  input.addEvent("OnClick","javascript:aggNsale("+nCDC+","+(numeroArea+nCDC)+");");

                  if (ArrayAre[Contatore+i].equalsIgnoreCase("0"))
                 {input.setChecked(false);}
                 else
                 {
                        input.setChecked(true);
                        if (AreaSelezionata.equalsIgnoreCase(""))
                    {AreaSelezionata=Area;}
                    else
                    {AreaSelezionata=AreaSelezionata+","+Area;}
                    numeroAreaSelezionate=numeroAreaSelezionate+1;
                 }

                 input.appendSome(Centro);
                 classColDataTable colonne=new classColDataTable("TD","33%",input);
                 colonne.addAttribute("class", "classTdLabelSta");
                 mieColonne.add(colonne);
                 if (max<2)
                 {for (int x=max; x<2; x++)
                 {classColDataTable colovuo=new classColDataTable("TD","33%","");
                    colovuo.addAttribute("class", "classTdLabelSta");
                    mieColonne.add(colovuo); }}
             }

             classRowDataTable righe=new classRowDataTable("",mieColonne);
             mieRighe.add(righe);
             mieColonne.clear();

             }}






        classDataTable tabellaAree= new classDataTable("classDataEntryTable",mieRighe);
        mieRighe.clear();
        div.appendSome(tabellaAree);
        classLabelHtmlObject label_titolo=new classLabelHtmlObject("","","titoloAree");
        label_titolo.addAttribute("title",AreaSelezionata);
        classLabelHtmlObject labelNumeroAree=new classLabelHtmlObject("","","labelNumero");//Integer.toString(numeroArea));
        labelNumeroAree.appendSome(Integer.toString(numeroAreaSelezionate));
        classTabHeaderFooter header = new classTabHeaderFooter(label_titolo+" "+labelNumeroAree);
        classDivButton apri_chiudi= new classDivButton("", "pulsante", "javascript:ApriChiudi('div_Area',"+numeroArea+");", "apri_chiudiAree","");
        header.addColumn("classButtonHeader", apri_chiudi.toString());
        classTabHeaderFooter footer = new classTabHeaderFooter(" ");
        footer.setClasses("classTabHeader","classTabFooterSx","classTabHeaderMiddle","classTabFooterDx");
        classDivButton button_sel = new classDivButton("", "pulsante", "javascript:getSeldeselAree(true,"+nCDC+","+(numeroArea+nCDC)+");","sel_all_Are","");
        footer.addColumn("classButtonHeader", button_sel.toString());
        classDivButton button_desel = new classDivButton("", "pulsante", "javascript:getSeldeselAree(false,"+nCDC+","+(numeroArea+nCDC)+");","desel_all_Are","");
        footer.addColumn("classButtonHeader", button_desel.toString());
        form.appendSome(header.toString());
        div.appendSome(footer.toString());
        form.appendSome(div);
        classInputHtmlObject ARE= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"AreTOT","","");
        ARE.addAttribute("value",Integer.toString(numeroArea));
        form.appendSome(ARE.toString());
        classInputHtmlObject ARESELEZIONATI= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"ArrAre","","");
        form.appendSome(ARESELEZIONATI.toString());}
        catch (Exception e) {f_log.writeLog("Errore nella creazione delle sale",CLogError.LOG_ERROR);}

    }

    public int getnumeroAre(){
    return numeroArea;
    }
 private void leggiDatiInput(HttpServletRequest myInputRequest)  {


        SelAre=myInputRequest.getParameter("ArrAre");



    }
}
