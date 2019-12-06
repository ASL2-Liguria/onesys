<?php
ob_start();
//#### CONFIGURAZIONE DEL REGISTRY
require_once ("REGISTRY_CONFIGURATION/REG_configuration.php");
//######################################
if ($statActive == "A") {
    $starttime = microtime(true); //Parte per calcolare i tempi di esecuzione
}
$idfile = idrandom_file();
writeLogInfo($idfile . "-Registry: START INSERT DOCUMENT");

$script = $_SERVER['PHP_SELF'];
$www_REG_path = str_replace('registry.php', '', $script);
$_SESSION['tmp_path'] = $tmp_path;
$_SESSION['tmpQueryService_path'] = $tmpQueryService_path;
$_SESSION['idfile'] = $idfile;
$_SESSION['logActive'] = $logActive;
$_SESSION['log_path'] = $log_path;
$_SESSION['www_REG_path'] = $www_REG_path;
//RECUPERO GLI HEADERS RICEVUTI DA APACHE
$headers = apache_request_headers();
//COPIO IN LOCALE TUTTI GLI HEADERS RICEVUTI
writeTmpFiles($idfile . "-headers_received-", "");
writeTmpFiles($HTTP_RAW_POST_DATA, $idfile . "-messaggio_ricevuto-");
//### NEL CASO SIA PRESENTE IL BOUNDARY
if (stripos($headers["Content-Type"], "boundary")) {
    //## GESTISCO IL CASO DI ATTACHMENT
    writeTimeFile($idfile . "-Registry: Analizzo caso in cui ci sia il boundary");
    $boundary = giveboundary($headers);
    //PASSO A DECODARE IL FILE CREATO
    $input = $HTTP_RAW_POST_DATA;
    if (preg_match('([^\t\n\r\f\v";][:]*+ENVELOPE)', strtoupper($input))) {
        writeTimeFile($idfile . "-Registry: Ho trovato SOAPENV:ENVELOPE");
        preg_match('(<([^\t\n\r\f\v";<]+:)?(ENVELOPE))', strtoupper($input), $matches);
        $presoap = $matches[1];
        writeTimeFile($idfile . "-Registry: Ho trovato $presoap");
        $body = substr($input, strpos(strtoupper($input), "<" . $presoap . "ENVELOPE"));
        $ebxml_imbustato_soap_STRING = rtrim(rtrim(substr($body, 0, strpos($body, $boundary)), "\n"), "\r");
        writeTmpFiles($ebxml_imbustato_soap_STRING, $idfile . "-ebxml_imbustato_soap-");
    }
} else {
    $ebxml_imbustato_soap_STRING = $HTTP_RAW_POST_DATA;
    writeTmpFiles($ebxml_imbustato_soap_STRING, $idfile . "-ebxml_imbustato_soap-");
}
//# OGGETTO DOM SUL SOAP RICEVUTO: QUI HO IL SOAP CORRETTO!
$dom_ebxml_imbustato_soap = domxml_open_mem($ebxml_imbustato_soap_STRING);
//#### GESTISCO IL CASO DI DEL PAYLOAD VUOTO
$errorcode = array();
require_once ('reg_validation.php');
$isPayloadNotEmpty = controllaPayload($ebxml_imbustato_soap_STRING);
if ($isPayloadNotEmpty) {
    writeTimeFile($idfile . "-Registry: Ho validato il payload");
}
//## SE SONO QUA SIGNIFICA CHE IL PAYLOAD RICEVUTO NON E' VUOTO
//## ====>>>> POSSO RECUPERARE L'ebXML
writeTimeFile($idfile . "-Registry: Inizio ad analizzare il documento");
$root_SOAP_ebXML = $dom_ebxml_imbustato_soap->document_element();
$dom_SOAP_ebXML_node_array = $root_SOAP_ebXML->get_elements_by_tagname("SubmitObjectsRequest");
$dom_SOAP_ebXML_node_array_count = count($dom_SOAP_ebXML_node_array);
for ($i = 0;$i < $dom_SOAP_ebXML_node_array_count;$i++) {
    $node = $dom_SOAP_ebXML_node_array[$i];
    $ebxml_STRING = $dom_ebxml_imbustato_soap->dump_node($node);
}
//SCRIVO L'ebXML SBUSTATO
if ($clean_cache != "O") {
    writeTmpFiles($ebxml_STRING, $idfile . "-ebxml-");
}
//SCRIVO L'ebXML DA VALIDARE (urn:uuid: ---> urn-uuid-)
$ebxml_STRING_VALIDATION = adjustURN_UUIDs($ebxml_STRING);
if ($clean_cache != "O") {
    writeTmpFiles($ebxml_STRING_VALIDATION, $idfile . "-ebxml_for_validation-");
}
$schema = 'schemas/rs.xsd';
$isValid = isValid($ebxml_STRING_VALIDATION, $schema);
if ($isValid) {
    writeTimeFile($idfile . "-Registry: Il metadata è valido");
}
//#################################################################
//## QUI SONO SICURO CHE IL METADATA E' VALIDO RISPETTO ALLO SCHEMA
//#################################
//## OTTENGO L'OGGETTO DOM DALL'ebXML
$dom_ebXML = domxml_open_mem($ebxml_STRING);
// Roberto
//###################################################################
//#### ATTENZIONE!!! CONTA L'ORDINE DI CHIAMATA ALLE FUNZIONI!!!!
//#### !!!!! NON CAMBIARE L'ORDINE !!!!!!  ######
//############ CHECK OF ExtrinsicObject mimeType
// se $ExtrinsicObject_mimeType_array[0] è vero da  errore
$ExtrinsicObject_mimeType_array = validate_ExtrinsicObject_mimeType($dom_ebXML, $connessione);
if (!$ExtrinsicObject_mimeType_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato mimetype");
}
//############ CHECK OF XDSDocumentEntry.patientId
if ($control_PatientID == "A") {
    $DocumentEntryPatientId_valid_array = validate_XDSDocumentEntryPatientIdError($dom_ebXML, $connessione);
} else {
    $DocumentEntryPatientId_valid_array = validate_XDSDocumentEntryPatientIdInsert($dom_ebXML, $connessione);
}
// se $DocumentEntryPatientId_valid_array[0] è vero da  errore
if (!$DocumentEntryPatientId_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSDocumentEntryPatientId");
}
//############ SUPPORT DOCUMENT REPLACEMENT
$Replacement_valid_array = validate_Replacement($dom_ebXML, $DocumentEntryPatientId_valid_array[2], $connessione);
// se $DocumentEntryPatientId_valid_array[0] è falso da  errore
if ($Replacement_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSDocumentEntryPatientId Replacement");
}
//############ SUPPORT DOCUMENT APPEND
$Append_valid_array = validate_Append($dom_ebXML, $DocumentEntryPatientId_valid_array[2], $connessione);
// se $Append_valid_array[0] è falso da  errore
if ($Append_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSDocumentEntryPatientId Append");
}
//############ CHECK OF XDSDocumentEntry.uniqueId
$DocumentEntryUniqueId_valid_array = validate_XDSDocumentEntryUniqueId($dom_ebXML, $connessione);
// se $DocumentEntryUniqueId_valid_array[0] è falso da  errore
if ($DocumentEntryUniqueId_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSDocumentEntry.uniqueId");
}
//$SubmissionSetPatientId_valid_array = validate_XDSSubmissionSetPatientId($dom_ebXML,$idfile);
//############ CHECK OF XDSSubmissionSet.patientId
if ($control_PatientID == "A") {
    $SubmissionSetPatientId_valid_array = validate_XDSSubmissionSetPatientIdError($dom_ebXML, $connessione);
} else {
    $SubmissionSetPatientId_valid_array = validate_XDSSubmissionSetPatientIdInsert($dom_ebXML, $connessione);
}
// se $SubmissionSetPatientId_valid_array[0] è vero da  errore
if (!$SubmissionSetPatientId_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSSubmissionSetPatientId");
}
//########### CHECK OF XDSSubmissionSet.uniqueID
// se $SubmissionSetUniqueId_valid_array[0] è falso da errore
$SubmissionSetUniqueId_valid_array = validate_XDSSubmissionSetUniqueId($dom_ebXML, $connessione);
if ($SubmissionSetUniqueId_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSSubmissionSetUniqueId");
}
//########### CHECK OF XDSFolder.uniqueID
// se $FolderUniqueId_valid_array[0] è falso da  errore
if ($controlFolderUniqueId == "A") {
    $FolderUniqueId_valid_array = validate_XDSFolderUniqueId($dom_ebXML, $connessione);
    if ($FolderUniqueId_valid_array[0]) {
        writeTimeFile($idfile . "-Registry: Ho validato XDSFolderUniqueId");
    }
} else {
    $FolderUniqueId_valid_array = validate_XDSFolderUniqueIdInsert($dom_ebXML, $connessione);
    if ($FolderUniqueId_valid_array[0]) {
        writeTimeFile($idfile . "-Registry: Ho validato XDSFolderUniqueIdInsert");
    }
}
//########## CHECK OF HASH + SIZE + URI
// se $hsu[0] è falso da errore
$hsu = arePresent_HASH_SIZE_URI($dom_ebXML);
if ($hsu[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato HASH_SIZE_URI");
}
//### RECUPERO TUTTE LE INFORMAZIONI DELLA VALIDAZIONE
$XDSSubmissionSetPatientId = $SubmissionSetPatientId_valid_array[2];
$XDSDocumentEntryPatientId_arr = $DocumentEntryPatientId_valid_array[2];
$ExtrinsicObject_node_id_attr_array = $DocumentEntryPatientId_valid_array[3];
//########### CHECK OF XDSFolder.patientID
// se $FolderPatientId_valid_array[0] è falso da errore
$FolderPatientId_valid_array = validate_XDSFolderPatientId($dom_ebXML, $XDSDocumentEntryPatientId_arr, $XDSSubmissionSetPatientId, $DocumentEntryPatientId_valid_array[3], $connessione);
if ($FolderPatientId_valid_array[0]) {
    writeTimeFile($idfile . "-Registry: Ho validato XDSFolder.patientID");
}
//### CONFRONTO XDSDocumentEntry.patientId vs XDSSubmissionSet.patientId
// se $conf_PatientIds_arr[0] è vero da  errore
$conf_PatientIds_arr = array();
if (!(empty($XDSDocumentEntryPatientId_arr) && empty($ExtrinsicObject_node_id_attr_array))) {
    $conf_PatientIds_arr = confrontaPatientIds($XDSSubmissionSetPatientId, $XDSDocumentEntryPatientId_arr, $ExtrinsicObject_node_id_attr_array);
} //END OF IF
if (!$conf_PatientIds_arr[0]) {
    writeTimeFile($idfile . "-Registry: confronto XDSDocumentEntry.patientId vs XDSSubmissionSet.patientId OK");
}
//# CONFRONTO XDSDocumentEntry.patientId vs XDSFolder.patientId CASO ADD DOCUMENT
// se $isAddAllowed_array[0] è falso da  errore
$isAddAllowed_array = verifyAddDocToFolder($dom_ebXML, $XDSDocumentEntryPatientId_arr, $connessione);

$error_code_array = array_merge($ExtrinsicObject_mimeType_array[2], $DocumentEntryPatientId_valid_array[4], $DocumentEntryUniqueId_valid_array[4], $Replacement_valid_array[2], $Append_valid_array[2], $SubmissionSetPatientId_valid_array[3], $SubmissionSetUniqueId_valid_array[2], $FolderUniqueId_valid_array[3], $hsu[2], $FolderPatientId_valid_array[2], $conf_PatientIds_arr[2], $isAddAllowed_array[2]);
$failure_response_array = array_merge($ExtrinsicObject_mimeType_array[1], $DocumentEntryPatientId_valid_array[1], $DocumentEntryUniqueId_valid_array[1], $Replacement_valid_array[1], $Append_valid_array[1], $SubmissionSetPatientId_valid_array[1], $SubmissionSetUniqueId_valid_array[1], $FolderUniqueId_valid_array[1], $hsu[1], $FolderPatientId_valid_array[1], $conf_PatientIds_arr[1], $isAddAllowed_array[1]);
//##### CASO DI VALIDAZIONE ===NON=== PASSATA
if ($ExtrinsicObject_mimeType_array[0] || $DocumentEntryPatientId_valid_array[0] || !$Replacement_valid_array[0] || !$Append_valid_array[0] || !$DocumentEntryUniqueId_valid_array[0] || $SubmissionSetPatientId_valid_array[0] || !$SubmissionSetUniqueId_valid_array[0] || !$FolderUniqueId_valid_array[0] || !$hsu[0] || !$FolderPatientId_valid_array[0] || $conf_PatientIds_arr[0] || !$isAddAllowed_array[0]) {
    //## COMPONGO IL CORE DEL MESSAGGIO DI FAIL
    writeLogError($_SESSION['idfile'] . "-Registry: ERROR");
    writeLogError($idfile . "-Registry: NON HO SUPERATO I VINCOLI DI VALIDAZIONE");
    writeLogError($failure_response_array);
    writeLogError($idfile . "-Registry: NON HO SUPERATO I VINCOLI DI VALIDAZIONE");
    //## RESTITUISCE IL MESSAGGIO DI FAIL IN SOAP
    $SOAPED_failure_response = makeSoapedFailureResponse($failure_response_array, $error_code_array);
    //## SCRIVO LA RISPOSTA IN UN FILE
    $file_input = $idfile . "-SOAPED_failure_response-" . $idfile;
    writeLogError($SOAPED_failure_response, $file_input);
    SendResponse($SOAPED_failure_response);
    exit;
} //####### END OF VALIDAZIONE ===NON=== PASSATA
//### SE SONO QUI HO SUPERATO TUTTI I VINCOLI DI VALIDAZIONE
writeLogInfo($idfile . "-Registry: HO SUPERATO I VINCOLI DI VALIDAZIONE");
//#####################################################
//##### POSSO RIEMPIRE IL DATABASE DEL REGISTRY #######
//Roberto
writeTimeFile($idfile . "-Registry: Start fill Database");
try {
    //Sono state aggiunte le funzioni exec_query3, exec_select3 per permmettere il rollback in caso di errore nell'inserimento sul db
    //Nei file seguenti la funzione exec_query2 è stata sostituita con exec_query3, la funzione exec_select2 con exec_select3
    //## 1 - ExtrinsicObject
    require_once ('ExtrinsicObject_2.php');
    $RETURN_from_ExtrinsicObject_id_array = fill_ExtrinsicObject_tables($dom_ebXML, $connessione);
    //### ARRAY DEGLI EXTRINSICOBJECTS ID
    $ExtrinsicObject_id_array = $RETURN_from_ExtrinsicObject_id_array[0];
    $simbolic_ExtrinsicObject_id_array = $RETURN_from_ExtrinsicObject_id_array[3];
    //### LANGUAGE CODE
    $language = $RETURN_from_ExtrinsicObject_id_array[1];
    writeTimeFile($idfile . "-Registry: Inserito nel Database ExtrinsicObject");
    //## 2 - RegistryPackage
    require_once ('RegistryPackage_2.php');
    $RegistryPackage_id_array2 = fill_RegistryPackage_tables($dom_ebXML, $language, $connessione);
    $RegistryPackage_id_array = $RegistryPackage_id_array2[0];
    $simbolic_RegistryPackage_id_array = $RegistryPackage_id_array2[2];
    $simbolic_RegistryPackage_FOL_id_array = $RegistryPackage_id_array2[3];
    writeTimeFile($idfile . "-Registry: Inserito nel Database RegistryPackage");
    //## 3 - Classification
    require_once ('Classification_2.php');
    fill_Classification_tables($dom_ebXML, $RegistryPackage_id_array, $simbolic_RegistryPackage_FOL_id_array, $connessione);
    writeTimeFile($idfile . "-Registry: Inserito nel Database Classification");
    //## 4 - Association
    require_once ('Association_2.php');
    fill_Association_tables($dom_ebXML, $RegistryPackage_id_array, $ExtrinsicObject_id_array, $simbolic_RegistryPackage_FOL_id_array, $connessione);
    writeTimeFile($idfile . "-Registry: Inserito nel Database Association");
    //###### Se arrivo a questo punto cambio lo stato del documento da NotCompleted ad Approved
    //Aggiorno lo stato di ExtrinsicObject
    $ExtrinsicObject_id_array_count = count($ExtrinsicObject_id_array);
    for ($e = 0;$e < $ExtrinsicObject_id_array_count;$e++) {
        $simbolic_ExtrinsicObject_id = $simbolic_ExtrinsicObject_id_array[$e];
        $UPDATE_ExtrinsicObject = "UPDATE ExtrinsicObject SET status='Approved' where id='" . $ExtrinsicObject_id_array[$simbolic_ExtrinsicObject_id] . "' AND status = 'NotCompleted'";
        $ris = query_exec3($UPDATE_ExtrinsicObject, $connessione);
        writeSQLQuery($ris . ": " . $UPDATE_ExtrinsicObject);
    }
    //Aggiorno lo stato di RegistryPackage
    $RegistryPackage_id_array_count = count($RegistryPackage_id_array);
    for ($s = 0;$s < $RegistryPackage_id_array_count;$s++) {
        $simbolic_RegistryPackage_id = $simbolic_RegistryPackage_id_array[$s];
        if ($simbolic_RegistryPackage_id != '') {
            $UPDATE_RegistryPackage = "UPDATE RegistryPackage SET status='Approved' where id='" . $RegistryPackage_id_array[$simbolic_RegistryPackage_id] . "' AND status = 'NotCompleted'";
            $ris = query_exec3($UPDATE_RegistryPackage, $connessione);
            writeSQLQuery($ris . ": " . $UPDATE_RegistryPackage);
        }
    }

    //Chiama una stored procedure dopo avere inserito i nuovi documenti passando EXTRINSICOBJECT.ID come parametro
    $ExtrinsicObject_id_array_count = count($ExtrinsicObject_id_array);
    for ($e = 0;$e < $ExtrinsicObject_id_array_count;$e++) {
        try {
            $simbolic_ExtrinsicObject_id = $simbolic_ExtrinsicObject_id_array[$e];
            $SPNEWDOCUMENT_ExtrinsicObject = "begin sp_newdocument('" . $ExtrinsicObject_id_array[$simbolic_ExtrinsicObject_id] . "'); end;";
            $ris = query_exec3($SPNEWDOCUMENT_ExtrinsicObject, $connessione);
            writeSQLQuery($ris . ": " . $SPNEWDOCUMENT_ExtrinsicObject);
        } catch(Exception $ex) {
            writeLogError($_SESSION['idfile'] . "-Error calling stored procedure: " . $ex->getMessage());
        }
    }

    $committed = oci_commit($connessione); // Tutto è andato bene committo la transazione sul db
    if (!$committed) {
        $error = oci_error($connessione);
        throw (new Exception('Commit failed. Oracle reports: ' . $error['message']));
    }
}
catch(Exception $ex) {
    // Durante l'inserimento nel database del registry ho avuto un errore
    // faccio il rollback e mando indietro il messaggio con l'errore ricevuto dal db
    writeLogError($_SESSION['idfile'] . "-Registry: ERROR");
    $errorcode = array();
    $error_message = array();
    $errorcode[] = "XDSRegistryError";
    $error_message[] = str_replace("\"", "'", $ex->getMessage());
    $database_error_response = makeSoapedFailureResponse_2($error_message, $errorcode);
    writeLogError($_SESSION['idfile'] . "-Registry: database_error_response");
    writeLogError($database_error_response);
    oci_rollback($connessione); // Non sarebbe necessario perchè chiudendo una connessione una transazione, se non committata, viene "annullata" (rollback)
    disconnectDB($connessione); // Chiudo la connessione al db
    writeLogError($_SESSION['idfile'] . "-Send error response");
    SendMessage($database_error_response, $http);
    writeLogError($_SESSION['idfile'] . "-Sent errore response");
    exit;
}
writeTimeFile($idfile . "Database filled");
// Roberto
//###### FINE RIEMPIMENTO DATABASE DEL REGISTRY ########
//######################################################
//==================================================//
//============ REGISTRY RESPONSE  ==============//
//###### RISPOSTA POSITIVA
$registry_response = makeSoapedSuccessResponse();
writeTimeFile($idfile . "-Send positive response to client");
writeTmpFiles($registry_response, "", true);
SendMessage($registry_response, $http);
writeTimeFile($idfile . "-Sent positive response to client");
// NAV
if ($NAV == "A") {
    $bound_mail = "--" . md5(time());
    $eol = "\r\n";
    $headers_mail = "From: " . $NAV_from . $eol;
    $headers_mail.= "Message-ID: <" . time() . "@" . $_SERVER['SERVER_NAME'] . ">" . $eol;
    $headers_mail.= "MIME-Version: 1.0" . $eol;
    $headers_mail.= "Content-Type: multipart/mixed; boundary=" . $bound_mail . $eol;
    $msg_mail = "--" . $bound_mail . $eol;
    $msg_mail.= "Content-Type: text/plain; charset=us-ascii" . $eol;
    $msg_mail.= "Instructions to the user as to the use of this e-mail message." . $eol;
    $msg_mail.= "--" . $bound_mail . $eol;
    $msg_mail.= "Content-Type: application/xml; charset=UTF-8" . $eol;
    $msg_mail.= "Content-Disposition: attachment; filename=\"IHEXDSNAV-" . idrandom() . ".xml\"" . $eol;
    $msg_mail.= "<Signature Id=\"signatureID\" xmlns=\"http://www.w3.org/2000/09/xmldsig#\">
        <SignedInfo>
        <CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments\"/>
        <SignatureMethod Algorithm=\"urn:ihe:iti:dsg:nosig\"/>
        <Reference URI=\"#IHEManifest\" Type=\"http://www.w3.org/2000/09/xmldsig#Manifest\">
        <DigestMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#sha1\"/>
        <DigestValue>00</DigestValue>
        </Reference>
        </SignedInfo>
        <SignatureValue>base64SignatureValue</SignatureValue>
        <Object>
        <SignatureProperties>
        <SignatureProperty Id=\"recommendedRegistry\"
        target=\"signatureID\">http://" . $_SERVER['SERVER_NAME'] . $www_REG_path . "storedquery.php</SignatureProperty>
        <SignatureProperty Id=\"sendAcknowledgementTo\"
        target=\"signatureID\">" . $NAV_to . "</SignatureProperty>
        </SignatureProperties>
        <Manifest Id=\"IHEManifest\">";
    $DocumentEntryUniqueId_valid_array_3_count = count($DocumentEntryUniqueId_valid_array[3]);
    for ($index_doc = 0;$index_doc < $DocumentEntryUniqueId_valid_array_3_count;$index_doc++) {
        $msg_mail.= "<Reference URI=\"" . $DocumentEntryUniqueId_valid_array[3][$index_doc] . "\">
            <DigestMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#sha1\"/>
            <DigestValue>base64DigestValue</DigestValue>
            <!--this is document " . $index_doc . ", read it first-->
            </Reference>";
    }
    $msg_mail.= "
        </Manifest>
        </Object>
        </Signature>" . $eol;
    $msg_mail.= "--" . $bound_mail . "--";
    mail($NAV_to, "Notification of Document Availability", $msg_mail, $headers_mail);
    if ($clean_cache != "O") {
        writeTmpFiles($msg_mail, $idfile . "-mail-" . $idfile);
    }
    writeTimeFile($idfile . "-Registry: Ho spedito i messaggi di NAV");
}
// ATNA
if ($ATNA_active == 'A') {
    require_once ('./lib/syslog.php');
    $syslog = new Syslog();
    // ATNA IMPORT per Register Document Set
    $eventOutcomeIndicator = "0"; //EventOutcomeIndicator 0 OK 12 ERROR
    $registry_endpoint = $http_protocol . $ip_server . ":" . $port_server . $www_REG_path . "registry.php";
    $ip_repository = $_SERVER['REMOTE_ADDR'];
    $today = date("Y-m-d");
    $cur_hour = date("H:i:s");
    $datetime = $today . "T" . $cur_hour;
    $message_import = "<AuditMessage>
        <EventIdentification EventDateTime=\"$datetime\" EventActionCode=\"R\" EventOutcomeIndicator=\"0\">
        <EventID code=\"110106\" codeSystemName=\"DCM\" displayName=\"Import\"/>
        <EventTypeCode code=\"ITI-14\" codeSystemName=\"IHE Transactions\" displayName=\"Register Document Set\"/>
        </EventIdentification>
        <AuditSourceIdentification AuditSourceID=\"EL.CO. Registry\">
        <AuditSourceTypeCode code=\"4\" />
        </AuditSourceIdentification>
        <ActiveParticipant UserID=\"$ip_repository\" UserIsRequestor=\"true\">
        <RoleIDCode code=\"110153\" codeSystemName=\"DCM\" displayName=\"Source\"/>
        </ActiveParticipant>
        <ActiveParticipant UserID=\"$registry_endpoint\" UserIsRequestor=\"false\">
        <RoleIDCode code=\"110152\" codeSystemName=\"DCM\" displayName=\"Destination\"/>
        </ActiveParticipant>
        <ParticipantObjectIdentification ParticipantObjectID=\"" . htmlentities($XDSSubmissionSetPatientId) . "\" ParticipantObjectTypeCode=\"1\" ParticipantObjectTypeCodeRole=\"1\">
        <ParticipantObjectIDTypeCode code=\"2\"/>
        </ParticipantObjectIdentification>
        <ParticipantObjectIdentification ParticipantObjectID=\"" . $SubmissionSetUniqueId_valid_array[3] . "\" ParticipantObjectTypeCode=\"2\" ParticipantObjectTypeCodeRole=\"20\">
        <ParticipantObjectIDTypeCode code=\"urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd\"/>
        </ParticipantObjectIdentification>
        </AuditMessage>";
    $logSyslog = $syslog->Send($ATNA_host, $ATNA_port, $message_import);
    if ($clean_cache != "O") {
        writeTmpFiles($message_import, $idfile . "-atna_import.xml");
    }
    writeTimeFile($idfile . "-Registry: Ho spedito i messaggi di ATNA");
}
//Statistiche
if ($statActive == "A") {
    //Parte per calcolare i tempi di esecuzione
    $totaltime = number_format(microtime(true) - $starttime, 15);
    $STAT_SUBMISSION = "INSERT INTO STATS (REPOSITORY,EXECUTION_TIME,OPERATION) VALUES ('" . $_SERVER['REMOTE_ADDR'] . "','$totaltime','SUBMISSION_Total')";
    $ris = query_exec2($STAT_SUBMISSION, $connessione);
}
disconnectDB($connessione); // Chiudo la connessione al db
unset($_SESSION['tmp_path']);
unset($_SESSION['idfile']);
unset($_SESSION['logActive']);
unset($_SESSION['log_path']);
unset($_SESSION['tmpQueryService_path']);
unset($_SESSION['www_REG_path']);
ob_end_flush();
// Clean tmp folder
// Roberto
if ($clean_cache == 'A') {
    writeTimeFile($idfile . "-Registry: Rimuovo la cache temporanea");
    EmptyDir($tmp_path);
    EmptyDir($tmpQueryService_path);
}
writeLogInfo($idfile . "-Registry: END INSERT DOCUMENT");
?>
