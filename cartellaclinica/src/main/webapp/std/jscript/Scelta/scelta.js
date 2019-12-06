function registra(){
	
	var oOpt 			= '';
	var valore_iden 	= '';
	var valore_descr 	= '';
	
	var dx = document.form.combo_dx;
	
	var num_elementi = dx.length ;
	
	var campo_opener_descr = document.form.campo_descr.value;
	
	var sel = opener.document.getElementById(campo_opener_descr);

	while(sel.length > 0){
		sel.remove(sel.length - 1);
	}

	//alert('NUM ELEMENTI ' + num_elementi);
	for (i = 0; i < num_elementi; i++){
		oOpt = opener.document.createElement("Option");
		valore_iden = dx.options(i).value;
		valore_descr = dx.options(i).text;	
		
		oOpt.text = valore_descr;
		oOpt.value = valore_iden;
		
		//alert(oOpt.value + ' - ' + oOpt.text);

		sel.add(oOpt);
	}
	
	chiudi();
}


function chiudi(){
	self.close();
}


function inserimento(){
	
	var idenVisita='';
	var url='';

		
	if (typeof opener.EXTERN.Hiden_visita == 'undefined' || opener.EXTERN.Hiden_visita != ''){

		if (typeof opener.document.getElementById('hIdenVisitaStorico')!= 'undefined' && opener.document.getElementById('hIdenVisitaStorico').value!=''){
		
			idenVisita=opener.dati.hIdenVisitaStorico.value;
		
		}else{
		
			var iden_anag=opener.document.getElementById('Hiden_anag').value;
			sql = "{call ? := GET_IDEN_VISITA_STORICO("+ iden_anag+")}";
			//alert(sql);
			 dwr.engine.setAsync(false);	
			 toolKitDB.executeFunctionData(sql, resp_check);
			 dwr.engine.setAsync(true);
			
				function resp_check(resp){

					//alert('RESP inserimento(): '+resp);
					idenVisita=resp;
					opener.document.getElementById('hIdenVisitaStorico').value=resp;
				}	
		}
	
	}else{

		idenVisita=opener.EXTERN.Hiden_visita.value;
	}
	
	var url ="servletGenerator?KEY_LEGAME=FINESTRA_MOTIVO_CONTROINDICAZIONE&IDEN_VISITA="+idenVisita;
	//alert(url);
	
	window.showModalDialog(url,window,"dialogWidth: 1000px; dialogHeight: 600px; scroll: no ; status:no ");
}

function caricaFrame(){
	
	//alert(document.getElementById('oIFIns'))
	var frame=document.getElementById('oIFIns');
	//alert(document.getElementById('oIFIns').src);
	var idenVisita=document.EXTERN.IDEN_VISITA.value;
	var url = 'servletGenerator?KEY_LEGAME=SCELTA_CONTROINDICAZIONI&IDEN_VISITA='+idenVisita;
	//alert(url);
	frame.src=url;

}

function trasferisciTesto(testo){
	document.getElementById('oIFIns').contentWindow.document.getElementById('txtNota').value=testo;
}


