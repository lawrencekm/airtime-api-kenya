<?php

require_once('AES.php');
/**
 * encrypts/decrypts  data using aes 128 ecb and returns result 
 */
//    $params = explode("*", $argv[1]);//for cli
if( null == $_POST["data"] && null == $_GET["data"] ) {
   echo "missing data";
   exit;
}
$x = isset($_POST["data"]) ? $_POST["data"] : $_GET["data"];
$x = htmlspecialchars($x);
$params = explode("*", $x);
$encryptionKey = $params[0];
$data = $params[1];
$type = $params[2];
$obj = new AES($encryptionKey);
if($type == "encrypt") {
   $crypt_data = $obj->encrypt($data);
} elseif($type == "decrypt"){
   $crypt_data = $obj->decrypt($data);
}else {
   $crypt_data = "missing crypt";
}
echo $crypt_data;
exit;