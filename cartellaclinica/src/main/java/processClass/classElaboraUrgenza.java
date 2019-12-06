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
 * classElaboraUrgenza.java
 *
 * Created on 12 gennaio 2006, 16.41
 */

package processClass;

import imagoUtils.logToOutputConsole;
/**
 *
 * @author  aldog
 */
public class classElaboraUrgenza implements imagoCreateWk.IprocessDataTable {

    private int      urgenza;
    public static int       classElaboraUrgenza_indiceRiga=1;

    /** Creates a new instance of classElaboraUrgenza */
    public classElaboraUrgenza() {
    }

    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
        switch (urgenza) {
            case 0:
                oggetto.addAttribute("class", "bianco");
                oggetto.addAttribute("title", "Non urgenza");
                break;
            case 1:
                oggetto.addAttribute("class", "verde");
                oggetto.addAttribute("title", "Urgenza differita");
                break;
            case 2:
                oggetto.addAttribute("class", "giallo");
                oggetto.addAttribute("title", "Urgenza");
                break;
            case 3:
                oggetto.addAttribute("class", "rosso");
                oggetto.addAttribute("title", "Emergenza");
                break;
            default:
                oggetto.addAttribute("class", "bianco");
                oggetto.addAttribute("title", "Non urgente");
                break;
        }
        oggetto.appendSome(String.valueOf(classElaboraUrgenza_indiceRiga));
        // ******************** da VERIFICARE ************
        // la variabile classElaboraUrgenza_indiceRiga
        // la inizializzo solo in processData utilizzando
        // getRowIndex che mi restituisce un valore reale

//        classElaboraUrgenza_indiceRiga ++;
        // ***********************************************
        return oggetto;
    }


    public String processData(imagoView.Iview interfacciaVista) {
        try{
            // ******************** da VERIFICARE ************
            try{
		classElaboraUrgenza_indiceRiga = interfacciaVista.getRowIndex () ;
	    }
            catch(Exception ex){
                classElaboraUrgenza_indiceRiga = 0;
                logToOutputConsole.writeLogToSystemOutput(this, "Errore di conversione getRowIndex.\n"+ ex.getCause().getMessage());
            }
            // ***********************************************
            urgenza = Integer.parseInt(interfacciaVista.getField("URGENZA").toString());
        }
        catch(java.lang.Exception ex) {
            urgenza =0 ;
        }
        /*
        try{
            indiceRiga = interfacciaVista.getField("INDICERIGA");

        }
        catch(ImagoViewException ex){
            indiceRiga = "";
        }*/
        return "";
    }

    public String processData(String oggetto) {
        return "&nbsp;";
    }

}
