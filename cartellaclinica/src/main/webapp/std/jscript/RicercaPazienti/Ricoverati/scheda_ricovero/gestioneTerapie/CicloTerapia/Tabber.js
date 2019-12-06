var Tabber = {
	
	showTab:function(pIndex){				
		$('ul#tabCicli li[name="tab'+pIndex+'"]').click();
	},
	
	reBuild:function(){

		top.Terapie.logger.info('Tabber.reBuild');
		$('ul#tabCicli,div#contentTabs').html('');

		var giorni_in = [];

		GlobalVariables.maxColonne = 0;
		for (var i=0;i< GlobalVariables.days.length;i++){
			if(GlobalVariables.days[i]=='S'){
				GlobalVariables.maxColonne++;
			}			
			
			for(var j in Cicli){

				var giorno = GlobalVariables.days[i].cicli[j];
				var giorno_precedente = clsDate.dateAddStr(giorno,'YYYYMMDD','00:00','D',-1);
				var giorno_successivo = clsDate.dateAddStr(giorno,'YYYYMMDD','00:00','D',1);				
				//alert(j + '\n' + giorno + '\n' + giorno_precedente + '\n' + giorno_successivo)				
				add(giorno);
				add(giorno_precedente);
				add(giorno_successivo);								
				  				
				function add(value){
					if($.inArray(value,giorni_in ) == -1){
						giorni_in.push(value);
					}					
				}
			}			
		}	

		Impostazioni.loadInfoAgende(giorni_in);
		
		for(var i in Cicli){
			Tabber.buildCiclo(i);    		
		}
		
		$('div.Detail').each(function(){
			top.Terapie.logger.debug('Tabber.reBuild Detail:' + $(this).val());
			var _left = $('<div class="Left"></div>');
			var _middle = $('<div><div>' + $(this).val() + '</div><div name="removeOrario" title="Rimuovi somministrazione" class="remove">&nbsp;</div></div>');
			var _right = $('<div class="Right"></div>');				
			$(this)
				.append(_left)
				.append(_middle)
				.append(_right);
		});
				
		try{
			
			$('tr.Sala td').each(function(){	
				$td = $(this);
				ciclo = $td.attr("data-ciclo");
				giorno = $td.attr("data-giorno");
				data = $td.attr("data-data");
				//alert(ciclo +'\n'+giorno+'\n'+data)
				
				cod_sal = null;
				
				for (var i in Cicli[ciclo].Terapie){

					var terapia = Cicli[ciclo].Terapie[i];
					
					if(cod_sal == null){
						
						for (var j=0; j < terapia.Somministrazioni.length; j++){
							var somministrazione = terapia.Somministrazioni[j];
							
							//alert(somministrazione.Data)
							
							if (somministrazione.Data == data && somministrazione.CodSal != null && somministrazione.CodSal != ''){
								cod_sal = somministrazione.CodSal;
								break;
							}
							
						}
					}
				}
				
				if(cod_sal == null){
					$td.find('input[data-default="S"]').attr("checked","checked").parent().addClass('Sel');
				}else{
					$td.find('input[data-cod_sal="'+cod_sal+'"]').attr("checked","checked").parent().addClass('Sel');
				}
			});
		}catch(e){
			alert(e.description)
		}
		
//		$('input[data-default="S"]').attr("checked","checked").parent().addClass('Sel');
		
		Tabber.showTab("1");
		
		NSRegistrazione.cicliGenerati = true;		
	},
	
	buildCiclo:function(pIndex){
//		alert('during');
		top.Terapie.logger.debug('Tabber.reBuild Ciclo:' + pIndex);
		$('ul#tabCicli').append( $('<li class="" name="tab' + pIndex + '" inizio="'+Cicli[pIndex].DataInizio+'" fine="'+Cicli[pIndex].DataFine+'"><label>Ciclo ' + pIndex + '</label></li>'));
	
		var TabCiclo = $('<div name="tab' + pIndex + '" class="Tab"></div>');
		TabCiclo.append(Tabber.getTable(pIndex));
		$('div#contentTabs').append(TabCiclo); 		
	},
	
	getTable:function(idCiclo){

		top.Terapie.logger.debug('Tabber.getTable('+idCiclo+')');
		var table = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table');

		table.append(Tabber.getRowHeader(idCiclo,i));
		
		table.append(Tabber.getRowDate(idCiclo));

		for(var i=0; i< Impostazioni.sale.length; i++){

			var tr = Tabber.getRowSala(Impostazioni.sale[i],idCiclo)
			if(i==0){
				tr.prepend($('<th rowspan="'+Impostazioni.sale.length+'">Sale</th>'));
			}
			table.append(tr);
		}		

		for (var i in Cicli[idCiclo].Terapie){
			try{
				table.append(Tabber.getRowDetail(idCiclo,i));
			}catch(e){
				top.Terapie.logger.error('Tabber.getRowDetail('+idCiclo+','+i+ ') - ' + e.description);
				alert('Attenzione!!\nIl ciclo non è stato caricato completamente a causa di un errore, contattare un amministratore di sistema');
			}
		}	
		
		return table;
	},	
	
	getRowHeader:function(idCiclo/*,idTerapia*/){
				
		top.Terapie.logger.debug('Tabber.getRowHeader('+idCiclo+/*','+idTerapia+*/')');
		//alert('getRowHeader('+idCiclo+','+idTerapia+')');
		var tr = $('<tr class="Header"></tr>');
		tr.append($('<td width="40%" colspan="2">&nbsp;<div name="addGiorno" class="add" title="Aggiungi nuovo giorno" idCiclo="'+idCiclo+'">&nbsp;</div></td>'));
		
		for (var i=0;i< GlobalVariables.days.length;i++){
			tr.append(
				$('<td></td>')
					.append(
						$('<div></div>')
							.addClass('remove')
							.attr({
								name:"removeGiorno",
								title:"Rimuovi giorno",
								idCiclo:idCiclo,
								//idTerapia:idTerapia,
								Giorno:GlobalVariables.days[i].giorno
							})
					)
					.append('g'+GlobalVariables.days[i].giorno)
			);

		}
		return tr;		
	},
	
	getRowDate:function(idCiclo){
		top.Terapie.logger.debug('Tabber.getRowDate('+idCiclo+')');
		
		var tr = $('<tr class="Date" height="16px"></tr>');
		tr.append($('<th width="40%" colspan="2">&nbsp;</th>'));
		
		for (var i=0;i< GlobalVariables.days.length;i++){					

			var _testo = clsDate.getDayName(clsDate.str2date(GlobalVariables.days[i].cicli[idCiclo],'YYYYMMDD'),true) + '<br/>' + MultiSubstring(GlobalVariables.days[i].cicli[idCiclo],[[6,8,'/'],[4,6]]);
			var td = $('<th align="center"></th>');
			
			if(Impostazioni.IDEN_TERAPIA == null){
				td.append(
					$('<div name="previousDay" class="previous" title="Giorno precedente"">&nbsp;</div>')
				);
			}
				
			td.append(
				$('<div></div>')
					.addClass('label')
					.append(
						$('<div></div>')
							.text(
								clsDate.getDayName(clsDate.str2date(GlobalVariables.days[i].cicli[idCiclo],'YYYYMMDD'),true)
							)
						)
					.append(
						$('<div></div>')
							.text(
								MultiSubstring(GlobalVariables.days[i].cicli[idCiclo],[[6,8,'/'],[4,6]])
							)
						)

					.attr({"data-data":(GlobalVariables.days[i].cicli[idCiclo]),"data-giorno":GlobalVariables.days[i].giorno,"data-ciclo":idCiclo})
			);
			
			if(Impostazioni.IDEN_TERAPIA == null){				
				td.append(
					$('<div name="nextDay" class="next" title="Giorno successivo">&nbsp;</div>')
				);
			}

			tr.append(td);

		}
		return tr;			
	},
	
	getRowSala:function(sala,pIndex){
		top.Terapie.logger.debug('Tabber.getRowSala('+sala+','+pIndex+')');
		
		try{
			var tr = $('<tr class="Sala" height="16px"></tr>')
				.attr({"data-ciclo":pIndex})
				.data("info",sala);
	
			tr.append($('<th width="40%">'+sala.DESCR+'</th>'));
		
			for (var i=0;i< GlobalVariables.days.length;i++){
					
				var data = GlobalVariables.days[i].cicli[pIndex];
				
				var agenda = GlobalVariables.agende[data][sala.COD_DEC];
	
				var giorno_precedente = GlobalVariables.agende[clsDate.dateAddStr(data,'YYYYMMDD','00:00','D',-1)][sala.COD_DEC];
				var giorno_successivo = GlobalVariables.agende[clsDate.dateAddStr(data,'YYYYMMDD','00:00','D',1)][sala.COD_DEC];	
	
				var giorno = GlobalVariables.days[i].giorno
	
			
				var radio_today = $('<input type="radio" name="radSala['+pIndex+']['+GlobalVariables.days[i].giorno+']"/>')
										.addClass("radSala")
										.attr({
											id:'radSala['+pIndex+']['+giorno+'][' + sala.COD_DEC + ']',
											'data-default': sala.DEFAULT_CONTAINER,
											'data-cod_sal':sala.COD_DEC
										})
										.val(sala.COD_DEC);
			
				if(Impostazioni.IDEN_TERAPIA != null){
					radio_today.attr("disabled","disabled");
				}
	
				tr.append(
					$('<td></td>')
						.attr({
							"data-data":data,
							"data-giorno":GlobalVariables.days[i].giorno,
							"data-ciclo":pIndex
						})
						.append(
							$('<div></div>').addClass('yesterday').addClass(giorno_precedente.CLASS)
						)
						.append(
							$('<div></div>')
								.addClass('today').addClass(agenda.CLASS)
								.append(
									radio_today
								)
								.append(
									$('<label></label>')
										.attr("for",'radSala['+pIndex+']['+giorno+'][' + sala.COD_DEC + ']')
										.text(agenda.TEXT == null ? "" : agenda.TEXT)
								)
								//.text(agenda.TEXT == null ? "" : agenda.TEXT)
						)
						.append(
							$('<div></div>').addClass('tomorrow').addClass(giorno_successivo.CLASS)
						)										
						
				);
			}		
	
			return tr;
		}catch(e){
			top.Terapie.logger.error('Tabber.getRowSala - ' + e.description);
		}
	},
	
	getRowDetail:function(idCiclo,idTerapia){
		top.Terapie.logger.debug('Tabber.getRowDetail('+idCiclo+','+idTerapia+')');
		
		var tr = $('<tr class="Detail" height="16px"></tr>');		
		var td = $('<td width="10%"></td>')

		if(Cicli[idCiclo].Terapie[idTerapia].VolumeTotale >0){
			top.Terapie.logger.debug('Tabber.getRowDetail volume totale');
			var input = $('<input name="txtVolumeTotale"/>')
							.attr('id_ciclo',idCiclo)
							.attr('iden_terapia',idTerapia)
							.val(Cicli[idCiclo].Terapie[idTerapia].VolumeTotale);
		
			td.append(
				$('<div></div>')
					.append(input)
					.append('<label>ml</label>')
			);			
		}
		
		if(Impostazioni.Procedura == 'INSERIMENTO'){
			td.append(
				$('<div>&nbsp;</div>')
					.addClass("add")
					.attr({
						name:"addFarmaco",
						title:"Aggiungi nuovo farmaco",
						"data-terapia":idTerapia
					})
			);
		}

		if(Cicli[idCiclo].Terapie[idTerapia].Velocita >0){
			top.Terapie.logger.debug('Tabber.getRowDetail velocita');		
			
			var input = $('<input name="txtVelocita"/>')
							.attr('id_ciclo',idCiclo)
							.attr('iden_terapia',idTerapia)
							.val(Cicli[idCiclo].Terapie[idTerapia].Velocita);

			td.append(
				$('<div></div>')
					.append(input)
					.append('<label>ml/ora</label>')
			);	
		}
		
		tr.append(td);
		
		td = $('<td width="30%"></td>');

		var tbFarmaci = $('<table width="100%" border="0" class="Farmaci"></table>');		
		for(var i in Cicli[idCiclo].Terapie[idTerapia].Farmaci){
			top.Terapie.logger.debug('Tabber.getRowDetail farmaco:' + i + '; tipo: ' + Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].tipo);
			
			var tipo_farmaco;
			switch(Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].tipo){
				case '1' : tipo_farmaco = "farmaco"; break;				
				case '2' : tipo_farmaco = "solvente"; break;								
				case '3' : tipo_farmaco = "soluto"; break;
			}
			
			var trFarmaco = $('<tr></tr>')
				.attr('data-ciclo',idCiclo)
				.attr('data-terapia',idTerapia)
				.attr('data-farmaco',i);
			
			var column = $('<td width="5%"></td>');
			
			if(Impostazioni.Procedura == 'INSERIMENTO'){
				column.append(
					$('<div></div>')
						.addClass('remove')
						.attr({
							name:"remove-farmaco",
							title:"Rimuovi farmaco"
						})				
				);
			}
						
			trFarmaco.append(column);
			
			trFarmaco.append(
				$('<td width="65%"></td>')
					.text(Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Descrizione)
					.addClass(tipo_farmaco)
			);
			
			top.Terapie.logger.debug('Tabber.getRowDetail farmaco dose:' + Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Dose);
			
			var input = $('<input/>')
				.attr('id_ciclo',idCiclo)
				.attr('iden_terapia',idTerapia)
				.attr('iden_farmaco',i)
				.attr('name','txtDose')
				.val(Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Dose);
				

			if(Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.adeguata != ''){
				input
					.addClass('adeguato')
					.attr('title',Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.adeguata);
			}

			var cmbUdm = $('<select name="cmbUdm"></select>')
				.attr('id_ciclo',idCiclo)
				.attr('iden_terapia',idTerapia)
				.attr('iden_farmaco',i);

			
			top.Terapie.logger.debug('Tabber.getRowDetail farmaco rebuild cmbUdm');
			
			for (var j in Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.options){
				
				top.Terapie.logger.debug('Tabber.getRowDetail farmaco rebuild cmbUdm: {value:'+j+'codice:'+Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.options[j].codice+',somma:'+Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.options[j].somma+'}');
				
				cmbUdm.append(
					$('<option ' + (j==Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.value?'selected="selectd"':'') + '></option>')
						.val(j)						
						.attr("codice",Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.options[j].codice)
						.attr("somma",Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.options[j].somma)
						.text(Cicli[idCiclo].Terapie[idTerapia].Farmaci[i].Udm.options[j].text)
				);
				
			}

			trFarmaco.append($('<td width="30%">&nbsp;</td>')
				.append(input)
				.append(cmbUdm)
				);	
			tbFarmaci.append(trFarmaco);					
		}
		td.append(tbFarmaci);
		tr.append(td);			
		
		for (var i=0;i< GlobalVariables.days.length;i++){
			top.Terapie.logger.debug('Tabber.getRowDetail day:' + i);
			
			//if(GlobalVariables.days[i]=='S'){
				var td = $('<td></td>');
				
				td.append($('<div name="addOrario" class="add" title="Aggiungi nuovo orario" idCiclo="'+idCiclo+'" idTerapia="'+idTerapia+'" Giorno="'+GlobalVariables.days[i].giorno+'">&nbsp;</div>'));
				
				var div = $('<div></div>');
				
				for (var j =0; j < Cicli[idCiclo].Terapie[idTerapia].Somministrazioni.length;j++){
					
					var somministrazione = Cicli[idCiclo].Terapie[idTerapia].Somministrazioni[j];
					
					if(somministrazione.Giorno==GlobalVariables.days[i].giorno){
						div.append(
							$('<div></div>')
								.addClass("Detail")
								.attr({
									"value" :somministrazione.Ora,
									"idCiclo" : idCiclo,
									"idTerapia" : idTerapia,
									"Data" : somministrazione.Data,
									"Giorno" : somministrazione.Giorno 
								})
						);
					}
				}
				td.append(div);
				tr.append(td);
			//}
		}
		
		return tr;	

	}
};