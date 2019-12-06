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
package it.elco;

import it.elco.ricerca.PT_RicercaRemota;

import java.net.InetAddress;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;


public class Test {
		
	public static IniReader ini = null;
	public static Connection connessione = null;

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		
		try{
			ini = new IniReader(".\\integrazione.ini");
			initDB();
		}catch(Exception e){
			e.printStackTrace();
		}

		PT_RicercaRemota asd = new PT_RicercaRemota();
		asd.inizializza();
		asd.setUserSession("GIULIO");
		asd.setConnections(connessione);
        HashMap<String, String> dati = new HashMap<String, String>();
        dati.put("PAZ_COD_FISC", "CHSLNI45A54H523R");
        //dati.put("IDEN_SAL", "2545");
        asd.eseguiRicerca(dati);
	}
	
	/**
     * Inizializza ed attiva la connessione al DB
     * @throws SQLException
     */
    private static void initDB() throws Exception{
    	Class.forName("oracle.jdbc.OracleDriver");
    	StringBuffer connectionString = new StringBuffer();
    	connectionString.append("jdbc:oracle:thin:");
    	connectionString.append(ini.readParameter("DATABASE", "USERNAME")+"/");
    	connectionString.append(ini.readParameter("DATABASE", "PASSWORD")+"@");
    	connectionString.append(ini.readParameter("DATABASE", "INDIRIZZO")+":");
    	connectionString.append(ini.readParameter("DATABASE", "PORTA")+":");
    	connectionString.append(ini.readParameter("DATABASE", "SID"));
    	java.util.Properties props = new java.util.Properties();
    	props.put("v$session.osuser", ini.readParameter("DATABASE", "ORACLE_USER"));
    	props.put("v$session.machine", InetAddress.getLocalHost().getCanonicalHostName());
    	props.put("v$session.program", ini.readParameter("DATABASE", "ORACLE_PROGRAM"));
    	connessione = DriverManager.getConnection(connectionString.toString(),props);
    }

}
