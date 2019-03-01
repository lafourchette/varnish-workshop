const http = require('http');
const PORT = process.env.PORT || 3000;
const html = (req) => (`
  <!DOCTYPE html>
  <html>
    <head>
      <title>App</title>
      <link rel="stylesheet" href="/stylesheets/main.css" />
    </head>
    <body>
      <p><strong>Request received for:</strong> ${req.url}</p>
    </body>
  </html>
`);

function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
}

// simple route handler 
function handleRequest(req, res){
  console.log(`Request received for: ${req.url}`);
  statuscode= 200
  headers = {
      'Content-Type': 'text/html'
  };
  result = 'Varnish workshop !';

  if (req.url == '/1') {
      headers = {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
      }
      result = html(req);
  }

  welcome = {
      'fr_FR': 'Bonjour',
      'en_GB': 'Hello',
      'pl_PL': 'Dzien Dobry',
      'it_IT': 'Buongiorno',
      'es_ES': 'Buenos dias',
      'pt_PT': 'Buenos dias'

  }
  welcomelang = ['fr_FR', 'en_GB', 'pl_PL', 'it_IT', 'es_ES', 'pt_PT']
  rand = getRandomInt(welcomelang.length);

  if (req.url == '/hello') {
      rand = welcomelang[rand];
      headers = {
          'Content-Type': 'text/html',
          'Cache-Control': 'max-age=60',
          'Content-Language': rand
      }
      result = welcome[rand];
  }
  if (req.url == '/hello-2') {
      if (req.headers.hasOwnProperty('locale') === false) {
        statuscode = 400;
        result = 'locale header is mandatory'
      } else {
          locale = req.headers.locale;
          headers = {
              'Content-Type': 'text/html',
              'Content-Language': locale
          }
          result = welcome[locale];
      }
  }
  res.writeHead(statuscode, headers);
  res.end(result);
}

// create the server
var server = http.createServer(handleRequest);

// bind to configured port, start listening for requests
server.listen(PORT, () => {
  console.log(`Server listening on: http://127.0.0.1:${PORT}`);
});
