$(document).ready(function(){
    console.info("Ready");

    canvas = document.getElementById('canvasPaint');
    context = canvas.getContext('2d');

    ResizeCanvas();
    ChangeSize(0);

    window.addEventListener("resize",function(){
        ResizeCanvas();
    });

    $("#btnNuovo").click(function(){
        Nuovo();
    });
    $("#btnApri").click(function(){
        document.getElementById('fileUpload').click();
    });
    $("#fileUpload").on("change",function(){
        Apri(this);
    });

    $("#btnSalva").click(function(){
        Salva();
    });

    $("#btnMeno").click(function(){
        ChangeSize(-10);
    });
    $("#btnPiu").click(function(){
        ChangeSize(+10);
    });

    $("#inputColor").on("change",function(){
		$("#btnColors").css("background-color",this.value);
        CambiaColore(this.value);
    });

    $("#btnColors").click(function(){
        $(".btn-ink").removeClass("selected");
		$(this).addClass("selected");
        var input = document.getElementById('inputColor');
        input.click();
    });

    $(".btn-ink").click(function(){
        $(".btn-ink").removeClass("selected");
        $(this).addClass("selected");
        CambiaColore($(this).css("background-color"));
    });
	
	$("#btnExpand").click(function(){
		
		if(isFullScreen==true){
			closeFullscreen();
		}
		else{
			openFullscreen();
		}
	});

    canvas.addEventListener("mouseout",function(e){
        mouseDown=false;
    });

    canvas.addEventListener("mouseup",function(e){
        mouseDown=false;
    });

    canvas.addEventListener("mousedown",function(e){
		e.preventDefault();
        var point = {x:0,y:0};
        point.x = e.clientX - canvas.getBoundingClientRect().left;
        point.y = e.clientY - canvas.getBoundingClientRect().top;
        startPoint=[];
        startPoint.push(point);
        mouseDown=true;
        Disegna(e);
        //console.log(startPoint);
    });

    canvas.addEventListener("mousemove",function(e){
		e.preventDefault();
        Disegna(e);
    });
	
	
	canvas.addEventListener("touchstart",function(e){
        e.preventDefault();
		startPoint=[];
        for(i=0;i<e.targetTouches.length;i++){
            var point = {x:0,y:0};
            point.x = e.targetTouches[i].clientX;
            point.y = e.targetTouches[i].clientY - $("header").height();
            startPoint.push(point);
        }
        mouseDown=true;
        Disegna(e);
    });

    canvas.addEventListener("touchmove",function(e){
		e.preventDefault();
        Disegna(e);
    });
	    
	canvas.addEventListener("touchend",function(e){
        mouseDown=false;
    });
   

});


var currentColor = "#000000";
var currentSize = 20;
var canvas = null;
var context = null;
var startPoint = []
var endPoint = [];
var mouseDown = false;
var isFullScreen = false;

function ChangeSize(value){
    var min=10;
    var max=100;
    if( (currentSize+value)>=min && (currentSize+value) <=max){
        currentSize = currentSize+value;
        $("#lblSize").text(currentSize);
        currentSize = currentSize;
    }
}

function ResizeCanvas(){
	var h = $("header").height() + $("footer").height();
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 4 - h;
	canvas.style.top = $("header").height() + "px";
}

function Apri(inputUpload){
    const file = inputUpload.files[0];
    inputUpload.files = null;
    inputUpload.value = null;
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function (e)
    {
        var x=0;
        var y=0;
        var w = 0;
        var h = 0;
        var ratio = 1; 
        if(img.width > canvas.clientWidth){
            ratio = canvas.clientWidth / img.width;
            w = canvas.clientWidth;
            h = img.height * ratio;
        }
        if(img.height > canvas.clientHeight){
            ratio = canvas.clientHeight / img.height;
            h = canvas.clientHeight;
            w = img.width * ratio;
            x = (canvas.clientWidth/2-w/2);
        }
        context.drawImage(img, x,y, w, h);
    }
}

function Salva(){
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    var a = document.createElement("a");
    a.href=image;
    a.download = "Image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function Nuovo(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function CambiaColore(color){
    currentColor = color;
    //$("#btnColors").css("background-color",currentColor);
    //$("#inputColor").val(currentColor);
	//console.log($("#btnColors").css("background-color"));
}


//https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
function Disegna(e){
    if(mouseDown == true)
    {
        e.preventDefault();
        console.log(e);
        var i=0;
        endPoint = [];
        if(e.targetTouches){
            for(i=0;i<e.targetTouches.length;i++){
                var point = {
                    x: e.targetTouches[i].offsetX ?? e.targetTouches[i].clientX,
                    y: e.targetTouches[i].offsetY ?? (e.targetTouches[i].clientY - $("header").height())
                }
                endPoint.push(point);
            }
        }
        else{
            var point = {
                x: e.offsetX ?? e.clientX,
                y: e.offsetY ?? (e.clientY - $("header").height())
            }
            endPoint.push(point);
        }
        
        console.log(endPoint);

        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = currentSize;
        context.strokeStyle = currentColor;
        
        for(i=0;i<endPoint.length;i++){
            context.moveTo(startPoint[i].x,startPoint[i].y);
            context.lineTo(endPoint[i].x,endPoint[i].y);
        }

        context.stroke();
        context.closePath();
        startPoint = endPoint;
    }
}




/* View in fullscreen */
function openFullscreen() {
	
	var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  isFullScreen = true;
}

/* Close fullscreen */
function closeFullscreen() {
	var elem = document.documentElement;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
  isFullScreen = false;
}
