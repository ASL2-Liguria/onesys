<?php
    ob_start(); // non invia subito al client ma mette tutto su un buffer

    require_once ("lib/errors_handling.php");
    set_error_handler('error_handler');
    set_exception_handler('exception_handler');

    require_once ("config/REP_configuration.php");
    require_once ($lib_path . "log.php");
    require_once ($lib_path . "domxml-php4-to-php5.php");
    $token = $_GET["token"];
    writeLogInfo("Start get document: " . $token);
    $uri_token_values = array(':token' => $token);
    $uri_token = query_select3('SELECT URI FROM DOCUMENTS WHERE KEY_PROG=:token', $uri_token_values, $connessione);
    disconnectDB($connessione);

    if ($ATNA_active == 'A') {
        $eventOutcomeIndicator = "0"; //EventOutcomeIndicator 0 OK 12 ERROR
        $today = date("Y-m-d");
        $cur_hour = date("H:i:s");
        $datetime = $today . "T" . $cur_hour;
        $message_export = "<AuditMessage xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"healthcare-security-audit.xsd\">
        <EventIdentification EventActionCode=\"R\" EventDateTime=\"$datetime\" EventOutcomeIndicator=\"0\">
        <EventID code=\"110106\" codeSystemName=\"DCM\" displayName=\"Export\"/>
        <EventTypeCode code=\"ITI-17\" codeSystemName=\"IHE Transactions\" displayName=\"Retrieve Document\"/>
        </EventIdentification>
        <ActiveParticipant UserID=\"EL.CO. GALLERY\" NetworkAccessPointTypeCode=\"2\" NetworkAccessPointID=\"" . $_SERVER['REMOTE_ADDR'] . "\"  UserIsRequestor=\"true\">
        <RoleIDCode code=\"110153\" codeSystemName=\"DCM\" displayName=\"Source\"/>
        </ActiveParticipant>
        <ActiveParticipant UserID=\"http://" . $rep_host . ":" . $rep_port . $www_REP_path . "getDocument.php\" NetworkAccessPointTypeCode=\"2\" NetworkAccessPointID=\"" . $reg_host . "\"  UserIsRequestor=\"false\">
        <RoleIDCode code=\"110152\" codeSystemName=\"DCM\" displayName=\"Destination\"/>
        </ActiveParticipant>
        <AuditSourceIdentification AuditSourceID=\"EL.CO. REPOSITORY\"/>
        <ParticipantObjectIdentification ParticipantObjectID=\"http://" . $rep_host . ":" . $rep_port . $www_REP_path . "getDocument.php?token=" . $token . "\" ParticipantObjectTypeCode=\"2\" ParticipantObjectTypeCodeRole=\"3\">
        <ParticipantObjectIDTypeCode code=\"12\"/>
        </ParticipantObjectIdentification>
        </AuditMessage>";
        require_once ($lib_path . 'syslog.php');
        $syslog = new Syslog();
        $logSyslog = $syslog->Send($ATNA_host, $ATNA_port, $message_export);
    }
    header("Location: " . $www_REP_path . $uri_token[0][0]);
    writeLogInfo("End get document: " . $token);
    ob_end_flush(); // invia il buffer al client
?>
