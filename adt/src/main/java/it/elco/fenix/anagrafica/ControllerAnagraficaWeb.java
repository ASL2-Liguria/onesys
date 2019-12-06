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
package it.elco.fenix.anagrafica;

import it.elco.adt.ControllerAdtAbstract;
import it.elco.anagrafica.data.Anagrafica;
import it.elco.anagrafica.exceptions.AnagraficaException;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.contatti.exceptions.ContattiException;
import it.elco.core.data.RpcResponse;
import it.elco.fenix.adt.ControllerAdtWeb;
import it.elco.fenix.anagrafica.action.RpcAnagraficaAction;
import it.elco.json.Json;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.sql.DataSource;

import org.apache.http.client.utils.URIBuilder;

public class ControllerAnagraficaWeb extends ControllerAdtAbstract{

	public ControllerAnagraficaWeb() throws Throwable{        
        this( new Properties());
    }
    
    public ControllerAnagraficaWeb(Properties properties) throws Throwable {
        super(CaronteFactory.getFactory().createDataSource("ADT"), properties);

    }
   
    @Override
    public RpcResponse mergePatient(Anagrafica badPatient, Anagrafica goodPatient) throws AnagraficaException {               
        RpcResponse response = super.mergePatient(badPatient, goodPatient);
        try {
			invokeAccessors(badPatient, "mergePatient", Json.stringify(goodPatient), response);
		} catch (IOException e) {
			throw new AnagraficaException("Errore durante marshal anagrafica: " + e.getMessage());
		}
        return response;
    }
    
    private void invokeAccessors(Anagrafica anagrafica, String method, String body, RpcResponse response){
        Map<String, List<RpcAnagraficaAction>> accessors = CaronteFactory.getApplicationContext().getBean("controllerAnagrafica.accessors", Map.class);
        List<RpcAnagraficaAction> accessorList = accessors.containsKey(method) ? accessors.get(method) : accessors.get("default");
        /*
        try {
			URI uri = new URIBuilder()
			.setScheme("http")
			.setHost("")
			.setPort(8080)
			.setPath("" + "?" + "targetPatient=" + body)
			.addParameter("", "")
			.build();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		*/
        
        if (accessorList != null) {
        
            for(RpcAnagraficaAction action : accessorList){
                try {
                    action.setAnagrafica(anagrafica);
                    action.setMethod(method);
                    action.setBody(body);
                    
                    RpcResponse accessorResponse = action.execute();
                    if(!accessorResponse.isSuccess()){
                        response.setMessage(response.getMessage() + "\n" + accessorResponse.getMessage());
                    }
                } catch (ContattiException ex) {
                    Logger.getLogger(ControllerAdtWeb.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
                
        }
          
    }
}
