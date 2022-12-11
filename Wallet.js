const crypto = require('crypto');
const axios = require('axios');
const runner = require("child_process");

const algorithm = 'aes-128-ecb';
const key = '1638276480512670';
const iv = '';

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key), null);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64');
}
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
async function encryptViaPhp(data) {
    var phpScriptPath = "index.php";
    return new Promise((resolve, reject) => {
        runner.exec("docker run --rm -v $(pwd):/usr/src/myapp -w /usr/src/myapp 252335eaa153 php " + phpScriptPath + " '" + data + "'", function (err, phpResponse, stderr) {
            if (err) console.warn(err);
            resolve(phpResponse ? phpResponse : stderr); console.log(phpResponse);
        });
    })
}

async function decrypt(text) {
    //let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text, 'base64');
    let decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key), null);
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**
 * connects to the provider
 */

async function sendRequest(url, post_data) {
    return new Promise(resolve => {
        axios.post(url, post_data)
            .then(function (response) {
                console.log(response.data.Data)
                resolve(response.data.Data);
            })
            .catch(function (error) {
                console.log("my error");
                console.log(error);
            });
    });
}
async function postRequest(url, terminalNUmber, encryptedData, TransactionKey = null) {

    console.log("encryptedData in post this" + encryptedData);
    TransactionKey = TransactionKey == null ? "" : "&TransactionKey=" + TransactionKey;
    const post_data = "TerminalNumber=" + terminalNUmber + TransactionKey + "&Data=" + encryptedData;
    console.log(post_data)
    const responseData = await sendRequest(url, post_data);
    console.log(responseData)
    return responseData;
}

async function getSessionId(encryptionKey, terminalNUmber) {
    const requestUniqueID = Math.random() * 10000;
    const methodName = "BscGenerateSessionID";
    const payload = '{"RequestUniqueID":"' + requestUniqueID + '","MethodName":"' + methodName + '"}';
    console.log(payload)
    let argsString = encryptionKey + "*" + payload;
    console.log("argsString:" + argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encryptedData ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postRequest(url, terminalNUmber, encryptedData);
    console.log('encryptedSession data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    const decrypted_data_obj = JSON.parse(decrypted_data.match(/\{.*\}/g));
    console.log(decrypted_data_obj);
    const ResponseCode = decrypted_data_obj.ResponseCode;
    const ResponseDescription = decrypted_data_obj["ResponseDescription"];
    console.log('session ' + decrypted_data_obj.SessionID);
    if (decrypted_data_obj.ResponseCode == "000") {
        console.log("sessionID is " + decrypted_data_obj.SessionID);
        return decrypted_data_obj.SessionID;
    }
    console.log("an error was encountered while retrieving sessionID")
}


//client
//const encryptionKey = "1638276480512670"
//const terminalNUmber = "50941676"
async function walletProduct(encryptionKey, terminalNUmber) {
    const TransactionKey = 2091318444;
    const requestUniqueID = Math.random() * 10000;
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"function":"WalletProductDetails","SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","SystemServiceID":"512","MethodName":"WalletProductDetails"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postRequest(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted topup product ' + decrypted_data);
    return decrypted_data;
}
//walletProduct("1638276480512670", "50941676"); //.{"ResponseCode":"351","ResponseDescription":"Product Not Available"}


//walletFlexi("1638276480512670", "50941676");  // /{"ResponseCode":"264","ResponseDescription":"Product Code is Invalid"}
//walletTransactionStatus("1638276480512670", "50941676"); //worked. {"ResponseCode":"267","ResponseDescription":"Invalid Request Id"}
async function walletTransactionService(encryptionKey, terminalNUmber) {
    const requestUniqueID = Math.random() * 10000;
    const functionName = "TransactionService";
    const RequestType = "0";
    const TRRequestID = "2578";
    const Comment = "test";
    const MethodName = "TransactionService";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"function":"' + functionName + '","SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","RequestType":"' + RequestType + '","TRRequestID":"' + TRRequestID + '","Comment":"' + Comment + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postRequest(url, terminalNUmber, encryptedData);
    console.log('encrypted topuprefund data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted Wallet refund initiate ' + decrypted_data);
    return decrypted_data;
}
//walletTransactionService("1638276480512670", "50941676");

async function walletTransactionStatusCheck(encryptionKey, terminalNUmber) {
    const TransactionKey = 2091318444;
    const requestUniqueID = Math.random() * 10000;
    const TransactionRequestUniqueID = "8684711111111111";
    const MethodName = "WalletStatusCheck";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"function":"' + MethodName + '","SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","TransactionRequestUniqueID":"' + TransactionRequestUniqueID + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postRequest(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted WalletStatusCheck ' + decrypted_data);
    return decrypted_data;
}
//walletTransactionStatusCheck("1638276480512670", "50941676");