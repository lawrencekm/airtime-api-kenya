<?php

class AES {

    var $AES_key;
    var $iv;

    function __construct($key) {
        $this->AES_key = $key;
        $this->iv = '';
    }

    function encrypt($data, $encmode = 'ECB') {

        $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
        switch ($encmode) {
            case 'ECB':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
                break;
            case 'CBC':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_CBC, '');
                break;
            case 'CFB':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_CFB, '');
                break;
            case 'OFB':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_OFB, '');
                break;
            default:
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
                break;
        }
        // initialize encryption handle
        if (@mcrypt_generic_init($cypher, $this->AES_key, $this->iv) != -1) {
            // decrypt
            $encrypted = mcrypt_generic($cypher, $data); // ( mdecrypt_generic($cypher, $data);
            // clean up
            mcrypt_generic_deinit($cypher);
            mcrypt_module_close($cypher);

            return strtr(base64_encode($encrypted), '+/=', '-_,');
            //return $encrypted;
        }

        return false;
    }

    function decrypt($data, $encmode = 'ECB') {
        $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
        switch ($encmode) {
            case 'ECB':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
                break;
            case 'CBC':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_CBC, '');
                break;
            case 'CFB':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_CFB, '');
                break;
            case 'OFB':
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_OFB, '');
                break;
            default:
                $cypher = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
                break;
        }
        // initialize encryption handle
        if (@mcrypt_generic_init($cypher, $this->AES_key, $this->iv) != -1) {
            // decrypt
            $decrypted = mdecrypt_generic($cypher, base64_decode(strtr($data, '-_,', '+/=')));

            // clean up
            mcrypt_generic_deinit($cypher);
            mcrypt_module_close($cypher);

            return trim($decrypted);
            //return utf8_encode(trim($decrypted));
        }

        return false;
    }

}