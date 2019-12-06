
function registraConsenso(idenRichiesta){

	alert('REGISTRA');

}

function chiudi(){

	self.close();

}

function stampa(){

	alert('STAMPA');

}

function apriScandb(procedura, campo){

	//alert(procedura + ' -- ' + campo);

	var doc 				= document.form_scandb;
	doc.target 			= 'winScanDb';
	doc.action 			= 'scanDB';
	doc.method		   	= 'POST';
	doc.myric.value 		= campo;
	doc.myproc.value 	= procedura;
	doc.mywhere.value 	= '';

	var finestra = window.open('','winScanDb','width=250,height=600, resizable = yes, status=yes, top=10,left=10');
	
	doc.submit();
}