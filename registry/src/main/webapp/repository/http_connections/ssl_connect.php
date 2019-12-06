<?php
    class HTTP_Client_ssl
    {
        var $host;
        var $port;
        var $socket;
        var $errno;
        var $errstr;
        var $timeout;
        var $buf;
        var $result;
        var $post_data;
        var $path;
        var $dataLength;
        var $agent_name = "MyAgent";
        var $idfile;
        var $action;
        var $protocol;
        var $tmp_path;
        //Constructor, timeout 30s

        function HTTP_Client_ssl($host, $port, $timeout)
        {
            $this->host = $host;
            $this->port = $port;
            $this->timeout = $timeout;
            //writeTimeFile("HTTP_client: Dentro client " . $this->host.$this->port);

        }

        function connect_ssl()
        {
            writeTimeFile("HTTP_client:sono dentro connect_ssl");
            $url = $this->protocol . $this->host . ":" . $this->port;
            writeTimeFile("HTTP_client: URL" . $url);
            $post = "POST " . $this->path . " HTTP/1.1\r\n" . "Host: " . $this->host . ":" . $this->port . "\r\n" . "Accept: text/html, text/xml, image/gif, image/jpeg, *; q=.2, */*; q=.2\r\n" . "Content-Type: text/xml; charset=UTF-8; action=\"" . $this->action . "\"\r\n" . "Cache-Control: no-cache\r\n" . "Connection: Close\r\n" . "Content-Length: $this->dataLength \r\n" . "Pragma: no-cache\r\n" . "SOAPAction: \"\"\r\n" . "User-Agent: myAgent\r\n" .
            //"Content-Type: text/xml; charset=\"utf-8\"\r\n".
            "\r\n" . $this->post_data;
            //writeTimeFile("HTTP_client: POST" . $post);
            set_time_limit(2100);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $post);
            curl_setopt($ch, CURLOPT_VERBOSE, 1);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
            curl_setopt($ch, CURLOPT_SSLCERTTYPE, "PEM");
            curl_setopt($ch, CURLOPT_SSLCERT, './certificates/athon1.ihe-europe.org.pem');
            //  curl_setopt($ch, CURLOPT_SSLCERTPASSWD, 'PASSWORD');
            curl_setopt($ch, CURLOPT_SSLKEYTYPE, "PEM");
            curl_setopt($ch, CURLOPT_SSLKEY, './certificates/athon1.ihe-europe.org.key');
            //    curl_setopt($ch, CURLOPT_SSLKEYPASSWD, 'PASSWORD');
            curl_setopt($ch, CURLOPT_CAINFO, './certificates/cacerts.pem');
            //    curl_setopt($ch,CURLOPT_CAPATH,MY_CAPATH);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout); // Roberto: setto il timeout per l'esecuzione di curl_exec
            $result = curl_exec($ch);
            if (curl_errno($ch)) {
                writeTimeFile("HTTP_client: Errori di curl" . curl_errno($ch) . "  " . curl_error($ch));
            }
            curl_close($ch);
            return $result;
        }
        //spedisce

        function send_request()
        {
            //$this->connect_ssl();
            //#### COMPONGO L'ARRAY DA RITORNARE
            $ret = array($this->connect_ssl(), "");
            //writeTimeFile("HTTP_client: Restituisco il messaggio");
            return $ret;
        }

        function set_protocol($protocol)
        {
            $this->protocol = $protocol;
            writeTimeFile("HTTP_client: Protocol" . $this->protocol);
        }

        function set_path($path)
        {
            $this->path = $path;
        }

        function set_post_data($data)
        {
            $this->post_data = $data;
        }

        function set_data_length($len)
        {
            $this->dataLength = $len;
        }

        function set_action($action)
        {
            $this->action = $action;
        }

        function set_idfile($idfile)
        {
            $this->idfile = $idfile;
        }

        function set_save_files($save_files)
        {
            $this->save_files = $save_files;
        }

        function set_tmp_path($tmp_path)
        {
            $this->tmp_path = $tmp_path;
        }
    }
?>