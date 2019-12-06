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
package cartellaclinica.dwr;

import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;
import core.database.UtilityLobs;
import java.sql.Clob;

public class dwrTerapie {

    Connection conn = null;
    baseUser User = null;

    private void init() throws SqlQueryException {
        HttpSession Sess = WebContextFactory.get().getSession();
        User = Global.getUser(Sess);
        conn = User.db.getDataConnection();
    }

    public String prova(String in) {

        return null;
    }

    public String execute(String sql) {
        String resp = "";
        Statement stm = null;
        try {

            init();

            stm = conn.createStatement();
            stm.execute(sql);

            resp = "OK";
        } catch (SqlQueryException ex) {
            resp = ex.getMessage();
        } catch (SQLException ex) {
            resp = ex.getMessage();
        } catch (Exception ex) {
            resp = ex.getMessage();
        } finally {

            try {
                stm.close();

            } catch (SQLException ex) {
                resp = ex.getMessage();
            }
            stm = null;
        }
        return resp;
    }

    public String verificaReazione(String idenAnag, String idenFarmaco) {
        String resp = "";
        //ResultSet rs =null;
        CallableStatement CS = null;
        Clob clob = null;
        try {

            init();

            CS = conn.prepareCall("{call CC_CONTROLLO_REAZIONE (?,?,?)}");

            CS.setInt(1, Integer.valueOf(idenFarmaco));
            CS.setInt(2, Integer.valueOf(idenAnag));

            CS.registerOutParameter(3, Types.CLOB);
            CS.execute();
            resp = CS.getString(3);
            clob = CS.getClob(3); 
            

        } catch (SqlQueryException ex) {
            resp = ex.getMessage();
        } catch (SQLException ex) {
            resp = ex.getMessage();
        } catch (Exception ex) {
            resp = ex.getMessage();
        } finally {

            try {
                if (CS != null) {
                    CS.close();
                }
                UtilityLobs.freeClob(clob);

            } catch (SQLException ex) {
                resp = ex.getMessage();
            }
            CS = null;
        }
        return resp;
    }
    /*
     public String replicaPianificazione(String idenVisita,String dataIni,String dataFine){

     String resp="";

     CallableStatement CS;
     try {

     init();

     CS = conn.prepareCall( "{call CC_TERAPIA_DUPLICA (?,?,?,?,?)}");

     CS.setInt(1,User.iden_per);
     CS.setInt(2, Integer.valueOf(idenVisita));
     CS.setString(3, dataIni);
     CS.setString(4, dataFine);

     CS.registerOutParameter(5, Types.VARCHAR);

     CS.execute();
     resp = CS.getString(5);

     CS.close();

     }catch (SqlQueryException ex){
     resp = ex.getMessage();
     }catch (SQLException ex){
     resp = ex.getMessage();
     }
     catch (Exception ex){
     resp = ex.getMessage();
     }
     finally {
     CS=null;
     }
     return resp;
     }*/

    public String rilevaParametro(String idenVisita, String data, String ora, String[] idenParametro, String[] idenDettaglio, String[] valore_1, String[] valore_2, String arNote[], String arCampiAgg[]) {
        String resp = "";
        Boolean metal = false;
        CallableStatement CS;
        try {

            init();

            CS = conn.prepareCall("{call CC_PARAMETRO_INSERT (?,?,?,?,?,?,?,?,?,?,?,?)}");
            CS.setInt(1, User.iden_per);
            CS.setInt(2, Integer.valueOf(idenVisita));

            CS.setString(5, data);
            CS.setString(6, ora);

            CS.registerOutParameter(11, Types.VARCHAR);
            CS.registerOutParameter(12, Types.VARCHAR);

            for (int i = 0; i < idenParametro.length; i++) {
                CS.setInt(3, Integer.valueOf(idenParametro[i]));
                if (idenDettaglio[i] != null) {
                    CS.setInt(4, Integer.valueOf(idenDettaglio[i]));
                } else {
                    CS.setInt(4, 0);
                }

                if (valore_1[i].isEmpty()) {
                    CS.setNull(7, java.sql.Types.NUMERIC);
                } else {
                    CS.setDouble(7, new Double(valore_1[i]));
                }

                if (valore_2[i].isEmpty()) {
                    CS.setNull(8, java.sql.Types.NUMERIC);
                } else {
                    CS.setDouble(8, new Double(valore_2[i]));
                }
                CS.setString(9, arNote[i]);
                CS.setString(10, arCampiAgg[i]);
                CS.execute();
                resp = CS.getString(11);
                if (CS.getString(12).equals("S")){
                	metal=true;
                }
            }

            CS.close();

        } catch (SqlQueryException ex) {
            resp = ex.getMessage();
        } catch (SQLException ex) {
            resp = ex.getMessage();
        } catch (Exception ex) {
            resp = ex.getMessage();
        } finally {
            CS = null;
        }
        
        if (metal==true){
        	
        	try {
                CS = conn.prepareCall("{call CC_PARAMETRI.GESTALLERTAMETAL (?,?,?)}");
                CS.setInt(1, Integer.valueOf(idenVisita));
                CS.setString(2, data+ora);

                CS.registerOutParameter(3, Types.VARCHAR);

                CS.execute();
                if (CS.getString(3).equals("S")){
                	resp="METAL";
                }
                CS.close();
            } catch (SQLException ex) {
                resp = ex.getMessage();
            } catch (Exception ex) {
                resp = ex.getMessage();
            } finally {
                CS = null;
            }
        	
        	
        }
        
        
        return resp;

    }
    /*public String setDttaglio(int idenDettaglio,int idenTerapia,String data,String ora,String fascia,int tipoOperazione,String velocita){

     String resp="";

     CallableStatement CS;
     try {

     init();

     CS = conn.prepareCall( "{call CC_TERAPIE_SET_DETTAGLIO (?,?,?,?,?,?,?,?,?)}");

     CS.setInt(1, User.iden_per);

     if (idenDettaglio<1)
     CS.setInt(2, 0);
     else
     CS.setInt(2, idenDettaglio);

     CS.setInt(3, idenTerapia);

     CS.setString(4, data);
     CS.setString(5, ora);

     if(fascia.equals(""))
     CS.setInt(6, 0);
     else
     CS.setInt(6, Integer.valueOf(fascia));

     CS.setInt(7, tipoOperazione);

     if (velocita.equals(""))
     CS.setInt(8, 0);
     else
     CS.setDouble(8, Double.valueOf(velocita));

     CS.registerOutParameter(9, Types.VARCHAR);

     CS.execute();
     resp = CS.getString(9);

     CS.close();

     }catch (SqlQueryException ex){
     resp = ex.getMessage();
     }catch (SQLException ex){
     resp = ex.getMessage();
     }
     catch (Exception ex){
     resp = ex.getMessage();
     }
     finally {
     CS=null;
     return resp;
     }
     }*/
    /*
     public String gestInfusione(String tipoOperazione,String idenTerapia,String idenDettaglio,String dataIni,String oraIni,String dataFine,String oraFine,String velocita){
     String resp="";
     String sql="";
     Statement stm=null;
     CallableStatement CS=null;

     String ultimaVelocita;
     try{

     init();

     CS = conn.prepareCall( "{call CC_TERAPIE_INFU_GEST (?,?,?,?,?,?,?,?,?,?)}");
     CS.setInt(1,User.iden_per);
     CS.setString(2,tipoOperazione);
     CS.setInt(3,Integer.valueOf(idenTerapia));
     CS.setInt(4,Integer.valueOf(idenDettaglio));
     CS.setString(5,dataIni);
     CS.setString(6,oraIni);
     CS.setString(7,dataFine);
     CS.setString(8,oraFine);
     if(velocita!=null)
     CS.setDouble(9,Double.valueOf(velocita));
     else
     CS.setInt(9,0);

     CS.registerOutParameter(10, Types.VARCHAR);

     CS.execute();
     resp = CS.getString(10);

     CS.close();

     }catch (SqlQueryException ex){
     resp = ex.getMessage();
     }catch (SQLException ex){
     resp = ex.getMessage();
     }
     catch (Exception ex){
     resp = ex.getMessage();
     }
     finally {
     CS=null;
     }
     return resp;
     }*/
}
