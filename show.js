   cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
	var files;
	var imageId;
	    // this function gets called once the user drops the file onto the div
	    function handleFileSelect(evt) {
	        evt.stopPropagation();
	        evt.preventDefault();
	
	        // Get the FileList object that contains the list of files that were dropped
	        files = evt.dataTransfer.files;
	
	        // this UI is only built for a single file so just dump the first one
	        file = files[0];
	         imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
	        loadAndViewImage(imageId);

	    }
	
	    function handleDragOver(evt) {
	        evt.stopPropagation();
	        evt.preventDefault();
	        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	    }
	
	
	    cornerstoneWADOImageLoader.configure({
	        beforeSend: function(xhr) {
	            // Add custom headers here (e.g. auth tokens)
	            //xhr.setRequestHeader('x-auth-token', 'my auth token');
	        },
	        useWebWorkers: true,
	    });
	
	    let loaded = false;
	
	    function loadAndViewImage(imageId) {
	        const element = document.getElementById('dicomImage');
	        const start = new Date().getTime();
	        cornerstone.loadImage(imageId).then(function(image) {
	            console.log(image);
	            const viewport = cornerstone.getDefaultViewportForImage(element, image);
	            
	            cornerstone.displayImage(element, image, viewport);
	            if(loaded === false) {
	            	
	
					loaded = true;
	              }
	        // const end = new Date().getTime();
	        // const time = 0;
	        // time = end - start;
	        }, function(err) {
	            alert(err);
	        });
	    
	}
	    cornerstone.events.addEventListener('cornerstoneimageloadprogress', function(event) {
	        const eventData = event.detail;
	        const loadProgress = document.getElementById('loadProgress');
	        loadProgress.textContent = `Image Load Progress: ${eventData.percentComplete}%`;
	    });
	
	    const element = document.getElementById('dicomImage');
	    cornerstone.enable(element);
	
	    document.getElementById('selectFile').addEventListener('change', function(e) {
	        // Add the file to the cornerstoneFileImageLoader and get unique
	        // number for that file
	        const file = e.target.files[0];
	        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
	        loadAndViewImage(imageId);
	    });
		
	    
	//上传dcm图像	
$("#upload").click(function () {
	// e.preventDefult();
	if(document.getElementById("process")){

				
				document.getElementById("process").innerHTML="检测中...";
				}
    var files = $('#selectFile').prop('files');
    var data = new FormData();
    data.append('DCM-01', files[0]);
   
    $.ajax({
        type: 'POST',
        url: "/upload",
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (ret) {
			console.log(ret)
			console.log(ret[0].prob);
			console.log(ret.length);
			l = ret.length;
			
			if(document.getElementById("process")){

				
				document.getElementById("process").innerHTML="检测完成";
				}
			
			// ret 是一个 json 数组，就是我给你截图那个数据结构，从这里
			//提取出每一个 box，然后绘制在 Canvas 上。
			// 图像使用 data/raw_dcm/IMG000030.dcm
			if(ret==null || ret=="" || ret=='undefined')
			{alert("未检测到结节")}
			else
			{
				for(i=0;i<=ret.length;i++)
				{
					var top = ret[i].x;
	                var left = ret[i].y;
	                var wid = ret[i].w;
					var hig = ret[i].h;
					var prb = ret[i].prob;
					//赋值
					kuang.l[i+1] = left;
					kuang.t[i+1] = top;
					kuang.w[i+1] = wid;
					kuang.h[i+1] = hig;
					kuang.p[i+1] = prb;
					kuang.index[i+1] = i+1;
					console.log(kuang);
					fcreateBlock(left,top,wid,hig,prb);
					
				//	var div = document.getElementById("dicomImage");
				//	var test = document.createElement("span");
				//	test.style.position="absolute";
					//test.style.border="2px solid red";
				//	div.appendChild(test);
	                 //  $(test).width(wid).height(hig);
				//	   $(test).css({'top':top+"px",'left':left+"px"});

				}
				  
				
					  
					   console.log(ret[0].prob);
			}
			
			
        },
        error: function (ret) {
			console.log("服务器检测结果失败！")
            console.log(ret)
        }
    });


});
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext('2d');
	function createBlock(x,y,w,h,p){
		ctx.clearRect(0,0,512,512);
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 2;                 
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.stroke();
		ctx.font = '15px "楷体"';
		ctx.fillStyle = "red";
		if(p!=null)
			{
				ctx.fillText("概率："+p+"%",x+w,y);
			}
		
		}
		function fcreateBlock(x,y,w,h,p){
			
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 2;                 
			ctx.beginPath();
			ctx.rect(x,y,w,h);
			ctx.stroke();
			ctx.font = '15px "楷体"';
			ctx.fillStyle = "red";
			if(p!=null)
			{
				ctx.fillText("概率："+p+"%",x+w,y);
			}
			
			}
	var dk;
	var l;
	//保存所有框的数据
	var kuang= {
		l:Array(),
		t:Array(),
		w:Array(),
		h:Array(),
		p:Array(),
		index:Array()
	 };
/*	 kuang = new Array();
	var kuang = function(l,t,w,h,p,index)   {
		this.l = l;
		this.t = t;
		this.w = w;
		this.h = h;
		this.p = p;
		this.index = index;
}*/

	var canvasWidth = 512;
	var canvasHeight = 512;
	var rectWidth;
	var rectHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var x;//鼠标在canvas上的X坐标
	var y;//鼠标在canvas上的Y坐标
	var dis_x;//鼠标点击位置相对于矩形的位置 
	var dis_y;//鼠标点击位置相对于矩形的位置 
	var s_x;//矩形坐标X
	var s_y;//矩形坐标Y
	var p ;//概率
	var lineWidth=2;
	var isImpact=false;//碰撞标志
	 var isDowm=false;//鼠标按下标志
	 var throttle = function(callback,delay){
	   var last = 0  
	   return function(){  
		 var curr = new Date().getTime();  
		 if (curr - last > delay){  
			 callback.apply(this, arguments)  
			 last = curr   
		  }  
		}  
	 }  
function checkImpact(){
	if(!(x-dis_x<lineWidth||x-dis_x>canvasWidth-rectWidth-lineWidth||y-dis_y<lineWidth||y-dis_y>canvasHeight-rectHeight-lineWidth)){
		return true;
	}
	else{
		return false;
	}
}
//判断是否在框内
function panduan(x,y,e){
	x=e.clientX-canvas.getBoundingClientRect().left;
	y=e.clientY-canvas.getBoundingClientRect().top;
	var o=0;
	
	
   for(i=1;i<=l;i++)
   {
	
	if(kuang.l[i]<x&&x<kuang.l[i]+kuang.w[i]&&y>kuang.t[i]&&y<kuang.t[i]+kuang.h[i])
    {
	  o=1;	return i;
	}
    }
	if(o==1)return 0;
	return 0;
  
}
//判断是否在右下角
function panduan1(x,y,e){
	x=e.clientX-canvas.getBoundingClientRect().left;
	y=e.clientY-canvas.getBoundingClientRect().top;
	var o=0;
	
	
   for(i=1;i<=l;i++)
   {
	
	if(kuang.l[i]+kuang.w[i]-10<x&&kuang.l[i]+kuang.w[i]+10&&y>kuang.t[i]+kuang.h[i]-10&&y<kuang.t[i]+kuang.h[i]+10)
    {
	  o=1;	return i;
	}
    }
	if(o==1)return 0;
	return 0;
  
}
canvas.addEventListener("mousemove", function(e) { 
	x=e.clientX-canvas.getBoundingClientRect().left;
	y=e.clientY-canvas.getBoundingClientRect().top;
	var o=0;
   for(i=1;i<=l;i++)
   {
	
	if(kuang.l[i]<x&&x<kuang.l[i]+kuang.w[i]&&y>kuang.t[i]&&y<kuang.t[i]+kuang.h[i])
    {
		canvas.style.cursor="move";
	  o=1;
	}
	}
	for(i=1;i<=l;i++)
	{
		
	 if(kuang.l[i]+kuang.w[i]-10<x&&x<kuang.l[i]+kuang.w[i]+10&&y>kuang.t[i]+kuang.h[i]-10&&y<kuang.t[i]+kuang.h[i]+10)
	 {

		canvas.style.cursor="se-resize";
		
	  	o=1;
	 }
	 }
	 if(o==0)
	 {
		 canvas.style.cursor="default";
	 }
	

});
var menu = document.getElementById("menu");


canvas.addEventListener("mousedown", function(e) { 

	var  x=e.clientX-canvas.getBoundingClientRect().left;
	 var 	y=e.clientY-canvas.getBoundingClientRect().top;
	menu1 = document.getElementById("menu1");
if(panduan(x,y,e))
{


	menu1.oncontextmenu=canvas.oncontextmenu=function(e){
	
	  
	  
	
			  
	  menu1.style.left = x+"px";
	  menu1.style.top = y+"px";
	  console.log(l);
	  console.log(panduan(x,y,e));
	 
	menu1.style.display = "block";console.log(l);
	
	
	  e.preventDefault();
	}
	menu1.onclick=canvas.onclick=function(){
		if(e.button==2)
{
	    var idx = panduan(x,y,e);
		
		kuang.l[idx] = null;
		kuang.t[idx] = null;
		kuang.w[idx] = null;
		kuang.h[idx] = null;
		kuang.index[idx] = null;
		  console.log(l);
		  ctx.clearRect(0,0,512,512);
		for(i=1;i<=l;i++)
		{
		   
			fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		}
	  menu1.style.display = "none";
	}
   e.button=0;menu1.style.display = "none";
}
}
else{

	menu1.style.display = "none";
menu.oncontextmenu=canvas.oncontextmenu=function(e){
		
	
			
	menu.style.left = x+"px";
	menu.style.top = y+"px";
		console.log(l);
	console.log(panduan(x,y,e));
	if(panduan(x,y,e)==0)
  {menu.style.display = "block";console.log(l);}  
	e.preventDefault();
  }
  menu.onclick=canvas.onclick=function(){
	  if(e.button==2)
{
	  l=l+1;
	  kuang.l[l] = x;
	  kuang.t[l] = y;
	  kuang.w[l] = 20;
	  kuang.h[l] = 20;
	  kuang.index[l] = l+1;
		console.log(l);
		ctx.clearRect(0,0,512,512);
	  for(i=1;i<=l;i++)
	  {
		 
		  fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
	  }
	menu.style.display = "none";
  }
 e.button=0;menu.style.display = "none";
}
}
});
$("canvas").mousedown(function(e){
	

	isDowm=true;
	 x=e.clientX-canvas.getBoundingClientRect().left;
	 y=e.clientY-canvas.getBoundingClientRect().top;
	 
	 if(panduan(x,y,e)&&!panduan1(x,y,e))
	 {  
		canvas.style.cursor="move";
		 var index = panduan(x,y,e);    
		  s_x=kuang.l[index];//矩形坐标X
	      s_y=kuang.t[index];//矩形坐标Y
		  p = kuang.p[index];
		  rectWidth = kuang.w[index];
		  rectHeight = kuang.h[index];    
		  p = kuang.p[index];          
		 dis_x=x-s_x;
		 dis_y=y-s_y;
		 
		 createBlock(s_x,s_y,rectWidth,rectHeight,p); 
		 for(i=1;i<=l;i++)
		 {
			 
			 fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		
			}
		 $("body").mousemove(throttle(function(e){   
			x=e.clientX-canvas.getBoundingClientRect().left;
			y=e.clientY-canvas.getBoundingClientRect().top;
			
			if(checkImpact())
			{                   
				s_x=x-dis_x;
				s_y=y-dis_y;
				kuang.l[index]=s_x;//矩形坐标X
			    kuang.t[index]=s_y;//矩形坐标Y   
			
				
			  createBlock(s_x,s_y,rectWidth,rectHeight,p); 
			  for(i=1;i<=l;i++)
		 {
			
			 fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		 }

			}
		 },17));
		 $("body").mouseup(function(){
			//canvas.style.cursor="default";
			  isDowm=false;
			  createBlock(s_x,s_y,rectWidth,rectHeight,p); 
			  for(i=1;i<=l;i++)
		 {
			
			 fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		 }
			  $(this).unbind("mouseup")
			  $(this).unbind("mousemove")    
		 })
	 }
})

$("canvas").mousedown(function(e){
	isDowm=true;
	 x=e.clientX-canvas.getBoundingClientRect().left;
	 y=e.clientY-canvas.getBoundingClientRect().top;
	  
	 if(panduan1(x,y,e))
	 {  
		canvas.style.cursor="se-resize";
		 var index = panduan(x,y,e);    
		  s_x=kuang.l[index];//矩形坐标X
	      s_y=kuang.t[index];//矩形坐标Y
		  p = kuang.p[index];
		  rectWidth = kuang.w[index];
		  rectHeight = kuang.h[index];    
		  p = kuang.p[index];  5        
		 dis_x=x-s_x;
		 dis_y=y-s_y;
		 
		 createBlock(s_x,s_y,rectWidth,rectHeight,p); 
		 for(i=1;i<=l;i++)
		 {
			 
			 fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		
			}
		 $("body").mousemove(throttle(function(e){   
			x=e.clientX-canvas.getBoundingClientRect().left;
			y=e.clientY-canvas.getBoundingClientRect().top;
			
			if(checkImpact())
			{                   
				  
			
				kuang.w[index]=x-kuang.l[index];
				kuang.h[index]=y-kuang.t[index]; 
				rectWidth = kuang.w[index];
		  rectHeight = kuang.h[index]; 
		   	console.log(x);
				console.log(y);
				console.log(kuang.w[index]);

				console.log(kuang.h[index]);
			  createBlock(s_x,s_y,rectWidth,rectHeight,p); 
			  for(i=1;i<=l;i++)
		 {
			
			 fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		 }
			}
		 },17));
		 $("body").mouseup(function(){
			//canvas.style.cursor="default";
			  isDowm=false;
			  createBlock(s_x,s_y,rectWidth,rectHeight,p); 
			  for(i=1;i<=l;i++)
		 {
			
			 fcreateBlock(kuang.l[i],kuang.t[i],kuang.w[i],kuang.h[i],kuang.p[i]);
		 }
			  $(this).unbind("mouseup")
			  $(this).unbind("mousemove")    
		 })
	 }
})
     
	 