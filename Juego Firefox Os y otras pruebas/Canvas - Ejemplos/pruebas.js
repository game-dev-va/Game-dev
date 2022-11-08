window.addEventListener('load',init,false);
var canvas=null,ctx=null;
var x=300,y=230;
var x1=0, y1=250;
var lastPress=null;
var pause=true;
var dir=5;
var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_RIGHT=39;



function init(){
    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');
    run();
    repaint();
}

function run(){
    setTimeout(run,50);
    act();
}

function repaint(){
    requestAnimationFrame(repaint);
    paint(ctx);
}


function act(){

    if(!pause){
        // Change Direction

        if(lastPress==KEY_RIGHT)
            dir=0;

        if(lastPress==KEY_LEFT)
            dir=1;

        // Move Rect

        if(dir==0)
            x+=1;
        if(dir==1)
            x-=1;

        // Out Screen
        if(x>350)
            x=0;
        if(y>y1)
            y=0;
        if(x<0)
            x=canvas.width;
        if(y<0)
            y=canvas.height;
    }
    // Pause/Unpause
    if(lastPress==KEY_ENTER){
        pause=!pause;
        lastPress=null;
    }
}



function paint(ctx){
	ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff';
    ctx.fillRect(x,y,20,20);
	ctx.fillStyle='#0f0';
    ctx.fillRect(x1,y1,350,70);
	
	if(pause){
        ctx.textAlign='center';
        ctx.fillText('PAUSE',150,75);
        ctx.textAlign='left';
    }
}



document.addEventListener('keydown',function(evt){
    lastPress=evt.keyCode;
},false);

window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        function(callback){window.setTimeout(callback,17);};
})();