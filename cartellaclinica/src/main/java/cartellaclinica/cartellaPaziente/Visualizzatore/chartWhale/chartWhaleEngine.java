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
package cartellaclinica.cartellaPaziente.Visualizzatore.chartWhale;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.awt.BasicStroke;
import java.awt.Color;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OraclePreparedStatement;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.annotations.XYTextAnnotation;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.data.category.DefaultCategoryDataset;

public class chartWhaleEngine extends functionObj {

	private JFreeChart chart;

	private int precision = 1;

	/**
	 * Larghezza predefinita del grafico.
	 */
	protected int chart_width;

	/**
	 * Altezza predefinita del grafico
	 */
	protected int chart_height;

	/**
	 * Formato di output (default "png").
	 */
	protected String output_format = "jpg";

	private HttpServletResponse response = null;

	private HttpServletRequest request = null;

	private baseUser logged_user = null;

	BufferedOutputStream out = null;

	ArrayList<XYTextAnnotation> ArAnnotation = new ArrayList<XYTextAnnotation>();

	ServletContext myContext;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(chartWhaleEngine.class);

	String descrEsame;
	String codiceEsame;
	String nosologico;
	String idenRichiesta;
	String dataAcc;
	String dataPS;
	String cognome;
	String nome;
	String sesso;
	String dataNasc;
	String codFisc;
	String sqlQuery;
	String sqlQueryDescr = "";
	String idPaziente;
	String codProRep;
	String materiale;
	String elencoRichieste;

	private functionDB fDB = null;

	public chartWhaleEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) {

		super(myInputContext, myInputRequest, myInputSession);
		this.request = myInputRequest;
		this.response = myInputResponse;
		myContext = myInputContext;
		fDB = new functionDB(this);

	}

	public void Work() throws IOException, SqlQueryException {

		// JDBCXYDataset dataset_val_percentile;

		String sqlQuery = this.request.getParameter("SQL");
		codiceEsame 	= this.request.getParameter("codiceEsame");
		nosologico 		= this.request.getParameter("nosologico");
		idenRichiesta 	= this.request.getParameter("idenRichiesta");
		dataAcc 		= this.request.getParameter("dataAcc");
		dataPS	 		= this.request.getParameter("dataPS");
		nome 			= this.request.getParameter("nome");
		cognome 		= this.request.getParameter("cognome");
		sesso 			= this.request.getParameter("sesso");
		dataNasc 		= this.request.getParameter("dataNasc");
		codFisc 		= this.request.getParameter("codFisc");
		chart_width 	= Integer.parseInt(this.request.getParameter("width"));
		chart_height 	= Integer.parseInt(this.request.getParameter("height"));
		sqlQueryDescr 	= this.request.getParameter("SQLDescr");
		idPaziente 		= this.request.getParameter("idPaziente");
		codProRep 		= this.request.getParameter("codProRep");
		materiale 		= this.request.getParameter("materiale");
		elencoRichieste = this.request.getParameter("elencoRichieste");

		ResultSet rs = null;
		OraclePreparedStatement ps = null;
		double risultato;
		double valoreMin;
		double valoreMax;

		out = new BufferedOutputStream(response.getOutputStream());
		try {
			getDescrEsa(codiceEsame, sqlQueryDescr);

			final DefaultCategoryDataset dataset = new DefaultCategoryDataset();

			final String series1 = "Risultato";
			final String series2 = "Valore min";
			final String series3 = "Valore max";

			String[] temp = null;
			String nosDef = "";
			if (!nosologico.equals("")) {
				temp = nosologico.split(",");
				for (int i = 0; i < temp.length; i++) {
					if (!nosDef.equals(""))
						nosDef += ",";
					nosDef += "'" + temp[i] + "'";

				}
			}

			// se ci sono anche i dati di ps
			String sql;
			if (cognome != null && !cognome.equals("")) {
				sql = "Select Risultatoesame, Valorerifmin,VALORERIFMAX,ANNO,MESE,GIORNO,ORA_ACCETTAZIONE FROM( select R.RISULTATOESAME,R.VALORERIFMIN,R.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,R.ORA_ACCETTAZIONE from INFOWEB.VIEW_RISULTATI_LABORATORIO R join TAB_ESA TE on (TE.cod_esa=R.COD_ESA_TAB_ESA) " +
					  " Where (NUM_NOSOLOGICO in (" + nosDef + ") or Iden_Testata in (" + elencoRichieste + ")) and Idesamesingolo=:IDESAMESINGOLO and DATA_ACCETTAZIONE>=:DATA_ACCETTAZIONE ";

				if (!materiale.equals(""))
					sql += " and CODICE_MATERIALE=:CODICE_MATERIALE ";
				

				sql += " union select PS.Risultatoesame,PS.Valorerifmin,PS.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,PS.ORA_ACCETTAZIONE from INFOWEB.VIEW_RISULTATI_LABORATORIO_PS PS join TAB_ESA TE on (TE.cod_esa=ps.COD_ESA_TAB_ESA) where NOME=:NOME  AND COGN=:COGNOME  AND COD_FISC=:COD_FISC  AND SESSO=:SESSO  AND DATA_NAS=:DATA_NASC  and IDESAMESINGOLO=:IDESAMESINGOLO and DATA_ACCETTAZIONE>=:DATA_PS  ";
				if (!materiale.equals(""))
					sql += " and CODICE_MATERIALE=:CODICE_MATERIALE ";
				
				sql += ") ORDER BY ANNO,MESE,GIORNO,ORA_ACCETTAZIONE ";
				ps = (OraclePreparedStatement) this.fDB.getConnectData().prepareCall(sql);

				ps.setStringAtName("DATA_ACCETTAZIONE", dataAcc);
				ps.setStringAtName("DATA_PS", dataAcc);
				ps.setStringAtName("NOME", nome);
				ps.setStringAtName("COGNOME", cognome);
				ps.setStringAtName("COD_FISC", codFisc);
				ps.setStringAtName("SESSO", sesso);
				ps.setStringAtName("DATA_NASC", dataNasc);
				ps.setStringAtName("IDESAMESINGOLO", codiceEsame);

				if (sql.contains(":CODICE_MATERIALE"))
					ps.setStringAtName("CODICE_MATERIALE", materiale);
				

			}else if (!idPaziente.equals("") && !codProRep.equalsIgnoreCase("")) {
				
				sql = "Select R.Risultatoesame,R.Valorerifmin,R.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,R.ORA_ACCETTAZIONE from INFOWEB.VIEW_RISULTATI_LABORATORIO R join TAB_ESA TE on (TE.cod_esa=R.COD_ESA_TAB_ESA) " +
					  " Where (ID_PAZIENTE = :ID_PAZIENTE or Iden_Testata in (" + elencoRichieste + "))and COD_PRO_REPARTO = :COD_PRO_REPARTO and Idesamesingolo=:IDESAMESINGOLO and DATA_ACCETTAZIONE>=:DATA_ACCETTAZIONE ";
				
				if (!materiale.equals(""))
					sql += " and CODICE_MATERIALE=:CODICE_MATERIALE ";
				
				sql += "ORDER BY  DATA_ACCETTAZIONE,ORA_ACCETTAZIONE";
				
				ps = (OraclePreparedStatement) this.fDB.getConnectData().prepareCall(sql);
				ps.setStringAtName("ID_PAZIENTE", idPaziente);
				ps.setStringAtName("COD_PRO_REPARTO", codProRep);
				ps.setStringAtName("IDESAMESINGOLO", codiceEsame);
				ps.setStringAtName("DATA_ACCETTAZIONE", dataAcc);
				
				if (sql.contains(":CODICE_MATERIALE"))
					ps.setStringAtName("CODICE_MATERIALE", materiale);
				

			}else if (!idPaziente.equals("") && codProRep.equalsIgnoreCase("")) {
				
				sql = "Select R.Risultatoesame,R.Valorerifmin,R.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,R.ORA_ACCETTAZIONE from INFOWEB.VIEW_RISULTATI_LABORATORIO R join TAB_ESA TE on (TE.cod_esa=R.COD_ESA_TAB_ESA) " +
					  " Where (ID_PAZIENTE = :ID_PAZIENTE or Iden_Testata in (" + elencoRichieste + ")) and Idesamesingolo=:IDESAMESINGOLO and DATA_ACCETTAZIONE>=:DATA_ACCETTAZIONE ";
				
				if (!materiale.equals(""))
					sql += " and CODICE_MATERIALE=:CODICE_MATERIALE ";
				
				sql += "ORDER BY  DATA_ACCETTAZIONE,ORA_ACCETTAZIONE";
				
				ps = (OraclePreparedStatement) this.fDB.getConnectData().prepareCall(sql);
				ps.setStringAtName("ID_PAZIENTE", idPaziente);
				ps.setStringAtName("IDESAMESINGOLO", codiceEsame);
				ps.setStringAtName("DATA_ACCETTAZIONE", dataAcc);
				
				if (sql.contains(":CODICE_MATERIALE"))
					ps.setStringAtName("CODICE_MATERIALE", materiale);
				

			}else if (!nosologico.equals("")) {
				
				sql	= "select R.RISULTATOESAME,R.Valorerifmin,R.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,R.ORA_ACCETTAZIONE from INFOWEB.VIEW_RISULTATI_LABORATORIO R join TAB_ESA TE on (TE.cod_esa=R.COD_ESA_TAB_ESA) " +
					  " Where (NUM_NOSOLOGICO in (" + nosDef + ") or Iden_Testata in (" + elencoRichieste + ")) and Idesamesingolo = :IDESAMESINGOLO and DATA_ACCETTAZIONE>=:DATA_ACCETTAZIONE ";
				
				if (!materiale.equals(""))
					sql += " and CODICE_MATERIALE=:CODICE_MATERIALE ";
				
				sql += " ORDER BY  DATA_ACCETTAZIONE,ORA_ACCETTAZIONE";
				ps 	= (OraclePreparedStatement) this.fDB.getConnectData().prepareCall(sql);
				ps.setStringAtName("IDESAMESINGOLO", codiceEsame);
				ps.setStringAtName("DATA_ACCETTAZIONE", dataAcc);
				
				if (sql.contains(":CODICE_MATERIALE"))
					ps.setStringAtName("CODICE_MATERIALE", materiale);
				
			}else{
				sql = "select R.RISULTATOESAME,R.Valorerifmin,R.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,R.ORA_ACCETTAZIONE from INFOWEB.VIEW_RISULTATI_LABORATORIO R join TAB_ESA TE on (TE.cod_esa=R.COD_ESA_TAB_ESA) " +
						" Where IDEN_TESTATA =:IDEN_TESTATA and Idesamesingolo=:IDESAMESINGOLO and DATA_ACCETTAZIONE>=:DATA_ACCETTAZIONE ";
				if (!materiale.equals(""))
					sql += " and CODICE_MATERIALE=:CODICE_MATERIALE ";
				
				sql += " ORDER BY  DATA_ACCETTAZIONE,ORA_ACCETTAZIONE";

				ps = (OraclePreparedStatement) this.fDB.getConnectData().prepareCall(sql);
				ps.setStringAtName("IDEN_RICHIESTA", idenRichiesta);
				ps.setStringAtName("IDESAMESINGOLO", codiceEsame);
				ps.setStringAtName("DATA_ACCETTAZIONE", dataAcc);
				
				if (sql.contains(":CODICE_MATERIALE"))
					ps.setStringAtName("CODICE_MATERIALE", materiale);
			}

			rs = ps.executeQuery();

			// rs= this.fDB.openRs(sqlQuery);

			if (rs != null) {

				while (rs.next()) {

					try {

						risultato = Double.parseDouble(rs.getString("RISULTATOESAME").replace(",", "."));
						dataset.addValue(risultato, series1, rs.getString("GIORNO") + "/" + rs.getString("MESE") + "/" + rs.getString("ANNO") + " " + rs.getString("ORA_ACCETTAZIONE"));

					} catch (Exception e) {
						logInterface.info(e.getMessage(), e);
					}

					try {

						valoreMin = Double.parseDouble(rs.getString("VALORERIFMIN").replace(",", "."));
						dataset.addValue(valoreMin, series2, rs.getString("GIORNO") + "/" + rs.getString("MESE") + "/" + rs.getString("ANNO") + " " + rs.getString("ORA_ACCETTAZIONE"));

					} catch (Exception e) {
						logInterface.info(e.getMessage(), e);

					}

					try {

						valoreMax = Double.parseDouble(rs.getString("VALORERIFMAX").replace(",", "."));
						dataset.addValue(valoreMax, series3, rs.getString("GIORNO") + "/" + rs.getString("MESE") + "/" + rs.getString("ANNO") + " " + rs.getString("ORA_ACCETTAZIONE"));

					} catch (Exception e) {
						logInterface.info(e.getMessage(), e);

					}

				}

			}

			chart = ChartFactory.createLineChart(descrEsame + " E" + codiceEsame, "Data prelievo", "Valore", dataset, PlotOrientation.VERTICAL, true, true, false);

			final CategoryPlot plot = chart.getCategoryPlot();

			final LineAndShapeRenderer renderer = (LineAndShapeRenderer) plot.getRenderer();

			renderer.setSeriesStroke(0, new BasicStroke(4.0f)); // serie dei risultati
			renderer.setSeriesStroke(1, new BasicStroke(1.0f)); // serie dei valori minimi
			renderer.setSeriesStroke(2, new BasicStroke(1.0f)); // serie dei valori massimi
			renderer.setSeriesPaint(0, Color.GREEN); // serie dei risultati in verde
			renderer.setSeriesPaint(1, Color.BLUE); // serie dei valori minimi in blu
			renderer.setSeriesPaint(2,Color.RED); // serie dei vaolri massimi in rosso
			renderer.setShapesVisible(true);
			plot.setBackgroundPaint(Color.WHITE);
			// plot.setAxisOffset(new RectangleInsets(5.0, 5.0, 5.0, 5.0));
			plot.setDomainGridlinePaint(Color.cyan);
			plot.setRangeGridlinePaint(Color.cyan);
			
			plot.setDomainGridlinesVisible(true);
			plot.getDomainAxis().setMinorTickMarksVisible(true);

			plot.getRangeAxis().setMinorTickMarksVisible(true);

			ChartUtilities.writeChartAsJPEG(out, chart, chart_width, chart_height);
		} catch (Exception de) {
			logInterface.error(de.getMessage(), de);
		}

		finally {

			try {
				this.fDB.close(rs);
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}

		}

	}

	public BufferedOutputStream getReponse() {

		return out;
	}

	public void getDescrEsa(String codEsa, String query) throws SqlQueryException, SQLException {

		// String
		// sql=" select descr as descr_esame from tab_esa where cod_esa='E'||'"
		// + codiceEsame + "' and rownum=1 ";

		String sql = query;

		ResultSet rs = null;
		PreparedStatement ps = null;

		try {

			ps = this.fDB.getConnectData().prepareCall(" select descr as descr_esame from radsql.tab_esa where cod_esa=? and rownum=1");
			ps.setString(1, "E" + codiceEsame);
			rs = ps.executeQuery();

			// rs= this.fDB.openRs(sql);

			if (rs.next()) {
				descrEsame = rs.getString("descr_esame");
			} else {
				descrEsame = "";
			}
		} catch (Exception e) {

			logInterface.error(e.getMessage(), e);

		}

		finally {
			try {
				this.fDB.close(rs);
			} catch (SQLException e) {

				logInterface.error(e.getMessage(), e);
			}

		}

	}

}
