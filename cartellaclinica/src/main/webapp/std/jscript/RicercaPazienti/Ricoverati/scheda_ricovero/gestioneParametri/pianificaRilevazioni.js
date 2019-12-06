var WindowCartella = null;
var primoParSel=null;
$(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	pianificaRilevazioni.init();
	pianificaRilevazioni.setEvents();
});

var pianificaRilevazioni = {

		init : function() {
			pianificaRilevazioni.timeline.init();
			pianificaRilevazioni.loadCmbProfiliOrari();
			$('#parametri span.btn').each(function(i){
				var _span = $(this);
				if (_span.hasClass("selected")){ primoParSel=_span;};
			})	
			$("#NumeroGiorni").attr('maxlength','2');
		},
		
		setEvents : function() {
			$('input#DataInizio').focus(function(){$(this).blur();})
			.datepick(
					{
//						minDate:new Date(),
						onClose: pianificaRilevazioni.timeline.init,
						showOnFocus: false,  
						showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
					}
			);	
			$('input#OraInizio')
				.bind('keyup', function(){ oraControl_onkeyup(this);})
				.bind('blur', function(){ oraControl_onblur(this); pianificaRilevazioni.timeline.init();});
			$('input#NumeroGiorni').blur(function(){
				var _this=$(this);
				if (!IsNaturalNumber(_this.val())) {
					alert('Valore inserito non ammesso');
					_this.val('').focus();
				}
			});
			
			$('select#cmbProfiliOrari').change(pianificaRilevazioni.setProfiloOrario);
			
			$('span#close').click(pianificaRilevazioni.close);
			$('span#save').click(pianificaRilevazioni.save);
			
			$('span.btn').click(function () {
      			$(this).toggleClass("selected");
		    });
			
			$('span[name="selectall"]').click(function () {
				$('#profili span.btn').toggleClass("selected",$(this).hasClass("selected"));
				$('#parametri span.btn').toggleClass("selected",$(this).hasClass("selected"));
			});
			
			$('span[data-profile]').click(function(){
				
				var _profile = $(this);
				
				var isSelected = _profile.hasClass("selected");
				var profiles = _profile.attr("data-profile");
				if (primoParSel!=null){primoParSel.removeClass("selected"); primoParSel=null;} ;
				$('#parametri span.btn').each(function(){					
					var _span = $(this);
					profiles.indexOf("[" + _span.attr("data-codice") + "]")>-1;
					if(profiles.indexOf("[" + _span.attr("data-codice") + "]")>-1){
						_span.toggleClass("selected",isSelected);
					}
				});
			});
			
			
		},
		save : function() {

			var idenRiferimento = parent.document.EXTERN.iden_visita.value;
			var idenUte = WindowCartella.baseUser.IDEN_PER;
            var dataInizio =  clsDate.str2str($('input#DataInizio').val(),'DD/MM/YYYY','YYYYMMDD');
			var oraInizio =  $('input#OraInizio').val();
			//var idenParametro = $('select#selParametro option:selected').val();
			var orari = pianificaRilevazioni.timeline.dettagli2value();
			var numGiorni =  $('input#NumeroGiorni').val();
			
			var iden_parametri = "";
			$('#parametri span.selected').each(function(i){
				iden_parametri += (i>0?'|':'')+$(this).attr("data-iden");
			});
			
			//if (idenParametro=="") {return alert("Selezionare un parametro da pianificare");}
			if (numGiorni=="" || numGiorni=="0") {return alert("Inserire il numero di giorni");}
			if (orari=="") {return alert("Pianificare almeno un orario di rilevazione");}
			if(iden_parametri == ""){
				return alert('Selezionare almeno un tipo di rilevazione');
			}
			/*return alert(idenRiferimento + '\n' 
						//+ idenParametro + '\n' 
						+ iden_parametri + '\n' 
						+ idenUte + '\n' 
						+ dataInizio + '\n' 
						+ oraInizio + '\n' 
						+ numGiorni + '\n' 
						+ orari);*/
			/* annullo le pianificazioni attuali nell'arco temporale specificato*/
			var a_iden_parametri=iden_parametri.split("|");
			var datafine = clsDate.setData(dataInizio,oraInizio);
			datafine = clsDate.dateAdd(datafine,'D',numGiorni);
			for (var j=0; j<a_iden_parametri.length; j++){
				WindowCartella.executeStatement("parametri.xml","annullaPianificati",[idenRiferimento,a_iden_parametri[j],idenUte,dataInizio||oraInizio,clsDate.getData(datafine,'YYYYMMDD')+clsDate.getOra(datafine)]);
			}
			var resp = WindowCartella.executeStatement("parametri.xml","pianificaRilevazioni",[idenRiferimento,iden_parametri/*idenParametro*/,idenUte,dataInizio,oraInizio,numGiorni,orari]);

			if(resp[0]=='OK') { 
				pianificaRilevazioni.close();
				parent.refreshPiano(resp[0]);
			} else {
				alert(resp);
			}
		},
		close : function() {
			parent.$.fancybox.close();
		},
		
		loadCmbProfiliOrari:function(){
			//per il momento metto i valori qui, da valutare se renderli configurabili
			var profili = [
				{text:'Ogni 2 ore',value:'00:00;02:00;04:00;06:00;08:00;10:00;12:00;14:00;16:00;18:00;20:00;22:00'},
				{text:'Ogni 4 ore',value:'00:00;04:00;08:00;12:00;16:00;20:00'},
				{text:'0,6,12,18',value:'00:00;06:00;12:00;18:00'},
				{text:'0,8,16',value:'00:00;08:00;16:00'},
				{text:'0,8,12,15,18,20,22',value:'00:00;08:00;12:00;15:00;18:00;20:00;22:00'},
				{text:'8,20',value:'08:00;20:00'},
				{text:'8,12,18',value:'08:00;12:00;18:00'},
				{text:'8,12,18,22',value:'08:00;12:00;18:00;22:00'}																								
			];
						
			for(var i = 0; i < profili.length; i++){
				$('select#cmbProfiliOrari').append(
					$('<option></option>').val(profili[i].value).text(profili[i].text)
				);
			}
		},
		
		setProfiloOrario:function(){

			var ar = $(this).find('option:selected').val().split(';');
			var myDate;
			var dataIni = clsDate.getData(timeline.properties.dateIni,'YYYYMMDD');
            if(ar.length!=1){
                for(var i=0;i<ar.length;i++){

                    myDate = clsDate.str2date(dataIni,'YYYYMMDD',ar[i]);
                    if(myDate<timeline.properties.dateIni){
                        myDate = clsDate.dateAdd(myDate,'D',1);
                    }
                    timeline.addDettaglio(timeline.arTbody[0].obj,myDate);
                }
            }
//			$(this).find('option:eq(0)').attr("selected","selected");
		},		
		
		timeline:{

			init:function(){

				var obj =document.getElementById('timeline');

				var newData = $('input#DataInizio').val();
				var newOra  =$('input#OraInizio').val();

				timeline.setup={
						zoom:1,
						data:clsDate.str2str(newData,'DD/MM/YYYY','YYYYMMDD'),
						ora:newOra,
						numeroOre:24,
						minutiBlocco:60,
						tipoAlternaColore:'1',
						minutiEditing:60
				};
				timeline.build(obj);								
			},			

			set:function(){
				pianificaRilevazioni.timeline.dettagli2value(true);
				pianificaRilevazioni.timeline.init();
				pianificaRilevazioni.timeline.value2dettagli();
			},	

			dettagli2value:function(pRemove){
				//prendo dall'interno della timeline e metto i dati nel value dello UserInput
				var value = "";
//				var lst=getElementsByAttributes({id:'dettaglio'},document.getElementById('timeline'),'div');
				var lst = $('#timeline div[id="dettaglio"]');

				for(var i=0;i<lst.length;i++){
					value += lst[i].getAttribute("data") +'@'+ lst[i].getAttribute("ora") +'@'+ lst[i].getAttribute("day") + '|';
					if(pRemove)
						timeline.removeDettaglio(lst[i]);
				}
//				getElementsByAttributes({cls:'UserInput',tipo:'timeline'},document.body,'div')[0].setAttribute("value",value.substring(0,value.length-1));
				return value.substring(0,value.length-1);
			},		

			value2dettagli:function(){
				//prendo dello UserInput e inserisco nella timeline
				var value = getElementsByAttributes({cls:'UserInput',tipo:'timeline'},document.body,'div')[0].getAttribute('value');

				if(value=='')return;

				var arDettagli = value.split('|');
				var dettaglio = {data:'',ora:'',day:''};
				var myDate;
				for(var i = 0; i< arDettagli.length;i++){

					dettaglio.data = clsDate.getData(timeline.properties.dateIni,'YYYYMMDD');
					dettaglio.ora = arDettagli[i].split('@')[1];				


					myDate = clsDate.str2date(dettaglio.data,'YYYYMMDD',dettaglio.ora);
					if(myDate<timeline.properties.dateIni){
						myDate = clsDate.dateAdd(myDate,'D',1);
					}
					if(myDate>=timeline.properties.dateFine){
						myDate = clsDate.dateAdd(myDate,'D',-1);
					}					
					if(myDate>=timeline.properties.dateIni && myDate< timeline.properties.dateFine){				
						timeline.arTbody[0].addDettaglio(myDate,"");		
					}
				}

			},

			DataOraTrigger:function(pObj){
				if(document.getElementById('timeline')){
					pianificaRilevazioni.timeline.set();
				}
			}
		}
}