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
package configura_ricerca.db;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author elenad
 * @version 1.0
 */
public class CConfiguraRicercaDati {
    /**
     *
     */
    public String TIPO_RICERCA = null;
    /**
     *
     */
    public String NOME_RICERCA = null;
    /**
     *
     */
    public String ATTIVO = null;
    /**
     *
     */
    public String CAMPI = null;
    /**
     *
     */
    public String CAMPI_LABEL = null;
    /**
     *

	 public String CAMPI_VALORE = null;*/
    /**
     *
     */
    public String CAMPI_METODO = null;
    /**
     *
     */
    public String CAMPI_TIPOLOGIA = null;
    /**
     *
     */
    public String CAMPI_RIGA = null;
    /**
     *
     */
    public String CAMPI_SIZE = null;
    /**
     *
     */
    public String CAMPI_WIDTH_LABEL = null;
    /**
     *
     */
    public String CAMPI_WIDTH_FIELD = null;
    /**
     *
     */
    public String FUNZIONI = null;
    /**
     *
     */
    public String NOME_EVENTO = null;
    /**
     *
     */
    public String PULSANTI_LABEL = null;
    /**
     *
     */
    public String PULSANTI_FUNZIONIJS = null;
    /**
     *
     */
    public String TIPO_WK = null;
    /**
     *
     */
    public String NOME_VISTA = null;
    /**
     *
     */
    public String MODULO = null;
    /**
     * Nome funzione che carica la wk dell'anagrafica all'apertura della pagina di ricerca
     */
    public String FUNZIONE_CARICA_WK = null;
    /**
     *
     */
    public String COLSPAN_LABEL = null;
    /**
     *
     */
    public String COLSPAN_FIELD = null;
    /**
     *
     */
    public String PARAMETRI = null;


    /**
     *
     */
    public CConfiguraRicercaDati() {
	this.TIPO_RICERCA = new String("");
	this.NOME_RICERCA = new String("");
	this.ATTIVO = new String("");
	this.CAMPI = new String("");
	this.CAMPI_LABEL = new String("");
	//this.CAMPI_VALORE = new String("");
	this.CAMPI_METODO = new String("");
	this.CAMPI_TIPOLOGIA = new String("");
	this.CAMPI_RIGA = new String("");
	this.CAMPI_SIZE = new String("");
	this.CAMPI_WIDTH_LABEL = new String("");
	this.CAMPI_WIDTH_FIELD = new String("");
	this.FUNZIONI = new String("");
	this.NOME_EVENTO = new String("");
	this.PULSANTI_LABEL = new String("");
	this.PULSANTI_FUNZIONIJS = new String("");
	this.TIPO_WK = new String("");
	this.NOME_VISTA = new String("");
	this.FUNZIONE_CARICA_WK = new String("");
	this.MODULO = new String("");
	this.COLSPAN_LABEL = new String("");
	this.COLSPAN_FIELD = new String("");
	this.PARAMETRI = new String("");
    }

}
