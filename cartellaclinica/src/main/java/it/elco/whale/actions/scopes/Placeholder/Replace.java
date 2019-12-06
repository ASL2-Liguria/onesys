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
package it.elco.whale.actions.scopes.Placeholder;

import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author francescog
 */
public class Replace extends Action {

    public class ReplaceResponse extends ActionResponse {

        private ReplaceResponse(StringBuffer sb) {
            this.setOutParameter(new ActionParameter("output", sb.toString()));;
        }

        public String getString() {
            return this.getOutParameterString("output");
        }
    }

    public Replace() {
        super();
    }

    private final Pattern pattern = Pattern.compile("\\$\\{([a-zA-Z_0-9.\\[\\]]*)\\}");

    @NotNull
    private String source;

    @NotNull
    private Map<String, Object> data;

    @Setter(key = "source")
    public void setSource(String source) {
        this.source = source;
    }

    @Setter(key = "data")
    public void setData(Map<String, Object> data) {
        this.data = data;
    }
    
    @Override
    public ReplaceResponse execute() throws Throwable {

        StringBuffer sb = new StringBuffer();

        Matcher matcher = pattern.matcher(source);

        while (matcher.find()) {

            Map map = data;

            String reg = matcher.group(1);
            //reg = reg.substring(0, reg.length() - 1).substring(2);
            String[] keys = reg.split("[.]");

            for (int i = 0; i < keys.length; i++) {

                String key = keys[i];

                Matcher matcher_index = Pattern.compile("^([\\w]*)\\[([\\d]*)\\]$").matcher(key);

                if (matcher_index.find()) {

                    key = matcher_index.group(1);
                    int index = Integer.valueOf(matcher_index.group(2));
                                        
                    List list = (List) map.get(key);

                    if (i == keys.length - 1) {                                               
                        
                        String value = parseObject(list.get(index));  ;                                                
                        matcher.appendReplacement(sb, Matcher.quoteReplacement(value == null ? "" : value));
                        
                    } else {
                        
                        map = (Map<String, Object>) list.get(index);
                   
                    }

                } else {

                    if (i == keys.length - 1) {        
                        
                        String value = parseObject(map.get(key));                                                              
                        matcher.appendReplacement(sb, Matcher.quoteReplacement(value == null ? "" : value));
                   
                    } else {                       
                    
                        map = (Map<String, Object>) map.get(key);
                    
                    }
                }

            }

        }

        matcher.appendTail(sb);

        return new ReplaceResponse(sb);
    }
    
    private String parseObject(Object object){
            if(object.getClass().isAssignableFrom(String.class)){
                    return (String)  object ;
            }else if(object.getClass().isAssignableFrom(Integer.class)){
                    return  String.valueOf((Integer) object);
            }else if(object.getClass().isAssignableFrom(Boolean.class)){
                    return  String.valueOf((Boolean) object);
            }else{
                return null;
            }         
    }

    public static ReplaceResponse execute(String source, Map<String, Object> data) throws Throwable {

        Replace replacer = new Replace();

        replacer.setSource(source);
        replacer.setData(data);

        return replacer.execute();

    }

}
