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
package it.elco.whale.actions.scopes.Esami.beans;

import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author francescog
 */
public class Richiesta {
    
    private String id_ris_paziente,tipo,occupa_slot,cod_urgenza,cod_prov;
    private HashMap<String,String> identificativi_esterni;
    private ArrayList<Prestazione> prestazioni;
    
    public Richiesta(){
        identificativi_esterni = new HashMap<String, String>();
        prestazioni = new ArrayList<Prestazione>();
    }

    public String getIdRisPaziente() {
        return id_ris_paziente;
    }

    public void setIdRisPaziente(String id_ris_paziente) {
        this.id_ris_paziente = id_ris_paziente;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getOccupaSlot() {
        return occupa_slot;
    }

    public void setOccupaSlot(String occupa_slot) {
        this.occupa_slot = occupa_slot;
    }

    public String getCodProv() {
        return cod_prov;
    }

    public void setCodProv(String cod_prov) {
        this.cod_prov = cod_prov;
    }    
    
    public String getCodUrgenza() {
        return cod_urgenza;
    }

    public void setCodUrgenza(String cod_urgenza) {
        this.cod_urgenza = cod_urgenza;
    }

    public HashMap<String,String> getIdentificiativiEsterni(){
        return identificativi_esterni;
    }
    
    public void setIdentificativoEsterno(String position,String value){
        identificativi_esterni.put(position, value);
    }
    
    public String getIdentificativoEsterno(String position){
        return identificativi_esterni.get(position);
    }
    
    public void setPrestazioni(ArrayList<Prestazione> prestazioni){
        this.prestazioni = prestazioni;
    }
    
    public ArrayList<Prestazione> getPrestazioni(){
        return prestazioni;
    }
    
    public void addPrestazione(Prestazione prestazione){
        prestazioni.add(prestazione);
    }
}
