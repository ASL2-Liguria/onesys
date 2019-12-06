<?php
    function writeLog($log_text, $error_level) {
        if (is_array($log_text)) {
            $txt = "";
            //## IMPOSTA L'ARRAY NELLA FORMA [etichetta] = valore
            foreach ($log_text as $element => $value) {
                $txt = $txt . "$element = $value" . PHP_EOL;
            }
            $log_text = $txt;
        }
        $GLOBALS['elcoLogger']->log($error_level, $log_text);
    }

    function writeLogInfo($log_text) {
        writeLog($log_text, LoggerLevel::getLevelInfo());
    }

    function writeLogError($log_text) {
        writeLog($log_text, LoggerLevel::getLevelError());
    }

    function writeTimeFile($log_text) {
        writeLog($log_text, LoggerLevel::getLevelDebug());
    }

    function writeSQLQuery($log_text) {
        writeLog($log_text, LoggerLevel::getLevelTrace());
    }

    function writeSQLQueryService($log_text) {
        writeLog($log_text, LoggerLevel::getLevelTrace());
    }

    function writeTmpFiles($log_text, $file_name, $mandatory = false) {
        writeLog($log_text, LoggerLevel::getLevelTrace());
        return "";
    }

    function writeTmpQueryFiles($log_text, $file_name, $mandatory = false) {
        writeLog($log_text, LoggerLevel::getLevelTrace());
        return "";
    }
?>