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

import java.util.ArrayList;

/**
 *
 * @author francescog
 */
public class Item {

    private String locked, stato, descrizione, tipo, nota, classe_button, title_button, iden, urgenza;
    private ArrayList<String> dettagli;

    public Item() {
        dettagli = new ArrayList<String>();
    }

    public void addDettaglio(String dettaglio){
        dettagli.add(dettaglio);
    }
    
    public String getLocked() {
        return locked;
    }

    public void setLocked(String locked) {
        this.locked = locked;
    }

    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public String getClasseButton() {
        return classe_button;
    }

    public void setClasseButton(String classe_button) {
        this.classe_button = classe_button;
    }

    public String getTitleButton() {
        return title_button;
    }

    public void setTitleButton(String title_button) {
        this.title_button = title_button;
    }

    public String getIden() {
        return iden;
    }

    public void setIden(String iden) {
        this.iden = iden;
    }

    public String getUrgenza() {
        return urgenza;
    }

    public void setUrgenza(String urgenza) {
        this.urgenza = urgenza;
    }
    
public String decodeUrgenza() {

        if (this.getUrgenza() == null) {
            return "";
        }
        
        switch (Integer.valueOf(getUrgenza())) {
            case 0:
                return"NonUrgente";                    
            case 1:
                return"UrgenzaDifferita";    
            case 2:
                return"Urgente";                
            case 3:
                return "Emergenza";
            default:
                return "";
        }
    }    
    
public StringBuilder toHtml() {
        StringBuilder sb = new StringBuilder();

        sb.append("<li ");
        sb.append(" locked=\"").append(this.getLocked()).append("\"");
        sb.append(" id=\"").append(this.getIden()).append("\"");
        sb.append(" stato=\"").append(this.getStato()).append("\"");
        sb.append(" tipo=\"").append(this.getTipo()).append("\"");
        sb.append(">");

        if (chkNull(this.getUrgenza()).equals("") == false) {
            sb.append("<div class=\"Urgenza ").append(this.decodeUrgenza()).append("\">&nbsp;</div>");
        }
             
        if(chkNull(this.getClasseButton()).equals("") == false){
            sb.append("<span class=\"").append(this.getClasseButton()).append("\" title=\"").append(chkNull(this.getTitleButton())).append("\"></span>");
        }
        
        sb.append("<a>").append(this.getDescrizione().equals("") ? "&nbsp;" : this.getDescrizione()).append("</a>");
        
        if(chkNull(this.getNota()).equals("") == false){
            sb.append("<div>").append(this.getNota()).append("</div>");
        }
        
        sb.append("<ul>");
        for (String dettaglio : this.dettagli) {
            sb.append("<li>").append(dettaglio).append("</li>");
        }
        sb.append("</ul>");

        sb.append("</li>");

        return sb;
    }   

    private String chkNull(String in){
        return in == null ? "" : in;
    }
}
