seajs.config({
    // base: '/static/js/sea-modules/',
    alias : {
        // '$' : 'static/js/sea-modules/jquery/jquery-1.8.3.min',
        'jquery' : 'jquery/1.10.1/jquery',
        '$' : 'jquery/1.10.1/jquery',
        'jquery.textext' : 'jquery.textext/1.3.0/jquery.textext-debug',
     	'json' : 'json/1.0.2/json-debug',
        'ueditor' : 'ueditor/umeditor-debug',
     	'ueditorConfig' : 'ueditor/umeditorConfig-debug',
     	'bootstrap': 'bootstrap/3.0.1/bootstrap.min'
     },
    preload : [],
    debug : 2
});