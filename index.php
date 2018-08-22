<?php
require_once "../share/jssdk.php";
$jssdk = new JSSDK("AppID", "AppSecret");
$signPackage = $jssdk->GetSignPackage();

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset='utf-8'/>
	<title>让我再次介绍我自己</title>
	<meta name='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
	<meta name='apple-mobile-web-app-capable' content='yes' />
	<meta name='screen-orientation' content='portrait' />
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<link href="css/reset.css" rel="stylesheet" />
	<script src="js/jweixin-1.2.0.js"></script>
	<script src="js/jquery.2.1.1.min.js"></script>
	<script src="js/loader.js" ></script>
	<script src="js/init.js" ></script>
</head>
<body>

	<div class="app">

		<section class="load">
			<center><figure></figure><h6>登录呆星球<q><span>···</span></q></h6></center>
		</section>

		<section class="s1">

			<h2><img src="img/indexTitle.png" style='width:75%!important;' alt="" /><br><br>「我」的呆星球</h2>

			<center>
				<h3><a></a><a></a></h3>
				<p>选择我的性别</p>
				<h4><a>开始生成</a></h4>

			</center>

			<footer>Copyright By DAIPLANET </footer>
		</section>

		<section class="s2">
			<h3></h3>
			<figure>
				<p class="body"></p>
				<!--裤子-->
				<p class="item3"></p>
                <!--鞋子-->
				<p class="item4"></p>
				<!--衣服-->
				<p class="item2"></p>
				<!--表情-->
				<p class="item0"></p>
				<!--发型-->
				<p class="item1"></p>
				<!--配饰-->
				<p class="item5"></p>
			</figure>
			<footer><a class="btn1">返回</a><a class="btn2">背景选择</a></footer>
			<ol>
				<li class="look"><a>表情</a></li>
				<li class="hair"><a>发型</a></li>
				<li class="clothes"><a>衣服</a></li>
				<li class="pants"><a>下装</a></li>
				<li class="shoes"><a>鞋子</a></li>
				<li class="ornament"><a>配饰</a></li></ol>

			<menu><div></div></menu>
		</section>

		<section class="s3">
        			<header><a>返回装扮</a></header>
        			<figure>
        				<p class="bg"></p>
        				<p class="role"></p>
        				<p class="title"></p>
        				<!--<p class="ewm"></p>-->
        				<p class="name"><span><big>我是<font></font></big><br /><small>我小時候最喜歡<font></font></small></span></p>
        			</figure>
        			<footer>
        				<h3><a>生成<br/>海报</a></h3>
        				<menu><div></div></menu>
        			</footer>
        			<center>
        				<div>
        					<p>我是 /<input type="text" maxlength="8" placeholder="" /></p>
        					<p>我小時候最喜歡 /<input type="text" maxlength="8" placeholder="" /></p>
        					<a>完成</a>
        				</div>
        			</center>
        		</section>

		<section class="s4">
			<figure></figure>
			<footer><a class="btn6">返回编辑</a><a class="btn4">生成头像</a><a class="btn3">长按保存</a><a class="btn5">分享</a></footer>
		</section>

		<section class="s5">
			<figure></figure>
			<footer><a class="btn1">返回</a><a class="btn3">长按保存</a><a class="btn5">分享</a></footer>
		</section>

		<section class="share">
			<center>
			   <img src="img/share.png" style='width:100%!important;' alt="" />
			</center>
		</section>

	</div>


	<div class="debug">debug</div>
	<span style="display:none;"><script src="z_stat.php" language="JavaScript"></script></span>

</body>
	<script>
	wx.config({
	    debug: false,
	    appId: '<?php echo $signPackage["appId"];?>',
	    timestamp: <?php echo $signPackage["timestamp"];?>,
	    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
	    signature: '<?php echo $signPackage["signature"];?>',
	    jsApiList: [
	      // 所有要调用的 API 都要加到这个列表中
			'checkJsApi', //判断当前客户端版本是否支持指定JS接口
		    'onMenuShareTimeline', //分享给好友
		    'onMenuShareAppMessage' //分享到朋友圈
	    ]
	  });
	wx.ready(function () {
	    // 在这里调用 API
	    var title = '再见六一 让我再次介绍我自己';
	    var imglink = 'http://daiplanet.villagenes.com/img/dress/img/wx-share.png';

         wx_share(title, imglink);



   })

	function wx_share(title, imglink) {
	    wx.onMenuShareAppMessage({
    	  title: title, // 分享标题
    	  //title: '再见六一 让我再次介绍我自己',
	      desc: '再见六一 「我」的呆星球', // 分享描述
	      link: 'http://events.daiplanet.com/dress/index.php',
	      imgUrl: imglink, // 分享图标
	      type: 'link', // 分享类型,music、video或link，不填默认为link
	      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	      success: function () {
	      // 用户点击了分享后执行的回调函数
	      }
	    });

	    wx.onMenuShareTimeline({
	      title: title,
	      //title: $('#i-am').innerText ? '我是'+$('#i-am').innerText : '让我再次介绍我自己', // 分享标题
	      link: 'http://events.daiplanet.com/dress/index.php',
	      // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	      imgUrl: imglink, // 分享图标
	      success: function () {
	      // 用户点击了分享后执行的回调函数
	      },
	    })
  	}


	</script>
</html>