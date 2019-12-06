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
package charts;

import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imago.sql.dbConnections;

import java.awt.Color;
import java.awt.Font;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import matteos.database.DbUtils;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.annotations.XYTextAnnotation;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.DateTickUnit;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.TickUnits;
import org.jfree.chart.labels.StandardXYItemLabelGenerator;
import org.jfree.chart.labels.XYItemLabelGenerator;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYShapeRenderer;
import org.jfree.chart.renderer.xy.XYSplineRenderer;
import org.jfree.data.time.Millisecond;
import org.jfree.data.time.RegularTimePeriod;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;

import core.Global;

//2014-03-26 - gianlucab - Questa classe ridefinisce un grafico generico.
public class ChartsEngine extends GenericChart {

	private JFreeChart chart;

	private int precision = 1;

	/**
	 * Larghezza predefinita del grafico.
	 */
	protected int chart_width = 950;

	/**
	 * Altezza predefinita del grafico
	 */
	protected int chart_height = 600;

	/**
	 * Formato di output (default "png").
	 */
	protected String output_format = "jpg";

	private HttpServletResponse response = null;

	private HttpServletRequest request = null;

	private baseUser logged_user = null;

	BufferedOutputStream out = null;

	ArrayList<XYTextAnnotation> ArAnnotation = new ArrayList<XYTextAnnotation>();

	public ChartsEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) throws Exception {
		this.request = myInputRequest;
		this.logged_user = Global.getUser(myInputSession);
		this.response = myInputResponse;
	}

	public void Work() throws IOException, SqlQueryException {

		String titolo = new String("");

		chart_width = Integer.valueOf(this.request.getParameter("width"));
		chart_height = Integer.valueOf(this.request.getParameter("height"));

		Double MinValore = Double.valueOf("0");
		Double MaxValore = Double.valueOf("1");
		int inputTipo = Integer.valueOf(this.request.getParameter("tipo"));
//		String idAnag = this.request.getParameter("idAnag");
		String dataIni 	  = "";
		String dataFine	  = "";
		String idenVisita = "";
		/**
		 * indica quanti giorni di ricovero visulizzare '0' indica tutto il
		 * ricovero
		 */
		int inputRange = Integer.valueOf(this.request.getParameter("range"));
		if (inputRange==3)
		{
			idenVisita = (Integer.valueOf(this.request.getParameter("idenVisita"))).toString();
			if (Integer.valueOf(this.request.getParameter("giorni"))<=1){
				dataIni="sysdate";
			}else
			{
				dataIni= "sysdate-"+this.request.getParameter("giorni");dataFine="sysdate+1";
			}
		}
		else
		{
			dataIni= this.request.getParameter("dataIni");dataFine=this.request.getParameter("dataFine");
			idenVisita = (Integer.valueOf(this.request.getParameter("idenVisita").replace(".", ""))).toString();
		}

		/*switch (inputRange){
		case 0:	dataIni= "sysdate";	break;
		case 1: dataIni= "sysdate";	break;
		case 2: dataIni= this.request.getParameter("dataIni");dataFine=this.request.getParameter("dataFine");
				idenVisita = (Integer.valueOf(this.request.getParameter("idenVisita").replace(".", ""))).toString();
				break;
		case 3: dataIni= "sysdate-"+this.request.getParameter("giorni");dataFine="sysdate+1";

		default: System.out.println("Invalid Choice"); break;
		}*/



		out = new BufferedOutputStream(response.getOutputStream());
		try {
			PreparedStatement stm = null;
			ResultSet rst = null;
			Connection conn_radsql=null;
			dbConnections db=null;

			try {
				if (this.logged_user!=null)
				{
					conn_radsql = logged_user.db.getDataConnection();
				}
				else
				{
					db = new dbConnections();
					conn_radsql=db.getDataConnection();
				}
//				Connection conn_radsql = logged_user.db.getDataConnection();

				TimeSeries s1 = new TimeSeries("Prova", Millisecond.class);
				TimeSeries s2 = new TimeSeries("L&G European Index Trust", Millisecond.class);
				TimeSeries s3 = new TimeSeries("L&G European Index Trust", Millisecond.class);

				String Sql="";
				if (inputRange!=2)
				{
					Sql = "select * from VIEW_CC_PARAMETRI_GRAFICO where IDEN_RICOVERO=? and IDEN_PARAMETRO=?";
					if ((Integer.valueOf(this.request.getParameter("giorni"))==0))
					{
//						Sql += " and data_ora>=data_ricovero";
					}
					else if ((Integer.valueOf(this.request.getParameter("giorni"))==1))
					{
						Sql += " and (sysdate-?)<data_ora";
					}
					else
					{
						Sql += " and data_ora>="+dataIni+" and data_ora<="+dataFine+"";
					}
				}
				else
				{
					//Sql = "select * from VIEW_CC_PARAMETRI_GRAFICO where IDEN_VISITA=? and IDEN_PARAMETRO=?";
					Sql = "select * from VIEW_CC_PARAMETRI_GRAFICO where IDEN_RICOVERO=? and IDEN_PARAMETRO=?";
					Sql += " and data_ora>=to_date("+dataIni+",'yyyyMMdd') and data_ora<=to_date("+dataFine+",'yyyyMMdd')+1";
				}
				/*switch (inputRange){
					case 0:	Sql += " and data_ora>=data_ricovero";	break;
					case 1: Sql += " and (sysdate-?)<data_ora";		break;
					case 2: Sql += " and data_ora>=to_date("+dataIni+",'yyyyMMdd') and data_ora<=to_date("+dataFine+",'yyyyMMdd')+1";		break;
					case 3: Sql += " and data_ora>=to_date("+dataIni+",'yyyyMMdd') and data_ora<=to_date("+dataFine+",'yyyyMMdd')+1";		break;
					default: System.out.println("Invalid Choice"); 	break;
				}*/

				/*if (inputRange > 0)
					Sql += " and (sysdate-?)<data_ora";
				else
					Sql += " and data_ora>=data_ricovero";*/
				stm = conn_radsql.prepareStatement(Sql);
//				if (inputRange!=2)
//					stm.setInt(1, Integer.parseInt(idAnag));
//				else
					stm.setInt(1, Integer.parseInt(idenVisita));

				stm.setInt(2, inputTipo);
//				if (inputRange > 0)
				/*if (inputRange == 1)
					stm.setInt(3, inputRange);*/
				if (inputRange!=2)
				{
					if (Integer.valueOf(this.request.getParameter("giorni"))==1)
						stm.setInt(3, Integer.valueOf(this.request.getParameter("giorni")));
				}
				rst = stm.executeQuery();
				if (rst != null) {

					while (rst.next()) {
						if (inputRange!=2)
						{
							if (Integer.valueOf(this.request.getParameter("giorni"))==0)
								dataIni = "to_date('" + rst.getString("DATA_RICOVERO_ISO") + "','yyyyMMdd')";
						}
							//dataIni = "to_date('" + rst.getString("DATA_RICOVERO_ISO") + "','yyyyMMdd')";
						titolo = rst.getString("descrizione");
						MinValore = rst.getDouble("valore_minimo");
						MaxValore = rst.getDouble("valore_massimo");

						// s1.add(new
						// Date(rst.getDate("DATA_ORA")),rst.getDouble("VALORE1"));
						// s1.add(new
						// Hour(rst.getInt("ORA"),rst.getInt("GIORNO"),rst.getInt("MESE"),rst.getInt("ANNO")),rst.getInt("VALORE1"));
						try{
							s1.add(RegularTimePeriod.createInstance(Millisecond.class, new Date(new GregorianCalendar(rst.getInt("ANNO"), rst.getInt("MESE") - 1, rst.getInt("GIORNO"), rst.getInt("ORA"), rst.getInt("MINUTI")).getTimeInMillis()), RegularTimePeriod.DEFAULT_TIME_ZONE), rst.getDouble("VALORE_1"));
							if (rst.getString("VALORE_2") != null) {
								s2.add(RegularTimePeriod.createInstance(Millisecond.class, new Date(new GregorianCalendar(rst.getInt("ANNO"), rst.getInt("MESE") - 1, rst.getInt("GIORNO"), rst.getInt("ORA"), rst.getInt("MINUTI")).getTimeInMillis()), RegularTimePeriod.DEFAULT_TIME_ZONE), rst.getDouble("VALORE_2"));
							}
						}catch(Exception e){
							System.out.println(e.getLocalizedMessage());
						}
					}
					DbUtils.close(rst);
					DbUtils.close(stm);

					if (inputRange == 2)
					{
						Sql = "Select * from table(cc_creacalendario(?,?,3))";
						stm = conn_radsql.prepareStatement(Sql);
						stm.setString(1, dataIni);
						stm.setString(2, dataFine);
					}
					/*else if (inputRange == 1)
					{
						Sql = "Select * from table(cc_creacalendario(to_char(sysdate-?,'yyyyMMdd'),to_char(sysdate+1,'yyyyMMdd'),4))";
						stm = conn_radsql.prepareStatement(Sql);
						stm.setInt(1, inputRange);
					}
					else
					{
						Sql = "Select * from table(cc_creacalendario(to_char(?,'yyyyMMdd'),to_char(sysdate+1,'yyyyMMdd'),4))";
						stm = conn_radsql.prepareStatement(Sql);
						stm.setString(1, dataIni);
					}*/
					else
					{
						Sql = "Select * from table(cc_creacalendario(to_char(sysdate-?,'yyyyMMdd'),to_char(sysdate+1,'yyyyMMdd'),4))";
						stm = conn_radsql.prepareStatement(Sql);
						stm.setInt(1, Integer.valueOf(this.request.getParameter("giorni")));
					}

					rst = stm.executeQuery();
					if (rst != null) {
						while (rst.next()) {
							s3.add(RegularTimePeriod.createInstance(Millisecond.class, new Date(new GregorianCalendar(rst.getInt("ANNO"), rst.getInt("MESE") - 1, rst.getInt("GIORNO"), rst.getInt("ORA"), 0).getTimeInMillis()), TimeZone.getDefault()), 0);
						}
						rst.close();
					}

				} else {
					titolo = "Nessun dato presente";
				}
				rst.close();
				TimeSeriesCollection seriesCollection = new TimeSeriesCollection();
				seriesCollection.addSeries(s1);
				seriesCollection.addSeries(s2);
				seriesCollection.addSeries(s3);

				int numero_serie_percentili = seriesCollection.getSeriesCount();

				/*
				 * ArrayList<TimeSeries> ArFarmaci =
				 * getFarmaciSeries(conn_radsql
				 * ,idAnag,inputRange,MinValore,MaxValore);
				 *
				 * for (int k=0;k<ArFarmaci.size();k++){
				 * seriesCollection.addSeries(ArFarmaci.get(k)); }
				 */
				XYSplineRenderer renderer_spline = new XYSplineRenderer(precision);

				XYShapeRenderer renderer_shape = new XYShapeRenderer();
				// XYLineAndShapeRenderer renderer_shape = new
				// XYLineAndShapeRenderer(false,true);

				Color[] ArColor = new Color[3];
				ArColor[0] = Color.BLUE;
				ArColor[1] = Color.RED;
				ArColor[2] = Color.DARK_GRAY;

				// color
				for (int k = 0; k < numero_serie_percentili; k++) {
					if (inputRange ==2){
						renderer_spline.setSeriesShapesVisible(k, true);
						XYItemLabelGenerator generator = new StandardXYItemLabelGenerator(
								"{2}", new DecimalFormat("0.00"), new DecimalFormat("0.00"));
						renderer_spline.setSeriesItemLabelGenerator(0, generator);
						renderer_spline.setSeriesItemLabelsVisible(0, true);}
					else{
						renderer_spline.setSeriesShapesVisible(k, false);}
					renderer_spline.setSeriesPaint(k, ArColor[k]);
					renderer_spline.setSeriesVisibleInLegend(k, false);
				}

				for (int k = 3; k < seriesCollection.getSeriesCount(); k++) {
					renderer_shape.setSeriesVisibleInLegend(k, true);
//					renderer_shape.setSeriesItemLabelsVisible(k,true);
				}
				if (inputRange ==2)
					chart = ChartFactory.createTimeSeriesChart("", "", "", seriesCollection, true, true, false);
				else
					chart = ChartFactory.createTimeSeriesChart(titolo, "Data/ora", "Valore", seriesCollection, true, true, false);
				// plot
				XYPlot plot = chart.getXYPlot();

				for (int g = 0; g < ArAnnotation.size(); g++)
					plot.addAnnotation(this.ArAnnotation.get(g), true);

				if (inputRange ==2)
				{
					/* Settare righe verticali dei dati*/
					DateAxis dateaxis = (DateAxis)plot.getDomainAxis();
					TickUnits tickunits = new TickUnits();
					//				tickunits.add(new DateTickUnit(DateTickUnit.HOUR, 3, new SimpleDateFormat("dd-MMM HH:mm")));
					tickunits.add(new DateTickUnit(DateTickUnit.HOUR, 3, new SimpleDateFormat("HH:mm")));
					dateaxis.setStandardTickUnits(tickunits);
					dateaxis.setTickLabelFont(new Font("SansSerif",Font.PLAIN,10));
					dateaxis.setVerticalTickLabels(true);
					/* Settare i label dei dati*/
					//XYItemRenderer renderer = plot.getRenderer();
					//XYItemLabelGenerator generator = new StandardXYItemLabelGenerator(
					//		"{2}", new DecimalFormat("0.00"), new DecimalFormat("0.00"));
					//renderer_spline.setItemLabelGenerator(generator);
					//renderer_spline.setItemLabelsVisible(false);
					//plot.setRenderer(0,renderer);
				}
				else
				{
					plot.getDomainAxis().setStandardTickUnits(DateAxis.createStandardDateTickUnits());
				}
					//plot.getDomainAxis().setStandardTickUnits(DateAxis.createStandardDateTickUni)






				plot.getRangeAxis().setStandardTickUnits(NumberAxis.createIntegerTickUnits());

				plot.getDomainAxis().setMinorTickMarksVisible(true);

				plot.getRangeAxis().setMinorTickMarksVisible(false);
				plot.getRangeAxis().setRange(MinValore, MaxValore);

				plot.setBackgroundPaint(new Color(255, 255, 255));

				plot.setDomainGridlinePaint(new Color(100, 100, 100));
				plot.setDomainGridlinesVisible(true);

				plot.setRangeGridlinePaint(new Color(100, 100, 100));
				plot.setRangeGridlinesVisible(true);


				for (int k = 3; k < seriesCollection.getSeriesCount(); k++)
					plot.setRenderer(k, renderer_shape);

				plot.setRenderer(0, renderer_spline);
				plot.setRenderer(1, renderer_spline);



			} catch (SQLException sqle) {
				// throw new DbException(sqle);
				System.out.println(sqle.getLocalizedMessage());
			} catch (Exception e) {
				// throw new DbException(sqle);
				System.out.println(e.getLocalizedMessage());
			} finally {
				DbUtils.close(rst);
				rst = null;
				DbUtils.close(stm);
				stm = null;
			}

			ChartUtilities.writeChartAsJPEG(out, chart, chart_width, chart_height);
		} catch (Exception de) {
			System.out.println(de.getLocalizedMessage());
		}

	}

	public BufferedOutputStream getReponse() {
		return out;
	}
}
