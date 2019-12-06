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
package firma;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imagoUtils.html2Text;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;
import java.net.URL;
import java.net.URLConnection;
import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.CLOB;

import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;

import cartellaclinica.utils.gestBloccoFunzioni.controlloBlocco;
import core.Global;
import core.database.UtilityLobs;
import java.sql.Types;
import java.util.ArrayList;


public class dwrPreparaFirma {

    ServletContext myContext;
    HttpServletRequest myRequest;
    HttpSession mySession;

    baseUser logged_user;
    protected ElcoLoggerInterface logger = null;

    private void init() {
        myContext = WebContextFactory.get().getServletContext();
        myRequest = WebContextFactory.get().getHttpServletRequest();
        mySession = WebContextFactory.get().getSession(false);
        logged_user = Global.getUser(WebContextFactory.get().getSession(false));
        this.logger = new ElcoLoggerImpl(this.getClass().getName() + ".class");
    }

    public String convertHtm2Text(String textToConvert) {
        html2Text myConverter = new html2Text();
        String retText = myConverter.convertHtml2Text(textToConvert);
        return retText;
    }

    public String preparaFirma(String PROC_TO_CALL_BEFORE, String[] pTypeParam, String[] pValueParam) {
        init();

        String XReturn = "";
        Clob clob = null;
        try {
            
            //logged_user.db.getDataConnection().createStatement().executeUpdate("set define off;");
            CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_BEFORE);
            for (int i = 0; i < pValueParam.length; i++) {
                if (pTypeParam[i].equals("VARCHAR")) {
                    cs.setString(i + 1, pValueParam[i]);
                }
                if (pTypeParam[i].equals("FLOAT")) {
                    cs.setFloat(i + 1, Float.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("NUMBER")) {
                    cs.setInt(i + 1, Integer.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("CLOB")) {
                    clob = getCLOB(logged_user.db.getDataConnection(), pValueParam[i]);
                    cs.setClob(i + 1, clob);
                }
            }
            cs.executeUpdate();
            UtilityLobs.freeClob(clob);
        } catch (Exception ex) {
            XReturn = "KO*Errore Lanciando la PROC_TO_CALL_BEFORE (" + PROC_TO_CALL_BEFORE + ")   \r\n Exception: " + ex.getMessage();
        }

        return XReturn;
    }

    public String preparaFirmaClob(String PROC_TO_CALL_BEFORE, String[] pTypeParam, String[] pValueParam, String[] pIdSezioni, String[] pLblSezioni, String[] pNumRighe, String[] pArLblRighe, String[] pTestoHtml, String[] pTestoPiano, String[] pIdenFar, String[] pScatole, String[] pPrimoCiclo, String[] pDose, String[] pDurata, String[] pTipoTerapia, String[] pStatoTerapia, String[] pCategoria) {
        init();

        String XReturn = "";
        ArrayList<CLOB> clobs = new ArrayList<CLOB>();

        try {
            //logged_user.db.getDataConnection().createStatement().executeUpdate("set define off;");
            CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_BEFORE);
            for (int i = 0; i < pTypeParam.length; i++) {
                if (pTypeParam[i].equals("VARCHAR")) {
                    cs.setString(i + 1, pValueParam[i]);
                }
                if (pTypeParam[i].equals("FLOAT")) {
                    cs.setFloat(i + 1, Float.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("NUMBER")) {
                    cs.setInt(i + 1, Integer.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_ID_SEZIONE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pIdSezioni));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_LBL_SEZIONE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pLblSezioni));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_ARROWSAREA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pNumRighe));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_ARROWSLBLAREA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pArLblRighe));
                }
                if (pTypeParam[i].equals("ARRAY_CLOB_HTML")) {
                    CLOB[] clobTemp = getArrayCLOB(logged_user.db.getDataConnection(), pTestoHtml);
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if (pTypeParam[i].equals("ARRAY_CLOB_PIANO")) {
                    CLOB[] clobTemp = getArrayCLOB(logged_user.db.getDataConnection(), pTestoPiano);
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_IDEN_FAR")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pIdenFar));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_SCATOLE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pScatole));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_PRIMO_CICLO")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pPrimoCiclo));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_DOSE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pDose));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_DURATA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pDurata));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_TIPO_TER")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pTipoTerapia));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_STATO_TER")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pStatoTerapia));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_CATEGORIA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pCategoria));
                }
            }
            cs.executeUpdate();
            UtilityLobs.freeCLOBArray(clobs);
        } catch (Exception ex) {
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "KO*Errore Lanciando la PROC_TO_CALL_BEFORE (" + PROC_TO_CALL_BEFORE + ")   \r\n Exception: " + ex.getMessage();
        }
        return XReturn;
    }

    public String registraLettera(String PROC_TO_CALL_BEFORE, String[] pTypeParam, String[] pValueParam, String[] pIdSezioni, String[] pLblSezioni, String[] pNumRighe, String[] pArLblRighe, String[] pTestoHtml, String[] pTestoPiano, String[] pIdenFar, String[] pScatole, String[] pPrimoCiclo, String[] pDose, String[] pDurata, String[] pTipoTerapia, String[] pStatoTerapia, String[] pCategoria) {
        init();

        String XReturn = "";
        ArrayList<CLOB> clobs = new ArrayList<CLOB>();
        int i;
        try {
            //logged_user.db.getDataConnection().createStatement().executeUpdate("set define off;");
            CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_BEFORE);
            for (i = 0; i < pTypeParam.length; i++) {
                if (pTypeParam[i].equals("VARCHAR")) {
                    cs.setString(i + 1, pValueParam[i]);
                }
                if (pTypeParam[i].equals("FLOAT")) {
                    cs.setFloat(i + 1, Float.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("NUMBER")) {
                    cs.setInt(i + 1, Integer.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_ID_SEZIONE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pIdSezioni));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_LBL_SEZIONE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pLblSezioni));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_ARROWSAREA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pNumRighe));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_ARROWSLBLAREA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pArLblRighe));
                }
                if (pTypeParam[i].equals("ARRAY_CLOB_HTML")) {
                    CLOB[] clobTemp = getArrayCLOB(logged_user.db.getDataConnection(), pTestoHtml);
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if (pTypeParam[i].equals("ARRAY_CLOB_PIANO")) {
                    CLOB[] clobTemp = getArrayCLOB(logged_user.db.getDataConnection(), pTestoPiano);
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_IDEN_FAR")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pIdenFar));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_SCATOLE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pScatole));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_PRIMO_CICLO")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pPrimoCiclo));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_DOSE")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pDose));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_DURATA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pDurata));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_TIPO_TER")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pTipoTerapia));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_STATO_TER")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pStatoTerapia));
                }
                if (pTypeParam[i].equals("ARRAY_VALUE_CATEGORIA")) {
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", logged_user.db.getDataConnection()), logged_user.db.getDataConnection(), pCategoria));
                }
            }
            cs.registerOutParameter(i+1, Types.VARCHAR);
            cs.executeUpdate();
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "OK*"+cs.getString(i+1);            

        } catch (Exception ex) {
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "KO*Errore Lanciando la PROC_TO_CALL_BEFORE (" + PROC_TO_CALL_BEFORE + ")   \r\n Exception: " + ex.getMessage();
        }
        return XReturn;
    }    
    
    
    
    public String preparaRefertazione(String PROC_TO_CALL_BEFORE,String[] pTypeParam,String[] pValueParam,String[] pIdSezioni,String[] pLblSezioni,String[] pNumRighe,String[] pArLblRighe, String[] pTestoHtml,String[] pTestoPiano)
    {
        init();
        int i;
        String XReturn 	= "";                
        ArrayList<CLOB> clobs = new ArrayList<CLOB>();
        try {
        	CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_BEFORE);
            for (i = 0; i < pTypeParam.length; i++){
                if(pTypeParam[i].equals("VARCHAR"))
                    cs.setString(i + 1, pValueParam[i]);
                if(pTypeParam[i].equals("FLOAT"))
                    cs.setFloat(i + 1,Float.valueOf( pValueParam[i]));
                if(pTypeParam[i].equals("NUMBER"))
                    cs.setInt(i + 1,Integer.valueOf(pValueParam[i]));
                if(pTypeParam[i].equals("ARRAY_VALUE_ID_SEZIONE"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pIdSezioni));
                if(pTypeParam[i].equals("ARRAY_VALUE_LBL_SEZIONE"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pLblSezioni));
                if(pTypeParam[i].equals("ARRAY_VALUE_ARROWSAREA"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pNumRighe));
                if(pTypeParam[i].equals("ARRAY_VALUE_ARROWSLBLAREA"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pArLblRighe));
                if(pTypeParam[i].equals("ARRAY_CLOB_HTML")){
                    CLOB[] clobTemp= getArrayCLOB(logged_user.db.getDataConnection(),pTestoHtml);
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if(pTypeParam[i].equals("ARRAY_CLOB_PIANO")){
                    CLOB[] clobTemp= getArrayCLOB(logged_user.db.getDataConnection(),pTestoPiano);
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
            }
            cs.registerOutParameter(i+1, Types.VARCHAR);
            cs.executeUpdate();
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "OK*"+cs.getString(i+1);            
        } catch (Exception ex) {
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "KO*Errore Lanciando la PROC_TO_CALL_BEFORE (" +PROC_TO_CALL_BEFORE + ")   \r\n Exception: " + ex.getMessage();
        }
       

        return XReturn;
    }   
    
    public String preparaRefertazioneAnestesiologica(String PROC_TO_CALL_BEFORE,String[] pTypeParam,String[] pValueParam,String[] pIdSezioni,String[] pLblSezioni,String[] pNumRighe,String[] pArLblRighe,String[] pArOrdinamento, String[] pTestoHtml,String[] pTestoPiano,String[] pIdenFar,String[] pScatole,String[] pPrimoCiclo,String[] pDose,String[] pDurata,String[] pTipoTerapia,String[] pStatoTerapia,String[] pCategoria)
    {
        init();
        int i;
        String XReturn 	= "";                
        ArrayList<CLOB> clobs = new ArrayList<CLOB>();        
        
        try {
        	CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_BEFORE);
            for (i = 0; i < pTypeParam.length; i++){
                if(pTypeParam[i].equals("VARCHAR"))
                    cs.setString(i + 1, pValueParam[i]);
                if(pTypeParam[i].equals("FLOAT"))
                    cs.setFloat(i + 1,Float.valueOf( pValueParam[i]));
                if(pTypeParam[i].equals("NUMBER"))
                    cs.setInt(i + 1,Integer.valueOf(pValueParam[i]));
                if(pTypeParam[i].equals("ARRAY_VALUE_ID_SEZIONE"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pIdSezioni));
                if(pTypeParam[i].equals("ARRAY_VALUE_LBL_SEZIONE"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pLblSezioni));
                if(pTypeParam[i].equals("ARRAY_VALUE_ARROWSAREA"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pNumRighe));
                if(pTypeParam[i].equals("ARRAY_VALUE_ARROWSLBLAREA"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pArLblRighe));
                if(pTypeParam[i].equals("ARRAY_VALUE_ORDINAMENTO"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pArOrdinamento));                
                if(pTypeParam[i].equals("ARRAY_CLOB_HTML")){
                    CLOB[] clobTemp= getArrayCLOB(logged_user.db.getDataConnection(),pTestoHtml);    
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if(pTypeParam[i].equals("ARRAY_CLOB_PIANO")){
                    CLOB[] clobTemp= getArrayCLOB(logged_user.db.getDataConnection(),pTestoPiano); 
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_CLOB",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),clobTemp));
                    UtilityLobs.add2ListCLOB(clobs, clobTemp);
                }
                if(pTypeParam[i].equals("ARRAY_VALUE_IDEN_FAR"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pIdenFar));
                if(pTypeParam[i].equals("ARRAY_VALUE_SCATOLE"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pScatole));
                if(pTypeParam[i].equals("ARRAY_VALUE_PRIMO_CICLO"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pPrimoCiclo));
                if(pTypeParam[i].equals("ARRAY_VALUE_DOSE"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pDose));
                if(pTypeParam[i].equals("ARRAY_VALUE_DURATA"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pDurata));
                if(pTypeParam[i].equals("ARRAY_VALUE_TIPO_TER"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pTipoTerapia));
                if(pTypeParam[i].equals("ARRAY_VALUE_STATO_TER"))
                    cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pStatoTerapia));
                if(pTypeParam[i].equals("ARRAY_VALUE_CATEGORIA"))
                	cs.setArray(i + 1, new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE",logged_user.db.getDataConnection()),logged_user.db.getDataConnection(),pCategoria));            
            }
            cs.registerOutParameter(i+1, Types.VARCHAR);
            cs.executeUpdate();
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "OK*"+cs.getString(i+1);            
        } catch (Exception ex) {
            UtilityLobs.freeCLOBArray(clobs);
            XReturn = "KO*Errore Lanciando la PROC_TO_CALL_BEFORE (" +PROC_TO_CALL_BEFORE + ")   \r\n Exception: " + ex.getMessage();
        }
        return XReturn;
    }          
    
    
    public String getInfo(String pViewInfo, String pCampoFiltro, String pValoreFiltro) {
        init();
        Util page = null;
        String XReturn = "";
        page = new Util(WebContextFactory.get().getScriptSession());
        ResultSet rst = null;
        Statement stm = null;
        String SQLInfo = "select * from " + pViewInfo + " where " + pCampoFiltro + " = '" + pValoreFiltro + "' and rownum<2";
        try {
            stm = logged_user.db.getDataConnection().createStatement();
            rst = stm.executeQuery(SQLInfo);
            if (rst.next()) {
                ResultSetMetaData mtd = rst.getMetaData();
                for (int indice = 1; indice <= mtd.getColumnCount(); ++indice) {
                    page.addFunctionCall("setParam", mtd.getColumnName(indice),
                            rst.getString(mtd.getColumnName(indice)));
                }
            }
        } catch (Exception ex) {
            XReturn = "alert('Errore CARICANDO LA VIEW \r\n " + SQLInfo + " \r\n   \r\n Exception: " + ex.getMessage() + "')";
        }
        return XReturn;
    }

    public String getUrlToSign(String pReparto, String pReport, String pWhereReport, String pValueWhereReport) {
        return "";
    }

    public String archiviaFirma(String PROC_TO_CALL_AFTER, String[] pTypeParam, String[] pValueParam) {
        init();
        Clob tempClob = null;
        String XReturn = "";
        try {
            CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_AFTER);
            for (int i = 0; i < pValueParam.length; i++) {
                if (pTypeParam[i].equals("VARCHAR")) {
                    cs.setString(i + 1, pValueParam[i]);
                }
                if (pTypeParam[i].equals("FLOAT")) {
                    cs.setFloat(i + 1, Float.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("NUMBER")) {
                    if (pValueParam[i] == null) {
                        pValueParam[i] = "0";
                    }
                    cs.setInt(i + 1, Integer.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("CLOB")) {
                    tempClob = getCLOB(logged_user.db.getDataConnection(), pValueParam[i]);
                    cs.setClob(i + 1, tempClob);
                }
            }
            cs.executeUpdate();
            UtilityLobs.freeClob(tempClob);
            XReturn = "OK*firma";
        } catch (Exception e) {
            XReturn = "KO*" + e.getMessage();
        }

        return XReturn;
    }

    public String archiviaFirmaMulti(String PROC_TO_CALL_AFTER, String[] pTypeParam, String[] pValueParam) {
        init();
        Clob tempClob = null;
        String XReturn = "";
        int i;
        try {
            CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_CALL_AFTER);
            for (i = 0; i < pValueParam.length; i++) {
                if (pTypeParam[i].equals("VARCHAR")) {
                    cs.setString(i + 1, pValueParam[i]);
                }
                if (pTypeParam[i].equals("FLOAT")) {
                    cs.setFloat(i + 1, Float.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("NUMBER")) {
                    if (pValueParam[i] == null) {
                        pValueParam[i] = "0";
                    }
                    cs.setInt(i + 1, Integer.valueOf(pValueParam[i]));
                }
                if (pTypeParam[i].equals("CLOB")) {
                    tempClob = getCLOB(logged_user.db.getDataConnection(), pValueParam[i]);
                    cs.setClob(i + 1, tempClob);
                }
            }
            cs.registerOutParameter(i+1, Types.VARCHAR);
            cs.executeUpdate();
            UtilityLobs.freeClob(tempClob);
            String valueReturn = cs.getString(i+1);
            if ("OK".equalsIgnoreCase(valueReturn)){
                XReturn = valueReturn+"firma";        
            }else{
            	XReturn = valueReturn;
            }
            
        } catch (Exception e) {
            XReturn = "KO*" + e.getMessage();
        }

        return XReturn;
    }    
    
    private Clob getCLOB(Connection conn, String clobData) throws Exception {
        CLOB tempClob = null;
        try {
            tempClob = CLOB.createTemporary(conn, true, 10);

            tempClob.open(1);

            Writer tempClobWriter = tempClob.getCharacterOutputStream();

            tempClobWriter.write(clobData);

            tempClobWriter.flush();
            tempClobWriter.close();

            tempClob.close();
        } catch (Exception exp) {
            tempClob.freeTemporary();
        }

        return tempClob;
    }
    
    private CLOB[] getArrayCLOB(Connection conn, String[] clobData) throws Exception {
        CLOB[] tempArrayClob = new CLOB[clobData.length];
        CLOB tempClob = null;
        try {

            for (int i = 0; i < clobData.length; i++) {
                tempClob = CLOB.createTemporary(conn, true, 10);
                tempClob.open(1);
                Writer tempClobWriter = tempClob.getCharacterOutputStream();
                tempClobWriter.write(clobData[i]);

                tempArrayClob[i] = tempClob;
                tempClobWriter.flush();
                tempClobWriter.close();
                tempClob.close();
            }

        } catch (SQLException sqlexp) {
            UtilityLobs.freeClob(tempClob);
            sqlexp.printStackTrace();
        } catch (Exception exp) {
            UtilityLobs.freeClob(tempClob);
            exp.printStackTrace();
        }

        return tempArrayClob;
    }

    public String[] convertHtmlToText(String[] textToConvert) {

        String[] strOutput = new String[textToConvert.length];
        html2Text myConverter = null;

        try {
            myConverter = new html2Text();
            for (int i = 0; i < textToConvert.length; i++) {
                strOutput[i] = myConverter.convertHtml2Text(textToConvert[i]);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return strOutput;

    }

    public String unLockFunzione(String Tabella, String Funzione, String Iden) {
        init();
        controlloBlocco cb = null;
        this.logger.info("unLockFunzione - Tabella: " + Tabella + " Funzione: " + Funzione + " Iden: " + Iden);
        try {
            cb = new controlloBlocco(mySession, Tabella, Funzione, Integer.valueOf(Iden));
            cb.unLock();
        } catch (Exception ex) {
            ex.getMessage();
            this.logger.error(ex.getMessage());

        }

        return cb.getMessage();
    }

    public String resetFirma(String PROC_TO_RESET, String pIdenEsame) {

        init();

        String XReturn = "";
        try {
            CallableStatement cs = logged_user.db.getDataConnection().prepareCall(PROC_TO_RESET);
            cs.setInt(1, Integer.valueOf(pIdenEsame));
            cs.executeUpdate();
            XReturn = "OK*ResetFirma()";
        } catch (Exception e) {
            XReturn = "KO*ResetFirma()*" + e.getMessage();
        }

        return XReturn;
    }

    public String SavePdfOnTemp(String servletPath, String funzione, String idenVisita, String idenAnag) {
        int size = 1024;
        String ret = "";
        String tempdir = System.getProperty("java.io.tmpdir");

        if (!(tempdir.endsWith("/") || tempdir.endsWith("\\"))) {
            tempdir = tempdir + System.getProperty("file.separator");
        }

        String nameFile = "";
        String nameFile2 = "";

        /*Apro il file e lo nomino funzione_data_iden_visita.pdf*/
        OutputStream outStream = null;
        URLConnection uCon = null;
        URL Url = null;
        InputStream is = null;
        try {
            byte[] buf;
            int ByteRead;
            Url = new URL(servletPath);
            nameFile = tempdir + "\\" + funzione + ".pdf";
            nameFile2 = funzione + "_NEW";
            File tmpFile = File.createTempFile(nameFile2, ".pdf");
            outStream = new BufferedOutputStream(new FileOutputStream(tmpFile));

            uCon = Url.openConnection();
            is = uCon.getInputStream();
            buf = new byte[size];
            while ((ByteRead = is.read(buf)) != -1) {
                outStream.write(buf, 0, ByteRead);
            }

            new BufferedOutputStream(new FileOutputStream(tmpFile));
            ret = "OK*" + nameFile;
        } catch (Exception e) {
            e.printStackTrace();
            ret = "KO*" + e.getMessage();
        } finally {
            try {
                is.close();
                outStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return ret;
    }
}
