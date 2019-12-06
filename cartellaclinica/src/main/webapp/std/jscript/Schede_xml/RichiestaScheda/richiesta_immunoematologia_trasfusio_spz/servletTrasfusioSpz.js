var _METODICA;
var vFunicolo='N';
var countChecked=0;

$(document).ready(function(){
	try{ricordaEsami();}catch(e){}
	_METODICA = NS_UTILITY.getUrlParameter('METODICA');
	
	$(':checkbox').each(function () {
		if ($(this).is(':checked')) {
			countChecked+=1; 
			if ($(this).attr('funicolo')=='S'){
				vFunicolo='S';
			}
        }
	});
	
	$(':checkbox').click(function(){
		if ($(this).is(':checked')) {
			if ($(this).attr('funicolo')=='S'){
				if(countChecked>0){
					alert('Attenzione, non è possibile richiedere il Profilo Funicolo assieme ad altri esami');
					$(this).attr('checked', false);
					return;
				}
				vFunicolo='S';
			}
			else{
				if(vFunicolo=='S'){
					alert('Attenzione, non è possibile richiedere il Profilo Funicolo assieme ad altri esami');
					$(this).attr('checked', false);
					return;
				}
			}
			countChecked+=1;
		}
		else{
			countChecked-=1;
			vFunicolo='N';
		}
	});
    
});

function checkSessoPz(){
	
	// CHECK SESSO x FUNICOLO
	var idenAnagPz =  opener.document.getElementById('Hiden_anag').value;
	var sessoPz = '';
	
	if(idenAnagPz != null){
		var sql='SELECT SESSO from radsql.ANAG where iden=' + idenAnagPz;
		
		dwr.engine.setAsync(false);	
		toolKitDB.getResultData("select (" + sql + ") from dual", callBack);
		dwr.engine.setAsync(true);
		
		function callBack(resp){
			sessoPz = resp.toString();		
		}
	}	
	return sessoPz;
}
function svuotaListBox(elemento){
	
	var object;
	var indice;
	
	if (typeof elemento == 'String'){		
		object = document.getElementById(elemento);
	}else{
		object = elemento;
	}
	
	if (object){
		indice = parseInt(object.length);
		while (indice>-1){
			object.options.remove(indice);
			indice--;
		}
	}
}

function DeselezionaTutto() {	
	
	var chk	= document.getElementsByName("chkEsami");
	
	for (var i=0; i<chk.length;i++){		
		if (chk[i].checked){			
			chk[i].checked = false;		
		}
	}	

	var chkP=document.getElementsByName("chkProfilo");
		
	for (var i=0; i<chkP.length;i++){		
		if (chkP[i].checked){			
			chkP[i].checked = false;		
		}
	}
}

// RIPORTA ESAMI SELEZIONATI
function arrayEsami( n, STATO_CAMPO){
	
	var myListBox	= document.createElement('select');
	
	myListBox.id			= 'cmbPrestRich_L';
	myListBox.name			= 'cmbPrestRich_L';
	myListBox.style.width 	= '100%';
	myListBox.setAttribute('STATO_CAMPO',STATO_CAMPO);
	myListBox.setAttribute('multiple','multiple');

	svuotaListBox(myListBox);
	
	var chk 			= document.getElementsByName("chkEsami");					// raccolgo tutti gli elementi con quel nome
	var idEsami 		= '';													
	var optArray 		= new Array ();												// istanzio un nuovo array
	var valoreFunicolo 	= 0;	
	sessoPz 			= checkSessoPz();
		
	for (var i=0; i<chk.length;i++)
	{	
		if (chk[i].checked && chk[i].funicolo == 'N'){			
			
			myListBox.options[myListBox.options.length] = new Option(chk[i].descr_esa, chk[i].id + '@T@0' );
			idEsami += chk[i].id + '#';
			opener.document.all['Hmateriali'].value +=  '0#';
		
		}else if(chk[i].checked && chk[i].funicolo == 'S' && sessoPz == 'F'){
			
			myListBox.options[myListBox.options.length] = new Option(chk[i].descr_esa, chk[i].id + '@T@0' );
			idEsami += chk[i].id + '#';			
			opener.document.all['Hmateriali'].value +=  '0#';
			valoreFunicolo = 1;
		
		}else if(chk[i].checked && chk[i].funicolo == 'S' && sessoPz == 'M'){	
			
			valoreFunicolo = 1;
			chk[i].checked = false;
		}
	}
	
	
	if(valoreFunicolo == 1 && sessoPz == 'M'){
		valoreFunicolo = 0;
		alert('Attenzione! \n Sono stati richiesti degli esami appartenenti al profilo FUNICOLO che non può essere richiesto per un paziente di sesso maschile. i suddetti esami verranno esclusi dalla richiesta');
	}
	var s = idEsami;
	var b = /#$/.test(s);   
	var t = s.replace(/#$/,"");  
	
	opener.document.all['HelencoEsami'].value = idEsami; 
	
	// SE IMMUNOEMETOLOGIA GESTISCO FUNICOLO
	if (_METODICA == 'I'){
		
		var hFunicolo 	= opener.document.getElementById('hFunicolo').value;
		
		if ((valoreFunicolo == 1 && hFunicolo == 'N$') || (valoreFunicolo == 1 && hFunicolo == '') )
		{
			opener.NS_FUNICOLO.visualizzaFunicolo(1);
			opener.document.getElementById('hFunicolo').value = 'S$';
		}
		else if (valoreFunicolo == 0)
		{		
			opener.NS_FUNICOLO.visualizzaFunicolo(0);
			opener.document.getElementById('hFunicolo').value = 'N$';
		}
		
		valoreFunicolo = null;	
	}
	var innerListBox   = opener.document.getElementById('cmbPrestRich_L');	
	svuotaListBox(innerListBox);
	
	jQuery(innerListBox).append(myListBox.options.innerHTML);
	self.close();
}

//FUNZIONE CHE SELEZIONA TUTTI I TAPPI GLI ESAMI DI UNA PROVETTA
function selezioneProvetta(provetta){

	var chk=document.getElementsByName("chkEsami");

	for (var i=0; i<chk.length;i++)
	{			
		if (chk[i].tappo == provetta)	//controllo se l'attributo tappo del check è uguale alla provetta selezionata
		{ 	
			if (chk[i].checked){					
				chk[i].checked = false;					
			}else{							
				chk[i].checked = true;					
			}					
		}
	}
}

function ricordaEsami(){
	
	if (parent.opener.document.all.HelencoEsami.value != ''){

		var Esami 	= parent.opener.document.all.HelencoEsami.value;	
		var esame	= new Array();
		esame = Esami.split('#');

		for (var i=0; i<esame.length; i++){	
			try{
				if(esame[i] != ''){
					if(typeof document.getElementById(''+esame[i]+'') != 'undefined'){
						document.getElementById(''+esame[i]+'').checked=true;
					}
				}
			
			}catch(e){}

		}
		
	}

}

function scegliProfilo(profilo){
	
	idProf = document.all[profilo];

	var Prof	= new Array();
	Prof 		= idProf.value.split(',');
	
	for (var i = 0; i<Prof.length; i++){

		var idEsame = ""+Prof[i]+"";
		try{	
			chk = document.getElementById(idEsame);

			if (chk.disabled == true){
				chk.checked = false;
			}else{
				chk.checked = true;
			}
		}catch(e){alert("L'esame con codice "+ idEsame + " è indicato nel profilo ma non è attivo, segnalarlo all'amministratore di sistema");}
	}
}

// CONFIGURABILE DA TAB_ESA_GRUPPI
function scegliProfilo(profilo){
	
	var idProf 		= document.all[profilo];
	var esamiProf 	= new Array();
	var controllo 	= new Array();
	var elenco 		= new Array();
	var idEsame 	= '';
	var checkPag 	= document.getElementsByName('chkEsami');
	var checkProf 	= document.getElementsByName('chkProfilo');
	var contatore 	= 0;
	idProf.value 	+= ',';
	
	
		esamiProf = idProf.value.split(',');
		
		for (var i=0; i<esamiProf.length; i++){
		
			idEsame = esamiProf[i];
			//alert('idEsame: '+idEsame+'\ncontatore: '+i+'\nNr giri totali: '+Prof.length + '\nNr check Pagina: '+checkPag.length);
			if (controllo.length>0){
			
				if (!in_array(elenco, controllo[0])){
					elenco.push(controllo[0]);
				}
			
				controllo=new Array();
			}
			
			for (var z=0; z<checkPag.length; z++){
		
				//alert('checkPag.id: '+checkPag[z].id + ' \nIden Esame Profilo: ' + idEsame );
				
				if (checkPag[z].id == idEsame){

					if (checkPag[z].disabled == true){
						checkPag[z].checked = false;
					}else{
						checkPag[z].checked = true;
						contatore=contatore+1;
					}	
					
				}else{
					
					controllo.push(checkPag[z].id);
						
				}
			}
		}
		
		for (var z=0; z<checkProf.length; z++){

			// alert('checkProf.profilo: '+checkProf[z].profilo + ' - ' +profilo);
			// alert(checkProf[z].checked);			
			if (checkProf[z].profilo == profilo.toString()){

				if (checkProf[z].checked == true){
					
					var sql='select WM_CONCAT(DESCR) from radsql.TAB_esa where iden in (' + elenco.toString() + ')';
					dwr.engine.setAsync(false);	
					toolKitDB.getResultData(sql, call_resp);
					dwr.engine.setAsync(true);
				
					function call_resp(resp){
					
						// alert(resp);
						var esami=resp.toString().split(',');
						var ritorno='Alcuni degli esami configurati nel profilo non sono più richiedibili:\n';
						
						for (var x = 0;x<esami.length;x++){
						
							ritorno+='\n - '+esami[x];
						
						}
					
						//alert(ritorno);
						//alert('NR. Esami selezionati: '+contatore);
						
					}
				}
			}
		}

}

NS_UTILITY = {
		
	getUrlParameter : function(name){

		var tmpURL = document.location.href;
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( tmpURL );
		
		if( results == null )
			return "";
		else
			return results[1];
	}
}

