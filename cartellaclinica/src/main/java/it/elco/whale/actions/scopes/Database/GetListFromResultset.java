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
package it.elco.whale.actions.scopes.Database;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.privacy.predicates.PredicateFactory;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;

/**
 *
 * @author francescog
 */
public class GetListFromResultset extends Action {

    public GetListFromResultset(){
        super();
        parameters = new ArrayList<String>();
    }
    
    public class GetListFromResultsetResponse extends ActionResponse {

        private GetListFromResultsetResponse(List<Map> records) {
            super(new ActionParameter("records", records));
        }

        public List<Map> getRecords() throws Throwable {
            return (List<Map>) this.getOutParameter("records");
        }
    }
    
    @NotNull
    private StatementFromFile sff;
    @NotNull
    private String file_name, statement_name;
    private List<String> parameters;
    
    //proprietà per la gestione dei predicati
    private String predicateFactoryClass;
    private Map<String, Object> predicateFactoryParameters;    
    
    @Setter(key = "sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key = "file_name")
    public void setFileName(String name) {
        this.file_name = name;
    }

    @Setter(key = "statement_name")
    public void setStatementName(String name) {
        this.statement_name = name;
    }
    
    @Setter(key = "parameters")
    public void setParameters(List<String> parameters){
        this.parameters = parameters;
    }
    
    //
    @Setter(key = "predicateFactoryClass")
    public void setPredicateFactoryClass(String predicateFactoryClass){
        this.predicateFactoryClass = predicateFactoryClass;
    }  
    
    @Setter(key="predicateFactoryParameters")
    public void setPredicateFactoryParameters(Map<String, Object> predicateFactoryParameters){
        this.predicateFactoryParameters = predicateFactoryParameters;
    } 
    
    @Override
    public GetListFromResultsetResponse execute() throws Throwable {

        ResultSet rs = this.sff.executeQuery(file_name, statement_name, parameters.toArray(new String[parameters.size()]));

        ArrayList<Map> list = new ArrayList<Map>();

        ResultSetMetaData rsmd = rs.getMetaData();

        while (rs.next()) {
            HashMap<String, Object> record = new HashMap<String, Object>();

            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                switch (rsmd.getColumnType(i)) {

                    case Types.INTEGER: {
                        record.put(rsmd.getColumnLabel(i), rs.getInt(rsmd.getColumnLabel(i)));
                        break;
                    }
                    case Types.DATE:
                        throw new UnsupportedOperationException("Not implemented yet");                       
                    case Types.VARCHAR:
                    default:
                        record.put(rsmd.getColumnLabel(i), rs.getString(rsmd.getColumnLabel(i)));
                        break;
                }

            }

            list.add(record);
            
        }       
        this.sff.close();        
        
        if(!"".equalsIgnoreCase(predicateFactoryClass) && predicateFactoryClass != null ){
            PredicateFactory predicateFactory = (PredicateFactory) Class.forName(predicateFactoryClass).newInstance();        
            list = Lists.newArrayList(Iterables.filter(list, predicateFactory.getPredicate(predicateFactoryParameters)));
        }
        
        return new GetListFromResultsetResponse(list);
    }

    public static GetListFromResultsetResponse execute(StatementFromFile sff, String file_name, String statement_name, String[] parameters) throws Throwable{        
        return execute(sff, file_name, statement_name, Arrays.asList(parameters));        
    }
    
    public static GetListFromResultsetResponse execute(StatementFromFile sff, String file_name, String statement_name, List<String> parameters) throws Throwable{
        
        GetListFromResultset parser = new GetListFromResultset();
        
        parser.setStatementFromFile(sff);
        parser.setFileName(file_name);
        parser.setStatementName(statement_name);
        parser.setParameters(parameters);
        
        return parser.execute();
        
    }    
    
}
