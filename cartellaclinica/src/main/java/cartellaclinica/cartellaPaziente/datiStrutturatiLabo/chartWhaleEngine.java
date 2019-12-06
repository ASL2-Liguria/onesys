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
package cartellaclinica.cartellaPaziente.datiStrutturatiLabo;

import generic.servletEngine;
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
import java.util.Iterator;

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
import org.json.JSONException;
import org.json.JSONObject;

public class chartWhaleEngine extends functionObj {

	private JFreeChart chart;

	private int precision = 1;

	// Dimensioni grafico.
	
	protected int chart_width;
	protected int chart_height;

	/**
	 * Formato di output (default "png").
	 */
	protected String output_format 				= "jpg";
	private HttpServletResponse response 		= null;
	private HttpServletRequest request 			= null;
	private baseUser logged_user 				= null;
	private ElcoLoggerInterface logInterface 	= new ElcoLoggerImpl(chartWhaleEngine.class);
	private functionDB fDB 						= null;
	
	BufferedOutputStream out 					= null;

	ServletContext myContext;	

	private String descrEsame;
	private String codiceEsame;
	
	private String valmin;
	private String valmax;
	
    JSONObject           vTestate = null;
    JSONObject           vRisultati = null;

	public chartWhaleEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) {

		super(myInputContext, myInputRequest, myInputSession);
		this.request = myInputRequest;
		this.response = myInputResponse;
		myContext = myInputContext;
		fDB = new functionDB(this);

	}

	public void Work() throws IOException, SqlQueryException {

		readDati();
			
		double risultato;
		double valoreMin;
		double valoreMax;
		
		String data;    
		String ora;
		String test;    
		int br;  

		out = new BufferedOutputStream(response.getOutputStream());
		try {

			final DefaultCategoryDataset dataset = new DefaultCategoryDataset();

			final String series1 = "Risultato";
			final String series2 = "Valore min";
			final String series3 = "Valore max";

			String[] temp = null;
			String key;
			String val; 
			
			int lenJsong=vRisultati.length();
			
			for (int k=vRisultati.length()-1;k>=0;k--){
				
			        key = String.valueOf(k);
			        val = null;
			        val = vRisultati.getString(key);

			   
			   test =vTestate.getString(key);    
			   br =  test.toUpperCase().indexOf("<BR>");  
			   data= test.substring(br-10,br);     
			   ora= test.substring(br+4,br+9);
			   
			   try{
			        dataset.addValue(Double.parseDouble(val), series1,data + " " + ora);
			        dataset.addValue(Double.parseDouble(valmin.replace(",", ".")), series2, data + " " + ora);
			        dataset.addValue(Double.parseDouble(valmax.replace(",", ".")), series3, data + " " + ora);
		       }
			     catch (Exception de) {
					logInterface.info(de.getMessage(), de);
				}

			    
			    }
		
		
			chart = ChartFactory.createLineChart(descrEsame + " - " + codiceEsame, "Data prelievo", "Valore", dataset, PlotOrientation.VERTICAL, true, true, false);

			final CategoryPlot plot = chart.getCategoryPlot();
			final LineAndShapeRenderer renderer = (LineAndShapeRenderer) plot.getRenderer();

			renderer.setSeriesStroke(0, new BasicStroke(4.0f)); // Risultati
			renderer.setSeriesStroke(1, new BasicStroke(1.0f)); // Valori Minimi
			renderer.setSeriesStroke(2, new BasicStroke(1.0f)); // Valori Massimi
			
			renderer.setSeriesPaint(0, Color.GREEN); 			// Risultati verde
			renderer.setSeriesPaint(1, Color.BLUE); 			// Valori minimi blu
			renderer.setSeriesPaint(2,Color.RED); 				// Vaolri massimi rosso
			renderer.setShapesVisible(true);
			
			plot.setBackgroundPaint(Color.WHITE);
			plot.setDomainGridlinePaint(Color.cyan);
			plot.setRangeGridlinePaint(Color.cyan);			
			plot.setDomainGridlinesVisible(true);
			plot.getDomainAxis().setMinorTickMarksVisible(true);

			plot.getRangeAxis().setMinorTickMarksVisible(true);

			ChartUtilities.writeChartAsJPEG(out, chart, chart_width, chart_height);
		
		} catch (Exception de) {
			logInterface.error(de.getMessage(), de);
		}

	}

	public BufferedOutputStream getReponse() {

		return out;
	}

	private void readDati() {

		this.codiceEsame 		= this.request.getParameter("COD_ESA");
		this.descrEsame 		= this.request.getParameter("DESCR_ESA");
		this.chart_width 		= Integer.parseInt(this.request.getParameter("WIDTH"));
		this.chart_height 		= Integer.parseInt(this.request.getParameter("HEIGHT"));

		this.valmin				= this.request.getParameter("VAL_MIN");
		this.valmax				= this.request.getParameter("VAL_MAX");
		try {
			this.vTestate			= new JSONObject(this.request.getParameter("TESTATE"));
			this.vRisultati			= new JSONObject(this.request.getParameter("RISULTATI"));
		} catch (JSONException e) {
			logInterface.info(e.getMessage(), e);
		}

	}


}
