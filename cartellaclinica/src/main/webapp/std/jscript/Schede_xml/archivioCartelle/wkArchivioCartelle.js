$(document).ready(function(){
	 if (baseUser.ATTIVA_NUOVA_WORKLIST == 'S'){
			$().callJSAfterInitWorklist('WK_ARCHIVIO_CARTELLE.init()');
		 }
		 else{
			 WK_ARCHIVIO_CARTELLE.init();
		 }
});

var WK_ARCHIVIO_CARTELLE ={
		
		init : function(){
			WK_ARCHIVIO_CARTELLE.setEvents();
		},
		
		setEvents : function(){
			$('DIV.classArchivio').attr('title','Cartella Archiviata');
			$('DIV.classArchivioAnnulla').attr('title','Cartella Non Archiviata');
		},
		
		operazioneSingola : function(obj,row){
			if (array_deleted[row]==null || array_deleted[row]=='')
				WK_ARCHIVIO_CARTELLE.invia(row);				
			else if (array_deleted[row]=='S')
				WK_ARCHIVIO_CARTELLE.invia(row);
			else
				WK_ARCHIVIO_CARTELLE.annulla(row);
		},

		invia : function(rowSelected){
			if (rowSelected == undefined)
			{
				if (vettore_indici_sel.length==0){
					alert('Selezionare almeno una richiesta');
					return;
				}
				if (confirm("Le cartelle verranno segnalate come inviate in archivio:procedere?"))
				{
					$(vettore_indici_sel).each(function(idx,value){
						if (array_deleted[value]=='')
							WK_ARCHIVIO_CARTELLE.insertIntoDb(array_iden_ricovero[value],array_num_nosologico[value],baseUser.IDEN_PER);
						else if (array_deleted[value]=='S')
							/*if (array_iden_per[value]!=baseUser.IDEN_PER)
								alert('L\'utente è diverso dall\'utente che ha annullato l\'invio');
							else*/
								WK_ARCHIVIO_CARTELLE.updateDb(array_iden_ricovero[value],'I');
						else 
							alert('Impossibile inviare una cartella già inviata');					
					});
				}
				else
					return;
			}
			else
			{
				if (confirm("La cartella verrà segnalata come inviata in archivio:procedere?"))
				{
					if (array_deleted[rowSelected]=='')
							WK_ARCHIVIO_CARTELLE.insertIntoDb(array_iden_ricovero[rowSelected],array_num_nosologico[rowSelected],baseUser.IDEN_PER);
	
					else if (array_deleted[rowSelected]=='S')
						/*if (array_iden_per[rowSelected]!=baseUser.IDEN_PER)
							alert('L\'utente è diverso dall\'utente che ha annullato l\'invio');
						else*/
							WK_ARCHIVIO_CARTELLE.updateDb(array_iden_ricovero[rowSelected],'I');
					else 
						alert('Impossibile inviare una cartella già inviata');
				}
				else
					return;
			}
		},
		
		annulla : function(rowSelected){
			if (rowSelected == undefined)
			{
				if (vettore_indici_sel.length==0){
					alert('Selezionare almeno una richiesta');
					return;
				}				
				if (confirm("Verranno annullate le segnalazioni di invio in archivio:procedere?"))
				{
					$(vettore_indici_sel).each(function(idx,value){
						if (array_deleted[value]=='N')
							if (array_iden_per[value]!=baseUser.IDEN_PER)
								alert('L\'utente è diverso dall\'utente che ha effettuato l\'invio');
							else
								WK_ARCHIVIO_CARTELLE.updateDb(array_iden_ricovero[value],'X');
						else 
							alert('Impossibile annullare un\'invio di cartella precedentemente annullata o non ancora inviata');					
					});
				}
				else
					return;
			}
			else
			{
				if (confirm("Verrà annullata la segnalazione di invio in archivio:procedere?"))
				{
					if (array_deleted[rowSelected]=='N')
						if (array_iden_per[rowSelected]!=baseUser.IDEN_PER)
							alert('L\'utente è diverso dall\'utente che ha effettuato l\'invio');
						else
							WK_ARCHIVIO_CARTELLE.updateDb(array_iden_ricovero[rowSelected],'X');
					else 
						alert('Impossibile annullare un\'invio di cartella precedentemente annullato');
				}
				else
					return
			}
		},
		
		insertIntoDb : function(idenRicovero,numNosologico,idenPer){
			var vResp = top.executeStatement('wkArchivioCartelle.xml','wkArchivioCartelle.invia',[
			                                                                  idenRicovero,
			                                                                  numNosologico,
			                                                                  idenPer			
			                                                                  ]);

			if(vResp[0]=='KO'){
				return alert('Invio in errore:\n'+vResp[1]);
			}
			
			parent.applica_filtro();
		},
		
		updateDb : function(idenRicovero,valore){
			var vResp = '';
			if (valore=='X')
				vResp = top.executeStatement('wkArchivioCartelle.xml','wkArchivioCartelle.annulla',idenRicovero);
			else
				vResp = top.executeStatement('wkArchivioCartelle.xml','wkArchivioCartelle.inviaAnnullata',[idenRicovero,baseUser.IDEN_PER]);

			if(vResp[0]=='KO'){
				return alert('Invio in errore:\n'+vResp[1]);
			}
			parent.applica_filtro();
		},	
		
		
		stampaLista : function(rowSelected){
			
			var arrayToPrint= new Array();
			var funzione	= 'WK_ARCHIVIO_CARTELLE';
			var sf			= '';
			
			for (i=0;i<=array_deleted.length;i++){
				if (array_deleted[i]=='N')
					arrayToPrint.push(array_iden_ricovero[i]);
			}
			if (arrayToPrint.length ==0){
				alert('Nessuna cartella inviata in archivio nella selezione effettuata');
				return;
			}
			
			sf= "{NOSOLOGICI_PAZIENTE.IDEN} in [" + arrayToPrint  + "]&prompt<pDescrizione>="+WK_ARCHIVIO_CARTELLE.descrizioneUtente();
			top.confStampaReparto(funzione,sf,'S','',null);
		},
		
		descrizioneUtente : function(){
			var descr = 'Stampa Eseguita da: ';
			if (baseUser.TIPO=='M')
				descr = 'Dr. ';
			else if (baseUser.TIPO=='I')
				descr = 'Inf. ';
			descr = descr + baseUser.SURNAME + ' ' + baseUser.NAME;
			return descr;
		}
};