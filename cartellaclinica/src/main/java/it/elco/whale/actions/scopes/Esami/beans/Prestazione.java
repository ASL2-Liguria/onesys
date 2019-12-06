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

import java.util.HashMap;

/**
 *
 * @author francescog
 */
public class Prestazione {
    
    private String cod_prest,data_app,ora_app,cod_area;
    private HashMap<String,String> identificativi_esterni;

    public Prestazione(){
        identificativi_esterni = new HashMap<String, String>();
    }

    public String getCodPrest() {
        return cod_prest;
    }

    public void setCodPrest(String cod_prest) {
        this.cod_prest = cod_prest;
    }

    public String getDataApp() {
        return data_app;
    }

    public void setDataApp(String data_app) {
        this.data_app = data_app;
    }

    public String getOraApp() {
        return ora_app;
    }

    public void setOraApp(String ora_app) {
        this.ora_app = ora_app;
    }

    public String getCodArea() {
        return cod_area;
    }

    public void setCodArea(String cod_area) {
        this.cod_area = cod_area;
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
}
