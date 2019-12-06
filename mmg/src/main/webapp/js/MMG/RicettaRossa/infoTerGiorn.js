$(function(){
	INFO_TER_GIORN.init();
	INFO_TER_GIORN.setEvents();
});

var INFO_TER_GIORN = {
		
		objFarmaci : null,
		
		init:function(){
			
			INFO_TER_GIORN.objFarmaci = home.RICETTA_FARMACI.getObjSalvataggio();
			INFO_TER_GIORN.buildTables();
			
			$(".butSalva").hide();
		},
		
		setEvents:function(){
			$(".butStampa").on("click", function(){
				INFO_TER_GIORN.stampa();
			});
		},
		
		buildTables: function(){
			
			var col = new Array();
			
			var col1 = traduzione.otto;
			var col2 = traduzione.voidfirst;
			var col3 = traduzione.dodici;
			var col4 = traduzione.voidsecond;
			var col5 = traduzione.diciannove;
			var col6 = traduzione.ventidue;
			
			col.push(col1, col2, col3, col4, col5, col6);
			
			var vTable = $("#fldInfoTerGiorn table");
			vTable.append( 
					$("<tr/>", { "class" : '' } )
						.append(
							$("<td/>", { "class":"label informativa"})
								.append(
										$('<label>'+traduzione.lblInformativa+'<br>'+traduzione.lblInformativa2+'<br>'+traduzione.lblInformativa3+'</label>', { 'class' : 'label_separator' })
							))
							.append($(document.createElement('i')).addClass('icon-cancel-squared').attr({'title': 'Elimina'}).css({'border-color': 'red'}).on('click', function(){INFO_TER_GIORN.elimina()})
							)
					);
			
			$.each(INFO_TER_GIORN.objFarmaci.farmaco, function(idx, obj) {
				vTable.append(
						$("<tr/>",{	"codice":obj.cod_farmaco, "class":"dati", "title":idx})
							.append(
							$("<td/>", { "class":"label farmaco"})
								.append(
									$('<label><p><b>' +obj.descr_farmaco + '</p></label>', { 'class' : 'label_farmaco' })
							))
						);
				
//				var posologia = LIB.isValid(obj.descr_posologia) ? obj.descr_posologia : '';
				var posologia = home.RICETTA_FARMACI.getPosologiaFromIdx(obj.index);
				
				vTable.append(
						$("<tr/>",{	"codice":obj.cod_posologia, "class":"dati"})
							.append(
							$("<td/>", { "class":"label"})
								.append(
										$('<label><p><b>' + traduzione.lblPosologia + ': </b>' + posologia + '</p></label>', { 'class' : 'label_posologia' })
							))
						);
				
				vTable.append( $("<tr/>", { "class" : idx + 'header' } ) );
				
				for(var i = 0; i < 6; i++) {
					vTable.find("tr." + idx + 'header').append(
							$("<td/>").append($("<input/>", {"value":col[i], "class": "table header", "id": "header_" + idx + i, "col": "header_" + idx + i })));
				}
				
				vTable.append( $("<tr/>", { "class" : idx + 'row' } ) );
				
				for(var i = 0; i < 6; i++) {
					vTable.find("tr." + idx + 'row').append(
							$("<td/>").append($("<input/>", {"value":"", "class": "table row", "id": "row_" + idx + i, "col": "row_" + idx + i })));
				}
				
				vTable.append(
						$("<tr/>",{ "class":"dati"})
							.append(
							$("<td/>", { "class":"label"})
								.append(
										$('<label><p><b>' + traduzione.lblNota + '</p></label>', { 'class' : 'label_posologia' })
							))
						);
				
				vTable.append( 
						$("<tr/>", { "class" : idx + 'textarea' } )
							.append(
								$("<td/>")
								.append(
									$("<textarea/>", { "id" : 'txt_' + idx, "class" : "textarea" })
								))
						);
				
				vTable.append( 
						$("<tr/>", { "class" : 'separator' } )
							.append(
								$("<td/>", { "class":"label"})
									.append(
											$('<label/>', { 'class' : 'label_separator' })
								))
						);
						
				$(".textarea").parents().attr("colSpan","6"); 
				$(".label").attr("colSpan","6");
			});
		},
		
		elimina: function(data){
			$(".informativa").parent().hide();
		},
		
		stampa: function(){
			
			var end;
			var prompts = { pIdenAnag: home.ASSISTITO.IDEN_ANAG, pIdenPer: $("#IDEN_MED_PRESCR").val() };
			
			prompts.pFarmaci = '';
			
			prompts.pFarmaci = '<html><head><style> ';
			prompts.pFarmaci += 'table { width: 590px; } ';
			prompts.pFarmaci += 'body { font-size:8px; } '; 
			prompts.pFarmaci += 'td { height: 26px; width: 16%; } ';
			prompts.pFarmaci += 'th { height: 15px; width: 16%; background-color: D2D6D4; } ';
			prompts.pFarmaci += '</style></head><body>';

			$.each(INFO_TER_GIORN.objFarmaci.farmaco, function(idx, obj) {
				
				end = false;
				
				var posologia = home.RICETTA_FARMACI.getPosologiaFromIdx(INFO_TER_GIORN.objFarmaci.farmaco[idx].index);

				prompts.pFarmaci += '<p><b>Farmaco: </b>' + '<span style="font-size:11px;">' + INFO_TER_GIORN.objFarmaci.farmaco[idx].descr_farmaco + '</span>';
				prompts.pFarmaci += '_____' + '<b> Posologia: </b>' + posologia + '</p>';

				prompts.pFarmaci += '<table style="font-size:8px;" border ="1";>';
				prompts.pFarmaci += '<tr style="text-align:center;">';
				for(var i = 0; i < 6; i++){
					eval("prompts.pFarmaci += '<th>' + INFO_TER_GIORN.addSpace($('#header_" + idx + i + "').val()) + '</th>';");
				}
				prompts.pFarmaci += '</tr>';
				
				prompts.pFarmaci += '<tr style="text-align:center;">';
				for(var i = 0; i < 6; i++){
					eval("prompts.pFarmaci += '<td>' + INFO_TER_GIORN.addSpace($('#row_" + idx + i + "').val()) + '</td>';");
				}
				prompts.pFarmaci += '</tr>';

				prompts.pFarmaci += '</table>';
				
				if ( $("#txt_" + idx).val() != ''){
					prompts.pFarmaci += '<p style="font-size:11px;"><b>Note: </b>' + $("#txt_" + idx).val() + '</p>';
				}

				prompts.pFarmaci += '<hr noshade size=3>';
				
				if ((idx + 1) % 8 == 0 ){
					
					prompts.pFarmaci += '</body></html>';
//					alert(prompts.pFarmaci)
					//devo eliminare gli spazi bianchi codificandoli, altrimenti l'applet di stampa si arrabbia
					prompts.pFarmaci = encodeURI(prompts.pFarmaci);
					
					home.NS_PRINT.print({
						path_report		: "INFO_TER_GIORN.RPT" + "&t=" + new Date().getTime(),
						prompts			: prompts,
						show			: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
						output			: "pdf"
					});

					end = true;
					prompts.pFarmaci = '';
					
					prompts.pFarmaci = '<html><head><style> ';
					prompts.pFarmaci += 'table { width: 590px; } '; 
					prompts.pFarmaci += 'td { height: 26px; width: 16%; } ';
					prompts.pFarmaci += 'th { height: 15px; width: 16%; background-color: D2D6D4; } ';
					prompts.pFarmaci += '</style></head><body>';
				}
			});
			
			if(end == false){
				prompts.pFarmaci += '</body></html>';

				//devo eliminare gli spazi bianchi codificandoli altrimenti l'applet di stampa si arrabbia
				prompts.pFarmaci = encodeURI(prompts.pFarmaci);
				
				home.NS_PRINT.print({
					path_report		: "INFO_TER_GIORN.RPT" + "&t=" + new Date().getTime(),
					prompts			: prompts,
					show			: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output			: "pdf"
				});
			}

		},
		
		addSpace: function(str) {
			  var result = '';
			  while (str.length > 0) {
				  if(str.substring(0, 14).indexOf(' ') == -1){
					  if(str.substr(14, 1) != ' ' && str.substr(14, 1) != ''){
						  result += str.substring(0, 14) + '- ';
					  }else{
						  result += str.substring(0, 14) + ' ';
					  }
				  }else{
					  result += str.substring(0, 14);
				  }
				  str = str.substring(14);
			  }
			  return result;
		}
};
