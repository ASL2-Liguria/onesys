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

import imago.http.classColDataTable;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.baseClass.baseUser;
import imago.sql.TableResultSet;
import imagoAldoUtil.classStringUtil;

import java.lang.reflect.Method;
import java.sql.ResultSet;
import java.util.ArrayList;

import configura_ricerca.exception.ConfiguraRicercaException;

/**
 * <p>
 * Title:
 * </p>
 *
 * <p>
 * Description:
 * </p>
 *
 * <p>
 * Copyright:
 * </p>
 *
 * <p>
 * Company:
 * </p>
 *
 * @author elenad
 * @version 1.0
 */
public class CConfiguraRicerca
{
    private ArrayList al_ricerca = null;
    private baseUser logged_user = null;

    private ArrayList lista_colonne = null;

    /**
     *
     * @param logged_user
     *           baseUser
     */
    public CConfiguraRicerca(baseUser logged_user)
    {
        this.al_ricerca = new ArrayList();
        this.logged_user = logged_user;
    }

    /**
     *
     * @param where_condition
     *           String
     * @param attivo
     *           boolean
     * @throws ConfiguraRicercaException
     */
    public void loadData(String where_condition, boolean attivo) throws ConfiguraRicercaException
    {
        TableResultSet trs = null;
        ResultSet rs = null;
        String select = null;
        String select_where = null;

        this.al_ricerca.clear();

        trs = new TableResultSet();
        select = "SELECT * FROM CONFIGURA_RICERCA";

        if(!classStringUtil.checkNull(where_condition).equalsIgnoreCase(""))
        {
            select_where = " WHERE " + where_condition;
        }

        select = select + classStringUtil.checkNull(select_where);

        if(attivo && !classStringUtil.checkNull(select_where).equalsIgnoreCase(""))
        {
            select += " AND ATTIVO = 'S'";
        }
        else
        {
            select += " WHERE ATTIVO = 'S'";
        }

        select += " order by NOME_RICERCA";

        try
        {
            rs = trs.returnResultSet(logged_user.db.getWebConnection(), select);
            while(rs.next())
            {
                this.fillstruct(rs);
            }
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".loadData(): select=" + select + " --- " + e.getMessage());
        }
        finally
        {
            try
            {
                trs.close();
                trs = null;
            }
            catch(Exception e)
            {
            }
        }
    }

    /**
     *
     * @param rs
     *           ResultSet
     * @throws ConfiguraRicercaException
     */
    private void fillstruct(ResultSet rs) throws ConfiguraRicercaException
    {
        CConfiguraRicercaDati data = null;
        try
        {
            data = new CConfiguraRicercaDati();

            data.TIPO_RICERCA = rs.getString("TIPO_RICERCA");
            data.NOME_RICERCA = rs.getString("NOME_RICERCA");
            data.NOME_EVENTO = rs.getString("NOME_EVENTO");
            data.ATTIVO = rs.getString("ATTIVO");
            data.FUNZIONI = rs.getString("FUNZIONI");
            data.CAMPI = rs.getString("CAMPI");
            data.CAMPI_LABEL = rs.getString("CAMPI_LABEL");
            data.CAMPI_METODO = rs.getString("CAMPI_METODO");
            data.CAMPI_TIPOLOGIA = rs.getString("CAMPI_TIPOLOGIA");
            data.CAMPI_RIGA = rs.getString("CAMPI_RIGA");
            data.CAMPI_SIZE = rs.getString("CAMPI_SIZE");
            data.CAMPI_WIDTH_LABEL = rs.getString("CAMPI_WIDTH_LABEL");
            data.CAMPI_WIDTH_FIELD = rs.getString("CAMPI_WIDTH_FIELD");
            data.PULSANTI_FUNZIONIJS = rs.getString("PULSANTI_FUNZIONIJS");
            data.PULSANTI_LABEL = rs.getString("PULSANTI_LABEL");
            data.TIPO_WK = rs.getString("TIPO_WK");
            data.NOME_VISTA = rs.getString("NOME_VISTA");
            data.FUNZIONE_CARICA_WK = rs.getString("FUNZIONE_CARICA_WK");
            data.MODULO = rs.getString("MODULO");
            data.COLSPAN_LABEL = rs.getString("COLSPAN_LABEL");
            data.COLSPAN_FIELD = rs.getString("COLSPAN_FIELD");
            data.PARAMETRI = rs.getString("PARAMETRI");

            this.al_ricerca.add(data);
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".fillstruct(): " + e.getMessage());
        }
    }

    /**
     *
     * @return ArrayList
     */
    public ArrayList getData()
    {
        return this.al_ricerca;
    }

    /**
     *
     * @param index
     *           int
     * @return CConfiguraRicercaDati
     */
    public CConfiguraRicercaDati getData(int index)
    {
        CConfiguraRicercaDati ricerca = null;

        if(index >= 0 && index < this.al_ricerca.size())
        {
            ricerca = new CConfiguraRicercaDati();
            ricerca = (CConfiguraRicercaDati)this.al_ricerca.get(index);
        }
        return ricerca;
    }

    /**
     *
     * @param ricerca
     *           CConfiguraRicercaDati
     * @return ArrayList
     * @throws ConfiguraRicercaException
     */
    public ArrayList getCampiRicerca(CConfiguraRicercaDati ricerca) throws ConfiguraRicercaException
    {
        classColDataTable td = null;
        classRowDataTable tr = null;
        classInputHtmlObject oggettoField = null;
        ArrayList lista_righe = null;
        //ArrayList lista_colonne = null;
        String elenco_campi[] = null;
        String elenco_campiLabel[] = null;
        String elenco_campiMetodo[] = null;
        String elenco_campiTipologia[] = null;
        String elenco_campiRiga[] = null;
        String elenco_campiSize[] = null;
        String elenco_campiWidthLabel[] = null;
        String elenco_campiWidthField[] = null;
        String elenco_eventi[] = null;
        String elenco_funzionijs[] = null;
        String elenco_colspan_label[] = null;
        String elenco_colspan_field[] = null;

        lista_colonne = new ArrayList();
        lista_righe = new ArrayList();

        try
        {
            if(!ricerca.CAMPI.equals(""))
            {
                elenco_campi = ricerca.CAMPI.split("[@]");
                elenco_campiLabel = ricerca.CAMPI_LABEL.split("[@]");
                elenco_campiMetodo = ricerca.CAMPI_METODO.split("[@]");
                elenco_eventi = ricerca.NOME_EVENTO.split("[@]");
                elenco_funzionijs = ricerca.FUNZIONI.split("[@]");
                elenco_campiTipologia = ricerca.CAMPI_TIPOLOGIA.split("[@]");
                elenco_campiRiga = ricerca.CAMPI_RIGA.split("[@]");
                elenco_campiSize = ricerca.CAMPI_SIZE.split("[@]");
                elenco_campiWidthLabel = ricerca.CAMPI_WIDTH_LABEL.split("[@]");
                elenco_campiWidthField = ricerca.CAMPI_WIDTH_FIELD.split("[@]");
                elenco_colspan_label = ricerca.COLSPAN_LABEL.split("[@]");
                elenco_colspan_field = ricerca.COLSPAN_FIELD.split("[@]");

                for(int i = 0; i < elenco_campi.length; i++)
                {
                    if(classStringUtil.checkNull(elenco_campiMetodo[i]).trim().equals(""))
                    {
                        td = new imago.http.classColDataTable("TD", "", classStringUtil.checkNull(elenco_campiLabel[i]));
                        td.addAttribute("class", "classTdLabelNoWidth");
                        td.addAttribute("width", classStringUtil.checkNull(elenco_campiWidthLabel[i]) + "%");
                        td.addAttribute("colspan", classStringUtil.checkNull(elenco_colspan_label[i]));
                        lista_colonne.add(td);

                        oggettoField = new classInputHtmlObject(classStringUtil.checkNull(elenco_campiTipologia[i]), classStringUtil.checkNull(elenco_campi[i]), "", classStringUtil.checkNull(elenco_campiSize[i]), "");
                        oggettoField.addAttribute("id", "idcampo" + i);
                        if(!classStringUtil.checkNull(elenco_campiTipologia[i]).equals("hidden"))
                        {
                            try
                            {
                                oggettoField.addAttribute(classStringUtil.checkNull(elenco_eventi[i]), "javascript:" + classStringUtil.checkNull(elenco_funzionijs[i]));
                            }
                            catch(Exception e)
                            {
                                oggettoField.addAttribute("#", "javascript:#");
                            }
                        }
                    }
                    else
                    {

                        metodo(elenco_campiMetodo[i]);
                    }

                    if(oggettoField != null)
                    {
                        td = new imago.http.classColDataTable("TD", "", oggettoField);
                        td.addAttribute("class", "classTdField");
                        td.addAttribute("width", classStringUtil.checkNull(elenco_campiWidthField[i]) + "%");
                        td.addAttribute("colspan", classStringUtil.checkNull(elenco_colspan_field[i]));
                        lista_colonne.add(td);

                        oggettoField = null;
                    }

                    if(classStringUtil.checkNull(elenco_campiRiga[i]).equals("1"))
                    {
                        tr = new classRowDataTable("", lista_colonne);
                        lista_colonne.clear();
                        lista_righe.add(tr);
                    }
                }
            }
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".getCampiRicerca(): " + e.getMessage());
        }
        return lista_righe;
    }

    /**
     *
     * @param nomeMetodoNumeroParametri
     *           String
     * @throws ConfiguraRicercaException
     */
    private void metodo(String nomeMetodoNumeroParametri) throws ConfiguraRicercaException
    {
        Class classe = this.getClass();
        Class tipoParametri[] = null;
        Object valoreParametri[] = null;
        Method metodo = null;
        try
        {
            /*
             * metodoParam = nomeMetodoNumeroParametri.split("[#]");
             * nomeMetodo = metodoParam[0];
             * try{
             * numeroParametriMetodo = Integer.parseInt(metodoParam[1]);
             * }
             * catch(Exception e){
             * numeroParametriMetodo = 0;
             * }
             * tipoParametri = setTipoParametriMetodo(numeroParametriMetodo);
             * valoreParametri = setValoreParametriMetodo(numeroParametriMetodo);
             */

            metodo = classe.getMethod(nomeMetodoNumeroParametri, tipoParametri);

            metodo.invoke(this, valoreParametri);

            /*
             * gestioneSceltaReparti(elenco_campiLabel[i],
             * elenco_campiWidthLabel[i],
             * elenco_colspan_label[i],
             * elenco_colspan_field[i],
             * elenco_campiWidthField[i],
             * elenco_eventi[i],
             * elenco_funzionijs[i]);
             */
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".metodo(): " + e.getMessage());
        }
    }

}

