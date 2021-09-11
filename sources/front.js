import { fileInput, filesUl } from './file-input';
import { jQueryPlugin } from './jq-plugin';

// Обработчики для элементов DOM
const handlers = {
    fileInput: fileInput,
    filesUl: filesUl
}

/**
 * Основное тело скрипта
*/
$( document ).ready( function() {
    // Если страница без формы - обрабатывать нечего
    if ( !$( '#file-form' ).length ) return;

    // Инициализация обработчиков и их привязка к элементам DOM
    jQueryPlugin( handlers );
    $( '.files-ul' ).handler();
    $( '.file-input' ).handler();

    // Вывод списков файлов при загрузке страницы (при их наличии):
    Object.keys( window.fileList || {} ).forEach( k => $( `.files-ul[data-type=${ k }]` ).list = JSON.parse( window.fileList[ k ] ) );
});