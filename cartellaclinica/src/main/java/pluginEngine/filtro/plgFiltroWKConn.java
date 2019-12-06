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
    File: plgFiltroWK.java
    Autore: Jack
*/

package pluginEngine.filtro;

import generatoreEngine.html.engine_html.components.htmlTable;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;

import imago.sql.SqlQueryException;
import imago.sql.Utils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import plugin.getPoolConnection;

public class plgFiltroWKConn extends baseAttributeEngine
{
    private final int NUMERO_COLONNE_DEFAULT = 3;

    private int       n_colonne;
    private htmlTable hTable    = null;
    private Connection otherConnection = null;
    private String query;

    public plgFiltroWKConn()
    {
    }

    public Object get_attribute_engine()
    {
        return this.hTable.getTable();
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        super.set_percorso_engine(PATH_ENGINE.TABLE);

        this.n_colonne = this.NUMERO_COLONNE_DEFAULT;
        this.hTable    = new htmlTable();
    }

    public void setNumeroColonne(String valore)
    {
        try
        {
            this.n_colonne = Integer.valueOf(valore);
        }
        catch(Exception ex)
        {
            this.n_colonne = this.NUMERO_COLONNE_DEFAULT;
        }
    }
    
    public void setOtherConnection(String poolName, String user, String pwdCriptata, String tipoCriptazione) throws SQLException {
        getPoolConnection pool = new getPoolConnection(poolName, user, pwdCriptata, tipoCriptazione);
        try {
            otherConnection = pool.getConnection();
        }
        catch(Exception e) {
            otherConnection.close();
        }
    }
    
    public void setQuery(String pQuery) {
        query=pQuery;
      
    }


    public void draw()
    {
        PreparedStatement ps = null;
        ResultSet rs               = null;
        List<String> aValori = new ArrayList<String>();
        List<String> aDescrizione = new ArrayList<String>();
    /*    String[]                  aValori        = super.db_dati.getField("plgFiltro").getArrayChiave();
        String[]                  aDescrizione   = super.db_dati.getField("plgFiltro").getArrayDescrizione();*/
        String[]                  aSeleziona     = super.schema_dati.getContainer("REQUEST").getField("FILTRO_SELEZIONA").getValue().split(",");
        int                       idx;
        int                       idxCol;
        int                       idxChk         = 0;
        int                       totale_righe  =0;
        int                       totale_colonna =0 ;
        int[]                     contatori      = new int[this.n_colonne];
        Hashtable<String, String> aSelCheck      = new Hashtable<String,String>();
        

        try
        {
        	ps = this.otherConnection.prepareCall(query);
        	rs = ps.executeQuery();
        	 while(rs.next())
             {
        		 aValori.add(rs.getString("CODICE"));
        		 aDescrizione.add(rs.getString("DESCRIZIONE"));
             }
        	 totale_righe= aDescrizione.size();
        	 totale_colonna= aDescrizione.size() / this.n_colonne + (aDescrizione.size() % this.n_colonne > 0 ? 1:0);
        }
        catch(Exception ex)
        {
        	ex.printStackTrace();
        }
        finally
        {
        	try
        	{
        		otherConnection.close();
        	}
        	catch(Exception ex)
        	{
        		ex.printStackTrace();
        	}

        }

        

        for(idx = 0; idx < aSeleziona.length; aSelCheck.put(aSeleziona[idx].trim(), aSeleziona[idx++].trim()))

        this.hTable.initTable();

        for(idx = 0; idx < this.n_colonne; contatori[idx] = (idx++ * totale_colonna));

        for(idx = 0; idx < totale_colonna; idx++)
        {
            for(idxCol = 0; idxCol < this.n_colonne; idxCol++)
            {
                if(contatori[idxCol] < totale_righe)
                {
                    this.hTable.riga.colonna.campo.setValoreSelezione((aSelCheck.get(aValori.get(contatori[idxCol])) == null ? "":aSelCheck.get(aValori.get(contatori[idxCol]))).trim());
                    this.hTable.riga.colonna.campo.add_event("onclick", "javascript:seleziona_singolo(" + String.valueOf(idxChk) + ", this);");
                    this.hTable.riga.colonna.campo.creaFieldCHECKBOX("chkValore", aValori.get(contatori[idxCol]));
                    this.hTable.riga.colonna.add_attribute("width", "1%");
                    this.hTable.riga.colonna.setClasse("classTdFiltriField");
                    this.hTable.riga.colonna.creaColonnaTD();

                    this.hTable.riga.colonna.campo.creaLabel("lblValoreCheck", aDescrizione.get(contatori[idxCol]++));
                    this.hTable.riga.colonna.add_event("onclick", "javascript:seleziona_singolo(" + String.valueOf(idxChk) + ");");
                    this.hTable.riga.colonna.setClasse("classTdFiltriLabel");
                    this.hTable.riga.colonna.creaColonnaTD();

                    idxChk++;
                }
                else
                {
                    this.hTable.riga.colonna.add_attribute("width", "1%");
                    this.hTable.riga.colonna.setClasse("classTdFiltriField");
                    this.hTable.riga.colonna.creaColonnaTD();

                    this.hTable.riga.colonna.campo.creaLabel("", " ");
                    this.hTable.riga.colonna.setClasse("classTdFiltriLabel");
                    this.hTable.riga.colonna.creaColonnaTD();
                }
            }

            this.hTable.aggiungiRiga();
        }
    }
}
