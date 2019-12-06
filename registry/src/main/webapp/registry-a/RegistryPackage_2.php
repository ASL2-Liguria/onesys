<?php
    writeSQLQuery('-------------------------------------------------------------------------------------');
    writeSQLQuery('RegistryPackage_2.php');
    ##### METODO PRINCIPALE
    function fill_RegistryPackage_tables($dom,$language,$connessione)
    {
        #### LANGUAGECODE
        $lang=$language;

        ##### NODEREPRESENTATION
        ##### AGGIUNTO VALORE DEFAULT NULL - DELGIU, ANDRE -
        $value_nodeRepresentation_assigned='NULL';

        ##### ARRAY DELL'ATTRIBUTO ID DI REGISTRYPACKAGE
        $RegistryPackage_id_array = array();
        $simbolic_RegistryPackage_id_array = array();

        #### FOLDERID DA NON INSERIRE
        $RegistryPackage_Fol_id_array = array();

        ##### ARRAY DEGLI ATTRIBUTI DEL NODO REGISTRYPACKAGE
        $DB_array_registrypackage_attributes = array();

        ##### RADICE DEL DOCUMENTO ebXML
        $root_ebXML = $dom->document_element();

        ##### ARRAY DEI NODI REGISTRYPACKAGE
        $dom_ebXML_RegistryPackage_node_array=$root_ebXML->get_elements_by_tagname("RegistryPackage");

        ##### ARRAY FOR ATNA
        $atna_value = array();

        #### CICLO SU OGNI RegistryPackage ####
        for($index=0;$index<(count($dom_ebXML_RegistryPackage_node_array));$index++)
        {
            ##### NODO REGISTRYPACKAGE RELATIVO AL DOCUMENTO NUMERO $index
            $RegistryPackage_node = $dom_ebXML_RegistryPackage_node_array[$index];

            ### Setto di default che RegistryPackage non è un folder già presente
            $isEmpty_F=true;

            ##### NODO REGISTRYPACKAGE RELATIVO AL DOCUMENTO NUMERO $index
            $RegistryPackage_node = $dom_ebXML_RegistryPackage_node_array[$index];

            #### ARRAY DEI FIGLI DEL NODO REGISTRYPACKAGE ##############	
            $RegistryPackage_child_nodes = $RegistryPackage_node->child_nodes();
            #################################################################

            ################# PROCESSO TUTTI I NODI FIGLI DI REGISTRYPACKAGE
            for($k=0;$k<count($RegistryPackage_child_nodes);$k++)
            {

                #### SINGOLO NODO FIGLIO DI REGISTRYPACKAGE
                $RegistryPackage_child_node=$RegistryPackage_child_nodes[$k];
                #### NOME DEL NODO
                $RegistryPackage_child_node_tagname = $RegistryPackage_child_node->node_name();

                ########## Versione 2.1 per gestione Folder.uniqueid #############
                if($RegistryPackage_child_node_tagname=='ExternalIdentifier')
                {
                    $externalidentifier_node = $RegistryPackage_child_node;
                    $value_value= avoidHtmlEntitiesInterpretation($externalidentifier_node->get_attribute('value'));

                    #### NODI FIGLI DI EXTERNALIDENTIFIER
                    $externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
                    for($q = 0;$q < count($externalidentifier_child_nodes);$q++)
                    {
                        $externalidentifier_child_node = $externalidentifier_child_nodes[$q];
                        $externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
                        if($externalidentifier_child_node_tagname=='Name')
                        {
                            $name_node=$externalidentifier_child_node;

                            $LocalizedString_nodes = $name_node->child_nodes();
                            for($p = 0;$p < count($LocalizedString_nodes);$p++)
                            {
                                $LocalizedString_node = $LocalizedString_nodes[$p];//->node_name();
                                $LocalizedString_node_tagname = $LocalizedString_node->node_name();

                                if($LocalizedString_node_tagname == 'LocalizedString')
                                {
                                    $LocalizedString_value =$LocalizedString_node->get_attribute('value');
                                    if(strpos(strtolower(trim($LocalizedString_value)),strtolower('Folder.uniqueId')))
                                    {

                                        $ebxml_value = $value_value;
                                        ### QUERY AL DB
                                        $query = "SELECT registryObject FROM ExternalIdentifier WHERE value = '$ebxml_value'";

                                        $res = query_select3($query,$connessione); //array bidimensionale
                                        writeSQLQuery($res.": ".$query); 


                                        $isEmpty_F = (empty($res));
                                        $value_RegistryPackage_id=$res[0][0];
                                        //$RegistryPackage_Fol_id_array[]=$simbolic_RegistryPackage_id_fol;

                                    }

                                }

                            }

                        }
                    }
                }
            }

            ###############################################################################
            if($isEmpty_F){

                ############## RECUPERO TUTTI GLI ATTRIBUTI DEL NODO REGISTRYPACKAGE
                $value_RegistryPackage_id = "urn:uuid:".idrandom();

                $simbolic_RegistryPackage_id = $RegistryPackage_node->get_attribute('id');
                $simbolic_RegistryPackage_id_array[] = $RegistryPackage_node->get_attribute('id');


                #############################################################
                ####NOTA BENE NEL CASO NON SIMBOLICO(VEDI SOLINFO)
                if(!isSimbolic($simbolic_RegistryPackage_id))
                {
                    $value_RegistryPackage_id=$simbolic_RegistryPackage_id;
                }
                #############################################################


                $RegistryPackage_id_array[$simbolic_RegistryPackage_id]=$value_RegistryPackage_id;

                $value_accessControlPolicy = $RegistryPackage_node->get_attribute('accessControlPolicy');
                if($value_accessControlPolicy == '')
                {
                    $value_accessControlPolicy = "NULL";
                }
                $value_objectType = $RegistryPackage_node->get_attribute('objectType');
                if($value_objectType == '')
                {
                    $value_objectType = "RegistryPackage";
                }
                $value_expiration = $RegistryPackage_node->get_attribute('expiration');
                if($value_expiration == '')
                {
                    $value_expiration = "CURRENT_TIMESTAMP";
                }
                $value_majorVersion = $RegistryPackage_node->get_attribute('majorVersion');
                if($value_majorVersion == '')
                {
                    $value_majorVersion = "0";
                }
                $value_minorVersion = $RegistryPackage_node->get_attribute('minorVersion');
                if($value_minorVersion == '')
                {
                    $value_minorVersion = "1";
                }
                $value_stability = $RegistryPackage_node->get_attribute('stability');
                if($value_stability == '')
                {
                    $value_stability = "NULL";
                }
                $value_status = $RegistryPackage_node->get_attribute('status');
                if($value_status == '')
                {
                    //$value_status = "Approved";
                    $value_status = "NotCompleted";
                }
                $value_userVersion = $RegistryPackage_node->get_attribute('userVersion');
                if($value_userVersion == '')
                {
                    $value_userVersion = "NULL";
                }

                $DB_array_registrypackage_attributes['accessControlPolicy'] = $value_accessControlPolicy;
                $DB_array_registrypackage_attributes['id'] = $value_RegistryPackage_id;
                $DB_array_registrypackage_attributes['objectType'] = $value_objectType;
                $DB_array_registrypackage_attributes['expiration'] = $value_expiration;
                $DB_array_registrypackage_attributes['majorVersion'] = $value_majorVersion;
                $DB_array_registrypackage_attributes['minorVersion'] = $value_minorVersion;
                $DB_array_registrypackage_attributes['stability'] = $value_stability;
                $DB_array_registrypackage_attributes['status'] = $value_status;
                $DB_array_registrypackage_attributes['userVersion'] = $value_userVersion;

                ####### QUI ORA POSSO RIEMPIRE IL DB
                $INSERT_INTO_RegistryPackage = "INSERT INTO RegistryPackage (id,accessControlPolicy,objectType,expiration,majorVersion,minorVersion,stability,status,userVersion) VALUES
                ('".$DB_array_registrypackage_attributes['id']."','".$DB_array_registrypackage_attributes['accessControlPolicy']."','".$DB_array_registrypackage_attributes['objectType']."',".$DB_array_registrypackage_attributes['expiration'].",'".$DB_array_registrypackage_attributes['majorVersion']."','".$DB_array_registrypackage_attributes['minorVersion']."','".$DB_array_registrypackage_attributes['stability']."','".$DB_array_registrypackage_attributes['status']."','".$DB_array_registrypackage_attributes['userVersion']."')";

                //    $ris = query_exec2($INSERT_INTO_RegistryPackage,$connessione);
                writeSQLQuery($INSERT_INTO_RegistryPackage);
                $ris = query_exec3($INSERT_INTO_RegistryPackage,$connessione);
                writeSQLQuery($ris.": ".$INSERT_INTO_RegistryPackage);

                ############## FINE RECUPERO TUTTI GLI ATTRIBUTI DEL NODO REGISTRYPACKAGE

                #### ARRAY DEI FIGLI DEL NODO REGISTRYPACKAGE ##############	
                $RegistryPackage_child_nodes = $RegistryPackage_node->child_nodes();
                #################################################################

                ################# PROCESSO TUTTI I NODI FIGLI DI REGISTRYPACKAGE
                $value_parent = $value_RegistryPackage_id;
                for($k=0;$k<count($RegistryPackage_child_nodes);$k++)
                {
                    #### SINGOLO NODO FIGLIO DI REGISTRYPACKAGE
                    $RegistryPackage_child_node=$RegistryPackage_child_nodes[$k];
                    #### NOME DEL NODO
                    $RegistryPackage_child_node_tagname = $RegistryPackage_child_node->node_name();

                    #### NODO NAME
                    if($RegistryPackage_child_node_tagname == 'Name')
                    {
                        $name_node = $RegistryPackage_child_node;
                        $DB_array_name = array();

                        $LocalizedString_nodes = $name_node->child_nodes();

                        for($p = 0;$p < count($LocalizedString_nodes);$p++)
                        {
                            $LocalizedString_node = $LocalizedString_nodes[$p];//->node_name();
                            $LocalizedString_node_tagname = $LocalizedString_node->node_name();	

                            if($LocalizedString_node_tagname == 'LocalizedString')
                            {
                                $LocalizedString_charset =$LocalizedString_node->get_attribute('charset');
                                if($LocalizedString_charset == '')
                                {
                                    $LocalizedString_charset = "UTF-8";
                                }

                                $LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
                                if($LocalizedString_lang == '')
                                {
                                    $LocalizedString_lang = $lang;
                                }
                                $LocalizedString_value =$LocalizedString_node->get_attribute('value');
                                if($LocalizedString_value == '')
                                {
                                    $LocalizedString_value = "NOT DECLARED";
                                }
                                ### CASO DI FOLDER
                                $lastUpdateTime=true;###NON MODIFICARE!!!

                                $DB_array_name['charset'] = $LocalizedString_charset;
                                $DB_array_name['lang'] = $LocalizedString_lang;
                                $DB_array_name['value'] = $LocalizedString_value;

                            }//END OF if($LocalizedString_node_tagname == 'LocalizedString')
                        }//END OF for($p = 0;$p < count($val_list_node);$p++)

                        //$value_parent = $value_RegistryPackage_id;
                        $DB_array_name['parent'] = $value_parent;

                        //print_r($DB_array_name);
                        ##### SONO PRONTO A SCRIVERE NEL DB
                        $INSERT_INTO_Name = "INSERT INTO Name (charset,lang,value,parent) VALUES ('".trim($DB_array_name['charset'])."','".trim($DB_array_name['lang'])."','".trim(adjustString($DB_array_name['value']))."','".trim($DB_array_name['parent'])."')";


                        //        $ris = query_exec2($INSERT_INTO_Name,$connessione);
                        $ris = query_exec3($INSERT_INTO_Name,$connessione);
                        writeSQLQuery($ris.": ".$INSERT_INTO_Name);

                    }//END OF if($RegistryPackage_child_node_tagname == 'Name')
                    ######## NODO NAME

                    #### NODO DESCRIPTION
                    else if($RegistryPackage_child_node_tagname == 'Description')
                        {
                            $description_node = $RegistryPackage_child_node;
                            $DB_array_description = array();

                            $LocalizedString_nodes = $description_node->child_nodes();
                            if(count($LocalizedString_nodes)!=0)
                            {
                                //print_r($LocalizedString_nodes);
                                for($p = 0;$p < count($LocalizedString_nodes);$p++)
                                {
                                    $LocalizedString_node = $LocalizedString_nodes[$p];
                                    $LocalizedString_node_tagname = $LocalizedString_node->node_name();	

                                    if($LocalizedString_node_tagname == 'LocalizedString')
                                    {
                                        $LocalizedString_charset =$LocalizedString_node->get_attribute('charset');
                                        if($LocalizedString_charset == '')
                                        {
                                            $LocalizedString_charset = "UTF-8";
                                        }

                                        $LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
                                    if($LocalizedString_lang == '')
                                    {
                                        $LocalizedString_lang = $lang;
                                    }
                                    $LocalizedString_value =$LocalizedString_node->get_attribute('value');
                                    if($LocalizedString_value == '')
                                    {
                                        $LocalizedString_value = "NOT DECLARED";
                                    }
                                    $DB_array_description['charset'] = $LocalizedString_charset;
                                    $DB_array_description['lang'] = $LocalizedString_lang;
                                    $DB_array_description['value'] = $LocalizedString_value;
                                }//END OF if($LocalizedString_node_tagname == 'LocalizedString')
                            }//END OF for($p = 0;$p < count($val_list_node);$p++)

                            //$value_parent = $id;
                            $DB_array_description['parent'] = $value_parent;
                        }
                        else{
                            $DB_array_description['charset'] = "UTF-8";
                            $DB_array_description['lang'] = "it-it";
                            $DB_array_description['value'] = "NOT DECLARED";
                            $DB_array_description['parent'] = $value_parent;
                        }

                        ##### SONO PRONTO A SCRIVERE NEL DB
                        $INSERT_INTO_Description = "INSERT INTO Description (charset,lang,value,parent) VALUES ('".trim($DB_array_description['charset'])."','".trim($DB_array_description['lang'])."','".trim(adjustString($DB_array_description['value']))."','".trim($DB_array_description['parent'])."')";


                        //        $ris = query_exec2($INSERT_INTO_Description,$connessione);
                        $ris = query_exec3($INSERT_INTO_Description,$connessione);
                        writeSQLQuery($ris.": ".$INSERT_INTO_Description);

                    }//END OF if($RegistryPackage_child_node_tagname == 'Description')
                    ######### NODO DESCRIPTION

                    #### NODO SLOT
                    else if($RegistryPackage_child_node_tagname == 'Slot')
                        {
                            $slot_node = $RegistryPackage_child_node;
                            $DB_array_slot_attributes = array();

                            $value_name= $slot_node->get_attribute('name');
                            if($value_name == '')
                            {
                                $value_name = "NOT DECLARED";
                            }
                            $value_slotType = $slot_node->get_attribute('slotType');
                        if($value_slotType == '')
                        {
                            $value_slotType = "NULL";
                        }

                        $DB_array_slot_attributes['name'] = $value_name;
                        $DB_array_slot_attributes['slotType'] = $value_slotType;
                        $DB_array_slot_attributes['value'] = '';
                        $DB_array_slot_attributes['parent'] = $value_parent;

                        #### NODI FIGLI DI SLOT
                        $slot_child_nodes = $slot_node->child_nodes();

                        for($q = 0;$q < count($slot_child_nodes);$q++)
                        {
                            $slot_child_node = $slot_child_nodes[$q];
                            $slot_child_node_tagname = $slot_child_node->node_name();
                            if($slot_child_node_tagname=='ValueList')
                            {
                                $valuelist_node = $slot_child_node;
                                $valuelist_child_nodes = $valuelist_node->child_nodes();

                                for($r=0;$r<count($valuelist_child_nodes);$r++)
                                {
                                    $value_node=$valuelist_child_nodes[$r];
                                    $value_node_tagname=$value_node->node_name();
                                    if($value_node_tagname=='Value' && $value_name!="lastUpdateTime")
                                    {
                                        $value_value = $value_node->get_content();
                                        $DB_array_slot_attributes['value'] = $value_value;
                                        ##### SONO PRONTO A SCRIVERE NEL DB
                                        $INSERT_INTO_Slot = "INSERT INTO Slot (name,slotType,value,parent) VALUES ('".trim($DB_array_slot_attributes['name'])."','".trim($DB_array_slot_attributes['slotType'])."','".trim(adjustString($DB_array_slot_attributes['value']))."','".trim($DB_array_slot_attributes['parent'])."')";

                                        //                            $ris = query_exec2($INSERT_INTO_Slot,$connessione);
                                        $ris = query_exec3($INSERT_INTO_Slot,$connessione);
                                        writeSQLQuery($ris.": ".$INSERT_INTO_Slot);
                                    }
                                }

                            }
                        }

                    }//END OF if($RegistryPackage_child_node_tagname == 'Slot')
                    ########## NODO SLOT

                    #### NODO CLASSIFICATION
                    else if($RegistryPackage_child_node_tagname=='Classification')
                        {
                            $classification_node = $RegistryPackage_child_node;
                            $DB_array_classification_attributes = array();

                            $value_id= $classification_node->get_attribute('id');
                            if($value_id == '')
                            {
                                $value_id = "urn:uuid:".idrandom();
                            }
                            $value_classifiedObject=$value_RegistryPackage_id;
                        $value_accessControlPolicy= $classification_node->get_attribute('accessControlPolicy');
                        if($value_accessControlPolicy == '')
                        {
                            $value_accessControlPolicy = "NULL";
                        }
                        $value_objectType= $classification_node->get_attribute('objectType');
                        if($value_objectType == '')
                        {
                            $value_objectType = "Classification";
                        }
                        $value_classificationNode= $classification_node->get_attribute('classificationNode');
                        $value_classificationScheme= $classification_node->get_attribute('classificationScheme');
                        if($value_classificationNode == '')
                        {
                            $queryForName_value="SELECT Name_value FROM ClassificationScheme WHERE ClassificationScheme.id = '$value_classificationScheme'";


                            $risName_value=query_select3($queryForName_value,$connessione);
                            writeSQLQuery($risName_value.": ".$queryForName_value);

                            $name_value=$risName_value[0][0];
                            $name_value=substr($name_value,0,strpos($name_value,'.'));

                            $queryForClassificationNode="SELECT id FROM ClassificationNode WHERE ClassificationNode.code = '$name_value'";

                            $ris_code=query_select3($queryForClassificationNode,$connessione);
                            writeSQLQuery($ris_code.": ".$queryForClassificationNode);

                            $value_classificationNode=$ris_code[0][0];
                        }
                        if($value_classificationScheme == '')
                        {
                            $queryForClassificationNode="SELECT code FROM ClassificationNode WHERE ClassificationNode.id = '$value_classificationNode'";

                            $ris_classificationNode = query_select3($queryForClassificationNode,$connessione);
                            writeSQLQuery($ris_classificationNode.": ".$queryForClassificationNode);

                            $code_classificationNode = $ris_classificationNode[0][0];
                            #### FOLDER
                            if($code_classificationNode=="XDSFolder")
                            {
                                $queryForClassificationScheme="SELECT id FROM ClassificationScheme WHERE ClassificationScheme.Name_value = 'XDSFolder.codeList'";

                                $ris_ClassificationScheme=query_select3($queryForClassificationScheme,$connessione);
                                writeSQLQuery($ris_ClassificationScheme.": ".$queryForClassificationScheme);

                                $value_classificationScheme=$ris_ClassificationScheme[0][0];

                            }//END OF if($code_classificationNode=="XDSFolder")
                            #### SUBMISSIONSET
                            else if($code_classificationNode=="XDSSubmissionSet")
                                {
                                    $queryForClassificationScheme="SELECT id FROM ClassificationScheme WHERE ClassificationScheme.Name_value = 'XDSSubmissionSet.contentTypeCode'";

                                    $ris_ClassificationScheme=query_select3($queryForClassificationScheme,$connessione);
                                    writeSQLQuery($ris_ClassificationScheme.": ".$queryForClassificationScheme);

                                    $value_classificationScheme=$ris_ClassificationScheme[0][0];

                                }//END OF if($code_classificationNode=="XDSSubmissionSet")
                        }//END OF if($value_classificationScheme == '')
                        $value_nodeRepresentation= $classification_node->get_attribute('nodeRepresentation');
                        ## SALVO IL VALORE DI nodeRepresentation DICHIARATO NEL SUBMISSIONSET
                        if($value_nodeRepresentation!='' && $value_classificationScheme=='urn:uuid:aa543740-bdda-424e-8c96-df4873be8500')
                        {
                            $value_nodeRepresentation_assigned=$value_nodeRepresentation;
                            writeSQLQuery("VALUE NODE RAPRESENTATION".$value_nodeRepresentation_assigned); 
                        }
                        ## CASO DI nodeRepresentation NON DICHIARATO (ES. FOLDER)
                        if($value_nodeRepresentation == '')
                        {
                            $value_nodeRepresentation=$value_nodeRepresentation_assigned;
                        }

                        $DB_array_classification_attributes['classificationScheme'] = $value_classificationScheme;
                        $DB_array_classification_attributes['accessControlPolicy'] = $value_accessControlPolicy;
                        $DB_array_classification_attributes['id'] = $value_id;
                        $DB_array_classification_attributes['objectType'] = $value_objectType;
                        $DB_array_classification_attributes['classifiedObject'] = $value_classifiedObject;
                        $DB_array_classification_attributes['classificationNode'] = $value_classificationNode;
                        $DB_array_classification_attributes['nodeRepresentation'] = $value_nodeRepresentation;

                        //print_r($DB_array_classification_attributes);
                        ##### SONO PRONTO A SCRIVERE NEL DB
                        $INSERT_INTO_Classification = "INSERT INTO Classification (id,accessControlPolicy,objectType,classificationNode,classificationScheme,classifiedObject,nodeRepresentation) VALUES ('".trim($DB_array_classification_attributes['id'])."','".trim($DB_array_classification_attributes['accessControlPolicy'])."','".trim($DB_array_classification_attributes['objectType'])."','".trim($DB_array_classification_attributes['classificationNode'])."','".trim($DB_array_classification_attributes['classificationScheme'])."','".trim($DB_array_classification_attributes['classifiedObject'])."','".trim($DB_array_classification_attributes['nodeRepresentation'])."')";

                        //            $ris = query_exec2($INSERT_INTO_Classification,$connessione);
                        $ris = query_exec3($INSERT_INTO_Classification,$connessione);
                        writeSQLQuery($ris.": ".$INSERT_INTO_Classification);

                        #### NODI FIGLI DI CLASSIFICATION
                        $classification_child_nodes = $classification_node->child_nodes();

                        for($q = 0;$q < count($classification_child_nodes);$q++)
                        {
                            $classification_child_node = $classification_child_nodes[$q];
                            $classification_child_node_tagname = $classification_child_node->node_name();
                            if($classification_child_node_tagname=='Name')
                            {
                                $name_node=$classification_child_node;
                                $DB_array_name = array();

                                $LocalizedString_nodes = $name_node->child_nodes();
                                //print_r($LocalizedString_nodes);
                                for($p = 0;$p < count($LocalizedString_nodes);$p++)
                                {
                                    $LocalizedString_node = $LocalizedString_nodes[$p];//->node_name();
                                    $LocalizedString_node_tagname = $LocalizedString_node->node_name();	

                                    if($LocalizedString_node_tagname == 'LocalizedString')
                                    {
                                        $LocalizedString_charset =$LocalizedString_node->get_attribute('charset');
                                        if($LocalizedString_charset == '')
                                        {
                                            $LocalizedString_charset = "UTF-8";
                                        }

                                        $LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
                                        if($LocalizedString_lang == '')
                                        {
                                            $LocalizedString_lang = $lang;
                                        }
                                        $LocalizedString_value =$LocalizedString_node->get_attribute('value');
                                        if($LocalizedString_value == '')
                                        {
                                            $LocalizedString_value = "NOT DECLARED";
                                        }
                                        $DB_array_name['charset'] = $LocalizedString_charset;
                                        $DB_array_name['lang'] = $LocalizedString_lang;
                                        $DB_array_name['value'] = $LocalizedString_value;
                                    }//END OF if($LocalizedString_node_tagname == 'LocalizedString')
                                }//END OF for($p = 0;$p < count($val_list_node);$p++)

                                //$value_parent = $id;
                                $DB_array_name['parent'] = $value_id;

                                //print_r($DB_array_name);
                                ##### SONO PRONTO A SCRIVERE NEL DB
                                $INSERT_INTO_Name = "INSERT INTO Name (charset,lang,value,parent) VALUES ('".trim($DB_array_name['charset'])."','".trim($DB_array_name['lang'])."','".trim(adjustString($DB_array_name['value']))."','".trim($DB_array_name['parent'])."')";


                                //        $ris = query_exec2($INSERT_INTO_Name,$connessione);
                                $ris = query_exec3($INSERT_INTO_Name,$connessione);
                                writeSQLQuery($ris.": ".$INSERT_INTO_Name);

                            }//END OF if($classification_child_node_tagname=='Name')

                        }
                        for($rs = 0;$rs < count($classification_child_nodes);$rs++)
                        {
                            $classification_child_node = $classification_child_nodes[$rs];
                            $classification_child_node_tagname = $classification_child_node->node_name();
                            if($classification_child_node_tagname=='Slot')
                            //else if($classification_child_node_tagname=='Slot')
                            {
                                $slot_node = $classification_child_node;
                                $DB_array_slot_attributes = array();

                                $value_name= $slot_node->get_attribute('name');
                                if($value_name == '')
                                {
                                    $value_name = "NOT DECLARED";
                                }
                                $value_slotType = $slot_node->get_attribute('slotType');
                                if($value_slotType == '')
                                {
                                    $value_slotType = "NULL";
                                }

                                $DB_array_slot_attributes['name'] = $value_name;
                                $DB_array_slot_attributes['slotType'] = $value_slotType;
                                $DB_array_slot_attributes['value'] = '';
                                $DB_array_slot_attributes['parent'] = $value_id;

                                $slot_child_nodes = $slot_node->child_nodes();
                                for($q = 0;$q < count($slot_child_nodes);$q++)
                                {
                                    $slot_child_node = $slot_child_nodes[$q];
                                    $slot_child_node_tagname = $slot_child_node->node_name();
                                    if($slot_child_node_tagname=='ValueList')
                                    {
                                        $valuelist_node = $slot_child_node;
                                        $valuelist_child_nodes = $valuelist_node->child_nodes();

                                        for($r=0;$r<count($valuelist_child_nodes);$r++)
                                        {
                                            $value_node=$valuelist_child_nodes[$r];
                                            $value_node_tagname=$value_node->node_name();
                                            if($value_node_tagname=='Value')
                                            {
                                                $value_value = $value_node->get_content();
                                                $DB_array_slot_attributes['value'] = $value_value;
                                                ##### SONO PRONTO A SCRIVERE NEL DB
                                                $INSERT_INTO_Slot = "INSERT INTO Slot (name,slotType,value,parent) VALUES ('".trim($DB_array_slot_attributes['name'])."','".trim($DB_array_slot_attributes['slotType'])."','".trim(adjustString($DB_array_slot_attributes['value']))."','".trim($DB_array_slot_attributes['parent'])."')";

                                                //                            $ris = query_exec2($INSERT_INTO_Slot,$connessione);
                                                $ris = query_exec3($INSERT_INTO_Slot,$connessione);
                                                writeSQLQuery($ris.": ".$INSERT_INTO_Slot);
                                            }
                                        }

                                    }
                                }

                            }//END OF if($classification_child_node_tagname=='Slot')

                        }
                    }//END OF if($RegistryPackage_child_node_tagname=='Classification')
                    ############## NODO CLASSIFICATION

                    #### NODO EXTERNALIDENTIFIER
                    //$ExternalIdentifier_count =0;
                    else if($RegistryPackage_child_node_tagname=='ExternalIdentifier')
                        {
                            //$ExternalIdentifier_count++;
                            $externalidentifier_node = $RegistryPackage_child_node;
                            $DB_array_externalidentifier_attributes = array();

                            $value_accessControlPolicy= $externalidentifier_node->get_attribute('accessControlPolicy');
                            if($value_accessControlPolicy == '')
                            {
                                $value_accessControlPolicy = "NULL";
                            }
                            $value_id= $externalidentifier_node->get_attribute('id');
                        if($value_id == '')
                        {
                            $value_id = "urn:uuid:".idrandom();
                        }
                        $value_objectType= $externalidentifier_node->get_attribute('objectType');
                        if($value_objectType == '')
                        {
                            $value_objectType = "ExternalIdentifier";
                        }
                        $value_registryObject=$value_RegistryPackage_id;
                        // 			$value_registryObject= $externalidentifier_node->get_attribute('registryObject');
                        // 			if($value_registryObject == '')
                        // 			{
                        // 				$value_registryObject = "NOT DECLARED";
                        // 			}
                        $value_identificationScheme= $externalidentifier_node->get_attribute('identificationScheme');
                        #### DALL'identificationScheme RICONOSCO IL TIPO DI REGISTRYPACKAGE
                        $queryForName_value="SELECT Name_value FROM ClassificationScheme WHERE ClassificationScheme.id = '$value_identificationScheme'";
                        $risName_value=query_select3($queryForName_value,$connessione);
                        $name_value=$risName_value[0][0];
                        $name_value=substr($name_value,0,strpos($name_value,'.'));

                        $query_for_objectType="SELECT id FROM ClassificationNode WHERE ClassificationNode.code = '$name_value'";

                        $objectType_arr = query_select3($query_for_objectType,$connessione);
                        writeSQLQuery($objectType_arr.": ".$query_for_objectType);

                        $objectType=$objectType_arr[0][0];

                        #### CASO DI FOLDER
                        if($name_value=='XDSFolder' && $lastUpdateTime)// && $ExternalIdentifier_count==1)
                        {
                            //$datetime="00000000000000";
                            $today = date("Ymd");
                            $cur_hour = date("His");
                            $datetime = $today.$cur_hour;

                            $insert_lastUpdateTime_Slot="INSERT INTO Slot (name,slotType,value,parent) VALUES ('lastUpdateTime','NULL','$datetime','$value_parent')";


                            //				$ris=query_exec2($insert_lastUpdateTime_Slot,$connessione);
                            $ris=query_exec3($insert_lastUpdateTime_Slot,$connessione);
                            writeSQLQuery($ris.": ".$insert_lastUpdateTime_Slot);
                            $lastUpdateTime=false;

                        }//END OF if($name_value=='XDSFolder')

                        ####UPDATE DELL'OBJECTTYPE
                        $update_objectType="UPDATE RegistryPackage SET RegistryPackage.objectType = '$objectType' WHERE RegistryPackage.id = '$value_RegistryPackage_id'";
                        //			$ris=query_exec2($update_objectType,$connessione);
                        $ris=query_exec3($update_objectType,$connessione);
                        writeSQLQuery($ris.": ".$update_objectType);

                        //$value_value= avoidHtmlEntitiesInterpretation($externalidentifier_node->get_attribute('value'));
                        $value_value=$externalidentifier_node->get_attribute('value');
                        if($value_value == '')
                        {
                            $value_value = "NOT DECLARED";
                        }

                        $DB_array_externalidentifier_attributes['accessControlPolicy'] = $value_accessControlPolicy;
                        $DB_array_externalidentifier_attributes['id'] = $value_id;
                        $DB_array_externalidentifier_attributes['objectType'] = $value_objectType;
                        $DB_array_externalidentifier_attributes['registryObject'] = $value_registryObject;
                        $DB_array_externalidentifier_attributes['identificationScheme'] = $value_identificationScheme;
                        $DB_array_externalidentifier_attributes['value'] = $value_value;

                        //print_r($DB_array_externalidentifier_attributes);
                        ##### SONO PRONTO A SCRIVERE NEL DB
                        $INSERT_INTO_ExternalIdentifier = "INSERT INTO ExternalIdentifier (id,accessControlPolicy,objectType,registryObject,identificationScheme,value) VALUES ('".trim($DB_array_externalidentifier_attributes['id'])."','".trim($DB_array_externalidentifier_attributes['accessControlPolicy'])."','".trim($DB_array_externalidentifier_attributes['objectType'])."','".trim($DB_array_externalidentifier_attributes['registryObject'])."','".trim($DB_array_externalidentifier_attributes['identificationScheme'])."','".trim(adjustString($DB_array_externalidentifier_attributes['value']))."')";

                        //            $ris = query_exec2($INSERT_INTO_ExternalIdentifier,$connessione);
                        $ris = query_exec3($INSERT_INTO_ExternalIdentifier,$connessione);
                        writeSQLQuery($ris.": ".$INSERT_INTO_ExternalIdentifier);

                        $atna_value_index=trim($DB_array_externalidentifier_attributes['identificationScheme']);
                        $atna_value[$atna_value_index]=trim(adjustString($DB_array_externalidentifier_attributes['value']));



                        #### NODI FIGLI DI EXTERNALIDENTIFIER
                        $externalidentifier_child_nodes = $externalidentifier_node->child_nodes();
                        //print_r($name_node);
                        for($q = 0;$q < count($externalidentifier_child_nodes);$q++)
                        {
                            $externalidentifier_child_node = $externalidentifier_child_nodes[$q];
                            $externalidentifier_child_node_tagname = $externalidentifier_child_node->node_name();
                            if($externalidentifier_child_node_tagname=='Name')
                            {
                                $name_node=$externalidentifier_child_node;
                                $DB_array_name = array();

                                $LocalizedString_nodes = $name_node->child_nodes();
                                //print_r($LocalizedString_nodes);
                                for($p = 0;$p < count($LocalizedString_nodes);$p++)
                                {
                                    $LocalizedString_node = $LocalizedString_nodes[$p];//->node_name();
                                    $LocalizedString_node_tagname = $LocalizedString_node->node_name();	

                                    if($LocalizedString_node_tagname == 'LocalizedString')
                                    {
                                        $LocalizedString_charset =$LocalizedString_node->get_attribute('charset');
                                        if($LocalizedString_charset == '')
                                        {
                                            $LocalizedString_charset = "UTF-8";
                                        }

                                        $LocalizedString_lang = $LocalizedString_node->get_attribute('lang');
                                        if($LocalizedString_lang == '')
                                        {
                                            $LocalizedString_lang = $lang;
                                        }
                                        $LocalizedString_value =$LocalizedString_node->get_attribute('value');
                                        if($LocalizedString_value == '')
                                        {
                                            $LocalizedString_value = "NOT DECLARED";
                                        }
                                        $DB_array_name['charset'] = $LocalizedString_charset;
                                        $DB_array_name['lang'] = $LocalizedString_lang;
                                        $DB_array_name['value'] = $LocalizedString_value;
                                    }//END OF if($LocalizedString_node_tagname == 'LocalizedString')
                                }//END OF for($p = 0;$p < count($val_list_node);$p++)

                                //$value_parent = $id;
                                $DB_array_name['parent'] = $value_id;
                            }
                        }
                        //print_r($DB_array_name);
                        ##### SONO PRONTO A SCRIVERE NEL DB
                        $INSERT_INTO_Name = "INSERT INTO Name (charset,lang,value,parent) VALUES ('".trim($DB_array_name['charset'])."','".trim($DB_array_name['lang'])."','".trim(adjustString($DB_array_name['value']))."','".trim($DB_array_name['parent'])."')";

                        //        $ris = query_exec2($INSERT_INTO_Name,$connessione);
                        $ris = query_exec3($INSERT_INTO_Name,$connessione);
                        writeSQLQuery($ris.": ".$INSERT_INTO_Name);	

                    }//END OF if($RegistryPackage_child_node_tagname=='ExternalIdentifier')

                }//END OF for($k=0;$k<count($RegistryPackage_child_nodes);$k++)

                ################# FINE PROCESSO TUTTI I NODI FIGLI DI REGISTRYPACKAGE

            } //END OF if($isEmpty_F)

            // Se il folder.uniqueID è già presente inserisco nella variabile gli id dei folder da non inserire
            else {

                $simbolic_RegistryPackage_id_fol = $RegistryPackage_node->get_attribute('id');
                $RegistryPackage_Fol_id_array[]=$simbolic_RegistryPackage_id_fol;


                $RegistryPackage_id_array[$simbolic_RegistryPackage_id_fol]=$value_RegistryPackage_id;
            }
        }//END OF for($index=0;$index<(count($dom_ebXML_RegistryPackage_node_array));$index++)

        $RegistryPackage_id_array['nodeRepresentation']=$value_nodeRepresentation_assigned;


        //return $RegistryPackage_id_array;
        return array($RegistryPackage_id_array,$atna_value,$simbolic_RegistryPackage_id_array,$RegistryPackage_Fol_id_array);



    }//END OF fill_RegistryPackage_tables($dom)

?>