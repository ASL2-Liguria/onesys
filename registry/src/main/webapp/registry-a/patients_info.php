<?php
function searchForPatientsInfos($dom,$tag,$id_doc,$name)
{
	$ebxml_value_ret_array = array();
		$ebxml_value_ret = '';
  
		$xpath = $dom->xpath_new_context();
		$root_child = $xpath->xpath_eval("*");//* mi da i figli diretti del nodo radice
	 $nodeset_parent = $root_child->nodeset;
	 $children = $nodeset_parent[0]->child_nodes();
	 $parent = '';

	 for($i = 0;$i < count($children);$i++)
	 {
	$parent = $children[$i];
	if(($children[$i]->{'tagname'} == $tag) && (($id_doc=='') ? TRUE : ($parent->get_attribute('id'))==$id_doc))
		{
		  //$parent = $children[$i];
		  $childs = $parent->child_nodes();
		  for($r = 0;$r < count($childs);$r++)
		  {
			 if(($childs[$r]->{'tagname'} == 'Slot') && (($name=='') ? TRUE : ($childs[$r]->get_attribute('name'))==$name))
			  {
				 $paren = $childs[$r];
				 $names = $paren->child_nodes();
				 //print_r($names);
				 for($p = 0;$p < count($names);$p++)
				 {
				   if(($names[$p]->{'tagname'} == 'ValueList'))
				   {
					 $tag = $names[$p];
					 $valueS = $tag->child_nodes();
					 //print_r($localizedStringS);
					 for($q = 0;$q < count($valueS);$q++)
					 {
						if(($valueS[$q]->{'tagname'} == 'Value'))
					  {
						$tag2 = $valueS[$q];
						if($name == "sourcePatientId")
						{
						  $ebxml_value_ret = $tag2->get_content();
						}
						else if($name == "sourcePatientInfo")
						{
						   $ebxml_value_ret_array[$q] = $tag2->get_content();
						}
					  }
						  }
				   }
				 }
			   }
			 }
		   }
		}
		if($name == "sourcePatientId")
	  {
		return $ebxml_value_ret;
	  }
	  else return $ebxml_value_ret_array;
		
}//END OF searchForPatientsInfos

// $tag = 'ExtrinsicObject';
// $id_doc = 'theDocument';
// $name = 'sourcePatientId';  'sourcePatientInfo';  ....

function getPatientsInfos($dom,$id_dc)
{
	$names = array("sourcePatientId","sourcePatientInfo");
		$re_array = array();
		$ret_array = array();
		for($ind=0;$ind<=count($names);$ind++)
		{
			$val = searchForPatientsInfos($dom,'ExtrinsicObject',$id_dc,$names[$ind]);
			$name = $names[$ind];
			$re_array[$name] = $val;

	   }//FINE FOR

	$ret_array['sourcePatientId'] = $re_array['sourcePatientId'];
	
	$sourcePatientInfo_array = $re_array['sourcePatientInfo'];
	
	$patient_internal_ID = $sourcePatientInfo_array[1];
		$patient_internal_ID = substr(strstr($patient_internal_ID,'|'),1);
		$ret_array['patient_internal_ID'] = $patient_internal_ID;

		$patient_name = $sourcePatientInfo_array[3];
		$patient_name = substr(strstr($patient_name,'|'),1);
		//$patient_name = str_replace("^", " ",$patient_name);
		$pat_last_name = trim(substr($patient_name,0,strpos($patient_name,"^")));
		$pat_first_name = str_replace("^^^",
"",trim(substr($patient_name,strpos($patient_name,'^')+1)));

		$ret_array['pat_last_name'] = $pat_last_name;
		$ret_array['pat_first_name'] = $pat_first_name;

		$patient_dob = $sourcePatientInfo_array[5];
		$patient_dob = substr(strstr($patient_dob,'|'),1);
		$ret_array['patient_dob'] = $patient_dob;

		$patient_sex = $sourcePatientInfo_array[7];
		$patient_sex = substr(strstr($patient_sex,'|'),1);
		$ret_array['patient_sex'] = $patient_sex;

		$patient_address = $sourcePatientInfo_array[9];
		$patient_address = substr(strstr($patient_address,'|'),1);
		$patient_address = str_replace("^", " ",$patient_address);
		$ret_array['patient_address'] = $patient_address;

	#### RITORNO L'ARRAY DELLE INFORMAZIONI
	return $ret_array;
		
}//END OF getPatientsInfos
?>
