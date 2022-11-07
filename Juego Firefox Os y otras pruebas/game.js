//Crea el objeto canvas
  	var canvas; //= document.getElementById("escenario");
	//Lo pone en dos domensiones
  	var ctx; //= canvas.getContext('2d');
	//Crea el array de la imagen
  	var imgList = new Array();
	//variable para el DIV
	var wrapper = null;
	
	//variable para la imagen de los platanos
	var imgListPuntos = new Array();
	//Variable para los malos
	var imgListWolf = new Array();
	//posicion X lobo
	var loboX = 375;
	//Posicion Y lobo
	var loboY = 162;
	//contador lobo
	var loboCont=0;
	//para comprobar que el lobo no se vuelve a dar la vuelta hasta llegar a un punto
	var loboC=0;
	var spriteIndex = 0;
	var spriteX = 0;
	var spriteY = 20;
	var cont=0;
	var salto=0;
	var contSalt=0;
	//posicion inicial del mono en la cordenada Y
	var posicionY= 162;
	var posicionX= 220;
	var kk=0;
	var corY = 0;
	var direccion=1;
	var mov=0;
	var bloqueX = 100;
	var bloqueY = 20;
	var h=0;
	var totalbananas=0;
	var totalvidas=3;
	var caigo = false;
	var controlA = new Array();
	var malosA = new Array();
	//constantes
	const barranco=0;
	const plataforma=2;
	const platano = 3;
	const platanoarriba=4;
	const platanoabajo=5;
	const cesped = 1;
	var posCaer = 	posicionY;	
	
	for(i=0; i<50; i++)
	{
		//controlA[i]= Math.ceil((Math.random()*3)-1); // cesped	
		controlA[i] = cesped; //cesped
	}
	
	//Agregamos los barrancos
	controlA[4] = controlA[11] = controlA[17] = controlA[18] =controlA[24] = controlA[25]=controlA[34] = controlA[40] = barranco;
	
	//Agregamos las plataformas
	controlA[6]=controlA[8]=controlA[28]=controlA[30]=plataforma;
	
	//Agregamos los platanos
	controlA[12]=controlA[13]=controlA[14]=controlA[20]=controlA[22]=controlA[26]=controlA[32]=controlA[48]=controlA[49]=platano;
	
	//Agregamos los platanos arriba de las plataformas
	controlA[2]=controlA[15]=controlA[29]=controlA[31]=controlA[36]=controlA[37]=platanoarriba;

	//Agregamos los platanos abajo de las plataformas
	controlA[7]=controlA[6]=controlA[21]=controlA[30]=controlA[43]=controlA[44]=controlA[45]=controlA[46]=controlA[47]=platanoabajo;
	
	
	
	
//funcion inical para crear el objeto canvas dentro del div (wrapper))

function iniciajuego() {

	canvas = document.getElementById("escenario");
	//Lo pone en dos domensiones
  	ctx = canvas.getContext('2d');
	//le damos tamaño al elemento canvas
	//canvas.width = 460;
 	//canvas.height = 275;
	//a la variable wrapper le pasamos el objeto DIV por su ID("wrapper")
	//wrapper = document.getElementById("wrapper");
	//crea un hijo que cuelga del DIV(wrapper) llamado canvas con el tamaño asignado anteriormente
  	//wrapper.appendChild(canvas);
	//introduce mediante un for las imagenes dentro de un array desde el 0 al 6, asignandole la ruta de la imagen
	/*var botonera=document.createElement("div");
    $(botonera).attr("id","botonera");
    $("#wrapper").append(botonera);
    $(botonera).css({"width":"460px", "height":"275px" , "position": "fixed", "top":200 + "px", "display":"block"});
      
  
  
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
    $(botonsalto).css({"width":"80px","height":"80px","float":"right","background-image":"url(img/salto.png)"}); */
  for (var i=0; i<8; ++i)
  {
	//se supone que le indicamos al array que le vamos a pasar una ruta de una imagen
    imgList.push(new Image());
	
	//le pasamos la ruta de la imagen al array, 6 rutas en total del 0 al 6
    imgList[i].src = "img/Frame" + i + ".png";
  }

	//crea el objeto IMG dentro de la variable img
  var img = document.createElement('IMG');
  	//le pasamos el atributo src (ruta de la imagen primera) al objeto img, para cargarla en el onload
  img.src=  imgList[0].src;
  	//le damos una nombre de clase al objeto img
  img.className = 'precarga';
  	//creamos un atributo elemento que contiene un objeto (la primera imagen)
  img.elemento = imgList[0];
  
  //Creamos un hijo img que contiene la ruta de la imagen, nombre de clase y elemento, dentro del body

  document.getElementsByTagName('BODY')[0].appendChild(img);


  // CARGAMOS LOS LOBOS IGUAL QUE LAS IMAGENES DEL MONO (ANTERIOR)
    for (var i=0; i<10; ++i)
  {
	//se supone que le indicamos al array que le vamos a pasar una ruta de una imagen
    imgListWolf.push(new Image());
	
	//le pasamos la ruta de la imagen al array, 6 rutas en total del 0 al 6
    imgListWolf[i].src = "img/enemigos/wolf" + i + ".png";
  }
  
  var imgw= document.createElement('IMG');
  imgw.src=imgListWolf[0].src;
  imgw.className='precarga';
  imgw.elemento=imgListWolf[0];
  document.getElementsByTagName('BODY')[0].appendChild(imgw);
   // fIN CARGA DE lobo
  
  // CARGAMOS LOS PLATANOS IGUAL QUE LAS IMAGENES DEL MONO (ANTERIOR)
  imgListPuntos.push(new Image());
  imgListPuntos[0].src="img/platanos.png";
  var imgp= document.createElement('IMG');
  imgp.src=imgListPuntos[0].src;
  imgp.className='precarga';
  imgp.elemento=imgListPuntos[0];
  document.getElementsByTagName('BODY')[0].appendChild(imgp);
   // fIN CARGA DE PLATANOS
   

   
	//funcion que carga al arrancar el index
  img.onload = function(){

   pintar();
   
   ctx.drawImage(imgList[spriteIndex],posicionX,posicionY,imgList[spriteIndex].width,imgList[spriteIndex].height);
   
	//Borra el hijo (img) del padre (Body), quita la barra roja
    this.parentNode.removeChild(this);
  }

	//Funcion para coger la tecla pulsada

    var a = $('#botondcha');
	var b = $('#botonizda');
	var c = $('#botonsalto');
	
	
	a.on('touchstart', function()
				{
				movimiento (1,a);
				});
	b.on('touchstart', function()
				{
				movimiento2 (1,b);
				});
		
	c.on('touchstart', function() 
				{ 
				animateFrame(0);
				});

}


var q;
function movimiento (e,f)
	{
		if (e == 1)
			{
			
			animateFrame(1);
			f.on('touchend', function() 
					{
					clearTimeout(q);
					});
				q = setTimeout (function () {movimiento(e,f)},100);
			}
	}

function movimiento2 (g,h)
	{
		if (g == 1)
			{
			
			animateFrame(-1);
			h.on('touchend', function() 
					{
					clearTimeout(r);
					});
				r = setTimeout (function () {movimiento2(g,h)},100);
			}
	}	
	
/*function loboMov()
	{
		r = setTimeout(loboMov,5);
		moverse();
	}	*/