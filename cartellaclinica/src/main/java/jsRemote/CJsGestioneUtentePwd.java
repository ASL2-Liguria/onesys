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

import imago.crypto.CryptPasswordInterface;
import imago.http.baseClass.baseUser;
import imago.lang.atr;
import imago.sql.TableResultSet;
import imago.util.CGestioneErrori;
import imagoAldoUtil.classStringUtil;

import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author elenad
 * @version 1.0
 */

public class CJsGestioneUtentePwd
{
    private HttpSession session = null;

    /**
     *
     */
    public CJsGestioneUtentePwd()
    {
    }

    /**
     * Metodo utilizzato per la verifica generica dell'esistenza di un utente
     *
     * @param stringa_input String
     * @return String
     */
    public String checkUserPwd(String stringa_input)
    {
        ServletContext context = null;
        String error_message = new String("false");
        String query = null;
        TableResultSet select = null;
        baseUser logged_user = null;
        String input[] = null;
        String deleted = null;
        String attivo = null;
        int iden_per = 0;
        String pwd_decriptata = new String("");
        byte[] pwd_criptata_byte = null;
        Class obj = null;
        CryptPasswordInterface cpi = null;

        boolean attivoDeleted = false;

        try
        {
            session = (WebContextFactory.get()).getSession(false);
            context = (ServletContext) (WebContextFactory.get()).getServletContext();

            if(session == null)
            {
                return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
            }

            logged_user = Global.getUser(session);

            input = stringa_input.split("@");

            select = new TableResultSet();

            try
            {
                pwd_decriptata = input[1];

                obj = Class.forName(context.getInitParameter("CryptType"));
                cpi = (CryptPasswordInterface) (obj.newInstance());

                pwd_criptata_byte = cpi.crypt(pwd_decriptata);
                query = input[0] + "'" + atr.toString(pwd_criptata_byte) + "'";
            }
            catch(Exception e)
            {
                query = input[0];
            }

            select.getResultSet(logged_user.db.getWebConnection(), query);
            if(select.rs.next())
            {
                attivo = select.rs.getString(1);
                deleted = select.rs.getString(2);
                iden_per = select.rs.getInt(3);

                attivoDeleted = classStringUtil.checkNull(attivo).equalsIgnoreCase("S") && classStringUtil.checkNull(deleted).equalsIgnoreCase("N");

                if(attivoDeleted)
                {
                    error_message = String.valueOf(iden_per);//error_message = "true";
                }
                else
                {
                    error_message = "false";
                }
            }
            select.close();
        }
        catch(Exception e)
        {
            e.printStackTrace();
            error_message = "jsRemote.CJsGestioneUtentePwd.check_user_pwd():select =  " + query + " - " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
        }

        return error_message;
    }


    /**
     * Metodo utilizzato per la gestione dell'esecuzione/annullamento esecuzione di
     * un esame
     *
     * @param stringa_input String
     * @return String
     */
    public String check_user_pwd(String stringa_input)
    {
        ServletContext context = null;
        String error_message = new String("false");
        String query = null;
        TableResultSet select = null;
        baseUser logged_user = null;
        String input[] = null;
        String deleted = null;
        String attivo = null;
        int iden_per = 0;
        String tipo = null;
        String cod_ope = null;
        String permissioneEsecuzioneEsame = null;
        String ob_esecuzione = null;
        String pwd_decriptata = new String("");
        byte[] pwd_criptata_byte = null;
        Class obj = null;
        CryptPasswordInterface cpi = null;

        boolean attivoDeleted = false;
        boolean permissioniEsecuzione = false;

        try
        {
            session = (WebContextFactory.get()).getSession(false);
            context = (ServletContext) (WebContextFactory.get()).getServletContext();

            if(session == null)
            {
                return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
            }

            logged_user = Global.getUser(session);

            input = stringa_input.split("@");

            select = new TableResultSet();

            try
            {
                pwd_decriptata = input[1];

                obj = Class.forName(context.getInitParameter("CryptType"));
                cpi = (CryptPasswordInterface) (obj.newInstance());

                pwd_criptata_byte = cpi.crypt(pwd_decriptata);
                query = input[0] + "'" + atr.toString(pwd_criptata_byte) + "'";
            }
            catch(Exception e)
            {
                query = input[0];
            }

            select.getResultSet(logged_user.db.getWebConnection(), query);
            if(select.rs.next())
            {
                attivo = select.rs.getString(1);
                deleted = select.rs.getString(2);
                iden_per = select.rs.getInt(3);
                tipo = select.rs.getString(4);
                cod_ope = select.rs.getString(5);
                ob_esecuzione = select.rs.getString(6);

                setAttr("OB_INS_PWD_ESECUZIONE", iden_per, tipo, ob_esecuzione); //Esecuzione_ute_ese

                attivoDeleted = classStringUtil.checkNull(attivo).equalsIgnoreCase("S") && classStringUtil.checkNull(deleted).equalsIgnoreCase("N");
                permissioneEsecuzioneEsame = cod_ope.substring(2, 3);
                permissioniEsecuzione = classStringUtil.checkNull(permissioneEsecuzioneEsame).equals("X") || classStringUtil.checkNull(permissioneEsecuzioneEsame).equals("S");

                if(attivoDeleted && permissioniEsecuzione)
                {
                    error_message = "true";
                }
                else
                {
                    error_message = "false";
                }

            }
            select.close();

        }
        catch(Exception e)
        {
            e.printStackTrace();
            error_message = "jsRemote.CJsGestioneUtentePwd.check_user_pwd():select =  " + query + " - " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
        }

        return error_message;
    }

    /**
     *
     * @param nome_oggetto String
     * @param iden_per int
     * @param tipo String
     * @param ob_esecuzione String
     */
    private synchronized void setAttr(String nome_oggetto, int iden_per, String tipo, String ob_esecuzione)
    {
        ArrayList utente_esecuzione = null;

        utente_esecuzione = new ArrayList();
        utente_esecuzione.add(0, iden_per);
        utente_esecuzione.add(1, tipo);
        utente_esecuzione.add(2, ob_esecuzione);

        session.setAttribute(nome_oggetto, utente_esecuzione);
    }

}
