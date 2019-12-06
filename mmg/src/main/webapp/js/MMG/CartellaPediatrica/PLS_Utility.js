var PLS_UTILITY = {
		
		dataRifPercentile : null,
		
		showPercentile: function( dataRif ) {
			
			if (LIB.isValid( dataRif )){
				PLS_UTILITY.dataRifPercentile = dataRif;
			}
			
			$("#txtAltezza").keyup(function() {
				
				var $this = $(this);
				
				if($this.val() != ''){

					$this.val($(this).val().replace(",","."));
					
					if( !NS_MMG_UTILITY.checkIsNumber($this.val()) ){
						$this.val("").focus();
						$("#lblAltezzaCentile").text("...");
						
						home.NOTIFICA.warning({
				            message: 'Il valore inserito non \u00E8 numerico!',
				            title: "Attenzione"
				        });
						return;
					}else{
						$this.val($(this).val().replace(".",","));
					}
					
					if($("#txtAltezza").val() != '' && $("#txtPeso").val() != '' && $("#txtBMI").length>0){
						var BMI = NS_MMG_UTILITY.calcoloBMI( $this.val(), $("#txtPeso").val() );
						$("#txtBMI").val(BMI);
					}
					
					$this.val($this.val().replace('.',','));
					PLS_UTILITY.setRiferimentoPercentile($("#lblAltezzaCentile"), {value:$this.val(),tipoGrafico:"ALTEZZA"});
				
				}else{
					$("#lblAltezzaCentile").text("...");
				}
			});
			
			$("#txtPeso").keyup(function(){
				
				var $this = $(this);
				
				if($this.val() != ''){
					
					$this.val($(this).val().replace(",","."));
					
					if( !NS_MMG_UTILITY.checkIsNumber($this.val()) ){
						$this.val("").focus();
						$("#lblPesoCentile").text("...");
						
						home.NOTIFICA.warning({
				            message: 'Il valore inserito non \u00E8 numerico!',
				            title: "Attenzione"
						});
						return;
					}else{
						$this.val($(this).val().replace(".",","));
					}
					
					if($("#txtAltezza").val() != '' && $("#txtPeso").val() != '' && $("#txtBMI").length>0){
						var BMI = NS_MMG_UTILITY.calcoloBMI($("#txtAltezza").val(), $this.val());
						$("#txtBMI").val(BMI);
					}
					
					$this.val($this.val().replace('.',','));
					PLS_UTILITY.setRiferimentoPercentile($("#lblPesoCentile"), {value:$this.val(),tipoGrafico:"PESO"});
				
				}else{
					$("#lblPesoCentile").text("...");
				}
			});

			$("#txtCirconferenza_Cranica").keyup(function() {
					
				var $this = $(this);
				
				if($this.val() != ''){
					
					$this.val($(this).val().replace(",","."));
					
					if( !NS_MMG_UTILITY.checkIsNumber($this.val()) ){
						
						$this.val("").focus();
						$("#lblCirconferenza_CranicaCentile").text("...");
						home.NOTIFICA.warning({
				            message: 'Il valore inserito non \u00E8 numerico!',
				            title: "Attenzione"
						});
						return;
					}else{
						$this.val($(this).val().replace(".",","));
					}
					
					$this.val($this.val().replace('.',','));
					PLS_UTILITY.setRiferimentoPercentile($("#lblCirconferenza_CranicaCentile"), {value:$this.val(),tipoGrafico:"CIRC_CRANICA"});
				
				}else{
					$("#lblCirconferenza_CranicaCentile").text("...");
				}
			});
			
			$("#txtBMI,#txtMassima,#txtMinima,#txtTemperatura,#txtDiam_Fontanella,#txtSaturazione_Ossigeno").keyup(function(){
					
				var $this = $(this);
				
				if($this.val() != ''){
					
					$this.val($(this).val().replace(",","."));
					
					if( !NS_MMG_UTILITY.checkIsNumber($this.val()) ){
						
						$this.val("").focus();
						
						home.NOTIFICA.warning({
				            message: 'Il valore inserito non \u00E8 numerico!',
				            title: "Attenzione"
						});
						return;
						
					}else{
						$this.val($(this).val().replace(".",","));
					}
				}
			});
		},
		
		setRiferimentoPercentile: function(obj, param) {
			
			if (param.value==''){
				obj.text("...");
			}
			
			var params = {
					pIdenAnag:home.ASSISTITO.IDEN_ANAG,
					pTipoGrafico : param.tipoGrafico,
					pValue : param.value,
					pData : LIB.isValid(PLS_UTILITY.dataRifPercentile) ? PLS_UTILITY.dataRifPercentile : $("#h-txtData").val()
			};
			
			toolKitDB.executeFunctionDatasource("GET_RIFERIMENTO_CENTILE","MMG_DATI",params,
				function(resp){
					obj.text(resp.p_result);
				}
			);
		}
};