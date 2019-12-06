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
    File: plgListaAttivita.java
    Autore: Jack
*/

package pluginEngine.cartellaClinica;

import generatoreEngine.html.engine_html.components.htmlTable;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.sql.SqlQueryException;
import imago.sql.Utils;
import imago_jack.imago_function.config.functionConfig;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;
import java.sql.PreparedStatement;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgListaAttivita extends baseAttributeEngine
{
    private htmlTable          tabella = null;
    private ServletContext     contxt  = null;
    private HttpServletRequest req     = null;
    private functionObj        fObj    = null;
    private functionStr        fStr    = null;
    private functionDB         fDB     = null;
    private functionConfig     fCfg    = null;

    public plgListaAttivita()
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.TABLE);
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.contxt  = context;
        this.req     = request;
        this.fObj    = new functionObj(this.contxt, this.req);
        this.fStr    = new functionStr();
        this.fDB     = new functionDB(this.fObj);
        this.fCfg    = new functionConfig(this.fObj);
        this.tabella = new htmlTable();
    }

    public Object get_attribute_engine()
    {
        return tabella.getTable();
    }

    public void getValueContainer(String nome)
    {
    }

    public void draw(String dbTable, String reparto,String funzione)
    {
        PreparedStatement ps = null;
        ResultSet rs               = null;
        //String    sSql             = "select * from " + dbTable + " where codice_reparto=? and funzione=?";
        String    idx_principale   = new String("");
        int       idx_count        = 0;
        new Utils();
        
        tabella.initTable();

        // Parte di "default"
  /*      tabella.riga.colonna.campo.setDatiContainer(super.db_dati);
        tabella.riga.colonna.campo.creaFieldCHECKBOX("chkIndirizzamento");
        tabella.riga.colonna.campo.creaLabel("lblIndirizzamento", "Indirizzamento");
        tabella.riga.colonna.creaColonnaTD();
        tabella.aggiungiRiga();*/

        try
        {
            this.fCfg.loadConfig("CONNESSIONE_DB_CONFIGURAZIONE_SCHEDE");

            //this.fDB.create_my_connection(this.fCfg.getParametro("CONNECTION_STRING"), this.fCfg.getParametro("USER"), this.fCfg.getParametro("PASSWORD"));
            this.fDB.set_connection_my(Utils.getTemporaryConnection(this.fCfg.getParametro("USER"), this.fCfg.getParametro("PASSWORD"), this.fCfg.getParametro("CONNECTION_STRING")));
            
           
            //sSql += " where codice_reparto='" + reparto + "' and funzione= '" + funzione + "'";
           
            ps = this.fDB.getConnectMy().prepareCall("select * from " + dbTable + " where codice_reparto=? and funzione=?");
            ps.setString(1, reparto);
            ps.setString(2, funzione);
            //rs = this.fDB.openRsMy(sSql);
            rs = ps.executeQuery();
            while(rs.next())
            {
                if(!this.fStr.verifica_dato(rs.getString("DESCR_GRUPPO")).equalsIgnoreCase(""))
                {
                    tabella.riga.colonna.campo.setDatiContainer(super.db_dati);

                    if(!idx_principale.equalsIgnoreCase(this.fStr.verifica_dato(rs.getString("IDEN_GRUPPO"))))
                    {
                        tabella.riga.colonna.campo.creaFieldCHECKBOX("chkPrincipale" + String.valueOf(idx_count), this.fStr.verifica_dato(rs.getInt("IDEN_GRUPPO"), rs.wasNull()));
                        tabella.riga.colonna.campo.creaLabel("lblPrincipale" + String.valueOf(idx_count), this.fStr.verifica_dato(rs.getString("DESCR_GRUPPO")), "lblPrincipale" + String.valueOf(idx_count));
                        tabella.riga.colonna.creaColonnaTD();

                        tabella.aggiungiRiga();

                        idx_principale = this.fStr.verifica_dato(rs.getString("IDEN_GRUPPO"));

                        tabella.riga.colonna.campo.setDatiContainer(super.db_dati);

                        idx_count++;
                    }

                    if(!this.fStr.verifica_dato(rs.getString("DESCR_ATTIVITA")).equalsIgnoreCase(""))
                    {
                        tabella.riga.setStatoNonVisibile();

                        tabella.riga.colonna.campo.creaLabel("lblSpazio" + (idx_count - 1), "&nbsp;", "lblSpazio" + (idx_count - 1));
                        tabella.riga.colonna.creaColonnaTD();

                        tabella.riga.colonna.campo.setDatiContainer(super.db_dati);

                        tabella.riga.colonna.campo.creaFieldCHECKBOX("chkSecondario" + this.fStr.verifica_dato(rs.getInt("IDEN_ATTIVITA"), rs.wasNull()), this.fStr.verifica_dato(rs.getInt("IDEN_ATTIVITA"), rs.wasNull()));
                        tabella.riga.colonna.campo.creaLabel("lblSecondario" + this.fStr.verifica_dato(rs.getInt("IDEN_ATTIVITA"), rs.wasNull()), this.fStr.verifica_dato(rs.getString("DESCR_ATTIVITA")), "lblSecondario" + this.fStr.verifica_dato(rs.getInt("IDEN_ATTIVITA"), rs.wasNull()));
                        tabella.riga.colonna.creaColonnaTD();

                        if(!this.fStr.verifica_dato(rs.getInt("FREQUENZA"), rs.wasNull()).equalsIgnoreCase(""))
                        {
                            tabella.riga.colonna.campo.creaLabel("", "volte al giorno ");
                            
                            tabella.riga.colonna.campo.setDatiContainer(super.db_dati);
                            tabella.riga.colonna.campo.creaFieldCOMBO("cmbVolte" + this.fStr.verifica_dato(rs.getInt("IDEN_ATTIVITA"), rs.wasNull()), super.db_dati.getField("plgAttivita").getArrayChiave(), super.db_dati.getField("plgAttivita").getArrayDescrizione());
                        }

                        tabella.riga.colonna.campo.creaLabel("", "note ");
                        tabella.riga.colonna.campo.setDatiContainer(super.db_dati);
                        tabella.riga.colonna.campo.setNome("txtNote" + this.fStr.verifica_dato(rs.getInt("IDEN_ATTIVITA"), rs.wasNull()));
                        tabella.riga.colonna.campo.creaFieldTXT();
                        tabella.riga.colonna.creaColonnaTD();

                        tabella.aggiungiRiga();
                    }
                }
            }
        }
        catch(SQLException ex)
        {
            ex.printStackTrace();
        }
        catch(SecurityException ex)
        {
            ex.printStackTrace();
        }
        catch(SqlQueryException ex)
        {
            ex.printStackTrace();
        }
        finally
        {
            try
            {
                this.fDB.close(rs);
            }
            catch(SQLException ex)
            {
                ex.printStackTrace();
            }

            try
            {
                //this.fDB.close_connection_my();
            	Utils.closeTemporaryConnection(fDB.getConnectMy());
            }
            catch(Exception ex)
            {
            	ex.printStackTrace();
            }
        }

        // Parte di "default"
    /*    tabella.riga.colonna.campo.setDatiContainer(super.db_dati);
        tabella.riga.colonna.campo.creaFieldCHECKBOX("chkInfermieristica");
        tabella.riga.colonna.campo.creaLabel("lblInfermieristica", "Dai dati raccolti non emerge un bisogno di assistenza infermieristica");
        tabella.riga.colonna.creaColonnaTD();
        tabella.aggiungiRiga();*/

        tabella.draw_table();
    }
}
