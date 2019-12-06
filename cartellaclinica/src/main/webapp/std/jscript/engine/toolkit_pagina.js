function _setVisibilityCampo(campi, stato)
{
	var a_campi = campi.split(',');

	for(var idx = 0; idx < a_campi.length; idx++)
	{
		if(typeof document.all[a_campi[idx]] != 'undefined')
		{
			document.all[a_campi[idx]].style.visibility = stato;
		}
	}

}

function _setVisibilityColumnCampo(campi, stato_campo, stato_colonna)
{
	var a_campi = campi.split(',');

	for(var idx = 0; idx < a_campi.length; idx++)
	{
		if(typeof document.all[a_campi[idx]] != 'undefined')
		{
			if(typeof document.all[a_campi[idx]].length != 'undefined')
			{
				if(document.all[a_campi[idx]][0].type == 'radio')
				{
					document.all[a_campi[idx]][0].parentElement.style.display = stato_colonna;
				}
				else
				{
					document.all[a_campi[idx]].parentElement.style.display = stato_colonna;
				}
			}
			else
			{
				document.all[a_campi[idx]].parentElement.style.display = stato_colonna;
			}
		}
	}
}

function _setVisibilityRowCampo(campi, stato_riga)
{
	var a_campi = campi.split(',');

	for(var idx = 0; idx < a_campi.length; idx++)
	{
		if(typeof document.all[a_campi[idx]] != 'undefined')
		{
			if(typeof document.all[a_campi[idx]].length != 'undefined')
			{
				if(document.all[a_campi[idx]][0].type == 'radio')
				{
					document.all[a_campi[idx]][0].parentElement.parentElement.style.display = stato_riga;
				}
				else
				{
					for(var i = 0; i < document.all[a_campi[idx]].length; document.all[a_campi[idx]](i++).parentElement.parentElement.style.display = stato_riga);
				}
				//document.all[a_campi[idx]].parentElement.parentElement.style.display = stato_riga;
			}
			else
			{
				document.all[a_campi[idx]].parentElement.parentElement.style.display = stato_riga;
			}
		}
	}
}

function _setVisibilityDiv(id, stato_div)
{
	var a_div = id.split(',');

	for(var idx = 0; idx < a_div.length; idx++)
	{
		obj = typeof document.all[a_div[idx]] == 'undefined' ? document.getElementsByName(a_div[idx]):document.all[a_div[idx]];
		if(typeof obj != 'undefined')
		{
			obj.style.display = stato_div;
		}
	}
}

function _generaSequenzaNomi(campo, idx_start, idx_end)
{
	var seq_ret = '';

	for(var idx = parseInt(idx_start, 10); idx <= parseInt(idx_end, 10); idx++)
	{
		if(seq_ret != '')
		{
			seq_ret += ',';
		}

		seq_ret += campo + idx;
	}

	return seq_ret;
}

function setVisibilityPage()
{
	document.body.style.visibility = 'visible';
}

function nascondiCampo(campi)
{
	_setVisibilityCampo(campi, 'hidden');
}

function visualizzaCampo(campi)
{
	_setVisibilityCampo(campi, 'visible');
}

function nascondiColonnaCampo(campi)
{
	_setVisibilityColumnCampo(campi, 'hidden', 'none');
}

function visualizzaColonnaCampo(campi)
{
	_setVisibilityColumnCampo(campi, 'visible', 'block');
}

function nascondiRigaCampo(campi)
{
	_setVisibilityRowCampo(campi, 'none');
}

function visualizzaRigaCampo(campi)
{
	_setVisibilityRowCampo(campi, 'block');
}

function nascondiRigaRangeCampo(campo, idx_start, idx_end)
{
	_setVisibilityRowCampo(_generaSequenzaNomi(campo, idx_start, idx_end), 'none');
}

function visualizzaRigaRangeCampo(campo, idx_start, idx_end)
{
	_setVisibilityRowCampo(_generaSequenzaNomi(campo, idx_start, idx_end), 'block');
}

function nascondiBloccoDiv(div)
{
	_setVisibilityDiv(div, 'none');
}

function visualizzaBloccoDiv(div)
{
	_setVisibilityDiv(div, 'block');
}

function allargaCampo(campi, dimensione)
{
	var idx;
	var a_campi;

	if(typeof dimensione == 'undefined')
	{
		dimensione = '100%';
	}

	a_campi = campi.split(',');

	for(idx = 0; idx < a_campi.length; idx++)
	{
		if(a_campi[idx] != '')
		{
			if(typeof document.all[a_campi[idx]] != 'undefined')
			{
				document.all[a_campi[idx]].style.width = dimensione;
			}
		}
	}
}

function setCheckedCampo(nome, indice)
{
	try
	{
		if (!document.all[nome](0).disabled) {
			document.all[nome](indice).checked = true;
			document.all[nome](indice).onclick();
		}
	}
	catch(ex)
	{
	}
}

//funzione che controlla se un elemento è associato alla classe
function hasClass(elemento,classe)
{
	if (elemento && typeof elemento.className === 'string')
		return elemento.className.match(new RegExp('(\\s|^)'+classe+'(\\s|$)'));
	return false;
}

//funzione che aggiunge una classe all'elemento
function addClass(elemento,classe)
{
	if(elemento && !hasClass(elemento,classe))
	{
		elemento.className += " "+classe;
	}
}

//funzione che rimuove la classe all'elemento
function removeClass(elemento,classe)
{
	if(elemento && hasClass(elemento,classe))
	{
		var reg=new RegExp('(\\s|^)'+classe+'(\\s|$)');
		elemento.className=elemento.className.replace(reg,' ');
	}
}

//funzione che controlla l'ora sull'onblur
function oraControl_onblur(pCampo){
	
	var campo = typeof pCampo =='undefined'?event.srcElement:pCampo;
	if (campo.value == '') return;
	
	var ora = campo.value.match(/^([01]\d|2[0-3])[\:\.\;\@]([0-5]\d)$/);
	if (ora == null) {
		alert('Immettere l\'ora nel formato corretto HH:MM');
		campo.value='';
		campo.focus();
		return;
	}
	
	//alert('ore:\t' + ora[1] + '\nminuti:\t' + ora[2]);
}

//funzione che controlla l'ora sull'onkeyup
function oraControl_onkeyup(pCampo){

	var campo = typeof pCampo =='undefined'?event.srcElement:pCampo;
	var ora=campo.value;
	var oraReplace=ora.replace(/:/gi,"");

	//alert(event.keyCode);

	if(event.keyCode==110 || event.keyCode==190 || event.keyCode==188 || event.keyCode==189 || event.keyCode==192){
		//controllo su '.'(da tastierino e non) , ',' , '-' , 'ò'
		campo.value='';
		campo.value=ora.substring(0,ora.length-1);
		return;

	}

	if (ora.substring(3,5)>59 || ora.substring(3,5)<0){

		campo.value=ora.substring(0,3);
		return;

	}

	if (ora.length>2){

		campo.value=oraReplace.substring(0,2)+':'+oraReplace.substring(2,4);
		return;

	}


	if (ora.length>5){

		campo.value=campo.value.substring(0,5);

	}

	if (ora.substring(0,2)>23 || ora.substring(0,2)<0){
		if(ora.substring(0,1)<=2){
			campo.value=ora.substring(0,1);
			return;
		}else{

			campo.value='';
			ora='0'+oraReplace.substring(0,oraReplace.substring(0,3));
			campo.value=ora.substring(0,2)+':'+ora.substring(2,4);
			return;
		}
	}
}


/**
 * Funzione di callback che controlla il numero dei caratteri, da chiamare sull'onblur o sull'onkeyup. 
 * 
 * @param obj             oggetto di cui si vuole controllare la lunghezza
 * @param length          valore massimo di caratteri accettato
 * @param msg             messaggio da visualizzare
 * @param cancellaSiNo    (opzionale) se non è definito, la scelta viene effettuata dall'utente altrimenti se è true il testo
 *                        in eccesso viene troncato, se è false viene mantenuto invariato 
 */
function maxlength(obj, length, msg, cancellaSiNo) {
	if (typeof obj != undefined && obj.value != '' && obj.value.length > length) {
		var displayMsg = typeof msg === "string";
		
		// Non chiede all'utente: riduce o meno la lunghezza in funzione del valore passato come parametro
		if (typeof cancellaSiNo === "boolean") {
			if (cancellaSiNo == true) {
				if (displayMsg) alert(msg);
				obj.value=obj.value.substring(0,length); //cancellazione dei caratteri in eccesso
			} else {
				if (displayMsg) alert(msg);
				obj.focus();
			}
		} else{ // Chiede all'utente
			cancellaSiNo = confirm(msg);
			if (cancellaSiNo) {
				obj.value=obj.value.substring(0,length); //cancellazione dei caratteri in eccesso
			} else {
				obj.focus();
			}
		}
	}
}

function setVeloNero(id,appendToElement) {
	obj = document.getElementById(id);
	var objPosition = $(obj).position();
	var objWidth = $(obj).width();
	var objHeight = $(obj).height();
	var div = document.createElement('div');
	$(div).attr('class', 'velonero');
	$(div).attr('name', obj.id);
	//se typeof appendToElement==undefined lo appende al body(di solito su un iframe)
	if (typeof appendToElement=='undefined')
		document.body.appendChild(div);
	else
		obj.appendChild(div);
	$(div).css({'position':'absolute','top':objPosition.top,'left':objPosition.left});
	$(div).height(objHeight);
	$(div).width(objWidth);
}

function removeVeloNero(id) {
	$('div.velonero[name="'+id+'"]').remove();
};

function IsNumeric(sText){
	var ValidChars = "0123456789.-";
	return check.charsInString(sText,ValidChars);
}

function IsNaturalNumber(sText) {
	var ValidChars = "0123456789";
	return check.charsInString(sText,ValidChars);
}

var check = {
	charsInString : function(pText,pValidChars) {
		var IsNumber=true;var Char;
		for (var i = 0; i < pText.length && IsNumber == true; i++){ 
			Char = pText.charAt(i); 
			if (pValidChars.indexOf(Char) == -1){IsNumber = false;}
		}
		return IsNumber;
	}
};

//funzione che chiude i fieldset
function HideLayerFieldset(div){
	
	var object=jQuery("#"+div).prev();
	addEventFieldset(object);
	//document.getElementById(div).style.display='none';
	
}