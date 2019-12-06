/**
 * Set di funzioni per recuperare le preferenze dell'utente configurate su IMAGOWEB.ATTRIBUTI.
 * E' possibile leggere/scrivere uno o più attributi passando una stringa o un array di stringhe.
 *
 * @author  gianlucab
 * @since   2015-03-16
 * @version 1.0
 */
function getAttributo(attributo) {
	var strAttributo = (attributo instanceof Array) ? attributo.join(',') : attributo;
	strAttributo = strAttributo != null ? strAttributo.split(/\s?,\s?/).join(',') : '';
	var valore = '';
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml", 'getAttribute', [baseUser.LOGIN, strAttributo], 1, callback);
	dwr.engine.setAsync(true);
	
	function callback(resp) {
		if(resp[0]=='OK') {
			valore = resp[2];
		} else{
			alert(resp[1]);
		}
	}
	
	if (valore == null) valore = '';
	valore = valore.split(/\s?,\s?/);
	return valore.length > 1 ? valore : valore[0];
}

function setAttributo(attributo, valore) {
	var strAttributo = (attributo instanceof Array) ? attributo.join(',') : attributo;
	var strValore = (valore instanceof Array) ? valore.join(',') : valore;
	strAttributo = strAttributo != null ? strAttributo.split(/\s?,\s?/).join(',') : '';
	strValore = strAttributo != null ? strValore.split(/\s?,\s?/).join(',') : '';
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml", 'setAttribute', [baseUser.LOGIN, strAttributo, strValore], 0, callback);
	dwr.engine.setAsync(true);
	
	function callback(resp) {
		if(resp[0]!='OK') {
			alert(resp[1]);
		}
	}
}

function existsAttributo(attributo, valore) {
	if (typeof valore === 'undefined') valore = getAttributo(attributo);
	
	var strAttributo = (attributo instanceof Array) ? attributo.join(',') : attributo;
	var strValore = (valore instanceof Array) ? valore.join(',') : valore;
	
	var ret = [];
	var arr = strAttributo != null ? strAttributo.split(/\s?,\s?/) : null;
	if (arr == null || valore == null) return false;
	
	for (var i=0, length = arr.length; i<length; i++) {
		ret.push(strValore.indexOf(arr[i]) >= 0 ? true : false);
	}
	
	return ret.length > 1 ? ret : ret[0];
}