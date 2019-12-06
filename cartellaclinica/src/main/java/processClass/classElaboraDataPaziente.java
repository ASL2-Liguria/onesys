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
package processClass;

/**
 * <p>Title: </p>
 *
 * <p>Description: Classe che elabora la data presente nel campo PAZIENTE (cognome + nome + data di nascita)</p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author elenad
 * @version 1.0
 */

public class classElaboraDataPaziente implements imagoCreateWk.IprocessDataTable {
    private String paziente = null;

    /** Creates a new instance of classElaboraDataPaziente */
    public classElaboraDataPaziente() {
    }

    /**
     *
     * @param oggetto classColDataTable
     * @return classColDataTable
     */
    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {

	return oggetto;
    }

    /**
     *
     * @param iview Iview
     * @return String
     */
    public String processData(imagoView.Iview interfacciaVista) {
	String cognomeNome = "";
	String data = "";
	int lunghezza_campo = 0;
	String nome_campo = "";
	try
	{
	    nome_campo = interfacciaVista.getCampoWk().nomecampo.toUpperCase();
	    lunghezza_campo = interfacciaVista.getField(nome_campo).toString().length();
	    cognomeNome = interfacciaVista.getField(nome_campo).toString().substring(0, lunghezza_campo - 8);
	    data = interfacciaVista.getField(nome_campo).toString().substring(lunghezza_campo - 8, lunghezza_campo);

	    this.paziente = cognomeNome + " " + data.substring(6, 8) + "/" + data.substring(4, 6) + "/" + data.substring(0, 4);
	}
	catch(Exception e)
	{
	    try
	    {
		paziente = interfacciaVista.getField(nome_campo).toString();
	    }
	    catch(Exception ex)
	    {

	    }
	}
	return paziente;
    }


    public String processData(String str) {
	return "&nbsp;";
    }

}
