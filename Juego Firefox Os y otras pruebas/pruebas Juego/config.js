var xIni=0,yIni=0;
var vibra=true;


function cargaopciones(){

	var volver = document.createElement("div");
	$(volver).attr("id","volverconfig");
	$(volver).css({"position":"fixed","height":"70px","width":"70px","margin-top":"230px","margin-left":"385px"});
	$("#opciones").append(volver);
	$("#volverconfig").on('click',function (){
		return vuelta("opciones");
	});


	//Musica

	
	var volumen = document.createElement("div");
	$(volumen).attr("id","volumen");
	$(volumen).css({"position":"fixed","height":"20px","width":"230px","margin-top":"95px","margin-left":"175px"});
	$("#opciones").append(volumen);

	var volbarra= document.createElement("hr");
	$("#volumen").append(volbarra);

	var volbtn = document.createElement("div");
	$(volbtn).attr("id","volbtn");
	$(volbtn).css({"position":"fixed", "height":"20px","width":"40px","margin-top":"-20px","margin-left":"200px", "background-image":"url(img/boton1.png)", "border-radius":"10px"});
	$("#volumen").append(volbtn);
	//10pts de volumen. 0 MUTE - 1 100%

	$("#volbtn").on("touchstart", function(e){
       
      xIni = e.targetTouches[0].pageX;
      yIni = e.targetTouches[0].pageY;
	  
    });

	$("#volbtn").on('touchmove',function(e){
		posbot = parseInt(parseInt($("#volbtn").css("margin-left"))/20);
		var volsound=posbot/10;
		if (e.targetTouches[0].pageX > xIni+20 && posbot<10){
			xIni=xIni+20;
			posbot++;
			volsound+=0.1;
			$("#volbtn").css({"margin-left":(posbot*20)+"px"});
		}
      	if (e.targetTouches[0].pageX < xIni-20 && posbot>0){
      		xIni=xIni-20;
      		posbot--;
      		volsound-=0.1;
      		$("#volbtn").css({"margin-left":(posbot*20)+"px"});
      	}
  		document.getElementById('sound').volume=volsound;
	});




	//efectos

	
	var volbg = document.createElement("div");
	$(volbg).attr("id","volbg");
	$(volbg).css({"position":"fixed","height":"20px","width":"230px","margin-top":"150px","margin-left":"175px"});
	$("#opciones").append(volbg);

	var volbarrabg= document.createElement("hr");
	$("#volbg").append(volbarrabg);

	var volbgbtn = document.createElement("div");
	$(volbgbtn).attr("id","volbgbtn");
	$(volbgbtn).css({"position":"fixed", "height":"20px","width":"40px","margin-top":"-20px","margin-left":"200px", "background-image":"url(img/boton1.png)", "border-radius":"10px"});
	$("#volbg").append(volbgbtn);

	//10pts de volumen. 0 MUTE - 1 100%
	$("#volbgbtn").on('touchstart',function(e){		
		xIni = e.targetTouches[0].pageX;
      	yIni = e.targetTouches[0].pageY;	
      	
	});

	$("#volbgbtn").on('touchmove',function(e){

		posbot = parseInt(parseInt($("#volbgbtn").css("margin-left"))/20);
		var volfx=posbot/10;
		if (e.targetTouches[0].pageX > xIni+20 && posbot<10){
			xIni=xIni+20;
			posbot++;
			volfx+=0.1;
			$("#volbgbtn").css({"margin-left":(posbot*20)+"px"});
		}
      	if (e.targetTouches[0].pageX < xIni-20 && posbot>0){
      		xIni=xIni-20;
      		posbot--;
      		$("#volbgbtn").css({"margin-left":(posbot*20)+"px"});
      		volfx-=0.1;
      	}
      	document.getElementById('fx1').volume=volfx;
  		document.getElementById('fx2').volume=volfx;
  		document.getElementById('fx3').volume=volfx;
      	
	});






	//Control de vibración
	localStorage.vibracion = (localStorage.vibracion || "");
	if(localStorage.vibracion!=""){
		vibra=localStorage.vibracion;
	}else{
		localStorage.vibracion = vibra;
	}

	var vib = document.createElement("div");
	$(vib).attr("id","vib");
	$(vib).css({"background-image":"url(img/vib"+ vibra + ".png)","background-size":"48px 48px","position":"fixed","height":"48px","width":"48px","margin-top":"184px","margin-left":"189px","border-radius":"25px","box-shadow": "5px 5px 5px orange"});
	$("#opciones").append(vib);
	$(vib).on("tap",function activavib(){
		if(vibra==true){
			vibra=false;
		}else{
			vibra=true;
			window.navigator.vibrate([100]);
		}
		localStorage.vibracion=vibra;
		$("#vib").css({"background-image":"url(img/vib"+ vibra + ".png)"});
	});



	//botones de Idioma
	var lan = document.createElement("div");
	$(lan).attr("id","lan");
	$(lan).css({"background-image":"url(img/"+ idioma + ".png)","background-size":"48px 48px","position":"fixed","height":"48px","width":"48px","margin-top":"236px","margin-left":"189px","border-radius":"25px","box-shadow": "5px 5px 5px orange"});
	$("#opciones").append(lan);

	$(lan).on("tap",function cambiaidioma(){
		if(idioma=="esp"){
			idioma="eng";
		}else{
			idioma="esp";
		}
		$("#menu").css({"background-image":"url(img/menu"+ cont + "-"+idioma+".png)"});
		$("#puntuaciones").css({"background-image":"url(img/pmaximas-"+idioma+".png)"});
		$("#opciones").css({"background-image":"url(img/pconfiguracion2-"+idioma+".png)"});
		$("#lan").css({"background-image":"url(img/"+ idioma + ".png)"});
	});

	

};

