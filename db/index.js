'use strict'

const fs = require( 'fs' );
const fname = './db/db.json'; // Здесь хранятся данные

/**
 * Исполняет роль базы
*/
module.exports.save = async json => {
    const isExist = fs.existsSync( fname );

    if ( isExist ) {
        // Если файл существует - объединяем данные из файла и полученные из формы:
        let jsonFile = JSON.parse( await fs.promises.readFile( fname ) );

        json.single = json.single || jsonFile.single;

        json.multi = [].concat( jsonFile.multi || [], json.multi || [] );

        if ( !json.multi.length ) delete json.multi;
    }

    await fs.promises.writeFile( fname, JSON.stringify( json ) );

    return json;
}

module.exports.get = async () => {
    const isExist = fs.existsSync( fname );

    let jsonFile = isExist ? JSON.parse( await fs.promises.readFile( fname ) ) : {};
    return jsonFile;
}

module.exports.delete = async json => {
    let jsonFile = JSON.parse( await fs.promises.readFile( fname ) );

    if ( json.type == 'single' ) delete jsonFile.single;
    else jsonFile.multi = jsonFile.multi.filter( file => file.name != json.file );

    await fs.promises.writeFile( fname, JSON.stringify( jsonFile ) );
    return jsonFile;
}