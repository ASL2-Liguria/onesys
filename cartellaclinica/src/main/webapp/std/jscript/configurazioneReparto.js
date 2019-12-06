/**
 * @author: linob
 * @date: 2015-05-08
 */

/**
 * NameSpace per la nuova gesione delle configurazioni su cache.
 */
var configurazioneReparto ={
		
	getValue:function(reparto,key,ricovero){
		var valuereturn;
		try {
			dwr.engine.setAsync(false);
			if (typeof baseReparti[reparto] == 'undefined') {
				/*Le cerco nella pagina html*/
				dwrUtility.getConfigurazioneReparto(reparto, function(resp) {
					if (resp[0] == 'OK')
						eval('baseReparti[reparto]=' + resp[1]);
					else
						alert(resp[1]);
				});
			}

			if (typeof baseReparti[reparto][key] == 'undefined') {
				/*Prima cerco all'interno dell'oggetto webserver salvato in cache*/
				dwrUtility.getValoreConfigurazioneReparto(reparto, key, ricovero, function(resp){
					if (resp[0] == 'OK'){
						baseReparti[reparto][key] = resp[2]==null?'':resp[2];
						valuereturn = baseReparti[reparto][key];
					}
					else{
						alert(resp[0]+'\n'+resp[1]);
					}
				});
				
			}else if(typeof (baseReparti[reparto][key])=='object'){
				/*Configurazione per reparto + ricovero*/
				valuereturn = baseReparti[reparto][key][configurazioneReparto.getCodiceRicoveroTranscodifica(ricovero,baseReparti[reparto][key])];
			}else{
				/*Configurazione per reparto*/
				valuereturn = baseReparti[reparto][key]
			}
			dwr.engine.setAsync(true);
			return valuereturn;
		} catch (e) {
			return null;
		}
	},
	
	
	getCodiceRicoveroTranscodifica:function(pRicovero,objReparto){
		var ricoveroreturn = '';
		if (typeof(pRicovero) =='undefined'){
			ricoveroreturn='ALL';
		}else{
			var arrayKeys = Object.keys(objReparto);
			for (var i=0;i<=arrayKeys.length;i++){
				if (arrayKeys[i]==pRicovero){
					ricoveroreturn = pRicovero;
				}
			}
			if (ricoveroreturn==''){
				ricoveroreturn='ALL';
			}
		}
		return ricoveroreturn;
	}
}

/*Utilità*/
if (!Object.keys) {
	  Object.keys = (function () {
	    'use strict';
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString',
	          'toLocaleString',
	          'valueOf',
	          'hasOwnProperty',
	          'isPrototypeOf',
	          'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;

	    return function (obj) {
	      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        throw new TypeError('Object.keys called on non-object');
	      }

	      var result = [], prop, i;

	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) {
	          result.push(prop);
	        }
	      }

	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
	  }());
	}