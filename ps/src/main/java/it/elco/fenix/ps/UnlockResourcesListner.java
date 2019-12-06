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
package it.elco.fenix.ps;

import it.elco.baseObj.factory.baseFactory;
import it.elco.baseObj.iBase.iBasePC;
import it.elco.baseObj.iBase.iBaseUser;
import it.elco.caronte.call.impl.iCallProcedureFunction;
import it.elco.caronte.factory.utils.CaronteFactory;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * Utilizzata per liberare le risorse bloccate dall'utente durante l'utilizzo dell'applicativo.
 * Nello specifico:
 *   - cartelle di PS bloccate
 * 
 * @author francesco.genta
 */
@WebListener
public class UnlockResourcesListner implements HttpSessionListener{
    
    private final String DATASOURCE = "POLARIS_DATI";
    private final String UNLOCK_PROCEDURE = "PKG_ROWS_LOCK.DO_UNLOCK_ALL";
    
    private static final transient Logger logger = LoggerFactory.getLogger(UnlockResourcesListner.class);
    
    @Override
    public void sessionCreated(HttpSessionEvent hse) {
        unlockCartelle(hse.getSession());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent hse) {
        unlockCartelle(hse.getSession());        
    }
    
    private void unlockCartelle(HttpSession session){
        iBaseUser baseUser = baseFactory.getBaseUser(session);
        iBasePC basePC = baseFactory.getBasePC(session);
        
        if (baseUser != null) {
            logger.info(String.format("unlock per session \"%s\" user: \"%s\"", session.getId(), baseUser.getWebuser()));

            iCallProcedureFunction callProcedure = CaronteFactory.getFactory().createCallProcedure(DATASOURCE, baseUser.getWebuser() + "@" + basePC.getIp());

            callProcedure.setSqlInParameter("p_username", baseUser.getWebuser());
            callProcedure.setSqlInParameter("p_ip", basePC.getIp());

            callProcedure.setSqlOutParameter("p_result");

            callProcedure.execute(UNLOCK_PROCEDURE);
                        
            logger.debug("unlock effettuato user:" + baseUser.getWebuser());
        }                
        
    }
    
}
