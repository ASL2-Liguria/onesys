import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import it.elco.core.actions.LoadPropertiesFile;
import it.elco.fenix.adt.exception.RpcContattoException;
import it.elco.database.ResultSetWrapper;
import it.elco.database.converters.Varchar;
import it.elco.core.converters.Patterns;
import it.elco.core.converters.StringFactory;

import org.apache.http.HttpVersion;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

success = false;
String message = null;

Properties prop = new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/adt.properties")).execute();

String AMQHost = prop.getProperty("AMQHost");
Integer AMQPort = Integer.valueOf(prop.getProperty("AMQPort"));
String AMQUri = prop.getProperty("AMQUri");

Logger logger = LoggerFactory.getLogger("NotificaDimissioneForzata.groovy");

try{
	
    if("dischargeVisit".equals(method) && contatto.isChiusuraForzata()) {
    
		String sqlUtentiReparto =  "SELECT DISTINCT (UTENTI.WEBUSER) FROM FX\$UTENTI UTENTI INNER JOIN FX\$WEB_CDC WEB_CDC ON UTENTI.WEBUSER = WEB_CDC.WEBUSER WHERE UTENTI.TIPO IN ('M','I') WEB_CDC.REPARTO IN (SELECT COD_CDC FROM FX\$CENTRI_DI_COSTO WHERE CODICE = ?)";
		String body =  "Il Paziente  " + contatto.getAnagrafica().getCognome() + " " + contatto.getAnagrafica().getNome() + " del " + StringFactory.fromCalendar(contatto.getAnagrafica().getDataNascita(), Patterns.DAY_MONTH_YEAR) + " (codice " + contatto.getCodice().getCodice() + ") &egrave stato dimesso forzatamente in data " + StringFactory.fromCalendar(contatto.getDataFine(), Patterns.DAY_MONTH_YEAR) + " causa inserimento ricovero ORDINARIO";
		
		String concatenazioneUtenti = "";
		
		ResultSet rs = null;
		ResultSetWrapper rsWrapper = null;
		
		try
		{
			rsWrapper = new ResultSetWrapper("ADT", sqlUtentiReparto, Varchar.makeIn(contatto.getLastContattoGiuridico().getProvenienza().getCodice(true)));
			rs = rsWrapper.execute();
			
			while (rs.next()) {
				
				concatenazioneUtenti += rs.getString("WEBUSER") + " ";

				URI uri = new URIBuilder()
				.setScheme("http")
				.setHost(AMQHost)
				.setPort(AMQPort)
				.setPath(AMQUri)
				.setParameter("JMSDeliveryMode","persistent")
				.setParameter("JMSTimeToLive","36000000")
				.setParameter("type","topic")
				.setParameter("action","NOTICE")
				.setParameter("title","notifica")
				.setParameter("timeout","0")
				.setParameter("user",rs.getString("WEBUSER"))
				.build();

				Request.Post(uri).addHeader("Content-Type","text/xml; charset=ISO-8859-1")
					.version(HttpVersion.HTTP_1_1)
					.bodyString(body, ContentType.DEFAULT_TEXT)
					.execute().returnContent().asString();
			}
			
			success = true;
			message = " method : " + method +  " | contatto: " + contatto.getCodice().getCodice() + " | sqlUtentiReparto: " + sqlUtentiReparto
		} 
		catch (URISyntaxException | SQLException | IOException e) 
		{
			throw new RpcContattoException(e);
		} 
		finally 
		{
            rsWrapper.close();
        }

    } else {

		success = true;
		message = "Invio Notifica Dimissione Forzata - Il Ricovero " + contatto.getCodice().getCodice() + " Non è una dimissione forzata. Non invio notifiche ad altri utenti di reparto";
	}
    
}catch(Exception ex){
    throw new RpcContattoException(ex);
}