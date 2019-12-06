<?php
    //### XDSSubmissionSet.sourceId
    function validate_XDSSubmissionSetSourceId($dom, $connessione)
    {
        //$ebxml_value = searchForIds($dom,'RegistryPackage','uniqueId');
        $ebxml_value = '';
        //#### RADICE DEL DOCUMENTO ebXML
        $root_ebXML = $dom->document_element();
        //#### ARRAY DEI NODI REGISTRYPACKAGE
        $dom_ebXML_RegistryPackage_node_array = $root_ebXML->get_elements_by_tagname("RegistryPackage");
        //### CICLO SU OGNI RegistryPackage ####
        for ($index = 0; $index < (count($dom_ebXML_RegistryPackage_node_array)); $index++) {
            //#### SINGOLO NODO REGISTRYPACKAGE
            $RegistryPackage_node = $dom_ebXML_RegistryPackage_node_array[$index];
            //### ARRAY DEI FIGLI DEL NODO REGISTRYPACKAGE ##############
            $RegistryPackage_child_nodes = $RegistryPackage_node->child_nodes();
            //################################################################
            //################ PROCESSO TUTTI I NODI FIGLI DI REGISTRYPACKAGE
            for ($k = 0; $k < count($RegistryPackage_child_nodes); $k++) {
                //### SINGOLO NODO FIGLIO DI REGISTRYPACKAGE
                $RegistryPackage_child_node = $RegistryPackage_child_nodes[$k];
                //### NOME DEL NODO
                $RegistryPackage_child_node_tagname = $RegistryPackage_child_node->node_name();
                if ($RegistryPackage_child_node_tagname == 'ExternalIdentifier') {
                    $externalidentifier_node = $RegistryPackage_child_node;
                    $value_value = $externalidentifier_node->get_attribute('value');
                    //### NODI FIGLI DI EXTERNALIDENTIFIER
                    $externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
                    //print_r($name_node);
                    for ($q = 0; $q < count($externalidentifier_child_nodes); $q++) {
                        $externalidentifier_child_node = $externalidentifier_child_nodes[$q];
                        $externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
                        if ($externalidentifier_child_node_tagname == 'Name') {
                            $name_node = $externalidentifier_child_node;
                            $LocalizedString_nodes = $name_node->child_nodes();
                            //print_r($LocalizedString_nodes);
                            for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
                                $LocalizedString_node = $LocalizedString_nodes[$p]; //->node_name();
                                $LocalizedString_node_tagname = $LocalizedString_node->node_name();
                                if ($LocalizedString_node_tagname == 'LocalizedString') {
                                    $LocalizedString_value = $LocalizedString_node->get_attribute('value');
                                    if (strpos(strtolower(trim($LocalizedString_value)), strtolower('SubmissionSet.sourceId'))) {
                                        $ebxml_value = $value_value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } //END OF for($index=0;$index<(count($dom_ebXML_RegistryPackage_node_array));$index++)
        //QUERY AL DB
        //$query = "SELECT * FROM SUBMISSIONS WHERE XDSSubmissionSet_uniqueId = '$ebxml_value'";
        $query = "SELECT * FROM KNOWN_SOUCES_IDS WHERE XDSSUBMISSIONSET_SOURCEID = '$ebxml_value'";
        if ($_SESSION['save_files']) {
            $fp_sourceIdQuery = fopen($_SESSION['tmp_path'] . $_SESSION['idfile'] . "-SubmissionSetSourceIdQuery-" . $_SESSION['idfile'], "w+");
            fwrite($fp_sourceIdQuery, $query);
            fclose($fp_sourceIdQuery);
        }
        //### ESEGUO LA QUERY
        $res = query_select2($query, $connessione); //array bidimensionale
        $isEmptySource = (empty($res));
        if ($isEmptySource) {
            $errorcode[] = "XDSRepositoryMetadataError";
            $error_message[] = "XDSSubmissionSet.SourceId '" . $ebxml_value . "' has not permission for submissions to this Repository";
            $SourceId_response = makeSoapedFailureResponse($error_message, $errorcode);
            writeTimeFile($_SESSION['idfile'] . "--Repository: sourceId_failure_response");
            writeFilesError($SourceId_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-sourceId_failure_response-" . $_SESSION['idfile']);
            SendMessage($SourceId_response, "HTTP");
            exit;
        } else {
            return $isEmptySource;
        }
    } //end of validate_XDSSubmissionSetSourceId($dom_ebXML)

    //#############################################################################
    //#### XDSDocumentEntry.uniqueId
    function validate_XDSDocumentEntryUniqueId($dom, $connessione)
    {
        //      $fp_uniqueIdQuery = fopen("tmp/DocumentEntryUniqueIdQuery","w+");
        $ebxml_value = array();
        //#### RADICE DEL DOCUMENTO ebXML
        $root_ebXML = $dom->document_element();
        //#### ARRAY DEI NODI ExtrinsicObject
        $dom_ebXML_ExtrinsicObject_node_array = $root_ebXML->get_elements_by_tagname("ExtrinsicObject");
        //### CICLO SU OGNI ExtrinsicObject ####
        $isEmpty = false;
        $failure = "";
        for ($index = 0; $index < (count($dom_ebXML_ExtrinsicObject_node_array)); $index++) {
            //#### NODO ExtrinsicObject RELATIVO AL DOCUMENTO NUMERO $index
            $ExtrinsicObject_node = $dom_ebXML_ExtrinsicObject_node_array[$index];
            //### ARRAY DEI FIGLI DEL NODO ExtrinsicObject ##############
            $ExtrinsicObject_child_nodes = $ExtrinsicObject_node->child_nodes();
            //################################################################
            //################ PROCESSO TUTTI I NODI FIGLI DI ExtrinsicObject
            for ($k = 0; $k < count($ExtrinsicObject_child_nodes); $k++) {
                //### SINGOLO NODO FIGLIO DI ExtrinsicObject
                $ExtrinsicObject_child_node = $ExtrinsicObject_child_nodes[$k];
                //### NOME DEL NODO
                $ExtrinsicObject_child_node_tagname = $ExtrinsicObject_child_node->node_name();
                if ($ExtrinsicObject_child_node_tagname == 'ExternalIdentifier') {
                    $externalidentifier_node = $ExtrinsicObject_child_node;
                    $value_value = avoidHtmlEntitiesInterpretation($externalidentifier_node->get_attribute('value'));
                    //### NODI FIGLI DI EXTERNALIDENTIFIER
                    $externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
                    //print_r($name_node);
                    for ($q = 0; $q < count($externalidentifier_child_nodes); $q++) {
                        $externalidentifier_child_node = $externalidentifier_child_nodes[$q];
                        $externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
                        if ($externalidentifier_child_node_tagname == 'Name') {
                            $name_node = $externalidentifier_child_node;
                            $LocalizedString_nodes = $name_node->child_nodes();
                            //print_r($LocalizedString_nodes);
                            for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
                                $LocalizedString_node = $LocalizedString_nodes[$p]; //->node_name();
                                $LocalizedString_node_tagname = $LocalizedString_node->node_name();
                                if ($LocalizedString_node_tagname == 'LocalizedString') {
                                    $LocalizedString_value = $LocalizedString_node->get_attribute('value');
                                    if (strpos(strtolower(trim($LocalizedString_value)), strtolower('DocumentEntry.uniqueId'))) {
                                        $ebxml_value[$index] = $value_value;
                                    }
                                }
                            }
                        }
                    }
                } //END OF if($ExtrinsicObject_child_node_tagname=='ExternalIdentifier')
            }
            //QUERY AL DB
            $query = "SELECT XDSDOCUMENTENTRY_UNIQUEID FROM DOCUMENTS WHERE XDSDOCUMENTENTRY_UNIQUEID = '" . $ebxml_value[$index] . "'";
            $res = query_select2($query, $connessione); //array bidimensionale
            $isEmptyUniqueId = ((empty($res)) || $isEmpty);
            if (!$isEmptyUniqueId) { //##---> uniqueId già presente --> eccezione
                $errorcode[] = "XDSNonIdenticalHash";
                $error_message[] = "ExternalIdentifier XDSDocumentEntry.uniqueId '" . $ebxml_value[$index] . "' (urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab) already exists in repository";
                $uniqueId_response = makeSoapedFailureResponse($error_message, $errorcode);
                writeTimeFile($_SESSION['idfile'] . "--Repository: uniqueId_failure_response");
                writeFilesError($uniqueId_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-uniqueId_failure_response-" . $_SESSION['idfile']);
                SendMessage($uniqueId_response, "HTTP");
                exit;
            }
        } //END OF for($index=0;$index<(count($dom_ebXML_ExtrinsicObject_node_array));$index++)
        $ret = array($isEmptyUniqueId, $ebxml_value);
        return $ret;
    } //end of validate_XDSDocumentEntryUniqueId($dom)

    function controllaPayload($input)
    {
        $errorcode = array();
        $error_message = array();
        writeTimeFile($_SESSION['idfile'] . "--Repository: Non e presente il boundary");
        $dom_ebXML = domxml_open_mem($input);
        $root_ebXML = $dom_ebXML->document_element();
        $dom_ebXML_node_array = $root_ebXML->get_elements_by_tagname("LeafRegistryObjectList");
        $node = $dom_ebXML_node_array[0];
        $payload = $node->child_nodes();
        $isNotEmpty = (count($payload) - 1);
        if (!$isNotEmpty) {
            $errorcode[] = "XDSMissingMetadata";
            $error_message[] = "$service: No metadata\n";
            $empty_payload_response = makeSoapedFailureResponse($error_message, $errorcode);
            writeTimeFile($_SESSION['idfile'] . "--Repository: empty_payload_response");
            writeFilesError($empty_payload_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-empty_payload_response-" . $_SESSION['idfile']);
            SendMessage($empty_payload_response, "HTTP");
            exit;
        }
        return $isNotEmpty;
    }

    function isValid($ebxml_STRING_VALIDATION)
    {
        //###### VALIDAZIONE DELL'ebXML SECONDO LO SCHEMA
        libxml_use_internal_errors(true);
        $domEbxml = DOMDocument::loadXML($ebxml_STRING_VALIDATION);
        // Valido il messaggio da uno schema
        if (!$domEbxml->schemaValidate('schemas/rs.xsd')) {
            $errors = libxml_get_errors();
            foreach($errors as $error) {
                $errorcode[] = "XDSRepositoryMetadataError";
                $error_message[] = $error->message;
            }
            //## RESTITUISCE IL MESSAGGIO DI FAIL IN SOAP
            $failure_response = makeSoapedFailureResponse($error_message, $errorcode);
            //## SCRIVO LA RISPOSTA IN UN FILE
            // File da scrivere
            writeTimeFile($_SESSION['idfile'] . "--Repository: SOAPED_failure_VALIDATION_response");
            writeFilesError($failure_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-SOAPED_failure_VALIDATION_response-" . $_SESSION['idfile']);
            SendMessage($failure_response, "HTTP");
            exit;
        } else {
            return true;
        }
    }

    function verificaAllegatiExtrinsicObject($conta_EO, $conta_allegati)
    {
        //## Caso in cui ci siano meno allegati che ExtrinsicObject
        //## Devo dare un errore XDSMissingDocument
        if ($conta_allegati < $conta_EO) //### IMPORTANTE!!
        {
            writeTimeFile($idfile . "--Repository: Non ci sono abbastanza allegati");
            //RESTITUISCE IL MESSAGGIO DI ERRORE
            $errorcode[] = "XDSMissingDocument";
            $error_message[] = "XDSDocumentEntry exists in metadata with no corresponding attached document";
            $failure_response = makeSoapedFailureResponse($error_message, $errorcode);
            writeFilesError($failure_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-Document_missing-" . $_SESSION['idfile']);
            SendMessage($failure_response, "HTTP");
            exit;
            //PULISCO IL BUFFER DI USCITA
            ob_get_clean(); //OKKIO FONDAMENTALE!!!!!

        } //FINE if($conta_boundary<$conta_EO)
        //## Caso in cui ci siano più allegati che ExtrinsicObject
        //## Devo dare un errore XDSMissingDocumentMetadata
        else if ($conta_allegati > $conta_EO) {
                //RESTITUISCE IL MESSAGGIO DI ERRORE
                $errorcode[] = "XDSMissingDocumentMetadata";
                $error_message[] = "There are more attached file than ExtrinsicObject";
                writeTimeFile($_SESSION['idfile'] . "--Repository: ExtrinsicObject_missing");
                $failure_response = makeSoapedFailureResponse($error_message, $errorcode);
                writeFilesError($failure_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-ExtrinsicObject_missing-" . $_SESSION['idfile']);
                SendMessage($failure_response, "HTTP");
                exit;
                //PULISCO IL BUFFER DI USCITA
                ob_get_clean(); //OKKIO FONDAMENTALE!!!!!

            } else {
                writeTimeFile($_SESSION['idfile'] . "--Repository: Ci sono $conta_EO ExtrinsicObject e $conta_boundary allegati");
                return true;
        }
    }

    function verificaContentMimeExtrinsicObject($dom_ebXML, $allegato_array)
    {
        $valid = true;
        $ExtrinsicObject_array = $dom_ebXML->get_elements_by_tagname("ExtrinsicObject");
        $conta_EO = count($ExtrinsicObject_array);
        $ContaAllegati = count($allegato_array);
        if ($ContaAllegati != $conta_EO) {
            $valid = false;
            writeTimeFile($_SESSION['idfile'] . "--Repository: Gli Allegati sono diversi dagli ExtrinsicObject");
            verificaAllegatiExtrinsicObject($conta_EO, $ContaAllegati);
            exit;
        } else {
            for ($index = 0; $index < $conta_EO; $index++) {
                //### SINGOLO NODO ExtrinsicObject
                $ExtrinsicObject_node = $ExtrinsicObject_array[$index];
                //### RICAVO ATTRIBUTO id DI ExtrinsicObject
                $ExtrinsicObject_id_attr = $ExtrinsicObject_node->get_attribute('id');
                $contenID_arr[$index] = $ExtrinsicObject_id_attr;
                //### RICAVO ATTRIBUTO mymeType
                $ExtrinsicObject_mimeType_attr = $ExtrinsicObject_node->get_attribute('mimeType');
                $mimeType_arr[$index] = $ExtrinsicObject_mimeType_attr;
                $contentID_UP = strtoupper("Content-ID: <" . $contenID_arr[$index] . ">");
                $mimeType_UP = strtoupper("Content-Type: " . $mimeType_arr[$index]);
                $trovato = false;
                for ($i = 0; $i < $ContaAllegati && !$trovato; $i++) {
                    if ((strpos(strtoupper($allegato_array[$i]), $contentID_UP)) && (strpos(strtoupper($allegato_array[$i]), $mimeType_UP))) {
                        $trovato = true;
                    }
                }
            }
            // Se non trova il Content-ID o MimeType--> Errore XDSMissingDocument
            if (!$trovato) {
                writeTimeFile($_SESSION['idfile'] . "--Repository: In Content-ID o Content-Type non corrisponde Content-ID: " . $contentID_UP[$index] . " Mime-Type: " . $mimeType_UP[$index]);
                $valid = false;
                $ContaAllegati--;
                verificaAllegatiExtrinsicObject($conta_EO, $ContaAllegati);
                exit;
            }
        }
        return $valid;
    }

    function makeErrorFromRegistry($registry_response_log)
    {
        //RESTITUISCE IL MESSAGGIO DI ERRORE
        $errorcode[] = "XDSRegistryError";
        $error_message[] = $registry_response_log;
        $failure_response = makeSoapedFailureResponse($error_message, $errorcode);
        writeTimeFile($_SESSION['idfile'] . "-Registry Error");
        SendMessage($failure_response);
        exit;
    }

    function verificaExtrinsicObject($dom_ebXML)
    {
        $ExtrinsicObject_array = $dom_ebXML->get_elements_by_tagname("ExtrinsicObject");
        $conta_EO = count($ExtrinsicObject_array);
        if ($conta_EO > 0) {
            //RESTITUISCE IL MESSAGGIO DI ERRORE
            $errorcode[] = "XDSMissingDocument";
            $error_message[] = "XDSDocumentEntry exists in metadata with no corresponding attached document";
            $failure_response = makeSoapedFailureResponse($error_message, $errorcode);
            writeFilesError($failure_response, $_SESSION['tmp_path'] . $_SESSION['idfile'] . "-Document_missing-" . $_SESSION['idfile']);
            SendMessage($failure_response, "HTTP");
            exit;
            //PULISCO IL BUFFER DI USCITA
            ob_get_clean(); //OKKIO FONDAMENTALE!!!!!
        } else {
            return true;
        }
    }

    function getSubmissionUniqueID($dom)
    {
        //$ebxml_value = searchForIds($dom,'RegistryPackage','uniqueId');
        $ebxml_value = '';
        //#### RADICE DEL DOCUMENTO ebXML
        $root_ebXML = $dom->document_element();
        //#### ARRAY DEI NODI REGISTRYPACKAGE
        $dom_ebXML_RegistryPackage_node_array = $root_ebXML->get_elements_by_tagname("RegistryPackage");
        //### CICLO SU OGNI RegistryPackage ####
        for ($index = 0; $index < (count($dom_ebXML_RegistryPackage_node_array)); $index++) {
            //#### SINGOLO NODO REGISTRYPACKAGE
            $RegistryPackage_node = $dom_ebXML_RegistryPackage_node_array[$index];
            //### ARRAY DEI FIGLI DEL NODO REGISTRYPACKAGE ##############
            $RegistryPackage_child_nodes = $RegistryPackage_node->child_nodes();
            //################################################################
            //################ PROCESSO TUTTI I NODI FIGLI DI REGISTRYPACKAGE
            for ($k = 0; $k < count($RegistryPackage_child_nodes); $k++) {
                //### SINGOLO NODO FIGLIO DI REGISTRYPACKAGE
                $RegistryPackage_child_node = $RegistryPackage_child_nodes[$k];
                //### NOME DEL NODO
                $RegistryPackage_child_node_tagname = $RegistryPackage_child_node->node_name();
                if ($RegistryPackage_child_node_tagname == 'ExternalIdentifier') {
                    $externalidentifier_node = $RegistryPackage_child_node;
                    $value_value = $externalidentifier_node->get_attribute('value');
                    //### NODI FIGLI DI EXTERNALIDENTIFIER
                    $externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
                    //print_r($name_node);
                    for ($q = 0; $q < count($externalidentifier_child_nodes); $q++) {
                        $externalidentifier_child_node = $externalidentifier_child_nodes[$q];
                        $externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
                        if ($externalidentifier_child_node_tagname == 'Name') {
                            $name_node = $externalidentifier_child_node;
                            $LocalizedString_nodes = $name_node->child_nodes();
                            //print_r($LocalizedString_nodes);
                            for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
                                $LocalizedString_node = $LocalizedString_nodes[$p]; //->node_name();
                                $LocalizedString_node_tagname = $LocalizedString_node->node_name();
                                if ($LocalizedString_node_tagname == 'LocalizedString') {
                                    $LocalizedString_value = $LocalizedString_node->get_attribute('value');
                                    if (strpos(strtolower(trim($LocalizedString_value)), strtolower('SubmissionSet.uniqueId'))) {
                                        $ebxml_value = $value_value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } //END OF for($index=0;$index<(count($dom_ebXML_RegistryPackage_node_array));$index++)
        return $ebxml_value;
    } //end of getSubmissionUniqueID($dom_ebXML)

?>