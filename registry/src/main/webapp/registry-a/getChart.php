<?php
ob_start();
//#### CONFIGURAZIONE DEL REGISTRY
require_once ("REGISTRY_CONFIGURATION/REG_configuration.php");
require_once ("htmlFunctions.php");
require_once ("libchart/classes/libchart.php");
$idfile = idrandom_file();
$script = $_SERVER['PHP_SELF'];
$www_REG_path = str_replace('getChart.php', '', $script);
$_SESSION['tmp_path'] = $tmp_path;
$_SESSION['tmpQueryService_path'] = $tmpQueryService_path;
$_SESSION['idfile'] = $idfile;
$_SESSION['logActive'] = $logActive;
$_SESSION['log_path'] = $log_path;
$_SESSION['www_REG_path'] = $www_REG_path;

writeTimeFile($idfile . "-Registry: generazione grafico, getChart-");
//RECUPERO GLI HEADERS RICEVUTI DA APACHE
$headers = apache_request_headers();
writeTmpFiles($headers, $idfile . "-headers_received-" . $idfile);
//$connessione è già valorizzata. La connessione è aperta nel file 'REGISTRY_CONFIGURATION/REG_configuration.php'
try {
	$codice_esame = $_GET["codice_esame"];
	$codice_paziente = $_GET["codice_paziente"];
	$queryRisultati = "SELECT data_prelievo,risultato,valore_min,valore_max FROM view_risultati_lab WHERE codice_esame='$codice_esame' and id_paziente='$codice_paziente' order by data_prelievo asc";
	writeTmpFiles($queryRisultati, $idfile . "-getChart query-" . $idfile);
	$risultati = query_select3($queryRisultati, $connessione);
	$queryRisultati2 = "SELECT descr_esame FROM view_risultati_lab WHERE codice_esame='$codice_esame' and rownum <= 1";
	$risultati2 = query_select3($queryRisultati2, $connessione);
	$title = $risultati2[0][0];
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
	disconnectDB($connessione); // Chiudo la connessione al db
	SendMessage($database_error_response, $http);
	exit;
}
disconnectDB($connessione); // Chiudo la connessione al db
SendChart($risultati, $title, $http);
unset($_SESSION['tmp_path']);
unset($_SESSION['idfile']);
unset($_SESSION['logActive']);
unset($_SESSION['log_path']);
unset($_SESSION['tmpQueryService_path']);
unset($_SESSION['www_REG_path']);
// Clean tmp folder
EmptyDir($tmp_path);
?>