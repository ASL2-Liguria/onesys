<?php
//##GIA' INCLUSO IN reg_validation
writeSQLQuery('-------------------------------------------------------------------------------------');
writeSQLQuery('ExtrinsicObject_2.php');
//#### METODO PRINCIPALE

function fill_ExtrinsicObject_tables($dom, $connessione)
{
	//### LANGUAGECODE DI DEFAULT
	$lang = "it-it";
	//#### ARRAY DELL'ATTRIBUTO ID DI EXTRINSICOBJECT
	$ExtrinsicObject_id_array = array();
	$simbolic_ExtrinsicObject_id_array = array();
	//#### ARRAY DEGLI ATTRIBUTI DEL NODO EXTRINSICOBJECT
	$DB_array_extrinsicobject_attributes = array();
	//#### RADICE DEL DOCUMENTO ebXML
	$root_ebXML = $dom->document_element();
	//#### ARRAY DEI NODI EXTRINSICOBJECT
	$dom_ebXML_ExtrinsicObject_node_array = $root_ebXML->get_elements_by_tagname("ExtrinsicObject");
	//#### ARRAY DEI NODI ASSOCIATION
	$dom_ebXML_Association_node_array = $root_ebXML->get_elements_by_tagname("Association");
	if (!empty($dom_ebXML_ExtrinsicObject_node_array)) {
		//### CICLO SU OGNI DOCUMENTO RICEVUTO ####
		writeSQLQuery('Ciclo su ogni documento ricevuto');
		for ($index = 0; $index < (count($dom_ebXML_ExtrinsicObject_node_array)); $index++) {
			//#### NODO EXTRINSICOBJECT RELATIVO AL DOCUMENTO NUMERO $index
			$ExtrinsicObject_node = $dom_ebXML_ExtrinsicObject_node_array[$index];
			//############# RECUPERO TUTTI GLI ATTRIBUTI DEL NODO EXTRINSICOBJECT
			$value_ExtrinsicObject_id = "urn:uuid:" . idrandom();
			$simbolic_ExtrinsicObject_id = $ExtrinsicObject_node->get_attribute('id');
			$simbolic_ExtrinsicObject_id_array[] = $ExtrinsicObject_node->get_attribute('id');
			//############################################################
			//###NOTA BENE NEL CASO NON SIMBOLICO(VEDI SOLINFO)
			if (!isSimbolic($simbolic_ExtrinsicObject_id)) {
				$value_ExtrinsicObject_id = $simbolic_ExtrinsicObject_id;
			}
			//############################################################
			$ExtrinsicObject_id_array[$simbolic_ExtrinsicObject_id] = $value_ExtrinsicObject_id;
			$value_accessControlPolicy = $ExtrinsicObject_node->get_attribute('accessControlPolicy');
			if ($value_accessControlPolicy == '') {
				$value_accessControlPolicy = "NULL";
			}
			$value_objectType = $ExtrinsicObject_node->get_attribute('objectType');
			if ($value_objectType == '') {
				//### DEVO CERCARE NEL DB: INITIALIZE
				$query_for_objectType = "SELECT id FROM ClassificationNode WHERE ClassificationNode.code = 'XDSDocumentEntry'";
				$res = query_select3($query_for_objectType, $connessione);
				writeSQLQuery($res . ": " . $query_for_objectType);
				$value_objectType = $res[0][0];
			}
			$value_expiration = $ExtrinsicObject_node->get_attribute('expiration');
			if ($value_expiration == '') {
				$value_expiration = "CURRENT_TIMESTAMP";
			}
			$value_majorVersion = $ExtrinsicObject_node->get_attribute('majorVersion');
			if ($value_majorVersion == '') {
				$value_majorVersion = "0";
			}
			$value_minorVersion = $ExtrinsicObject_node->get_attribute('minorVersion');
			if ($value_minorVersion == '') {
				$value_minorVersion = "1";
			}
			$value_stability = $ExtrinsicObject_node->get_attribute('stability');
			if ($value_stability == '') {
				$value_stability = "NULL";
			}
			$value_status = $ExtrinsicObject_node->get_attribute('status');
			//### DEAULT
			//$value_status = "Approved";###QUI LA SUBMISSION VA A BUON FINE
			$value_status = "NotCompleted";
			//## VERIFICO CASO DI REPLACEMENT
			for ($t = 0; $t < count($dom_ebXML_Association_node_array); $t++) {
				$dom_ebXML_Association_node = $dom_ebXML_Association_node_array[$t];
				//### ATTRIBUTO associationType
				$Association_node_associationType_attr = $dom_ebXML_Association_node->get_attribute('associationType');
				/*if($Association_node_associationType_attr=='RPLC' || $Association_node_associationType_attr=='XFRM_RPLC')
				{
				$value_status = "Approved";
				}
				else if($Association_node_associationType_attr=='XFRM')
				{
				$value_status = "Approved";
				}
				else if($Association_node_associationType_attr=='APND')
				{
				$value_status = "Approved";
				}
				else continue;    */
			} //END OF for($t=0;$t<count($dom_ebXML_Association_node_array);$t++)
			$value_userVersion = $ExtrinsicObject_node->get_attribute('userVersion');
			if ($value_userVersion == '') {
				$value_userVersion = "NULL";
			}
			$value_isOpaque = $ExtrinsicObject_node->get_attribute('isOpaque');
			if ($value_isOpaque == '') {
				$value_isOpaque = "0";
			}
			$value_mimeType = $ExtrinsicObject_node->get_attribute('mimeType');
			if ($value_mimeType == '') {
				$value_mimeType = "text/xml";
			}
			$DB_array_extrinsicobject_attributes['id'] = $value_ExtrinsicObject_id;
			$DB_array_extrinsicobject_attributes['accessControlPolicy'] = $value_accessControlPolicy;
			$DB_array_extrinsicobject_attributes['objectType'] = $value_objectType;
			$DB_array_extrinsicobject_attributes['expiration'] = $value_expiration;
			$DB_array_extrinsicobject_attributes['majorVersion'] = $value_majorVersion;
			$DB_array_extrinsicobject_attributes['minorVersion'] = $value_minorVersion;
			$DB_array_extrinsicobject_attributes['stability'] = $value_stability;
			$DB_array_extrinsicobject_attributes['status'] = $value_status;
			$DB_array_extrinsicobject_attributes['userVersion'] = $value_userVersion;
			$DB_array_extrinsicobject_attributes['isOpaque'] = $value_isOpaque;
			$DB_array_extrinsicobject_attributes['mimeType'] = $value_mimeType;
			//###### ORA POSSO RIEMPIRE IL DB
			$INSERT_INTO_ExtrinsicObject = "INSERT INTO ExtrinsicObject 
(id,accessControlPolicy,objectType,expiration,majorVersion,minorVersion,stability,status,userVersion,isOpaque,mimeType) 
VALUES 
('" . trim($DB_array_extrinsicobject_attributes['id']) . "','" . trim($DB_array_extrinsicobject_attributes['accessControlPolicy']) . "','" . trim($DB_array_extrinsicobject_attributes['objectType']) . "'," . trim($DB_array_extrinsicobject_attributes['expiration']) . ",'" . trim($DB_array_extrinsicobject_attributes['majorVersion']) . "','" . trim($DB_array_extrinsicobject_attributes['minorVersion']) . "','" . trim($DB_array_extrinsicobject_attributes['stability']) . "','" . trim($DB_array_extrinsicobject_attributes['status']) . "','" . trim($DB_array_extrinsicobject_attributes['userVersion']) . "','" . trim($DB_array_extrinsicobject_attributes['isOpaque']) . "','" . trim($DB_array_extrinsicobject_attributes['mimeType']) . "')";
			//    $ris = query_exec2($INSERT_INTO_ExtrinsicObject,$connessione);
			writeSQLQuery($INSERT_INTO_ExtrinsicObject);
			$ris = query_exec3($INSERT_INTO_ExtrinsicObject, $connessione);
			writeSQLQuery($ris . ": " . $INSERT_INTO_ExtrinsicObject);
			//############# FINE RECUPERO TUTTI GLI ATTRIBUTI DEL NODO EXTRINSICOBJECT
			//### ARRAY DEI FIGLI DEL NODO EXTRINSICOBJECT ##############
			$ExtrinsicObject_child_nodes = $ExtrinsicObject_node->child_nodes();
			//#######################################################################
			//######## PROCESSO TUTTI I NODI FIGLI DI EXTRINSICOBJECT
			//## PARENT
			$value_parent = $value_ExtrinsicObject_id;
			//### LANGUAGECODE DI DEFAULT
			$lang = "it-it";
			for ($k = 0; $k < count($ExtrinsicObject_child_nodes); $k++) {
				//### SINGOLO NODO FIGLIO DI EXTRINSICOBJECT
				$ExtrinsicObject_child_node = $ExtrinsicObject_child_nodes[$k];
				//### NOME DEL NODO
				$ExtrinsicObject_child_node_tagname = $ExtrinsicObject_child_node->node_name();
				//### NODO SLOT
				if ($ExtrinsicObject_child_node_tagname == 'Slot') {
					$slot_node = $ExtrinsicObject_child_node;
					$DB_array_slot_attributes = array();
					$value_name = $slot_node->get_attribute('name');
					if ($value_name == '') {
						$value_name = "NOT DECLARED";
					}
					$value_slotType = $slot_node->get_attribute('slotType');
					if ($value_slotType == '') {
						$value_slotType = "NULL";
					}
					$DB_array_slot_attributes['name'] = $value_name;
					$DB_array_slot_attributes['slotType'] = $value_slotType;
					$DB_array_slot_attributes['value'] = '';
					$DB_array_slot_attributes['parent'] = $value_parent;
					//### NODI FIGLI DI SLOT
					$slot_child_nodes = $slot_node->child_nodes();
					for ($q = 0; $q < count($slot_child_nodes); $q++) {
						$slot_child_node = $slot_child_nodes[$q];
						$slot_child_node_tagname = $slot_child_node->node_name();
						if ($slot_child_node_tagname == 'ValueList') {
							$valuelist_node = $slot_child_node;
							$valuelist_child_nodes = $valuelist_node->child_nodes();
							for ($r = 0; $r < count($valuelist_child_nodes); $r++) {
								$value_node = $valuelist_child_nodes[$r];
								$value_node_tagname = $value_node->node_name();
								if ($value_node_tagname == 'Value') {
									$value_value = $value_node->get_content();
									$DB_array_slot_attributes['value'] = $value_value;
									//### LANGUAGE CODE
									if (strtoupper($value_name) == "LANGUAGECODE") {
										//## LANG
										$lang = $value_value;
										$update_Name_lang = "UPDATE Name SET Name.lang = '$lang' WHERE Name.parent = '$value_ExtrinsicObject_id'";
										$update_Description_lang = "UPDATE Description SET Description.lang = '$lang' WHERE Description.parent = '$value_ExtrinsicObject_id'";
										//                            $rs = query_exec2($update_Name_lang,$connessione);
										$rs = query_exec3($update_Name_lang, $connessione);
										//                            $rs = query_exec2($update_Description_lang,$connessione);
										$rs = query_exec3($update_Description_lang, $connessione);
									} //SALVO LA LINGUA
									//#### SONO PRONTO A SCRIVERE NEL DB
									$INSERT_INTO_Slot = "INSERT INTO Slot (name,slotType,value,parent) VALUES ('" . trim($DB_array_slot_attributes['name']) . "','" . trim($DB_array_slot_attributes['slotType']) . "','" . trim(adjustString($DB_array_slot_attributes['value'])) . "','" . trim($DB_array_slot_attributes['parent']) . "')";
									if (trim($DB_array_slot_attributes['name']) == 'sourcePatientInfo' && substr_count(trim(adjustString($DB_array_slot_attributes['value'])), 'PID-5') > 0) {
										$atna_patient_value = trim(adjustString($DB_array_slot_attributes['value']));
									}
									//                            $ris = query_exec2($INSERT_INTO_Slot,$connessione);
									writeSQLQuery($INSERT_INTO_Slot);
									$ris = query_exec3($INSERT_INTO_Slot, $connessione);
									writeSQLQuery($ris . ": " . $INSERT_INTO_Slot);
								}
							}
						}
					}
				} //END OF if($ExtrinsicObject_child_node_tagname == 'Slot')
				//######### NODO SLOT
				//### NODO NAME
				else if ($ExtrinsicObject_child_node_tagname == 'Name') {
					$name_node = $ExtrinsicObject_child_node;
					$DB_array_name = array();
					$LocalizedString_nodes = $name_node->child_nodes();
					for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
						$LocalizedString_node = $LocalizedString_nodes[$p]; //->node_name();
						$LocalizedString_node_tagname = $LocalizedString_node->node_name();
						if ($LocalizedString_node_tagname == 'LocalizedString') {
							$LocalizedString_charset = $LocalizedString_node->get_attribute('charset');
							if ($LocalizedString_charset == '') {
								$LocalizedString_charset = "UTF-8";
							}
							$LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
							if ($LocalizedString_lang == '') {
								$LocalizedString_lang = $lang;
							}
							$LocalizedString_value = $LocalizedString_node->get_attribute('value');
							if ($LocalizedString_value == '') {
								$LocalizedString_value = "NOT DECLARED";
							}
							$DB_array_name['charset'] = $LocalizedString_charset;
							$DB_array_name['lang'] = $LocalizedString_lang;
							$DB_array_name['value'] = $LocalizedString_value;
						} //END OF if($LocalizedString_node_tagname == 'LocalizedString')
					} //END OF for($p = 0;$p < count($val_list_node);$p++)
					//$value_parent = $id;//ExtrinsicObject
					$DB_array_name['parent'] = $value_parent;
					//print_r($DB_array_name);
					//#### SONO PRONTO A SCRIVERE NEL DB
					$INSERT_INTO_Name = "INSERT INTO Name (charset,lang,value,parent) VALUES ('" . trim($DB_array_name['charset']) . "','" . trim($DB_array_name['lang']) . "','" . trim(adjustString($DB_array_name['value'])) . "','" . trim($DB_array_name['parent']) . "')";
					//        $ris = query_exec2($INSERT_INTO_Name,$connessione);
					writeSQLQuery($INSERT_INTO_Name);
					$ris = query_exec3($INSERT_INTO_Name, $connessione);
					writeSQLQuery($ris . ": " . $INSERT_INTO_Name);
				} //END OF if($ExtrinsicObject_child_node_tagname == 'Name')
				//####### NODO NAME
				//### NODO DESCRIPTION
				else if ($ExtrinsicObject_child_node_tagname == 'Description') {
					$inserDefaultDescription = true; // Di base assumo di inserire il valore di default. Se invece ne trovo almeno uno valorizzato non lo metto.
					$description_node = $ExtrinsicObject_child_node;
					$DB_array_description = array();
					$LocalizedString_nodes = $description_node->child_nodes();
					for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
						$LocalizedString_node = $LocalizedString_nodes[$p];
						$LocalizedString_node_tagname = $LocalizedString_node->node_name();
						if ($LocalizedString_node_tagname == 'LocalizedString') {
							$inserDefaultDescription = false;
							$LocalizedString_charset = $LocalizedString_node->get_attribute('charset');
							if ($LocalizedString_charset == '') {
								$LocalizedString_charset = "UTF-8";
							}
							$LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
							if ($LocalizedString_lang == '') {
								$LocalizedString_lang = $LocalizedString_node->get_attribute('xml:lang');
							}
							if ($LocalizedString_lang == '') {
								$LocalizedString_lang = $lang;
							}
							$LocalizedString_value = $LocalizedString_node->get_attribute('value');
							if ($LocalizedString_value == '') {
								$LocalizedString_value = "NOT DECLARED";
							}
							$DB_array_description['charset'] = $LocalizedString_charset;
							$DB_array_description['lang'] = $LocalizedString_lang;
							$DB_array_description['value'] = $LocalizedString_value;
							$DB_array_description['parent'] = $value_parent;
							$INSERT_INTO_Description = "INSERT INTO Description (charset,lang,value,parent) VALUES ('" . trim($DB_array_description['charset']) . "','" . trim($DB_array_description['lang']) . "','" . trim(adjustString($DB_array_description['value'])) . "','" . trim($DB_array_description['parent']) . "')";
							//                    $ris = query_exec2($INSERT_INTO_Description,$connessione);
							$ris = query_exec3($INSERT_INTO_Description, $connessione);
							writeSQLQuery($ris . ": " . $INSERT_INTO_Description);
						} //END OF if($LocalizedString_node_tagname == 'LocalizedString')
						
					} //END OF for($p = 0;$p < count($val_list_node);$p++)
					if ($inserDefaultDescription == true) {
						$DB_array_description['charset'] = "UTF-8";
						$DB_array_description['lang'] = "it-it";
						$DB_array_description['value'] = "NOT DECLARED";
						$DB_array_description['parent'] = $value_parent;
						$INSERT_INTO_Description = "INSERT INTO Description (charset,lang,value,parent) VALUES ('" . trim($DB_array_description['charset']) . "','" . trim($DB_array_description['lang']) . "','" . trim(adjustString($DB_array_description['value'])) . "','" . trim($DB_array_description['parent']) . "')";
						//                $ris = query_exec2($INSERT_INTO_Description,$connessione);
						$ris = query_exec3($INSERT_INTO_Description, $connessione);
						writeSQLQuery($ris . ": " . $INSERT_INTO_Description);
					}
				} //END OF if($ExtrinsicObject_child_node_tagname == 'Description')
				//######## NODO DESCRIPTION
				//### NODO CLASSIFICATION
				else if ($ExtrinsicObject_child_node_tagname == 'Classification') {
					$classification_node = $ExtrinsicObject_child_node;
					$DB_array_classification_attributes = array();
					$value_id = $classification_node->get_attribute('id');
					if ($value_id == '') {
						$value_id = "urn:uuid:" . idrandom();
					}
					$value_classifiedObject = $value_ExtrinsicObject_id;
					$value_accessControlPolicy = $classification_node->get_attribute('accessControlPolicy');
					if ($value_accessControlPolicy == '') {
						$value_accessControlPolicy = "NULL";
					}
					$value_objectType = $classification_node->get_attribute('objectType');
					if ($value_objectType == '') {
						$value_objectType = "Classification";
					}
					//             $value_classificationScheme= $classification_node->get_attribute('classificationScheme');
					//             if($value_classificationScheme == '')
					//             {
					//                 $value_classificationScheme = "NOT DECLARED";
					//             }
					//             $value_classificationNode= $classification_node->get_attribute('classificationNode');
					//             if($value_classificationNode == '')
					//             {
					//                 $value_classificationNode = "NOT DECLARED";
					//             }
					$value_classificationNode = $classification_node->get_attribute('classificationNode');
					$value_classificationScheme = $classification_node->get_attribute('classificationScheme');
					if ($value_classificationNode == '') {
						$queryForName_value = "SELECT Name_value FROM ClassificationScheme WHERE ClassificationScheme.id = '$value_classificationScheme'";
						$risName_value = query_select3($queryForName_value, $connessione);
						writeSQLQuery($risName_value . ": " . $queryForName_value);
						$name_value = $risName_value[0][0];
						$name_value = substr($name_value, 0, strpos($name_value, '.'));
						$queryForClassificationNode = "SELECT id FROM ClassificationNode WHERE ClassificationNode.code = '$name_value'";
						$ris_code = query_select3($queryForClassificationNode, $connessione);
						$value_classificationNode = $ris_code[0][0];
					}
					if ($value_classificationScheme == '') {
						$queryForClassificationNode = "SELECT code FROM ClassificationNode WHERE ClassificationNode.id = '$value_classificationNode'";
						writeSQLQuery($ris . ": " . $queryForClassificationNode);
						$ris_classificationNode = query_select3($queryForClassificationNode, $connessione);
						$code_classificationNode = $ris_classificationNode[0][0];
						//### FOLDER
						if ($code_classificationNode == "XDSFolder") {
							$queryForClassificationScheme = "SELECT id FROM ClassificationScheme WHERE ClassificationScheme.Name_value = 'XDSFolder.codeList'";
							$ris_ClassificationScheme = query_select3($queryForClassificationScheme, $connessione);
							writeSQLQuery($ris_ClassificationScheme . ": " . $queryForClassificationScheme);
							$value_classificationScheme = $ris_ClassificationScheme[0][0];
						} //END OF if($code_classificationNode=="XDSFolder")
						//### SUBMISSIONSET
						else if ($code_classificationNode == "XDSSubmissionSet") {
							$queryForClassificationScheme = "SELECT id FROM ClassificationScheme WHERE ClassificationScheme.Name_value = 'XDSSubmissionSet.contentTypeCode'";
							$ris_ClassificationScheme = query_select3($queryForClassificationScheme, $connessione);
							writeSQLQuery($ris_ClassificationScheme . ": " . $queryForClassificationScheme);
							$value_classificationScheme = $ris_ClassificationScheme[0][0];
						} //END OF if($code_classificationNode=="XDSSubmissionSet")
						
					} //END OF if($value_classificationScheme == '')
					$value_nodeRepresentation = $classification_node->get_attribute('nodeRepresentation');
					/*if($value_nodeRepresentation == '')
					{
					$value_nodeRepresentation = "NULL";
					//$value_nodeRepresentation = "default";
					}*/
					// Roberto
					// Le due colonne sul db sono dichiarate come not null. Hanno come default i valori usati di seguito.
					// Sono stati aggiunti perchè il codice cerca sempre di valorizzare le colonne nella insert into.
					if (strlen(trim($value_objectType)) == 0) {
						$value_objectType = "Classification";
					}
					if (strlen(trim($value_nodeRepresentation)) == 0) {
						$value_nodeRepresentation = "Radiology";
					}
					// Roberto
					$DB_array_classification_attributes['classificationScheme'] = $value_classificationScheme;
					$DB_array_classification_attributes['accessControlPolicy'] = $value_accessControlPolicy;
					$DB_array_classification_attributes['id'] = $value_id;
					$DB_array_classification_attributes['objectType'] = $value_objectType;
					$DB_array_classification_attributes['classifiedObject'] = $value_classifiedObject;
					$DB_array_classification_attributes['classificationNode'] = $value_classificationNode;
					$DB_array_classification_attributes['nodeRepresentation'] = $value_nodeRepresentation;
					//print_r($DB_array_classification_attributes);
					//#### SONO PRONTO A SCRIVERE NEL DB
					$INSERT_INTO_Classification = "INSERT INTO Classification (id,accessControlPolicy,objectType,classificationNode,classificationScheme,classifiedObject,nodeRepresentation) VALUES ('" . trim($DB_array_classification_attributes['id']) . "','" . trim($DB_array_classification_attributes['accessControlPolicy']) . "','" . trim($DB_array_classification_attributes['objectType']) . "','" . trim($DB_array_classification_attributes['classificationNode']) . "','" . trim($DB_array_classification_attributes['classificationScheme']) . "','" . trim($DB_array_classification_attributes['classifiedObject']) . "','" . trim($DB_array_classification_attributes['nodeRepresentation']) . "')";
					writeSQLQuery($INSERT_INTO_Classification);
					//            $ris = query_exec2($INSERT_INTO_Classification,$connessione);
					$ris = query_exec3($INSERT_INTO_Classification, $connessione);
					writeSQLQuery($ris . ": " . $INSERT_INTO_Classification);
					//### NODI FIGLI DI CLASSIFICATION
					$classification_child_nodes = $classification_node->child_nodes();
					for ($q = 0; $q < count($classification_child_nodes); $q++) {
						$classification_child_node = $classification_child_nodes[$q];
						$classification_child_node_tagname = $classification_child_node->node_name();
						if ($classification_child_node_tagname == 'Name') {
							$name_node = $classification_child_node;
							$DB_array_name = array();
							$LocalizedString_nodes = $name_node->child_nodes();
							//print_r($LocalizedString_nodes);
							for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
								$LocalizedString_node = $LocalizedString_nodes[$p]; //->node_name();
								$LocalizedString_node_tagname = $LocalizedString_node->node_name();
								if ($LocalizedString_node_tagname == 'LocalizedString') {
									$LocalizedString_charset = $LocalizedString_node->get_attribute('charset');
									if ($LocalizedString_charset == '') {
										$LocalizedString_charset = "UTF-8";
									}
									$LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
									if ($LocalizedString_lang == '') {
										$LocalizedString_lang = $lang;
									}
									$LocalizedString_value = $LocalizedString_node->get_attribute('value');
									if ($LocalizedString_value == '') {
										$LocalizedString_value = "NOT DECLARED";
									}
									$DB_array_name['charset'] = $LocalizedString_charset;
									$DB_array_name['lang'] = $LocalizedString_lang;
									$DB_array_name['value'] = $LocalizedString_value;
								} //END OF if($LocalizedString_node_tagname == 'LocalizedString')
								
							} //END OF for($p = 0;$p < count($val_list_node);$p++)
							//$value_parent = $id;//ExtrinsicObject
							$DB_array_name['parent'] = $value_id;
							//print_r($DB_array_name);
							//#### SONO PRONTO A SCRIVERE NEL DB
							$INSERT_INTO_Name = "INSERT INTO Name (charset,lang,value,parent) VALUES ('" . trim($DB_array_name['charset']) . "','" . trim($DB_array_name['lang']) . "','" . trim(adjustString($DB_array_name['value'])) . "','" . trim($DB_array_name['parent']) . "')";
							//        $ris = query_exec2($INSERT_INTO_Name,$connessione);
							$ris = query_exec3($INSERT_INTO_Name, $connessione);
							writeSQLQuery($ris . ": " . $INSERT_INTO_Name);
						} //END OF if($classification_child_node_tagname=='Name')
						
					} //END of for child_nodes
					//else
					//{
					//Slot di Classification
					for ($sl = 0; $sl < count($classification_child_nodes); $sl++) {
						$classification_child_node = $classification_child_nodes[$sl];
						$classification_child_node_tagname = $classification_child_node->node_name();
						if ($classification_child_node_tagname == 'Slot') {
							$slot_node = $classification_child_node;
							$DB_array_slot_attributes = array();
							$value_name = $slot_node->get_attribute('name');
							if ($value_name == '') {
								$value_name = "NOT DECLARED";
							}
							$value_slotType = $slot_node->get_attribute('slotType');
							if ($value_slotType == '') {
								$value_slotType = "NULL";
							}
							$DB_array_slot_attributes['name'] = $value_name;
							$DB_array_slot_attributes['slotType'] = $value_slotType;
							$DB_array_slot_attributes['value'] = '';
							$DB_array_slot_attributes['parent'] = $value_id;
							$slot_child_nodes = $slot_node->child_nodes();
							//print_r($name_node);
							for ($q = 0; $q < count($slot_child_nodes); $q++) {
								$slot_child_node = $slot_child_nodes[$q];
								$slot_child_node_tagname = $slot_child_node->node_name();
								if ($slot_child_node_tagname == 'ValueList') {
									$valuelist_node = $slot_child_node;
									$valuelist_child_nodes = $valuelist_node->child_nodes();
									for ($r = 0; $r < count($valuelist_child_nodes); $r++) {
										$value_node = $valuelist_child_nodes[$r];
										$value_node_tagname = $value_node->node_name();
										if ($value_node_tagname == 'Value') {
											$value_value = $value_node->get_content();
											$DB_array_slot_attributes['value'] = $value_value;
											//#### SONO PRONTO A SCRIVERE NEL DB
											$INSERT_INTO_Slot = "INSERT INTO Slot (name,slotType,value,parent) VALUES ('" . trim($DB_array_slot_attributes['name']) . "','" . trim($DB_array_slot_attributes['slotType']) . "','" . trim(adjustString($DB_array_slot_attributes['value'])) . "','" . trim($DB_array_slot_attributes['parent']) . "')";
											writeSQLQuery($INSERT_INTO_Slot);
											//                            $ris = query_exec2($INSERT_INTO_Slot,$connessione);
											$ris = query_exec3($INSERT_INTO_Slot, $connessione);
											writeSQLQuery($ris . ": " . $INSERT_INTO_Slot);
										}
									}
								}
							}
						} //END OF if($classification_child_node_tagname=='Slot')
						
					} //Fine for per Slot
					//}//Fine else per Slot
					
				} //END OF if($ExtrinsicObject_child_node_tagname=='Classification')
				//############# NODO CLASSIFICATION
				//### NODO EXTERNALIDENTIFIER
				else if ($ExtrinsicObject_child_node_tagname == 'ExternalIdentifier') {
					$externalidentifier_node = $ExtrinsicObject_child_node;
					$DB_array_externalidentifier_attributes = array();
					$value_accessControlPolicy = $externalidentifier_node->get_attribute('accessControlPolicy');
					if ($value_accessControlPolicy == '') {
						$value_accessControlPolicy = "NULL";
					}
					$value_id = $externalidentifier_node->get_attribute('id');
					if ($value_id == '') {
						$value_id = "urn:uuid:" . idrandom();
					}
					$value_objectType = $externalidentifier_node->get_attribute('objectType');
					if ($value_objectType == '') {
						$value_objectType = "ExternalIdentifier";
					}
					$value_registryObject = $value_ExtrinsicObject_id;
					//             $value_registryObject= $externalidentifier_node->get_attribute('registryObject');
					//             if($value_registryObject == '')
					//             {
					//                 $value_registryObject = "NOT DECLARED";
					//             }
					$value_identificationScheme = $externalidentifier_node->get_attribute('identificationScheme');
					if ($value_identificationScheme == '') {
						$value_identificationScheme = "NOT DECLARED";
					}
					//$value_value= avoidHtmlEntitiesInterpretation($externalidentifier_node->get_attribute('value'));
					$value_value = $externalidentifier_node->get_attribute('value');
					if ($value_value == '') {
						$value_value = "NOT DECLARED";
					}
					$DB_array_externalidentifier_attributes['accessControlPolicy'] = $value_accessControlPolicy;
					$DB_array_externalidentifier_attributes['id'] = $value_id;
					$DB_array_externalidentifier_attributes['objectType'] = $value_objectType;
					$DB_array_externalidentifier_attributes['registryObject'] = $value_registryObject;
					$DB_array_externalidentifier_attributes['identificationScheme'] = $value_identificationScheme;
					$DB_array_externalidentifier_attributes['value'] = $value_value;
					//print_r($DB_array_externalidentifier_attributes);
					//#### SONO PRONTO A SCRIVERE NEL DB
					$INSERT_INTO_ExternalIdentifier = "INSERT INTO ExternalIdentifier (id,accessControlPolicy,objectType,registryObject,identificationScheme,value) VALUES ('" . trim($DB_array_externalidentifier_attributes['id']) . "','" . trim($DB_array_externalidentifier_attributes['accessControlPolicy']) . "','" . trim($DB_array_externalidentifier_attributes['objectType']) . "','" . trim($DB_array_externalidentifier_attributes['registryObject']) . "','" . trim($DB_array_externalidentifier_attributes['identificationScheme']) . "','" . trim(adjustString($DB_array_externalidentifier_attributes['value'])) . "')";
					writeSQLQuery($INSERT_INTO_ExternalIdentifier);
					//            $ris = query_exec2($INSERT_INTO_ExternalIdentifier,$connessione);
					$ris = query_exec3($INSERT_INTO_ExternalIdentifier, $connessione);
					writeSQLQuery($ris . ": " . $INSERT_INTO_ExternalIdentifier);
					//### NODI FIGLI DI EXTERNALIDENTIFIER
					$externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
					//print_r($name_node);
					for ($q = 0; $q < count($externalidentifier_child_nodes); $q++) {
						$externalidentifier_child_node = $externalidentifier_child_nodes[$q];
						$externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
						if ($externalidentifier_child_node_tagname == 'Name') {
							$name_node = $externalidentifier_child_node;
							$DB_array_name = array();
							$LocalizedString_nodes = $name_node->child_nodes();
							//print_r($LocalizedString_nodes);
							for ($p = 0; $p < count($LocalizedString_nodes); $p++) {
								$LocalizedString_node = $LocalizedString_nodes[$p]; //->node_name();
								$LocalizedString_node_tagname = $LocalizedString_node->node_name();
								if ($LocalizedString_node_tagname == 'LocalizedString') {
									$LocalizedString_charset = $LocalizedString_node->get_attribute('charset');
									if ($LocalizedString_charset == '') {
										$LocalizedString_charset = "UTF-8";
									}
									$LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
									if ($LocalizedString_lang == '') {
										$LocalizedString_lang = $lang;
									}
									$LocalizedString_value = $LocalizedString_node->get_attribute('value');
									if ($LocalizedString_value == '') {
										$LocalizedString_value = "NOT DECLARED";
									}
									$DB_array_name['charset'] = $LocalizedString_charset;
									$DB_array_name['lang'] = $LocalizedString_lang;
									$DB_array_name['value'] = $LocalizedString_value;
								} //END OF if($LocalizedString_node_tagname == 'LocalizedString')
								
							} //END OF for($p = 0;$p < count($val_list_node);$p++)
							//$value_parent = $id;//ExtrinsicObject
							$DB_array_name['parent'] = $value_id;
						}
					}
					//print_r($DB_array_name);
					//#### SONO PRONTO A SCRIVERE NEL DB
					$INSERT_INTO_Name = "INSERT INTO Name (charset,lang,value,parent) VALUES ('" . trim($DB_array_name['charset']) . "','" . trim($DB_array_name['lang']) . "','" . trim(adjustString($DB_array_name['value'])) . "','" . trim($DB_array_name['parent']) . "')";
					//        $ris = query_exec2($INSERT_INTO_Name,$connessione);
					$ris = query_exec3($INSERT_INTO_Name, $connessione);
					writeSQLQuery($ris . ": " . $INSERT_INTO_Name);
				} //END OF if($ExtrinsicObject_child_node_tagname=='ExternalIdentifier')
				
			} //END OF for($k=0;$k<count($ExtrinsicObject_child_nodes);$k++)
			//################ FINE PROCESSO TUTTI I NODI FIGLI DI EXTRINSICOBJECT
			//####### AGGIORNO IL CONTATORE
			$UPDATE_counters = "UPDATE Counters SET id = id + 1";
			//        $ris=query_exec2($UPDATE_counters,$connessione);
			$ris = query_exec3($UPDATE_counters, $connessione);
			writeSQLQuery($ris . ": " . $UPDATE_counters);
		} //END OF for($index=0;$index<(count($dom_ebXML_ExtrinsicObject_node_array));$index++)
		
	}
	//## COMPONGO L'ARRAY DA TORNARE
	$ret = array($ExtrinsicObject_id_array, $lang, $atna_patient_value, $simbolic_ExtrinsicObject_id_array);
	//## RETURN
	return $ret;
} //END OF fillExtrinsicObject_tables($dom,$index)

?>