/**
 * @desc 热区图页面片工具，用于编辑热区并生成页面片
 * @author laserji
 * @mail jiguang1984#gmail.com
 * @date 2013-04-27
 */

$(function(){
    "use strict";

    var config = {
        isDebug: true,
        canvas: '.hota_canvas',
        canvas_bg: '.hota_bg',
        hot_area: 'a',
        init_width: 100,
        init_height: 100,
        area_info: '.area_info',
        workshop: '#workshop',
        code_wrap: '#code_wrap',
        page_content: '#page_content',
        img_src: '#img_src',
        ptag: '#ptag',
        link: '#link_addr',
        context_menu: '#context_menu',
        v_line: '.v_line',
        h_line: '.h_line',
        tolerance: 5
    };
    var $cur = null;

    // 初始化
    function init(){

        // 自动读取页面内容（for ppms）
        var originCode = $.trim($(config.page_content).val());

        if(originCode != '' && originCode.indexOf('Hota') != -1){
            $(config.workshop).html($(originCode));
            // 用一次就清空
            $(config.page_content).val('');
            init();
        }

        // 设置默认存储位置
        var $page_path = $('#page_path');
        if($.trim($page_path.val()) === ''){
            $page_path.val($page_path.attr('data-value'));
        }

        // 设置默认的文件名
        var $page_name = $('#page_name');
        if($.trim($page_name.val()) === ''){
            var d = new Date();
            $page_name.val(d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDay() + '_' + Math.floor(Math.random()*10000) + '.html');
        }

        // 热区初始化
        var $hot_list = $(config.canvas).find(config.hot_area);

        $hot_list.each(function(){
            $(this)
                .css({
                    'width': $(this)[0].style.width ? $(this)[0].style.width : $(this).width(),
                    'height': $(this)[0].style.height ? $(this)[0].style.height : $(this).height()
                }).resizable({
                    containment: "parent",

                    start: function(event, ui){
                        $cur = ui.helper;
                        $cur.addClass('cur').siblings().removeClass('cur');
                        $(config.area_info).show();
                    },
                    resize: function(event, ui){
                        $(config.area_info)
                            .css({
                                'left': ui.originalPosition.left,
                                'top': ui.originalPosition.top
                            }).html(ui.size.width + 'x' + ui.size.height);

                        $(ui.handler)
                            .css({
                                'width': ui.size.width,
                                'height': ui.size.height
                            });
                    },
                    stop: function(event, ui){
                        $(config.area_info).hide();
                    }
                })
                .draggable({

                    containment: "parent",

                    distance: 10,

                    snap: true,
                    snapTolerance: 10,

                    start: function(event, ui){
                        $cur = ui.helper;
                        $cur.addClass('cur').siblings().removeClass('cur');
                        $(config.area_info).show();
                    },

                    drag: function(event, ui){
                        var $me = $(this);

                        $(config.area_info)
                            .css({
                                'left': ui.position.left,
                                'top': ui.position.top
                            }).html('top:' + ui.position.top + '&nbsp;&nbsp;left:' + ui.position.left);

                        if($me.siblings('a').length > 0){
                            $me.siblings('a').each(function(){

                                /***** S 左右对齐操作 *****/
                                // 左边与右边对齐
                                if(Math.abs(($(this).position().left + $(this).width()) - ui.position.left) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left + $(this).width());
                                }

                                // 右边与左边对齐
                                if(Math.abs(($(this).position().left) - (ui.position.left + ui.helper.width())) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left);
                                }

                                // 右边与右边对齐
                                if(Math.abs(($(this).position().left + $(this).width()) - (ui.position.left + ui.helper.width())) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left + $(this).width());
                                }

                                // 左边与左边对齐 （宽度相同时优先左对齐）
                                if(Math.abs($(this).position().left - ui.position.left) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left);
                                }
                                /***** E 左右对齐操作 *****/

                                /***** S 上下对齐操作 *****/
                                // 上边与下边对齐
                                if(Math.abs(($(this).position().top + $(this).height()) - ui.position.top) <= config.tolerance){
                                    $(config.h_line).show().css('top', ($(this).position().top + $(this).height()));
                                }

                                // 下边与上边对齐
                                if(Math.abs($(this).position().top - (ui.position.top + ui.helper.height())) <= config.tolerance){
                                    $(config.h_line).show().css('top', $(this).position().top);
                                }

                                // 下边与下边对齐
                                if(Math.abs(($(this).position().top + $(this).height()) - (ui.position.top + ui.helper.height())) <= config.tolerance){
                                    $(config.h_line).show().css('top', $(this).position().top + $(this).height());
                                }

                                // 上边与上边对齐 （高度相同时优先上对齐）
                                if(Math.abs($(this).position().top - ui.position.top) <= config.tolerance){
                                    $(config.h_line).show().css('top', $(this).position().top);
                                }
                                /***** E 上下对齐操作 *****/
                            });
                        }
                    },
                    stop: function(event, ui){
                        $([config.area_info, config.v_line, config.h_line].toString()).hide();
                    }

                });
        });

        // 读取图片地址
        if($(config.canvas_bg).attr('src') != ''){
            $(config.img_src).val($(config.canvas_bg).attr('src'));
        }

        // 辅助信息
        if(!$(config.canvas).find(config.area_info)[0]){
            $(config.canvas).append('<div id="area_info" class="area_info"></div>\
                <div class="h_line"></div>\
                <div class="v_line"></div>');
        }

        // 代码框清空
        $(config.code_wrap).val('');

        // 点击创建热区
        $(config.canvas).click(function(e){
            e.preventDefault();

            clearTimeout(window.HOTA_TIMER);
            window.HOTA_TIMER = setTimeout(function(){
                if(e.target.tagName.toLocaleLowerCase() === 'a'){
                    $cur = $(e.target);
                    $cur.addClass('cur').siblings().removeClass('cur');
                }else{
                    addZone({
                        top: e.pageY - $(e.target).offset().top - 10,
                        left: e.pageX - $(e.target).offset().left - 10
                    });
                }
            }, 50);

            e.stopPropagation();
        });


        /*** START 右键编辑菜单 ***/
        // 呼出右键菜单
        $(config.canvas).on('contextmenu', function(e){
            e.preventDefault();

            if(e.target.tagName.toLocaleLowerCase() === 'a'){
                $(config.context_menu).show().css('left', e.pageX).css('top', e.pageY).draggable();
                $cur = $(e.target);
                $cur.addClass('cur').siblings().removeClass('cur');

                $(config.link).val($cur.attr('href'));
                $('#link_tit').val($cur.attr('title'));

                $(config.ptag).val($cur.attr('href').toLocaleLowerCase().indexOf('ptag') > 0 ? $cur.attr('href').match(/PTAG=([.0-9]*)/i)[1] : '');


                if($(e.target).attr('target') != undefined){
                    $('#'+$(e.target).attr('target'))[0].checked = true;
                }

                setTimeout(function(){
                    $(config.link).focus();
                }, 100);
            }
            e.stopPropagation();
        });

        // 点在菜单空白处不隐藏
        $(config.context_menu).click(function(e){
            e.stopPropagation();
        });

        // 添加 http://
        $(config.link).blur(function(){
            if($(this).val().indexOf('http://') < 0){
                $(this).val('http://' + $(this).val());
            }
        });

        // 确认更改
        $('#btn_confirm').click(function(){
            if($cur){

                if(!/^http:\/\/.*/.test($.trim($(config.link).val()))){
                    tip('链接地址不正确，请重新设置');
                    return;
                }

                if($(config.link).val().toLocaleLowerCase().indexOf('ptag') < 0){

                    // 本来没有，新增 ptag
                    if($.trim($(config.ptag).val()) != ''){
                        var hash = $(config.link).val().indexOf('#') != -1 ? $(config.link).val().replace(/.*?(#.*)/ig, '$1') : '';
                        $cur.attr('href', $(config.link).val().replace(/#.*/ig, '') + '?PTAG=' + $(config.ptag).val() + hash);
                    }else{
                        $cur.attr('href', $(config.link).val());
                    }

                }else{
                    $cur.attr('href', $(config.link).val().replace(/PTAG=([.0-9]*)/ig, 'PTAG=' + $(config.ptag).val()));
                }

                $cur.attr('title', $('#link_tit').val())
                    .attr('target', $('#open_type').find('input:checked')[0].id);

                $(config.context_menu).hide();
            }
        });

        // 取消设置
        $('#btn_cancel').click(function(){
            $(config.context_menu).hide();
        });
        /*** END 右键编辑菜单 ***/


        // IE提示
        if($.browser.msie){
            $('#browser_tip').fadeIn(500).delay(4000).fadeOut(1000);
        }

        // 复制代码
        var clip = new ZeroClipboard( document.getElementById("btn_copy"), {
            moviePath: "http://ppms.paipaioa.com/hota/js/ZeroClipboard.swf"
        } );

        clip.on( 'complete', function(){
            tip('复制成功，请将代码粘贴到新建的页面片中或直接使用');
        });


        // 设置图片地址
        $(config.img_src).on('keyup blur', function(){
            if(/http:\/\/.*?(jpg|jpeg|png|bmp|\d)/.test($(this).val())){
                $(config.canvas_bg).attr('src', $(this).val()).load(function(){
                    $(config.canvas).width($(this).width()).height($(this).height());
                });
            }
        }).focus(function(){
            this.select();
        });

        // 方向键操作
        $(document).keydown(function(e){

            var key = e.keyCode;

            // 删除
            if($cur && key == 46){
                $cur.remove();
            }

            if($cur && e.shiftKey){

                // 左移
                if(key == 37 && parseInt($cur.css('left'), 10) > 0){
                    $cur.css('left', parseInt($cur.css('left'), 10) - 1);
                }

                // 右移
                if(key == 39 && parseInt($cur.css('left'), 10) <= $cur.parent().width() - $cur.width()){
                    $cur.css('left', parseInt($cur.css('left'), 10) + 1);
                }

                // 上移
                if(key == 38 && parseInt($cur.css('top'), 10) > 0){
                    $cur.css('top', parseInt($cur.css('top'), 10) - 1);
                }

                // 下移
                if(key == 40 && parseInt($cur.css('top'), 10) <= $cur.parent().height() - $cur.height()){
                    $cur.css('top', parseInt($cur.css('top'), 10) + 1);
                }

                $(config.area_info).show()
                    .css('left', $cur.css('left'))
                    .css('top', $cur.css('top'))
                    .html('top:' + parseInt($cur.css('top'), 10) + '&nbsp;&nbsp;left:' + parseInt($cur.css('left'), 10)); // 显示单位太宽了
            }

        }).keyup(function(e){
                $(config.area_info).hide();
                e.stopPropagation();
            }).click(function(e){
                // 隐藏右键菜单
                $(config.context_menu).hide();

                if($cur){
                    $cur.removeClass('cur');
                    $cur = null;
                }
            });


        // 保存并生成代码
        $('#btn_get').click(function(e){
            e.preventDefault();

            // 为了美观，将代码区域宽度设置成与画布相同
            // var img_width = $(config.canvas).find('img').width();
            // $(config.code_wrap).width(img_width <= 1000 ? img_width : 1000);

            // 生成代码
            $(config.code_wrap).show().val(getCode());
        });

        // 读取代码
        $('#btn_set').click(function(e){
            e.preventDefault();

            var code = $(config.code_wrap).val();

            if(code != '' && code.indexOf('Hota') != -1){
                $(config.workshop).html(code);
                init();
            }
        });

        // 保存到 PAGE 系统
        $('#btn_save_ppms').click(function(e){
            e.preventDefault();

            $(config.page_content).val(getCode());
            $('#form').submit();
        });

    }

    // 添加热区
    function addZone(position){

        var $hot_list = $(config.canvas).find(config.hot_area),
            $hot_area = $('<a class="'+config.hot_area.substr(1)+'" href="">&nbsp;</a>');

            $hot_area.appendTo($(config.canvas))
                .css({
                    'width': config.init_width,
                    'height':  config.init_height,
                    'top':  position.top,
                    'left':  position.left
                });
            config.isDebug?console.log('HOTA:', '添加了一个热区'):0;

            if($hot_list.length > 0){
                $cur = $hot_area;
                var $last = $hot_list.last();

                $hot_area
                    .css({
                        'width': $last.width(),
                        'height': $last.height()
                    });
            }
        // 重新初始化
        init();
    }

    // 生成代码
    function getCode(){

        return $(config.workshop).clone()
            .find(config.canvas)
            .css({
                'width': $(config.canvas).find('img').width(),
                'height': $(config.canvas).find('img').height(),
                'position': 'relative'
            }).end()
            .find('.area_info, .v_line, .h_line').remove().end()
            .find('.ui-resizable-handle').remove().end()
            .find(config.hot_area).css('position','').removeAttr('class').end()
            .html()
            .replace(/\s{2,}/ig, '');

    }

    // 提示
    function tip(msg){
        $('#msg_tip').html(msg).show().delay(3000).fadeOut(1000);
    }

    // 开始初始化一次
    init();

});
