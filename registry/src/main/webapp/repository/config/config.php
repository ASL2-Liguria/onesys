<?php
// log4php
include('log4php/Logger.php');
Logger::configure('log4php/log4php.xml');
$elcoLogger = Logger::getLogger($_SERVER['SCRIPT_NAME']);
// log4php

$database="oracle";
?>
