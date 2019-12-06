import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import it.elco.contatti.ControllerProperties
import it.elco.contatti.ControllerProperties.ControllerPropertyKey;
import it.elco.core.actions.LoadPropertiesFile;
import it.elco.fenix.adt.exception.RpcContattoException;
import it.elco.core.converters.Patterns;
import it.elco.core.converters.StringFactory;
import it.elco.database.ResultSetWrapper;
import it.elco.database.converters.PlsInteger;
import it.elco.database.converters.Varchar;
import it.elco.json.Json;

import org.apache.http.HttpVersion;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

success = false;
message = null;

String body, sql;
String repartoPartenzaGiuridico, repartoPartenzaAssistenziale, repartoDestinazioneGiuridico, repartoDestinazioneAssistenziale;

Properties prop = new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/adt.properties")).execute();
String AMQHost = prop.getProperty("AMQHost");
Integer AMQPort = Integer.valueOf(prop.getProperty("AMQPort"));
String AMQUri = prop.getProperty("AMQUri");

String concatenazioneUtenti = "";
ResultSet rsReparti = null;
ResultSet rsUtenti = null;
ResultSetWrapper rsWrapper = null;

Logger logger = LoggerFactory.getLogger("InvioNotificaTrasferimento.groovy");

try{
	
	// Restituisco la descrizione dei reparti di destinazione e partenza del Paziente
	rsWrapper = new ResultSetWrapper("ADT", "SELECT " +
												" (SELECT DESCRIZIONE FROM FX\$CENTRI_DI_COSTO WHERE IDEN = (SELECT IDEN_CDC FROM CONTATTI_GIURIDICI WHERE IDEN = ?)) AS DESTINAZIONE_GIURIDICO, " +
												" (SELECT DESCRIZIONE FROM FX\$CENTRI_DI_COSTO WHERE IDEN = (SELECT IDEN_CDC FROM CONTATTI_ASSISTENZIALI WHERE IDEN = ?)) AS DESTINAZIONE_ASSISTENZIALE, " +
												" (SELECT DESCRIZIONE FROM FX\$CENTRI_DI_COSTO WHERE IDEN = (SELECT IDEN_CDC FROM CONTATTI_ASSISTENZIALI WHERE IDEN = (SELECT IDEN_PRECEDENTE FROM CONTATTI_ASSISTENZIALI WHERE IDEN = ?))) AS PARTENZA_ASSISTENZIALE, " +
												" (SELECT DESCRIZIONE FROM FX\$CENTRI_DI_COSTO WHERE IDEN = (SELECT IDEN_CDC FROM CONTATTI_GIURIDICI WHERE IDEN = (SELECT NVL(IDEN_PRECEDENTE,IDEN) FROM CONTATTI_GIURIDICI WHERE IDEN = ?))) AS PARTENZA_GIURIDICO " +
											"FROM DUAL", 
											PlsInteger.makeIn(contatto.getLastContattoGiuridico().getId()), 
											PlsInteger.makeIn(contatto.getLastContattoAssistenziale().getId()), 
											PlsInteger.makeIn(contatto.getLastContattoAssistenziale().getId()),
											PlsInteger.makeIn(contatto.getLastContattoGiuridico().getId())
										);
	
	rsReparti = rsWrapper.execute();
	
	if (rsReparti.next()) 
	{
		repartoPartenzaGiuridico = rsReparti.getString("PARTENZA_GIURIDICO");
		repartoPartenzaAssistenziale = rsReparti.getString("PARTENZA_ASSISTENZIALE");
		repartoDestinazioneGiuridico = rsReparti.getString("DESTINAZIONE_GIURIDICO");
		repartoDestinazioneAssistenziale = rsReparti.getString("DESTINAZIONE_ASSISTENZIALE");

		logger.debug("Invio notifica trasferimento \n\t method -> " + method +  " \n\t contatto -> " + contatto.getCodice().getCodice() + " \n\t Rep. Giuridico Partenza -> " + repartoPartenzaGiuridico + "\n\t Rep. Giuridico Destinazione -> " +  repartoDestinazioneGiuridico + " \n\t Rep. Assistenziale Partenza -> " + repartoPartenzaAssistenziale + "\n\t Rep.Assistenziale Destinazione -> " + repartoDestinazioneAssistenziale);
	} 
	else 
	{
		success = false;
		message = "Nessun reparto trovato con iden provenienza " + rsReparti.getString("DESCRIZIONE");
		
		throw new RpcContattoException(message);
	} 
	
	rsWrapper.close();
	
	String functionNotifica = contatto.getLastContattoAssistenziale().isAttivo() ? "NS_ADT_API.notificaInfo" : "NS_ADT_API.notificaWarn";
	
	// Il messaggio della notifica cambia a seconda si tratti di un trasferimento o di una richiesta di trasferimento
	// Il trasferimento viene notificato a tutti. La richiesta di trasferimento solo agli infermieri
	if (contatto.getLastContattoAssistenziale().isAttivo())
	{
		sql =  "SELECT DISTINCT (UTENTI.WEBUSER) FROM FX\$UTENTI UTENTI INNER JOIN FX\$WEB_CDC WEB_CDC ON UTENTI.WEBUSER = WEB_CDC.WEBUSER WHERE UTENTI.TIPO IN ('M','I') AND WEB_CDC.REPARTO IN (SELECT COD_CDC FROM FX\$CENTRI_DI_COSTO WHERE CODICE = ?)";
		body = "Il Paziente  " + contatto.getAnagrafica().getCognome() + " " + contatto.getAnagrafica().getNome() + " del " + StringFactory.fromCalendar(contatto.getAnagrafica().getDataNascita(), Patterns.DAY_MONTH_YEAR) + " (codice " + contatto.getCodice().getCodice() + ") &egrave; stato trasferito in data " + StringFactory.fromCalendar(contatto.getLastContattoAssistenziale().getDataInizio(), Patterns.DAY_MONTH_YEAR) + " dal reparto assistenziale " + repartoPartenzaAssistenziale + " presso il reparto giuridico " + repartoDestinazioneGiuridico + " e reparto assistenziale " + repartoDestinazioneAssistenziale ;
	}
	else
	{
		sql =  "SELECT DISTINCT (UTENTI.WEBUSER) FROM FX\$UTENTI UTENTI INNER JOIN FX\$WEB_CDC WEB_CDC ON UTENTI.WEBUSER = WEB_CDC.WEBUSER WHERE WEB_CDC.REPARTO IN (SELECT COD_CDC FROM FX\$CENTRI_DI_COSTO WHERE CODICE = ?) and UTENTI.TIPO = 'I' ";
		body = "<a style=\"text-decoration:none;color:black;\" href=javascript:NS_ADT_API.selezionaTabulatore(\"ACCETTAZIONE_TRASFERIMENTI\",function(){\$(\".ambiance-close\").trigger(\"click\");})>Presente richiesta di trasferimento presso il reparto " + repartoDestinazioneAssistenziale + " per il paziente " + contatto.getAnagrafica().getCognome() + " " + contatto.getAnagrafica().getNome() + " proveniente dal reparto assistenziale " + repartoPartenzaAssistenziale + " e giuridico " + repartoPartenzaGiuridico + "</a>" ;
	}

	try
	{
		rsWrapper = new ResultSetWrapper(ControllerProperties.get(ControllerPropertyKey.KEY_CONNECTION), sql, Varchar.makeIn(contatto.getLastContattoGiuridico().getProvenienza().getCodice(true)));
		rsUtenti = rsWrapper.execute();
		
		while (rsUtenti.next()) {
			
			concatenazioneUtenti += rsUtenti.getString("WEBUSER") + " ";
			
			URI uri = new URIBuilder()
			.setScheme("http")
			.setHost(AMQHost)
			.setPort(AMQPort)
			.setPath(AMQUri)
			.setParameter("JMSDeliveryMode","persistent")
			.setParameter("JMSTimeToLive","36000000")
			.setParameter("type","topic")
			.setParameter("action","JS_CALL")
			.setParameter("function", functionNotifica)
			.setParameter("timeout","0")
			.setParameter("user",rsUtenti.getString("WEBUSER"))
			.build();
			
			Request.Post(uri).addHeader("Content-Type","text/xml; charset=ISO-8859-1")
				.version(HttpVersion.HTTP_1_1)
				.bodyString(body, ContentType.DEFAULT_TEXT)
				.execute().returnContent().asString();
				
			println rsUtenti.getString("WEBUSER");
			
		}
		
		success = true;
	} 
	catch (Exception e) 
	{
		throw new RpcContattoException(e);
	} 
	finally 
	{
        rsWrapper.close();
    }

}catch(Exception ex){
    throw new RpcContattoException(ex);
}