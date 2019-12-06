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
		obj = typeof document.all[a_div[idx]] == 'undefined' ? document.getElementsByName(a_div[idx]):document.all[a_div[idx]]
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
	return elemento.className.match(new RegExp('(\\s|^)'+classe+'(\\s|$)'));
}

//funzione che aggiunge una classe all'elemento
function addClass(elemento,classe)
{
	if(!hasClass(elemento,classe))
	{
		elemento.className += " "+classe;
	}
}

//funzione che rimuove la classe all'elemento
function removeClass(elemento,classe)
{
	if(hasClass(elemento,classe))
	{
		var reg=new RegExp('(\\s|^)'+classe+'(\\s|$)');
		elemento.className=elemento.className.replace(reg,' ');
	}
}

//funzione che controlla l'ora sull'onblur
function oraControl_onblur(pCampo){
	var campo = typeof pCampo =='undefined'?event.srcElement:pCampo;
	var ora=campo.value;
	var oraRep=ora.replace(/\./gi,"");
	var oraReplace=oraRep.replace(/\.\,@?\;/gi,"");
	if (campo.value==''){}else{

		/*	if (oraReplace>ora){
			campo=oraReplace;
			return;

		}*/
		if (ora.length!=5 || ora.substring(2,3)!=':'){

			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;

		}

		try{
			if (isNaN(parseInt(ora.substring(0,2),10))||isNaN(parseInt(ora.substring(3,5),10))){

				alert('Il valore immesso non è un numero!');
				campo.value='';
				campo.focus();
				return;

			}
		}catch(e){
			//alert(e.description);
		}


		if (ora.substring(0,2)>23 || ora.substring(0,2)<0){
			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;
		}

		if (ora.substring(3,5)>59 || ora.substring(3,5)<0){

			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;

		}
	}
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


//funzione che controlla il numero dei caratteri. Da mettere sull'onblur.
//Se non viene passato il valore cancellaSiNo chiede se cancellare o meno. Se viene passato il valore cancellaSiNo in caso S, cancella il campo
//riportando il tutto a 4000 caratteri, in caso di N non cancella. Se non viene passato chiede con un confirm
function maxlength(obj,length,msg,cancellaSiNo){

	var canc='';

	if(typeof cancellaSiNo == 'undefined'){
		canc='';
	}else{
		canc=cancellaSiNo;
	}

	if (typeof obj != undefined && obj.value != ''){

		if (obj.value.length > length){

			//alert('Numero caratteri del testo inserito: '+obj.value.length);
			msg = 'Numero caratteri del testo inserito: '+obj.value.length + '\n\n' + msg;

			if (canc == ''){

				msg += '\n\nRiportare il testo alla lunghezza corretta (i caratteri in eccesso verranno cancellati)?';

				if (confirm(msg)){

					canc='';
					obj.value=obj.value.substring(0,length); //cancellazione dei caratteri in eccesso

				}else{

					canc='N';
				}
			}

			if (canc == 'S'){

				alert(msg);
				obj.value=obj.value.substring(0,length); //cancellazione dei caratteri in eccesso

			}else if (canc == 'N'){

				alert(msg);
			}

			obj.focus();
			return;

		}else{
			//alert('lunghezza del testo inserito: '+obj.value.length);
		}

	}else{
		//alert('type dell\'oggetto: '+typeof obj);
	}
}

function setVeloNero(id) {
	obj = document.getElementById(id);
	var objPosition = $(obj).position();
	var objWidth = $(obj).width();
	var objHeight = $(obj).height();
	var div = document.createElement('div');
	div.className='velonero';
	div.name=obj.id;
	document.body.appendChild(div);
	$(div).css({'position':'absolute','top':objPosition.top,'left':objPosition.left});
	$(div).height(objHeight);
	$(div).width(objWidth);
	return 'ok';
}

function removeVeloNero(id) {
	$('div.velonero[name="'+id+'"]').remove();
};

