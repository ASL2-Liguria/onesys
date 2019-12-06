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
/*
    File: consultazioneCalendarioGes.java
    Autore: Jack
*/

package cartellaclinica.gestioneAllergie;

import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class saveAllergieEngine extends functionObj
{
  private functionDB  fDB = null;
  private functionStr fStr = null;
  private String[] ArAllergie=null;

    public saveAllergieEngine(ServletContext cont, HttpServletRequest req, HttpSession sess)
    {
        super(cont, req, sess);
        fDB = new functionDB(this);
        fStr = new functionStr();
    }

    public saveAllergieEngine(ServletContext cont, HttpServletRequest req)
    {
        this(cont, req, req.getSession(false));
    }

    public String gestione()
    {
      String sOut = new String("");
      Document               cDoc    = new Document();
      Body                   cBody   = new Body();
      String EsitoSP = new String("");
      String Script = new String("");

      try {
        readDati();
        if (ArAllergie.length>0)
            EsitoSP = initStatement();
       // if (!EsitoSP.equals("Salvataggio completato")&&!EsitoSP.equals(""))
          Script = "<SCRIPT>alert('"+EsitoSP+"');\nparent.aggiornaWkAllergie();\n</SCRIPT>";

        cBody.addElement(Script);
        cDoc.setBody(cBody);

        sOut = cDoc.toString();

      }
      catch (SqlQueryException ex) {
        sOut = ex.getMessage();
      }
      catch (SQLException ex) {
        sOut = ex.getMessage();
      }

        return sOut;
    }

    private void readDati() throws SQLException, SqlQueryException
    {
      this.ArAllergie =  this.cParam.getParam("request").split("§");
    }

    private String initStatement()  throws SQLException, SqlQueryException {

      String outParam = new String("");

      Array DbArAllergie = null;


      DbArAllergie = new ARRAY(ArrayDescriptor.createDescriptor("CARTCLIN.ARRAY_VALUE",
            fDB.getConnectData()), fDB.getConnectData(), this.ArAllergie);


      CallableStatement CS= fDB.getConnectData().prepareCall( "{call CARTCLIN.SP_SALVAALLERGIE (?,?,?)}");

      CS.setArray(1,DbArAllergie);
      CS.setInt(2,bUtente.iden_per);

      CS.registerOutParameter(3, Types.VARCHAR);

      CS.execute();
      outParam=  CS.getString(3);

      CS.close();
      CS = null;
      return outParam;

  }
}
