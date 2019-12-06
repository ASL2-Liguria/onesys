<?php

    function modifyMetadata($dom_ebXML, $ExtrinsicObject_node, $URI, $hash, $size, $namespacerim)
    {
        //### ATTENZIONE NO include_once !!!
        require_once ("config/REP_configuration.php");
        //### RICAVO ATTRIBUTO id DI ExtrinsicObject
        $ExtrinsicObject_id_attr = $ExtrinsicObject_node->get_attribute('id');
        //### FIGLI DI ExtrinsicObject
        $ExtrinsicObject_child_nodes = $ExtrinsicObject_node->child_nodes();
        $count = 0;
        $ExtrinsicObject_child_nodes_count = count($ExtrinsicObject_child_nodes);
        for ($i = 0; $i < $ExtrinsicObject_child_nodes_count; $i++) {
            //## SINGOLO NODO FIGLIO
            $ExtrinsicObject_child_node = $ExtrinsicObject_child_nodes[$i];
            //## TAGNAME DEL SINGOLO NODO FIGLIO
            $ExtrinsicObject_child_node_tagname = $ExtrinsicObject_child_node->node_name();
            if ($ExtrinsicObject_child_node_tagname == 'Classification' && $count == 0) {
                $next_node = $ExtrinsicObject_child_node;
                $count++;
            } //END OF if($ExtrinsicObject_child_node_tagname=='Classification')
            if ($ExtrinsicObject_child_node_tagname == 'ExternalIdentifier') {
                $externalidentifier_node = $ExtrinsicObject_child_node;
                $value_value = avoidHtmlEntitiesInterpretation($externalidentifier_node->get_attribute('value'));
                //### NODI FIGLI DI EXTERNALIDENTIFIER
                $externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
                $externalidentifier_child_nodes_count = count($externalidentifier_child_nodes);
                for ($q = 0; $q < $externalidentifier_child_nodes_count; $q++) {
                    $externalidentifier_child_node = $externalidentifier_child_nodes[$q];
                    $externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
                    if ($externalidentifier_child_node_tagname == 'Name') {
                        $name_node = $externalidentifier_child_node;
                        $LocalizedString_nodes = $name_node->child_nodes();
                        $LocalizedString_nodes_count = count($LocalizedString_nodes);
                        for ($p = 0; $p < $LocalizedString_nodes_count; $p++) {
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
        } //END OF for($i=0;$i<(count($ExtrinsicObject_child_nodes));$i++)
        //######### CALCOLO URL DEL DOCUMENTO
        //### CREO IL NUOVO ELEMENTO SLOT
        $new_element_Slot = $dom_ebXML->create_element_ns($namespacerim, 'Slot', 'rim');
        $new_element_Slot->set_attribute("name", "URI");
        //### CREO IL NODO SLOT
        $new_node_Slot = $ExtrinsicObject_node->insert_before($new_element_Slot, $next_node);
        $ValueList_node = $dom_ebXML->create_element_ns($namespacerim, "ValueList", 'rim');
        $new_node_Slot->append_child($ValueList_node);
        $Value_node = $dom_ebXML->create_element_ns($namespacerim, "Value", 'rim');
        $ValueList_node->append_child($Value_node);
        //######################################################################
        //### MODIFICO IL DOM
        //$new_URI_node = $dom_ebXML->create_text_node($Document_URI);#<<=== URI
        $new_URI_node = $dom_ebXML->create_text_node($URI); //<<=== URI
        $Value_node->append_child($new_URI_node);
        //######################### FINE BLOCCO PER L'URI ########################
        //################ CALCOLO L'HASH DEL DOCUMENTO
        //### CREO IL NUOVO ELEMENTO SLOT
        $new_element_Slot = $dom_ebXML->create_element_ns($namespacerim, 'Slot', 'rim');
        $new_element_Slot->set_attribute("name", "hash");
        //### CREO IL NODO SLOT
        $new_node_Slot = $ExtrinsicObject_node->insert_before($new_element_Slot, $next_node);
        $ValueList_node = $dom_ebXML->create_element_ns($namespacerim, "ValueList", 'rim');
        $new_node_Slot->append_child($ValueList_node);
        $Value_node = $dom_ebXML->create_element_ns($namespacerim, "Value", 'rim');
        $ValueList_node->append_child($Value_node);
        //### MODIFICO IL DOM
        $new_HASH_node = $dom_ebXML->create_text_node($hash); //<<=== HASH
        $Value_node->append_child($new_HASH_node);
        //========================= FINE BLOCCO PER L'HASH ============================//
        //############## CALCOLO DEL SIZE
        //### CREO IL NUOVO ELEMENTO SLOT
        $new_element_Slot = $dom_ebXML->create_element_ns($namespacerim, 'Slot', 'rim');
        $new_element_Slot->set_attribute("name", "size");
        //### CREO IL NODO SLOT
        $new_node_Slot = $ExtrinsicObject_node->insert_before($new_element_Slot, $next_node);
        $ValueList_node = $dom_ebXML->create_element_ns($namespacerim, "ValueList", 'rim');
        $new_node_Slot->append_child($ValueList_node);
        $Value_node = $dom_ebXML->create_element_ns($namespacerim, "Value", 'rim');
        $ValueList_node->append_child($Value_node);
        //### MODIFICO IL DOM
        $new_SIZE_node = $dom_ebXML->create_text_node($size); //<<=== SIZE
        $Value_node->append_child($new_SIZE_node);
        //====================== FINE BLOCCO PER IL SIZE =========================//
        //#############################################################################
        return $dom_ebXML;
    } //END OF modifyMetadata($dom_ebXML,$ExtrinsicObject_node,$file_name,$document_URI,$allegato_STRING)

    function deleteMetadata($dom_ebXML, $ExtrinsicObject_node)
    {
        require_once ("config/REP_configuration.php");
        //### RICAVO ATTRIBUTO id DI ExtrinsicObject
        $ExtrinsicObject_id_attr = $ExtrinsicObject_node->get_attribute('id');
        //### FIGLI DI ExtrinsicObject
        $ExtrinsicObject_child_nodes = $ExtrinsicObject_node->child_nodes();
        $count = 0;
        $ExtrinsicObject_child_nodes_count = count($ExtrinsicObject_child_nodes);
        for ($i = 0; $i < $ExtrinsicObject_child_nodes_count; $i++) {
            //## SINGOLO NODO FIGLIO
            $ExtrinsicObject_child_node = $ExtrinsicObject_child_nodes[$i];
            //## TAGNAME DEL SINGOLO NODO FIGLIO
            $ExtrinsicObject_child_node_tagname = $ExtrinsicObject_child_node->node_name();
            if ($ExtrinsicObject_child_node_tagname == 'Slot') {
                $slot_node = $ExtrinsicObject_child_node;
                $value_name = $slot_node->get_attribute('name');
                if (strtoupper($value_name) == "HASH") {
                    $ExtrinsicObject_node->remove_child($ExtrinsicObject_child_nodes[$i]);
                } //END OF if(strtoupper($value_name)== "HASH")
                if (strtoupper($value_name) == "SIZE") {
                    //### NODI FIGLI DI SLOT
                    $ExtrinsicObject_node->remove_child($ExtrinsicObject_child_nodes[$i]);
                } //END OF if(strtoupper($value_name)== "SIZE")
                if (strtoupper($value_name) == "URI") {
                    //### NODI FIGLI DI SLOT
                    $ExtrinsicObject_node->remove_child($ExtrinsicObject_child_nodes[$i]);
                } //END OF if(strtoupper($value_name)== "URI")
            } //END OF if($ExtrinsicObject_child_node_tagname=='Slot')
        }
        return $dom_ebXML;
    } //END OF deleteMetadata($dom_ebXML,$ExtrinsicObject_node)

?>