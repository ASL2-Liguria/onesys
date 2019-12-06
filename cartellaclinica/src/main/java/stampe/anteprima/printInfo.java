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
 * printInfo.java
 *
 * Created on 15 giugno 2006, 16.45
 */

package stampe.anteprima;
import java.util.Hashtable;

/**
 *
 * classe che descrive
 * le informazioni di base utili
 * per la stampa dei report
 */
public class printInfo {


    private String          strUrlImago="";
    private String          strNcopie = "";
    private String          strWhereCondition ="";
    private String          strReportName = "";
    private String          strProcessClass="";
    private String          strPdfName="";
    private String          strSF="";
    private String          Password="";
    private String          User="";
    private String          strPathReport="";
    private String          Reparto="";
    private Hashtable       hashParameters=null;

    /** Creates a new instance of printInfo */
    public printInfo() {
    }

    public void setUrlImago(String value){
        this.strUrlImago = value;
    }

    /**
     * ritorna la url completa
     * per reperire via http il file pdf generato
     * NB. Viene utilizzata la variabile di contesto baseUrlImagox e folderPdf
     * per svincolarsi dal tipo di installazione.
     * ATTENZIONE verrà composta la url in questo modo:
     * baseUrlImagox + folderPdf + "/" + getPdfName()
     */
    public String getUrlImago(){
        return this.strUrlImago;
    }

    public void setNcopie(String value){
        this.strNcopie = value;
    }

    /**
     * ritorna il numero di copie
     * da stampare.
     *
     */
    public String getNcopie(){
        return this.strNcopie;
    }

    public void setWHereCondition(String value){
        this.strWhereCondition = value;
    }

    /**
     * ritorna una eventuale
     * where condition aggiuntiva per
     * il report richiesto
     *
     */
    public String getWhereCondition(){
        return this.strWhereCondition;
    }

    public void setReportName(String value){
        this.strReportName = value;
    }
    /**
     * ritorna il path *completo*
     * ove recuperare il report (nome report incluso)
     * Viene combinata la variabile di context PathDirectoryReport
     * con il reparto di appartenenza dell'esame
     */
    public String getReportName(){
        return this.strReportName;
    }

    public void setProcessClass(String value){
        this.strProcessClass = value;
    }

    /**
     * ritorna la classe che deve elaborare
     * la stampa del report specifico
     *
     */
    public String getProcessClass(){
        return this.strProcessClass;
    }

     public void setPathReport(String value){
        this.strPathReport = value;
    }

    /**
     * ritorna la classe che deve elaborare
     * la stampa del report specifico
     *
     */
    public String getPathReport(){
        return this.strPathReport;
    }

    public void setPdfName(String value){
        this.strPdfName = value;
    }

    /**
     * ritorna *solo* il nome
     * del PDF da esportare
     */
    public String getPdfName(){
        return this.strPdfName;
    }


    public void setSF(String value){
        this.strSF = value;
    }

    /**
     * ritorna la SF del report (comprensiva di graffe)
     *
     */
    public String getSF(){
        return this.strSF;

    }

    public void setParameters(Hashtable myVector){
        this.hashParameters = myVector;
    }

    /**
     * restituisce la lista dei parametri
     * del report
     * La chiave della lista è il nome del parametro
     *
     */
    public Hashtable getParameters(){
        return this.hashParameters ;

    }
     public void setPassword(String value){
        this.Password = value;
    }

    /**
     * ritorna la password
     *
     */
    public String getPassword(){
        return this.Password;
    }
    public void setUser(String value){
        this.User = value;
    }

    /**
     * ritorna l'user
     *
     */
    public String getUser(){
        return this.User;
    }
    public void setReparto(String value){
       this.Reparto = value;
   }

   /**
    * ritorna l'user
    *
    */
   public String getReparto(){
       return this.Reparto;
   }

}
