<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title></title>
    <link rel="stylesheet" href="css/mix.css?t=7" type="text/css"/>
    <!--[if IE 7]>
    <link rel="stylesheet" href="css/ie7.css?t=7" type="text/css"/>
    <![endif]-->
    <link rel="stylesheet" href="css/Console/Console.css?t=7" type="text/css"/>
    <script id="scriptPlugin">var SCRIPT_PLUGIN = new Array();</script>
    <script>var baseUser = {"ID_SMART_CARD":"1530000000001240","VOCALE_ATTIVO":"S","TIPO_MEDICO":"R","PACS_ATTIVO":"S","TIPO_PERSONALE":"M","DRIVER":"niente","RICH_MOD_INSERIMENTO":"S","DESCRIZIONE":"DE BORTOLI DOTT. FABRIZIO","PANEL_DIM":"{hBottom:240,wSx:306,wDx:232}","RICH_MOD_ADMIN":"S","IDEN_PER":"3930","USERNAME":"fabri","LINGUA":"IT","ABILITA_CONTEXT_MENU":"S","PASSWORD":"www","IDEN":"21","CODICE_VOCALE":"PD","RICH_MOD_NOTIFICHE":"S","GRUPPO_PERMESSI":"DEVELOPER.DEBUGGER","FILTRI_PROVENIENZA_WK_PRINCIPALE":"M"};</script>
    <script>var basePC = {"PASSWORD_EMERGENZA":"test","STAMPANTE_ETICHETTE":"","ABILITA_SCELTA_STAMPANTE":"N","AETITLE":"PACS1","STAMPANTE_REFERTO":"","IP":"NB-FABRIZIOD","SCANNER":"","NAMESPACE_PACS":"CSH","SPEECHMAGIC":"S","CLSID":"clsid:9217D4FC-DC6A-47EA-9A53-1518EA660011","UTENTE_EMERGENZA":"test","DIRECTORY_REPORT":"","USA_PID":"N"};</script>
    <script>var baseGlobal = {"PAGE_URL":"page?KEY_LEGAME=","PASSWORD_DEFAULT":"167","ABILITA_TARMED":"S","NUMERO_ARCHIVIO_REPARTO":"S","ASSOCIA_ESAMI_MODIFICA":"N","ABILITA_FINE_ESECUZIONE":"N","PRINT_REPOSITORY_REPORT":"/usr/local/report/fenix","MAIN_URL":"page?KEY_LEGAME=MAIN_PAGE","PERCORSO_DOWNLOAD_AUDIO_SPEECHMAGIC":"http://192.168.3.10/Download/getAudio.php?ID=","NUMERO_ARCHIVIO_PROGRESSIVO":"N","LOAD_ON_STARTUP":"page?KEY_LEGAME=WORKLIST","PERCORSO_FILE_SERVER":"http://192.168.3.10/File/","ESAMI_MAX_LIVELLO_STATO_DELETED":"50","DEFAULT_CONSOLE_DIM":"{hBottom:400,wSx:200,wDx:200}","PERCORSO_UPLOAD_AUDIO_SPEECHMAGIC":"http://192.168.3.10/Upload/saveAudio.php","URL_CHAR_REPLACER":"::","PRINT_URL":"http://192.168.3.10:9000/?","SDJ_LOG_LEVEL":"4","INSERIMENTO_ESAMI_MULTIMETODICA":"S","ABILITA_FILE_SERVER":"S","DEFAULT_NAMESPACE_PACS":"pacs","REFERTA_TUTTI_DETTAGLI":"S","DEFAULT_NAMESPACE_VOCALE":"TINYMCE","PERCORSO_ACTIVEMQ_HTTP_REST_CALL":"http://192.168.3.10:8161/fenix/message/generic?","USO_DHCP":"S","ID_SERVER_REFERTO_ONLINE":"3000","PERCORSO_FILE_SERVER_DOCUMENTI":"http://192.168.3.10/Download/getRefertiChiaro.php?ID=","UID":"'2.16.840.1.113883.2.9.3.21.5.1020.' || to_char(sysdate,'yyyyMMddHH24MISS') || '.'","SCARICO_MAGAZZINO_ESAMI":"ESAMI_DETTAGLIO","ABILITA_SCARICO_MATERIALE":"S","AUTO_INSERT_PC":"S","PERCORSO_FILE_SERVER_UPLOAD_ALLEGATI":"http://192.168.3.10/Upload/saveAllegati.php","PERCORSO_FILE_SERVER_UPLOAD":"http://192.168.3.10/Upload/saveConfig.php","PERCORSO_FILE_SERVER_UPLOAD_REFERTI":"http://192.168.3.10/Upload/saveReferti.php","PERCORSO_FILE_SERVER_VERSIONI":"http://192.168.3.10/Download/getReferti.php?ID="};</script>
</head>
<body id="page">
<form autocomplete="off" data-colonna-chiave-primaria id="dati" data-tabella-salvataggio class="dati" data-campo-chiave-primaria data-connessione-salvataggio data-nome-campo-xml data-procedura-salvataggio>
    <div name class id="w">
        <div name class id="tHeader">
            <div name class id="infoReferto">
                <h5 id="dataReferto">
                    <strong>Data Referto</strong>
                    <span>28/11/2013</span></h5>
                <h5 id="Paziente">
                    <strong>Paziente</strong>
                    <span>PINCO BE 01/01/1982</span></h5>
                <h5 id="etaPaziente">
                    <strong>Eta Paziente</strong>
                    <span>19820101</span></h5>
                <h5 id="Sospeso">
                    <strong>Sospeso</strong>
                    <span>N</span></h5>
            </div>
            <div name class id="btnLayout">
                <button type="button" class="btnLayout hide" id="btnRipristina">
                    <i class="icon-resize-small-1"></i></button>
                <button type="button" class="btnLayout null" id="btnEspandi">
                    <i class="icon-resize-full-1"></i></button>
                <button type="button" class="btnLayout null" id="btnChiudi">
                    <i class="icon-cancel-1"></i></button>
            </div>
        </div>
        <div name class id="center">
            <div name="NS_INFO_ESAME" class="" data-ns="NS_INFO_ESAME" id="tSx">
                <div name class="accordion" id="infoEsame">
                    <h3>
                        <a href="#" id="accInfoEsame">Info Esame</a></h3>
                    <div>
                        <div class="RIQ" id="QuesitoClinico">
                            <h5 id="lblQuesitoClinico">Quesito Clinico</h5>
                            <p id="pQuesitoClinico">
                            </p>
                        </div>
                        <div class="RIQ" id="QuadroClinico">
                            <h5 id="lblQuadroClinico">Quadro Clinico</h5>
                            <p id="pQuadroClinico">
                            </p>
                        </div>
                        <div class="RIQ" id="AutorizzaMDC">
                            <h5 id="lblAutorizzaMDC">Autorizza MDC</h5>
                            <p id="pAutorizzaMDC">
                                N
                            </p>
                        </div>
                        <div class="RIQ" id="Note">
                            <h5 id="lblNote">Note</h5>
                            <p id="pNote">
                            </p>
                        </div>
                    </div>
                    <h3>
                        <a href="#" id="accOperatori">Operatori</a></h3>
                    <div>
                        <div name class="RIQ" id="PrimoMedico">
                            <div class="tdACList">
                                <div class="acList hide" id="ConsolePrimoMedico">
                                    <div class="acListDiv">
                                        <div class="hRiq hRiq26">
                                            <span class="hSx"></span>
                                            <div class="hC">
                                            </div>
                                            <span class="hDx"></span>
                                        </div>
                                        <div class="contentDiv">
                                            <div class="acListFiltri">
                                                <table>
                                                    <tr>
                                                        <td class="tdLbl " id="titPrimoMedico">
                                                            Primo Medico
                                                        </td>
                                                        <td class="tdText ">
                                                            <input name="2" autocorrect="off" type="text" autocomplete="off" class="txtACLfiltro" value="" autocapitalize="off" id="2">
                                                            <span class="spanText" id=""></span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <script type="text/javascript">
                                                SCRIPT_PLUGIN.push("$('#titPrimoMedico').autocompleteList('ConsolePrimoMedico',{'onSelect':function(ret){;},'binds':{'tipo_medico':'R'},'title':'Primo Medico','id_wk':'AC_CONSOLE_OPERATORI'});");</script>
                                            <div class="acListWk">
                                            </div>
                                        </div>
                                        <div class="footerTabs sfDark">
                                            <div class="buttons">
                                                <button type="button" class="btn acListCerca" id="titPrimoMedico@acListCerca">Cerca</button>
                                                <button type="button" class="btn acListChiudi" id="titPrimoMedico@acListChiudi">Chiudi</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h5 class id="titPrimoMedico">Primo Medico</h5>
                            <input type="text" value="" id="txtPrimoMedico">
                            <input type="hidden" value="" data-col-save="PRIMO_MEDICO" id="h-txtPrimoMedico">
                            <script type="text/javascript">
                                SCRIPT_PLUGIN.push("$('#txtPrimoMedico').autocomplete({'onSelect':function(ret){;},'storedQuery':'AUTOCOMPLETE.AC_CONSOLE_OPERATORI','minChars':'2','binds':{'tipo_medico':'R'},'zIndex':'9999','width':'300','maxHeight':'500','deferRequestBy':'200','serviceUrl':'autocompleteAjax','maxResults':'30'});");</script>
                        </div>
                        <div name class="RIQ" id="SecondoMedico">
                            <h5 class id="titSecondoMedico">Secondo Medico</h5>
                            <input type="text" value="" id="txtSecondoMedico">
                            <input type="hidden" value="" data-col-save="SECONDO_MEDICO" id="h-txtSecondoMedico">
                            <script type="text/javascript">
                                SCRIPT_PLUGIN.push("$('#txtSecondoMedico').autocomplete({'onSelect':function(ret){;},'storedQuery':'AUTOCOMPLETE.AC_CONSOLE_OPERATORI','minChars':'2','binds':{'tipo_medico':'R'},'zIndex':'9999','width':'300','maxHeight':'500','deferRequestBy':'200','serviceUrl':'autocompleteAjax','maxResults':'30'});");</script>
                        </div>
                        <div name class="RIQ" id="Specializzando">
                            <h5 class id="titSpecializzando">Specializzando</h5>
                            <input type="text" value="" id="txtSpecializzando">
                            <input type="hidden" value="" data-col-save="SPECIALIZZANDO" id="h-txtSpecializzando">
                            <script type="text/javascript">
                                SCRIPT_PLUGIN.push("$('#txtSpecializzando').autocomplete({'onSelect':function(ret){;},'storedQuery':'AUTOCOMPLETE.AC_CONSOLE_OPERATORI','minChars':'2','binds':{'tipo_medico':'S'},'zIndex':'9999','width':'300','maxHeight':'500','deferRequestBy':'200','serviceUrl':'autocompleteAjax','maxResults':'30'});");</script>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div name="NS_REFERTO" class="" data-ns="NS_REFERTO" id="tContent">
        </div>
        <div name="NS_FUNZIONI" class="" data-ns="NS_FUNZIONI" id="tDx">
            <div name class="accordion" id="divFunzioni">
                <h3>
                    <a href="#" id="riqFunzioniBase">Funzioni Base</a></h3>
                <div>
                    <ul class="ulMenu null" id="ulFunzioniBase">
                        <li>
                            <a href="javascript:NS_FUNZIONI_CONSOLE.importa();" title="Funzione di Prova 1" id="fncProva1">
                                <img alt="Funzione di Prova 1" src="img/menu.png">
                                <span>Importa</span></a></li>
                        <li>
                            <a href="javascript:NS_FUNZIONI_BASE_CONSOLE.salva();" title="Salva referto" id="fncSalva">
                                <img alt="Salva referto" src="img/menu.png">
                                <span>Salva</span></a></li>
                        <li>
                            <a href="javascript:NS_FUNZIONI_BASE_CONSOLE.anteprima();" title="Anteprima Referto" id="fncAnteprimaReferto">
                                <img alt="Anteprima Referto" src="img/menu.png">
                                <span>Anteprima</span></a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div name="NS_INFO" class="" data-ns="NS_INFO" id="tBottom">
            <iframe frameborder="0" class src id="iBottom">
            </iframe>
        </div>
    </div>
</form>
<form target="_self" method="POST" id="EXTERN">
    <input name="KEY_LEGAME" type="hidden" value="CONSOLE" id="KEY_LEGAME">
    <input name="IDEN_ANAGRAFICA" type="hidden" value="2000012" id="IDEN_ANAGRAFICA">
    <input name="N_SCHEDA" type="hidden" value="1" id="N_SCHEDA">
    <input name="USERNAME" type="hidden" value="fabri" id="USERNAME">
    <input name="USER_IDEN_PER" type="hidden" value="3930" id="USER_IDEN_PER">
    <input name="SITO" type="hidden" value="RIS" id="SITO">
    <input name="STATO_PAGINA" type="hidden" value="I" id="STATO_PAGINA">
</form>
<script type="text/javascript" src="js/Base/LIB.js?t=76"></script>
<!--[if IE]>
<script type="text/javascript" src="js/Base/NO-min/ecma.js?t=76"></script>
<![endif]-->
<script type="text/javascript" src="js/Base/tinymce4/tinymce.js?t=76"></script>
<script type="text/javascript" src="dwr/engine.js?t=76"></script>
<script type="text/javascript" src="dwr/interface/toolKitDB.js?t=76"></script>
<script type="text/javascript" src="js/Base/NS_FENIX.js?t=76"></script>
<script type="text/javascript" src="js/test/panel.js?t=76"></script>
</body>
</html>