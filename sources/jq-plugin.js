// Преобразование строки с разделителями-тире в camel ( my-string -> myString ):
const toCamel = txt => txt.split( '-' ).map( ( v, i ) => !i ? v : ( v[ 0 ].toUpperCase() + v.substr( 1 ) ) ).join( '' );

/**
 * Функции для jQuery
*/
export function jQueryPlugin( handlers ) {
    // Классы-обработчики элементов (для кнопки и списка) - см. в file-input.js
    $.fn.handler = function() {
        const
            tmpl = this.data( 'tmpl' ),
            tmplCamelName = toCamel( tmpl );
        
        this.each( function() {
            // Вызов нужного обработчика, указанного в data-tmpl:
            new handlers[ tmplCamelName ]( $( this ) );
        });
    }

    // Доступ к классу-handler'у
    Object.defineProperty( $.fn, 'ext', {
        get: function() {
            return this[ 0 ].self;
        }
    });

    // Геттер/сеттер для изменения списка, пример (выведет список файлов):
    // $( '.files-ul[data-type=multi]' ).list = [ { name: 'file1.name', state: 1 }, { name: 'file2.name' } ]
    Object.defineProperty( $.fn, 'list', {
        get: function() {
            let result = !this[ 0 ] ? null : [];
            if ( this.length == 1 ) result = this.ext.list;
            else if ( this.length > 1 ) this.each( function() {
                result.push( $( this ).ext.list );
            });

            return result;
        },
        set: function( list ) {
            if ( this[ 0 ] ) this.each( function() {
                $( this ).ext.list = list;
                $( this ).ext.render();
            });
        }
    });

    // Сохранение файла (-ов)
    $.fn.save = function() {
        this.each( function() {
            $( this ).ext.save();
        });
    }

    // Удаление файла (-ов)
    $.fn.delete = function() {
        this.each( function() {
            const name = $( this ).closest( '.li-file' ).find( '.file-link' ).attr( 'title' );
            $( this ).closest( '.files-ul' ).ext.delete( name );
        });
    }

    // Настройки ajax
    $.ajaxSetup({
        url: 'upload',
        type: 'POST',
        dataType: 'json',
        beforeSend: function() {
            console.log( 'улетело' );
        },
        error: function( err ) {
            console.log( 'ошибка', err );
        },
        complete: function() {
            console.log( 'прилетело' );
        }
    });
    // Отправка формы
    $( '#file-form' ).on( 'submit', function( e ){
        e.preventDefault();
        let self = $( this );
        let formData = new FormData( self.get( 0 ) );
        $.ajax({
            contentType: false,
            processData: false,
            data: formData,
            xhr: function() {
                let xhr = new window.XMLHttpRequest();
		        // прогресс загрузки на сервер
                xhr.upload.addEventListener( 'progress', function( evt ){
                    if ( evt.lengthComputable ) {
                        var percentComplete = evt.loaded / evt.total;
                        // делать что-то...
                        $( '.fa-spinner' ).closest( '.li-file' ).find( '.preload-val' ).css( 'width', `${ percentComplete * 100 }%` );
                        console.log( '%', percentComplete * 100 );
                    }
                }, false);
                return xhr;
            },
            success: function( json ) {
                // вывод контента
                $( '.files-ul[data-type=single]' ).list = [].concat( json.single || [] );
                $( '.files-ul[data-type=multi]' ).list = json.multi || [];
                // очистка формы
                $( '[type=file]' ).val( '' );
            }
        });
    });

}