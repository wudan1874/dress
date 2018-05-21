/* 2017 by gongxy */

(function(win) {
	
	if(window.imgCache){ return; }
	window.imgCache = {}; 
	//window.setTimeout(function(){ console.log(window.imgCache) }, 10000);
	
	function parseURL(url) {
	   var a =  document.createElement('a');
	   a.href = url;
	   return {
	       source: url,
	       protocol: a.protocol.replace(':',''),
	       host: a.hostname,
	       port: a.port,
	       search: a.search,
	       params: (function(){
	           var ret = {},
	               seg = a.search.replace(/^\?/,'').split('&'),
	               len = seg.length, i = 0, s;
	           for (;i<len;i++) {
	               if (!seg[i]) { continue; }
	               s = seg[i].split('=');
	               ret[s[0]] = s[1];
	           }
	           return ret;
	       })(),
	       file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	       hash: a.hash.replace('#',''),
	       path: a.pathname.replace(/^([^\/])/,'/$1'),
	       relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	       segments: a.pathname.replace(/^\//,'').split('/')
	   };
	};
	
    function loader(config){
    	if(!config || !config.res || !config.res.length){ return;}
    	this.debug = config.debug ? true : false;
		this.imgList = [];
		this.cssList = [];
		this.jsList = [];
		for(var i in config.res){
			if(/\.css(\?{1}\S*)?$/.test(config.res[i])){
				this.cssList.push(config.res[i]);
			}else if(/\.js(\?{1}\S*)?$/.test(config.res[i])){
				this.jsList.push(config.res[i]);
			}else if(/\.(jpg|jpeg|png|gif)(\?{1}\S*)?$/.test(config.res[i])){
				this.imgList.push(config.res[i]);
			}else if(this.debug){
				console.log('无效的loadUrl地址：'+config.res[i]);
			}
		}
		this.loadCurr=[0,0,0];
    	this.loadRecord=[0,0,0];
    	this.loaded=0;
    	this.length=this.imgList.length+this.cssList.length+this.jsList.length;
    	this.urlCache = config.urlCache ? true : false;
    	this.onLoading = config.onLoading || undefined;
    	this.onLoaded = config.onLoaded || undefined;
    	this.onError = config.onError || undefined;
    	this.delayLoaded = config.delayLoaded || undefined;
    };
    loader.prototype.load=function(){
    	this.debug && console.log('loader资源统计：'+this.length+'\n img:'+this.imgList.length+', css:'+this.cssList.length+', js:'+this.jsList.length);
    	if(this.loaded>=this.length){ return;}
    	if(this.cssList.length>0){
    		this.loadCss();
    	}else if(this.imgList.length>0){
    		this.loadImg();
    	}else if(this.jsList.length>0){
    		this.loadJs();
    	}
    };
    loader.prototype.loadImg=function(){
    	var _this=this, img, url, fileName;
    	if(this.loadCurr[0]==this.imgList.length){ return; }
		url=this.imgList[this.loadCurr[0]];
    	if(url){
    		url = parseURL(url);
			img=new Image();
			img.crossOrigin = '*';
			// img.crossOrigin = 'anonymous';
			img.onload=function(e){
				_this._calculate(0, e.target.src);
				window.imgCache[url.file] = e.target;
			}
			img.onerror=function(e){ _this._calculate(0, '错误---'+img.src, e); }
			img.src= this.urlCache ? url.source : url.source+(url.search?'&':'?')+'r='+new Date().getTime();
			this.loadCurr[0] += 1;
		}else{
			_this._calculate(0, '错误---'+_this.imgList[this.loadCurr[0]]);
		}
    };
    loader.prototype.loadCss=function(){
    	var _this=this, url;
    	if(this.loadCurr[1]==this.cssList.length){ return; }
		url=this.cssList[this.loadCurr[1]];
    	if(url){
    		var mylink=document.createElement('link');
    		url = parseURL(url);
			mylink.type='text/css';
			mylink.rel='stylesheet';
			mylink.href = this.urlCache ? url.source : url.source+(url.search?'&':'?')+'r='+new Date().getTime();
			mylink.onload=function(){ _this._calculate(1, mylink.href); }
			mylink.onerror=function(e){ _this._calculate(1, '错误---'+mylink.href, e); }
	    	document.head.appendChild(mylink);
	    	this.loadCurr[1] += 1;
    	}else{
			_this._calculate(0, '错误---'+_this.cssList[this.loadCurr[1]]);
    	}
    };
    loader.prototype.loadJs=function(){
    	var _this=this, url;
    	if(this.loadCurr[2]==this.jsList.length){ return; }
		url=this.jsList[this.loadCurr[2]];
    	if(url){
    		var myjs=document.createElement('script');
    		url = parseURL(url);
			myjs.type='text/javascript';
			myjs.src = this.urlCache ? url.source : url.source+(url.search?'&':'?')+'r='+new Date().getTime();
			myjs.onload=function(){ _this._calculate(2, myjs.src); }
			myjs.onerror=function(e){ _this._calculate(2, '错误---'+myjs.src, e); }
	    	document.head.appendChild(myjs);
	    	_this.loadCurr[2] += 1;
    	}else{
			_this._calculate(0, '错误---'+_this.jsList[this.loadCurr[2]]);
    	}
    };
    loader.prototype._calculate=function(type, url, error_e){
    	if(type===undefined){ return;}
    	if(url.indexOf('错误---')>=0 && typeof(this.onError)=='function' && !this.onError(error_e)){ return; }
    	this.loadRecord[type]+=1;
		this.loaded+=1;
		this.debug && console.log('loader进度：['+this.loaded+'/'+this.length+'], 载入：'+url);
		var _percent=this.loaded/this.length;
		var _onLoaded;
		typeof(this.onLoading)=='function' && this.onLoading(_percent); 
		if(_percent>=1){ 
			_percent=1; 
			_onLoaded=this.onLoaded;
			if(typeof(_onLoaded)=='function'){
				if(typeof(this.delayLoaded)=="number" && this.delayLoaded>0){
		    		setTimeout(function(){ _onLoaded(); }, this.delayLoaded);
		    	}else{
		    		setTimeout(function(){ _onLoaded(); });
		    	}
			};
			return;
		};
		if(this.loadCurr[1]<this.cssList.length){
			this.loadCss();
		}else if(this.loadRecord[1]==this.cssList.length && this.loadCurr[0]<this.imgList.length){
			this.loadImg();
			this.loadImg();
		}else if(this.loadRecord[0]==this.imgList.length && this.loadCurr[2]<this.jsList.length){
			this.loadJs();
		};
	};
    
    win.appLoad = function(){
    	var config = {
    		res: [],
    		debug: false,
    		delayLoad: 0,
    		delayLoaded: 0,
    		urlCache: false,
    		onLoading: undefined,
    		onLoaded: undefined,
    		onError: undefined
    	};
    	if(!arguments.length){ 
    		return; 
    	}else if((typeof(arguments[0])=='object' && arguments[0].length) || typeof(arguments[0])=='string'){
    		config.res = arguments[0];
    		if(typeof(arguments[1])=='function'){ config.onLoading = arguments[1]; }
    		if(typeof(arguments[2])=='function'){ config.onLoaded = arguments[2]; }
    		if(typeof(arguments[3])=='function'){ config.onError = arguments[3]; }
    	}else if(typeof(arguments[0])=='object' && arguments[0].res){
    		for(var i in config){
    			if(arguments[0][i]){ config[i]=arguments[0][i]; }
    		}
    	};
    	if(!config.res){ return; };
    	if(typeof(config.res)=='string'){ config.res = config.res.split(',');  };
    	if(typeof(config.delayLoad)=="number" && config.delayLoad>0){
    		setTimeout(function(){ new loader(config).load(); }, config.delayLoad);
    	}else{
    		new loader(config).load();
    	};
    };
    
})(window);
