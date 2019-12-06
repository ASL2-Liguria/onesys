// JavaScript Document
// funzione che rimuove un elemento
// da un array cercandolo ciclicamente
/*
Array.prototype.removeByElement(arrayElement)
 {
    for(var i=0; i<this.length;i++ )
     { 
        if(this[i]==arrayElement)
            this.splice(i,1); 
      } 
  }
  */

// prototipo di Array per cancellare
// tutti gli elementi
Array.prototype.deleteAll = function()
{
	if (this.length<1){return;}
	try{
		this.splice(0,this.length-1);
	}
	catch(e){
		;
	}
}


// funzione che rimuove un 
// elemento dall'array in base all'indice
// e restituisce una array compatto (e non sparso)
function removeElementFromArray(arrayIn, indice){
	var i=0;
	var arrayOutput = new Array(arrayIn.length-1);
	var bolSaltato = false;
	
	for (i=0;i<arrayIn.length;i++){
		if (i==indice){
			bolSaltato = true;
		}
		else{
			if (!bolSaltato){
				arrayOutput[i] = arrayIn[i];
			}
			else{
				arrayOutput[i-1] = arrayIn[i];
			}
		}
	}
	return arrayOutput;
}

function addElementToArray(arrayIn,oggetto){

	var i=0;
	var arrayOutput = new Array(arrayIn.length);
	
	
	for (i=0;i<arrayIn.length;i++){
		arrayOutput[i] = arrayIn[i];
	}
	arrayOutput[arrayIn.length]=oggetto;
	return arrayOutput;
}


function removeElementFromArrayOfArrayByIndex(vettore, indice){
	var lista 
	var strTmp ="";
	var myArray =  new Array(vettore.length-1);
	var bolCancellato = false;
	
	
	try{
		if (vettore){
			for (var i=0; i<vettore.length; i++){
				if (i!=indice){
					// copio nella nuova matrice
					if (!bolCancellato){
						myArray[i] = vettore[i];
					}
					else{
						myArray[i-1] = vettore[i];					
					}
						
				}
				else{
					bolCancellato = true;
				}
			}
		}
	}
	catch(e){
		alert("removeElementFromArrayByIndex " + e.description);
	}
	return myArray ;
}




Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
        throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
        return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
            n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
    }
    if (n >= len) {
        return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
            return k;
        }
    }
    return -1;
}


// esempio
// [1,2,3,4,5,6].diff( [3,4,5] );  
// => [1, 2, 6]
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};
