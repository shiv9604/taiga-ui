import type {TuiLanguageEditor} from '@taiga-ui/i18n/types';

export const TUI_LITHUANIAN_LANGUAGE_ADDON_EDITOR: TuiLanguageEditor = {
    colorSelectorModeNames: ['Vientisa spalva', 'Gradientas'],
    toolbarTools: {
        undo: 'Atšaukti',
        redo: 'Perdaryti',
        font: 'Šriftas',
        fontStyle: 'Šrifto stilius',
        fontSize: 'Šrifto dydis',
        bold: 'Paryškintas',
        italic: 'Kursyvas',
        underline: 'Pabrauktas',
        strikeThrough: 'Perbrauktas',
        justify: 'Lygiuoti',
        justifyLeft: 'Lygiuoti kairėje',
        justifyCenter: 'Lygiuoti centre',
        justifyRight: 'Lygiuoti dešinėje',
        justifyFull: 'Lygiuoti į plotį',
        list: 'Sąrašas',
        indent: 'Įtraukti',
        outdent: 'Ištraukti',
        unorderedList: 'Nenumeruotas sąrašas',
        orderedList: 'Numeruotas sąrašas',
        quote: 'Citata',
        foreColor: 'Spalva',
        backColor: 'Fono spalva',
        hiliteColor: 'Paryškinimo spalva',
        clear: 'Išvalyti',
        link: 'Nuoroda',
        attach: 'Prisegti failą',
        tex: 'Įterpti TeX',
        code: 'Kodas',
        image: 'Įterpti vaizdą',
        insertHorizontalRule: 'Įterpti horizontalią liniją',
        superscript: 'Viršutinis indeksas',
        subscript: 'Apatinis indeksas',
        insertTable: 'Įterpti lentelę',
        insertGroup: 'Įterpti grupę',
        hiliteGroup: 'Paryškinti grupę',
        removeGroup: 'Pašalinti grupę',
        insertAnchor: 'Įterpti inkarą',
        mergeCells: 'Sujungti langelius',
        splitCells: 'Padalinti langelius',
        rowsColumnsManaging: 'Tvarkyti eilutes ir stulpelius',
        cellColor: 'Langelio spalva',
        setDetails: 'Nustatyti išsamią informaciją',
        removeDetails: 'Pašalinti išsamią informaciją',
    },
    editorEditLink: {
        urlExample: 'example.com',
        anchorExample: 'inkaras',
    },
    editorTableCommands: [
        ['Įterpti stulpelį prieš', 'Įterpti stulpelį po'],
        ['Įterpti eilutę prieš', 'Įterpti eilutę po'],
        ['Ištrinti stulpelį', 'Ištrinti eilutę'],
    ],
    editorCodeOptions: ['Kodas tekste', 'Kodas bloke'],
    editorFontOptions: {
        small: 'Mažas',
        large: 'Didelis',
        normal: 'Normalus',
        title: 'Pavadinimas',
        subtitle: 'Antraštė',
    },
};