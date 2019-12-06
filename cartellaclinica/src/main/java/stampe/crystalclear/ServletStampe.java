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
package stampe.crystalclear;



import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.sql.Connection;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import matteos.database.DbException;
import matteos.database.DbUtils;
import matteos.servlets.Logger;
import matteos.servlets.MimeUtils;
import matteos.servlets.ServletBase;
import matteos.servlets.polaris.PolarisContext;

import com.inet.report.Engine;

import core.database.PoolConnections;
import core.database.PoolFactory;


/**
 * Fantasiosamente, un wrapper per le stampe nei panni di una servlet.
 * 
 * La servlet riceve parametri da tre fonti: ServletContext, GET e/o POST,
 * file di configurazione esterno (xml, opzionale, letto ad ogni esecuzione).
 * Al suo interno conserva i parametri in un oggetto unico senza distinguerne
 * l'origine, e pertanto puo' aver luogo un fenomeno di sovrascrittura
 * (con il criterio per cui l'ultima fonte che imposta un parametro e' quella
 * "vincente" - la sequenza e' context, file di configurazione, GET/POST).
 *
 * Dal <strong>context</strong> vengono letti <strong>solo questi parametri</strong>: ReportPath, ConfFilePath.
 * 
 * <h3>Parametri specificabili per la servlet attraverso web.xml.</h3>
 * 
 * <dt>ConfFilePath</dt>
 * <dd>Il path relativo (alla root del context) in cui si trova il file di configurazione
 * (esempio "WEB-INF/conf_stampe.xml"). Il file ha un nodo radice con un nome arbitrario; 
 * i nomi delle proprieta' corrispondono ai tag, e i rispettivi valori corrispondono al 
 * contenuto dei tag. Se il parametro ConfFilePath e' vuoto o non presente, il file non viene 
 * letto.</dd>
 * 
 * @author matteos
 *
 */
public class ServletStampe extends ServletBase {

	
	/**
	 * Richiamato da doGet, a sua volta richiamato da doPost (quindi entra in funzione
	 * sia con GET che con POST).
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	protected void processRequest (HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		ElcoLoggerInterface log = Logger.getLogger();
		
		HttpSession session = request.getSession(false);
		
		log.debug("Client - Indirizzo: " + request.getRemoteAddr() + " - Host: " + request.getRemoteHost());
		
		Parametri params = new Parametri();
		
		//lettura da context
		if (! params.getFromServletContext(context,Parametri.param_stampeReportFolder))
			params.setReportFolder(context.getRealPath("") + "/report");
		
		params.getAllFromHttpServletRequest(request);

		boolean is_binary = true;
		
		if (params.getOutputFormat().matches(Engine.EXPORT_HTML + ".*"))
			is_binary = MimeUtils.setContentTypeByExtension(response,"html");
		if (params.getOutputFormat().equalsIgnoreCase(Engine.EXPORT_PDF))
			is_binary = MimeUtils.setContentTypeByExtension(response,"pdf");
		if (params.getOutputFormat().equalsIgnoreCase(Engine.EXPORT_RTF))
			is_binary = MimeUtils.setContentTypeByExtension(response,"rtf");
		if (params.getOutputFormat().equalsIgnoreCase(Engine.EXPORT_XML))
			is_binary = MimeUtils.setContentTypeByExtension(response,"xml");
		OutputStream sos = response.getOutputStream();
		
		if (!is_binary) sos = new PrintStream(sos);
		
		/*
		 * Se presa dall'utente non la chiudo, negli altri casi si'. Un array lungo 1 perche' cosi' e' by reference.
		 */
		boolean[] close_connection_after = new boolean[]{true};
		// Cerca di aprire la connessione prendendo da: sessione oppure pool
		Connection conn = getConnection(session,log,params,close_connection_after);
		
		try {
			new StampeEngine(params,sos,conn);
		} catch (ImagoStampeException e) {
			Logger.getLogger().error(e);
		} catch (Exception e) {
			Logger.getLogger().error("Eccezione non gestita - ", e);
		} finally {
			if (sos != null)
				sos.close();
			sos = null;
			
			if (close_connection_after[0])
				try {conn.close();} catch (Exception f) {}
			conn = null;
		}
	}
    
    private Connection getConnection(HttpSession session, ElcoLoggerInterface log, Parametri params, boolean[] close_connection_after) {
    	String connessione = null;
    	try {
    		connessione = params.getConnessione();
    		if (!DbUtils.isVuoto(connessione)) {
    			close_connection_after[0] = true;
    			return PoolFactory.getConnection(connessione, null, session);
    		}
    		else {
    			if (PolarisContext.getUser(session) != null)
    				close_connection_after[0] = true;
    			return PolarisContext.getDataConnection(session, context);
    		}
    	} catch (DbException de) {
    		Logger.getLogger().warn("Connessione non ottenuta. Uso quella salvata nel report.", de);
    		return null;
    	} catch (SqlQueryException e) {
    		Logger.getLogger().error("Specificata la connessione da utilizzare (" + connessione + ")ma errore nell'ottenimento", e);
    		return null;
		}
    }
}
