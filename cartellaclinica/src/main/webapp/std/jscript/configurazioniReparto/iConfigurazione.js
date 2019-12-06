$(document).ready(function(){

	$('div.Schede div').click(ListaSchede.Scheda.Click);
	$('div.Parametri div').live('click',ListaParametri.Parametro.Click);
	$('div#ContenitoreDefinizione input#btnSalvaDefinizione').live('click',ListaParametri.Parametro.Salva);
	
	ListaRecords.setEvents();
	ListaMenu.setEvents();
});

var ListaSchede = {
	Scheda:{
		Click:function(){
			var _this = $(this);			
			$('div.Schede div').removeClass('selected');
			_this.addClass('selected');
			
			configurazioneReparto.getListaParametri(_this.attr('id'),callBack);
			function callBack(pResp){
				$('div.Parametri').html(pResp);
				$('div#ContenitoreDefinizione').html('');
				ListaRecords.Reload(['OK','']);
				$('div.Menu').html('');
			}
		}
	}
	

};

var ListaParametri = {
	Parametro:{
		Click:function(){
			var _this = $(this);			
			$('div.Parametri div').removeClass('selected');
			_this.addClass('selected');
			
			//configurazioneReparto.getDefinizioneParametro(_this.attr('id'),callBack);
			//configurazioneReparto.getRecordsConfigurazione(_this.attr('id'),_this.attr('type'),_this.attr("menu"),callBack2);
			ListaParametri.Parametro.Load.Definizione();
			ListaParametri.Parametro.Load.Records();

			/*function callBack(pResp){
				$('div#ContenitoreDefinizione').html(pResp);
			}	
			function callBack2(pResp){
				ListaRecords.Reload(['OK',pResp]);
			}*/
		},
		
		Load:{
			Definizione:function(){
				var _this = $('div.Parametri div.selected');
				configurazioneReparto.getDefinizioneParametro(_this.attr('id'),callBack);
				function callBack(pResp){
					$('div#ContenitoreDefinizione').html(pResp);
				}					
			},
			
			Records:function(){
				var _this = $('div.Parametri div.selected');
				configurazioneReparto.getRecordsConfigurazione(_this.attr('id'),ListaParametri.Parametro.get.Type(),ListaParametri.Parametro.get.Menu(),callBack);
				function callBack(pResp){
					ListaRecords.Reload(['OK',pResp]);
				}				
			}
		},
		
		get:{
			Type : function(){
				return $('div#ContenitoreDefinizione input[name="dataType"]:checked').val();
			},
			
			Menu : function(){
				return $('div#ContenitoreDefinizione input#chkMenu').is(':checked')?'S':'N';
			}
		},
		
		Salva:function(){
			var codice = $('div#ContenitoreDefinizione div.Definizione').attr('name');
			var descr =  $('div#ContenitoreDefinizione input#txtDescrizione').val();
			var db =     $('div#ContenitoreDefinizione input#chkSessioneDb').is(':checked')?'S':'N';
			var web =    $('div#ContenitoreDefinizione input#chkSessioneWeb').is(':checked')?'S':'N';
			var client = $('div#ContenitoreDefinizione input#chkSessioneClient').is(':checked')?'S':'N';
			var type =   $('div#ContenitoreDefinizione input[name="dataType"]:checked').val();
			var menu =   $('div#ContenitoreDefinizione input#chkMenu').is(':checked')?'S':'N';
			configurazioneReparto.salvaDefinizioneParametro([codice,descr,db,web,client,type,menu],callBack);
			function callBack(pResp){	
				if(pResp[0]=='KO'){
					alert(resp[1]);
				}else{
					ListaParametri.Parametro.Load.Records();
					alert('Salvataggio effettuato');
				}
			}
		}
				
	}
	

};

var ListaRecords = {
	setEvents:function(){
		$('div.Records input#btnInserisciRecord').live('click',ListaRecords.Record.inserisci);
		$('div.Records input[name="btnEliminaRecord"]').live('click',function(){ListaRecords.Record.rimuovi(this);});
		$('div.Records input[type="text"]').live('blur',function(){ListaRecords.Record.aggiorna(this);});
		
		$('div.Records input[name="btnApriMenu"]').live('click',function(){
			ListaMenu.Load(ListaRecords.get.Key(),ListaRecords.get.Valore(this),null);
		});		
	},
	
	Reload:function(pHtml){
		if(pHtml[0]=='KO'){
			alert(pHtml[1]);
		}else{
			$('div.Records').html(pHtml[1]);
		}
	},
	
	get:{
		
		RowId:function(pObj){
			return $('div.Records table tr:eq(' + ListaRecords.get.RowIndex(pObj) + ')').attr('rowid');
		},
		
		RowIndex:function(pObj){
			while(pObj.nodeName.toUpperCase()!='TR'){
				pObj = pObj.parentNode;
			}
			return pObj.sectionRowIndex;			
		},
		
		Sito:function(pObj){
			return $('div.Records tr:eq('+ ListaRecords.get.RowIndex(pObj) +') input[name="txtSito"]').val();
		},
		
		Struttura:function(pObj){
			return $('div.Records tr:eq('+ ListaRecords.get.RowIndex(pObj) +') input[name="txtStruttura"]').val();
		},
		
		Reparto:function(pObj){
			return $('div.Records tr:eq('+ ListaRecords.get.RowIndex(pObj) +') input[name="txtReparto"]').val();
		},
		
		Valore:function(pObj){
			return $('div.Records tr:eq('+ ListaRecords.get.RowIndex(pObj) +') input[name="txtValore"]').val();
		},
		
		Key:function(){
			return $('div.Records table').attr("key");
		},
		
		Type:function(){
			return $('div.Records table').attr("type");
		},
		
		Menu:function(){
			return $('div.Records table').attr("menu");
		}
	},
	
	Record:{
		inserisci:function(){			
			configurazioneReparto.inserisciRecordConfigurazione(ListaRecords.get.Key(),ListaRecords.get.Type(),ListaRecords.get.Menu(),callBack);
			function callBack(pResp){
				ListaRecords.Reload(pResp);
			}
		},
		
		rimuovi:function(pObj){
			configurazioneReparto.cancellaRecordConfigurazione(ListaRecords.get.RowId(pObj),ListaRecords.get.Key(),ListaRecords.get.Type(),ListaRecords.get.Menu(),callBack);
			function callBack(pResp){
				ListaRecords.Reload(pResp);
			}
		},
		
		aggiorna:function(pObj){
			configurazioneReparto.setRecordConfigurazione([
					ListaRecords.get.RowId(pObj),
					ListaRecords.get.Sito(pObj),
					ListaRecords.get.Struttura(pObj),
					ListaRecords.get.Reparto(pObj),
					ListaRecords.get.Valore(pObj),
					ListaRecords.get.Type(),
					ListaRecords.get.Menu()
				],callBack);
			function callBack(pResp){
				if(pResp[0]=='KO'){
					alert(pResp[1]);				
				}
			}

		}
	}
};

var ListaMenu = {
	
	setEvents : function(){
		$('div.Menu input[name="btnApriMenu"]').live('click',function(){ListaMenu.ClickApriMenu(this);});			
	},
	
	ClickApriMenu : function(pObj){
		if(pObj.value == '+'){
			ListaMenu.Load(ListaMenu.get.Procedura(pObj),ListaMenu.get.CodiceReparto(pObj),ListaMenu.get.IdenFiglio(pObj));
			pObj.value = '-';
		}else{
			ListaMenu.Empty(ListaMenu.get.IdenFiglio(pObj));
			pObj.value = '+';
		}
	},
	
	Load : function(pProcedura, pCodiceReparto,pIdenPadre){
		configurazioneReparto.getMenu(pProcedura,pCodiceReparto, pIdenPadre, callBack);
		function callBack(pResp){
			if(pIdenPadre == null){
				$('div.Menu').html(pResp);
			}else{
				$('div.Menu table tr[iden_padre="' + pIdenPadre + '"] td').html(pResp);
			}
		}
	},
	
	Empty : function(pIdenPadre){
		$('div.Menu table tr[iden_padre="' + pIdenPadre + '"] td').html('');
	},
	
	get : {
		
		Table : function(pObj){
			while(pObj.nodeName.toUpperCase()!='TABLE'){
				pObj = pObj.parentNode;
			}
			return pObj;
		},
		
		Tr:function(pObj){
			while(pObj.nodeName.toUpperCase()!='TR'){
				pObj = pObj.parentNode;
			}
			return pObj;			
		},		
		
		Procedura : function(pObj){
			return $(ListaMenu.get.Table(pObj)).attr("procedura");
		},
		
		CodiceReparto : function(pObj){
			return $(ListaMenu.get.Table(pObj)).attr("codice_reparto");			
		},
		
		IdenFiglio : function(pObj){
			return $(ListaMenu.get.Tr(pObj)).attr("iden_figlio");
		}
	}
};