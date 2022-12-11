<?php

require_once('AES.php');
/**
 * encrypts data using aes 128 ecb and returns result 
 */

$params = explode("*", $argv[1]);
$encryptionKey = $params[0];
$data = $params[1];
$obj = new AES($encryptionKey);
$encrypted_data = $obj->encrypt($data);
echo $encrypted_data;
