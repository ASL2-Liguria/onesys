<?php
//### IF YOU WANT TO MAKE an INSERT or an UPDATE

function query_execute($query)
{
	// IMPORT MYSQL PARAMETERS (NOTE: IT WORKS WITH ABSOLUTE PATH ONLY !!)
	include ('./config/repository_oracle_db.php');
	$conn = oci_connect($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;
	// execute the EXEC query
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
    oci_free_statement($statement); // libero le risorse usate dallo statement
	// close connection
	oci_close($conn);
	$a = 1;
	return $a;
} //END OF query_execute($query)

function query_execute2($query, $conn)
{
	// execute the EXEC query
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
    oci_free_statement($statement); // libero le risorse usate dallo statement
	if ($risultato) {
		$a = 1;
		return $a;
	} // Se non riesce ad eseguire la query prova a riconnettersi
	else {
		include ('./config/repository_oracle_db.php');
		$conn = oci_connect($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;
		$statement = ociparse($conn, $query);
		$risultato = ociexecute($statement);
        oci_free_statement($statement); // libero le risorse usate dallo statement
		if ($risultato) {
			$a = 1;
			return $a;
		}
		// Se non riesce nemmeno adesso ritorna un errore
		else {
			return "FALSE";
		}
	}
} //END OF query_exec2($query)

function query_execute3($query, $values, $conn)
{
    $pstm = oci_parse($conn, $query);
    foreach ($values as $name => $value) {
       oci_bind_by_name($pstm, $name, $value); // uso le bind variable
       unset($value); // se non viene fatto l'unset della variabile "valore" oracle risponde con un errore
    }
    $res = oci_execute($pstm);
    oci_free_statement($pstm); // libero le risorse usate dallo statement

    return $res;
}

function query_select($query)
{
	include ('./config/repository_oracle_db.php');
	// open connection to db
	$conn = oci_connect($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;
	// execute the EXEC query
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
	// open  db
	while (OCIFetchInto($statement, $row)) {
		$rec[] = $row;
	}
    oci_free_statement($statement); // libero le risorse usate dallo statement
	return $rec;
	// close connection
	//oci_close($conn);
}

function query_select2($query, $conn)
{
	$statement = ociparse($conn, $query);
	$risultato = ociexecute($statement);
	if ($risultato) {
		while (OCIFetchInto($statement, $row, OCI_NUM + OCI_ASSOC)) {
			$rec[] = $row;
		}
        oci_free_statement($statement); // libero le risorse usate dallo statement
		return $rec;
	} // Se non riesce ad eseguire la query prova a riconnettersi
	else {
		include ('./config/repository_oracle_db.php');
		$conn = oci_connect($user_db, $password_db, $db) or die("Could not connect to Oracle database!") or die(ocierror());;
		$statement = ociparse($conn, $query);
		$risultato = ociexecute($statement);
		if ($risultato) {
			while (OCIFetchInto($statement, $row, OCI_NUM + OCI_ASSOC)) {
				$rec[] = $row;
			}
            oci_free_statement($statement); // libero le risorse usate dallo statement
			return $rec;
		} // Se non riesce nemmeno adesso ritorna un errore
		else {
			return "FALSE";
		}
	}
}

function query_select3($query, $values, $conn)
{
    $pstm = oci_parse($conn, $query);
    foreach ($values as $name => $value) {
        oci_bind_by_name($pstm, $name, $value); // uso le bind variable
        unset($value);
    }
    $res = oci_execute($pstm);
    $rec = array();
    if ($res) {
        while (OCIFetchInto($pstm, $row, OCI_NUM + OCI_ASSOC)) {
            $rec[] = $row;
        }
    }
    oci_free_statement($pstm); // libero le risorse usate dallo statement

    return $rec;
}

function connectDB()
{
	include ('./config/repository_oracle_db.php');

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
