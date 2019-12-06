jQuery(document).ready(function(){
	
	try{
		window.WindowCartella = window;
		while(window.WindowCartella.name != 'schedaRicovero'){			
			window.WindowCartella = window.WindowCartella.parent;
		}
		window.vDati = WindowCartella.getForm(document);
		window.logger = WindowCartella.FunzioniCartella.logger;
		
		TAB.init();	
		
		WindowCartella.utilMostraBoxAttesa(false);	
	}catch(e){
		window.WindowCartella = window.vDati = null;//esterno alla cartella		
		top.utilMostraBoxAttesa(false);	
	}	
	
});

var TAB = {
	
	init:function(){
		try{
			var vKEY = document.EXTERN.KEY.value;
			eval('var conf = ' + WindowCartella.baseReparti.getValue(vDati.reparto,'CC_TABULATORI'));
			
			var lista = conf[vKEY]['lista'];
			
			window.name = vKEY.toString();
			
			WindowCartella.utilMostraBoxAttesa(true);	
			attivaTab(lista,typeof conf[vKEY]['tabdefault'] == 'undefined' ? "1" : conf[vKEY]['tabdefault']);
			
		}catch(e){
			alert(e.description);
			logger.error(e.description);
		}
	},
	
	getFrameDocument:function(pIndex){
		return document.getElementsByTagName("IFRAME")[pIndex].contentWindow.document;
	},
	
	frames:{
		show:function(pIndex){
			$('iframe').closest('.tab').hide();
			$('iframe:eq('+pIndex+')').closest('.tab').show();
		}
	},
	
	items:{
		'SintesiBisogni':{
			label:'Sintesi Bisogni',
			action:function(){WindowCartella.apriSintesiBisogni(TAB.getFrameDocument(0));},
			forcereload:false
		},
		'WkObiettivi':{
			label:'Wk Obiettivi',
			action:function(){WindowCartella.apriWkObiettivi(TAB.getFrameDocument(1));},
			forcereload:false
		},
		'Anamnesi':{
			label:'Anamnesi',
			action:function(){WindowCartella.apriAnamnesi(TAB.getFrameDocument(0));},
			forcereload:false
		},
		'EsameObiettivo':{
			label:'Esame Obiettivo',
			action:function(){WindowCartella.apriEsameObiettivo(TAB.getFrameDocument(1));},
			forcereload:false
		},
        'EsameObiettivoCardiologico':{
			label:'Esame Obiettivo Cardiologico',
			action:function(){WindowCartella.apriEsameObiettivoSpecialistico(TAB.getFrameDocument(2));},
			forcereload:false            
        },        
		'DiarioInfermieristico':{
			label:'Diario Infermieristico',
			action:function(){WindowCartella.apriDiario('INFERMIERE',TAB.getFrameDocument(1));},
			forcereload:false
		}
				
			
	}	
};

