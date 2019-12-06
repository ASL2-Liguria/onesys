var WindowCartella = null;
$(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	var _select = $('select[name="cmbPriorita"]');
	_select.find('option[value="'+_select.attr("prioritaOriginale")+'"]').attr("selected","selected");

	SCHEDA_PROBLEMA.init();
	SCHEDA_PROBLEMA.setEvents();

});

var SCHEDA_PROBLEMA = {
	
	init:function(){
	},
	
	setEvents:function(){
		$('td.LinkICD').css({"text-decoration":"underline","color":"blue"}).click(SCHEDA_PROBLEMA.AlberoDiagnosi.apri);
		$('#tdRisolto').click(SCHEDA_PROBLEMA.risolvi);
	},
	
	chiudi:function(){},
	
	AlberoDiagnosi:{
		
		creato:false,
				
		apri:function(){
			$('div#clsACR').show();
			$('label#lblClassificazioneICD').text("").attr("idenIcd","");
			if(SCHEDA_PROBLEMA.AlberoDiagnosi.creato)return;
			
			NS_CascadeTree.append('div#clsACR',{
					gruppo:document.EXTERN.tipoICD.value,
					onSelection:SCHEDA_PROBLEMA.AlberoDiagnosi.setValue,
					abilita_ricerca_descrizione:'S'
				}
			)
			SCHEDA_PROBLEMA.AlberoDiagnosi.creato = true;
		},
		
		chiudi:function(){
			$('div#clsACR').hide();
		},
		
		setValue:function(obj){
			$('label#lblClassificazioneICD').text(obj.descrizione).attr("idenIcd",obj.iden);
			SCHEDA_PROBLEMA.AlberoDiagnosi.chiudi();			
		}
	},
	
	risolvi:function (){
		if (this.risolto=='S'){
			this.risolto='N';
			this.className = 'risoltoN';
		}else{
			this.risolto='S';
			this.className = 'risoltoS';		
		}	
	}	
	
};

function registra(){
	try{
		var vStatement;
		var vParam = new Array();
		
		vParam.push(""+WindowCartella.baseUser.IDEN_PER);
		vParam.push($('label#lblClassificazioneICD').attr("idenIcd"));
		vParam.push(document.all.txtNote.innerText);
		vParam.push($('#tdRisolto').attr("risolto"));
		vParam.push(document.all.cmbPriorita.options[document.all.cmbPriorita.selectedIndex].value);
		
		if(document.EXTERN.idProblema.value == '0'){//inserimento
			vParam.push(document.EXTERN.idenVisita.value);		
			vParam.push(document.EXTERN.tipoICD.value);	
			
			vStatement = "setProblema";														
		}else{//modifica
			vParam.push(document.EXTERN.idProblema.value);
		
			vStatement = "editProblema";	
		}

		var vResp = WindowCartella.executeStatement("Problemi.xml",vStatement,vParam,1);
		if(vResp[0]=='KO'){
			alert(vResp[1]);
		}else{
			parent.aggiorna();
			parent.$.fancybox.close();
		}
	}catch(e){
		alert(e.description);
	}
	
}