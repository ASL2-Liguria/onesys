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
package it.elco.whale.actions.scopes.Paziente;

import generic.statements.StatementFromFile;
import generic.statements.Exception.NoDataFoundException;
import imago.http.baseClass.baseUser;
import it.elco.json.actions.Marshall;
import it.elco.privacy.TipologiaAccesso;
import it.elco.privacy.anagrafica.Assistito;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.builders.ElementBuilder;
import it.elco.privacy.exceptions.RichiestaAutorizzazioniException;
import it.elco.privacy.predicates.PredicateFactoryInterface;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.privacy.RichiestaAutorizzazioneFactoryWhale;
import it.elco.whale.privacy.datiLaboratorio.datiLaboratorioPrivacy;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jdom.input.SAXBuilder;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;

/**
 *
 * @author francescog + alessandroa
 */
public class GetIPatientData extends Action {

    public class IPatientDataResponse extends ActionResponse {

        public IPatientDataResponse() {
            super();
            this.setOutParameter(new ActionParameter("data", new LinkedHashMap<String, IPatientData>()));
        }

        public LinkedHashMap<String, IPatientData> getData() {
            return (LinkedHashMap<String, IPatientData>) this.getOutActionParameter("data").getValue();
        }

        public void setIPatientData(String key, IPatientData ipatient_data) {
            this.getData().put(key, ipatient_data);
        }

        public IPatientData getIPatientData(String key) {
            return this.getData().get(key);
        }
    }

    public class IPatientData extends HashMap<String, Object> {

        public IPatientData(String label, String funzione, int livello, String tipo_ute, String coinvolgimentoCura) {
            this.put("label", label);
            this.put("funzione", funzione);
            this.put("livello", livello);
            this.put("tipo_ute", tipo_ute);
            this.put("coinvolgimentoCura", coinvolgimentoCura);
        }

        public String getFunzione() {
            return (String) this.get("funzione");
        }

        public String getLabel() {
            return (String) this.get("label");
        }

        public int getLivello() {
            return (Integer) this.get("livello");
        }

        public String getTipoUte() {
            return (String) this.get("tipo_ute");
        }

		public String getCoinvolgimentoCura() {
			// TODO Auto-generated method stub
			return (String) this.get("coinvolgimentoCura");
		}
    }
    private String provenienza;
    private StatementFromFile sff;
    private HttpSession session;
    IPatientDataResponse response;
    private String id_paziente;
    private final String modalita = "PAZIENTE";
    private String aData;
    private String tipo_med;
    private String iden_anag;
    private int livello;
    private String coinvolgimentoCura;
    private String label;
    private String funzione;
    private String tipo_ute;
    private String[] array_query_controllo;
    private Map<String, Object> configurazioniClasse;
    private Map<String, Object> configurazioneClasseAttributi;
    private RichiestaAutorizzazione richiestaAutoriazzazionePrivacy;
    private String emergenzaMedica;
    private Boolean attivaPrivacy;
    private String fileQuery;
    private String tipologia_accesso;
    private String evento_corrente;    
	@Setter(key = "sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key = "session")
    public void setSession(HttpSession session) {
        this.session = session;
    }

    @Setter(key = "iden_anag")
    public void setIdenAnag(String iden_anag) {
        this.iden_anag = iden_anag;
    }

    @Setter(key = "id_paziente")
    public void setIdPaziente(String id_paziente) {
        this.id_paziente = id_paziente;
    }
    
    
    @Setter(key = "emergenzaMedica")
    public void setEmergenzaMedica(String emergenzaMedica) {
        this.emergenzaMedica = emergenzaMedica;
    }

    @Setter(key = "provenienza")
    public void setProvenienza(String provenienza) {
        this.provenienza = provenienza;
    }     

    @Setter (key = "attivaPrivacy")
    public void setAttivaPrivacy(Boolean attivaPrivacy) {
        this.attivaPrivacy = attivaPrivacy;
    }     

    @Setter(key = "fileQuery")
    public void setFileQuery(String fileQuery) {
        this.fileQuery = fileQuery;
    }      

    @Setter(key = "tipologia_accesso")
    public void setTipologiaAccesso(String tipologia_accesso) {
        this.tipologia_accesso = tipologia_accesso;
    }
    
    @Setter(key = "evento_corrente")
    public void setEventoCorrente(String evento_corrente) {
        this.evento_corrente =evento_corrente;
    }      
    
    @Override
    public IPatientDataResponse execute() throws Throwable {

        if (id_paziente == null && provenienza != "UNISYS") {
            throw new NullPointerException("");
        }
        
        if (this.attivaPrivacy && richiestaAutoriazzazionePrivacy==null){
        	richiestaAutoriazzazionePrivacy = getRichiestaAutorizzazione(new StatementFromFile(session), session, id_paziente, provenienza, "TRUE".equalsIgnoreCase(emergenzaMedica),this.tipologia_accesso,this.evento_corrente);
        }

        
        tipo_med = ((baseUser) this.session.getAttribute("login")).tipo;
        response = new IPatientDataResponse();

        StatementFromFile sff_applicativo = new StatementFromFile(this.session);
        String[] applicativo_menu = sff_applicativo.executeStatement(this.fileQuery, "getMenuLateraleApplicazione", new String[]{provenienza}, 1);
        sff_applicativo.close();
        
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat format1 = new SimpleDateFormat("yyyyMMdd");
        aData = format1.format(cal.getTime());

        StatementFromFile sff_2 = new StatementFromFile(this.session);
        StatementFromFile sff_3 = new StatementFromFile(this.session);
        ResultSet rs = this.sff.executeQuery("iPatient.xml", "getMenuLaterale", new String[]{applicativo_menu[2]});
        String errorFunzione = "";
        String valoriToField = "";
        
        
        while (rs.next()) {
            livello = 0;
            coinvolgimentoCura = "";
            funzione = rs.getString("FUNZIONE");
            label = rs.getString("LABEL");
            tipo_ute = rs.getString("TIPO_UTE");
//  		array_query_controllo = rs.getString("QUERY").split("\\|");
            configurazioniClasse = new Marshall(rs.getString("CLASSE")).execute();
//	Determino quale configurazione scegliere			            
            configurazioneClasseAttributi = (Map<String, Object>) configurazioniClasse.get(this.attivaPrivacy?"privacy":"noprivacy");
            
            array_query_controllo = configurazioneClasseAttributi.get("query").toString().split("\\|");
            valoriToField		  = configurazioneClasseAttributi.get("campi").toString();
            
            List filteredList = null;
//          Se il parametro attivaPrivacy =="FALSE", rimuovo i valore del predicato e del builder -> comportamento senza privacy 
//            if (!"TRUE".equalsIgnoreCase(this.attivaPrivacy)){
//                configurazioniClasse.remove("predicateFactory");
//                configurazioniClasse.remove("builder");
//            }
            if (!id_paziente.equalsIgnoreCase("")) {

                for (int i = 0; i < array_query_controllo.length; i++) {                   
                    ResultSet rsBtn = null;
                    String[] rsBtnStr = null;
//	Controllo se nella configurazione la tipologia di statementfromfile da usare
                    if ("QUERY".equals(configurazioneClasseAttributi.get("tipoSff"))) {
            			rsBtn = sff_2.executeQuery(this.fileQuery, array_query_controllo[i],generaArrayQuery(valoriToField));
//                        rsBtn = sff_2.executeQuery(this.fileQuery, array_query_controllo[i], new String[]{getFieldValue(valoriToField)});
                    }else if ("".equals(configurazioneClasseAttributi.get("tipoSff"))) {
//	Controllo per il patient-summary
                    	if (this.attivaPrivacy){
                        	coinvolgimentoCura = richiestaAutoriazzazionePrivacy.getCoinvolgimentoNellaCura().isCoinvolto()?"S":"N";                    		
                    	}else{
                    		coinvolgimentoCura = "S";
                    	}
                    	
                    	livello += 1;
					}
                    else
                    {
//	Procedura                     	
//                        String [] paramQueryXml = valoriToField.split(",");
                        rsBtnStr = sff_3.executeStatement(this.fileQuery, array_query_controllo[i], generaArrayQuery(valoriToField),2);                        
//                        rsBtnStr = sff_3.executeStatement(this.fileQuery, array_query_controllo[i], new String[]{
//                            getFieldValue(paramQueryXml[0]),
//                            getFieldValue(paramQueryXml[1]),
//                            getFieldValue(paramQueryXml[2]),
//                            getFieldValue(paramQueryXml[3]),
//                            getFieldValue(paramQueryXml[4]),
//                            getFieldValue(paramQueryXml[5]),
//                            getFieldValue(paramQueryXml[6]),
//                            getFieldValue(paramQueryXml[7]),
//                            getFieldValue(paramQueryXml[8]),
//                            getFieldValue(paramQueryXml[9]),
//                            getFieldValue(paramQueryXml[10]),
//                            getFieldValue(paramQueryXml[11])
//                            },2);
                    }
                    //Rimosso il controllo su builder e aggiunto il controllo sulla presenza della chiave
                    if (!"".equals(configurazioneClasseAttributi.get("predicateFactory"))) {
                        if ( configurazioneClasseAttributi.containsKey("datiLaboratorioImpl")){
//	Richiama la funzione dei dati di laboratorio semplificata
                            if (rsBtnStr[0]=="OK"){
                                org.jdom.Document xmlToProcess;
                                InputStream is = new ByteArrayInputStream(rsBtnStr[2].getBytes());
                                SAXBuilder builder = new SAXBuilder();
                                xmlToProcess = builder.build(new InputStreamReader(is, "ISO-8859-1"));
                                Map<String,Object> mapPrivacyParameter = Paziente();
                                mapPrivacyParameter.put("builderClass",configurazioneClasseAttributi.get("builder"));
                                mapPrivacyParameter.put("predicateClass",configurazioneClasseAttributi.get("predicateFactory"));
                                mapPrivacyParameter.put("query",configurazioneClasseAttributi.get("queryPredicate"));
                                mapPrivacyParameter.put("codice_utente",((baseUser) this.session.getAttribute("login")).cod_dec);
                                mapPrivacyParameter.put("sff",new StatementFromFile(this.session));
                                mapPrivacyParameter.put("tipologia_accesso", this.tipologia_accesso);
                                mapPrivacyParameter.put("evento_corrente",this.evento_corrente);
                                Class clazzDatiLaboratorio = Class.forName((String) configurazioneClasseAttributi.get("datiLaboratorioImpl")); 
                                datiLaboratorioPrivacy interfaceDatiLaboratorio = (datiLaboratorioPrivacy)clazzDatiLaboratorio.getDeclaredConstructor(new Class[]{Map.class ,org.jdom.Document.class }).newInstance(new Object[]{mapPrivacyParameter,xmlToProcess});
                                filteredList = interfaceDatiLaboratorio.gestionePrivacy();                                
                            }else{
                                errorFunzione = rsBtnStr[0] + " " + rsBtnStr[1];
                            }
                        }else{
//  Gestione Privacy per tutti i casi che non sono i dati di laboratorio
                            Class clazzBuilder = Class.forName((String) configurazioneClasseAttributi.get("builder"));
                            ElementBuilder builder = (ElementBuilder) clazzBuilder.newInstance();
                      
                            Class clazzPredicateFactory = Class.forName((String) configurazioneClasseAttributi.get("predicateFactory"));
                            PredicateFactoryInterface predicateFactory =(PredicateFactoryInterface) clazzPredicateFactory.newInstance();
                            Predicate predicate = predicateFactory.getPredicate(richiestaAutoriazzazionePrivacy, builder);
                        
                            filteredList = Lists.newArrayList(Iterables.filter(new org.apache.commons.dbutils.handlers.MapListHandler().handle(rsBtn), predicate));
                        }
                    }else{
                    	if ( "QUERY".equals(configurazioneClasseAttributi.get("tipoSff"))) {	                 
	                        if (rsBtn.next()) {
//	Gestione Senza Privacy per tutti i bottoni
//	                         	livello += "PATIENT_SUMMARY".equalsIgnoreCase(funzione) ? "FALSE".equalsIgnoreCase(this.emergenzaMedica) ? rsBtn.getInt("LIVELLO") : 1 : rsBtn.getInt("LIVELLO");
                                if ("FALSE".equalsIgnoreCase(this.emergenzaMedica)) {
                                    livello += rsBtn.getInt("LIVELLO");
                                } else {
                                    livello += 1;
                                }  
	                        }
                    	}else if ("".equals(configurazioneClasseAttributi.get("tipoSff"))){
                    		if ("PATIENT_SUMMARY".equalsIgnoreCase(funzione)) {
                                if ("FALSE".equalsIgnoreCase(this.emergenzaMedica)) {
                                    livello += 0;
                                } else {
                                    livello += 1;
                                }
                            }
                    	}else{
                    		throw new NoDataFoundException(this, "iPatient.xml", array_query_controllo[i], new String[]{provenienza});
                    	}
                    }
                    try{
                        if (!(rsBtn==null))
                            rsBtn.close();
                    }catch(NullPointerException ex){
                        
                    }
                    
                    rsBtnStr=null;
                }
                
                // Add Oggetto IPatientData to IPatientDataResponse.data
                IPatientData data = new IPatientData(label, funzione, configurazioneClasseAttributi.get("predicateFactory") != "" ? filteredList.size() : livello, tipo_ute, coinvolgimentoCura);
                response.setIPatientData(rs.getString("FUNZIONE"), data);

            } else {
                IPatientData data = new IPatientData(rs.getString("LABEL"), rs.getString("FUNZIONE"), 0, "", coinvolgimentoCura);
                response.setIPatientData(rs.getString("FUNZIONE"), data);
            }
        }
        rs.close();
        sff_2.close();
        sff_3.close();
        this.sff.close();

        return response;
    }

    public String getIdPaziente() throws Throwable {
        ResultSet rs_id_paziente = this.sff.executeQuery("iPatient.xml", "getIdPaziente", new String[]{iden_anag});

        if (rs_id_paziente.next()) {
            id_paziente = rs_id_paziente.getString("ID1");
        } else {
            throw new NoDataFoundException(this, "iPatient.xml", rs_id_paziente.getString("QUERY"), new String[]{"iPatientData - GET ID PAZIENTE : "});
        }

        rs_id_paziente.close();

        return id_paziente;
    }

    public static IPatientDataResponse execute(StatementFromFile sff, HttpSession session, String id_paziente, String provenienza) throws Throwable {
        GetIPatientData ipatient_data = new GetIPatientData();

        ipatient_data.setSession(session);
        ipatient_data.setStatementFromFile(sff);
        ipatient_data.setIdPaziente(id_paziente);
        ipatient_data.provenienza = provenienza;
        
        ipatient_data.richiestaAutoriazzazionePrivacy = getRichiestaAutorizzazione(new StatementFromFile(session),session,id_paziente,provenienza,false);

        return ipatient_data.execute();
    }



	public static IPatientDataResponse execute(StatementFromFile sff, HttpSession session, String id_paziente, String provenienza, String emergenzaMedica) throws Throwable {
        GetIPatientData ipatient_data = new GetIPatientData();

        ipatient_data.setSession(session);
        ipatient_data.setStatementFromFile(sff);
        ipatient_data.setIdPaziente(id_paziente);
        ipatient_data.provenienza = provenienza;
        ipatient_data.setEmergenzaMedica(emergenzaMedica);
        ipatient_data.richiestaAutoriazzazionePrivacy = getRichiestaAutorizzazione(new StatementFromFile(session),session,id_paziente,provenienza,"TRUE".equalsIgnoreCase(emergenzaMedica));

        return ipatient_data.execute();
    }    

	public static IPatientDataResponse execute(StatementFromFile sff, HttpSession session, String id_paziente, String provenienza, String emergenzaMedica, boolean attivaPrivacy, String fileQuery) throws Throwable {
        GetIPatientData ipatient_data = new GetIPatientData();

        ipatient_data.setSession(session);
        ipatient_data.setStatementFromFile(sff);
        ipatient_data.setIdPaziente(id_paziente);
        ipatient_data.provenienza = provenienza;
        ipatient_data.setEmergenzaMedica(emergenzaMedica);
        ipatient_data.setAttivaPrivacy(attivaPrivacy);
        ipatient_data.setFileQuery(fileQuery);
        /*Se il parametro attivaPrivacy è TRUE allora richiamo la richiesta di autorizzazione*/
        if (attivaPrivacy){
            ipatient_data.richiestaAutoriazzazionePrivacy = getRichiestaAutorizzazione(new StatementFromFile(session),session,id_paziente,provenienza,"TRUE".equalsIgnoreCase(emergenzaMedica));        	
        }

        return ipatient_data.execute();
    }   	

	public static IPatientDataResponse execute(StatementFromFile sff, HttpSession session, String id_paziente, String provenienza, String emergenzaMedica, boolean attivaPrivacy, String fileQuery, String tipologia_accesso, String evento_corrente) throws Throwable {
        GetIPatientData ipatient_data = new GetIPatientData();

        ipatient_data.setSession(session);
        ipatient_data.setStatementFromFile(sff);
        ipatient_data.setIdPaziente(id_paziente);
        ipatient_data.provenienza = provenienza;
        ipatient_data.setEmergenzaMedica(emergenzaMedica);
        ipatient_data.setAttivaPrivacy(attivaPrivacy);
        ipatient_data.setFileQuery(fileQuery);
        ipatient_data.setTipologiaAccesso(tipologia_accesso);
        ipatient_data.setEventoCorrente(evento_corrente);
        /*Se il parametro attivaPrivacy è TRUE allora richiamo la richiesta di autorizzazione*/
        if (attivaPrivacy){
            ipatient_data.richiestaAutoriazzazionePrivacy = getRichiestaAutorizzazione(new StatementFromFile(session),session,id_paziente,provenienza,"TRUE".equalsIgnoreCase(emergenzaMedica),tipologia_accesso,evento_corrente);        	
        }

        return ipatient_data.execute();
    } 	
	
	private String getFieldValue(String field_name) throws IllegalArgumentException, SecurityException, IllegalAccessException, NoSuchFieldException {
        String retFieldValue = "";
        Field fdl = null;
        try{
            fdl = this.getClass().getDeclaredField(field_name);
            retFieldValue = (String) fdl.get(this);
        }catch (NoSuchFieldException ex){
            retFieldValue = "";
        }
        return retFieldValue;
    }
    
    public Map<String,Object> Paziente() throws Throwable {
        Map<String,Object> mapPaziente = null;
        StatementFromFile sffPaziente = new StatementFromFile(session);
        try{

            String[] rs_id_paziente = sffPaziente.executeStatement("iPatient.xml", "getInfoPaziente", new String[]{id_paziente},9);
            if (rs_id_paziente[0] == "KO" && rs_id_paziente[1] == "no data found") {
                return null;
            }else{
                mapPaziente = new HashMap<String, Object>();
                mapPaziente.put("iden_anag",rs_id_paziente[2]);
                mapPaziente.put("nome",rs_id_paziente[3]);
                mapPaziente.put("cognome",rs_id_paziente[4]);
                mapPaziente.put("data_nascita",rs_id_paziente[5]);
                mapPaziente.put("cod_fisc",rs_id_paziente[6]);
                mapPaziente.put("id_remoto",rs_id_paziente[7]);
                mapPaziente.put("com_nasc",rs_id_paziente[8]);
                mapPaziente.put("sesso",rs_id_paziente[9]);
                mapPaziente.put("consenso",rs_id_paziente[10]);
            }
        }catch(Exception ex){
            
        }finally{
            sffPaziente.close();
        }
        return mapPaziente;
                
    }
      
	private static RichiestaAutorizzazione getRichiestaAutorizzazione(StatementFromFile sff, HttpSession session, String id_paziente, String provenienza, boolean emergenzaMedica) 
			throws RichiestaAutorizzazioniException, InstantiationException, IllegalAccessException, ClassNotFoundException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException, IOException {

		RichiestaAutorizzazione richAutorizzazione = null;
		richAutorizzazione = RichiestaAutorizzazioneFactoryWhale.makeRichiestaAutorizzazione(getAssistito(id_paziente, provenienza, sff),((baseUser) session.getAttribute("login")).cod_dec);
		richAutorizzazione.setEmergenzaMedica(emergenzaMedica);
		return richAutorizzazione;
	}
    
	private static RichiestaAutorizzazione getRichiestaAutorizzazione(StatementFromFile sff, HttpSession session, String id_paziente, String provenienza, boolean emergenzaMedica, String tipologiaAccesso,String eventoCorrente) 
			throws RichiestaAutorizzazioniException, InstantiationException, IllegalAccessException, ClassNotFoundException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException, IOException {

		RichiestaAutorizzazione richAutorizzazione = null;
		richAutorizzazione = RichiestaAutorizzazioneFactoryWhale.makeRichiestaAutorizzazione(getAssistito(id_paziente, provenienza, sff),((baseUser) session.getAttribute("login")).cod_dec);
		richAutorizzazione.setEmergenzaMedica(emergenzaMedica);
		richAutorizzazione.setTipologiaAccesso(checkTipologiaAccesso(tipologiaAccesso), new Evento(eventoCorrente));
		return richAutorizzazione;
	}
	
    private static Assistito getAssistito(String id_paziente2, String provenienza, StatementFromFile sffAssistito){
    	Assistito assistito = new Assistito("GALLERY",id_paziente2);
        ResultSet rs = null;
		try {
			rs = sffAssistito.executeQuery("iPatient.xml", "getDatiPaziente", new String[]{id_paziente2});
			if (rs.next()) {
			    assistito.setCodiceFiscale(rs.getString("CODICE_FISCALE"));
			    assistito.setCognome(rs.getString("COGNOME"));
			    assistito.setComuneNascita(rs.getString("COMUNE_NASCITA"));
			    assistito.setDataNascita(rs.getString("DATA_NASCITA"));
			    assistito.setNome(rs.getString("NOME"));
			    assistito.setSesso(rs.getString("SESSO")); 
			    
			    assistito.setIdentificativoAnagrafica("WHALE", rs.getString("IDEN"));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			try {
				rs.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			sffAssistito.close();
		
    }
		return assistito;
    }
		
    
    private String[] generaArrayQuery(String value) throws IllegalArgumentException, SecurityException, IllegalAccessException, NoSuchFieldException{
    	String [] paramQueryXml = value.split(",");
		List<String> a = new ArrayList<String>();
		for (String i1 : paramQueryXml){
			a.add(getFieldValue(i1));
		}
		String[] arBind = new String[a.size()];
		a.toArray(arBind);
    	
		return arBind;
    	
    }
    
    private static TipologiaAccesso checkTipologiaAccesso(String tipologiaAccesso){
    	if ("REPERIBILITA".equalsIgnoreCase(tipologiaAccesso)){
    		return TipologiaAccesso.REPERIBILITA;
    	}else if ("EMERGENZA".equalsIgnoreCase(tipologiaAccesso)){
    		return TipologiaAccesso.EMERGENZA;
    	}else if ("SOSTITUZIONE_INFERMIERISTICA".equalsIgnoreCase(tipologiaAccesso)){
    		return TipologiaAccesso.SOSTITUZIONEINFERMIERISTICA;
    	}else{
    		return TipologiaAccesso.STANDARD;
    	}
    }
    
}
