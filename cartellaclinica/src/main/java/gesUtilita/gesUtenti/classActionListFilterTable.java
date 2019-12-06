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
package gesUtilita.gesUtenti ;
import imago.http.IHtmlObject;
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classOptionHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imago.sql.TableResultSet;
import imagoAldoUtil.classBaseFormElement;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.simpleTableLayout.simpleDataEntryTable;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Vector;

/**
 *
 * @author  aldog
 *
 * classe che costruisce il primo layer della consolle
 * contenente: data esame, data referto, ora...
 *
 *
 */
public class classActionListFilterTable extends simpleDataEntryTable{


    /** Creates a new instance of consolleFirstLayout */
    public classActionListFilterTable(baseWrapperInfo baseInfo) {
        setBaseInfo(baseInfo);
    }

    public classDataTable getLayout(){

        classDataTable          myTable=null;

        myTable = new classDataTable("classDataEntryTable");
        myTable.addAttribute("cellpadding","0");
        myTable.addAttribute("cellspacing","0");
        myTable.addAttribute("id", "idTableFirstLayout");
        myTable.addRow(creaPrimaRiga());
        return myTable;
    }

    private classRowDataTable creaPrimaRiga(){

        ArrayList               listaCol=null;
        classLabelHtmlObject    myLabel = null;
        classBaseFormElement    myFormElementIN = null;
        Vector<IHtmlObject>                 myVector=null;
        IHtmlObject             myInput=null;
        classDivButton          myButton = null;

        myVector = new Vector<IHtmlObject>();
        listaCol = new ArrayList();
        // ************ Combo Utente
        myLabel = new classLabelHtmlObject("","","lblUtente");
        myInput = getUserCombo(this.getBaseInfo().getUser());
        myVector.add(myInput);
        myFormElementIN = new classBaseFormElement(myLabel,myVector);
        // attacco le colonne
        aggiungiOggettiHtml(myFormElementIN, listaCol);
        // ***************************
        // *** text Dalla Data
        // ***************************
        myVector.clear();
        myLabel = new classLabelHtmlObject("","","lblDaData");
	myInput = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtDaData","","10");
        myInput.addAttribute("id","da_data");
        myInput.addEvent("onBlur","javascript:formatta(this, '');");
	myVector.add ( myInput ) ;
        myButton = new classDivButton("","pulsanteCalendario20","#","","");
        myButton.addAttributeToA("onclick","javascript:clickOnData(document.all.da_data);");
        myVector.add ( myButton ) ;
	myFormElementIN = new classBaseFormElement ( myLabel , myVector ) ;
        // attacco le colonne
	aggiungiOggettiHtml ( myFormElementIN , listaCol ) ;

        // ***************************
        // *** text Alla Data
        // ***************************
        myVector.clear();
        myLabel = new classLabelHtmlObject("","","lblAData");
        myInput = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtAData","","10");
        myInput.addAttribute("id","a_data");
        myInput.addEvent("onBlur","javascript:formatta(this, '');");
        myVector.add ( myInput ) ;
        myButton = new classDivButton("","pulsanteCalendario20","#","","");
        myButton.addAttributeToA("onclick","javascript:clickOnData(document.all.a_data);");
        myVector.add ( myButton ) ;

        myFormElementIN = new classBaseFormElement ( myLabel , myVector ) ;
        // attacco le colonne
	aggiungiOggettiHtml ( myFormElementIN , listaCol ) ;




        return new classRowDataTable("",listaCol);
    }



    /**
         * ritorna il combo
         * con i vari utenti
         * sarà bloccato o meno a seconda dell'utente che si autentica
         *
         * @param utente String
         */
        private classSelectHtmlObject getUserCombo(baseUser utente){
            classSelectHtmlObject      myUserCombo=null;
            TableResultSet             myTable = null;
            String                     sql = "", strTmp="";
            ResultSet                  rs = null;
            classOptionHtmlObject      myOption = null;
            classRsUtil                myUtil = null;


            myUtil = new classRsUtil();
            myUserCombo = new classSelectHtmlObject("selUser");
            myUserCombo.addAttribute("id","idSelUser");
            sql = "Select webuser from web order by webuser ";
            try{
                myTable = new TableResultSet();
                rs = myTable.returnResultSet(utente.db.getWebConnection(),sql);
                while (rs.next()){
                    strTmp = myUtil.returnStringFromRs(rs,"webuser");
                    myOption = new classOptionHtmlObject(strTmp, strTmp);
                    if (strTmp.equalsIgnoreCase(utente.login)){
                        myOption.setSelected(true);
                    }
                    myUserCombo.addOption(myOption);
                }
                // controllo se il combo deve essere bloccato o meno
                if ((!utente.livello.equalsIgnoreCase("0"))||(utente.login.equalsIgnoreCase("manager"))){
                    // non è amministrator
                    myUserCombo.setDisabled(true);
                }
            }
            catch(java.lang.Exception ex){
                ex.printStackTrace();
            }
            finally{
                try{

                }
                catch(java.lang.Exception ex1){
                }
            }



            return myUserCombo;
        }



}
