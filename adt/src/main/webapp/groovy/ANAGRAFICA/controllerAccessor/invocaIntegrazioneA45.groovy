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


version = "2.1.4";
success = false;
message = null;

try{     

	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - Version: " + version + ", File di Properties: /config/properties/adt.properties";
	
	Properties prop = new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/adt.properties")).execute();
	
	host = prop.getProperty("host");
	port = Integer.valueOf(prop.getProperty("port"));
	uri = prop.getProperty("uri");
	
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - HOST: " + host + ", PORTA: " + port  + ", URI: " + uri + method + ", TYPE: POST";
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - SourcePatient : " + Json.stringify(sourcePatient) + ", targetPatient: " + body;
	
	URI uri = new URIBuilder()
		.setScheme("http")
		.setHost(host)
		.setPort(port)
		.setPath(uri + method)
		.addParameter("sourcePatient", Json.stringify(sourcePatient))
		.addParameter("targetPatient", body)
		.build();
		
    String bodyResponse = Request.Post(uri)
		.execute()
		.returnContent().asString();    
    
    Map<String, ?> urlResponseMap = Json.marshall(bodyResponse);
    RpcResponse response = new RpcResponse((String) urlResponseMap.get("version"), (Boolean) urlResponseMap.get("success"), (String) urlResponseMap.get("message"));
         
    if(!response.isSuccess()){
        message = response.getMessage();
		println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - ERROR - MESSAGE: " + response.getMessage();
    }else{
        success = true;
		println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - SUCCESS - MESSAGE: " + response.getMessage();
    }   
    
}catch(Exception ex){
    success = false;
    message = ex.getClass().getName() +"\n" + ex.getMessage()
} catch (IOException e) {
	success = false;
    message = e.getClass().getName() +"\n" + e.getMessage()
}
