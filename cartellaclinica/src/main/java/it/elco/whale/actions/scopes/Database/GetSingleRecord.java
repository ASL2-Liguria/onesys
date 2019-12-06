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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author francescog
 */
public class GetSingleRecord extends Action {

    public GetSingleRecord(){
        super();
        this.parameters = new ArrayList<String>();
    }
    
    public class GetSingleRecordResponse extends ActionResponse {

        private GetSingleRecordResponse(Map record) {
            super(new ActionParameter("record", record));
        }

        public Map getRecord() throws Throwable {
            return (Map) this.getOutParameter("record");
        }
    }
    
    @NotNull
    private StatementFromFile sff;
    @NotNull
    private String file_name, statement_name;
    private List<String> parameters;

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

    @Override
    public GetSingleRecordResponse execute() throws Throwable { 
        GetListFromResultset.GetListFromResultsetResponse response = GetListFromResultset.execute(sff, file_name, statement_name,parameters.toArray(new String[parameters.size()]));        
        return new GetSingleRecordResponse(response.getRecords().get(0));
    }

    public static GetSingleRecordResponse execute(StatementFromFile sff, String file_name, String statement_name, List<String> parameters) throws Throwable{
        
        GetSingleRecord parser = new GetSingleRecord();
        
        parser.setStatementFromFile(sff);
        parser.setFileName(file_name);
        parser.setStatementName(statement_name);
        parser.setParameters(parameters);
        
        return parser.execute();
        
    }
    
}
