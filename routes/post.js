'use strict';

const db = require( './../db/index' );
const fs = require( 'fs' );

/**
 * Post-xhr-запросы (сохранение, удаление)
*/
module.exports.save = async ( req, res, next ) => {
    let json = {};
    try {
        if ( req.files.single ) {
            if ( req.files.single.length && req.files.single.length > 1 ) req.files.single = req.files.single[ 0 ];
            // Проверка на то, что файл с таким именем уже существует
            req.files.single.name = await req.checkFilename( req.files.single.name );

            // Сохранение файла
            await req.files.single.mv( `public/uploads/${ req.files.single.name }` );
            json.single = { name: req.files.single.name, state: 1 };
        }
        if ( req.files.multi ) {
            // Проверка на то, что файлы с таким именем уже существуют + сохранение
            for( let file of [].concat( req.files.multi ) ) {
                file.name = await req.checkFilename( file.name );
                await file.mv( `public/uploads/${ file.name }` );
            }

            json.multi = [].concat( req.files.multi ).map( file => { return { name: file.name, state: 1 }; });
        }
        json = await db.save( json );
    } catch( err ) {
        console.log( err );
        json = await db.get();
    }

    res.json( json );
}

module.exports.delete = async ( req, res, next ) => {
    let json = {};
    try {
        await fs.promises.unlink( `./public/uploads/${ req.body.file }` );
        json = await db.delete( req.body );    
    } catch( err ) {
        console.log( err );
        json = await db.get();
    }
    res.json( json );
}