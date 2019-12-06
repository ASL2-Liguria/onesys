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

package charts.multipleCharts;

import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;


public class framesetDimensioniEngine extends functionObj
{
  private functionDB fDB = null;
  private functionStr fStr = null;

  private String concatPeriodi = new String("");
  private String concatParametri = new String("");

  private String[] arPeriodi;
  private String[] arParametri;

  public framesetDimensioniEngine(ServletContext cont, HttpServletRequest req,
                             HttpSession sess) {
    super(cont, req, sess);
    fDB = new functionDB(this);
    fStr = new functionStr();
  }

  public framesetDimensioniEngine(ServletContext cont, HttpServletRequest req) {
    this(cont, req, req.getSession(false));
  }

  public String gestione() {
    String sOut = new String("");

    Document cDoc = new Document();
    cDoc.setDoctype(new Doctype.Html401Transitional());


      this.readDati();

      String rows = "10,";
      String cols = "10,";
      for (int i=0;i<arPeriodi.length;i++)
    	  cols+=String.valueOf(90/arPeriodi.length)+",";

      for(int j=0;j<arParametri.length;j++)
    	  rows+=String.valueOf(90/arParametri.length)+",";

      classFramesetHtmlObject cFset = new classFramesetHtmlObject(rows.substring(0,rows.length()-1), cols.substring(0,cols.length()-1));

      classFrameHtmlObject cFrame = new classFrameHtmlObject("Origine","","no");
      cFrame.addAttribute("noresize", "noresize");
      cFrame.addEvent("onload", "top.setBody(this,'','ORIGINE')");
      cFset.appendSome(cFrame);

      for (int i=0;i<arPeriodi.length;i++)
      {
    	  cFrame = new classFrameHtmlObject("0_"+i,"","no");
    	  cFrame.addAttribute("idx", String.valueOf(i));
    	  cFrame.addAttribute("onresize", "top.setW(this.idx,this);");
    	  cFrame.addEvent("onload", "top.setBody(this,'"+arPeriodi[i]+"','PERIODO')");
    	  cFset.appendSome(cFrame);
      }

	  for(int i=0;i<arParametri.length;i++)
	  {
    	  cFrame = new classFrameHtmlObject(i+"_0","","no");
    	  cFrame.addAttribute("idx", String.valueOf(i));
    	  cFrame.addAttribute("onresize", "top.setH(this.idx,this);");
    	  cFrame.addEvent("onload", "top.setBody(this,'"+arParametri[i]+"','PARAMETRO')");
    	  cFset.appendSome(cFrame);
          for (int j=0;j<arPeriodi.length;j++)
          {
        	  cFrame = new classFrameHtmlObject(i+"_"+j,"","no");
        	  cFrame.addAttribute("onresize", "top.resizeImg(this);");
        	  cFrame.addEvent("onload", "top.setBody(this,'','')");
        	  cFset.appendSome(cFrame);
          }
	  }

      sOut = cFset.toString();


    return sOut;
  }
  private void readDati()
  {

      this.concatParametri = this.cParam.getParam("concatParametri").trim();
      this.concatPeriodi = this.cParam.getParam("concatPeriodi").trim();

      this.arParametri = concatParametri.split("@");
      this.arPeriodi = concatPeriodi.split("@");

  }

}
