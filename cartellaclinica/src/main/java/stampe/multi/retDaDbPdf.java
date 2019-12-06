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

import generic.statements.StatementFromFile;
import imago.lang.atr;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;

import polaris.digitalsign.RetrieveSignInfo;

public class retDaDbPdf{
   
private HttpSession session	 		= null; 
private String 		Nosologico 		= "";
private String	 	Funzione 		= null;
private String	 	idenRicovero	= null;
oggettoLetteraDB	letteraDb		= null;
	
	/*
	 * Vengono passati come costruttori all'oggetto retDaDbPdf il nosologico e l'insiemee delle funzioni di cui recuperare il report
	 */


	public retDaDbPdf (String noso,String fcn,String idenRicovero,HttpSession session)
	{
		this.session = session;
		setNosologico(noso);
		setFunzioni(fcn);
		setIdenRicovero(idenRicovero);
		this.letteraDb = new oggettoLetteraDB();
		this.letteraDb.setNosologico(getNosologico());
	}

	public byte[] elabora(){
		return retIdenLettera();

	}
	
	public byte[] retIdenLettera()  
	{
		StatementFromFile 	sff = null;
		ResultSet 			rs 	= null;
		boolean 			isPresent=false;
		byte[]				ret=null;
		new MergePDF();
		try
		{
			sff = new StatementFromFile(this.session);
			if (getFunzioni().equalsIgnoreCase("LETTERA_STANDARD") || getFunzioni().equalsIgnoreCase("LETTERA_PROSECUZIONE"))
				rs = sff.executeQuery("stampe.xml", "StampaGlobale.RecuperaIdenLettereFirmateReparto",new String[]{getNosologico(),getIdenRicovero(),getIdenRicovero(),getFunzioni()});
			else
				rs = sff.executeQuery("stampe.xml", "StampaGlobale.RecuperaIdenLettereFirmate",new String[]{getNosologico(),getFunzioni()});		
				while(rs.next())
				{
					isPresent = true;
					this.letteraDb.setArrayPdfLettera(rs.getInt("iden"), retClobLettera(rs.getInt("iden")));
				}
				if (!isPresent)
				{
					/*String Errore="JVBERi0xLjMNCjMgMCBvYmoNCjw8DQovUHJvZHVjZXIgKFBERlhDIExpYnJhcnkgXCh2ZXJzaW9uIDIuNVwpLikNCi9PU0luZm8gKHZpczogMTQ4OyB2ZXI6IDUuMTsgYm46IDAwMDAwYTI4OyBwbGF0ZjogMjsgQ0RTOiBTZXJ2aWNlIFBhY2sgMikNCi9DcmVhdGlvbkRhdGUgKEQ6MjAwNjA3MjAxMDAxNDArMDEnMDAnKQ0KPj4NCmVuZG9iag0KNCAwIG9iag0KPDwNCi9UeXBlIC9Gb250RGVzY3JpcHRvcg0KL0ZvbnROYW1lIC9DYWxpYnJpDQovRmxhZ3MgMzINCi9Gb250QkJveCBbLTQ3NiAtMTk0IDEyMTQgOTUyXQ0KL01pc3NpbmdXaWR0aCAyMjYNCi9TdGVtSCA4NQ0KL1N0ZW1WIDg1DQovSXRhbGljQW5nbGUgMA0KL0NhcEhlaWdodCA2MzgNCi9YSGVpZ2h0IDQ3MA0KL0FzY2VudCA5NTINCi9EZXNjZW50IC0yNjkNCi9MZWFkaW5nIDIyMQ0KL01heFdpZHRoIDEyODgNCi9BdmdXaWR0aCA1MDMNCj4+DQplbmRvYmoNCjUgMCBvYmoNCjw8DQovVHlwZSAvRm9udA0KL1N1YnR5cGUgL1RydWVUeXBlDQovQmFzZUZvbnQgL0NhbGlicmkNCi9GaXJzdENoYXIgMzINCi9MYXN0Q2hhciAxMjINCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nDQovRm9udERlc2NyaXB0b3IgNCAwIFINCi9XaWR0aHMgWyAyMjYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMA0KMjUyIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwDQowIDAgMCAwIDAgMCAwIDQ4OCAwIDAgMCAwIDAgMCAwIDANCjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDANCjAgMCAwIDQ3OSAwIDQyMyA1MjUgNDk4IDAgMCAwIDIyOSAwIDAgMjI5IDANCjUyNSA1MjcgNTI1IDAgMzQ5IDAgMzM1IDAgMCAwIDAgMCAzOTVdPj4NCmVuZG9iag0KNiAwIG9iag0KPDwNCi9GaWx0ZXIgWy9GbGF0ZURlY29kZV0gL0xlbmd0aCAxNDgNCj4+DQpzdHJlYW0NCnjaRY49C8IwEIb3g/sPNyZDYpI2bbKKdXATsolDqVGEYDQIgr/eEAou98LD+3EvhG1AUHSrRyrjKSwIphuktp56XXWgsEPY7DX1jsIV4cSmUnKJ/EzhgCBqrtMtp5r7U5kbpfWehHXS/guMk2r0a8kjpjTTwj0rcf7eMxeuMuLasEtM1Pgzl7dcd6b65xHhBxR0J9dlbmRzdHJlYW0NCmVuZG9iag0KNyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDEgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDUgMCBSDQo+Pg0KL1Byb2NTZXQgWy9QREYgL1RleHRdDQo+Pg0KL01lZGlhQm94IFswIDAgNTk1LjIgODQxLjkxOV0NCi9Db250ZW50cyBbNiAwIFJdDQo+Pg0KZW5kb2JqDQoxIDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2VzDQovQ291bnQgMQ0KL0tpZHMgWw0KNyAwIFINCl0NCj4+DQplbmRvYmoNCjIgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL1BhZ2VzIDEgMCBSDQo+Pg0KZW5kb2JqDQp4cmVmDQowIDgNCjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMTI1MCAwMDAwMCBuDQowMDAwMDAxMzE4IDAwMDAwIG4NCjAwMDAwMDAwMTAgMDAwMDAgbg0KMDAwMDAwMDE5NSAwMDAwMCBuDQowMDAwMDAwNDY2IDAwMDAwIG4NCjAwMDAwMDA4NTIgMDAwMDAgbg0KMDAwMDAwMTA4MCAwMDAwMCBuDQp0cmFpbGVyDQo8PA0KL1NpemUgOA0KL0luZm8gMyAwIFINCi9Sb290IDIgMCBSDQovSUQgWzw3QTAzNzEwRjJGNDUxNTUyNjJCOEY2MkMyQ0E0N0Y4ND48N0EwMzcxMEYyRjQ1MTU1MjYyQjhGNjJDMkNBNDdGODQ+XQ0KPj4NCnN0YXJ0eHJlZg0KMTM3Mw0KJSVFT0YNCg==";
					byte[] filebyte= atr.toByteArray(Errore);
					byte [] arrayInput=Base64.decodeBase64(filebyte);*/
					ret=("\u0000").getBytes();
				}
				else
				{
					ret = this.letteraDb.getPdfUnico();
				}
					
		
		}
		catch (SQLException e) 
		{//gestione eccezione rs
			e.printStackTrace();
		}
		catch (Exception e) 
		{//gestione eccezione statement from file
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				rs.close();
				sff.close();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
		}
		return ret;
	}

	
	private byte[] retClobLettera(Integer idenLettera) {
		StatementFromFile 	sff = null;
		ResultSet 			rs 	= null;
		byte []				pdf	= null;
		RetrieveSignInfo retrievePDF = new RetrieveSignInfo();
		String 				myBlob	= null;
		
		try
		{
			sff = new StatementFromFile(this.session);

			rs = sff.executeQuery("stampe.xml", "StampaGlobale.RecuperaClobLettereFirmate",new String[]{idenLettera.toString(),"S","N"});

			if (rs.next()) {
				myBlob = rs.getString("PDF_FIRMATO");
				
				byte[] filebyte = atr.toByteArray(myBlob);
				/*Modifica per recuperare il pdf del p7m*/
				pdf = Base64.decodeBase64(retrievePDF.GetPdfFromP7m(filebyte));
			}


		}
		catch (SQLException e) 
		{//gestione eccezione rs
			e.printStackTrace();
		}
		catch (Exception e) 
		{//gestione eccezione statement from file
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				rs.close();
				sff.close();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
		}
		return pdf;
	}

	public String getNosologico() 
	{
		return Nosologico;
	}

	public void setNosologico(String nosologico) 
	{
		Nosologico = nosologico;
	}

	public String getFunzioni() 
	{
		return Funzione;
	}

	public void setFunzioni(String funzioni) 
	{
		Funzione = funzioni;
	}	
	
	public String getIdenRicovero() {
		return idenRicovero;
	}

	public void setIdenRicovero(String idenVisita) {
		this.idenRicovero = idenVisita;
	}

	
}
