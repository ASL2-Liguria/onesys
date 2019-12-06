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
 * CInsModGroupWin.java
 *
 * Created on 15 giugno 2005, 16.09
 */

package GestioneGruppi;

import imago.a_sql.CDataBaseIX;
import imago.a_sql.CGroup;
import imago.a_sql.CGroupData;
import imago.a_sql.CLogError;
import imago.a_sql.ISQLException;
import imago.http.ImagoHttpException;
import imago.http.classHeadHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;
import imago.sql.TableColumn;
import imago.sql.TableResultSet;
import imago.sql.TableUpdate;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.html.Body;
import org.apache.ecs.html.Form;
import org.apache.ecs.html.Input;
import org.apache.ecs.html.TD;
import org.apache.ecs.html.TR;
import org.apache.ecs.html.Table;

/**
 * Classe per la costruzione della finestra per la gestione dell' Inserimento e
 * della modifica di un gruppo
 * @author MAZZORAN Andrea
 * @version 1.0.0.1
 */
public class CInsModGroupWin
{
    public int[] iden = null;
    public int[] indice = null;
    public String[] valore = null;
    public String[] descr = null;
    public String[] attivo = null;
    public String[] deleted = null;
    /**
     * Costante che indica la <B>label</B> per il bottone registra
     */
    public static final String LBL_REGISTRA = "LBL_INSMODGRPREGISTRA";
    /**
     * Costante che indica la <B>label</B> per il bottone registra e aggiorna web.cod_ope, web.permissioni_tabelle
     */
    public static final String LBL_SALVA_UPDATE = "LBL_SALVA_UPDATE";
    /**
     * Costante che indica la <B>label</B> per il bottone chiudi
     */
    public static final String LBL_CHIUDI = "LBL_INSMODGRPCHIUDI";
    /**
     * Costante che indica la <B>label</B> per la descrizione
     */
    public static final String LBL_DESCR = "LBL_INSMODGRPDESCR";
    /**
     * Costante che indica la <B>label</B> per il <B>COD_DEC</B>
     */
    public static final String LBL_CODDEC = "LBL_INSMODGRPCODDEC";

    private CLogError f_log = null;
    /**
     * Metodo costruttore della classe CInsModGroupWin
     */
    public CInsModGroupWin(CLogError log)
    {
        this.f_log = log;
    }

    /**
     * Metodo pubblico per la costruzione del codice <B>HTML</B> per la gestione dell'
     * inserimento e della modifica dei gruppi; il metodo andrà a scrivere tutto il codice
     * all' interno delle Istanze <B>HEAD</B> e <B>BODY</B> che saranno ritornate al chiamante
     * @param head Indica l' istanza <B>HEAD</B> che servirà per la generazione del codice
     * contenuto nel tag <B>HEAD</B>
     * @param body Indica l' istanza <B>BODY</B> che servirà per la generazione del codice
     * contenuto nel tag <B>BODY</B>
     * @param logged_user Indica l' istanza per reperire le informazioni sull' utente attualmente loggato
     * sul server
     * @param db Indica l' istanza al Data Base per effettuare tutte le operazione necessarie
     * @param clientParam Istanza alla classe <B>CClientParam</B> per l' estrazione dei parametri passati
     * tramite, il metodo <B>POST</B>, dal client al server
     */
    public void buildHTML(classHeadHtmlObject testata, Body body, baseUser logged_user, CDataBaseIX db, HttpServletRequest request, ServletContext context, HttpSession session)
    {
        int idenGroup = 0;
        String strTmp = new String("");
        String tipoOpe = new String("");
        String descr = new String("");
        String codDec = new String("");
        String codDecOld = new String("");
        String descrInt = new String("");
        String codDecInt = new String("");
        String codOpe = new String("");

        String permissioni_tabelle = new String("");

        Form mainForm = new Form();
        classTabHeaderFooter header = new classTabHeaderFooter("Gestione Gruppo");
        classTabHeaderFooter footer = new classTabHeaderFooter("&nbsp;");
        classJsObject jsObj = new classJsObject();
        Input in1 = new Input();
        Input in2 = new Input();
        Input in3 = new Input();
        Input in4 = new Input();
        Input in5 = new Input();
        Input in_iden = new Input();
        Input in_permissioni_tabelle = new Input();
        Table table = new Table();
        TD td11 = new TD();
        TD td12 = new TD();
        TD td21 = new TD();
        TD td22 = new TD();
        TR tr1 = new TR();
        TR tr2 = new TR();
        CGroup groupDB;
        CGroupData gD;

        this.f_log.setClassName("imago.winbuild.CInsModGroupWin");
        this.f_log.setFileName("CInsModGroupWin.java");

        //Controllo preliminare
        tipoOpe = classStringUtil.checkNull(request.getParameter("hOpe")).trim();
        descr = classStringUtil.checkNull(request.getParameter("hDescr")).trim();
        codDec = classStringUtil.checkNull(request.getParameter("hCodDec")).trim();
        codDecOld = classStringUtil.checkNull(request.getParameter("hCodDecOld")).trim();
        descrInt = classStringUtil.checkNull(request.getParameter("txtDescr")).trim();
        codDecInt = classStringUtil.checkNull(request.getParameter("cod_dec")).trim();
        codOpe = classStringUtil.checkNull(request.getParameter("hCodOpe")).trim();

        permissioni_tabelle = classStringUtil.checkNull(request.getParameter("hpermissioni_tabelle"));

        this.f_log.writeLog("tipoOpe[" + tipoOpe + "], descr[" + descr + "], codDec[" + codDec + "], codDecOld[" + codDecOld + "], descrInt[" + descrInt + "], codDecInt[" + codDecInt + "]codOpe[" + codOpe + "]", CLogError.LOG_DEBUG);

        if(tipoOpe.trim().compareTo("") != 0)
        {

            try
            {
                /*head.addElement("<script type='text/javascript' src='std/jscript/tutto_schermo.js' language='JavaScript'></script>\n");
                                 head.addElement("<script type='text/javascript' src='std/jscript/fillLabels.js' language='JavaScript'></script>\n");
                                 head.addElement("<script type='text/javascript' src='std/jscript/Utilita/GestioneGruppi/gestione_gruppi.js' language='JavaScript'></script>\n");*/
                /*Impostazione CSS e Javascript*/

                try
                {
                    testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", "Default", context));
                    testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", this.getClass().getName(), context));
                }
                catch(Exception e)
                {
                    e.printStackTrace();
                    this.f_log.writeError("GestioneGruppi.CInsModGroupWin.buildHTML(): errore include css, js: " + e.getMessage());
                }

                strTmp = jsObj.getArrayLabel("SL_InsModGroup", logged_user);
                testata.addElement(strTmp);
                body.addAttribute("onLoad", "javascript:fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");
            }
            catch(ImagoHttpException hE)
            {
                hE.printStackTrace();
                this.f_log.writeError("GestioneGruppi.CInsModGroupWin.buildHTML(): " + hE.getMessage());
            }

            if(tipoOpe.compareTo("CANC") == 0)
            {
                if(codDec.trim().compareTo("") != 0)
                {
                    /*Eliminazione del gruppo se e solo se non vi sono utenti appartenenti a tale gruppo:
                     *gruppi.iden == web.iden_group
                     */
                    groupDB = new CGroup(db);
                    int iden_group = 0;
                    try
                    {
                        iden_group = Integer.parseInt(request.getParameter("hiden_group"));
                        int operazione = groupDB.delDataAfterCheck(logged_user, context, iden_group);
                        if(operazione != 0)
                        {
                            if(operazione == -2)
                            {
                                body.addElement("<script>alert('Operazione non riuscita');</script>");
                            }
                            else
                            {
                                body.addElement("<script>alert(ritornaJsMsg(\"MSG_IMPOSSIBILEELIMINARERECORD\")+'" + codDec + "'+ritornaJsMsg(\"MSG_IMPOSSIBILEELIMINARERECORD2\"));</script>");
                            }
                        }
                        else
                        {
                            body.addElement("<script>alert(ritornaJsMsg(\"MSG_RECORD\")+'" + codDec + "'+ritornaJsMsg(\"MSG_CANCELLATO\"));</script>");
                        }
                    }
                    catch(Exception e)
                    {
                        e.printStackTrace();
                        this.f_log.writeError("GestioneGruppi.CInsModGroupWin.buildHTML(): " + e.getMessage());
                    }
                    body.addElement("<script>chiudi();</script>");
                }
            }
            else
            {
                if(codDec.trim().compareTo("") == 0) //Premuto il tasto registra da SL_InsModGroup
                {
                    if(tipoOpe.trim().compareTo("") != 0)
                    {
                        if(tipoOpe.compareTo("MOD") == 0) //Aggiornamento record
                        {
                            //Controllo che non esista un record con COD_DEC a parte quello modificato
                            groupDB = new CGroup(db);

                            //Estrazione dell' iden della tabella gruppi
                            try
                            {
                                groupDB.loadData(codDecOld);
                                gD = new CGroupData();
                                if((gD = groupDB.getData(0)) != null)
                                {
                                    idenGroup = gD.m_iIDEN;
                                }
                            }
                            catch(ISQLException sqlE)
                            {
                                sqlE.printStackTrace();
                                idenGroup = -1;
                                this.f_log.writeWarning("GestioneGruppi.CInsModGroupWin.buildHTML(): " + sqlE.getMessage());
                            }
                            gD = new CGroupData();
                            gD.m_iIDEN = idenGroup;
                            gD.m_strCOD_DEC = codDecInt;
                            gD.m_strDESCR = descrInt;
                            gD.m_strCOD_OPE = codOpe;
                            gD.m_strPERMISSIONI_TABELLE = permissioni_tabelle;
                            groupDB.updateData(gD, "COD_DEC='" + codDecOld + "'", logged_user.login);

                            /*Aggiornamento degli utenti associati al gruppo*/
                            if(!classStringUtil.checkNull(request.getParameter("hiden_group")).equalsIgnoreCase(""))
                            {
                                update_permissioni_gruppo_utenti(logged_user, request.getParameter("hiden_group"), gD.m_strCOD_OPE, gD.m_strPERMISSIONI_TABELLE);
                            }

                            body.addElement("<script>opener.document.location.replace(\"SL_GroupManager\");self.close();</script>");

                        }
                        else if(tipoOpe.compareTo("INS") == 0) //Inserimento nuovo record
                        {
                            groupDB = new CGroup(db);
                            try
                            {
                                groupDB.loadData(codDecInt);
                                if(groupDB.getData(0) != null) //Record già presente
                                {
                                    body.addElement("<script>alert(ritornaJsMsg(\"MSG_RECORDPRESENTEINDB\"));");
                                }
                                else
                                {
                                    gD = new CGroupData();
                                    gD.m_strCOD_DEC = codDecInt;
                                    gD.m_strDESCR = descrInt;
                                    gD.m_strCOD_OPE = codOpe;
                                    gD.m_strPERMISSIONI_TABELLE = permissioni_tabelle;
                                    groupDB.insertData(gD, logged_user.login);
                                }
                                body.addElement("<script>chiudi();</script>");
                            }
                            catch(ISQLException sqlE)
                            {
                                sqlE.printStackTrace();
                                this.f_log.writeWarning("GestioneGruppi.CInsModGroupWin.buildHTML(): " + sqlE.getMessage());
                            }
                        }
                    }
                }
                else //Creazione della pagina
                {
                    footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
                    footer.addColumn("classButtonHeader", "<div class='pulsante'><a id='" + CInsModGroupWin.LBL_REGISTRA + "' href='javascript:salva();'></a></div>");

                    if(classStringUtil.checkNull(request.getParameter("hOpe")).equalsIgnoreCase("MOD"))
                    {
                        footer.addColumn("classButtonHeader", "<div class='pulsante'><a id='" + CInsModGroupWin.LBL_SALVA_UPDATE + "' href='javascript:salva_aggiorna_web();'></a></div>");
                    }

                    footer.addColumn("classButtonHeader", "<div class='pulsante'><a id='" + CInsModGroupWin.LBL_CHIUDI + "' href='javascript:chiudi();'></a></div>");

                    //Impostazione attributi
                    body.addAttribute("class", "body");
                    mainForm.addAttribute("target", "SL_InsModGroup");
                    mainForm.addAttribute("action", "SL_InsModGroup");
                    mainForm.addAttribute("method", "POST");
                    mainForm.addAttribute("name", "frmInsModGroup");
                    table.addAttribute("class", "classDataEntryTable");
                    table.addAttribute("cols", "9");

                    td11.addAttribute("class", "classTdLabel");
                    td12.addAttribute("class", "classTdField");
                    td12.addAttribute("colspan", "8");
                    td21.addAttribute("class", "classTdLabel");
                    td22.addAttribute("class", "classTdField");
                    td22.addAttribute("colspan", "8");
                    in1.addAttribute("size", "80");
                    if(tipoOpe.compareTo("MOD") == 0)
                    {
                        if(codDec != null && codDec.compareTo("") != 0)
                        {
                            in1.addAttribute("value", codDec);
                        }
                        else if(codDecInt != null && codDecInt.compareTo("") != 0)
                        {
                            in1.addAttribute("value", codDecInt);
                        }
                        else
                        {
                            in1.addAttribute("value", "");
                        }
                    }
                    else
                    {
                        in1.addAttribute("value", ""); //%CODICE GRUPPO%
                    }
                    in1.addAttribute("name", "cod_dec");
                    in1.addAttribute("maxlength", "255");
                    in1.addAttribute("type", "text");
                    if(tipoOpe != null && tipoOpe.equalsIgnoreCase("INS"))
                    {
                        in1.addAttribute("onBlur", "javascript:document.frmInsModGroup.cod_dec.value = document.frmInsModGroup.cod_dec.value.toUpperCase(); ckeckPrimaryKey();"); //in1.addAttribute("onBlur", "javascript:document.frmInsModGroup.cod_dec.value = document.frmInsModGroup.cod_dec.value.toUpperCase();controlla_univ_cod_dec();");
                    }
                    if(tipoOpe != null && tipoOpe.equalsIgnoreCase("MOD"))
                    {
                        in1.addAttribute("onChange", "javascript:document.frmInsModGroup.cod_dec.value = document.frmInsModGroup.cod_dec.value.toUpperCase(); ckeckPrimaryKey();"); //in1.addAttribute("onChange", "javascript:document.frmInsModGroup.cod_dec.value = document.frmInsModGroup.cod_dec.value.toUpperCase();controlla_univ_cod_dec();");
                    }

                    in2.addAttribute("size", "80");
                    if(tipoOpe.compareTo("MOD") == 0)
                    {
                        if(descr != null && descr.compareTo("") != 0)
                        {
                            in2.addAttribute("value", descr);
                        }
                        else if(descrInt != null && descrInt.compareTo("") != 0)
                        {
                            in2.addAttribute("value", descrInt);
                        }
                        else
                        {
                            in2.addAttribute("value", "");
                        }
                    }
                    else
                    {
                        in2.addAttribute("value", ""); //%DESCRIZIONE%
                    }
                    in2.addAttribute("name", "txtDescr");
                    in2.addAttribute("onBlur", "this.value=this.value.toUpperCase();");
                    in2.addAttribute("maxlength", "255");
                    in2.addAttribute("type", "text");
                    in3.addAttribute("name", "hOpe");
                    in3.addAttribute("type", "hidden");
                    in3.addAttribute("value", tipoOpe);
                    in5.addAttribute("value", "");
                    in5.addAttribute("type", "hidden");
                    in5.addAttribute("name", "hCodOpe");

                    in_permissioni_tabelle.addAttribute("name", "hpermissioni_tabelle");
                    in_permissioni_tabelle.addAttribute("type", "hidden");
                    in_permissioni_tabelle.addAttribute("value", permissioni_tabelle);

                    in_iden.addAttribute("name", "hiden_group");
                    in_iden.addAttribute("type", "hidden");
                    in_iden.addAttribute("value", "");

                    /*head.addElement("<link href='std/css/headerTable.css' type='text/css' rel='stylesheet'>\n");
                                         head.addElement("<link href='std/css/button.css' type='text/css' rel='stylesheet'>\n");
                                         head.addElement("<link href='std/css/dataEntryTable.css' type='text/css' rel='stylesheet'>\n");
                                         head.addElement("<link href='std/css/normalBody.css' type='text/css' rel='stylesheet'>\n");
                                         head.addElement("<script type='text/javascript' src='std/jscript/colori_selezione.js' language='JavaScript'></script>\n");
                                         head.addElement("<script type='text/javascript' src='std/jscript/contextMenu.js' language='JavaScript'></script>\n");*/

                    td11.addElement("<label id='" + CInsModGroupWin.LBL_CODDEC + "'></label>\n");
                    td12.addElement(in1.toString() + "\n");
                    td21.addElement("<label id='" + CInsModGroupWin.LBL_DESCR + "'></label>\n");
                    td22.addElement(in2.toString() + "\n");
                    tr1.addElement(td11.toString() + "\n");
                    tr1.addElement(td12.toString() + "\n");
                    tr2.addElement(td21.toString() + "\n");
                    tr2.addElement(td22.toString() + "\n");
                    table.addElement(tr1.toString() + "\n");
                    table.addElement(tr2.toString() + "\n");
                    if(tipoOpe.compareTo("MOD") == 0)
                    {
                        table.addElement(this.buildAllCombo(codOpe, permissioni_tabelle, logged_user)); //modifica
                    }
                    else
                    {
                        table.addElement(this.buildAllCombo("XXXSXSXX 4", permissioni_tabelle, logged_user)); //inserimento
                    }
                    mainForm.addElement(header.toString() + "\n");
                    mainForm.addElement(table.toString() + "\n");
                    mainForm.addElement(footer.toString() + "\n");
                    mainForm.addElement(in3.toString() + "\n");
                    mainForm.addElement(in5.toString() + "\n");
                    mainForm.addElement(in_permissioni_tabelle.toString() + "\n");
                    mainForm.addElement(in_iden.toString() + "\n");
                    if(tipoOpe.compareTo("MOD") == 0)
                    {
                        in4.addAttribute("name", "hCodDecOld");
                        in4.addAttribute("type", "hidden");
                        in4.addAttribute("value", codDec);
                        mainForm.addElement(in4.toString() + "\n");
                    }
                    mainForm.addElement("<SCRIPT>document.frmInsModGroup.cod_dec.focus();</SCRIPT>\n");
                    body.addElement(mainForm);

                }
            }
        }
    }


    private String buildAllCombo(String codOpe, String permissioni_tabelle, baseUser logged_user)
    {
        String strRet = new String("");

        if(codOpe == null)
        {
            codOpe = "DDDDDDDL 0";
        }

        //Prenotazione
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_PRENOTAZIONE'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(1, codOpe.substring(0, 1), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(1, codOpe.length()>=1?codOpe.charAt(0):'D', logged_user)+"</td>\n</tr>\n");

        //Acceettazione
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_ACCETTAZIONE'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(2, codOpe.substring(1, 2), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(2, codOpe.length()>=2?codOpe.charAt(1):'D', logged_user)+"</td>\n</tr>\n");

        //Esecuzione
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_ESECUZIONE'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(3, codOpe.substring(2, 3), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(3, codOpe.length()>=3?codOpe.charAt(2):'D', logged_user)+"</td>\n</tr>\n");

        //Refertazione
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_REFERTAZIONE'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(4, codOpe.substring(3, 4), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(4, codOpe.length()>=4?codOpe.charAt(3):'D', logged_user)+"</td>\n</tr>\n");

        //Modifica Anagrafica
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_MODIFICA_ANAGRAFICA'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(5, codOpe.substring(4, 5), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(5, codOpe.length()>=5?codOpe.charAt(4):'D', logged_user)+"</td>\n</tr>\n");

        //Gestione Parametri
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_GESTIONE_PARAMETRI'></label></TD>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(6, codOpe.substring(5, 6), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(6, codOpe.length()>=6?codOpe.charAt(5):'D', logged_user)+"</td>\n</tr>\n");

        //Tabelle Magazzino
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_TABELLE_MAGAZZINO'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(7, codOpe.substring(6, 7), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(7, codOpe.length()>=7?codOpe.charAt(6):'D', logged_user)+"</td>\n</tr>\n");

        //Referti Definitivi
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class='classTdLabel'><label id='LBL_REFERTI_DEFINITIVI'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(8, codOpe.substring(7, 8), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(8, codOpe.length()>=8?codOpe.charAt(7):'L', logged_user)+"</td>\n</tr>\n");

        //Ripristino Cancellati
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td width = '20%' class='classTdLabel'><label id='LBL_RIPR_CANC'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(9, codOpe.substring(8, 9), logged_user) + "</td>\n</tr>\n");

        //Cancellazione Esami
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td width = '20%' class='classTdLabel'><label id='LBL_CANCELLAZIONE_ESAMI'></label></td>\n");
        strRet = strRet.concat("<td colspan = '8' class='classTdField'>\n" + this.buildSingleCombo(10, codOpe.substring(9, 10), logged_user) + "</td>\n</tr>\n"); //strRet=strRet.concat("<td  colspan = '8' class='classTdField'>\n"+this.buildSingleCombo(10, codOpe.length()>=10?codOpe.charAt(9):'0', logged_user)+"</td>\n</tr>\n");

        //Gestione Tabelle
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td rowspan = '2'  class='classTdLabel'><label id='LBL_TABELLE'></label></td>\n");
        strRet = strRet.concat("<td class='classTdField'>\n" + this.buildCheckPermessiTabelle(permissioni_tabelle) + "</td>\n</tr>\n");

        return strRet;
    }


    private String buildCheckPermessiTabelle(String permissioni_tabelle)
    {
        String strRet = new String("");
        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_a'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");

        strRet = strRet.concat("<input onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_a.value = \"A\"; else document.frmInsModGroup.hpt_a.value = \"\";' name='pt_a' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 1 && permissioni_tabelle.charAt(0) == 'A')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_t'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_t.value = \"T\"; else document.frmInsModGroup.hpt_t.value = \"\";' name='pt_t' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 2 && permissioni_tabelle.charAt(1) == 'T')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_e'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_e.value = \"E\"; else document.frmInsModGroup.hpt_e.value = \"\";' name='pt_e' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 3 && permissioni_tabelle.charAt(2) == 'E')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_r'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_r.value = \"R\"; else document.frmInsModGroup.hpt_r.value = \"\";' name='pt_r' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 4 && permissioni_tabelle.charAt(3) == 'R')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("</tr>\n");

        strRet = strRet.concat("<tr>\n");
        strRet = strRet.concat("<td class = 'classTdLabel'></td>");
        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_p'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_p.value = \"P\"; else document.frmInsModGroup.hpt_p.value = \"\";' name='pt_p' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 5 && permissioni_tabelle.charAt(4) == 'P')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_o'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_o.value = \"O\"; else document.frmInsModGroup.hpt_o.value = \"\";' name='pt_o' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 6 && permissioni_tabelle.charAt(5) == 'O')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_c'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_c.value = \"C\"; else document.frmInsModGroup.hpt_c.value = \"\";' name='pt_c' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 7 && permissioni_tabelle.charAt(6) == 'C')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<td class = 'classTdLabel'>\n");
        strRet = strRet.concat("<label id = 'lbl_x'></label>\n");
        strRet = strRet.concat("</td>\n");
        strRet = strRet.concat("<td  width = '10%' class='classTdField'>\n");
        strRet = strRet.concat("<input  onClick = 'javascript:if(this.checked) document.frmInsModGroup.hpt_x.value = \"X\"; else document.frmInsModGroup.hpt_x.value = \"\";' name='pt_x' type='checkbox' value=''");
        if(!permissioni_tabelle.equalsIgnoreCase("") && permissioni_tabelle.length() >= 8 && permissioni_tabelle.charAt(7) == 'X')
        {
            strRet = strRet.concat(" checked >\n");
        }
        else
        {
            strRet = strRet.concat(">\n");
        }
        strRet = strRet.concat("</td>\n");

        strRet = strRet.concat("<input name = 'hpt_a' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_t' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_e' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_r' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_p' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_o' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_c' type = 'hidden' value = ''>\n");
        strRet = strRet.concat("<input name = 'hpt_x' type = 'hidden' value = ''>\n");

        strRet = strRet.concat("</tr>\n");
        return strRet;

    }


    /**
     *
     * @param iden_gruppo String
     */
    private void update_permissioni_gruppo_utenti(baseUser logged_user, String iden_gruppo, String cod_ope, String permissioni_tabelle)
    {
        TableUpdate update = null;
        String upd = "";

        update = new TableUpdate();
        upd = "UPDATE WEB SET COD_OPE = '" + cod_ope + "', ";
        upd += "PERMISSIONI_TABELLE = '" + permissioni_tabelle + "' ";
        upd += "WHERE IDEN_GROUP = " + iden_gruppo;
        try
        {
            update.updateQuery(logged_user.db.getWebConnection(), upd);
            update.close();
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.f_log.writeError("GestioneGruppi.CInsModGroupWin.update_permissioni_gruppo_utenti(): " + e.getMessage());
        }
    }


    //    private String buildSingleCombo(int byteNum, char permission) {
    //        String strRet=new String("");
    //
    //        switch(byteNum) {
    //            case 1:
    //            case 2:
    //            case 3:
    //                if(permission!='X' && permission!='S' && permission!='L' && permission!='D')
    //                    permission='D';
    //
    //                if(byteNum==1)
    //                    strRet=strRet.concat("<select name='lstPren' id='lstPren' style='width:60%'>\n");
    //                else if(byteNum==2)
    //                    strRet=strRet.concat("<select name='lstAcc' id='lstAcc' style='width:60%'>\n");
    //                else if(byteNum==3)
    //                    strRet=strRet.concat("<select name='lstEse' id='lstEse' style='width:60%'>\n");
    ////                else
    ////                    strRet=strRet.concat("<select name='lstRef' id='lstRef' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='X'");
    //                if(permission=='X')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">ADMINISTRATOR</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='S'");
    //                if(permission=='S')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">STANDARD USER</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='L'");
    //                if(permission=='L')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">READ USER</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='D'");
    //                if(permission=='D')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">DISABLE</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //
    //            case 4:
    //                if(permission!='L' && permission!='S' && permission!='D')
    //                    permission='D';
    //
    //
    //                strRet=strRet.concat("<select name='lstRef' id='lstRef' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='D'");
    //                if(permission=='D')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">DISABLE</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='L'");
    //                if(permission=='L')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">READ</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='S'");
    //                if(permission=='S')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">WRITE</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //
    //            case 5:
    //                if(permission!='X' && permission!='S' && permission!='L' && permission!='D') permission='D';
    //
    //                strRet=strRet.concat("<select name='lstModAnag' id='lstModAnag' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='X'");
    //                if(permission=='X')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">ADMINISTRATOR</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='S'");
    //                if(permission=='S')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">STANDARD USER</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='L'");
    //                if(permission=='L')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">RESTRICTED USER</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='D'");
    //                if(permission=='D')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">DISABLE</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //            case 6:
    //                if(permission!='S' && permission!='D') permission='D';
    //
    //                strRet=strRet.concat("<select name='lstGesPara' id='lstGesPara' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='D'");
    //                if(permission=='D')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">DISABLE</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='S'");
    //                if(permission=='S')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">ENABLE</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //            case 7:
    //                if(permission!='S' && permission!='U' && permission!='D') permission='D';
    //
    //                strRet=strRet.concat("<select name='lstTabMaga' id='lstTabMaga' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='S'");
    //                if(permission=='S')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">ADMINISTRATOR</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='U'");
    //                if(permission=='U')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">STANDARD USER</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='D'");
    //                if(permission=='D')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">DISABLE</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //            case 8:
    //                if(permission!='X' && permission!='S' && permission!='L') permission='L';
    //
    //                strRet=strRet.concat("<select name='lstRefDef' id='lstRefDef' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='X'");
    //                if(permission=='X')
    //                    strRet=strRet.concat(" selecetd");
    //                strRet=strRet.concat(">ADMINISTRATOR</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='S'");
    //                if(permission=='S')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">PRIMARIO</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='L'");
    //                if(permission=='L')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">STANDARD USER</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //
    //            case 10:
    //                if(permission!='0' && permission!='1' && permission!='2' && permission!='3' && permission!='4') permission='0';
    //
    //                strRet=strRet.concat("<select name='lstCancEsa' id='lstCancEsa' style='width:60%'>\n");
    //
    //                strRet=strRet.concat("\t<option value='0'");
    //                if(permission=='0')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">PRENOTATO</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='1'");
    //                if(permission=='1')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">ACCETTATO</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='2'");
    //                if(permission=='2')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">ESEGUITO</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='3'");
    //                if(permission=='3')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">REFERTATO</option>\n");
    //
    //                strRet=strRet.concat("\t<option value='4'");
    //                if(permission=='4')
    //                    strRet=strRet.concat(" selected");
    //                strRet=strRet.concat(">DEFINITIVO/SBLOCCATO</option>\n");
    //
    //                strRet=strRet.concat("</select>\n");
    //
    //                break;
    //        }
    //
    //        return strRet;
    //    }

    private String buildSingleCombo(int byteNum, String permission, baseUser logged_user)
    {
        String strRet = new String("");
        try
        {
            switch(byteNum)
            {

            case 1:

            case 2:

            case 3:
                this.getSelectDb(String.valueOf(byteNum), logged_user);
                if(!permission.equalsIgnoreCase("X") && !permission.equalsIgnoreCase("S") && !permission.equalsIgnoreCase("L") && !permission.equalsIgnoreCase("D"))
                {
                    permission = "D";
                }

                if(byteNum == 1)
                {
                    strRet = strRet.concat("<select name='lstPren' id='lstPren' style='width:60%'>\n");
                }
                else if(byteNum == 2)
                {
                    strRet = strRet.concat("<select name='lstAcc' id='lstAcc' style='width:60%'>\n");
                }
                else if(byteNum == 3)
                {
                    strRet = strRet.concat("<select name='lstEse' id='lstEse' style='width:60%'>\n");
                }

                strRet = strRet.concat("\t<option value='" + this.valore[0] + "'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("\t<option value='S'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='L'");
                if(permission.equalsIgnoreCase(this.valore[2]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[2] + "</option>\n");

                strRet = strRet.concat("\t<option value='D'");
                if(permission.equalsIgnoreCase(this.valore[3]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[3] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;

            case 4:
                this.getSelectDb("4", logged_user);
                if(!permission.equalsIgnoreCase("L") && !permission.equalsIgnoreCase("S") && !permission.equalsIgnoreCase("D"))
                {
                    permission = "D";
                }

                strRet = strRet.concat("<select name='lstRef' id='lstRef' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='L'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='S'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("\t<option value='D'");
                if(permission.equalsIgnoreCase(this.valore[2]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[2] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;

            case 5:
                this.getSelectDb("5", logged_user);
                if(!permission.equalsIgnoreCase("X") && !permission.equalsIgnoreCase("S") && !permission.equalsIgnoreCase("L") && !permission.equalsIgnoreCase("D"))
                {
                    permission = "D";
                }

                strRet = strRet.concat("<select name='lstModAnag' id='lstModAnag' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='X'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("\t<option value='S'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='L'");
                if(permission.equalsIgnoreCase(this.valore[2]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[2] + "</option>\n");

                strRet = strRet.concat("\t<option value='D'");
                if(permission.equalsIgnoreCase(this.valore[3]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[3] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;
            case 6:
                this.getSelectDb("6", logged_user);
                if(!permission.equalsIgnoreCase("S") && !permission.equalsIgnoreCase("D"))
                {
                    permission = "D";
                }

                strRet = strRet.concat("<select name='lstGesPara' id='lstGesPara' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='D'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='S'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;
            case 7:
                this.getSelectDb("7", logged_user);
                if(!permission.equalsIgnoreCase("X") && !permission.equalsIgnoreCase("S") && !permission.equalsIgnoreCase("D"))
                {
                    permission = "D";
                }

                strRet = strRet.concat("<select name='lstTabMaga' id='lstTabMaga' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='X'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("\t<option value='S'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='D'");
                if(permission.equalsIgnoreCase(this.valore[2]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[2] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;
            case 8:
                this.getSelectDb("8", logged_user);
                if(!permission.equalsIgnoreCase("X") && !permission.equalsIgnoreCase("S") && !permission.equalsIgnoreCase("L"))
                {
                    permission = "L";
                }

                strRet = strRet.concat("<select name='lstRefDef' id='lstRefDef' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='X'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selecetd");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("\t<option value='S'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='L'");
                if(permission.equalsIgnoreCase(this.valore[2]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[2] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;

                /***/
            case 9:
                this.getSelectDb("9", logged_user);
                if(!permission.equalsIgnoreCase("0") && !permission.equalsIgnoreCase("1"))
                {
                    permission = "0";
                }

                strRet = strRet.concat("<select name='lstRipristinoCancellati' id='lstRipristinoCancellati' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='1'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='0'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;

            case 10:
                this.getSelectDb("10", logged_user);
                if(!permission.equalsIgnoreCase("0") && !permission.equalsIgnoreCase("1") && !permission.equalsIgnoreCase("2") && !permission.equalsIgnoreCase("3") && !permission.equalsIgnoreCase("4"))
                {
                    permission = "0";
                }

                strRet = strRet.concat("<select name='lstCancEsa' id='lstCancEsa' style='width:60%'>\n");

                strRet = strRet.concat("\t<option value='" + this.valore[0] + "'");
                if(permission.equalsIgnoreCase(this.valore[0]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[0] + "</option>\n");

                strRet = strRet.concat("\t<option value='" + this.valore[1] + "'");
                if(permission.equalsIgnoreCase(this.valore[1]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[1] + "</option>\n");

                strRet = strRet.concat("\t<option value='" + this.valore[2] + "'");
                if(permission.equalsIgnoreCase(this.valore[2]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[2] + "</option>\n");

                strRet = strRet.concat("\t<option value='" + this.valore[3] + "'");
                if(permission.equalsIgnoreCase(this.valore[3]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[3] + "</option>\n");

                strRet = strRet.concat("\t<option value='" + this.valore[4] + "'");
                if(permission.equalsIgnoreCase(this.valore[4]))
                {
                    strRet = strRet.concat(" selected");
                }
                strRet = strRet.concat(">" + this.descr[4] + "</option>\n");

                strRet = strRet.concat("</select>\n");

                break;
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.f_log.writeError("GestioneGruppi.CInsModGroupWin.creaWorklist(): " + e.getMessage());
        }
        return strRet;
    }


    private void getSelectDb(String permesso, baseUser logged_user)
    {
        try
        {
            TableResultSet trs = new TableResultSet();
            TableColumn tc = new TableColumn();
            tc.getRows(logged_user.db.getWebConnection(), "*", "dett_permessi where indice = " + permesso);
            int n = Integer.parseInt(String.valueOf(tc.numberRows));
            tc.close();
            iden = new int[n];
            indice = new int[n];
            valore = new String[n];
            descr = new String[n];
            attivo = new String[n];
            deleted = new String[n];
            trs.getResultSet(logged_user.db.getWebConnection(), "select * from dett_permessi where indice = " + permesso);
            for(int i = 0; i < n; i++)
            {
                if(trs.rs.next())
                {
                    iden[i] = trs.rs.getInt("iden");
                    indice[i] = trs.rs.getInt("indice");
                    valore[i] = trs.rs.getString("valore");
                    descr[i] = trs.rs.getString("descr");
                    attivo[i] = trs.rs.getString("attivo");
                    deleted[i] = trs.rs.getString("deleted");
                }
            }
            trs.close();
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.f_log.writeError("GestioneGruppi.CInsModGroupWin.getSelectDb(): " + e.getMessage());
        }
    }

}
