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
 * classDescrFiltri.java
 *
 * Created on 12 luglio 2006, 8.59
 */

package processClass;

import imago.http.classDivHtmlObject;
import imagoView.ImagoViewException;

/**
 *
 * @author  elenad
 */
public class classDescrFiltri implements imagoCreateWk.IprocessDataTable{
    private int tipo;
    /** Creates a new instance of classDescrFiltri */
    public classDescrFiltri() {
    }

    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
        classDivHtmlObject div = null;
        switch (tipo) {
            case 0:
                div = new classDivHtmlObject("id_urg", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Urgenza");
                oggetto.appendSome(div);
                break;
            case 1:
                div = new classDivHtmlObject("id_met", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Medodiche");
                oggetto.appendSome(div);
                break;
            case 2:
                div = new classDivHtmlObject("id_cdc", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Centri di Costo");
                oggetto.appendSome(div);
                break;
            case 3:
                div = new classDivHtmlObject("id_pro", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Provenienze");
                oggetto.appendSome(div);
                break;
            case 4:
                div = new classDivHtmlObject("id_sale", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Sale");
                oggetto.appendSome(div);
                break;
            case 5:
                div = new classDivHtmlObject("id_med", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Medici");
                oggetto.appendSome(div);
                break;
            case 6:
                div = new classDivHtmlObject("id_da_data_esa", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Da Data Esame");
                oggetto.appendSome(div);
                break;
            case 7:
                div = new classDivHtmlObject("id_a_data_esa", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("A Data Esame");
                oggetto.appendSome(div);
                break;
            case 8:
                div = new classDivHtmlObject("id_cogn", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Cognome");
                oggetto.appendSome(div);
                break;
            case 9:
                div = new classDivHtmlObject("id_nome", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Nome");
                oggetto.appendSome(div);
                break;
            case 10:
                div = new classDivHtmlObject("id_data_nasc", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Data Nascita");
                oggetto.appendSome(div);
                break;
            case 11:
                div = new classDivHtmlObject("id_num_arch", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Numero Archivio");
                oggetto.appendSome(div);
                break;
            case 12:
                div = new classDivHtmlObject("id_num_acc", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Numero Accettazione");
                oggetto.appendSome(div);
                break;
            case 13:
                div = new classDivHtmlObject("id_num_dic_esa", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Numeri Dicome Esame");
                oggetto.appendSome(div);
                break;
            case 14:
                div = new classDivHtmlObject("id_stato", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Stato");
                oggetto.appendSome(div);
                break;
            case 15:
                div = new classDivHtmlObject("id_cf", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Codice Fiscale");
                oggetto.appendSome(div);
                break;
            case 16:
                div = new classDivHtmlObject("id_num_dicom_paz", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Numeri Dicom Paziente");
                oggetto.appendSome(div);
                break;
            case 17:
                div = new classDivHtmlObject("id_num_nos", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Numero Nosologico");
                oggetto.appendSome(div);
                break;
            case 100:
                div = new classDivHtmlObject("id_met_rich", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Filtro Metodiche Richieste");
                oggetto.appendSome(div);
                break;


            case 201:
                div = new classDivHtmlObject("id_mn_esa", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Tipologia esami di M.N.");
                oggetto.appendSome(div);
                break;

            case 300:
                div = new classDivHtmlObject("id_scr_urg", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Urgenza Screening");
                oggetto.appendSome(div);
                break;
            case 301:
                div = new classDivHtmlObject("id_scr_met", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Medodiche Screening");
                oggetto.appendSome(div);
                break;
            case 302:
                div = new classDivHtmlObject("id_scr_cdc", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Centri di Costo Screening");
                oggetto.appendSome(div);
                break;
            case 303:
                div = new classDivHtmlObject("id_scr_pro", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Provenienze Screening");
                oggetto.appendSome(div);
                break;
            case 304:
                div = new classDivHtmlObject("id_scr_sale", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Sale Screening");
                oggetto.appendSome(div);
                break;
            case 305:
                div = new classDivHtmlObject("id_scr_med", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Medici Screening");
                oggetto.appendSome(div);
                break;
            case 306:
                div = new classDivHtmlObject("id_scr_da_data_esa", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Da Data Esame Screening");
                oggetto.appendSome(div);
                break;
            case 307:
                div = new classDivHtmlObject("id_scr_a_data_esa", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("A Data Esame Screening");
                oggetto.appendSome(div);
                break;

            case 314:
                div = new classDivHtmlObject("id_scr_stato", "", "");
                div.addAttribute("class", "classDatiTabella");
                div.appendSome("Stato Screening");
                oggetto.appendSome(div);
                break;
        }
        return oggetto;
    }


    public String processData(imagoView.Iview iview) {
        try{
            tipo = Integer.parseInt(iview.getField("TIPO").toString());
        }
        catch(ImagoViewException ex) {
            tipo = 0 ;
        }
        return "";
    }

    public String processData(String str) {
        return "&nbsp;";
    }

}
