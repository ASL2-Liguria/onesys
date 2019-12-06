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

    function writeLogInfo($log_text)
    {
        writeLog($log_text, LoggerLevel::getLevelInfo());
    }

    function writeFilesError($log_text, $file_input) {
        writeLog($log_text, LoggerLevel::getLevelError());
    }

    function writeTimeFile($tempotxt)
    {
        writeLog($log_text, LoggerLevel::getLevelDebug());
    }

    //#### CLASSE PER LA CREAZIONE DEI LOGs #####
    class Log
    {
        //### VARIABILI INTERNE
        var $current_log_path;
        var $default_current_log_path;
        var $current_files_log_path;
        var $default_current_files_log_path;
        var $cur_num;
        var $isActive;
        var $isCleanCacheActive;
        var $user = null;
        var $tmp_path;
        var $idfile;
        //## COSTRUTTORE

        function Log($user)
        {
            //## NON ATTIVO PER DEFAULT
            $this->isActive = "O";
            //######## UNICO LOG
            //## CURRENT
            $this->current_log_path = '';
            if ($user == "REP") {
                //## DEFAULT LOG IN FILESYSTEM /usr/tmp/
                $this->default_current_log_path = '/usr/tmp/REPOSITORY_log.out';
            } else if ($user == "REG") {
                //## DEFAULT LOG IN FILESYSTEM /usr/tmp/
                $this->default_current_log_path = '/usr/tmp/REGISTRY_log.out';
            }
            //######## LOGS SU PIU' FILES
            //## CURRENT
            $this->current_files_log_path = '';
            //## DEFAULT LOG IN FILESYSTEM /usr/tmp/
            $this->default_current_files_log_path = '/usr/tmp/';
        } //END OF CONSTRUCTOR

        function set_tmp_path($tmp_path)
        {
            $this->tmp_path = $tmp_path;
        }

        function set_idfile($idfile)
        {
            $this->idfile = $idfile;
        }

        function setCurrentLogPath($current)
        {
            $this->current_log_path = $current . 'log.out';
        }

        function setDefaultCurrentLogPath($default_current)
        {
            $this->default_current_log_path = $default_current;
        }

        function setCurrentFileSLogPath($currentf)
        {
            $this->current_files_log_path = $currentf;
        }

        function setDefaultCurrentFileSLogPath($default_currentf)
        {
            $this->default_current_files_log_path = $default_currentf;
        }

        function setLogActive($active)
        {
            $this->isActive = $active;
        }

        function writeLogFile($log_text, $hour)
        {
            writeLog($log_text, LoggerLevel::getLevelDebug());
        }

        function writeLogFileS($log_text, $file_name, $mandatory)
        {
            writeLog($log_text, LoggerLevel::getLevelTrace());
            return "";
        }

        function writeLogDatabase($log_text)
        {
            writeLog($log_text, LoggerLevel::getLevelTrace());
        }

        function writeLogInfo($log_text)
        {
            writeLog($log_text, LoggerLevel::getLevelInfo());
        }

        function writeLogError($log_text)
        {
            writeLog($log_text, LoggerLevel::getLevelError());
        }
    } //END OF CLASS Log
?>
