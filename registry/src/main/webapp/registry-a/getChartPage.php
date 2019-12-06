<?php
ob_start();
$script = $_SERVER['PHP_SELF'];
$www_REG_path = str_replace('getChartPage.php', '', $script);
$codice_esame = $_GET["codice_esame"];
$codice_paziente = $_GET["codice_paziente"];
ob_get_clean();
$path_header = "Path: " . $www_REG_path;
if ($http == "TLS") {
	$path_header.= "; Secure";
}
header($path_header);
header("Content-Type: text/html;charset=UTF-8");
header("Pragma: no-cache");
header("Expires: 0");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
?>
<HTML>
<TITLE>Visualizzazione grafico</TITLE>
<HEAD></HEAD>
<BODY bgcolor="#009900">
<TABLE WIDTH="100%" ALIGN="center">
<TR>
<TD ALIGN="center">
<?php
print ("<IMG SRC=\"getChart.php?codice_esame=" . $codice_esame . "&codice_paziente=" . $codice_paziente . "\" ALT=\"GRAFICO ESAME\">");
?>
</TD>
</TR>
<TR>
<TD ALIGN="center">
<input type=button value="CHIUDI" onClick="javascript:window.close()" name="buttonChiudi">
</TD>
</TR>
</TABLE>
</BODY>
</HTML>
<?php
flush();
ob_flush();
ob_end_flush();
?>