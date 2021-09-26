const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
// const https = require('https');
const app = express();
const cors = require('cors');
// const fs = require('fs');
app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Access-Control-Allow-Headers", '*');
    app.use(cors());
    next();
});

app.use(bodyParser.json())
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const fileRoute = require('./routes/file');
// const { encrypt, decrypt } = require('./util/crypt')
app.use('/file', fileRoute);


// const privateKey = fs.readFileSync('sslcert/selfsigned.key');
// const certificate = fs.readFileSync('sslcert/selfsigned.crt');

// const credentials = {key: privateKey, cert: certificate};

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

// encrypted_key = encrypt(' asdasddddddddddsad asdasd as asdasdasd');
// original_phrase = decrypt(encrypted_key);
// console.log('~> ', encrypted_key, original_phrase)

httpServer.listen(3100);
// httpsServer.listen(3000);
