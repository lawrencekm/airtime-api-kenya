<?php

require_once('AES.php');
/**
 * connects to the provider
 */
class SendPesaTransaction
{
    public $url;
    public $post_data;

    public function __construct(string $url, string $post_data)
    {
        $this->url = $url;
        $this->post_data = $post_data;
    }

    public function send()
    {
        try {
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $this->post_data, //'TerminalNumber=50941676&Data=o4eP2YcGEnhGkzM4ZX8_aWNtXHMLKyw9tYJ5Dk8geVo2xLJ3fbpFNDKtzCEgY_EGgclWxau9yBW6yP05cwMrfePBIPjgpMU-VE1Y0FLYxVsYBHifP7_pPkco3qQgBJMy',
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: text/xml',
                    'Cookie: PHPSESSID=grkjec66tbp3al8o3uhqc7gcfkv04meq'
                ),
            ));
    
            $response = curl_exec($curl);
            echo "response: ". $response ."\n";
            curl_close($curl);
        } catch(Exception $e)  {
            var_dump($e);
        }

        return $response;
    }
}
/**
 * Runs getsession id, 
 */
class PesaTransact
{
    public $terminalNUmber;
    public $encryptionKey;
    public $crypto;
    public function __construct(string $terminalNUmber)
    {
        $this->terminalNUmber = $terminalNUmber;
        $this->encryptionKey = "1638276480512670";
        $this->crypto = new AES($this->encryptionKey);
    }

    public function getSessionId()
    {
        $requestUniqueID = random_int(100000, 1000000);
        $methodName = "BscGenerateSessionID";
        $payload = '{"RequestUniqueID":"' . $requestUniqueID . '","MethodName":"' . $methodName . '"}';
        $encrypted_data = $this->crypto->encrypt($payload);
        $post_data = "TerminalNumber=" . $this->terminalNUmber . "&Data=" . $encrypted_data;
        echo "twende \n";
        echo $post_data;
        $url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
        $getSessionResponse = new SendPesaTransaction($url, $post_data);
        $responseData = $getSessionResponse->send();
        echo  'response data'. $responseData ."\n";
        $data_content = json_decode($responseData, true) ["Data"];
        $decrypted_data = $this->crypto->decrypt($data_content);
        echo 'decryptedd '. $decrypted_data . "\n";
        $decrypted_array = json_decode($decrypted_data, true);
        $ResponseCode = $decrypted_array["ResponseCode"];
        $ResponseDescription = $decrypted_array["ResponseDescription"];
        return $decrypted_array["SessionID"]; 

    }

    public function setSessionId()
    {

    }
}


$terminalnumber = '50941676';
$pesa = new PesaTransact($terminalnumber);
echo $pesa->getSessionId() . "\n"; 
