define(function(require, exports, module) {    
    window.$ = window.jQuery = require('jquery');
    exports.jq = $;

    /*exports.context = {};
    exports.load = function(name, options) {
        require.async('./pages/' + name + '.js?' + __seajs_assets_version , function(page) {
            if (page.run) {
                page.run(exports.context, options);
            }
        });
    };
    window.app_load = exports.load;*/



    // exports.load = function(name) {
    //     require.async('./pages/' + name + '.js?' + __seajs_assets_version, function(page){
    //         if ($.isFunction(page.run)) {
    //             page.run();
    //         }
    //     });
    // };
    // window.app.load = exports.load;

    // if (app.controller) {
    //     exports.load(app.controller);
    // }

    $('.J_search').submit(function(e) {
        var _node = $(this);
        var query = _node.find('input').val();
        e.preventDefault();
        window.open('http://www.google.com/search?q=site:f2e.im/t%20' + query, "_blank");
    });
   console.log($('.search-query'));
//     if (!window.JSON) {
//         JSON = require('json');
//         window.JSON = JSON;
//     }
});

//     exports.filterScript = function() {
//         if($)
//         {
//         $(document).ready(function() {
//                 $("textarea").bind('keyup mouseup', function(){
//                     var content = this.value;
//                     var shead = content.indexOf('<script');
//                     shead = shead>=0?shead:content.indexOf('</script');
//                     if(shead >= 0)
//                     {
//                         var stail = content.indexOf('</script>');
//                         if(stail >= 0)
//                         {
//                             this.value = content.substr(0,shead)+content.substr(stail+9,content.length);
//                         }
//                         else
//                         {
//                             content = content.split('<script');
//                             this.value = content[0];
//                         }
//                     }
//                 });
//             });
//         }

//     };

//     exports.context = {};
//     exports.load = function(name, options) {
//         require.async('./pages/' + name + '.js?' + __seajs_assets_version , function(page) {
//             if (page.bootstrap) {
//                 page.bootstrap(exports.context, options);
//             }
//         });
//     };
//     window.app_load = exports.load;

//     exports.bootstrap = function(user) {
//         var BootstrapAjaxDialog = require('bootstrap-ajax-dialog');

//         var loginDialog = new BootstrapAjaxDialog({
//             trigger: '.login-btn',
//             hasMask: true
//         });
//         var inspectDialog = new BootstrapAjaxDialog({
//             trigger: '.inspect-btn',
//             hasMask: true,
//             width: 960
//         });        

//         var refreshCounter = function () {
//             $.get($("#message-counter-url").val(), function(counter) {
//                 var messageCounter = parseInt(counter.message, 10);
//                 var notificationCounter = parseInt(counter.notification, 10);
//                 if (notificationCounter > 0) {
//                     $("#notification-remind").addClass('has-remind').text(notificationCounter);
//                 }

//                 if (messageCounter > 0) {
//                     $("#message-remind-number").text(messageCounter).show();
//                 }

//                 setTimeout(refreshCounter, 120000);
//             }, 'json');
//         };

//         if (exports.context.user.login) {
//             refreshCounter();
//         }
        
//     };

// });