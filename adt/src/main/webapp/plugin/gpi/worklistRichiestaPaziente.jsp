<%--<%@page contentType="text/html;charset=windows-1252"%>--%>
<%@ page import="it.elco.baseObj.factory.baseFactory" %>
<%@ page import="it.elco.baseObj.iBase.iBaseUser" %>
<%@ page import="it.elco.ldap.ElcoLDAP" %>
<%@ page import="javax.security.auth.login.LoginException" %>
<%@ page import="org.springframework.context.support.FileSystemXmlApplicationContext" %>
<%@ page import="it.elco.listener.ElcoContextInfo" %>
<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="java.util.Map" %>
<%@ page import="it.elco.caronte.call.impl.iCallProcedureFunction" %>
<%@ page import="it.elco.caronte.factory.utils.CaronteFactory" %>
<%@ page import="oracle.jdbc.internal.OracleTypes" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="windows-1252"/>
    <title>FeniX Precedenti Paziente
    </title>
    <script>
        var traduzione = {"tabCodiciEsterni":"Codici Esterni","lblLocRes":"Localit?","lblFemmina":"Femmina","fldDP":"Dati Principali","nomeObbligatorio":"Nome Obbligatorio","butRemOne":"<","lblNome":"Nome","lblSovrappeso":"Sovrappeso","lblCAPRes":"CAP","validUrl":"Inserire una URL valida","lblMDC":"MDC","lblDataScadTes":"Data Scadenza Tessera","errCalcCodFisc":"Errore cacolo Codice Fiscale","lblInserimento":"Inserimento","butRemAll":"<<","acList":"Autocomplete List","lblAcCap":"CAP","lblFiltriPersonali":"Filtri Personali","validRangelength":"Inserire un valore di lunghezza compresa tra {0} e {1} caratteri","lblID11":"ID 11","lblIndRes":"Indirizzo","lblID10":"ID 10","lblID12":"ID 12","wkEsame":"Esame","lblMultipla":"Multipla","fldCertificazione":"Certificazione","lblInserisciEsame":"Inserisci Esame","lblNewAnag":"Inserimento nuovo paziente","Giorni":"Domenica,Luned?,Marted?,Mercoled?,Gioved?,Venerd?,Sabato","wkStato":"Stato","successTitleSave":"Success!","lblObesita":"Obesit?","lblKg":"Kg","validMax":"Il valore deve essere minore o uguale a {0}","selAllTags":"Seleziona Tutti","validDigits":"Inserire solo caratteri","validImportant":"Il campo ? importante","lblM2":"m^2","lblCdC":"Centro di Costo","lblTitolo":"Scheda Anagrafica","fldNote":"Note","lblSingola":"Singola","lblRisultato":"Risultato Peso","lblTipoCert":"Tipo","errorTitleSave":"Error!","errNoNome":"Compilare prima il nome","lblCert":"Certificazione","martedi":"Mar","menuVuoto":"Nessuna voce disponibile","lblBranca":"Branca","lblLiberaProfessione":"Libera Prof.","lblCognome":"Cognome","lblID9":"ID 9","giovedi":"Gio","lblAltezza":"Altezza","lblTitoloStudio":"Titolo di Studio","lblRefertaEsame":"Referta Esami","lblID2":"ID 2","errNoDataNasc":"Compilare prima la data di nascita","lblID1":"ID 1","lblID4":"ID 4","lblID3":"ID 3","lblID6":"ID 6","lblID5":"ID 5","lblICT":"Istit. Competente Tessera","butStampa":"Stampa","lblID8":"ID 8","lblID7":"ID 7","lblTit_Infermiere":"INF.","cellaDisabilitata":"Cella disabilitata","validMinlength":"Lunghezza minima {0} caratteri","errNoCognome":"Compilare prima il cognome","lblTit_Infermiera":"INF.RA","menuModificaIndirizzo":"Apri scheda","lblMedicoMammo":"Medico Mammografia","lblAcTitoloAnag":"Titolo","lblCodGruppo":"Codice Gruppo","lblCod1":"ID 1","validMaxlength":"Lunghezza massima {0} caratteri","lblCod2":"ID 2","lblStampa":"Stampa","lblCod3":"ID 3","lblCod4":"ID 4","lblCod5":"ID 5","lblIDpaz":"ID Patient","lblCod6":"ID 6","lblProf":"Professione","lblCod7":"ID 7","lblCod8":"ID 8","lblAcProfessioni":"Professioni","lblCod9":"ID 9","lblMedBase":"Medico di Base","lblCodDescr":"Cod+Descr.","lblSupCorpo":"Sup. Corporea","lblProvRes":"Provincia","lblCell":"Cellulare","errNoComNasc":"Compilare prima il luogo di nascita","lblMetodica":"Metodica","lblTit_Tecnico":"TEC.","lblAcDescrizione":"Comune","lblAttenzione":"Attenzione","lblSegreteria":"Segreteria","acListChiudi":"Chiudi","lblMail":"E-Mail","butAddAll":">>","lblVisualizzaTutti":"Visualizza Tutti","butSaveStatoFiltri":"Salva stato filtri","lblConferma":"Conferma","lunedi":"Lun","lblPeso":"Peso","lblCivRes":"Civico","lblCodSottogruppo":"Codice Sottogruppo","lblAccettaEsame":"Accetta","lblAcProvincia":"Provincia","lblAcFineValidita":"Fine Validit?","lblOrdine":"Ordine","lblStato":"Stato","lblAcTitCittadinanza":"Cittadinanza","butEsenzione":"Esenzione","errorSave":"Errore durante il salvataggio","lblInterno":"Interno","lblCAPDom":"CAP","lblProvDom":"Provincia","lblCodReg":"Codice Regionale","lblPrivato":"Privato","wkProvenienza":"Provenienza","okTags":"Applica","lblModifica":"Modifica","lblNtes":"N. Tessera","validNumber":"Inserire solo numeri","lblEmail":"Email","lblOrgano":"Organo","tabDatiTessera":"Dati TesEuro","lblGruppo":"Gruppo","lblSchedaAppropriatezza":"Scheda Appropriatezza","wkDataEsame":"Data Esame","wkOraEsame":"Ora Esame","wkMetodica" : "Metodica","lblNazioneIndirizzo":"Nazione","lblAttivi":"Attivi","lblAcStatoCivile":"Stato Civile","lblCodSirm":"Codice Sirm","lblAttivo":"Attivo","acListRicercaSensibile":"Ricerca Sensibile","lblUSLDom":"USL","lblDataNasc":"Data di Nascita","lblInizioEsecuzione":"Inizio Esecuzione","lblAcCodice":"Codice","deselAllTags":"Deseleziona Tutti","lblCodCup":"Codice Cup","lblTelefono":"Telefono","lblAnamnesi":"Anamnesi","lblCodiceFiscale":"Codice Fiscale","ttUtilizza":"Utilizza","lblTipoMedico":"Tipo Medico","validHours":"Il valore deve essere in formato hh:mm [00:00 - 23:59]","lblTit_Dottore":"DOTT.","lblIndDom":"Indirizzo","lblTit_Signora":"SIG.RA","fldDom":"Domicilio","lblAcTitoloStudioAnag":"Titolo di Studio","lblDataDec":"Data Decesso","lblTit_Signore":"SIG.","okSalvataggioFiltriPersonali":"Salvataggio filtri personali riuscito","butAddOne":">","lblRegRes":"Regione","venerdi":"Ven","lblCm":"Cm","lblTelDom":"Telefono","butDeselAll":"Desel. Tutto","lblDescr":"Descrizione","fldInfoPaz":"Info Paziente","validEmail":"Inserire un indirizzo mail valido","lblTit_Dottoressa":"DOTT.SSA","lblCodFisc":"Codice Fiscale","tabAnamnesi":"Anamnesi","lblQualBen":"Qualifica Beneficiario","lblComuneIndirizzo":"Comune","lblFiltro":"Filtro","lblEsterno":"Esterno","validRequired":"Il campo ? Obbligatorio","butApplica":"Applica","tabEsami":"Esami","validMin":"Il valore deve essere maggiore o uguale a {0}","sabato":"Sab","lblCodiceDecodifica":"Codice Decodifica","closeTags":"Chiudi","acListCerca":"Cerca","lblCodice":"Codice","lblDescrAbbr":"Descr.","lblEta":"Et?","lblCodEsa":"Codice Esame","fldAna":"Anamnesi","lblCodDec":"Codice Decodifica","lblEntrambi":"Entrambi","lblDataNascita":"Data Nascita","lblNoTemplate":"Template non trovato","lblTicket":"Ticket","lblSi":"S?","tabIndirizzi":"Indirizzi","lblMedicoReparto":"Medico Reparto","lblNoso":"N? nosografico","lblSottopeso":"Sottopeso","koSalvataggioFiltriPersonali":"Errore salvataggio Filtri Personali","lblCodMin":"Codice Ministeriale","lblAcInizioValidita":"Inizio Validit?","lblPesoIdeale":"Peso Ideale","lblProntoSoccorso":"Pronto Soccorso","lblApparato":"Apparato","tabResDom":"Residenza e Domicilio","lblSesso":"Sesso","lblAcTitMedici":"Medici","fldAnaResult":"Calcoli","mercoledi":"Mer","lblFineEsecuzione":"Fine Esecuzione","lblOnere":"Onere","lblNonAttivi":"Non Attivi","errNoSesso":"Compilare prima il sesso","lblNormopeso":"Normopeso","lblIDCitt":"ID Cittadino","butChiudi":"Chiudi","lblMaschio":"Maschio","lblUSLRes":"USL","lblCod10":"ID 10","tabNote":"Note","lblBMI":"Body Mass Index","lblRegDom":"Regione","lblEsente":"Esente","menuInserisciIndirizzo":"Inserisci","lblLuogoNasc":"Luogo di Nascita","lblStatoCivile":"Stato Civile","lblPresso":"Presso","butSelAll":"Sel. Tutto","tabDatiPrincipali":"Dati Principali","fldCodici":"Codici","lblAltriOspedali":"Altri Ospedali","lblMdC":"Mezzo di Contrasto","domenica":"Dom","lblConfirmOperazione":"Sicuro di voler confermare l'operazione?","lblStampaEtiEsame":"Stampa Etichette Esame","lblRimuoviTutti":"Rimuovi Tutti","lblCerca":"Cerca","lblProfiloVocale":"Profilo Vocale","lblAcCodiceFiscale":"Codice Fiscale","lblCitt":"Cittadinanza","Mesi":"Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre","lblStampaReferto":"Stampa Referto","lblTratDati":"Consenso al trattamento dei dati personali","butAddIndirizzo":"Inserisci nuovo indirizzo","lblDescrStrut":"Descrizione Struttura","validFixedLength":"Il valore deve essere {0} caratteri","lblCivDom":"Civico","lblNo":"No","lblSconosciuto":"Sconosciuto","lblTelRes":"Telefono","lblDescrizione":"Descrizione","validRange":"Inserire un valore compreso tra {0} e {1}","butRegistra":"Registra","butResetDati":"Reset Dati","lblCodifica":"Codifica","lblCampiImportanti":"Campi importanti non compilati.","ttCancella":"Cancella","lblLocDom":"Localit?","lblIntramoenia":"Intramoenia","lblUSLAss":"USL Assistenza","fldRes":"Residenza","lblTitoloAnag":"Titolo","lblTipoIndirizzo":"Tipo","butSalva":"Salva","menuIndirizzi":"Indirizzo","lblIndirizzo":"Indirizzo","successSave":"Salvataggio effettuato correttamente","wkCdc":"Ospedale",
            "Mesi":"Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre","Giorni":"Domenica,Lunedì,Martedì,Mercoledì,Giovedì,Venerdì,Sabato"};
    </script>
    <link rel="stylesheet" href="http://10.69.24.221/File/css/mix.css" type="text/css"/>
    <link rel="stylesheet" href=".http://10.69.24.221/File/css/LOGIN_PAGE/login.css" type="text/css"/>
    <link rel="stylesheet" href="http://10.69.24.221/File/css/wk.css?t=7" type="text/css"/>
    <link rel="stylesheet" href="http://10.69.24.221/File/css/zebra_datepicker.css?t=73" type="text/css"/>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/LIB.js?t=74"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/NO-min/NS_DATE.js?t=73"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/NO-min/jquery.dialog.js?t=74"></script>
    <script type="text/javascript" src="../../dwr/interface/toolKitDB.js?t=73"></script>
    <script type="text/javascript" src="../../dwr/interface/dwrLdap.js?t=73"></script>
    <script type="text/javascript" src="../../dwr/engine.js?t=73"></script>
    <script type="text/javascript" src="../../dwr/interface/toolKitWK.js?t=73"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/NS_WORKLIST_COMPONENT.js?t=73"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/NO-min/jquery.contextmenu.js?t=73"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/worklist.js?t=73"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/NS_PROCESS_CLASS.js?t=73"></script>
    <script type="text/javascript" src="http://10.69.24.221/File/js/Base/NO-min/WK.js?t=73"></script>
    <script type="text/javascript" src=".http://10.69.24.221/File/js/Base/NO-min/jquery.zebra_datepicker.js?t=73"></script>

    <script id="scriptPlugin">var SCRIPT_PLUGIN = new Array();</script>

</head>
<body>

<img height="169" width="253" alt="" src="../../img/logoFenix.png" id="logo">
<div class id="divFormLogin"  style="width: 600px" >
    <div class="hRiq hRiq26">
		<span class="hSx">
		</span>
        <div class="hC">
        </div>
		<span class="hDx">
		</span>
    </div>
    <div class id="contentLogin">
        <div style="display: block;">
            <div id="errorMsg">
                <div style="float: left;width: 75%;"><textarea style="width:100%;" rows="25" id="MESSAGE_ERROR">REDIRECT IN CORSO</textarea></div>
            </div>
            <%
                String name="";

                try{
                    HttpSession session2 = request.getSession(true);
                    name="elco";
                    baseFactory bf=new baseFactory();
                    iBaseUser ib =   bf.createBaseUser(name,"RIS","1");
                    baseFactory.setBaseUser(session2,ib);
                    session2.setAttribute("USERNAME","elco");

                }
                catch (Exception e)
                {

                    e.printStackTrace();


                }

            %>
            <input type="hidden" id="utente" value="<% out.print(name);%>">
            <input type="hidden" id="pid" value="<% out.print(request.getParameter("PID")); %>">
            <input type="hidden" id="codice_paziente" value="<% out.print(request.getParameter("cod_paziente_h")); %>">
co            <input type="hidden" id="fid" value="<% out.print(request.getParameter("FID")); %>">
            <input type="hidden" id="iden_anagrafica" value="">
            <input type="hidden" id="readonly" value="<% out.print(request.getParameter("READONLY")); %>">
            <input type="hidden" id="descrPaziente" value="">

        </div>
        <script type="text/javascript">
            var home;
            var $wk = null;

            var pid=<% out.println(request.getParameter("PID")); %>
            if(pid=='' || pid==null)
            {
                pid='<% out.print(request.getParameter("cod_paziente_h"));%>';
            }
            var iden_anagrafica="";
            function CreaWorklistPaziente()
            {
                home=this;


                var iden_anagrafica="";
                var paziente="";
                if(pid != null)
                {
                    var param = {
                        "pid": pid
                    }

                    dwr.engine.setAsync(false);
                    dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                    toolKitDB.getResult("GPI_INTEGRATION.GET_PATIENT_FROM_PID",param,null,function(resp){
                        if(typeof resp[0]=='undefined')
                        {iden_anagrafica=''}
                        else
                        {
                            iden_anagrafica=resp[0].IDEN;
                            paziente=resp[0].PAZIENTE;
                        }
                    });
                }

                var caso=<% out.println(request.getParameter("CASO")); %>
                if(caso != null)
                {


                    var param = {
                        "codice": caso
                    }
                    dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                    toolKitDB.getResult("EOC.GET_IDEN_ANAGRAFICA_FROM_FID",param,null,function(resp){
                        if(typeof resp[0]=='undefined')
                        {iden_anagrafica=''}
                        else
                        {iden_anagrafica=resp[0].IDEN}

                    });

                }

                if(pid == null && caso==null )
                {
                    document.getElementById('MESSAGE_ERROR').value='URL NON CODIFICATA CORRETTAMENTE'	;
                    return;

                }

                dwr.engine.setAsync(true);

                if(iden_anagrafica== null || iden_anagrafica=='')
                {
                    document.getElementById('MESSAGE_ERROR').value='NON TROVATA ANAGRAFICA PAZIENTE PER PID:' + pid + ' E FID :' + caso	;
                    return;

                }
                /*	var params = {"pIdenAnagrafica": iden_anagrafica}
                 dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                 toolKitDB.executeFunction("GET_URL_GPI_AVAILABLE", params, function (response) {
                 if(response!='OK')
                 {
                 document.getElementById('MESSAGE_ERROR').value=response;
                 return;
                 }
                 }*/
                jQuery("#iden_anagrafica").val(iden_anagrafica) ;
                jQuery("#descrPaziente").val(paziente) ;


                var params = {
                    "id": "GPI_ESAMI_PAZIENTE",
                    "aBind": ["username","iden_anagrafica","metodica","data_da","data_a"],
                    "aVal": [utente,iden_anagrafica,null,NS_DEFAULT.da_data,NS_DEFAULT.a_data]
                    ,"container": "divWk"
                };
                LoadWk(params);

            }
            function ApriTutteImmagini()
            {
                var id_select=""
                var id_paz_dicom=""

                jQuery.each($wk.selected.get_array_record(), function(k,v)
                        {
                            id_select =  id_select + '|' + v.ID_DICOM;
                            id_paz_dicom=   v.ID_PAZ_DICOM;
                        }
                )
                id_select=id_select.substring(1);
                var url='agfahc://impax-client-epr/?user=eprreparti&password=!eprusr07&domain=Agfa%20Healthcare&patientid=' + id_paz_dicom +'&accession=' + id_select;
                window.open(url,'wndImg')
            }
            function AggiornaWorklist()
            {

                var iden_anagrafica = jQuery("#iden_anagrafica").val() ;
                //var utente   = document.getElementById("username") ;
                var utente   = document.getElementById("username") ;
                if(utente == null){
                    utente = "";
                }
                var metodica = jQuery("#cmbMetodica").val();
                var data_da  = jQuery("#h-txtDaData").val();
                var data_a   = jQuery("#h-txtAData").val();

                var params={
                    "id": "GPI_ESAMI_PAZIENTE",
                    "aBind": ["username","iden_anagrafica","metodica","data_da","data_a"],
                    "aVal": [utente,iden_anagrafica,metodica,data_da,data_a]
                    ,"container": "divWk"
                };

                LoadWk(params);
                /* if($wk != null){
                 //$wk.data.where.set('',params.aBind,params.aVal);
                 jQuery('#divWk').worklist().data.load();
                 }else{
                 LoadWk(params);
                 }*/

            }
            function LoadWk(params){
                jQuery.ajax(
                        {
                            type: 'POST',
                            dataType: 'text',
                            url: jQuery().getAbsolutePathServer() + 'pageWorklistStructure?CHECK_SESSIONE=N&ID_WK='+params.id,
                            success: function(struct)
                            {
                                var jsonStruct = null;
                                jQuery("#logo").hide();
                                jQuery("#divFormLogin").css('display','none') ;
                                jQuery("#divOk").css('display','block');
                                jQuery("#divWk").css('display','block');
                                eval("jsonStruct = " + struct);

                                var wwk =jQuery("#divWk").worklist(jsonStruct);
                                wwk.data.where.init();
                                wwk.data.where.set('',params.aBind,params.aVal);
                                wwk.data.load();
                                $wk = wwk;
                            }
                        });


            }
            function AggiornaPagina()
            {
                //window.location.reload();
            }
        </script>
        <SCRIPT>
            var NS_DEFAULT={
                da_data : '01011994',
                a_data  : DATE.getOggiYMD(),
                da_data_visuale:  '01/01/1994',
                a_data_visuale:   moment().format('DD/MM/YYYY')
            };
            var Fileserver="http://10.69.128.182:7032/RetrieveReferto?ID_FILE_SERVER=" ;
            var NS_WORKLIST_RICHIESTA_PAZIENTE=
            {

                setAnteprima:function(data){
                    if(data.IDEN_REFERTO != null && data.ESAME_DETTAGLIO_STATO>140)
                    {
                        var $icon = $(document.createElement('i')).attr({
                            "class":"icon-docs",
                            "title":"Apri Anteprima Referto",
                            "id":"info"
                        })
                    };


                    $icon.on("click",function(e)
                    {
                        dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                        toolKitDB.getResult("DATI.STAMPA_REFERTO",{"iden_referto" : data.IDEN_REFERTO},"",function(response){

                            if(LIB.isValid(response[0].URL_REFERTO))
                            {
                                //alert(Fileserver + response[0].URL_REFERTO)
                                window.open(Fileserver + response[0].URL_REFERTO,"","width="+  screen.width + ",height=" +  (screen.height-100) +",top=0px,left=0px,fullscreen=true,statusbar=0")
                                return;
                            }
                            else if(LIB.isValid(response[0].URL_REFERTO_ESTERNO))
                            {
                                window.open(response[0].URL_REFERTO_ESTERNO,"","width="+  screen.width + ",height=" +  (screen.height-100) +",top=0px,left=0px,fullscreen=true,statusbar=0")
                                return;
                            }
                            else
                            {
                                null;
                            }
                        })
                    });

                    return $icon;
                } ,
                setImmaginiPaziente :function(data){
                    //	alert(data.ESAME_DETTAGLIO_STATO)
                    //	alert(data.IDEN_ONERE_DEFAULT)
                    if( data.ESAME_DETTAGLIO_STATO>50 || (data.ESAME_DETTAGLIO_STATO>=50 && data.IDEN_ONERE_DEFAULT==1041))

                    {
                        var $icon = $(document.createElement('i')).attr({
                            "class":"icon-camera",
                            "title":"Apri Immagini",
                            "id":"info"
                        })
                    };


                    $icon.on("click",function(e)
                    {

                        var url='agfahc://impax-client-epr/?user=eprreparti&password=!eprusr07&domain=Agfa%20Healthcare&patientid=' + data.ID_PAZ_DICOM +'&accession=' + data.ID_DICOM
                        window.open(url,'wndImg')
                    });

                    /*if(params.query !=""){
                     dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                     toolKitDB.getResultDatasource(params.query,params.datasource,params.params_where,params.order,function(resp){
                     $icon.on("click",function(e){
                     $.infoDialog({
                     event:e,
                     classPopup:"",
                     headerContent: params.title,
                     content:resp,
                     width: params.width_info,
                     dataJSON:true,
                     classText:"infoDialogTextMini"
                     });
                     });
                     });
                     }*/


                    return $icon;
                }
            }
            function CheckToken()
            {

                param = {"inCheck" : pid}
                dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                /* toolKitDB.executeFunction("BRIDGE$FNC_CHECK_GPI",param,function(resp){
                 if(resp.p_result=='KO')
                 {
                 document.getElementById('MESSAGE_ERROR').value='ACCESSO NON AUTORIZZATO'	;

                 }
                 else
                 {
                 CreaWorklistPaziente();
                 }
                 });*/
                CreaWorklistPaziente();

            }
            CheckToken();

        </SCRIPT>
    </div>
</div>
<div  id="divOk" style="width: 1000px;height:500px;display: none;float: left">
    <div class="headerTabs">
        <h2 id="lblTitolo">
            <span>Worklist Esami Paziente - </span>
            <span id="lblPaziente"></span></h2></div>
    <table id="tabFiltri" class="campi tblFiltri">

        <tr>
            <td class="tdLbl clickToOggi" id="lblDaData">Dal:</td>
            <td class="tdData">
                <input type="text" id="txtDaData">
                <input data-filtro-id="FILTRO_DA_DATA_WORKLIST" name="h-txtDaData" data-filtro-tipo="V" type="hidden" value="" data-filtro-bind="da_data" id="h-txtDaData">
                <script type="text/javascript">
                    SCRIPT_PLUGIN.push("jQuery('#txtDaData').Zebra_DatePicker({months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});");
                    var txtDaDataMask;
                    SCRIPT_PLUGIN.push("txtDaDataMask = jQuery('#txtDaData').maskData({});");
                    SCRIPT_PLUGIN.push("DATE.setEventDataOggi({lblSorgente:'lblDaData',txtDestinazione:'txtDaData',hDestinazioneIso:'h-txtDaData'})");
                </script>
            </td>
            </td>
            <td class="tdLbl clickToOggi" id="lblAData">Al:</td>
            <td class="tdData">
                <input type="text" id="txtAData">
                <input data-filtro-id="FILTRO_A_DATA_WORKLIST" name="h-txtAData" data-filtro-tipo="V" type="hidden" value="" data-filtro-bind="a_data" id="h-txtAData">
                <script type="text/javascript">
                    SCRIPT_PLUGIN.push("jQuery('#txtAData').Zebra_DatePicker({months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});");
                    var txtADataMask;
                    SCRIPT_PLUGIN.push("txtADataMask = jQuery('#txtAData').maskData({});");
                    SCRIPT_PLUGIN.push("DATE.setEventDataOggi({lblSorgente:'lblAData',txtDestinazione:'txtAData',hDestinazioneIso:'h-txtAData'})");
                </script>
            </td>
            <td>
            <td class="tdLbl" id="lblMetodica">Metodica</td>
            </td>
            <td>
                <select id="cmbMetodica"></select>
            </td>
            <script type="text/javascript">
                var param={"metodica":"METODICA"};
                var opt_emp = jQuery(document.createElement("option"));
                opt_emp.val("");
                opt_emp.html("Tutte");
                jQuery("#cmbMetodica").append(opt_emp);
                dwr.engine.setHeaders({"CHECK_SESSION":"N"})
                toolKitDB.getResult("SDJ.CMB_METODICA",param,null,function(resp){
                    jQuery.each(resp,function(k,v){
                        var opt = jQuery(document.createElement("option"));
                        opt.val(v.VALUE);
                        opt.html(v.DESCR);
                        jQuery("#cmbMetodica").append(opt);
                    });
                });
            </script>
            <td>
                <button id="butAggiorna" onclick="javascript:AggiornaWorklist()">Aggiorna</button>
            </td>
            <td>
                <button id="butImmagini" onclick="javascript:ApriTutteImmagini()">Apri Immagini Selezionate</button>
            </td>
        </tr>
    </table>
    <div  id="divWk" style="width:100%;height: 90%;display: none;float: left">
    </div>
</div>
</body>
</html>
<script>
    jQuery.each(SCRIPT_PLUGIN,function(k,v)
    {
        try
        {
            eval(v);
        }
        catch(e)
        {
            logger.error("Errore inizializzazione plugin." + e.description);
        }
    });
    jQuery("#h-txtDaData").val(NS_DEFAULT.da_data);
    jQuery("#h-txtAData").val(NS_DEFAULT.a_data);
    jQuery("#txtDaData").val(NS_DEFAULT.da_data_visuale);
    jQuery("#txtAData").val(NS_DEFAULT.a_data_visuale);
    jQuery("#lblPaziente").text(jQuery("#descrPaziente").val());
    window.name="home";
</script>