<?php

function query_exec($query)
{
	include ('./config/registry_oracle_db.php');
	// open connection to db
	$conn = oci_connect($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;
	// execute the EXEC query
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
    oci_free_statement($statement); // libero le risorse usate dallo statement
	// close connection
	oci_close($conn);
	$a = 1;
	return $a;
} //END OF query_exec($query)
// questa funzione effetua una commit implicita utilizzando ociexecute

function query_exec2($query, $conn)
{
	// execute the EXEC query
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
    oci_free_statement($statement); // libero le risorse usate dallo statement
	if ($risultato) {
		$a = 1;
		return $a;
	}
	// Se non riesce ad eseguire la query prova a riconnettersi
	else {
		include ('./config/registry_oracle_db.php');
		$conn = oci_connect($user_db, $password_db, $db);
		if (!$conn) {
			$errorcode = array();
			$error_message = array();
			$errorcode[] = "XDSRegistryError";
			$err = ocierror();
			$error_message[] = $err['message'];
			$database_error_response = makeSoapedFailureResponse($error_message, $errorcode);
			writeTimeFile($_SESSION['idfile'] . "--Registry: database_error_response");
			$file_input = $_SESSION['idfile'] . "-database_error_response-" . $_SESSION['idfile'];
			writeTmpFiles($database_error_response, $file_input);
			SendResponse($database_error_response);
			exit;
		}
		$statement = ociparse($conn, $query);
		$risultato = ociexecute($statement);
        oci_free_statement($statement); // libero le risorse usate dallo statement
		if ($risultato) {
			$a = 1;
			return $a;
		}
		// Se non riesce nemmeno adesso ritorna un errore
		else {
			$errorcode = array();
			$error_message = array();
			$errorcode[] = "XDSRegistryError";
			//          $err=ocierror();
			$err = ocierror($statement); // Roberto
			$error_message[] = $err['message'];
			$database_error_response = makeSoapedFailureResponse($error_message, $errorcode);
			writeTimeFile($_SESSION['idfile'] . "--Registry: database_error_response");
			$file_input = $_SESSION['idfile'] . "-database_error_response-" . $_SESSION['idfile'];
			writeTmpFiles($database_error_response, $file_input);
			SendResponse($database_error_response);
			exit;
		}
	}
} //END OF query_exec2($query,$conn)

// Roberto
// questa funzione NON effetua una commit implicita utilizzando ociexecute
function query_exec3($query, $conn)
{
	$statement = oci_parse($conn, $query);
	$risultato = oci_execute($statement, OCI_DEFAULT);
    oci_free_statement($statement); // libero le risorse usate dallo statement
	if ($risultato) {
		return 1;
	} else {
		$err = ocierror($statement);
		throw (new Exception($err['message'] . " - " . $query));
	}
} //END OF query_exec3($query,$conn)

// questa funzione NON effetua una commit implicita utilizzando ociexecute
function query_select3($query, $conn)
{
	$rec = array();
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement, OCI_DEFAULT);
	if ($risultato) {
		while (OCIFetchInto($statement, $row, OCI_NUM + OCI_ASSOC)) {
			$rec[] = $row;
		}
        oci_free_statement($statement); // libero le risorse usate dallo statement
		return $rec;
	} else {
		$err = ocierror($statement);
		throw (new Exception($err['message']));
	}
}

// questa funzione NON effetua una commit implicita utilizzando ociexecute
// nella prima riga ritorna il nome delle colonne
function query_select4($query, $conn)
{
	$rows = array();
	$cols = array();
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement, OCI_DEFAULT);
	$ncols = oci_num_fields($statement);
	for ($i = 1; $i <= $ncols; $i++) {
		$cols[] = oci_field_name($statement, $i);
	}
	$rows[] = $cols;
	if ($risultato) {
		while ($row = oci_fetch_array($statement, OCI_BOTH)) {
			$rows[] = $row;
		}
        oci_free_statement($statement); // libero le risorse usate dallo statement
		return $rows;
	} else {
		$err = ocierror($statement);
		throw (new Exception($err['message']));
	}
}

function query_select5($query, $values, $conn)
{
    $rec = array();
    $pstm = oci_parse($conn, $query);
    foreach ($values as $name => $value) {
        oci_bind_by_name($pstm, $name, $value); //uso le bind variable
        unset($value);
    }
    $res = oci_execute($pstm, OCI_DEFAULT);
    if ($res) {
        while (OCIFetchInto($pstm, $row, OCI_NUM + OCI_ASSOC)) {
            $rec[] = $row;
        }
        oci_free_statement($pstm); // libero le risorse usate dallo statement
        return $rec;
    } else {
        $err = ocierror($statement);
        throw (new Exception($err['message']));
    }
}
// Roberto

function query_select($query)
{
	$rec = array();
	include ('./config/registry_oracle_db.php');

	$conn = OCILogOn($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;

	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);

	while (OCIFetchInto($statement, $row, OCI_NUM + OCI_ASSOC)) {
		$rec[] = $row;
	}
    oci_free_statement($statement); // libero le risorse usate dallo statement
	return $rec;
//	oci_close($conn);
}

// questa funzione effetua una commit implicita utilizzando ociexecute
function query_select2($query, $conn)
{
	$rec = array();
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
	if ($risultato) {
		while (OCIFetchInto($statement, $row, OCI_NUM + OCI_ASSOC)) {
			$rec[] = $row;
		}
        oci_free_statement($statement); // libero le risorse usate dallo statement
		return $rec;
	}
	// Se non riesce ad eseguire la query prova a riconnettersi
	else {
		include ('./config/registry_oracle_db.php');
		$conn = oci_connect($user_db, $password_db, $db);
		if (!$conn) {
			$errorcode = array();
			$error_message = array();
			$errorcode[] = "XDSRegistryError";
			$err = ocierror();
			$error_message[] = $err['message'];
			$database_error_response = makeSoapedFailureResponse($error_message, $errorcode);
			writeTimeFile($_SESSION['idfile'] . "--Registry: database_error_response");
			$file_input = $_SESSION['idfile'] . "-database_error_response-" . $_SESSION['idfile'];
			writeTmpFiles($database_error_response, $file_input);
			SendResponse($database_error_response);
			exit;
		}
		$statement = ociparse($conn, $query);
		$risultato = ociexecute($statement);
		if ($risultato) {
			while (OCIFetchInto($statement, $row, OCI_NUM + OCI_ASSOC)) {
				$rec[] = $row;
			}
            oci_free_statement($statement); // libero le risorse usate dallo statement
			return $rec;
		}
		// Se non riesce nemmeno adesso ritorna un errore
		else {
			$errorcode = array();
			$error_message = array();
			$errorcode[] = "XDSRegistryError";
			$err = ocierror($statement); // Roberto
			$error_message[] = $err['message'];
			$database_error_response = makeSoapedFailureResponse($error_message, $errorcode);
			writeTimeFile($_SESSION['idfile'] . "--Registry: database_error_response");
			$file_input = $_SESSION['idfile'] . "-database_error_response-" . $_SESSION['idfile'];
			writeTmpFiles($database_error_response, $file_input);
			SendResponse($database_error_response);
			exit;
		}
	}
}

function query($query)
{
	$rec = array();
	include ('./config/registry_oracle_db.php');
	// open connection to db
	$conn = oci_connect($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;
	// execute the EXEC query
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
	while (OCIFetchInto($statement, $row)) {
		$rec[] = $row;
	}
    oci_free_statement($statement); // libero le risorse usate dallo statement
	return $rec;
	// close connection
//	oci_close($conn);
}

function connectDB()
{
	include ('./config/registry_oracle_db.php');

    if (!function_exists('oci_pconnect'))
        return false;
    $toReturn = oci_pconnect($user_db, $password_db, $db);
    if ($testRes = @oci_parse($toReturn, 'SELECT 1 FROM DUAL'))
        if (@oci_execute($testRes))
          if (@oci_fetch_array($testRes))
            return $toReturn;
    oci_close($toReturn);

    if (!function_exists('oci_connect'))
        return false;
    $toReturn = oci_connect($user_db, $password_db, $db);
    if ($testRes = @oci_parse($toReturn, 'SELECT 1 FROM DUAL'))
        if (@oci_execute($testRes))
          if (@oci_fetch_array($testRes))
            return $toReturn;
    oci_close($toReturn);

    if (!function_exists('oci_new_connect'))
        return false;
    $toReturn = oci_new_connect($user_db, $password_db, $db);
    if ($testRes = @oci_parse($toReturn, 'SELECT 1 FROM DUAL'))
        if (@oci_execute($testRes))
          if (@oci_fetch_array($testRes))
            return $toReturn;
    oci_close($toReturn);

    return false; 
}

function disconnectDB($conn)
{
	oci_close($conn);
}
?>
