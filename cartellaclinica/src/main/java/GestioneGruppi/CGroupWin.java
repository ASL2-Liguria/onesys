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
  * CGroupWin.java
  *
  * Created on 7 giugno 2005, 14.39
  */

package GestioneGruppi;

import imago.a_sql.CDataBase;
import imago.a_sql.CLogError;
import imago.http.baseClass.baseUser;

import org.apache.ecs.html.Body;
import org.apache.ecs.html.Head;

/**
 * Classe per la costruzione del codice <B>HTML</B> che serve per la gestione dei
 * Gruppi. La prima finestra visualizzata mostrerà una parte dove immettere il nome
 * del gruppo da ricercare in Data Base; selezionando un dato gruppo si possono
 * aggiungere o togliere gli utenti a quel gruppo; con la pressione di un bottone
 * si può visualizzare la finestra per la gestione dei gruppi, ovvero per l'
 * aggiunta, modifica oppure cancellazione di un gruppo
 * @author MAZZORAN Andrea
 * @version 1.0.0.1
 */
public class CGroupWin
{
    /**
     * Costante pubblica che indica il massimo numero di utenti permesso per ogni
     * gruppo
     */
    public static final int MAXNUMUTENTIINGRUPPO=200;
    /**
     * Costante pubblica che indica il nome del form contenente tutti i dati del gruppo
     */
    public static final String FRMGROUPNAME="frmGroupData";
    /**
     * Costante pubblica che indica il nome del <B>Text Box</B> del gruppo
     */
    public static final String TXTGROUPNAME="txtGroupData";
    /**
     * Costante pubblica che indica l' identificativo del campo nascosto <B>hIden</B>
     */
    public static final String INPUTIDEN="hIden";
    /**
     * Costante pubblica che indica l' identificativo del campo nascosto <B>hIdenGroup</B>
     */
    public static final String INPUTIDENGROUP="hIdenGroup";
    /**
     * Costante pubblica che indica l' identificativo del campo nascosto <B>hButton</B>
     */
    public static final String INPUTBUTTON="hButton";
    /**
     * Costante pubblica che indica il bottone di ricerca
     */
    public static final String BTN_GROUPSEARCH="BTN_SEARCH";
    /**
     * Costante pubblica che indica il bottone di chiusura
     */
    public static final String BTN_GROUPCLOSE="BTN_CLOSE";
    /**
     * Costante pubblica che indica il bottone di salvataggio
     */
    public static final String BTN_GROUPSAVE="BTN_SAVE";
    /**
     * Costante pubblica che indica la label del bottone chiudi
     */
    public static final String LBL_IDLBLCHIUDI="LBL_GRPIDChiudi";
    /**
     * Costante pubblica che indica la label del bottone registra
     */
    public static final String LBL_IDLBLREGISTRA="LBL_GRPIDRegistra";


    /**
     * Metodo costruttore della classe CGroupWin
     */
    public CGroupWin(CLogError log)
    {
    }

    /**
     * Metodo pubblico per la costruzione del codice <B>HTML</B> per la gestione dei
     * gruppi; inizialmente verrà creatouna finestra classica di ricerca per ricercare
     * il gruppo voluto; eseguita la scelta del gruppo, verranno mostrate due liste, la
     * prima conttenente gli utenti che si possono aggiungere al gruppo, sulla
     * sinistra, ed una seconda contenente gli utenti che sono già presenti in quel
     * gruppo; in alto verrà mostrato anche un bottone per la gestione dei gruppi; il
     * metodo andrà a scrivere tutto il codice all' interno delle Istanze <B>HEAD</B> e
     * <B>BODY</B> che saranno ritornate al chiamante
     * @param head Indica l' istanza <B>HEAD</B> che servirà per la generazione del codice
     * contenuto nel tag <B>HEAD</B>
     * @param body Indica l' istanza <B>BODY</B> che servirà per la generazione del codice
     * contenuto nel tag <B>BODY</B>
     * @param logged_user Indica l' istanza per reperire le informazioni sull' utente attualmente loggato
     * sul server
     * @param strSearch Indica il nome del gruppo da andare a ricercare
     * @param db Indica l' istanza al Data Base per effettuare tutte le operazione necessarie
     * @param attivo Indica come deve essere il <B>Check Box</B> Attivo
     */
    public void buildHTML(Head head, Body body, baseUser logged_user, String strSearch, CDataBase db, boolean attivo)
    {
        body.addElement("<SCRIPT>window.location.href=\"SL_GroupManager\";</SCRIPT>\n");
    }
}
