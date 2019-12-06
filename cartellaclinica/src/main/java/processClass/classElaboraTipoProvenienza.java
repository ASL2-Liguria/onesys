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
package processClass ;

import imagoCreateWk.IprocessDataTable;

public class classElaboraTipoProvenienza implements IprocessDataTable {

    /** Creates a new instance of classElaboraDataOra */
    public classElaboraTipoProvenienza() {
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
    }

    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
        return oggetto;
    }

    public String processData(imagoView.Iview interfacciaVista) {
        String  strTipo = "";

        try{
            strTipo = interfacciaVista.getField("INT_EST");
        }
        catch(imagoView.ImagoViewException ex){
        }
        return getTipoProvenienza(strTipo);

    }

    public String processData(String oggetto) {
        return getTipoProvenienza(oggetto);
    }


    private String getTipoProvenienza(String tipo){
        String     strOutput = "";

        if (tipo.equalsIgnoreCase("I")){
            strOutput = "Interno";
        }
        else if (tipo.equalsIgnoreCase("E")){
            strOutput = "Esterno";
        }
        else if (tipo.equalsIgnoreCase("P")){
            strOutput = "Pronto soccorso";
        }

        else if (tipo.equalsIgnoreCase("O")){
            strOutput = "Altri ospedali";
        }

        else if (tipo.equalsIgnoreCase("L")){
            strOutput = "Libera professione";
        }

        return strOutput;
    }


}
