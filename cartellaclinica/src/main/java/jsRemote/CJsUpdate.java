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
package jsRemote;

import imago.a_sql.CLogError;
import imago.http.baseClass.baseUser;
import imago.sql.CallStoredProcedure;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago.sql.TableInsert;
import imago.sql.TableResultSet;
import imago.sql.TableUpdate;
import imagoAldoUtil.classStringUtil;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import plugin.getPoolConnection;
import core.Global;

/**
 * <p>
 * Title:
 * </p>
 *
 * <p>
 * Description:
 * </p>
 *
 * <p>
 * Copyright:
 * </p>
 *
 * <p>
 * Company:
 * </p>
 *
 * @author elenad
 * @version 1.0
 */
public class CJsUpdate {
    private baseUser logged_user = null;
    private HttpServletRequest request = null;
    private CLogError log = null;
    
    private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(CJsUpdate.class );
    
    public CJsUpdate() {
    }

    /* Metodo che setta le variabili che servono ai metodi della classe */
    private String setVariabili() {
        HttpSession session = null;
        String error = new String("");

        session = (WebContextFactory.get()).getSession(false);
        /* Problema della Sessione Scaduta */
        if(session == null) {
            error = "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
        }
        else {
            logged_user = Global.getUser(session);
            this.request = (HttpServletRequest) (WebContextFactory.get()).getHttpServletRequest();
            try {
                this.log = new CLogError(this.logged_user.db.getWebConnection(), request, "CJsUpdate", this.logged_user.login);
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        }
        return error;
    }

    /**
     *
     * @param op_query
     *           String contiene 1: inserimento
     *           2: modifica
     *
     * @return String eccezione
     */
    public String insert_update(String op_query) {
        String error = null;
        String split[] = null;
        int operazione = 0;
        String query = new String("");

        TableInsert insert = null;
        TableUpdate update = null;

        error = this.setVariabili();

        if(error != null && !error.equals("")) {
            return error;
        }

        try {
            split = op_query.split("[@]");
            operazione = Integer.parseInt(split[0]);
            query = split[1];
        }
        catch(Exception e) {
            error += e.getMessage();
            this.log.writeError("jsRemote.CJsUpdate.insert_update():split " + op_query + " -- " + e.getMessage());
        }

        switch(operazione) {
        case 1:
            insert = new TableInsert();
            try {
                insert.insertQuery(this.logged_user.db.getDataConnection(), query);
            }
            catch(SqlQueryException sqle) {
                error += sqle.getMessage();
                this.log.writeError("jsRemote.CJsUpdate.insert_update():insert " + error + " -- " + sqle.getMessage());
            }
            finally {
                try {
                    insert.close();
                }
                catch(Exception e) {
                    error += e.getMessage();
                    this.log.writeError("jsRemote.CJsUpdate.insert_update():insert 2:" + error + " -- " + e.getMessage());
                }
            }

            break;

        case 2:
            update = new TableUpdate();
            try {
                update.updateQuery(this.logged_user.db.getDataConnection(), query);
            }
            catch(Exception e) {
                error += e.getMessage();
                this.log.writeError("jsRemote.CJsUpdate.insert_update():update " + error + " -- " + e.getMessage());
            }
            finally {
                try {
                    update.close();
                }
                catch(Exception e) {
                    error += e.getMessage();
                    this.log.writeError("jsRemote.CJsUpdate.insert_update():update 2: " + error + " -- " + e.getMessage());
                }
            }

            break;
        }

        return error;

    }

    /**
     *
     * @param param
     *           String contiene le insert da effettuare separate dal carattere
     *           '@'
     * @return String
     */
    public String ripeti_operazione(String param) {
        String error = null;
        String split[] = null;
        String query = new String("");
        TableInsert insert = null;
        TableUpdate update = null;
        int operazione = 0;

        error = this.setVariabili();

        if(error != null && !error.equals("")) {
            return error;
        }

        try {
            split = param.split("[@]");
            operazione = Integer.parseInt(split[0]);
        }
        catch(Exception e) {
            error += e.getMessage();
            this.log.writeError("jsRemote.CJsUpdate.ripeti_operazione():split " + param + " -- " + e.getMessage());
        }

        switch(operazione) {
        case 1:
            try {
                for(int i = 1; i < split.length; i++) {
                    insert = new TableInsert();
                    query = split[i];
                    insert.insertQuery(this.logged_user.db.getDataConnection(), query);
                    try {
                        insert.close();
                        insert = null;
                    }
                    catch(Exception e) {
                    }
                }
            }
            catch(Exception e) {
                error += e.getMessage();
                this.log.writeError("jsRemote.CJsUpdate.ripeti_operazione():insert " + query + " -- " + e.getMessage());
            }

            break
                    ;

        case 2:
            try {
                for(int i = 1; i < split.length; i++) {
                    update = new TableUpdate();
                    query = split[i];
                    update.updateQuery(this.logged_user.db.getDataConnection(), query);
                    try {
                        update.close();
                        update = null;
                    }
                    catch(Exception e) {
                    }
                }
            }
            catch(Exception e) {
                error += e.getMessage();
                this.log.writeError("jsRemote.CJsUpdate.ripeti_operazione():update " + query + " -- " + e.getMessage());
            }

            break
                    ;
        }

        return error;

    }

    /**
     *
     * @param param
     *           String contine la select,
     *           il campo che interessa ottenere dal resultSet
     *           il tipo di campo:1(stringa), 2(intero), 3(long)
     *                            4(altro campo stringa), 5(altro campo intero) 6(altro campo long)
     * @return String
     */
    public String select(String param) {
        String output = null;
        String split[] = null;
        String split_campo[] = null;
        String split_tipo[] = null;
        String query = new String("");
        String campo = new String("");
        String output_1 = new String("");
        String output_2 = new String("");
        String output_3 = new String("");
        String output_4 = new String("");
        String output_5 = new String("");
        String output_6 = new String("");

        int tipo = -1;
        TableResultSet trs = null;

        output = this.setVariabili();
        if(output != null && !output.equals("")) {
            return output;
        }
        else {
            output = "";
        }

        try {
            split = param.split("[@]");
            query = split[0];

            split_campo = split[1].split("[*]");
            split_tipo = split[2].split("[*]");
        }
        catch(Exception e) {
            this.log.writeError("jsRemote.CJsUpdate.select(): " + query + " -- " + e.getMessage());
        }

        try {
            trs = new TableResultSet();
            trs.getResultSet(this.logged_user.db.getDataConnection(), query);
            while(trs.rs.next()) {
                for(int i = 0; i < split_campo.length; i++) {
                    tipo = Integer.parseInt(split_tipo[i]);
                    campo = split_campo[i];

                    if(tipo == 1) {
                        output_1 += trs.rs.getString(campo) + "@";
                    }
                    else if(tipo == 2) {
                        output_2 += trs.rs.getInt(campo) + "*";
                    }
                    else if(tipo == 3) {
                        output_3 += trs.rs.getFloat(campo) + "#";
                    }
                    else if(tipo == 4) {
                        output_4 += trs.rs.getString(campo) + "?";
                    }
                    else if(tipo == 5) {
                        output_5 += trs.rs.getInt(campo) + "!";
                    }
                    else if(tipo == 6) {
                        output_6 += trs.rs.getFloat(campo) + "&";
                    }
                }
            }
        }
        catch(Exception e) {
            this.log.writeError("jsRemote.CJsUpdate.select():2 " + e.getMessage());
        }
        finally {
            try {
                trs.close();
            }
            catch(Exception e) {
                this.log.writeError("jsRemote.CJsUpdate.select()3: " + e.getMessage());
            }
        }
        output = output_1 + "$" + output_2 + "$" + output_3 + "$" + output_4 + "$" + output_5 + "$" + output_6;
        return output;
    }

    /**
     *
     * @param stringa_input
     *           String contiene nome procedura,
     *           parametro di input,
     *           true o false indica se la procedura ha parametro di ritorno
     *           indica il tipo di parametro di ritorno della procedura
     *
     * @return String
     */
    public String call_stored_procedure(String stringa_input) {
        HttpSession session = null;
        CallStoredProcedure sp = null;
        ArrayList parametri_sp = new ArrayList();
        String error = new String("");
        boolean output = false;
        String type_return_value = null;
        String param_output = null;
        int size = 0;

        session = (WebContextFactory.get()).getSession(false);
        if(session == null) {
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
        }

        logged_user = Global.getUser(session);

        String input[] = stringa_input.split("@");

        try {
            size = input[1].split(",").length;
            if(input != null && input[1] != null && size > 0) {
                for(int i = 0; i < size; i++) {
                    parametri_sp.add(input[1].split(",")[i]); //parametri di input
                }
            }

            output = Boolean.parseBoolean(input[2]); //indica se ha un parametro di ritorno

            type_return_value = input[3]; //tipo del parametro di ritorno

            sp = new CallStoredProcedure();
            try {
                param_output = sp.executeStoredProcedure(logged_user.db.getDataConnection(), input[0], parametri_sp, output, type_return_value);
            }
            catch(SqlQueryException sqle) {
                error = sqle.toHTMLText();
            }
        }
        catch(Exception e) {
            error += "jsRemote.CJsUpdate.call_stored_procedure(): " + e.getMessage();
        }

        if(error != null && error.equals("")) {
            error = param_output;
        }

        return error;
    }

    /**
     * Metodo che effettua la cancellazione di un tracciante o di un bidone di
     * m.n.
     * La cancellazione di un tracciante e' permessa <=> il tracciante NON e'
     * associato a nessun esame
     * La cancellazione di un bidone e' permessa <=> e' vuoto
     *
     *
     * @param parametri
     *           String contiene:
     *           select per effettuare il controllo se il record puo' essere
     *           cancellato o meno
     *           messaggio di alert
     *           stringa di update per la cancellazione
     **/

    public String cancellazione_magazzinomn(String parametri) {
        int record_trovati = 0;
        String error = new String("");
        String select = new String("");
        String message = new String("");
        String input[] = null;
        HttpSession session = null;
        TableResultSet trs = null;
        TableUpdate upd = null;

        session = (WebContextFactory.get()).getSession(false);
        if(session == null) {
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
        }

        try {
            trs = new TableResultSet();
            logged_user = Global.getUser(session);
            input = parametri.split("@");

            select = input[0];
            message = input[1];

            if(!classStringUtil.checkNull(select).equals("")) {
                trs.getResultSet(logged_user.db.getDataConnection(), select);
                if(trs.rs.next()) {
                    record_trovati = trs.rs.getInt("record_trovati");
                }
            }
            if(record_trovati != 0) {
                error = message;
                return error;
            }
            else {
                upd = new TableUpdate();
                try {
                    upd.updateQuery(this.logged_user.db.getDataConnection(), input[2]);
                }
                catch(Exception e) {
                    error = this.getClass().getName() + "cancellazione_magazzinomn(): MODIFICA " + input[2];
                }
                finally {
                    try {
                        upd.close();
                    }
                    catch(Exception e) {
                        e.printStackTrace();
                    }
                    upd = null;
                }
            }

        }
        catch(Exception e) {
            error += "jsRemote.CJsUpdate.cancellazione_magazzinomn(): parametri input: " + parametri + " - select: " + select + " - messaggio di errore: " + message + " -- " + e.getMessage();
        }

        finally {
            try {
                trs.close();
            }
            catch(Exception e) {
                e.printStackTrace();
            }
            trs = null;
        }
        return error;
    }


    /**
     *
     * @param param String
     * @return String
     */
    public String stampaOnDemand(String param, String daStampare) {
        Connection connessioneRepository = null;
        String poolRegistryName = null;
        String user = null;
        String pwd = null;
        String tipoCriptazione = null;
        ServletContext context = null;
        getPoolConnection poolRepository = null;

        String output = new String("");
        new String("");
        new String("");
        new String("");
        new String("");
        new String("");
        new String("");
        new String("");
        new String("");
        
        String TestataRichieste[]= null;
        
        ResultSet rstUri = null;
        Statement st;
        String sqlQuery = null;
        String sqlInsert = null;
        String UriToPrint;
		String foglioStile;
		String prov;
		String parent;
		
		logInterface.error("inizio di stampaOnDemand");
		output = this.setVariabili();
        if(output != null && !output.equals("")) {
            return output;
        }
        else {
            output = "";
        }
		//this.log.writeInfo("inizio di stampaOnDemand");
		logInterface.debug("inizio di stampaOnDemand");
        try {
            context = (WebContextFactory.get()).getServletContext();

            poolRegistryName = context.getInitParameter("RegistryPoolName");
            user = context.getInitParameter("RegistryUser");
            pwd = context.getInitParameter("RegistryPwd");
            tipoCriptazione = context.getInitParameter("CryptType");

            poolRepository = new getPoolConnection(poolRegistryName, user, pwd, tipoCriptazione);
            connessioneRepository = poolRepository.getConnection();
            //this.log.writeInfo("connessione al registry eseguita");
            //this.log.writeInfo("param =" + param);
            logInterface.debug("connessione al registry eseguita");
            logInterface.debug("param =" + param);
            TestataRichieste = param.split("[*]");
            
            for (int i=0; i< TestataRichieste.length; i++){
            	this.log.writeInfo("iden richiesta=" + TestataRichieste[i]);
	            if (daStampare.equalsIgnoreCase("S"))
	            	sqlQuery = "select * from view_print_pdf where identificativo_esterno = 'WHALE" + TestataRichieste[i] + "'";
	            else
	            	sqlQuery = "select * from view_print_documenti_richiesta where identificativo_esterno = 'WHALE" + TestataRichieste[i] + "'";
	        	try{
	        		//this.log.writeInfo("sqlQuery =" + sqlQuery);
	        		logInterface.debug("sqlQuery =" + sqlQuery);
	        		st = connessioneRepository.createStatement();
	        		rstUri = st.executeQuery(sqlQuery);
	        		while (rstUri.next()){
	            		UriToPrint= rstUri.getString("URI");
	            		if (daStampare.equalsIgnoreCase("S")) 
	            			prov = rstUri.getString("PROVENIENZA");
	            		else prov="";
						parent = rstUri.getString("PARENT");
						foglioStile = rstUri.getString("FOGLIO_DI_STILE");
						if (foglioStile == null) 
							foglioStile="";
						// compila la stringa output con uri e foglio di stile
						output += UriToPrint + '@' + foglioStile + "@"; 
						if (daStampare.equalsIgnoreCase("S")){
							try{
								sqlInsert="insert into PRINTEDOBJECT (ID,PROVENIENZA,PRINT_TIME) VALUES ('" + parent + "','" + prov + "',to_char(sysdate,'DD/MM/YYYY HH24:Mi:SS'))";
								connessioneRepository.createStatement().executeUpdate(sqlInsert);
							}
							catch(Exception e) {
			                    output = "jsRemote.CJsUpdate.stampaOnDemand(): errore insert query " + e.getMessage();
			            	}
						}
	        		}
	        	}
	        	catch(Exception e) {
	                output = "jsRemote.CJsUpdate.stampaOnDemand(): errore select query " + e.getMessage();
	        	}
	        
            } // for i	
        
        }
        catch(Exception e) {
            output = "jsRemote.CJsUpdate.stampaOnDemand(): connessioneRepository non creata RegistryPoolName=" + poolRegistryName + " - user=" + user + "-pwd=" + pwd + "-tipoCriptazione=" + tipoCriptazione + " --- " + e.getMessage();
        }

        /* output = this.setVariabili();
        if(output != null && !output.equals("")) {
            return output;
        }
        else {
            output = "";
        }

        try {
            split = param.split("[@]");
            query = split[0];

            split_campo = split[1].split("[*]");
            split_tipo = split[2].split("[*]");
        }
        catch(Exception e) {
            this.log.writeError("jsRemote.CJsUpdate.select(): " + query + " -- " + e.getMessage());
        }

        try {
            trs = new TableResultSet();
            trs.getResultSet(connessioneRepository, query);
            while(trs.rs.next()) {
                for(int i = 0; i < split_campo.length; i++) {
                    tipo = Integer.parseInt(split_tipo[i]);
                    campo = split_campo[i];

                    if(tipo == 1) {
                        output_1 += trs.rs.getString(campo) + "@";
                    }
                    else if(tipo == 2) {
                        output_2 += trs.rs.getInt(campo) + "*";
                    }
                    else if(tipo == 3) {
                        output_3 += trs.rs.getFloat(campo) + "#";
                    }
                    else if(tipo == 4) {
                        output_4 += trs.rs.getString(campo) + "?";
                    }
                    else if(tipo == 5) {
                        output_5 += trs.rs.getInt(campo) + "!";
                    }
                    else if(tipo == 6) {
                        output_6 += trs.rs.getFloat(campo) + "&";
                    }
                }
            }
        }
        catch(Exception e) {
            this.log.writeError("jsRemote.CJsUpdate.select():2 " + e.getMessage());
        }
        finally {
            try {
                trs.close();
                connessioneRepository.close();
            }
            catch(Exception e) {
                this.log.writeError("jsRemote.CJsUpdate.select()3: " + e.getMessage());
            }
        }
        output = output_1 + "$" + output_2 + "$" + output_3 + "$" + output_4 + "$" + output_5 + "$" + output_6;
        */
        return output;
    }

}

