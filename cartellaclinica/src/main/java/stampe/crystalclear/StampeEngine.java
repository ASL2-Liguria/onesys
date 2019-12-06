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

import java.io.IOException;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.Enumeration;
import java.util.Properties;

import matteos.servlets.Logger;

import com.inet.report.DatabaseTables;
import com.inet.report.Datasource;
import com.inet.report.Engine;
import com.inet.report.Fields;
import com.inet.report.ReportException;
import com.inet.report.SortField;
import com.inet.report.config.ConfigurationManager;


/**
 * Il motore dell'applicazione, indipendente dal metodo di chiamata (servlet o altra classe).
 *
 * @author matteos
 *
 */
public class StampeEngine {
	private Parametri params;
	private OutputStream out;
	private ElcoLoggerInterface log;
	private Engine engine;

	public StampeEngine (Parametri params, OutputStream out) throws ImagoStampeException {
		this(params, out, null);
	}

	public StampeEngine (Parametri params, OutputStream out, Connection conn) throws ImagoStampeException {
		this.params = params;
		this.out = out;
		this.log = Logger.getLogger();
		try {
			VersionGatewayNewer.setActiveConfiguration();
		} catch (Throwable t) {
			log.warn("Versione 6 di Crystal Clear",t);
		}
		Runtime rt = Runtime.getRuntime();
		try {

			//File del report
			String reportfile = params.getReport();
			engine = new Engine(params.getOutputFormat());
			String ReportPath = params.getReportFolder();
			if ((ReportPath != null) && (ReportPath != ""))
				reportfile = ReportPath + "/" + reportfile;

			engine.setReportFile(reportfile);

			//ex CCEngineManipulator
			try {
				setReportParameters(engine,params);
				String sf = params.getProperty("sf");
				if (sf != null)
					engine.setSF(sf);
				setReportConnection(engine, params, conn);
				impostaOrdinamento(engine, params);
			} catch (ReportException re) {
				throw (new ImagoStampeException("CCEngineManipulator - ReportException - " + re.messageId + " - " + re.msg));
			}

			//per export html:
			if (params.getOutputFormatIsHtm()) {
				Properties prop = new Properties();
				prop.setProperty("layout", params.getOutputFormatHtmLayout());
				engine.setUserProperties(prop);
			}
			log.debug("Sto per fare il rendering del report " + reportfile + " - Memoria totale: " + rt.totalMemory()/(1024*1024) + "MB, libera: " + rt.freeMemory()/(1024*1024) + "MB");
			//limite di 100 pagine
            if ("".equalsIgnoreCase(ConfigurationManager.getInstance().getCurrent().get("stopAfterPage","")))
                engine.stopAfterPage(500);

			//engine.stopAfterPage(100);
			engine.execute();
			log.debug("Rendering del report " + reportfile + " effettuato - Memoria totale: " + rt.totalMemory()/(1024*1024) + "MB, libera: " + rt.freeMemory()/(1024*1024) + "MB");
			outputReport(engine);
			engine = null;
		} catch (ReportException e) {
			throw (new ImagoStampeException("StampeEngine - ReportException - " + e.messageId + " - " + e.msg,e));
		}
	}

	/**
	 * Dall'omonimo metodo di com.inet.report.Engine: Returns count of records this report has read from database. For subreports it is the sum of the records of all instances of the subreport. Usable if engine is finished only otherwise returns -1. NOTE: If you need this value for a subreport then you need request the reference of the subreport Engine before execute().
	 * @return
	 */
	public int getRecordCount() {
		return engine.getRecordCount();
	}

	protected void outputReport(Engine engine) throws ImagoStampeException {
		try {
			for(int i=1;i<=engine.getPageCount();i++) {
				if (params.getOutputFormatIsHtm()) {
					writePageDataHtm(engine.getPageData(i), out);
				} else {
					out.write(engine.getPageData(i));
				}
				out.flush();
			}
			out.close();
			out = null;
		} catch (ReportException re) {
			throw (new ImagoStampeException("StampeEngine.getBytesFromReport() - ReportException - " + re.messageId + " - " + re.msg,re));
		} catch (IOException ioe) {
			throw (new ImagoStampeException("StampeEngine.getBytesFromReport() - IOException", ioe));
		}
	}

	/**
	 * Codice spedito da i-net Software. Decodifica un intero spostandone i byte: [4 3 2 1] -&gt; [1 2 3 4]
	 *
	 * @param puffer
	 * @param idx
	 * @return
	 */
    private int readInt( byte[] puffer, int idx){
        int result = (puffer[idx+0] & 0xFF) + ((puffer[idx+1] & 0xFF) << 8) + ((puffer[ idx+2 ] & 0xFF) << 16) + (puffer[ idx +3 ] << 24);
        return result;
    }

    /**
     * Codice spedito da i-net Software (modificato). Legge un array di byte (la pagina htm) ed elimina le informazioni extra (integer che indicano la lunghezza di pagine e campi, ecc.).
     *
     * @param fData
     * @param os
     * @throws IOException
     */
    private void writePageDataHtm(byte[] fData, OutputStream os) throws IOException {
        int idx = 0;
        while (idx<fData.length) {
		    int length = readInt(fData, idx);
		    if(length == -1) break;

		    idx += 4;
		    byte[] filename_bytes = new byte[length];
	        System.arraycopy(fData, idx, filename_bytes, 0, length);
	        // file name was encoded with UTF8, it need to be decoded here with UTF8
//	        String name = new String(filename_bytes,"UTF8");
		    idx += length;

		    length = readInt(fData, idx);
		    idx += 4;

		    os.write(fData,idx, length );
		    idx += length;
		}
    }

	protected void impostaOrdinamento(Engine engine, Parametri params) throws ReportException {
		String orderby = params.getProperty("orderby");
		if (orderby != null) {
			String[] ordinamenti = orderby.split(",");
			Fields flds = engine.getFields();
			for (int i=0; i<ordinamenti.length; i++) {
				String ord = ordinamenti[i];
				String campo;
				String senso;
				int order;
				campo = ord.substring(0,ord.indexOf("("));
				if (campo == "")
					continue;
				senso = ord.substring(ord.indexOf("(")+1,ord.indexOf(")"));
				if ("D".equalsIgnoreCase(senso))
					order = SortField.DESCENDING_ORDER ;
				else
					order = SortField.ASCENDING_ORDER;

				flds.addSortField(campo, order);
			}
		}
	}

	protected void setReportConnection(Engine engine, Parametri params, Connection connection) throws ImagoStampeException, ReportException {
		DatabaseTables dbt = engine.getDatabaseTables();

		for (int i = 0; i < dbt.getDatasourceCount(); i++) {

			Datasource ds = dbt.getDatasource(i);

			if (connection != null) {
				ds.setConnection(connection);
				engine.setConnectionCloseOnFinishing(false);
			}
			setSubReportsConnection(engine, params, connection);
		}
	}

	/**
	 * Imposta i parametri prompt&lt;nomeparametro&gt;=valore relativi al report correntemente elaborato.
	 *
	 * @param engine
	 * @param params
	 * @throws ReportException
	 */
	protected void setReportParameters(Engine engine, Parametri params) throws ReportException {
		Enumeration enm = params.propertyNames();
		String paramname;
		while (enm.hasMoreElements()) {
			paramname =(String) enm.nextElement();
			String promptname;
			if (paramname.startsWith("prompt<")) {
				promptname = paramname.substring(paramname.indexOf("<",0)+1,paramname.lastIndexOf(">"));
				engine.setPrompt(promptname,params.getProperty(paramname));
			}
		}
	}

	/**
	 * Elabora i subreport se ne &egrave; presunta la presenza, richiamando ricorsivamente istanze della classe.
	 *
	 * @param engine
	 * @param params
	 * @throws ImagoStampeException
	 */
	protected void setSubReportsConnection(Engine engine, Parametri params, Connection connection) throws ImagoStampeException {
		try {
			for (int i=0; i < engine.getSubReportCount(); i++) {
				Engine sub = engine.getSubReport(i);
				setReportConnection(sub,params,connection);
			}
		} catch (ReportException re) {
			throw new ImagoStampeException(re);
		}
	}
}
