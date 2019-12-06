<?php
    require_once ("lib/utilities.php");
    require_once("lib/log.php");

    function error_handler($level, $message, $file, $line, $context) {
        writeFilesError($level . "-" . $message . "-" . $file . "-" . $line, "");
//        SendMessage($level . "-" . $message . "-" . $file . "-" . $line, "HTTP");
        return(false); // in questo modo viene chiamata la funzione per la gestione degli errori del PHP
    }

    function exception_handler($exception) {
        writeFilesError($exception, "");
//        SendMessage($exception, "HTTP");
    }
?>
