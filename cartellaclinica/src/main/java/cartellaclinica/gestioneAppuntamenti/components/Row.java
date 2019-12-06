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

import org.apache.commons.lang3.StringEscapeUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;


public class Row implements Comparable<Row> {

    private String data, ora, appuntamento, accesso, note_appuntamento, iden_ricovero, dimesso, giorno_dimissione;
    private HashMap<String/*tipo_diario*/, ArrayList<NotaDiario>> diari;
    private HashMap<String,ArrayList<Item>> sections;

    public Row() {
        diari = new HashMap<String, ArrayList<NotaDiario>>();
        sections = new HashMap<String,ArrayList<Item>>();
    }

    public void addItem(String key,Item item){
        if(sections.containsKey(key) == false){
            sections.put(key, new ArrayList<Item>());
        }
        sections.get(key).add(item);
    }

    public void addDiario(String tipo, NotaDiario nota_diario) {
        if (!this.diari.containsKey(tipo)) {
            this.diari.put(tipo, new ArrayList<NotaDiario>());
        }

        this.diari.get(tipo).add(nota_diario);
    }

    public String getData() {
        return chkNull(data);
    }

    public String getOra() {
        return chkNull(ora);
    }

    private String getAppuntamento() {
        return chkNull(appuntamento);
    }

    private String getAccesso() {
        return chkNull(accesso);
    }

    private String getNoteAppuntamento() {
        return chkNull(note_appuntamento);
    }

    private String getIdenRicovero(){
        return  this.iden_ricovero;
    }

    private String getDimesso(){
        return this.dimesso;
    }

    private String chkNull(String in) {
        return in == null ? "" : in;
    }

    @Override
    public int compareTo(Row compareObject) {

        int dataToCompare = Integer.valueOf(getData());
        int dataCompare = Integer.valueOf(compareObject.getData());

        if (dataToCompare < dataCompare) {
            return 1;
        } else if (dataToCompare == dataCompare) {
            return 0;
        } else {
            return -1;
        }
    }

    public String toHtml(ArrayList<ColumnHeader> colonne) throws IllegalAccessException, IllegalArgumentException, IllegalArgumentException, InvocationTargetException {
        StringBuilder row = new StringBuilder();
         
        if (this.getGiorno_dimissione().equals("S")){
            row.append("<div class=\"Riga tDetail giornodimissione\"");
        }    else{
            row.append("<div class=\"Riga tDetail\"");
        }
        row.append("data=\"").append(this.getData()).append("\" ");
        row.append("ora=\"").append(this.getOra()).append("\" ");
        row.append("note=\"").append(this.getNoteAppuntamento()).append("\" ");
        row.append("iden_accesso=\"").append(this.getAccesso() == null?"":this.getAccesso()).append("\" ");
        row.append("iden_appuntamento=\"").append(this.getAppuntamento() == null ?"":this.getAppuntamento()).append("\"");
        row.append("iden_ricovero=\"").append(this.getIdenRicovero() == null ?"":this.getIdenRicovero()).append("\"");
        row.append("dimesso=\"").append(this.getDimesso()).append("\"");

        row.append(">");


        for (int i = 0; i < colonne.size(); i++) {

            ColumnHeader column = colonne.get(i);

            switch (TipologiaColonna.getEnum(column.getScope())) {
                case DATA:
                    row.append(getColumnData());
                    break;
                case ORA:
                    row.append(getColumnOra());
                    break;
                case INFO:
                    row.append(getColumnInfo());
                    break;
                case ACCESSO:
                    row.append(getColumnAccesso());
                    break;
                case APPUNTAMENTO:
                    row.append(getColumnAppuntamento());
                    break;
                case NOTE_APPUNTAMENTO:
                    row.append(getColumnNoteAppuntamento());
                    break;
                case GENERICA:
                    row.append(getColumn(column));
                    break;
            }

        }
        row.append(getHtmlDiari());

        row.append("</div>");
        return row.toString();
    }

    public void mergeWith(Row row){

        Iterator<String> it = row.sections.keySet().iterator();
        while(it.hasNext()){

            String key = it.next();

            for(Item item : row.sections.get(key)){
                if(this.sections.containsKey(key) == false){
                    this.sections.put(key, new ArrayList<Item>());
                }
                this.sections.get(key).add(item);
            }

        }

    }

    private StringBuilder getHtmlDiari() {

        StringBuilder sb = new StringBuilder();

        if (diari.isEmpty() == false) {
            sb.append("<div class=\"RowDiari\">");

            if (diari.containsKey("MEDICO")) {
                sb.append("<div class=\"DiarioMedico\">").append(getHtmlDiari("MEDICO")).append("</div>");
            }

            if (diari.containsKey("INFERMIERE")) {
                sb.append("<div class=\"DiarioInfermiere\">").append(getHtmlDiari("INFERMIERE")).append("</div>");
            }

            sb.append("</div>");
        }
        return sb;
    }

    private StringBuilder getHtmlDiari(String tipo) {
        StringBuilder sb = new StringBuilder();
        ArrayList<NotaDiario> testi = diari.get(tipo);
        for (int i = 0; i < testi.size(); i++) {
            String s = StringEscapeUtils.escapeXml((testi.get(i)).getTesto());
            sb.append("<div class=\"NotaDiario\">");
            sb.append("<div class=\"Header\">").append((testi.get(i)).getOra()).append(" - ").append((testi.get(i)).getUtente()).append("</div>");
            sb.append("<div class=\"Data\">").append(s).append("</div>");
            sb.append("</div>");
        }
        return sb;
    }

    private String getColumnAccesso() {
        return "<div class=\"Accesso " + (this.getAccesso().equals("") ? "" : "ATTIVO") + "\">&nbsp;</div>";
    }

    private String getColumnAppuntamento() {
        return "<div class=\"Appuntamento " + (this.getAppuntamento().equals("") ? "" : "ATTIVO") + "\">&nbsp;</div>";
    }
    private String getColumnInfo() {
        return "<div class=\"Info " + (this.getAppuntamento().equals("") ? "" : "ATTIVO") + "\">&nbsp;</div>";
    }


    private String getColumnData() {
        return "<div class=\"Data\">" + ConvertDate(this.getData()) + "</div>";
    }

    private String getColumnOra() {
        return "<div class=\"Ora\">" + (this.getOra().equals("") ? "&nbsp;" : this.getOra()) + "</div>";
    }

    private String getColumnNoteAppuntamento() {
        return "<div class=\"NoteAppuntamento\">" + (this.getNoteAppuntamento().equals("") ? "&nbsp;" : this.getNoteAppuntamento()) + "</div>";
    }

    public HashMap<String, ArrayList<NotaDiario>> getDiari() {
        return diari;
    }

    public HashMap<String, ArrayList<Item>> getSections() {
        return sections;
    }

    private StringBuilder getColumn(ColumnHeader column) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        StringBuilder sb = new StringBuilder();

        sb.append("<div class=\"Droppable\" title=\"").append(column.getScope()).append("\" style=\"width:").append(column.getWidth()).append(";\">");
        sb.append("<a>").append(column.getLabel()).append("</a>");
        sb.append("<ul>");

        String key;

        Iterator<String> it = column.getCampi().keySet().iterator();

        while (it.hasNext()) {
            key = it.next();

            ArrayList<Item> items = sections.get(key);
            if(items != null){
                for(Item item : items){
                    sb.append(item.toHtml());
                }
            }

        }

        sb.append("</ul>");
        sb.append("</div>");

        return sb;
    }

    private String ConvertDate(String in) {
        if (in == null || in.equals("")) {
            return "";
        } else {
            return in.substring(6, 8) + "/" + in.substring(4, 6) + "/" + in.substring(0, 4);
        }
    }

    public void setData(String data) {
        this.data = data;
    }

    public void setOra(String ora) {
        this.ora = ora;
    }

    public void setAppuntamento(String appuntamento) {
        this.appuntamento = appuntamento;
    }

    public void setAccesso(String accesso) {
        this.accesso = accesso;
    }

    public void setNoteAppuntamento(String note_appuntamento) {
        this.note_appuntamento = note_appuntamento;
    }

    public void setIdenRicovero(String iden_ricovero){
        this.iden_ricovero = iden_ricovero;
    }

    public void setDimesso(String dimesso){
        this.dimesso = dimesso;
    }

    public String getGiorno_dimissione() {
        return giorno_dimissione;
    }

    public void setGiorno_dimissione(String giorno_dimissione) {
        this.giorno_dimissione = giorno_dimissione;
    }
}