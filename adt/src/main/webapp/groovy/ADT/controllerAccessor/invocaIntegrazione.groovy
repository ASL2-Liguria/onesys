import it.elco.caronte.factory.utils.CaronteFactory
import oracle.jdbc.OracleTypes
import it.elco.fenix.adt.exception.RpcContattoException;
import it.elco.core.actions.LoadPropertiesFile;
import it.elco.core.data.RpcResponse
import it.elco.json.Json;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.conn.HttpHostConnectException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


version = "2.1.2";
success = false;
message = null;
idenEvento = 0;


Properties prop = new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/adt.properties")).execute();

RpcResponse response;
String bodyResponse = null;

String host = prop.getProperty("host");
Integer port = Integer.valueOf(prop.getProperty("port"));
String uri = prop.getProperty("uri");

Logger logger = LoggerFactory.getLogger("InvocaIntegrazioneSincrona.groovy");



/***************************** FUNZIONI PER INSERIMENTO/MODFICA EVENTI SULLA TABELLA EVENTI_INTEGRAZIONI **************/
def generaEvento = { idenContatto, url, json ->
	callProcedure = CaronteFactory.getFactory().createCallProcedure("ADT");

	callProcedure.setSqlInParameter("P_STATO", "0", OracleTypes.VARCHAR);
	callProcedure.setSqlInParameter("P_IDEN_CONTATTO", idenContatto, OracleTypes.INTEGER);
	callProcedure.setSqlInParameter("P_URL", url, OracleTypes.VARCHAR);
	callProcedure.setSqlInParameter("P_JSON", json, OracleTypes.CLOB);
	callProcedure.setSqlInParameter("P_SITO", "ADT", OracleTypes.VARCHAR);

	callProcedure.setSqlOutParameter("P_IDEN", OracleTypes.INTEGER);

	return callProcedure.execute("PCK_EVENTI_INTEGRAZIONI.INSERISCI");
}
def elaboraEvento = {idenEvento, idenContatto ->
	callProcedure = CaronteFactory.getFactory().createCallProcedure("ADT");

	callProcedure.setSqlInParameter("P_IDEN", idenEvento, OracleTypes.INTEGER);
	callProcedure.setSqlInParameter("P_IDEN_CONTATTO", idenContatto, OracleTypes.INTEGER);
	callProcedure.setSqlInParameter("P_STATO", "1", OracleTypes.VARCHAR);
	callProcedure.setSqlInParameter("P_SITO", "ADT", OracleTypes.VARCHAR);

	callProcedure.execute("PCK_EVENTI_INTEGRAZIONI.ELABORA_EVENTO");
}
def segnalaErrore = {idenEvento, idenContatto, messaggioErrore ->
	callProcedure = CaronteFactory.getFactory().createCallProcedure("ADT");

	callProcedure.setSqlInParameter("P_IDEN", idenEvento, OracleTypes.INTEGER);
	callProcedure.setSqlInParameter("P_IDEN_CONTATTO", idenContatto, OracleTypes.INTEGER);
	callProcedure.setSqlInParameter("P_MESSAGGIO", messaggioErrore, OracleTypes.CLOB);
	callProcedure.setSqlInParameter("P_STATO", "2", OracleTypes.VARCHAR);
	callProcedure.setSqlInParameter("P_SITO", "ADT", OracleTypes.VARCHAR);

	callProcedure.execute("PCK_EVENTI_INTEGRAZIONI.SEGNALA_ERRORE");
}



try{

	if ("FENIX-ARCHIVIO".equalsIgnoreCase(contatto.getCodice().getAssigningAuthority())){
		logger.info("method : " + method +  " | contatto: " + contatto.getCodice().getCodice() + " Inserimento contatto storico. Blocco l'integrazione");
		return;
	}

	URI uriInvoke = new URIBuilder().setScheme("http").setHost(host).setPort(port).setPath(uri + method).build();

	logger.debug("method : " + method +  " | contatto: " + contatto.getCodice().getCodice() + " | host: " + host + ":" + port + uri);

	try {

		idenEvento = generaEvento(contatto.getId(), uriInvoke, Json.stringify(contatto));
		logger.debug("PCK_EVENTI_INTEGRAZIONI - EVENTO INSERITO CON IDEN = " + idenEvento);

		bodyResponse = Request.Post(uriInvoke).bodyString(Json.stringify(contatto), ContentType.APPLICATION_JSON).execute().returnContent().asString();

		elaboraEvento(idenEvento, contatto.getId());
		logger.debug("PCK_EVENTI_INTEGRAZIONI -  EVENTO ELABORATO CORRETTAMENTE PER IDEN = " + idenEvento);

	}
	catch(HttpHostConnectException e) {

		// Chiamata al Middleware di emergenza.
		host = prop.getProperty("hostEmergenza");
		port = Integer.valueOf(prop.getProperty("portEmergenza"));
		uri = prop.getProperty("uriEmergenza");

		logger.warn("Invoco Middleware Emergenza \n\t method -> " + method +  " \n\t contatto: " + Json.stringify(contatto) + " \n\t host -> " +  host + ":" + port + uri + " \n\t exception -> " + e.getMessage());

		uriInvoke = new URIBuilder().setScheme("http").setHost(host).setPort(port).setPath(uri + method).build();

		bodyResponse = Request.Post(uriInvoke).bodyString(Json.stringify(contatto), ContentType.APPLICATION_JSON).execute().returnContent().asString();

		elaboraEvento(idenEvento, contatto.getId());
		logger.debug("PCK_EVENTI_INTEGRAZIONI.EMERGENZA -  EVENTO ELABORATO CORRETTAMENTE PER IDEN = " + idenEvento);
	}

    Map<String, ?> urlResponseMap = Json.marshall(bodyResponse);
    response = new RpcResponse((String) urlResponseMap.get("version"), (Boolean) urlResponseMap.get("success"), (String) urlResponseMap.get("message"));

    if (!response.isSuccess()) {

		message = response.getMessage();
		success = false;

		segnalaErrore(idenEvento, contatto.getId(), message);
		logger.error("PCK_EVENTI_INTEGRAZIONI. Success = FALSE -  EVENTO IN ERRORE PER IDEN = " + idenEvento);

		throw new RpcContattoException("Invoca Integrazione Sincrona method -> " + method +  " \n\t contatto: " + Json.stringify(contatto) + " \n\t response -> " + message);

    } else {

        success = true;
		message = response.getMessage();

    }

} catch(Exception ex) {

	success = false;
	message = ex.getClass().getName() +"\n" + ex.getMessage();

	logger.error("Invocazione Integrazione Sincrona " + method + " - ERROR: " + ex.getClass().getName() +"\n" + ex.getMessage(), ex);

	segnalaErrore(idenEvento, contatto.getId(), message);
	logger.error("PCK_EVENTI_INTEGRAZIONI -  EVENTO IN ERRORE PER IDEN = " + idenEvento);

    throw new RpcContattoException(ex);
}