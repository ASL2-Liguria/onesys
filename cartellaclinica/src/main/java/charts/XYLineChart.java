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
/**
 * Definisce un grafico a linee di tipo XY.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2014-03-26
 * @see     http://ktipsntricks.com/data/ebooks/java/jfreechart-1.0.12-A4.pdf
 */
package charts;

import javax.swing.JFrame;
import javax.swing.JPanel;

import java.awt.Color;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.text.FieldPosition;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.NumberTickUnit;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
//import org.jfree.chart.renderer.xy.XYSplineRenderer;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class XYLineChart extends GenericChart {
	/* Attributi generici */
	private HttpServletRequest request;
	private HttpServletResponse response;
	private BufferedOutputStream out;
	
	/* Attributi del grafico */
	protected final int width;            // Larghezza del grafico (default 950 px)
	protected final int height;           // Altezza predefinita del grafico (default 600 px)
	protected final String outputFormat;  // Formato di output (default "png")
	
	/**
	 * Costruttore principale per la classe XYLinechart.
	 * 
	 * @param session
	 * @param context
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	public XYLineChart(HttpSession session, ServletContext context, HttpServletRequest request, HttpServletResponse response) throws IOException {
		this.request = request;
		this.response = response;
		this.out = new BufferedOutputStream(response.getOutputStream());
		
		this.width = Integer.valueOf(this.request.getParameter("width"));
		this.height = Integer.valueOf(this.request.getParameter("height"));
		this.outputFormat = "jpg";
	}
	
	/**
	 * Costruttore secondario per testare la classe XYLinechart.
	 * 
	 * @param width
	 * @param height
	 */
	public XYLineChart(int width, int height) {
		this.request = null;
		this.response = null;
		this.out = null;
		
		this.width = width;
		this.height = height;
		this.outputFormat = "jpg";
	}
	
	public JFreeChart draw(JSONObject jObject) throws JSONException, ParseException {
		// Titolo del grafico
		String title = (jObject.isNull("title")) ? "" : (String) jObject.get("title");
			
		// Impostazione di un layout preconfigurato (opzionale)
		String layout = "";
		try {
			layout = (String) jObject.get("layout");
		} catch (JSONException e) {} catch (ClassCastException cce) {}
		
		// Impostazione di un'ora decimale di riferimento (opzionale)
		Number time = 0.0;
		try {
			time = (Number) jObject.get("time");
		} catch (JSONException e) {} catch (ClassCastException cce) {}

		// Impostazione della visualizzazione delle ore a partire da 1 (opzionale)
		double min = 0.0;
		try {
			Number offset = (Number) jObject.get("offset");
			min = offset.doubleValue() == 1.0 ? 1.0 : 0.0;
		} catch (JSONException e) {} catch (ClassCastException cce) {}

		// Impostazione di una larghezza minima in ore (opzionale)
		double max = 12.0;
		try {
			Number length = (Number) jObject.get("minlength");
			max = length.doubleValue() >= 0.0 ? Math.round(length.doubleValue()*2)/2f : 12.0;
			max = max > 24.0 ? 24.0 : max;
		} catch (JSONException e) {} catch (ClassCastException cce) {}
		
		XYPlot plot = new XYPlot();
		Map<Double, String> label = new TreeMap<Double, String>();
		
		// Array di serie
		JSONArray series = (JSONArray) jObject.get("items");
    	for (int i = 0; i < series.length(); ++i) {
    	    JSONObject item = series.getJSONObject(i);
    	    
    		XYSeriesCollection dataset = new XYSeriesCollection();
    	    
    	    // Nome della serie i-esima
    	    String name = (item.isNull("name")) ? "" : (String) item.get("name");
    	    XYSeries serie = new XYSeries(name);
    	    
    	    // Punti della serie i-esima
    	    JSONObject jCoord = (JSONObject) item.get("items");
    	    
    	    Iterator<?> iterator = jCoord.keys();
    	    
    	    while(iterator.hasNext() ){
    	    	String point = (String) iterator.next();

    	    	double x, y;
    	    	String[] parts = point.split(";");
    	    	x = Double.parseDouble(parts[0]);
    	    	y = Double.parseDouble(parts[1]);
    			
    	    	serie.add(x, y);
    			if (x > max) max = x;
    			
    	    	label.put(x, (String) jCoord.get(point));
    	    }
    	    
			dataset.addSeries(serie);
			plot.setDataset(i, dataset);
	        plot.setRenderer(i, new XYLineAndShapeRenderer());
    	}
		
		plot.setBackgroundPaint(Color.white);
		plot.setRangeGridlinePaint(Color.gray);
		plot.setRangeGridlinesVisible(true);
		plot.setDomainGridlinePaint(Color.gray);
		plot.setDomainGridlinesVisible(true);
		plot.setDomainMinorGridlinesVisible(true);
		
		// Impostazioni particolari degl grafico
		if (layout.equalsIgnoreCase("PARTOGRAMMA_PARTO")) {
			plot = setPartogramma(plot, time, min, max, label);
		} else {
			plot.setDomainAxis(new NumberAxis("Asse X"));
			plot.setRangeAxis(new NumberAxis("Asse Y"));
		}
		
		JFreeChart chart = new JFreeChart(title, JFreeChart.DEFAULT_TITLE_FONT, plot, true);
		return chart;
	}
	
	/**
	 * Definisce il plot del grafico secondo le richieste di Ostetricia e Ginecologia.
	 * 
	 * @param plot
	 * @param time
	 * @return
	 */
	private XYPlot setPartogramma(XYPlot plot, Number time, final double min, final double max, final Map<Double, String> label) {
		String x_axis = "Ore";
		String y_axis = "Dilatazione (cm)";
		String y_axis2 = "Presentazione (cm)";
		
	    final NumberAxis domainAxis = new NumberAxis(x_axis);
	    final NumberAxis rangeAxis = new NumberAxis(y_axis);
	    NumberAxis xAxis2 = null;
    	final NumberAxis yAxis2 = new NumberAxis(y_axis2);
    	   	
    	// Assi x
    	domainAxis.setMinorTickMarksVisible(false);
		domainAxis.setStandardTickUnits(NumberAxis.createStandardTickUnits());
		domainAxis.setRange(-0.25, max+0.25);
		domainAxis.setStandardTickUnits(NumberAxis.createStandardTickUnits());
		domainAxis.setTickUnit(new NumberTickUnit(1.0));
    	try {
			xAxis2 = (NumberAxis) domainAxis.clone();
		} catch (CloneNotSupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	domainAxis.setNumberFormatOverride(new NumberFormat() {

			@Override
			public StringBuffer format(double number, StringBuffer toAppendTo, FieldPosition pos) {
				number+=min;
				return new StringBuffer(String.format("%d", (int) number));
			}

			@Override
			public StringBuffer format(long number, StringBuffer toAppendTo, FieldPosition pos) {
				number+=min;
				return new StringBuffer(String.format("%d", (int) number));
			}

			@Override
			public Number parse(String source, ParsePosition parsePosition) {
				// TODO Auto-generated method stub
				return null;
			}
    		
    	});
    	
    	xAxis2.setVerticalTickLabels(true);
    	xAxis2.setTickUnit(new NumberTickUnit(0.5));
    	final double offset = (double) time.doubleValue();
    	xAxis2.setNumberFormatOverride(new NumberFormat() {
			private static final long serialVersionUID = 0L;

			@Override
			public StringBuffer format(double number, StringBuffer toAppendTo, FieldPosition pos) {
				String text = label.get(number);
				if (text != null) {
					if (!text.equalsIgnoreCase(""))
						return new StringBuffer(text);
				}
					
				number += offset;
				if (number >= 24.0) number-= 24.0;
				double hours = Math.floor(number);
				double minutes = (number - hours) * 60;
				String hh = hours < 10.0 ? "0" + (int) hours : "" + (int) hours;
				String mm = minutes < 10.0 ? "0" + (int) minutes : "" + (int) minutes;
				return new StringBuffer(hh+":"+mm);
			}

			@Override
			public StringBuffer format(long number, StringBuffer toAppendTo, FieldPosition pos) {
				return new StringBuffer(String.format("%f", number));
			}

			@Override
			public Number parse(String source, ParsePosition parsePosition) {
				// TODO Auto-generated method stub
				return null;
			}
		});
    	
    	// Assi y
    	rangeAxis.setStandardTickUnits(NumberAxis.createIntegerTickUnits());
    	rangeAxis.setMinorTickMarksVisible(true);
    	rangeAxis.setTickUnit(new NumberTickUnit(0.5));
    	rangeAxis.setRange(-0.25, 10.25);
    	yAxis2.setAutoRangeIncludesZero(false);
		yAxis2.setRange(-5.25, 5.25);
		yAxis2.setTickUnit(new NumberTickUnit(0.5));
		yAxis2.setInverted(true);
		
		//yAxis2.setAxisLinePaint(Color.green);
		//yAxis2.setAutoTickUnitSelection(true);
		
		// Impostazione degli assi sul grafico
		plot.setDomainAxis(xAxis2);
		plot.setRangeAxis(rangeAxis);
		plot.setRangeAxis(1, yAxis2);
		plot.mapDatasetToRangeAxis(0, 1);
		plot.setDomainAxis(1, domainAxis);
		plot.mapDatasetToDomainAxis(1, 1);
		
		//plot.setDomainCrosshairVisible(true);
		//plot.setDomainCrosshairPaint(Color.red);
		
		//plot.setDomainCrosshairVisible(true);
		//plot.setRangeCrosshairVisible(true);
		
		// Impostazione del reticolo
		plot.setDomainCrosshairVisible(true);
		plot.setDomainCrosshairPaint(Color.black);
		plot.setDomainCrosshairValue(0);
		
		plot.setRangeCrosshairVisible(true);
		plot.setRangeCrosshairPaint(Color.black);
		plot.setRangeCrosshairValue(0);
		
		plot.setDomainMinorGridlinesVisible(true);
		plot.setDomainMinorGridlinePaint(Color.red);
		plot.setRangeMinorGridlinesVisible(true);
		plot.setRangeMinorGridlinePaint(Color.red);
		
		//plot.setDomainGridlinesVisible(true);  
		//plot.setRangeGridlinesVisible(true);  
		//plot.setRangeGridlinePaint(Color.blue);  
		//plot.setDomainGridlinePaint(Color.red); 
		
		return plot;
	}
	
	/* Salva il grafico come JPEG in un BufferedOutputStream */
	public void Work() throws JSONException, ParseException, IOException {
		JSONObject jObject = new JSONObject(this.request.getParameter("json"));
		JFreeChart chart = draw(jObject);
		ChartUtilities.writeChartAsJPEG(out, chart, width, height);
	}
	
	/* Restituisce un oggetto BufferedOutputStream */
	public BufferedOutputStream getReponse() {
		return out;
	}
	
	/**
	 * Visualizza in una finestra a video un grafico di test.
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		XYLineChart test;
		JFreeChart chart;
		ChartPanel chartPanel;
		JPanel panel;
		JFrame frame;
		
		/* Definisce le serie di dati */
		XYSeriesCollection dataset = new XYSeriesCollection();
		for(int i=0; i<3; i++) {
			XYSeries s = new XYSeries("Serie "+(i+1));
			s.add(1, (i+1)*1);
			s.add(2, (i+1)*10);
			dataset.addSeries(s);
		}
		
		/* Crea il grafico con il set di dati definito */
		//SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		//Date date = format.parse("2014-03-25 17:28");
		Date date = new Date();
		String title = new SimpleDateFormat("dd/MM HH.mm").format(date);

		chart = ChartFactory.createXYLineChart(
			title,                      // Titolo del grafico
			"X Axis",                   // Etichetta asse x
			"Y Axis",                   // Etichetta asse y
			dataset,                    // Set di dati
			PlotOrientation.VERTICAL,   // Orientamento
			true,                       // Mostra la legenda
			true,                       // Usa i tooltips
			false                       // Configura il grafico per generare URL
		);
		
		/* Definisce il plot del grafico */
		final XYPlot plot = chart.getXYPlot();
		plot.setBackgroundPaint(Color.white);
		plot.getRangeAxis().setStandardTickUnits(NumberAxis.createIntegerTickUnits());
		plot.getRangeAxis().setMinorTickMarksVisible(true);
		plot.setRangeGridlinePaint(Color.gray);
		plot.setRangeGridlinesVisible(true);
		
		plot.getDomainAxis().setMinorTickMarksVisible(false);
		plot.setDomainGridlinePaint(Color.gray);
		plot.setDomainGridlinesVisible(true);
		
		// TEST
		
		try {
			String s = "{\"title\":\"24/03/2014 00:35\",\"layout\":\"PARTOGRAMMA_PARTO\",\"time\":0.5,\"items\":[{\"name\":\"Presentazione\",\"items\":{\"0;-3.5\":\"2014-03-24 00:30\",\"1;-3.5\":\"2014-03-24 01:30\",\"3;-2\":\"2014-03-24 03:30\",\"4;-2\":\"2014-03-24 04:30\",\"5;-1\":\"2014-03-24 05:30\",\"6.5;-1\":\"2014-03-24 07:00\",\"7.5;0\":\"2014-03-24 08:00\",\"8;4\":\"2014-03-24 08:30\",\"8.5;5\":\"2014-03-24 09:00\"}},{\"name\":\"Dilatazione\",\"items\":{\"0;4\":\"2014-03-24 00:30\",\"1;6\":\"2014-03-24 01:30\",\"3;7\":\"2014-03-24 03:30\",\"4;7\":\"2014-03-24 04:30\",\"5;8\":\"2014-03-24 05:30\",\"6.5;9\":\"2014-03-24 07:00\",\"7.5;10\":\"2014-03-24 08:00\",\"8;10\":\"2014-03-24 08:30\",\"8.5;10\":\"2014-03-24 09:00\"}}]}";
			test = new XYLineChart(650, 650);
			chart = test.draw(new JSONObject(s));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		/* Visualizza il grafico nella finestra */   
		chartPanel = new ChartPanel(chart);
		panel = new JPanel();
        panel.add(chartPanel);
        frame = new JFrame();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
        frame.add(panel);
        frame.pack();
	}
}
