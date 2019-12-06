<?php
//#### FILE DI CONFIGURAZIONE DEL REPOSITORY
require ('config/config.php');
require_once ('./lib/functions_' . $database . '.php');
$connessione = connectDB();
//#### OTTENGO LE INFORMAZIONI SUL PROTOCOLLO
//$http = $res_http[0][0];
//##### PARAMETRO PROTOCOLLO HTTPS
$tls_protocol = "https://";
$normal_protocol = "http://";
//------------------------- LOCAL REPOSITORY HOST INFOS -------------------------//
$get_repo_info = "SELECT HOST,PORT,HTTP FROM REPOSITORY WHERE SERVICE = 'SUBMISSION' AND ACTIVE = 'A'";
$res = query_select2($get_repo_info, $connessione);
//##### OTTENGO LE INFORMAZIONI DI QUESTO REPOSITORY
$rep_host = $res[0][0];
$rep_port = $res[0][1];
$rep_protocol = $res[0][2];
//------------------------- LOCAL REPOSITORY HOST INFOS -------------------------//
//------------------------- LOCAL FILE SYSTEM PATHS -------------------------//
$ip_source = $_SERVER['REMOTE_ADDR'];
//$tmpQuery_path = "./tmpQuery/";
$lib_path = "./lib/";
$relative_docs_path = "./Submitted_Documents/" . date("Y") . "/" . date("m") . "/" . date("d") . "/"; // come sopra
$relative_docs_path_2 = "Submitted_Documents/" . date("Y") . "/" . date("m") . "/" . date("d") . "/"; //PER COMPORRE L'URI
$select_config = "SELECT WWW,LOG,CACHE,FILES,JAVA_PATH FROM CONFIG";
$res_config = query_select2($select_config, $connessione);
$www_REP_path = $res_config[0][0];
$www_docs_path = $www_REP_path . $relative_docs_path_2; //PER COMPORRE L'URI
//### LOGS
$log_path = "./log/" . date("Y") . date("m") . date("d") . "/" . $ip_source . "/";
//if (!is_dir($log_path)) {
//    mkdir($log_path, 0777, true);
//}
$logActive = $res_config[0][1];
$res_config[0][1];
//#### PULIZIA CACHE TEMPORANEA
$clean_cache = $res_config[0][2];
//#### True=Salva tutti i file False=Salva solo i file necessari
$tmp_path = "./tmp/" . date("Y") . date("m") . date("d") . "/" . $ip_source . "/";
//if (!is_dir($tmp_path)) {
//    mkdir($tmp_path, 0777, true);
//}
$save_files = false; //di default non salvo i file
if ($res_config[0][3] == "A") {
    $save_files = true;
}
//### JAVA PATH
$java_path = "";
//$java_path = $res_config[0][4];
//### MESSAGGI
$service = "repository.php";
$logentry = "\"http://$rep_host:$rep_port" . "$www_REP_path\"";
//## PER LA CHIAMATA AL JAR FILE
$path_to_VALIDATION_jar = "./XSD_VALIDATION_JAR/";
$path_to_XSD_file = "./schemas/rs.xsd";
//------------------- LOCAL FILE SYSTEM PATHS ---------------------//
//------------------- TO REGISTRY CONNECTION INFOS -------------------//
//###  LEGGO LE INFORMAZIONI DA DB: NODO ATTIVO
$select_registry = "SELECT HOST,PORT,PATH,HTTP FROM REGISTRY WHERE REGISTRY.ACTIVE = 'A' AND REGISTRY.SERVICE = 'SUBMISSION'";
$ris = query_select($select_registry);
//### OTTENGO LE INFORMAZIONI DEL NODO REGISTRY
$reg_host = $ris[0][0];
$reg_port = $ris[0][1];
$reg_path = $ris[0][2];
$reg_http = $ris[0][3];
//##### A CHI SPEDIRE I MESSAGGI ATNA
$get_ATNA_node = "SELECT * FROM ATNA";
$res_ATNA = query_select2($get_ATNA_node, $connessione);
$ATNA_host = $res_ATNA[0][1];
$ATNA_port = $res_ATNA[0][2];
$ATNA_active = $res_ATNA[0][3];
//#### LOGS ATNA
$atna_path = "./atna_logs/";
$namespacerim_path = "urn:oasis:names:tc:ebxml-regrep:rim:xsd:2.1";
//-------------------------- TO REGISTRY CONNECTION INFOS --------------------------//
?>
