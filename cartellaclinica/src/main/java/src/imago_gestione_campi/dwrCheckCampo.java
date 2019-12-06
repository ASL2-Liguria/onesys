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
package src.imago_gestione_campi;
import imago.http.baseClass.baseUser;
import imago_jack.imago_function.db.functionDB;

import java.sql.ResultSet;
import java.util.ArrayList;

import org.directwebremoting.WebContextFactory;

import src.Gestione_Campi.CGES_CAMPO_CHECK;
import src.Gestione_Campi.CGES_CAMPO_CHECK_Data;
import core.Global;
public class dwrCheckCampo {
   public String check_field (String var) {
  String Error="OK";
   baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));
   functionDB fundb = new   functionDB();
   ResultSet rs = null;

   fundb.setUser(logged_user);
   try {
         String[] Dati=var.split("§", -1);
         String[] a_eti = null;
         String[] a_val = null;
         String returnTrue="";
         String returnFalse="";
         String returnJsTrue="";
         String returnJsFalse="";
         String returnJsFinal="";

         String s_query_tmp = new String("");
         boolean ReturnBoolean=false;
         CGES_CAMPO_CHECK gesCampoCheck =new CGES_CAMPO_CHECK(logged_user.db.getWebConnection());
          gesCampoCheck.loadData("IDEN_RELAZIONE=" + Dati[0] + " and JS_EVENT='"+Dati[2]+"' order by ordine asc");
          ArrayList ArrTabCheck = new ArrayList();
          ArrTabCheck = gesCampoCheck.getData();
          for (int contCheck = 0; contCheck < ArrTabCheck.size() && !ReturnBoolean; contCheck++)
          {
              CGES_CAMPO_CHECK_Data DataTabCheck=new CGES_CAMPO_CHECK_Data();
              DataTabCheck = (CGES_CAMPO_CHECK_Data) ArrTabCheck.get(contCheck);
              a_eti = DataTabCheck.m_CAMPI_GET.split(",");
              a_val = Dati[1].split("@");

              s_query_tmp = DataTabCheck.m_QUERY_CHECK;
              for(int i=0; i< a_eti.length; i++)
              {
                  s_query_tmp = s_query_tmp.replaceAll("#" + a_eti[i] + "#","'"+ a_val[i]+"'");
              }

              if (DataTabCheck.m_QUERY_CHECK.indexOf("@")<1)
              {
                  rs = fundb.openRs(s_query_tmp);
                  if (rs.next())
                  {
                      returnTrue=DataTabCheck.m_RESULT_TRUE;
                      returnJsTrue=DataTabCheck.m_CALL_JS_TRUE;
                      ReturnBoolean=true;
                  }
                  else
                  {
                      returnFalse=DataTabCheck.m_RESULT_FALSE;
                      returnJsFalse=DataTabCheck.m_CALL_JS_FALSE;
                      ReturnBoolean=false;
                  }
                 returnJsFinal=DataTabCheck.m_CALL_JS_AFTER;
                  fundb.close(rs);
              }
              else
              {
                  DataTabCheck.m_QUERY_CHECK.split("@");
              }


          }
          if (ReturnBoolean)
              Error="OK*"+returnTrue+"*"+returnJsTrue+"*"+returnJsFinal;
          else
              Error="OK*"+returnFalse+"*"+returnJsFalse+"*"+returnJsFinal;
      }
                catch (Exception ex)
            {
                Error= "KO*"+ex.getMessage();

            }

    return Error;
}


}
