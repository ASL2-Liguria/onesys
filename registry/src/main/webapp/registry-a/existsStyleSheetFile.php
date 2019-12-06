<?php
require_once ("styleSheetVariables.php");
$fileName = $_GET["hash"];
$fileCompletePath = $newFilePath . $fileName . $newFileExtension;
if (file_exists($fileCompletePath)) {
	$www_file_path = str_replace('existsStyleSheetFile.php', '', $_SERVER['PHP_SELF']) . $fileCompletePath;
	echo "http://" . $_SERVER['SERVER_ADDR'] . $www_file_path;
} else {
	header("HTTP/1.1 404 Not Found", 1, 404);
}
?>