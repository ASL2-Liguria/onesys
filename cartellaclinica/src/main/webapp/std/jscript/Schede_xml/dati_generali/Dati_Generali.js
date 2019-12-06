var albero='';

var controllo = 0; //variabile che permette di aprire e chiudere l'albero. Guardare funzione divACR()


jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;   
    DATI_GENERALI.init();
    DATI_GENERALI.setEvents();

	if(WindowCartella.ModalitaCartella.isReadonly(document) || _STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	}
	
	if(!WindowCartella.ModalitaCartella.isStampabile(document) || $('form[name=EXTERN] input[name=KEY_LEGAME]').val() === 'DATI_GENERALI_ASL2_DS'){
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
	}
	
	$('input#KEY_LEGAME').val($('input#FUNZIONE').val());
	//$('#lblApriAnag').click(function() {apriAnagrafica();});

	controllaLabel(); 
	setRadioResettable();
	try{	top.utilMostraBoxAttesa(false);		}catch(e){/*se non e aperto dalla cartella*/}

	try{	jQuery('#lblAttivita').css("width", "700 px");	}catch(e){}
	try{	jQuery('#txtEsitoScalaFragilita').attr("disabled","disabled");	}catch(e){}
    
	$('#lblScalaFragilita').click(function(){ apriScalaFragilita();});
		
});

var DATI_GENERALI = {
	
	init:function(){},
	
	setEvents:function(){
		//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
		$('form[name="DATI_GENERALI"]').click(function(){
			$(this).attr("edited","edited");			
		});
                
                $('#groupAnamnesi TABLE TR:empty').each(function(i) {
                    $(this).hide();
                });
	}
		
	
};

 function apriScalaFragilita(){
     var readonly;
     if(document.EXTERN.STATO_PAGINA.value=='L')
		 readonly='true';
	 else
		 readonly='false';

	window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_FRAGILITA_SOCIALE&FUNZIONE=SCALA_FRAGILITA_SOCIALE&BISOGNO=S&READONLY="+readonly+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');

}


//function che carica il div dell'albero all'interno del group layer
function divACR(){
	//albero da creare
	if (controllo == 0){
		
		try{
			albero = NS_CascadeTree.append('#lblVuota',{gruppo:'SCELTA_PROFESSIONI',abilita_ricerca_descrizione:'S',abilita_ricerca_codice:'N',onSelection:riempiAttivita,CreaNascosto:'N'});
			controllo=1;
		}catch(e){
			alert('DIO'+e.description);
		}
	
	//albero da nascondere
	}else if(controllo == 1){
		
		albero.hide();
		controllo=2;
	
	//albero da mostrare
	}else if(controllo == 2){
		
		albero.show();
		controllo=1;
	}
}

// ora chiama top.apriAnagrafica();
/*function apriAnagrafica(){	

	window.open("servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG="+parent.EXTERN.iden_anag.value+"&READONLY=" +(document.EXTERN.STATO_PAGINA.value=='L'?'true':'false'),"","status=yes fullscreen=yes");
}*/


// funzione per impostare il messaggio di scelta nella label delle attività
function controllaLabel() {
	try {
		//document.getElementById('hDescrAttivita').parentElement.style.display = 'none';
	
		if (document.getElementById('hAttivita').value == '' &&  document.getElementById('hDescrAttivita').value == ''){
			document.getElementById('lblAttivita').innerText = '...';
		}else{
			document.getElementById('lblAttivita').innerText = document.getElementById('hDescrAttivita').value;
		}
	} catch (e) {
		//alert(e.message);
	}
}


function registraDatiGenerali(){
	
	try{
		//toolKitDB.executeQueryData("update radsql.anag set stato_civile='"+document.all.txtStatoCivile.value+"' where iden_anag="+document.EXTERN.IDEN_ANAG.value, response);
		jQuery("#lblVuota").remove();
		registra();
		
	}catch(e){
		alert('ERROR'+e.description);
	}
}


function response(){}


function  riempiAttivita (obj) {
	
	//funzione che riempe il campo nascosto 

	/*											
	 	obj.iden = iden di radsql.CONFIG_ACR
		obj.codice = codice di radsql.CONFIG_ACR
		obj.descrizione = testo del ramo selezionato
		obj.ref = iden_figlio radsql.CONFIG_ACR
		obj.path = percorso del ramo (es:"1.34.567.1.34")
		obj.path_descr = percorso delle descrizioni per arrivare al ramo 
	*/
	
	document.getElementById('hAttivita').value = obj.iden;
	document.getElementById('hDescrAttivita').value = obj.descrizione;
	document.getElementById('lblAttivita').innerText = obj.descrizione;

	controllo=2;
	albero.hide(); //chiusura del div con effetto grafico fadeOut, dissolvenza
	//albero.fadeOut(500);
	

}


function stampaDatiGenerali(){

	var vDati=WindowCartella.getForm(document);
	if (WindowCartella.CartellaPaziente.checkPrivacy("DATI_GENERALI")){
	    var obj = WindowCartella.NS_CONSENSI.checkPresenzaConsensoWhale({
	        statement:'loadConsensoEspressoRicovero',
	        value:vDati.iden_ricovero
	    });
	    if (!obj.value){
	        return alert(obj.messaggio)
	    }		
	}
	if (_STATO_PAGINA == 'L'){
		
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
	
	}else{
		var funzione	= document.EXTERN.FUNZIONE.value;
		var anteprima	= 'S';
		var reparto		= vDati.reparto;
		/*Nel caso del dh 
		 * document.EXTERN.IDEN_VISITA.value =  valore iden_ricovero
		 *Nel caso del ricovero ordinario
		 * document.EXTERN.IDEN_VISITA.value =  valore iden_visita(accesso)
		 * */
		var sf			= '&prompt<pVisita>='+document.EXTERN.IDEN_VISITA.value;

		WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
	}
}

