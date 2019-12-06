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
package stampe.multi;

import com.inet.report.Engine;
import core.database.PoolFactory;
import generic.statements.StatementFromFile;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Properties;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import matteos.servlets.Logger;
import matteos.servlets.MimeUtils;
import matteos.servlets.ServletBase;
import stampe.crystalclear.ImagoStampeException;
import stampe.crystalclear.Parametri;
import stampe.crystalclear.StampeEngine;

/**
 * Servlet implementation class ServletStampeMulti
 */
public class ServletStampeMulti extends ServletBase {

    private static final long serialVersionUID = 1L;
    private static final String const_param_name = "PARAMETRI_STAMPA_GLOBALE";

    /**
     * Richiamato da doGet, a sua volta richiamato da doPost (quindi entra in
     * funzione sia con GET che con POST).
     *
     * @param request
     * @param response
     * @throws IOException
     */
    @Override
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Hashtable<Integer, byte[]> allReport = new Hashtable<Integer, byte[]>();
        Hashtable<Integer, byte[]> allPdf = new Hashtable<Integer, byte[]>();
        ElcoLoggerInterface log = Logger.getLogger();

        HttpSession session = request.getSession(false);

        MergePDF mergepdf = new MergePDF();

        int num = 0;
        int numPdf = 0;
        byte[] out = null;
        byte[] out1 = null;
        byte[] out2 = null;
        byte[] out3 = null;

        log.debug("Client - Indirizzo: " + request.getRemoteAddr() + " - Host: " + request.getRemoteHost());
        Connection conn = null;
        // Recupero l'oggetto connection dalla sessione se presente, se no dal
        // pool configurato
        try {
            conn = PoolFactory.getWhaleDati(session);
        } catch (SqlQueryException e) {
            log.error("Errore nella creazione dell'oggetto connection: "
                    + e.getMessage());
        }

        Parametri params = new Parametri();

        //lettura da context
        if (!params.getFromServletContext(context, Parametri.param_stampeReportFolder)) {
            params.setProperty(Parametri.param_stampeReportFolder, context.getRealPath("") + "/report");
        }

        params.getAllFromHttpServletRequest(request);

        Properties[] arrayReport = creaOggettoProperties(session, params);// (Properties[])request.getSession().getAttribute("propertyArray");

        boolean is_binary = true;

        if (params.getOutputFormat().matches(Engine.EXPORT_HTML + ".*")) {
            is_binary = MimeUtils.setContentTypeByExtension(response, "html");
        }
        if (params.getOutputFormat().equalsIgnoreCase(Engine.EXPORT_PDF)) {
            is_binary = MimeUtils.setContentTypeByExtension(response, "pdf");
        }
        if (params.getOutputFormat().equalsIgnoreCase(Engine.EXPORT_RTF)) {
            is_binary = MimeUtils.setContentTypeByExtension(response, "rtf");
        }
        if (params.getOutputFormat().equalsIgnoreCase(Engine.EXPORT_XML)) {
            is_binary = MimeUtils.setContentTypeByExtension(response, "xml");
        }

        OutputStream sos = response.getOutputStream();

        if (!is_binary) {
            sos = new PrintStream(sos);
        }

        //******************************* STAMPA ENGINE **************************************//
        try {
            ByteArrayOutputStream sos1;

            for (int i = 0; i < arrayReport.length; i++) {
                settaProprietaReport(params, arrayReport[i]);
                Logger.getLogger().debug("" + params.getProperty("report"));
                sos1 = new ByteArrayOutputStream();
                if (params.getProperty("firmato").equalsIgnoreCase("N")) {// Gestione delle stampe dei report
                    log.debug("Inizio Stampe Engine");
                    new StampeEngine(params, sos1, conn);
                    log.debug("Fine Stampe Engine");
                    rimuoviProprietaReport(params, arrayReport[i]);
                    log.debug("Aggiunta al byte di array da stampare");
                    out = sos1.toByteArray();
                    log.debug("Fine Aggiunta al byte di array da stampare");
                    log.debug("Inizio creazione hashtable da stampare");
                    allReport.put(num, out);
                    num += 1;
                } else {// Gestione delle lettere firmate
                    log.debug("Classe di Firma");
                    retDaDbPdf test = new retDaDbPdf(params.getProperty("Noso"), params.getProperty("funzione"), params.getProperty("idenVisita"), session);
                    allPdf.put(numPdf, test.elabora());
                    numPdf += 1;
                }
            }
            log.debug("Inizio Merge");
            try {
                out = mergepdf.MergiaAllPdf(allReport, num - 1);
            } catch (Exception ex) {
                log.error(ex);
            }
            try {
                if (numPdf > 0) {
                    out1 = mergepdf.MergiaAllPdf(allPdf, numPdf - 1);
                }
            } catch (Exception ex) {
                log.error(ex);
            }
            log.debug("Fine Merge");
            if (out != null && out1 != null) {
                out2 = mergepdf.MergiaByte(out, out1);
            } else if (out != null && out1 == null) {
                out2 = out;
            } else {
                out2 = out1;
            }
            for (int i = 0; i < out2.length; i++) {
                sos.write(out2[i]);
            }
            if (params.getProperty("numerazione") == null || "S".equalsIgnoreCase(params.getProperty("numerazione"))) {
                out3 = mergepdf.numPage(out2);

                for (int i = 0; i < out3.length; i++) {
                    sos.write(out3[i]);
                }
            }
            /*for (int i = 0; i < out1.length; i++) 
			{
				sos.write(out1[i]);
			}*/
            log.debug("Output Completato");
            sos.flush();

        } catch (ImagoStampeException e) {
            Logger.getLogger().error(e);
        } catch (Exception e) {
            Logger.getLogger().error("Eccezione non gestita - ", e);
        } finally {
            if (sos != null) {
                sos.close();
            }
            if (conn != null) {
                PoolFactory.closeConnection(conn);
            }
            /*sos = null;*/
        }
    }

    private Properties[] creaOggettoProperties(HttpSession session,
            Parametri params) {
        String[] arrayNomiReport = null;
        String[] arrayParamsReport = null;
        String[] arrayFunctsReport = null;
        String[] arrayFirmatoRep = null;
        Properties[] arrProps;
        Properties props;
        String[] multiParam = null;

        StatementFromFile sff = null;
        ResultSet rs = null;
        try {
            sff = new StatementFromFile(session);
            rs = sff.executeQuery("stampe.xml",
                    "StampaGlobale.getParametriStampaGlobale",
                    new String[]{(String) params.get("webUser"),
                        (String) params.get("idenRicovero"),
                        const_param_name});
            while (rs.next()) {
                arrayFunctsReport = rs.getString("report_funzioni").split(";");
                arrayNomiReport = rs.getString("report_nomi").split(";");
                arrayParamsReport = rs.getString("report_sf").split(";");
                arrayFirmatoRep = rs.getString("report_firmato").split(";");
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            Logger.getLogger().error(
                    "Errore Nel Recupero dei parametri di stampa globale", e);
        } finally {
            try {
                rs.close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            sff.close();
        }

        arrProps = new Properties[arrayNomiReport.length];

        for (int i = 0; i < arrayNomiReport.length; i++) {
            props = new Properties();
            props.setProperty(arrayNomiReport[i].split("=")[0],
                    arrayNomiReport[i].split("=")[1]);
            props.setProperty(arrayFunctsReport[i].split("=")[0],
                    arrayFunctsReport[i].split("=")[1]);
            /* Setto la property del prompt e della selection formula del report */

            if (arrayParamsReport[i].contains("$")) {
                multiParam = arrayParamsReport[i].split("\\$");
                for (int j = 0; j < multiParam.length; j++) {
                    if (multiParam[j].substring(0, 2).equals("pr")) {
                        props.setProperty(multiParam[j].split("=")[0],
                                multiParam[j].split("=")[1]);
                    } else if (multiParam[j].substring(0, 2).equals("sf")) {
                        props.setProperty(
                                multiParam[j].substring(0, 2),
                                multiParam[j].substring(3,
                                        multiParam[j].length()));
                    } else {
                        props.setProperty(multiParam[j].split("=")[0],
                                multiParam[j].split("=")[1]);
                    }
                }
            } else if (arrayParamsReport[i].substring(0, 2).equals("pr")) {
                props.setProperty(arrayParamsReport[i].split("=")[0],
                        arrayParamsReport[i].split("=")[1]);
            } else if (arrayParamsReport[i].substring(0, 2).equals("sf")) {
                props.setProperty(arrayParamsReport[i].substring(0, 2),
                        arrayParamsReport[i].substring(3,
                                arrayParamsReport[i].length()));
            } else {
                props.setProperty(arrayParamsReport[i].split("=")[0],
                        arrayParamsReport[i].split("=")[1]);
            }
            props.setProperty("firmato", arrayFirmatoRep[i]);
            arrProps[i] = props;
        }

        return arrProps;
    }

    /**
     * Ottiene tutti i parametri dall'oggetto Properties Specificato e gli
     * assegna all'oggeto Parametri corrente
     *
     * @param Parametri,Properties
     * @return
     * @author
     */
    public void settaProprietaReport(Parametri param, Properties prop) {
        try {
            for (Enumeration e = prop.propertyNames(); e.hasMoreElements();) {
                String key = (String) e.nextElement();
                String value = prop.getProperty(key);

                param.setProperty(key, value);

            }
        } catch (Exception ex) {
            System.out.println("Eccezione: settaProprietaReport " + ex.getMessage());
        }

    }

    /**
     * Cancella i parametri dall'oggetto Parametri corrente (assegnati
     * precedentemente tramite la funzione settaProprietaReport())
     *
     * @param Parametri,Properties
     * @return
     * @author
     */
    public void rimuoviProprietaReport(Parametri param, Properties prop) {
        try {
            for (Enumeration e = prop.propertyNames(); e.hasMoreElements();) {
                String key = (String) e.nextElement();
                prop.getProperty(key);

                param.remove(key);

            }
        } catch (Exception ex) {
            System.out.println("Eccezione: rimuoviProprietaReport " + ex.getMessage());
        }

    }
    /*	final protected void doGet(HttpServletRequest request, HttpServletResponse response,ServletContext context)
			throws ServletException, IOException {
		processRequest(request,response,context);
	}

	final protected void doPost(HttpServletRequest request, HttpServletResponse response,ServletContext context)
			throws ServletException, IOException {
		doGet(request, response,context);
}
     */

 /*String[] arr = allReport.split("\\+");
    for (int num = 0; num < arr.length; num++) 
    {
        System.out.println(num + " => " +arr[num]);
        params.setProperty("report", arr[num]);
        test.put(num, params);
    }*/
}
