<?php
//#### FILE DI CONFIGURAZIONE DEL REGISTRY
//------------------- LOCAL REGISTRY HOST INFOS ------------------//
require ('./config/config.php');
require_once ('./lib/functions_' . $database . '.php');
require_once ('./lib/utilities.php');
require_once ("./lib/log.php");
require_once ("./lib/domxml-php4-to-php5.php");
$connessione = connectDB(); // connessione utilizzata dagli scrip che includono questo
//## QUERY FOR HTTP kind of CONNECTION WITH REGISTRY (NORMAL or TLS)
$http_con = "SELECT HTTPD FROM HTTP WHERE ACTIVE = 'A'";
$ip_source = $_SERVER['REMOTE_ADDR']; //Repository IP
$ip_server = $_SERVER['SERVER_NAME']; //Registry IP
$port_server = $_SERVER['SERVER_PORT']; //Registry IP
$res_http = query_select2($http_con, $connessione);
//#### OTTENGO LE INFORMAZIONI SUL PROTOCOLLO
$http = $res_http[0][0];
//##### PARAMETRO PROTOCOLLO HTTPS
if ($http == "NORMAL") {
    $http_protocol = "http://";
} else if ($http == "TLS") {
    $http_protocol = "https://";
}
$lib_path = "./lib/";
$select_config = "SELECT CACHE,PATIENTID,LOG,STAT,FOLDER FROM CONFIG";
$res_config = query_select2($select_config, $connessione);
//------------------ LOCAL FILE SYSTEM PATHS --------------------//
//###################### PARAMETRI DI SERVIZIO
//##### PER COSTRUIRE L'ebXML DI RISPOSTA ALLE QUERY (NAMESPACES)
$ns_rim = "rim";
$ns_rim_path = "urn:oasis:names:tc:ebxml-regrep:rim:xsd:2.1";
$ns_q = "q";
$ns_q_path = "urn:oasis:names:tc:ebxml-regrep:query:xsd:2.1";
$ns_rim3 = "rim";
$ns_rim3_path = "urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0";
$ns_q3 = "q";
$ns_q3_path = "urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0";
//##### A CHI SPEDIRE I MESSAGGI ATNA
$get_ATNA_node = "SELECT * FROM ATNA";
$res_ATNA_info = query_select2($get_ATNA_node, $connessione);
$ATNA_host = $res_ATNA_info[0][1];
$ATNA_port = $res_ATNA_info[0][2];
$ATNA_active = $res_ATNA_info[0][3];
//#### LOGS ATNA
$atna_path = "";
//$atna_path = "./atna_logs/";
//------------------ LOCAL FILE SYSTEM PATHS ------------------//
//#### PULIZIA CACHE TEMPORANEA
$clean_cache = $res_config[0][0]; //## A=attiva O=non attivo
//#### CONTROL PATIENT ID
//## A=controlla il PatientID e se non presente nel database ritorna un errore
//# O=controlla il PatientID e se non presente lo inserisce nel database
$control_PatientID = $res_config[0][1];
//#### LOG
$logActive = $res_config[0][2];
$tmp_path = "";
//$tmp_path = "./tmp/" . date("Y") . date("m") . date("d") . "/" . $ip_source . "/";
//if (!is_dir($tmp_path)) {
//    mkdir($tmp_path, 0777, true);
//}
$tmpQueryService_path = "";
//$tmpQueryService_path = "./tmpQueryService/" . date("Y") . date("m") . date("d") . "/" . $ip_source . "/";
//if (!is_dir($tmpQueryService_path)) {
//    mkdir($tmpQueryService_path, 0777, true);
//}
$log_path = "";
//$log_path = "./log/" . date("Y") . date("m") . date("d") . "/" . $ip_source . "/";
//if (!is_dir($log_path)) {
//    mkdir($log_path, 0777, true);
//}
//#### STAT
$statActive = $res_config[0][3];
//#### FOLDER
$controlFolderUniqueId = $res_config[0][4];
//###### NAV
$get_NAV = "SELECT * FROM NAV";
$res_NAV = query_select2($get_NAV, $connessione);
$NAV = $res_NAV[0][0]; //## A=attiva O=non attivo
$NAV_from = $res_NAV[0][1];
$NAV_to = $res_NAV[0][2];
?>