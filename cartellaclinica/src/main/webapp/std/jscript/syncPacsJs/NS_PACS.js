jQuery(document).ready(function(){
	// SecurityError
	try { var name = window.opener.name; } catch(e) { window.opener = {}; }

	window.WindowRiferimento = window;	
	try {
		while((window.WindowRiferimento.name != 'Home' || window.WindowRiferimento.name != 'schedaRicovero') && window.WindowRiferimento.parent != window.WindowRiferimento){
			var name = window.WindowRiferimento.parent.name; // SecurityError Test
			window.WindowRiferimento = window.WindowRiferimento.parent;
		}
	} catch(e) {}

	
	switch(WindowRiferimento.name){
		case 'Home':
		    window.baseReparti 	= WindowRiferimento.baseReparti;
		    window.baseGlobal 	= WindowRiferimento.baseGlobal;
		    window.basePC 		= WindowRiferimento.basePC;
		    window.baseUser 	= WindowRiferimento.baseUser;
		    break;
		case 'schedaRicovero':
		    window.baseReparti 	= WindowRiferimento.baseReparti;
		    window.baseGlobal 	= WindowRiferimento.baseGlobal;
		    window.basePC 		= WindowRiferimento.basePC;
		    window.baseUser 	= WindowRiferimento.baseUser;
		    break;
		default:
		try{
		    window.baseReparti 	= opener.top.baseReparti;
	    	window.baseGlobal 	= opener.top.baseGlobal;
	    	window.basePC 		= opener.top.basePC;
	    	window.baseUser 	= opener.top.baseUser;
			}catch(e){
		    window.baseReparti 	= WindowRiferimento.baseReparti;
	    	window.baseGlobal 	= WindowRiferimento.baseGlobal;
	    	window.basePC 		= WindowRiferimento.basePC;
	    	window.baseUser 	= WindowRiferimento.baseUser;				
			}			
	}
	
	NS_PACS.init();
});



var NS_PACS = {
/**/
	data:{
		PASSWORD:'',
		PROVENIENZA:'',
		TIPO_APERTURA:'',
		TIPO_PACS:'',
		URL:'',
		USER:''	
	},
	
	valori:{
		idPazDicom:'',
		idEsameDicom:'',
		nodeName:''
	},
		
	apri:function(paramApertura){
		
		NS_PACS.data.PROVENIENZA=paramApertura.PROVENIENZA;
		NS_PACS.data.TIPO_APERTURA=paramApertura.TIPO_APERTURA;
		riga = NS_PACS.Utilities.setRiga();
		if(NS_PACS.data.PROVENIENZA=='WK_RICHIESTE'){
			if(!NS_PACS.controlliPreCaricamento()){
				return;
			}
		}
		
		NS_PACS.creaUrl(NS_PACS.data);
	},
 
	init:function(){
		eval('NS_PACS.data =' + window.baseReparti.getValue(baseUser.LISTAREPARTI[0],'PACS_ATTIVO'));
		NS_PACS.data.URL=basePC.URL_VE;
	},
	
	  controlliPreCaricamento:function(){

		if(NS_PACS.data.PROVENIENZA=='WK_ESAMI_IMMAGINI'){
			iden = stringa_codici(array_iden_esame);
		}
		else{
			iden = stringa_codici(array_iden);
			}

		if(iden.toString().indexOf('*') != '-1'){
			alert('Attenzione: selezionare una sola prenotazione/richiesta');
			return false;
		}
		
		if(NS_PACS.data.PROVENIENZA=='WK_RICHIESTE'){
			if (rigaSelezionataDalContextMenu==-1){
				stato = stringa_codici(array_stato);
			}else{
				stato = array_stato[rigaSelezionataDalContextMenu];
			}

			if(stato!='R'){
				alert('Attenzione: la richiesta deve essere nello refertato');	
				return false;
			}
		}
		return true;
	},
	
	controlliPreApertura:function(){
		if (NS_PACS.data.TIPO_APERTURA=='PATIENT' && NS_PACS.valori.idPazDicom==""){
		alert("Id paziente nullo, impossibile continuare.");
		return false;	
	}
	return true;
		
	},

	
	creaUrl:function(parameter){
		switch(parameter.TIPO_PACS){
		case 'CARESTREAM':
			NS_PACS.CARESTREAM.init();
			NS_PACS.CARESTREAM.open();
			break;
		case 'PHILIPS':
			NS_PACS.PHILIPS.init();
			NS_PACS.PHILIPS.open();
			break;
		
		default:alert('error');
		}
			
	},
	
	recuperaDatiFromPolaris:function(idEsameDicom){
		var statementFile = "visualizzatore.xml";
		var statementName = "getDatiPacs";
		var parameters 	= [idEsameDicom];
		
		var dataFromPolaris={
		    ID_PAZ_DICOM:'',
			NODE_NAME:''
		};
		
		top.dwr.engine.setAsync(false);
		top.dwrUtility.executeQuery(statementFile,statementName,parameters,function(resp){
			if(resp[0][0]=='KO'){
				alert(resp[0][1]);
			}else{
				dataFromPolaris.ID_PAZ_DICOM=resp[2][0];
				dataFromPolaris.NODE_NAME=resp[2][2];	
			}
		});
		top.dwr.engine.setAsync(true);
	
		return dataFromPolaris; 
	},

	recuperaDatiFromWhale:function(idenTestata){
		var statementFile = "OE_Richiesta.xml";
		var statementName = "pacs.retrieveIdEsameDicom";
		var parameters 	= [idenTestata];
		var ArData;
		NS_PACS.valori.idEsameDicom='';
		top.dwr.engine.setAsync(false);
		top.dwrUtility.executeQuery(statementFile,statementName,parameters,function(resp){
			if(resp[0][0]=='KO'){
				alert(resp[0][1]);
			}else{
			ArData = resp.splice(2, resp.length-1);
					for (var i = 0; i < ArData.length; i++) {
						if(i>0){
							NS_PACS.valori.idEsameDicom +=',';
						}
						NS_PACS.valori.idEsameDicom +=ArData[i][0];
						NS_PACS.valori.nodeName=ArData[i][1];	
					}
					NS_PACS.valori.idEsameDicom = NS_PACS.valori.idEsameDicom.replace(/,/g,'\\');
			}
		});
		top.dwr.engine.setAsync(true);
	},
	
		
	CARESTREAM:{
		
	
		init:function(){
			switch(NS_PACS.data.PROVENIENZA){		
			case 'REPOSITORY':		
				NS_PACS.CARESTREAM.recuperaDatiRepository(riga);
				break;
			case 'WK_RICHIESTE':
			case 'WK_ESAMI_IMMAGINI':
			case 'WK_REFERTI_LETTERA':
				NS_PACS.CARESTREAM.recuperaDati(riga);
				break;
			
			default:alert('error');
			}
						
		},
		
		open:function(){
			
			var url = NS_PACS.data.URL;
			if(!NS_PACS.controlliPreApertura()){
				return;
			}
			url = url + "&user_name="+NS_PACS.data.USER+"&password="+NS_PACS.data.PASSWORD;
			url = url + "&patient_id="+ NS_PACS.valori.idPazDicom;
			
			if(NS_PACS.data.TIPO_APERTURA=='STUDY'){
				url = url + "&accession_number="+ NS_PACS.valori.idEsameDicom;	
			}						
			
			url = url + "&server_name="+ NS_PACS.valori.nodeName;
			
			
			var wndIsite=window.open(url);
			if (wndIsite)
			{
				wndIsite.focus();
			}
			else
			{
				wndIsite=window.open(url);
			}
		},
		
		recuperaDati:function(row){

			if (typeof row=='undefined'){
				NS_PACS.valori.idPazDicom 		= stringa_codici(array_id_paz_dicom);
				 typeof array_id_esame_dicom=='undefined'?NS_PACS.recuperaDatiFromWhale(stringa_codici(array_iden)):NS_PACS.valori.idEsameDicom=stringa_codici(array_id_esame_dicom).replace(/,/g,'\\');				
				typeof array_node_name=='undefined'?null:NS_PACS.valori.nodeName=stringa_codici(array_node_name);
			}else{
				NS_PACS.valori.idPazDicom 		= array_id_paz_dicom[row];
				 typeof array_id_esame_dicom=='undefined'?NS_PACS.recuperaDatiFromWhale(array_iden[row]):NS_PACS.valori.idEsameDicom=array_id_esame_dicom[row].replace(/,/g,'\\');						
				//nel caso non c'è l'array mi trovo nella wk richieste e quindi ho già valorizzato il node_name sopra 
				typeof array_node_name=='undefined'?null:NS_PACS.valori.nodeName=array_node_name[row];
			}

			
		},
		
		recuperaDatiRepository:function(row){
			if (typeof row=='undefined'){
				NS_PACS.valori.idEsameDicom = stringa_codici(ar_idEsameDicom);
				}else{
				NS_PACS.valori.idEsameDicom = ar_idEsameDicom[rigaSelezionataDalContextMenu];		
			}
			
			res=NS_PACS.recuperaDatiFromPolaris(NS_PACS.valori.idEsameDicom.split(',')[0]);
			NS_PACS.valori.idPazDicom=res.ID_PAZ_DICOM;
			NS_PACS.valori.nodeName=res.NODE_NAME;
			//a carestream vengono passati tutti gli idesamedicom separati da '\'
			NS_PACS.valori.idEsameDicom = NS_PACS.valori.idEsameDicom.replace(/,/g,'\\');
		}
		
		
	},
	
	PHILIPS:{
	
		
		init:function(){
			switch(NS_PACS.data.PROVENIENZA){		
			case 'REPOSITORY':		
				NS_PACS.PHILIPS.recuperaDatiRepository(riga);
				break;
			case 'WK_RICHIESTE':
			case 'WK_ESAMI_IMMAGINI':
			case 'WK_REFERTI_LETTERA':
				NS_PACS.PHILIPS.recuperaDati(riga);
				break;
			
			default:alert('error');
			}
						
		},
		
		open:function(){
			
			if(!NS_PACS.controlliPreApertura()){
				return;
			}
			
			var url= NS_PACS.data.URL+'&acc='+ NS_PACS.valori.idEsameDicom +'&mrn='+ NS_PACS.valori.idPazDicom;
			var wndIsite=window.open(url);
			if (wndIsite)
			{
				wndIsite.focus();
			}
			else
			{
				wndIsite=window.open(url);
			}
		},
		
		recuperaDati:function(row){
					
			if (typeof row=='undefined'){
				NS_PACS.valori.idPazDicom 		= stringa_codici(array_id_paz_dicom);
				typeof array_id_esame_dicom=='undefined'?NS_PACS.recuperaDatiFromWhale(stringa_codici(array_iden)):NS_PACS.valori.idEsameDicom=stringa_codici(array_id_esame_dicom).split(',')[0];
			}else{
				NS_PACS.valori.idPazDicom 		= array_id_paz_dicom[row];
				 typeof array_id_esame_dicom=='undefined'?NS_PACS.recuperaDatiFromWhale(array_iden[row]):NS_PACS.valori.idEsameDicom=array_id_esame_dicom[row].split(',')[0];						
			}
		},
		
		recuperaDatiRepository:function(row){
			if (typeof row=='undefined'){
				NS_PACS.valori.idEsameDicom = stringa_codici(ar_idEsameDicom);
				}else{
				NS_PACS.valori.idEsameDicom = ar_idEsameDicom[rigaSelezionataDalContextMenu];		
			}
		  //a un referto possono essere associati più id_esame_dicom, prendo il primo
			NS_PACS.valori.idEsameDicom=NS_PACS.valori.idEsameDicom.split(',')[0];
			res=NS_PACS.recuperaDatiFromPolaris(NS_PACS.valori.idEsameDicom);
			NS_PACS.valori.idPazDicom=res.ID_PAZ_DICOM;
		}
		
		
	},
	
	
	Utilities:{
		setRiga:function(obj){
			if(typeof event == 'undefined' || typeof event.srcElement =='undefined' || event.srcElement.nodeName.toUpperCase()!='DIV')return;

			if(typeof obj =='undefined') obj = event.srcElement;

			while(obj.nodeName.toUpperCase() != 'TR'){
				obj = obj.parentNode;
			}
			rigaSelezionataDalContextMenu = obj.sectionRowIndex;
			return rigaSelezionataDalContextMenu;
		}
	}
	

};

