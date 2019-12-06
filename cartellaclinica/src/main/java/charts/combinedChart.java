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

import java.io.BufferedOutputStream;
import java.sql.Clob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OraclePreparedStatement;

import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.annotations.XYTextAnnotation;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.labels.ItemLabelAnchor;
import org.jfree.chart.labels.ItemLabelPosition;
import org.jfree.chart.labels.StandardXYItemLabelGenerator;
import org.jfree.chart.labels.XYItemLabelGenerator;
import org.jfree.chart.plot.CombinedDomainXYPlot;
import org.jfree.chart.plot.CombinedRangeXYPlot;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYSplineRenderer;
import org.jfree.data.time.Millisecond;
import org.jfree.data.time.RegularTimePeriod;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.TextAnchor;

import charts.multipleCharts.dati.cFarmaco;
import charts.multipleCharts.dati.cParametro;
import charts.multipleCharts.dati.parsedXml;
import core.Global;

//2014-03-26 - gianlucab - Questa classe ridefinisce un grafico generico.
public class combinedChart extends GenericChart {

	BufferedOutputStream out = null;
	HttpServletRequest request = null;
	private HttpServletResponse response=null;
	private baseUser bUtente = null;

	private String height=new String("");
	private String width=new String("");

	private String idenGrafico=new String("");
	private String idenAnag=new String("");
	private String idenVisita=new String(""); /* ACCESSO=1 */
	private String idenScheda=new String("");
	private String ricovero=new String("");
	private String reparto=new String("");
	private String key=new String("");

	public combinedChart(
		HttpSession myInputSession,
		ServletContext myInputContext,
		HttpServletRequest myInputRequest,
		HttpServletResponse myInputResponse
	) {
		this.response = myInputResponse;
		this.request = myInputRequest;
		this.bUtente =  Global.getUser(myInputSession);

	}
	
	public void readDati()
	{

		idenAnag    = request.getParameter("idenAnag");
		idenVisita  = check(request.getParameter("idenVisita"));
		idenScheda  = check(request.getParameter("idenScheda"));
		ricovero    = check(request.getParameter("ricovero"));
		idenGrafico = check(request.getParameter("idenGrafico"));
		reparto     = check(request.getParameter("reparto"));
		key         = check(request.getParameter("key"));

		height      = request.getParameter("height");
		width       = request.getParameter("width");
	}
	
	public void Work() throws Exception {
		readDati();

		out = new BufferedOutputStream(response.getOutputStream());

		CombinedDomainXYPlot plot = null;
		int altezzaAssoluta=Integer.valueOf(height);
		int larghezzaAssoluta=Integer.valueOf(width);

		parsedXml pXml;

		int idenGrafico = -1;
		try {idenGrafico = Integer.parseInt(this.idenGrafico);} catch(NumberFormatException e) {}
		
		String sql;
		Clob clob = null;
		if (idenGrafico > -1) {
			sql = "select tab.CONTENUTO.getClobVal() XML from CC_GRAFICI tab where iden=:idenGrafico";
		} else {
			sql = "select imagoweb.pck_configurazioni.getValueCdc(:reparto, :key) XML from dual";
		}
		OraclePreparedStatement ops = (OraclePreparedStatement) this.bUtente.db.getDataConnection().prepareCall(sql);
		
		if (sql.contains(":idenGrafico")) ops.setIntAtName("idenGrafico", idenGrafico);
		if (sql.contains(":reparto")) ops.setStringAtName("reparto", reparto);
		if (sql.contains(":key")) ops.setStringAtName("key", key);
		
		ResultSet rs = ops.executeQuery();
		if (rs.next()) {
			clob = rs.getClob("XML");
			pXml = new parsedXml(clob);
		} else {
			rs.getStatement().close();
			rs.close();
			rs=null;
			if (ops != null) ops.close();
			throw new Exception("Errore durante la lettura delle configurazioni");
		}
		if (clob != null) clob.free();
		rs.getStatement().close();
		rs.close();
		rs=null;
		if (ops != null) ops.close();

		ResultSet rsSerie = null;

		TimeSeriesCollection seriesCollection = null;
		TimeSeries serie = null;
		TimeSeries serie2 = null;
		TimeSeries serieFarmaco = null;
		ArrayList<XYTextAnnotation> ArAnnotation = new ArrayList<XYTextAnnotation>();
		XYSplineRenderer renderer = null;
		NumberAxis rangeY = null;
		XYPlot subplot = null;

		String dataIni = new String("");
		String dataFine = new String("");

		Double min = 0.0;
		Double max = 1.0;
		Double newValore = max;
		String descrizione = new String("");

		CombinedRangeXYPlot rangePlot = new CombinedRangeXYPlot();
		rangePlot.getRangeAxis().setVisible(false);
		rangePlot.setGap(2.0);

		for (int i=0;i<pXml.getPeriodi().size();i++)
		{
			PreparedStatement ps = this.bUtente.db.getDataConnection().prepareStatement("select CC_INI_FINE_PERIODO (?,?,?,?,?,?) DATI from dual");
			ps.setInt(1,Integer.parseInt(idenAnag));

			if (!pXml.getPeriodi().get(i).dataIni.equals("")) {
				ps.setString(2, pXml.getPeriodi().get(i).dataIni);
				ps.setString(3, pXml.getPeriodi().get(i).dataFine);
				ps.setInt(4, 0);
				ps.setInt(5, 0);
				ps.setString(6, null);
			} else if (!pXml.getPeriodi().get(i).n_giorni.equals("")) {
				/*sqlIniFine = "select CC_INI_FINE_PERIODO (198516,null,null,"++",null,null) DATI  from dual";*/
				ps.setString(2, null);
				ps.setString(3,null);
				ps.setInt(4, Integer.valueOf(pXml.getPeriodi().get(i).n_giorni));
				ps.setInt(5, 0);
				ps.setString(6, null);
			} else if (pXml.getPeriodi().get(i).episodio.equals("true")) {
				/*sqlIniFine = "select CC_INI_FINE_PERIODO (198516,null,null,null,"++",null) DATI  from dual";*/
				ps.setString(2, null);
				ps.setString(3, null);
				ps.setInt(4, 0);
				ps.setInt(5, Integer.parseInt(idenVisita));
				ps.setString(6, null);
			} else if (pXml.getPeriodi().get(i).ricovero.equals("true")) {
				/*sqlIniFine = "select CC_INI_FINE_PERIODO (198516,null,null,null,null,'"+ricovero+"') DATI  from dual";*/
				ps.setString(2, null);
				ps.setString(3, null);
				ps.setInt(4, 0);
				ps.setInt(5, 0);
				ps.setString(6, ricovero);
			} else if (pXml.getPeriodi().get(i).storico.equals("true")) {
				/*sqlIniFine = "select CC_INI_FINE_PERIODO (198516,null,null,null,null,null) DATI  from dual";*/
				ps.setString(2,null);
				ps.setString(3, null);
				ps.setInt(4, 0);
				ps.setInt(5, 0);
				ps.setString(6, null);
			}

			rs = ps.executeQuery();

			if(rs.next())
			{
				dataIni = rs.getString("DATI").split("@")[0];
				dataFine = rs.getString("DATI").split("@")[1];
				DateAxis rangeX = new DateAxis(dataIni.substring(6,8)+"/"+dataIni.substring(4,6)+"/"+dataIni.substring(0,4)+" - "+dataFine.substring(6,8)+"/"+dataFine.substring(4,6)+"/"+dataFine.substring(0,4));
				rangeX.setRange(new Date(new GregorianCalendar(Integer.parseInt(dataIni.substring(0,4)), Integer.parseInt(dataIni.substring(4,6))-1,Integer.parseInt(dataIni.substring(6,8)), 0, 0).getTimeInMillis()), new Date(new GregorianCalendar(Integer.parseInt(dataFine.substring(0,4)), Integer.parseInt(dataFine.substring(4,6))-1,Integer.parseInt(dataFine.substring(6,8)), 0, 0).getTimeInMillis()));
				plot = new CombinedDomainXYPlot(rangeX);
			} else {
				rs.getStatement().close();
				rs.close();
				rs=null;
				throw new Exception("Errore nella ricezione delle date inizio/fine periodo");
			}
			rs.getStatement().close();
			rs.close();
			rs=null;
			if (ps != null) ps.close();

			plot.setGap(10.0);

			for (int j=0;j<pXml.getParametri().size();j++)
			{	
				cParametro parametro = pXml.getParametri().get(j);
				int idenParametro;
				int idenScheda;
				try {
					idenParametro = Integer.parseInt(parametro.idenParametro);
				} catch(NumberFormatException e) {
					idenParametro = -1;
				}
				try {
					idenScheda = Integer.parseInt(this.idenScheda);
				} catch(NumberFormatException e) {
					idenScheda = -1;
				}
				
				if (idenParametro > -1) {
					String sqlParamType = "select * from CC_PARAMETRI_TYPE where iden="+idenParametro;
					ResultSet rsType = this.bUtente.db.getDataConnection().createStatement().executeQuery(sqlParamType);
					if (rsType.next())
					{
						min = rsType.getDouble("VALORE_MINIMO");
						max = rsType.getDouble("VALORE_MASSIMO");
						descrizione = rsType.getString("DESCRIZIONE");
					}
					rsType.getStatement().close();
					rsType.close();
					rsType=null;
					
					parametro.setSql(
						"select * from VIEW_CC_PARAMETRI_GRAFICO where valore_1 is not null" + 
						" and iden_anag=:IDEN_ANAG" +
						" and iden_parametro=:IDEN_PARAMETRO" +
						" and data_iso>=:DATA_INI and data_iso<=:DATA_FINE"
					);
					
					serie = new TimeSeries(descrizione, Millisecond.class);
					serie2 = new TimeSeries(descrizione+" (2)", Millisecond.class);
				}
				renderer = new XYSplineRenderer(Integer.parseInt(parametro.precision));

				seriesCollection = new TimeSeriesCollection();
				ArAnnotation = new ArrayList<XYTextAnnotation>();

				sql = parametro.getSql();
				
				// Escape comments
				sql = sql.replaceAll("(/\\*)[\\*]*[^\\*/]+[\\*]*(\\*/)|(--|//)[^\\r]+\\r\\n?", "");
				
				ops = (OraclePreparedStatement) this.bUtente.db.getDataConnection().prepareCall(sql);
				if (sql.contains(":IDEN_ANAG")) ops.setIntAtName("IDEN_ANAG", Integer.parseInt(idenAnag));
				if (sql.contains(":IDEN_VISITA")) ops.setIntAtName("IDEN_VISITA", Integer.parseInt(idenVisita));
				if (sql.contains(":IDEN_SCHEDA")) ops.setIntAtName("IDEN_SCHEDA", idenScheda > -1 ? idenScheda : 0);
				if (sql.contains(":IDEN_PARAMETRO")) ops.setIntAtName("IDEN_PARAMETRO", idenParametro > -1 ? idenParametro : 0);
				if (sql.contains(":NUM_NOSOLOGICO")) ops.setStringAtName("NUM_NOSOLOGICO", ricovero);
				if (sql.contains(":DATA_INI")) ops.setStringAtName("DATA_INI", dataIni);
				if (sql.contains(":DATA_FINE")) ops.setStringAtName("DATA_FINE", dataFine);

				rsSerie = ops.executeQuery();
				
				while (rsSerie.next()) {
					if (serie == null && serie2 == null) {
						descrizione = rsSerie.getString("DESCRIZIONE");
						min = rsSerie.getDouble("VALORE_MINIMO");
						max = rsSerie.getDouble("VALORE_MASSIMO");
						
						serie = new TimeSeries(descrizione, Millisecond.class);
						serie2 = new TimeSeries(descrizione+" (2)", Millisecond.class);
					}
					
					serie.addOrUpdate(RegularTimePeriod.createInstance(
						Millisecond.class,
						new Date(new GregorianCalendar(
							rsSerie.getInt("ANNO"),
							rsSerie.getInt("MESE") - 1,
							rsSerie.getInt("GIORNO"),
							rsSerie.getInt("ORA"),
							rsSerie.getInt("MINUTI")).getTimeInMillis()
						),
						RegularTimePeriod.DEFAULT_TIME_ZONE
					), rsSerie.getDouble("VALORE_1"));
					if (rsSerie.getString("VALORE_2") != null) {
						serie2.addOrUpdate(RegularTimePeriod.createInstance(
							Millisecond.class,
							new	Date(new GregorianCalendar(
								rsSerie.getInt("ANNO"),
								rsSerie.getInt("MESE") - 1,
								rsSerie.getInt("GIORNO"),
								rsSerie.getInt("ORA"),
								rsSerie.getInt("MINUTI")).getTimeInMillis()
							),
							RegularTimePeriod.DEFAULT_TIME_ZONE
						), rsSerie.getDouble("VALORE_2"));
					}
				}
				rsSerie.getStatement().close();
				rsSerie.close();
				rsSerie=null;
				if (ops != null) ops.close();

				XYItemLabelGenerator labelGenerator = new StandardXYItemLabelGenerator();
				ItemLabelPosition position = new ItemLabelPosition(ItemLabelAnchor.OUTSIDE5, TextAnchor.TOP_CENTER);
				
				if (serie != null) {
					seriesCollection.addSeries(serie);
					renderer.setSeriesItemLabelGenerator(seriesCollection.getSeriesCount() - 1,	labelGenerator);
					renderer.setSeriesPositiveItemLabelPosition(seriesCollection.getSeriesCount() - 1, position);
					renderer.setSeriesNegativeItemLabelPosition(seriesCollection.getSeriesCount() - 1, position);
					renderer.setSeriesVisibleInLegend(seriesCollection.getSeriesCount() - 1, serie.getItemCount() > 0);
					renderer.setSeriesLinesVisible(seriesCollection.getSeriesCount() - 1, parametro.line.equals("S"));
					renderer.setSeriesShapesVisible(seriesCollection.getSeriesCount() - 1, parametro.shape.equals("S"));
					renderer.setSeriesItemLabelsVisible(seriesCollection.getSeriesCount() - 1, parametro.label.equals("S"));
				}
				
				if (serie2 != null) {
					seriesCollection.addSeries(serie2);
					renderer.setSeriesItemLabelGenerator(seriesCollection.getSeriesCount() - 1,	labelGenerator);
					renderer.setSeriesPositiveItemLabelPosition(seriesCollection.getSeriesCount() - 1, position);
					renderer.setSeriesNegativeItemLabelPosition(seriesCollection.getSeriesCount() - 1, position);
					renderer.setSeriesVisibleInLegend(seriesCollection.getSeriesCount() - 1, serie2.getItemCount() > 0);
					renderer.setSeriesLinesVisible(seriesCollection.getSeriesCount() - 1, parametro.line.equals("S"));
					renderer.setSeriesShapesVisible(seriesCollection.getSeriesCount() - 1, parametro.shape.equals("S"));
					renderer.setSeriesItemLabelsVisible(seriesCollection.getSeriesCount() - 1, parametro.label.equals("S"));
				}

				ArrayList<cFarmaco> alFarm= pXml.getFarmaciParametroPeriodo(parametro.idenParametro, pXml.getPeriodi().get(i).ordine);
				for (int k = 0; k < alFarm.size(); k++) {
					cFarmaco farmaco = alFarm.get(k);
					serieFarmaco = null;
					XYTextAnnotation annotation = null;
					int idenFarmaco;
					try {
						idenFarmaco = Integer.parseInt(farmaco.idenFarmaco);
					} catch(NumberFormatException e) {
						idenFarmaco = -1;
					}
					
					if (idenFarmaco > -1) {										
						farmaco.setSql(
							"Select * from VIEW_CC_FARMACI_SOMMINISTRATI where iden_anag=:IDEN_ANAG" +
							" and iden_farmaco=:IDEN_FARMACO" +
							" and data_iso>=:DATA_INI and data_iso<=:DATA_FINE"
						);
					}

					String sqlSomministrazioni = farmaco.getSql();
					
					// Escape comments
					sqlSomministrazioni = sqlSomministrazioni.replaceAll("(/\\*)[\\*]*[^\\*/]+[\\*]*(\\*/)|(--|//)[^\\r]+\\r\\n?", "");
					
					ops = (OraclePreparedStatement) this.bUtente.db.getDataConnection().prepareCall(sqlSomministrazioni);
					if (sqlSomministrazioni.contains(":IDEN_ANAG")) ops.setIntAtName("IDEN_ANAG", Integer.parseInt(idenAnag));
					if (sqlSomministrazioni.contains(":IDEN_VISITA")) ops.setIntAtName("IDEN_VISITA", Integer.parseInt(idenVisita));
					if (sqlSomministrazioni.contains(":IDEN_SCHEDA")) ops.setIntAtName("IDEN_SCHEDA", idenScheda > -1 ? idenScheda : 0);
					if (sqlSomministrazioni.contains(":IDEN_FARMACO")) ops.setIntAtName("IDEN_FARMACO", idenFarmaco > -1 ? idenFarmaco : 0);
					if (sqlSomministrazioni.contains(":NUM_NOSOLOGICO")) ops.setStringAtName("NUM_NOSOLOGICO", ricovero);
					if (sqlSomministrazioni.contains(":DATA_INI")) ops.setStringAtName("DATA_INI", dataIni);
					if (sqlSomministrazioni.contains(":DATA_FINE")) ops.setStringAtName("DATA_FINE", dataFine);

					rsSerie = ops.executeQuery();
					
					while (rsSerie.next()) {
						if (serieFarmaco == null) {
							serieFarmaco = new TimeSeries(rsSerie.getString("DESCRIBE"), Millisecond.class);
						}
						if (seriesCollection.getSeriesCount() > 0 && seriesCollection.getSeries(0).getItemCount() > 0) {
							newValore = min.doubleValue() +
							((k + 1) * (max.doubleValue() - min.doubleValue()) / (alFarm.size() + 1));
						} else {
							newValore = min.doubleValue() +((max.doubleValue() - min.doubleValue()) /
									(alFarm.size() + 1));
						}
						
						// Ascissa dell'i-esimo punto della serie Farmaco
						long time = new GregorianCalendar(
							rsSerie.getInt("ANNO"),
							rsSerie.getInt("MESE") - 1,
							rsSerie.getInt("GIORNO"),
							rsSerie.getInt("ORA"),
							rsSerie.getInt("MINUTI")
						).getTimeInMillis();
						
						serieFarmaco.addOrUpdate(RegularTimePeriod.createInstance(Millisecond.class, new Date(time), RegularTimePeriod.DEFAULT_TIME_ZONE), newValore);
						if (farmaco.label.equals("S")) {
							//time = serieFarmaco.getDataItem(serieFarmaco.getItemCount() - 1).getPeriod().getMiddleMillisecond();
							annotation = new XYTextAnnotation(rsSerie.getString("DOSAGGIO") + " " + rsSerie.getString("UDM"), time, newValore);
							annotation.setRotationAngle(-Math.PI / 4); // -45°
							annotation.setRotationAnchor(TextAnchor.BOTTOM_LEFT);
							annotation.setTextAnchor(TextAnchor.BOTTOM_LEFT);
							ArAnnotation.add(annotation);
						}
					}
					rsSerie.getStatement().close();
					rsSerie.close();
					rsSerie = null;

					if (serieFarmaco != null) {
						seriesCollection.addSeries(serieFarmaco);
						renderer.setSeriesVisibleInLegend(seriesCollection.getSeriesCount() - 1, serieFarmaco.getItemCount() > 0);
						renderer.setSeriesLinesVisible(seriesCollection.getSeriesCount() - 1, farmaco.line.equals("S"));
						renderer.setSeriesShapesVisible(seriesCollection.getSeriesCount() - 1, farmaco.shape.equals("S"));
					}
				}

				rangeY = new NumberAxis(descrizione);
				rangeY.setRange(min, max);
				rangeY.setVisible(true);
				subplot = new XYPlot(seriesCollection, null, rangeY, renderer);
				if (i > 0)
					subplot.getRangeAxis().setVisible(false);

				for (int z = 0; z < ArAnnotation.size(); z++) {
					subplot.addAnnotation(ArAnnotation.get(z), true);
				}

				plot.add(subplot);

			}
			for (int count = 0; count < plot.getSubplots().size(); count++) {
				((XYPlot) plot.getSubplots().get(count)).setWeight(Integer.parseInt(
						pXml.getParametri().get(count).dimension));
			}

			rangePlot.add(plot);
		} /* end for */
		
		for (int count=0;count<rangePlot.getSubplots().size();count++) {
			((XYPlot)rangePlot.getSubplots().get(count)).setWeight(Integer.parseInt(pXml.getPeriodi().get(count).dimension));
		}

		JFreeChart chart= new JFreeChart("",rangePlot);
		/**
		 * genero l'immagine da visualizzare
		 */
		ChartUtilities.writeChartAsJPEG(out,new Float("1.0"), chart,larghezzaAssoluta,altezzaAssoluta);
	}

	public BufferedOutputStream getReponse() {
		return out;
	}

	private String check(String in) {
		if (in==null)
			return "";
		else
			return in;
	}
}
