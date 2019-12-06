<?php
writeSQLQuery('-------------------------------------------------------------------------------------');
writeSQLQuery('Association_2');
//#### METODO PRINCIPALE

function fill_Association_tables($dom, $RegistryPackage_id_array, $ExtrinsicObject_id_array, $simbolic_RegistryPackage_FOL_id_array, $connessione)
{
	//$log = new Log_REG("REG");
	//$log = new Log_REG();
	//$log->set_tmp_path("./tmp/");
	writeTimeFile("Registry: sono entrato in fill_Association_tables");
	//#### RADICE DEL DOCUMENTO ebXML
	$root_ebXML = $dom->document_element();
	//#### ARRAY DEI NODI LeafRegistryObjectList
	$dom_ebXML_LeafRegistryObjectList_node_array = $root_ebXML->get_elements_by_tagname("LeafRegistryObjectList");
	//#### NODO LeafRegistryObjectList
	$dom_ebXML_LeafRegistryObjectList_node = $dom_ebXML_LeafRegistryObjectList_node_array[0];
	//#### TUTTI I NODI FIGLI DI LeafRegistryObjectList
	$dom_ebXML_LeafRegistryObjectList_child_nodes = $dom_ebXML_LeafRegistryObjectList_node->child_nodes();
	for ($i = 0; $i < count($dom_ebXML_LeafRegistryObjectList_child_nodes); $i++) {
		//### SINGOLO NODO
		$dom_ebXML_LeafRegistryObjectList_child_node = $dom_ebXML_LeafRegistryObjectList_child_nodes[$i];
		//#### tagname
		$dom_ebXML_LeafRegistryObjectList_child_node_tagname = $dom_ebXML_LeafRegistryObjectList_child_node->node_name();
		//### SOLO I NODI ASSOCIATION
		if ($dom_ebXML_LeafRegistryObjectList_child_node_tagname == 'Association') {
			$association_node = $dom_ebXML_LeafRegistryObjectList_child_node;
			$DB_array_association_attributes = array();
			$value_id = $association_node->get_attribute('id');
			if ($value_id == '' || isSimbolic($value_id)) {
				$value_id = "urn:uuid:" . idrandom();
			}
			//### PARENT
			$value_parent = $value_id;
			$value_accessControlPolicy = $association_node->get_attribute('accessControlPolicy');
			if ($value_accessControlPolicy == '') {
				$value_accessControlPolicy = "NULL";
			}
			$value_objectType = $association_node->get_attribute('objectType');
			if ($value_objectType == '') {
				$value_objectType = "Association";
			}
			$value_associationType = $association_node->get_attribute('associationType');
			if ($value_associationType == '') {
				$value_associationType = "NOT DECLARED";
			}
			$value_sourceObject = $association_node->get_attribute('sourceObject');
			//writeSQLQuery('Valore fuori dall if '.$value_sourceObject);
			if (isSimbolic($value_sourceObject)) {
				$value_sourceObject_1 = $ExtrinsicObject_id_array[$value_sourceObject];
				$value_sourceObject_2 = $RegistryPackage_id_array[$value_sourceObject];
				if ($value_sourceObject_1 != "") {
					$value_sourceObject = $value_sourceObject_1;
				} else {
					$value_sourceObject = $value_sourceObject_2;
				}
				//writeSQLQuery('Valore dentro all if '.$value_sourceObject);
				
			} //END OF if(isSimbolic($value_sourceObject))
			$value_targetObject = $association_node->get_attribute('targetObject');
			$simbolic_value_targetObject = $association_node->get_attribute('targetObject');
			if (isSimbolic($value_targetObject)) {
				$value_targetObject_1 = $ExtrinsicObject_id_array[$value_targetObject];
				$value_targetObject_2 = $RegistryPackage_id_array[$value_targetObject];
				if ($value_targetObject_1 != "") {
					$value_targetObject = $value_targetObject_1;
				} else {
					$value_targetObject = $value_targetObject_2;
				}
			} //END OF if(isSimbolic($simbolic_value_targetObject))
			$value_isConfirmedBySourceOwner = $association_node->get_attribute('isConfirmedBySourceOwner');
			if ($value_isConfirmedBySourceOwner == '') {
				$value_isConfirmedBySourceOwner = "0";
			}
			$value_isConfirmedByTargetOwner = $association_node->get_attribute('isConfirmedByTargetOwner');
			if ($value_isConfirmedByTargetOwner == '') {
				$value_isConfirmedByTargetOwner = "0";
			}
			$DB_array_association_attributes['id'] = $value_id;
			$DB_array_association_attributes['accessControlPolicy'] = $value_accessControlPolicy;
			$DB_array_association_attributes['objectType'] = $value_objectType;
			$DB_array_association_attributes['associationType'] = $value_associationType;
			$DB_array_association_attributes['sourceObject'] = $value_sourceObject;
			$DB_array_association_attributes['targetObject'] = $value_targetObject;
			$DB_array_association_attributes['isConfirmedBySourceOwner'] = $value_isConfirmedBySourceOwner;
			$DB_array_association_attributes['isConfirmedByTargetOwner'] = $value_isConfirmedByTargetOwner;
			$Association_folder = in_array($simbolic_value_targetObject, $simbolic_RegistryPackage_FOL_id_array);
			if (!$Association_folder) {
				//###### QUI ORA POSSO RIEMPIRE IL DB
				$INSERT_INTO_Association = "INSERT INTO Association (id,accessControlPolicy,objectType,associationType,sourceObject,targetObject,isConfirmedBySourceOwner,isConfirmedByTargetOwner) VALUES ('" . $DB_array_association_attributes['id'] . "','" . $DB_array_association_attributes['accessControlPolicy'] . "','" . $DB_array_association_attributes['objectType'] . "','" . $DB_array_association_attributes['associationType'] . "','" . $DB_array_association_attributes['sourceObject'] . "','" . $DB_array_association_attributes['targetObject'] . "','" . $DB_array_association_attributes['isConfirmedBySourceOwner'] . "','" . $DB_array_association_attributes['isConfirmedByTargetOwner'] . "')";
				//            $ris = query_exec2($INSERT_INTO_Association,$connessione);
				$ris = query_exec3($INSERT_INTO_Association, $connessione);
				writeSQLQuery($ris . ": " . $INSERT_INTO_Association);
				//### NODI FIGLI DI ASSOCIATION
				$association_child_nodes = $association_node->child_nodes();
				if (!empty($association_child_nodes)) {
					for ($j = 0; $j < count($association_child_nodes); $j++) {
						//### SINGOLO NODO
						$association_child_node = $association_child_nodes[$j];
						//#### tagname
						$association_child_node_tagname = $association_child_node->node_name();
						//### SOLO I NODI SLOT
						if ($association_child_node_tagname == 'Slot') {
							$slot_node = $association_child_node;
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
									//# UN SOLO VALUE
									for ($r = 0; $r < count($valuelist_child_nodes); $r++) {
										$value_node = $valuelist_child_nodes[$r];
										$value_node_tagname = $value_node->node_name();
										if ($value_node_tagname == 'Value') {
											$value_value = $value_node->get_content();
											$DB_array_slot_attributes['value'] = $value_value;
											//#### SONO PRONTO A SCRIVERE NEL DB
											$INSERT_INTO_Slot = "INSERT INTO Slot (name,slotType,value,parent) VALUES ('" . trim($DB_array_slot_attributes['name']) . "','" . trim($DB_array_slot_attributes['slotType']) . "','" . trim(adjustString($DB_array_slot_attributes['value'])) . "','" . trim($DB_array_slot_attributes['parent']) . "')";
											//                           $ris = query_exec2($INSERT_INTO_Slot,$connessione);
											$ris = query_exec3($INSERT_INTO_Slot, $connessione);
											writeSQLQuery($ris . ": " . $INSERT_INTO_Slot);
										}
									}
								}
							}
						} //END OF if($association_child_node_tagname=='Slot')
						
					}
				} //END OF if(!empty($association_child_nodes))
				
			} //Fine if(!$Association_folder)
			else {
			}
			//########## CASI DI REPLACEMENT + ADDENDUM + TRANSFORMATION
			//#### CASO RPLC Accept Document Replace
			if ($value_associationType == "RPLC") {
				$query_UPDATE_targetObject = "UPDATE ExtrinsicObject SET status = 'Deprecated' WHERE ExtrinsicObject.id = '$value_targetObject'";
				//            $ex = query_exec2($query_UPDATE_targetObject,$connessione);
				$ex = query_exec3($query_UPDATE_targetObject, $connessione);
				writeSQLQuery($ex . ": " . $query_UPDATE_targetObject);
			} //END OF if($value_associationType=="RPLC")
			//#### CASO XFRM_RPLC Accept Document Replace with Transformation
			if ($value_associationType == "XFRM_RPLC") {
				$query_UPDATE_targetObject = "UPDATE ExtrinsicObject SET status = 'Deprecated' WHERE ExtrinsicObject.id = '$value_targetObject'";
				//            $ex = query_exec2($query_UPDATE_targetObject,$connessione);
				$ex = query_exec3($query_UPDATE_targetObject, $connessione);
				writeSQLQuery($ex . ": " . $query_UPDATE_targetObject);
			} //END OF if($value_associationType=="XFRM_RPLC")
			//#### CASO XFRM Accept Document Transformation
			if ($value_associationType == "XFRM") {
				$query_UPDATE_targetObject = "UPDATE ExtrinsicObject SET status = 'Approved' WHERE ExtrinsicObject.id = '$value_targetObject'";
				//            $ex = query_exec2($query_UPDATE_targetObject,$connessione);
				$ex = query_exec3($query_UPDATE_targetObject, $connessione);
				writeSQLQuery($ex . ": " . $query_UPDATE_targetObject);
			} //END OF if($value_associationType=="XFRM")
			//#### CASO APND Accept Document Addendum
			if ($value_associationType == "APND") {
				$query_UPDATE_targetObject = "UPDATE ExtrinsicObject SET status = 'Approved' WHERE ExtrinsicObject.id = '$value_targetObject'";
				//            $ex = query_exec2($query_UPDATE_targetObject,$connessione);
				$ex = query_exec3($query_UPDATE_targetObject, $connessione);
				writeTimeFile("Registry: update status" . $query_UPDATE_targetObject);
			} //END OF if($value_associationType=="APND")
			//########## CASI DI GESTIONE FOLDER + SUBMISSIONSET
			if ($value_associationType == "HasMember") {
				//#### FIGLI DI ASSOCIATION
				$association_node_childs = $association_node->child_nodes();
				//### AGGIUNTA DI UN DOCUMENTO A FOLDER GIA' ESISTENTE
				if (!isSimbolic($value_sourceObject) && empty($association_node_childs)) {
					//### APPURIAMO DI ESSERE NEL CASO FOLDER
					$query_folder = "SELECT * FROM Slot WHERE Slot.name = 'lastUpdateTime' AND Slot.parent = '$value_sourceObject'";
					$ris_folder = query_select3($query_folder, $connessione);
					writeSQLQuery($ris_folder . ": " . $query_folder);
					if (!empty($ris_folder[0])) {
						//### ricavo data-ora correnti
						$today = date("Ymd");
						$cur_hour = date("His");
						//$datetime = $today.$cur_hour;
						$datetime = "CURRENT_TIMESTAMP";
						//###UPDATE DI lastUpdateTime
						$update_lastUpdateTime = "UPDATE Slot SET Slot.value = $datetime WHERE Slot.name = 'lastUpdateTime' AND Slot.parent = '$value_sourceObject'";
						//                    $ex = query_exec2($update_lastUpdateTime,$connessione);
						$ex = query_exec3($update_lastUpdateTime, $connessione);
						writeSQLQuery($ex . ": " . $update_lastUpdateTime);
					} //END OF if(!empty($ris_folder))
					
				} //END OF if(!isSimbolic($value_sourceObject))
				//#### CASO DI AGGIUNTA A SUBMISSIONSET
				else if (!isSimbolic($value_sourceObject) && !empty($association_node_childs)) {
					for ($y = 0; $y < count($association_node_childs); $y++) {
						//#### NODO SLOT
						$slot_node = $association_node_childs[$y];
						//#### RECUPERO TAGNAME
						$slot_node_tagname = $slot_node->node_name();
						if ($slot_node_tagname == "Slot") {
							//### NAME ATTRIBUTE FOR SLOT
							$slot_node_name = $slot_node->get_attribute('name');
							//### NODI FIGLI DI SLOT
							$slot_node_childs = $slot_node->child_nodes();
							for ($x = 0; $x < count($slot_node_childs); $x++) {
								$slot_node_child = $slot_node_childs[$x];
								$slot_node_child_tagname = $slot_node_child->node_name();
								if ($slot_node_child_tagname == "ValueList") {
									$slot_node_childs_2 = $slot_node_child->child_nodes();
									for ($z = 0; $z < count($slot_node_childs_2); $z++) {
										$slot_node_child_2 = $slot_node_childs_2[$z];
										$slot_node_child_2_tagname = $slot_node_child_2->node_name();
										if ($slot_node_child_2_tagname == "Value") {
											$update_value = $slot_node_child_2->get_content();
										} //END OF if($slot_node_child_2_tagname=="Value")
										
									}
								} //END OF if($slot_node_child_tagname=="ValueList")
								
							}
							//###UPDATE DI SubmissionSetStatus Non va fatta ????? Deve rimanere Approved
							$update_RegistryPackageStatus = "UPDATE RegistryPackage SET RegistryPackage.status = '$update_value' WHERE  RegistryPackage.id = '$value_sourceObject'";
							//writeSQLQuery($ris.": ".$update_RegistryPackageStatus);
							$selectIdAssociation = "SELECT id FROM Association WHERE Association.sourceObject = '$value_sourceObject'";
							$ris_selectIdAssociation = query_select3($selectIdAssociation, $connessione);
							writeSQLQuery($ris_selectIdAssociation . ": " . $selectIdAssociation);
							$countID = count($ris_selectIdAssociation);
							for ($risId = 0; $risId < $countID; $risId++) {
								//$update_SubmissionSetStatus="UPDATE Slot SET Slot.value = '$update_value' WHERE name ='$slot_node_name' AND  Slot.parent IN (SELECT id FROM Association WHERE Association.sourceObject = '$value_sourceObject')";
								$update_SubmissionSetStatus = "UPDATE Slot SET Slot.value = '$update_value' WHERE name ='$slot_node_name' AND  Slot.parent ='" . $ris_selectIdAssociation[$risId][0] . "'";
								//writeTimeFile("Registry: update Slot  ".$update_SubmissionSetStatus);
								//                $ex = query_exec2($update_SubmissionSetStatus,$connessione);
								$ex = query_exec3($update_SubmissionSetStatus, $connessione);
								writeSQLQuery($ex . ": " . $update_SubmissionSetStatus);
							}
						} //END OF if($slot_node_tagname=="Slot")
						
					} //END OF for($y=0;$y<count($association_node_childs);$y++)
					
				} //END OF else if(!isSimbolic($value_sourceObject))
				
			} //END OF if($value_associationType=="HasMember")
			
		} //END OF if($dom_ebXML_LeafRegistryObjectList_child_node_tagname=='Association')
		else continue;
	} //END OF for($i=0;$i<count($dom_ebXML_LeafRegistryObjectList_child_nodes);$i++)
	writeTimeFile("Registry: esco da fill_Association_tables");
} //END OF function fill_Association_tables($dom)

?>