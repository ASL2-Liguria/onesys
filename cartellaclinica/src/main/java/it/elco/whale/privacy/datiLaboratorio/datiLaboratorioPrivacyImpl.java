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
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.elco.whale.privacy.datiLaboratorio;


import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import it.elco.whale.privacy.predicates.PredicateFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.jdom.Element;

/**
 *
 * @author linob
 */
public class datiLaboratorioPrivacyImpl implements datiLaboratorioPrivacy{  
    private Map<String,Object> parameter;

    
    public datiLaboratorioPrivacyImpl( Map<String,Object> parameter )
    {     
        this.parameter = parameter;
    }   
    

    public ArrayList<Map> gestionePrivacy(Iterator pIterator){
        Iterator vIterator = null;
        ArrayList<Map> filteredList = null;
        ArrayList<Map> unfilteredList   = new ArrayList<Map>();
  
        PredicateFactory predicateFactory = null;        
        
        try {
            predicateFactory = (PredicateFactory) Class.forName((String) parameter.get("predicateClass")).newInstance();
        } catch (InstantiationException ex) {
            Logger.getLogger(datiLaboratorioPrivacyImpl.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            Logger.getLogger(datiLaboratorioPrivacyImpl.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(datiLaboratorioPrivacyImpl.class.getName()).log(Level.SEVERE, null, ex);
        }

        while(pIterator.hasNext()){
            Map<String,Object> map = new HashMap<String,Object>();
            Element item    = (Element) pIterator.next();
            /*Gestione Richiesta*/
            map.put(item.getAttribute("IDEN").getName(),(Object) item.getAttributeValue("IDEN"));            
            map.put(item.getAttribute("ID_RICHIESTA_ESTERNO").getName(),(Object) item.getAttributeValue("ID_RICHIESTA_ESTERNO"));  
            map.put(item.getAttribute("INT_EST").getName(),(Object) item.getAttributeValue("INT_EST"));
            map.put(item.getAttribute("STRIDRICHIESTA").getName(),(Object) item.getAttributeValue("STRIDRICHIESTA"));
            map.put(item.getAttribute("DATA").getName(),(Object) item.getAttributeValue("DATA"));
            map.put(item.getAttribute("ORA").getName(),(Object) item.getAttributeValue("ORA"));
            map.put(item.getAttribute("TIPO").getName(),(Object) item.getAttributeValue("TIPO"));
            map.put(item.getAttribute("COD_CDC").getName(),(Object) item.getAttributeValue("COD_CDC"));
            map.put(item.getAttribute("NOTE").getName(),(Object) item.getAttributeValue("NOTE"));
            map.put(item.getAttribute("DESCR_CDC").getName(),(Object) item.getAttributeValue("DESCR_CDC"));
            map.put(item.getAttribute("NUM_NOSOLOGICO").getName(),(Object) item.getAttributeValue("NUM_NOSOLOGICO"));
            map.put(item.getAttribute("DATA_INIZIO_EVENTO").getName(),(Object) item.getAttributeValue("DATA_INIZIO_EVENTO"));
            map.put(item.getAttribute("REPARTO_AMMETTENTE").getName(),(Object) item.getAttributeValue("REPARTO_AMMETTENTE"));
            map.put(item.getAttribute("PATTERN").getName(),(Object) item.getAttributeValue("PATTERN"));            
            unfilteredList.add(map);        
        }

        try {
            filteredList = Lists.newArrayList(Iterables.filter(unfilteredList, predicateFactory.getPredicate(parameter)));
        } catch (Exception ex) {
            Logger.getLogger(datiLaboratorioPrivacyImpl.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        vIterator = filteredList.iterator();

        return filteredList;
   
    }   

    @Override
    public Iterator creaIteratorFromXml() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public ArrayList<Map> gestionePrivacy() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}