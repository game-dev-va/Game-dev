var verpajaro = false;
var bird = new Array(7);
var tiempopajaro;
var pospajaro=0;
var margeny2 =0;
var margenx2 =0;
var framepajaro=0;
var tiempoframe;


function pajaro(margenx,margeny){
	pospajaro=0;
	framepajaro=0;
	for(i=0;i<7;i++){
		bird[i]= "img/bird/" +i + ".png";
	}
	contepajaro=document.createElement("div");
	$(contepajaro).attr("id","contepajaro");
	$(contepajaro).css({"position":"fixed", "width":"35px","height":"40px","left": (margenx +445)+ "px","top":(margeny+50)+"px", "z-index":"100"});
	$("#contenedor").append(contepajaro);
	margeny2 = margeny;
	margenx2 = margenx;

	tiempopajaro = setInterval("vuelapajaro()",1000);

}

function vuelapajaro(){


	if(verpajaro==false){
		pospajaro=445;
		muestra=Math.floor(Math.random()*10); //aleatorio para no mostrar el pajaro con un patro definido. Posibilidad de que salga, 1 vez cada 10 segundos.
		if(muestra==0){
			verpajaro=true;
		}
			
	}else{
		clearInterval(tiempopajaro);
		var frame=0;
		tiempoframe = setInterval(cambiapajaro,200);
	}
};

function cambiapajaro(i){


	$("#contepajaro").css({"background-image": "url(" + bird[framepajaro] + ")", "left":(margenx2+pospajaro)+"px"});
	pospajaro -= 5;
	framepajaro +=1;
	if(framepajaro>6){
		framepajaro=0;
	}

	if(pospajaro%100 == 0){
		document.getElementById("fx3").play();
	}
	if(pospajaro <=0){
		$("#contepajaro").css({"background-image": ""});
		clearInterval(tiempoframe);
		tiempopajaro = setInterval("vuelapajaro()",1000);
		verpajaro = false;
		pospajaro = 445;
	}
};

function borrapajaro(){
	clearInterval(tiempoframe);
	clearInterval(tiempopajaro);

	$("#contepajaro").remove();
}


