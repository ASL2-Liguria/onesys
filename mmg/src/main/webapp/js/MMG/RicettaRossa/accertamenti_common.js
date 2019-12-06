var ACCERTAMENTI_COMMON = {
	
		//funzione che carica lo specchietto che permette di avere una panoramica sulle condizioni ed indicazioni del decreto per la nota in questione
		getInfoNote:function(cod_prestazione){
			
			var testoCondizioni = '';
			var testoIndicazioni = '';
			
			var msg = $("<div/>").attr({"id":"divInfoNota"});
			var divDM1996 = $("<div/>").attr({"id":"divDM1996","class":""});
			var divCondizErog = $("<div/>").attr({"id":"divCondizioni","class":"condizErog dialogNotePrestazioni"});
			var divIndAppr = $("<div/>").attr({"id":"divIndicazioni","class":"indAppr dialogNotePrestazioni"});
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id:'RICETTE.GET_NOTE_PRESTAZIONI',
	            parameter: {
	            	v_cod_accertamento		: { v : cod_prestazione, t : 'V'}
	            }
			}).done( function(resp) {
				$.each(resp.result,function(k,v){
					
					//var letteraDettaglio = (v["ID_DETT"] == '0') ? '' : (v["ID_DETT"]  + ') ');
							
					//controllo la tipologia delle informazioni prelevate dalla query
					switch(v["TIPO_NOTA"]){
					
						case 'CON':
							/*condizione di erogabilità*/
							testoCondizioni += v["DESCRIZIONE"];
							divCondizErog.html(testoCondizioni); //.replace(/(?:\r\n|\r|\n)/g, '<br />')
							break;
							
						case 'IND':
						default:
							/*indicazioni di appropriatezza prescrittiva*/
							testoIndicazioni += v["DESCRIZIONE"];
							divIndAppr.html(testoIndicazioni); //.replace(/(?:\r\n|\r|\n)/g, '<br />')
							break;
					}
					
					if (v["NOTE_DM_1996"] != "") {
						divDM1996.html("Accertamento prescrivibile solo da specialisti. Note dm 1996: " + v["NOTE_DM_1996"]);
					}
					
					//alert(testoCondizioni)
				});
			} );

			//l'intestazione delle sezione è fissa
			var divTitleCondizErog = $("<div/>").attr({"id":"divTitleCondizErog","class":"titleCondizErog dialogNotePrestazioni"});
			var divTitleIndAppr = $("<div/>").attr({"id":"divTitleIndAppr","class":"titleIndAppr dialogNotePrestazioni"});
			divTitleCondizErog.text(traduzione.lblTitleCondiz);
			divTitleIndAppr.text(traduzione.lblIndAppr);
			
			msg.append(divDM1996);
			msg.append(divTitleCondizErog);
			msg.append(divTitleIndAppr);
			msg.append(divCondizErog);
			msg.append(divIndAppr);

			$.dialog(msg, {
				'title'				: traduzione.lblNota,
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'movable' 			: true,
				'width'				: '50%',
				'height'			: "250px",
				'buttons' 			: [
					{
						label : traduzione.visualizzaPDFDecreto,
						action : function() {
							ACCERTAMENTI_COMMON.apriDecreto();
						}
						
					},
					{
						label : traduzione.visualizzaPDFCircolareDecreto,
						action : function() {
							ACCERTAMENTI_COMMON.apriCircolareDecreto();
						}
						
					},
					{
						label : traduzione.butChiudi,
						action : function() {
							$.dialog.hide();
						},
						keycode : "13"
					}]
			});
			
		},
		
		apriDecreto:function(){
			window.open( home.baseGlobal.URL_DECRETO_LORENZIN );
		},
		
		apriCircolareDecreto:function(){
			window.open( home.baseGlobal.URL_DECRETO_LORENZIN_CIRCOLARE );
		}
};
