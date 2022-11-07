function cargamenu (){
	localStorage.guarda = (localStorage.guarda || "");

	if (localStorage.guarda != ""){
		$("#menu").css({"background-image":"url(img/menu"+cont+ "-"+idioma+".png)"})
		var guarda=document.createElement("div");
		$(guarda).attr("id","guarda");
		$(guarda).css({"position":"fixed","height":"100px","width":"100px","margin-top":"25px","margin-left":"100px"});
		$("#menu").append(guarda);
		//$(guarda).on("tap",continua());
	}

	var juego = document.createElement("div");
	$(juego).attr("id","juego");
	$(juego).css({"position":"fixed","height":"120px","width":"100px","margin-top":"196px","margin-left":"90px"});
	$("#menu").append(juego);
	$(juego).on('click',function initgame(){
		document.getElementById("sound").pause();
		setTimeout("document.getElementById('music').play()",500);
		$("#game").css({"display":"block"});
		$("#menu").css({"display":"none"});
		iniciajuego();
		iniciacrono();
	});
	




	var config = document.createElement("div");
	$(config).attr("id","config");
	$(config).css({"position":"fixed","height":"70px","width":"80px","margin-top":"130px","margin-left":"10px"});
	$("#menu").append(config);
	$(config).on('click',function menuconfig(){
		$("#opciones").css({"display":"block"});
		$("#menu").css({"display":"none"});
		
	});


	



	var pmax = document.createElement("div");
	$(pmax).attr("id","pmax");
	$(pmax).css({"position":"fixed","height":"120px","width":"120px","margin-top":"90px","margin-left":"340px"});
	$("#menu").append(pmax);
	
	$("#pmax").on("click",function punmax(){
		actualizapuntu();
		$("#puntuaciones").css({"display":"block"});
		$("#menu").css({"display":"none"});
		
	});

	
};



function vuelta(source){
	$("#menu").css({"display":"block"});
	$("#"+ source).css({"display":"none"});
	
	return null;
};