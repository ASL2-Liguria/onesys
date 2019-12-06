var MappaRicovero = {

	obj:null,		
	
	selezione:{iden_ricovero:null,iden_visita:null,cod_cdc:null},	
	
	loadData:function(){
		MappaRicovero.rs = new Array();
	
		var rs = executeQuery("cartellaPaziente.xml","getContatti",[getPaziente("IDEN")]);
		
		while(rs.next()){

			MappaRicovero.rs.push({
				iden_ricovero:rs.getString("IDEN_RICOVERO"),
				tipo_ricovero:rs.getString("TIPO_RICOVERO"),
				iden_visita:rs.getString("IDEN_VISITA"),
				dimesso:rs.getString("DIMESSO"),
				cod_cdc:rs.getString("COD_CDC"),
				title: "Dal: " + rs.getString("DATA_RICOVERO") + '\nal : ' + rs.getString("DATA_FINE_RICOVERO") + '\nin : ' + rs.getString("REPARTO"),
				link:null,
				groupColor:null,
				group:null,
				pointColor:null				
			});
		}
		
	},
	
	rs:[],
	
	build:function(){		
		MappaRicovero.obj = $('<div></div>').attr("id","Mappa");
		
		MappaRicovero.loadData();
		
		MappaRicovero.selezione.iden_ricovero = getRicovero("IDEN");
		MappaRicovero.selezione.iden_visita = getAccesso("IDEN");
		MappaRicovero.selezione.cod_cdc = getAccesso("COD_CDC");
		
		var par;
		for (var i=0; i< MappaRicovero.rs.length; i++){
			
			data = MappaRicovero.rs[i];

			
			if(data.iden_visita == MappaRicovero.selezione.iden_visita){
				data.pointColor = "active";
			}else if(data.iden_ricovero == MappaRicovero.selezione.iden_ricovero){
				data.pointColor = "orange";
			}else{
				data.pointColor = "white";
			}

			if(data.iden_ricovero == MappaRicovero.selezione.iden_ricovero){
				data.groupColor = "white";				
			}else{
				data.groupColor = "gray";				
			}

			switch(data.tipo_ricovero){
				case 'ORD':
					var isFirst 	= (i==0);
					var isLast 		= (i==MappaRicovero.rs.length-1);
					var eqPrevious 	= (!isFirst && data.iden_ricovero == MappaRicovero.rs[i-1].iden_ricovero);
					var eqNext		= (!isLast  && data.iden_ricovero == MappaRicovero.rs[i+1].iden_ricovero);
					
					if(
						(isFirst || !eqPrevious) && (isLast || !eqNext)
					)data.group = "groupSingle";
						
					if(
						(isFirst || !eqPrevious) && !isLast && eqNext
					)data.group = "groupLeft";
	
					if(
						!isFirst && eqPrevious && !isLast && eqNext
					)data.group = "groupMiddle";			
					
					if(
						!isFirst && eqPrevious && (isLast || !eqNext)
					)data.group = "groupRight";
					
					break;

				case 'PRE':
					data.group = "groupSingle";
					break;
				
				case 'AMB':
					data.group = "groupNone";
					break;
					
				default:
					break;	
			}
		}
		
		//riciclo per cercare i DH
		var RicoveriDH = {};				
		for (var i=0; i< MappaRicovero.rs.length; i++){			
			if(MappaRicovero.rs[i].tipo_ricovero == 'DH')
				RicoveriDH[MappaRicovero.rs[i].iden_ricovero] = {};
		}
		
		for(var j in RicoveriDH){
			
			var arAccessi = new Array();
			
			for (var i=0; i< MappaRicovero.rs.length; i++){			
				if(MappaRicovero.rs[i].iden_ricovero == j){					
					arAccessi.push(i);
				}
			}			
			
			//riciclo per settare i DH
			if(arAccessi.length>0){
				for (var i=arAccessi[0]; i<= arAccessi[arAccessi.length-1]; i++){
					var data = MappaRicovero.rs[i];
					
					if(data.tipo_ricovero != 'DH'){
						data.group = "topMiddleNone";
						if(MappaRicovero.rs[i-1].iden_ricovero == MappaRicovero.selezione.iden_ricovero){
							data.groupColor = "white";
						}
					}else{
								
						if(i == arAccessi[0] && arAccessi.length ==1){
							data.group = "topSingle";
						}else if(i == arAccessi[0]){
							data.group = "topLeft";
						}else if(i == arAccessi[arAccessi.length-1]){
							data.group = "topRight";
						}else{
							data.group = "topMiddle";
						}
						
					}
				}
			}
			
		}
		
		//riciclo per cercare i reparti correlati
		var arCorrelati = new Array();
		for (var i=0; i< MappaRicovero.rs.length; i++){			
			if(MappaRicovero.rs[i].cod_cdc == MappaRicovero.selezione.cod_cdc)
				arCorrelati.push(i);
		}
		
		if(arCorrelati.length > 1){
			for (var i=arCorrelati[0]; i<= arCorrelati[arCorrelati.length-1]; i++){
				
				var data = MappaRicovero.rs[i];
				if(data.cod_cdc != MappaRicovero.selezione.cod_cdc){
					data.link = "linkMiddleNone";
				}else{
					if(i== arCorrelati[0]){
						data.link = "linkLeft";
					}else if(i == arCorrelati[arCorrelati.length-1]){
						data.link = "linkRight";
					}else{
						data.link = "linkMiddle";
					}
				}
			}
		}
		
		//controllo eventuale prosecuzione
		if(MappaRicovero.rs[MappaRicovero.rs.length-1].dimesso != 'S'){
			var data = MappaRicovero.rs[MappaRicovero.rs.length-1];

			switch(data.group){
				case 'groupSingle'	: data.group = 'groupLeft';
					break;
				case 'groupRight'	: data.group = 'groupMiddle';
					break;
				case 'topSingle'	: data.group = 'topLeft';
					break;
				case 'topRight'		: data.group = 'topMiddle';
					break;											
				default:break;
			}
		}

		for (var i=0; i< MappaRicovero.rs.length; i++){
			MappaRicovero.obj.append(MappaRicovero.getSpot(MappaRicovero.rs[i]));
		}

		if(MappaRicovero.legenda == null)
			MappaRicovero.buildLegenda();

		Popup.append({
			obj:MappaRicovero.obj,	
			footer:MappaRicovero.legenda,
			title:"Schema storico paziente",
			width:(MappaRicovero.rs.length<7 ? 270 : (MappaRicovero.rs.length*31) + 45),
			height:240
		});		
		
	},	
	
	getSpot:function(pParam){
		return $('<div></div>')
				.addClass(pParam.link).addClass(pParam.groupColor)
				.append(
						$('<div></div>').addClass(pParam.group)
							.append(
								$('<div title="'+pParam.title+'"></div>').addClass(pParam.pointColor)
								.attr({
									iden_ricovero:pParam.iden_ricovero,
									iden_visita:pParam.iden_visita
								})
								.click(function(){
									DatiCartella.logger.clean();
									DatiCartella.loadAccesso($(this).attr("iden_visita"));									
									refreshPage();							
								})
							)
				);
	},
	
	legenda:null,
	
	buildLegenda:function(){
		MappaRicovero.legenda =  $('<div></div>').addClass("legenda")
			.append(
				$('<fieldset></fieldset')
					.append($('<legend>Contatto</legend>'))
					.append($('<div></div>').addClass('active'))						
					.append($('<div>Selezionato</div>'))	
					.append($('<div></div>').addClass('orange'))														
					.append($('<div>Correlato</div>'))
					.append($('<div></div>').addClass('white'))						
					.append($('<div>Altro</div>'))										
			)
			.append(
				$('<fieldset></fieldset')
					.append($('<legend>Ricovero</legend>'))
					.append($('<div></div>').addClass('OrdActiveLeft'))
					.append($('<div></div>').addClass('OrdActiveRight'))						
					.append($('<div>Selezionato</div>'))
					.append($('<div></div>').addClass('OrdLeft'))
					.append($('<div></div>').addClass('OrdRight'))
					.append($('<div>Altro</div>'))					
			)
			.append(
				$('<fieldset></fieldset')
					.append($('<legend>Day Hospital</legend>'))
					.append($('<div></div>').addClass('DHActiveLeft'))
					.append($('<div></div>').addClass('DHActiveRight'))						
					.append($('<div>Selezionato</div>'))
					.append($('<div></div>').addClass('DHLeft'))
					.append($('<div></div>').addClass('DHRight'))
					.append($('<div>Altro</div>'))					
			)
			.append(
				$('<fieldset></fieldset')
					.append($('<div></div>').addClass('linkLeft'))
					.append($('<div></div>').addClass('linkRight'))						
					.append($('<div>Medesimo Reparto</div>'))									
			);
	}

};