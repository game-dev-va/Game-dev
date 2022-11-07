//Variablas pra el contro de rendimiento
var pixeles=0;
var idioma = "esp";
var musica= new Array(3);

localStorage.continua = (localStorage.continua || "");

$(function empieza (){
	loadapp();
});

function loadapp(){
	var x; 
	var y;

	//reiniciamos variabels
	totalbananas =0;
	totalvidas=3;
	caigo=false;
	monoarriba=false;
	cambioposicion=false;

	document.getElementById("sound").play();

	y=window.screen.height; //Ancho de la pantalla
	x=window.screen.width;	//Alto de la pantalla

	

	//window.screen.mozLockOrientation("landscape-primary"); // bloquear la orientacion de la pantalla en apaisado

	//comprobamos el rendimiento de procesamiento gráfico
	rendimiento();
	$("#lienzo").remove();
	carga(5);

	
	if(x>480){
		var margenx=(x-480)/2;
	}else{
		var margenx=0;
	}
	if(y>320 && margenx!=0){
		var margeny=20;
		var botontop=260;
	}else{
		var margeny=0;
		var botontop=240;
	}

	



	$("#contenedor").css({"top":margeny + "px","left":margenx + "px"});

	//generamos los contenedores del menu, del juego y de las opciones;
	var menu=document.createElement("div");
	$(menu).attr("id","menu");
	$("#contenedor").append(menu);
	$(menu).css({"width":"480px", "height":"320px" , "position": "fixed", "display":"none", "background-image":"url(img/menu-"+idioma+".png)","top":margeny + "px","left":margenx + "px"});
	cargamenu();
	carga(10);

	var puntuaciones = document.createElement("div");
	$(puntuaciones).attr("id","puntuaciones");
	$("#contenedor").append(puntuaciones);
	$(puntuaciones).css({"width":"480px", "height":"320px" , "position": "fixed",  "background-image":"url(img/pmaximas-"+idioma+".png)", "display":"none"});
	cargapuntu();
	carga(20);


	var opciones = document.createElement("div");
	$(opciones).attr("id","opciones");
	$("#contenedor").append(opciones);
	$(opciones).css({"width":"480px", "height":"320px" , "position": "fixed", "background-image":"url(img/pconfiguracion2-"+idioma+".png)", "display":"none"});
	cargaopciones();
	carga(30);

	

	var game = document.createElement("div");
	$(game).attr("id","game");
	$("#contenedor").append(game);
	$(game).css({"width":"480px", "height":"320px" , "position": "fixed", "display":"none"});



	var wrapper=document.createElement("div");
    $(wrapper).attr("id","wrapper");
    $("#game").append(wrapper);
    $(wrapper).css({"width":"480px", "background-image":"url(img/fondojuego.jpg)", "background-position":"0px", "height":"320px" , "position": "fixed"});

    var canvas=document.createElement("canvas");
    $(canvas).attr("id","escenario");
    canvas.width = 480;
 	canvas.height = 320;
    $("#wrapper").append(canvas);
   	
    carga(40);




	var botonera=document.createElement("div");
    $(botonera).attr("id","botonera");
    $("#wrapper").append(botonera);
    $(botonera).css({"width":"480px", "height":"80px" , "position": "fixed", "top":botontop + "px", "display":"block"});
    
    carga(50); 
  
  
    var botonizda, botondcha, botonsalto;
    botonizda=document.createElement("div");
    $(botonizda).attr("id","botonizda");
    $("#botonera").append(botonizda);
    $(botonizda).css({"width":"80px","height":"80px","float":"left","background-image":"url(img/izquierda.png)"});
  
    botondcha=document.createElement("div");
    $(botondcha).attr("id","botondcha");
    $("#botonera").append(botondcha);
    $(botondcha).css({"width":"80px","height":"80px","float":"left","background-image":"url(img/derecha.png)"});
  
    botonsalto=document.createElement("div");
    $(botonsalto).attr("id","botonsalto");
    $("#botonera").append(botonsalto);
    $(botonsalto).css({"width":"80px","height":"80px","float":"right","background-image":"url(img/salto.png)"});

    carga(60);

    var totban = document.createElement("div");
    $(totban).attr("id","totban");
    $("#wrapper").append(totban);
    $(totban).css({"width":"100px","height":"40px","background-image":"url(img/platanos.png)","background-position":"left","background-repeat":"no-repeat","text-align":"right", "font-size":"40px","color":"white", "top": (margeny +5) + "px","position":"fixed"});
    $(totban).html("0");

    var totvid = document.createElement("div");
    $(totvid).attr("id","totvid");
    $("#wrapper").append(totvid);
    $(totvid).css({"width":"69px","height":"20px","background-image":"url(img/vidas.png)","background-position":"left","background-repeat":"repeat-x","text-align":"right", "font-size":"40px","color":"white", "top": (margeny +5) + "px", "left": (margenx + 350) + "px", "position":"fixed"});
  	carga(70);

  	cargacrono(margenx , margeny);
  	carga(80);


  	//pantalla y boton de pausa
  	cargamenupausa(margenx , margeny);
  	carga(90);

	//carga la música
	for(i=0;i<3;i++){
		musica[i]= "sounds/music/music"+(i+1)+".ogg";
	}
	document.getElementById("music").src=musica[Math.floor(Math.random()*3)];

	//carga pájaro
	pajaro(margenx , margeny);


	carga(100);
	


};

function rendimiento(){
	var lienzo = devolverLienzo("lienzo");
	var t= new Date();
	var t2=t;

			if(lienzo){
				while(t2-t<100){
					lienzo.strokeStyle = "rgb(255,0,0)";
					lienzo.beginPath();
					lienzo.moveTo(0,0);
					lienzo.lineTo(0,1);
					lienzo.stroke();
					pixeles++;

					lienzo.strokeStyle = "rgb(255,0,255)";
					lienzo.beginPath();
					lienzo.moveTo(0,1);
					lienzo.lineTo(0,0);
					lienzo.stroke();
					pixeles++;

					t2=new Date();
				}
			}
}

function devolverLienzo(source){
		var canvas=document.getElementById(source);
		if(canvas && canvas.getContext){
			var lienzo = canvas.getContext("2d");
			return lienzo;
		}else{
			return false;
		}
};

function carga(source){
	$("#barracarga").attr("value",source);
	if(source==100){
		$("#menu").css({"display":"block"});
		$("#contelogo").css({"display":"none"});
		
	}
}