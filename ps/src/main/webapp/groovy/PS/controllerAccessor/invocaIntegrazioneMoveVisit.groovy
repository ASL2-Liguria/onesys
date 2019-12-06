import java.io.IOException;
import java.util.Properties;
import java.text.SimpleDateFormat;
import java.util.Date;

import it.elco.core.actions.LoadPropertiesFile;
import it.elco.core.data.RpcResponse
import it.elco.json.Json;

import org.apache.http.client.fluent.Request;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.conn.HttpHostConnectException;


version = "1.0";
success = false;
message = null;

try{     

	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - Version: " + version + ", File di Properties: /config/properties/adt.properties";

    println "CONTATTO -> " + Json.stringify(contatto);
    println "TARGET PATIENT -> " + body;
	Properties prop = new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/ps.properties")).execute();
	
	host = prop.getProperty("host");
	port = Integer.valueOf(prop.getProperty("port"));
	uri = prop.getProperty("uri.ps");
	
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - DEBUG -  Invocazione Integrazione Sincrona " + method + " - CONTATTO CODICE: " + contatto.getCodice().getCodice() +  ", URL -> " + host + ":" + port + uri + ", SOURCE PATIENT -> " + Json.stringify(contatto.getAnagrafica()) + ", TARGET PATIENT -> " + body;

	
	String bodyResponse = null;
	
	URI uriInvoke = new URIBuilder().setScheme("http").setHost(host).setPort(port).setPath(uri + method).addParameter("targetPatient", body).build();

	try
	{
		bodyResponse = Request.Post(uriInvoke).bodyString(Json.stringify(contatto), ContentType.APPLICATION_JSON).execute().returnContent().asString();
	}	
	catch(HttpHostConnectException e)
	{
		println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - WARN - Invocazione Integrazione Sincrona " + method + " - HOST NON RAGGIUNGIBILE : " + host + ":" + port + uri;
		
		host = prop.getProperty("hostEmergenza");
		port = Integer.valueOf(prop.getProperty("portEmergenza"));
		uri = prop.getProperty("uriEmergenza");
		
		println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - WARN - Invocazione Integrazione Sincrona " + method + " - TENTATIVO TRAMITE HOST: " + host + ":" + port + uri;
		
		uriInvoke = new URIBuilder().setScheme("http").setHost(host).setPort(port).setPath(uri + method).addParameter("targetPatient", body).build();
		
		bodyResponse = Request.Post(uriInvoke).bodyString(Json.stringify(contatto), ContentType.APPLICATION_JSON).execute().returnContent().asString();
	}	
    
	// Se la chiamata non va in errore restituisco la response del middleware
    Map<String, ?> urlResponseMap = Json.marshall(bodyResponse);
    RpcResponse response = new RpcResponse((String) urlResponseMap.get("version"), (Boolean) urlResponseMap.get("success"), (String) urlResponseMap.get("message"));
         
    if (!response.isSuccess()) {
		success = false;
        message = response.getMessage();
		println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - ERROR - Invocazione Integrazione Sincrona " + method + " - MESSAGE: " + response.getMessage();
    }else{
        success = true;
		println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - SUCCESS - Invocazione Integrazione Sincrona " + method + " - MESSAGE: " + response.getMessage();
    }   
    
}catch(Exception ex){
    success = false;
    message = ex.getClass().getName() +"\n" + ex.getMessage()
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - ERROR -  Invocazione Integrazione Sincrona " + method + " - ERROR: " + ex.getClass().getName() +"\n" + ex.getMessage();
} catch (IOException e) {
	success = false;
    message = e.getClass().getName() +"\n" + e.getMessage()
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - ERROR -  Invocazione Integrazione Sincrona " + method + " - ERROR: " + ex.getClass().getName() +"\n" + ex.getMessage();
}
