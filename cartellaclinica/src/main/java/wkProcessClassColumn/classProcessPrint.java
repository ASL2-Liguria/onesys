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
import imago.http.classRollOverImg;
import imagoCreateWk.IprocessDataTable;
import imagoUtils.logToOutputConsole;
import imagoView.ImagoViewException;
import imagoView.Iview;
/**
 *
 * @author  aldog
 */
public class classProcessPrint implements IprocessDataTable {


    // definisco la costante che
    // servirà lato client
    // a ricercare il tipo di pacs
    // che effettua la chiamata
    public classProcessPrint() {

    }

    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
        // non faccio nessuna elaborazione sull oggetto
        return oggetto;
    }

    /**
     * affinchè venga chiamato questo metodo
     * DEVO richiamare il metodo setBaseInfo della classeWk
     *
     *
     */
    public String processData(Iview interfacciaVista) {

        String                  strOutput="";
        classRollOverImg        myRollOver=null;
        String                  idenRef = "";


        try
        {
            idenRef = interfacciaVista.getField ( "IDEN_REF" ) ;
        }
        catch ( ImagoViewException ex )
        {
            logToOutputConsole.writeLogToSystemOutput(this, "Error while processing column. IdenRef is not available \n" + ex.getMessage());
            idenRef = "";
        }

        if (!idenRef.equalsIgnoreCase("")){
	    //this.parentElement.parentElement.parentElement.sectionRowIndex
	    myRollOver = new classRollOverImg ( "javascript:printReport();" ,
						"imagexPix/button/mini/print_off.gif" ,
						"imagexPix/button/mini/print_on.gif" ,
						"" , "25px" , "25px" ) ;
	    myRollOver.setLinkOnHref ( "javascript:printReport();" ) ;
	    myRollOver.setLinkOnClick ( "" ) ;
	    strOutput = myRollOver.toString () ;
	}
        return strOutput;
    }

    public String processData(String oggetto) {
        return "&nbsp;";
    }

}
