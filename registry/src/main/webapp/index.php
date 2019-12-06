<?php
ob_start();
require_once ('registry-a/config/registry_oracle_db.php'); // recupero i dati per la connessione al db

try {
	echo $db." "; // visualizzo i dati della connessione
	echo "<br><br>\n";

	$conn = oci_pconnect($user_db, $password_db, $db); // apro la connessione al db
	if (!$conn) { // connessione non riuscita
		$err = ocierror();
		echo $err['message'];
		exit;
	}

	$query = 'select * from v$version'; // recupero alcune informazioni sul db

	$stid = oci_parse($conn, $query);
	oci_execute($stid, OCI_DEFAULT);
	while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
	  foreach ($row as $item) {
		echo $item . " ";
	  }
	  echo "<br>\n";
	}

	oci_free_statement($stid);
	oci_close($conn); // Chiudo la connessione al db
	echo "<br>\n";
}
catch(Exception $ex) {
	echo $ex." ";
}

phpinfo();
ob_end_flush();
?>
