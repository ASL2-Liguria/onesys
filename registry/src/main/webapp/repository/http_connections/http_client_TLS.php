<?php
###### CLASSE CHE DEFINISCE UN CLIENT PER LE CONNESSIONI IN MODALITA' TLS

define("CRLF","\r\n");

class HTTP_Client_TLS
{
	var $socket;
	var $errno;
	var $errstr;
	var $buf;
	var $result;
	var $post_data;
	var $dataLength;
	var $agent_name = "MyAgent";

	var $path;
	var $protocol;
	var $host;
	var $port;

	##### COSTRUTTORE VUOTO
	function HTTP_Client_TLS()
	{}

function send_request()
{ 
###### COMPONGO L'URL A CUI SPEDIRE
  $url = $this->protocol.$this->host.":".$this->port;

###### DATI DI POST: HEADERS + POST_DATA
  $post = "POST ".$this->path." HTTP/1.0".CRLF.
	"Host: ".$this->host.":".$this->port.CRLF.
	"Accept: text/html, text/xml, image/gif, image/jpeg, *; q=.2, */*; q=.2".CRLF.
	"Cache-Control: no-cache".CRLF.
	"Connection: keep-alive".CRLF.
	"Content-Length: ".$this->dataLength.CRLF.
	"Pragma: no-cache".CRLF.
	"SOAPAction: \"\"".CRLF.
	"User-Agent: myAgent".CRLF.
	"Content-Type: text/xml; charset=\"utf-8\"".CRLF.
	CRLF.$this->post_data;

##### APRO LA SESSIONE CURL
  $ch = curl_init();

##### SETTO LE OPZIONI DEL CURL CLIENT

//   if (PROXY_EXISTS)
//   {
//     curl_setopt($ch, CURLOPT_PROXY, LOCAL_PROXY);
//     curl_setopt($ch, CURLOPT_PROXYPORT, LOCAL_PROXY_PORT);
//     curl_setopt($ch, CURLOPT_PROXYUSERPWD, LOCAL_PROXY_USER);
//   }

  curl_setopt($ch, CURLOPT_URL,$url);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $post);
  curl_setopt($ch, CURLOPT_HEADER, TRUE);
  curl_setopt($ch, CURLOPT_VERBOSE, TRUE);

##### LOGS DEL CLIENT
  $fp_TLS_Client_POST = fopen("tmp/TLS_Client_POST","w+");
  curl_setopt($ch, CURLOPT_STDERR, $fp_TLS_Client_POST);

  curl_setopt($ch, CURLOPT_SSLCERTTYPE, "PEM");
  curl_setopt($ch, CURLOPT_SSLCERT, "/var/www/repository-a/certificates/athon1.ihe-europe.org.pem");
  curl_setopt($ch, CURLOPT_SSLCERTPASSWD, '');
  curl_setopt($ch, CURLOPT_SSLKEYTYPE, "PEM");
  curl_setopt($ch, CURLOPT_SSLKEY, "/var/www/repository-a/certificates/athon1.ihe-europe.org.key");
  curl_setopt($ch, CURLOPT_SSLKEYPASSWD, '');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,FALSE);

  #### ESEGUO IL POST
  $result = curl_exec($ch);

######## CASO DI ERRORE
   $error_tls = curl_errno($ch);
   $error_log = "";
   if($error_tls)
   {
	####### MESSAGGIO
	$error_log = "\nError: " . $error_tls ."  " .curl_error($ch)."\n";

   }//END OF if (curl_errno($ch))

####### CHIUDO LA CONNESSIONE
   curl_close($ch);

###### RITORNO IL RISULTATO DEL POST
   $ret = array($result,$error_log);

   return $ret;

}//END OF send_request()

########### METODI DI SERVIZIO

function set_post_data($data)
{
	$this->post_data = $data;
}
function set_data_length($len)
{
	$this->dataLength = $len;
}
function set_protocol($prot)
{
	$this->protocol = $prot;
}
function set_host($host)
{
	$this->host = $host;
}
function set_port($port)
{
	$this->port = $port;
}

function set_path($path_reg)
{
	$this->path = $path_reg;
}

############ FINE METODI DI SERVIZIO

}//END OF CLASS

?>