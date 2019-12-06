<?php
require_once ("styleSheetVariables.php");
$fileName = $_GET["hash"];
$fileCompletePath = $newFilePath . $fileName . $newFileExtension;
if (file_exists($fileCompletePath)) {
	print file_get_contents($fileCompletePath);
} else {
	header("HTTP/1.1 404 Not Found", 1, 404);
}
?>