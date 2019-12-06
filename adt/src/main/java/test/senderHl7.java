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
package test;

import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.hoh.api.IReceivable;
import ca.uhn.hl7v2.hoh.api.ISendable;
import ca.uhn.hl7v2.hoh.hapi.client.HohClientSimple;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.v25.message.ACK;
import ca.uhn.hl7v2.parser.PipeParser;

import java.io.FileInputStream;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Oggetto per la creazione e l'invio di messaggi HL7
 *
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class senderHl7 {
    private JSONObject jsonObj;

    /**
     * Constructor
     * @param jsonStr
     * @throws JSONException
     */
    public senderHl7(String jsonStr) throws JSONException {

    	Logger.getLogger(senderHl7.class.getName()).log(Level.INFO, "JSON: " + jsonStr);
        this.jsonObj = new JSONObject(jsonStr);

    }


    /* ###################################################################################### */
    /* #################################### Segmento MSH #################################### */
    /* ###################################################################################### */
    /**
     * Recupera i dati contentuti nell'MSH e li formatta in una String.
     * Es. MSH|^~\&|DNLAB|NOEMALIFE|PROMETEO|NOEMALIFE|20131216113307.720||OMG^O19^OMG_O19|20131216113307.720|P|2.5\r
     * @param   jsonObj
     * @return  String contenente i dati dell'MSH.
     */
    private String setMSH(JSONObject jsonObj) {

        String msh = "MSH";

        try {msh += jsonObj.getString("MSH.1");} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getString("MSH.2")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.3").getString("HD.1")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.4").getString("HD.1")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.5").getString("HD.1")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.6").getString("HD.1")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.7").getString("TS.1")+"||";} catch (JSONException e) {msh += "||";}
        try {msh += jsonObj.getJSONObject("MSH.9").getString("MSG.1")+"^"+jsonObj.getJSONObject("MSH.9").getString("MSG.2")+"^"+jsonObj.getJSONObject("MSH.9").getString("MSG.3")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getString("MSH.10")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.11").getString("PT.1")+"|";} catch (JSONException e) {msh += "|";}
        try {msh += jsonObj.getJSONObject("MSH.12").getString("VID.1")+"\r";} catch (JSONException e) {msh += "\r";}

        return msh;

    }


    /* ###################################################################################### */
    /* #################################### Segmento PID #################################### */
    /* ###################################################################################### */
    /**
     * Recupera i dati contentuti nel PID.3.
     * @param   jsonArr
     * @return  String contenente i dati del PID.3.
     * @throws  JSONException
     */
    private String getPid3(JSONArray jsonArr) throws JSONException {

        String pid3 = "";

        for (int i = 0; i < jsonArr.length(); i++) {
            pid3 += jsonArr.getJSONObject(i).getString("CX.1")+"^^"+jsonArr.getJSONObject(i).getString("CX.3")+"^^"+jsonArr.getJSONObject(i).getString("CX.5");
            pid3 += i < jsonArr.length() - 1 ? "~" : "";
        }

        return pid3;

    }
    /**
     * Recupera i dati contentuti nel PID e li formatta in una String.
     * Es. PID|||VRGNTN50A21I158A^^^^PK~ASDASDASDASDA^^^^CF~826012601A11^^^^SSN||Rossi^Mario||20131216|M\r
     * @param   jsonObj
     * @return  String contenente i dati del PID.
     */
    private String setPID(JSONObject jsonObj) {

        String pid = "PID|||";

        try {pid += getPid3(jsonObj.getJSONArray("PID.3"))+"||";} catch (JSONException e) {pid += "||";}
        try {pid += jsonObj.getJSONObject("PID.5").getJSONObject("XPN.1").getString("FN.1")+"^"+jsonObj.getJSONObject("PID.5").getString("XPN.2")+"||";} catch (JSONException e) {pid += "||";}
        try {pid += jsonObj.getJSONObject("PID.7").getString("TS.1")+"|";} catch (JSONException e) {pid += "|";}
        try {pid += jsonObj.getString("PID.8")+"\r";} catch (JSONException e) {pid += "\r";}

        return pid;

    }


    /* ###################################################################################### */
    /* #################################### Segmento PV1 #################################### */
    /* ###################################################################################### */
    /**
     * Recupera i dati contentuti nel PV1 e li formatta in una String.
     * @param jsonObj
     * @return
     */
    private String setPV1(JSONObject jsonObj) {

        String pv1 = "PV1|";

        try {pv1 += jsonObj.getString("PV1.1")+"|";} catch (JSONException e) {pv1 += "|";}
        try {pv1 += jsonObj.getString("PV1.2")+"|";} catch (JSONException e) {pv1 += "|";}
        try {pv1 += jsonObj.getJSONObject("PV1.3").getString("PL.1")+"||||||||||||||||";} catch (JSONException e) {pv1 += "||||||||||||||||";}
        try {pv1 += jsonObj.getJSONObject("PV1.19").getString("CX.1")+"\r";} catch (JSONException e) {pv1 += "\r";}

        return pv1;

    }


    /* ###################################################################################### */
    /* #################################### Segmento ORC #################################### */
    /* ###################################################################################### */
    /**
     * Recupera i dati contentuti nell'ORC.
     * @param   jsonObj
     * @return  String contenente i dati dell'ORC.
     */
    private String setORC(JSONObject jsonObj) {

        String orc = "ORC|";

        try {orc += jsonObj.getString("ORC.1")+"|";} catch (JSONException e) {orc += "|";}
        try {orc += jsonObj.getJSONObject("ORC.2").getString("EI.1")+"||";} catch (JSONException e) {orc += "||";}
        try {orc += jsonObj.getJSONObject("ORC.4").getString("EI.1")+"|||";} catch (JSONException e) {orc += "|||";}
        try {orc += jsonObj.getJSONObject("ORC.7").getJSONObject("TQ.1").getString("CQ.1")+"^^^^^"+jsonObj.getJSONObject("ORC.7").getString("TQ.6")+"|";} catch (JSONException e) {orc += "|";}
        try {orc += jsonObj.getJSONObject("ORC.8").getJSONObject("EIP.1").getString("EI.1")+"|";} catch (JSONException e) {orc += "|";}
        try {orc += jsonObj.getJSONObject("ORC.9").getString("TS.1")+"|||";} catch (JSONException e) {orc += "|||";}
        try {orc += jsonObj.getJSONObject("ORC.12").getString("XCN.1")+"|||||||||";} catch (JSONException e) {orc += "|||||||||";}
        try {orc += jsonObj.getJSONObject("ORC.21").getString("XON.1")+"\r";} catch (JSONException e) {orc += "\r";}

        return orc;

    }


    /* ###################################################################################### */
    /* #################################### Segmento OBR #################################### */
    /* ###################################################################################### */
    /**
     * Recupera i dati contentuti nell'OBR.
     * @param   jsonObj
     * @return  String contenente i dati dell'OBR.
     */
    private String setOBR(JSONObject jsonObj) {

        String obr = "OBR|";

        try {obr += jsonObj.getString("OBR.1")+"|";} catch (JSONException e) {obr += "|";}
        try {obr += jsonObj.getJSONObject("OBR.2").getString("EI.1")+"||";} catch (JSONException e) {obr += "||";}
        try {obr += jsonObj.getJSONObject("OBR.4").getString("CE.1")+"^"+jsonObj.getJSONObject("OBR.4").getString("CE.2")+"^"+jsonObj.getJSONObject("OBR.4").getString("CE.3")+"|||";} catch (JSONException e) {obr += "|||";}
        try {obr += jsonObj.getJSONObject("OBR.7").getString("TS.1")+"||||||";} catch (JSONException e) {obr += "||||||";}
        try {obr += jsonObj.getString("OBR.13")+"||||||||||";} catch (JSONException e) {obr += "||||||||||";}
        try {obr +="^"+ jsonObj.getJSONObject("OBR.23").getJSONObject("MOC.2").getString("CE.1")+"||||";} catch (JSONException e) {obr += "||||";}
        try {obr += jsonObj.getJSONObject("OBR.27").getJSONObject("TQ.1").getString("CQ.1")+"||||";} catch (JSONException e) {obr += "||||";}
        try {obr += "^"+jsonObj.getJSONObject("OBR.31").getString("CE.2")+"||||||||";} catch (JSONException e) {obr += "||||||||";}
        try {obr += jsonObj.getJSONObject("OBR.39").getString("CE.1")+"\r";} catch (JSONException e) {obr += "\r";}

        return obr;

    }


    /* ###################################################################################### */
    /* ############################# Costruzione Messaggio HL7 ############################## */
    /* ###################################################################################### */
    /**
     * Formatta e recupera il messaggio HL7 [PIPE].
     * @return  String contenente il messaggio HL7 [PIPE].
     * @throws  JSONException
     */
    private String encodeHL7() throws JSONException {

        String request = "";

        JSONArray arrayMessage = this.jsonObj.getJSONArray("MESSAGE");
        JSONObject oml_o19 = arrayMessage.getJSONObject(0).getJSONObject("VALUE");

        request += setMSH(oml_o19.getJSONObject("MSH"));

        JSONObject patient = oml_o19.getJSONObject("PATIENT");
        request += setPID(patient.getJSONObject("PID"));

        JSONObject patient_visit = patient.getJSONObject("PATIENT_VISIT");
        request += setPV1(patient_visit.getJSONObject("PV1"));

        JSONArray arrayOrder = oml_o19.getJSONArray("ORDER");

        for (int i = 0; i < arrayOrder.length(); i++) {
            JSONObject order = arrayOrder.getJSONObject(i);
            request += setORC(order.getJSONObject("ORC"));

            JSONObject observationRequest = order.getJSONObject("OBSERVATION_REQUEST");
            request += setOBR(observationRequest.getJSONObject("OBR"));
        }

        return request;

    }

    /**
     * Invia un messaggio HL7 [PIPE] (in POST) alla servlet /hl7resc.
     * @param realPath
     * @return  String contenente il messaggio di risposta HL7.
     * @throws Throwable
     */
    public String sendMessage(String realPath) throws Throwable {

        Properties p    = null;
        String host     = "";
        int port        = 0;
        String uri      = "";

        HapiContext context     = new DefaultHapiContext();
        PipeParser pipeParser   = context.getPipeParser();
        HohClientSimple client  = null;

        String request  = "";
        String response = "";

        ISendable<Message> sendable     = null;
        IReceivable<Message> receivable = null;

        try {
            p = new Properties();
            p.load(new FileInputStream(realPath + "WEB-INF/properties/config.properties"));
            host = p.getProperty("host");
            port = Integer.parseInt(p.getProperty("port"));
            uri  = p.getProperty("uri");

            client      = new HohClientSimple(host, port, uri, pipeParser);

            request     = encodeHL7();
            Logger.getLogger(senderHl7.class.getName()).log(Level.INFO, "REQUEST: " + request);
            //response    += "<strong>SEND MESSAGE:</strong><br/>" + request.replace("\r", "<br/>");

            //sendable    = new MessageSendable(pipeParser.parse(request));
            //System.out.println(sendable.getEncodingStyle().getContentType());

            //receivable  = client.sendAndReceiveMessage(sendable);

            receivable = client.sendAndReceiveMessage(pipeParser.parse(request));
            //receivable.getRawMessage() provides the response
            //response    += "<br/><strong>RESPONSE WAS:</strong><br/>" + receivable.getMessage();
            //response    += receivable.getMessage();

            //parse the message string into a Message object
            Message message = receivable.getMessage();

            // if it is an ACK message (as we know it is),  cast it to an
            // ACK object so that it is easier to work with, and change a value
            if (message instanceof ACK) {
                ACK ack = (ACK) message;
                if("AA".equals(ack.getMSA().getMsa1_AcknowledgmentCode().getValue())){
                	response += "{\"STATO\": \"OK\", \"MESSAGGIO\": \"RECORD INSERITO\"}";

                }else{
                	response += "{\"STATO\": \"KO\", \"MESSAGGIO\": \""+ack.getERR().getErr3_HL7ErrorCode().getCwe1_Identifier().getValue()+
                			" "+ack.getERR().getErr3_HL7ErrorCode().getCwe2_Text().getValue()+
                			" "+ ack.getERR().getErr3_HL7ErrorCode().getCwe9_OriginalText().getValue()+"\"}";
                }
            }

            // IReceivable also stores metadata about the message
            //response    += "<br/><strong>FROM:</strong><br/>" + (String) receivable.getMetadata().get(MessageMetadataKeys.REMOTE_HOST_ADDRESS);
        } catch (Throwable ex) {
        	Logger.getLogger(senderHl7.class.getName()).log(Level.SEVERE, null, ex);
        	throw ex;
        } finally {
        	Logger.getLogger(senderHl7.class.getName()).log(Level.INFO, "RESPONSE: " + response);
        }

        return response;

    }

}
