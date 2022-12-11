const crypto = require('crypto');
const axios = require('axios');
const runner = require("child_process");
var express = require('express');
const { resolve } = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);

////
//create "admin" subdomain...this should appear
// before all your other routes
/*
var admin = express.Router();
app.use(vhost('admin.*', admin));
// create admin routes; these can be defined anywhere
admin.get('/', function (req, res) {
    res.render('admin/home');
});
admin.get('/users', function (req, res) {
    res.render('admin/users');
});
*/
//THE AIRTIME API
app.get('/topup', function (req, res) {
    console.log('Received topup request');
    console.log(req.query);
    try {
        //const topup = topUpFlexi(req.params.encryptionKey, req.params.terminalNUmber);
        const topup = topUpFlexi(req.query.encryptionKey, req.query.terminalNUmber, req.query.productCode, req.query.referalNumber, req.query.amount);
        res.status(200);
        res.json({ success: true, data: res.topup });
    } catch (ex) {
        //return 
    }
});
////
function authorize(req, res, next) {
    if (req.session.authorized) return next();
   // res.render('not-authorized');
}
app.get('/secret', authorize, function () {
   // res.render('secret');
});

app.get('/sub-rosa', authorize, function () {
   // res.render('sub-rosa');
});

app.get('/', function (req, res) {
    res.type('text/plain');
    res.send('Meadowlark Travel');
});
app.get('/foo', async (req, res) => {
    res.type('text/plain');
    res.send('Meadowlark Travel');
    // const data =  await encryptViaPhp("hello*blah*decrypt");
     encryptViaPhp("hello*blah*decrypt").then(data=>res.json(data));
     //res.json({ data: res.data });
     //res.type('text/plain');
     //res.json(data);
     });
app.post('/new', function (req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        // if there were an error, we would send { error: 'error description' }
        console.log('Form (from querystring): ' + req.query.form);
        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from visible form field): ' + req.body.name);
        console.log('Email (from visible form field): ' + req.body.email);
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
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
// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


app.put('/api/tour/:id', function (req, res) {
    var p = tours.some(function (p) { return p.id == req.params.id });
    if (p) {
        if (req.query.name) p.name = req.query.name;
        if (req.query.price) p.price = req.query.price;
        res.json({ success: true });
    } else {
        res.json({ error: 'No such tour exists.' });
    }
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
/*
async function encryptViaPhp(data) {
    var phpScriptPath = "index.php";
    return new Promise((resolve, reject) => {
        runner.exec("docker run --rm -v $(pwd):/usr/src/myapp -w /usr/src/myapp 252335eaa153 php " + phpScriptPath + " '" + data + "'", function (err, phpResponse, stderr) {
            if (err) console.warn(err);
            resolve(phpResponse ? phpResponse : stderr); console.log(phpResponse);
        });
    })
    */
   async function encryptViaPhp(data) {
    return new Promise(async (resolve, reject) => {
            const url = "http://localhost:8087/?data=123456*ZyEGeLe*encrypt";
            const encryptedData =  await sendRequest(url, "") ;
            resolve(encryptedData);
            console.log(encryptedData);
        });
}   

async function encryptViaPhp2(url) {
    const post_data = "";
    const responseData = await sendRequest2(url);
    console.log(responseData)
    return responseData;
}


//for this over API instead, create a server for the container

async function decryptViaPhp(data) {
    var phpScriptPath = "decrypt.php";
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
                console.log("sendRequest error");
                //console.log(error);
            });
    });
}

// Send a POST encryption request
async function getCrypto(data) {
    return new Promise(resolve => {
    axios({
        method: 'post',
        url: 'http://localhost:8087/',
        params: {
          data: data
        }
      }) . then((response)=> {
        console.log(response.data);
        resolve( response.data);
      } )
      .catch(function (error) {
        console.log("getcrypto  error");
        //console.log(error);
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
    const requestUniqueID = 2346545443;
    const methodName = "BscGenerateSessionID";
    const payload = '{"RequestUniqueID":"' + requestUniqueID + '","MethodName":"' + methodName + '"}';
    console.log(payload)
    //let argsString = encryptionKey + "*" + payload;
    let argsString = encryptionKey + "*" + payload + "*encrypt";
    console.log("argsString:" + argsString)
    //const encryptedData = await encryptViaPhp(argsString);
    let encryptedData = await getCrypto(argsString);
    console.log('encryptedData ' + encryptedData); return;
    const url = "https://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData);
    console.log('encryptedSession data ' + responseData + "\n");
    let argsString2 = encryptionKey + "*" + responseData +  "*decrypt";
    //const decrypted_data = await decryptViaPhp(argsString2)
    const decrypted_data = await getCrypto(argsString2);
    console.log(decrypted_data);
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
//getSessionId(1638276480512670,50941676);
getSessionId(7753361719110651,23505169); 

async function getTerminalBalance(encryptionKey, terminalNUmber) {
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const requestUniqueID = Math.random() * 10000;//same
    const methodName = "BscGetBalance"; //same
    const payload = '{"SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","MethodName":"' + methodName + '"}';
    console.log(payload)
    let argsString = encryptionKey + "*" + payload;
    console.log("argsString:" + argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encryptedData ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/businessclientrest/businessclientrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData);
    console.log('encryptedSession data ' + responseData + "\n");
   // const decrypted_data = await decrypt(responseData)
    let argsString2 = encryptionKey + "*" + responseData;

    const decrypted_data = await decryptViaPhp(argsString2)
    console.log(decrypted_data);
    const decrypted_data_obj = JSON.parse(decrypted_data.match(/\{.*\}/g));
    console.log(decrypted_data_obj);
    const ResponseCode = decrypted_data_obj.ResponseCode;
    const ResponseDescription = decrypted_data_obj["ResponseDescription"];
    console.log('getbalance response ' + ResponseCode + ResponseDescription);
    if (decrypted_data_obj.ResponseCode == "000") {
        console.log(decrypted_data_obj.Balance);
        return decrypted_data_obj["balance"];
    }
    console.log("an error was encountered while retrieving terminal balance");
}

//getTerminalBalance("1638276480512670", "50941676"); //working well
//getTerminalBalance(7753361719110651,23505169);


//client
//const encryptionKey = "1638276480512670"
//const terminalNUmber = "50941676"
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
//topUpProduct("1638276480512670", "50941676"); //.working
/* 
 {"ResponseCode":"000","ResponseDescription":"Successful","SystemServiceID":["2","2","2","2"],"SystemServiceName":["Mobile","Mobile","Mobile","Mobile"],"ProductID":["1","2","3","11"],"ProductName":["Airtel Prepaid","Orange Prepaid","Safaricom Prepaid","Jamii_test"],"ProductDescription":["Airtel Prepaid","Telkom Prepaid","Safaricom Prepaid","Jamii_test"],"ProductType":["0","0","0","0"],"BatchID":["1","2","3","11"],"BatchName":["Airtel Prepaid","Orange Prepaid","Safaricom Prepaid","Jamii_test"],"BatchDescription":["Airtel Prepaid","Orange Prepaid","Safaricom Prepaid","Faiba Airtime"],"ProductCode":["AP01","OP01","SF01","112233"],"MinimumValue":[1000,1000,1000,100],"MaximumValue":[1000000,1000000,1000000,1000000],"ImageURL":["https:\/\/lh3.googleusercontent.com\/iXFqd-2_ZMRd-r0-8xZEbaVwVzw1qGEUWzzhCppTsPC1jZ2VqronVMhkEFj_o5FqEuCrDSCWLrMwkxjjoQb8LWrEgWr7Af0h3UU4jivLZ1XGFWqm0ZAGQfHRoyavIVZPCAb4qWOrFg=w2400","https:\/\/i.postimg.cc\/KcCQrM6g\/Image-tab512.png","https:\/\/i.postimg.cc\/KzZnwByW\/safaricom-1.png","https:\/\/i.postimg.cc\/1t9TcQ6Y\/faiba.png"],"Country":["KEN","KEN","KEN","KEN"],"FieldInfo":["{\"RefNo\":{\"Title\":\"Customer Mobile\",\"TxReference\":\"yes\",\"Pattern\":\"L1swLTldKy8=\",\"MinLength\":\"6\",\"MaxLength\":\"12\"}}","{\"RefNo\":{\"Title\":\"Customer Mobile\",\"TxReference\":\"yes\",\"Pattern\":\"L1swLTldKy8=\",\"MinLength\":\"6\",\"MaxLength\":\"12\"}}","{\"RefNo\":{\"Title\":\"Customer Mobile\",\"TxReference\":\"yes\",\"Pattern\":\"L1swLTldKy8=\",\"MinLength\":\"6\",\"MaxLength\":\"12\"}}","{\"RefNo\":{\"Title\":\"MobileNumber\",\"TxReference\":\"yes\",\"Pattern\":\"L1swLTldKy8=\",\"MinLength\":\"8\",\"MaxLength\":\"12\"}}"],"NotificationInfo":["{\"Email\":\"\",\"Phone\":\"\"}","{\"Email\":\"\",\"Phone\":\"\"}","{\"Email\":\"\",\"Phone\":\"\"}","{\"Email\":\"\",\"Phone\":\"\"}"],"AllowMinorCurrency":["false","false","false","false"],"SurchargeType":["Percentage","Percentage","Percentage","Percentage"],"SurchargeValue":[0,0,0,0]}
*/

async function topUpFlexi(encryptionKey, terminalNUmber, productCode, ReferalNumber, amount) {
    const TransactionKey = 1073832441;
    const requestUniqueID = Math.random() * 10000;
    productCode = "SF01";
   // ReferalNumber = "254743280072"
    //amount = "1000";
    FromANI = "254722800500"
    email = "vipul@sozuri.net"
    MethodName = "TopupFlexi";
    const sessionId = await getSessionId(encryptionKey, terminalNUmber);
    const payload = '{"SessionID":"' + sessionId + '","RequestUniqueID":"' + requestUniqueID + '","ProductCode":"' + productCode + '","SystemServiceID":"2",\
    "ReferalNumber":"'+ ReferalNumber + '","Amount":"' + amount + '","FromANI":"' + FromANI + '","Email":"' + email + '","MethodName":"' + MethodName + '"}';
    let argsString = encryptionKey + "*" + payload;
    console.log(argsString)
    const encryptedData = await encryptViaPhp(argsString);
    console.log('encrypted product local Data ' + encryptedData);
    const url = "http://rshost.pesapoint.co.ke/productrest/productrest";
    const responseData = await postthis(url, terminalNUmber, encryptedData, TransactionKey);
    console.log('encryptedproduct data ' + responseData + "\n");
   // const decrypted_data = await decrypt(responseData)
    let argsString2 = encryptionKey + "*" + responseData;

    const decrypted_data = await decryptViaPhp(argsString2)
    console.log('decrypted topUpFlexi ' + decrypted_data);
    return decrypted_data;
}
//topUpFlexi("1638276480512670", "50941676");  //{"ResponseCode":"305","ResponseDescription":"Amount is invalid"}

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

//topUpFixed("1638276480512670", "50941676"); //worked. DailyData1GB and systemserviceid 16 for data topup. also  {"ResponseCode":"105","ResponseDescription":"Business Client Credit Limit Exceed"}


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

//topUpTransactionStatus("1638276480512670", "50941676"); //worked. {"ResponseCode":"317","ResponseDescription":"Invalid Request Id"} for request failed topup due to invalid amount etc 


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
//topUpInitiateRefund("1638276480512670", "50941676"); //fails when sending http request. watch out for wrong method

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
//topUpRefundStatus("1638276480512670", "50941676"); 

class TopUp {
    /*  topUpProduct() {
          $pesaTransaction = new PesaTransaction()
          TerminalNumber=42304230&TransactionKey=88855522&Data=,"function":"TopupProductDetails","SessionID":"09","RequestUniqueID":"4333329555","SystemServiceID":"2","MethodName":"TopupProductDetails"-
      }
      topUpFlexi() {
          => TerminalNumber=82551159&TransactionKey=1099010990&Data=,"SessionID":"19","RequestUniqueID":"56","ProductCode":"testflexi","SystemServiceID":"2","ReferalNumber":"363566767656","Amount":"16000","FromANI":"","Email":"","MethodName":"TopupFlexi"-
      }
      topUpFixed(fixedAmount) {
          TerminalNumber=82551159&TransactionKey=1099010990&Data=,"SessionID":"159","RequestUniqueID":"674","ProductCode":"testfix","SystemServiceID":"4","ReferalNumber":"67456754678","FromANI":"","Email":"","MethodName":"TopupFix"-
      }
      topUpTransactionStatus(fixedAmount) {
          TerminalNumber=47199692&TransactionKey=6835010743&Data=,"SessionID":"904","RequestUniqueID":"4646","TransactionRequestUniqueID":"25412454113","MethodName":"TopupStatusCheck"-
      }
      topUpRefund(fixedAmount) {
          TerminalNumber=42304230&Data=,"function":" TopupInitiateRequest","SessionID":"2a75f9f","RequestUniqueID":"4855","RequestType":"0","TRRequestID":"2578","Comment":"test","MethodName":" TopupInitiateRequest "-
      }
      topUpRefundStatus(fixedAmount) {
          TerminalNumber=57288287&TransactionKey=6121118827&Data=,"function":"TopupRefundStatus","SessionID":"7","RequestUniqueID":"2335562","RequestType":"0","RefundRequestID":"160","MethodName":"TopupRefundStatus"-
      }*/

}
class BillPay {
    /* billpayProduct() {
         TerminalNumber=82551159&TransactionKey=1099010990&Data=,"SessionID":"1590","RequestUniqueID":"474675676878","SystemServiceID":"","MethodName":"BillpayProductDetails"
         -
     }
     billPay() {
         TerminalNumber=47199692&TransactionKey=6835010743&Data=,"SessionID":"70","RequestUniqueID":"746466575756","ProductCode":"testbillpay","SystemServiceID":"4","BillPayData":"DOJ": "2014-10-11 23:59:59",
          "Salary": 8567, "Designation": "2", "DOB": "2014-10-12","Experience": "2", "Meter_No": 15, "Hobby": * "2", "1" +, "Festivals": * "2", "4" +, "Department":"2","Amount":"16000","FromANI":"","Email":"","MethodName":"BillPay"-
     }
     billPayTransactionStatus(fixedAmount) {
         TerminalNumber=47199692&TransactionKey=6835010743&Data=,"SessionID":"70487b25-2832-4fb7-aae9-
         d147f0644640","RequestUniqueID":"746466575756","ProductCode":"testbillpay","SystemServiceID":"4","BillPayD
         ata":", \"DOJ\": \"2014-10-11 23:59:59\", \"Salary\": 8567, \"Designation\": \"2\", \"DOB\": \"2014-10-12\",
         \"Experience\": \"2\", \"Meter_No\": 15, \"Hobby\": * \"2\", \"1\" +, \"Festivals\": * \"2\", \"4\" +, \"Department\":
         \"2\" -","Amount":"16000","FromANI":"","Email":"","MethodName":"BillPay"-
     }*/
    billPayRefund(fixedAmount) {

    }
    billPayRefundStatus(fixedAmount) {

    }

}

class Voucher {
    voucherProduct() {

    }
    voucherFlexi() {

    }
    voucherFix() {

    }
    voucherTransactionStatus(fixedAmount) {

    }
    voucherRefund(fixedAmount) {

    }
    voucherRefundStatus(fixedAmount) {

    }

}
class Wallet {
    walletProduct(fixedAmount) {

    }
    transactionService(fixedAmount) {

    }
    transactionStatus(fixedAmount) {

    }
}

//client
//terminalnumber = '50941676';
//pesa = new PesaTransaction(terminalnumber);
//console.log(pesa.getSessionId() + "n");





//PHP to JS


//remove all $ signs 
//change object property sign -> to .
//remove access modifiers and function keyword on class methods
//move class properties initialization to the constructor()
//