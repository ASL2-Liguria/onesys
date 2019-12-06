var Impostazioni = {
	
	Procedura:null,
	
	IDEN_CICLO:null,
	
	IDEN_TERAPIA:null,
	
	sale : [],
	
	init:function(){

		Impostazioni.Procedura = $('form[name="EXTERN"] input[name="Procedura"]').val();
		
		Impostazioni.IDEN_CICLO = $('form[name="EXTERN"] input[name="IDEN_CICLO"]').val();
		
		if($('form[name="EXTERN"] input[name="IDEN_TERAPIA"]').length > 0){
			Impostazioni.IDEN_TERAPIA = $('form[name="EXTERN"] input[name="IDEN_TERAPIA"]').val();
		}		
						
		Impostazioni.abilitaBtn('btnRicalcolaCicli',false);
		Impostazioni.abilitaBtn('btnRegistraRilevazioni',false);
		Impostazioni.abilitaBtn('btnAdeguaBsa',false);
		Impostazioni.sale = eval($('#hSale').val());

		$('iframe').ready(function(){
			attesa(true);
			setTimeout(CicliBuilder.loadTerapieFromFrames,1);
		});	
		
	},
	
	setEvents:function(){
		$('a#btnRegistraRilevazioni').click(function(){
			if(!$(this).hasClass("disabled")){
				Impostazioni.registraRilevazioni();
			}
		});
		
		$('a#btnAdeguaBsa').click(function(){
			if(!$(this).hasClass("disabled")){
				Impostazioni.adeguaUdmABsa();
				Tabber.reBuild();				
			}
		});		
		
		$('a#btnRicalcolaCicli').click(function(){
			
			if($(this).hasClass("disabled") || !Impostazioni.check()){
				return attesa(false);
			}
			
			GlobalVariables.Reset();	
			attesa(true);
			setTimeout(CicliBuilder.loadTerapieFromFrames,1);
			Impostazioni.abilitaBtn('btnRicalcolaCicli',false);
		});
		
		$('a#btnConferma').click(function(){						

			attesa(true);
			
			setTimeout(function(){
				if(!NSRegistrazione.cicliGenerati){
					attesa(false);
					return alert('Generare i cicli prima di registrare');
				}
	
				switch(document.EXTERN.Procedura.value){
					case 'INSERIMENTO':	
						if(!Impostazioni.check()){
							return attesa(false);
						}
					default:
						break;
						
				}			
				
				NSRegistrazione.save();
			},1);

		});
			
		$('input#DataInizio')
			.val(clsDate.getData(new Date(),'DD/MM/YYYY'))
			.blur(function(){Impostazioni.abilitaBtn('btnRicalcolaCicli',true);})
			.datepick({
					onClose: function(){ImpostazioniabilitaBtn('btnRicalcolaCicli',true);},
					showOnFocus: false,  
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				});				
		$('input[name="GiornoInizio"]').click(function(){Impostazioni.abilitaBtn('btnRicalcolaCicli',true);})			
		$('input#NumeroCicli , input#IntervalloCiclo')			
			.keyup(function(){Impostazioni.abilitaBtn('btnRicalcolaCicli',true);});	
		
		$('input#IntervalloCiclo')
			.blur(function(){				
				if(parseInt($(this).val(),10) <= (parseInt(GlobalVariables.maxGiorno,10) + (1 - parseInt($('input[name="GiornoInizio"]:checked').val(),10)))){
					alert('Impossibile impostare un intervallo minore del giorno definito');
					$(this).focus();
				}
			});			
		
		$('div[name="addGiorno"]').live('click',function(){CicliBuilder.addGiorno(this);});
		$('div[name="removeGiorno"]').live('click',function(){CicliBuilder.removeGiorno(this);});		
		$('div[name="addOrario"]').live('click',function(){CicliBuilder.addOrario(this);});
		$('div[name="removeOrario"]').live('click',function(){CicliBuilder.removeOrario(this);});	
		
		$('div[name="addFarmaco"]').live('click',function(){
				
				var url = 'servletGeneric?' 
						+ 'class=cartellaclinica.gestioneTerapia.plgTerapia&modality=F' 
						+ '&reparto=' + document.EXTERN.reparto.value
						+ '&PROCEDURA=CICLO'
						+ '&idenTerapia=' + $(this).attr("data-terapia");					
				
				$.fancybox({
					'padding' : 3,
					'width' : 600,
					'height' : 440,
					'href' : url,
					'type' : 'iframe'
				});
				
			});
		
		$('div[name="previousDay"]').live('click',function(){
				var _label = $(this).next();
				Impostazioni.switchDay(_label,-1);
			});
		$('div[name="nextDay"]').live('click',function(){
				var _label = $(this).prev();
				Impostazioni.switchDay(_label,1);			
			});
		
		$('ul#tabCicli.ulTabs li').live('click',function(){
			$('ul#tabCicli.ulTabs li').removeClass("tabActive");
			$(this).addClass("tabActive");
			$('div.Tab').hide();
			$('div.Tab[name="' + $(this).attr("name") + '"]').show();
			
			$('div#headerTabs h2').text('Inizio : ' + $(this).attr('inizio') /*+ ' Fine : ' + $(this).attr('fine')*/);
		});				
		
		$('table.Farmaci input[name="txtDose"]').live('blur',CicliBuilder.setDose);
		$('input[name="txtVelocita"]').live('blur',CicliBuilder.setVelocita);
		$('input[name="txtVolumeTotale"]').live('blur',CicliBuilder.setVolumeTotale);
		$('select[name="cmbUdm"]').live('change',CicliBuilder.setUdm);				
		
		$('#txtPeso ,#txtAltezza').keydown(function(){
			$(this).data("oldValue",$(this).val());
		});		
		
		$('#txtPeso ,#txtAltezza').keyup(function(){					
			Impostazioni.abilitaBtn('btnRegistraRilevazioni',true);
			Impostazioni.calcolaBsa();
			Impostazioni.abilitaBtn('btnAdeguaBsa',true);
		});
		
		$('#txtBsa').keyup(function(){
			Impostazioni.abilitaBtn('btnAdeguaBsa',true);
		});
		
		$('div[name="remove-farmaco"]').live('click',function(){
			var _tr = $(this).closest('tr[data-farmaco]');
			
			$('iframe[iden_modello="'+_tr.attr("data-terapia")+'"]')[0]
				.contentWindow.farmaci.ButtonRimuoviClick({
						iden_farmaco:_tr.attr("data-farmaco"),
						id_sessione:_tr.attr("data-terapia"),
						callBackOk:function(){
							for(var i in Cicli){
								for(var j in Cicli[i].Terapie){
									if(j == _tr.attr("data-terapia")){
										delete Cicli[i].Terapie[j].Farmaci[_tr.attr("data-farmaco")];										
									}
								}
							}
							
							Tabber.reBuild();
						}/*,
						callBackKo:function(){alert('ko')}*/
					}					
				);
		});
		
		$('input.radSala').live('change',function(){
			var name = $(this).attr("name");
			$('input[name="'+name+'"]').parent().removeClass('Sel');
			$(this).parent().addClass('Sel');
		});
		
		
	},
	
	check:function(){
		var msg ='';
		if($('input#DataInizio').val() == '')					msg+='Compilare il campo "Data inizio"\n';
		if($('input#NumeroCicli').val() == '')					msg+='Compilare il campo "Numero cicli"\n';
		if($('input#IntervalloCiclo').val() == '')				msg+='Compilare il campo "Giorni intervallo"\n';
		if($('input[name="GiornoInizio"]:checked').length == 0)	msg+='Compilare il campo "Giorno inizio ciclo"\n';
		if(msg==''){
			return true;
		}else{
			alert(msg);
			return false;
		}
	},
	
	adeguaUdmABsa:function(){

		var BSA = $('#txtBsa').val();

		if(typeof BSA=='undefined' || BSA == ""){
			return;
		}
		
		BSA = BSA.replace(',','.');
		
		for (var i in Cicli){
			var ciclo = Cicli[i];

			for(var j in ciclo.Terapie){
				var terapia = ciclo.Terapie[j];
								
				for (var z in terapia.Farmaci){
					var farmaco = terapia.Farmaci[z];
					
					var codice = farmaco.Udm.options[""+farmaco.genuine.Udm.value].codice;
					
					if(codice == 'mgm2'){
						
						for(var x in farmaco.Udm.options){
													
							if(farmaco.Udm.options[x].codice == 'mg'){
								//alert('found')
								var Valore = farmaco.genuine.Dose * BSA;
								Valore = Math.round(Valore*Math.pow(10,2))/Math.pow(10,2);
								farmaco.Dose = Valore;
																	
								farmaco.Udm.value = x;
								farmaco.Udm.adeguata = 'Dosaggio adeguato in base al BSA rilevato';
								break;
							}
							
						}
						
					}
				}

			}
		}
		Impostazioni.abilitaBtn('btnAdeguaBsa',false);

	},
	
	calcolaBsa:function(){
		
		var peso = $('#txtPeso').val().replace(',','.');
		var altezza = $('#txtAltezza').val().replace(',','.');		
	
		if(peso == '' || altezza == '')return;
	
		var bsa = 0.007184 * (Math.pow(altezza,0.725)* Math.pow(peso,0.425));
		bsa = Math.round(bsa*Math.pow(10,2))/Math.pow(10,2);
		
		$('#txtBsa').val(bsa);
		
	},
	
	abilitaBtn:function(pIdButton,abilita){
		if(abilita){
			$('a#' + pIdButton).removeClass("disabled");
		}else{
			$('a#' + pIdButton).addClass("disabled");
		}
	},
	
	registraRilevazioni:function(){
		
		var vDati = top.getForm(document);
		var pBindMatrix = [];
		
		setParametro('txtPeso','PESO');
		setParametro('txtAltezza','ALTEZZA');
				
		var resp = top.executeBatchStatement("parametri.xml","setParametro",pBindMatrix,1);
	
		$.dialog(
			'Rilevazioni inserite correttamente',
			{
				buttons:[
					{"label":"Ok","action":function(){Impostazioni.abilitaBtn('btnRegistraRilevazioni',false);$.dialog.hide();}}								
				]
			}
		);
		
		function setParametro(pInputId,pCodDecParametro,pCallBack){
			
			var input = $('#' + pInputId);
			
			if(input.data("oldValue") != input.val()){
				pBindMatrix.push([
									top.baseUser.IDEN_PER,
									vDati.iden_visita,
									null,
									'0',
									clsDate.getData(new Date(),'YYYYMMDD') ,
									clsDate.getOra(new Date()),
									input.val(),
									null,
									null,
									null,
									null,
									pCodDecParametro,
									''
								]);
									
			}
			
		}
	},
	
	chiudi:function(){
		
		Impostazioni.removeFromSession();
				
		switch(top.ModalitaCartella.getAfterSave(document)){				
			case 'checkAppuntamentiReloadPiano'	:	top.PostInserimento.CheckAppuntamento();
			default								:	parent.$.fancybox.close();
				break;
		}
			
	},	
	
	removeFromSession:function(){
			dwr.engine.setAsync(false);
			Terapia.removeSessionObjects();
			dwr.engine.setAsync(true);
	},
	
	getPreviousDay:function(data){
		return clsDate.dateAddStr(data,'YYYYMMDD','00:00','D',-1);
	},
	
	getNextDay:function(data){
		return clsDate.dateAddStr(data,'YYYYMMDD','00:00','D',1);
	},
	
	getInfoDate:function(data){
		return {
			active: data,
			previous: Impostazioni.getPreviousDay(data),
			next: Impostazioni.getNextDay(data)			
		};
	},
	
	switchDay:function(label,value){
		
		$.dialog(
			'Indicare come porpagare la modifica',
			{
				buttons:[
					{"label":"Giorno","action":function(){aggiornaGiorno();}},
                                        {"label":"Ciclo","action":function(){aggiornaCiclo();}},
					{"label":"Giorno dei Cicli","action":function(){aggiornaGiornoCicli();}},
                                        {"label":"Tutto","action":function(){aggiornaTutto();}},					
					{"label":"Annulla","action":function(){$.dialog.hide();}}								
				]
			}
		);		
		
		function aggiornaGiorno(){							

			aggiorna(function(label_ciclo, label_giorno, object_ciclo, object_giorno){
				return object_ciclo == label_ciclo && object_giorno == label_giorno;
			});				
					
		}
		
		function aggiornaCiclo(){							
				
			aggiorna(function(label_ciclo, label_giorno, object_ciclo, object_giorno){
				return object_ciclo == label_ciclo && object_giorno >= label_giorno;
			});
			
		}						

		function aggiornaGiornoCicli(){							
							
			aggiorna(function(label_ciclo, label_giorno, object_ciclo, object_giorno){
				return (object_ciclo > label_ciclo || object_ciclo == label_ciclo) && object_giorno == label_giorno;
			});			
			
		}
                
		function aggiornaTutto(){							
							
			aggiorna(function(label_ciclo, label_giorno, object_ciclo, object_giorno){
				return object_ciclo > label_ciclo || (object_ciclo == label_ciclo && object_giorno >= label_giorno);
			});			
			
		}               
                    
		function aggiorna(checkFunction){							
			
			var giorni = [];
			var labels = [];
			
			$('tr.Date div.label').each(function(){

				var object = $(this);
				
				var todo = checkFunction(
					parseInt(label.attr("data-ciclo"),10),
					parseInt(label.attr("data-giorno"),10),
					parseInt(object.attr("data-ciclo"),10),
					parseInt(object.attr("data-giorno"),10)
				);
				
				if(todo){
						
					var old_data = object.attr("data-data");	
					var new_data = clsDate.dateAddStr(old_data,'YYYYMMDD','00:00','D',value);
									
					var info_date = Impostazioni.getInfoDate(new_data);
					
					add2set(giorni,info_date.active);
					add2set(giorni,info_date.previous);
					add2set(giorni,info_date.next);
					
					labels.push({
							object : object,
							info_date : info_date
						})	
				}
				
			});
			
			Impostazioni.loadInfoAgende(giorni);
			
			for(var i=0; i< labels.length; i++){
				Impostazioni.refreshGiornoCiclo(labels[i].object, labels[i].info_date);
			}
						
			$.dialog.hide();	
			
			/*for(var i in Cicli){
				alert(i + '\n' + Cicli[i].DataInizio + '\n' + Cicli[i].DataFine);
			}*/
			
		}		

		function add2set(array,value){
			if($.inArray(value,array ) == -1){
				array.push(value);
			}					
		}	
		
	},
	
	refreshGiornoCiclo:function(label, info_date){

		label.attr("data-data",info_date.active);
				
		label.find('div:eq(0)').text(
			clsDate.getDayName(clsDate.str2date(info_date.active,'YYYYMMDD'),true)
		);
		
		label.find('div:eq(1)').text(
			MultiSubstring(info_date.active,[[6,8,'/'],[4,6]])
		);		
		
		var giorno = label.attr("data-giorno");
		var ciclo = label.attr("data-ciclo");
		
		$('tr.Sala[data-ciclo="'+ciclo+'"]').each(function(){				
			Impostazioni.refreshGiornoSala($(this),giorno,info_date);							
		})				
		
		Impostazioni.allineaSomministrazioni(ciclo, giorno, info_date.active);		
	},
	
	refreshGiornoSala:function(tr, giorno, info_date){

			var sala = tr.data("info").COD_DEC;
			
			var th = tr.find('td[data-giorno="'+giorno+'"]');
			
			th.find('div.today')
				.removeClass("classTDVerde").removeClass("classTDGiallo")
				.removeClass("classTDRosso").removeClass("classTDGrigio")
				.addClass(GlobalVariables.agende[info_date.active][sala].CLASS)
				.find('label').text(GlobalVariables.agende[info_date.active][sala].TEXT == null? "" : GlobalVariables.agende[info_date.active][sala].TEXT);
			
			th.find('div.yesterday')
				.removeClass("classTDVerde").removeClass("classTDGiallo")
				.removeClass("classTDRosso").removeClass("classTDGrigio")
				.addClass(GlobalVariables.agende[info_date.previous][sala].CLASS);				
	
			th.find('div.tomorrow')
				.removeClass("classTDVerde").removeClass("classTDGiallo")
				.removeClass("classTDRosso").removeClass("classTDGrigio")
				.addClass(GlobalVariables.agende[info_date.next][sala].CLASS);		
	},
	
	allineaSomministrazioni:function(ciclo, giorno, data){
		for(var i in Cicli[ciclo].Terapie){
			
			var terapia = Cicli[ciclo].Terapie[i];
			
			for(var z in terapia.Somministrazioni){
				if(terapia.Somministrazioni[z].Giorno == giorno){
					terapia.Somministrazioni[z].Data = data;
				}
			}
		}		
	},
	
	loadInfoAgende:function(pGiorni){
		
		var codici_sale = [];
		var giorni_in = [];

		for(var i=0; i< pGiorni.length; i++){
			if(typeof GlobalVariables.agende[pGiorni[i]] == 'undefined'){
				giorni_in.push(pGiorni[i]);
			}
		}
		
		if(giorni_in.length == 0)return; 

		for(var i=0; i< Impostazioni.sale.length; i++){
			codici_sale.push(Impostazioni.sale[i].COD_DEC);
		}

		top.executeAction(
			'Esami',
			'getConsultazioneSalaGG',
			{
				cod_cdc:$('form[name="EXTERN"] input[name="reparto"]').val(),
				codici_sale:codici_sale.join('|'),
				giorni:giorni_in.join('|')
			},
			function(resp){
				
				if(resp.success == false){
					alert(resp.message);
				}else{
					
					for(var i=0; i< Impostazioni.sale.length; i++){
						
						var giorni_out = eval(resp[Impostazioni.sale[i].COD_DEC]);

						for(var j=0; j< giorni_out.length; j++){

							if(typeof GlobalVariables.agende[giorni_out[j].DATAISO] == 'undefined'){
								GlobalVariables.agende[giorni_out[j].DATAISO] = {};
							}
																			
							GlobalVariables.agende[giorni_out[j].DATAISO][Impostazioni.sale[i].COD_DEC] = giorni_out[j];
						}
		
					}

				}
			}
		);	
	
	}
		
};