<?php
    ob_start();
    //----------------------------------------------------//
    //#### CONFIGURAZIONE DEL REPOSITORY
    require_once ("REGISTRY_CONFIGURATION/REG_configuration.php");
    //######################################
    if ($statActive == "A") {
        //Parte per calcolare i tempi di esecuzione
        $starttime = microtime(true);
    }
    require_once ('reg_validation.php');
    require_once ('./lib/query_utilities.php');
    $idfile = idrandom_file();
    $_SESSION['tmp_path'] = $tmp_path;
    $_SESSION['idfile'] = $idfile;
    $_SESSION['logActive'] = $logActive;
    $_SESSION['log_path'] = $log_path;
    $_SESSION['tmpQueryService_path'] = $tmpQueryService_path;
    $_SESSION['www_REG_path'] = $_SERVER['PHP_SELF'];
    $www_REG_path = $_SERVER['PHP_SELF'];

    // Roberto
    $error_code = array();
    $failure_response = array();
    if ($clean_cache != "O") {
        //RECUPERO GLI HEADERS RICEVUTI DA APACHE
        $headers = apache_request_headers();
        writeTmpQueryFiles($headers, $idfile . "-headers_received-" . $idfile);
    }
    $ebxml_imbustato_soap_STRING = $HTTP_RAW_POST_DATA;
    if ($clean_cache != "O") {
        writeTmpQueryFiles($ebxml_imbustato_soap_STRING, $idfile . "-AdhocQueryRequest_imbustato_soap-" . $idfile);
    }
    // Roberto
    $namespacequery = givenamespace('urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0', $ebxml_imbustato_soap_STRING);
    if (is_null($namespacequery)) {
        $namespacequery = givenamespace('urn:oasis:names:tc:ebxml-regrep:query:xsd:2.1', $ebxml_imbustato_soap_STRING);
    }
    if ($namespacequery == '') {
        $inizioAdhocQueryRequest = "<AdhocQueryRequest";
        $fineAdhocQueryRequest = "</AdhocQueryRequest>";
    } else {
        $inizioAdhocQueryRequest = "<$namespacequery:AdhocQueryRequest";
        $fineAdhocQueryRequest = "</$namespacequery:AdhocQueryRequest>";
    }
    $offset = strlen($fineAdhocQueryRequest);
    $ebxml_STRING = substr($ebxml_imbustato_soap_STRING, strpos($ebxml_imbustato_soap_STRING, $inizioAdhocQueryRequest), (strlen($ebxml_imbustato_soap_STRING) - strlen(substr($ebxml_imbustato_soap_STRING, strpos($ebxml_imbustato_soap_STRING, $fineAdhocQueryRequest) + $offset))));
    $ebxml_STRING = str_replace((substr($ebxml_imbustato_soap_STRING, strpos($ebxml_imbustato_soap_STRING, $fineAdhocQueryRequest) + $offset)), "", $ebxml_STRING);
    // Roberto
    //##################################################################################
    //SCRIVO L'AdhocQueryRequest SBUSTATO
    if ($clean_cache != "O") {
        writeTmpQueryFiles($ebxml_STRING, $idfile . "-AdhocQueryRequest-" . $idfile);
    }
    $schema = 'schemas/query.xsd';
    $isValid = isValid($ebxml_STRING, $schema); // Se il documento non è valido la funzione risponde al client ed esce
    if ($isValid) {
        writeTimeFile($idfile . "--Query: Il documento e' valido");
    }
    //### OTTENGO L'OGGETTO DOM DALL'AdhocQueryRequest
    if (!$dom_AdhocQueryRequest = domxml_open_mem($ebxml_STRING)) {
        writeTimeFile($idfile . "--Query: AdhocQueryRequest non corretto");
    }
    //#############################################################################
    //#### PARAMETRI DA RICAVARE DALL'ebXML DI QUERY
    $SQLQuery = ''; //TESTO DELLA QUERY
    $returnComposedObjects_a = ''; // TRUE O FALSE
    $returnType_a = ''; // LeafClass
    //NODO DI ROOT DELL'OGGETTO DOM
    $root = $dom_AdhocQueryRequest->document_element();
    //################ RECUPERO LE OPZIONI DELLA QUERY
    $SQLQuery_options_node_array = $root->get_elements_by_tagname("ResponseOption");
    $SQLQuery_options_node_array_count = count($SQLQuery_options_node_array);
    for ($u = 0; $u < $SQLQuery_options_node_array_count; $u++) {
        $SQLQuery_options_node = $SQLQuery_options_node_array[$u];
        $returnComposedObjects_a = $SQLQuery_options_node->get_attribute("returnComposedObjects");
        $returnType_a = $SQLQuery_options_node->get_attribute("returnType");
    }
    //################### RECUPERO IL TESTO DELLA QUERY
    $SQLQuery_node_array = $root->get_elements_by_tagname("SQLQuery");
    $SQLQuery_node_array_count = count($SQLQuery_node_array);
    for ($i = 0; $i < $SQLQuery_node_array_count; $i++) {
        $node = $SQLQuery_node_array[$i];
        //##### RICAVO LA QUERY IN FORMATO STRINGA ########
        //$SQLQuery = avoidHtmlEntitiesInterpretation(trim($node->get_content()));
        $SQLQuery = trim($node->get_content());
        //$SQLQuery = str_replace('&','&amp;',$SQLQuery);

    }
    //##### CONTROLLO SQL RICEVUTA
    $controllo_query_array = controllaQuery($SQLQuery);
    // Roberto
    //##### CASO DI VALIDAZIONE SQL ===NON=== PASSATA
    //if (!$controllo_query_array[0]) {
    //    writeTimeFile($idfile . "--Query: SUPERATO IL VINCOLO DI VALIDAZIONE SU TIPO DI SQL + SCHEMAS");
    if ($controllo_query_array[0] == false) {
        writeTimeFile($idfile . "--Query: *** NON *** SUPERATO IL VINCOLO DI VALIDAZIONE SU TIPO DI SQL + SCHEMAS");
        SendResponse($controllo_query_array[1]);
        exit;
    }
    writeTimeFile($idfile . "--Query: SUPERATO IL VINCOLO DI VALIDAZIONE SU TIPO DI SQL + SCHEMAS");
    // Roberto
    //#######################################################################
    //## ORA DEVO ESEGUIRE LA QUERY SUL DB DEL XDS_REGISTRY_QUERY REGISTRY
    //############### RISPOSTA ALLA QUERY (ARRAY)
    //##METTO A POSTO EVENTUALI STRINGHE DI COMANDO
    $SQLQuery_ESEGUITA = adjustQuery($SQLQuery); //### IMPORTANTE!!!
    // Roberto
    //$connessione = connectDB(); NON serve variabile settata nel file "REGISTRY_CONFIGURATION/REG_configuration.php". Connessione già aperta
    // Roberto
    //##### ESEGUO LA QUERY
    $SQLResponse = query_select2($SQLQuery_ESEGUITA, $connessione);
    //###################################################
    //### CONTROLLO COME PRIMA COSA CHE LA SQL ABBIA RISULTATO
    if (empty($SQLResponse)) {
        //### STRINGA DI ERRORE
        $failure_response = "[EMPTY RESULT] - SQL QUERY [ " . avoidHtmlEntitiesInterpretation($SQLQuery) . " ] DID NOT GIVE ANY RESULTS IN THIS REGISTRY";
        //## RESTITUISCE IL MESSAGGIO DI SUCCESS IN SOAP
        //## ANCHE SE IL RISULTATO DELLA QUERY DA DB è VUOTO
        $SOAPED_failure_response = makeSoapedSuccessQueryResponse($failure_response);
        $file_input = $idfile . "-SOAPED_NORESULTS_response-" . $idfile;
        writeTmpQueryFiles($SOAPED_failure_response, $file_input);
        writeTimeFile($idfile . "--Query: nessun risultato ritornato");
        SendMessage($SOAPED_failure_response, $http);
        exit;
    } //END OF if(empty($SQLResponse))
    writeTimeFile($idfile . "--Query: ho un risultato");
    //###### QUI SONO SICURO CHE LE QUERY DA ALMENO UN RISULTATO
    $ebXML_Response_string = "";
    $ebXML_Response_SOAPED_string = "";
    //#### COMINCIO A COSTRUIRE L'ebXML DI RISPOSTA
    //############## DISTINGUO I CASI A SECONDA DEGLI ATTRIBUTI
    //############## returnType  E  returnComposedObjects
    $SQLResponse_arr_count = count($SQLResponse);
    if ($returnType_a == "ObjectRef" && $returnComposedObjects_a == "false") {
        writeTimeFile($idfile . "--ObjectRef, no composed objects");
        //### SOLO OBJECTREF ID = EXTRINSICOBJECT ID (NON SIMBOLICO!)
        for ($rr = 0; $rr < $SQLResponse_arr_count; $rr++) {
            $ObjectRef_id = $SQLResponse[$rr][0];
            $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
            $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
            $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
            //### SETTO I NAMESPACES
            $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
            $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
            $dom_ebXML_ObjectRef_root->set_attribute("id", $ObjectRef_id);
            $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
        }
        writeTimeFile($idfile . "--Fine ObjectRef, no composed objects");
    } else if ($returnType_a == "ObjectRef" && $returnComposedObjects_a == "true") {
            writeTimeFile($idfile . "--ObjectRef, composed objects");
            //#### Da capire
            for ($rr = 0; $rr < $SQLResponse_arr_count; $rr++) {
                $ObjectRef_id = $SQLResponse[$rr][0];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim3_path, $ns_rim3);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q3_path, $ns_q3);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $ObjectRef_id);
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            }
            writeTimeFile($idfile . "--Fine ObjectRef, composed objects");
        } else if ($returnType_a == "LeafClass") {
                writeTimeFile($idfile . "--LeafClass");
                $objectType_code_from_ExtrinsicObject = "";
                $objectType_code_from_RegistryPackage = "";
                $objectType_from_Association = "";
                $ExtrinsicObject_Classification_classificationScheme_ARR_1 = array();
                $ExtrinsicObject_Classification_classificationScheme_ARR_2 = array();
                $ExtrinsicObject_Classification_classificationNode_ARR_1 = array();
                $ExtrinsicObject_Classification_classificationNode_ARR_2 = array();
                $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_1 = array();
                $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_2 = array();
                $RegistryPackage_Classification_classificationScheme_ARR_1 = array();
                $RegistryPackage_Classification_classificationScheme_ARR_2 = array();
                $RegistryPackage_Classification_classificationNode_ARR_1 = array();
                $RegistryPackage_Classification_classificationNode_ARR_2 = array();
                $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1 = array();
                $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_2 = array();
                $Association_sourceObject_ARR_1 = array();
                $Association_sourceObject_ARR_2 = array();
                $Association_targetObject_ARR_1 = array();
                $Association_targetObject_ARR_2 = array();
                //### NO NODI CLASSIFICATION
                writeTimeFile($idfile . "--NO_NODI_CLASSIFICATION");
                for ($rr = 0; $rr < $SQLResponse_arr_count; $rr++) {
                    //#### QUI HO L'ID DALLA SELECT RICEVUTA
                    $id = $SQLResponse[$rr][0];
                    //############## DISCRIMINO IL TIPO DI RISULTATO ##############
                    //### DOCUMENTENTRY
                    // Roberto
                    writeTimeFile($idfile . "--DOCUMENTENTRY_" . $rr);
                    $query_extrinsic_classification = "SELECT ClassificationNode.code FROM ExtrinsicObject,ClassificationNode WHERE ClassificationNode.id = ExtrinsicObject.objectType and ExtrinsicObject.id = '$id'";
                    $objectType_code_from_ExtrinsicObject_arr = query_select2($query_extrinsic_classification, $connessione);
                    writeSQLQueryService($query_extrinsic_classification);
                    $objectType_code_from_ExtrinsicObject = $objectType_code_from_ExtrinsicObject_arr[0][0];
                    if ($objectType_code_from_ExtrinsicObject == '') {
                        writeTimeFile($idfile . "--DOCUMENTENTRY_RegistryPackage_ClassificationNode_" . $rr);
                        $query_registry_classification = "SELECT ClassificationNode.code FROM RegistryPackage,ClassificationNode WHERE ClassificationNode.id = RegistryPackage.objectType and RegistryPackage.id = '$id'";
                        $objectType_code_from_RegistryPackage_arr = query_select2($query_registry_classification, $connessione);
                        writeSQLQueryService($query_registry_classification);
                        $objectType_code_from_RegistryPackage = $objectType_code_from_RegistryPackage_arr[0][0];
                        //#### ASSOCIATION
                        $get_objectType_from_Association = "SELECT objectType FROM Association WHERE Association.id = '$id'";
                        $objectType_from_Association_arr = query_select2($get_objectType_from_Association, $connessione);
                        writeSQLQueryService($get_objectType_from_Association);
                        $objectType_from_Association = $objectType_from_Association_arr[0][0];
                    }
                    // Roberto
                    //############## FINE DISCRIMINO IL TIPO DI RISULTATO ##############
                    if ($objectType_code_from_ExtrinsicObject == "XDSDocumentEntry") {
                    writeTimeFile($idfile . "--DOCUMENTENTRY_XDSDocumentEntry_" . $rr);
                    writeSQLQueryService("\nSono nel caso XDSDocumentEntry");
                    $ExtrinsicObject_id = $SQLResponse[$rr][0];
                    $dom_ebXML_ExtrinsicObject = domxml_new_doc("1.0");
                    //# ROOT
                    $dom_ebXML_ExtrinsicObject_root = $dom_ebXML_ExtrinsicObject->create_element("ExtrinsicObject");
                    $dom_ebXML_ExtrinsicObject_root = $dom_ebXML_ExtrinsicObject->append_child($dom_ebXML_ExtrinsicObject_root);
                    //### SETTO I NAMESPACES
                    $dom_ebXML_ExtrinsicObject_root->set_namespace($ns_rim_path, $ns_rim);
                    $dom_ebXML_ExtrinsicObject_root->add_namespace($ns_q_path, $ns_q);
                    //###OTTENGO DAL DB GLI ATTRIBUTI DI ExtrinsicObject
                    $queryForExtrinsicObjectAttributes = "SELECT isOpaque,majorVersion,mimeType,minorVersion,objectType,status,userVersion FROM ExtrinsicObject WHERE ExtrinsicObject.id = '$ExtrinsicObject_id'";
                    $ExtrinsicObjectAttributes = query_select2($queryForExtrinsicObjectAttributes, $connessione);
                    writeSQLQueryService($queryForExtrinsicObjectAttributes);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("id", $ExtrinsicObject_id);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("isOpaque", $ExtrinsicObjectAttributes[0][0]);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("majorVersion", $ExtrinsicObjectAttributes[0][1]);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("mimeType", $ExtrinsicObjectAttributes[0][2]);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("minorVersion", $ExtrinsicObjectAttributes[0][3]);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("objectType", $ExtrinsicObjectAttributes[0][4]);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("status", $ExtrinsicObjectAttributes[0][5]);
                    $dom_ebXML_ExtrinsicObject_root->set_attribute("userVersion", $ExtrinsicObjectAttributes[0][6]);
                    appendName($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_root, $ns_rim_path, $ExtrinsicObject_id, $connessione);
                    appendDescription($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_root, $ns_rim_path, $ExtrinsicObject_id, $connessione);
                    appendSlot($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_root, $ns_rim_path, $ExtrinsicObject_id, $connessione);
                    //### GESTISCO IL CASO IN CUI DEVO RITORNARE OGGETTI COMPOSTI
                    if ($returnComposedObjects_a == "true") {
                        writeTimeFile($idfile . "--DOCUMENTENTRY_XDSDocumentEntry_composedObject_" . $rr);
                        //### CLASSIFICATION + EXTERNALIDENTIFIER + OBJECTREF
                        //##### NODI CLASSIFICATION
                        writeSQLQueryService("\nCiclo su Classification di ExtrinsicObject");
                        //Query modificata per ebxml v2.1 (AuthorInstitution....)
                        /*$get_ExtrinsicObject_Classification="SELECT classificationScheme,classificationNode,classifiedObject,id,nodeRepresentation,objectType FROM Classification WHERE Classification.classifiedObject = '$ExtrinsicObject_id' AND Classification.nodeRepresentation != 'NULL'";*/
                        $get_ExtrinsicObject_Classification = "SELECT classificationScheme,classificationNode,classifiedObject,id,nodeRepresentation,objectType FROM Classification WHERE Classification.classifiedObject = '$ExtrinsicObject_id'";
                        $ExtrinsicObject_Classification_arr = query_select2($get_ExtrinsicObject_Classification, $connessione);
                        writeSQLQueryService($get_ExtrinsicObject_Classification);
                        //### CICLO SU TUTTI I NODI CLASSIFICATION
                        $Classification_arr_count = count($ExtrinsicObject_Classification_arr);
                        for ($t = 0; $t < $Classification_arr_count; $t++) {
                            writeTimeFile($idfile . "--DOCUMENTENTRY_XDSDocumentEntry_composedObject_nodoClassification_" . $rr . "_" . $t);
                            $ExtrinsicObject_Classification = $ExtrinsicObject_Classification_arr[$t];
                            $dom_ebXML_ExtrinsicObject_Classification = $dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path, "Classification");
                            $dom_ebXML_ExtrinsicObject_Classification = $dom_ebXML_ExtrinsicObject_root->append_child($dom_ebXML_ExtrinsicObject_Classification);
                            //### ATTRIBUTI DI CLASSIFICATION
                            $ExtrinsicObject_Classification_classificationScheme = $ExtrinsicObject_Classification[0];
                            $ExtrinsicObject_Classification_classificationNode = $ExtrinsicObject_Classification[1];
                            //### PREPARO PER OBJECTREF
                            $ExtrinsicObject_Classification_classificationScheme_ARR_1[$ExtrinsicObject_Classification_classificationScheme] = $ExtrinsicObject_Classification_classificationScheme;
                            $ExtrinsicObject_Classification_classificationScheme_ARR_2[] = $ExtrinsicObject_Classification_classificationScheme;
                            $ExtrinsicObject_Classification_classificationNode_ARR_1[$ExtrinsicObject_Classification_classificationNode] = $ExtrinsicObject_Classification_classificationNode;
                            $ExtrinsicObject_Classification_classificationNode_ARR_2[] = $ExtrinsicObject_Classification_classificationNode;
                            $ExtrinsicObject_Classification_classifiedObject = $ExtrinsicObject_Classification[2];
                            $ExtrinsicObject_Classification_id = $ExtrinsicObject_Classification[3];
                            $ExtrinsicObject_Classification_nodeRepresentation = $ExtrinsicObject_Classification[4];
                            $ExtrinsicObject_Classification_objectType = $ExtrinsicObject_Classification[5];
                            $dom_ebXML_ExtrinsicObject_Classification->set_attribute("classificationScheme", $ExtrinsicObject_Classification_classificationScheme);
                            $dom_ebXML_ExtrinsicObject_Classification->set_attribute("classificationNode", $ExtrinsicObject_Classification_classificationNode);
                            $dom_ebXML_ExtrinsicObject_Classification->set_attribute("classifiedObject", $ExtrinsicObject_Classification_classifiedObject);
                            $dom_ebXML_ExtrinsicObject_Classification->set_attribute("id", $ExtrinsicObject_Classification_id);
                            $dom_ebXML_ExtrinsicObject_Classification->set_attribute("nodeRepresentation", $ExtrinsicObject_Classification_nodeRepresentation);
                            $dom_ebXML_ExtrinsicObject_Classification->set_attribute("objectType", $ExtrinsicObject_Classification_objectType);
                            appendName_Classification($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_Classification, $ns_rim_path, $ExtrinsicObject_Classification_id, $connessione);
                            appendDescription_Classification($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_Classification, $ns_rim_path, $ExtrinsicObject_Classification_id, $connessione);
                            appendSlot_Classification($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_Classification, $ns_rim_path, $ExtrinsicObject_Classification_id, $connessione);
                        } //END OF for($t=0;$t<count($ExtrinsicObject_Classification_arr);$t++)
                        //### NODI EXTERNALIDENTIFIER
                        writeSQLQueryService("\nCiclo su ExternalIdentifier di ExtrinsicObject");
                        $get_ExtrinsicObject_ExternalIdentifier = "SELECT identificationScheme,objectType,id,value FROM ExternalIdentifier WHERE ExternalIdentifier.registryObject = '$ExtrinsicObject_id'";
                        $ExtrinsicObject_ExternalIdentifier_arr = query_select2($get_ExtrinsicObject_ExternalIdentifier, $connessione);
                        writeSQLQueryService($get_ExtrinsicObject_ExternalIdentifier);
                        //### CICLO SU TUTTI I NODI EXTERNALIDENTIFIER
                        $ExternalIdentifier_arr_count = count($ExtrinsicObject_ExternalIdentifier_arr);
                        for ($e = 0; $e < $ExternalIdentifier_arr_count; $e++) {
                            writeTimeFile($idfile . "--DOCUMENTENTRY_XDSDocumentEntry_composedObject_nodoExternalIdentifier_" . $rr . "_" . $e);
                            $ExtrinsicObject_ExternalIdentifier = $ExtrinsicObject_ExternalIdentifier_arr[$e];
                            $dom_ebXML_ExtrinsicObject_ExternalIdentifier = $dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path, "ExternalIdentifier");
                            $dom_ebXML_ExtrinsicObject_ExternalIdentifier = $dom_ebXML_ExtrinsicObject_root->append_child($dom_ebXML_ExtrinsicObject_ExternalIdentifier);
                            //### ATTRIBUTI DI EXTERNALIDENTIFIER
                            $ExtrinsicObject_ExternalIdentifier_identificationScheme = $ExtrinsicObject_ExternalIdentifier[0];
                            //### PREPARO PER OBJECTREF
                            $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_1[$ExtrinsicObject_ExternalIdentifier_identificationScheme] = $ExtrinsicObject_ExternalIdentifier_identificationScheme;
                            $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_2[] = $ExtrinsicObject_ExternalIdentifier_identificationScheme;
                            //#######################
                            //############ OBJECTREF
                            $ExtrinsicObject_ExternalIdentifier_objectType = $ExtrinsicObject_ExternalIdentifier[1];
                            $ExtrinsicObject_ExternalIdentifier_id = $ExtrinsicObject_ExternalIdentifier[2];
                            $ExtrinsicObject_ExternalIdentifier_value = $ExtrinsicObject_ExternalIdentifier[3];
                            $dom_ebXML_ExtrinsicObject_ExternalIdentifier->set_attribute("identificationScheme", $ExtrinsicObject_ExternalIdentifier_identificationScheme);
                            $dom_ebXML_ExtrinsicObject_ExternalIdentifier->set_attribute("objectType", $ExtrinsicObject_ExternalIdentifier_objectType);
                            $dom_ebXML_ExtrinsicObject_ExternalIdentifier->set_attribute("id", $ExtrinsicObject_ExternalIdentifier_id);
                            $dom_ebXML_ExtrinsicObject_ExternalIdentifier->set_attribute("value", $ExtrinsicObject_ExternalIdentifier_value);
                            appendName_ExternalIdentifier($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_ExternalIdentifier, $ns_rim_path, $ExtrinsicObject_ExternalIdentifier_id, $connessione);
                            appendDescription_ExternalIdentifier($dom_ebXML_ExtrinsicObject, $dom_ebXML_ExtrinsicObject_ExternalIdentifier, $ns_rim_path, $ExtrinsicObject_ExternalIdentifier_id, $connessione);
                        }
                    } //END OF if($returnComposedObjects_a=="true")
                    //### CONCATENO LE STINGHE RISULTANTI
                    $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ExtrinsicObject->dump_mem(), 21);
            } //END OF if($objectType_code_from_ExtrinsicObject=="XDSDocumentEntry")
            if ($objectType_code_from_RegistryPackage == "XDSSubmissionSet") {
                writeTimeFile($idfile . "--DOCUMENTENTRY_XDSSubmissionSet_" . $rr);
                writeSQLQueryService("\nSono nel caso XDSSubmissionSet");
                $RegistryPackage_id = $SQLResponse[$rr][0];
                $dom_ebXML_RegistryPackage = domxml_new_doc("1.0");
                //# ROOT
                $dom_ebXML_RegistryPackage_root = $dom_ebXML_RegistryPackage->create_element("RegistryPackage");
                $dom_ebXML_RegistryPackage_root = $dom_ebXML_RegistryPackage->append_child($dom_ebXML_RegistryPackage_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_RegistryPackage_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_RegistryPackage_root->add_namespace($ns_q_path, $ns_q);
                //###OTTENGO DAL DB GLI ATTRIBUTI DI RegistryPackage
                $queryForRegistryPackageAttributes = "SELECT majorVersion,minorVersion,objectType,status FROM RegistryPackage WHERE RegistryPackage.id = '$RegistryPackage_id'";
                $RegistryPackageAttributes = query_select2($queryForRegistryPackageAttributes, $connessione);
                writeSQLQueryService($queryForRegistryPackageAttributes);
                //$RegistryPackage_isOpaque = $RegistryPackageAttributes[0]['isOpaque'];
                $RegistryPackage_majorVersion = $RegistryPackageAttributes[0][0];
                //$RegistryPackage_mimeType = $RegistryPackageAttributes[0]['mimeType'];
                $RegistryPackage_minorVersion = $RegistryPackageAttributes[0][1];
                $RegistryPackage_objectType = $RegistryPackageAttributes[0][2];
                $RegistryPackage_status = $RegistryPackageAttributes[0][3];
                $dom_ebXML_RegistryPackage_root->set_attribute("id", $RegistryPackage_id);
                //$dom_ebXML_RegistryPackage_root->set_attribute("isOpaque",$RegistryPackage_isOpaque);
                $dom_ebXML_RegistryPackage_root->set_attribute("majorVersion", $RegistryPackage_majorVersion);
                //$dom_ebXML_RegistryPackage_root->set_attribute("mimeType",$RegistryPackage_mimeType);
                $dom_ebXML_RegistryPackage_root->set_attribute("minorVersion", $RegistryPackage_minorVersion);
                //$dom_ebXML_RegistryPackage_root->set_attribute("objectType",$RegistryPackage_objectType);
                $dom_ebXML_RegistryPackage_root->set_attribute("status", $RegistryPackage_status);
                appendName($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_root, $ns_rim_path, $RegistryPackage_id, $connessione);
                appendDescription($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_root, $ns_rim_path, $RegistryPackage_id, $connessione);
                appendSlot($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_root, $ns_rim_path, $RegistryPackage_id, $connessione);
                //### GESTISCO IL CASO IN CUI DEVO RITORNARE OGGETTI COMPOSTI
                if ($returnComposedObjects_a == "true") {
                    //### CLASSIFICATION + EXTERNALIDENTIFIER + OBJECTREF
                    //##### NODI CLASSIFICATION
                    writeTimeFile($idfile . "--DOCUMENTENTRY_XDSSubmissionSet_composedObject_" . $rr);
                    writeSQLQueryService("\nCiclo su Classification di RegistryPackage");
                    $get_RegistryPackage_Classification = "SELECT classificationScheme,classificationNode,classifiedObject,id,nodeRepresentation,objectType FROM Classification WHERE Classification.classifiedObject = '$RegistryPackage_id'";
                    $RegistryPackage_Classification_arr = query_select2($get_RegistryPackage_Classification, $connessione);
                    writeSQLQueryService($get_RegistryPackage_Classification);
                    //### CICLO SU TUTTI I NODI CLASSIFICATION
                    $RegistryPackage_Classification_arr_count = count($RegistryPackage_Classification_arr);
                    for ($t = 0; $t < $RegistryPackage_Classification_arr_count; $t++) {
                        writeTimeFile($idfile . "--DOCUMENTENTRY_XDSSubmissionSet_composedObject_nodoClassification_" . $rr . "_" . $t);
                        $RegistryPackage_Classification = $RegistryPackage_Classification_arr[$t];
                        $dom_ebXML_RegistryPackage_Classification = $dom_ebXML_RegistryPackage->create_element_ns($ns_rim_path, "Classification");
                        $dom_ebXML_RegistryPackage_Classification = $dom_ebXML_RegistryPackage_root->append_child($dom_ebXML_RegistryPackage_Classification);
                        //### ATTRIBUTI DI CLASSIFICATION
                        $RegistryPackage_Classification_classificationScheme = $RegistryPackage_Classification[0];
                        $RegistryPackage_Classification_classificationNode = $RegistryPackage_Classification[1];
                        //### PREPARO PER OBJECTREF
                        $RegistryPackage_Classification_classificationScheme_ARR_1[$RegistryPackage_Classification_classificationScheme] = $RegistryPackage_Classification_classificationScheme;
                        $RegistryPackage_Classification_classificationScheme_ARR_2[] = $RegistryPackage_Classification_classificationScheme;
                        $RegistryPackage_Classification_classificationNode_ARR_1[$RegistryPackage_Classification_classificationNode] = $RegistryPackage_Classification_classificationNode;
                        $RegistryPackage_Classification_classificationNode_ARR_2[] = $RegistryPackage_Classification_classificationNode;
                        $RegistryPackage_Classification_classifiedObject = $RegistryPackage_Classification[2];
                        $RegistryPackage_Classification_id = $RegistryPackage_Classification[3];
                        $RegistryPackage_Classification_nodeRepresentation = $RegistryPackage_Classification[4];
                        $RegistryPackage_Classification_objectType = $RegistryPackage_Classification[5];
                        $dom_ebXML_RegistryPackage_Classification->set_attribute("classificationScheme", $RegistryPackage_Classification_classificationScheme);
                        $dom_ebXML_RegistryPackage_Classification->set_attribute("classificationNode", $RegistryPackage_Classification_classificationNode);
                        $dom_ebXML_RegistryPackage_Classification->set_attribute("classifiedObject", $RegistryPackage_Classification_classifiedObject);
                        $dom_ebXML_RegistryPackage_Classification->set_attribute("id", $RegistryPackage_Classification_id);
                        $dom_ebXML_RegistryPackage_Classification->set_attribute("nodeRepresentation", $RegistryPackage_Classification_nodeRepresentation);
                        $dom_ebXML_RegistryPackage_Classification->set_attribute("objectType", $RegistryPackage_Classification_objectType);
                        appendName_Classification($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_Classification, $ns_rim_path, $RegistryPackage_Classification_id, $connessione);
                        appendDescription_Classification($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_Classification, $ns_rim_path, $RegistryPackage_Classification_id, $connessione);
                        appendSlot_Classification($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_Classification, $ns_rim_path, $RegistryPackage_Classification_id, $connessione);
                    } //END OF for($t=0;$t<count($RegistryPackage_Classification_arr);$t++)
                    //### NODI EXTERNALIDENTIFIER
                    writeSQLQueryService("\nCiclo su ExternalIdentifier di RegistryPackage");
                    $get_RegistryPackage_ExternalIdentifier = "SELECT identificationScheme,objectType,id,value FROM ExternalIdentifier WHERE ExternalIdentifier.registryObject = '$RegistryPackage_id'";
                    $RegistryPackage_ExternalIdentifier_arr = query_select2($get_RegistryPackage_ExternalIdentifier, $connessione);
                    writeSQLQueryService($get_RegistryPackage_ExternalIdentifier);
                    //### CICLO SU TUTTI I NODI EXTERNALIDENTIFIER
                    $RegistryPackage_ExternalIdentifier_arr_count = count($RegistryPackage_ExternalIdentifier_arr);
                    for ($e = 0; $e < $RegistryPackage_ExternalIdentifier_arr_count; $e++) {
                        writeTimeFile($idfile . "--DOCUMENTENTRY_XDSSubmissionSet_composedObject_nodoExternalIdentifier_" . $rr . "_" . $e);
                        $RegistryPackage_ExternalIdentifier = $RegistryPackage_ExternalIdentifier_arr[$e];
                        $dom_ebXML_RegistryPackage_ExternalIdentifier = $dom_ebXML_RegistryPackage->create_element_ns($ns_rim_path, "ExternalIdentifier");
                        $dom_ebXML_RegistryPackage_ExternalIdentifier = $dom_ebXML_RegistryPackage_root->append_child($dom_ebXML_RegistryPackage_ExternalIdentifier);
                        //### ATTRIBUTI DI EXTERNALIDENTIFIER
                        $RegistryPackage_ExternalIdentifier_identificationScheme = $RegistryPackage_ExternalIdentifier[0];
                        //### PREPARO PER OBJECTREF
                        $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1[$RegistryPackage_ExternalIdentifier_identificationScheme] = $RegistryPackage_ExternalIdentifier_identificationScheme;
                        $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_2[] = $RegistryPackage_ExternalIdentifier_identificationScheme;
                        $RegistryPackage_ExternalIdentifier_objectType = $RegistryPackage_ExternalIdentifier[1];
                        $RegistryPackage_ExternalIdentifier_id = $RegistryPackage_ExternalIdentifier[2];
                        $RegistryPackage_ExternalIdentifier_value = $RegistryPackage_ExternalIdentifier[3];
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("identificationScheme", $RegistryPackage_ExternalIdentifier_identificationScheme);
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("objectType", $RegistryPackage_ExternalIdentifier_objectType);
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("id", $RegistryPackage_ExternalIdentifier_id);
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("value", $RegistryPackage_ExternalIdentifier_value);
                        appendName_ExternalIdentifier($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_ExternalIdentifier, $ns_rim_path, $RegistryPackage_ExternalIdentifier_id, $connessione);
                        appendDescription_ExternalIdentifier($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_ExternalIdentifier, $ns_rim_path, $RegistryPackage_ExternalIdentifier_id, $connessione);
                    }
                } //END OF if($returnComposedObjects_a=="true")
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_RegistryPackage->dump_mem(), 21);
            } //END OF if($objectType_code_from_RegistryPackage=="XDSSubmissionSet")
            if ($objectType_code_from_RegistryPackage == "XDSFolder") {
                writeTimeFile($idfile . "--DOCUMENTENTRY_XDSFolder_" . $rr);
                writeSQLQueryService("\nSono nel caso XDSFolder");
                $RegistryPackage_id = $SQLResponse[$rr][0];
                $dom_ebXML_RegistryPackage = domxml_new_doc("1.0");
                //# ROOT
                $dom_ebXML_RegistryPackage_root = $dom_ebXML_RegistryPackage->create_element("RegistryPackage");
                $dom_ebXML_RegistryPackage_root = $dom_ebXML_RegistryPackage->append_child($dom_ebXML_RegistryPackage_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_RegistryPackage_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_RegistryPackage_root->add_namespace($ns_q_path, $ns_q);
                //###OTTENGO DAL DB GLI ATTRIBUTI DI RegistryPackage
                $queryForRegistryPackageAttributes = "SELECT majorVersion,minorVersion,objectType,status FROM RegistryPackage WHERE RegistryPackage.id = '$RegistryPackage_id'";
                $RegistryPackageAttributes = query_select2($queryForRegistryPackageAttributes, $connessione);
                writeSQLQueryService($queryForRegistryPackageAttributes);
                //$RegistryPackage_isOpaque = $RegistryPackageAttributes[0]['isOpaque'];
                $RegistryPackage_majorVersion = $RegistryPackageAttributes[0][0];
                //$RegistryPackage_mimeType = $RegistryPackageAttributes[0]['mimeType'];
                $RegistryPackage_minorVersion = $RegistryPackageAttributes[0][1];
                $RegistryPackage_objectType = $RegistryPackageAttributes[0][2];
                $RegistryPackage_status = $RegistryPackageAttributes[0][3];
                $dom_ebXML_RegistryPackage_root->set_attribute("id", $RegistryPackage_id);
                //$dom_ebXML_RegistryPackage_root->set_attribute("isOpaque",$RegistryPackage_isOpaque);
                $dom_ebXML_RegistryPackage_root->set_attribute("majorVersion", $RegistryPackage_majorVersion);
                //$dom_ebXML_RegistryPackage_root->set_attribute("mimeType",$RegistryPackage_mimeType);
                $dom_ebXML_RegistryPackage_root->set_attribute("minorVersion", $RegistryPackage_minorVersion);
                //$dom_ebXML_RegistryPackage_root->set_attribute("objectType",$RegistryPackage_objectType);
                $dom_ebXML_RegistryPackage_root->set_attribute("status", $RegistryPackage_status);
                appendName($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_root, $ns_rim_path, $RegistryPackage_id, $connessione);
                appendDescription($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_root, $ns_rim_path, $RegistryPackage_id, $connessione);
                appendSlot($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_root, $ns_rim_path, $RegistryPackage_id, $connessione);
                //### GESTISCO IL CASO IN CUI DEVO RITORNARE OGGETTI COMPOSTI
                if ($returnComposedObjects_a == "true") {
                    writeTimeFile($idfile . "--DOCUMENTENTRY_XDSFolder_composedObjet_" . $rr);
                    //### CLASSIFICATION + EXTERNALIDENTIFIER + OBJECTREF
                    //##### NODI CLASSIFICATION
                    $get_RegistryPackage_Classification = "SELECT classificationScheme,classificationNode,classifiedObject,id,nodeRepresentation,objectType FROM Classification WHERE Classification.classifiedObject = '$RegistryPackage_id'";
                    $RegistryPackage_Classification_arr = query_select2($get_RegistryPackage_Classification, $connessione);
                    writeSQLQueryService($get_RegistryPackage_Classification);
                    if (!empty($RegistryPackage_Classification_arr)) {
                        //### CICLO SU TUTTI I NODI CLASSIFICATION
                        $RegistryPackage_Classification_arr_count = count($RegistryPackage_Classification_arr);
                        for ($t = 0; $t < $RegistryPackage_Classification_arr_count; $t++) {
                            writeTimeFile($idfile . "--DOCUMENTENTRY_XDSFolder_composedObjet_nodoClassification_" . $rr . "_" . $t);
                            $RegistryPackage_Classification = $RegistryPackage_Classification_arr[$t];
                            $dom_ebXML_RegistryPackage_Classification = $dom_ebXML_RegistryPackage->create_element_ns($ns_rim_path, "Classification");
                            $dom_ebXML_RegistryPackage_Classification = $dom_ebXML_RegistryPackage_root->append_child($dom_ebXML_RegistryPackage_Classification);
                            //### ATTRIBUTI DI CLASSIFICATION
                            $RegistryPackage_Classification_classificationScheme = $RegistryPackage_Classification[0];
                            $RegistryPackage_Classification_classificationNode = $RegistryPackage_Classification[1];
                            //### PREPARO PER OBJECTREF
                            $RegistryPackage_Classification_classificationScheme_ARR_1[$RegistryPackage_Classification_classificationScheme] = $RegistryPackage_Classification_classificationScheme;
                            $RegistryPackage_Classification_classificationScheme_ARR_2[] = $RegistryPackage_Classification_classificationScheme;
                            $RegistryPackage_Classification_classificationNode_ARR_1[$RegistryPackage_Classification_classificationNode] = $RegistryPackage_Classification_classificationNode;
                            $RegistryPackage_Classification_classificationNode_ARR_2[] = $RegistryPackage_Classification_classificationNode;
                            $RegistryPackage_Classification_classifiedObject = $RegistryPackage_Classification[2];
                            $RegistryPackage_Classification_id = $RegistryPackage_Classification[3];
                            $RegistryPackage_Classification_nodeRepresentation = $RegistryPackage_Classification[4];
                            $RegistryPackage_Classification_objectType = $RegistryPackage_Classification[5];
                            $dom_ebXML_RegistryPackage_Classification->set_attribute("classificationScheme", $RegistryPackage_Classification_classificationScheme);
                            $dom_ebXML_RegistryPackage_Classification->set_attribute("classificationNode", $RegistryPackage_Classification_classificationNode);
                            $dom_ebXML_RegistryPackage_Classification->set_attribute("classifiedObject", $RegistryPackage_Classification_classifiedObject);
                            $dom_ebXML_RegistryPackage_Classification->set_attribute("id", $RegistryPackage_Classification_id);
                            $dom_ebXML_RegistryPackage_Classification->set_attribute("nodeRepresentation", $RegistryPackage_Classification_nodeRepresentation);
                            $dom_ebXML_RegistryPackage_Classification->set_attribute("objectType", $RegistryPackage_Classification_objectType);
                            appendName_Classification($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_Classification, $ns_rim_path, $RegistryPackage_Classification_id, $connessione);
                            appendDescription_Classification($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_Classification, $ns_rim_path, $RegistryPackage_Classification_id, $connessione);
                            appendSlot_Classification($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_Classification, $ns_rim_path, $RegistryPackage_Classification_id, $connessione);
                        }
                    } //END OF if(!empty($RegistryPackage_Classification_arr))
                    //### NODI EXTERNALIDENTIFIER
                    $get_RegistryPackage_ExternalIdentifier = "SELECT identificationScheme,objectType,id,value FROM ExternalIdentifier WHERE ExternalIdentifier.registryObject = '$RegistryPackage_id'";
                    $RegistryPackage_ExternalIdentifier_arr = query_select2($get_RegistryPackage_ExternalIdentifier, $connessione);
                    writeSQLQueryService($get_RegistryPackage_ExternalIdentifier);
                    //### CICLO SU TUTTI I NODI EXTERNALIDENTIFIER
                    $RegistryPackage_ExternalIdentifier_arr_count = count($RegistryPackage_ExternalIdentifier_arr);
                    for ($e = 0; $e < $RegistryPackage_ExternalIdentifier_arr_count; $e++) {
                        writeTimeFile($idfile . "--DOCUMENTENTRY_XDSFolder_composedObjet_nodoExternalIdentifier_" . $rr . "_" . $e);
                        $RegistryPackage_ExternalIdentifier = $RegistryPackage_ExternalIdentifier_arr[$e];
                        $dom_ebXML_RegistryPackage_ExternalIdentifier = $dom_ebXML_RegistryPackage->create_element_ns($ns_rim_path, "ExternalIdentifier");
                        $dom_ebXML_RegistryPackage_ExternalIdentifier = $dom_ebXML_RegistryPackage_root->append_child($dom_ebXML_RegistryPackage_ExternalIdentifier);
                        //### ATTRIBUTI DI EXTERNALIDENTIFIER
                        $RegistryPackage_ExternalIdentifier_identificationScheme = $RegistryPackage_ExternalIdentifier[0];
                        //### PREPARO PER OBJECTREF
                        $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1[$RegistryPackage_ExternalIdentifier_identificationScheme] = $RegistryPackage_ExternalIdentifier_identificationScheme;
                        $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_2[] = $RegistryPackage_ExternalIdentifier_identificationScheme;
                        $RegistryPackage_ExternalIdentifier_objectType = $RegistryPackage_ExternalIdentifier[1];
                        $RegistryPackage_ExternalIdentifier_id = $RegistryPackage_ExternalIdentifier[2];
                        $RegistryPackage_ExternalIdentifier_value = $RegistryPackage_ExternalIdentifier[3];
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("identificationScheme", $RegistryPackage_ExternalIdentifier_identificationScheme);
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("objectType", $RegistryPackage_ExternalIdentifier_objectType);
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("id", $RegistryPackage_ExternalIdentifier_id);
                        $dom_ebXML_RegistryPackage_ExternalIdentifier->set_attribute("value", $RegistryPackage_ExternalIdentifier_value);
                        appendName_ExternalIdentifier($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_ExternalIdentifier, $ns_rim_path, $RegistryPackage_ExternalIdentifier_id, $connessione);
                        appendDescription_ExternalIdentifier($dom_ebXML_RegistryPackage, $dom_ebXML_RegistryPackage_ExternalIdentifier, $ns_rim_path, $RegistryPackage_ExternalIdentifier_id, $connessione);
                    }
                } //END OF if($returnComposedObjects_a=="true")
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_RegistryPackage->dump_mem(), 21);
            } //END OF if($objectType_code_from_RegistryPackage=="XDSFolder")
            //#### ASSOCIATION
            if ($objectType_from_Association == "Association") {
                writeTimeFile($idfile . "--DOCUMENTENTRY_Association_" . $rr);
                writeSQLQueryService("\nSono nel caso Association");
                $Association_id = $SQLResponse[$rr][0];
                $dom_ebXML_Association = domxml_new_doc("1.0");
                //# ROOT
                $dom_ebXML_Association_root = $dom_ebXML_Association->create_element("Association");
                $dom_ebXML_Association_root = $dom_ebXML_Association->append_child($dom_ebXML_Association_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_Association_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_Association_root->add_namespace($ns_q_path, $ns_q);
                //###OTTENGO DAL DB GLI ATTRIBUTI DI Association
                $queryForAssociationAttributes = "SELECT associationType,objectType,sourceObject,targetObject FROM Association WHERE Association.id = '$Association_id'";
                $AssociationAttributes = query_select2($queryForAssociationAttributes, $connessione);
                writeSQLQueryService($queryForAssociationAttributes);
                $Association_associationType = $AssociationAttributes[0][0];
                $Association_objectType = $AssociationAttributes[0][1];
                $Association_sourceObject = $AssociationAttributes[0][2];
                $Association_targetObject = $AssociationAttributes[0][3];
                $dom_ebXML_Association_root->set_attribute("id", $Association_id);
                $dom_ebXML_Association_root->set_attribute("associationType", $Association_associationType);
                $dom_ebXML_Association_root->set_attribute("objectType", $Association_objectType);
                $dom_ebXML_Association_root->set_attribute("sourceObject", $Association_sourceObject);
                $dom_ebXML_Association_root->set_attribute("targetObject", $Association_targetObject);
                //### PREPARO PER OBJECTREF
                $Association_sourceObject_ARR_1[$Association_sourceObject] = $Association_sourceObject;
                $Association_sourceObject_ARR_2[] = $Association_sourceObject;
                $Association_targetObject_ARR_1[$Association_targetObject] = $Association_targetObject;
                $Association_targetObject_ARR_2[] = $Association_targetObject;
                //#################################################
                appendName($dom_ebXML_Association, $dom_ebXML_Association_root, $ns_rim_path, $Association_id, $connessione);
                appendDescription($dom_ebXML_Association, $dom_ebXML_Association_root, $ns_rim_path, $Association_id, $connessione);
                appendSlot($dom_ebXML_Association, $dom_ebXML_Association_root, $ns_rim_path, $Association_id, $connessione);
                //### CONCATENO LE STRINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_Association->dump_mem(), 21);
            } //END OF if($objectType_from_Association=="Association")

        } //END OF for ($rr = 0; $rr < $SQLResponse_arr_count; $rr++)
        //### NO NODI CLASSIFICATION
        //##########################################################################################################################################################
        //########################### INSERISCO GLI OBJECTREF
        writeTimeFile($idfile . "--INSERISCO GLI OBJECTREF");
        writeTimeFile($idfile . "--EXTRINSICOBJECT");
        //#### EXTRINSICOBJECT
        if (!empty($ExtrinsicObject_Classification_classificationScheme_ARR_1) && !empty($ExtrinsicObject_Classification_classificationNode_ARR_1) && !empty($ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_1)) {
            //## classificationScheme
            $ExtrinsicObject_Classification_classificationScheme_ARR_1_count = count($ExtrinsicObject_Classification_classificationScheme_ARR_1);
            for ($d = 0; $d < $ExtrinsicObject_Classification_classificationScheme_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--EXTRINSICOBJECT_schemeClassification_" . $d);
                //### ID
                $classificationScheme = $ExtrinsicObject_Classification_classificationScheme_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $classificationScheme);
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //## classificationScheme
            //## classificationNode
            $ExtrinsicObject_Classification_classificationNode_ARR_1_count = count($ExtrinsicObject_Classification_classificationNode_ARR_1);
            for ($d = 0; $d < $ExtrinsicObject_Classification_classificationNode_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--EXTRINSICOBJECT_nodoClassification_" . $d);
                //### ID
                $classificationNode = $ExtrinsicObject_Classification_classificationNode_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $classificationNode);
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //## classificationNode
            //### identificationScheme
            $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_1_count = count($ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_1);
            for ($d = 0; $d < $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--EXTRINSICOBJECT_identificationScheme_" . $d);
                //### ID
                $identificationScheme = $ExtrinsicObject_ExternalIdentifier_identificationScheme_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $identificationScheme);
                //### CONCATENO LE STRINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //### identificationScheme

        } //#### EXTRINSICOBJECT
        writeTimeFile($idfile . "--REGISTRYPACKAGE");
        //##### REGISTRYPACKAGE
        if (!empty($RegistryPackage_Classification_classificationScheme_ARR_1) && !empty($RegistryPackage_Classification_classificationNode_ARR_1) && !empty($RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1)) {
            //## classificationScheme
            $RegistryPackage_Classification_classificationScheme_ARR_1_count = count($RegistryPackage_Classification_classificationScheme_ARR_1);
            for ($d = 0; $d < $RegistryPackage_Classification_classificationScheme_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--REGISTRYPACKAGE_schemeClassification_" . $d);
                //### ID
                $classificationScheme = $RegistryPackage_Classification_classificationScheme_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $classificationScheme);
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //## classificationScheme
            //## classificationNode
            $RegistryPackage_Classification_classificationNode_ARR_1_count = count($RegistryPackage_Classification_classificationNode_ARR_1);
            for ($d = 0; $d < $RegistryPackage_Classification_classificationNode_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--REGISTRYPACKAGE_nodoClassification_" . $d);
                //### ID
                $classificationNode = $RegistryPackage_Classification_classificationNode_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $classificationNode);
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //## classificationNode
            //### identificationScheme
            $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1_count = count($RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1);
            for ($d = 0; $d < $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--REGISTRYPACKAGE_identificationScheme_" . $d);
                //### ID
                $identificationScheme = $RegistryPackage_ExternalIdentifier_identificationScheme_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $identificationScheme);
                //### CONCATENO LE STRINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //### identificationScheme

        } //#### REGISTRYPACKAGE
        writeTimeFile($idfile . "--ASSOCIATION");
        //#### ASSOCIATION
        if (!empty($Association_sourceObject_ARR_1) && !empty($Association_targetObject_ARR_1)) {
            //## sourceObject
            $Association_sourceObject_ARR_1_count = count($Association_sourceObject_ARR_1);
            for ($d = 0; $d < $Association_sourceObject_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--ASSOCIATION_sourceObject_" . $d);
                //### ID
                $sourceObject = $Association_sourceObject_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $sourceObject);
                //### CONCATENO LE STINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //## sourceObject
            //### targetObject
            $Association_targetObject_ARR_1_count = count($Association_targetObject_ARR_1);
            for ($d = 0; $d < $Association_targetObject_ARR_1_count; $d++) {
                writeTimeFile($idfile . "--ASSOCIATION_targetObject_" . $d);
                //### ID
                $targetObject = $Association_targetObject_ARR_2[$d];
                $dom_ebXML_ObjectRef = domxml_new_doc("1.0");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->create_element("ObjectRef");
                $dom_ebXML_ObjectRef_root = $dom_ebXML_ObjectRef->append_child($dom_ebXML_ObjectRef_root);
                //### SETTO I NAMESPACES
                $dom_ebXML_ObjectRef_root->set_namespace($ns_rim_path, $ns_rim);
                $dom_ebXML_ObjectRef_root->add_namespace($ns_q_path, $ns_q);
                $dom_ebXML_ObjectRef_root->set_attribute("id", $targetObject);
                //### CONCATENO LE STRINGHE RISULTANTI
                $ebXML_Response_string = $ebXML_Response_string . substr($dom_ebXML_ObjectRef->dump_mem(), 21);
            } //### targetObject

        } //ASSOCIATION
        //########################### FINE INSERISCO GLI OBJECTREF
        writeTimeFile($idfile . "--Fine_LeafClass");
    } //END OF if($returnType_a=="LeafClass")
    // ATNA Query
    if ($ATNA_active == 'A') {
        writeTimeFile($idfile . "--Inizio_ATNA");
        $today = date("Y-m-d");
        $cur_hour = date("H:i:s");
        $datetime = $today . "T" . $cur_hour;
        require_once ('./lib/syslog.php');
        $syslog = new Syslog();
        $message_query = "<AuditMessage xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"healthcare-security-audit.xsd\">
        <EventIdentification EventActionCode=\"E\" EventDateTime=\"$datetime\" EventOutcomeIndicator=\"0\">
        <EventID code=\"110112\" codeSystemName=\"DCM\" displayName=\"Query\"/>
        <EventTypeCode code=\"ITI-16\" codeSystemName=\"IHE Transactions\" displayName=\"Registry SQL Query\"/>
        </EventIdentification>
        <AuditSourceIdentification AuditSourceID=\"EL.CO. REGISTRY\"/>
        <ActiveParticipant UserID=\"EL.CO. GALLERY\" NetworkAccessPointTypeCode=\"2\" NetworkAccessPointID=\"" . $_SERVER['REMOTE_ADDR'] . "\"  UserIsRequestor=\"true\">
        <RoleIDCode code=\"110153\" codeSystemName=\"DCM\" displayName=\"Source\"/>
        </ActiveParticipant>
        <ActiveParticipant UserID=\"" . $http_protocol . $ip_server . ":" . $port_server . $www_REG_path . "\" NetworkAccessPointTypeCode=\"2\" NetworkAccessPointID=\"" . $reg_host . "\"  UserIsRequestor=\"false\">
        <RoleIDCode code=\"110152\" codeSystemName=\"DCM\" displayName=\"Destination\"/>
        </ActiveParticipant>
        <ParticipantObjectIdentification ParticipantObjectID=\"empty\" ParticipantObjectTypeCode=\"2\" ParticipantObjectTypeCodeRole=\"24\">
        <ParticipantObjectIDTypeCode code=\"ITI-16\" codeSystemName=\"IHE Transactions\" displayName=\"Registry SQL Query\"/>
        <ParticipantObjectQuery>" . base64_encode($SQLQuery_ESEGUITA) . "</ParticipantObjectQuery>        </ParticipantObjectIdentification>
        </AuditMessage>";
        // ParticipantObjectID da TF deve essere vuoto ma non valida da syslog nist
        //manca la parte relativa al recupero del patientID.  <ParticipantObjectIdentification ParticipantObjectID=\"".trim($patient_id)."\" ParticipantObjectTypeCode=\"1\" ParticipantObjectTypeCodeRole=\"1\"><ParticipantObjectIDTypeCode code=\"2\"/></ParticipantObjectIdentification>
        $logSyslog = $syslog->Send($ATNA_host, $ATNA_port, $message_query);
        writeTimeFile($idfile . "--Fine_ATNA");
    } // Fine if($ATNA_active=='A')
    //################# END OF REGISTRY RESPONSE TO QUERY ####################
    //Statistiche
    if ($statActive == "A") {
        //Parte per calcolare i tempi di esecuzione
        $endtime = microtime(true);
        $totaltime = number_format($endtime - $starttime, 15);
        $STAT_QUERY = "INSERT INTO STATS (REPOSITORY,EXECUTION_TIME,OPERATION) VALUES ('" . $_SERVER['REMOTE_ADDR'] . "','$totaltime','QUERY')";
        $ris = query_exec2($STAT_QUERY, $connessione);
        writeSQLQueryService($ris . ": " . $STAT_QUERY);
    }
    //#### IMBUSTO PER LA SPEDIZIONE
    $ebXML_Response_SOAPED_string = makeSoapedSuccessQueryResponse($ebXML_Response_string);
    //####################################################################
    //################### RISPONDO ALLA QUERY ############################
    //##### SCRIVO L'ebXML IMBUSTATO SOAP
    writeTmpQueryFiles($ebXML_Response_SOAPED_string, $idfile . "-ebxmlResponseSOAP.xml");
    // Roberto
    writeTimeFile($idfile . "--Risposta_Creata_Invio");
    SendMessage($ebXML_Response_SOAPED_string, $http);
    writeTimeFile($idfile . "--Risposta_Inviata");
    disconnectDB($connessione);
    unset($_SESSION['tmp_path']);
    unset($_SESSION['idfile']);
    unset($_SESSION['logActive']);
    unset($_SESSION['log_path']);
    unset($_SESSION['tmpQueryService_path']);
    unset($_SESSION['www_REG_path']);
    ob_end_flush();
    // Roberto

?>