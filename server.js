//Used in the node.js server
const path    = require('path')         // makes paths easy to resolve
const express = require('express') // http server
const exec = require('child_process').exec;
const morgan = require("morgan");
const bodyParser = require('body-parser');
const app   = express();
const port  = process.env.port || 8080;
const env = process.env.NODE_ENV || 'production';
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

//Renders the index route
app.get('/', function (req, res) {
  match( {routes : routes({}), location: req.url},
    function(err, redirectLocation, renderProps) {
      if(err) {
        return res.status(500).send(err.message);
      }
      if(redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      let markup;
      if(renderProps) {
        markup = renderToString(<RouterContext {...renderProps} />);
      }
      else {
        markup = renderToString(<PageNotFound/>);
        res.status(404);
      }
      return res.render('index', { markup });
    });
});
