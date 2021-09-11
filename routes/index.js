'use strict';

/**
 * Маршрутизация
*/
const
    express = require( 'express' ),
    router = express.Router();

router.use( require( './../libs' ) );

router.post( '/upload', require( './post' ).save );
router.post( '/delete', require( './post' ).delete );

router.get( '/', require( './main' ) );

// Обработка ошибок
router.use( function( req, res, next ) {
    res.status( 404 );
    res.render( 'layouts/error-404.html' );
});
router.use( function( err, req, res, next ) {
    console.log( 'error', err );
    res.status( 500 );
    res.render( 'layouts/error-500.html' );
});

module.exports = router;