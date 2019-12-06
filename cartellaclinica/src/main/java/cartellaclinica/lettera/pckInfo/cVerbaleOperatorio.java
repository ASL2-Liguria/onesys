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
package cartellaclinica.lettera.pckInfo;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Clob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Date;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.io.IOUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import configurazioneReparto.baseReparti;
import core.Global;
import imagoAldoUtil.classTabExtFiles;


public class cVerbaleOperatorio implements ILetteraInfo{

	HttpServletRequest request;
	HttpSession session;
	functionDB fDB;
	baseReparti bReparti;
	String idenAnag;
	String idenVisita;
	String ricovero;
	
	public static final String ARRIVATO_DA = "ITG_DATO_STRUTTURATO_VERBALE_OPERATORIO";
	public static final String NBSP = "&nbsp;";
	
	private SimpleDateFormat inputFormat;
	private SimpleDateFormat outputFormat;
	private ArrayList<String> diagnosi;
	private String diagnosiNote;
	private String intervento;
	private String interventoNote;
	private String terapiaAntiTrombotica;
	private String profilassiAntibiotica;
	private ArrayList<String> attoChirurgico;
	private String primoChirurgo;
	private String altriChirurghi;
	private String anestesisti;
	private String strumentisti;
	private String infermieri;
	private String infermieriAnestesia;
	private String altri;
	private String tsrm;
	private ArrayList<String> anestesia;
	private Date ingressoPreSala;
	private Date preparazioneAnestesia;
	private Date ingressoSala;
	private Date inizioAnestesia;
	private Date preparazioneChirurgica;
	private Date inizioIntervento;
	private Date fineIntervento;
	private Date fineProcedureAnestesiologiche;
	private Date uscitaSala;
	private Date uscitaPreSala;
	
	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(cVerbaleOperatorio.class);
	
	public void readDati()
	{
		idenAnag = chkNull(request.getParameter("idenAnag"));
		idenVisita = chkNull(request.getParameter("idenVisita"));
		ricovero = chkNull(request.getParameter("ricovero"));
		
		try {
			inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
			outputFormat = new SimpleDateFormat("dd/MM/yyyy' 'HH:mm");
		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		}
	}
	
	public void setRequest(HttpServletRequest request, HttpSession session, functionDB fDB){
		this.request = request;
		this.session = session;
		this.fDB = fDB;
		bReparti = Global.getReparti(this.session);
	}

	public String getHtml() {
		readDati();
		String resp="";
		
		try {
			String sql="Select c.codice, c.descrizione, csi.progressivo_intervento, csi.iden_intervento, csi.iden, csi.contenuto.getClobVal() xml from RADSQL.CC_SCHEDA_INTERVENTO csi "+
			"join radsql.Nosologici_Paziente np on csi.iden_visita = np.iden "+
			"join radsql.Cc_Icd c on c.iden = csi.iden_intervento "+
			"where np.num_nosologico = ? "+
			"and arrivato_da = '"+ARRIVATO_DA+"' "+
			"order by progressivo_intervento, iden";
			PreparedStatement ps=fDB.getConnectWeb().prepareCall(sql);
			ps.setString(1, ricovero);
			ResultSet rs=ps.executeQuery();
			
			String div = "<div class=\"divVerbaleOperatorio\" onselectstart=\"abilitaSelezione();\"><table>";
			String content = "";
			String field1 = "";
			String field2 = "";
			String field3 = "";
			String field4 = "";
			String field5 = "";
			String field6 = "";
			String field7 = "";
			String field8 = "";
			String field9 = "";
			
			int progressivoIntervento = -1;
			String header1 = "<th colspan=\"2\">DIAGNOSI</th></tr><tr>";
			String header2 = "<th colspan=\"2\">INTERVENTO</th></tr><tr>";
			String header3 = "<th colspan=\"2\">PROCEDURE</th></tr><tr>";
			String header4 = "<th colspan=\"2\">ATTO CHIRURGICO</th></tr><tr>";
			String header5 = "<th colspan=\"2\">TERAPIA ANTITROMBOTICA</th></tr><tr>";
			String header6 = "<th colspan=\"2\">PROFILASSI ANTIBIOTICA</th></tr><tr>";
			String header7 = "<th colspan=\"2\">EQUIPE MEDICA</th></tr><tr>";
			String header8 = "<th colspan=\"2\">TIPOLOGIA ANESTESIA</th></tr><tr>";
			String header9 = "<th colspan=\"2\">TEMPI PROCEDURE</th></tr><tr>";
			final String separator = "<tr><th colspan=\"2\">&nbsp;</th></tr>";
			
			boolean parseWithErrors = false;
			
			while (rs.next()) {
				int p = rs.getInt("PROGRESSIVO_INTERVENTO");
				if (p != progressivoIntervento) {
					// Nuovo progressivo
					progressivoIntervento = p;
					div += content;
					Clob clob = null;
					try {
						clob = rs.getClob("XML");
						parseXml(clob);
					} catch(Exception e) {
						logInterface.error(e.getMessage(), e);
						content = "<tr><th colspan=\"2\">SI E' VERIFICATO UN ERRORE DI LETTURA</th></tr>"+
						"<tr><th>Dettagli</th><td>"+e.getMessage()+"</td></tr>";
						parseWithErrors = true;
					} finally {
						if (clob != null) clob.free();
					}
					
					if (parseWithErrors) break;
					
					// Diagnosi
					for (String s: diagnosi) {
						if (!field1.equals("")) field1 += "</tr><tr>";
						field1 += "<th>Descrizione</th><td>"+s+"</td>";
					}
					field1+= "</tr><tr><th>Note</th><td>"+diagnosiNote+"</td>";
					
					// Intervento
					field2 = "<th>Descrizione</th><td>"+intervento+"</td>";
					field2+= "</tr><tr><th>Note</th><td>"+interventoNote+"</td>";
					
					// Procedure
					field3 = "<td colspan=\"2\">"+rs.getString("codice")+" - "+rs.getString("descrizione")+"</td>";
					
					// Atto chirurgico
					field4 = "";
					for (String s: attoChirurgico) {
						if (!field4.equals("")) field4 += "</tr><tr>";
						field4 += "<td colspan=\"2\" style=\"text-align:justify\">"+s+"</td>";
					}
					
					// Terapia antitrombotica
					field5 = "<td colspan=\"2\">"+terapiaAntiTrombotica+"</td>";
					
					// Profilassi antibiotica
					field6 = "<td colspan=\"2\">"+profilassiAntibiotica+"</td>";
					
					// Equipe medica
					field7 = "<th>Primo chirurgo</th><td>"+primoChirurgo+"</td>"; // sempre visibile
					field7+= !isBlank(altriChirurghi) ? "</tr><tr><th>Altri chirurghi</th><td>"+altriChirurghi+"</td>" : "";
					field7+= !isBlank(anestesisti) ? "</tr><tr><th>Anestesisti</th><td>"+anestesisti+"</td>" : "";
					field7+= !isBlank(strumentisti) ? "</tr><tr><th>Strumentisti</th><td>"+strumentisti+"</td>" : "";
					field7+= !isBlank(infermieri) ? "</tr><tr><th>Infermieri</th><td>"+infermieri+"</td>" : "";
					field7+= !isBlank(infermieriAnestesia) ? "</tr><tr><th>Infermieri anestesia</th><td>"+infermieriAnestesia+"</td>" : "";
					field7+= !isBlank(altri) ? "</tr><tr><th>Altri</th><td>"+altri+"</td>" : "";
					field7+= !isBlank(tsrm) ? "</tr><tr><th>TSRM</th><td>"+tsrm+"</td>" : "";
					
					// Tipologia anestesia				
					field8 = "";
					for (String s: anestesia) {
						if (!field8.equals("")) field8 += "</tr><tr>";
						field8 += "<td colspan=\"2\" style=\"text-align:justify\">"+s+"</td>";
					}
					
					// Tempi procedure
					field9 = "<th>Ingresso Pre Sala</th><td>"+(ingressoPreSala != null ? outputFormat.format(ingressoPreSala) : NBSP)+"</td>"; // sempre visibile
					field9+= preparazioneAnestesia != null ? "</tr><tr><th>Preparazione Anestesia</th><td>"+outputFormat.format(preparazioneAnestesia)+"</td>" : "";
					field9+= ingressoSala != null ? "</tr><tr><th>Ingresso in Sala</th><td>"+outputFormat.format(ingressoSala)+"</td>" : "";
					field9+= inizioAnestesia != null ? "</tr><tr><th>Inizio Anestesia</th><td>"+outputFormat.format(inizioAnestesia)+"</td>" : "";
					field9+= preparazioneChirurgica != null ? "</tr><tr><th>Preparazione Chirurgica</th><td>"+outputFormat.format(preparazioneChirurgica)+"</td>" : "";
					field9+= inizioIntervento != null ? "</tr><tr><th>Inizio Intervento</th><td>"+outputFormat.format(inizioIntervento)+"</td>" : "";
					field9+= fineIntervento != null ? "</tr><tr><th>Fine Intervento</th><td>"+outputFormat.format(fineIntervento)+"</td>" : "";
					field9+= fineProcedureAnestesiologiche != null ? "</tr><tr><th>Fine Proc. Anestesiologiche</th><td>"+outputFormat.format(fineProcedureAnestesiologiche)+"</td>" : "";
					field9+= uscitaSala != null ? "</tr><tr><th>Uscita dalla sala</th><td>"+outputFormat.format(uscitaSala)+"</td>" : "";
					field9+= uscitaPreSala != null ? "</tr><tr><th>Uscita pre sala</th><td>"+outputFormat.format(uscitaPreSala)+"</td>" : "";
	
				} else {// Progressivo già analizzato
					// Procedure (accodamento)
					field3 += "</tr><tr><td colspan=\"2\">"+rs.getString("codice")+" - "+rs.getString("descrizione")+"</td>";
				}
				content = 
				"<tr>"+header1+field1+"</tr>"+
				"<tr>"+header2+field2+"</tr>"+
				"<tr>"+header3+field3+"</tr>"+
				"<tr>"+header4+field4+"</tr>"+
				"<tr>"+header5+field5+"</tr>"+
				"<tr>"+header6+field6+"</tr>"+
				"<tr>"+header7+field7+"</tr>"+
				"<tr>"+header8+field8+"</tr>"+
				"<tr>"+header9+field9+"</tr>"+
				separator;
			} // end while
	
			if (content.equals("")) content = "<tr><th>NESSUN DATO PRESENTE</th></tr>";
			
			div += content;
			div += "</table></div>";
			
			fDB.close(rs);
			if (rs != null) rs.close();
			if (ps != null) ps.close();
			
			resp+= div;
			resp+= getSpecificLink();
		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		}
		return resp;
	}
	
	private void parseXml(Clob clob) throws Exception {
		diagnosi                      = new ArrayList<String>();
		diagnosiNote                  = new String(NBSP);
		intervento                    = new String(NBSP);
		interventoNote                = new String(NBSP);
		terapiaAntiTrombotica         = new String(NBSP);
		profilassiAntibiotica         = new String(NBSP);
		attoChirurgico                = new ArrayList<String>();
		primoChirurgo                 = new String(NBSP);
		altriChirurghi                = new String(NBSP);
		anestesisti                   = new String(NBSP);
		strumentisti                  = new String(NBSP);
		infermieri                    = new String(NBSP);
		infermieriAnestesia           = new String(NBSP);
		altri                         = new String(NBSP);
		tsrm                          = new String(NBSP);
		anestesia                     = new ArrayList<String>();
		ingressoPreSala               = null;
		preparazioneAnestesia         = null;
		ingressoSala                  = null;
		inizioAnestesia               = null;
		preparazioneChirurgica        = null;
		inizioIntervento              = null;
		fineIntervento                = null;
		fineProcedureAnestesiologiche = null;
		uscitaSala                    = null;
		uscitaPreSala                 = null;
		
		//InputStream is = new ByteArrayInputStream(IOUtils.toByteArray(clob.getCharacterStream(), "UTF-8"));
		SAXBuilder builder = new SAXBuilder();
		Document docXml = builder.build(clob.getCharacterStream());
		
		// Verbale
		Element verbale = docXml.getRootElement().getChild("DATO_STRUTTURATO_VERBALE_OPERATORIO").getChild("verbale__operatorio.elco.it.VERBALEOPERATORIO");
		if (verbale == null) throw new Exception("Formato dell'xml errato");
		
		// Intervento
		Element intervento = verbale.getChild("intervento"); 
		if (intervento == null) throw new Exception("Formato dell'xml errato");
		
		// Terapia anti-trombotica
		try {
			terapiaAntiTrombotica = verbale.getChildText("terapiaantitrombotica").toLowerCase().equals("true") ? "Eseguita" : "Non eseguita";
		} catch (Exception e) {
			terapiaAntiTrombotica = new String(NBSP);
		}
		
		// Terapia antibiotica
		try {
			profilassiAntibiotica = verbale.getChildText("profilassiantibiotica").toLowerCase().equals("true") ? "Eseguita" : "Non eseguita";
		} catch (Exception e) {
			profilassiAntibiotica = new String(NBSP);
		}
		
		// Intervento
		try {
			this.intervento = intervento.getChildText("descrizione");
			if (this.intervento == null) throw new NullPointerException();
		} catch (Exception e) {
			this.intervento = new String(NBSP);
		}
		
		// Note intervento
		try {
			interventoNote = intervento.getChildText("interventonote");
			if (interventoNote == null) throw new NullPointerException();
		} catch (Exception e) {
			interventoNote = new String(NBSP);
		}
		
		// Diagnosi
		List<?> diagnosi;
		Iterator<?> it;
		try {
			diagnosi = intervento.getChild("diagnosi").getChildren("verbale__operatorio.elco.it.VERBALEOPERATORIO_-INTERVENTO_-DIAGNOSI");
			it = diagnosi.iterator();
			while (it.hasNext()) {
				Element nodo = (Element) it.next();
				this.diagnosi.add(nodo.getChildText("codice")+ " - " + nodo.getChildText("descrizione"));
			}
		} catch (Exception e) {
			this.diagnosi = new ArrayList<String>();
			this.diagnosi.add(NBSP);
		}
		
		// Note diagnosi
		try {
			diagnosiNote = intervento.getChildText("diagnosinote");
			if (diagnosiNote == null) throw new NullPointerException();
		} catch (Exception e) {
			diagnosiNote = new String(NBSP);
		}
		
		// Atto chirurgico
		List<?> attoChirurgico;
		try {
			attoChirurgico = verbale.getChild("attochirurgico").getChildren("verbale__operatorio.elco.it.VERBALEOPERATORIO_-ATTOCHIRURGICO");
			it = attoChirurgico.iterator();
			while (it.hasNext()) {
				Element nodo = (Element) it.next();
				this.attoChirurgico.add(nodo.getChildText("descrizione"));
			}
		} catch (Exception e) {
			this.attoChirurgico = new ArrayList<String>();
			this.attoChirurgico.add(NBSP);
		}
		
		// Equipe
		Element equipe;
		try {
			equipe = verbale.getChild("equipe");
			try {
				primoChirurgo = getString(equipe.getChildren("primochirurgo"), "string");
			} catch (Exception e) {
				primoChirurgo = new String(NBSP);
			}
			
			try {
				altriChirurghi = getString(equipe.getChildren("altrichirurghi"), "string");
			} catch (Exception e) {
				altriChirurghi = new String(NBSP);
			}
			
			try {
				anestesisti = getString(equipe.getChildren("anestesisti"), "string");
			} catch (Exception e) {
				anestesisti = new String(NBSP);
			}
			
			try {
				strumentisti = getString(equipe.getChildren("strumentisti"), "string");
			} catch (Exception e) {
				strumentisti = new String(NBSP);
			}
			
			try {
				infermieri = getString(equipe.getChildren("infermieri"), "string");
			} catch (Exception e) {
				infermieri = new String(NBSP);
			}
			
			try {
				infermieriAnestesia = getString(equipe.getChildren("infermierianestesia"), "string");
			} catch (Exception e) {
				infermieriAnestesia = new String(NBSP);
			}
			
			try {
				altri = getString(equipe.getChildren("altri"), "string");
			} catch (Exception e) {
				altri = new String(NBSP);
			}
			
			try {
				tsrm = getString(equipe.getChildren("tsrm"), "string");
			} catch (Exception e) {
				tsrm = new String(NBSP);
			}
		} catch (Exception e) {
			primoChirurgo = new String(NBSP);
			altriChirurghi = new String(NBSP);
			anestesisti = new String(NBSP);
			strumentisti = new String(NBSP);
			infermieri = new String(NBSP);
			infermieriAnestesia = new String(NBSP);
			altri = new String(NBSP);
			tsrm = new String(NBSP);
		}
		
		// Anestesia
		List<?> anestesia;
		try {
			anestesia = verbale.getChild("cartellaanestesiologica").getChild("tipologiaanestesia").getChildren("verbale__operatorio.elco.it.VERBALEOPERATORIO_-CARTELLAANESTESIOLOGICA_-TIPOLOGIAANESTESIA");
			it = anestesia.iterator();
			while (it.hasNext()) {
				Element nodo = (Element) it.next();
				this.anestesia.add(nodo.getChildText("descrizione"));
			}
		} catch (Exception e) {
			this.anestesia = new ArrayList<String>();
			this.anestesia.add(NBSP);
		}
		
		// Tempi procedure
		String s;
		try {
			s = verbale.getChild("tempiprocedure").getChild("ingressopresala").getChildText("lexicalValue"); 
			ingressoPreSala = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {ingressoPreSala = null;}
		
		try {
			s = verbale.getChild("tempiprocedure").getChild("preparazioneanestesia").getChildText("lexicalValue"); 
			preparazioneAnestesia = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {preparazioneAnestesia = null;}
		
		try {
			s = verbale.getChild("tempiprocedure").getChild("ingressosala").getChildText("lexicalValue"); 
			ingressoSala = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {ingressoSala = null;}
		
		try {
			s = verbale.getChild("tempiprocedure").getChild("inizioanestesia").getChildText("lexicalValue"); 
			inizioAnestesia = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {inizioAnestesia = null;}

		try {
			s = verbale.getChild("tempiprocedure").getChild("preparazionechirurgica").getChildText("lexicalValue"); 
			preparazioneChirurgica = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {preparazioneChirurgica = null;}
		
		try {
			s = verbale.getChild("tempiprocedure").getChild("iniziointervento").getChildText("lexicalValue"); 
			inizioIntervento = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {inizioIntervento = null;}
		
		try {
			s = verbale.getChild("tempiprocedure").getChild("fineintervento").getChildText("lexicalValue"); 
			fineIntervento = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {fineIntervento = null;}
		
		try {
			s = verbale.getChild("tempiprocedure").getChild("fineprocedureanestesiologiche").getChildText("lexicalValue"); 
			fineProcedureAnestesiologiche = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {fineProcedureAnestesiologiche = null;}

		try {
			s = verbale.getChild("tempiprocedure").getChild("uscitasala").getChildText("lexicalValue"); 
			uscitaSala = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {uscitaSala = null;}

		try {
			s = verbale.getChild("tempiprocedure").getChild("uscitapresala").getChildText("lexicalValue"); 
			uscitaPreSala = inputFormat.parse(Pattern.compile("\\:([0-9]+)$").matcher(s).replaceAll("$1"));
		} catch (Exception e) {uscitaPreSala = null;}
	}
	
	private String getSpecificLink() throws SqlQueryException, SQLException {
        return classTabExtFiles.getIncludeString(fDB.getConnectWeb(), "TAB_EXT_FILES", this.getClass().getName(), "");
	}
	
	private String getString(List<?> element, String childName) {
		final String separator = ", ";
		Iterator<?> it = element.iterator();
		String s = "";
		while (it.hasNext()) {
			Element node = (Element) it.next();
			s += node.getChildText(childName)+separator;
		}
		s = s.substring(0, s.lastIndexOf(separator));
		if (s.equals("")) return new String(NBSP);
		return s;
	}
	
	private String chkNull(String in) {
		if (in==null)
			return "";
		return in;
	}
	
	private boolean isBlank(String s) {
		if (s.equals("") || s.equals(NBSP))
			return true;
		return false;
	}
}
