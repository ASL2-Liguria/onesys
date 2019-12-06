function resetRadio(radioName){
	
	var i;
	var numRadio=radioName.length;
	if(numRadio==undefined){
		if (1== radioName.hiddenIndex){ 
			radioName.hiddenIndex=-1; // reset indice radio button checked
			radioName.checked=false; // reset radio button
		}else{
			radioName.hiddenIndex=1; // memorizzo l'indice del radio button checked
		}
	}else{
		for (i=0; i<numRadio; i++){
			if (radioName(i).checked){
				if (i==radioName.hiddenIndex){
					radioName.hiddenIndex=-1; // reset indice radio button checked
					radioName(i).checked=false; // reset radio button		
				}else{
					radioName.hiddenIndex=i; // memorizzo l'indice del radio button checked	
				}
			}
		}		
	}
}

function initHiddenIndex(radioName){

	radioName.hiddenIndex=-1;
	var numRadio=radioName.length;

	if(numRadio==undefined){
		if(radioName.checked) {
			radioName.hiddenIndex=1;
		} else {
			radioName.hiddenIndex=0;
		}
	}else{
		for (var i=0; i<numRadio; i++)
			if (radioName(i).checked){
				radioName.hiddenIndex=i;
			}
	}

}

var BISOGNI = {
		stampa : function(pFunzione,pReparto){
			var idenVisita = document.EXTERN.IDEN_VISITA.value;
			var reparto = document.EXTERN.REPARTO.value;
			top.confStampaReparto(pFunzione,'&prompt<pVisita>='+idenVisita+'&prompt<codiceReparto>='+reparto,'S',pReparto,null);			
		},

		caricaWkObiettivi : function (pForm){
			var _frame = $('form[name="' + pForm + '"] iframe#frameWkObiettivi')
			if(_frame.length==0)return;	

			var idenVisita=document.EXTERN.IDEN_VISITA.value;
			url="servletGenerator?KEY_LEGAME=WK_OBIETTIVI_BISOGNI&WHERE_WK=where iden_visita = "+idenVisita+" and funzione='"+ pForm +"'";
			if(top.ModalitaCartella.isReadonly(document))
				url+="&CONTEXT_MENU=WK_OBIETTIVI_BISOGNI_LETTURA";

			_frame[0].contentWindow.location.replace(url);
		},
		
		gestioneAttivita: function (nameC){

			if($('[name="'+nameC+'"]').is(':checked')){	
				visualizzaRigaCampo('lblSpazio'+nameC.substring(nameC.length-1,nameC.length));
			}else{
				nascondiRigaCampo('lblSpazio'+nameC.substring(nameC.length-1,nameC.length));	
			}
		},

		setHiddenIndex: function(pForm,pCouples){
			for (var i = 0 ;i < pCouples.length ; i++){
				try{
					initHiddenIndex(document[pForm][pCouples[i].radio]);
				}catch(e){
					//input undefined, può capitare nella scheda di sintesi
				}

				try{
					if(typeof pCouples[i].Function == 'function'){
						BISOGNI.setResetRadio(pForm,pCouples[i].hidden,pCouples[i].radio,pCouples[i].Function);	
					}else{
						BISOGNI.setResetRadio(pForm,pCouples[i].hidden,pCouples[i].radio,pCouples[i]);	
					}
				}catch(e){
					//input undefined, può capitare nella scheda di sintesi
				}				
			}		
		},

		afterSave: function(){

			//quando vogliamo fare qualcosa ci scriviamo dentro

		},

		setResetRadio:function(pForm,pHidden,pCheck,pFunction){
			if(typeof pFunction == 'function'){
				$('form[name="' + pForm +'"] input[name="' + pCheck + '"]').click(function(){
					resetRadio(document[pForm][pCheck]);			
					pFunction();
				});
			}else{
				$('form[name="' + pForm +'"] input[name="' + pCheck + '"]').click(function(){
					resetRadio(document[pForm][pCheck]);			
				});			
			}
		},

		initChkPrincipale:function(pForm){
			$('form[name="' + pForm + '"] input[name^="chkPrincipale"]').each(function(){	
				BISOGNI.gestioneAttivita($(this).attr('name'));		
			});	

			BISOGNI.setClickChkPrincipale(pForm);
		},

		setClickChkPrincipale:function(pForm){
			$('form[name="' + pForm + '"] input[name^="chkPrincipale"]').click(function(){
				BISOGNI.gestioneAttivita($(this).attr('name'));	
			} ) ;
		},

		disableStampa:function(){
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		},

		checkReadOnly:function(){
			if (_STATO_PAGINA == 'L'){
				document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
				$('[name^="chkPrincipale"]').attr('disabled',true);
				$('[name^="chkInfermieristica"]').attr('disabled',true);
			}	
		},

		label :{

			setDisables:function(pForm,pLabels,pBool){
				for(var i=0;i<pLabels.length;i++)
					$('form[name="' + pForm + '"] label[name="' + pLabels[i] + '"]').attr("disabled",(pBool?"disabled":""));
			}
		},

		input : {	

			setDisables:function(pForm,pInputs,pBool){
				for(var i=0;i<pInputs.length;i++)
					$('form[name="' + pForm + '"] input[name="' + pInputs[i] + '"]').attr("disabled",(pBool?"disabled":""));
			},

			setCheckeds:function(pForm,pInputs,pBool){
				for(var i=0;i<pInputs.length;i++)
					$('form[name="' + pForm + '"] input[name="' + pInputs[i] + '"]').attr("checked",(pBool?"checked":""));
			}	
		},

		gestOpzioni:{
			set:function(pForm,pObj,pIdx,pLabels,pChecks){
				var bool = $('form[name="' + pForm + '"] input[name="' + pObj + '"]' + (pIdx!=''?':eq(' + pIdx +')':'')).is(':checked');

				BISOGNI.label.setDisables(pForm,pLabels,!bool);
				BISOGNI.input.setDisables(pForm,pChecks,!bool);

				if (!bool) { 
					BISOGNI.input.setCheckeds(pForm,pChecks,false);
				}			
			}
		}
}

function setRadioResettable(pForm,arrayRadio) {

	if (typeof pForm =='undefined') {
		var scope = document;
	} else {
		var scope = document[pForm]; 
	}

	if (typeof arrayRadio =='undefined') {
		radio = $(scope).find('input:radio');
		setResettable(radio);
	} else {
		$.each(arrayRadio, function(i){
			var radio = $(scope).find('input[name="'+arrayRadio[i].radio+'"]');
			if (radio.length>0) {
				setResettable(radio);
				if (typeof arrayRadio[i].Function =='function') {
					radio.click(function(){
						arrayRadio[i].Function();
					});
				}
			}
		});
	}

	function setResettable(radio){
		$(radio).mousedown(function(){
			isChecked = this.checked;
		}).click(function(){ 
			if (typeof isChecked==='boolean') {
				this.checked=!isChecked;
			}
		});
	}
}



