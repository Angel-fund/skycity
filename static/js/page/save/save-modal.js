define(function(require, exports, module) {

    // require('jquery.form')($);
    // require('jquery.districtselect')($);
    require('jquery.textext')($); 
    // var EditorHelper = require('editor-helper');
    var ueditor = require('ueditor');

    var onReady = function() {

    // UMEDITOR_CONFIG.toolbar=['source | undo redo']; //自定义工具架
        var editor = UM.getEditor('myEditor');                                  
            var $form = $('#form');
            // console.log($form);
            /*var $modal = $form.parents('.modal');
            var editor = EditorHelper.createMiniEditor('#case_content', 'case');
            var editorold = EditorHelper.createMiniEditor('#case_oldcontent', 'case');
            var editormeasures = EditorHelper.createFullEditor('#case_measures', 'case');

            $form.find('.district-select').districtselect({level:'city', 'requiredLevel': 'city'});

            if (!$form.data('caseId')) {
                $form.find('#case_title').change(function(){
                    var url = $('#checkTitleUrl').data('checkUrl');
                    var title = $(this).val();
                    $.get(url + '?title='+title, function(response){
                        $('span.help-block').remove();
                        if (response) {
                            $form.find('#case_title').after('<span class="help-block" style="color:#B94A48">标题已经存在!<a href="'+response.url+'" target="_blank">查看</a></span>');
                            $form.find('#case_title').focus();
                        }
                    }, 'json');
                });
            }
            $form.ajaxForm({
                dataType: 'json',
                beforeSerialize: function(){
                    editor.sync();
                    editorold.sync();
                    editormeasures.sync();
                },
                beforeSubmit: function(){
                    if (!$('#case_title').val()) {
                        alert('请填写标题');
                        return false;
                    }
                    if (!$('#case_categoryId').val()) {
                        alert('请先选择分类');
                        return false;
                    }
                    if ($('input[name="case[tagIds]"]').val() == '[]') {
                        alert('请先选择标签');
                        return false;
                    }
                    if (!$('#case_measures').val()) {
                        alert('请先填写防范建议');
                        return false;
                    }
                    if (editor.text().length <= 20) {
                        alert('事实描述内容太少');
                        return false;
                    }
                },
                success: function(response) {
                     window.location.reload();
                }
            });

            $modal.find('.case-save-btn').click(function() {
                $form.find('input[name="case[status]"]').val($(this).data('status'));
            });

            var $names = $('#case_tagIds'),
                names = $.parseJSON($names.val());
            $names.val('');

            $names.textext({
                plugins: 'tags ajax filter autocomplete prompt',
                ajax: {
                    url : 'http://www.bss360dev.com/app_dev.php/admin/case/autocomplete',
                    dataType : 'json',
                    cacheResults : false
                },
                prompt : '添加标签...',
                filter : {
                    enabled: false
                }
            }).bind('isTagAllowed', function(e, data) {
                var namesPlugin = $(this).textext()[0].tags();
                if ($.inArray(data.tag, namesPlugin._formData) != -1) {
                    data.result = false;
                }
            });

            if (names) {
                $names.textext()[0].tags().addTags(names);
            }

            $names.textext()[0]._opts.filter.enabled = true;*/


        };

    exports.bootstrap = function() {
        $(onReady);
    };


});