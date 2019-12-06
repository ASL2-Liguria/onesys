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
package cartellaclinica.cartellaPaziente.Visualizzatore.chart;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.awt.BasicStroke;
import java.awt.Color;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.annotations.XYTextAnnotation;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.data.category.DefaultCategoryDataset;

import plugin.getPoolConnection;
import cartellaclinica.cartellaPaziente.Visualizzatore.connection.Connessione;

public class chartEngine {

	private JFreeChart chart;

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

	BufferedOutputStream out = null;

	ArrayList<XYTextAnnotation> ArAnnotation = new ArrayList<XYTextAnnotation>();

	ServletContext myContext;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(chartEngine.class);

	String descrEsame;

	public chartEngine(ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) throws Exception {
		this.request = myInputRequest;
		this.response = myInputResponse;
		myContext = myInputContext;

	}

	public void Work() throws IOException, SqlQueryException {

		// JDBCXYDataset dataset_val_percentile;

		String sqlQuery = this.request.getParameter("SQL");
		String codiceEsame = this.request.getParameter("codiceEsame");
		String idPatient = this.request.getParameter("idPatient");
		// String descrEsame = this.request.getParameter("descrEsame");
		chart_width = Integer.parseInt(this.request.getParameter("width"));
		chart_height = Integer.parseInt(this.request.getParameter("height"));

		double risultato;
		double valoreMin;
		double valoreMax;
		Connection conn = null;
		getPoolConnection myPoolConnection = null;

		out = new BufferedOutputStream(response.getOutputStream());
		try {
			Statement stm = null;
			ResultSet rst = null;
			try {

				// conn_radsql = logged_user.db.getDataConnection();

				getDescrEsa(codiceEsame, idPatient);

				// conn= new Connessione().getConnection(myContext);
				myPoolConnection = new getPoolConnection(myContext.getInitParameter("RegistryPoolName"), myContext.getInitParameter("RegistryUser"), myContext.getInitParameter("RegistryPwd"), myContext.getInitParameter("CryptType"));
				conn = myPoolConnection.getConnection();
				stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);

				final DefaultCategoryDataset dataset = new DefaultCategoryDataset();

				final String series1 = "Risultato";
				final String series2 = "Valore min";
				final String series3 = "Valore max";

				rst = stm.executeQuery(sqlQuery);
				if (rst != null) {

					while (rst.next()) {

						try {

							risultato = Double.parseDouble(rst.getString("risultato").replace(",", "."));
							dataset.addValue(risultato, series1, rst.getString("GIORNO") + "/" + rst.getString("MESE") + "/" + rst.getString("ANNO") + " " + rst.getString("ORA_PRELIEVO"));

						} catch (Exception e) {
							logInterface.info(e.getMessage(), e);
						}

						try {

							valoreMin = Double.parseDouble(rst.getString("valore_min").replace(",", "."));
							dataset.addValue(valoreMin, series2, rst.getString("GIORNO") + "/" + rst.getString("MESE") + "/" + rst.getString("ANNO") + " " + rst.getString("ORA_PRELIEVO"));

						} catch (Exception e) {
							logInterface.info(e.getMessage(), e);

						}

						try {

							valoreMax = Double.parseDouble(rst.getString("valore_max").replace(",", "."));
							dataset.addValue(valoreMax, series3, rst.getString("GIORNO") + "/" + rst.getString("MESE") + "/" + rst.getString("ANNO") + " " + rst.getString("ORA_PRELIEVO"));

						} catch (Exception e) {
							logInterface.info(e.getMessage(), e);

						}

					}

				}

				rst.close();
				// conn.close();
				myPoolConnection.chiudi(conn);

				chart = ChartFactory.createLineChart(descrEsame + " " + codiceEsame, "Data prelievo", "Valore", dataset, PlotOrientation.VERTICAL, true, true, false);

				final CategoryPlot plot = chart.getCategoryPlot();

				final LineAndShapeRenderer renderer = (LineAndShapeRenderer) plot.getRenderer();

				renderer.setSeriesStroke(0, new BasicStroke(4.0f));

				renderer.setSeriesStroke(1, new BasicStroke(4.0f));
				renderer.setSeriesStroke(2, new BasicStroke(4.0f));

				renderer.setShapesVisible(true);

				plot.setBackgroundPaint(Color.WHITE);
				// plot.setAxisOffset(new RectangleInsets(5.0, 5.0, 5.0, 5.0));
				plot.setDomainGridlinePaint(Color.cyan);
				plot.setRangeGridlinePaint(Color.cyan);

				plot.setDomainGridlinesVisible(true);
				plot.getDomainAxis().setMinorTickMarksVisible(true);

				plot.getRangeAxis().setMinorTickMarksVisible(true);

			} catch (SQLException sqle) {

				logInterface.error(sqle.getMessage(), sqle);
			} catch (Exception e) {

				logInterface.error(e.getMessage(), e);
			} finally {
				// DbUtils.close(rst);
				rst.close();
				// DbUtils.close(stm);
				stm = null;

				// new Connessione().chiudi(conn,myContext);
				myPoolConnection.chiudi(conn);

			}

			ChartUtilities.writeChartAsJPEG(out, chart, chart_width, chart_height);
		} catch (Exception de) {
			logInterface.error(de.getMessage(), de);
		}

	}

	public BufferedOutputStream getReponse() {

		return out;
	}

	public void getDescrEsa(String codEsa, String idPaz) throws SqlQueryException, SQLException {

		String sql = "SELECT descr_esame FROM VIEW_RISULTATI_LAB WHERE CODICE_ESAME ='" + codEsa + "' and id_paziente='" + idPaz + "' and rownum=1 ";

		ResultSet rs = null;
		Statement stm = null;
		Connection conn = null;

		try {

			conn = new Connessione().getConnection(myContext);
			stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			rs = stm.executeQuery(sql);

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
				rs.close();
				new Connessione().chiudi(conn, myContext);
			} catch (SQLException e) {

				logInterface.error(e.getMessage(), e);
			}

		}

	}

}
