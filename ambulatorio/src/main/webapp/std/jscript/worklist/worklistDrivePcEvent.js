// JavaScript Document
// questa funzione verrà
// chiamata da ogni "anello" che 
// sarà interessato dall'evento da gestire
function evalDrivePcEvent(){
	
	return;
	
	var evento = "";
	var idenRef = "";
	var idenAnag="";
	var idenEsa=""
	var indice = 0;
	var indexToSelect;
	
	
	evento = parent.parent.hideFrame.objDrivePc.drivePcObj[0].procedura;
	idenEsa = parent.parent.hideFrame.objDrivePc.drivePcObj[0].iden_esame;
	idenAnag = parent.parent.hideFrame.objDrivePc.drivePcObj[0].iden_anag;
	listaIdenEsa = idenEsa.split("*");
	if (evento==""){return;}
	try{
		switch(evento){
			case "WK_AMB_REFERTAZIONE":
				alert("wk_ref");
				break;
			case "CONSOLE":
				// ipotizzo di essere già con la lista degli esami corretta
				// individuo l'esame da selezionare
				
				for (indice =0; indice < array_iden_esame.length; indice++){
					for (var k=0; k<listaIdenEsa.length;k++){
						if (array_iden_esame[indice]==listaIdenEsa[k]){
							//trovato quindi seleziono
							illumina_multiplo(indice);
						}
					}
				}
				referta();
				// seleziono l'esame
				// lo referto (attenzione ad eventuali blocchi)
				// setto il readonly per l'apertura della console
				break;
			default:
				break;
		}
	}
	catch(e){
		alert("worklistDrivePcEvent.evalDrivePcEvent - " + e.description);
	}	
}
