var _filtro_elenco_reparti=null;
var _filtro_elenco_esami=null;
var _filtro_elenco_contenitori=null;

var clientx ;
var clienty ;

//creo due div
$(document).ready(function(){
	

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
	
	caricamento();
	
	try{
		top.utilMostraBoxAttesa(false);	
		
		jQuery("body").keypress (function(e) {
			if(e.keyCode==13){
				aux_applica_filtro();
			}
		});
		
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.dati.txtData); 
		}catch(e){
			//alert(e.description);
		}
		
		document.getElementById('txtDescrizione').onblur = function(){
			document.getElementById('txtDescrizione').value=document.getElementById('txtDescrizione').value.toUpperCase();
		};
		document.getElementById('txtUtente').onblur = function(){
			document.getElementById('txtUtente').value=document.getElementById('txtUtente').value.toUpperCase();
		};

	}catch(e){
		alert('e.descr: '+e.description);
	}

});
function aggiorna(){
	aux_applica_filtro();
}


function caricamento(){
	setVeloNero('oIFWk');
	var url='servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_OBIETTIVI_BISOGNI_GENERALE';
	if(WindowCartella.ModalitaCartella.isReadonly(document)){
		url+="&CONTEXT_MENU=WK_OBIETTIVI_BISOGNI_LETTURA";
	}	
	$("#hIdenVisita").val(document.EXTERN.IDEN_VISITA.value);
	applica_filtro(url);
	
	

	
}


function aux_applica_filtro(){

	setVeloNero('oIFWk');
	document.getElementById('txtDescrizione').value=document.getElementById('txtDescrizione').value.toUpperCase();
	document.getElementById('txtUtente').value=document.getElementById('txtUtente').value.toUpperCase();
	applica_filtro();
}


function resettaDati(){
	
	jQuery("#txtNome, #txtCognome, #txtADataRic").val("");
	$("[name='cmbRepProvenienza']").find("option[value='']").attr("selected","selected");
	
}

function setRiga(obj){

	if(typeof obj =='undefined') obj = event.srcElement;
	
	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	
	return rigaSelezionataDalContextMenu;
}

function setDateFiltri(){	
	var tDay = new Date();
	var tMonth = tDay.getMonth()+1;
	var tDate = tDay.getDate();
	if ( tMonth < 10) tMonth = "0"+tMonth;
	if ( tDate < 10) tDate = "0"+tDate;
	//alert( tDate+"/"+tMonth+"/"+tDay.getFullYear());
	document.all['txtDaDataRic'].value = tDate+"/"+tMonth+"/"+tDay.getFullYear();
}

function dataOdierna(oggetto){
	
	var data= new Date();
	var giorno= data.getDate() ;
	var mese=data.getMonth() +1;
	var anno=data.getYear();
	
	if (giorno.toString().length <2){
		
		//alert ('giorno prima '+giorno);
		giorno = '0'+giorno;
	}
	
	if (mese.toString().length <2){
		//alert ('giorno prima '+mese);
		mese = '0'+mese;
	}
	
	//data europea
	oggetto.value = giorno + '/' +mese+ '/' + anno;
	
	//data americana
	//oggetto.value = mese + '/' +giorno+ '/' + anno;
}

