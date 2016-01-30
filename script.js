
//CANVAS 

function resize_canvas(){
            canvas = document.getElementById("myCanvas");
            if (canvas.width  < window.innerWidth)
            {
                canvas.width  = window.innerWidth;
            }

            if (canvas.height < window.innerHeight)
            {
                canvas.height = window.innerHeight;
            }
        }









/*var canvas;
var canvasWidth;
var ctx;

	canvas = getElementById('myCanvas');
	if(canvas.getContext){
		ctx = canvas.getContext("2d");

		window.addEventListener('resize', resizeCanvas, false);
		window.addEventListener('orientationchange', resizeCanvas, false);
		resizeCanvas()
	}
}

function resizeCanvas(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

//Copy canvas as image data
var imgData = ctx.getImageData(0,0, canvas.width, canvas.height);

//Resize original canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//Copy back to resized canvas
//ctx.putImageData(imgData, 0, 0);
/*var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};



      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0,0,150,75);
*/