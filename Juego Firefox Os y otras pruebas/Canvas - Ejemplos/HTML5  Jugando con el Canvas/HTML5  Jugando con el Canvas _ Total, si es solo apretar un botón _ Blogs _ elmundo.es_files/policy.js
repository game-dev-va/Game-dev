function getUePrivacyCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
  		c_start = c_value.indexOf(c_name + "=");
  	}
	if (c_start == -1) {
  		c_value = false;
 	} else {
  		c_start = c_value.indexOf("=", c_start) + 1;
  		var c_end = c_value.indexOf(";", c_start);
  		if (c_end == -1){
		c_end = c_value.length;
   	}
	c_value = unescape(c_value.substring(c_start,c_end));
  	}
	return c_value;
}


function setUePrivacyCookie(domain, c_value)
{
    var days=365000;
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();

    document.cookie = "ue_privacyPolicy = "+ c_value +" "+ expires + "; path=/; domain=" + domain + ";";
    //
    var mesageLayer= document.getElementById('privacyPolicyLayer')
    if (mesageLayer){
      mesageLayer.parentNode.removeChild(mesageLayer);
    }
}




function parseUri (str) {
    var o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseUri.options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};


function showPrivacyCookieLayer(domain)
{
    var urlMoreInfo='http://cookies.unidadeditorial.es';
    // STYLES FOR FF, Chrome, Safari.
    var stylesHtml='<style type="text/css"> \
    .bloque-cookies { background: #555; color:#fff; padding:2em 1em 1.5em; text-align: center; width:100%; clear:both; float:left; font-size: 80%;} \
    .bloque-cookies h2 {color:#fff; text-align:left; font-size:1.8em; font-weight:normal; letter-spacing: 0; margin-bottom: 0.3em; } \
    .bloque-cookies .envuelve-cookies{ width:40%; margin:0 auto; } \
    .bloque-cookies p{text-align: left;color:#BFBFBF; line-height: 1.5em;float:left; } \
    .bloque-cookies span {width:30%; float:right; display:block; } \
    .bloque-cookies a.mas-info { border-bottom:1px dotted #fff;} \
    .bloque-cookies p a, .bloque-cookies a.mas-info{color:#0099CC;} \
    .bloque-cookies p a:hover, .bloque-cookies a:hover.mas-info{color:#4FB7D9;} \
    .bloque-cookies .continuar{ background:#0099CC; font-size: 1.2em; margin: 0.3em auto 1em auto; display:block; border-radius:3px;padding:4px; color:#fff; width:auto; text-align:center; \
    -moz-transition: all 0.4s ease-in-out; \
    -o-transition: all 0.4s ease-in-out; \
    -ms-transition: all 0.4s ease-in-out; \
    transition: all 0.4s ease-in-out; \
    } \
    .bloque-cookies .continuar:hover { color:#fff; background:#4FB7D9; } \
    @media screen and (max-width:1280px) { .bloque-cookies .envuelve-cookies{ width:78%; } } \
    </style>';

    var stylesIEHtml='.bloque-cookies { background: #555; color:#fff; padding:2em 1em 1.5em; text-align: center; width:100%; clear:both; float:left; font-size: 80%;} .bloque-cookies h2 {color:#fff; text-align:left; font-size:1.8em; font-weight:normal; letter-spacing: 0; margin-bottom: 0.3em; } ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies .envuelve-cookies{ width:40%; margin:0 auto; } ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies p{width:65%; text-align: left;color:#BFBFBF; line-height: 1.5em;float:left; } ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies span {width:30%; float:right; display:block; } ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies a.mas-info { border-bottom:1px dotted #fff;} ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies p a, .bloque-cookies a.mas-info{color:#0099CC;} ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies p a:hover, .bloque-cookies a:hover.mas-info{color:#4FB7D9;} ';
    stylesIEHtml=stylesIEHtml+'.bloque-cookies .continuar{ background:#0099CC; font-size: 1.2em; margin: 0.3em auto 1em auto; display:block; border-radius:3px;padding:4px; color:#fff; width:auto; text-align:center; ';
    stylesIEHtml=stylesIEHtml+'-ms-transition: all 0.4s ease-in-out; ';
    stylesIEHtml=stylesIEHtml+'transition: all 0.4s ease-in-out; } .bloque-cookies .continuar:hover { color:#fff; background:#4FB7D9; } .bloque-cookies .envuelve-cookies{ width:78%; max-width:1280px; }';

    var layerHtml=' <div id="privacyPolicyLayer" class="bloque-cookies"> \
    <div class="envuelve-cookies"> \
    <h2>Uso de cookies</h2> \
    <p> \
    Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el an&aacute;lisis de sus h&aacute;bitos de navegaci&oacute;n.\
     Si contin&uacute;a navegando, consideramos que acepta su uso. Puede obtener m&aacute;s informaci&oacute;n, o bien conocer c&oacute;mo cambiar la configuraci&oacute;n, en nuestra <a class="mas-info" href="'+ urlMoreInfo +'">Pol&iacute;tica de cookies</a> \
    </p> \
    </div> \
    </div>';


    var bodytag = document.getElementsByTagName('body')[0];


    var userAgent = navigator.userAgent.toLowerCase();
    // version = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1]
    var isIE = /msie/.test( userAgent ) && !/opera/.test( userAgent );

    if (isIE){
        // ADD STYLE TO EXPLORER HEAD
        var css = stylesIEHtml,
        head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        var fragment = createHtml(layerHtml);
        bodytag.insertBefore(fragment,bodytag.firstChild);
    } else {

        var fragment = createHtml(stylesHtml+layerHtml);
        bodytag.insertBefore(fragment,bodytag.firstChild);


    }

}

function createHtml (htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}


function checkPrivacyPolicy()
{
	
  if (window.opener) return;
  // Get the location url
  var uri=parseUri (document.location);
  var locationMainDomain = uri.authority.split('.');

  var rootDomain =locationMainDomain[locationMainDomain.length-2] + '.' +locationMainDomain[locationMainDomain.length-1];
  // FIX THE MAIN DOMAIN - Ex. wwww.elmundo.es and app.elmundo.es have de domain name elmundo.es
  var availablesReferrerDomains=new Array(rootDomain); // List of availables referrer domains. By default the main domain is include


  Array.prototype.inArray = function (value){
          for (var i=0; i < this.length; i++)
            if (this[i] === value)
              return true;
          return false;
  };

  // GET COOKIE INFO
  var privacyCookie= getUePrivacyCookie('ue_privacyPolicy');

  if (!privacyCookie) {
    // Fix cookie and show msg
    setUePrivacyCookie(rootDomain,0);
    showPrivacyCookieLayer(rootDomain);
  } else {
      if (document.referrer != ''){
          if (privacyCookie == 0){ //  msg is showed and referre page is from one off availabes domains
            parseUri.options.strictMode = true;
            var ref_uri=parseUri (document.referrer);
            var referrerMainDomain = ref_uri.authority.split('.');
            var rootReferrerDomain =referrerMainDomain[referrerMainDomain.length-2] + '.' +referrerMainDomain[referrerMainDomain.length-1];
            if (availablesReferrerDomains.inArray(rootReferrerDomain)) {
              setUePrivacyCookie(rootDomain, 1);
            } else {
				showPrivacyCookieLayer(rootDomain);
			}
          }
      } else {
        if (privacyCookie != 1){
          showPrivacyCookieLayer(rootDomain);
        }
      }
  }
}

checkPrivacyPolicy();
