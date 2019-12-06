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
package ACR;

import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imago.sql.Utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import core.Global;

public class XML2DBClass {
    private String Xml_Query = "";
    private ResultSet resset = null;
    private Statement stm = null;
    private ResultSetMetaData rsmd = null;
    private String xml_tag = "<?xml version='1.0' encoding='ISO-8859-1'?>\n";
    private PrintWriter out = null;
    private HttpSession session = null;
    private HttpServletRequest request = null;
    private final String selectMatch =
            "select\\s+.+\\s+from\\s+.+\\s+where\\s+.+";
    private final String insertMatch =
            "insert\\s+into\\s+\\(.+\\)\\s+values\\s+\\(.+\\)";
    private final String updateMatch =
            "update\\s+.+\\s+set\\s+.+\\s+where\\s+.+";
    private final String execProcedure =
            "EXEC\\s+.+";
    public Connection db_connection = null;
    private boolean TOparse=false;
       public             Utils aa=new Utils();
    public boolean NewConnection =false;
    public XML2DBClass() {
    }

    public XML2DBClass(HttpServletRequest sRequest,
                       HttpServletResponse response,
                       ServletContext sContext) throws IOException {
        request = sRequest;
        //context = sContext;

        session = request.getSession(false);
        out = response.getWriter();
        String conType="";

        try{
            conType = request.getParameter("conType");
            if (conType.equalsIgnoreCase("xml")) {
                 response.setContentType("text/xml");
            } else {
                response.setContentType("text/html");
            }
        }
        catch (Exception c){
             response.setContentType("text/html");
        }
        try{
        String  conParse = request.getParameter("xmlParse");
         if (conParse.equalsIgnoreCase("yes")) {
              TOparse=true;
         } else {
             TOparse=false;
         }
     }
     catch (Exception c){
         TOparse=false;
     }
     baseUser log_user=null;

        // Connessione al db per i test
          try {
              log_user = Global.getUser(session);

          }
          catch (Exception e)
          {
              log_user=null;
          }
        if (log_user != null)
        {
            try {
                db_connection = log_user.db.getDataConnection();
                stm = db_connection.createStatement();
            } catch (SqlQueryException ex1) {

            } catch (SQLException ex) {
                /** @todo Handle this exception */
            }

        }
        else{
            try {
                new DecodificaPwd();
                String pwd = DecodificaPwd.decodificaPwd(sContext,sContext.getInitParameter("DataPwd"));
                String user = sContext.getInitParameter("DataUser");

  db_connection=Utils.getTemporaryConnection(user,pwd);

                NewConnection=true;
                //db_connection=loggedUser.db.getDataConnection();
                stm = db_connection.createStatement();
            } catch (java.sql.SQLException ex) {
                ex.getCause();
            } catch (Exception ex) {
                ex.getCause();
            }
        }

        // Connessione al db per i test
    }

    /**
     * Crea il tag ERRORE
     * @param code codice errore
     * @param descr descrizione
     * @return ritorna tag errore
     */
    private String makeErrorTag(String code, String descr) {
        String retVal = "";

        retVal = "<ERROR>\n";
        retVal += "<CODE>" + code + "</CODE>\n";
        retVal += "<DESCR>" + descr + "</DESCR>\n";
        retVal += "</ERROR>\n";

        return (retVal);
    }

    /**
     * Esegue l'operazione di select richiesta e crea l'output
     * @param runQuery query da eseguire
     * @return risultato in formato xml
     */
    private String executeSelect(String runQuery) {
        int colNum = 0;
        int index = 0;
        int rowsNum = 0;
        String retVal = "";
        String rows = "";
        String cols = "";

        try {
            boolean queryRes = stm.execute(runQuery);
            if (queryRes == true) {
                resset = stm.getResultSet();
                rsmd = resset.getMetaData();
                colNum = rsmd.getColumnCount();

                while (resset.next() == true) {
                    rows += "<ROW>\n";
                    cols = "";
                    for (index = 1; index <= colNum; index++) {


                        cols += "<" + rsmd.getColumnName(index).trim() + ">";
                        if (TOparse){
                            cols+="<![CDATA[";
                      }

                        cols += resset.getString(index);
                        if (TOparse){
                          cols+="]]> ";
                      }

                        cols += "</" + rsmd.getColumnName(index).trim() + ">\n";
                    }
                    rows += cols.trim() + "</ROW>\n";

                    rowsNum++;
                }
                resset.close();

                retVal = "<SELECT>\n";

                    retVal += "<ROWS number='" + String.valueOf(rowsNum) +
                            "'>\n";

                retVal += rows.trim();
                retVal += "</ROWS>\n";
                retVal += "</SELECT>\n";
                retVal += makeErrorTag("0", "");
            } else {
                SQLException sqlex = new SQLException(
                        "Problems executing query: " + runQuery);
                throw (sqlex);
            }
        } catch (java.lang.Exception ex) {
            retVal = "<SELECT>\n";
            retVal += "<ROWS number='0'/>\n";
            retVal += "</SELECT>\n";
            retVal += makeErrorTag("-1", ex.toString());
        }

        return (retVal);
    }

    /**
     * Esegue l'operazione di insert richiesta e crea l'output
     * @param runQuery query da eseguire
     * @return risultato in formato xml
     */
    private String executeInsert(String runQuery) {
        String retVal = "";

        try {
            int queryRes = stm.executeUpdate(runQuery);
            retVal = "<INSERT rowsAffected='" + String.valueOf(queryRes) +
                     "'/>\n";
            retVal += makeErrorTag("0", "");
        } catch (java.lang.Exception ex) {
            retVal = "<INSERT rowsAffected='0'/>\n";
            retVal += makeErrorTag("-1", ex.toString());
        }

        return (retVal);
    }

    /**
     * Esegue l'operazione di update richiesta e crea l'output
     * @param runQuery query da eseguire
     * @return risultato in formato xml
     */
    private String executeUpdate(String runQuery) {
        String retVal = "";

        try {
            int queryRes = stm.executeUpdate(runQuery);
            retVal = "<UPDATE rowsAffected='" + String.valueOf(queryRes) +
                     "'/>\n";
            retVal += makeErrorTag("0", "");
        } catch (java.lang.Exception ex) {
            retVal = "<UPDATE rowsAffected='0'/>\n";
            retVal += makeErrorTag("-1", ex.toString());
        }

        return (retVal);
    }

    private String executeProcedure(String runQuery) {
           String retVal = "";

    int a=runQuery.indexOf(" ");
    runQuery=runQuery.substring(a+1);
    int b=runQuery.indexOf(" ");
    String Procedure=runQuery.substring(0,b);
    String Parameter=runQuery.substring(b+1);


    try {
        //Parameter=Parameter.replaceAll("'","'");

        CallableStatement cs = this.db_connection.prepareCall("{call SP_SCREENING(?,?)}");
            cs.setString(1, Procedure);
             //System.out.println(Procedure);
            cs.setString(2,Parameter);
             cs.executeUpdate();
            this.db_connection.commit();

               retVal = "<UPDATE rowsAffected='" + String.valueOf(2) +
                        "'/>\n";
               retVal += makeErrorTag("0", "");
           } catch (java.lang.Exception ex) {
               retVal = "<UPDATE rowsAffected='0'/>\n";
               retVal += makeErrorTag("-1", ex.toString());
           }
   //System.out.println(retVal);
           return (retVal);
       }

    /**
     * Costruisce la risposta finale da inviare al client
     *
     * @return ritorna la risposta completa al client
     */
    public void makeResponse() {
        String retVal = "";
        try {
            retVal = xml_tag;
            retVal += "<RESPONSE>\n";
            Xml_Query = request.getParameter("xmlSend");
            //System.out.println(Xml_Query);
            if (Xml_Query != null) {
                //Xml_Query = Xml_Query.toLowerCase();
                if (Xml_Query.matches(selectMatch) == true) {
                    retVal += executeSelect(Xml_Query);
                } else if (Xml_Query.matches(insertMatch) == true) {
                    retVal += executeInsert(Xml_Query);
                } else if (Xml_Query.matches(updateMatch) == true) {
                    retVal += executeUpdate(Xml_Query);
                }else if (Xml_Query.matches(execProcedure) == true) {
                    retVal += executeProcedure(Xml_Query);
                } else {
                    retVal += makeErrorTag("-1", "Query non valida.");
                }
            } else {
                retVal += makeErrorTag("-1", "Specificare una query.");
            }
            retVal += "</RESPONSE>\n";

            out.println(retVal);

            out.close();

            stm.close();


        } catch (Exception ex) {
            try {
                if (NewConnection)
                {
                    Utils.closeTemporaryConnection(db_connection);
                }
                   stm.close();
               } catch (SQLException ex1) {
               }


        }
        finally{
            try{
                if (NewConnection)
                 {
                     stm.close();
                    Utils.closeTemporaryConnection(db_connection);
                 }


            }
            catch(Exception ex)
            {

                try {
                    if (NewConnection)
              {
                  stm.close();
                 Utils.closeTemporaryConnection(db_connection);
              }


                } catch (SQLException ex1) {
                }
            }

        }

    }
    public void finalize() {
        try {

            if (NewConnection)
                 {
                     Utils.closeTemporaryConnection(db_connection);
                 }

            stm.close();
        } catch (SQLException ex) {
            try {
                stm.close();
                if (NewConnection)
                {
                   Utils.closeTemporaryConnection(db_connection);
                }


            } catch (SQLException ex1) {
            }

        }
    }

}

