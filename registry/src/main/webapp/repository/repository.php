<?php
    //BLOCCO IL BUFFER DI USCITA
    ob_start();

//    require_once ("lib/errors_handling.php");
//    set_error_handler('error_handler');
//    set_exception_handler('exception_handler');

    //#### CONFIGURAZIONE DEL REPOSITORY
    require_once ("config/REP_configuration.php");
    //######################################
    require_once ($lib_path . "domxml-php4-to-php5.php");
    require_once ($lib_path . "utilities.php");
    require_once ($lib_path . "log.php");
    $idfile = idrandom_file();
    //### CREO L'OGGETTO DI LOG ####
    $log = new Log("REP");
    $log->writeLogInfo($idfile . "-Repository: START INSERT DOCUMENT");

    $errorcode = array();
    $advertise = array();
    $_SESSION['tmp_path'] = $tmp_path;
    $_SESSION['idfile'] = $idfile;
    $_SESSION['logActive'] = $logActive;
    $_SESSION['log_path'] = $log_path;
    $_SESSION['www_REP_path'] = $www_REP_path;
    $_SESSION['save_files'] = $save_files;
    $log->writeLogFile("-Request received from client", 1);
    //#########################
    //RECUPERO GLI HEADERS RICEVUTI DA APACHE
    $log->writeLogFile("-Read Apache headers", 1);
    $headers = apache_request_headers();
    $log->writeLogFileS("HEADERS: ". $headers, "", "");
    $input = $HTTP_RAW_POST_DATA;
    $log->writeLogFileS("INPUT POST DATA: " . $input, "", "");
    //PASSO A DECODARE IL FILE CREATO
    // Ottengo il boundary
    $giveboundary = giveboundary($headers);
    $boundary = $giveboundary[0];
    $MTOM = $giveboundary[1];
    require_once ('rep_validation.php');
    //# TEST 11721: CONTROLLO CHE NON SIA the PAYLOAD is not metadata
    if ($boundary == '') { //boundary non dichiarato --> no payload
        $isPayloadNotEmpty = controllaPayload($input);
    }
    //COMPLETO IL BOUNDARY con due - davanti
    $boundary = "--" . $boundary;
    //BOUNDARY
    //##### CASO DI PRESENZA DI ATTACHMENTS
    if ($boundary != "--") {
        $log->writeLogFile("-Boundary found", 1);
        $log->writeLogFileS("BOUNDARY: " . $boundary, "", "");
        //### PRIMA OCCORRENZA DELL'ENVELOPE SOAP
        if (preg_match('([^\t\n\r\f\v";][:]*+ENVELOPE)', strtoupper($input))) {
            $log->writeLogFile("-Repository: Ho trovato SOAPENV:ENVELOPE", 1);
            preg_match('(<([^\t\n\r\f\v";<]+:)?(ENVELOPE))', strtoupper($input), $matches);
            $presoap = $matches[1];
            $log->writeLogFile("-Repository: Ho trovato $presoap", 1);
            $body = substr($input, strpos(strtoupper($input), "<" . $presoap . "ENVELOPE"));
        }
        // Body contiene da <SOAP-ENV fino alla fine del file
        $log->writeLogFileS("RECEIVED BODY: " . $body, "", "");
        ///////////////////////////////////////////
        //### ebXML IMBUSTATO SOAP
        // Qui prendo solo la busta SOAP No allegati
        $ebxml_imbustato_soap = rtrim(rtrim(substr($body, 0, strpos($body, $boundary)), "\n"), "\r");
        $log->writeLogFileS("RECEIVED EBXML IMBUSTATO: " . $ebxml_imbustato_soap, "", "");
        //### ebXML
        $dom_SOAP_ebXML = domxml_open_mem($ebxml_imbustato_soap);
        $root_SOAP_ebXML = $dom_SOAP_ebXML->document_element();
        $dom_SOAP_ebXML_node_array = $root_SOAP_ebXML->get_elements_by_tagname("SubmitObjectsRequest");
        $dom_SOAP_ebXML_node_array_count = count($dom_SOAP_ebXML_node_array);
        for ($i = 0;$i < $dom_SOAP_ebXML_node_array_count;$i++) {
            $node = $dom_SOAP_ebXML_node_array[$i];
            $ebxml_STRING = $dom_SOAP_ebXML->dump_node($node);
        }
        //# SCRIVO L'ebXML SBUSTATO
        $log->writeLogFileS("RECEIVED EBXML: " . $ebxml_STRING, "", "");
        //## SCRIVO L'ebXML DA VALIDARE (urn:uuid: ---> urn-uuid-)
        $ebxml_STRING_VALIDATION = adjustURN_UUIDs($ebxml_STRING);
        $log->writeLogFileS("EBXML STRING VALIDATION: " . $ebxml_STRING_VALIDATION, "", "");
        $isValid = isValid($ebxml_STRING_VALIDATION);
        if ($isValid) {
            $log->writeLogFile("-Repository: Ho superato la validazione dell'ebxml", 1);
        }
        //#################################################################
        //## QUI SONO SICURO CHE IL METADATA E' VALIDO RISPETTO ALLO SCHEMA
        //###########################################################
        //## OTTENGO L'OGGETTO DOM RELATIVO ALL'ebXML
        $dom_ebXML = domxml_open_mem($ebxml_STRING);
        //#################################################################
        //### SECONDA COSA: DEVO VALIDARE XDSSubmissionSet.sourceId
        $SourceId_valid = validate_XDSSubmissionSetSourceId($dom_ebXML, $connessione);
        if (!$SourceId_valid) {
            $log->writeLogFile("-Repository: XDSSubmissionSetSourceId valido", 1);
        }
        //### SE SONO QUI HO PASSATO IL VINCOLO DI VALIDAZIONE SU sourceId
        $conta_boundary = substr_count($body, $boundary) - 1;
        $conta_allegati = $conta_boundary;
        $allegato_array = array();
        $busta_array = explode($boundary, $input);
        $conta_da_explode = count($busta_array);
        for ($ce = 2; $ce < $conta_da_explode - 1; $ce++) {
            $allegato_array = array_merge($allegato_array, array($busta_array[$ce]));
        }
        $validAllegatiExtrinsicObject = verificaContentMimeExtrinsicObject($dom_ebXML, $allegato_array);
        if ($validAllegatiExtrinsicObject) {
            //###SE SONO QUI HO PASSATO IL VINCOLO DI VALIDAZIONE SU DocumentEntryUniqueId
            $log->writeLogFile("-Repository: Ho superato la validazione del messaggio", 1);
        }
        //### CONTROLLO CHE CI SIANO DOCUMENTI IN ALLEGATO
        $ExtrinsicObject_array = $dom_ebXML->get_elements_by_tagname("ExtrinsicObject");
        //#### SOLO NEL CASO CHE CI SIANO DOCUMENTI IN ALLEGATO
        if (!empty($ExtrinsicObject_array)) {
            //### TERZA COSA: DEVO VALIDARE XDSDocumentEntry.uniqueId
            $UniqueId_valid_array = validate_XDSDocumentEntryUniqueId($dom_ebXML, $connessione);
            if ($UniqueId_valid_array[0]) {
                $log->writeLogFile("-Repository: XDSDocumentEntryUniqueId valido $UniqueId_valid_array[0]", 1);
            } //FINE if(!$UniqueId_valid_array[0])
            // Devo verificare che siano corretti i boundary
            $conta_EO = count($ExtrinsicObject_array);
            $submission_uniqueID = getSubmissionUniqueID($dom_ebXML);
            //########### IL METADATA RICEVUTO E' VALIDO ############
            //### CICLO SU TUTTI I FILE ALLEGATI
            for ($o = 0; $o < $conta_EO; $o++) {
                //### SINGOLO NODO ExtrinsicObject
                $ExtrinsicObject_node = $ExtrinsicObject_array[$o];
                //### RICAVO ATTRIBUTO id DI ExtrinsicObject
                $ExtrinsicObject_id_attr = $ExtrinsicObject_node->get_attribute('id');
                //### RICAVO ATTRIBUTO mimeType
                $ExtrinsicObject_mimeType_attr = $ExtrinsicObject_node->get_attribute('mimeType');
                //### RICAVO LA RELATIVA ESTENSIONE PER IL FILE
                $get_extension = "SELECT EXTENSION FROM MIMETYPE WHERE CODE = '$ExtrinsicObject_mimeType_attr'";
                $res = query_select2($get_extension, $connessione);
                $file_extension = $res[0][0];
                //#### COMPONGO IL NOME DEL FILE (nomefile.estensione)
                $file_name = idrandom() . "." . $file_extension;
                //### COMPONGO IL PATH RELATIVO DOVE SALVO IL FILE
                if (!is_dir($relative_docs_path)) {
                    mkdir($relative_docs_path, 0777, true);
                }
                $document_URI = $relative_docs_path . $file_name;
                $document_URI2 = $relative_docs_path_2 . $file_name;
                //###############################################################
                //## SALVATAGGIO DELL'ALLEGATO SU FILESYSTEM
                $contentID_UP = strtoupper("Content-ID: <" . $ExtrinsicObject_id_attr . ">");
                $allegato_STRING_2 = substr($body, (strpos(strtoupper($body), $contentID_UP) + strlen($contentID_UP)), (strpos($body, $boundary, (strpos(strtoupper($body), $contentID_UP))) - strpos(strtoupper($body), $contentID_UP) - strlen($contentID_UP)));
                //## PULISCO LA STRINGA IN CAPO E IN CODA: ATTENZIONE NON MODIFICARE
                $allegato_STRING = substr($allegato_STRING_2, 4, strlen($allegato_STRING_2) - 6); //## QUI HO L'ALLEGATO
                //#################################################################
                //######## SALVO IL DOCUMENTO IN ALLEGATO SU FILESYSTEM
                $fp_allegato = fopen($document_URI, "wb");
                fwrite($fp_allegato, $allegato_STRING);
                fclose($fp_allegato);
                //#################################################################
                //### MI ASSICURO CHE URI,SIZE ED HASH NON SIANO GIA' SPECIFICATE NEL METADATA
                $mod = modifiable($ExtrinsicObject_node);
                $datetime = "CURRENT_TIMESTAMP";
//               $insert_into_DOCUMENTS = "INSERT INTO DOCUMENTS (XDSDOCUMENTENTRY_UNIQUEID,DATA,URI) VALUES ('" . $UniqueId_valid_array[1][$o] . "',$datetime,'$document_URI2')";
                $insert_into_values = array(':UniqueId_valid_array' => $UniqueId_valid_array[1][$o], ':document_URI2' => $document_URI2);
                $insert_into_DOCUMENTS = "INSERT INTO DOCUMENTS (XDSDOCUMENTENTRY_UNIQUEID, URI) VALUES (:UniqueId_valid_array, :document_URI2)";
                $log->writeLogFileS("INSERT DOCUMENT: $insert_into_DOCUMENTS", "", "");
//                $ris = query_execute2($insert_into_DOCUMENTS, $connessione);
                $ris = query_execute3($insert_into_DOCUMENTS, $insert_into_values, $connessione);

//                $selectTOKEN = "SELECT KEY_PROG FROM DOCUMENTS WHERE XDSDOCUMENTENTRY_UNIQUEID = '" . $UniqueId_valid_array[1][$o] . "'";
                $selectTOKEN_values = array(':UniqueId_valid_array' => $UniqueId_valid_array[1][$o]);
                $selectTOKEN = "SELECT KEY_PROG FROM DOCUMENTS WHERE XDSDOCUMENTENTRY_UNIQUEID = :UniqueId_valid_array";
                $log->writeLogFileS("SELECT KEY_PROG: $selectTOKEN", "", "");
//                $res_token = query_select2($selectTOKEN, $connessione);
                $res_token = query_select3($selectTOKEN, $selectTOKEN_values, $connessione);

                $next_token = $res_token[0][0];
                $document_token = $www_REP_path . "getDocument.php?token=" . $next_token;
                //##### Calcolo URI
                $vars_http = array();
                $vars_http = $HTTP_SERVER_VARS;
                if ($rep_protocol == "NORMAL") {
                    $Document_URI_token = $normal_protocol . $rep_host . ":" . $rep_port . $document_token;
                } else if ($rep_protocol == "TLS") {
                    $Document_URI_token = $tls_protocol . $rep_host . ":" . $rep_port . $document_token;
                }
                //##### Calcolo Hash
                $hash = hash("sha1", file_get_contents($document_URI));
                //##### Calcolo size
                $size = filesize($document_URI);
                require_once ("./lib/createMetadataToForward.php");
                //### MODIFICO IL METADATA PER FORWARDARLO SUCCESSIVAMENTE AL REGISTRY
                if ($mod) //## CASO HASH-SIZE-URI NON PRESENTI
                {
                    //### INSERISCO NEL DB E OTTENGO L'ebXML MODIFICATO
                    $dom_ebXML = modifyMetadata($dom_ebXML, $ExtrinsicObject_node, $Document_URI_token, $hash, $size, $namespacerim_path);
                } //END OF if($mod)
                else if (!$mod) //## CASO HASH-SIZE-URI GIA' PRESENTI
                {
                    $dom_ebXML_vuoto = deleteMetadata($dom_ebXML, $ExtrinsicObject_node);
                    //### INSERISCO NEL DB E MANTENGO L'ebXML INALTERATO
                    $dom_ebXML = modifyMetadata($dom_ebXML_vuoto, $ExtrinsicObject_node, $Document_URI_token, $hash, $size, $namespacerim_path);
                } //END OF else if(!$mod)
            } //END OF for($o = 0 ; $o < (count($ExtrinsicObject_array)) ; $o++)
        } //END OF if(!empty($ExtrinsicObject_array))
        //### MI PREPARO A SCRIVERE L'ebXML DA FORWARDARE AL REGISTRY
        $submissionToForward = $dom_ebXML->dump_mem();
        //apro e scrivo il file
        $file_written3 = $log->writeLogFileS("SUBMISSION TO FORWARD: " . $submissionToForward, "", "");
        //# elimino la stringa <?amp;xml version="1.0"?amp;>  dall'ebxmlToForward
        $ebxmlToForward_string = substr($submissionToForward, 21);
        //# ottengo il contenuto da forwardare (BUSTA CON ebXML ebxmlToForward)
        $post_data = makeSoapEnvelope($ebxmlToForward_string);
    } //END OF if($boundary != "--")
    else if ($boundary == "--") {
        $log->writeLogFile("-No boundary", 1);
        //# NO ALLEGATI PERCIO' FORWARDO DIRETTAMENTE AL REG
        //# Devo verificare che non ci siano ExtrinsicObject
        $validExtrinsicObject = verificaExtrinsicObject(domxml_open_mem($input));
        //# Se non ci sono ExtrinsicObject posso inoltrare al registry
        if ($validExtrinsicObject) {
            $post_data = $input;
        }
    } //END OF else if($boundary == "--")
    $log->writeLogFileS("DATA TO POST: " . $post_data, "","");
    //# SPEDISCO IL MESSAGGIO AL REGISTRY E RICAVO LA RESPONSE
    $log->writeLogFile("-Registry protocol $reg_http", 1);
    //### CREO IL CLIENT PER LA CONNESSIONE HTTP CON IL REGISTRY
    if ($reg_http == "NORMAL") { //default
        require_once ("./http_connections/http_client.php");
        $log->writeLogFile("-Repository: connessione HTTP", 1);
        $client = new HTTP_Client($reg_host, $reg_port, 180);
    } else if ($reg_http == "TLS") {
        require_once ("./http_connections/ssl_connect.php");
        $log->writeLogFile("-Repository: connessione TLS (HTTPS)", 1);
        $client = new HTTP_Client_ssl($reg_host, $reg_port, 180);
        $client->set_protocol($tls_protocol);
    }
    //## SETTAGGI COMUNI
    $client->set_post_data($post_data);
    $post_data_len = strlen($post_data);
    $log->writeLogFile("-Post data length: " . $post_data_len, 1);
    $client->set_data_length($post_data_len);
    $client->set_path($reg_path);
    $client->set_idfile($idfile);
    $client->set_save_files($save_files);
    $client->set_tmp_path($tmp_path);
    //############ INOLTRO AL REGISTRY ED ATTENDO LA RISPOSTA ###############
    $log->writeLogInfo("-Forward to registry and wait response");
    $registry_response_arr = $client->send_request();
    //#### NELLA RISPOSTA DAL REGISTRY HO HEADERS + BODY
    $da_registry = $registry_response_arr[0];
    $registry_response_log = $registry_response_arr[1];
    $log->writeLogInfo("-Registry sent response");
    //############################################################
    //# scrivo in locale la RISPOSTA DAL REGISTRY
    $log->writeLogFileS("REGISTRY RESPONSE: " . $da_registry, "", "");
    // Se la risposta del registry è errata, nulla o vuota, cancello il documento creato nel repository
    if (is_null($da_registry) || strlen(trim($da_registry)) <= 0 || strpos(strtoupper($da_registry), "ERROR") ||
        strpos(strtoupper($da_registry), "FAILURE") || $registry_response_log != "") {
        $deleteDocument = "DELETE FROM DOCUMENTS WHERE KEY_PROG = $next_token";
        $res_delete = query_execute2($deleteDocument, $connessione);
        $log->writeLogError("-Registry response error: " . $da_registry . " - " . $registry_response_log);
        $file_deleted = unlink($document_URI2);
        makeErrorFromRegistry($da_registry . " - " . $registry_response_log); // invia la risposta ed esce
    }
    //### XML RICEVUTO IN RISPOSTA DAL REGISTRY
    if (preg_match('([^\t\n\r\f\v";][:]*+ENVELOPE)', strtoupper($da_registry))) {
        $log->writeLogFile("-Found SOAPENV:ENVELOPE", 1);
        preg_match('(<([^\t\n\r\f\v";<]+:)?(ENVELOPE))', strtoupper($da_registry), $matches_reg);
        $presoap_reg = $matches_reg[1];
        $log->writeLogFileS("FOUND PRESOAP: $presoap", "", "");
        $body = substr($da_registry, strpos(strtoupper($da_registry), "<" . $presoap_reg . "ENVELOPE"));
    }
    $log->writeLogFileS("BODY RESPONSE: " . $body, "", "");
    //Rispondo al client
    SendMessage($body, $reg_http);
    $log->writeLogInfo($idfile . "-Sent ack to client");
    //================  FINE RISPOSTA AL DOCUMENT SOURCE  =================//
    if ($ATNA_active == 'A') {
        require_once ('lib/syslog.php');
        $syslog = new Syslog();
        // ATNA IMPORT per Provide And Register Document Set
        $eventOutcomeIndicator = "0"; //EventOutcomeIndicator 0 OK 12 ERROR
        $repository_endpoint = "http://" . $rep_host . ":" . $rep_port . $www_REP_path . "repository.php";
        $ip_repository = $rep_host;
        $ip_source = $_SERVER['REMOTE_ADDR'];
        $today = date("Y-m-d");
        $cur_hour = date("H:i:s");
        $datetime = $today . "T" . $cur_hour;
        $message_import = "<AuditMessage>
        <EventIdentification EventDateTime=\"$datetime\" EventActionCode=\"R\" EventOutcomeIndicator=\"0\">
        <EventID code=\"110107\" codeSystemName=\"DCM\" displayName=\"Import\"/>
        <EventTypeCode code=\"ITI-15\" codeSystemName=\"IHE Transactions\" displayName=\"Provide and Register Document Set\"/>
        </EventIdentification>
        <AuditSourceIdentification AuditSourceID=\"EL.CO. Repository\">
        <AuditSourceTypeCode code=\"4\" />
        </AuditSourceIdentification>
        <ActiveParticipant UserID=\"$ip_source\" UserIsRequestor=\"true\">
        <RoleIDCode code=\"110153\" codeSystemName=\"DCM\" displayName=\"Source\"/>
        </ActiveParticipant>
        <ActiveParticipant UserID=\"$repository_endpoint\" UserIsRequestor=\"false\">
        <RoleIDCode code=\"110152\" codeSystemName=\"DCM\" displayName=\"Destination\"/>
        </ActiveParticipant>
        <ParticipantObjectIdentification ParticipantObjectID=\"$submission_uniqueID\" ParticipantObjectTypeCode=\"2\" ParticipantObjectTypeCodeRole=\"20\">
        <ParticipantObjectIDTypeCode code=\"urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd\"/>
        </ParticipantObjectIdentification>
        </AuditMessage>";
        $logSyslog = $syslog->Send($ATNA_host, $ATNA_port, $message_import);
        // ATNA EXPORT per Register Document Set
        $eventOutcomeIndicator = "0"; //EventOutcomeIndicator 0 OK 12 ERROR
        $message_export = "<AuditMessage>
        <EventIdentification EventDateTime=\"$datetime\" EventActionCode=\"R\" EventOutcomeIndicator=\"$eventOutcomeIndicator\">
        <EventID code=\"110106\" codeSystemName=\"DCM\" displayName=\"Export\"/>
        <EventTypeCode code=\"ITI-14\" codeSystemName=\"IHE Transactions\" displayName=\"Register Document Set\"/>
        </EventIdentification>
        <AuditSourceIdentification AuditSourceID=\"EL.CO. Repository\">
        <AuditSourceTypeCode code=\"4\" />
        </AuditSourceIdentification>
        <ActiveParticipant UserID=\"$ip_repository\" UserIsRequestor=\"true\">
        <RoleIDCode code=\"110153\" codeSystemName=\"DCM\" displayName=\"Source\"/>
        </ActiveParticipant>
        <ActiveParticipant UserID=\"http://" . $reg_host . ":" . $reg_port . $reg_path . "\" UserIsRequestor=\"false\">
        <RoleIDCode code=\"110152\" codeSystemName=\"DCM\" displayName=\"Destination\"/>
        </ActiveParticipant>
        <ParticipantObjectIdentification ParticipantObjectID=\"$submission_uniqueID\" ParticipantObjectTypeCode=\"2\" ParticipantObjectTypeCodeRole=\"20\">
        <ParticipantObjectIDTypeCode code=\"urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd\"/>
        </ParticipantObjectIdentification>
        </AuditMessage>";
        $logSyslog = $syslog->Send($ATNA_host, $ATNA_port, $message_export);
        $log->writeLogFile("-Repository: Ho spedito i messaggi di ATNA", 1);
    } //Fine if($ATNA_active=='A')
    disconnectDB($connessione);
    unset($_SESSION['tmp_path']);
    unset($_SESSION['idfile']);
    unset($_SESSION['logActive']);
    unset($_SESSION['log_path']);
    unset($_SESSION['www_REP_path']);
    unset($_SESSION['save_files']);

    $log->writeLogInfo($idfile . "-Repository: END INSERT DOCUMENT");
    ob_end_flush();
?>
