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

package cartellaclinica.gestioneBisogni;

import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.obj.functionObj;

import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


public class frameSetBisogniEngine extends functionObj
{
 // private functionDB fDB = null;
 // private functionStr fStr = null;

  private String iden_visita = new String("");
  private String reparto = new String("");
  private String funzione = new String("");



  public frameSetBisogniEngine(ServletContext cont, HttpServletRequest req,
                             HttpSession sess) {
    super(cont, req, sess);
  //  fDB = new functionDB(this);
   // fStr = new functionStr();
  }

  public frameSetBisogniEngine(ServletContext cont, HttpServletRequest req) {
    this(cont, req, req.getSession(false));
  }

  public String gestione() {
    String sOut = new String("");

    /*Document cDoc = new Document();
    Body cBody = new Body();
    classTabHeaderFooter HeadSection = null;
    classTableHtmlObject cTable = null;
    classRowDataTable cRow = null;
    classColDataTable cCol = null;*/
    classFramesetHtmlObject cFrameSet = null;
    classFrameHtmlObject cFrameTop = null;
    classFrameHtmlObject cFrameBottom = null;


    try {

      this.readDati();

      cFrameSet = new classFramesetHtmlObject("30,*","","0","0");

      cFrameTop = new classFrameHtmlObject("frameTopBisogni","mainBisogni?reparto="+reparto+"&iden_visita="+iden_visita+"&funzione="+funzione,"no");
      cFrameSet.appendSome(cFrameTop);

      cFrameBottom = new classFrameHtmlObject("frameBottomBisogni","blank.htm","yes");
      cFrameSet.appendSome(cFrameBottom);



      sOut =  cFrameSet.toString() ;
    }
    catch (SqlQueryException ex) {
      sOut = ex.getMessage();
    }
    catch (SQLException ex) {
      sOut = ex.getMessage();
    }

    return sOut;
  }

  private void readDati() throws SQLException, SqlQueryException {

    this.iden_visita = this.cParam.getParam("iden_visita").trim();
    this.reparto = this.cParam.getParam("reparto").trim();
    this.funzione = this.cParam.getParam("funzione").trim();

  }

  /**
   * setTabLivelli
   */


  /*private classHeadHtmlObject createHead()  throws SQLException, SqlQueryException {

    classHeadHtmlObject cHead = null;

  cHead = new classHeadHtmlObject();
  String sql="Select * from CARTCLIN.TAB_LINK_WK where TIPO_WK='listaTerapie' order by TIPO";

  ResultSet         rs    = null;

    rs= this.fDB.openRs(sql);

    while (rs.next()) {
      if (rs.getString("TIPO").equals("CSS"))
        cHead.addCssLink(rs.getString("PATH"));
      else
        cHead.addJSLink(rs.getString("PATH"));
    }

    this.fDB.close(rs);
    return cHead;

  }
  private String chkNull(String input){
  if (input==null)
    return "";
  else
    return input;
}
*/
}
