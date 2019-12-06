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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.GregorianCalendar;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.DateTickUnit;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.TickUnits;
import org.jfree.chart.plot.CombinedRangeXYPlot;
import org.jfree.chart.plot.XYPlot;
import org.jfree.data.time.Millisecond;
import org.jfree.data.time.Month;
import org.jfree.data.time.RegularTimePeriod;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.data.xy.XYDataset;

import core.Global;

//2014-03-26 - gianlucab - Questa classe ridefinisce un grafico generico.
public class combinedChartReport extends GenericChart {

    BufferedOutputStream out = null;
    HttpServletRequest request = null;
    private HttpServletResponse response=null;
    HttpSession session =null;
    private baseUser bUtente = null;

    private String height=new String("");
    private String width=new String("");

	private String idenGrafico=new String("");
	private String idenAnag=new String("");
	private String idenVisita=new String("");
	private String ricovero=new String("");
	private String dataRangeIn=new String("");
	private String dataRangeFi=new String("");
	private JFreeChart chart;
	public  Hashtable<Integer,String> test = null;
	public Connection conn_radsql = null;

    public combinedChartReport(HttpSession myInputSession,
			 ServletContext myInputContext,
			 HttpServletRequest myInputRequest, HttpServletResponse myInputResponse
	    ) {
        this.response = myInputResponse;
        this.request = myInputRequest;
        this.bUtente =  Global.getUser(myInputSession);

    }
    public void readDati()
    {

        idenAnag    = request.getParameter("idenAnag");
        idenVisita  = check((Integer.valueOf(this.request.getParameter("idenVisita").replace(".", ""))).toString());
        ricovero    = check(request.getParameter("ricovero"));
        idenGrafico = check(request.getParameter("idenGrafico"));
        dataRangeIn = check(request.getParameter("dataIni"));
        dataRangeFi = check(request.getParameter("dataFine"));
        height      = request.getParameter("height");
        width      = request.getParameter("width");

    }
    public void Work() throws Exception {

    	readDati();
    	
        out = new BufferedOutputStream(response.getOutputStream());
        int altezzaAssoluta=Integer.valueOf(height);
        int larghezzaAssoluta=Integer.valueOf(width);             
        readDate();
        CombinedRangeXYPlot plot = new CombinedRangeXYPlot(new NumberAxis("Temp"));

       
		for (Enumeration e = test.keys() ; e.hasMoreElements() ;) {
			XYPlot subPlot = retChart(test.get(e.nextElement())).getXYPlot();
			DateAxis dateaxis = (DateAxis)subPlot.getDomainAxis();
			TickUnits tickunits = new TickUnits();
			tickunits.add(new DateTickUnit(DateTickUnit.HOUR, 3, new SimpleDateFormat("HH:mm")));
			dateaxis.setStandardTickUnits(tickunits);
			dateaxis.setTickLabelFont(new Font("SansSerif",Font.PLAIN,10));
			dateaxis.setVerticalTickLabels(true);
			
			subPlot.getRangeAxis().setStandardTickUnits(NumberAxis.createIntegerTickUnits());

			subPlot.getRangeAxis().setMinorTickMarksVisible(false);
			subPlot.getRangeAxis().setRange(35, 40);

			subPlot.setBackgroundPaint(new Color(255, 255, 255));

			subPlot.setDomainGridlinePaint(new Color(100, 100, 100));
			subPlot.setDomainGridlinesVisible(true);

			subPlot.setRangeGridlinePaint(new Color(100, 100, 100));
			subPlot.setRangeGridlinesVisible(true);
			
			subPlot.setOutlineVisible(false);
			
			plot.add(subPlot, 1);
	     }
		
		plot.setGap(0.1);
        JFreeChart chart = new JFreeChart(
        		"",
        		JFreeChart.DEFAULT_TITLE_FONT, plot, true
        		);
        chart.removeLegend();
        /**
         * genero l'immagine da visualizzare
         */
        ChartUtilities.writeChartAsJPEG(out,new Float("1.0"), chart,larghezzaAssoluta,altezzaAssoluta);        
    }

    private void readDate() {
    	PreparedStatement 	ps	= null;
    	ResultSet 			rs	= null;
    	String Sql = "";
    	String DataFinale = "";


        createConnection(); 
		Sql = 	"SELECT * FROM ("+
				"SELECT DISTINCT(data_iso) data_iso FROM VIEW_CC_PARAMETRI_GRAFICO WHERE IDEN_VISITA=? AND IDEN_PARAMETRO=5"+
				"AND data_ora>=to_date(?,'yyyyMMdd') AND data_ora<=to_date(?,'yyyyMMdd')+1 ORDER BY data_ora DESC"+
				") order by to_date(data_iso,'yyyyMMdd') desc";
		
		Integer i=0;
		test = new Hashtable<Integer, String>();
		try 
		{
			ps = this.conn_radsql.prepareStatement(Sql);
			ps.setInt(1, Integer.valueOf(this.idenVisita));
			ps.setString(2,this.dataRangeIn);
			ps.setString(3,this.dataRangeFi);			
			rs = ps.executeQuery();
			while (rs.next()) 
			{
				DataFinale = rs.getString("data_iso");
				test.put(i,DataFinale);
				i++;
			}
			while (test.size()<6){
				i++;
				/*Calendar dateFrom = Calendar.getInstance();
			    dateFrom.set(Integer.valueOf(DataFinale.substring(0, 4)) ,Integer.valueOf(DataFinale.substring(4, 6))-1,Integer.valueOf(DataFinale.substring(6, 8))); 
				dateFrom.add(Calendar.DAY_OF_MONTH,i);
				test.put(i,DateFormatUtils.format(dateFrom, "yyyyMMdd",TimeZone.getTimeZone("GMT+1")));
				*/
				test.put(i, DataFinale);
				
			}
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				rs.close();
				this.conn_radsql.close();
			} catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		
	}
	public JFreeChart retChart(String data)
    {
        createConnection(); 
    	PreparedStatement 	ps	= null;
    	ResultSet 			rs	= null;
		String Sql = "";
		TimeSeries s1 = new TimeSeries("L&G European Index Trust", Millisecond.class);
		TimeSeries s2 = new TimeSeries("L&G European Index Trust", Millisecond.class);
		TimeSeriesCollection seriesCollection = new TimeSeriesCollection();	
		Sql = "select * from VIEW_CC_PARAMETRI_GRAFICO where IDEN_VISITA=? and IDEN_PARAMETRO=5";
		Sql += " and data_ora>=to_date(?,'yyyyMMdd') and data_ora<=to_date(?,'yyyyMMdd')+1";
		try 
		{
			ps = this.conn_radsql.prepareStatement(Sql);
			ps.setInt(1, Integer.valueOf(this.idenVisita));
			ps.setString(2,data);
			ps.setString(3,data);
			rs = ps.executeQuery();
			while (rs.next()) 
			{
				s1.addOrUpdate(RegularTimePeriod.createInstance(Millisecond.class, new Date(new GregorianCalendar(rs.getInt("ANNO"), rs.getInt("MESE") - 1, rs.getInt("GIORNO"), rs.getInt("ORA"), 0).getTimeInMillis()), RegularTimePeriod.DEFAULT_TIME_ZONE), rs.getDouble("VALORE_1"));
			}
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				rs.close();
				this.conn_radsql.close();
			} catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		
		ps=null;
		rs=null;
		
		Sql = "Select * from table(cc_creacalendario_arry(?,?,?,6))";
		createConnection(); 
		try 
		{
	        
			ps = this.conn_radsql.prepareStatement(Sql);
			ps.setString(1,data);
			ps.setString(2,data);
			ps.setInt(3, Integer.valueOf(this.idenVisita));
			rs = ps.executeQuery();
			while (rs.next()) 
			{
				s1.addOrUpdate(RegularTimePeriod.createInstance(Millisecond.class, new Date(new GregorianCalendar(rs.getInt("ANNO"), rs.getInt("MESE") - 1, rs.getInt("GIORNO"), rs.getInt("ORA"), 0).getTimeInMillis()), RegularTimePeriod.DEFAULT_TIME_ZONE), 0);
			}
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				rs.close();
				this.conn_radsql.close();
			} catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		seriesCollection.addSeries(s1);
		seriesCollection.addSeries(s2);
		chart = ChartFactory.createTimeSeriesChart("", "", "", seriesCollection, true, true, false);
		return chart;
    }
    
    
    public XYDataset createDataset1()
    {
    	TimeSeries s1 = new TimeSeries("L&G European Index Trust", Millisecond.class);
    	
    	PreparedStatement 	ps	= null;
    	ResultSet 			rs	= null;
    	
    	String Sql = "Select * from table(cc_creacalendario_arry('20120224','20120224',110137,6))";
    	
    	try {
			ps = conn_radsql.prepareStatement(Sql);
			rs = ps.executeQuery();
			while (rs.next()){
				s1.addOrUpdate(RegularTimePeriod.createInstance(Millisecond.class,
                        new Date(new
                                 GregorianCalendar(	rs.getInt("ANNO"),
                                		 			rs.getInt("MESE") - 1,
                                		 			rs.getInt("GIORNO"),
                                		 			rs.getInt("ORA"),
                                		 			rs.getInt("MINUTI")).
                                 getTimeInMillis()),
                          RegularTimePeriod.DEFAULT_TIME_ZONE),10);  
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	
    	
    	TimeSeriesCollection dataset = new TimeSeriesCollection();
    	dataset.addSeries(s1);
    	return dataset;
    }

    public XYDataset createDataset2() 
    { 	
    	TimeSeries s2 = new TimeSeries("L&G UK Index Trust", Month.class);
    	s2.add(new Month(2, 2001), 129.6);
    	s2.add(new Month(3, 2001), 123.2);
    	s2.add(new Month(4, 2001), 117.2);
    	s2.add(new Month(5, 2001), 124.1);
    	s2.add(new Month(6, 2001), 122.6);
    	s2.add(new Month(7, 2001), 119.2);
    	s2.add(new Month(8, 2001), 116.5);
    	s2.add(new Month(9, 2001), 112.7);
    	s2.add(new Month(10, 2001), 101.5);
    	s2.add(new Month(11, 2001), 106.1);
    	s2.add(new Month(12, 2001), 110.3);
    	s2.add(new Month(1, 2002), 111.7);
    	s2.add(new Month(2, 2002), 111.0);
    	s2.add(new Month(3, 2002), 109.6);
    	s2.add(new Month(4, 2002), 113.2);
    	s2.add(new Month(5, 2002), 111.6);
    	s2.add(new Month(6, 2002), 108.8);
    	s2.add(new Month(7, 2002), 101.6);
    	TimeSeriesCollection dataset = new TimeSeriesCollection();

    	dataset.addSeries(s2);
    	return dataset;
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

    public Connection createConnection(){
		dbConnections db=null;
		try 
		{
			if (this.bUtente!=null)
			{
				this.conn_radsql = bUtente.db.getDataConnection();
			}
			else
			{
				db = new dbConnections();
				this.conn_radsql=db.getDataConnection();
			}
		}
		catch (SqlQueryException e) {
			e.printStackTrace();
		}
    	return this.conn_radsql;
    }
    
}
