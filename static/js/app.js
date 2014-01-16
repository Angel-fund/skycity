define(function(require, exports, module) {    
    window.$ = window.jQuery = require('jquery');   

    if (!window.JSON) {
        JSON = require('json');
        window.JSON = JSON;
    }

    exports.filterScript = function() {
        if($){ 
            $(document).ready(function() {
                $("textarea").bind('keyup mouseup', function(){
                    var content = this.value;
                    var shead = content.indexOf('<script');
                    shead = shead>=0?shead:content.indexOf('</script');
                    if(shead >= 0)
                    {
                        var stail = content.indexOf('</script>');
                        if(stail >= 0)
                        {
                            this.value = content.substr(0,shead)+content.substr(stail+9,content.length);
                        }
                        else
                        {
                            content = content.split('<script');
                            this.value = content[0];
                        }
                    }
                });
            });
        }

    };

    exports.context = {};
    exports.load = function(name, options) {
        require.async('./page/' + name + '.js?' + __seajs_assets_version , function(page) {
            if (page.bootstrap) {
                page.bootstrap(exports.context, options);
            }
        });
    };
    window.app_load = exports.load;
   //  $('.J_search').submit(function(e) {
   //      var _node = $(this);
   //      var query = _node.find('input').val();
   //      e.preventDefault();
   //      window.open('http://www.google.com/search?q=site:f2e.im/t%20' + query, "_blank");
   //  });
   // console.log($('.search-query'));

});
