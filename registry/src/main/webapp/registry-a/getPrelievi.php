<?php
ob_start();
//#### CONFIGURAZIONE DEL REGISTRY
require_once ("REGISTRY_CONFIGURATION/REG_configuration.php");
require_once ("htmlFunctions.php");
$idfile = idrandom_file();
$script = $_SERVER['PHP_SELF'];
$www_REG_path = str_replace('getPrelievi.php', '', $script);
$_SESSION['tmp_path'] = $tmp_path;
$_SESSION['tmpQueryService_path'] = $tmpQueryService_path;
$_SESSION['idfile'] = $idfile;
$_SESSION['logActive'] = $logActive;
$_SESSION['log_path'] = $log_path;
$_SESSION['www_REG_path'] = $www_REG_path;

writeTimeFile($idfile . "-Registry: recupero dati strutturati, getPrelievi-");
//RECUPERO GLI HEADERS RICEVUTI DA APACHE
$headers = apache_request_headers();
writeTmpFiles($headers, $idfile . "-headers_received-" . $idfile);
//$connessione è già valorizzata. La connessione è aperta nel file 'REGISTRY_CONFIGURATION/REG_configuration.php'
try {
	// nomi delle colonne nella vista mappati ai nomi da visualizzare nella tabella HTML
	$table_columns[0][0] = "DESCR_ESAME";
	$table_columns[0][1] = "ESAME";
	$table_columns[1][0] = "DATA_PRELIEVO";
	$table_columns[1][1] = "DATA PRELIEVO";
	$table_columns[2][0] = "VALORE_MIN";
	$table_columns[2][1] = "VALORE MINIMO";
	$table_columns[3][0] = "RISULTATO";
	$table_columns[3][1] = "RISULTATO";
	$table_columns[4][0] = "VALORE_MAX";
	$table_columns[4][1] = "VALORE MASSIMO";
	$table_columns[5][0] = "UNITA_MISURA";
	$table_columns[5][1] = "UNITA' DI MISURA";
	$token = $_GET["token"];
	$queryRisultati = "SELECT * FROM view_risultati_lab WHERE id_referto='$token' order by progr_esame";
	writeTmpFiles($queryRisultati, $idfile . "-getPrelievi query-" . $idfile);
	$risultati = query_select3($queryRisultati, $connessione);
	$dati_strutturati_response = htmlResponse($risultati, $table_columns);
}
catch(Exception $ex) {
	// Durante l'inserimento nel database del registry ho avuto un errore
	// faccio il rollback e mando indietro il messaggio con l'errore ricevuto dal db
	$errorcode = array();
	$error_message = array();
	$errorcode[] = "XDSRegistryError";
	$error_message[] = str_replace("\"", "'", $ex->getMessage());
	$database_error_response = makeSoapedFailureResponse($error_message, $errorcode);
	writeTimeFile($_SESSION['idfile'] . "-Registry: database_error_response-");
	$file_input = $_SESSION['idfile'] . "-database_error_response-" . $_SESSION['idfile'];
	writeTmpFiles($database_error_response, $file_input);
	oci_rollback($connessione); // Non sarebbe necessario perchè chiudendo una connessione una transazione, se non committata, viene "annullata" (rollback)
	disconnectDB($connessione); // Chiudo la connessione al db
	SendMessage($database_error_response, $http);
	exit;
}
oci_commit($connessione); // Tutto è andato bene committo la transazione sul db
disconnectDB($connessione); // Chiudo la connessione al db
SendHTMLMessage($dati_strutturati_response, $http);
unset($_SESSION['tmp_path']);
unset($_SESSION['idfile']);
unset($_SESSION['logActive']);
unset($_SESSION['log_path']);
unset($_SESSION['tmpQueryService_path']);
unset($_SESSION['www_REG_path']);
// Clean tmp folder
if ($clean_cache == "A") {
	EmptyDir($tmp_path);
}
?>