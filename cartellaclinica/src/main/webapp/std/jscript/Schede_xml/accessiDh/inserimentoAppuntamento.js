var WindowCartella = null;
$(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    setTimeout(INSERIMENTO_APPUNTAMENTO.init,1);
	INSERIMENTO_APPUNTAMENTO.setEvents();
});

var INSERIMENTO_APPUNTAMENTO ={
    appuntamenti:{},

    iden_appuntamento:document.EXTERN.IDEN_APPUNTAMENTO.value,
	
	iden_ricovero:document.EXTERN.IDEN_VISITA.value,
	
	init:function(){		
		//in inserimento controllo se ho valori segnalati		
		if(INSERIMENTO_APPUNTAMENTO.iden_appuntamento == ''){
			$("#txtOraAppuntamento").val(typeof document.EXTERN.ORA != 'undefined'?document.EXTERN.ORA.value:'');
			$("input[name=chkAccesso]").attr("checked",(typeof document.EXTERN.ACCESSO != 'undefined' && document.EXTERN.ACCESSO.value =='S'?"checked":""));
			$("#dteDataAppuntamento").val(typeof document.EXTERN.DATA != 'undefined' && document.EXTERN.DATA.value !=''?MultiSubstring(document.EXTERN.DATA.value,[[6,8,'/'],[4,6,'/'],[0,4]]):'');
			
		}		
		
		if($('input#hTipoRicovero').val() == 'PRE-DH'){
			$('input[name="chkAccesso"]').attr("disabled","disabled");
		}
		
		$('div#idtabPaziente input').attr('disabled', 'disabled');
		
		$('fieldset#lbltabAgenda legend').append(document.createElement("input"));		
		$('fieldset#lbltabAgenda input').attr('disabled','true');
		
		 if($('input#dteDataAppuntamento').val() != ''){
			 INSERIMENTO_APPUNTAMENTO.setWkAppuntamenti($('input#dteDataAppuntamento').val());
		 }
        INSERIMENTO_APPUNTAMENTO.onLoad();
		
	},	
	
	setEvents:function(){
		INSERIMENTO_APPUNTAMENTO.addCustomDatePicker($('fieldset#lbltabAgenda legend input'));
		INSERIMENTO_APPUNTAMENTO.addCustomDatePicker($('input[name=dteDataAppuntamento]'));
		
		$('input[name=txtOraAppuntamento]').live("keyup",function(){oraControl_onkeyup(this);})
			.live("blur",function(){ oraControl_onblur(this);});
		$('a#lblRegistra').click(INSERIMENTO_APPUNTAMENTO.registra);
		$('a#lblChiudi').click(INSERIMENTO_APPUNTAMENTO.chiudi);	
		if(INSERIMENTO_APPUNTAMENTO.iden_appuntamento == ''){
			$('fieldset#lbltabAccesso legend').click(INSERIMENTO_APPUNTAMENTO.addAppuntamento).addClass("active");
			$('td.colRemove').live("click", INSERIMENTO_APPUNTAMENTO.removeAppuntamento).addClass("active");
		}
        var stato_pagina = _STATO_PAGINA;
    /*    $('#dteDataAppuntamento').bind("propertychange input paste",function(){
            if(stato_pagina == 'I'){

            var data = clsDate.str2str($(this).val(),'DD/MM/YYYY','YYYYMMDD');

        
            if(typeof(INSERIMENTO_APPUNTAMENTO.appuntamenti[data])!='undefined'){
            	alert("Attenzione è già presente un appuntamento \nin questa data : " +$(this).val() +' ore '+ INSERIMENTO_APPUNTAMENTO.appuntamenti[data].ora);
            }
              }

        });*/
	},
	
	addCustomDatePicker:function(obj){ 
		obj.focus(function(){obj.blur();}).datepick(
				{
//					minDate:new Date(),
				/*	onClose: function(selectedDate){ 
						var data = obj.val();
						alert(obj.val());
						alert(selectedDate);
						if (data!='') {
							INSERIMENTO_APPUNTAMENTO.setWkAppuntamenti(data);
						}
					},*/
					onSelect: function(date) {
			            INSERIMENTO_APPUNTAMENTO.setWkAppuntamenti(clsDate.getData(new Date(date),'DD/MM/YYYY'));
			        },
			     
					showOnFocus: false,  
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				}
		);		
	},
	chiudi:function(){
		if (parent.document.getElementById('oIFWk0')){
			$('iframe#oIFWk0',parent.document)[0].contentWindow.location.reload();
		}		
		parent.$.fancybox.close();
	},
	
	addAppuntamento:function() {
		var newAppuntamento = $("div#idtabAccesso tr:last").prev().andSelf().clone();
		newAppuntamento.find("input[name=dteDataAppuntamento],input[name=txtOraAppuntamento]").val('');
		
		$("div#idtabAccesso table").append(newAppuntamento);
		var inputDate=$("input[name=dteDataAppuntamento]:last");
		inputDate.removeClass("hasDatepick").parent().find(".datepick-trigger").remove();
		INSERIMENTO_APPUNTAMENTO.addCustomDatePicker(inputDate);
		
	},
	
	removeAppuntamento:function() {
		if($("div#idtabAccesso tr").length==2) { return alert("Impossibile rimuovere il primo appuntamento"); }

		var appuntamento = $(event.srcElement).parent();
		appuntamento.next().remove();
		appuntamento.remove();
	},
	
	setWkAppuntamenti:function (pData) {
		var dataLegend=$('fieldset#lbltabAgenda input');
		dataLegend.val(pData);
	
		var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_INSERIMENTO_APPUNTAMENTI";
		url    += "&ILLUMINA=javascript:illumina(this.sectionRowIndex);";
		url    += "&WHERE_WK=WHERE COD_CDC='"+$('input#hCodCDC').val()+"' and DATA_FILTRO='"+MultiSubstring(pData,[[6,10],[3,5],[0,2]])+"'";
	
		if ($('iframe#frameWkAgenda').length==0) {
			
			$('fieldset#lbltabAgenda').append(
				$('<iframe></iframe>')
					.css("width","100%")
					.attr("id","frameWkAgenda")
			).show(500);
		} 
		$('iframe#frameWkAgenda').attr("src",url);
	
	},
	
	registra:function(){

        var iden_visita = $('#IDEN_VISITA').val();
        var data_fine_ricovero = $('#DATA_FINE_RICOVERO').val();;
        var data_inserita = $('#dteDataAppuntamento').val();
        data_inserita = clsDate.str2str(data_inserita, 'DD/MM/YYYY','YYYYMMDD');
        if(data_fine_ricovero>data_inserita){
            return alert('Attenzione inserire la data dopo la fine del ricovero precedente')
        }

		try{
			var vArrayParam = new Array();
			var cdc = $('input[name="hCodCDC"]').val();
			var arDataAppuntamento = $('input[name=dteDataAppuntamento]');
			var arOraAppuntamento = $('input[name="txtOraAppuntamento"]');
			var arMotivo = $("textarea[name=txtareaMotivo]");
			var arNotaBreve = $('input[name="txtNotaBreve"]');
			var arAccesso = $('input[name="chkAccesso"]');
			for (var i = 0; i<arDataAppuntamento.length;i++) {
				vArrayParam.push({
						dimesso:			'N',
						iden_ricovero: 		INSERIMENTO_APPUNTAMENTO.iden_ricovero,
						iden_appuntamento:	INSERIMENTO_APPUNTAMENTO.iden_appuntamento,
						data:				MultiSubstring(arDataAppuntamento.eq(i).val(),[[6,10],[3,5],[0,2]]),
						ora:				arOraAppuntamento.eq(i).val(),
						reparto:			cdc,
						note:				arMotivo.eq(i).val(),
						nota_breve:			arNotaBreve.eq(i).val(),
						accesso:			(arAccesso.eq(i).is(":checked")?'S':'N'),
						callBackOk:			INSERIMENTO_APPUNTAMENTO.chiudi,
						callBackKo:			null
				});
			}
		
			if(INSERIMENTO_APPUNTAMENTO.iden_appuntamento == ''){
				APPUNTAMENTI.sql.setBatch(vArrayParam);
			}else{
				APPUNTAMENTI.sql.edit(vArrayParam[0]);
			}	
		}catch(e){
			alert(e.description);
		}		
	},
    onLoad:function(){

        var rs = top.executeQuery("AccessiAppuntamenti.xml","DettAppuntamento",[INSERIMENTO_APPUNTAMENTO.iden_ricovero]);
        while(rs.next()){
            INSERIMENTO_APPUNTAMENTO.appuntamenti[rs.getString("DATA")] = {iden:rs.getInt("IDEN"),ora:rs.getString("ORA"),note:rs.getString("NOTE")}
        }
    }

};