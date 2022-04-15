const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const secureServer = https.createServer({
  key: fs.readFileSync('./webapp.clarondoc.com/private.key'),
  cert: fs.readFileSync('./webapp.clarondoc.com/certificate.crt'),
  ca: fs.readFileSync('./webapp.clarondoc.com/ca_bundle.crt')
}, app);

secureServer.listen(6601);
app.listen(6600);