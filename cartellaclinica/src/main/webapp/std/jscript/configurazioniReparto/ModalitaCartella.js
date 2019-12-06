$(function(){

	NS_HTML.initPlugin();

	NS_CMC.init();
	NS_CMC.setEvents();

})

var NS_CMC = {

	data:{},
	
	cmbCodiceReparto:null,
	cmbModalita:null,

	init:function(){

		NS_CMC.cmbCodiceReparto =  	$('#cmbCodiceReparto');
		NS_CMC.cmbModalita =  		$('#cmbModalitaCartella');
		NS_CMC.setComboCodiceReparto();
		
	},
	
	setEvents:function(){
		$('#btnRegistra').click(NS_CMC.save);
		
		$('#btnCreaScriptSingolo').click(function(){
			window.clipboardData.setData("Text", NS_CMC.creaScriptSingolo(NS_CMC.cmbModalita.find('option:selected').val()));
		});
		
		$('#btnCreaScript').click(function(){
			window.clipboardData.setData("Text", NS_CMC.creaScript());
		});
		
		$('#btnRefresh').click(NS_CMC.cmbCodiceRepartoChange);
		NS_CMC.cmbCodiceReparto.change(NS_CMC.cmbCodiceRepartoChange);
		NS_CMC.cmbModalita.live("change",NS_CMC.cmbModalitaChange);
	},

	setComboCodiceReparto:function(){
		var rs = top.executeQuery("configurazioni.xml","getCodiceConfigurato",['CARTELLA_PAZIENTE_MODELLI']);
		NS_CMC.cmbCodiceReparto.append(
				$('<option></option>')
		);		
		while(rs.next()){
			NS_CMC.cmbCodiceReparto.append(
				$('<option></option>').text(rs.getString("SITO") + " - " + rs.getString("STRUTTURA") + " - " +rs.getString("CDC")).val(rs.getString("VALORE"))
			);
		}		
	},

	setComboModalita:function(){
		NS_CMC.cmbModalita.html("");
		var rs = top.executeQuery("configurazioni.xml","getModalitaCartella",[NS_CMC.cmbCodiceReparto.find('option:selected').val()]);
		NS_CMC.cmbModalita.append(
				$('<option></option>')
		);		
		while(rs.next()){
			NS_CMC.cmbModalita.append(
				$('<option></option>').text(rs.getString("FUNZIONE")).val(rs.getString("FUNZIONE"))
			);
			eval('NS_CMC.data[rs.getString("FUNZIONE")] = ' +rs.getString("RIFERIMENTI") );
		}
		
	},
	
	cmbCodiceRepartoChange:function(){
		$('th').text("");	
		$('td *').remove();	
		NS_CMC.setComboModalita();	
	},	
	
	cmbModalitaChange:function(){	
		$('td *').remove();	
	
		if(this.value!= '')
			NS_CMC.load(this.value);
	},
	
	creaScript:function(){
		var script = "";
		
		NS_CMC.cmbModalita.find('option[value!=""]').each(function(){
			script+= NS_CMC.creaScriptSingolo($(this).val());
		});
		
		return script;
	},
	
	creaScriptSingolo:function(pCodice){		
		var vCodiceReparto = NS_CMC.cmbCodiceReparto.find('option:selected').val();
		
		var script = "\
declare\n\
	pFunzione varchar2(5000) := '"+pCodice+"';\n\
	pCodiceReparto varchar2(5000) := '"+vCodiceReparto+"';\n\
	pLob clob := q'<"+JSON.stringify(NS_CMC.data[pCodice]).replace(/"/g, "'")+">';\n\
	pProcedura varchar2(5000):= 'CARTELLA_PAZIENTE_MODELLI';\n\
begin\n\
	delete from imagoweb.config_menu_reparto where procedura=pProcedura and funzione = pFunzione and attivo='S' and codice_reparto=pCodiceReparto;\n\
	insert into \
	imagoweb.config_menu_reparto \
	(PROCEDURA,ORDINE,ORDINAMENTO,CODICE_REPARTO,FUNZIONE,RIFERIMENTI) \
	values \
	(pProcedura,0,0,pCodiceReparto,pFunzione,pLob);\n\
end;\n/\n";
		return script;				
	},
	
	save:function(){

		try{
			var vCodice = NS_CMC.cmbModalita.find('option:selected').val();	
			var vCodiceReparto = NS_CMC.cmbCodiceReparto.find('option:selected').val();
			var vResp = top.executeStatement(
				"configurazioni.xml",
				"setModalitaCartella",
				[
					vCodice,
					vCodiceReparto,
					JSON.stringify(NS_CMC.data[vCodice]).replace(/"/g, "'")
				]
			);
	
			if(vResp[0] == 'KO')
				alert(vResp[1]);
		}catch(e){
			alert(e.description);
		}
	},	
		
	load:function(pCodice){				
		
		var _codice = pCodice;
		var _modalita = NS_CMC.data[_codice];				
		
		$('th').text("");	
		$('td *').remove();	
		
		htmlClassName();
		htmlFunzioniCheckBox("APERTURA");
		htmlFunzioniCheckBox("MODIFICA");
		htmlFunzioniCheckBox("STAMPA");		
		htmlAfterSave();
		htmlInserimento();
		htmlFilter();
		htmlFilters();
		htmlLabels();
		htmlMenu();
		
		function setTh(pIdParametro,pButtonFunction){
			$('#' + pIdParametro)
				.appendButton("+",pButtonFunction)
				.append(pIdParametro);			
		}
		
		function getButtonClickFunction(pIdParametro,pDato){
			return 	function(){
						if(typeof _modalita[pIdParametro][this.value] == 'undefined'){
							_modalita[pIdParametro][this.value] = pDato;
							NS_CMC.load(pCodice);													
						}else{
							alert('Selezione già presente');
						}
						NS_MENU.hide();
					};
					
		}
		
		function htmlClassName(){			
			$('#CLASSNAME').text("CLASSNAME");
			$('#CLASSNAME + td').appendSelect(
					DATI_DISPONIBILI.CLASSNAME,
					_modalita.CLASSNAME,
					function(){
						NS_CMC.data[_codice].CLASSNAME = $(this).find('option:selected').text();
					}
			);	
		}
		
		function htmlFunzioniCheckBox(pIdParametro){
			setTh(
				pIdParametro,
				function(){
					NS_MENU.show(
						DATI_DISPONIBILI.FUNZIONI,
						getButtonClickFunction(pIdParametro,false)
					);
				}				
			);

			$('#' + pIdParametro + ' + td').append(getUlLiChk(pIdParametro));				
		}									
		
		function htmlAfterSave(){
			setTh(
				"AFTER_SAVE",
				function(){
					NS_MENU.show(
						DATI_DISPONIBILI.FUNZIONI,
						getButtonClickFunction('AFTER_SAVE','')
					);
				}				
			);			
			
			var ul = $('<ul></ul>');
			
			if(typeof _modalita.AFTER_SAVE == 'undefined'){
				_modalita.AFTER_SAVE = {/*Default:''*/};
			}

			for (var i in _modalita.AFTER_SAVE){
				ul.append(
					$('<li></li>')//.text(i)
					.appendButton("X",
									function(){
										delete NS_CMC.data[_codice]["AFTER_SAVE"][$(this).attr("funzione")];
										NS_CMC.load(pCodice);
									},
									{"funzione":i}
					)
					.append(i)
					.appendSelect(
						DATI_DISPONIBILI.AFTER_SAVE[i],
						_modalita.AFTER_SAVE[i],
						function(){
							NS_CMC.data[_codice].AFTER_SAVE[i] = $(this).find('option:selected').text();
						}					
					)
				)			
			}
			
			$('#AFTER_SAVE + td').append(ul);	
		}
		
		function htmlInserimento(){			
			$('#INSERIMENTO + td').append(getUlLiFieldsetRadio("INSERIMENTO"));					
		}
		
		function htmlFilter(){
			$('#FILTER + td').append(getUlLiFieldsetRadio("FILTER"));
		}
		
		function htmlFilters(){
			setTh(
				"FILTERS",
				function(){
					NS_MENU.show(
						DATI_DISPONIBILI.FUNZIONI,
						getButtonClickFunction('FILTERS',{})
					);
				}				
			);				
			
			var _div = $('<div></div>');

			if(typeof _modalita.FILTERS == 'undefined'){
				_modalita.FILTERS = {/*Default:{}*/};
			}		

			for (var i in _modalita.FILTERS){
				//alert(i)		
				var _fieldset = NS_HTML.getFieldSet(i,[
								{
									text:"X",
									click:function(){										
										delete _modalita.FILTERS[$(this).attr("funzione")];
										NS_CMC.load(pCodice);
									},
									attr:{funzione:i}
								},
								{
									text:"+",
									click:function(){										
										NS_MENU.show(
											DATI_DISPONIBILI.FILTERS,
											function(){										
												_modalita.FILTERS[$(this).attr("funzione")][this.value] = {label:'',menu:false};
												NS_CMC.load(pCodice);
												NS_MENU.hide();
											},
											{funzione:$(this).attr("funzione")}
										);
									},
									attr:{funzione:i}
								}
	
							]);
		
				var _ul = $('<ul></ul>');
		
				for(var j in _modalita.FILTERS[i]){
					//alert(j)
					var _filtro = new String(j);
					var _li = $('<li></li>')
						.append(
							NS_HTML.getFieldSet(j,{
											text:"X",
											click:function(){
												var _this = $(this);												
												delete _modalita.FILTERS[_this.attr("funzione")][_this.attr("filtro")];
												NS_CMC.load(pCodice);												
											},
											attr:{funzione:i,filtro:j}
								})
								.appendTextBox(
									_modalita.FILTERS[i][j].label,
									function(){
										_modalita.FILTERS[$(this).attr("funzione")][$(this).attr("filtro")].label = this.value;
									},
									"Label",
									{"funzione":i,"filtro":j}
								)																
								.appendCheckBox(
									_modalita.FILTERS[i][j].menu,
									function(){
										_modalita.FILTERS[$(this).attr("funzione")][$(this).attr("filtro")].menu = $(this).is(':checked');
									},
									"Menu",
									{"funzione":i,"filtro":j}
								)		
						)
					_ul.append(_li);
				}
				
				_div.append(_fieldset.append(_ul));
		
			}
						
			$('#FILTERS + td').append(_div);
		}		
		
		function htmlLabels(){
			setTh(
				"LABELS",
				function(){
					NS_MENU.show(
						DATI_DISPONIBILI.FUNZIONI,
						getButtonClickFunction('LABELS',{})
					);
				}				
			);				
			
			var _div = $('<div></div>');

			if(typeof _modalita.LABELS == 'undefined'){
				_modalita.LABELS = {/*Default:{}*/};
			}		

			for (var i in _modalita.LABELS){
				//alert(i)
				var _ul = $('<ul></ul>');
		
				for(var j in _modalita.LABELS[i]){
					//alert(j)
					var _fs = NS_HTML.getFieldSet(j,{
											text:"X",
											click:function(){
												var _this = $(this);												
												delete _modalita.LABELS[_this.attr("funzione")][_this.attr("filtro")];
												NS_CMC.load(pCodice);												
											},
											attr:{funzione:i,filtro:j}
								})
					
					for(var z = 0 ; z < DATI_DISPONIBILI.LABELS.length ; z++){
						_fs.append(
							NS_HTML.getCheckBox(
										false,
										function(){
											_modalita.LABELS[$(this).attr("funzione")][$(this).attr("filtro")] = new Array();
											$(this).parent().find('input').each(function(){
												if(this.checked){
													_modalita.LABELS[$(this).attr("funzione")][$(this).attr("filtro")].push($(this).next().text())
												}
											});
										},
										{funzione:i,filtro:j}
										
							)
							.addClass(DATI_DISPONIBILI.LABELS[z])
						).appendLabel(DATI_DISPONIBILI.LABELS[z]);
					}

					for(var z = 0 ; z < _modalita.LABELS[i][j].length ; z++){
						_fs.find('.'+_modalita.LABELS[i][j][z]).attr("checked",true);
					}
					_ul.append($('<li></li>').append(_fs));
				}
		
		
				_div.append(NS_HTML.getFieldSet(i,[
								{
									text:"X",
									click:function(){										
										delete _modalita.LABELS[$(this).attr("funzione")];
										NS_CMC.load(pCodice);
									},
									attr:{funzione:i}
								},
								{
									text:"+",
									click:function(){										
										NS_MENU.show(
											DATI_DISPONIBILI.FILTER,
											function(){										
												_modalita.LABELS[$(this).attr("funzione")][this.value] = [];
												NS_CMC.load(pCodice);
												NS_MENU.hide();
											},
											{funzione:$(this).attr("funzione")}
										);
									},
									attr:{funzione:i}
								}
	
							]).append(_ul));
		
			}
						
			$('#LABELS + td').append(_div);
		}		
		
		function htmlMenu(){
			/*setTh(
				"MENU",
				function(){
					NS_MENU.show(
						DATI_DISPONIBILI.FUNZIONI,
						getButtonClickFunction('MENU',{})
					);
				}				
			);*/
			$('#MENU').text("MENU");				
			
			var _div = $('<div></div>');

			if(typeof _modalita.MENU == 'undefined'){
				_modalita.MENU = {Default:{}};
			}		

			for (var i in _modalita.MENU){
		
				var _ul = $('<ul></ul>');
		
				for(var j in _modalita.MENU[i]){
					var _fs =NS_HTML.getFieldSet(j)
						.appendSelect(DATI_DISPONIBILI.MENU.statement,_modalita.MENU[i][j].statement)
						.appendTextBox(_modalita.MENU[i][j].title,function(){_modalita.MENU[i][j].title = this.value},"title");					
						
						var _ul_columns = $('<ul></ul>');
								
						for(var z=0; z<_modalita.MENU[i][j].columns.length ; z++){
							_ul_columns.append(
								$('<li></li>')
									.appendButton("X",function(){
											_modalita.MENU[$(this).attr("funzione")][$(this).attr("filtro")].columns.splice($(this).attr("index"),1); 
											NS_CMC.load(pCodice);
										},																					
										{funzione:i,filtro:j,index:z}
									)
									.appendTextBox(
										_modalita.MENU[i][j].columns[z].field,
										function(){
											_modalita.MENU[$(this).attr("funzione")][$(this).attr("filtro")].columns[$(this).attr("index")].field = this.value;
										},
										"field",																					
										{funzione:i,filtro:j,index:z}
									)
									.appendTextBox(
										_modalita.MENU[i][j].columns[z].label,
										function(){
											_modalita.MENU[$(this).attr("funzione")][$(this).attr("filtro")].columns[$(this).attr("index")].label = this.value;
										},
										"label",																					
										{funzione:i,filtro:j,index:z}
									)
									.appendTextBox(
										_modalita.MENU[i][j].columns[z].width,
										function(){
											_modalita.MENU[$(this).attr("funzione")][$(this).attr("filtro")].columns[$(this).attr("index")].width = this.value;
										},
										"width",																					
										{funzione:i,filtro:j,index:z}
									)
							)
						}
								
						_fs.append(
							NS_HTML.getFieldSet(
								"Colonne",
								{
									text:"+",
									click:function(){															
										_modalita.MENU[$(this).attr("funzione")][$(this).attr("filtro")].columns.push({field:'',label:'',width:''});																
										NS_CMC.load(pCodice);
									},
									attr:{funzione:i,filtro:j}
								}
							)
							.append(_ul_columns)
						);
										
					_ul.append($('<li></li>').append(_fs));
				}
		
		
				_div.append(NS_HTML.getFieldSet(i).append(_ul));
		
			}
						
			$('#MENU + td').append(_div);
		}		
		
		
		function getUlLiChk(pSezione){
			var ul = $('<ul></ul>');
			
			if(typeof _modalita[pSezione] == 'undefined'){
				_modalita[pSezione] = {Default:false};
			}
			
			for (var i in _modalita[pSezione]){
				ul.append(
					$('<li></li>')
					.appendButton("X",
									function(){
										delete NS_CMC.data[_codice][pSezione][$(this).attr("funzione")];
										NS_CMC.load(pCodice);
									},
									{"funzione":i}
					)
					.appendCheckBox(_modalita[pSezione][i],function(){NS_CMC.data[_codice][pSezione][i] = $(this).is(':checked')},i)
				)	
			}	
			return ul;		
		}
		
		function getUlLiFieldsetRadio(pSezione){
			setTh(
				pSezione,
				function(){
					NS_MENU.show(
						DATI_DISPONIBILI.FUNZIONI,
						getButtonClickFunction(pSezione,null)
					);
				}				
			);			
			
			var ul = $('<ul></ul>');

			if(typeof _modalita[pSezione] == 'undefined'){
				_modalita[pSezione] = {Default:null};
			}		
			
			for (var i in _modalita[pSezione]){
				ul.append($('<li></li>')
					.append(
						NS_HTML.getFieldSet(i,{
									text:"X",
									click:function(){
										delete NS_CMC.data[_codice][pSezione][$(this).attr("funzione")];
										NS_CMC.load(pCodice);
									},
									attr:{funzione:i}
							})
							.appendCollection(
								NS_HTML.getRadioBox(
									DATI_DISPONIBILI[pSezione],
									_modalita[pSezione][i],
									function(){
										NS_CMC.data[_codice][pSezione][i] = $(this).val();									
									}
								)
							)
					)
				);
		
			}
						
			return ul;
		}				
		
	}
	
};

var NS_MENU = {

	obj : null,

	show:function(pCollection,pClickFunction,pAttributi){	
		NS_MENU.obj = $('<div></div>').addClass('menu').css({top:event.clientY + document.documentElement.scrollTop,left:event.clientX});
		
		for(var i=0 ; i<pCollection.length; i++){
			NS_MENU.obj.append(
				$('<div></div>')
					.text(pCollection[i])
					.val(pCollection[i])
					.click(pClickFunction)
					.attr(typeof pAttributi == 'object' ? pAttributi : {})
			)
		}		
		
		$('body').append(NS_MENU.obj);
		
	},
	
	hide:function(){
		NS_MENU.obj.remove();
		NS_MENU.obj = null;
	}
};

var NS_HTML = {
	
		initPlugin:function(){
				
				$.prototype.appendCollection = function(pCollection){
					for (var i = 0; i < pCollection.length ; i++){
						this.append(pCollection[i]);
					}					
					return this;
				};
				
				$.prototype.appendLabel = function(pText){
					return this.append(NS_HTML.getLabel(pText));
				};
				
				$.prototype.appendTextBox = function(pValue,pBlurFunction,pLabel,pAttributi){
					if(typeof pLabel != 'undefined')
						this.appendLabel(pLabel);
					return this.append(NS_HTML.getTextBox(pValue,pBlurFunction,pAttributi));
				};
				
				$.prototype.appendButton = function(pValue,pClickFunction,pAttributi){
					return this.append(NS_HTML.getButton(pValue,pClickFunction,pAttributi));
				};								
				
				$.prototype.appendCheckBox = function(pChecked,pClickFunction,pLabel,pAttributi){
					this.append(NS_HTML.getCheckBox(pChecked,pClickFunction,pAttributi));
					if(typeof pLabel != 'undefined')
						this.appendLabel(pLabel);				
					return this;
				};				
				
				$.prototype.appendSelect = function(pCollection,pSelected,pChangeFunction){
					return this.append(NS_HTML.getSelect(pCollection,pSelected,pChangeFunction));
				};								
				
		},
	
		getSelect:function(pCollection,pSelected,pChangeFunction){
			if(pCollection.length == 0) return null;
			
			var cmb = $('<select></select>');
			
			if(typeof pChangeFunction == 'function')
				cmb.change(pChangeFunction);

			for (var i = 0 ;i<pCollection.length ; i++){
				cmb.append(
					$('<option></option>')
						.text(pCollection[i])
						.val(pCollection[i])
					);
			}
			
			cmb.find('option[value="'+pSelected+'"]').attr("selected","selected");
			return cmb;
		},
		
		getLabel:function(pText){
			return $('<label></label>').text(pText);
		},
		
		getTextBox:function(pValue,pBlurFunction,pAttributi){
			return $('<input />')
						.val(pValue)
						.attr(typeof pAttributi == 'object' ? pAttributi : {})
						.blur(typeof pBlurFunction == 'function' ? pBlurFunction : function(){});
		},
		
		getButton:function(pValue,pClickFunction,pAttributi){
			return $('<input type="button"/>')
						.val(pValue)
						.click(typeof pClickFunction == 'function' ? pClickFunction : function(){})
						.attr(typeof pAttributi == 'object' ? pAttributi : {});
		},		
		
		getCheckBox:function(pChecked,pClickFunction,pAttributi){
			var _input = $('<input type="checkbox"/>')
				.attr(typeof pAttributi == 'object' ? pAttributi : {})
				.attr("checked", pChecked);
				
			if(typeof pClickFunction == 'function')
				_input.click(pClickFunction);
				
			return _input;
		},
		
		getRadioBox:function(pCollection,pSelected,pClickFunction){
			if(pCollection.length == 0) return [];

			var _elements = new Array();
			var _millis = (new Date()).getTime();

			for (var i = 0 ; i< pCollection.length ; i++){
				var _input = $('<input type="radio" name="'+_millis+'"/>')
					.val(pCollection[i])
					.attr("checked",( pCollection[i] == pSelected));
				
				if(typeof pClickFunction == 'function')
					_input.click(pClickFunction);									
				
				_elements.push(_input);
				_elements.push(NS_HTML.getLabel(pCollection[i]));				
			}

			return _elements;
		},
		
		getFieldSet:function(pLegend,pButtons){
			var _legend = $('<legend></legend>');

			if(typeof pButtons != 'undefined'){
				if(typeof pButtons.length != 'undefined'){
					for (var i = 0 ; i < pButtons.length ; i ++){
						_legend.appendButton(pButtons[i].text,pButtons[i].click,pButtons[i].attr);
					}
				}else{
					_legend.appendButton(pButtons.text,pButtons.click,pButtons.attr);
				}
			}
			
			return $('<fieldset></fieldset')
						.append(
							_legend.appendLabel(pLegend)
						);		
		}
	
};