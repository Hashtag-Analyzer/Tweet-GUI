//Used in the node.js server
const path    = require('path')         // makes paths easy to resolve
const express = require('express') // http server
const exec = require('child_process').exec;
const morgan = require("morgan");
const bodyParser = require('body-parser');
const app   = express();
const port  = process.env.port || 8080;
const env = process.env.NODE_ENV || 'production';
const fs = require("fs");
//For react front end dev
const React           = require('react');
const ReactDOM        = require('react-dom');
const ReactRouter     = require('react-router');
const match           = ReactRouter.match;
const RouterContext   = ReactRouter.RouterContext
const renderToString = require('react-dom/server').renderToString;
//Specify the routes
const routes = require('./src/routes.js');
//Set paths to use
app.use(bodyParser.json( { limit: '50mb' } ) );
app.use(bodyParser.urlencoded({ limit : '50mb', extended : true}));
app.use(express.static(path.join( __dirname, './src/views')));
app.use(express.static(path.join( __dirname, './node_modules/')))
app.use(express.static(path.join( __dirname, '../node_modules/'))) /*for production*/
app.use(express.static(path.join( __dirname, './')))
//Set what the view engine is going to be
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

//Establishes a tunnel to our cluster master, where the DB is located
exec('./src/cqldb/login.cql', function(error, stdout, stderr) {});

//Renders the index route
app.get('/', function (req, res) {
  console.log("A")
  match( {routes : routes({}), location: req.url},
    function(err, redirectLocation, renderProps) {
      if(err) {
        console.log("ERR");
        return res.status(500).send(err.message);
      }
      if(redirectLocation) {
        console.log("re-direct");
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      let markup;
      if(renderProps) {
        console.log("Props");
        markup = renderToString(<RouterContext {...renderProps} />);
      }
      else {
        console.log("Non-existent page");
        markup = renderToString(<PageNotFound/>);
        res.status(404);
      }
      console.log(markup)
      return res.render('index', { markup });
    });
});

app.get('/render', function (req, res) {
  res.sendFile(__dirname + "/src/client_components/search.compiled.js", function(err) {
    if(err)
      console.log(err);
  });

});

app.post('/query', function(req, res) {
  fs.writeFile("/query.cql", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
});

app.listen(port, function(err) {
  if(err) {
    console.log("There was an error", err)
  }
  console.info('Server running on http://localhost:' + port)
});

/*HELPERS*/

function SendResults(query) {
  if(query[0] != '#')
    cqlquery = "SELECT * FROM database_t.test WHERE location='" + query + "' ALLOW FILTERING";
  else
    cqlquery = "SELECT * FROM database_t.test WHERE hashtag='" + query + "' ALLOW FILTERING";
  fs.writeFile("./src/cqldb/query.cql", cqlquery, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });

  return new Promise(function(resolve, reject) {
    exec('./src/cqldb/query.cql', function(error, stdout, stderr) {
      console.log(stdout);
      resolve(stdout);
    });
  })
}
