$(document).ready(function(){ 
 // document.oncontextmenu = function() {return false;};

});


var NS_CascadeTree = {
	/*
	pSelector:
		Stringa con selettore jQuery dell'oggetto al quale appendere l'albero
	pParam:
		{
			gruppo				: Gruppo di radsql.CONFIG_ACR
			,onSelection		: Function da eseguire al click sul ramo finale 
										function(obj){
											obj.iden = iden di radsql.CONFIG_ACR
											obj.codice = codice di radsql.CONFIG_ACR
											obj.descrizione = testo del ramo selezionato
											obj.ref = iden_figlio radsql.CONFIG_ACR
											obj.path = percorso del ramo (es:"1.34.567.1.34")
											obj.path_descr = percorso delle descrizioni per arrivare al ramo 											
										}
			[,abilita_ricerca_descrizione]
			[,abilita_ricerca_codice]			
			[,beforeOpenNode]
			[,afterOpenNode]
			[,CreaNascosto]
		}
	*/	
	append:function (pSelector,pParam){
		var Menu = new CascadeTree(pParam);
		$(pSelector).append($(Menu.getBody(0)));	
		Menu.init();
		
		if(typeof pParam.CreaNascosto != 'undefined' && pParam.CreaNascosto=='S'){
			//Menu.hide();
		}
		
		return Menu;
	}
};

function CascadeTree(pParam){
	
	if(typeof pParam.gruppo == 'undefined')return alert('Parametro "gruppo" non definito');
	
	this.gruppo 					= pParam.gruppo;
	this.abilita_ricerca_descrizione= (typeof pParam.abilita_ricerca_descrizione == 'undefined' ? 'N' : pParam.abilita_ricerca_descrizione );
	this.abilita_ricerca_codice 	= (typeof pParam.abilita_ricerca_codice == 'undefined' ? 'N' : pParam.abilita_ricerca_codice );	
	this.onSelection  				= (typeof pParam.onSelection == 'undefined' ? function(){alert('Nessuna funzione di selezione presente')} : pParam.onSelection );
	
	//function da eseguire prima dell'apertura del nodo
	this.beforeOpenNode 			= (typeof pParam.beforeOpenNode == 'undefined' ? function(){return true;} : pParam.beforeOpenNode );
	//function da eseguire dopo la creazione del ramo scelto
	this.afterOpenNode 				= (typeof pParam.afterOpenNode == 'undefined' ? function(){} : pParam.afterOpenNode );

	this.LinkSelectors = {
			Gruppo : 		'#Gruppo_' + pParam.gruppo,
			Search:			'#Gruppo_' + pParam.gruppo + ' #Search',
			CascadeTree : 	'#Gruppo_' + pParam.gruppo + ' #CascadeTree',
			Result : 		'#Gruppo_' + pParam.gruppo + ' #Result'
	};	
	
	this.init = function(){
		
		$(this.LinkSelectors.CascadeTree + ' ul').hide();
		$(this.LinkSelectors.CascadeTree + ' > ul').show();
		$(this.LinkSelectors.Result).hide();
		
		this.setEvents();
	};
	

	
	this.show = function(){
		$(this.LinkSelectors.Gruppo).fadeIn(200);
	};
	
	this.hide = function(){
		$(this.LinkSelectors.Gruppo).fadeOut(200);		
	};
	
	this.setEvents = function(){
		
		var _MenuInstance = this;

				
		$(this.LinkSelectors.CascadeTree +' a').live('mousedown',function(e){
			$(_MenuInstance.LinkSelectors.CascadeTree +' a.light').removeClass("light");
			
			var _a = $(this);
			$(_MenuInstance.LinkSelectors.CascadeTree + ' a.searched').removeClass("searched");

			if(_a.next().attr("loaded")=="0"){
				_MenuInstance.getNodo(_a, e.button);
			}else{
				if(_a.next().html() != '')
					_a.next().slideToggle().find(' ul').slideUp();
			}
		});
		
		$(this.LinkSelectors.Result +' li').live('click',function(){
			_MenuInstance.open($(this).attr("path"));
		});
		
		$(this.LinkSelectors.Search + ' a#btnEsplora').click(function(){
			$(_MenuInstance.LinkSelectors.Result).hide();
			$(_MenuInstance.LinkSelectors.CascadeTree).show();
		});
		
		$(this.LinkSelectors.Search + ' a#btnCerca').click(function(){
	
			var Descrizione = $(_MenuInstance.LinkSelectors.Search + ' #txtDescrizione').val().toUpperCase();
			if(Descrizione.length < 3)return alert("Inserire un testo valido per la ricerca");	
			
			$(_MenuInstance.LinkSelectors.CascadeTree).hide();
			$(_MenuInstance.LinkSelectors.Result).show();

			dwr.engine.setAsync(false);
			DwrCascadeTree.getNodiRicerca("Alberi.xml","queryRicerca",[_MenuInstance.gruppo,Descrizione],callBack);
			dwr.engine.setAsync(true);
			
			function callBack(pResp){
				if(pResp[0]=='KO')return alert(pResp[1]);
				$(_MenuInstance.LinkSelectors.Result).html(pResp[1]).show();
			}
		});
		
		$("input#txtDescrizione ,input#txtCodice")
		.keypress(function(){
			
			if(window.event.keyCode==13){
				var Descrizione = $(this).val().toUpperCase();
				if(Descrizione.length < 3)return alert("Inserire un testo valido per la ricerca");	
				
				$(_MenuInstance.LinkSelectors.CascadeTree).hide();
				$(_MenuInstance.LinkSelectors.Result).show();

				dwr.engine.setAsync(false);
				DwrCascadeTree.getNodiRicerca("Alberi.xml","queryRicerca",[_MenuInstance.gruppo,Descrizione],callBack);
				dwr.engine.setAsync(true);
				
				function callBack(pResp){
					if(pResp[0]=='KO')return alert(pResp[1]);
					$(_MenuInstance.LinkSelectors.Result).html(pResp[1]).show();
				}
			}else{
				if($(this).attr("id") == 'txtDescrizione'){
					$('input#txtCodice').val("");
				}else{
					$('input#txtDescrizione').val("");
				}
			}
		});

	};
	
	this.open = function(pPath){
		var ArPath = pPath.split('.');
		var PathProvvisorio=null;
		
		$(this.LinkSelectors.CascadeTree).show();
		$(this.LinkSelectors.CascadeTree + ' ul').slideUp();
		
		$(this.LinkSelectors.Result).hide();		
		this.getNodoByPath(this.gruppo,pPath);
		$(this.LinkSelectors.CascadeTree +' a[path="'+pPath+'"]').addClass("searched");

	};

	this.getBody=function(pIdenPadre){
		//alert(this.gruppo + '\n' + this.abilita_ricerca + '\n' + callBack)
		var vBody;
		try{
			//alert(CascadeTree.getBody)
			dwr.engine.setAsync(false);
			DwrCascadeTree.getBody(this.gruppo,this.abilita_ricerca_descrizione,this.abilita_ricerca_codice,pIdenPadre,callBack);
			dwr.engine.setAsync(true);
		}catch(e){
			alert(e.description)
		}
	
		return vBody;
		function callBack(pResp){
			//alert('in'+pResp);
			if(pResp[0]=='KO'){
				return alert(pResp[1]);
			}else{
				vBody = pResp[1];
			}			
		}			
	};
	
	this.getNodo=function(pObj,mouseButton){
		_MenuInstance = this;
		
		var vSelezione = {
					iden:			pObj.attr("iden"),
					codice:			pObj.attr("codice"),
					descrizione:	pObj.text(),
					ref:			pObj.attr("ref"),
					path:			pObj.attr("path"),
					path_descr:		pObj.attr("path_descr")
				};
	
		if(mouseButton == 2){
			_MenuInstance.onSelection(vSelezione);
			return;
		}
		if(!_MenuInstance.beforeOpenNode(vSelezione))return;

		if(pObj.attr("ref")== 'null'){
			vSelezione.ref=-1;
		}else{
			vSelezione.ref=pObj.attr("ref");
		}
		dwr.engine.setAsync(false);
		DwrCascadeTree.getNodo(this.gruppo,vSelezione.ref,callBack);
		dwr.engine.setAsync(true);
		
		function callBack(pResp){
			if(pResp[0]=='KO')return alert(pResp[1]);
			if(pResp[1]!=""){				
				pObj.next().hide().append($(pResp[1])).slideDown();

			}else{
				//_MenuInstance.onSelection(vSelezione);
				pObj.click(function(){_MenuInstance.onSelection(vSelezione);})
			}
			pObj.next().attr("loaded","1");
			_MenuInstance.afterOpenNode(vSelezione);

			
		}
		
	};
	
	this.getNodoByPath=function(pGruppo,pPath){
		_MenuInstance = this;
		dwr.engine.setAsync(false);
		DwrCascadeTree.getNodoByPath(pGruppo,pPath,callBack);
		dwr.engine.setAsync(true);		
		function callBack(pResp){
			if(pResp[0]=='KO')
				return alert(pResp[1]);						
			$(_MenuInstance.LinkSelectors.CascadeTree).html(pResp[1]);		
			$('a[path="'+pPath+'"]').addClass("light").next().attr("loaded","0");	
		}				
	};
}