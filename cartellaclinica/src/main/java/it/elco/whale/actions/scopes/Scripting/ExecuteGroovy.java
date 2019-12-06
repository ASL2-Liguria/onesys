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
package it.elco.whale.actions.scopes.Scripting;

import core.Global;
import groovy.lang.Binding;
import groovy.util.GroovyScriptEngine;
import groovy.util.ResourceException;
import groovy.util.ScriptException;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 *
 * @author
 * francescog
 */
public class ExecuteGroovy extends Action {

    public ExecuteGroovy() {
        this.parameters = new HashMap<String, Object>();
    }
    @NotNull
    String path;
    Map<String, Object> parameters;

    @Setter(key = "path")
    public void setPath(String path) {
        this.path = path;
    }

    @Setter(key = "parameters")
    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }

    @Override
    public ActionResponse execute() throws ScriptException {
        try {
            GroovyScriptEngine gse = new GroovyScriptEngine(Global.context.getRealPath(".") + "/WEB-INF/script/");
            
            Binding binding = new Binding();
            
            Iterator<String> it = this.parameters.keySet().iterator();
            while (it.hasNext()) {
                String key = it.next();
                binding.setVariable(key, parameters.get(key));
            }
            
            gse.createScript(this.path, binding).run();
            
            Map<String, Object> variables = binding.getVariables();
            
            ActionResponse response = new ActionResponse(true);
            
            it = variables.keySet().iterator();
            while (it.hasNext()) {
                String key = it.next();
                response.setOutParameter(new ActionParameter(key, variables.get(key)));
            }
            
            return response;
        } catch (IOException ex) {
            throw new ScriptException(ex);
        } catch (ResourceException ex) {
            throw new ScriptException(ex);
        }

    }

    public static ActionResponse execute(String path, Map<String, Object> parameters) throws ScriptException{
        ExecuteGroovy action = new ExecuteGroovy();
        action.setPath(path);
        action.setParameters(parameters);
        return action.execute();
    }

    public static ActionResponse execute(String path) throws ScriptException{
        return execute(path, new HashMap<String, Object>());
    }
}
