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
package it.elco.whale.hl7.servlet;

import ca.uhn.hl7v2.AcknowledgmentCode;
import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.hoh.hapi.server.HohServlet;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.v25.message.ACK;
import ca.uhn.hl7v2.protocol.ReceivingApplication;
import ca.uhn.hl7v2.protocol.ReceivingApplicationException;
import ca.uhn.hl7v2.validation.builder.ValidationRuleBuilder;
import ca.uhn.hl7v2.validation.builder.support.DefaultValidationBuilder;
import it.elco.whale.hl7.message.OMG_O19;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.servlet.ServletException;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

/**
 * Servlet in ascolto [RICEZIONE] dei messaggi HL7
 * 
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class Listener extends HohServlet {
	
	private static final long serialVersionUID = 1L;
	private final ElcoLoggerInterface logger = new ElcoLoggerImpl(this.getClass());
	
    /**
     * Inizializza la servlet.
     * @throws  ServletException 
     */
        @Override
    public void init() throws ServletException {
    	
    	setApplication(new hl7list());
    	
    }   
    
    /**
     * Listener dei messaggi OMG_O19 HL7.
     */
    private class hl7list implements ReceivingApplication {
    	
        /**
	  	 * processMessage       is fired each time a new message arrives. 
	  	 * @param theMessage    The message which was received
	  	 * @param theMetadata   A map containing additional information about the message, where it came from, etc.  
	 	 */
                  @Override
	  	public Message processMessage(Message theMessage, Map<String, Object> theMetadata) throws ReceivingApplicationException, HL7Exception {
	  		
	  		logger.info("RECEIVED MESSAGE: " + theMessage.encode());
	  		logger.info("RECEIVED METADATA: " + theMetadata.toString());
	                    
	        ValidationRuleBuilder builder = new DefaultValidationBuilder() {

				@Override
	            protected void configure() {
	                logger.debug("Validating inbound message");
                        
                        super.configure();
	                    
	                // Verifica tipo del messaggio
	                forAllVersions().message("*", "*").terser("/.MSH-9-3", isEqual("OMG_O19"));
	                    
                    // Verifica campi obbligatori
                    forAllVersions().message("OMG", "O19").terser("/.PID-3",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-3-1",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-3-3",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-3-5",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-5-1-1",    not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-5-2",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-7-1",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PID-8",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PV1-3",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.PV1-3-1",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-1",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-4",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-4-1",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-4-2",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-7",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-7-6",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-12",       not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-12-1",     not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-21",       not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.ORC-21-1",     not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.OBR-4",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.OBR-4-1",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.OBR-4-2",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.OBR-4-3",      not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.OBR-7",        not(empty()));
                    forAllVersions().message("OMG", "O19").terser("/.OBR-7-1",      not(empty()));

                    logger.debug("Inbound message validated");
                    // Verifica struttura campi (Da implementare) 
                }
				
            };
	  
            HapiContext context = new DefaultHapiContext(); 
            context.setValidationRuleBuilder(builder);
            ACK ack = null;

            try {
            	//System.out.println("Successfully parsed valid message");
                OMG_O19 omg_o19 = new OMG_O19((ca.uhn.hl7v2.model.v25.message.OMG_O19) theMessage); 
                /**
                 * Creazione del JSON(String) contenente i campi ricevuti.
                 */
                String jsonStr = getJSONStrFields(omg_o19);
                
                /*
                 * Invio JSON alla servlet Rescuer e ricezione JSON di risposta.
                 */                
                JSONObject response = new JSONObject(sendPOST(jsonStr));
                
                try {
                    if ("KO".equals(response.getString("status"))) {
                        ack = (ACK) theMessage.generateACK(AcknowledgmentCode.AE, new HL7Exception(response.getString("message")));
                    } else {
                        ack = (ACK) theMessage.generateACK(); 
                        ack.getMSA().getMsa3_TextMessage().setValue(response.getString("id"));
                        
                    }
                } catch (IOException e) {
                	logger.error(e);
                    throw new ReceivingApplicationException("IOException", e);
                }
                               
                return ack;
                
            } catch (HL7Exception e) {
            	logger.error(e);
                throw new ReceivingApplicationException("HL7Exception", e);
            } catch (JSONException e) {
            	logger.error(e);
                throw new ReceivingApplicationException("JSONException", e);
            } catch (IOException e) {
            	logger.error(e);
                throw new ReceivingApplicationException("IOException", e);
			}
            
  		}
   
	  	/**
	  	 * {@inheritDoc}
	  	 */
                  @Override
	  	public boolean canProcess(Message theMessage) {  
	  		
	  		return true;
	  		
	    }
	        
	    /**
	     * Funzione per mappare i campi del messaggio OMG_O19 HL7 ricevuto in una stringa JSON.
	     * @param   oml_o19
	     * @return  String contenente il JSON dei campi mappati del messaggio ricevuto.
	     */
	    private String getJSONStrFields(OMG_O19 omg_o19) throws JSONException {
	    	logger.debug("Parsing inbound message to JSON");
	    	boolean isImpegnativa = omg_o19.isImpegnativa();
	            
	        return new JSONStringer().object()
	        		.key("assignAuthorityMittente").value(omg_o19.getMshAssignAuthorityMittente())
                        .key("orderControl").value(omg_o19.getOrcControlloOrdine())
                        .key("orderStatus").value(omg_o19.getOrcControlloStato())
                        .key("repartoDestinatario").value(omg_o19.getMshRepartoDestinatario())
	                    
	                .key("idenAnag").value(omg_o19.getPid3("PK"))
	                .key("idenMedicoOrdinante").value(omg_o19.getOrcIdenMedicoOrdinante())
	                .key("idenPosizionePaziente").value(omg_o19.getPv1IdenPosizionePaziente())
	                    
	                .key("numNosologico").value(omg_o19.getPv1Nosologico())
	                    
	                .key("elencoIdenEsami").value(omg_o19.getObrElencoIdenEsami())
	                .key("elencoLateralitaEsami").value(omg_o19.getObrElencoLateralitaEsami())
	                 
	                .key("dataRichiestaEsami").value(omg_o19.getOrcDataRichiestaEsame())
	                .key("oraRichiestaEsami").value(omg_o19.getOrcOraRichiestaEsame())
	                
	                .key("dataPropostaEsami").value(omg_o19.getOrcDataPropostaEsame())
	                .key("oraPropostaEsami").value(omg_o19.getOrcOraPropostaEsame())
	                   
	                .key("elencoNumeriImpegnative").value(isImpegnativa ? omg_o19.getOrcElencoNumeriImpegnative() : JSONObject.NULL)
	                .key("elencoDateImpegnative").value(isImpegnativa ? omg_o19.getOrcElencoDateImpegnative() : JSONObject.NULL)
	                .key("elencoTipiImpegnative").value(isImpegnativa ? omg_o19.getOrcElencoTipiImpegnative() : JSONObject.NULL)
	                .key("elencoUrgenzeImpegnative").value(isImpegnativa ? omg_o19.getOrcElencoUrgenze() : JSONObject.NULL)
	                    
	                .key("quadroClinico").value(omg_o19.getObrQuadroClinico())
	                .key("quesito").value(omg_o19.getObrQuesito())
	                .key("codiceEsenzione").value(omg_o19.getObrCodiceEsenzione())
	                // Se sono delle impegnative devo inserire l'urgenza maggiore
	                .key("urgenza").value(isImpegnativa ? omg_o19.getUrgenzaMax() : omg_o19.getOrcUrgenza(omg_o19.omg_o19.getORDER().getORC())) 
	                .endObject().toString();
	        
	    }
	        
	    /**
	     * Recupera l'URL della servlet Rescuer.
	     * @return  String contenente l'URL.
	     * @throws  IOException 
	     */
	    private String getURL() throws IOException {
	    	
	        Properties p = new Properties();
	        p.load(new FileInputStream(getServletContext().getRealPath("/") + "WEB-INF/properties/oe.hl7.properties"));
	        return p.getProperty("rescuer.scheme") + "://" + p.getProperty("rescuer.host") + ":" + p.getProperty("rescuer.port") + p.getProperty("rescuer.uri");
	        
	    }
	    
	    /**
	     * Invia un messaggio JSON (String) in POST alla servlet /hl7resc.
	     * @param   jsonStr
	     * @return  String contenente il messaggio JSON di risposta.
	     * @throws IOException 
	     */
	    private String sendPOST(String jsonStr) throws IOException {	        
			
			try {
				String url 	= getURL();
				HttpClient client 	= new DefaultHttpClient();
				HttpPost post 	= new HttpPost(url);
	 
				List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
				urlParameters.add(new BasicNameValuePair("KEY_FIELDS", jsonStr));
	 
				post.setEntity(new UrlEncodedFormEntity(urlParameters));
	 
                                logger.info("Sending 'POST' request to URL : " + url);
				HttpResponse response = client.execute(post);				
                                
                                String inputLine;
                                StringBuilder sbEntity = new StringBuilder();
                                BufferedReader in = new BufferedReader(new InputStreamReader(post.getEntity().getContent()));
                                
                                while ((inputLine = in.readLine()) != null) {
                                    sbEntity.append(inputLine);
                                }
                                in.close();                               
                                
				logger.info("Post parameters : " + sbEntity.toString());
				logger.info("Response Code : " + response.getStatusLine().getStatusCode());
	 
				BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
		 
				StringBuilder sb = new StringBuilder();
                                String line;
				while ((line = rd.readLine()) != null) {
					sb.append(line);
				}
				
				return sb.toString();
			} catch (IOException e) {
				logger.error(e);
				throw e;
			}	 

		}  	    
    }

//    public void doPost(HttpServletRequest theReq, HttpServletResponse theResp) throws javax.servlet.ServletException, IOException {
//    	Logger.getLogger(Listener.class.getName()).log(Level.INFO, "doPost");
//    };
//    
//    public void doGet(HttpServletRequest theReq, HttpServletResponse theResp) throws javax.servlet.ServletException, IOException {
//    	Logger.getLogger(Listener.class.getName()).log(Level.INFO, "doGet");
//    };    
}
