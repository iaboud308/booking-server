const express = require('express');

const database = require('./database');
const router = require('./router').router;

const app = express();
app.use(express.json());
app.use(express.urlencoded( {  extended: true } ));

// disable CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next()
});

app.use(router);

const PORT = process.env.PORT || 3002;

database.connectToMongo( () => {
    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT}`);
    })
})


