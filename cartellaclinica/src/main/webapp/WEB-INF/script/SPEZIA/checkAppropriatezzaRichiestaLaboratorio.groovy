import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.app.Connection;
import ca.uhn.hl7v2.app.Initiator;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.v25.group.OML_O21_OBSERVATION_REQUEST;
import ca.uhn.hl7v2.model.v25.group.OML_O21_ORDER;
import ca.uhn.hl7v2.model.v25.group.OML_O21_PATIENT;
import ca.uhn.hl7v2.model.v25.group.OML_O21_PATIENT_VISIT;
import ca.uhn.hl7v2.model.v25.group.OML_O21_SPECIMEN;
import ca.uhn.hl7v2.model.v25.message.OML_O21;
import ca.uhn.hl7v2.model.v25.segment.MSH;
import ca.uhn.hl7v2.model.v25.segment.OBR;
import ca.uhn.hl7v2.model.v25.segment.OBX;
import ca.uhn.hl7v2.model.v25.segment.ORC;
import ca.uhn.hl7v2.model.v25.segment.PID;
import ca.uhn.hl7v2.model.v25.segment.PV1;
import ca.uhn.hl7v2.model.v25.segment.SPM;
import ca.uhn.hl7v2.model.v25.message.ACK
import ca.uhn.hl7v2.model.v25.segment.TQ1
import ca.uhn.hl7v2.parser.Parser;

import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

try {        
//    System.out.println("groovy");
//    System.out.println(PAZIENTE);
  
//    Map<String, String> response = new HashMap<String, String>();
    
    // Costruzione del messaggio contenuto nelle speifiche di NOEMA
    SimpleDateFormat sdfmm  = new SimpleDateFormat("yyyyMMddHHmm");
    SimpleDateFormat sdfms  = new SimpleDateFormat("yyyyMMddHHmmss.SSS");
    Date date               = new Date();
    String date_ms          = sdfms.format(date);
    String date_mm          = sdfmm.format(date);
    
    OML_O21 o21 = new OML_O21();
    o21.initQuickstart("OML", "O21", "T"); // "T" for Test, "P" for Production

    // MSH Segment
    MSH msh = o21.getMSH();
    msh.getMsh3_SendingApplication().getHd1_NamespaceID().setValue("DNLAB");
    msh.getMsh4_SendingFacility().getHd1_NamespaceID().setValue("NOEMALIFE");
    msh.getMsh5_ReceivingApplication().getHd1_NamespaceID().setValue("PROMETEO");
    msh.getMsh6_ReceivingFacility().getHd1_NamespaceID().setValue("NOEMALIFE");
    msh.getMsh7_DateTimeOfMessage().getTs1_Time().setValue(date_ms);
    msh.getMsh10_MessageControlID().setValue(date_ms);
    
    /* PATIENT */
    OML_O21_PATIENT patient = o21.getPATIENT();
    // PID Segment
    PID pid = patient.getPID();
    pid.getPid3_PatientIdentifierList(0).getCx1_IDNumber().setValue(_PATIENT._PID._3[0].ID_Number);
    pid.getPid3_PatientIdentifierList(0).getCx5_IdentifierTypeCode().setValue(_PATIENT._PID._3[0].Identifier_Type_Code);
    pid.getPid3_PatientIdentifierList(1).getCx1_IDNumber().setValue(_PATIENT._PID._3[1].ID_Number);
    pid.getPid3_PatientIdentifierList(1).getCx5_IdentifierTypeCode().setValue(_PATIENT._PID._3[1].Identifier_Type_Code);
    pid.getPid3_PatientIdentifierList(2).getCx1_IDNumber().setValue(_PATIENT._PID._3[2].ID_Number);
    pid.getPid3_PatientIdentifierList(2).getCx5_IdentifierTypeCode().setValue(_PATIENT._PID._3[2].Identifier_Type_Code);
    pid.getPid5_PatientName(0).getXpn1_FamilyName().getFn1_Surname().setValue(_PATIENT._PID._5.SURNAME);
    pid.getPid5_PatientName(0).getXpn2_GivenName().setValue(_PATIENT._PID._5.NAME);
    pid.getPid7_DateTimeOfBirth().getTs1_Time().setValue(_PATIENT._PID._7);
    pid.getPid8_AdministrativeSex().setValue(_PATIENT._PID._8);
//    /* PATIENT_VISIT */
//    OML_O21_PATIENT_VISIT patient_visit = patient.getPATIENT_VISIT();
//    // PV1 Segment
//    PV1 pv1 = patient_visit.getPV1();
//    pv1.getPv12_PatientClass().setValue("CLASSE DEL PAZIENTE");
    
    for (int i = 0; i < _ORDER.size(); i++) {
        /* ORDER */
        OML_O21_ORDER order = o21.getORDER(i);
        // ORC Segment
        ORC orc = order.getORC();
        orc.getOrc1_OrderControl().setValue(_ORDER[i]._ORC._1);
        orc.getOrc2_PlacerOrderNumber().getEi1_EntityIdentifier().setValue(_ORDER[i]._ORC._2);
        orc.getOrc4_PlacerGroupNumber().getEi1_EntityIdentifier().setValue(_ORDER[i]._ORC._4);
        orc.getOrc9_DateTimeOfTransaction().getTs1_Time().setValue(_ORDER[i]._ORC._9);
        orc.getOrc12_OrderingProvider(0).getIDNumber().setValue(_ORDER[i]._ORC._12.ID_Number);
        orc.getOrc12_OrderingProvider(1).getFamilyName().getFn1_Surname().setValue(_ORDER[i]._ORC._12.Family_Name);
        orc.getOrc12_OrderingProvider(2).getGivenName().setValue(_ORDER[i]._ORC._12.Given_Name);
        orc.getOrc12_OrderingProvider(3).getNameRepresentationCode().setValue(_ORDER[i]._ORC._12.Name_Representation_Code);
//    /* TIMING */
//    // TQ1 Segment
//    TQ1 tq1 = order.getTIMING().getTQ1();
//    tq1.getTq11_SetIDTQ1().setValue("");
//    tq1.getTq17_StartDateTime().getTs1_Time().setValue("");
//    tq1.getTq19_Priority(0).getCwe1_Identifier().setValue("");
        /* OBSERVATION_REQUEST */
        OML_O21_OBSERVATION_REQUEST observation_request = order.getOBSERVATION_REQUEST();
        // OBR Segment
        OBR obr = observation_request.getOBR();
        obr.getObr4_UniversalServiceIdentifier().getCe1_Identifier().setValue(_ORDER[i]._OBSERVATION_REQUEST._OBR._4.Identifier);
        obr.getObr4_UniversalServiceIdentifier().getCe2_Text().setValue(_ORDER[i]._OBSERVATION_REQUEST._OBR._4.Text);
        obr.getObr7_ObservationDateTime().getTs1_Time().setValue(_ORDER[i]._OBSERVATION_REQUEST._OBR._7);
//    /* OBSERVATION */
//    // OBX Segment
//    OBX obx = observation_request.getOBSERVATION().getOBX();
//    obx.getObx3_ObservationIdentifier().getCe1_Identifier().setValue("CE.1");
//    obx.getObx3_ObservationIdentifier().getCe2_Text().setValue("CE.2");
//    obx.getObx3_ObservationIdentifier().getCe3_NameOfCodingSystem().setValue("CE.3");
//    obx.getObx11_ObservationResultStatus().setValue("OBX.11");
//    /* SPECIMEN */
//    OML_O21_SPECIMEN specimen = observation_request.getSPECIMEN();
//    // SPM Segment
//    SPM spm = specimen.getSPM();
//    spm.getSpm4_SpecimenType().getCwe1_Identifier().setValue("TIPO DEL CAMPIONE");        
    } 
                
    // Now, let's encode the message and look at the output
    HapiContext context     = new DefaultHapiContext();
    Parser parser           = context.getPipeParser();
    String encodedMessage   = parser.encode(o21);
    System.out.println("Printing ER7 Encoded Message:");
    System.out.println(encodedMessage);
        
    // Next, let's use the XML parser to encode as XML
//    parser = context.getXMLParser();
//    encodedMessage = parser.encode(o21);
//    System.out.println("Printing XML Encoded Message:");
//    System.out.println(encodedMessage);
    
    // Chiamata al web service con il messaggio generato (da implementare)
//    Esempio
//    VerificaAppropriatezzaProxy ws = new VerificaAppropriatezzaProxy();
//    ws.setEndpoint("http://192.168.3.243:8080/VerificaAppropriatezza/services/VerificaAppropriatezzaSOAP");
//    String msg = ws.verificaAppropriatezzaOperation("TEST: verificaAppropriatezzaOperation");
//    System.out.println(msg);

    // A connection object represents a socket attached to an HL7 server
    Connection connection = context.newClient("localhost", 58485, false);
 
    // The initiator is used to transmit unsolicited messages
    Initiator initiator = connection.getInitiator();
    Message response    = initiator.sendAndReceive(o21);
    
    // Parserizzazione della risposta
    String responseString = parser.encode(response);
//    System.out.println("Received response:\n" + responseString);  
    
    ACK ack         = (ACK) response.getMessage();
    String msa1     = ack.getMSA().getMsa1_AcknowledgmentCode().getValue();
    String err31    = ack.getERR().getErr3_HL7ErrorCode().getCwe1_Identifier().getValue();
    String err32    = ack.getERR().getErr3_HL7ErrorCode().getCwe2_Text().getValue();
    String err4     = ack.getERR().getErr4_Severity().getValue();
      
    if (msa1.equals("AA")) {
        out_success =  true;
        out_message = "Message accepted";           
    } else if (msa1.equals("AE")) {
        if (err4.equals("W")) {
            out_success =  false;
            out_message = "WARNING: Segment sequence error";            
        } else if (err4.equals("E")) {
            out_success =  false;
            out_message = "ERROR: Segment sequence error";
        } else {
            out_success =  false;
            out_message = "ERROR: UNKNOWN";            
        }
    } else if (msa1.equals("AR")) {
        out_success =  false;
        if (err31.equals("200"))    out_message = "Unsupported message type";
        else                        out_message = "Application internal error";
    } else {
        out_success =  false;
        out_message = "UNKNOWN";          
    }
//    System.out.println("success");
} catch(Exception ex) {
    out_success = false;
    out_message = ex.getMessage();
//    System.err.println("failure");
}