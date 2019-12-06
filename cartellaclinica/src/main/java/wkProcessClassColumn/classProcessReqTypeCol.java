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
package wkProcessClassColumn ;
import imago.http.classColDataTable;
import imago.http.classDivButton;
import imagoAldoUtil.classCodEstEsami;
import imagoAldoUtil.classStringUtil;
import imagoCreateWk.IprocessDataTable;
import imagoView.Iview;

public class classProcessReqTypeCol implements IprocessDataTable
{
    public classProcessReqTypeCol ()
    {
    }

    public String processData ( Iview interfacciaVista )
    {
        String                  strOutput="";
        String                  codiceHtml="";
        String                  strTipoRichiesta="";
        String                  strIdenInfowebRichiesta="";
        String                  strIdenAnag = "";
        classDivButton          myDiv=null;
        classCodEstEsami        myCodEstEsami = null;
        // deriva da richiesta da gericos indipendentemente dallo stato
        final String            strClasseIconaGericos = "classReqType";
        // caso in cui prenoto direttamente da Gericos
        final String            strClasseIconaGericosPrenotato = "classReqTypeBooked";
        // caso in cui prenoto direttamente da Polaris
        final String            strClasseIconaPolarisPrenotato = "classReqTypeBookedByPolaris";
        // icona integrazione sole
        final String            strClasseIconaSole = "classProgettoSole";


        try{
            strTipoRichiesta = interfacciaVista.getField("TIPO_RICHIESTA");
            strIdenInfowebRichiesta = interfacciaVista.getField("IDEN_INFOWEB_RICHIESTA");
            interfacciaVista.getField("IDEN");
            if (!strTipoRichiesta.equalsIgnoreCase("")){
                classStringUtil.checkNull(interfacciaVista.getField("PRENOTATO"));
                strIdenAnag  = interfacciaVista.getField("IDEN_ANAG");
                myCodEstEsami = new classCodEstEsami(interfacciaVista.getDataConnection(),interfacciaVista.getField("IDEN"));
                // da verificare.... 99 su 100 è da togliere il controllo
                if (myCodEstEsami.ARRIVATODA.equalsIgnoreCase("GERICOS")){
                    myDiv = new classDivButton ( "&nbsp;" ,
                                                strClasseIconaGericosPrenotato ,
                                                "javascript:try{openExamFromGericosBooking(this);}catch(e){;}" ,
					       "" , "" ) ;
                }
                else if (myCodEstEsami.ARRIVATODA.equalsIgnoreCase("SOLE")){
                    myDiv = new classDivButton ( "&nbsp;" ,
                                                strClasseIconaSole ,
                                                "" ,
					       "" , "" ) ;
                }
                else{
                    myDiv = new classDivButton ( "&nbsp;" ,
                          strClasseIconaGericos ,
                          "javascript:visualizza_richiesta("+ strIdenInfowebRichiesta +"," + strIdenAnag + ");" ,
                                             "" , "" ) ;

                }
                codiceHtml = myDiv.toString();
            }
            else{
                // NON è una richiesta
                // ma potrebbe essere una prenotazione diretta da Gericos
                myCodEstEsami = new classCodEstEsami(interfacciaVista.getDataConnection(),interfacciaVista.getField("IDEN"));
                if (myCodEstEsami.ARRIVATODA.equalsIgnoreCase("GERICOS")){
                    myDiv = new classDivButton ( "&nbsp;" ,
                                                strClasseIconaGericosPrenotato ,"javascript:try{openExamFromGericosBooking(this);}catch(e){;}" ,
                                               "" , "" ) ;
                }
                else if (myCodEstEsami.ARRIVATODA.equalsIgnoreCase("SOLE")){
                    myDiv = new classDivButton ( "&nbsp;" ,
                                                strClasseIconaSole ,
                                                "" ,
                                               "" , "" ) ;
                }
                else if (myCodEstEsami.ARRIVATODA.equalsIgnoreCase("DA POLARIS")) {
                    // controllo che sia una prenotazione diretta
                    // da Polaris
                    myDiv = new classDivButton ( "&nbsp;" ,
                                                strClasseIconaPolarisPrenotato ,"javascript:try{openExamFromGericosBooking(this);}catch(e){;}" ,
                                               "" , "" ) ;
                }
                if (myDiv!=null){codiceHtml = myDiv.toString();}

            }
            strOutput = codiceHtml;
        }
        catch(java.lang.Exception ex){
            ex.printStackTrace();
        }
        return strOutput;
    }

    public String processData ( String oggetto )
    {
        return "&nbsp;";
    }

    public classColDataTable processColumn ( classColDataTable oggetto )
    {
        // non faccio nessuna elaborazione sull oggetto
        return oggetto;
    }
}
