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
package refertazioneConsulenze;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.str.functionStr;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class intestazioneRefConsulenze 
{
    private String descrMedRef;
    private String cdcRepProv;
    private String paziente;
    private String idenTes;


	private functionDB fDB 	= null;
    private functionStr fStr = null;
    protected ElcoLoggerInterface			logger	 = null;
    
    public intestazioneRefConsulenze(String paziente,String descrMedRef,String cdcRepProv,functionDB fDB,functionStr fStr,String idenTes)
    {
    	this.fDB  	= fDB;
    	this.fStr 	= fStr; 
    	this.logger	= new ElcoLoggerImpl(this.getClass().getName()+".class");
    	
    	setPaziente(paziente);
    	setDescrMedRef(descrMedRef);
    	setCdcRepProv(cdcRepProv);
    	setIdenTes(idenTes);
	}
    
    public String getDescrMedRef() {
		return descrMedRef;
	}

	public void setDescrMedRef(String descrMedRef) {
		this.descrMedRef = descrMedRef;
	}

	public String getCdcRepProv() {
		return cdcRepProv;
	}

	public void setCdcRepProv(String cdcRepProv) {
		this.cdcRepProv = cdcRepProv;
	}

	public String getPaziente() {
		return paziente;
	}

	public void setPaziente(String paziente) {
		this.paziente = paziente;
	}

    public String getIdenTes() {
		return idenTes;
	}

	public void setIdenTes(String idenTes) {
		this.idenTes = idenTes;
	}
	
	public String getHtml()
    {
		String []Data		;
		String []Ora			;

    	String spanDatiAnagrafici = "<span class='header' id='spDatiAnagr'>" +
    								"<label>Paziente: "+getPaziente()+"&nbsp&nbsp&nbsp&nbsp&nbsp</label>";
    	
    	String spanMedicoRefertan = "<label>Medico Refertante: "+getDescrMedRef()+"&nbsp&nbsp&nbsp&nbsp&nbsp</label>";
    	
    	String spanRepartoRichied = "<label>Provenienza: "+getCdcRepProv()+"&nbsp&nbsp&nbsp&nbsp&nbsp</label>" +
									"</span>";
    	
    	Data					  = getDataOra("0",getIdenTes()).split("-");
    	if (Data[0].equals("R"))
    		Data[0]="ReadOnly";
    	else
    		Data[0]="";
    	
    	
    	String spanData			  = "<table class=\"tabDataOra\">" +
    								"<tr class=\"trDataOra\"><td class=\"tdDataOra\">"+
									"<label>Data di esecuzione: </label></td>" +
									"<td><input type=\"text\" id=\"idDataEsecuzione\" value=\""+Data[1]+"\" "+Data[0]+"></input>"+
									"</td>";
   
    	Ora						  = getDataOra("1",getIdenTes()).split("-");
    	if (Ora[0].equals("R"))
    		Ora[0]="ReadOnly";
    	else
    		Ora[0]="";
    	
    	String spanOra			  = "<td class=\"tdDataOra\">"+
									"<label>Ora di esecuzione: </label></td>" +
									"<td><input type=\"text\" id=\"idOraEsecuzione\" value=\""+Ora[1]+"\" "+Ora[0]+" ></input>"+
									"</td></tr></table>";									
    	
    	String spanEsami = "<div class='fieldset' id='spEsami'><span>Esami Associati</span>"+getDescrizioneEsami()+"</div>";
    	
	   return spanDatiAnagrafici+spanMedicoRefertan+spanRepartoRichied+spanData+spanOra+spanEsami;
	}



	/**
     * Calcola la data e l'ora da inserire nei campi di intestazione della consolle di refertazione. Se l'esame risulta essere nello stato
     * %R% allora vengono valorizzati con i campi DAT_ESA e ORA_ESA di ESAMI attraverso la query, se no viene valorizzato con sysdate 
     * @param campo
     * @param idenEsame
     * @return
     */
    public String getDataOra(String campo,String idenEsame)
    {
    	PreparedStatement ps;

		ResultSet rs=null;
		String ret = "";
		String sql = "";
		String retSql = "";
		
    	if (campo.equals("0"))
    	{ 
    		sql 	= "Select e.DAT_ESA from RADSQL.ESAMI E join RADSQL.COD_EST_ESAMI ce on (ce.iden_esame = e.iden) where ce.IDEN_INFOWEB_RICHIESTA=? and e.STATO like ? and rownum=1";
    		retSql 	= "DAT_ESA";
    	}
    	else
    	{
    		sql 	= "Select e.ORA_ESA from RADSQL.ESAMI E join RADSQL.COD_EST_ESAMI ce on (ce.iden_esame = e.iden) where ce.IDEN_INFOWEB_RICHIESTA=? and e.STATO like ? and rownum=1";
    		retSql 	= "ORA_ESA";    	
    	}
	
		try
		{
			ps = fDB.getConnectWeb().prepareStatement(sql);
			ps.setInt(1,Integer.valueOf(getIdenTes()));
			ps.setString(2, "%R%");
			rs = ps.executeQuery();
			while(rs.next())
			{	
				ret ="R-" + fStr.formatta_data(fStr.verifica_dato(rs.getString(retSql)));
				logger.info("intestazioneRefConsulenze - sql: "+sql+"data e ora: "+ret);
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
			logger.info("intestazioneRefConsulenze - "+e.getMessage());
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
			logger.info("intestazioneRefConsulenze - "+e.getMessage());
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (ret.equals(""))
		{
	    	if (campo.equals("0")) 
	    		ret = "NR-"+getDateTime(campo);
	    	else 
	    		ret = "NR-"+getDateTime(campo);
		}		
    	return ret;    	
    }
 
		
    private String getDateTime(String campo) 
    {
    	String Data    = "";
    	String Formato = "";
    	if (campo.equals("0")) 
    		Formato="dd/MM/yyyy";
    	else 
    		Formato="HH:mm";    	
        DateFormat dateFormat 	= new SimpleDateFormat(Formato);  
        Date date 				= new Date();  
        Data = dateFormat.format(date).toString();
        if (campo.equals("0")) 
        	logger.info("intestazioneRefConsulenze - DATA: "+Data);
        else
        	logger.info("intestazioneRefConsulenze - ORA: "+Data);        	
        return Data;
    }  
    
    private String getDescrizioneEsami() {
    	PreparedStatement ps;

		ResultSet rs=null;
		String ret = "";
		String sql = "";
		String retSql = "";
		
   		sql 	= "Select te.DESCR from RADSQL.ESAMI E join RADSQL.COD_EST_ESAMI ce on (ce.iden_esame = e.iden) join tab_esa te on (te.iden = e.iden_esa) where ce.IDEN_INFOWEB_RICHIESTA=? order by e.iden asc";
   		retSql 	= "DESCR";
	
		try
		{
			ps = fDB.getConnectWeb().prepareStatement(sql);
			ps.setInt(1,Integer.valueOf(getIdenTes()));
			rs = ps.executeQuery();
			while(rs.next())
			{	
				ret +="<li class='esami'>" + fStr.verifica_dato(rs.getString(retSql))+"</li>";
				logger.info("Descrizione Esami"+ret);
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
			logger.info("intestazioneRefConsulenze - "+e.getMessage());
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
			logger.info("intestazioneRefConsulenze - "+e.getMessage());
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return ret;
	}
}