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

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import java.lang.reflect.Field;
/**
 *
 * @author francescog
 */
public abstract class Action implements ActionInterface{       
    
    public static final String synchronizedExecution = "synchronizedExecution";
    public static final String session = "session";
    public static final String sff = "sff";
    
    protected final transient ElcoLoggerInterface logger = new ElcoLoggerImpl(this.getClass());
    
    @Override
    public void checkFileds() throws IllegalAccessException{
        
        logger.debug("Check fields");
        
        for(Field field : AnnotationFinder.getNotNullFileds(this.getClass())){
                        
            field.setAccessible(true);
            
            if(field.get(this) == null){
                throw new NullPointerException(this.getClass().getName() + "  --> " + field.getName());
            }                        
            
        }
        
    } 
    
    @Override
    public synchronized <T extends ActionResponse> T executeSynchronized() throws Throwable{
        logger.debug("Synchronized execution");
        return this.execute();
    }
    
}
