define(function(require) {
    return function(jQuery) {

        /**
         * jQuery中国地区选择插件
         *
         * @version 0.1.0
         * @author Wellming Li (wellming.li@gmail.com)
         *
         */

        (function($) {

            $.fn.districtselect = function(options) {

                var baseUrl = $('#site-base-url').attr('content') ? $('#site-base-url').attr('content') : '/';

                var settings = $.extend({
                    'level': 'town',
                    'requiredLevel' : 'town',
                    'onLoaded' : {},
                    'onChanged' : {},
                    'apiInit': baseUrl + 'district/init',
                    'apiChildren': baseUrl + 'district/children',
                    'loading': '地区数据载入中..',
                    'selectLoading' : '载入中..'
                }, options);

                var selectSettings = {
                    'province': {
                        name: '省'
                    },
                    'city': {
                        name: '市'
                    },
                    'town': {
                        name: '区县'
                    },
                    'street': {
                        name: '街道'
                    },
                    'community': {
                        name: '社区(村)'
                    }
                };

                var selects = '';
                $.each(selectSettings, function(level) {
                    var select = '<select class="' + level + '-select' + '">';
                    select += '<option value="">- ' + this.name + ' -</option>';
                    select += '</select>';
                    selects += select;
                    if(settings.level == level) {
                        return false;
                    }
                });

                return this.each(function() {
                    var $this = $(this),
                        $wrap = $this.wrap('<span class="districtselect-wrap" />').parent();

                    $wrap.prepend(selects);
                    $.get(settings.apiInit, {
                        id: $this.val()
                    }, function(data) {
                        var $selects = $wrap.find('select'),
                            depth = $selects.length;

                        $.each(data.districts, function(i, districts) {
                            if(i < depth) {
                                var value = data.path.shift();
                                $($selects[i]).append(buildOptions(districts)).val(value);
                            }
                        });


                        var $requiredSelect = $wrap.find('.' + settings.requiredLevel + '-select');

                        if (typeof(settings.onLoaded) == 'function') {
                            settings.onLoaded($requiredSelect);
                        }
                        $selects.change(function(){

                            var $siblings = $(this).find('~ select');

                            $siblings.val('').attr('disabled', 'disabled');
                            $siblings.find('option[value!=""]').remove();

                            var id = $(this).val();
                            if (id && ($siblings.length > 0)) {
                                $next = $($siblings[0]);

                                $.get(settings.apiChildren, {id:id}, function(data){
                                    $next.append(buildOptions(data)).removeAttr('disabled');
                                },'json');
                            }

                            if (id && $requiredSelect.val()) {
                                $this.val(id);
                                if ($this.parents('form').validate) {
                                    $this.parents('form').validate().element($this);
                                }
                            } else {
                                $this.val('');
                            }

                            if (typeof(settings.onChanged) == 'function') {
                                settings.onChanged($wrap, $requiredSelect);
                            }

                        });

                    }, 'json');


                });

                function buildOptions(districts) {
                    var options = '';

                    $.each(districts, function() {
                        options += '<option value="' + this[0] + '">' + this[1] + '</option>';
                    });

                    return options;
                }

            };



        })(jQuery);

    };
});