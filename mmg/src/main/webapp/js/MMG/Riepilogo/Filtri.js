$(function(){
	
	switch($("#FILTRO").val()){
	case 'DIARI':
		NS_FILTRI = NS_FILTRI_DIARI;
		break;
	case 'PROBLEMI':
		NS_FILTRI = NS_FILTRI_PROBLEMI;
		break;
	}
	
	NS_FILTRI.init();
	NS_FILTRI.setEvents();
});

var NS_FILTRI = {
		init : function() {},
		setEvents : function() {}
}

var NS_FILTRI_PROBLEMI = {
		init:function(){
			
			if($("#DADATA").val() != ""){
				var data = NS_MMG_UTILITY.convertData($("#DADATA").val());
				$("#h-txtDaData").val($("#DADATA").val());
				$("#txtDaData").val(data);
			}
			else
			{
				var data_nascita = home.ASSISTITO.DATA_NASCITA_ISO;
				$("#h-txtDaData").val( data_nascita );
				$("#txtDaData").val( NS_MMG_UTILITY.convertData(data_nascita ) );
			}	
				
				
			if($("#ADATA").val() != ""){
				var data = NS_MMG_UTILITY.convertData($("#ADATA").val());
				$("#h-txtAData").val($("#ADATA").val());
				$("#txtAData").val(data);
			}
			
			if($("#CHIUSOAPERTO").val() !=""){
				var arVal =$("#CHIUSOAPERTO").val().split(",");
				for(var i=0;i < arVal.length; i++){
					radChiusAperto.selectByValue(arVal[i]);
				}
				
			}else{
				radChiusAperto.selectByValue("N");
			}
			
			if ($("#NASCOSTO").val() !=""){
				radNascosto.selectByValue($("#NASCOSTO").val());
			} else {
				radNascosto.selectByValue("N");
			}

			$("#FiltriDiari, .butResetDiari").hide();		
			
		},
		setEvents:function(){
			$(".butFiltra").on("click", NS_FILTRI_PROBLEMI.filterWk);
			$('.butTuttiProblemi').on('click', function(){ $('#radChiusAperto').data('CheckBox').selectAll(); });
			$('.butResetProblemi').on('click', function(){ 
				
				$('#radChiusAperto').data('CheckBox').deselectAll(); 
				
				$("#h-txtDaData, #txtDaData, #h-txtAData, #txtAData").val('');
				
			});
			
		},
		filterWk:function(){

			if(parseInt($("#h-txtAData").val()) < parseInt($("#h-txtDaData").val() ) ){
		        home.NOTIFICA.warning({
		            message:"Date non coerenti",
		            title: "Attenzione"
		        });
		        return;
			}
		    
			home.RIEP_ACCESSI_PROBLEMI.filterWk({ 
			        "aBind" : ["iden_anag","iden_utente","data_da","data_a","nascosto","chiuso"],
			        "aVal"  : [home.ASSISTITO.IDEN_ANAG,home.baseUser.IDEN_PER,$("#h-txtDaData").val(),$("#h-txtAData").val(),radNascosto.val()=='N'?"N":"%25",radChiusAperto.val()]
			});
			home.NS_FENIX_TOP.chiudiUltima();
			
		}
};

var NS_FILTRI_DIARI = {

				init:function(){
					
					$("#Filtri, .butTuttiProblemi, .butResetProblemi").hide();
					
					if($("#DADATA").val() != ""){
						var data = NS_MMG_UTILITY.convertData($("#DADATA").val());
						$("#h-txtDaDataDiari").val($("#DADATA").val());
						$("#txtDaDataDiari").val(data);
					}
					else
					{
						var data_nascita = home.ASSISTITO.DATA_NASCITA_ISO;
						$("#h-txtDaDataDiari").val( data_nascita );
						$("#txtDaDataDiari").val( NS_MMG_UTILITY.convertData(data_nascita ) );
					}	
					
					if($("#DADATA").val() != ""){
						var data = NS_MMG_UTILITY.convertData($("#ADATA").val());
						$("#h-txtADataDiari").val($("#ADATA").val());
						$("#txtADataDiari").val(data);
					}
				},
				
				setEvents:function(){
					
					$(".butFiltra").on("click",	NS_FILTRI_DIARI.filterWk );
					
					$('.butResetDiari').on('click', function(){ 
						
						$("#h-txtDaDataDiari, #txtDaDataDiari, #h-txtADataDiari, #txtADataDiari").val('');
						
					});
					
				},
				filterWk: function(){
					var daData = $("#h-txtDaDataDiari").val();
					var aData = $("#h-txtADataDiari").val();
					
				    home.FILTRI_DIARI_WK.filterWk({
				    	"aBind" : ["iden_utente","iden_anag","iden_problema","data_da","data_a","scheda", "iden_gruppo", "tipo_med","tipo_nota"],
						"aVal"  : [home.baseUser.IDEN_PER,home.ASSISTITO.IDEN_ANAG,home.ASSISTITO.IDEN_PROBLEMA,daData,aData,"ALL",null,'P',home.CARTELLA.filtri.diari]
				    });
					
					home.NS_FENIX_TOP.chiudiUltima();
					
				}
		
};