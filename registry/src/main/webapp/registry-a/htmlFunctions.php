<?php
function htmlResponse($data, $table_columns)
{
	require ("htmlConstants.php");
	$col_count = count($table_columns);
	$row_count = count($data);
	$htmlMessage = "<HTML><HEAD></HEAD><BODY " . $background_color . ">";
	$htmlMessage.= "<TABLE BORDER='1' WIDTH='100%' ALIGN='center' CELLSPACING='1' CELLPADDING='1'>";
	$htmlMessage.= "<TR>"; // inserisco la riga contenente l'intestazione delle colonne
	for ($e = 0; $e < $col_count; $e++) {
		$htmlMessage.= writeColumn(strtoupper($table_columns[$e][1]), "bgcolor='#66FF66'", $font_color, null);
	}
	$htmlMessage.= "</TR>";
	for ($i = 0; $i < $row_count; $i++) {
		$row = $data[$i];
		$row_color = ($i & 1) ? $color_row1 : $color_row2; // alterno i colori delle righe in modo che siano più leggibili
		$htmlMessage.= "<TR>";
		for ($r = 0; $r < $col_count; $r++) {
			$col_name = $table_columns[$r][0];
			$col_data = AlarmValue($col_name, $row);
			$use_color = AlarmColor($col_name, $row, $row_color);
			$uri = null;
			if ($col_name == "DESCR_ESAME") {
				$uri = "getChartPage.php?codice_esame=" . $row[CODICE_ESAME] . "&codice_paziente=" . $row[ID_PAZIENTE];
			} else if ($col_name == "DATA_PRELIEVO") {
				$col_data = ConvertDate($col_data);
			}
			$htmlMessage.= writeColumn($col_data, $use_color, $font_color, $uri);
		}
		$htmlMessage.= "</TR>";
	}
	$htmlMessage.= "</TABLE>";
	$htmlMessage.= "</BODY></HTML>";
	return $htmlMessage;
}

function writeColumn($data, $bgColor, $fontColor, $uri)
{
	if (is_null($uri)) {
		$htmlMessage = "<TD align='center' " . $bgColor . "><font " . $fontColor . ">" . $data . "</font></TD>";
	} else {
		$fontColor = "color='#000000'";
		$htmlMessage = "<TD onmouseover=\"javascript:this.style.cursor='hand'\" onclick='javascript:window.showModalDialog(\"" . $uri . "\",\"Chart\",\"dialogLeft:0px;dialogTop:0px;dialogHeight:\"+screen.height+\";dialogWidth:\"+screen.width+\"\");' align='center' " . $bgColor . "><u><font " . $fontColor . "><strong>" . $data . "</strong></font></u></TD>";
	}
	return $htmlMessage;
}

function StartSendMessage($http)
{
	ob_get_clean();
	header("HTTP/1.1 200 OK");
	$path_header = "Path: " . $_SESSION["www_REG_path"];
	if ($http == "TLS") {
		$path_header.= "; Secure";
	}
	header($path_header);
	header("Pragma: no-cache");
	header("Expires: 0");
	header("Cache-Control: no-cache, no-store, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
}

function EndSendMessage()
{
	flush();
	ob_flush();
	ob_end_flush();
}

function SendHTMLMessage($string_input, $http)
{
	StartSendMessage($http);
	header("Content-Type: text/html;charset=UTF-8");
	header("Content-Length: " . (string)strlen($string_input));
	print ($string_input);
	EndSendMessage();
}

function SendChart($data, $title, $http)
{
	StartSendMessage($http);
	header("Content-Type: image/png");
	$row_count = count($data);
	$chart = new LineChart(1200, 600);
	$serieValori = new XYDataSet();
	$serieMin = new XYDataSet();
	$serieMax = new XYDataSet();
	for ($i = 0; $i < $row_count; $i++) {
		$convDate = ConvertDate($data[$i][0]);
		$serieValori->addPoint(new Point($convDate, $data[$i][1]));
		$serieMin->addPoint(new Point($convDate, $data[$i][2]));
		$serieMax->addPoint(new Point($convDate, $data[$i][3]));
	}
	$dataSetSerie = new XYSeriesDataSet();

	$dataSetSerie->addSerieColor("Valori massimi", $serieMax, new Color(255, 0, 0), 1);
	$dataSetSerie->addSerieColor("Valori minimi", $serieMin, new Color(255, 0, 0), 1);
	$dataSetSerie->addSerieColor("Valori rilevati", $serieValori, new Color(0, 0, 0), 2);

	$chart->setDataSet($dataSetSerie);
	$chart->setTitle("Grafico per l'esame: $title");
	$chart->render();
	EndSendMessage();
}

function ConvertDate($date) // data originale nel formato yyyymmdd
{
	return substr($date, 6, 2) . "/" . substr($date, 4, 2) . "/" . substr($date, 0, 4);
}

function Alarm($col_name, $row)
{
	if ($col_name == "RISULTATO") {
		if (is_null($row[VALORE_MIN]) || is_null($row[VALORE_MAX]) || strlen($row[VALORE_MIN]) <= 0 || strlen($row[VALORE_MAX]) <= 0) return 0; // se non esistono limiti non evidenzio
		if ($row[RISULTATO] < $row[VALORE_MIN]) return -1;
		if ($row[RISULTATO] > $row[VALORE_MAX]) return 1;
	}
	return 0;
}

function AlarmValue($col_name, $row)
{
	require ("htmlConstants.php");
	$alarm = Alarm($col_name, $row);
	if ($alarm == - 1) return $row[$col_name] . $charAlarmMin;
	if ($alarm == 1) return $row[$col_name] . $charAlarmMax;
	return $row[$col_name];
}

function AlarmColor($col_name, $row, $row_color)
{
	require ("htmlConstants.php");
	$alarm = Alarm($col_name, $row);
	if ($alarm == - 1) return $colAlarmMin;
	if ($alarm == 1) return $colAlarmMax;
	return $row_color;
}
?>