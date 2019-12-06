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
package it.elco.fenix.ps;

import com.rits.cloning.Cloner;
import it.elco.anagrafica.data.Anagrafica;
import it.elco.caronte.datasource.ElcoOracleDataSource;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.contatti.ControllerProperties;
import it.elco.contatti.data.Contatto;
import it.elco.contatti.data.factory.ContattoFactory;
import it.elco.contatti.exceptions.ContattiException;
import it.elco.core.data.RpcResponse;
import it.elco.database.ContextInfo;
import it.elco.fenix.adt.action.RpcContattoAction;
import it.elco.fenix.adt.exception.RpcContattoException;
import it.elco.json.Json;
import it.elco.ps.ControllerPsAbstract;
import it.elco.ps.exceptions.PsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Properties;


public class ControllerPsWeb extends ControllerPsAbstract{

    private Cloner cloner = new Cloner();
    private Logger logger = LoggerFactory.getLogger(ControllerPsWeb.class);

    public ControllerPsWeb() throws Throwable{
        this(new Properties());
    }

    public ControllerPsWeb(Properties properties) throws Throwable {
    	super(((ElcoOracleDataSource) CaronteFactory.getFactory().createDataSource("ADT")).getDataSource(), properties);
    }

    @Override
    public RpcResponse admitVisitNotification(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "admitVisitNotification", contatto.getCodice().getCodice()));

        RpcResponse response = super.admitVisitNotification(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "inserisciAccesso", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse transferPatientAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "transferPatientAssistenziale", contatto.getCodice().getCodice()));

        RpcResponse response = super.transferPatientAssistenziale(contatto,ctx);
        if (response.isSuccess()){
            invokeAccessors(contatto, "transferPatientAssistenziale", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse transferPatientGiuridicoAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "transferPatientgiuridicoAssistenziale", contatto.getCodice().getCodice()));

        RpcResponse response = super.transferPatientGiuridicoAssistenziale(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "transferPatientGiuridicoAssistenziale", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse dischargeVisit(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "dischargeVisit", contatto.getCodice().getCodice()));

        RpcResponse response = super.dischargeVisit(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "chiusuraAccesso", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse updatePatientInformation(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "updatePatientInformation", contatto.getCodice().getCodice()));

        RpcResponse response = super.updatePatientInformation(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "modificaAccesso", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse cancelAdmission(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "cancelAdmission", contatto.getCodice().getCodice()));

        RpcResponse response = super.cancelAdmission(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "cancellaAccesso", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse cancelTransferGiuridicoAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "cancelTransferGiuridicoAssistenziale", contatto.getCodice().getCodice()));

        RpcResponse response = super.cancelTransferGiuridicoAssistenziale(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(ContattoFactory.newInstance(contatto.getId()), "cancelTransferGiuridicoAssistenziale", null, response);
        }

        return response;
    }


    @Override
    public RpcResponse cancelTransferAssistenziale(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "cancelTransferAssistenziale", contatto.getCodice().getCodice()));

        RpcResponse response = super.cancelTransferAssistenziale(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "cancelTransferAssistenziale", null, response);
        }

        return response;
    }


    @Override
    public RpcResponse cancelDischarge(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "cancelDischarge", contatto.getCodice().getCodice()));

        RpcResponse response = super.cancelDischarge(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "annullaChiusuraAccesso", null, response);
        }

        return response;
    }

    @Override
    public RpcResponse segnalaObi(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "segnalaObi", contatto.getCodice().getCodice()));

        RpcResponse response = super.segnalaObi(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "segnalaOBI", null, response);
        }
        return response;
    }


    @Override
    public RpcResponse eliminaObi(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "eliminaObi", contatto.getCodice().getCodice()));

        RpcResponse response = super.eliminaObi(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "annullaOBI", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse chiusuraObi(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "chiusuraObi", contatto.getCodice().getCodice()));

        RpcResponse response = super.chiusuraObi(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "chiusuraOBI", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse annullaChiusuraObi(Contatto contatto, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "annullaChiusuraObi", contatto.getCodice().getCodice()));

        RpcResponse response = super.annullaChiusuraObi(contatto,ctx);

        if (response.isSuccess()){
            invokeAccessors(contatto, "annullaChiusuraOBI", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse esitoRicovero(Contatto contattoDischarge, Contatto contattoAdmit, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "esitoRicovero", contattoDischarge.getCodice().getCodice()));

        RpcResponse response = super.esitoRicovero(contattoDischarge, contattoAdmit, ctx);

        if (response.isSuccess()){
            invokeAccessors(contattoDischarge, "chiusuraAccesso", null, response);
            invokeAccessors(contattoAdmit, "admitVisitNotification", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse esitoRicoveroAccessoDischarged(Contatto contattoDischarged, Contatto contattoAdmit, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "esitoRicoveroDischarged", contattoDischarged.getCodice().getCodice()));

        RpcResponse response = super.esitoRicoveroAccessoDischarged(contattoDischarged, contattoAdmit, ctx);

        if (response.isSuccess()){
            invokeAccessors(contattoDischarged, "modificaAccesso", null, response);
            invokeAccessors(contattoAdmit, "admitVisitNotification", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse esitoRicoveroObi(Contatto contattoDischarge, Contatto contattoAdmit, ContextInfo ctx) throws ContattiException {

        logger.debug("Funzione: {} | Contatto: {}", "esitoRicoveroObi", contattoDischarge.getCodice().getCodice());

        RpcResponse response = super.esitoRicoveroObi(contattoDischarge, contattoAdmit, ctx);

        if (response.isSuccess()){
            invokeAccessors(contattoDischarge, "chiusuraOBI", null, response);
            invokeAccessors(contattoAdmit, "admitVisitNotification", null, response);
        }
        return response;
    }

    @Override
    public RpcResponse esitoRicoveroObiRimosso(Contatto contattoDischarge, Contatto contattoAdmit, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "esitoRicoveroObiRimosso", contattoDischarge.getCodice().getCodice()));

        RpcResponse response = super.esitoRicoveroObiRimosso(contattoDischarge, contattoAdmit, ctx);

        if (response.isSuccess()){
            Thread threadAnnullaObi = invokeAccessors(contattoDischarge, "annullaOBI", null, response);
            Thread threadChiusuraAccesso = invokeAccessors(contattoDischarge, "chiusuraAccesso", null, response,threadAnnullaObi);
            invokeAccessors(contattoAdmit, "admitVisitNotification", null, response, threadChiusuraAccesso);
        }

        return response;
    }

    public RpcResponse moveVisit(Contatto contatto, Anagrafica anagrafica, ContextInfo ctx) throws ContattiException {

        logger.debug(String.format("Invocazione metodo %s per contatto %s", "moveVisit", contatto.getCodice().getCodice()));

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
        return moveVisit(contatto,anagrafica,null);
    }

    class Invoker implements Runnable{

        private final String method, body;
        private final Contatto contatto;
        private final RpcResponse response;
        private final Thread threadToJoin;

        public Invoker(String method, Contatto contatto, String body, RpcResponse response){
            this(method, contatto, body, response, null);
        }

        public Invoker(String method, Contatto contatto, String body, RpcResponse response, Thread threadToJoin){
            this.method = method;
            this.contatto = contatto;
            this.body = body;
            this.response = response;
            this.threadToJoin = threadToJoin;
        }

        @Override
        public void run() {

            if(this.threadToJoin != null){

                try {
                    threadToJoin.join();
                    logger.debug(String.format("Invocazione Thread controller.accessor con metodo: %s per il contatto: %s - Thread to Join !== null in stato: %s", method, contatto.getCodice().getCodice(), threadToJoin.getState()));
                } catch (InterruptedException e) {
                    logger.error(String.format("Errore nell'attesa dell'esecuzione del Thread cui il Thread corrente è unito, id contatto: %d; method: %s", contatto.getId(), method), e);
                }
            }

            String sleepTime = ControllerProperties.get("controller.accessor.PS." + method + ".sleep");

            logger.debug(String.format("Invocazione Thread controller.accessor con metodo: %s per il contatto: %s - Dentro alla funzione run - Sleep time: %s ", method, contatto.getCodice().getCodice(), sleepTime));

            if(sleepTime != null && !"".equals(sleepTime)){
                try {
                    Thread.sleep(Long.parseLong(sleepTime));
                } catch (InterruptedException e) {
                    logger.error(String.format("Errore durante Sleep Thread per il contatto: %s - message: %s ", contatto.getCodice().getCodice()), e);
                }
            }

            Map<String, List<RpcContattoAction>> accessors = CaronteFactory.getApplicationContext().getBean("controllerPs.accessors", Map.class);
            List<RpcContattoAction> accessorList = accessors.containsKey(method) ? accessors.get(method) : accessors.get("default");

            if(accessorList != null){

                for(RpcContattoAction action : accessorList){
                    try {
                        RpcContattoAction actionToUse = cloner.deepClone(action);
                        actionToUse.setContatto(contatto);
                        actionToUse.setMethod(method);
                        actionToUse.setBody(body);
                        actionToUse.execute();

                        logger.debug(String.format("Invocazione Thread controller.accessor con metodo: %s per il contatto: %s - Action eseguita con successo", method, contatto.getCodice().getCodice()));

                    } catch (RpcContattoException ex) {
                        logger.error(String.format("Errore durante esecuzione script accessor per contatto: %s - metodo: %s", method, contatto.getCodice().getCodice()), ex);
                    }
                }
            }

            logger.info(String.format("Invocazione Thread controller.accessor con metodo: %s per il contatto: %s - Controller Accessor terminata con successo", method, contatto.getCodice().getCodice()));
        }
    }

    /**
     * Metodo per l'invocazione dei metodi accessori al controller.
     * Queste chiamate avvengono in thread separati al principale per evitare che il client attenda la fine di tutti i processi.
     * Viene parametrizzato un Thread da joinare con quello in esecuzione per far si che vengano eseguiti consecutivamente.
     *
     * @param contatto Contatto oggetto della manipolazione
     * @param method Identificativo del metodo invocato
     * @param body Opzionale, JSON relativo all'oggetto ulteriore che si intende manipolare
     * @param response Response della precedente chiamata al controller
     * @param threadToJoin Thread di cui si desidera attendere il termine
     *
     * @return Thread di cui si è eseguito lo start
     */
    private Thread invokeAccessors(Contatto contatto, String method, String body, RpcResponse response, Thread threadToJoin){

        Thread t = new Thread(new Invoker(method, contatto, body, response, threadToJoin),method);
        t.start();

        return t;
    }

    private Thread invokeAccessors(Contatto contatto, String method, String body, RpcResponse response){
        return invokeAccessors(contatto, method, body, response, null);
    }
}
