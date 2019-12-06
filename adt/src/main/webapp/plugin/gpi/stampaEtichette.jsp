<%--
  Created by IntelliJ IDEA.
  User: fabioc
  Date: 26/05/2015
  Time: 16:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="it.elco.baseObj.factory.baseFactory" %>
<%@ page import="it.elco.baseObj.iBase.iBaseUser" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="windows-1252"/>
  <title>FeniX Gestione Stampa Etichette
  </title>
  <script>
    var traduzione = {"tabCodiciEsterni":"Codici Esterni","lblLocRes":"Localit?","lblFemmina":"Femmina","fldDP":"Dati Principali","nomeObbligatorio":"Nome Obbligatorio","butRemOne":"<","lblNome":"Nome","lblSovrappeso":"Sovrappeso","lblCAPRes":"CAP","validUrl":"Inserire una URL valida","lblMDC":"MDC","lblDataScadTes":"Data Scadenza Tessera","errCalcCodFisc":"Errore cacolo Codice Fiscale","lblInserimento":"Inserimento","butRemAll":"<<","acList":"Autocomplete List","lblAcCap":"CAP","lblFiltriPersonali":"Filtri Personali","validRangelength":"Inserire un valore di lunghezza compresa tra {0} e {1} caratteri","lblID11":"ID 11","lblIndRes":"Indirizzo","lblID10":"ID 10","lblID12":"ID 12","wkEsame":"Esame","lblMultipla":"Multipla","fldCertificazione":"Certificazione","lblInserisciEsame":"Inserisci Esame","lblNewAnag":"Inserimento nuovo paziente","Giorni":"Domenica,Luned?,Marted?,Mercoled?,Gioved?,Venerd?,Sabato","wkStato":"Stato","successTitleSave":"Success!","lblObesita":"Obesit?","lblKg":"Kg","validMax":"Il valore deve essere minore o uguale a {0}","selAllTags":"Seleziona Tutti","validDigits":"Inserire solo caratteri","validImportant":"Il campo ? importante","lblM2":"m^2","lblCdC":"Centro di Costo","lblTitolo":"Scheda Anagrafica","fldNote":"Note","lblSingola":"Singola","lblRisultato":"Risultato Peso","lblTipoCert":"Tipo","errorTitleSave":"Error!","errNoNome":"Compilare prima il nome","lblCert":"Certificazione","martedi":"Mar","menuVuoto":"Nessuna voce disponibile","lblBranca":"Branca","lblLiberaProfessione":"Libera Prof.","lblCognome":"Cognome","lblID9":"ID 9","giovedi":"Gio","lblAltezza":"Altezza","lblTitoloStudio":"Titolo di Studio","lblRefertaEsame":"Referta Esami","lblID2":"ID 2","errNoDataNasc":"Compilare prima la data di nascita","lblID1":"ID 1","lblID4":"ID 4","lblID3":"ID 3","lblID6":"ID 6","lblID5":"ID 5","lblICT":"Istit. Competente Tessera","butStampa":"Stampa","lblID8":"ID 8","lblID7":"ID 7","lblTit_Infermiere":"INF.","cellaDisabilitata":"Cella disabilitata","validMinlength":"Lunghezza minima {0} caratteri","errNoCognome":"Compilare prima il cognome","lblTit_Infermiera":"INF.RA","menuModificaIndirizzo":"Apri scheda","lblMedicoMammo":"Medico Mammografia","lblAcTitoloAnag":"Titolo","lblCodGruppo":"Codice Gruppo","lblCod1":"ID 1","validMaxlength":"Lunghezza massima {0} caratteri","lblCod2":"ID 2","lblStampa":"Stampa","lblCod3":"ID 3","lblCod4":"ID 4","lblCod5":"ID 5","lblIDpaz":"ID Patient","lblCod6":"ID 6","lblProf":"Professione","lblCod7":"ID 7","lblCod8":"ID 8","lblAcProfessioni":"Professioni","lblCod9":"ID 9","lblMedBase":"Medico di Base","lblCodDescr":"Cod+Descr.","lblSupCorpo":"Sup. Corporea","lblProvRes":"Provincia","lblCell":"Cellulare","errNoComNasc":"Compilare prima il luogo di nascita","lblMetodica":"Metodica","lblTit_Tecnico":"TEC.","lblAcDescrizione":"Comune","lblAttenzione":"Attenzione","lblSegreteria":"Segreteria","acListChiudi":"Chiudi","lblMail":"E-Mail","butAddAll":">>","lblVisualizzaTutti":"Visualizza Tutti","butSaveStatoFiltri":"Salva stato filtri","lblConferma":"Conferma","lunedi":"Lun","lblPeso":"Peso","lblCivRes":"Civico","lblCodSottogruppo":"Codice Sottogruppo","lblAccettaEsame":"Accetta","lblAcProvincia":"Provincia","lblAcFineValidita":"Fine Validit?","lblOrdine":"Ordine","lblStato":"Stato","lblAcTitCittadinanza":"Cittadinanza","butEsenzione":"Esenzione","errorSave":"Errore durante il salvataggio","lblInterno":"Interno","lblCAPDom":"CAP","lblProvDom":"Provincia","lblCodReg":"Codice Regionale","lblPrivato":"Privato","wkProvenienza":"Provenienza","okTags":"Applica","lblModifica":"Modifica","lblNtes":"N. Tessera","validNumber":"Inserire solo numeri","lblEmail":"Email","lblOrgano":"Organo","tabDatiTessera":"Dati TesEuro","lblGruppo":"Gruppo","lblSchedaAppropriatezza":"Scheda Appropriatezza","wkDataEsame":"Data Esame","wkOraEsame":"Ora Esame","wkMetodica" : "Metodica","lblNazioneIndirizzo":"Nazione","lblAttivi":"Attivi","lblAcStatoCivile":"Stato Civile","lblCodSirm":"Codice Sirm","lblAttivo":"Attivo","acListRicercaSensibile":"Ricerca Sensibile","lblUSLDom":"USL","lblDataNasc":"Data di Nascita","lblInizioEsecuzione":"Inizio Esecuzione","lblAcCodice":"Codice","deselAllTags":"Deseleziona Tutti","lblCodCup":"Codice Cup","lblTelefono":"Telefono","lblAnamnesi":"Anamnesi","lblCodiceFiscale":"Codice Fiscale","ttUtilizza":"Utilizza","lblTipoMedico":"Tipo Medico","validHours":"Il valore deve essere in formato hh:mm [00:00 - 23:59]","lblTit_Dottore":"DOTT.","lblIndDom":"Indirizzo","lblTit_Signora":"SIG.RA","fldDom":"Domicilio","lblAcTitoloStudioAnag":"Titolo di Studio","lblDataDec":"Data Decesso","lblTit_Signore":"SIG.","okSalvataggioFiltriPersonali":"Salvataggio filtri personali riuscito","butAddOne":">","lblRegRes":"Regione","venerdi":"Ven","lblCm":"Cm","lblTelDom":"Telefono","butDeselAll":"Desel. Tutto","lblDescr":"Descrizione","fldInfoPaz":"Info Paziente","validEmail":"Inserire un indirizzo mail valido","lblTit_Dottoressa":"DOTT.SSA","lblCodFisc":"Codice Fiscale","tabAnamnesi":"Anamnesi","lblQualBen":"Qualifica Beneficiario","lblComuneIndirizzo":"Comune","lblFiltro":"Filtro","lblEsterno":"Esterno","validRequired":"Il campo ? Obbligatorio","butApplica":"Applica","tabEsami":"Esami","validMin":"Il valore deve essere maggiore o uguale a {0}","sabato":"Sab","lblCodiceDecodifica":"Codice Decodifica","closeTags":"Chiudi","acListCerca":"Cerca","lblCodice":"Codice","lblDescrAbbr":"Descr.","lblEta":"Et?","lblCodEsa":"Codice Esame","fldAna":"Anamnesi","lblCodDec":"Codice Decodifica","lblEntrambi":"Entrambi","lblDataNascita":"Data Nascita","lblNoTemplate":"Template non trovato","lblTicket":"Ticket","lblSi":"S?","tabIndirizzi":"Indirizzi","lblMedicoReparto":"Medico Reparto","lblNoso":"N? nosografico","lblSottopeso":"Sottopeso","koSalvataggioFiltriPersonali":"Errore salvataggio Filtri Personali","lblCodMin":"Codice Ministeriale","lblAcInizioValidita":"Inizio Validit?","lblPesoIdeale":"Peso Ideale","lblProntoSoccorso":"Pronto Soccorso","lblApparato":"Apparato","tabResDom":"Residenza e Domicilio","lblSesso":"Sesso","lblAcTitMedici":"Medici","fldAnaResult":"Calcoli","mercoledi":"Mer","lblFineEsecuzione":"Fine Esecuzione","lblOnere":"Onere","lblNonAttivi":"Non Attivi","errNoSesso":"Compilare prima il sesso","lblNormopeso":"Normopeso","lblIDCitt":"ID Cittadino","butChiudi":"Chiudi","lblMaschio":"Maschio","lblUSLRes":"USL","lblCod10":"ID 10","tabNote":"Note","lblBMI":"Body Mass Index","lblRegDom":"Regione","lblEsente":"Esente","menuInserisciIndirizzo":"Inserisci","lblLuogoNasc":"Luogo di Nascita","lblStatoCivile":"Stato Civile","lblPresso":"Presso","butSelAll":"Sel. Tutto","tabDatiPrincipali":"Dati Principali","fldCodici":"Codici","lblAltriOspedali":"Altri Ospedali","lblMdC":"Mezzo di Contrasto","domenica":"Dom","lblConfirmOperazione":"Sicuro di voler confermare l'operazione?","lblStampaEtiEsame":"Stampa Etichette Esame","lblRimuoviTutti":"Rimuovi Tutti","lblCerca":"Cerca","lblProfiloVocale":"Profilo Vocale","lblAcCodiceFiscale":"Codice Fiscale","lblCitt":"Cittadinanza","Mesi":"Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre","lblStampaReferto":"Stampa Referto","lblTratDati":"Consenso al trattamento dei dati personali","butAddIndirizzo":"Inserisci nuovo indirizzo","lblDescrStrut":"Descrizione Struttura","validFixedLength":"Il valore deve essere {0} caratteri","lblCivDom":"Civico","lblNo":"No","lblSconosciuto":"Sconosciuto","lblTelRes":"Telefono","lblDescrizione":"Descrizione","validRange":"Inserire un valore compreso tra {0} e {1}","butRegistra":"Registra","butResetDati":"Reset Dati","lblCodifica":"Codifica","lblCampiImportanti":"Campi importanti non compilati.","ttCancella":"Cancella","lblLocDom":"Localit?","lblIntramoenia":"Intramoenia","lblUSLAss":"USL Assistenza","fldRes":"Residenza","lblTitoloAnag":"Titolo","lblTipoIndirizzo":"Tipo","butSalva":"Salva","menuIndirizzi":"Indirizzo","lblIndirizzo":"Indirizzo","successSave":"Salvataggio effettuato correttamente","wkCdc":"Ospedale",
      "Mesi":"Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre","Giorni":"Domenica,Lunedì,Martedì,Mercoledì,Giovedì,Venerdì,Sabato"};
  </script>
  <link rel="stylesheet" href="http://10.69.128.183/File/css/mix.css" type="text/css"/>
  <link rel="stylesheet" href=".http://10.69.128.183/File/css/LOGIN_PAGE/login.css" type="text/css"/>
  <link rel="stylesheet" href="http://10.69.128.183/File/css/wk.css?t=7" type="text/css"/>
  <link rel="stylesheet" href="http://10.69.128.183/File/css/zebra_datepicker.css?t=73" type="text/css"/>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/LIB.js?t=74"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/NO-min/NS_DATE.js?t=73"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/NO-min/jquery.dialog.js?t=74"></script>
  <script type="text/javascript" src="../../dwr/interface/toolKitDB.js?t=73"></script>
  <script type="text/javascript" src="../../dwr/interface/dwrLdap.js?t=73"></script>
  <script type="text/javascript" src="../../dwr/engine.js?t=73"></script>
  <script type="text/javascript" src="../../dwr/interface/toolKitWK.js?t=73"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/NS_WORKLIST_COMPONENT.js?t=73"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/NO-min/jquery.contextmenu.js?t=73"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/worklist.js?t=73"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/NS_PROCESS_CLASS.js?t=73"></script>
  <script type="text/javascript" src="http://10.69.128.183/File/js/Base/NO-min/WK.js?t=73"></script>
  <script type="text/javascript" src=".http://10.69.128.183/File/js/Base/NO-min/jquery.zebra_datepicker.js?t=73"></script>

  <script id="scriptPlugin">var SCRIPT_PLUGIN = new Array();</script>

</head>
<body>
<input type="hidden" id="codice_richiesta" value="<% out.print(request.getParameter("CODICE_RICHIESTA"));%>">
<input type="hidden" id="pid" value="<% out.print(request.getParameter("PID")); %>">
<%
  String name="";

  try{

    name = request.getParameter("USERNAME");
    if(name != null && !name.equalsIgnoreCase(""))
    {
      baseFactory bf=new baseFactory();
      iBaseUser ib =   bf.createBaseUser(name,"RIS","1");
      baseFactory.setBaseUser(session,ib);
    }
  }
  catch (Exception e)
  {

    e.printStackTrace();


  }

%>
<div  id="divOk">
  <div class="headerTabs">
    <h2 id="lblTitolo">
      <span>Gestione Stampe   -   Paziente: </span>
      <span id="lblPaziente">RICERCA PAZIENTE IN CORSO</span></h2></div>
	<div  id="divContent" style="display: none;">
  <table id="tabFiltri" class="campi tblFiltri">
    <tr>
    <td>
      <button id="butEtiAnag" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('ETICHETTE_ANAG','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_ETICHETTE,PC.ETICHETTE_CONFIGURAZIONE)">Stampa Etichette Anagrafica</button>
    </td>
      </tr>
    <tr>
    <td>
      <button id="butEtiEsame" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('ETICHETTE_OPERA','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_ETICHETTE,PC.ETICHETTE_CONFIGURAZIONE)">Stampa Etichette Esame</button>
    </td>
    </tr>
    <tr>
      <td>
        <button id="butEtiBiopsie" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('ETICHETTE_BIOPSIA','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_ETICHETTE,PC.ETICHETTE_CONFIGURAZIONE)">Stampa Etichette Biopsie</button>
      </td>
    </tr>
    <tr>
      <td>
        <button id="butEtiSpedizione" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('ETICHETTE_SPEDIZIONE','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_ETICHETTE,PC.ETICHETTE_CONFIGURAZIONE)">Stampa Etichette Spedizione</button>
      </td>
    </tr>
	<tr>
      <td>
        <button id="butRitiro" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('TICKET_RP_ESTERNO','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_REFERTO,PC.REFERTO_CONFIGURAZIONE)">Stampa Ritiro Referto</button>
      </td>
    </tr>
	<tr>
      <td>
        <button id="butRitiroOsp" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('TICKET_RP_OSPEDALE','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_REFERTO,PC.REFERTO_CONFIGURAZIONE)">Stampa Ritiro Referto Ospedaliero</button>
      </td>
    </tr>
	<tr>
      <td>
        <button id="butCertificato" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('CERTIFICATO','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_REFERTO,PC.REFERTO_CONFIGURAZIONE)">Stampa Certificato</button>
      </td>
    </tr>
	<tr>
      <td>
        <button id="butConsegna" style="width: 100%;font-size: 18px" onclick="javascript:Stampa('CONSEGNA','{ESAMI_TESTATA.IDEN}=' + DATA_ESAMI[0].IDEN_TESTATA,PC.STAMPANTE_REFERTO,PC.REFERTO_CONFIGURAZIONE)">Stampa Consegna Referto Immediato</button>
      </td>
    </tr>
  </table>
  <div class="headerTabs">
      <h2 id="lblPcInfo">
      <span >Ip : </span>
      <span style="color: black" id="lblPc">RICERCA IP IN CORSO</span>

      <span>  Stampante A4 : </span>
      <span style="color: black" id="lblStampante">Nessuna stampante Associata</span>

      <span>  Stampante Etichette: </span>
      <span style="color: black" id="lblStampanteEti">Nessuna stampante Associata</span></h2>
	</div>
	<div id="divInfo" >
	</div>
  </div>
  <object height="800px" name="AppStampa" width="800px" type="application/x-java-applet" id="AppStampa">
    <param name="SCLclass" value="it.elco.applet.smartCard.login.SwitchCardListener">
    <param name="code" value="it.elco.applet.elcoApplet.class">
    <param name="archive" value="../../app/SignedFenixApplet.jar">
    <param name="wmode" value="transparent">
    <param name="loadFirma" value="false">
    <param name="provider_path" value="C:/firma.cfg">
    <param name="loadStampe" value="true">
    <embed wmode="transparent">
      <param name="session_id" value="7373702AE8743D17B93679B50A2C4ED5"></object>
</div>
<script>
  var DATA_ESAMI=null;
  var PC=null;
  var StampanteEtichette=null;
  var StampanteReferti=null;
  $(document).ready(function ()
  {
    var nomeHost = AppStampa.GetLocalHostname().toUpperCase();

    $('#lblPc').text(nomeHost);
    params={"ip":nomeHost }    ;

    dwr.engine.setHeaders({"CHECK_SESSION":"N"})

    toolKitDB.getResultDatasource("GPI_INTEGRATION.GET_STAMPANTI_PC","CONFIG_WEB",params,"",
            {
              callback: function (response)
              {

                if(response[0])
                {
                  PC=  response[0];
				  PC.ETICHETTE_CONFIGURAZIONE='{"methods": [{"setPageSize":[8]},{"setCustomPageDimension":[98.0,70.0,4]},{"setPageMargins":[[0.1,0.1,0.1,0.1],4]}]}';
				  PC.REFERTO_CONFIGURAZIONE='{"methods": [{"setPageSize":[2]} ]}'
                  if(response[0].STAMPANTE_REFERTO!=null)
				  {
                    $("#lblStampante").text(response[0].STAMPANTE_REFERTO)
					StampanteReferti=response[0].STAMPANTE_REFERTO;
				  }
                  if(response[0].STAMPANTE_ETICHETTE!=null)
				  {
                    $("#lblStampanteEti").text(response[0].STAMPANTE_ETICHETTE)
					StampanteEtichette=response[0].STAMPANTE_ETICHETTE;
				  }

                  CaricaInfoExam();

                }
              },
              timeout: 5000,
              errorHandler: function (response)
              {

              }
            });

  });


  function CaricaInfoExam()
  {
    params={"codice_esterno":$("#codice_richiesta").val(),"pid":$("#pid").val() }    ;
    toolKitDB.getResultDatasource("GPI_INTEGRATION.GET_INFO_EXAM","POLARIS_DATI",params,"",
            {
              callback: function (response) {
                if (response.length > 0)
                {
                  DATA_ESAMI = response
                  $("#lblPaziente").text( response[0].PAZIENTE + "  -  Richiesta n°:" + $("#codice_richiesta").val())
				  $("#divContent").show();
				  
              }
              else
              {
                alert("Richiesta non trovata");
              }
              },
              timeout: 5000,
              errorHandler: function (response)
              {

              }
            });
  }
  function Stampa(report,sf,stampate,conf)
  {
	  //alert(PC)
     var UrlFS='http://10.69.128.183:9000/crystal?init=pdf&report=/usr/local/report/fenix/RIS/'+DATA_ESAMI[0].IDEN_CDC + '/' + report + '.RPT&sf=' + encodeURIComponent(sf) ;
	 
    AppStampa.setSrcFromUrl(UrlFS);
    AppStampa.print(stampate,conf);
  }
  var NS_FENIX_PRINT = new Object();
  NS_FENIX_PRINT.documentChangeHandler=function(url){};
</script>
</body>
</html>
