<?php
function appendObjectRef_EO($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_root,$ns_rim_path,$connessione) {
}

//Tutte queste funzioni servono sia per ExtrinsicObject, sia per RegistryPackage
function appendSlot($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_root,$ns_rim_path,$ExtrinsicObject_id,$connessione) {
	##### SLOT
	$select_Slots = "SELECT DISTINCT name FROM Slot WHERE Slot.parent = '$ExtrinsicObject_id'";
	$Slot_name_EO=query_select2($select_Slots,$connessione);
	writeSQLQueryService($select_Slots);
	$repeat = true;
	for($s=0;$s<count($Slot_name_EO);$s++)
	{
		$Slot_EO = $Slot_name_EO[$s];
		$Slot_name = trim($Slot_EO[0]);

			$dom_ebXML_ExtrinsicObject_Slot=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Slot");
			$dom_ebXML_ExtrinsicObject_Slot=$dom_ebXML_ExtrinsicObject_root->append_child($dom_ebXML_ExtrinsicObject_Slot);

			$select_Slots = "SELECT value FROM Slot WHERE Slot.parent = '$ExtrinsicObject_id' AND Slot.name = '".trim($Slot_name_EO[$s][0])."'";
			$Slots=query_select2($select_Slots,$connessione);
			writeSQLQueryService($select_Slots);
			
			$dom_ebXML_ExtrinsicObject_Slot->set_attribute("name",$Slot_name);
			$dom_ebXML_ExtrinsicObject_Slot_ValueList=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"ValueList");
			$dom_ebXML_ExtrinsicObject_Slot_ValueList=$dom_ebXML_ExtrinsicObject_Slot->append_child($dom_ebXML_ExtrinsicObject_Slot_ValueList);

			for($r=0;$r<count($Slots);$r++)
			{
				$Slot=$Slots[$r];
				$Slot_value = $Slot[0];

				$dom_ebXML_ExtrinsicObject_Slot_ValueList_Value=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Value");
				$dom_ebXML_ExtrinsicObject_Slot_ValueList_Value=$dom_ebXML_ExtrinsicObject_Slot_ValueList->append_child($dom_ebXML_ExtrinsicObject_Slot_ValueList_Value);

				$dom_ebXML_ExtrinsicObject_Slot_ValueList_Value->set_content($Slot_value);

			}//END OF for($r=0;$r<count($sourcePatientInfo_Slots);$r++)


	}//END OF for($s=0;$s<count($slot_arr);$s++)
}

function appendName($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_root,$ns_rim_path,$ExtrinsicObject_id,$connessione) {
	#### NAME
	$dom_ebXML_ExtrinsicObject_Name=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Name");
	$dom_ebXML_ExtrinsicObject_Name=$dom_ebXML_ExtrinsicObject_root->append_child($dom_ebXML_ExtrinsicObject_Name);

	$queryForExtrinsicObject_Name="SELECT charset,value,lang FROM Name WHERE Name.parent = '$ExtrinsicObject_id'";
	$Name_arr=query_select2($queryForExtrinsicObject_Name,$connessione);
	writeSQLQueryService($queryForExtrinsicObject_Name);

	$Name_charset = $Name_arr[0][0];
	$Name_value = $Name_arr[0][1];
	$Name_lang = $Name_arr[0][2];

	if(!empty($Name_arr))
	{
		$dom_ebXML_ExtrinsicObject_Name_LocalizedString=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"LocalizedString");
		$dom_ebXML_ExtrinsicObject_Name_LocalizedString=$dom_ebXML_ExtrinsicObject_Name->append_child($dom_ebXML_ExtrinsicObject_Name_LocalizedString);

		$dom_ebXML_ExtrinsicObject_Name_LocalizedString->set_attribute("charset",$Name_charset);
		$dom_ebXML_ExtrinsicObject_Name_LocalizedString->set_attribute("value",$Name_value);
		$dom_ebXML_ExtrinsicObject_Name_LocalizedString->set_attribute("xml:lang",$Name_lang);
	}
}

function appendDescription($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_root,$ns_rim_path,$ExtrinsicObject_id,$connessione) {
	#### DESCRIPTION
	$dom_ebXML_ExtrinsicObject_Description=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Description");
	$dom_ebXML_ExtrinsicObject_Description=$dom_ebXML_ExtrinsicObject_root->append_child($dom_ebXML_ExtrinsicObject_Description);

	$queryForExtrinsicObject_Description="SELECT charset,value,lang FROM Description WHERE Description.parent = '$ExtrinsicObject_id'";
	$Description_arr=query_select2($queryForExtrinsicObject_Description,$connessione);
	writeSQLQueryService($queryForExtrinsicObject_Description);

	for($i=0; $i < count($Description_arr); $i++){
		$Description_charset = $Description_arr[$i][0];
		$Description_value = $Description_arr[$i][1];
		$Description_lang = $Description_arr[$i][2];

		if(!empty($Description_arr) && $Description_value!="NOT DECLARED")
		{
			$dom_ebXML_ExtrinsicObject_Description_LocalizedString=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"LocalizedString");
			$dom_ebXML_ExtrinsicObject_Description_LocalizedString=$dom_ebXML_ExtrinsicObject_Description->append_child($dom_ebXML_ExtrinsicObject_Description_LocalizedString);

			$dom_ebXML_ExtrinsicObject_Description_LocalizedString->set_attribute("charset",$Description_charset);
			$dom_ebXML_ExtrinsicObject_Description_LocalizedString->set_attribute("value",$Description_value);
			$dom_ebXML_ExtrinsicObject_Description_LocalizedString->set_attribute("xml:lang",$Description_lang);
		}
	}
}

function appendName_Classification($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_Classification,$ns_rim_path,$ExtrinsicObject_Classification_id,$connessione) {
	#### NAME
	$dom_ebXML_Classification_Name=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Name");
	$dom_ebXML_Classification_Name=$dom_ebXML_ExtrinsicObject_Classification->append_child($dom_ebXML_Classification_Name);

	$queryForClassification_Name="SELECT charset,value,lang FROM Name WHERE Name.parent = '$ExtrinsicObject_Classification_id'";
	$Name_arr=query_select2($queryForClassification_Name,$connessione);
	writeSQLQueryService($queryForClassification_Name);

	$Name_charset = $Name_arr[0][0];
	$Name_value = $Name_arr[0][1];
	$Name_lang = $Name_arr[0][2];

	if(!empty($Name_arr))
	{
		$dom_ebXML_Classification_Name_LocalizedString=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"LocalizedString");
		$dom_ebXML_Classification_Name_LocalizedString=$dom_ebXML_Classification_Name->append_child($dom_ebXML_Classification_Name_LocalizedString);
	
		$dom_ebXML_Classification_Name_LocalizedString->set_attribute("charset",$Name_charset);
		$dom_ebXML_Classification_Name_LocalizedString->set_attribute("value",$Name_value);
		$dom_ebXML_Classification_Name_LocalizedString->set_attribute("xml:lang",$Name_lang);
	}
}

function appendDescription_Classification($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_Classification,$ns_rim_path,$ExtrinsicObject_Classification_id,$connessione) {
	#### DESCRIPTION
	$queryForClassification_Description="SELECT charset,value,lang FROM Description WHERE Description.parent = '$ExtrinsicObject_Classification_id'";

	$Description_arr=query_select2($queryForClassification_Description,$connessione);
	writeSQLQueryService($queryForClassification_Description);

	$Description_charset = $Description_arr[0][0];
	$Description_value = $Description_arr[0][1];
	$Description_lang = $Description_arr[0][2];


	$dom_ebXML_Classification_Description=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Description");
	$dom_ebXML_Classification_Description=$dom_ebXML_ExtrinsicObject_Classification->append_child($dom_ebXML_Classification_Description);

	if(!empty($Description_arr) && $Description_value!="NOT DECLARED")
	{
	$dom_ebXML_Classification_Description_LocalizedString=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"LocalizedString");
	$dom_ebXML_Classification_Description_LocalizedString=$dom_ebXML_Classification_Description->append_child($dom_ebXML_Classification_Description_LocalizedString);

	$dom_ebXML_Classification_Description_LocalizedString->set_attribute("charset",$Description_charset);
	$dom_ebXML_Classification_Description_LocalizedString->set_attribute("value",$Description_value);
	$dom_ebXML_Classification_Description_LocalizedString->set_attribute("xml:lang",$Description_lang);
	}
}

function appendSlot_Classification($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_Classification,$ns_rim_path,$ExtrinsicObject_Classification_id,$connessione) {
	##### SLOT
	$select_Slots = "SELECT DISTINCT name FROM Slot WHERE Slot.parent = '$ExtrinsicObject_Classification_id'";
	$Slot_name_EO=query_select2($select_Slots,$connessione);
	writeSQLQueryService($select_Slots);
	$repeat = true;
	for($s=0;$s<count($Slot_name_EO);$s++)
	{
		$Slot_EO = $Slot_name_EO[$s];
		$Slot_name = trim($Slot_EO[0]);

			$dom_ebXML_ExtrinsicObject_Slot=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Slot");
			$dom_ebXML_ExtrinsicObject_Slot=$dom_ebXML_ExtrinsicObject_Classification->append_child($dom_ebXML_ExtrinsicObject_Slot);

			$select_Slots = "SELECT value FROM Slot WHERE Slot.parent = '$ExtrinsicObject_Classification_id' AND Slot.name = '".trim($Slot_name_EO[$s][0])."'";
			$Slots=query_select2($select_Slots,$connessione);
			writeSQLQueryService($select_Slots);
			
			$dom_ebXML_ExtrinsicObject_Slot->set_attribute("name",$Slot_name);
			$dom_ebXML_ExtrinsicObject_Slot_ValueList=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"ValueList");
			$dom_ebXML_ExtrinsicObject_Slot_ValueList=$dom_ebXML_ExtrinsicObject_Slot->append_child($dom_ebXML_ExtrinsicObject_Slot_ValueList);

			for($r=0;$r<count($Slots);$r++)
			{
				$Slot=$Slots[$r];
				$Slot_value = $Slot[0];

				$dom_ebXML_ExtrinsicObject_Slot_ValueList_Value=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Value");
				$dom_ebXML_ExtrinsicObject_Slot_ValueList_Value=$dom_ebXML_ExtrinsicObject_Slot_ValueList->append_child($dom_ebXML_ExtrinsicObject_Slot_ValueList_Value);

				$dom_ebXML_ExtrinsicObject_Slot_ValueList_Value->set_content($Slot_value);

			}//END OF for($r=0;$r<count($sourcePatientInfo_Slots);$r++)

	}//END OF for($s=0;$s<count($slot_arr);$s++)
}

function appendName_ExternalIdentifier($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_ExternalIdentifier,$ns_rim_path,$ExtrinsicObject_ExternalIdentifier_id,$connessione) {
	#### NAME
	$dom_ebXML_ExternalIdentifier_Name=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Name");
	$dom_ebXML_ExternalIdentifier_Name=$dom_ebXML_ExtrinsicObject_ExternalIdentifier->append_child($dom_ebXML_ExternalIdentifier_Name);

	$queryForExternalIdentifier_Name="SELECT charset,value,lang FROM Name WHERE Name.parent = '$ExtrinsicObject_ExternalIdentifier_id'";
	$Name_arr=query_select2($queryForExternalIdentifier_Name,$connessione);
	writeSQLQueryService($queryForExternalIdentifier_Name);

	$Name_charset = $Name_arr[0][0];
	$Name_value = $Name_arr[0][1];
	$Name_lang = $Name_arr[0][2];

	if(!empty($Name_arr))
	{
		$dom_ebXML_ExternalIdentifier_Name_LocalizedString=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"LocalizedString");
		$dom_ebXML_ExternalIdentifier_Name_LocalizedString=$dom_ebXML_ExternalIdentifier_Name->append_child($dom_ebXML_ExternalIdentifier_Name_LocalizedString);
	
		$dom_ebXML_ExternalIdentifier_Name_LocalizedString->set_attribute("charset",$Name_charset);
		$dom_ebXML_ExternalIdentifier_Name_LocalizedString->set_attribute("value",$Name_value);
		$dom_ebXML_ExternalIdentifier_Name_LocalizedString->set_attribute("xml:lang",$Name_lang);
	}
}

function appendDescription_ExternalIdentifier($dom_ebXML_ExtrinsicObject,$dom_ebXML_ExtrinsicObject_ExternalIdentifier,$ns_rim_path,$ExtrinsicObject_ExternalIdentifier_id,$connessione) {
	#### DESCRIPTION
	$queryForExternalIdentifier_Description="SELECT charset,value,lang FROM Description WHERE Description.parent = '$ExtrinsicObject_ExternalIdentifier_id'";
	$Description_arr=query_select2($queryForExternalIdentifier_Description,$connessione);
	writeSQLQueryService($queryForExternalIdentifier_Description);

	$Description_charset = $Description_arr[0][0];
	$Description_value = $Description_arr[0][1];
	$Description_lang = $Description_arr[0][2];

	if(!empty($Description_arr) && $Description_value!="NOT DECLARED")
	{
		$dom_ebXML_ExternalIdentifier_Description=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"Description");
		$dom_ebXML_ExternalIdentifier_Description=$dom_ebXML_ExtrinsicObject_ExternalIdentifier->append_child($dom_ebXML_ExternalIdentifier_Description);

		$dom_ebXML_ExternalIdentifier_Description_LocalizedString=$dom_ebXML_ExtrinsicObject->create_element_ns($ns_rim_path,"LocalizedString");
		$dom_ebXML_ExternalIdentifier_Description_LocalizedString=$dom_ebXML_ExternalIdentifier_Description->append_child($dom_ebXML_ExternalIdentifier_Description_LocalizedString);
	
		$dom_ebXML_ExternalIdentifier_Description_LocalizedString->set_attribute("charset",$Description_charset);
		$dom_ebXML_ExternalIdentifier_Description_LocalizedString->set_attribute("value",$Description_value);
		$dom_ebXML_ExternalIdentifier_Description_LocalizedString->set_attribute("xml:lang",$Description_lang);
	}
}
?>
