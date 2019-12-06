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
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cartellaclinica.gestioneAppuntamenti.components;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.scopes.Esami.DecodeIdenAnagIdenPro;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author francescog
 */
public class ComponentFactory {

    public static Table makeTableRicovero(StatementFromFile sff, String iden_ricovero, String iden_prericovero, String da_data, String a_data) throws Exception {
        Table table = new Table();
        ResultSet rs;

        rs = sff.executeQuery("AccessiAppuntamenti.xml", "getRiepilogoRicoveroWhale", new String[]{iden_ricovero, iden_prericovero, da_data, a_data});

        while (rs.next()) {
            table.addRow(makeRow(rs));
        }

        rs = sff.executeQuery("AccessiAppuntamenti.xml", "getRiepilogoRicoveroAmbulatorio", new String[]{iden_ricovero, iden_prericovero, da_data, a_data});

        while (rs.next()) {
            table.addRow(makeRow(rs));
        }

        table.sortRows();

        return table;
    }

    public static Table makeTableAnagReparto(StatementFromFile sff, String iden_anag, String cod_cdc, String da_data, String a_data) throws Throwable {
        Table table = new Table();
        ResultSet rs;

        rs = sff.executeQuery("AccessiAppuntamenti.xml", "getRiepilogoAnagRepartoWhale", new String[]{iden_anag, cod_cdc, da_data, a_data});

        while (rs.next()) {
            table.addRow(makeRow(rs));
        }

        String iden_anag_ambulatorio = DecodeIdenAnagIdenPro.execute(sff,iden_anag,cod_cdc).getIdRis();

        rs = sff.executeQuery("AccessiAppuntamenti.xml", "getRiepilogoAnagRepartoAmbulatorio", new String[]{iden_anag_ambulatorio, cod_cdc, da_data, a_data});

        while (rs.next()) {
            table.addRow(makeRow(rs));
        }

        table.sortRows();

        return table;
    }

    public static Row makeSingleRow(StatementFromFile sff, String iden_ricovero, String iden_prericovero, String data) throws SQLException, Exception{
        Row row = null;
        
        ResultSet rs;

        rs = sff.executeQuery("AccessiAppuntamenti.xml", "getRiepilogoRicoveroWhale", new String[]{iden_ricovero, iden_prericovero, data, data});

        if (rs.next()) {
            row= makeRow(rs);
        }

        rs = sff.executeQuery("AccessiAppuntamenti.xml", "getRiepilogoRicoveroAmbulatorio", new String[]{iden_ricovero, iden_prericovero, data, data});

        if (rs.next()) {
            if(row == null){
                row = makeRow(rs);
            }else{
                row.mergeWith(makeRow(rs));
            }
        }        
        
        return row == null ? new Row() : row;
    }
    
    public static Row makeRow(ResultSet rs) throws SQLException {
        Row row = new Row();
        ResultSet rs_dato;

        row.setData(rs.getString("DATA"));
        row.setOra(rs.getString("ORA"));
        row.setAppuntamento(rs.getString("APPUNTAMENTO"));
        row.setAccesso(rs.getString("ACCESSO"));
        row.setNoteAppuntamento(rs.getString("NOTE_APPUNTAMENTO"));
        row.setDimesso(rs.getString("DIMESSO"));
        row.setIdenRicovero(rs.getString("IDEN_RICOVERO"));
        row.setGiorno_dimissione(rs.getString("GIORNO_DIMISSIONE"));

        setItems(row, rs, "RICHIESTE");
        
        setItems(row, rs, "CONSULENZE");
                
        setItems(row, rs, "ESAMI");        

        setItems(row, rs, "TERAPIE");               

        setItems(row, rs, "PRENOTAZIONI");

        setItems(row, rs, "PROCEDURE_TERAPEUTICHE");        

        setItems(row, rs, "LETTERE");

        rs_dato = (ResultSet) rs.getObject("DIARI");
        while (rs_dato.next()) {
            row.addDiario(rs_dato.getString("TIPOLOGIA"), makeNotaDiario(rs_dato));
        }
        rs_dato.close();


        return row;
    }

    private static void setItems(Row row, ResultSet rs, String key) throws SQLException{
         ResultSet rs_dato = (ResultSet) rs.getObject(key);
        while (rs_dato.next()) {
            row.addItem(key, makeItem(rs_dato));
        }
        rs_dato.close();
    }
    
    private static Item makeItem(ResultSet rs) throws SQLException {
        Item column = new Item();

        column.setLocked(rs.getString("LOCKED"));
        column.setStato(rs.getString("STATO"));
        column.setIden(rs.getString("IDEN"));
        column.setDescrizione(rs.getString("DESCRIZIONE"));
        column.setUrgenza(rs.getString("URGENZA"));
        column.setTipo(rs.getString("TIPO"));
        column.setNota(rs.getString("NOTA"));
        column.setClasseButton(rs.getString("CLASSE_BUTTON"));
        column.setTitleButton(rs.getString("TITLE_BUTTON"));

//        ResultSet rs_dettagli = (ResultSet) rs.getObject("DETTAGLI");
//        while (rs_dettagli.next()) {
//            column.addDettaglio(rs_dettagli.getString(1));
//        }
//        rs_dettagli.close();


        return column;
    }

    public static NotaDiario makeNotaDiario(ResultSet rs) throws SQLException {
        NotaDiario nota = new NotaDiario();

        nota.setUtente(rs.getString("UTENTE"));
        nota.setOra(rs.getString("ORA_EVENTO"));
        nota.setTesto(rs.getString("TESTO"));

        return nota;
    }
}
