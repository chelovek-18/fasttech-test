// Формирование сокращенного имени до 30 символов
const getShortName = nm => nm.length > 30 ? nm.substr( 0, 30 ) + '...' : nm;

/**
 * Классы-обработчика элеменов DOM
*/
// Родительский класс для инициализации обработчиков:
class fileElems {
    constructor( elem ) {
        this.elem = elem;
        this.init();
    }

    init() {
        this.elem[ 0 ].self = this;

        this.on();
    }
}

// Класс для работы с кнопкой inpu type=file
export class fileInput extends fileElems {
    constructor( elem ) {
        super( elem );
    }

    on() {
        const self = this;
        const { tmpl, type } = this.elem.data();

        const input = $( 'input', this.elem );
        const label = $( 'label', this.elem );
        label.attr( 'title', `Выбрать файл${ type == 'single' ? '' : 'ы' }` );
        label
            .on( 'dragover', false )
            .on( 'drop', function( event ) {
                event.preventDefault();  
                event.stopPropagation();
                let files = event.originalEvent.dataTransfer.files;
                input[ 0 ].files = files;
                if ( type == 'single' && files.length > 1 ) files = [ files[ 0 ] ];
                self.change( files );
            });
        input.change( function() {
            self.change( this.files );
        });
                
        if ( type != 'single' ) input.attr( 'multiple', 'multiple' );
    }

    change( files ) {
        const { type } = this.elem.data();
        files = [ { name: Object.keys( files ).map( k => files[ k ].name ).join( '; ' ) } ];
        $( `.files-ul[data-type=${ type }]` ).list = [].concat( $( `.files-ul[data-type=${ type }]` ).list, files );
        $( `.files-ul[data-type=${ type }]` ).save();
    }
}

// Класс для работы со списком файлов
export class filesUl extends fileElems {
    constructor( elem ) {
        super( elem );
    }

    save() {
        $( '#file-form' ).submit();
    }

    delete( file ) {
        const { type } = this.elem.data();

        $.ajax({
            url: 'delete',
            type: 'POST',
            data: { type: type, file: file },
            success: function( json ) {
                $( `.files-ul[data-type=${ type }]` ).list = [].concat( json[ type ] || [] );
            }
        });
    }

    render() {
        this.elem.html(`
        <li class="no-files${ this.list.length ? '-pas' : '' }">Файлы отсутствуют</li>
        ${ this.list.map( li => `<li class="li-file">
            <div class="li-file-name">
                ${
                    li.state
                    ? `<a title="${ li.name }" href="${ document.location.origin + '/uploads/' + li.name }" class="file-link">${ getShortName( li.name ) }</a>`
                    : `<span title="${ li.name }" class="file-link">${ getShortName( li.name ) }</span>`
                }
                <div class="preload-line"><div class="preload-val"></div></div>
            </div>
            <div class="li-file-btn">
                ${
                    li.state
                    ? '<i onclick="$( this ).delete();" class="fa fa-close fa-2x"></i>'
                    : '<i class="fa fa-spinner fa-spin fa-2x"></i>'
                }
            </div>
        </li>` ).join( '' ) }
        `);
    }

    on() {
        const self = this;
        this.list = [];

        this.elem.list = [];
    }
}