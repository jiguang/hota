/**
 * @desc 热区图页面片工具，用于编辑热区并生成页面片
 * @author laserji
 * @mail jiguang1984#gmail.com
 * @date 2013-04-27
 */

$(function(){
    "use strict";

    var config = {
        canvas: '#hota_canvas',
        hot_area: 'a',
        init_width: 100,
        init_height: 100,
        area_info: '#area_info',
        v_line: '#v_line',
        h_line: '#h_line',
        tolerance: 5
    };
    var $cur = null;

    // 初始化
    function init(){

        var $hot_list = $(config.canvas).find(config.hot_area);

        $hot_list.each(function(){
            $(this)
                .css({
                    'position': 'absolute',
                    'background-image': 'url(about:blank)',
                    'width': $(this).width(),
                    'height': $(this).height()
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

        // 图片地址
        if($('#bg').attr('src') != ''){
            $('#img_src').val($('#bg').attr('src'));
        }

        // 辅助信息
        if(!$(config.canvas).find(config.area_info)[0]){
            $(config.canvas).append('<div id="area_info" class="area_info"></div>\
                <div id="h_line" class="h_line"></div>\
                <div id="v_line" class="v_line"></div>');
        }

        // 代码框清空
        $('#code_wrap').val('');

        // IE提示
        if($.browser.msie){
            $('#browser_tip').fadeIn(500).delay(4000).fadeOut(1000);
        }

        // 复制代码
        var clip = new ZeroClipboard( document.getElementById("btn_copy"), {
            moviePath: "./js/ZeroClipboard.swf"
        } );

        clip.on( 'complete', function(){
            alert('复制成功，请将代码粘贴到新建的页面片中或直接使用');
        });


    }

    function addZone(position){

        position = position || {
            top: 10,
            left: 10
        };

        var $hot_list = $(config.canvas).find(config.hot_area),
            $hot_area = $('<a class="'+config.hot_area.substr(1)+'" href=""></a>');

        $hot_area.appendTo($(config.canvas))
            .css({
                'position': 'absolute',
                'background-image': 'url(about:blank)',
                'width': config.init_width,
                'height':  config.init_height,
                'top':  position.top,
                'left':  position.left
            });

        // 重新初始化
        init();

        if($hot_list.length > 0 && !position){
            $cur = $hot_area;
            $hot_area
                .css('left', ($hot_list.last().position().left || 0) + 10)
                .css('top', ($hot_list.last().position().top || 0) + 10);
        }
    }

    $('#add').click(function(e){
        e.preventDefault();
        addZone();
    });

    // 设置图片地址
    $('#img_src').on('keyup blur', function(){
        if(/http:\/\/.*?(jpg|jpeg|png|bmp|\d)/.test($(this).val())){
            $('#bg').attr('src', $(this).val());
            $('#bg').load(function(){
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
        $('#context_menu').hide();

        if($cur){
            $cur.removeClass('cur');
            $cur = null;
        }
    });

    // 呼出右键菜单
    $(config.canvas).on('contextmenu', function(e){
        e.preventDefault();

        if(e.target.tagName.toLocaleLowerCase() === 'a'){
            $('#context_menu').show().css('left', e.pageX).css('top', e.pageY).draggable();
            $cur = $(e.target);
            $cur.addClass('cur').siblings().removeClass('cur');

            $('#link_addr').val($cur.attr('href'));
            $('#link_tit').val($cur.attr('title'));

            if($(e.target).attr('target') != undefined){
                $('#'+$(e.target).attr('target'))[0].checked = true;
            }
        }
        e.stopPropagation();
    }).click(function(e){
            e.preventDefault();

            if(e.target.tagName.toLocaleLowerCase() === 'a'){
                $cur = $(e.target);
                $cur.addClass('cur').siblings().removeClass('cur');
            }else{
                addZone({
                   top: e.pageY - $(e.target).offset().top - 10,
                    left: e.pageX - $(e.target).offset().left - 10
                });
            }



            e.stopPropagation();
        });

    // 点在菜单空白处不隐藏
    $('#context_menu').click(function(e){
        e.stopPropagation();
    });

    $('#confirm').click(function(){
        if($cur){
            if(!/^http:\/\/.*/.test($.trim($('#link_addr').val()))){
                alert('链接地址不正确，请重新设置');
                return;
            }

            $cur.attr('href', $('#link_addr').val())
                .attr('title', $('#link_tit').val())
                .attr('target', $('#open_type input:checked')[0].id);

            $('#context_menu').hide();
        }
    });

    // 取消设置
    $('#cancel').click(function(){
        $('#context_menu').hide();
    });

    // 保存并返回
    $('#get_code').click(function(e){
        e.preventDefault();

        // 为了美观，将代码区域宽度设置成与画布相同
        $('#code_wrap').width($(config.canvas).find('img').width() - 20);

        // 生成代码
        var code = $('#workshop').clone()
            .find(config.canvas)
            .css({
                'width': $(config.canvas).find('img').width(),
                'height': $(config.canvas).find('img').height(),
                'position': 'relative'
            }).removeAttr('class').end()
            .find('#area_info, #v_line, #h_line').remove().end()
            .find('.ui-resizable-handle').remove().end()
            .find(config.hot_area).removeAttr('class').end()
            .html()
            .replace(/\s{2,}/ig, '');

        $('#code_wrap').show().val(code);
    });

    // 开始初始化一次
    init();

});
