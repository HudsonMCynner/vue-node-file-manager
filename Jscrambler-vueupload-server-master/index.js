const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use(bodyParser.json())
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const fileRoute = require('./routes/file');
app.use('/file', fileRoute);

app.listen(3000, () => {
    console.log('Server started on port : ' + 3000);
});