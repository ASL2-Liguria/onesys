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
package plugin;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.crypto.CryptPasswordInterface;
import imago.http.classDivHtmlObject;
import imagoCreateWk.classTabJsArrayWk;
import imago_jack.imago_function.config.functionConfig;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;
import imago_jack.imago_function.wk.functionWK;

import java.sql.Connection;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import core.database.PoolFactory;

public class plgAttributeWkConnection extends baseAttributeEngine {
    private Connection otherConnection = null;
    private String otherConnectionPoolName = null;
    private classDivHtmlObject cDiv = null;
    private ServletContext contxt = null;
    private HttpServletRequest req = null;
    private functionObj fObj = null;
    private functionStr fStr = null;
    private functionDB fDB = null;
    private functionConfig fCfg = null;
    private String sTable = null;
    private String sNPagCur = null;
    private String sNRecPag = null;
    private String sRowOut = null;
    private String sRowIn = null;
    private String sWhere = null;
    private String sFunc = null;
    private String sFixed = null;
    private String sOrder = null;

    public plgAttributeWkConnection() {
        super();
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);

        this.sFixed = new String("S");
    }

    public Object get_attribute_engine() {
        super.set_generic(this.cDiv);

        return cDiv;
    }

    public void getValueContainer(String nome) {
    }

    public void init(ServletContext context, HttpServletRequest request) {
        this.cDiv = new classDivHtmlObject();
        this.contxt = context;
        this.req = request;
        this.fObj = new functionObj(this.contxt, this.req);
        this.fStr = new functionStr();
        this.fDB = new functionDB(this.fObj);
        this.fCfg = new functionConfig(this.fObj);
        this.sTable = new String("TIPO_WK");
        this.sNPagCur = new String("1");
        this.sNRecPag = new String("100000000");
        this.sRowOut = new String("javascript:rowSelect_out(this.sectionRowIndex);");
        this.sRowIn = new String("javascript:rowSelect_over(this.sectionRowIndex);");
        this.sWhere = new String("");
        this.sFunc = new String("javascript:illumina_multiplo(this.sectionRowIndex, array_iden_esami);");
        this.sOrder = new String("");
    }

    public void getWhereContainer(String campo) {
        this.sWhere = super.getDatiContainer().getField(campo).getValue();
    }

    public void setNumeroRecordPagina(String valore) {
        try {
            this.sNRecPag = String.valueOf(Integer.valueOf(valore.trim()));
        }
        catch(Exception ex) {
            this.sNRecPag = new String("100000000");
        }
    }

    public void setWhere(String where_wk) {
        if(!where_wk.trim().equals("")) {
            this.sWhere = new String(where_wk);
        }
    }

    public void setOnMouse(String mouse_over, String mouse_out) {
        this.sRowOut = new String(mouse_over);
        this.sRowIn = new String(mouse_out);
    }

    public void setFunctionWK(String func) {
        if(!func.equals("")) {
            this.sFunc = func;
        }
    }

    public void setFixedHeaderTable(String attivo) {
        this.sFixed = attivo;
    }

    public void setOrderField(String campo, String tipo_ordinamento) {
        this.sOrder = campo + " " + tipo_ordinamento;
    }

    public void setTableNameWK(String nome) {
        if(!nome.equals("")) {
            this.sTable = nome;
        }
    }

    public void draw(String tipo_wk) {
        this.draw(tipo_wk, "");
    }

    public void setOtherConnection(String poolName, String user, String pwdCriptata, String tipoCriptazione) throws Exception {
    	
    	Class classe = Class.forName(tipoCriptazione);
    	CryptPasswordInterface cpi = (CryptPasswordInterface) (classe.newInstance());
        String password = cpi.deCrypt(pwdCriptata.getBytes());
        this.otherConnectionPoolName = poolName;
    	this.otherConnection = PoolFactory.getConnection(poolName, user, password, this.fDB.hSessione);
    	
    	/*
        getPoolConnection pool = new getPoolConnection(poolName, user, pwdCriptata, tipoCriptazione);
        try {
            otherConnection = pool.getConnection();
        }
        catch(Exception e) {
            otherConnection.close();
        }*/
    }

    public void draw(String tipo_wk, String menu_wk) {
        functionWK fWK = null; //new functionWK(this.sFunc);
        classTabJsArrayWk JsWk = new classTabJsArrayWk(fObj.bUtente, tipo_wk);
        classDivHtmlObject divH = new classDivHtmlObject();
        Hashtable hDati = new Hashtable();
        Hashtable hHead = new Hashtable();
        Hashtable hJs = JsWk.getJsInfo();

        if(this.sWhere.equals("")) {
            this.sWhere = super.getSchemaDatiContainer().getContainer("REQUEST").getField("WHERE_WK").getValue().trim();
        }

        if(this.sWhere.equals("")) {
            this.sWhere = super.getDatiContainer().getField("WHERE_WK").getValue().trim();
        }

        if(!super.getSchemaDatiContainer().getContainer("REQUEST").getField("PAGINA_WK").getValue().equals("")) {
            try {
                this.sNPagCur = String.valueOf(Integer.valueOf(super.getSchemaDatiContainer().getContainer("REQUEST").getField("PAGINA_WK").getValue()));
            }
            catch(Exception ex) {
                this.sNPagCur = new String("1");
            }
        }

        if(this.sOrder.equals("")) {
            this.sOrder = super.getSchemaDatiContainer().getContainer("REQUEST").getField("ORDER_FIELD_CAMPO").getValue().trim();
        }

        try {
            fWK = new functionWK(fObj, this.sFunc, tipo_wk, this.sTable, "", "", "", hDati, hHead, hJs, true, "", "");
            fWK.setConnessioneDati(this.otherConnection, this.otherConnectionPoolName);
            fWK.setRecordPerPagina(Integer.valueOf(this.sNRecPag));
            fWK.setPaginazione(Integer.valueOf(this.sNPagCur));
            fWK.setIdTable("oTable");
            fWK.setWhereCondition(this.sWhere);
            
            if(!this.sOrder.equals("")){
                String[] ar = this.sOrder.split(" ");
                fWK.setManualOrderWk(ar[0],ar[1]);
            }

            if(!menu_wk.equals("")) {
                fWK.generaMenu(fObj.bUtente, menu_wk, fObj.hSessione);
            }

            if(!this.sOrder.equals("")) {
                fWK.setOrderCondition(this.sOrder);
            }

            fWK.creaCollectionCampi();

            divH.appendSome(fWK.creaTitoliTabellaDati());

            if(this.sFixed.equalsIgnoreCase("S")) {
                divH.addAttribute("id", "fixme");
            }

            this.cDiv.appendSome(divH.toString() + fWK.getTable("onContextMenu", "return MenuTxDx();",this.fDB.hSessione,this.req).toString());

            //super.uHTML.head.appendHead(fWK.getArrayJs());
            super.uHTML.append_last_element_body(fWK.getArrayJs());

            if(!menu_wk.equals("")) {
                super.uHTML.add_attribute("onContextMenu", "return MenuTxDx();");
                super.uHTML.pagina.appendForm(fWK.getMenu());
            }

            // Utilizzato per la paginazione!!!
            super.uHTML.append_element_body("\n<script>\n\tvar _TOTALE_RECORD_WK = '" + String.valueOf(fWK.getSizeMatrix()) + "';\n\tvar _RECORD_PER_PAGINA_WK = '" + String.valueOf(fWK.getNumRecordPerPagina()) + "';\n\ttry{parent.gestisci_pulsanti_direzione('" + String.valueOf(fWK.getNumPagineTotali()) + "', '" + this.sNPagCur + "');}catch(ex){}\n</script>\n");
           
            
        }
        catch(Exception ex) {
        	System.out.println(ex.getMessage());
            ex.printStackTrace();
        }finally{
        	try{
        		this.otherConnection.close();
        	} catch(Exception ex) {
                ex.printStackTrace();
            }
        	
        }

    }
}
