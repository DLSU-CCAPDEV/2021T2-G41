const express = require('express');

// express app
const app = express();

app.listen(3000);

// make client-side scripts accessible (This is the FIX for the text only problem)
app.use(express.static('src'));
app.use('/img', express.static('./img'));

app.get('/', function(req, res) {
    res.sendFile('./src/html/index.html', {root: __dirname});
});