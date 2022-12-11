const crypto = require('crypto');
const axios = require('axios');
const runner = require("child_process");
var express = require('express');
const { resolve } = require('path');
var app = express();

app.set('port', process.env.PORT || 3002);

//THE AIRTIME TOP UP API
app.get('/topup/flexi', function (req, res) {
    console.log('Received topup request');
    console.log(req);
    try {
        const topup = topUpFlexi(req.query.encryptionKey, req.query.terminalNumber,
            req.query.productCode, req.query.referalNumber, req.query.amount, req.query.requestUniqueId);
        //const topup = topUpFlexi(req.params.encryptionKey, req.params.terminalNUmber, req.params.productCode, req.params.referalNumber, req.params.amount);
        topup.then((response) => {
            res.status(200)
            res.json({ success: true, data: response })
        });
    } catch (ex) {
        console.log("error attempting topup");
        res.json({ error: 'An error was encountered while attempting topup.' });
    }
});

//THE AIRTIME GETBALANCE API
app.get('/balance', function (req, res) {
    const balance = getTerminalBalance(req.query.encryptionKey, req.query.terminalNUmber);
    balance.then((response) => {
        res.status(200)
        res.json(response)
    });
});
function authorize(req, res, next) {
    if (req.session.authorized) return next();
    // res.json('not-authorized');
}
app.get('/secret', authorize, function () {
    // res.render('secret');
});

app.get('/', function (req, res) {
    res.type('text/plain');
    res.send('Hello World. We were just chilling');
});


app.get('/staff/:name', function (req, res) {
    var info = staff[req.params.name];
    if (!info) return next();
    // will eventually fall through to 404
    //res.render('staffer', info);
})
// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    // res.render('404');
});
// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    // res.render('500');
});


app.listen(app.get('port'), function () {
    console.log('Airtime Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});

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
    var phpScriptPath = "encrypt.php";
    return new Promise((resolve, reject) => {
        runner.exec("docker run --rm -v $(pwd):/usr/src/myapp -w /usr/src/myapp a2f765fde4fe php " + phpScriptPath + " '" + data + "'", function (err, phpResponse, stderr) {
            if (err) console.warn(err);
            resolve(phpResponse ? phpResponse : stderr); console.log(phpResponse);
        });
    })
}

//for this over API instead, expose it via server with http and fpm
async function decryptViaPhp(data) {
    var phpScriptPath = "decrypt.php";
    return new Promise((resolve, reject) => {
        //runner.exec("docker run --rm -v $(pwd):/usr/src/myapp -w /usr/src/myapp 252335eaa153 php " + phpScriptPath + " '" + data + "'", function (err, phpResponse, stderr) {
        runner.exec("docker run --rm -v $(pwd):/usr/src/myapp -w /usr/src/myapp a2f765fde4fe php " + phpScriptPath + " '" + data + "'", function (err, phpResponse, stderr) {
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
async function postthis(url, terminalNUmber, encryptedData, TransactionKey = null) {
    console.log("encryptedData in post this" + encryptedData);
    const post_data = "TerminalNumber=" + terminalNUmber + (TransactionKey ? ("&TransactionKey=" + TransactionKey) : "") + "&Data=" + encryptedData;
    const responseData = await sendRequest(url, post_data);
    console.log(responseData)
    return responseData;
}

async function getSessionId(encryptionKey, terminalNUmber) {
    const requestUniqueID = Math.random() * 10000;
    const methodName = "BscGenerateSessionID";
    const payload = '{"RequestUniqueID":"' + requestUniqueID + '","MethodName":"' + methodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    const encryptedData = await encryptViaPhp(argsString);
    const url = "https://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData);
    let argsString2 = encryptionKey + "*" + responseData;
    const decrypted_data = await decryptViaPhp(argsString2)
    const decrypted_data_obj = JSON.parse(decrypted_data.match(/\{.*\}/g));
    const ResponseCode = decrypted_data_obj.ResponseCode;
    const ResponseDescription = decrypted_data_obj["ResponseDescription"];
    console.log('session ' + decrypted_data_obj.SessionID);
    if (decrypted_data_obj.ResponseCode == "000") {
        console.log("sessionID is " + decrypted_data_obj.SessionID);
        return decrypted_data_obj.SessionID;
    }
    console.log("an error was encountered while retrieving sessionID")
}


async function getTerminalBalance(encryptionKey, terminalNUmber) {
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const requestUniqueID = Math.random() * 10000;//same
    const methodName = "BscGetBalance"; //same
    const payload = '{"SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","MethodName":"' + methodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    const encryptedData = await encryptViaPhp(argsString);
    const url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData);
    // const decrypted_data = await decrypt(responseData)
    let argsString2 = encryptionKey + "*" + responseData;
    const decrypted_data = await decryptViaPhp(argsString2)
    const decrypted_data_obj = JSON.parse(decrypted_data.match(/\{.*\}/g));
    const ResponseCode = decrypted_data_obj.ResponseCode;
    const ResponseDescription = decrypted_data_obj["ResponseDescription"];
    if (decrypted_data_obj.ResponseCode == "000") {
        console.log(decrypted_data_obj.Balance);
        return decrypted_data_obj;
        //return new Promise((resolve) => { resolve(decrypted_data_obj.Balance)});
    }
    console.log("an error was encountered while retrieving terminal balance");
}

async function topUpProduct(encryptionKey, terminalNUmber) {
    const TransactionKey = 2091318444;
    const requestUniqueID = Math.random() * 10000;
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"function":"TopupProductDetails","SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","SystemServiceID":"2","MethodName":"TopupProductDetails"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted topup product ' + decrypted_data);
    return decrypted_data;
}

async function topUpFlexi(encryptionKey, terminalNUmber, productCode, ReferalNumber, amount, requestUniqueId) {
    const TransactionKey = 1073832441;
    const FromANI = "254722800500"
    const email = "vipul@sozuri.net"
    MethodName = "TopupFlexi";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueId + '","ProductCode":"' + productCode + '","SystemServiceID":"2",\
    "ReferalNumber":"'+ ReferalNumber + '","Amount":"' + amount + '","FromANI":"' + FromANI + '","Email":"' + email + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
    let argsString2 = encryptionKey + "*" + responseData;
    const decrypted_data = await decryptViaPhp(argsString2)
    console.log('decrypted topUpFlexi ' + decrypted_data);
    return decrypted_data;
}

async function topUpFixed(encryptionKey, terminalNUmber) {
    const TransactionKey = "2091318444";
    const requestUniqueID = Math.random() * 10000;
    productCode = "DailyData1GB";
    ReferalNumber = "0736317113"
    amount = 200;
    FromANI = "0703053277"
    email = "test@pesatransact.co.ke"
    MethodName = "TopupFix";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","ProductCode":"' + productCode + '","SystemServiceID":"16",\
    "ReferalNumber":"'+ ReferalNumber + '","FromANI":"' + FromANI + '","Email":"' + email + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted topUpFixed ' + decrypted_data);
    return decrypted_data;
}

async function topUpTransactionStatus(encryptionKey, terminalNUmber) {
    const TransactionKey = "2091318444";
    const requestUniqueID = Math.random() * 10000;
    const TransactionRequestUniqueID = "8997.413587566207"
    const MethodName = "TopupStatusCheck";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","TransactionRequestUniqueID":"' + TransactionRequestUniqueID + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted TopupStatusCheck ' + decrypted_data);
    return decrypted_data;
}

async function topUpInitiateRefund(encryptionKey, terminalNUmber) {
    const requestUniqueID = Math.random() * 10000;
    const functionName = "TopupInitiateRequest";
    const RequestType = "0";
    const TRRequestID = "2578";
    const Comment = "test";
    const MethodName = "TopupInitiateRequest";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"function":"' + functionName + '","SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","RequestType":"' + RequestType + '","TRRequestID":"' + TRRequestID + '","Comment":"' + Comment + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData);
    console.log('encrypted topuprefund data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted Topup refund initiate ' + decrypted_data);
    return decrypted_data;
}

async function topUpRefundStatus(encryptionKey, terminalNUmber) {
    const requestUniqueID = Math.random() * 10000;
    const functionName = "TopupRefundStatus";
    const RequestType = "0";
    const RefundRequestID = "2578";
    const TransactionKey = "2091318444";
    const MethodName = "TopupInitiateRequest";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"function":"' + functionName + '","SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","RequestType":"' + RequestType + '","RefundRequestID":"' + RefundRequestID + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encrypted topup refund status data ' + responseData + "\n");
    const decrypted_data = await decrypt(responseData)
    console.log('decrypted Topup refund status ' + decrypted_data);
    return decrypted_data;
}
