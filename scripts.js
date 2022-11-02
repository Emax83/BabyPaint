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
    $("#btnColors").click(function(){
        var input = document.getElementById('inputColor');
        input.addEventListener("change",function(){
            //currentColor = this.value;
            //console.log(currentColor);
            CambiaColore(this.value);
        });
        input.click();
    });

    $(".btn-ink").click(function(){
        $(".btn-ink").removeClass("selected");
        $(this).addClass("selected");
        CambiaColore($(this).css("background-color"));
    });

    canvas.addEventListener("mouseout",function(e){
        mouseDown=false;
    });

    canvas.addEventListener("mouseup",function(e){
        mouseDown=false;
    });

    canvas.addEventListener("touchend",function(e){
        mouseDown=false;
    });

    canvas.addEventListener("touchstart",function(e){
        startPoint.x = e.changedTouches[0].clientX;
        startPoint.y = e.changedTouches[0].clientY;
        mouseDown=true;
        Disegna(e);
        //console.log(startPoint);
    });

    canvas.addEventListener("mousedown",function(e){
        startPoint.x = e.clientX - canvas.getBoundingClientRect().left;
        startPoint.y = e.clientY - canvas.getBoundingClientRect().top;
        mouseDown=true;
        Disegna(e);
        //console.log(startPoint);
    });

    canvas.addEventListener("mousemove",function(e){
        Disegna(e);
    });

    canvas.addEventListener("touchmove",function(e){
        Disegna(e);
    });
   

});


var currentColor = "#000";
var currentSize = 20;
var canvas = null;
var context = null;
var startPoint={x:0,y:0}
var mouseDown = false;

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
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 260;
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
    $("#btnColors").css("background-color",currentColor);
    $("#inputColor").val(currentColor);
}


//https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
function Disegna(e){
    if((e.type =='touchmove' && e.changedTouches.length > 0) || (e.type == "mousemove" && e.buttons > 0))
    {
        var endPoint = {
            x:e.clientX - canvas.getBoundingClientRect().left, 
            y: e.clientY - canvas.getBoundingClientRect().top
        }
        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = currentSize;
        context.strokeStyle = currentColor;
        context.moveTo(startPoint.x,startPoint.y);
        context.lineTo(endPoint.x,endPoint.y);
        context.stroke();
        context.closePath();
        startPoint = endPoint;
    }
}
