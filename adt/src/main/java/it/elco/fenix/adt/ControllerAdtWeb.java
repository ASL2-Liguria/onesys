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
package it.elco.fenix.adt;

import it.elco.adt.ControllerAdtAbstract;
import it.elco.adt.exceptions.AdtException;
import it.elco.anagrafica.data.Anagrafica;
import it.elco.caronte.datasource.ElcoOracleDataSource;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.contatti.data.Contatto;
import it.elco.contatti.data.ContattoAssistenziale;
import it.elco.contatti.data.factory.ContattoFactory;
import it.elco.contatti.exceptions.ContattiException;
import it.elco.core.data.RpcResponse;
import it.elco.database.ContextInfo;
import it.elco.fenix.adt.action.RpcContattoAction;
import it.elco.fenix.adt.exception.RpcContattoException;
import it.elco.json.Json;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author francescog
 */
public class ControllerAdtWeb extends ControllerAdtAbstract{

	private Logger logger = LoggerFactory.getLogger(ControllerAdtWeb.class);

    public ControllerAdtWeb() throws Throwable{
        this( new Properties());
    }

    public ControllerAdtWeb(Properties properties) throws Throwable {
        super(((ElcoOracleDataSource) CaronteFactory.getFactory().createDataSource("ADT")).getDataSource(), properties);
    }

    @Override
    public RpcResponse admitVisitNotification(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.admitVisitNotification(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "admitVisitNotification", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse admitVisitNotification(Contatto contatto) throws ContattiException {
        return admitVisitNotification(contatto, null);
    }

    @Override
    public RpcResponse transferPatientGiuridicoAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.transferPatientGiuridicoAssistenziale(contatto, ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "transferPatientGiuridicoAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse transferPatientGiuridicoAssistenziale(Contatto contatto) throws ContattiException {
        return transferPatientGiuridicoAssistenziale(contatto, null);
    }

    @Override
    public RpcResponse transferPatientAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.transferPatientAssistenziale(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "transferPatientAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse transferPatientAssistenziale(Contatto contatto) throws ContattiException {
        return transferPatientAssistenziale(contatto, null);
    }

    @Override
    public RpcResponse dischargeVisit(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.dischargeVisit(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "dischargeVisit", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse dischargeVisit(Contatto contatto) throws ContattiException {
        return dischargeVisit(contatto, null);
    }

    @Override
    public RpcResponse preAdmitVisitNotification(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.admitVisitNotification(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "preAdmitVisitNotification", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse preAdmitVisitNotification(Contatto contatto) throws ContattiException {
        return preAdmitVisitNotification(contatto, null);
    }

    @Override
    public RpcResponse updatePatientInformation(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.updatePatientInformation(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "updatePatientInformation", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse updatePatientInformation(Contatto contatto) throws ContattiException {
        return updatePatientInformation(contatto, null);
    }

    @Override
    public RpcResponse updatePatientInformationPartial(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.updatePatientInformationPartial(contatto,ctx);
        if (response.isSuccess()){
            invokeAccessors(contatto, "updatePatientInformation", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse updatePatientInformationShort(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.updatePatientInformationShort(contatto,ctx);
        if (response.isSuccess()){
            invokeAccessors(contatto, "updatePatientInformation", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse cancelAdmission(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.cancelAdmission(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "cancelAdmission", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse cancelAdmission(Contatto contatto) throws ContattiException {
        return cancelAdmission(contatto, null);
    }

    @Override
    public RpcResponse cancelTransferGiuridicoAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.cancelTransferGiuridicoAssistenziale(contatto, ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "cancelTransferGiuridicoAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse cancelTransferGiuridicoAssistenziale(Contatto contatto) throws ContattiException {
        return cancelTransferGiuridicoAssistenziale(contatto, null);
    }

    @Override
    public RpcResponse cancelTransferAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.cancelTransferAssistenziale(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "cancelTransferAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse cancelTransferAssistenziale(Contatto contatto) throws ContattiException {
        return cancelTransferAssistenziale(contatto, null);
    }

    @Override
    public RpcResponse cancelDischarge(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.cancelDischarge(contatto, ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "cancelDischarge", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse cancelDischarge(Contatto contatto) throws ContattiException {
        return cancelDischarge(contatto, null);
    }

    @Override
    public RpcResponse pendingTransferGiuridico(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.pendingTransferGiuridico(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "pendingTransferGiuridico", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse pendingTransferGiuridico(Contatto contatto) throws ContattiException {
        return pendingTransferGiuridico(contatto, null);
    }

    @Override
    public RpcResponse pendingTransferAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.pendingTransferAssistenziale(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "pendingTransferAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse pendingTransferAssistenziale(Contatto contatto) throws ContattiException {
        return pendingTransferAssistenziale(contatto, null);
    }

    @Override
    public RpcResponse cancelPreAdmission(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.cancelPreAdmission(contatto,ctx);
        if (response.isSuccess()){
        	invokeAccessors(contatto, "cancelPreAdmission", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse cancelPreAdmission(Contatto contatto) throws ContattiException {
        return cancelPreAdmission(contatto, null);
    }

    @Override
    public RpcResponse moveVisit(Contatto contatto, Anagrafica anagrafica, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.moveVisit(contatto, anagrafica, ctx);

        if (response.isSuccess())
        {
	        try {
				invokeAccessors(contatto, "moveVisit", Json.stringify(anagrafica), response);
			} catch (IOException e) {
				throw new ContattiException(e);
			}
        }
        return response;
    }

    @Override
    public RpcResponse moveVisit(Contatto contatto, Anagrafica anagrafica) throws ContattiException {
        return moveVisit(contatto, anagrafica, null);
    }

    @Override
    public RpcResponse accettaTrasferimentoGiuridico(Contatto contatto, ContextInfo ctx) throws ContattiException {

    	RpcResponse response = super.accettaTrasferimentoGiuridico(contatto, ctx);

        if (response.isSuccess()){
        	invokeAccessors(contatto, "transferPatientGiuridicoAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse accettaTrasferimentoGiuridico(Contatto contatto) throws ContattiException {
        return accettaTrasferimentoGiuridico(contatto, null);
    }

    @Override
    public RpcResponse accettaTrasferimentoAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {
        RpcResponse response = super.accettaTrasferimentoAssistenziale(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "transferPatientAssistenziale", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse accettaTrasferimentoAssistenziale(Contatto contatto) throws ContattiException {
        return accettaTrasferimentoAssistenziale(contatto, null);
    }

    @Override
    public RpcResponse segnalaAccesso(ContattoAssistenziale segmento, ContextInfo ctx) throws ContattiException {
    	RpcResponse response = super.segnalaAccesso(segmento,ctx);
        Contatto contatto;

        if (response.isSuccess())
        {
	        try {
				contatto = (Contatto) ContattoFactory.newInstance(segmento.getContatto().getId());
				invokeAccessors(contatto, "segnalaAccesso", Json.stringify(segmento), response);
			} catch (Exception e) {
				throw new AdtException(e);
			}

        }
        return response;
    }

    @Override
    public RpcResponse segnalaAccesso(ContattoAssistenziale segmento) throws ContattiException {
        return segnalaAccesso(segmento, null);
    }

    @Override
    public RpcResponse annullaAccesso(ContattoAssistenziale segmento, ContextInfo ctx) throws ContattiException {

    	RpcResponse response = super.annullaAccesso(segmento, ctx);
        Contatto contatto;

        if (response.isSuccess())
        {
	        try {
				contatto = (Contatto) ContattoFactory.newInstance(segmento.getContatto().getId());
				invokeAccessors(contatto, "annullaAccesso", Json.stringify(segmento), response);
			} catch (Exception e) {
				throw new AdtException(e);
			}
        }

        return response;
    }

    @Override
    public RpcResponse annullaAccesso(ContattoAssistenziale segmento) throws ContattiException {
        return annullaAccesso(segmento, null);
    }

    @Override
    public RpcResponse modificaAccesso(ContattoAssistenziale segmento, ContextInfo ctx) throws ContattiException {

    	RpcResponse response = super.modificaAccesso(segmento,ctx);
        Contatto contatto;

        if (response.isSuccess())
        {
	        try {
				contatto = (Contatto) ContattoFactory.newInstance(segmento.getContatto().getId());
			} catch (Exception e) {
				throw new AdtException(e);
			}

	        invokeAccessors(contatto, "updatePatientInformation", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse modificaAccesso(ContattoAssistenziale segmento) throws ContattiException {
        return modificaAccesso(segmento, null);
    }

    class Invoker implements Runnable{

    	private final String method, body;
    	private final Contatto contatto;
    	private final RpcResponse response;
        private final ContextInfo ctx;


    	public Invoker(String method, Contatto contatto, String body, RpcResponse response, ContextInfo ctx){
    		this.method = method;
    		this.contatto = contatto;
    		this.body = body;
    		this.response = response;
            this.ctx = ctx;
    	}

        public Invoker(String method, Contatto contatto, String body, RpcResponse response) {
            this(method,contatto,body,response,null);
        }

		@Override
		public void run() {
			Logger logger = LoggerFactory.getLogger(ControllerAdtWeb.class);

	    	Map<String, List<RpcContattoAction>> accessors = CaronteFactory.getApplicationContext().getBean("controllerAdt.accessors", Map.class);
	        List<RpcContattoAction> accessorList = accessors.containsKey(method) ? accessors.get(method) : accessors.get("default");

	        if(accessorList != null){

	            for(RpcContattoAction action : accessorList){
	                try {
	                	logger.debug("Method: {} | Contatto: {}", method, contatto.getCodice().getCodice());

	                    action.setContatto(contatto);
	                    action.setMethod(method);
	                    action.setBody(body);

	                    RpcResponse accessorResponse = action.execute();

	                } catch (RpcContattoException ex) {
	                	logger.error("Method: {} | Contatto: {} | exception: {}", new String[]{method, contatto.getCodice().getCodice(), ex.getMessage()});
					}
	            }

	        }

		}

    }

    /**
     * L'invocazione del metodo accessor alla manipolazione del contatto avviene tramite un nuovo Thread.
     * Questo perch alcuni metodi accessori come l'invio delle notifiche del traferimento possono impiegare diversi secondi
     * impedendo all'utente di proseguire con la sua attivita'.
     *
     * @param contatto
     * @param method
     * @param body
     * @param response
     */
    private void invokeAccessors(Contatto contatto, String method, String body, RpcResponse response){
    	new Thread(new Invoker(method, contatto, body, response)).start();
    }

}
