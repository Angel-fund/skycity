/*
 * 后台功能
 *  by liyujie@geekpark.net 
 */

var Mimas = window.Mimas || {};

//地址管理
Mimas.Url = {
    upload_img:'/ajax/upload_image/type',
    updateAlt:'/ajax/update_image_alt',
    updateDescription:'/ajax/update_image_description',
    deleteImg:'/ajax/delete_image',
    partnerAutocomplate:'/ajax/search_partners',
    checkInAutocomplete:'/ajax/search_register_users',
    deleteAllMember:"/member/delete_members"
}
//插件管理
Mimas.plugins = function(){
    //用in.js 异步加载模块 
    var LoadFile = function(name,url,type,rely){In.add(name,{path:url,type:type,charset:'utf-8',rely:rely});};
    var Ready = function(module,callback){In.ready(module,callback);}
    
    var PATH = "/back/js/lib/";
    
    //jquery.tools.js
    LoadFile("tools_css",PATH+"tools/jquery.tools.css",'css');
    LoadFile("tools",PATH+"tools/jquery.tools.min.js",'js',['tools_css']);
    //autocomplate
    LoadFile("autocomplate_css",PATH+"autocomplete/jquery.autocomplete.css","css");
    LoadFile("autocomplate",PATH+"autocomplete/jquery.autocomplete.js","js",["autocomplate_css"]);
    //图片上传
    LoadFile("upload_css",PATH+"fileuploader/fileuploader.css","css");
    LoadFile("upload",PATH+"fileuploader/fileuploader.js","js",["upload_css"]);
    //拖动
    LoadFile("drag",PATH+"dragsort/jquery.dragsort.min.js","js");
    
    return {
        ready:Ready
    }
}();
Mimas.Browser = { 
    versions:function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {//浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                }
             }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
Mimas.UI = function(){
  var slideNav = function(tit,ul){
        var $tit = $(tit),
            $ul  = $(ul);
        function optionNav(){
            var ul = $(this).next('ul');
            ul[ul.css("display") == "none" ? "slideDown" : "slideUp"]();
        }
        $tit.bind('click',optionNav);
  }
  var date_input = function(ele,time,recove_time,options){
      var dater;
      var options = $.extend({
              lang: 'zh',
              format: 'yyyy-mm-dd',
              offset: [30, 0]},options);
      Mimas.plugins.ready("tools",function(){
           $.tools.dateinput.localize("zh", {
               months: '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月',
               shortMonths:  '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月',
               days:         '星期日,星期一,星期二,星期三,星期四,星期五,星期六',
               shortDays:    '日,一,二,三,四,五,六'
            });
            if(typeof ele == "string"){
                 dater =  $(ele).dateinput(options);
                 dater.change(function(){
                   $(this).next("input").focus();
                 });
            }else{
                 for(var i=0,len = ele.length;i<len;i++){
                   dater = $(ele[i]).dateinput(options);
                 }
            }
      });
      var $time = $(time),old_time,regEx = /^([0-1]{1}\d|2[0-3]):([0-5]\d)$/;
      $time.blur(function(){
          var time = $(this).val(),
              $p   = $(this).parent(".datetime");
          if($.trim(time).length > 0 && !regEx.test(time)){
              this.select();
              $p.addClass("error");
          }else{
              $p.removeClass("error");
          }
          var date = $(this).prev().val();
          $(this).next("input").val(date+" "+time);
      }).keyup(function(){
          var time = $(this).val(),
              date = $(this).prev().val();
              $(this).next("input").val(date+" "+time);
      });
       if(recove_time){
           for(var i=0,len = $(recove_time).length;i<len;i++){
               var recove_single = $(recove_time).eq(i);
               var time_arr = $.trim(recove_single.val()).split(" ");
               recove_single.prev("input").val(time_arr[1]);
               recove_single.prev().prev("input").val(time_arr[0]);
           }
       }
       return dater;
  };
  var drag = function(ele,ele_list,callback){
      var $ele = $(ele),$ele_list = $(ele+" "+ele_list);
      Mimas.plugins.ready("drag",function(){
          $ele.dragsort({
            dragSelector:ele_list, 
            dragEnd:callback, 
            dragBetween:true, 
            scrollSpeed:5
        });
      })
  };
  var sort_arr = function(li,url,parms){
          var $li = $(li),
                        li_length = $li.length,
                        post_str = '{';
                    for(var i=0;i<li_length;i++){
                        var li_id = $.trim($li.eq(i).attr("id").replace("sort_",""));
                        if(i == li_length - 1){
                            post_str += '"'+(i+1)+'"'+':'+'"'+li_id+'"';
                        }else{
                            post_str += '"'+(i+1)+'"'+':'+'"'+li_id+'",';
                        }
                    }    
                    post_str +="}"; 
                    parms += "&sort="+post_str;
                    $.post(url,parms,function(data){});
  }
  var async_del = function(ele,url,parms,callback){
      $(ele).delegate(".del","click",function(){
       if(confirm("您确定删除此条信息吗？")){
           var $tr          = $(this).parents("tr");
           var guid = $.trim($tr.attr("id").replace("sort_",""));
           parms += guid;
           $.post(url,parms,function(data){
                if(data.success){
                    $tr.remove();
                    callback();
                }   
           },'json');
       }
     })
  };
  var partnerSort = function(ele,ele_list){
      var sign = arguments[2];
      var result = function(){
          if(sign !== "none"){
            sort_arr(ele_list,'/ajax/sort_partners',"event_guid="+event_guid);
          }
      }
      Mimas.UI.drag(ele,ele_list,result);
      if(sign !== "none"){
          async_del(ele,"/ajax/delete_event_partner","event_guid="+event_guid+"&partner_guid=",function(){
            })
      }
          
  };
  var guestSort = function(ele,ele_list){
      var result = function(){
          sort_arr(ele_list,'/ajax/sort_guests',"event_guid="+event_guid);
      }
      Mimas.UI.drag(ele,ele_list,result);
      async_del(ele,"/ajax/delete_event_guests","event_guid="+event_guid+"&guest_guid=",function(){
          
      })
  }
  var selectPost = function(country,province,city,url,top){
         var clearData = function(){
             province.find("option:not(:first)").remove()
             city.find("option:not(:first)").remove()
         };
         var handelSelect = function(ele,next_ele){
             ele.change(function(){
                var txt       = $.trim($(this).find("option:selected").html());
                var post_name = $(this).attr("id");
                var full_name = $(this).next("select").attr("id");
                post_Data(next_ele,post_name+"="+txt,full_name,function(){});
             });
         };
         var post_Data = function(ele,parms,name,callback){
             var args = arguments;
             $.post(url,parms,function(data){
                 var options = '';
                 $.each(data[name],function(i,item){
                     options += "<option value='"+item.id+"'>"+item.region_cn+"</option>";
                 });
                 if(name == "province"){
                     if(args[4] !== "sign"){
                        ele.next("select").find("option:not(:first)").remove().end();
                        ele.next("select").attr("disabled",true); 
                     }else{
                         ele.attr("disabled",false);
                     }
                 }
                 ele.find("option:not(:first)").remove().end().append(options);
                 if(data.province && data.province.length == 0){
                     ele.attr("disabled",true);
                 }else{
                     ele.attr("disabled",false);
                     
                 }
                 ele.attr("value",callback);
                 
             },"json")
         };
         //默认为没填
         if(arguments.length == 4){
             post_Data(country,"top=top",'country');
           // post_Data(); 
         }
         //默认为都填
         if(arguments.length > 4){
             var arr_id = [],arr_name = [];
             $.each(top,function(i,item){
                 arr_id[i] = $(item).attr("id");
                 arr_name[i] = $(item).text();
             })
             city.attr("disabled",false);
             province.attr("disabled",false);
             post_Data(country,"top=top",'country',arr_id[0]);
             post_Data(province,"country="+arr_name[0],'province',arr_id[1],'sign');
             post_Data(city,"province="+arr_name[1],'city',arr_id[2]);
             
         }
         handelSelect(country,province);
         handelSelect(province,city);
  };
  var venue = function(addBtn,editBtn){
      var $addBtn  = $(addBtn),
          $editBtn = $(editBtn),
          $table   = $(".venue-showTable"),
          old_name, old_info,venue_id = 0;
      function delelteBtnHandle(){
          if(confirm("您确定要删除此场馆吗？")){
              var _self = this,
                     id = $(_self).parents("tr").attr('id').replace("hall_","");
           }
      }
      $("#venue").delegate(".del",'click',delelteBtnHandle);
  };
  var confirm_handle = function(ele,txt){
      $(ele).click(function(){
          if(!confirm(txt)){
            return false;
          }
      });
  }
  var getTimeStamp = function(date){
      var full_date = date+"-12-00-00",
          arr = full_date.split('-'),
          datum = (new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]))).getTime()/1000;
      return datum;
  }
  //批量删除
  var deleteMemebers = function($checkbox_all,checkbox_list,$btn){
      $checkbox_all.click(function(){
        console.log($(this).attr("checked"));
         if($(this).attr("checked") == "checked"){
            $(checkbox_list).attr("checked",true);
         }else{
          $(checkbox_list).attr("checked",false);
         }
      });
      var handleDel = function(str,$checked){
          $tr = $checked.parents("tr");
          $.post(Mimas.Url.deleteAllMember,{"guid_str":str},function(data){
            if(data.result){
                $tr.css("background-color","#f00");
                $tr.animate({"opacity":0},500,function(){
                    $tr.remove();
                });
            }else{
               alert(data.message);
            }
          },"json")
      }
      $btn.click(function(){
          var $checked     = $(checkbox_list+":checked"),
              checked_len  = $checked.length,
              guid_str     = '';
          if(checked_len == 0){
             alert("请先选中某项！");return false;
          }

          for(var i=0;i<checked_len;i++){
             if(i == 0){
                guid_str += $checked.eq(i).val();
             }else{
                guid_str += "-" + $checked.eq(i).val();
             }
          }
          if(confirm("确定批量删除操作？")){
             handleDel(guid_str,$checked);
          }
          return false;

      })
  }
  //普通异步上传
  var ajaxRequest = function(e_ele,s_ele){
      $(e_ele).click(function(){
          var self = this,
               url = $(self).attr("href");
          $(self).parents("tr").find(s_ele).html("已"+$.trim($(self).html()));
          $.get(url,function(data){
              if(!data.result){
                alert("服务器错误，请刷新重试！");
                return false;
              }
          },"json")
          return false;
      })
  }
  return {
      slideNav:slideNav,
      dateinput:date_input,
      drag:drag,
      partnerSort:partnerSort,
      guestSort:guestSort,
      venue:venue,
      selectPost:selectPost,
      confirm_handle:confirm_handle,
      getTimeStamp:getTimeStamp,
      deleteMemebers:deleteMemebers,
      ajaxRequest:ajaxRequest
  } 
}();
Mimas.AutoComplate = function(){
     var autocomplete = function(ipt,url){
         Mimas.plugins.ready("autocomplate",function(){
            if(url){
                 var URL = url;
             }else{
                 var URL = Mimas.Url.partnerAutocomplate;
             }
             $(ipt).autocomplete(URL, {
                    tips:'',
                    minChars: 1,
                    cacheLength:0,
                    matchContains:true,
                    scrollHeight:400,
                    selectFirst:false,
                    width:155,
                    max:10,
                    formatItem: function(data, i, total) {
                        return data.title;
                    },
                    formatMatch: function(data, i, total) {
                        return '<strong>'+data.title+'</strong>';
                    },
                    formatResult: function(data) {
                        return data.title;
                    },
                    parse:function(data){
                        var parsed='';
                        if(data){
                            var list =  eval('(' + data + ')'),parsed=[];   
                            for(var i=0, j=list.length; i<j; i++){  
                                parsed[i]={
                                    data:list[i],
                                    value:list[i].tagname,
                                    result:list[i].tagname
                                };
                            }
                        }
                        return parsed
                    }
                }).result(function(e, data, formatted){
                    if(typeof data !== 'undefined'){
                       $(ipt).val(data.title);
                    }
                    return false;
                })
         })
     }
     var autocomplete_self = function(ipt,url,ipt_hide){
         Mimas.plugins.ready("autocomplate",function(){
             $(ipt).autocomplete(url, {
                    tips:'',
                    minChars: 1,
                    cacheLength:0,
                    matchContains:true,
                    scrollHeight:400,
                    selectFirst:false,
                    width:400,
                    max:10,
                    formatItem: function(data, i, total) {
                        return data.title+'<br/>'+data.userdata;
                    },
                    formatMatch: function(data, i, total) {
                        return '<strong>'+data.title+'</strong><br/>'+data.userdata;
                    },
                    formatResult: function(data) {
                        return data.title;
                    },
                    parse:function(data){
                        var parsed='';
                        if(data){
                            var list =  eval('(' + data + ')'),parsed=[];   
                            for(var i=0, j=list.length; i<j; i++){  
                                parsed[i]={
                                    data:list[i],
                                    value:list[i].tagname,
                                    result:list[i].tagname
                                };
                            }
                        }
                        return parsed
                    }
                }).result(function(e, data, formatted){
                    if(typeof data !== 'undefined'){
                       $(ipt).val(data.title);
					   $(ipt_hide).val(data.user_guid)
                    }
                    return false;
                })
         })
     }
     return {
       autoSearch:autocomplete,
       autocomplete_self:autocomplete_self
     }      
}();
// 用户签到 @ AndyHuang@geekpark.net
Mimas.CheckInAutoComplate = function() {
  var autocomplete = function(ipt, url) {
      Mimas.plugins.ready("autocomplate", function() {

        $('#partner').keypress(function() {
          if ($(this).val()[0] == '#') {
            $(this).setOptions({
              minChars: 16
            });
          }
          if ($(this).val() == '') {
            $('.error-info.error').fadeOut();
            $(this).setOptions({
              minChars: 2
            });
          }
        });

        var URL = Mimas.Url.checkInAutocomplete + '?event_guid=' + event_guid;
        $(ipt).autocomplete(URL, {
          tips: '',
          cacheLength: 0,
          matchContains: true,
          scrollHeight: 400,
          selectFirst: true,
          width: 550,
          max: 10,
          formatItem: function(data, i, total) {
            if ($(ipt).val().length == 16) {
              $(ipt).val('');
              if (data['status'] == 0)
              $.post('/ajax/check_in', {
                event_guid: event_guid,
                user_guid: data['user_guid']
              }, function(data, textStatus, xhr) {
                //optional stuff to do after success
                
              });
              if (data['title'] != '') {
                user_list = '        <tr id="sort_" class="sort">' + '            <td class="t-name">' + data['name'] + '</td>' + '            <td class="t-mobile">' + data['mobile'] + '</td>' + '            <td class="t-email">' + data['email'] + '</td>' + '            <td class="t-status check-in"><a class="status-1 bg-img" id="' + data['user_guid'] + '">签到</a></td>' + '        </tr>';
                $('#checkInList').html(user_list);
                if (data['status'] == 0) $('.error-info').removeClass('error warning').addClass('success').hide().html('找到 <strong>' + data['name'] + '</strong>，并签到成功!').fadeIn();
                else $('.error-info').removeClass('error success').addClass('warning').hide().html(data['name'] + '已于 ' + data['time_created'] + ' 签到成功!').fadeIn();

              } else {
                $('.error-info').removeClass('success warning').addClass('error').hide().html('没有找到相关结果!').fadeOut();
              }
            }
            return data.title;
          },
          formatMatch: function(data, i, total) {
            return '<strong>' + data.title + '</strong>';
          },
          formatResult: function(data) {
            return data.title;
          },
          parse: function(data) {
            if (data == '[]') $('.error-info').removeClass('success').addClass('error').hide().html('没有找到相关结果!').fadeIn();
            else $('.error-info').removeClass('error warning').addClass('success').hide().html('输入查找相关信息!').fadeIn();

            var parsed = '';
            if (data) {
              var list = eval('(' + data + ')'),
                parsed = [];
              for (var i = 0, j = list.length; i < j; i++) {
                parsed[i] = {
                  data: list[i],
                  value: list[i].tagname,
                  result: list[i].tagname
                };
              }
            }
            $(ipt).setOptions({
              minChars: 1
            });
            return parsed
          }
        }).result(function(e, data, formatted) {
          if (data['status'] == 0) $.post('/ajax/check_in', {
            event_guid: event_guid,
            user_guid: data['user_guid']
          }, function(data, textStatus, xhr) {});
          if (data['title'] != '') {
                user_list = '        <tr id="sort_" class="sort">' + '            <td class="t-name">' + data['name'] + '</td>' + '            <td class="t-mobile">' + data['mobile'] + '</td>' + '            <td class="t-email">' + data['email'] + '</td>' + '            <td class="t-status check-in"><a class="status-1 bg-img" id="' + data['user_guid'] + '">签到</a></td>' + '        </tr>';
                $('#checkInList').html(user_list);
                if (data['status'] == 0) $('.error-info').removeClass('error warning').addClass('success').hide().html('找到 <strong>' + data['name'] + '</strong>，并签到成功!').fadeIn();
                else $('.error-info').removeClass('error success').addClass('warning').hide().html(data['name'] + '已于 ' + data['time_created'] + ' 签到成功!').fadeIn();
          } else {
            $('.error-info').removeClass('success warning').addClass('error').hide().html('没有找到相关结果!').fadeOut();
          }
          if (typeof data != 'undefined') {
            $(ipt).val('');
          }
          return false;
        })
      })
    }
  return {
    autoSearch: autocomplete
  }
}();

Mimas.EditLine = function(wrap,ele,url,callback){
    var Input_data = "",post_data;
    var callback_click = function(e){
           var txt = $.trim($(this).text());
           Input_data = $(this).attr("title");
           $(this).after("<input value='"+txt+"' class='edit_input' type='text'/>");
           $(this).next().focus();
           $(this).remove();
           return false;
    }
    var callback_blur = function(e){
        var post_data,self = this;
        var txt = $.trim($(this).val());
               if($(e.target).is('input')){
                   if(url !== "none"){
                       var data_self = callback(self) || "";
                       post_data = data_self+"&"+Input_data+"="+txt;
                       $.post(url,post_data,function(data){
                       if(data.success){
                            $(self).after("<span title='"+Input_data+"' class='edit_span'>"+txt+"</span>");
                            $(self).remove();
                       }
                      },'json');
                   }else{
                       $(self).after("<span title='"+Input_data+"' class='edit_span'>"+txt+"</span>");
                       $(self).remove();
                   }
        }
    }
    $(wrap).delegate(ele,'dblclick',callback_click);
    $(wrap).delegate('.edit_input','blur',callback_blur);
};
Mimas.userinfo_edit = function(url,ele){
    var $list       = $(ele),
        $modify_btn = $list.find(".modify"),
        $cancel_btn = $list.find(".cancel"),
        $confrim_btn= $list.find(".confirn"),
        $select_country = $list.find("select[name='country']"),
        $select_province = $list.find("select[name='province']"),
        $select_city = $list.find("select[name='city']");
    var modifyUI = function(){
        var $edit = $(this).prev(".handle_edit");
            $edit.show();
            $edit.prev().hide();
            $(this).hide();
            $list.unbind();
            if($edit.find(".error").length > 0){
                $edit.find(".text").unwrap();
            }
            
          return false;
    };
    var BtnUI = function(){
        var   $modify_btn = $(this).find(".modify");
        $modify_btn.toggle();
    }
    var cancelUI = function(){
        var _self = arguments.length == 2 ? arguments[1] : this;
        var $edit = $(_self).parents(".handle_edit");
        var txt   = $edit.prev().text();
        $edit.hide();
        $edit.prev().show();
        $edit.next().show();
       // $edit.find(".text").val(txt);
        $list.bind("mouseover",BtnUI);
        $list.bind("mouseout",BtnUI);
        return false;
    };
    var updateData = function(self,txt){
        var $edit = $(self).parents(".handle_edit");
        $edit.prev().html(txt);
        $edit.find(".text").val(txt);
    }
    var confirmUI = function(){
        var _self = this,
            $edit = $(this).parents(".handle_edit"),
            txt   = $.trim($edit.find(".text").val() || $edit.find(".text").html()),
            name  = $.trim($edit.find(".text").attr("name")),
            guid  = User_guid;
          if($(_self).hasClass("btn_select")){
              var $country  = $edit.find("select[name='country']"),
                  $province = $edit.find("select[name='province']"), 
                  $city     = $edit.find("select[name='city']"),
                  c_txt  = $country.find("option:selected").text(),
                  p_txt  = $province.find("option:selected").text(),
                  ci_txt = $city.find("option:selected").text(),
                  c_val  = $country.find("option:selected").val(),  
                  p_val  = $province.find("option:selected").val(),  
                  city_val  = $city.find("option:selected").val(); 
               if(c_txt == "请选择国家" || p_txt == "请选择省份" || ci_txt == "请选择市区"){
                   alert('请填写完整信息!')
                   return false;
               }
               $.post("/ajax/edit_user_region",{"guid":guid,"country":c_val,"province":p_val,"city":city_val},function(data){
                    if(data.success){
                        updateData(_self,"<span id='"+c_val+"'>"+c_txt+"</span> <span id='"+p_val+"'>"+p_txt+"</span> <span id='"+city_val+"'>"+ci_txt+"</span>");                        
                        cancelUI(null,_self);
                        Mimas.userinfo_check.check_info();
                    }
               },'json');   
          //生日处理     
          }else if($(_self).hasClass("birth_btn")){
              var  txt_time = $(_self).parent().prev().val(),
                   dataum   = Mimas.UI.getTimeStamp(txt_time);
               $.post(url,{"guid":guid,"column":name,"value":dataum},function(data){
                    if(data.success){
                        cancelUI(null,_self);
                        updateData(_self,txt_time);
                        Mimas.userinfo_check.check_info();
                    }
              },'json');
          }else{
              if(txt.length == 0){
                   var input = $edit.find(".text");
                   if(!input.parent().hasClass("error")){
                     $edit.addClass("input")
                     input.wrap("<span class='error'></span>");
                   }
                return false;
              }
              if($(_self).hasClass("btn_marked")){
                  url = "/ajax/edit_user";
              }
              if($(_self).hasClass("btn_user_main")){
                  url = "/ajax/edit_user_info";
              }
              
              $.post(url,{"guid":guid,"column":name,"value":txt},function(data){
                    if(data.success){
                        cancelUI(null,_self);
                        if($(_self).parent().prev().find("option").length > 0){
                           txt = $(_self).parent().prev().find("option:selected").text();
                        }
                        updateData(_self,txt);
                        Mimas.userinfo_check.check_info();
                    }
              },'json');
          }
    }
    $modify_btn.bind("click",modifyUI);
    $cancel_btn.bind("click",cancelUI);
    $confrim_btn.bind("click",confirmUI);
    $list.bind("mouseover",BtnUI);
    $list.bind("mouseout",BtnUI);
};
Mimas.userinfo_check = function(){
    var check_info = function(){
        var $old_info = $(".base .user_info"),
            $new_info = $(".user_info_check .content_model_wrap .cont:visible .user_info"),
            len      = $old_info.length;
        for(var i=0;i<len;i++){
            var old_txt = $.trim($old_info.eq(i).find(".user_list").text()),
                new_txt = $.trim($new_info.eq(i).find(".user_list").text());
                if(new_txt === "尚未填写"){
                    $new_info.eq(i).find(".right").hide();
                    $new_info.eq(i).find(".save").hide();
                }else if(new_txt !== "尚未填写" && new_txt == old_txt){
                    $new_info.eq(i).find(".right").show();
                    $new_info.eq(i).find(".save").hide();
                }else{
                    $new_info.eq(i).find(".right").hide();
                    $new_info.eq(i).find(".save").show();
                }
                if($.trim($old_info.eq(i).find(".user_list").text()) == "尚未填写"){
                    $old_info.eq(i).find(".user_list").css("color","#ccc");
                }else{
                    $old_info.eq(i).find(".user_list").css("color","#000")
                }
                if($.trim($new_info.eq(i).find(".user_list").text()) == "尚未填写"){
                    $new_info.eq(i).find(".user_list").css("color","#ccc");
                }else{
                    $new_info.eq(i).find(".user_list").css("color","#000");
                }
        }        
    }; 
        
    var slide = function(){
        var $cont = $(".user_info_check").find(".cont");
        if($(this).next(".cont").css("display") == "none"){
            $cont.hide();
            $(this).next(".cont").show();
            check_info();
        }else{
            $(this).next(".cont").hide();
        }
        Mimas.UI.sameWeight();
    }
    var saveData = function(){
        var txt  = $.trim($(this).prev(".user_list").text()),
            guid = User_guid,
            name = $(this).prev(".user_list").attr("title");
        if($(this).prev().hasClass("btn-select")){
               var $span = $(this).prev().find("span"),arr =[],arr_name = [];
               for(var i=0,len = $span.length;i<len;i++){
                   arr[i]      = $.trim($span.eq(i).attr("title"));
                   arr_name[i] = $.trim($span.eq(i).text());
               }
               $.post("/ajax/edit_user_region",{"guid":guid,"country":arr[0],"province":arr[1],"city":arr[2]},function(data){
                    if(data.success){
                        var $old_span = $(".base select[name='country']").parent(".handle_edit").prev(".user_list").find("span");
                        for(var j=0,j_len = $old_span.length;j<j_len;j++){
                            $old_span.eq(j).attr("id",arr[j]);
                            $old_span.eq(j).html(arr_name[j]);
                        }
                    }
               },'json');   
               
          }else if($(this).prev().attr("title") == "birthday"){
                var birthday     = $.trim($(this).prev().text()),
                    birthday_arr = birthday.split("-")
                    dataum       = Mimas.UI.getTimeStamp(birthday);
                $.post("/ajax/edit_userdata",{"guid":guid,"column":name,"value":dataum},function(data){
                    if(data.success){
                        $(".base input[name='"+name+"']").val(birthday);
                        $(".base input[name='"+name+"']").parent(".handle_edit").prev(".user_list").html(birthday);
                        $("#birthday").data("dateinput").setValue(birthday_arr[0]*1,birthday_arr[1]*1-1,birthday_arr[2]*1);
                    }
                },'json');  
          }else{
              if($(this).prev().hasClass("select_one")){
                  txt_val = $(this).prev().prev().attr("title");
                  $.post("/ajax/edit_userdata",{"guid":guid,"column":name,"value":txt_val},function(data){
                    if(data.success){
                        $(".base select[name='"+name+"']").val(txt_val);
                        $(".base select[name='"+name+"']").parent(".handle_edit").prev(".user_list").html(txt);
                    }
                  },'json');
              }else{
                  $.post("/ajax/edit_userdata",{"guid":guid,"column":name,"value":txt},function(data){
                    if(data.success){
                        $(".base input[name='"+name+"']").val(txt);
                        $(".base input[name='"+name+"']").parent(".handle_edit").prev(".user_list").html(txt);
                    }
                  },'json');                  
              }
          }
          check_info();
          $(this).hide();
          $(this).next().show();
    }
    var init = function(url,ele){
        $(ele).delegate(".save","click",saveData);
        $(ele).find(".slide").click(slide);
        check_info();
    }
    return {
        init:init,
        check_info:check_info
    }
}();
Mimas.userinfo_edit_select = function(self,ele,url){
      var $c     = $(ele+" select[name='country']"),
          $p     = $(ele+" select[name='province']"),
          $s     = $(ele+" select[name='city']");
          $p.attr("disabled",true);    
          $s.attr("disabled",true);     
          if($(self).parent(".user_info").find(".user_list").find("span").length == 3){
              Mimas.UI.selectPost($c,$p,$s,url,$(self).parent(".user_info").find(".user_list").find("span"));
          }else{
              Mimas.UI.selectPost($c,$p,$s,url);
          }     
};
Mimas.Upload_img = function(){
    function FileUpload(url){
           var $progressDiv = $(".meter");
           var uploader = new qq.wmsUploader({
                element: document.getElementById('upload-file-btn'),
                action:url,
                allowedExtensions:['doc','docx','xls','xlsx','pdf','ppt','pptx','png','gif','jpg','jpeg','zip','rar'],
                sizeLimit: 1024*1024*20,
                messages:{
                    typeError: "文件类型不支持，上传失败.",
                    sizeError: "文件超过最大允许范围，上传失败.",
                    minSizeError: "{file}太小了, {minSizeLimit}以下文件不允许上传.",
                    emptyError: "不允许上传空文凭.",
                    onLeave: "文件正在上传，确认将取消上传."            
                },
                showMessage:function(message){
                    alert(messgae);
               },
                onSubmit: function(id, fileName){
                    var guid = $.trim($("#guid").text()),
                        type = $("#type").text();
                    $progressDiv.prev('div.num').html("").show();
                    uploader.setParams({
                        'type':type,
                        'guid':guid
                    });
                },
                onProgress:function(id, fileName, loaded, total){
                    $progressDiv.show();
                    //$progressDiv.find("span:first").css('width',Math.round(loaded/total)+'%');
                    $progressDiv.prev('div.num').html(fileName+"正在上传中，"+Math.round(loaded/total)+'%'+"完成");
                },
                onComplete: function(id, fileName, responseJSON){
                      $progressDiv.find("span:first").css({'width':'100%'});
                      $progressDiv.prev('div.num').html('100%'+"  "+"上传成功");
                      setTimeout(function(){
                          $progressDiv.prev('div.num').hide();
                          $progressDiv.hide();
                      },400);
                      var $showtable = $(".showTable");
                      var tr = function(image_id){
                          return   "<tr id='img_"+image_id+"'>" 
                                    +"<td>"+fileName+"</td>"
                                    +"<td class='alt'><span class='edit_span'>无</span></td>"
                                    +"<td class='description'><span class='edit_span'>无</span></td>"
                                    +"<td><a href='#' class='delete'>删除</a></td>"
                                    +"</tr>";
                      };
                      window.location.reload();
                      if(responseJSON){
                          $showtable.find("tr:first").after(tr(responseJSON.info.image_id)).end().show();
                      }

                }
                }); 
       } 
    var EditSelect = function(sel){
        var $sel = $(sel);
         //$(".showTable").delegate(sel,'change',function(){
         $(".showTable").delegate(sel,'change',function(){
             //console.log($(this).parents('tr').attr("id"));
               var txt  = $.trim($(this).val()),
                   url  = "/ajax/update_image_related_entity_guid",
                   image_id = $(this).parents('tr').attr("id").replace("img_","");
                if(!confirm("你是否选择该会议？")){
                    return false;
                }
               $.post(url,{"related_entity_guid":txt,"image_id":image_id},function(data){
                        if(data){
                            alert('选择成功');
                        }   
               },"json")
        });
    };
    var EditList = function(ele){
           var $sign = $(ele),old_text,image_id,guid = $.trim($("#guid").text());
           $(".showTable").delegate('.edit_span','click',callback_edit);
           $(".showTable").delegate('.edit_input','blur',callback_input);
           $(".showTable").delegate('.delete','click',callback_delete);
           function callback_edit(e){
               var txt = $.trim($(this).text());
               image_id = $(this).parents('tr').attr("id").replace("img_","");
               old_text = txt;
               if($(e.target).is('span')){
                   $(this).after("<input value='"+txt+"' class='edit_input' type='text'/>");
                   $(this).next().focus();
                   $(this).remove();
               }
           }
           function callback_input(e){
               var txt = $.trim($(this).val());
               if($(e.target).is('input')){
                   var url,img_type,post_data,self=this;
                   if($(e.target).parent("td").hasClass('alt')){
                       url = Mimas.Url.updateAlt,
                       post_data = "image_id="+image_id+"&alt="+txt;
                   }else{
                       url = Mimas.Url.updateDescription;
                       post_data = "image_id="+image_id+"&description="+txt;
                   }
                   $.post(url,post_data,function(data){
                       if(data.success){
                            $(self).after("<span class='edit_span'>"+txt+"</span>");
                            old_text = txt;$(self).remove();
                       }
                   },'json');
               }
           };
           function callback_delete(e){
               if(confirm("您确定删除此图片么？？")){
               image_id = $(this).parents('tr').attr("id").replace("img_","");
                   var tr = $(this).parents("tr");
                   $.post(Mimas.Url.deleteImg,{"image_id":image_id},function(data){
                       if(data.success){
                           tr.remove();
                          if($(".showTable").find('tr').length == 1){
                              $(".showTable").hide();
                          }
                       }
                   },'json');
               }
              return false;
           }
       };
    function init(sign,sel){
        Mimas.plugins.ready("upload",function(){
             var url = sign ? sign : Mimas.Url.upload_img;
             FileUpload(url);
             EditList(".edit");
             EditSelect(sel);
        });
    }
    return {
        init:init
    }
}();
Mimas.Mobile = function(){
    LoadFile("iscroll","/back/js/lib/iscroll/iscroll-min.js","js");
    In.ready('iscroll',function(){
        var myScroll;
        function loaded() {myScroll = new iScroll('wrapper');}loaded();
       // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
       // document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);        
    });
    
}

Mimas.Agenda = function(){
     var change_select = function(next_ele,parms,url){
             $.post(url,parms,function(data){
                 var options = '';
                 $.each(data,function(i,item){
                     options += "<option value='"+item.guid+"'>"+item.title+"</option>";
                 });
                 $(next_ele).empty().append(options);
             },"json");
     };
     var handelSelect = function(ele,next_ele){
             $(ele).change(function(){
                var val = $(this).val();
                change_select(next_ele,"venue_guid="+val,"/ajax/get_venue_halls/");
             });
     };
     var deleteTr = function(){
         if(confirm("确认删除本条记录吗？")){
             var name = $(this).parents("tr").attr("class");
             $(this).parents("tr").remove();
             $('#'+name).attr("checked",false);
         }
             return false;
     }
     var change_check = function(ele,form,drag_ele){
         var full_tr = function(id,name){
             return "<tr class='guest_"+id+"'>"+
                       "<td>"+name+"</td>"+
                       "<td><span class='edit_span'>暂无</span></td>"+
                       "<td><a href='#' class='del'>删除</a></td>"+
                    "</tr>";
         }
          $(ele).change(function(){
              var name = $(this).next("label").text(),
                  val  = $(this).val();
              if($(this).attr("checked") == "checked"){
                  $(form).append(full_tr(val,name));
                  Mimas.EditLine($(form),".edit_span","none");
              }else{
                  $(form).find("tr.guest_"+val).remove();
              };
              Mimas.UI.drag(form,drag_ele,function(){
                $(drag_ele).attr({"style":"cursor:move","data-cursor":"pointer"});
              }); 
          })  
       $(form).delegate(".del","click",deleteTr);
      // $(ele).attr("checked",false); 
     };
     
     var fullJSON = function(btn){
         $(btn).click(function(){
             var trs = $("#guestsTable .sort tr");
             var JSON = "[";
             for(var i=0,len=trs.length;i<len;i++){
                 var tr   = trs.eq(i),
                     id   = tr.attr("class").replace("guest_",""),
                     data = (tr.find(".edit_span").text() == "暂无" ? "" : tr.find(".edit_span").text()),
                     sort = i+1;
                     
                    if(i+1 == len){
                         JSON += '{"id":"'+id+'","data":"'+data+'","sort":"'+sort+'"}'
                    }else{
                        JSON += '{"id":"'+id+'","data":"'+data+'","sort":"'+sort+'"},'
                    }
             }
              JSON += "]";
              $("#guests").val(JSON);
         })
     }
     
     return {
         handelSelect:handelSelect,
         change_check:change_check,
         fullJSON:fullJSON
     }
     
}();
//初始化全局事件
$(function (){
  $('textarea').autosize();  
  Mimas.UI.slideNav(".common_tit",".common_ul");
});


