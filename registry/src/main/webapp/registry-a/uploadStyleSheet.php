<?php
$uploadFile = $_FILES['styleSheetFile']['tmp_name'];
if (is_uploaded_file($uploadFile)) {
	require_once ("styleSheetVariables.php");
	$newFileName = hash("sha1", file_get_contents($uploadFile));
	$fileCompletePath = $newFilePath . $newFileName . $newFileExtension;
	$www_file_path = str_replace('uploadStyleSheet.php', '', $_SERVER['PHP_SELF']) . $fileCompletePath;
	if (file_exists($fileCompletePath)) {
		unlink($uploadFile);
	} else {
		move_uploaded_file($uploadFile, $fileCompletePath);
	}
	echo "http://" . $_SERVER['SERVER_ADDR'] . $www_file_path;
} else {
	header("HTTP/1.1 500 Internal Server Error " . $php_errormsg, 1, 500);
}
?>