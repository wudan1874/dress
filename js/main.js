
function appStart(){
	
	if(!window.app || !window.$){ return; console.log('Error: 资源加载错误'); }
	
	/*定义事件*/
	app.evtDown = app.isTOUCH ? 'touchstart' : 'mousedown';
	app.evtUp = app.isTOUCH ? 'touchend' : 'mouseup';
	app.evtClick = app.isTOUCH ? 'tap' : 'click';
	$.event.special.tap = {
        setup: function () {
            $(this).on('touchstart.tap', function (e) {
                $(this).data('@tap_startTime', e.timeStamp);
            });
            $(this).on('touchmove.tap', function (e) {
                $(this).removeData('@tap_startTime');
            });
            $(this).on('touchend.tap', function (e) {
                if($(this).data('@tap_startTime') && e.timeStamp-$(this).data('@tap_startTime')<800){
                	$(this).removeData('@tap_startTime');
                	var myevt=$.Event("tap");
                	myevt.originalEvent=e.originalEvent;
                	setTimeout(function(){ $.event.trigger(myevt, null, e.target); }, 100);
                } 
            });
        },
        teardown: function () {
        	$(this).off('touchstart.tap').off('touchmove.tap').off('touchend.tap');
            $.event.remove(this, 'tap');
            $.removeData(this, '@tap_startTime');
        }
	};
	$.event.special.slide = {
        setup: function () {
            $(this).on(app.evtDown+'.slide', function (e) {
                $(this).data('@slide_startTime', e.timeStamp);
                $(this).data('@slide_startX', e.pageX || e.originalEvent.changedTouches[0].pageX );
                $(this).data('@slide_startY', e.pageY || e.originalEvent.changedTouches[0].pageY );
            });
            $(this).on(app.evtUp+'.slide', function (e) {
            	var sx = $(this).data('@slide_startX');
            	var sy = $(this).data('@slide_startY');
            	var ex = e.pageX || e.originalEvent.changedTouches[0].pageX;
            	var ey = e.pageY || e.originalEvent.changedTouches[0].pageY;
            	var startTime = $(this).data('@slide_startTime');
            	var type, myevt, limit=30;
            	$(this).removeData('@slide_startX').removeData('@slide_startY').removeData('@slide_startTime');
            	if(typeof(startTime)!='number' || e.timeStamp-startTime>1000){ return;}
            	if(typeof(sx)!='number' || typeof(ex)!='number' || typeof(sy)!='number' || typeof(ey)!='number'){ return; }
            	ex = ex - sx;
            	ey = ey - sy;
            	if(Math.abs(ex)>Math.abs(ey)){
            		if(ex>limit){ type = 'right'; }else if(ex<-limit){ type = 'left'; };
            	}else{
            		if(ey>limit){ type = 'down'; }else if(ey<-limit){ type = 'up'; };
            	}
            	if(type){
	            	myevt=$.Event("slide");
	            	myevt.slideType = type;
	            	$.event.trigger(myevt, null, e.target);
            	}
            });
        },
        teardown: function () {
        	$.event.remove(this, 'slide');
        	$(this).off(app.evtDown+'.slide').off(app.evtUp+'.slide');
            $(this).removeData('@slide_startX').removeData('@slide_startTime');
        }
	};
	
	
	/*提示弹窗*/
	function myAlert(info, callback){
		var html = '';
		if(info===undefined){ info = ''; }
		if(info===null){ info = 'null'; }
		if(typeof(info)==='boolean'){ info = info?'true':'false'; }
		html += '<div class="alert"><article>';
		html += '<header>'+info+'</header>';
		html += '<footer><a>确定</a></footer>';
		html += '</article></div>';
		html = $(html);
		html.find('footer').one(app.evtClick, function(){
			var div = $(this).closest('.alert');
			div.addClass('alert_out').one('webkitAnimationEnd', function(){
				$(this).remove();
				if(typeof(callback)=='function'){ callback(); }
			});
		});
		$('.app').append(html);
	};
	
	
	/*loading提示*/
	function loadingShow(callback){
		var html = $(".loading");
		if(html.length){ html.removeClass('loading_out').off('webkitAnimationEnd'); return; }
		html = $('<div class="loading"><center><i></i></center></div>');
		$(".app").append(html);
		if(typeof(callback)!='function'){ return; }
		html.one('webkitAnimationEnd', function(){ callback(); });
	};
	function loadingHide(callback){
		var html = $(".loading");
		if(!html.length){ return; }
		html.addClass('loading_out').one('webkitAnimationEnd', function(){
			$(this).remove();
			if(typeof(callback)!='function'){ return; }
			setTimeout(callback, 100);
		});
	};
	
	
	/*切屏*/
	function slideTo(el, isBack, callback){
		var curr = $(".app>section:visible");
		var next = $(el);
		if(next.is(curr)){ return; }
		curr.length && curr.addClass('no_animation').transit({y: isBack?'100%':'-100%'}, 300, function(){
			$(this).removeClass('no_animation').removeAttr('style');
		});
		next.css({display:'block', y:isBack?'-100%':'100%'}).addClass('no_animation').transit({y: 0}, 300, function(){ 
			$(this).removeClass('no_animation');
			typeof(callback)=='function' && callback();
		});
	};
	
	
	
	/*s1*/
	function createItemsList(sex){
		if(sex!=1 && sex!=2){ sex=1; }
		var html='', arr;
		for(var i=0; i<=5; i++){
			html+='<ul>';
			arr = app.poster.items[i][sex-1];

			$.each(arr, function() {
				html+='<li style="background-image: url(img/item'+i+'/i'+i+'-'+this+'s.png);" data-img="i'+i+'-'+this+'.png"></li>';
			});
			html+='</ul>';
		};
		$(".s2 menu>div").html(html);
		$(".s2 menu ul:eq(0) li:eq(0), .s2 menu ul:eq(1) li:eq(0), .s2 menu ul:eq(2) li:eq(0),.s2 menu ul:eq(3) li:eq(0)").trigger('click');
	};
	$(".s1 h3 a").on(app.evtClick, function(){
		if($(this).is('.curr')){ return; }
		$(this).addClass('curr').siblings('a').removeClass('curr');
		app.poster.sex = $(this).index()==0 ? 1 : 2;
		app.sound.click.play();
		// console.log(app.poster,2)
	});
	$(".s1 h4 a").on(app.evtClick, function(){
		setTimeout(function(){ app.sound.click.play(); });
		if(!app.poster.sex){ myAlert('请先选择性别！'); return; }
		$(".s2 figure").attr('class', 'role'+app.poster.sex).children('p').removeAttr('style');
		$(".s2 ol").removeClass('selected').children('li').removeClass('curr');
		$(".s2 menu").hide();
		createItemsList(app.poster.sex);
		slideTo('.s2');
	});
	
	
	/*s2*/
	app.itemScroll = new IScroll($(".s2 menu")[0], {click: true});
	function createRole(callback){
		var role, level, canvas, ctx, body, items=[0], isLoaded=true;
		loadingShow();
		$(".s2 menu ul").each(function(i){
			i += 1;
			level = parseInt($('.s2 figure .item'+(i-1)).css('z-index')) || 0;
			items.push({id:$(this).find('li.curr').attr('data-img'), lv:level, img:undefined});
            // console.log(items)
			if(items[i].id){ 
				items[i].img = window.imgCache[items[i].id];
				if(!items[i].img){ setTimeout(function(){ createRole(callback); },300); isLoaded=false; return false; }
			}
		});
		if(!isLoaded){ return; }
		items.sort(function(a, b){ return a.lv-b.lv; })
		// canvas生成图片
		body = window.imgCache[$(".s2 figure").is('.role1') ? 'role1.png' : 'role1.png'];
		canvas = document.createElement('canvas');
        canvas.width = body.naturalWidth;
		canvas.height = body.naturalHeight;
		ctx = canvas.getContext('2d');
		ctx.drawImage(body, 0, 0);
		$.each(items, function(){ if(this.img){ ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height); }});
		role = new Image();
		role.onload = function(){
			loadingHide();
			setTimeout(function(){ typeof(callback)=='function' && callback(role); }, 100);
		};
		role.src = canvas.toDataURL();
	};
	// 部位点击事件
	$(".s2 ol").on(app.evtClick, 'li a', function(){
		var li = $(this).parent();
		if(li.is('.curr')){ $(".s2 footer .btn1").trigger(app.evtClick); return; }
		li.addClass('curr').parent('ol').addClass('selected');
		$(".s2 footer a.btn1").text('返回分类');
		$(".s2 menu").show().find('ul').hide().eq(li.index()).show();
		app.itemScroll.refresh();
		app.itemScroll.scrollTo(0,0,0);
		setTimeout(function(){ app.sound.click.play(); });
	});
	// 点击左边换装图标
	$(".s2 menu").on('click', 'li', function(){
		if($(this).hasClass('off')){ return; }
		setTimeout(function(){ app.sound.click.play(); });
		var type = $(this).parent().index();//部位的index

		console.log('type='+type)

		if($(this).is('.curr')){
			$(this).removeClass('curr');
			$(".s2 figure .item"+type).removeAttr('style');
			if(type<=4){ $(this).parent().children(':eq(0)').trigger('click'); }
			return;
		}
		var imgName = $(this).attr('data-img');
		var imgUrl = 'img/item'+type+'/'+imgName;
		var imgID = imgName.replace('.png', '').split('-')[1];
		// console.log(imgName,imgID)
		var action = function(){
			var about, temp, p = $(".s2 figure .item"+type);
			p.attr('style', 'background-image: url('+imgUrl+')');
			type -= 1;
			if(app.poster.exLevel[type] && app.poster.exLevel[type][imgID]){
				p.css('z-index', app.poster.exLevel[type][imgID]);
			};
			if(type==1 || type==2){

				p = $(".s2 figure .item3");
				temp = $(".s2 menu ul:eq(2) li.curr").attr('data-img');
				if(temp){ temp = temp.replace('.png', '').split('-')[1]; }
				if(app.poster.exLevel[2][temp]){
					p.css('z-index', app.poster.exLevel[2][temp]);
				}else if(p[0].preZindex){
					p.css('z-index', p[0].preZindex); p[0].preZindex=undefined;
				};
				if(type==2 && app.poster.exPants[imgID]){
					about = $(".s2 menu ul:eq(1) li.curr").attr('data-img');
					if(about){
						about = about.replace('.png', '').split('-')[1];
						if(app.poster.exPants.aboutCost[about]){
							p[0].preZindex = p.css('z-index');
							p.css('z-index', app.poster.exPants[imgID]);
						}else{
							about = 0;
						}
					}
				}else if(type==1 && app.poster.exPants.aboutCost[imgID]){
					about = $(".s2 menu ul:eq(2) li.curr").attr('data-img');
					if(about){
						about = about.replace('.png', '').split('-')[1];
						if(app.poster.exPants[about]){
							p[0].preZindex = p.css('z-index');
							p.css('z-index', app.poster.exPants[about]);
						}else{
							about = 0;
						}
					}
				};
			};
			if(type==3 || type==2 || type==1){
				p = $(".s2 figure .item4");
				temp = $(".s2 menu ul:eq(3) li.curr").attr('data-img');
				if(temp){ temp = temp.replace('.png', '').split('-')[1]; }
				if(app.poster.exLevel[3][temp]){
					p.css('z-index', app.poster.exLevel[3][temp]);
				}else if(p[0].preZindex){
					p.css('z-index', p[0].preZindex); p[0].preZindex=undefined;
				};
				about = $(".s2 menu ul:eq(2) li.curr").attr('data-img');
				if(about && temp){
					about = about.replace('.png', '').split('-')[1];
console.log('上衣ID='+about,'裤子='+temp)
					if(app.poster.exPants[about] && !app.poster.exLevel[3][temp]){
						p[0].preZindex = p.css('z-index');
						p.css('z-index', app.poster.exPants[about]+1);
					}
				}
			};
			if(type==1 || type==4){
				p = $(".s2 figure .item5");
				if(p[0].preZindex){ p.css('z-index', app.poster.exLevel[4][imgID] && app.poster.exLevel[4][imgID]>p[0].preZindex ? app.poster.exLevel[4][imgID] : p[0].preZindex); p[0].preZindex=undefined; }
				if(type==4 && app.poster.exAcc[imgID]){
					about = $(".s2 menu ul:eq(1) li.curr").attr('data-img');
					if(about){
						about = about.replace('.png', '').split('-')[1];
						if(app.poster.exAcc.aboutCost[about]){
							p[0].preZindex = p.css('z-index');
							p.css('z-index', app.poster.exAcc[imgID]);
						}
					}
				}else if(type==1 && app.poster.exAcc.aboutCost[imgID]){
					about = $(".s2 menu ul:eq(4) li.curr").attr('data-img');
					if(about){
						about = about.replace('.png', '').split('-')[1];
						if(app.poster.exAcc[about]){
							p[0].preZindex = p.css('z-index');
							p.css('z-index', app.poster.exAcc[about]);
						}
					}
				}
			};
			if(type==4){
				$(".s2 menu ul:eq(4)")[0].preCurr = undefined;
			};
			if(type==1){

				if(app.poster.exCost[imgID]){

					$.each(app.poster.exCost[imgID], function(i,o) {
						about = $(".s2 menu ul:eq("+(i-1)+")");

						if(!o.isoff){ about.children('li').addClass('off'); }
						$.each(o.ids, function(ii,oo){
							about.find("li[data-img='i"+i+"-"+oo+".png']").toggleClass('off', o.isOff?true:false);
						});
						if(about.children('li.curr').hasClass('off')){
							// 穿了连衣裙下装取消
							$(".s2 figure .item"+(i-1)).css('background-image', 'none');
							about[0].preCurr = about.children('li.curr').index();
							about.children('li.curr').removeClass('curr');
						};
						if(i==1 && !about.children('li.curr').length){
							about.children('li').not('.off').eq(0).trigger('click');
						}
					});
				}else{
					$.each(app.poster.exCost, function(i,o) {
						$.each(o, function(ii,oo){
							about = $(".s2 menu ul:eq("+(ii-1)+")");
							about.children('li').removeClass('off');
							if(typeof(about[0].preCurr)=='number' && about[0].preCurr>=0){
								about.children('li:eq('+about[0].preCurr+')').trigger('click');
							};
							about[0].preCurr = undefined;
						})
					});
				}
			};
		};
		$(this).addClass('curr').siblings().removeClass('curr');
		action();
		if(!window.imgCache[imgName]){ appLoad([imgUrl]); }
	});
	$(".s2 footer a").on(app.evtClick, function(){
		setTimeout(function(){ app.sound.click.play(); });
		if($(this).is('.btn1')){
			if($(this).text()=='返回分类'){
				$(this).text('返回');
				$(".s2 menu").hide();
				$(".s2 ol").removeClass('selected').children('li').removeClass('curr');
			}else{
				slideTo('.s1', true);
			};
		}else if($(this).is('.btn2')){
			if(!$(".s3 menu ul").length){ createBgList(); }
			createRole(function(role){
				app.poster.role = role;
				$(".s3 figure .role").css('background-image', 'url('+role.src+')');
				$(".s3 footer h4 a").removeAttr('curr').eq(0).addClass('curr');
				$(".s3 footer menu ul").hide().eq(0).show();
				slideTo('.s3', false, function(){
					app.bgScroll.refresh();
					app.bgScroll.scrollTo(0,0,0);
				});
			});
		}
	});
	
	
	/*s3*/
	app.bgScroll = new IScroll($(".s3 menu")[0], {click: true, scrollY:false, scrollX:true});
	function createBgList(){
		var html='';
		html+='<ul>';
		for(var i=1; i<=app.poster.bg; i++){
			html+='<li style="background-image: url(img/bg/bg-'+i+'s.png);" data-img="bg-'+i+'.png"></li>';
		};
		html+='</ul>';
		$(".s3 menu>div").html(html);
		$(".s3 menu ul:eq(0) li:eq(0)").trigger('click');
	};
	function createPoster(callback){
		var bg = window.imgCache[$(".s3 menu ul:eq(0) li.curr").attr('data-img')];
		var bgColor = '#fff';
		var role = app.poster.role;
		var title = window.imgCache['title.png'];
		var title2 = window.imgCache['title2.png'];
		var ewm = window.imgCache['ewm.png'];
		var poster, poster2, canvas, ctx, txt, txtX, action;
		if(!bg || !role){ return; }
		loadingShow();
		action = function(){ 
			loadingHide();
			setTimeout(function(){ typeof(callback)=='function' && callback(poster, poster2); }, 100); 
		};
		canvas = document.createElement('canvas');
		canvas.width = title.naturalWidth;
		canvas.height = title.naturalHeight;
		ctx = canvas.getContext('2d');
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(bg, 0, 0);
		ctx.drawImage(role, 0, 0, role.naturalWidth, role.naturalHeight, canvas.width*0.15, canvas.width*0.07, canvas.width*0.7, canvas.width*1.286);
		ctx.drawImage(title, 0, 0);
		//ctx.drawImage(ewm, 0, 0, ewm.naturalWidth, ewm.naturalHeight, 26, 877, 80, 80);
		ctx.textBaseline="top";
		ctx.fillStyle = '#111';
		ctx.font = 'bold 25px arial';
		txt = app.poster.label+'\n\n/是我';
		txtX = (canvas.width-ctx.measureText(txt).width)*0.5
		ctx.fillText(txt, txtX, 25);
		ctx.font = 'bold 12px arial';
		txt = '我是\n\n'+app.poster.name;
		ctx.fillText(txt, txtX, 54);
		poster = new Image();
		poster2 = new Image();
		$("body").append(poster)
		$("body").append(poster2)
		poster.onload = function(){ poster.loaded=true; if(poster2.loaded){ action(); }};
		poster.src = canvas.toDataURL('image/jpeg', 0.9);
		//海报2
		canvas.width = role.naturalWidth;
		canvas.height = role.naturalWidth;
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(title2, 0, 0);
		ctx.drawImage(role, 0, -25);
		poster2.onload = function(){ poster2.loaded=true; if(poster.loaded){ action(); }};
		poster2.src = canvas.toDataURL('image/jpeg', 0.9);
	};
	function checkWord(word, callback){
		$.ajax({
	        type: 'get',
			url: 'http://case.html5case.cn/kaola/submit?text=' + word,
			dataType: 'json',
			error: function(){ typeof(callback)=='function' && callback(); },
			success: function(resp) {
				var url = 'http://cdn.h5case.com.cn/' + resp.data
				$.ajax({
					type: 'get',
					url: url + '?ydtext',
					dataType: 'json',
					error: function(){ typeof(callback)=='function' && callback();  },
					success: function(resp) {
						if(resp.code == 200) {
							typeof(callback)=='function' && callback(resp.result.action);
						} else {
							this.error();
						}
					}
				});
			}
		});
	};
	$(".s3 header a").on(app.evtClick, function(){
		slideTo('.s2', true);
		app.sound.click.play();
	});
	$(".s3 menu").on('click', 'li', function(){
		if($(this).is('.curr')){ return; }
		var imgName = $(this).attr('data-img');
		$(".s3 figure .bg").css('background-image', 'url(img/bg/'+$(this).attr('data-img')+')');
		$(this).addClass('curr').siblings().removeClass('curr');
		app.sound.click.play();
	});
	$(".s3 figure .name").on(app.evtClick, function(){
		$(".s3>center").show();
	});
	$(".s3>center a").on(app.evtClick, function(){
		setTimeout(function(){ app.sound.click.play(); });
		app.poster.label = $(".s3>center input:eq(0)").val().trim();
		app.poster.name = $(".s3>center input:eq(1)").val().trim();
		if(!app.poster.label){ 
			myAlert('请填写您的标签！'); return; 
		}else if(!app.poster.name){ 
			myAlert('请填写您的名字！'); return; 
		};
		if($(".s3 figure .name font:eq(0)").text()!=app.poster.label || $(".s3 figure .name font:eq(1)").text()!=app.poster.name){
			app.poster.wordCheck = false;
		};
		$(".s3 figure .name font:eq(0)").text(app.poster.label);
		$(".s3 figure .name font:eq(1)").text(app.poster.name);
		$(".s3>center").hide();
	});
	$(".s3 footer h3 a").on(app.evtClick, function(){
		setTimeout(function(){ app.sound.click.play(); });
		if(!app.poster.label || !app.poster.name){ myAlert('请填写您的标签和名字！'); return; }
		if(!app.poster.wordCheck){
			loadingShow();
			checkWord(app.poster.label, function(r){
				if(!r){ loadingHide(); myAlert('输入内容检查错误，请重试！'); return; }
				if(r!=1){ loadingHide(); myAlert('您输入的标签违规，请重新输入！'); return; }
				checkWord(app.poster.name, function(r){
					if(!r){ loadingHide(); myAlert('输入内容检查错误，请重试！'); return; }
					if(r!=1){ loadingHide(); myAlert('您输入的名字违规，请重新输入！'); return; }
					app.poster.wordCheck = true;
					createPoster(function(poster, poster2){
						app.poster.img1 = poster;
						app.poster.img2 = poster2;
						$(".s4 figure img, .s4 .btn3 img, .s5 .btn3 img").remove();
						$(".s4 figure, .s4 .btn3").append(poster);
						$(".s5 figure, .s5 .btn3").append(poster2);
						slideTo('.s4');
					});
				});
			});
		}else{
			createPoster(function(poster, poster2){
				app.poster.img1 = poster;
				app.poster.img2 = poster2;
				$(".s4 figure img, .s4 .btn3 img, .s5 .btn3 img").remove();
				$(".s4 figure, .s4 .btn3").append(poster);
				$(".s5 figure, .s5 .btn3").append(poster2);
				slideTo('.s4');
			});
		};
	});
	
	
	/*s4 & s5*/
	$(".s4 .btn6").on(app.evtClick, function(){
		slideTo('.s3', true);
		app.sound.click.play();
	});
	$(".s4 .btn4").on(app.evtClick, function(){
		slideTo('.s5');
		app.sound.click.play();
	});
	$(".s5 .btn1").on(app.evtClick, function(){
		slideTo('.s4', true);
		app.sound.click.play();
	});
	$(".s4 .btn5, .s5 .btn5").on(app.evtClick, function(){
		$(".share").css({display: 'block', y:'8%', opacity:0}).transit({y:0, opacity:1}, 200, function(){
			$(this).one(app.evtClick, function(){
				$(this).transit({y:'8%',opacity:0}, 200, function(){
					$(this).removeAttr('style');
				})
			});
		});
		app.sound.click.play();
	});
	
	
	/*app开始*/
	$(".load").addClass('no_animation').transit({opacity:0}, 400, 'linear', function(){
		$(this).remove();
		$(".s1").css({display:'block', opacity:0}).transit({opacity:1}, 400, 'linear');
		//调试
		//createItemsList(1)
		//createBgList();
		//app.poster.role = window.imgCache['role1.png'];
		//$(".s3").css({display:'block', opacity:0}).transit({opacity:1}, 400, 'linear');
		//setTimeout(function(){ app.itemScroll.refresh(); app.bgScroll.refresh(); }, 300);
		
	});
	//app.sound.bg.play();
	//$(window).one(app.evtUp, function(){ app.sound.bg.play();  });
	
};
