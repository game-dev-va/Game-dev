
	function enviarPeticionComentarios(url, parametros, capaDestinoId, cargando, tracking) {
		enviarPeticionComentarios(url, parametros, capaDestinoId, cargando, tracking, null);
	}

	function enviarPeticionComentarios(url, parametros, capaDestinoId, cargando, tracking, funcionFinalizacion) {
		var XMLHttpRequestObject = false;
		if (window.XMLHttpRequest) {
			XMLHttpRequestObject = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			/*try {
				XMLHttpRequestObject = new ActiveXObject("MSXML2.XMLHTTP");
			} catch (e) {
				try {
					XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
				}
			}*/
			XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
		}
		if(XMLHttpRequestObject) {
			XMLHttpRequestObject.open("POST", url, true);
			XMLHttpRequestObject.onreadystatechange = function() {
				if (XMLHttpRequestObject.readyState == 4 &&	XMLHttpRequestObject.status == 200) {
					var documento = XMLHttpRequestObject.responseText;
					var capaDestino = document.getElementById(capaDestinoId);
					capaDestino.innerHTML = documento;
					var x = capaDestino.getElementsByTagName("script");
					for(var i=0; i<x.length; i++) {
						eval(x[i].text);
					}
					if(funcionFinalizacion!=null) {
						funcionFinalizacion();
					}
				}
			};
			XMLHttpRequestObject.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			XMLHttpRequestObject.send(parametros);
			
			if(cargando) {
				document.getElementById(capaDestinoId).innerHTML='<img src="http://estaticos.elmundo.es/elmundo/iconos/v3.0/activity_indicator.gif" alt="Cargando"/> Cargando...';
			}
			
			if(tracking) {
				try {
					_nnEventTrack(document.location);
				} catch (e) {
				}
			}
		}
	} 

	function encodeValue(val) {
		var encodedVal;
		if (!encodeURIComponent) {
			encodedVal = escape(val);
			/* fix the omissions */
			encodedVal = encodedVal.replace(/@/g, '%40');
			encodedVal = encodedVal.replace(/\//g, '%2F');
			encodedVal = encodedVal.replace(/\+/g, '%2B');
		} else {
			encodedVal = encodeURIComponent(val);
			/* fix the omissions */
			encodedVal = encodedVal.replace(/~/g, '%7E');
			encodedVal = encodedVal.replace(/!/g, '%21');
			encodedVal = encodedVal.replace(/\(/g, '%28');
			encodedVal = encodedVal.replace(/\)/g, '%29');
			encodedVal = encodedVal.replace(/'/g, '%27');
		}
		/* clean up the spaces and return */
		return encodedVal.replace(/\%20/g,'+'); 
	}

	function loginComentarios() {
		var usuario=document.formulario_login_comentarios.usuario.value.trim();
		var clave=document.formulario_login_comentarios.clave.value.trim();
		var recordar='';
		if(document.formulario_login_comentarios.recordar.checked) {
			recordar=document.formulario_login_comentarios.recordar.value;
		}
		var post=document.formulario_login_comentarios.post.value;
		var portal=document.formulario_login_comentarios.portal.value;
		var pagina=document.formulario_paginar_comentarios.pagina.value;
		if(usuario=='' || clave=='') {
			alert('Para poder comentar necesita entrar con su email y contraseña.');
		} else {
			var parametros='usuario='+encodeValue(usuario)+'&clave='+encodeValue(clave)+'&post='+encodeValue(post)+'&portal='+encodeValue(portal)+'&pagina='+encodeValue(pagina);
			if(recordar=='S') {
				parametros+='&recordar=S';
			}
			enviarPeticionComentarios('/servicios/blogs/comentarios/comunidad/login.html',parametros,'comentarios_lectores_caja_usuario',true,false);
		}
	}
	
	function desconectarComentarios() {
		var post=document.formulario_comentar_comentarios.post.value;
		var portal=document.formulario_comentar_comentarios.portal.value;
		var pagina=document.formulario_paginar_comentarios.pagina.value;
		var parametros='post='+encodeValue(post)+'&portal='+encodeValue(portal)+'&pagina='+encodeValue(pagina);
		enviarPeticionComentarios('/servicios/blogs/comentarios/comunidad/desconectar.html',parametros,'comentarios_lectores_caja_usuario',true,false);
	}
	
	function isChecked(id) {
		var nodo=document.getElementById(id);
		if(nodo!=undefined)
			return nodo.checked;
		else
			return false;
	}
	
	function enviarComentario() {
		var opcion=document.formulario_comentar_comentarios.opcion.value;
		var post=document.formulario_comentar_comentarios.post.value;
		var portal=document.formulario_comentar_comentarios.portal.value;
		var texto=document.formulario_comentar_comentarios.texto.value.trim();
		var reglas=document.formulario_comentar_comentarios.reglas.value;
		if(texto=='' || texto=='Déjanos tu comentario') {
			alert('elmundo.es mejora con sus opiniones. Por favor, escriba su comentario.');
		} else if(texto.length>2000) {
			alert('Su comentario supera el límite máximo de 2.000 caracteres. Por favor, resúmalo y pruebe de nuevo.');
		} else if(!document.formulario_comentar_comentarios.reglas.checked){
			alert('Debe aceptar las reglas de participación.');
		} else {
			var parametros="opcion="+encodeValue(opcion)+"&post="+encodeValue(post)+"&portal="+encodeValue(portal)+"&reglas="+encodeValue(reglas)+"&texto="+encodeValue(texto);
			enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/comentar.html",parametros,"comentarios_lectores_caja_usuario",true,false);
		}
	}
	
	function enviarCaptchaComentario() {
		var opcion=document.formulario_comentar_comentarios.opcion.value;
		var post=document.formulario_comentar_comentarios.post.value;
		var portal=document.formulario_comentar_comentarios.portal.value;
		var captcha=document.formulario_comentar_comentarios.captcha.value.trim();
		if(captcha=='' || captcha.length!=6) {
			alert('El código de seguridad que ha introducido no es correcto. Por favor, revíselo y pruebe de nuevo.');
		} else {
			var parametros="opcion="+encodeValue(opcion)+"&post="+encodeValue(post)+"&portal="+encodeValue(portal)+"&captcha="+encodeValue(captcha);
			enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/comentar.html",parametros,"comentarios_lectores_caja_usuario",true,false);
		}
	}
	
	function recargarCaptcha() {
		var currentTime=new Date();
		document.getElementById("captchaComentarios").src="/servicios/blogs/comentarios/comunidad/captcha.jpg?tmp="+currentTime.getTime();
	}

	function enviarValoracionComentario(comentario,voto) {
		var parametros="comentario="+encodeValue(comentario)+"&voto="+encodeValue(voto);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/valorar.html",parametros,"valoracion_comentario_"+comentario,true,false);
	}

	function enviarDenunciaComentario(comentario) {
		var parametros="comentario="+encodeValue(comentario);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/denunciar.html",parametros,"denuncia_comentario_"+comentario,true,false);
	}
	
	function pasarPaginaComentarios(pagina) {
		var post=document.formulario_paginar_comentarios.post.value;
		var portal=document.formulario_paginar_comentarios.portal.value;
		document.formulario_paginar_comentarios.pagina.value=pagina;
		var parametros="post="+encodeValue(post)+"&portal="+encodeValue(portal)+"&pagina="+encodeValue(pagina);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/listar.html",parametros,"comentarios_lectores_listado",true,true,function(){borrarPerfiles();document.getElementById("comentarios_lectores_listado").scrollIntoView(true);});
		
	}

	function pasarPaginaComentariosTeMencionan(pagina) {
		var post=document.formulario_paginar_comentarios.post.value;
		var portal=document.formulario_paginar_comentarios.portal.value;
		document.formulario_paginar_comentarios.pagina.value=pagina;
		var parametros="post="+encodeValue(post)+"&portal="+encodeValue(portal)+"&pagina="+encodeValue(pagina);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/listarTeMencionan.html",parametros,"comentarios_lectores_listado",true,true,function(){borrarPerfiles();document.getElementById("comentarios_lectores_listado").scrollIntoView(true);});
	}
	
	function pasarPaginaComentariosTuRed(pagina) {
		var post=document.formulario_paginar_comentarios.post.value;
		var portal=document.formulario_paginar_comentarios.portal.value;
		document.formulario_paginar_comentarios.pagina.value=pagina;
		var parametros="post="+encodeValue(post)+"&portal="+encodeValue(portal)+"&pagina="+encodeValue(pagina);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/listarTuRed.html",parametros,"comentarios_lectores_listado",true,true,function(){borrarPerfiles();document.getElementById("comentarios_lectores_listado").scrollIntoView(true);});
	}

	function pasarPaginaComentariosMejorValorados(pagina) {
		var post=document.formulario_paginar_comentarios.post.value;
		var portal=document.formulario_paginar_comentarios.portal.value;
		document.formulario_paginar_comentarios.pagina.value=pagina;
		var parametros="post="+encodeValue(post)+"&portal="+encodeValue(portal)+"&pagina="+encodeValue(pagina);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/listarMejorValorados.html",parametros,"comentarios_lectores_listado",true,true,function(){borrarPerfiles();document.getElementById("comentarios_lectores_listado").scrollIntoView(true);});
	}

	function Hash() {
		this.length = 0;
		this.items = new Array();
		for (var i = 0; i < arguments.length; i += 2) {
			if (typeof(arguments[i + 1]) != 'undefined') {
				this.items[arguments[i]] = arguments[i + 1];
				this.length++;
			}
		}
		this.remove = function(in_key) {
			var tmp_previous;
			if (typeof(this.items[in_key]) != 'undefined') {
				this.length--;
				var tmp_previous = this.items[in_key];
				delete this.items[in_key];
			}
			return tmp_previous;
		};
		this.get = function(in_key) {
			return this.items[in_key];
		};
		this.set = function(in_key, in_value) {
			var tmp_previous;
			if (typeof(in_value) != 'undefined') {
				if (typeof(this.items[in_key]) == 'undefined') {
					this.length++;
				} else {
					tmp_previous = this.items[in_key];
				}
				this.items[in_key] = in_value;
			}
			return tmp_previous;
		};
		this.contains = function(in_key) {
			return typeof(this.items[in_key]) != 'undefined';
		};
		this.clear = function()	{
			for (var i in this.items) {
				delete this.items[i];
			}
			this.length = 0;
		};
	}

	var perfiles = new Hash();
	var cargaPerfiles = new Hash();
	var descargaPerfiles = new Hash();

	function mostrarPerfil(usuario,comentario) {
		if(!cargaPerfiles.contains(comentario)) {
			var divId=document.getElementById("perfil_comentario_"+comentario);
			if(divId.style.display!='') {
				var contador=setTimeout('cargarPerfil('+usuario+','+comentario+')',1000);
				cargaPerfiles.set(comentario,contador);
				
				divId.innerHTML='<span class="info_top"></span><span class="info_flecha"></span><a class="cerrar_ventana" href="#" onclick="javascript:descargarPerfilBoton()"><span>Cerrar ventana</span></a><div class="info_contenedor estirar"><div class="info_usuario_contenido"><div class="nombre"><img src="http://estaticos.elmundo.es/elmundo/iconos/v3.0/activity_indicator.gif" alt="Cargando"/> Cargando...</div></div><div class="actividades"></div></div><span class="info_bottom"></span>';
				mostrarCapa(divId);
				
			}
		}
		if(descargaPerfiles.contains(comentario)) {
			clearTimeout(descargaPerfiles.get(comentario));
			descargaPerfiles.remove(comentario);
		}
	}
	
	function cargarPerfil(usuario,comentario) {
		if(cargaPerfiles.contains(comentario)) {
			clearTimeout(cargaPerfiles.get(comentario));
			cargaPerfiles.remove(comentario);
		}
		var divId=document.getElementById("perfil_comentario_"+comentario);
		if(!perfiles.contains(usuario)) {
			var parametros="usuario="+encodeValue(usuario)+"&comentario="+encodeValue(comentario);
			enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/perfil.html",parametros,"perfil_comentario_"+comentario,false,false,function(){guardarPerfil(usuario,divId);mostrarCapa(divId);ocultarRestoPerfiles(comentario);});
		} else {
			divId.innerHTML=perfiles.get(usuario);
			mostrarCapa(divId);
			ocultarRestoPerfiles(comentario);
		}
	}
	
	function ocultarPerfil(usuario,comentario) {
		if(cargaPerfiles.contains(comentario)) {
			clearTimeout(cargaPerfiles.get(comentario));
			cargaPerfiles.remove(comentario);
			
			ocultarCapa(document.getElementById("perfil_comentario_"+comentario));
		}
		if(!descargaPerfiles.contains(comentario)) {
			var contador=setTimeout('descargarPerfil('+comentario+')',1000);
			descargaPerfiles.set(comentario,contador);
		}
	}
	
	function descargarPerfil(comentario) {
		if(descargaPerfiles.contains(comentario)) {
			clearTimeout(descargaPerfiles.get(comentario));
			descargaPerfiles.remove(comentario);
		}
		ocultarCapa(document.getElementById("perfil_comentario_"+comentario));
	}

	function descargarPerfilBoton(comentario) {
		if(comentario==undefined) {
			ocultarRestoPerfiles();
		} else {
			if(cargaPerfiles.contains(comentario)) {
				clearTimeout(cargaPerfiles.get(comentario));
				cargaPerfiles.remove(comentario);
			}
			descargarPerfil(comentario);
		}
	}

	function guardarPerfil(usuario,divId) {
		if(!perfiles.contains(usuario)) {
			perfiles.set(usuario,divId.innerHTML);
		}
	}
	
	function borrarPerfiles() {
		perfiles.clear();
		cargaPerfiles.clear();
		descargaPerfiles.clear();
	}

	function ocultarRestoPerfiles(comentario) {
		var node_list = document.getElementsByTagName('div'); 
		for (var i = 0; i < node_list.length; i++) { 
		    var node = node_list[i]; 
		    var nodeId = node.id;
		    var pos = nodeId.indexOf('perfil_comentario_');
    		if (pos!=-1) { 
    			var idComentario = nodeId.substring(pos+18,nodeId.length);
		        if(comentario==undefined || idComentario!=comentario) {
			        descargarPerfilBoton(idComentario);
			    }
		    } 
		}  
	}

	function mostrarCapa(divId) {
		if(divId!=undefined) {
			divId.style.display='';
		}
	}

	function ocultarCapa(divId) {
		if(divId!=undefined) {
			divId.style.display='none';
		}
	}

	function inicializarTexto(id,valor) {
		var nodo=document.getElementById(id);
		if(nodo!=undefined)
			nodo.value=valor;
	}

	function inicializarCheckbox(id,valor) {
		var nodo=document.getElementById(id);
		if(nodo!=undefined)
			nodo.checked=valor;
	}

	function inicializarDisabled(id,valor) {
		var nodo=document.getElementById(id);
		if(nodo!=undefined)
			nodo.disabled=valor;
	}
	
	function inicializarComentarios(pagina) {
		inicializarTexto('formulario_login_comentarios_usuario','');
		inicializarTexto('formulario_login_comentarios_clave','');
		inicializarCheckbox('formulario_login_comentarios_recordar',true);
		inicializarTexto('formulario_comentar_comentarios_texto','Déjanos tu comentario');
		inicializarCheckbox('formulario_comentar_comentarios_reglas',false);
		inicializarPagina(pagina);
	}
	
	function inicializarPagina(pagina) {
		try {
			document.formulario_paginar_comentarios.pagina.value=pagina;
		} catch (e) {
		}
	}
	
	var estadoAyudaCaptcha = false;
	function mostrarAyudaCaptcha() {
		var capaAyudaCaptcha = document.getElementById("explicacionCodigo");
		if (estadoAyudaCaptcha == false ) {
			capaAyudaCaptcha.style.display = "block";
			estadoAyudaCaptcha = true;
		} else {
			capaAyudaCaptcha.style.display = "none";
			estadoAyudaCaptcha = false;
		}
	}

	function comentarReferenciaComentario(comentario) {
		var nodo=document.getElementById('formulario_comentar_comentarios_texto');
		if(nodo!=undefined) {
			var texto=nodo.value;
			if(texto!='Déjanos tu comentario') {
				nodo.value = texto + ' #' + comentario + ' ' ;
			} else {
				nodo.value = '#' + comentario + ' ';
			}
			nodo.focus();
		}
	}
	
	function comentarReferenciaUsuario(usuario) {
		var nodo=document.getElementById('formulario_comentar_comentarios_texto');
		if(nodo!=undefined) {
			var texto=nodo.value;
			if(texto!='Déjanos tu comentario') {
				nodo.value = texto + ' @' + usuario + ' ' ;
			} else {
				nodo.value = '@' + usuario + ' ';
			}
			nodo.focus();
		}
	}
	
	function seguir(usuario,comentario) {
		eliminarClickSeguimiento(document.getElementById('seguir_usuario_'+comentario));
		var parametros="usuario="+encodeValue(usuario)+"&comentario="+encodeValue(comentario);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/seguir.html",parametros,"seguir_usuario_"+comentario,false,false,function(){borrarPerfiles();});
	}
	
	function noSeguir(usuario,comentario) {
		eliminarClickSeguimiento(document.getElementById('seguir_usuario_'+comentario));
		var parametros="usuario="+encodeValue(usuario)+"&comentario="+encodeValue(comentario);
		enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/noSeguir.html",parametros,"seguir_usuario_"+comentario,false,false,function(){borrarPerfiles();});
	}

	function eliminarClickSeguimiento(nodoSeguir) {
		var nodeList=nodoSeguir.getElementsByTagName('a');
		for (var i = 0; i < nodeList.length; i++) { 
		    var node = nodeList[i]; 
			node.onclick='javascript:return false;';
		} 
	}

	function abrirMensajePrivado(comentario) {
		ocultarRestoMensajesPrivados(comentario);
		if(document.getElementById('mensaje_privado_'+comentario).style.display=='none') {
			ocultarCapa(document.getElementById('contenido_mensaje_privado_mensaje_sistema_'+comentario));
			mostrarCapa(document.getElementById('contenido_mensaje_privado_caja_enviar_'+comentario));
			ocultarCapa(document.getElementById('error_mensaje_privado_'+comentario));
			document.getElementById('mensaje_privado_asunto_'+comentario).value='';
			document.getElementById('mensaje_privado_texto_'+comentario).value='';
			mostrarCapa(document.getElementById('mensaje_privado_'+comentario));
		} else {
			cerrarMensajePrivado(comentario);
		}
	}
	
	function cerrarMensajePrivado(comentario) {
		ocultarCapa(document.getElementById('mensaje_privado_'+comentario));
	}
	
	function ocultarRestoMensajesPrivados(comentario) {
		var nombreNodoComentario = 'mensaje_privado_'+comentario;
		var nodeList = getElementsByClassName('mensaje_privado','div',document.getElementById('comentarios'));
		for (var i = 0; i < nodeList.length; i++) { 
		    var node = nodeList[i]; 
		    var nodeId = node.id;
		    if(nodeId!=nombreNodoComentario) {
				ocultarCapa(node);
			}
		}  
	}
	
	function enviarMensajePrivado(comentario) {
		var destinatario=document.getElementById('mensaje_privado_destinatario_'+comentario).value;
		var asunto=document.getElementById('mensaje_privado_asunto_'+comentario).value;
		var texto=document.getElementById('mensaje_privado_texto_'+comentario).value;
		if(texto=="") {
			alert('Por favor, escriba su mensaje.');
		} else if(texto.length>1000) {
			alert('Su mensaje supera el límite máximo de 1.000 caracteres. Por favor, resúmalo y pruebe de nuevo.');
		} else if(asunto=="") {
			alert('El mensaje ha de tener un asunto.');
		} else if(asunto.length>100) {
			alert('El asunto supera el límite máximo de 100 caracteres. Por favor, acórtelo y pruebe de nuevo.');
		} else if(destinatario=="") {
			alert('Indique el destinatario de su mensaje.');
		} else {
			var parametros="comentario="+encodeValue(comentario)+"&destinatario="+encodeValue(destinatario)+"&asunto="+encodeValue(asunto)+"&texto="+encodeValue(texto);
			enviarPeticionComentarios("/servicios/blogs/comentarios/comunidad/enviarPrivado.html",parametros,"mensaje_privado_"+comentario,true,false);
		}
	}
	
	String.prototype.trim = function() {
		return (this.replace(/^\s+/, '')).replace(/\s+$/, '');
	};
	
	var getElementsByClassName = function (className, tag, elm) {
		if (document.getElementsByClassName) {
			getElementsByClassName = function (className, tag, elm) {
				elm = elm || document;
				var elements = elm.getElementsByClassName(className),
					nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
					returnElements = [],
					current;
				for(var i=0, il=elements.length; i<il; i+=1){
					current = elements[i];
					if(!nodeName || nodeName.test(current.nodeName)) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		} else if (document.evaluate) {
			getElementsByClassName = function (className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "),
					classesToCheck = "",
					xhtmlNamespace = "http://www.w3.org/1999/xhtml",
					namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
					returnElements = [],
					elements,
					node;
				for(var j=0, jl=classes.length; j<jl; j+=1){
					classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
				}
				try	{
					elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
				}
				catch (e) {
					elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
				}
				while ((node = elements.iterateNext())) {
					returnElements.push(node);
				}
				return returnElements;
			};
		} else {
			getElementsByClassName = function (className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "),
					classesToCheck = [],
					elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
					current,
					returnElements = [],
					match;
				for(var k=0, kl=classes.length; k<kl; k+=1){
					classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
				}
				for(var l=0, ll=elements.length; l<ll; l+=1){
					current = elements[l];
					match = false;
					for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
						match = classesToCheck[m].test(current.className);
						if (!match) {
							break;
						}
					}
					if (match) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		return getElementsByClassName(className, tag, elm);
	};
	
