var Cicli = {};

var CicliBuilder = {
	
	
	addedFarmaco:function(params,pWindow){//tipo,iden_farmaco,IdSessione

		for(var i in Cicli){
			Cicli[i].Terapie[params.IdSessione].Farmaci['' + params.iden_farmaco + ''] = new Farmaco(pWindow.$('div[cls="Farmaco"][iden="'+params.iden_farmaco+'"]'))
		}
		
		$.fancybox.close();
		
		Tabber.reBuild();
	},
	
	addGiorno:function(pObj){
		
		$.dialog(
			'Inserire giorno&nbsp;<input id="txtNuovoGiorno"/>',
			{
				buttons:[
					{"label":"Ok","action":function(){execute();}},
					{"label":"Annulla","action":function(){$.dialog.hide();}}								
				]
			}
		);		
		
		$('#txtNuovoGiorno').focus();
		
		function execute(){

			var value = parseInt($('#txtNuovoGiorno').val(),10);

			if(value > parseInt($('input#IntervalloCiclo').val(),10)){
				$.dialog.hide();//per resettare la dialog
				
				$.dialog(
					"Impossibile inserire un giorno con indice successivo all' intervallo del ciclo",
					{
						buttons:[
							{"label":"Ok","action":function(){$.dialog.hide();}}														
						]
					}
				);			
			
			}else{	
				var exists = false;
				for(var i = 0;i < GlobalVariables.days.length; i++){
					
					if(GlobalVariables.days[i].giorno == value){
						exists = true;
						break;
					}
					
				}
				
				if(exists){
					$.dialog.hide();//per resettare la dialog
					
					$.dialog(
						"Giorno già presente",
						{
							buttons:[
								{"label":"Ok","action":function(){$.dialog.hide();}}														
							]
						}
					);
				}else{
				
					var obj = {giorno:value,cicli:{}};
					
					for (var i in Cicli){						
						data = clsDate.dateAddStr(Cicli[i].DataInizio,'DD/MM/YYYY','00:00',"D",parseInt(value,10) - GlobalVariables.giorno_inizio);						
						data = clsDate.str2str(data,'DD/MM/YYYY','YYYYMMDD');	
						obj.cicli[i] = data;
					}
					
					GlobalVariables.days.push(obj);										
					GlobalVariables.days.sort(function(a,b){return a.giorno - b.giorno;});															
					
					Tabber.reBuild();	
					Tabber.showTab($(pObj).attr("idCiclo"));
					$.dialog.hide();
				}
			}
			
			
		}
	},
	
	removeGiorno:function(pObj){
		
		pObj = $(pObj);
		
		$.dialog(
			"Si vuole procedere alla rimozione del giorno '" + pObj.attr('Giorno') + "' per tutti i cicli?",
			{
				buttons:[
					{"label":"Si","action":function(){execute();$.dialog.hide();}},
					{"label":"No","action":function(){$.dialog.hide();}}								
				]
			}
		);		
		
		function execute(){
								
			for(var i = 0;i < GlobalVariables.days.length; i++){
				
				if(GlobalVariables.days[i].giorno == pObj.attr('Giorno')){
					GlobalVariables.days.splice(i, 1);
					break;
				}
				
			}			
			
			for(var i in Cicli){
				for (var j in Cicli[i].Terapie){
					for(var z=0;z<Cicli[i].Terapie[j].Somministrazioni.length;z++){
						try{
							if(Cicli[i].Terapie[j].Somministrazioni[z].Giorno == parseInt(pObj.attr('Giorno'),10)){
								Cicli[i].Terapie[j].Somministrazioni.splice(z,1);
							}
	
						}catch(e){
							alert(e.description);
						}
					}
				}
			}
			Tabber.reBuild();
			Tabber.showTab($(pObj).attr("idCiclo"));
		}
	
	},	
	
	addOrario:function(pObj){
		
		$.dialog(
			"Nuovo Orario&nbsp;<input id='txtNuovoOrario'/><br/><br/>Si vuole aggiungere il nuovo orario a tutti i cicli successivi?",
			{
				buttons:[
					{"label":"Si","action":function(){execute(true);$.dialog.hide();}},
					{"label":"No","action":function(){execute(false);$.dialog.hide();}},							
					{"label":"Annulla","action":function(){$.dialog.hide();}}					
				]
			}
		);		

		$('#txtNuovoOrario').bind('keyup',checkDato.isHour).focus();
		
		function execute(replica){
			pObj = $(pObj);
			var NuovoOrario = $('#txtNuovoOrario').val();		
			if(replica){

				for (var i in Cicli){
					if(parseInt(i,10)>=parseInt(pObj.attr("idCiclo"),10)){

						Cicli[i].Terapie[pObj.attr("idTerapia")]
							.Somministrazioni.push({
								Giorno:pObj.attr("Giorno"),
								Ora:NuovoOrario,
								Data:$('div[data-giorno="'+pObj.attr("Giorno")+'"]').attr("data-data")
							});
					}
				}
			}else{			
				Cicli[pObj.attr("idCiclo")].Terapie[pObj.attr("idTerapia")]
					.Somministrazioni.push({
						Giorno:pObj.attr("Giorno"),
						Ora:NuovoOrario,
						Data:$('div[data-giorno="'+pObj.attr("Giorno")+'"]').attr("data-data")						
					});
			}
			
			Tabber.reBuild();	
			Tabber.showTab($(pObj).attr("idCiclo"));
		}
				
	},
	
	removeOrario:function(pObj){
		
		$.dialog(
			"Si vuole rimuovere l'orario a tutti i cicli successivi?",
			{
				buttons:[
					{"label":"Si","action":function(){execute(true);$.dialog.hide();}},
					{"label":"No","action":function(){execute(false);$.dialog.hide();}},							
					{"label":"Annulla","action":function(){$.dialog.hide();}}					
				]
			}
		);	
		
		function execute(replica){
			
			while(pObj.className != 'Detail'){
				pObj = pObj.parentNode;
			}
			pObj = $(pObj);

			try{			
				
				if(replica){
					for (var i in Cicli){
						if(parseInt(i,10)>=parseInt(pObj.attr("idCiclo"),10)){
							var ar = Cicli[i].Terapie[pObj.attr("idTerapia")].Somministrazioni;
							for (var i = 0; i< ar.length ; i++){
								if(ar[i].Giorno ==pObj.attr("Giorno")  && ar[i].Ora == pObj.attr("value")){
									ar.splice(i,1);
									break;
								}
							}
						}
					}
				}else{			
					var ar = Cicli[pObj.attr("idCiclo")].Terapie[pObj.attr("idTerapia")].Somministrazioni;
					for (var i = 0; i< ar.length ; i++){
						if(ar[i].Giorno ==pObj.attr("Giorno")  && ar[i].Ora == pObj.attr("value")){
							ar.splice(i,1);
							break;
						}
					}
				}			
					
				Tabber.reBuild();
				Tabber.showTab($(pObj).attr("idCiclo"));
			}catch(e){
				alert(e.description);
			}		
		}
				
	},
	
	setDose:function(){
		vObj = this;
		$.dialog(
			"Si vuole modificare il dosaggio del farmaco per tutti i cicli successivi?",
			{
				buttons:[
					{"label":"Si","action":function(){execute(true);$.dialog.hide();}},
					{"label":"No","action":function(){execute(false);$.dialog.hide();}}				
				]
			}
		);	
		
		function execute(replica){
			var _this = $(vObj);
						
			if(replica){
				for (var i in Cicli){
					if(parseInt(i,10)>=parseInt(_this.attr("id_ciclo"),10)){				
						Cicli[i].Terapie[_this.attr("iden_terapia")].Farmaci[_this.attr("iden_farmaco")].Dose = _this.val();				
					}
				}
			}else{	
				Cicli[_this.attr("id_ciclo")].Terapie[_this.attr("iden_terapia")].Farmaci[_this.attr("iden_farmaco")].Dose = _this.val();		
			}		
			
			Tabber.reBuild();
			Tabber.showTab(_this.attr("id_ciclo"));			
			
		}
	
	},
	
	setVelocita:function(){
		vObj = this;
		$.dialog(
			"Si vuole modificare la velocità di infusione della terapia per tutti i cicli successivi?",
			{
				buttons:[
					{"label":"Si","action":function(){execute(true);$.dialog.hide();}},
					{"label":"No","action":function(){execute(false);$.dialog.hide();}}				
				]
			}
		);
		
		function execute(replica){
			var _this = $(vObj);

			if(replica){
				for (var i in Cicli){
					if(parseInt(i,10)>=parseInt(_this.attr("id_ciclo"),10)){				
						Cicli[i].Terapie[_this.attr("iden_terapia")].Velocita = _this.val();				
					}
				}
			}else{	
				Cicli[_this.attr("id_ciclo")].Terapie[_this.attr("iden_terapia")].Velocita = _this.val();		
			}		
			
			Tabber.reBuild();
			Tabber.showTab(_this.attr("id_ciclo"));		
		}
				
	},
	
	setVolumeTotale:function(){
		vObj = this;
		
		if($(vObj).val() == '' || $(vObj).val() == 0){
			$.dialog(
				"Valorizzare correttamente il volume totale",
				{
					buttons:[
						{"label":"Ok","action":function(){$.dialog.hide();$(vObj).focus();}}
					]
				}
			);
		}else{		
			$.dialog(
				"Si vuole modificare il volume totale della terapia per tutti i cicli successivi?",
				{
					buttons:[
						{"label":"Si","action":function(){execute(true);$.dialog.hide();}},
						{"label":"No","action":function(){execute(false);$.dialog.hide();}}				
					]
				}
			);
		}
		
		function execute(replica){
			var _this = $(vObj);

			if(replica){
				for (var i in Cicli){
					if(parseInt(i,10)>=parseInt(_this.attr("id_ciclo"),10)){				
						Cicli[i].Terapie[_this.attr("iden_terapia")].VolumeTotale = _this.val();				
					}
				}
			}else{	
				Cicli[_this.attr("id_ciclo")].Terapie[_this.attr("iden_terapia")].VolumeTotale = _this.val();		
			}		
			
			Tabber.reBuild();
			Tabber.showTab(_this.attr("id_ciclo"));		
		}
				
	},			
		
	setUdm:function(){
		vObj = this;
		$.dialog(
			"Si vuole modificare l'unità di misura del farmaco per tutti i cicli successivi?",
			{
				buttons:[
					{"label":"Si","action":function(){execute(true);$.dialog.hide();}},
					{"label":"No","action":function(){execute(false);$.dialog.hide();}}				
				]
			}
		);
		
		function execute(replica){
			var _this = $(vObj);
			
			if(replica){
				for (var i in Cicli){
					if(parseInt(i,10)>=parseInt(_this.attr("id_ciclo"),10)){									
						Cicli[i].Terapie[_this.attr("iden_terapia")].Farmaci[_this.attr("iden_farmaco")].Udm.value = _this.val();
					}
				}
			}else{	
				Cicli[_this.attr("id_ciclo")].Terapie[_this.attr("iden_terapia")].Farmaci[_this.attr("iden_farmaco")].Udm.value = _this.val();
			}		
			
			Tabber.reBuild();
			Tabber.showTab(_this.attr("id_ciclo"));		
		}
	
	},		
		
	build:function(pNumeroCiclo,pIdenTerapia,pFrameWindow){
		top.Terapie.logger.debug('CicliBuilder.build('+pNumeroCiclo+','+pIdenTerapia+')');
		try{

			if(typeof Cicli[pNumeroCiclo] == 'undefined'){
				Cicli[pNumeroCiclo] = {};				
				
				switch (document.EXTERN.Procedura.value){
					case 'INSERIMENTO':
						/********/
						var intervallo = parseInt($('input#IntervalloCiclo').val(),10);
						
						if(GlobalVariables.DataInizioCiclo == null)
							Cicli[pNumeroCiclo].DataInizio = $('input#DataInizio').val();
						else{
							Cicli[pNumeroCiclo].DataInizio = clsDate.dateAddStr(
									GlobalVariables.DataInizioCiclo,'DD/MM/YYYY','00:00','D',intervallo
								);			
						}
						Cicli[pNumeroCiclo].DataFine = clsDate.dateAddStr(
							Cicli[pNumeroCiclo].DataInizio,'DD/MM/YYYY','00:00','D',intervallo
						);		
						GlobalVariables.DataInizioCiclo = 	Cicli[pNumeroCiclo].DataInizio;						
						/********/						
						break;
					default:
						Cicli[pNumeroCiclo].DataInizio = pFrameWindow.$('input[name="DataInizio"]').val();
						Cicli[pNumeroCiclo].DataFine   = pFrameWindow.$('input[name="DataFine"]').val();
						break;
				}
				
				//alert(Cicli[pNumeroCiclo].DataInizio + '\n' + Cicli[pNumeroCiclo].DataFine);
				
			}
			
			if(typeof Cicli[pNumeroCiclo].Terapie == 'undefined')
				Cicli[pNumeroCiclo].Terapie = {};
			
			if(typeof Cicli[pNumeroCiclo].Terapie[pIdenTerapia]== 'undefined'){
				Cicli[pNumeroCiclo].Terapie[pIdenTerapia] = new Terapia(pIdenTerapia,pFrameWindow);
			}
			
			var Max=0;
			
			for(var j=0;j< Cicli[pNumeroCiclo].Terapie[pIdenTerapia].Somministrazioni.length; j++){
				
				var somministrazione = Cicli[pNumeroCiclo].Terapie[pIdenTerapia].Somministrazioni[j];
				
				if(somministrazione.Giorno > Max){
					Max= somministrazione.Giorno
				}
				
				var index = null;
				
				for(var z=0;z<GlobalVariables.days.length;z++){
					if(GlobalVariables.days[z].giorno == somministrazione.Giorno){
						index = z;
						break;
					}
				}

				if(index == null){					
					GlobalVariables.days.push({giorno:somministrazione.Giorno,cicli:{}});
					index = GlobalVariables.days.length - 1;
				}
//				alert('somministrazione.Data : ' + somministrazione.Data)
				if(somministrazione.Data == null || somministrazione.Data == ''){
					somministrazione.Data = clsDate.dateAddStr(Cicli[pNumeroCiclo].DataInizio,'DD/MM/YYYY','00:00',"D",somministrazione.Giorno - GlobalVariables.giorno_inizio);
					somministrazione.Data = clsDate.str2str(somministrazione.Data,'DD/MM/YYYY','YYYYMMDD');
				}

				GlobalVariables.days[index].cicli[pNumeroCiclo] = somministrazione.Data;									
				
			}
				
			GlobalVariables.maxGiorno  = (GlobalVariables.maxGiorno<Max?Max:GlobalVariables.maxGiorno);					
			
		}catch(e){
			top.Terapie.logger.error('CicliBuilder.build -' + e.description);
		}
	},
	
	loadTerapieFromFrames:function(){		
		top.Terapie.logger.info('CicliBuilder.loadTerapieFromFrames');
		
		try{			
			
			GlobalVariables.giorno_inizio = (parseInt($('input[name="GiornoInizio"]:checked').val(),10));
			
			Cicli = {};
			
			var iterator = new StatementIterator({
				loopHandler:CicliBuilder.loadTerapiaFromFrame,
				endHandler:function(){
										
						/*for(var i = 0 ; i < GlobalVariables.days.length ; i++){
							var msg = GlobalVariables.days[i].giorno + '\n';
							for(z in GlobalVariables.days[i].cicli){
								msg += z + ':' + GlobalVariables.days[i].cicli[z];
							}
							alert(msg);
						}*/
						
						GlobalVariables.days.sort(function(a,b){return a.giorno - b.giorno;});						
					
						Impostazioni.adeguaUdmABsa();
						Tabber.reBuild();			
						Progressbar.remove();						
											
						attesa(false);						
					}
			});
								
			$('iframe').each(function(i){
				iterator.addElement({index:i,obj:$(this)});
			});

			Progressbar.create(iterator.size()+2);
			iterator.next();

			
		}catch(e){
			alert('loadTerapieFromFrames:'+e.description);
			attesa(false);
		}
		
		
	},
	
	loadTerapiaFromFrame:function(element){	
		
		top.Terapie.logger.debug('CicliBuilder.loadTerapiaFromFrame index(' + element.index + ')');		

		switch (document.EXTERN.Procedura.value){
			case 'INSERIMENTO':
				
				for(var j = 1 ;j <= $('input#NumeroCicli').val() ;j ++){
					CicliBuilder.build(j,element.obj.attr("iden_modello"),element.obj[0].contentWindow);
				}					
				break;
			case 'MODIFICA_TERAPIA':
			case 'MODIFICA_CICLO':
					CicliBuilder.build(element.obj.attr("numero_ciclo"),element.obj.attr("iden_terapia"),element.obj[0].contentWindow);
				break;
		}		
	}
};

function Terapia(pId,pWindow){
	//var _giorno_inizio = (parseInt($('input[name="GiornoInizio"]:checked').val(),10));
	//alert('ID:'+pId)
	//this.Modificata = false;
	this.id = pId;	
	this.Farmaci = {};
	this.Somministrazioni = new Array();
	
	try{
		this.VolumeTotale = pWindow.$('div[name="VolumeTotale"] input').val();
	}catch(e){
		this.VolumeTotale = 0;
	}

	//alert('Volume:'+this.VolumeTotale)
	
	try{
		this.Velocita     = pWindow.$('div[name="Velocita"] input').val();
	}catch(e){
		this.Velocita     = 0;
	}

	//alert('Velocita:'+this.Velocita)

	var arFarmaci = pWindow.$('div[cls="Farmaco"]');
	for (var i=0;i<arFarmaci.length;i++){
		
		var _farmaco = pWindow.$(arFarmaci[i]);		
		var IdenFarmaco = _farmaco.attr('iden');
		this.Farmaci[''+IdenFarmaco+''] = new Farmaco(_farmaco);
		
		/*try{			
			var _farmaco = pWindow.$(arFarmaci[i]);
			
			var IdenFarmaco = _farmaco.attr('iden');

			this.Farmaci[''+IdenFarmaco+''] = {};
			this.Farmaci[''+IdenFarmaco+''].tipo		 = _farmaco.parent('div[cls="GruppoFarmaci"]').attr("tipo")
			this.Farmaci[''+IdenFarmaco+''].Descrizione  = _farmaco.find('div[cls="DescrizioneFarmaco"]').text();
			this.Farmaci[''+IdenFarmaco+''].Dose         = getDose();
			this.Farmaci[''+IdenFarmaco+''].Udm			 =  getUdm();
			this.Farmaci[''+IdenFarmaco+''].genuine		 = {};			
			this.Farmaci[''+IdenFarmaco+''].genuine.Udm	 = getUdm();
			this.Farmaci[''+IdenFarmaco+''].genuine.Dose = getDose();
			function getDose(){
				return _farmaco.find('input[name="DoseFarmaco"]').attr("value");
			}
			
			function getUdm(){
				var Udm = {};
				
				Udm.value = _farmaco.find('div[name="UdmFarmaco"]').attr("value");
				Udm.options	 = getUdmOptions();
				Udm.adeguata = '';
				
				return Udm;
			}

			function getUdmOptions(){
				var ret = {};
				_farmaco.find('div[name="UdmFarmaco"] option').each(function(){
					var _this = $(this);
					ret[''+_this.attr("value")+''] = {
							text:_this.text(),
							codice:_this.attr("codice"),
							somma:_this.attr("somma")
						};
				});	
				return ret;
			}	
			
		}catch(e){
			alert(e.description);
		}*/				
		
	}
	//alert(pWindow.$('div[cls="Prescrizione"][tipo="5"] input[name="hGiorniCiclo"]').val());	
	var arSomministrazioni = pWindow.$('div[cls="Prescrizione"][tipo="5"] input[name="hGiorniCiclo"]').val().split(',')
	for(var i=0;i<arSomministrazioni.length;i++){
		
		var settings = arSomministrazioni[i].split('|')
		
		var _giorno = settings[0];
		var _orario =  settings[1];
		var _data = settings.length > 2 ?  settings[2] : null;
		var _cod_sal = settings.length > 3 ?  settings[3] : null;
//		var _offset = settings.length > 2 ?  parseInt(settings[2],10) : (parseInt(_giorno,10) - _giorno_inizio);
		
		this.Somministrazioni.push({Giorno:_giorno,Ora:_orario,Data:_data/*Offset:_offset*/,CodSal:_cod_sal})
	}
	
};

function Farmaco(_farmaco){
	try{

		this.tipo		 = _farmaco.parent('div[cls="GruppoFarmaci"]').attr("tipo")
		this.Descrizione  = _farmaco.find('div[cls="DescrizioneFarmaco"]').text();
		this.Dose         = getDose();
		this.Udm			 =  getUdm();
		this.genuine		 = {
				Udm : getUdm(),
				Dose : getDose()
			};			

		function getDose(){
			return _farmaco.find('input[name="DoseFarmaco"]').attr("value");
		}
		
		function getUdm(){
			var Udm = {};
			
			Udm.value = _farmaco.find('div[name="UdmFarmaco"]').attr("value");
			Udm.options	 = getUdmOptions();
			Udm.adeguata = '';
			
			return Udm;
		}

		function getUdmOptions(){
			var ret = {};
			_farmaco.find('div[name="UdmFarmaco"] option').each(function(){
				var _this = $(this);
				ret[''+_this.attr("value")+''] = {
						text:_this.text(),
						codice:_this.attr("codice"),
						somma:_this.attr("somma")
					};
			});	
			return ret;
		}	
		
	}catch(e){
		alert(e.description);
	}	
}