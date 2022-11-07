var puntuaciones = new Array();

function cargapuntu(){
	var volver = document.createElement("div");
	$(volver).attr("id","volverpuntu");
	$(volver).css({"position":"fixed","height":"70px","width":"70px","margin-top":"230px","margin-left":"385px"});
	$("#puntuaciones").append(volver);
	$("#volverpuntu").on('click',function (){
		return vuelta("puntuaciones");
	});

	var puntu=document.createElement("div");
	$(puntu).attr("id","puntu");
	$(puntu).css({"position":"fixed","height":"120px","width":"400px","margin-top":"90px","margin-left":"40px","font-size":"18px"});
	$("#puntuaciones").append(puntu);


	localStorage.puntuaciones = (localStorage.puntuaciones || "");
	if(localStorage.puntuaciones != ""){
		var listapuntu;
		puntuaciones = JSON.parse(localStorage.puntuaciones);

		
	}else{
		puntuaciones[0]=" -";
		puntuaciones[1]="0";
		puntuaciones[2]=" -";
		puntuaciones[3]="0";
		puntuaciones[4]=" -";
		puntuaciones[5]="0";
		localStorage.puntuaciones = JSON.stringify(puntuaciones);
	}

	actualizapuntu();

	
	
	
	//JSON.stringify() - JSON.parse()	
};

function actualizapuntu(){
	//actualiza las puntuaciones y las escribe en la lista
	
	if(document.getElementById("listapuntu")){
		$("#listapuntu").remove();
	}


	//ordenamos las puntuaciones
	var aux, auxnom;
	for(i=0;i<puntuaciones.length;i=i+2){
		for(j=puntuaciones.length-1;j>0;j=j-2){
			if(puntuaciones[j]>puntuaciones[j-2]){

				//ordenamos las puntuciones
				aux=puntuaciones[j];
				puntuaciones[j]=puntuaciones[j-2];
				puntuaciones[j-2]=aux;
				//ordenamos los nombres
				auxnom=puntuaciones[j-1];
				puntuaciones[j-1]=puntuaciones[j-3];
				puntuaciones[j-3]=auxnom;
			}
		}
	}

	//creamos la lista
	var listapuntu=document.createElement("ol");
		$(listapuntu).attr("id","listapuntu");
		$("#puntu").append(listapuntu);
		for(i=0;i<puntuaciones.length;i=i+2){ //Los elementos los guarda todos seguidos. Primer elemento Nombre del Jugador, siguiente la puntuacion;
			var puntu=document.createElement("li");
			$(puntu).attr("id","puntu" + (i/2));
			if(i==0){
				$(puntu).css({"font-size":"40px","color":"orange"});
			}
			$("#listapuntu").append(puntu);
			$("#puntu"+ (i/2)).html(puntuaciones[i] + " - " + puntuaciones[i+1]);
		}
	localStorage.puntuaciones = JSON.stringify(puntuaciones);
};

function compruebapuntu(resultado){

	var supera=0; //control de si supera puntuaciones y cuantas
	for(i=puntuaciones.length-1;i>2;i=i-2){
		if(puntuaciones[i]<resultado && i==puntuaciones.length-1){
			puntuaciones[i]=resultado;//sustituimos la puntuacion
			supera+=2;
		}else if(puntuaciones[i]<resultado){
			puntuaciones[i+2]=puntuaciones[i];//rotamos la puntuacion un puesto abajo
			puntuaciones[i-1]=puntuaciones[i+1];//rotamos el nombre del jugador
			puntuaciones[i]=resultado;
			supera+=2;
		}else{
			break;
		}
	}

	if(supera>0){
		puntuaciones[7-supera]=prompt("Enhorabuena, has quedado " + (4-(supera/2)) +". Introduce tu nombre:","usuario");
	}
	localStorage.puntuaciones = JSON.stringify(puntuaciones);
	borrapajaro();
	$("#contenedor").empty();
	document.getElementById("music").pause();
	loadapp();
};
