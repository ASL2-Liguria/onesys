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
 * Elaborazione_LL_cdc.java
 *
 * Created on 28 luglio 2006, 14.59
 */

package src.Sel_Stampa;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.baseClass.baseUser;

import java.net.URLEncoder;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;

import stampe.anteprima.IElaborazioneStampa;
import stampe.anteprima.printInfo;
/**
 *
 * @author  fabioc
 */
public class LISTA_WORKLIST implements IElaborazioneStampa {
    private printInfo           myParam = null;
    private String              strUrlServletPdf="";
    private HttpServletRequest  myRequest=null;
    private Hashtable           Richieste=null;
    private baseUser            logged_user=null;
    private CLogError           log=null;

    /** Creates a new instance of Elaborazione_LL_cdc */
    public LISTA_WORKLIST() {
      super();
    }

    @Override
	public void Elaborazione() {
     String sf="";





    try {
        sf =(String)Richieste.get("stampaSelection");
        //System.out.println(sf);
        sf = URLEncoder.encode(sf, "UTF-8");


        strUrlServletPdf =myParam.getUrlImago();
        strUrlServletPdf = strUrlServletPdf + "ServletStampe" + "?report=" + this.myParam.getReportName();
        strUrlServletPdf = strUrlServletPdf + "&" +"sf=" + sf;
//         strUrlServletPdf = strUrlServletPdf + "&" +"user=" + myParam.getUser();
//        strUrlServletPdf = strUrlServletPdf + "&" +"password=" + myParam.getPassword();
//        strUrlServletPdf = strUrlServletPdf + "&" +"dbclass=" + myContextParam.getParam("DbDriver");
//        strUrlServletPdf = strUrlServletPdf + "&" +"connstring=" + myContextParam.getParam("ConnectionString");

     }
     catch (Exception ex)
    {
        log.writeLog("Errore Elaborzione_LL_Sala",CLogError.LOG_ERROR);
    }
     }


    @Override
	public String getUrlPdf() {
         //System.out.println(strUrlServletPdf);
    return strUrlServletPdf;
    }

    @Override
	public void setParam(printInfo par, java.util.Hashtable myRichieste, javax.servlet.http.HttpServletRequest myInputRequest, imago.a_util.CContextParam myConteParam) {
        myParam = par;
        Richieste=myRichieste;
        this.myRequest=myInputRequest;
        try{

        log=new CLogError(logged_user.db.getWebConnection(), myRequest,  "elabStampa", logged_user.login);
            log.setFileName("Elaborazione_LL_Sala");
            log.setClassName("src.Sel_Stampa.Elaborazione_LL_Sala");
         }
         catch(Exception ex){
            //System.out.println(ex);
           }
    }

    @Override
	public String getNCopie() {
     String ncop="";
        return ncop;
    }

	@Override
	public void setParam(printInfo par, Hashtable myRichieste, HttpServletRequest myInputRequest, CContextParam myConteParam,
			boolean appletParameters) {
		// TODO Auto-generated method stub
		
	}

}
