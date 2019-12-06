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
package it.elco.whale.hl7.message;

import ca.uhn.hl7v2.model.v25.segment.OBR;
import ca.uhn.hl7v2.model.v25.segment.ORC;

/**
 * NB: il formato del messaggio ricevuto è diverso dal messaggio d'origine.
 * 
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class OMG_O19 {
    
    public final ca.uhn.hl7v2.model.v25.message.OMG_O19 omg_o19;
    
    /**
     * Constructor.
     * @param omg_o19 
     */
    public OMG_O19(ca.uhn.hl7v2.model.v25.message.OMG_O19 omg_o19) {
        this.omg_o19 = omg_o19;
    }

    
    /* ###################################################################################### */
    /* #################################### Segmento MSH #################################### */
    /* ###################################################################################### */
    /**
     * Recupera l'assign authority del MITTENTE.
     * @return String contenente l'assign authority del MITTENTE.
     */
    public String getMshAssignAuthorityMittente() {
        return this.omg_o19.getMSH().getMsh3_SendingApplication().getHd1_NamespaceID().getValue();
    }
    /**
     * Recupera il reparto MITTENTE.
     * @return String contenente il reparto del MITTENTE.
     */
    public String getMshRepartoMittente() {
        return this.omg_o19.getMSH().getMsh4_SendingFacility().getHd1_NamespaceID().getValue();
    }    
    /**
     * Recupera l'assign authority del DESTINATARIO.
     * @return String contenente l'assign authority del DESTINATARIO.
     */
    public String getMshAssignAuthorityDestinatario() {
        return this.omg_o19.getMSH().getMsh5_ReceivingApplication().getHd1_NamespaceID().getValue();
    }
    /**
     * Recupera il reparto DESTINATARIO.
     * @return String contenente il reparto del DESTINATARIO.
     */
    public String getMshRepartoDestinatario() {
        return this.omg_o19.getMSH().getMsh6_ReceivingFacility().getHd1_NamespaceID().getValue();
    }
    /**
     * Recupera la data/ora del messaggio.
     * @return String contente la data/ora del messaggio.
     */
    public String getMshDataOraMessaggio() {
        return this.omg_o19.getMSH().getMsh7_DateTimeOfMessage().getTs1_Time().getValue();
    }   
    
    public String getMsh9MessageCode() {
        return this.omg_o19.getMSH().getMsh9_MessageType().getMsg1_MessageCode().getValue();
    }
    public String getMsh9TriggerEvent() {
        return this.omg_o19.getMSH().getMsh9_MessageType().getMsg2_TriggerEvent().getValue();
    }  
    public String getMsh9MessageStructure() {
        return this.omg_o19.getMSH().getMsh9_MessageType().getMsg3_MessageStructure().getValue();
    }      
    
    /**
     * Recupera l'ID di controllo del messaggio (= MSH.7 || = getDataOraMessaggio()).
     * @return String contenente l'ID di controllo del messaggio.
     */
    public String getMshControlloIDMessaggio() {
        return this.omg_o19.getMSH().getMsh10_MessageControlID().getValue();
    }
    public String getMshProcessingID() {
        return this.omg_o19.getMSH().getMsh11_ProcessingID().getPt1_ProcessingID().getValue();
    }
    /**
     * Recupera la versione HL7 utilizzata nella costruzione del messaggio.
     * @return String contenente la versione HL7 del messaggio.
     */
    public String getMshVersione() {
        return this.omg_o19.getMSH().getMsh12_VersionID().getVid1_VersionID().getValue();
    } 
    
    
    /* ###################################################################################### */
    /* #################################### Segmento PID #################################### */
    /* ###################################################################################### */
    /**
     * Recupera l'ID associato alla chiave di ricerca.
     * @param key Chiave di ricerca.
     * @return String contenente l'ID associato alla chiave di ricerca.
     */
    public String getPid3(String key) {
        for (int i = 0; i < this.omg_o19.getPATIENT().getPID().getPid3_PatientIdentifierListReps(); i++) {
            String IDNumber = this.omg_o19.getPATIENT().getPID().getPid3_PatientIdentifierList(i).getCx1_IDNumber().getValue();
            String IdentifierTypeCode = this.omg_o19.getPATIENT().getPID().getPid3_PatientIdentifierList(i).getCx5_IdentifierTypeCode().getValue();
            if (key.equals(IdentifierTypeCode)) {
                return IDNumber;
            }
        }
            
        return "";  
    }
    /**
     * Recupera il cognome del paziente.
     * @return String contenente il cognome del paziente.
     */
    public String getPidCognome() {
        String cognome = this.omg_o19.getPATIENT().getPID().getPid5_PatientNameReps() > 0 ? this.omg_o19.getPATIENT().getPID().getPid5_PatientName(0).getXpn1_FamilyName().getFn1_Surname().getValue() : "";
        return cognome;
    }
    /**
     * Recupera il nome del paziente.
     * @return String contenente il nome del paziente.
     */
    public String getPidNome() {
        String nome = this.omg_o19.getPATIENT().getPID().getPid5_PatientNameReps() > 0 ? this.omg_o19.getPATIENT().getPID().getPid5_PatientName(0).getXpn2_GivenName().getValue() : "";
        return nome;
    }
    /**
     * Recupera la data di nascita del paziente.
     * @return String contenente la data di nascita del paziente.
     */    
    public String getPidDataNascita() {
        return this.omg_o19.getPATIENT().getPID().getPid7_DateTimeOfBirth().getTs1_Time().getValue();
    }
    /**
     * Recupera il sesso del paziente.
     * @return String contenente il sesso del paziente.
     */    
    public String getPidSesso() {
        return this.omg_o19.getPATIENT().getPID().getPid8_AdministrativeSex().getValue();
    }
    
    
    /* ###################################################################################### */
    /* #################################### Segmento PV1 #################################### */
    /* ###################################################################################### */
    /**
     * Recupera la classe del paziente.
     * @return String contenente la classe del paziente.
     */
    public String getPv1ClassePaziente() {
        return this.omg_o19.getPATIENT().getPATIENT_VISIT().getPV1().getPv12_PatientClass().getValue();
    }
    /**
     * Recupera l'iden (iden_pro) della posizione del paziente.
     * @return String contenente l'iden (iden_pro) della posizione del paziente.
     */    
    public String getPv1IdenPosizionePaziente() {
        return this.omg_o19.getPATIENT().getPATIENT_VISIT().getPV1().getPv13_AssignedPatientLocation().getPl1_PointOfCare().getValue();
    }
    /**
     * Recupera il nosologico del paziente.
     * @return String contenente il nosologico del paziente.
     */        
    public String getPv1Nosologico() {
        return this.omg_o19.getPATIENT().getPATIENT_VISIT().getPV1().getPv119_VisitNumber().getCx1_IDNumber().getValue();
    }
    
    
    /* ###################################################################################### */
    /* #################################### Segmento ORC #################################### */
    /* ###################################################################################### */
    /**
     * Recupera il controllo dell'ordine.
     * Valori plausibili
     *   NW : new order
     * @return String contenente il controllo dell'ordine.
     */
    public String getOrcControlloOrdine() {
        return this.omg_o19.getORDER().getORC().getOrc1_OrderControl().getValue();
    }
    
    /**
     * Recupera lo stato dell'ordine.
     * Valori plausibili:
     *   SC : scheduled (prenotazione)
     *   IP : in progress (accettazione)
     * @return 
     */
    public String getOrcControlloStato() {
        return this.omg_o19.getORDER().getORC().getOrc5_OrderStatus().getValue();
    }
    /**
     * Recupera il numero dell'ordine.
     * @return String contenente il numero dell'ordine.
     */
    public String getOrcNumeroOrdine() {
        return this.omg_o19.getORDER().getORC().getOrc2_PlacerOrderNumber().getEi1_EntityIdentifier().getValue();
    }
    /**
     * Recupera il numero della richiesta all'interno dell'ordine.
     * @return String contenente il numero della richiesta.
     */
    public String getOrcNumeroRichiesta() {
        return this.omg_o19.getORDER().getORC().getOrc4_PlacerGroupNumber().getEi1_EntityIdentifier().getValue();
    }   
    /**
     * Recupera la data proposta dell'esame all'interno dell'ordine.
     * @return String contenente la data dell'esame.
     */
    public String getOrcDataPropostaEsame() {
        return  this.omg_o19.getORDER().getORC().getOrc7_QuantityTiming(0).getTq1_Quantity().getCq1_Quantity().getValue().substring(6, 8) + "/" +
        		this.omg_o19.getORDER().getORC().getOrc7_QuantityTiming(0).getTq1_Quantity().getCq1_Quantity().getValue().substring(4, 6) + "/" +
        		this.omg_o19.getORDER().getORC().getOrc7_QuantityTiming(0).getTq1_Quantity().getCq1_Quantity().getValue().substring(0, 4);
    }
    /**
     * Recupera l'ora proposta dell'esame all'interno dell'ordine.
     * @return String contenente l'ora dell'esame.
     */
    public String getOrcOraPropostaEsame() {
        String oraEsame = this.omg_o19.getORDER().getORC().getOrc7_QuantityTimingReps() > 0 ? this.omg_o19.getORDER().getORC().getOrc7_QuantityTiming(0).getTq1_Quantity().getCq1_Quantity().getValue().substring(8, 10)+':'+this.omg_o19.getORDER().getORC().getOrc7_QuantityTiming(0).getTq1_Quantity().getCq1_Quantity().getValue().substring(10, 12) : "";
        return oraEsame;
    }    
    /**
     * Recupera l'urgenza dell'esame/impegnativa all'interno dell'ordine.
     * @param orc Segmento ORC.
     * @return String contenente l'urgenza dell'esame/impegnativa.
     */
    public String getOrcUrgenza(ORC orc) {
        String urgenza = orc.getOrc7_QuantityTimingReps() > 0 ? orc.getOrc7_QuantityTiming(0).getTq6_Priority().getValue() : "0";
        return urgenza != null ? urgenza : "0";
    }
    /**
     * Recupera l'elenco delle urgenze degli esami/impegnative all'interno della richiesta.
     * @return  String contenente l'elenco delle urgenze degli esami/impegnative separate dal #.
     */    
    public String getOrcElencoUrgenze() {
        String elencoUrgenzeImpegnative = "";
        
        elencoUrgenzeImpegnative += getOrcUrgenza(this.omg_o19.getORDER().getORC());
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoUrgenzeImpegnative += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getOrcUrgenza(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getORC()) : "";
        }
        
        return elencoUrgenzeImpegnative;
    }       
    /**
     * Recupera il numero dell'impegnativa all'interno dell'ordine.
     * @param orc Segmento ORC.
     * @return String contenente il numero dell'impegnativa.
     */
    public String getOrcNumeroImpegnativa(ORC orc) {
        String numeroImpegnativa = orc.getOrc8_ParentOrder().getEip1_PlacerAssignedIdentifier().getEi1_EntityIdentifier().getValue();
        return numeroImpegnativa != null ? numeroImpegnativa : "";
    }
    /**
     * Recupera l'elenco dei numeri delle impegnative all'interno della richiesta.
     * @return  String contenente l'elenco dei numeri delle impegnative separati dal #.
     */
    public String getOrcElencoNumeriImpegnative() {
        String elencoNumeroImpegnative = "";
        
        elencoNumeroImpegnative += getOrcNumeroImpegnativa(this.omg_o19.getORDER().getORC());
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoNumeroImpegnative += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getOrcNumeroImpegnativa(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getORC()) : "";
        }
        
        return elencoNumeroImpegnative;
    }    
    /**
     * Recupera la data dell'impegnativa all'interno dell'ordine,
     * @param orc Segmento ORC.
     * @return String contenente la data dell'impegnativa.
     */
    public String getOrcDataImpegnativa(ORC orc) {
        String dataImpegnativa = orc.getOrc9_DateTimeOfTransaction().getTs1_Time().getValue();
        return dataImpegnativa != null ? dataImpegnativa : dataImpegnativa;
    }
    /**
     * Recupera l'elenco delle date delle impegnative all'interno della richiesta.
     * @return  String contenente l'elenco delle date delle impegnative separate dal #.
     */
    public String getOrcElencoDateImpegnative() {
        String elencoDateImpegnative = "";
        
        elencoDateImpegnative += getOrcDataImpegnativa(this.omg_o19.getORDER().getORC());
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoDateImpegnative += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getOrcDataImpegnativa(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getORC()) : "";
        }
        
        return elencoDateImpegnative;
    }      
    /**
     * Recupera l'iden (iden_per) del medico che ha eseguito l'ordine.
     * @return String contenente l'iden (iden_per) del medico.
     */
    public String getOrcIdenMedicoOrdinante() {
        String idenMedicoOrdinante = this.omg_o19.getORDER().getORC().getOrc12_OrderingProviderReps() > 0 ? this.omg_o19.getORDER().getORC().getOrc12_OrderingProvider(0).getXcn1_IDNumber().getValue() : "";
        return idenMedicoOrdinante;
    }
    /**
     * Recupera la struttura dalla quale è stato effettuato l'ordine.
     * @return String contenente la struttura dalla quale è stato effettuato l'ordine.
     */
    public String getOrcStrutturaOrdinante() {
        String strutturaOrdinante = this.omg_o19.getORDER().getORC().getOrc21_OrderingFacilityNameReps() > 0 ? this.omg_o19.getORDER().getORC().getOrc21_OrderingFacilityName(0).getXon1_OrganizationName().getValue() : "";
        return strutturaOrdinante;
    }
    
    
    /* ###################################################################################### */
    /* #################################### Segmento OBR #################################### */
    /* ###################################################################################### */
    /**
     * Recupera il numero progressivo all'interno della richiesta.
     * @return String contenente il numero progressivo.
     */
    public String getObrNumeroProgressivo() {
        return this.omg_o19.getORDER().getOBR().getObr1_SetIDOBR().getValue();
    }
    /**
     * Recupera il numero dell'ordine all'interno della richiesta.
     * @return String contenente il numero dell'ordine.
     */
    public String getObrNumeroOrdine() {
        return this.omg_o19.getORDER().getOBR().getObr2_PlacerOrderNumber().getEi1_EntityIdentifier().getValue();
    }
    /**
     * Recupera l'iden dell'esame all'interno della richiesta.
     * @param obr Segmento OBR.
     * @return String contenente l'iden dell'esame.
     */
    public String getObrIdenEsame(OBR obr) {
        String idenEsame = obr.getObr4_UniversalServiceIdentifier().getCe1_Identifier().getValue();
        return idenEsame != null ? idenEsame : "";
    }  
    /**
     * Recupera l'elenco di iden degli esami all'interno della richiesta.
     * @return  String contenente l'elenco di iden degli esami separati dal #.
     */
    public String getObrElencoIdenEsami() {
        String elencoIdenEsami = "";
        
        elencoIdenEsami += getObrIdenEsame(this.omg_o19.getORDER().getOBR());
                
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoIdenEsami += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getObrIdenEsame(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) : "";
        }
        
        return elencoIdenEsami;
    }       
    /**
     * Recupera la descrizione dell'esame all'interno della richiesta.
     * @param obr Segmento OBR.
     * @return String contenente la descrizione dell'esame.
     */
    public String getObrDescrizioneEsame(OBR obr) {
        return obr.getObr4_UniversalServiceIdentifier().getCe2_Text().getValue();
    }
    /**
     * Recupera l'elenco delle descrizioni degli esami all'interno della richiesta.
     * @return  String contenente l'elenco delle descrizioni degli esami separati dal #.
     */
    public String getObrElencoDescrizioniEsami() {
        String elencoDescrizioneEsami = "";
        
        elencoDescrizioneEsami += getObrDescrizioneEsame(this.omg_o19.getORDER().getOBR());
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoDescrizioneEsami += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getObrDescrizioneEsame(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) : "";
        }
        
        return elencoDescrizioneEsami;
    }
    /**
     * Recupera la lateralità dell'esame all'interno della richiesta.
     * @param obr Segmento OBR.
     * @return String contenente la lateralità dell'esame.
     */
    public String getObrLateralitaEsame(OBR obr) {
        String lateralitaEsame = obr.getObr4_UniversalServiceIdentifier().getCe3_NameOfCodingSystem().getValue();
        return lateralitaEsame != null ? lateralitaEsame : "";
    }
    /**
     * Recupera l'elenco delle lateralità degli esami all'interno della richiesta.
     * @return  String contenente l'elenco delle lateralità degli esami separati dal #.
     */
    public String getObrElencoLateralitaEsami() {
        String elencoLateralitaEsami = "";
        
        elencoLateralitaEsami += getObrLateralitaEsame(this.omg_o19.getORDER().getOBR());
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoLateralitaEsami += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getObrLateralitaEsame(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) : "";
        }
        
        return elencoLateralitaEsami;
    }    
    /**
     * Recupera la data dell'ordine all'interno della richiesta.
     * @return String contenente la data dell'ordine.
     */
    public String getObrDataOrdine() {
        return this.omg_o19.getORDER().getOBR().getObr7_ObservationDateTime().getTs1_Time().getValue();
    }
    
    /**
     * Recupera la data richiesta dell'esame all'interno dell'ordine.
     * @return String contenente la data dell'esame.
     */
    public String getOrcDataRichiestaEsame() {
        return this.omg_o19.getORDER().getOBR().getObr7_ObservationDateTime().getTs1_Time().getValue().substring(6, 8) + "/" +
        		this.omg_o19.getORDER().getOBR().getObr7_ObservationDateTime().getTs1_Time().getValue().substring(4, 6) + "/" +
        		this.omg_o19.getORDER().getOBR().getObr7_ObservationDateTime().getTs1_Time().getValue().substring(0, 4);
    }
    /**
     * Recupera l'ora richiesta dell'esame all'interno dell'ordine.
     * @return String contenente l'ora dell'esame.
     */
    public String getOrcOraRichiestaEsame() {
        return this.omg_o19.getORDER().getOBR().getObr7_ObservationDateTime().getTs1_Time().getValue().substring(8, 10)+
        		':'+this.omg_o19.getORDER().getOBR().getObr7_ObservationDateTime().getTs1_Time().getValue().substring(10, 12);
    }    
    
    /**
     * Recupera il quadro clinico all'interno della richesta.
     * @return String contenente il quadro clinico.
     */
    public String getObrQuadroClinico() {
        return this.omg_o19.getORDER().getOBR().getObr13_RelevantClinicalInformation().getValue();
    }
    /**
     * Recupera il codice di esenzione all'interno della richiesta.
     * @return String contenente il codice di esenzione.
     */
    public String getObrCodiceEsenzione() {
        return this.omg_o19.getORDER().getOBR().getObr23_ChargeToPractice().getMoc2_ChargeCode().getCe1_Identifier().getValue() != null ? this.omg_o19.getORDER().getOBR().getObr23_ChargeToPractice().getMoc2_ChargeCode().getCe1_Identifier().getValue() : null;
    }    
    /**
     * Recupera la data dell'esame all'interno della richiesta.
     * @return String contenente la data dell'esame.
     */
    public String getObrDataEsame() {
        String dataEsame = this.omg_o19.getORDER().getOBR().getObr27_QuantityTimingReps() > 0 ? this.omg_o19.getORDER().getOBR().getObr27_QuantityTiming(0).getTq1_Quantity().getCq1_Quantity().getValue() : "";
        return dataEsame;
    }
    /**
     * Recupera il questio all'interno della richiesta.
     * @return String contenente il quesito.
     */
    public String getObrQuesito() {
        String quesito = this.omg_o19.getORDER().getOBR().getObr31_ReasonForStudyReps() > 0 ? this.omg_o19.getORDER().getOBR().getObr31_ReasonForStudy(0).getCe2_Text().getValue() : "";
        return quesito;
    }  
    /**
     * Recupera il tipo dell'impegnativa all'interno dell'ordine.
     * @param obr Segmento OBR.
     * @return String contenente il tipo dell'impegnativa.
     */
    public String getOrcTipoImpegnativa(OBR obr) {
        String tipoImpegnativa = obr.getObr39_CollectorSCommentReps() > 0 ? obr.getObr39_CollectorSComment(0).getCe1_Identifier().getValue() : "";
        return tipoImpegnativa != null ? tipoImpegnativa : tipoImpegnativa;
    }
    /**
     * Recupera l'elenco dei tipi delle impegnative all'interno della richiesta.
     * @return  String contenente l'elenco dei tipi delle impegnative separati dal #.
     */
    public String getOrcElencoTipiImpegnative() {
        String elencoTipiImpegnative = "";
        
        elencoTipiImpegnative += getOrcTipoImpegnativa(this.omg_o19.getORDER().getOBR());
        for (int i = 0; i < this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIORReps(); i++) {
            elencoTipiImpegnative += !isBug(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) ? "#" + getOrcTipoImpegnativa(this.omg_o19.getORDER().getPRIOR_RESULT().getORDER_PRIOR(i).getOBR()) : "";
        }
        
        return elencoTipiImpegnative;
    }  
    
    
    /* ###################################################################################### */
    /* ####################################### METODI ####################################### */
    /* ###################################################################################### */    
    /**
     * Controllo se il messaggio è un'impegnativa o meno.
     * @return  boolean indicante se è un'impegnativa o no.
     */
    public boolean isImpegnativa() {
        return this.omg_o19.getORDER().getORC().getOrc8_ParentOrder().getEip1_PlacerAssignedIdentifier().getEi1_EntityIdentifier().getValue() != null && !this.omg_o19.getORDER().getORC().getOrc8_ParentOrder().getEip1_PlacerAssignedIdentifier().getEi1_EntityIdentifier().getValue().isEmpty();
    } 
    /**
     * Tracobbetto TEMPORANEO
     * @param obr   Segmento OBR.
     * @return  boolean indicante se stiamo valutando un errore delle api o no.
     */
    public boolean isBug(OBR obr) {
        return obr.getObr1_SetIDOBR().getValue() == null;
    }
    /**
     * Recupera l'urgenza massima dei vari esami/impegnative richieste.
     * @return  String contenente l'urgenza massima dei vari esami/impegnative richieste.
     */
    public String getUrgenzaMax() {
        String urgenza = "0";
        
        String[] temp;
        String delimiter = "#";
        
        String elencoUrgenze = this.getOrcElencoUrgenze();
        
        temp = elencoUrgenze.split(delimiter);
        
        for (String urgenzaNow : temp) {
            urgenza = urgenzaNow != null && Integer.parseInt(urgenza) < Integer.parseInt(urgenzaNow) ? urgenzaNow : urgenza;
        }
        
        return urgenza;
    }
}
