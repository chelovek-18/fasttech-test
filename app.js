'use strict';

/**
 * Настройки сервера
*/
const
    express = require( 'express' ),
    handlebars = require( 'express-handlebars' ),
    templatesPath = ( __dirname + '/views' ),
    bodyParser = require( 'body-parser' ),
    fileUpload = require( 'express-fileupload' ),
    app = express(),
    router = require( './routes' );

// Настройки шаблонизатора
app.engine( '.html', handlebars({
    defaultLayout: 'main',
    layoutsDir: templatesPath,
    partialsDir: templatesPath,
    extname: '.html',
    helpers: {
        getTypes: function( schema, types ) {
            schema.type = types.shift();
        },
        getFiles: function( files, type ) {
            return files[ type ];
        }
    }
}));
app.set( 'view engine', '.html' );
app.set( 'views', templatesPath );

app.use( bodyParser.json({ limit: '100mb' }));
app.use( bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.use( fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : './public/uploads'
}));
  
app.set( 'port', 8080 );

app.use( '/', express.static( __dirname + '/public' ) );
app.use( '/', router );

app.listen( app.get('port'), function() {
    console.log( 'start httpd '+ app.get( 'port' ) );
});