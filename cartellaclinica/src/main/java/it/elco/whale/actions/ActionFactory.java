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
package it.elco.whale.actions;

import it.elco.whale.actions.scopes.Index;
import it.elco.whale.converters.TypeChecker;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

/**
 *
 * @author francescog
 */
public class ActionFactory {
    
    public static ActionResponse executeAction(String scope,String key,Map<String,Object> parameters) throws ClassNotFoundException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, Exception, Throwable{
        
        Class<ActionInterface> action_class = getActionClass(scope, key);       
        
        ActionInterface action = action_class.newInstance();
        
        Iterator<String> it = parameters.keySet().iterator();
        while(it.hasNext()){
            
            String keyParameter = it.next();           
            
            Method setter = AnnotationFinder.getSetter(action.getClass(), keyParameter);
            
            if (setter != null){
                
                Class[] types = setter.getParameterTypes();
                if(types.length != 1){
                    throw new RuntimeException("Il metodo \"setter\" annotato presenta un numero di parametri differenti da quello atteso: 1");
                }
                
                Object value = parameters.get(keyParameter);
                
                value = TypeChecker.cast(value, types[0]);
                          
                setter.invoke(action, value);               
            }
            
        }
                 
        action.checkFileds();
        
        if((Boolean) parameters.get(Action.synchronizedExecution)){
            return action.executeSynchronized();
        }else{
            return action.execute();
        }
    }
    
    public static ActionResponse executeAction(String scope, String key,ActionParameter... parameters) throws ClassNotFoundException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, Exception, Throwable{
        
        HashMap<String,Object> parameters_map = new HashMap<String, Object>();
       
        for(ActionParameter parameter : parameters){
            parameters_map.put(parameter.getKey(), parameter.getValue());
        }
        
        return executeAction(scope, key, parameters_map);
    }

    private static Class getActionClass(String scope, String key) throws ClassNotFoundException, IllegalArgumentException, IllegalAccessException {

        String pck = null;
        String cls = null;

        for (Field field : Index.class.getFields()) {
            if (field.getName().equals(scope)) {
                pck = (String) field.get(null);
            }
        }

        if (pck == null) {
            throw new ClassNotFoundException("Actions package non trovato per lo scope '" + scope + "'");
        }

        for (Field field : Class.forName(pck + ".Index").getFields()) {
            if (field.getName().equals(key)) {
                cls = (String) field.get(null);
            }
        }

        if (cls == null) {
            throw new ClassNotFoundException("Actions class non trovata per la key '" + key + "'");
        }

        return Class.forName(pck + "." + cls);

    }

}