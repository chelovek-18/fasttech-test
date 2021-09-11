'use strict';

const fs = require( 'fs' );

/**
 * Вспомогательный функционал
*/
module.exports = async ( req, res, next ) => {
    // Проверка на то, что файл уже существует (иначе возвращает новое имя)
    req.checkFilename = async function( fname ) {
        const isExist = fs.existsSync( `public/uploads/${ fname }` );
        if ( !isExist ) return fname;

        let newName = fname
            .split( '.' )
            .map( ( t, i, a ) => ( i == a.length - 2 ) ? ( `${ t }( **fileNum** )` ) : t )
            .join( '.' );
        for( let i = 1; i < 9999; i++ ) {
            const newNameIteration = newName.replace( /\*\*fileNum\*\*/g, i );
            const isNewNameExist = fs.existsSync( `public/uploads/${ newNameIteration }` );
            if ( !isNewNameExist ) {
                newName = newNameIteration;
                break;
            }
        }
        return newName;
    }

    next();
}