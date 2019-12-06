<?php
//### OTTENGO L'OGGETTO DOM DALL'AdhocQueryRequest
//$dom_AdhocQueryRequest = domxml_open_mem($ebxml_STRING);
if (!$dom_AdhocQueryRequest = domxml_open_mem($ebxml_STRING)) {
	writeTimeFile($idfile . "--StoredQuery: AdhocQueryRequest non corretto");
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
} //END OF for($u = 0;$u < count($SQLQuery_options_node_array);$u++)
// Parte per stored query
$SQLQuery_AdhocQuery_node_array = $root->get_elements_by_tagname("AdhocQuery");
$SQLQuery_AdhocQuery = $SQLQuery_AdhocQuery_node_array[0];
$AdhocQuery = $SQLQuery_AdhocQuery->get_attribute("id");
//$fp_Slot_val = fopen($tmpQueryService_path . $idfile . "-Request-" . $idfile, "a+");
$SQLQuery_Slot_node_array = $root->get_elements_by_tagname("Slot");
// Conto quanti slot ci sono
$SQLQuery_Slot_node_array_count = count($SQLQuery_Slot_node_array);
for ($h = 0; $h < $SQLQuery_Slot_node_array_count; $h++) {
	// Considero il singolo Slot
	$SQLQuery_Slot_node = $SQLQuery_Slot_node_array[$h];
	//#### TUTTI I NODI FIGLI DI Slot
	$SQLQuery_Slot_child_nodes = $SQLQuery_Slot_node->child_nodes();
	// Conto quanti figli ha Slot
	$SQLQuery_Slot_child_nodes_count = count($SQLQuery_Slot_child_nodes);
	for ($i = 0; $i < $SQLQuery_Slot_child_nodes_count; $i++) {
		// Considero il singolo elemento
		$SQLQuery_Slot_child_node = $SQLQuery_Slot_child_nodes[$i];
		// Recupero il nome del nodo
		$SQLQuery_Slot_child_node_tagname = $SQLQuery_Slot_child_node->node_name();
		// Se il nome del nodo è ValueList
		if ($SQLQuery_Slot_child_node_tagname == 'ValueList') {
			// Guardo i figli di ValueList
			$SQLQuery_Slot_child_nodes_ValueList = $SQLQuery_Slot_child_node->child_nodes();
			$SQLQuery_Slot_child_nodes_ValueList_count = count($SQLQuery_Slot_child_nodes_ValueList);
			for ($s = 0; $s < $SQLQuery_Slot_child_nodes_ValueList_count; $s++) {
				// Considero il singolo elemento
				$SQLQuery_Slot_child_node_ValueList = $SQLQuery_Slot_child_nodes_ValueList[$s];
				// Recupero il nome del nodo
				$SQLQuery_Slot_child_node_ValueList_tagname = $SQLQuery_Slot_child_node_ValueList->node_name();
				if ($SQLQuery_Slot_child_node_ValueList_tagname == 'Value') {
					$Value[$h][0] = $SQLQuery_Slot_node->get_attribute("name");
					$Value[$h][1] = $SQLQuery_Slot_child_node_ValueList->get_content();
				}
			}
		}
	}
	//    fwrite($fp_Slot_val, $Value[$h][0]);
	//    fwrite($fp_Slot_val, "\n\r");
	//    fwrite($fp_Slot_val, $Value[$h][1]);
	//    fwrite($fp_Slot_val, "\n\r");
	
}
$conta_SlotSQ = count($Value);
$SQLStoredQuery = array();
switch ($AdhocQuery) {
	//*************************FindDocuments******************//
	
case "urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d":
	$AdhocQuery_case = "FindDocuments";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if ($Value[$SQI][0] == "\$XDSDocumentEntryPatientId") {
			$SQPatientID = $Value[$SQI][1];
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryStatus") {
			if (strpos(strtoupper($Value[$SQI][1]), "APPROVED")) {
				$SQEntryStatus = 'Approved';
			} else {
				$SQEntryStatus = 'Deprecated';
			}
		}
	}
	$XDSDocumentEntryClassCode_array = array();
	$SQLStoredQuery_From = "SELECT doc.id FROM ExtrinsicObject doc, ExternalIdentifier patId ";
	$SQLStoredQuery_Required = "WHERE doc.objectType = 'urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1' AND doc.id = patId.registryobject AND patId.identificationScheme='urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND patId.value = " . trim($SQPatientID) . " AND doc.status = '" . trim($SQEntryStatus) . "'";
	$SQLStoredQuery_Optional = "";
	$conta_XDSDocumentEntryClassCode = 0;
	$conta_XDSDocumentEntryClassCodeScheme = 0;
	$conta_XDSDocumentEntryPracticeSettingCode = 0;
	$conta_XDSDocumentEntryPracticeSettingCodeScheme = 0;
	$conta_XDSDocumentEntryHealthcareFacilityTypeCode = 0;
	$conta_XDSDocumentEntryHealthcareFacilityTypeCodeScheme = 0;
	$conta_XDSDocumentEntryEventCodeList = 0;
	$conta_XDSDocumentEntryEventCodeListScheme = 0;
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if ($Value[$SQI][0] == "\$XDSDocumentEntryClassCode") {
			$SQLStoredQuery_From.= ", Classification clCode ";
			$SQLStoredQuery_Optional.= " AND (clCode.classifiedObject = doc.id AND clCode.classificationScheme = 'urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a' AND clCode.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
			if (strpos(trim($Value[$SQI][1]), ",")) {
				$XDSDocumentEntryClassCode_array = explode(",", trim($Value[$SQI][1]));
			} else {
				$XDSDocumentEntryClassCode_array[] = trim($Value[$SQI][1]);
			}
			$conta_XDSDocumentEntryClassCode++;
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryClassCodeScheme") {
			$SQLStoredQuery_From.= ", Slot clCodeScheme ";
			$SQLStoredQuery_Optional.= " AND (clCodeScheme.parent = clCode.id AND clCodeScheme.name = 'codingScheme' AND clCodeScheme.value IN " . trim($Value[$SQI][1]) . ")";
			if (strpos(trim($Value[$SQI][1]), ",")) {
				$XDSDocumentEntryClassCodeScheme_array = explode(",", trim($Value[$SQI][1]));
			} else {
				$XDSDocumentEntryClassCodeScheme_array[] = trim($Value[$SQI][1]);
			}
			$conta_XDSDocumentEntryClassCodeScheme++;
		}
		if (count($XDSDocumentEntryClassCodeScheme_array) > count($XDSDocumentEntryClassCode_array)) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Param number mismatch between ClassCode and ClassCodeScheme throws error";
		}
		//Non ci può essere più di 1 XDSDocumentEntryClassCode o XDSDocumentEntryClassCodeScheme
		if ($conta_XDSDocumentEntryClassCode > 1 || $conta_XDSDocumentEntryClassCodeScheme > 1) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Two ClassCode code Slots";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryPracticeSettingCode") {
			$SQLStoredQuery_From.= ", Classification psc ";
			$SQLStoredQuery_Optional.= " AND (psc.classifiedObject = doc.id AND psc.classificationScheme='urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead' AND psc.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
			$XDSDocumentEntryPracticeSettingCode_array = explode(",", trim($Value[$SQI][1]));
			$conta_XDSDocumentEntryPracticeSettingCode++;
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryPracticeSettingCodeScheme") {
			$SQLStoredQuery_From.= ", Slot psCodeScheme ";
			$SQLStoredQuery_Optional.= " AND (psCodeScheme.parent = psc.id AND psCodeScheme.name = 'codingScheme' AND psCodeScheme.value IN " . trim($Value[$SQI][1]) . ")";
			$XDSDocumentEntryPracticeSettingCodeScheme_array = explode(",", trim($Value[$SQI][1]));
			$conta_XDSDocumentEntryPracticeSettingCodeScheme++;
		}
		if (count($XDSDocumentEntryPracticeSettingCodeScheme_array) > count($XDSDocumentEntryPracticeSettingCode_array)) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Param number mismatch between PracticeSettingCode and PracticeSettingCodeScheme throws error";
		}
		//Non ci può essere più di 1 XDSDocumentEntryPracticeSettingCode o XDSDocumentEntryPracticeSettingCodeScheme
		if ($conta_XDSDocumentEntryPracticeSettingCode > 1 || $conta_XDSDocumentEntryPracticeSettingCodeScheme > 1) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Two PracticeSetting code Slots";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryHealthcareFacilityTypeCode") {
			$SQLStoredQuery_From.= ", Classification hftc ";
			$SQLStoredQuery_Optional.= " AND (hftc.classifiedObject = doc.id AND hftc.classificationScheme = 'urn:uuid:f33fb8ac-18af-42cc-ae0e-ed0b0bdb91e1' AND hftc.nodeRepresentation = " . trim($Value[$SQI][1]) . ")";
			$XDSDocumentEntryHealthcareFacilityTypeCode_array = explode(",", trim($Value[$SQI][1]));
			$conta_XDSDocumentEntryHealthcareFacilityTypeCode++;
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryHealthcareFacilityTypeCodeScheme") {
			$SQLStoredQuery_From.= ", Slot hftcScheme ";
			$SQLStoredQuery_Optional.= " AND (hftcScheme.parent = hftc.id AND hftcScheme.name = 'codingScheme' AND hftcScheme.value IN " . trim($Value[$SQI][1]) . ")";
			$XDSDocumentEntryHealthcareFacilityTypeCodeScheme_array = explode(",", trim($Value[$SQI][1]));
			$conta_XDSDocumentEntryHealthcareFacilityTypeCodeScheme++;
		}
		if (count($XDSDocumentEntryHealthcareFacilityTypeCodeScheme_array) > count($XDSDocumentEntryHealthcareFacilityTypeCode_array)) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Param number mismatch between HealthcareFacilityTypeCode and HealthcareFacilityTypeCodeScheme throws error";
		}
		//Non ci può essere più di 1 XDSDocumentEntryHealthcareFacilityTypeCode o XDSDocumentEntryHealthcareFacilityTypeCodeScheme
		if ($conta_XDSDocumentEntryHealthcareFacilityTypeCode > 1 || $conta_XDSDocumentEntryHealthcareFacilityTypeCodeScheme > 1) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Two HealthcareFacilityTypeCode code Slots";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryEventCodeList") {
			$SQLStoredQuery_From.= ", Classification ecl ";
			$SQLStoredQuery_Optional.= " AND (ecl.classifiedObject = doc.id AND ecl.classificationScheme = 'urn:uuid:2c6b8cb7-8b2a-4051-b291-b1ae6a575ef4' AND ecl.nodeRepresentation = " . trim($Value[$SQI][1]) . ")";
			$conta_XDSDocumentEntryEventCodeList++;
			$XDSDocumentEntryEventCodeList_array = explode(",", trim($Value[$SQI][1]));
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryEventCodeListScheme") {
			$SQLStoredQuery_From.= ", Slot eclScheme ";
			$SQLStoredQuery_Optional.= " AND (eclScheme.parent = ecl.id AND eclScheme.name = 'codingScheme' AND eclScheme.value IN " . trim($Value[$SQI][1]) . ")";
			$XDSDocumentEntryEventCodeListScheme_array = explode(",", trim($Value[$SQI][1]));
			$conta_XDSDocumentEntryEventCodeListScheme++;
		}
		if (count($XDSDocumentEntryEventCodeListScheme_array) > count($XDSDocumentEntryEventCodeList_array)) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Param number mismatch between EventCodeList and EventCodeListScheme throws error";
		}
		//Non ci può essere più di 1 XDSDocumentEntryEventCodeList o XDSDocumentEntryEventCodeListScheme
		if ($conta_XDSDocumentEntryEventCodeListScheme > 1 || $conta_XDSDocumentEntryEventCodeList > 1) {
			$error_code[] = "XDSUnknownStoredQuery";
			$failure_response[] = "Two EntryEventCode code Slots";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryCreationTimeFrom") {
			$SQLStoredQuery_From.= ", Slot crTimef ";
			$SQLStoredQuery_Optional.= " AND (crTimef.parent = doc.id AND crTimef.name = 'creationTime' AND crTimef.value >= '" . trim($Value[$SQI][1]) . "')";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryCreationTimeTo") {
			$SQLStoredQuery_From.= ", Slot crTimet ";
			$SQLStoredQuery_Optional.= " AND (crTimet.parent = doc.id AND crTimet.name = 'creationTime' AND crTimet.value <= '" . trim($Value[$SQI][1]) . "')";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryServiceStartTimeFrom") {
			$SQLStoredQuery_From.= ", Slot serStartTimef ";
			$SQLStoredQuery_Optional.= " AND (serStartTimef.parent = doc.id AND serStartTimef.name = 'serviceStartTime' AND serStartTimef.value >= '" . trim($Value[$SQI][1]) . "')";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryServiceStartTimeTo") {
			$SQLStoredQuery_From.= ", Slot serStartTimet ";
			$SQLStoredQuery_Optional.= " AND (serStartTimet.parent = doc.id AND serStartTimet.name = 'serviceStartTime' AND serStartTimet.value <= '" . trim($Value[$SQI][1]) . "')";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryServiceStopTimeFrom") {
			$SQLStoredQuery_From.= ", Slot serStopTimef ";
			$SQLStoredQuery_Optional.= " AND (serStopTimef.parent = doc.id AND serStopTimef.name = 'serviceStopTime' AND serStopTimef.value >= '" . trim($Value[$SQI][1]) . "')";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryServiceStopTimeTo") {
			$SQLStoredQuery_From.= ", Slot serStopTimet ";
			$SQLStoredQuery_Optional.= " AND (serStopTimet.parent = doc.id AND serStopTimet.name = 'serviceStopTime' AND serStopTimet.value <= '" . trim($Value[$SQI][1]) . "')";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryConfidentialityCode") {
			$SQLStoredQuery_From.= ", Classification conf ";
			$SQLStoredQuery_Optional.= " AND (conf.classifiedObject = doc.id AND conf.classificationScheme = 'urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f' AND conf.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryFormatCode") {
			$SQLStoredQuery_From.= ", Classification fmtCode ";
			$SQLStoredQuery_Optional.= " AND (fmtCode.classifiedObject = doc.id AND fmtCode.classificationScheme = 'urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d' AND fmtCode.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
	}
	$SQLStoredQuery[0] = $SQLStoredQuery_From . $SQLStoredQuery_Required . $SQLStoredQuery_Optional;
	break;
	//*************************FindSubmissionSets******************//
	
case "urn:uuid:f26abbcb-ac74-4422-8a30-edb644bbc1a9":
	$AdhocQuery_case = "FindSubmissionSets";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETPATIENTID")) {
			$SQPatientID = $Value[$SQI][1];
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETSTATUS")) {
			if (strpos(strtoupper($Value[$SQI][1]), "APPROVED")) {
				$SQSubmissionStatus = 'Approved';
			} else {
				$SQSubmissionStatus = 'Deprecated';
			}
		}
	}
	$SQLStoredQuery_From = "SELECT ss.id FROM RegistryPackage ss, ExternalIdentifier patId ";
	$SQLStoredQuery_Required = "WHERE ss.status = '" . trim($SQSubmissionStatus) . "' AND (ss.id = patId.registryobject AND patId.identificationScheme= 'urn:uuid:6b5aea1a-874d-4603-a4bc-96a0a7b38446' AND patId.value = " . trim($SQPatientID) . ")";
	$SQLStoredQuery_Optional = "";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETSOURCEID")) {
			$SQLStoredQuery_From.= ", ExternalIdentifier sid ";
			$SQLStoredQuery_Optional.= " AND (sid.registryobject = ss.id AND sid.identificationScheme = 'urn:uuid:554ac39e-e3fe-47fe-b233-965d2a147832' AND sid.value IN " . trim($Value[$SQI][1]) . ")";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETSUBMISSIONTIMEFROM")) {
			$SQLStoredQuery_From.= ", Slot subTimeFrom ";
			$SQLStoredQuery_Optional.= " AND (subTimeFrom.parent = ss.id AND subTimeFrom.name = 'submissionTime' AND subTimeFrom.value >= '" . trim($Value[$SQI][1]) . "')";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETSUBMISSIONTIMETO")) {
			$SQLStoredQuery_From.= ", Slot subTimeTo ";
			$SQLStoredQuery_Optional.= " AND (subTimeTo.parent = ss.id AND subTimeTo.name = 'submissionTime' AND subTimeTo.value <= '" . trim($Value[$SQI][1]) . "')";
		}
		//AuthoPerson v2.0
		/*if (strpos(strtoupper($Value[$SQI][0]),"XDSSUBMISSIONSETAUTHORPERSON")) {
		$SQLStoredQuery_From .= ", Slot ap ";
		$SQLStoredQuery_Optional .= " AND (ap.parent = ss.id AND ap.name = 'authorPerson' AND ap.value LIKE ".trim($Value[$SQI][1]).")";
		}*/
		//AuthoPerson v3.0
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETAUTHORPERSON")) {
			$SQLStoredQuery_From.= ", Classification author , Slot authorperson ";
			$SQLStoredQuery_Optional.= " AND ss.id = author.classifiedObject AND author.classificationScheme='urn:uuid:a7058bb9-b4e4-4307-ba5b-e3f0ab85e12d' AND authorperson.parent = author.id AND authorperson.name = 'authorPerson' AND authorperson.value LIKE " . trim($Value[$SQI][1]);
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETCONTENTTYPE")) {
			$SQLStoredQuery_From.= ", Classification ctc ";
			$SQLStoredQuery_Optional.= " AND (ctc.classifiedObject = ss.id AND ctc.classificationScheme = 'urn:uuid:aa543740-bdda-424e-8c96-df4873be8500' AND ctc.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
	}
	$SQLStoredQuery[0] = $SQLStoredQuery_From . $SQLStoredQuery_Required . $SQLStoredQuery_Optional;
	break;
	//*************************FindFolders******************//
	
case "urn:uuid:958f3006-baad-4929-a4deff1114824431":
	$AdhocQuery_case = "FindFolders";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSFOLDERPATIENTID")) {
			$SQPatientID = $Value[$SQI][1];
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSFOLDERSTATUS")) {
			if (strpos(strtoupper($Value[$SQI][1]), "APPROVED")) {
				$SQFolderStatus = 'Approved';
			} else {
				$SQFolderStatus = 'Deprecated';
			}
		}
	}
	$SQLStoredQuery_From = "SELECT fol.id FROM RegistryPackage fol, ExternalIdentifier patId ";
	$SQLStoredQuery_Required = "WHERE fol.status = '" . trim($SQFolderStatus) . "' AND (patId.registryobject = fol.id AND patId.identificationScheme = 'urn:uuid:f64ffdf0-4b97-4e06-b79f-a52b38ec2f8a' AND patId.value = '" . trim($SQPatientID) . "')";
	$SQLStoredQuery_Optional = "";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSFOLDERLASTUPDATETIMEFROM")) {
			$SQLStoredQuery_From.= ", Slot lupdateTimef ";
			$SQLStoredQuery_Optional.= " AND (lupdateTimef.parent = fol.id AND lupdateTimef.name = 'lastUpdateTime' AND lupdateTimef.value >= '" . trim($Value[$SQI][1]) . "')";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSFOLDERLASTUPDATETIMETO")) {
			$SQLStoredQuery_From.= ", Slot lupdateTimet ";
			$SQLStoredQuery_Optional.= " AND (lupdateTimet.parent = fol.id AND lupdateTimet.name = 'lastUpdateTime' AND lupdateTimet.value <= '" . trim($Value[$SQI][1]) . "')";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSFOLDERCODELIST")) {
			$SQLStoredQuery_From.= ", Classification cl ";
			$SQLStoredQuery_Optional.= " AND (cl.classifiedObject = fol.id AND cl.classificationScheme = 'urn:uuid:1ba97051-7806-41a8-a48b-8fce7af683c5' AND cl.nodeRepresentation = '" . trim($Value[$SQI][1]) . "')";
		}
		/*Qui andrebbe ????????
		XDSFolderCodeListScheme
		This coding depends on the above clause being included.
		AND (clScheme.parent = cl.id AND clScheme.name = 'codingScheme'
		AND clScheme.value = '".trim($Value[$SQI][1])."')
		*/
	}
	$SQLStoredQuery[0] = $SQLStoredQuery_From . $SQLStoredQuery_Required . $SQLStoredQuery_Optional;
	break;
	//*************************GetAll******************//
	
case "urn:uuid:10b545ea-725c-446d-9b95-8aeb444eddf3":
	$AdhocQuery_case = "GetAll";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "PATIENTID")) {
			$SQPatientID = $Value[$SQI][1];
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYSTATUS")) {
			if (strpos(strtoupper($Value[$SQI][1]), "APPROVED")) {
				$SQEntryStatus = 'Approved';
			} else {
				$SQEntryStatus = 'Deprecated';
			}
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETSTATUS")) {
			if (strpos(strtoupper($Value[$SQI][1]), "APPROVED")) {
				$SQSubmissionStatus = 'Approved';
			} else {
				$SQSubmissionStatus = 'Deprecated';
			}
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSFOLDERSTATUS")) {
			if (strpos(strtoupper($Value[$SQI][1]), "APPROVED")) {
				$SQFolderStatus = 'Approved';
			} else {
				$SQFolderStatus = 'Deprecated';
			}
		}
	}
	// SQL Part1
	$SQLStoredQuery_From_EO = "SELECT eo.id FROM ExtrinsicObject eo, ExternalIdentifier patId ";
	$SQLStoredQuery_Required_EO = "WHERE eo.status = '" . trim($SQEntryStatus) . "' AND (eo.objectType = 'urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1' AND patId.registryObject = eo.id AND patId.identificationScheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND patId.value = " . trim($SQPatientID) . ")";
	$SQLStoredQuery_Optional_EO = "";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYCONFIDENTIALITYCODE")) {
			$SQLStoredQuery_From_EO.= ", Classification cCode ";
			$SQLStoredQuery_Optional_EO.= " AND (cCode.classifiedObject = eo.id AND cCode.classificationScheme = 'urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f' AND cCode.nodeRepresentation = '" . trim($Value[$SQI][1]) . "')";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYFORMATCODE")) {
			$SQLStoredQuery_From_EO.= ", Classification fmtCode ";
			$SQLStoredQuery_Optional_EO.= " AND (fmtCode.classifiedObject = doc.id AND fmtCode.classificationScheme = 'urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d' AND fmtCode.nodeRepresentation = '" . trim($Value[$SQI][1]) . "')";
		}
	}
	$SQLStoredQuery_EO = $SQLStoredQuery_From_EO . $SQLStoredQuery_Required_EO . $SQLStoredQuery_Optional_EO;
	// SQL Part2
	$SQLStoredQuery_From_RP = "SELECT DISTINCT rp.id FROM RegistryPackage rp, Classification cl, ExternalIdentifier patId ";
	$SQLStoredQuery_Required_RP = "WHERE (rp.status = '" . trim($SQSubmissionStatus) . "' AND cl.classifiedObject = rp.id AND cl.classificationNode = 'urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd' AND patId.registryObject = rp.id AND patId.identificationScheme = 'urn:uuid:6b5aea1a-874d-4603-a4bc-96a0a7b38446' AND patId.value = " . trim($SQPatientID) . ") OR (rp.status = '" . trim($SQFolderStatus) . "' AND cl.classifiedObject = rp.id AND cl.classificationNode = 'urn:uuid:d9d542f3-6cc4-48b6-8870-ea235fbc94c2' AND patId.registryObject = rp.id AND patId.identificationScheme = 'urn:uuid:f64ffdf0-4b97-4e06-b79f-a52b38ec2f8a' AND patId.value = " . trim($SQPatientID) . ")";
	$SQLStoredQuery_RP = $SQLStoredQuery_From_RP . $SQLStoredQuery_Required_RP;
	// SQL Part3
	$SQLStoredQuery_From_ASS = "SELECT DISTINCT ass.id FROM Association ass, ExtrinsicObject eo, RegistryPackage ss, RegistryPackage fol ";
	$SQLStoredQuery_Required_ASS = "WHERE ((ass.sourceObject = ss.id AND ass.targetObject = fol.id) OR (ass.sourceObject = ss.id AND ass.targetObject = eo.id) OR (ass.sourceObject = fol.id AND ass.targetObject = eo.id) ) AND eo.id IN (SELECT eo.id FROM ExtrinsicObject eo, ExternalIdentifier patId WHERE eo.status = '" . trim($SQEntryStatus) . "' AND patId.registryObject = eo.id AND patId.identificationScheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND patId.value = " . trim($SQPatientID) . ") AND ss.id IN (SELECT ss.id FROM RegistryPackage ss, ExternalIdentifier patId WHERE ss.status = '" . trim($SQSubmissionStatus) . "' AND patId.registryObject = ss.id AND patId.identificationScheme = 'urn:uuid:6b5aea1a-874d-4603-a4bc-96a0a7b38446' AND patId.value = " . trim($SQPatientID) . ") AND fol.id IN (SELECT fol.id FROM RegistryPackage fol, ExternalIdentifier patId WHERE fol.status = '" . trim($SQFolderStatus) . "' AND patId.registryObject = fol.id AND patId.identificationScheme = 'urn:uuid:f64ffdf0-4b97-4e06-b79f-a52b38ec2f8a' AND patId.value = " . trim($SQPatientID) . ")";
	$SQLStoredQuery_ASS = $SQLStoredQuery_From_ASS . $SQLStoredQuery_Required_ASS;
	$SQLStoredQuery[0] = $SQLStoredQuery_EO;
	$SQLStoredQuery[1] = $SQLStoredQuery_RP;
	$SQLStoredQuery[2] = $SQLStoredQuery_ASS;
	break;
	//*************************GetDocuments******************//
	
case "urn:uuid:5c4f972b-d56b-40ac-a5fc-c8ca9b40b9d4":
	$AdhocQuery_case = "GetDocuments";
	if (strpos(strtoupper($Value[0][0]), "XDSDOCUMENTENTRYENTRYUUID")) {
		$SQLStoredQuery[0] = "SELECT doc.id FROM ExtrinsicObject doc WHERE doc.id IN " . trim($Value[0][1]);
	}
	if (strpos(strtoupper($Value[0][0]), "XDSDOCUMENTENTRYUNIQUEID")) {
		$SQLStoredQuery[0] = "SELECT doc.id FROM ExtrinsicObject doc, ExternalIdentifier uniId WHERE uniId.registryobject = doc.id AND uniId.identificationScheme = 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab' AND uniId.value IN " . trim($Value[0][1]);
	}
	break;
	//*************************GetFolders******************//
	
case "urn:uuid:5737b14c-8a1a-4539-b659-e03a34a5e1e4":
	$AdhocQuery_case = "GetFolders";
	if (strpos(strtoupper($Value[0][0]), "XDSFOLDERENTRYUUID")) {
		$SQLStoredQuery[0] = "SELECT fol.id FROM RegistryPackage fol WHERE fol.id IN " . trim($Value[0][1]);
	} else if (strpos(strtoupper($Value[0][0]), "XDSFOLDERUNIQUEID")) {
		$SQLStoredQuery[0] = "SELECT fol.id from RegistryPackage fol, ExternalIdentifier uniq WHERE uniq.registryObject = fol.id AND uniq.identificationScheme = 'urn:uuid:75df8f67-9973-4fbe-a900-df66cefecc5a' AND uniq.value IN " . trim($Value[0][1]);
	}
	break;
	//*************************GetAssociations******************//
	
case "urn:uuid:a7ae438b-4bc2-4642-93e9-be891f7bb155":
	$AdhocQuery_case = "GetAssociations";
	if (strpos(strtoupper($Value[0][0]), "UUID")) {
		$SQLStoredQuery[0] = "SELECT DISTINCT ass.id FROM Association ass WHERE ass.sourceObject IN " . trim($Value[0][1]) . " OR ass.targetObject IN " . trim($Value[0][1]);
	}
	break;
	//*************************GetDocumentsAndAssociations******************//
	
case "urn:uuid:bab9529a-4a10-40b3-a01f-f68a615d247a":
	$AdhocQuery_case = "GetDocumentsAndAssociations";
	// SQL Part1
	if ($Value[0][0] == "\$XDSDocumentEntryEntryUUID") {
		$SQLStoredQuery[0] = "SELECT doc.id FROM ExtrinsicObject doc WHERE doc.id IN " . trim($Value[0][1]);
	}
	if ($Value[0][0] == "\$XDSDocumentEntryUniqueId") {
		$SQLStoredQuery[0] = "SELECT doc.id FROM ExtrinsicObject doc, ExternalIdentifier uniqId WHERE uniqId.registryobject = doc.id AND uniqId.identificationScheme = 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab' AND uniqId.value IN " . trim($Value[0][1]);
	}
	// SQL Part2
	if ($Value[0][0] == "\$XDSDocumentEntryEntryUUID") {
		$SQLStoredQuery[1] = "SELECT DISTINCT ass.id FROM Association ass WHERE ass.sourceObject IN " . trim($Value[0][1]) . " OR ass.targetObject IN " . trim($Value[0][1]);
	}
	if ($Value[0][0] == "\$XDSDocumentEntryUniqueId") {
		$SQLStoredQuery[1] = "SELECT DISTINCT ass.id FROM Association ass, ExtrinsicObject doc, ExternalIdentifier uniqId WHERE uniqId.registryobject = doc.id AND uniqId.identificationScheme = 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab' AND uniqId.value IN " . trim($Value[0][1]) . " AND (ass.sourceObject = doc.id OR ass.targetObject = doc.id)";
	}
	break;
	//*************************GetSubmissionSets******************//
	
case "urn:uuid:51224314-5390-4169-9b91-b1980040715a":
	$AdhocQuery_case = "GetSubmissionSets";
	// SQL Part1  Da TF non c'è la SQL 2 Non è giusta
	if (strpos(strtoupper($Value[0][0]), "UUID")) {
		$SQLStoredQuery[0] = "SELECT DISTINCT ss.id FROM RegistryPackage ss, Classification c, Association a WHERE c.classifiedObject = ss.id AND c.classificationNode = 'urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd' AND a.sourceObject = ss.id AND a.associationType = 'HasMember' AND a.targetObject IN " . trim($Value[0][1]);
		$REGUUIDs_arr = query_select($SQLStoredQuery[0]);
		$REGUUIDs = "'" . trim($REGUUIDs_arr[0][0]) . "'";
		for ($contaDoc = 1; $contaDoc < count($REGUUIDs_arr); $contaDoc++) {
			$REGUUIDs.= ",'" . trim($REGUUIDs_arr[$contaDoc][0]) . "'";
		}
		// SQL Part2
		$SQLStoredQuery[1] = "SELECT a.id FROM Association a WHERE a.associationType = 'HasMember' AND a.sourceObject IN ($REGUUIDs) AND a.targetObject IN " . trim($Value[0][1]);
	}
	break;
	//*************************GetSubmissionSetAndContents******************//
	
case "urn:uuid:e8e3cb2c-e39c-46b9-99e4-c12f57260b83":
	$AdhocQuery_case = "GetSubmissionSetAndContents";
	// SQL Part1
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETENTRYUUID")) {
			$REGUUID = $Value[$SQI][1];
			$SQLStoredQuery[0] = "SELECT ss.id FROM RegistryPackage ss WHERE ss.id = " . trim($Value[$SQI][1]);
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSSUBMISSIONSETUNIQUEID")) {
			$SQLStoredQuery[0] = "SELECT ss.id FROM RegistryPackage ss, ExternalIdentifier uniq WHERE uniq.registryObject = ss.id AND uniq.identificationScheme = 'urn:uuid:96fdda7c-d067-4183-912e-bf5ee74998a8' AND uniq.value = " . trim($Value[$SQI][1]);
			$REGUUID_arr = query_select($SQLStoredQuery[0]);
			$REGUUID = "'" . $REGUUID_arr[0][0] . "'";
		}
	}
	// SQL Part2
	$SQLStoredQuery_From_EO = "SELECT doc.id FROM ExtrinsicObject doc, Association a  ";
	$SQLStoredQuery_Required_EO = "WHERE a.sourceObject = " . trim($REGUUID) . " AND a.associationType = 'HasMember' AND a.targetObject = doc.id";
	$SQLStoredQuery_Optional_EO = "";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYCONFIDENTIALITYCODE")) {
			$SQLStoredQuery_From_EO.= ", Classification conf ";
			$SQLStoredQuery_Optional_EO.= " AND (conf.classificationScheme = 'urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f' AND conf.classifiedObject = doc.id AND conf.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYFORMATCODE")) {
			$SQLStoredQuery_From_EO.= ", Classification fmtCode ";
			$SQLStoredQuery_Optional_EO.= " AND (fmtCode.classifiedObject = doc.id AND fmtCode.classificationScheme = 'urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d' AND fmtCode.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
	}
	$SQLStoredQuery[1] = $SQLStoredQuery_From_EO . $SQLStoredQuery_Required_EO . $SQLStoredQuery_Optional_EO;
	$DocUUIDs_arr = query_select($SQLStoredQuery[1]);
	// SQL Part3
	$SQLStoredQuery[2] = "SELECT fol.id FROM RegistryPackage fol, Association a WHERE a.associationType = 'HasMember' AND a.sourceObject = " . trim($REGUUID) . " AND a.targetObject = fol.id";
	$FolUUIDs_arr = query_select($SQLStoredQuery[2]);
	// SQL Part4
	$FolUUIDs = "'" . trim($FolUUIDs_arr[0][0]) . "'";
	for ($contaFol = 1; $contaFol < count($FolUUIDs_arr); $contaFol++) {
		$FolUUIDs.= ",'" . trim($FolUUIDs_arr[$contaFol][0]) . "'";
	}
	$DocUUIDs = "'" . trim($DocUUIDs_arr[0][0]) . "'";
	for ($contaDoc = 1; $contaDoc < count($DocUUIDs_arr); $contaDoc++) {
		$DocUUIDs.= ",'" . trim($DocUUIDs_arr[$contaDoc][0]) . "'";
	}
	$SQLStoredQuery[3] = "SELECT ass.id FROM Association ass WHERE ass.associationType = 'HasMember' AND ass.sourceObject = " . trim($REGUUID) . " AND (ass.targetObject IN (" . $DocUUIDs . ") OR ass.targetObject IN (" . $FolUUIDs . "))";
	break;
	//*************************GetFolderAndContents******************//
	
case "urn:uuid:b909a503-523d-4517-8acf-8e5834dfc4c7":
	$AdhocQuery_case = "GetFolderAndContents";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		// SQL Part1
		if (strpos(strtoupper($Value[0][0]), "XDSFOLDERENTRYUUID")) {
			$FolderUUID = trim($Value[0][1]);
			$SQLStoredQuery[0] = "SELECT fol.id FROM RegistryPackage fol WHERE fol.id = " . trim($Value[0][1]);
		}
		if (strpos(strtoupper($Value[0][0]), "XDSFOLDERUNIQUEID")) {
			$SQLStoredQuery[0] = "SELECT fol.id from RegistryPackage fol, ExternalIdentifier uniq WHERE uniq.registryObject = fol.id AND uniq.identificationScheme = 'urn:uuid:75df8f67-9973-4fbe-a900-df66cefecc5a' AND uniq.value = " . trim($Value[0][1]);
			$FolderUUID_arr = query_select($SQLStoredQuery[0]);
			$FolderUUID = "'" . $FolderUUID_arr[0][0] . "'";
			for ($contaFol = 1; $contaFol < count($FolderUUID_arr); $contaFol++) {
				$FolderUUID.= ",'" . trim($FolderUUID_arr[$contaFol][0]) . "'";
			}
		}
		// SQL Part2
		$SQLStoredQuery_From_EO = "SELECT doc.id FROM ExtrinsicObject doc, Association a ";
		$SQLStoredQuery_Required_EO = "WHERE a.sourceObject IN ($FolderUUID) AND a.associationType = 'HasMember' AND a.targetObject = doc.id";
		$SQLStoredQuery_Optional = "";
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYCONFIDENTIALITYCODE")) {
			$SQLStoredQuery_From_EO.= ", Classification conf  ";
			$SQLStoredQuery_Optional_EO.= " AND ( conf.classificationScheme = 'urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f' AND conf.classifiedObject = doc.id AND conf.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYFORMATCODE")) {
			$SQLStoredQuery_From_EO.= ", Classification fmtCode ";
			$SQLStoredQuery_Optional_EO.= " AND (fmtCode.classifiedObject = doc.id AND  fmtCode.classificationScheme = 'urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d' AND fmtCode.nodeRepresentation IN " . trim($Value[$SQI][1]) . ")";
		}
		$SQLStoredQuery[1] = $SQLStoredQuery_From_EO . $SQLStoredQuery_Required_EO . $SQLStoredQuery_Optional_EO;
		$DocUUID_arr = query_select($SQLStoredQuery[1]);
		//$DocUUID = $DocUUID_arr[0][0];
		// SQL Part3
		$DocUUIDs = "'" . trim($DocUUID_arr[0][0]) . "'";
		for ($contaDoc = 1; $contaDoc < count($DocUUID_arr); $contaDoc++) {
			$DocUUIDs.= ",'" . trim($DocUUID_arr[$contaDoc][0]) . "'";
		}
		$SQLStoredQuery[2] = "SELECT ass.id FROM Association ass WHERE ass.associationType = 'HasMember' AND ass.sourceObject IN (" . $FolderUUID . ") AND ass.targetObject IN (" . $DocUUIDs . ")";
	}
	break;
	//*************************GetFoldersForDocument******************//
	
case "urn:uuid:10cae35a-c7f9-4cf5-b61efc3278ffb578":
	$AdhocQuery_case = "GetFoldersForDocument";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		// SQL Part1
		if (strpos(strtoupper($Value[0][0]), "XDSDOCUMENTENTRYENTRYUUID")) {
			$FolderUUID = trim($Value[0][1]);
			$SQLStoredQuery[0] = "SELECT fol.id FROM RegistryPackage fol, Association a, ExtrinsicObject doc, Classification c WHERE doc.id IN (SELECT doc.id FROM ExtrinsicObject doc WHERE doc.id = '" . trim($Value[0][1]) . "')";
		}
		if (strpos(strtoupper($Value[0][0]), "XDSDOCUMENTENTRYUNIQUEID")) {
			$SQLStoredQuery[0] = "SELECT fol.id FROM RegistryPackage fol, Association a, ExtrinsicObject doc, Classification c WHERE doc.id IN (SELECT doc.id FROM ExtrinsicObject doc, ExternalIdentifier uniqId WHERE uniqId.registryobject = doc.id AND uniqId.identificationScheme = 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab' AND uniqId.value = '" . trim($Value[0][1]) . "') AND a.targetObject = doc.id AND a.associationType = 'HasMember' AND a.sourceObject = fol.id AND c.classifiedObject = fol.id AND c.classificationNode = 'urn:uuid:d9d542f3-6cc4-48b6-8870-ea235fbc94c2'";
		}
	}
	break;
	//*************************GetRelatedDocuments******************//
	
case "urn:uuid:d90e5407-b356-4d91-a89f-873917b4b0e6":
	$AdhocQuery_case = "GetRelatedDocuments";
	for ($SQI = 0; $SQI < $conta_SlotSQ; $SQI++) {
		if (strpos(strtoupper($Value[$SQI][0]), "XDSDOCUMENTENTRYENTRYUUID")) {
			$DocUUID = trim($Value[$SQI][1]);
		}
		if ($Value[$SQI][0] == "\$XDSDocumentEntryUniqueId") {
			$SQLSelectDOCID = "SELECT doc.id FROM ExtrinsicObject doc, ExternalIdentifier uniqId WHERE uniqId.registryobject = doc.id AND uniqId.identificationScheme = 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab' AND uniqId.value = " . trim($Value[$SQI][1]);
			$DocUUID_arr = query_select($SQLSelectDOCID);
			$DocUUID = $DocUUID_arr[0][0];
		}
		if (strpos(strtoupper($Value[$SQI][0]), "ASSOCIATIONTYPES")) {
			$SQAssociation = $Value[$SQI][1];
			$pre_ass = "urn:oasis:names:tc:ebxml-regrep:AssociationType:";
			if (strpos($SQAssociation, $pre_ass)) {
				$SQAssociation = str_replace($pre_ass, '', $SQAssociation);
			}
		}
	}
	// SQL Part1
	$SQLStoredQuery[0] = "SELECT DISTINCT a.id FROM Association a, ExtrinsicObject doc WHERE doc.id = '" . trim($DocUUID) . "' AND a.associationType IN " . trim($SQAssociation) . " AND (a.sourceObject = doc.id OR a.targetObject = doc.id)";
	$AssUUID_arr = query_select($SQLStoredQuery[0]);
	// SQL Part2
	$AssUUIDs = "'" . trim($AssUUID_arr[0][0]) . "'";
	for ($contaAss = 1; $contaAss < count($AssUUID_arr); $contaAss++) {
		$AssUUIDs.= ",'" . trim($AssUUID_arr[$contaAss][0]) . "'";
	}
	$SQLStoredQuery[1] = "SELECT DISTINCT doc.id FROM ExtrinsicObject doc, Association a WHERE a.id IN (" . $AssUUIDs . ") AND (doc.id = a.sourceObject OR doc.id = a.targetObject)";
	break;
}
$contaQuery = count($SQLStoredQuery);
//fwrite($fp_Slot_val, $AdhocQuery_case . "\n\r");
//for ($SQcount = 0; $SQcount < $contaQuery; $SQcount++) {
//    fwrite($fp_Slot_val, $SQLStoredQuery[$SQcount] . "\n\r");
//}
//fclose($fp_Slot_val);
writeTimeFile($idfile . "--StoredQuery: Ho creato le query");
?>