//JavaScript Document
//Aggiunge una funzione denominata trim come metodo dell'oggetto 
//prototipo del costruttore String.
String.prototype.trim = function()
{
	// Utilizza un'espressione regolare per sostituire gli spazi 
	// iniziali e finali con la stringa vuota
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.repeat = function (n, d) {
    return --n ? this + (d || "") + this.repeat(n, d) : "" + this;
};

/*
String.prototype.replaceAll = function(stringToBeReplaced, stringToReplace)
{
	var strOutput = "";

	var regex =new RegExp(stringToBeReplaced , "g");
	return this.replace(regex,stringToReplace);
};
*/


/* *************** modifica 4-5-2015 */
String.prototype.controllo_data = function (){
	var espressione = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
	if (!espressione.test(this))
	{
	    return false;
	}else{
		anno = parseInt(this.substr(6),10);
		mese = parseInt(this.substr(3, 2),10);
		giorno = parseInt(this.substr(0, 2),10);
		
		var data=new Date(anno, mese-1, giorno);
		if(data.getFullYear()==anno && data.getMonth()+1==mese && data.getDate()==giorno){
			return true;
		}else{
			return false;
		}
	}
}
/* ************************************** */


function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

String.prototype.replaceAll = function( find, replaceStr) { 
  return this.replace(new RegExp(escapeRegExp(find), 'g'), replaceStr);
}



// ritorna hh:mm
String.prototype.getNowTimeFormat= function()
{
	var now = new Date();
	var outHour = now.getHours();
	if(outHour<10){outHour="0" + outHour;}
	var outMin = now.getMinutes();
	if(outMin<10){outMin="0"+outMin;}
	return outHour+":"+outMin;
}


String.prototype.getTodayDateFormat = function()
{
	var dataOggi ;


	dataOggi=new Date();
	var dataOggiGiorno=dataOggi.getDate();
	if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
	var dataOggiMese=dataOggi.getMonth()+1;
	if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
	var dataOggiAnno=dataOggi.getFullYear();
	var dataOggiStringa= dataOggiGiorno + "/" + dataOggiMese + "/" + dataOggiAnno;
	return dataOggiStringa;
};


String.prototype.getTodayStringFormat = function()
{
	var dataOggi ;


	dataOggi=new Date();
	var dataOggiGiorno=dataOggi.getDate();
	if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
	var dataOggiMese=dataOggi.getMonth()+1;
	if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
	var dataOggiAnno=dataOggi.getFullYear();
	var dataOggiStringa= dataOggiAnno.toString() + dataOggiMese.toString() + dataOggiGiorno.toString();
	return dataOggiStringa;
};


String.prototype.getYesterdayStringFormat = function()
{
	var dataIeri ;


	dataIeri=new Date();
	dataIeri.setDate(dataIeri.getDate() - 1);
	var dataIeriGiorno=dataIeri.getDate();
	if (parseInt(dataIeriGiorno)<10){dataIeriGiorno = "0" + dataIeriGiorno.toString();}
	var dataIeriMese=dataIeri.getMonth()+1;
	if (parseInt(dataIeriMese)<10){dataIeriMese = "0" + dataIeriMese.toString(); }
	var dataIeriAnno=dataIeri.getFullYear();
	var dataIeriStringa= dataIeriAnno.toString() + dataIeriMese.toString() + dataIeriGiorno.toString();
	return dataIeriStringa;
};

// ritorna il giorno lavorativo precedente 
// nGiornoLavorativi può essere 5, 6 o 7
String.prototype.getPreviousBusinessDay = function(nGiornoLavorativi)
{
	var dataIeri ;

	var currentDate = new Date();
	var weekDay = currentDate.getDay();
	dataIeri = new Date();
	switch (nGiornoLavorativi){
		case 5:
			if(weekDay != 0 && weekDay != 1){
				// NON è nè domenica (0) nè lunedi (1)
				dataIeri.setDate(dataIeri.getDate() - 1);
			}
			else if(weekDay==0){
				// domenica
				dataIeri.setDate(dataIeri.getDate() - 2);
			}
			else if(weekDay==1){
				// lunedi
				dataIeri.setDate(dataIeri.getDate() - 3);
			}		
			break;
		case 6:
			if(weekDay != 1){
				// NON è nè domenica (0) nè lunedi (1)
				dataIeri.setDate(dataIeri.getDate() - 1);
			}
			else{
				// lunedi
				dataIeri.setDate(dataIeri.getDate() - 2);
			}		
			break;
		default:
			dataIeri.setDate(dataIeri.getDate() - 1);
			break;
	}
	var dataIeriGiorno=dataIeri.getDate();
	if (parseInt(dataIeriGiorno)<10){dataIeriGiorno = "0" + dataIeriGiorno.toString();}
	var dataIeriMese=dataIeri.getMonth()+1;
	if (parseInt(dataIeriMese)<10){dataIeriMese = "0" + dataIeriMese.toString(); }
	var dataIeriAnno=dataIeri.getFullYear();
	var dataIeriStringa= dataIeriAnno.toString() + dataIeriMese.toString() + dataIeriGiorno.toString();
	return dataIeriStringa;
};



String.prototype.getNextBusinessDay = function(nGiornoLavorativi)
{
	var dataDomani ;

	var currentDate = new Date();
	var weekDay = currentDate.getDay();
	dataDomani = new Date();
	switch (nGiornoLavorativi){
		case 5:
			if(weekDay != 0 && weekDay != 1){
				// NON è nè domenica (0) nè lunedi (1)
				dataDomani.setDate(dataDomani.getDate() + 1);
			}
			else if(weekDay==0){
				// domenica
				dataDomani.setDate(dataDomani.getDate() + 2);
			}
			else if(weekDay==1){
				// lunedi
				dataDomani.setDate(dataDomani.getDate() + 3);
			}		
			break;
		case 6:
			if(weekDay != 1){
				// NON è nè domenica (0) nè lunedi (1)
				dataDomani.setDate(dataDomani.getDate() + 1);
			}
			else{
				// lunedi
				dataDomani.setDate(dataDomani.getDate() + 2);
			}		
			break;
		default:
			dataDomani.setDate(dataDomani.getDate() + 1);
			break;
	}
	var dataDomaniGiorno=dataDomani.getDate();
	if (parseInt(dataDomaniGiorno)<10){dataDomaniGiorno = "0" + dataDomaniGiorno.toString();}
	var dataDomaniMese=dataDomani.getMonth()+1;
	if (parseInt(dataDomaniMese)<10){dataDomaniMese = "0" + dataDomaniMese.toString(); }
	var dataDomaniAnno=dataDomani.getFullYear();
	var dataDomaniStringa= dataDomaniAnno.toString() + dataDomaniMese.toString() + dataDomaniGiorno.toString();
	return dataDomaniStringa;
};



String.prototype.toItalianDateFormat = function()
{
	var strOutput ;
	try{
		if (this != ""){ 
			strOutput = this.substring(6,8) + "/" + this.substring(4,6) + "/" + this.substring(0,4);
		}
	}
	catch(e){
		strOutput = "!ERROR CONVERSION!";
	}
	return strOutput;
};


String.prototype.dateToStringFormat = function()
{
	var strOutput ;
	try{
		strOutput = this.substring(6,10) + this.substring(3,5) + this.substring(0,2);
	}
	catch(e){
		strOutput = "!ERROR CONVERSION!";
	}
	return strOutput;
};


String.prototype.toCharArray = function()
{
	var lista = new Array();
	var i=0;
	try{
		for (i=0;i<this.length;i++){
			lista.push(this.substring(i,i+1));
		}
	}
	catch(e){
	}
	return lista;
};

String.prototype.rightChar = function (n){ 
    if (n <= 0){
       return "";}
    else if (n > this.length){
       return str;}
    else {
       var iLen = this.length;
       return this.substring(iLen, iLen - n);
    }
}

String.prototype.escapeJson = function (str) {
	  return str.replace(/([\\]|[\"]|[\/])/g, "\\$1")
	            .replace(/[\b]/g, "\\b")
	            .replace(/[\f]/g, "\\f")
	            .replace(/[\n]/g, "\\n")
	            .replace(/[\r]/g, "\\r")
	            .replace(/[\t]/g, "\\t");
	}

// http://www.solutionbot.com/2008/06/20/javascript-dateadd-function/
Date.prototype.Add = function(strInterval, intIncrement)
{
	if(
			strInterval != "M"
				&& strInterval != "D"
					&& strInterval != "Y"
						&& strInterval != "h"
							&& strInterval != "m"
								&& strInterval != "uM"
									&& strInterval != "uD"
										&& strInterval != "uY"
											&& strInterval != "uh"
												&& strInterval != "um"
													&& strInterval != "us"
	)
	{
		throw("DateAdd: Second parameter must be M, D, Y, h, m, uM, uD, uY, uh, um or us");
	}

	if(typeof(intIncrement) != "number")
	{
		throw("DateAdd: Third parameter must be a number");
	}

	switch(strInterval)
	{
	case "M":
		this.setMonth(parseInt(this.getMonth()) + parseInt(intIncrement));
		break;

	case "D":
		this.setDate(parseInt(this.getDate()) + parseInt(intIncrement));
		break;

	case "Y":
		this.setYear(parseInt(this.getYear()) + parseInt(intIncrement));
		break;

	case "h":
		this.setHours(parseInt(this.getHours()) + parseInt(intIncrement));
		break;

	case "m":
		this.setMinutes(parseInt(this.getMinutes()) + parseInt(intIncrement));
		break;

	case "s":
		this.setSeconds(parseInt(this.getSeconds()) + parseInt(intIncrement));
		break;

	case "uM":
		this.setUTCMonth(parseInt(this.getUTCMonth()) + parseInt(intIncrement));
		break;

	case "uD":
		this.setUTCDate(parseInt(this.getUTCDate()) + parseInt(intIncrement));
		break;

	case "uY":
		this.setUTCFullYear(parseInt(this.getUTCFullYear()) + parseInt(intIncrement));
		break;

	case "uh":
		this.setUTCHours(parseInt(this.getUTCHours()) + parseInt(intIncrement));
		break;

	case "um":
		this.setUTCMinutes(parseInt(this.getUTCMinutes()) + parseInt(intIncrement));
		break;

	case "us":
		this.setUTCSeconds(parseInt(this.getUTCSeconds()) + parseInt(intIncrement));
		break;
	}
	return this;
}


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();


// http://blog.stevenlevithan.com/archives/date-time-format
// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


//**************************************************************
//*************** parte UNICODE ********************************
//**************************************************************

/*
valori unicode

apice
&#8216;
meno
&#8211;
3punti
&#8230;
doppi apice apertura
&#8220;
doppi apici chiusura
&#8221;

valore UTF-8

apice
&#39;
meno
&#45;
punto (uno solo)
&#46;
doppi apici
&#34;
 */
//volutamente ho tolto i ; dai primi valori
//perchè nel confronto non lo uso!!
var lstUnicodeCharToConvert = [['&#8216','&#39;'],['&#8211','&#45;'],['&#8230','&#46;&#46;&#46;'],['&#8220','&#34;'],['&#8221','&#34;']];
//JavaScript Document

/**
 * Convert a string to character references.
 *
 * @example "JavaScript".toCharRefs()
 * @result "&#74;&#97;&#118;&#97;&#83;&#99;&#114;&#105;&#112;&#116;"
 *
 * @name toCharRefs
 * @return String
 */
String.prototype.toCharRefs = function() {
	var charRefs = [];

	var codePoint;
	for( var i = 0; i < this.length; i++ ) {
		codePoint = this.charCodeAt(i);

		//if is high surrogate
		if( 0xD800 <= codePoint && codePoint <= 0xDBFF ) {
			i++;
			codePoint = 0x2400 + ((codePoint - 0xD800) << 10) + this.charCodeAt(i);
		}

		charRefs.push( '&#' + codePoint + ';' );
	}

	return charRefs.join('');
};


String.prototype.getUTF8value = function(){
	var strOutput = "";
	var value = "";
	var lista ;
	var esito = "";

	var codificato = false;
	var carattereConvertito = "";

	try{
		lista = this.toCharRefs().split(";");
		for (var i = 0; i < lista.length ; i++){
			codificato = false;
			carattereConvertito = "";
			for (var k=0 ; k < lstUnicodeCharToConvert.length ; k++){
				if (lista[i] == lstUnicodeCharToConvert[k][0]){
					// è uguale
					// quindi converto
					codificato = true;
					carattereConvertito = lstUnicodeCharToConvert[k][1];
					break;
				}
				else{
					codificato = false;					
				}
			}
			if (codificato){
				strOutput += carattereConvertito;
			}
			else{
				strOutput += lista[i];				
			}
		}
		//alert(strOutput);
		//esito = String.fromCharRefs(strOutput);
		esito = strOutput;
	}
	catch(e){
		alert(e.description);
	}

	return esito;
};

/**
 * Convert character references to a string.
 *
 * @example String.fromCharRefs("&#74;&#97;&#118;&#97;&#83;&#99;&#114;&#105;&#112;&#116;")
 * @result "JavaScript"
 *
 * @name fromCharRefs
 * @return String
 */
String.fromCharRefs = function(str) {
	var element = document.createElement("div");
	element.innerHTML = str;
	return element.firstChild.data;
};
//**************************************************************

//encodingType: indica il tipo di conversione (sorgente)
//valori possibili: xml, base64, url, js, none
//charsetType: charset di destinazione
//valori: us_ascii, iso_8859_1, utf_8, none
function convertCharSet(valueToParse, encodingType, charsetType, encode) {
	var encodingName ;
	var charsetName ;


	encodingName = encodingType;
	charsetName = charsetType;
	var encoding = encodings[encodingName];
	var charset = charsets[charsetName];


	if (charset.name == 'none') {
		charsetName = 'us_ascii';
		charset = charsets[charsetName];
	}

	var input = valueToParse;
	var output;

	//alert(encoding.supportsNone +" " +charset.name + " " + encode); 

	if (encode) {
		output = encoding.encode(input, charset);
	} else {
		output = encoding.decode(input, charset);
	}
	//document.getElementById('output').value = output;
	return output;
}

var charsets = {
		none : {
			name : 'none',
			containsChar : function(c) {
				return false;
			}
		},
		us_ascii : {
			name : 'US-ASCII',
			containsChar : function(c) {
				return c.charCodeAt(0) < 128;
			}
		},
		iso_8859_1 : {
			name : 'ISO-8859-1',
			containsChar : function(c) {
				return c.charCodeAt(0) < 256;
			}
		},
		utf_8 : {
			name : 'UTF-8',
			containsChar : function(c) {
				return true;
			}
		}
}

var encodings = {
		base64 : {
			printable : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
			supportsNone : false,
			encode : function(input, charset) {
				input = encodings.none.encode(input, charset);

				if (typeof btoa == 'function') {
					var s = btoa(input);
					var output = new Array(Math.ceil(s.length / 76));
					for (var p = 0, k = 0; p < s.length; p += 76) {
						output[k++] = s.substr(p, 76);
					}
					return output.join('\n');
				}
				var iterations = Math.ceil(input.length * 4 / 3);
				var output = new Array(iterations + Math.ceil(iterations / 76) + 1);
				input += '\0';
				var j = 8, b = input.charCodeAt(0), p = 0, k = 0;
				for (var i = 0; i < iterations; i++) {
					if (j < 6) {
						b = (input.charCodeAt(p) << 8) + input.charCodeAt(p + 1);
						p++;
						j += 2;
					} else {
						j -= 6;
					}
					output[k++] = this.printable.substr((b >> j) & 0x3F, 1);
					if (i % 76 == 75) {
						output[k++] = '\n';
					}
				}
				output[k++] = '=='.substr((1 + input.length) % 3);
				return output.join('');
			},
			decode : function(input, charset) {
				var equalCount = input.length - input.search(/={0,2}$/);
				input = input.replace(/(\s|={1,2}$)/g, '');
				var iterations = Math.floor(input.length * 3 / 4);
				var output = new Array(iterations);
				input += '\0';
				var j = 2, d = '', p = 0, k = 0, error = false;
				for (var i = 0; i < iterations; i++) {
					var b1 = this.printable.indexOf(input.charAt(p)) << j;
					var b2 = this.printable.indexOf(input.charAt(p + 1)) >> (6 - j);
					if (b1 == -1 || b2 == -1) {
						error = 'invalid input at character ' + (b1 == -1 ? p : p + 1);
					}
					output[k++] = String.fromCharCode((b1 + b2) & 0xFF);
					j = j % 6 + 2;
					p += (j == 2 ? 2 : 1);
				}
				// Look for trailing non-zero bits.
				if (!error && p < input.length - 1 && (this.printable.indexOf(input.charAt(p)) << j) & 0xFF) {
					error = 'invalid input (trailing non-zero bits)';
				}
				var expectedEqualCount = (3 - (iterations % 3)) % 3;
				if (!error & equalCount != expectedEqualCount) {
					error = 'invalid input (' + (expectedEqualCount == 0 ? 'no' : expectedEqualCount) + ' trailing "=" expected)';
				}
				if (error) {
					output[k++] = '\n' + error;
				}
				return encodings.none.decode(output.join(''), charset);
			}
		},
		xml : {
			supportsNone : true,
			encode : function(input, charset) {
				var output = '';
				for (var i = 0; i < input.length; i++) {
					var j = '<>"&\''.indexOf(input.charAt(i));
					if (j != -1) {
						output += '&' + ['lt', 'gt', 'quot', 'amp', '#39'][j] + ';';
					} else if (!charset.containsChar(input.charAt(i))) {
						output += '&#' + input.charCodeAt(i) + ';';
					} else {
						output += input.charAt(i);
					}
				}
				return output;
			},
			decode : function(input, charset) {
				var strOutput = "";
				try{
					strOutput = jQuery('<pre>' + input.replace(/</g, '&lt;') + '</pre>').text()
				}
				catch(e){
					alert("decode - Error: ") + e.description;
				}
				return strOutput;
			}
		},
		url : {
			supportsNone : true,
			encode : function(input, charset) {
				return charset.name == 'UTF-8' ? encodeURIComponent(input) : escape(input).replace(/\+/g, '%2B');
			},
			decode : function(input, charset) {
				input = input.replace(/\+/g, ' ');
				return charset.name == 'UTF-8' ? decodeURIComponent(input) : unescape(input);
			}
		},
		js : {
			supportsNone : true,
			encode : function(input, charset) {
				var output = '';
				for (var i = 0; i < input.length; i++) {
					var j = '\b\t\n\v\f\r"\'\\'.indexOf(input.charAt(i));
					if (j != -1) {
						output += '\\' + 'btnvfr"\'\\'.substr(j, 1);
					} else if (input.substr(i, 2) == '</') {
						output += '<\\/';
						i++;
					} else if (!charset.containsChar(input.charAt(i))) {
						if (input.charCodeAt(i) > 255) {
							output += '\\u' + ('000' + input.charCodeAt(i).toString(16)).right(4);
						} else {
							output += '\\x' + ('0' + input.charCodeAt(i).toString(16)).right(2);
						}
					} else {
						output += input.charAt(i);
					}
				}
				return output;
			},
			decode : function(input, charset) {
				try {
					return !/([^\\]'|\r|\n)/.test(input)? eval("'" + input + "'") : false;
				} catch(e) {
					return false;
				}
			}
		},
		none : {
			supportsNone : false,
			encode : function(input, charset) {
				var output = [];
				if (charset.name == 'UTF-8') {
					var bytes = string2utf8bytearray(input);
					for (var i = 0; i < bytes.length; i++) {
						output.push(String.fromCharCode(bytes[i]));
					}   
					return output.join('');
				} else {
					return input.replace(/[^\x00-\xFF]/, '?');
				}
			},
			decode : function(input, charset) {
				if (charset.name != 'UTF-8') {
					return input;
				}
				var output = [];
				for (var i = 0; i < input.length; i++) {
					var c = input.charCodeAt(i);
					if (c <= 0x7F) {
						output.push(input.substr(i, 1));
					} else if (0xC0 <= c && c <= 0xDF) {
						var c2 = input.charCodeAt(++i);
						if (0x80 <= c2 && c2 <= 0xBF) {
							var o = ((c & 0x1F) << 6) + (c2 & 0x3F);
							output.push(String.fromCharCode(o));
						} else {
							return 'invalid input';
						}
					} else if (0xE0 <= c && c <= 0xEF) {
						var c2 = input.charCodeAt(++i);
						var c3 = input.charCodeAt(++i);
						if (0x80 <= c2 && c2 <= 0xBF &&
								0x80 <= c3 && c3 <= 0xBF) {
							var o = ((c & 0xF) << 12) + ((c2 & 0x3F) << 6) + (c3 & 0x3F);
							output.push(String.fromCharCode(o));
						} else {
							return 'invalid input';
						}

					} else if (0xE0 <= c && c <= 0xEF) {
						var c2 = input.charCodeAt(++i);
						var c3 = input.charCodeAt(++i);
						var c4 = input.charCodeAt(++i);
						if (0x80 <= c2 && c2 <= 0xBF &&
								0x80 <= c3 && c3 <= 0xBF &&
								0x80 <= c4 && c4 <= 0xBF) {
							var o = ((c & 7) << 18) + ((c2 & 0x3F) << 12) + ((c2 & 0x3F) << 6) + (c4 & 0x3F);
							output.push(String.fromCharCode(o));
						} else {
							return 'invalid input';
						}

					} else {
						return 'invalid input';
					}
				}
				return output.join('');
			}
		}
}

function string2utf8bytearray(s) {
	// We need to allocate at least one byte per character.
	var output = new Array(s.length);
	for (var i = 0, j = 0; i < s.length; i++) {
		var c = s.charCodeAt(i);
		if (c < 0x7F) {
			output[j++] = c;
		} else if (c < 0x7FF) {
			output[j++] = 0xC0 + (c >> 6);
			output[j++] = 0x80 + (c & 0x3F);
		} else if (c < 0xFFFF) {
			output[j++] = 0xE0 + (c >> 12);
			output[j++] = 0x80 + ((c >> 6) & 0x3F);
			output[j++] = 0x80 + (c & 0x3F);
		} else if (c < 0x10FFFF) {
			output[j++] = 0xF0 + (c >> 18);
			output[j++] = 0x80 + ((c >> 6) & 0x3F);
			output[j++] = 0x80 + ((c >> 12) & 0x3F);;
			output[j++] = 0x80 + (c & 0x3F);
		}
	}
	return output;
}





String.prototype.cutAndPad = function(numCaratteri, suffixString){
	
	var strOutput="";
	var appendoSuffisso = false;
	if (isNaN(numCaratteri)){
		return this;
	}
	try{
		if (parseInt(this.toString().length) <= parseInt(numCaratteri)){
			appendoSuffisso = false;
		}
		else{
			appendoSuffisso = true;
		}
		if (appendoSuffisso){
			if (suffixString=="" || typeof(suffixString)=="undefined"){suffixString = "...";}
			strOutput = this.substr(0,numCaratteri) + suffixString;
		}
		else{
			strOutput = this;
		}
	}
	catch(e){
		strOutput = this;
	}
	return strOutput;
}


