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
package src.imago_gestione_campi;

import imago.http.baseClass.baseUser;
import imago_jack.imago_function.db.functionDB;

import java.util.ArrayList;
import java.util.Hashtable;

import src.Gestione_Campi.CGES_CAMPO_CHECK;
import src.Gestione_Campi.CGES_CAMPO_CHECK_Data;
import src.Gestione_Campi.CVW_Gest_Rel;
import src.Gestione_Campi.CVW_Gest_Rel_Data;

public class gestioneCampi extends functionDB {
    private Hashtable hCampi = null;
    private CVW_Gest_Rel Selezione = null;
    private CVW_Gest_Rel_Data Selezionato = null;
    private String sCampi = new String("''");
    private String sDescr = new String("''");
    private String sNomeCampi = new String("''");
    private String sEventiCampi = new String("''");
    private String sCampiGet = new String("''");
    private String sIdenCheck = new String("''");
    private String sStato = new String("''");
    private String sCampiNome = new String("''");

    public gestioneCampi() {
        super();
    }

    public gestioneCampi(baseUser bu) {
        this();
        setBaseUser(bu);
    }

    public void setBaseUser(baseUser bu) {
        this.setUser(bu);
    }

    public void readScheda(String sScheda) throws Exception {
        gestioneStructCampo StruttCampo = null;
        String chiave = new String("");
        hCampi = new Hashtable();
        if (sScheda != null) {
            sScheda = sScheda.trim();

            if (!sScheda.equalsIgnoreCase("")) {
                ArrayList ElencoSelezionati = new ArrayList();
                int NumeroSelezionati = 0;
                Selezione = new CVW_Gest_Rel(getUser().db.getWebConnection());
                for (int a = 0; a < 2; a++) {
                    if (a == 0) {
                        Selezione.loadData("SCHEDA='" + sScheda +
                                           "' and utente='" + getUser().login +
                                           "'");
                    }
                    if (a == 1) {
                        Selezione.loadData("SCHEDA='" + sScheda + "' and utente is null");
                    }
                    ElencoSelezionati = Selezione.getData();
                    NumeroSelezionati = ElencoSelezionati.size();
                    for (int i = 0; i < NumeroSelezionati; i++) {
                        Selezionato = new CVW_Gest_Rel_Data();
                        Selezionato = (CVW_Gest_Rel_Data) ElencoSelezionati.get(i);
                        //gestioneStructDescr StruttDesc = new gestioneStructDescr();
                        //gestioneStructStato StruttStato= new gestioneStructStato();
                        StruttCampo = new gestioneStructCampo();
                        //StruttDesc.descrizione=Selezionato.m_view_Descrizione;
                        //StruttDesc.nome=Selezionato.m_view_campo;
                        //StruttDesc.campo_check=Selezionato.m_view_campo_check;
                        //StruttStato.stato=Integer.parseInt(Selezionato.m_view_stato);
                        StruttCampo.campo.descrizione = Selezionato.
                                m_view_Descrizione;
                        StruttCampo.campo.nome = Selezionato.m_view_campo;
                        chiave = Selezionato.m_view_campo;
                        StruttCampo.campo.campo_check = Selezionato.m_view_campo_check;
                         StruttCampo.campo.valore = Selezionato.m_view_Valore;
                        StruttCampo.stato.stato = Integer.parseInt(Selezionato.m_view_stato);

                        //StruttCampo.campo=StruttDesc;
                        //StruttCampo.stato=StruttStato;
                        if (hCampi.get(chiave) == null) {
                            hCampi.put(chiave, StruttCampo);
                        }
                       // if (StruttCampo.stato.stato == 30 && !StruttCampo.campo.campo_check.equalsIgnoreCase("")) {
                            sCampiNome+= ", '" + StruttCampo.campo.nome + "'";
                            sCampi += ", '" + StruttCampo.campo.campo_check + "'";
                            sDescr += ", '" + StruttCampo.campo.descrizione.replaceAll("'", "\'") + "'";
                            sStato +=", '" + Integer.toString(StruttCampo.stato.stato).replaceAll("'", "\'") + "'";
                        //}
                        CGES_CAMPO_CHECK tabCheck=new CGES_CAMPO_CHECK(getUser().db.getWebConnection());

                        tabCheck.loadData("IDEN_RELAZIONE="+ Selezionato.m_view_Iden_relazione);
                        ArrayList ArrTabCheck = new ArrayList();
                        ArrTabCheck = tabCheck.getData();
                        for (int contCheck = 0; contCheck < ArrTabCheck.size(); contCheck++)
                        {
                            if (StruttCampo.stato.stato != 1 ) {
                            CGES_CAMPO_CHECK_Data DataTabCheck=new CGES_CAMPO_CHECK_Data();
                            DataTabCheck = (CGES_CAMPO_CHECK_Data) ArrTabCheck.get(contCheck);
                            sNomeCampi+=", '" + Selezionato.m_view_campo_check_descr.replaceAll("'", "\'") + "'";
                            sEventiCampi+=", '" + DataTabCheck.m_JS_EVENT.replaceAll("'", "\'") + "'";
                            sCampiGet+=", '" + DataTabCheck.m_CAMPI_GET.replaceAll("'", "\'") + "'";
                            sIdenCheck+=", '" + DataTabCheck.m_IDEN_RELAZIONE + "'";

                        }
                    }
                    }
                }

            } else {
                throw new Exception("Nome scheda vuoto!");
            }
        } else {
            throw new Exception("Nome scheda nullo!");
        }
    }

    public gestioneStructCampo getCampo(String nome) {
        gestioneStructCampo ret = null;

        if (hCampi.get(nome) != null) {
            ret = (gestioneStructCampo) hCampi.get(nome);
        } else {
            ret = new gestioneStructCampo();
        }

        return ret;
    }

    public String getArrayCheck() {
        String sOut = new String("");

        sOut = "\n";
        sOut += "\tvar aCheck = new Array(" + sCampi + ");\n";
        sOut += "\tvar aCheckDescr = new Array(" + sDescr + ");\n";
        sOut += "\tvar aNomeCampi = new Array(" + sNomeCampi + ");\n";
        sOut += "\tvar aEventiCampi = new Array(" + sEventiCampi + ");\n";
        sOut += "\tvar aCampiGet = new Array(" + sCampiGet + ");\n";
        sOut += "\tvar aIdenCheck = new Array(" + sIdenCheck + ");\n";
        sOut += "\tvar aStato = new Array(" + sStato + ");\n";
        sOut += "\tvar aCampiNome = new Array(" + sCampiNome + ");\n";

        return sOut;
    }
}
