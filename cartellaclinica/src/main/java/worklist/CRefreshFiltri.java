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
 * CRefreshFiltri.java
 *
 * Created on 7 luglio 2006, 15.25
 */

package worklist;

import imago.a_sql.CFiltri;
import imago.a_sql.CLogError;
import imago.a_sql.CTabPer;
import imago.a_sql.CTabPerData;
import imago.a_sql.CTabSal;
import imago.a_sql.CTabSalData;
import imago.a_util.CClientParam;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

/**
 * Classe richiamata dalla servlet SL_RefreshFiltri per effettuare il refresh delle provenienze,
 * dei medici e delle sale che dipendono dalla scelta dei cdc
 * Tale classe dato l'elenco dei centri di costo restituisce utilizzando i suoi metodi
 * l'elenco delle provenienze, dei medici e delle sale associate ai cdc.
 *
 * @author  elenad
 */
public class CRefreshFiltri {
    private CLogError log = null;
    private CClientParam client_param = null;
    private baseUser logged_user = null;
    /** Creates a new instance of CRefreshFiltri */
    public CRefreshFiltri() {
    }

    public CRefreshFiltri(CLogError log, CClientParam client_param, baseUser logged_user) {
        this.logged_user = logged_user;
        this.log = log;
        this.client_param = client_param;
    }

    /**
     * Metodo per la costruzione del codice js che contiene i nuovi valori dipendenti dalla scelta dei
     * centri di costi(nel caso specifico dei filtri: provenienze, medici e sale)
     * Tale funzione effettua l'eliminazione delle options del combo-box delle provenienze e quello dei medici
     * in più aggiorna la variabile delle sale ed il suo title.
     * @return funzione js refreshFiltri() che permette di associare al combo-box
     *         delle provenienze le provenienze associate alla nuova scelta dei centri di costo;
     *         al combo-box dei medici l'elenco dei medici associati ai cdc scelti;
     *         alla finestra della scelta delle sale, l'elenco delle sale associati ai cdc selezionati
     *         Tale funzione viene richiamata alla fine della generazione di questa pagina
     *         Questa classe viene richiamata all'associazione dei cdc in modo tale da effettuare
     *         il refresh delle parti dei filtri interessate al cambiamento dei cdc
     */
    public String addJsBottom() {
        String js = new String("");
        String elenco_cdc = "";
        js = js.concat("function refreshFiltri(){\n");

        elenco_cdc = this.client_param.getParam("elenco_cdc");

        if (elenco_cdc != null && elenco_cdc.compareTo("") != 0) {
            /*Aggiorno la variabile contenente l'elenco dei centri di costo
             nella pagina dei filtri*/
            js = js.concat("\tparent.worklistTopFrame.document.all.hCdc.value = \"" + elenco_cdc + "\";\n");

            /*
             *GESTIONE COMBO-BOX MEDICO
             */
            ArrayList medici = this.getMedici(elenco_cdc);
            ArrayList iden_med = new ArrayList();
            ArrayList descr_med = new ArrayList();
            iden_med.add(0, "");
            descr_med.add(0, "Tutti");
            CTabPerData med_data = null;
            for (int i = 0; i < medici.size(); i++) {
                try {
                    med_data = (CTabPerData) medici.get(i);
                    iden_med.add(String.valueOf(med_data.m_iIDEN));
                    descr_med.add(med_data.m_strDESCR.replaceAll("[']", "\\\\'"));
                }
                catch (Exception e) {
                    e.printStackTrace();
                    this.log.writeError("worklist.CRefreshFiltri.gestioneComboBoxMEDICI() " + e.getMessage());
                }
            }

            js = js.concat("\tvar elemento_med = parent.worklistTopFrame.document.formDati.FilMed;\n");
            js = js.concat("\tremove_option(elemento_med);\n");

            String array_js_iden_med = "\tvar array_iden_med = new Array(" + iden_med.size() + ");\n";
            String array_js_descr_med = "\tvar array_descr_med = new Array(" + descr_med.size() + ");\n";
            js = js.concat(array_js_iden_med);
            js = js.concat(array_js_descr_med);

            for (int i = 0; i < iden_med.size(); i++) {
                js = js.concat("\tarray_iden_med[" + i + "] = '" + iden_med.get(i) + "';\n");
                js = js.concat("\tarray_descr_med[" + i + "] = '" + descr_med.get(i) + "';\n");
                js = js.concat("\tupdate_elemento(elemento_med, " + i + ", array_iden_med[" + i + "], array_descr_med[" + i + "], elemento_med);\n");
            }
            /*
             *GESTIONE SALE
             */
            String js_sale = this.getSale(elenco_cdc);
            js = js.concat(js_sale);

        }
        js = js.concat("}\n\n");
        return js;
    }


    /**
     * Metodo che restituisce l'elenco dei medici associati ai centri di costo
     * passati in input al metodo, memorizzandoli in un arraylist
     * @param elenco_cdc Stringa contenente l'elenco dei centri di costo contenuti
     *                   nella tabella FILTRI dove FILTRI.tipo = 2 nel caso venga richiamata
     *                   al caricamento dei filtri;
     *                   oppure contiene la scelta di centri di costo contenuti direttamente
     *                   nella pagina dei filtri
     * @return un ArrayList contenente i record della tabella del personale (TAB_PER) filtrata per
     *         tipo = 'M' ordinati per cognome che sono associati all'elenco dei centri di costo
     *         passati in input al metodo
     */
    private ArrayList getMedici(String elenco_cdc) {
        ArrayList elenco_medici = null;
        try {
            if (elenco_cdc != null) {
                CTabPer per = new CTabPer(this.logged_user.db.getDataConnection());

                //per.loadData(this.logged_user, elenco_cdc, "M", "R", "COGNOME", true, true);
                per.loadDataSetView("VIEW_TAB_PER", this.logged_user, elenco_cdc);

                elenco_medici = per.getData();
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            this.log.writeError("worklist.CRefreshFiltri.getMedici(): " + e.getMessage());
        }
        return elenco_medici;
    }


    /**
     * Metodo che permette di effettuare il refresh delle sale associate ai cdc scelti
     * dall'apposita finestra
     * @param elenco_cdc Stringa contenente l'elenco dei centri di costo contenuti
     *                   nella tabella FILTRI dove FILTRI.tipo = 2 nel caso venga richiamata
     *                   al caricamento dei filtri;
     *                   oppure contiene la scelta di centri di costo contenuti direttamente
     *                   nella pagina dei filtri
     * @return una stringa contenente il richiamo della funzione js refresh_sale contenuta nel file js
     *         /worklist/Filtri/gestione_filtri.js per effettuare il refresh delle sale, del title e
     *         del numero di sale associate ai cdc
     */
    private String getSale(String elenco_cdc) {
        CTabSalData sale_data = null;
        String sale_ass_cdc_iden = "";
        String sale_ass_cdc_descr = "";
        CTabSal sale = null;
        try {
            sale = new CTabSal(this.logged_user.db.getDataConnection());
            boolean attivo = false;
            if (this.logged_user.filtri_voci_inattive != null && this.logged_user.filtri_voci_inattive.equalsIgnoreCase("N")) {
                attivo = true;
            }
            sale.loadDataIn(elenco_cdc, "DESCR", true, attivo);
        }
        catch (Exception e) {
            e.printStackTrace();
            this.log.writeError("worklist.CRefreshFiltri.getSale(): " + e.getMessage());
        }
        ArrayList elenco_sale = sale.getData();
        CFiltri update_filtro_sale = new CFiltri(this.logged_user, 1);

        for (int i = 0; i < elenco_sale.size(); i++) {
            sale_data = (CTabSalData) elenco_sale.get(i);
            if (i == elenco_sale.size() - 1) {
                sale_ass_cdc_iden += sale_data.m_iIDEN;
                sale_ass_cdc_descr += sale_data.m_strDESCR.replaceAll("[']", "\\\\'");
            }
            else {
                sale_ass_cdc_iden += sale_data.m_iIDEN + ",";
                sale_ass_cdc_descr += sale_data.m_strDESCR.replaceAll("[']", "\\\\'") + ", ";
            }
        }
        update_filtro_sale.update(this.logged_user.login, 4, sale_ass_cdc_iden);

        String script = "refresh_sale('" + sale_ass_cdc_iden + "', '" + sale_ass_cdc_descr + "', '" + elenco_sale.size() + "');\n";

        return script;
    }


}
