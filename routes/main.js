'use strict';

const db = require( './../db/index' );

/**
 * Главная страница
*/
module.exports = async ( req, res, next ) => {
    try {
        // Типы выводимых элементов
        const types = { schema: { type: '' }, types: [ 'single', 'multi' ] };

        // Контент (список файлов)
        let content = { files: await db.get() };
        content.files = Object.keys( content.files )
            .reduce( ( obj, k ) => {
                // Оборачиваем и single и multi в массив для универсальности:
                obj[ k ] = JSON.stringify( [].concat( content.files[ k ] ) );
                return obj;
            }, {} );

        let json = Object.assign( types, content );

        res.render( 'layouts/home.html', json ); // Вызов вьюхи и передача контента в шаблонизатор
    } catch( err ) {
        // В случае ошибки - переход к странице ошибки
        next( err );
    }
}