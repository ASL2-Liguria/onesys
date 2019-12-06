function _MaskAPI()
{
	this.versione = "0.1";
	this.istanza = 0;
	this.objects = {};
}
MaskAPI = new _MaskAPI();

function MaskEdit(m, t)
{
	this.mask = m;
	this.tipo = t; //(typeof t == "string") ? t : "string";
		
	this.errore = [];
	this.erroreCodice = [];
	this.valore = "";
	this.cValore = "";
	this.mostraParziale = false;
	
	this.id = MaskAPI.istanza++;
	this.ref = "MaskAPI.objects['" + this.id + "']";
	MaskAPI.objects[this.id] = this;
	
}

MaskEdit.prototype.attach = function(o)
{
	if(o.readonly == null || o.readonly == false)
	{
		o.onkeydown = new Function("return " + this.ref + ".isAllowKeyPress(event, this)");
		o.onkeyup = new Function("return " + this.ref + ".getKeyPress(event, this)");
		o.onblur = new Function("this.value = " + this.ref + ".format(this.value)");
	}
}

MaskEdit.prototype.isAllowKeyPress = function(e, o)
{
	if(this.tipo != "string") return true;
	
	var xe = new xEvent(e);

	if(((xe.keyCode > 47) && (o.value.length >= this.mask.length)) && !xe.ctrlKey) return false;
	
	return true;
}

MaskEdit.prototype.getKeyPress = function(e, o, _u)
{
	this.mostraParziale = true;
	
	var xe = new xEvent(e);

	if((xe.keyCode > 47) || (_u == true) || (xe.keyCode == 8 || xe.keyCode == 46))
	{
		var v = o.value, d;
		
		if(xe.keyCode == 8 || xe.keyCode == 46 )
		{
			d = true;
		}
		else
		{
			d = false;
		}

		if(this.tipo == "number" )
		{
			this.valore = this.setNumber(v, d);
		}
		else
		{
			if(this.tipo == "date")
			{
				this.valore = this.setDateKeyPress(v, d);
			}
			else
			{
				this.valore = this.setGeneric(v, d);
			}
		}
		o.value = this.valore;
	}

	this.mostraParziale = false;
	
	return true;
}

MaskEdit.prototype.format = function(s)
{
	if(this.tipo == "number" )
	{
		this.valore = this.setNumber(s);
	}
	else
	{
		if(this.tipo == "date")
		{
			this.valore = this.setDate(s);
		}
		else
		{
			this.valore = this.setGeneric(s);
		}
	}
	
	return this.valore;
}

MaskEdit.prototype.throwError = function(c, e, v)
{
	this.errore[this.errore.length] = e;
	this.erroreCodice[this.erroreCodice.length] = c;
	
	if(typeof v == "string") return v;
	
	return true;
}

MaskEdit.prototype.setGeneric = function(_v, _d)
{
	var v = _v, m = this.mask;
	var r = "x#*", rt = [], nv = "", t, x, a = [], j=0, rx = {"x": "A-Za-z", "#": "0-9", "*": "A-Za-z0-9" };

	// Mi tolgo i caratteri non validi...
	v = v.replace(new RegExp("[^" + rx["*"] + "]", "gi"), "");
	
	if((_d == true) && (v.length == this.cValore.length))
	{
		v = v.substring(0, v.length-1);
	}
	
	cValore = v;
	var b=[];
	for(var i=0; i < m.length; i++)
	{
		// Mi prendo il carattere da elaborare
		x = m.charAt(i);
		
		// Verifico se il carattere non ш della mask
		t = (r.indexOf(x) > -1);
		
		// Se ш un carattere esc, passo al successivo...
		if(x == "!") x = m.charAt(i++);
		
		// Costruisco una restrizione...
		if((t && !this.mostraParziale) || (t && this.mostraParziale && (rt.length < v.length)))
		{
			rt[rt.length] = "[" + rx[x] + "]";
		}
		
		// Maschera definitiva...
		a[a.length] = { "char": x, "mask": t };
	}

	var carattereValido = false;
	
	// Verifico se il formato ш giusto o no
	if(!this.mostraParziale && !(new RegExp(rt.join(""))).test(v))
	{
		return this.throwError(1, "Il valore \"" + _v + "\" deve essere nel formato " + this.mask + ".", _v);
	}
	else
	{
		if((this.mostraParziale && (v.length > 0)) || !this.mostraParziale)
		{
			for(i=0; i < a.length; i++)
			{
				if(a[i].mask)
				{
					while(v.length > 0 && !(new RegExp(rt[j])).test(v.charAt(j)))
					{
						v = (v.length == 1) ? "" : v.substring(1);
					}
					
					if(v.length > 0)
					{
						nv += v.charAt(j);
						carattereValido = true;
					}
					
					j++;
				}
				else
				{
					nv += a[i]["char"];
				}
				
				// Verifico se non sono giр fuori...
				if(this.mostraParziale && (j > v.length))
				{
					break;
				}
			}
		}
	}
	
	if(this.mostraParziale && !carattereValido)
	{
		// Se non ш valido, restituisco niente
		nv = "";
	}

	return nv;
}

MaskEdit.prototype.setNumber = function(_v, _d)
{
	var v = String(_v).replace(/[^\d.-]*/gi, "");
	var m = this.mask;
	
	// Mi assicuro che ci sia solo un punto per le decimali...
	v = v.replace(/\./, "d").replace(/\./g, "").replace(/d/, ".");

	// Verifico se non ci sono caratteri "sporchi"
	if(!/^[\$А%ге]?((\$?[\+-]?([0#]{1,3}(,|\ |\а|_))?[0#]*(\.[0#]*)?)|([\+-]?\([\+-]?([0#]{1,3}(,|\ |\а|_))?[0#]*(\.[0#]*)?\)))[\$А%ге]?$/.test(m))
	{
		return this.throwError(1, "Maschera non valida per il costruttore!", _v);
	}

	if((_d == true) && (v.length == this.cValore.length))
	{
		v = v.substring(0, v.length-1);
	}

	if(this.mostraParziale && (v.replace(/[^0-9]/, "").length == 0))
	{
		return v;
	}
	
	this.cValore = v;

	if(v.length == 0)
	{
		v = NaN;
	}
	
	var vn = Number(v);
	
	if(isNaN(vn))
	{
		return this.throwError(2, "Attenzione! Il valore non ш un numero valido!.", _v);
	}

	// Se non ho niente da elaborare, esco!
	if(m.length == 0)
	{
		return v;
	}
	
	// Prendo la prima parte decimale...
	var vi = String(Math.abs((v.indexOf(".") > -1 ) ? v.split(".")[0] : v));
	// Seconda parte dopo la virgola...
	var vd = (v.indexOf(".") > -1) ? v.split(".")[1] : "";
	var _vd = vd;

	var isNegative = ((Math.abs(vn)*-1 == vn) && (Math.abs(vn) != 0));

	// verifico il tipo
	var show =
	{
		"е" : (m.indexOf("е") != -1), // Giapponese: Yen
		"г" : (m.indexOf("г") != -1), // Inglese: Pound
		"А" : (m.indexOf("А") != -1), // Europeo: Euro
		"$" : (m.indexOf("$") != -1), // Americano: Dollaro
		"%" : (m.indexOf("%") != -1), // Percentuale
		"(" : (isNegative && (m.indexOf("(") > -1)),
		"+" : ((m.indexOf("+") != -1) && !isNegative)
	}
	show["-"] = (isNegative && (!show["("] || (m.indexOf("-") != -1)));
	
	// Se la maschera contiene pi∙ di un carattere, li scarto...
	if (show["е"] && ( show["г"] || show["А"] || show["$"] || show["%"] )) show["е"] = false;
	if (show["г"] && ( show["А"] || show["$"] || show["%"] )) show["г"] = false;
	if (show["А"] && ( show["$"] || show["%"] )) show["А"] = false;
	if (show["$"] && show["%"]) show["$"] = false;


	// Sostituisco tutto quello che nn si colloca alla maschera!
	m = m.replace(/[^#0._,]*/gi, "");
	
	// Splitto il numero (verificando se c'ш giр il separatore)
	var dm = (m.indexOf(".") > -1 ) ? m.split(".")[1] : "";
	
	if(dm.length == 0)
	{
		vi = String(Math.round(Number(vi)));
		vd = "";
	}
	else
	{
		var md = dm.lastIndexOf("0")+1;
		var nb0vd = 0;
		var zeros = "";
		while(nb0vd<=vd.length && vd.substring(nb0vd,1)=="0")
		{
			nb0vd++; 
			zeros += "0";
		}
		
		if( vd.length > dm.length )
		{
			vd = zeros + String(Math.round(Number(vd.substring(0, dm.length + 1))/10));
			
			if (vd.length > dm.length)
			{
				addtovi = vd.substring(0,1);
				vd = vd.substring(1,vd.length);
				vi = String(Number(vi) + Number(addtovi));
			}
			
			while(vd.length < md)
			{
				vd = "0" + vd;
			}
		}
		else
		{
			while(vd.length < md)
			{
				vd += "0";
			}
		}
	}

	var im = (m.indexOf(".") > -1 ) ? m.split(".")[0] : m;
	im = im.replace(/[^0#]+/gi, "");

	var mv = im.indexOf("0")+1;
	
	if(mv > 0)
	{
		mv = im.length - mv + 1;
		while(vi.length < mv)
		{
			vi = "0" + vi;
		}
	}


	// Verifico se ci serve o no la virgola
	if( /[#0]+(_|,)[#0]{3}/.test(m) )
	{
		var x = []
		var i=0;
		var n=Number(vi);
		while(n > 999)
		{
			x[i] = "00" + String(n%1000);
			x[i] = x[i].substring(x[i].length - 3);
			n = Math.floor(n/1000);
			i++;
		}
		
		x[i] = String(n%1000);
		vi = x.reverse().join((m.substring(1,2)).replace("_"," "));//",");
	}
	
	if((vd.length > 0 && !this.mostraParziale) || ((dm.length > 0) && this.mostraParziale && (v.indexOf(".") > -1) && (_vd.length >= vd.length)))
	{
		v = vi + "." + vd;
	}
	else
	{
		if((dm.length > 0) && this.mostraParziale && (v.indexOf(".") > -1) && (_vd.length < vd.length))
		{
			v = vi + "." + _vd;
		}
		else
		{
			v = vi;
		}
	}
	
	if(show["е"]) v = v + "е";
	if(show["г"]) v = "г" + v;
	if(show["А"]) v = "А " + v;
	if(show["$"]) v = "$" + v;
	if(show["%"]) v = v + " %";
	if(show["+"]) v = "+" + v;
	if(show["-"]) v = "-" + v;
	if(show["("]) v = "(" + v + ")";
	
	return v;
}

MaskEdit.prototype.setDate = function(_v)
{
	var v=_v;
	var m=this.mask;
	var a;
	var e;
	var mm;
	var dd;
	var yy;
	var x;
	var s;

	// Splitto per sapere la posizione della data
	a = m.split(/[^mdy]+/);
	s = m.split(/[mdy]+/);
	e = v.split(/[^0-9]/);
	
	if(s[0].length == 0)
	{
		s.splice(0,1);
	}
	
	for(var i=0; i < a.length; i++)
	{
		x = a[i].charAt(0).toLowerCase();
		if(x=="m")
		{
			mm = parseInt(e[i],10)-1;
		}
		else
		{
			if(x=="d")
			{
				dd = parseInt(e[i],10);
			}
			else
			{
				if(x=="y") yy = parseInt(e[i],10);
			}
		}
	}

	// Controllo se l'anno non ш abbreviato...
	if(String(yy).length < 3)
	{
		yy = 2000 + yy;
		if((new Date()).getFullYear()+20 < yy)
		{
			yy = yy-100;
		}
	}

	// Mi creo l'oggetto data...
	var d = new Date(yy,mm,dd);

	if(d.getDate() != dd)
	{
		return this.throwError(1,"Giorno non valido!",_v);
	}
	else
	{
		if(d.getMonth() != mm)
		{
			return this.throwError(2,"Mese non valido!",_v);
		}
	}

	var nv="";

	for(i=0; i<a.length; i++)
	{
		x = a[i].charAt(0).toLowerCase();
		
		if(x=="m")
		{
			mm++;
			
			if(a[i].length == 2)
			{
				mm = "0" + mm;
				mm = mm.substring(mm.length-2);
			}
			
			nv += mm;
		}
		else
		{
			if(x == "d")
			{
				if(a[i].length == 2)
				{
					dd = "0" + dd;
					dd = dd.substring(dd.length-2);
				}
				nv += dd;
			}
			else
			{
				if(x == "y")
				{
					if(a[i].length == 2)
					{
						nv += d.getYear();
					}
					else
					{
						nv += d.getFullYear();
					}
				}
			}
		}
		
		if(i<a.length-1)
		{
			nv += s[i];
		}
	}

	return nv;
}

MaskEdit.prototype.setDateKeyPress = function(_v, _d)
{
	var v = _v;
	var m = this.mask;
	var k = v.charAt(v.length-1);
	var a;
	var e;
	var c;
	var ml;
	var vl;
	var mm = "";
	var dd = "";
	var yy = "";
	var x;
	var p;
	var z;

	if(_d == true)
	{
		while((/[^0-9]/gi).test(v.charAt(v.length-1)))
		{
			v = v.substring(0, v.length-1);
		}
		
		if((/[^0-9]/gi).test(this.cValore.charAt(this.cValore.length-1)))
		{
			v = v.substring(0, v.length-1);
		}
		
		if(v.length == 0)
		{
			return "";
		}
	}
	
	// Splitto i vari dati...
	a = m.split(/[^mdy]/);
	s = m.split(/[mdy]/);
	v = v.replace(/\s/g,"");
	e = v.split(/[^0-9]/);
	
	// Posizione del cursore nella maschera
	p = (e.length > 0) ? e.length-1 : 0;
	
	// Controllo cosa sta facendo l'utente
	c = a[p].charAt(0);
	
	// Lunghezza della maschera
	ml = a[p].length;

	for(var i=0; i < e.length; i++)
	{
		x = a[i].charAt(0).toLowerCase();
		if(x == "m")
		{
			mm = parseInt(e[i], 10)-1;
		}
		else
		{
			if(x == "d")
			{
				dd = parseInt(e[i], 10);
			}
			else
			{
				if(x == "y")
				{
					yy = parseInt(e[i], 10);
				}
			}
		}
	}

	var nv = "";
	var j=0;

	for(i=0; i < e.length; i++)
	{
		x = a[i].charAt(0).toLowerCase();
		
		if(x == "m")
		{
			z = ((/[^0-9]/).test(k) && c == "m");
			
			mm++;
			
			if((e[i].length == 2 && mm < 10) || (a[i].length == 2 && c != "m") || (mm > 1 && c == "m") || (z && a[i].length == 2))
			{
				// Vari controlli sul mese...
				mm = "0" + mm;
				if(mm > 12)
				{
					mm = "1";
				}
				else
				{
					mm = mm.substring(mm.length-2);
				}
				
				if(mm == 0)
				{
					mm = "0";
				}
			}
			
			vl = String(mm).length;
			ml = 2;
			nv += mm;
		}
		else
		{
			if( x == "d" )
			{
				z = ((/[^0-9]/).test(k) && c == "d");
				if( (e[i].length == 2 && dd < 10) || (a[i].length == 2 && c != "d") || (dd > 3 && c == "d") || (z && a[i].length == 2))
				{
					// Vari controlli sul giorno...
					dd = "0" + dd;
					if (dd > 31)
					{
						dd = "3";
					}
					else
					{
						dd = dd.substring(dd.length-2);
					}
					if(dd == 0)
					{
						dd = "0";
					}
				}
				vl = String(dd).length;
				ml = 2;
				nv += dd;
			} 
			else
			{
				if(x == "y")
				{
					z = ((/[^0-9]/).test(k) && c == "y");
					
					if(c == "y")
					{
						yy = String(yy);
					}
					else
					{
						if(a[i].length == 2)
						{
							yy = d.getYear();
						}
						else
						{
							yy = d.getFullYear();
						}
					}
					if((e[i].length == 2 && yy < 10) || (a[i].length == 2 && c != "y") || (z && a[i].length == 2))
					{
						yy = "0" + yy;
						yy = yy.substring(yy.length-2);
					}
					ml = a[i].length;
					vl = String(yy).length;
					nv += yy;
				}
			}
		}
		
		if(((ml == vl || z) && (x == c) && (i < s.length)) || (i < s.length && x != c ))
		{
			nv += s[i];
		}
	}

	this.cValore = (nv == "NaN") ? "" : nv;

	return this.cValore;
}

function xEvent(e)
{
	if(window.Event) // Per broswer diversi da IE
	{
		var isKeyPress = (e.type.substring(0,3) == "key");
		
		this.keyCode = (isKeyPress) ? parseInt(e.which, 10) : 0;
		this.button = (!isKeyPress) ? parseInt(e.which, 10) : 0;
		
		this.srcElement = e.target;
		this.type = e.type;
		this.x = e.pageX;
		this.y = e.pageY;
		this.screenX = e.screenX;
		this.screenY = e.screenY;
		if(!isKeyPress)
		{
			if(document.layers)
			{
				this.altKey = ((e.modifiers & Event.ALT_MASK) > 0);
				this.ctrlKey = ((e.modifiers & Event.CONTROL_MASK) > 0);
				this.shiftKey = ((e.modifiers & Event.SHIFT_MASK) > 0);
				this.keyCode = this.translateKeyCode(keyCode);
			}
			else
			{
				this.altKey = e.altKey;
				this.ctrlKey = e.ctrlKey;
				this.shiftKey = e.shiftKey;
			}
		}
	}
	else // IE
	{
		e = window.event;
		this.keyCode = parseInt(e.keyCode, 10);
		this.button = e.button;
		this.srcElement = e.srcElement;
		this.tipo = e.type;
		if(document.all)
		{
			this.x = e.clientX + document.body.scrollLeft;
			this.y = e.clientY + document.body.scrollTop;
		}
		else
		{
			this.x = e.clientX;
			this.y = e.clientY;
		}
		this.screenX = e.screenX;
		this.screenY = e.screenY;
		this.altKey = e.altKey;
		this.ctrlKey = e.ctrlKey;
		this.shiftKey = e.shiftKey;
	}
	
	if(this.button == 0)
	{
		this.setKeyPressed(this.keyCode);
		this.keyChar = String.fromCharCode(this.keyCode);
	}
}

xEvent.prototype.translateKeyCode = function(i)
{
	// Rimappo il codice per farlo diventere generico...
	var l = {};
	
	if(!!document.layers)
	{
		if(this.keyCode > 96 && this.keyCode < 123)
		{
			return this.keyCode - 32;
		}
		
		l = {96:192, 126:192, 33:49, 64:50, 35:51, 36:52, 37:53, 94:54, 38:55, 42:56, 40:57, 41:48, 92:220, 124:220, 125:221, 93:221, 91:219, 123:219, 39:222, 34:222, 47:191, 63:191, 46:190, 62:190, 44:188, 60:188, 45:189, 95:189, 43:187, 61:187, 59:186, 58:186, "null": null}
	}
	return (!!l[i]) ? l[i] : i;
}

xEvent.prototype.setKP = function(i, s)
{
	this.keyPressedCode = i;
	this.keyNonChar = (typeof s == "string");
	this.keyPressed = (this.keyNonChar) ? s : String.fromCharCode(i);
	this.isNumeric = (parseInt(this.keyPressed, 10) == this.keyPressed);
	this.isAlpha = ((this.keyCode > 64 && this.keyCode < 91) && !this.altKey && !this.ctrlKey);
	
	return true;
}

xEvent.prototype.setKeyPressed = function(i)
{
	var b = this.shiftKey;
	
	if(!b && (i > 64 && i < 91))
	{
		return this.setKP(i + 32);
	}
	
	if(i > 95 && i < 106)
	{
		return this.setKP(i - 48);
	}
	
	switch(i)
	{
		case 49: 
		case 51: 
		case 52: 
		case 53: 
			if( b ) i = i - 16; break;
		case 50: 
			if( b ) i = 64; break;
		case 54: 
			if( b ) i = 94; break;
		case 55: 
			if( b ) i = 38; break;
		case 56: 
			if( b ) i = 42; break;
		case 57: 
			if( b ) i = 40; break;
		case 48: 
			if( b ) i = 41; break;
		case 192: 
			if( b ) i = 126; else i = 96; break;
		case 189: 
			if( b ) i = 95; else i = 45; break;
		case 187: 
			if( b ) i = 43; else i = 61; break;
		case 220: 
			if( b ) i = 124; else i = 92; break;
		case 221: 
			if( b ) i = 125; else i = 93; break;
		case 219: 
			if( b ) i = 123; else i = 91; break;
		case 222: 
			if( b ) i = 34; else i = 39; break;
		case 186: 
			if( b ) i = 58; else i = 59; break;
		case 191: 
			if( b ) i = 63; else i = 47; break;
		case 190: 
			if( b ) i = 62; else i = 46; break;
		case 188: 
			if( b ) i = 60; else i = 44; break;
		case 106: 
		case 57379: 
			i = 42; break;
		case 107: 
		case 57380: 
			i = 43; break;
		case 109: 
		case 57381: 
			i = 45; break;
		case 110: 
			i = 46; break;
		case 111: 
		case 57378: 
			i = 47; break;
		case 8: 
			return this.setKP(i, "[backspace]");
		case 9: 
			return this.setKP(i, "[tab]");
		case 13: 
			return this.setKP(i, "[enter]");
		case 16: 
		case 57389: 
			return this.setKP(i, "[shift]");
		case 17: 
		case 57390: 
			return this.setKP(i, "[ctrl]");
		case 18: 
		case 57388: 
			return this.setKP(i, "[alt]");
		case 19: 
		case 57402: 
			return this.setKP(i, "[break]");
		case 20: 
			return this.setKP(i, "[capslock]");
		case 32: 
			return this.setKP(i, "[space]");
		case 91: 
			return this.setKP(i, "[windows]");
		case 93: 
			return this.setKP(i, "[properties]");
		case 33: 
		case 57371: 
			return this.setKP(i*-1, "[pgup]");
		case 34: 
		case 57372: 
			return this.setKP(i*-1, "[pgdown]");
		case 35: 
		case 57370: 
			return this.setKP(i*-1, "[end]");
		case 36: 
		case 57369: 
			return this.setKP(i*-1, "[home]");
		case 37: 
		case 57375:
			return this.setKP(i*-1, "[left]");
		case 38: 
		case 57373: 
			return this.setKP(i*-1, "[up]");
		case 39: 
		case 57376: 
			return this.setKP(i*-1, "[right]");
		case 40: 
		case 57374: 
			return this.setKP(i*-1, "[down]");
		case 45: 
		case 57382: 
			return this.setKP(i*-1, "[insert]");
		case 46: 
		case 57383: 
			return this.setKP(i*-1, "[delete]");
		case 144: 
		case 57400: 
			return this.setKP(i*-1, "[numlock]");
	}
	
	if(i > 111 && i < 124) 
		return this.setKP(i*-1, "[f" + (i-111) + "]");

	return this.setKP(i);
}