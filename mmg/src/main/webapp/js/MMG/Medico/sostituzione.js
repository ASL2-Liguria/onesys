$(document).ready(function(){

	SOSTITUZIONE.init();
	SOSTITUZIONE.setEvents();
	home.NS_LOADING.hideLoading();

	NS_FENIX_SCHEDA.beforeSave = SOSTITUZIONE.beforeSave;
	NS_FENIX_SCHEDA.successSave = SOSTITUZIONE.successSave;
});

var SOSTITUZIONE = {
		
		init:function(){
			if($("#IDEN").length==0) { 
				/* inserimento */
				$("#hMedicoBase").val(home.baseUser.IDEN_PER);
				$("#hUteIns").val($("#IDEN_PER").val());
				radVisione.selectByValue("S");
				radDatiGruppo.selectByValue("S");
				
			} else {  
				/* modifica */ 
				SOSTITUZIONE.toggleDataVisione();
			}
			
			var params = {config:"VSOSTITUZIONE_MEDICO",formId:"dati"};
			NS_FENIX_SCHEDA.addFieldsValidator(params);
			
			SOSTITUZIONE.addIconInfo();
		},
		
		setEvents:function(){
			$("#h-radVisione").on("change",function() {
				SOSTITUZIONE.toggleDataVisione();
			});
		},
		
		addIconInfo:function(){
//			
			var icon_obj={ width : '300', height : '100', arrowPosition : 'top' };
			
			NS_MMG_UTILITY.infoPopup(traduzione.lblInfoDatiInVisione, icon_obj, $("#lblVisione"));
			NS_MMG_UTILITY.infoPopup(traduzione.lblInfoDatiGruppo, icon_obj, $("#lblDatiGruppo"));
			
		},
		
		beforeSave: function() {
			if ($("#h-txtDaData").val()>$("#h-txtAData").val()) {
				NOTIFICA.error({
					message:"Data fine sostituzione precedente a data inizio",
					title: "Impossibile procedere"
				});
				return false;
			}
			if ($("#h-txtDataIniVisione").val() != ''){
				if (($("#h-txtDaData").val()<$("#h-txtDataIniVisione").val()) && radVisione.val()=='S') {
					NOTIFICA.error({
						message:"Data inizio visione successiva a data inizio sostituzione",
						title: "Impossibile procedere"
					});
					return false;
				}
			}else{
				$("#h-txtDataIniVisione").val('19000101');
			}
			return true;
		},
		
		successSave:function(){
			if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'RIEPILOGO'){
				parent.$.fancybox.close();
				parent.RIEPILOGO.setSrc($("#IDX").val());
			}
			try {
				home.activeWk.refresh();
			} catch(e) {}
			home.NS_FENIX_TOP.chiudiUltima();
		},
		
		toggleDataVisione: function() {
			if(radVisione.val()=='S') {
				$("#lblDataIniVisione").closest("tr").show();
			} else {
				$("#lblDataIniVisione").closest("tr").hide();
			}
		}		
};

var AC = {
		
		select:function(){
			
		},
		
		choose:function(){
			
		}
}

