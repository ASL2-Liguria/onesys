import it.elco.contatti.data.ContattoGiuridico
import it.elco.core.actions.LoadPropertiesFile
import it.elco.core.data.RpcResponse
import it.elco.json.Json
import org.apache.http.client.fluent.Request
import org.apache.http.client.utils.URIBuilder
import org.apache.http.conn.HttpHostConnectException
import org.apache.http.entity.ContentType

import java.text.SimpleDateFormat

version = "2.1";
success = false;
message = null;

try{

    Properties prop = new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/ps.properties")).execute();

    uri = prop.getProperty("uri.ps");
    uriEmergenza = prop.getProperty("uriEmergenza.ps");

    switch (method){
        case "transferPatientAssistenziale":
        case "cancelTransferAssistenziale":
            return;
            break;
        case "transferPatientGiuridicoAssistenziale":
        case "cancelTransferGiuridicoAssistenziale":
            method = "modificaAccesso";
            break;
        case "admitVisitNotification":
        case "updatePatientInformation":
        case "cancelAdmission":            
            uri = prop.getProperty("uri.adt");
            uriEmergenza = prop.getProperty("uriEmergenza.adt");
            break;
        default:
            break;
    }

    println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - Invocazione Integrazione Sincrona " + method + " - Version: " + version + ", File di Properties: /config/properties/ps.properties";

    host = prop.getProperty("host");
    port = Integer.valueOf(prop.getProperty("port"));


    String regimeGiuAttuale = contatto.getLastContattoGiuridico().getRegime().getCodice();

    println Json.stringify(contatto);

    int posizione = contatto.getContattiGiuridici().size() > 1 ? contatto.getContattiGiuridici().size() - 2 : contatto.getContattiGiuridici().size() - 1;

    ContattoGiuridico cg = (ContattoGiuridico) contatto.getContattiGiuridici().get(posizione);

    String regimeGiuPrecedente = cg.getRegime().getCodice();

    println "ultimoRegime : " + regimeGiuAttuale + " penultimoRegime : "+ regimeGiuPrecedente + " metodo : " + method;


    /*
    if("OBI".equals(regimeGiuAttuale) && "chiudiAccesso".equals(method)){
        method = "chiusuraOBI";
    }
    if("OBI".equals(regimeGiuPrecedente) && "annullaChiusuraAccesso".equals(method)){
        method = "annullaChiusuraOBI";
    }
    */

	
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - DEBUG - Invocazione Integrazione Sincrona " + method + " - CONTATTO CODICE: " + contatto.getCodice().getCodice() + ", HOST: " + host + ", PORTA: " + port  + ", URI: " + uri;

	URI uriInvoke = new URIBuilder().setScheme("http").setHost(host).setPort(port).setPath(uri + method).build();
	
	String bodyResponse = null;
		
	try 
	{
            bodyResponse = Request.Post(uriInvoke).bodyString(Json.stringify(contatto), ContentType.APPLICATION_JSON).execute().returnContent().asString();
	} 
	catch(HttpHostConnectException e) 
	{
            // La prima Chiamata al middleware è andata in errore. Provo Con il Middleware di emergenza.
            println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - WARN - Invocazione Integrazione Sincrona " + method + " - HOST NON RAGGIUNGIBILE : " + host + ":" + port  + uri ;

            host = prop.getProperty("hostEmergenza");
            port = Integer.valueOf(prop.getProperty("portEmergenza"));

            println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - WARN - Invocazione Integrazione Sincrona " + method + " - INIZIO TENTATIVO TRAMITE HOST: " + host + ":" + port + uriEmergenza;

            uriInvoke = new URIBuilder().setScheme("http").setHost(host).setPort(port).setPath(uriEmergenza + method).build();
            bodyResponse = Request.Post(uriInvoke).bodyString(Json.stringify(contatto), ContentType.APPLICATION_JSON).execute().returnContent().asString();
	}
	
	
	// Se la chiamata non va in errore restituisco la response del middleware
    Map<String, ?> urlResponseMap = Json.marshall(bodyResponse);
    RpcResponse response = new RpcResponse((String) urlResponseMap.get("version"), (Boolean) urlResponseMap.get("success"), (String) urlResponseMap.get("message"));
         
    if (!response.isSuccess()) {
        message = response.getMessage();
            println "Groovy " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - ERROR-  Invocazione Integrazione Sincrona " + method + " - MESSAGE: " + response.getMessage();
    } else {
        success = true;
            println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm:ss").format(new Date()) + " - SUCCESS - Invocazione Integrazione Sincrona " + method + " - MESSAGE: " + response.getMessage();
    }   
    
}
catch(Exception ex)
{
    success = false;
    message = ex.getClass().getName() +"\n" + ex.getMessage()
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - ERROR -  Invocazione Integrazione Sincrona " + method + " - ERROR: " + ex.getClass().getName() +"\n" + ex.getMessage();
} 
catch (IOException e) 
{
	success = false;
    message = e.getClass().getName() +"\n" + e.getMessage()
	println "Groovy - " + new SimpleDateFormat("yyyyMMddHH:mm").format(new Date()) + " - ERROR -  Invocazione Integrazione Sincrona " + method + " - ERROR: " + ex.getClass().getName() +"\n" + ex.getMessage();
}
