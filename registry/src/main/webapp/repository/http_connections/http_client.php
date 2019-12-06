<?php
class HTTP_Client
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
	var $agent_name = "elcoAgent";
	var $idfile;
	var $tmp_path;

	//Constructor, timeout 30s
	function HTTP_Client($host, $port, $timeout)
	{
		$this->host = $host;
		$this->port = $port;
		$this->timeout = $timeout;
	}

	//apre connessione
	function connect()
	{
		$this->socket = @fsockopen($this->host, $this->port, $this->errno, $this->errstr, $this->timeout);
        stream_set_timeout($this->socket, $this->timeout); // Roberto: setto il timeout per tutte le operazioni (es. fwrite)
		if ($this->save_files) {
			$fp_HTTP_Client_CONNECTION_STATUS = fopen($this->tmp_path . $this->idfile . "-HTTP_Client_CONNECTION_STATUS-" . $this->idfile, "w+");
		}
		if (!$this->socket) {
			if ($this->save_files) {
				fwrite($fp_HTTP_Client_CONNECTION_STATUS, "CONNESSIONE CON IL REGISTRY $this->host *** NON RIUSCITA ***");
				fclose($fp_HTTP_Client_CONNECTION_STATUS);
			}
			return false;
		} else {
			if ($this->save_files) {
				fwrite($fp_HTTP_Client_CONNECTION_STATUS, "CONNESSIONE CON IL REGISTRY $this->host *** AVVENUTA REGOLARMENTE ***");
				fclose($fp_HTTP_Client_CONNECTION_STATUS);
			}
			return true;
		}
	} //END OF connect()

	//### SPEDISCE: METODO PRINCIPALE
	function send_request()
	{
		if (!$this->connect()) {
			$ret = array(false, "\nERROR IN HTTP CONNECTION\n");
			return $ret;
		} else //####CASO SENZA ERRORI
		{
			$this->result = $this->request($this->post_data);
			//#### COMPONGO L'ARRAY DA RITORNARE
			$ret = array($this->result, "");
			return $ret;
		}
	} //END OF send_request()
	
	function request($post_data)
	{
		$this->buf = "";
		$post = "POST " . $this->path . " HTTP/1.1\r\n" . "Host: " . $this->host . ":" . $this->port . "\r\n" . "Accept: text/html, text/xml, image/gif, image/jpeg, *; q=.2, */*; q=.2\r\n" . "Cache-Control: no-cache\r\n" . "Connection: Close\r\n" . "Content-Length: $this->dataLength \r\n" . "Pragma: no-cache\r\n" . "SOAPAction: \"\"\r\n" . "User-Agent: " . $this->agent_name . "\r\n" . "Content-Type: text/xml; charset=\"utf-8\"\r\n" . "\r\n" . $post_data;
		if ($this->save_files) {
			$fp_HTTP_Client_POSTED = fopen($this->tmp_path . $this->idfile . "-HTTP_Client_POSTED-" . $this->idfile, "w+");
			fwrite($fp_HTTP_Client_POSTED, $post);
			fclose($fp_HTTP_Client_POSTED);
		}
		fwrite($this->socket, $post);
		while (!feof($this->socket)) {
			$this->buf.= fgets($this->socket);
		}
		$this->close();
		return $this->buf;
	}
	//########### METODI DI SERVIZIO
	
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
	
	function set_tmp_path($tmp_path)
	{
		$this->tmp_path = $tmp_path;
	}
	
	function set_protocol($prot)
	{
	}
	
	function set_host($host)
	{
	}
	
	function set_port($port)
	{
	}
	
	function set_idfile($idfile)
	{
		$this->idfile = $idfile;
	}
	
	function set_save_files($save_files)
	{
		$this->save_files = $save_files;
	}
	
	function close()
	{
		fclose($this->socket);
	}
	//############# FINE METODI DI SERVIZIO
	
} //END OF CLASS

?>