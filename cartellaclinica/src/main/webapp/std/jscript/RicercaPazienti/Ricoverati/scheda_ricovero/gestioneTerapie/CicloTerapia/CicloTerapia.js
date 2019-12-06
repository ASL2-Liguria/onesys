//top.utilMostraBoxAttesa(true);
window.name = "CicloTerapia";
document.getElementById('btnConferma').onclick = function(){attesa(true);};
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

	Impostazioni.setEvents();
	Impostazioni.init();	
});

function  attesa(bool){
    WindowCartella.utilMostraBoxAttesa(bool);
}

var GlobalVariables ={
	maxGiorno  	: 0,
	maxColonne 	: 0,
	days : new Array(),
//	offset : new Array(50),
	giorno_inizio : null,
	DataInizioCiclo : null,
	
	agende:{},
	
	Reset:function(){
		GlobalVariables.maxGiorno  		= 0;
		GlobalVariables.maxColonne 		= 0;
		GlobalVariables.days 			= new Array();
		GlobalVariables.giorno_inizio	= null;
		GlobalVariables.DataInizioCiclo = null;
	}
};


var Progressbar = {
		
	steps : 0,
	progress:0,
	
	create:function(steps){
		
		Progressbar.steps = steps;
		Progressbar.progress = 0;
		
		$('body').append(
			$('<div id="progressbar"></div>')
		);

		$('#progressbar').progressbar({'value':40});

	},
	
	remove:function(){
		$('#progressbar').remove();
	},
	
	next:function(){		
		Progressbar.progress = Progressbar.progress +1;
		Progressbar.value(100/Progressbar.steps*Progressbar.progress);
	},
	
	value : function(pct){
		$('#progressbar').progressbar('value',pct);
	}
	
}

var STATO_TERAPIA = null;
var IDEN_CICLO = -1; //preso direttamente da generic.js

var NSRegistrazione = {
	ModelloAttivo : null,
	AssociaModelloScheda :  {},
	cicliGenerati: false,
	IDEN_SCHEDA  : null,
	IDEN_TERAPIA : null,	
	PROCEDURA    : 'conferma',
	ID_SESSIONE  : null,
	goOn         : true,
	callBackOk   : function(pIdenScheda,pIdenTerapia,pIdenCiclo){
							//alert('OK' + '\n' + pIdenScheda + '\n' + pIdenTerapia + '\n' + pIdenCiclo);
							NSRegistrazione.IDEN_SCHEDA  = pIdenScheda;
							NSRegistrazione.IDEN_TERAPIA = pIdenTerapia;
							IDEN_CICLO = pIdenCiclo;
							STATO_TERAPIA = 'P';
							if(document.EXTERN.Procedura.value== 'INSERIMENTO'){
								NSRegistrazione.AssociaModelloScheda[NSRegistrazione.ModelloAttivo] = pIdenScheda;
							}
					},
	callBackKo   : function(pErrorMessage){
							alert('Errore durante il salvataggio:\n' + pErrorMessage);
							NSRegistrazione.goOn = false;
							if(NSRegistrazione.IDEN_TERAPIA == null){
								 return attesa(false);
							}
							//top.executeStatement("terapie.xml","cancella",[NSRegistrazione.IDEN_TERAPIA],1);
					},

	
	check:function(){
		
				
		var controlli = {
			VolumeTotale:true,
			Velocita:true,
			Farmaco:{
				Dose:true,
				Udm:true
			}
		}
		
		for(var i in Cicli){
			for (var j in Cicli[i].Terapie){
			
				var terapia = Cicli[i].Terapie[j];
			
				if(terapia.VolumeTotale == ''){
					controlli.VolumeTotale = false;
				}
				
				if(terapia.Velocita == ''){
					controlli.Velocita = false;
				}				
			
				for(var z in terapia.Farmaci){
					
					if(terapia.Farmaci[z].Dose == ''){
						controlli.Farmaco.Dose = false;
					}
					
					if(terapia.Farmaci[z].Udm == ''){
						controlli.Farmaco.Udm = false;
					}					
					
				}
			}
		}
		
		
		var msg = '';
		
		if(controlli.VolumeTotale == false){
			msg += 'Verificare il campo "Volume Totale" di ogni ciclo \n'; 
		}
		
		if(controlli.Velocita == false){
			msg += 'Verificare il campo "Velocità" di ogni ciclo \n'; 
		}	
		
		if(controlli.Farmaco.Dose == false){
			msg += 'Verificare il campo "Dose" di ogni farmaco \n'; 
		}	
		
		if(controlli.Farmaco.Udm == false){
			msg += 'Verificare il campo "Unità di misura" di ogni farmaco \n'; 
		}						
		
		return {success : (msg==''),message : msg};
		
	},
	
	save:function(){		
		try{
			top.Terapie.logger.info('CicliTerapia.save');
			
			var check = NSRegistrazione.check();
			
			if(check.success == false){
				attesa(false);
				return $.dialog(
					check.message,
					{
						buttons:[
							{"label":"Ok","action":$.dialog.hide}
						]
					}
				);
			}
			
            WindowCartella.executeStatement("AccessiAppuntamenti.xml","Servizi.clean",[WindowCartella.baseUser.LOGIN]);
			
			var iterator = new StatementIterator({
				loopHandler:NSRegistrazione.saveScheda,
				endHandler:function(){
						Impostazioni.chiudi();
						attesa(false);						
					}
			});
									
			for(var i in Cicli){
				top.Terapie.logger.debug('CicliTerapia.save Ciclo('+i+')');
				for (var j in Cicli[i].Terapie){
					iterator.addElement({'i':i,'j':j});
				}
			}	
					
			Progressbar.create(iterator.size());
			iterator.next();

			
		}catch(e){
			alert(e.description);
			
		}		

	},
	
	saveScheda:function(element){
		if(NSRegistrazione.goOn == false)return;
		top.Terapie.logger.info('CicliTerapia.save Terapia('+element.j+')');
		var $frame;
		var _frame;
		
		var ciclo = Cicli[element.i];
		var terapia = ciclo.Terapie[element.j];
							
		if(document.EXTERN.Procedura.value == 'INSERIMENTO'){

			STATO_TERAPIA = 'I';
			$frame = $('iframe[iden_modello="'+element.j+'"]');
			_frame = $frame[0].contentWindow;	

			_frame.$('input[name="NomeCiclo"]').val($('#NomeCiclo').val());
			_frame.$('input[name="NumeroCiclo"]').val(element.i);
			
			NSRegistrazione.ID_SESSIONE = element.j;
			
			NSRegistrazione.ModelloAttivo = element.j;
			if(typeof NSRegistrazione.AssociaModelloScheda[element.j]=='undefined'){
				NSRegistrazione.IDEN_TERAPIA = null;
				NSRegistrazione.IDEN_SCHEDA  = null;																					
			}else{
				NSRegistrazione.IDEN_SCHEDA = NSRegistrazione.AssociaModelloScheda[element.j];
			}
			
			_frame.$('input[name="OraInizio"]').val('00:00');
			_frame.$('input[name="OraFine"]').val('00:00');	
			_frame.$('input[name="NumeroGiorni"]').val($('input#IntervalloCiclo').val());	
			
			_frame.$('input[name="DataInizio"]').val(ciclo.DataInizio);					
			_frame.$('input[name="DataFine"]').val(ciclo.DataFine);	

		}else{

			STATO_TERAPIA = 'P';
			$frame = $('iframe[iden_terapia="'+element.j+'"][numero_ciclo="'+element.i+'"]');
			_frame = $frame[0].contentWindow;	
			
			NSRegistrazione.ID_SESSIONE = $frame.attr('iden_scheda');

			NSRegistrazione.IDEN_TERAPIA = element.j;
			NSRegistrazione.IDEN_SCHEDA  = $frame.attr('iden_scheda');
									
		}

		//sezione farmaci
		for(var z in terapia.Farmaci){

			_frame.$('div[cls="Farmaco"][iden="'+z+'"] input[name="DoseFarmaco"]').val(terapia.Farmaci[z].Dose);	

			_frame.$('div[cls="Farmaco"][iden="'+z+'"] select[name="UdmFarmaco"] option[value="'+terapia.Farmaci[z].Udm.value+'"]').attr("selected","selected");	
			

		}
				
		//sezione velocita
		if(terapia.Velocita>0){	
 			top.Terapie.logger.debug('CicliTerapia.save Velocita');																							
							
			if(terapia.VolumeTotale != ''){
				_frame.$('input[name="VolumeTotale"]').val(terapia.VolumeTotale);
			}else{
				_frame.farmaci.sommaUnitaCompatibili({tipo:'ml',nameDestinazione:'VolumeTotale'});						
			}

 			_frame.$('div[name="Velocita"] input').val(terapia.Velocita);
 			_frame.velocita.setDurata();
		}				

		var NewGiorniCiclo = '';
		var ArSomministrazioni = terapia.Somministrazioni
			.sort(function(a,b){
				return (parseInt(a.Giorno,10) - parseInt(b.Giorno,10))
			});
			
		for(var z=0;z<ArSomministrazioni.length;z++){
			
			var cod_sala = $('td[data-ciclo="'+element.i+'"][data-giorno="'+ArSomministrazioni[z].Giorno+'"] input.radSala:checked').val();
			
			NewGiorniCiclo += ArSomministrazioni[z].Giorno
							+ '|' + ArSomministrazioni[z].Ora 
							+ '|' + ArSomministrazioni[z].Data 
							+ '|' +  (cod_sala != undefined ? cod_sala : '' ) + ',';
		

		}
		//alert(NewGiorniCiclo)
		NewGiorniCiclo = NewGiorniCiclo.substring(0,NewGiorniCiclo.length-1);
		top.Terapie.logger.debug('CicliTerapia.save GiorniCiclo=' + NewGiorniCiclo);

		_frame.$('div[cls="Prescrizione"][tipo="5"] input[name="GiornoZero"][value="'+$('input[name="GiornoInizio"]:checked').val()+'"]').attr("checked","checked");	
		//alert(_frame.$('div[cls="Prescrizione"][tipo="5"] input[name="GiornoZero"]:checked').val());
		
		_frame.$('div[cls="Prescrizione"][tipo="5"] input[name="hGiorniCiclo"]').val(NewGiorniCiclo);						

		//alert(NSRegistrazione.IDEN_SCHEDA + '\n' + NSRegistrazione.IDEN_TERAPIA + '\n' + NewGiorniCiclo);

		var obj = _frame.checkValidita(NSRegistrazione.PROCEDURA);		
		//alert(element.i + '\n' + element.j + '\n' +obj.check + '\n' + obj.msg);
		
		_frame.salva(
			NSRegistrazione.PROCEDURA,
			NSRegistrazione.IDEN_SCHEDA,
			NSRegistrazione.ID_SESSIONE,
			element.i,
			NSRegistrazione.callBackOk,
			NSRegistrazione.callBackKo
		);
		
	}
	
};

function StatementIterator(parameters){/*loopHandler[,elements][,endHandler]*/
	
	parameters.loopHandler 	= checkParameter(parameters.loopHandler,function(){});
	parameters.endHandler 	= checkParameter(parameters.endHandler,function(){});
	parameters.elements 	= checkParameter(parameters.elements,[]);		
	
	this.index = -1;
	this.elements = parameters.elements;
	
	this.addElement = function(element){
		this.elements.push(element);
	};
	
	this.size = function(){
		return this.elements.length;
	};
	
	this.next = function(){

		Progressbar.next();
		
		this.index++;

		if(this.index<this.elements.length){
			
			var iterator = this;
			var element = this.elements[this.index];
			
			setTimeout(function(){
					parameters.loopHandler(element);
					iterator.next();
				},1);
		}else{
			setTimeout(function(){
					parameters.endHandler();
				},1);							
		}
	};
	
}

function checkParameter(pObj,pDefault){
	return typeof pObj == 'undefined' ? pDefault : pObj;
}