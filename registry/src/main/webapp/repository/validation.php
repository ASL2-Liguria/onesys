<?php
//### XDSSubmissionSet.sourceId

function validate_XDSSubmissionSetSourceId($dom, $idfile, $save_files, $connessione)
{
	if ($save_files) {
		$fp_sourceIdQuery = fopen("tmp/" . $idfile . "-SubmissionSetSourceIdQuery-" . $idfile, "w+");
	}
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
	if ($save_files) {
		fwrite($fp_sourceIdQuery, $query);
		fclose($fp_sourceIdQuery);
	}
	//### ESEGUO LA QUERY
	$res = query_select2($query, $connessione); //array bidimensionale
	$bool = (empty($res));
	$ret = array($bool, $ebxml_value);
	return $ret;
} //end of validate_XDSSubmissionSetSourceId($dom_ebXML)
//#############################################################################
//#### XDSDocumentEntry.uniqueId

function validate_XDSDocumentEntryUniqueId($dom, $connessione)
{
	//      $fp_uniqueIdQuery = fopen("tmp/DocumentEntryUniqueIdQuery","w+");
	$ebxml_value = '';
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
									$ebxml_value = $value_value;
								}
							}
						}
					}
				}
			} //END OF if($ExtrinsicObject_child_node_tagname=='ExternalIdentifier')
			
		}
		//QUERY AL DB
		$query = "SELECT XDSDOCUMENTENTRY_UNIQUEID FROM DOCUMENTS WHERE XDSDOCUMENTENTRY_UNIQUEID = '$ebxml_value'";
		//         fwrite($fp_uniqueIdQuery,$query);
		//     fclose($fp_uniqueIdQuery);
		//## EFFETTUO LA QUERY ED OTTENGO IL RISULTATO
		$res = query_select2($query, $connessione); //array bidimensionale
		$isEmpty = ((empty($res)) || $isEmpty);
		if (!$isEmpty) //##---> uniqueId già presente --> eccezione
		{
			$failure = $failure . "\nExternalIdentifier XDSDocumentEntry.uniqueId $ebxml_value (urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab) already exists in registry\n";
		}
	} //END OF for($index=0;$index<(count($dom_ebXML_ExtrinsicObject_node_array));$index++)
	$ret = array($isEmpty, $failure, $ebxml_value);
	return $ret;
} //end of validate_XDSDocumentEntryUniqueId($dom)

?>