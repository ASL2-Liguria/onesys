$(function(){
	NS_TERAPIE_BILANCIO.init();
	NS_TERAPIE_BILANCIO.setEvents();
});


var NS_TERAPIE_BILANCIO = {
		
		init : function() {		
		//	$("tr[pre='S']").attr("title","Infusione iniziata prima delle 24h");
		//	$("tr[post='S']").attr("title","Infusione finita dopo orario del bilancio");
		},
		
		setEvents : function() { 
			
			$('td[name="residuo"] input')
				.click(function() {
					if ($(this).val()==0) {
						$(this).val('');
					}
				})
				.blur(function() {
					var _this=$(this);
					var tr = _this.closest("tr");
					if(_this.val()=='') {
						_this.val(0);
					}
					_this.val(_this.val().replace(".",","));
					NS_TERAPIE_BILANCIO.computaInfuso(tr);
				});
			
			/*
			 * Edit --> loadDatiSalvati()
			 * Insert --> processaSomministrazioni()
			 */
			if (parent._STATO_PAGINA == 'I')
				NS_TERAPIE_BILANCIO.processaSomministrazioni();
			else
				NS_TERAPIE_BILANCIO.loadDatiSalvati();	
			
			if (parent._STATO_PAGINA == 'L')
				$("input").attr("disabled",true);
		},
		
		createObjectInfusi : function() {
			var infusi = "{'";
			$("tr.trDatiWk").each(function(){
				var _this=$(this);
				infusi+=_this.attr("IDEN_DETTAGLIO") + "' : {'residuo': '" + _this.find("td[name=residuo] input").val() 
				+ "','infuso':'"+_this.find("td[name=infuso]").text()+"','residuo_segnalato':'"+_this.attr('RESIDUO_SEGNALATO')+"'},'" ;
			});
			infusi = infusi.substring(0,infusi.length-2)+"}";
			return infusi;
		},
		
		processaSomministrazioni : function(){
			
			// Set Colonne Totali
			$('.trDatiWk').each(function(){
				
				var stato = $(this).attr('STATO_INFUSIONE');
				var volume = $(this).attr('VOLUME');
				var residuo_segnalato = $(this).attr('RESIDUO_SEGNALATO');
				var somministrato_competente = $(this).attr('SOMMINISTRATO_COMPETENTE');
				var somministrato_effettivo = 0;
				var somministrato_precedente = $(this).attr('SOMMINISTRATO_PRECEDENTE');
				var residuo = 0;
				
				/*
				 * Inizialmente Infuso e Somministrato Sono identici.
				 */ 
				if (stato == 'P' || stato == 'K'){ 
					residuo = 0 ;
					somministrato_effettivo = somministrato_competente;
				}
				/*else if(residuo_segnalato > 0){
					residuo = residuo_segnalato;
					somministrato_effettivo = ((volume - somministrato_precedente) - residuo_segnalato);
				}*/
				
				else {
					residuo = (volume - residuo_segnalato - somministrato_precedente - somministrato_competente);
					somministrato_effettivo = somministrato_competente;
				}
			
				if (residuo_segnalato!='0'){
					$(this).find('td[name="volume"]').text($(this).find('td[name="volume"]').text()+' - '+residuo_segnalato); 		
				}
				
				$(this).find('td[name="infuso"]').text(somministrato_effettivo); 
				$(this).find('td[name="somministrato"]').text(somministrato_effettivo); 
				$(this).find('td[name="residuo"] input').val(residuo);
				
				
				
			});
		},
		
		loadDatiSalvati : function () {
			
			try {
				eval("var infusi ="+ $("#hInfusi",parent.document).val());
				
				$("tr.trDatiWk").each(function() {
					
					var _this = $(this);
					if(typeof infusi[_this.attr("IDEN_DETTAGLIO")] != undefined) {						
						_this.find('td[name="residuo"] input').val(infusi[_this.attr("IDEN_DETTAGLIO")].residuo);
						if(infusi[_this.attr("IDEN_DETTAGLIO")].residuo_segnalato!=undefined){
						_this.attr("RESIDUO_SEGNALATO",infusi[_this.attr("IDEN_DETTAGLIO")].residuo_segnalato); 
						if(infusi[_this.attr("IDEN_DETTAGLIO")].residuo_segnalato!='0'){
							$(this).find('td[name="volume"]').text($(this).find('td[name="volume"]').text()+' - '+infusi[_this.attr("IDEN_DETTAGLIO")].residuo_segnalato); 			 
						 }
						}
						_this.find('td[name="residuo"] input').val(infusi[_this.attr("IDEN_DETTAGLIO")].residuo);
						NS_TERAPIE_BILANCIO.computaInfuso(_this);
					}
				});
			} catch(e) {}
		},
		
		computaInfuso : function (tr) {
			var stato = tr.attr('STATO_INFUSIONE');
			var volume = tr.attr('VOLUME');
			var somministrato_competente = tr.attr('SOMMINISTRATO_COMPETENTE');
			var somministrato_precedente = tr.attr('SOMMINISTRATO_PRECEDENTE');
			var residuo = tr.find('td[name="residuo"] input').val().replace(",",".");
			var residuo_segnalato = tr.attr('RESIDUO_SEGNALATO');
			var post = tr.attr('POST');
			var infuso = 0;
			
			if (post == 'N'){
				infuso =  (somministrato_competente - residuo);
			}else{
				infuso =  (volume - residuo_segnalato - somministrato_precedente - residuo);
			}
			
			if (stato == 'P' || stato == 'K')
				infuso = 0;
			
			tr.find('td[name="infuso"]').text(infuso); 	
			
		}
};