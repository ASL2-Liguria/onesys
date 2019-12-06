var FARMACI_COMMON = {
	
		apriNoteCUF:function(codiceNota){

			var urlNoteCUF = home.baseGlobal.URL_NOTE_CUF;
			
			if(urlNoteCUF == ""){
				alert(traduzione.lblVisNotaCuf);
				return; 
			}
			
			urlNoteCUF += "CUF";
			urlNoteCUF +=  codiceNota.toString().substring(1,3);
			urlNoteCUF += ".PDF";
			window.open( urlNoteCUF );
		},
	
		apriNoteCUF2: function(riga) {
			var urlNoteCUF = home.baseGlobal.URL_NOTE_CUF;
			if(urlNoteCUF == ""){
				return home.NOTIFICA.warning({
					message	: traduzione.lblDeniedNotaCuf,
					title	: traduzione.lblAttenzione,
					timeout	: 10
				}); 
			}
			var Note = riga[0].NOTE_CUF;
			var arNote = Note.split(',');
			if(arNote.length >=2){

				var buttNote = [];
				var tempNota = '';
				for(var i=0; i<arNote.length; i++){
					tempNota = arNote[i].trim();

					buttNote.push( {
						 "label"  : 'Nota ' + tempNota,
						 "action" : function(){
								$.dialog.hide();
								window.open( urlNoteCUF  + "CUF" + $(this).html().substring( $(this).html().length -2, $(this).html().length )  + ".PDF");
						 }
					 });
				}

				buttNote.push({
					"label"  :  traduzione.lblAnnulla,
					 "action" :   function(){$.dialog.hide();
					 }
				 });

				var frm = $(document.createElement('form'))
				.attr({"id": "frmDialog"})
				.append(
					$(document.createElement('p')).append(
						$(document.createElement('label')).attr({"for": "txtSceltaNota", "id": "lbltxtSceltaNota"}).text(traduzione.lblChoiceNotaCuf)
					).css("text-align","center")
				);

				$.dialog( frm, {

					'id'				: 'dialogWk',
					'title'				: "Scelta Nota CUF",
					'showBtnClose'		: false,
					'ESCandClose'		: true,
					'created'			: function(){ $('.dialog').focus(); },
					'width'				: 500,
					buttons 			: buttNote
				});
			} else {
				Note = Note.trim();
				Note = Note.substring( Note.length -2, Note.length );//perche' a Savona le Note CUF sono a tre cifre (es.'012') mentre in ufficio sono a due (es.'12')
				window.open( urlNoteCUF + "CUF" + Note + ".PDF");
			}
		},
};