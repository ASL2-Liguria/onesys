var a_filtri 	= new Array();

var __a_temp   	= null;
var __e_method 	= null;

// linea 366 per fare alert sql

function __valorizzaElenco(elenco)
{
	__a_temp = elenco;
};

function FILTRO_QUERY(id, txt_chk)
{
	
	var _my_class             = this;
	
	this._id                  = '';
	this._obj                 = null;
	this._wait_refresh        = 'S';
	this._sql_row_blank       = 'N';
	this._sql_distinct        = 'N';
	this._sql_escapeHTML      = 'N';
	this._sql_field_value     = '';
	this._sql_descr_value     = new Array();
	this._sql_descr_separator = ' - ';
	this._sql_data_value      = new Object();
	this._sql_from            = '';
	this._sql_where_base      = '';
	this._sql_where           = '';
	this._sql_order           = '';
	this._sql_group           = '';
	this._sql                 = '';
	this._a_where             = new Array();
	this._evento              = null;
	
	/*fra*/
	
	this._type_element_container = 'SELECT';
	this._type_element_option = 'OPTION';
	
	this.setTypesElement = function (pElementContainer,pElementOption){
		if(typeof pElementContainer != 'undefined'
			&& typeof pElementOption != 'undefined'
				&& pElementContainer != ''
					&& pElementOption != ''){
			this._type_element_container = pElementContainer;
			this._type_element_option = pElementOption;
			var newContainer = document.createElement(pElementContainer);
			newContainer.id=id;
			var divContainer= document.createElement('DIV');
			divContainer.id='div_'+id;
			divContainer.appendChild(newContainer);
			
			this._obj.parentNode.appendChild(divContainer);
			this._obj.removeNode(true);
			this._obj=newContainer;
			
		}
	};
	
	this.valoreValido = function(valore)
	{
		return typeof valore != 'undefined' && valore != null && valore != '';
	};
	
	this.attributoValido = function(attributo)
	{
		return typeof attributo != 'undefined' && attributo != null && (/^[a-zA-Z0-9\.\-\_\:]+$/).test(attributo);
	};
	
	this.setEnableWait = function(field)
	{
		if(this.valoreValido(field))
		{
			this._wait_refresh = field;
		}
		else
		{
			this._wait_refresh = 'S';
		}
		
		this._sql = '';
	};
	
	this.setRowBlank = function(field)
	{
		if(this.valoreValido(field))
		{
			this._sql_row_blank = field;
		}
		else
		{
			this._sql_row_blank = 'N';
		}
		
		this._sql = '';
	};
	
	this.setDistinctQuery = function(field)
	{
		if(this.valoreValido(field))
		{
			this._sql_distinct = field;
		}
		else
		{
			this._sql_distinct = 'N';
		}
		
		this._sql = '';
	};
	
	this.setEscapeHTML = function(field)
	{
		if(this.valoreValido(field))
		{
			this._sql_escapeHTML = field;
		}
		else
		{
			this._sql_escapeHTML = 'N';
		}
		
		this._sql = '';		
	};
	
	this.setValueFieldQuery = function(field)
	{
		if(this.valoreValido(field))
		{
			this._sql_field_value = field;
		}
		else
		{
			this._sql_field_value = '';
		}
		
		this._sql = '';
	};
	
	this.setDataFieldQuery = function(key, value)
	{
		key = key.toLowerCase();
		if(key == 'value') return this.setValueFieldQuery(value);
		
		if (this.attributoValido(key))
		{
			if (this.valoreValido(value))
			{
				this._sql_data_value[key] = value;
			}
			else
			{
				delete this._sql_data_value[key];
			}
		}
		
		this._sql = '';
	};
	
	this.setDescrFieldQuery = function(/* descr1, descr2, ... */)
	{
		this._sql_descr_value = new Array();
		for (var i=0, length=arguments.length; i < length; i++) {
			var descr = arguments[i];
			
			if(this.valoreValido(descr))
			{
				this._sql_descr_value.push(descr);
			}
		}
		
		this._sql = '';
	};
	
	this.setFromFieldQuery = function(from)
	{
		if(this.valoreValido(from))
		{
			this._sql_from = from;
		}
		else
		{
			this._sql_from = '';
		}
		
		this._sql = '';
	};
	
	this.setOrderQuery = function(order)
	{
		if(this.valoreValido(order))
		{
			this._sql_order = order;
		}
		else
		{
			this._sql_order = '';
		}
		
		this._sql = '';
	};

	this.setGroupQuery = function(group)
	{
		if(this.valoreValido(group))
		{
			this._sql_group = group;
		}
		else
		{
			this._sql_group = '';
		}
		
		this._sql = '';
	};
	
	this.setWhereBaseQuery = function(where)
	{
		if(this.valoreValido(where))
		{
			this._sql_where_base = where;
		}
		else
		{
			this._sql_where_base = '';
		}
		
		this._sql = '';
	};
	
	this.appendWhere = function(condizione, key_condizione)
	{
		if(this.valoreValido(key_condizione))
		{
			if(condizione == '')
			{
				this.removeWhere(key_condizione);
			}
			else
			{
				this._a_where[this.valoreValido(key_condizione) ? key_condizione:this._a_where.length] = condizione;
			}
		}
		
		this._sql = '';
	};
	
	this.attachWhere = function(condizione, key_condizione, operatore)
	{
		if(this.valoreValido(condizione) && this.valoreValido(key_condizione))
		{
			if(!this.valoreValido(condizione))
			{
				operatore = ' and ';
			}
			else
			{
				operatore = ' ' + operatore + ' ';
			}
			
			if(typeof this._a_where[key_condizione] == 'undefined')
			{
				this._a_where[key_condizione] = condizione;
			}
			else
			{
				this._a_where[key_condizione] += operatore + condizione;
			}
		}
		
		this._sql = '';
	};
	
	this.removeWhere = function(key_condizione)
	{
		if(this.valoreValido(key_condizione))
		{
			this._a_where[key_condizione] = null;
			this._a_where.splice(key_condizione, 1);
		}
		
		this._sql = '';
	};
	
	this.generateQuery = function()
	{
		if(this._sql == '')
		{
			this._sql_where = '';
			
			for(var idx in this._a_where)
			{
				if(this._a_where[idx] != null && typeof this._a_where[idx] == 'string' && this.valoreValido(this._a_where[idx]))
				{
					this._sql_where += (this._sql_where != '' ? ' and ':' ') + '(' + this._a_where[idx].toString() + ')';
				}
			}
			
			//this._sql = "select '<OPTION value=\"' || " + this._sql_field_value + " || '\">' || " + this._sql_descr_value + " || '</OPTION>'";
			
			// Apre il tag HTML
			this._sql = "select '<"+this._type_element_option;
			
			if (this._sql_escapeHTML == 'S') {
				// Aggiunge l'attributo value
				this._sql += " value=\"' || htf.escape_sc(" + this._sql_field_value + ") || '\"";
				
				// Aggiunge attributi opzionali 
				for (var item in this._sql_data_value) {
					this._sql += " "+item+"=\"' || htf.escape_sc(" + this._sql_data_value[item] +") || '\"";
				}
				
				// Aggiunge l'inner HTML
				this._sql += ">' || htf.escape_sc(" + this._sql_descr_value.join("||'" + this._sql_descr_separator + "'||") + ") || ";
			} else {
				// Aggiunge l'attributo value
				this._sql += " value=\"' || " + this._sql_field_value + " || '\"";
				
				// Aggiunge attributi opzionali 
				for (var item in this._sql_data_value) {
					this._sql += " "+item+"=\"' || " + this._sql_data_value[item] +" || '\"";
				}
				
				// Aggiunge l'inner HTML
				this._sql += ">' || " + this._sql_descr_value.join("||'" + this._sql_descr_separator + "'||") + " || ";
			}
			// Chiude il tag HTML
			this._sql += "'</"+this._type_element_option+">'";
			
			this._sql += ' from ';
			if(this._sql_distinct == 'S')
			{
				this._sql += "(select distinct " + this._sql_field_value + ", " + this._sql_descr_value.join(", ");
				for (var item in this._sql_data_value) {
					this._sql += ", " + this._sql_data_value[item];
				}
				this._sql += ' from ' + this._sql_from;
				
				this._sql += this._sql_where_base != '' ? ' where ' + this._sql_where_base:'';
			
				if(this._sql_where != '')
				{
					this._sql += (this._sql.toUpperCase().indexOf('WHERE') > 0 ? ' and ':'  where ') + this._sql_where;
				}
				
				this._sql += ')';
			}
			else
			{
				this._sql += this._sql_from;
				
				this._sql += this._sql_where_base != '' ? ' where ' + this._sql_where_base:'';
				
				if(this._sql_where != '')
				{
					this._sql += (this._sql.toUpperCase().indexOf('WHERE') > 0 ? ' and ':'  where ') + this._sql_where;
				}
			}
			
			this._sql += this._sql_order != '' ? ' order by ' + this._sql_order:'';
			//tappullo lucas
			this._sql += this._sql_group != '' ? ' group by ' + this._sql_group:'';
		}
		//alert(this._sql);
		return this._sql;
	};
	
	this.refreshList = function(condizione, key_condizione)
	{
		if(this._obj != null && typeof this._obj != 'undefined')
		{
			this.appendWhere(condizione, key_condizione);
			
			dwr.engine.setAsync(false);
			//alert(this.generateQuery());
			//alert('__valorizzaElenco: '+__valorizzaElenco);

			toolKitDB.getListResultData(this.generateQuery(), __valorizzaElenco);
			
			dwr.engine.setAsync(true);
			
			this.stopIntervallSearch();
			
			this.populateList(__a_temp);
			
			if(typeof this.callback != 'undefined'){				
				this.callback();
			}
		}
	};
	
	callback : '',
	
	this.startRefreshList = function()
	{
		_my_class.refreshList();
	};
	
	this.searchListRefresh = function(condizione, key_condizione, callback)
	{
		this.callback = callback;
		if(this._obj != null && typeof this._obj != 'undefined')
		{
			this.stopIntervallSearch();
			this.appendWhere(condizione, key_condizione);
			if(this._wait_refresh == 'S')
			{
			this._evento = setTimeout(this.startRefreshList, 500);
			}
			else
			{
				this.startRefreshList();
			}
		}

	};
	
	this.stopIntervallSearch = function()
	{
		if(this._evento != null)
		{
			clearTimeout(this._evento);
			this._evento = null;
		}
	};
	
	this.populateList = function(elenco)
	{
		var html 			= elenco.join("");
		var opt_click 		= this._obj.onclick;
		var opt_dblclick 	= this._obj.ondblclick;
		var opt_change 		= this._obj.onchange;
		var opt_oncontext	= this._obj.oncontextmenu;
		var attc 			= false;
		var $obj = $(this._obj);
		
		if(this._obj.nodeName == 'SELECT'){
			//tappullo per crhome
			if(navigator.userAgent.indexOf('MSIE') > -1 && ($('#KEY_LEGAME').val()!='SCELTA_ESAMI_PROFILI_DATI_STRUTTURATI')){
				this._obj.options.outerHTML = this._obj.outerHTML.substr(0,  this._obj.outerHTML.toUpperCase().indexOf('<'+this._type_element_option) <= 0 ? this._obj.outerHTML.toUpperCase().indexOf('</'+this._type_element_container):this._obj.outerHTML.toUpperCase().indexOf('<'+this._type_element_option)) + (this._sql_row_blank == 'S' ? '<'+this._type_element_option+' value=""></'+this._type_element_option+'>':'') + html + '</'+this._type_element_container+'>';
			}
			else{
				$obj.html(html);
			}
		}else{
			this._obj.outerHTML = this._obj.outerHTML.substr(0, this._obj.outerHTML.toUpperCase().indexOf('<'+this._type_element_option) <= 0 ? this._obj.outerHTML.toUpperCase().indexOf('</'+this._type_element_container):this._obj.outerHTML.toUpperCase().indexOf('<'+this._type_element_option)) + (this._sql_row_blank == 'S' ? '<'+this._type_element_option+' value=""></'+this._type_element_option+'>':'') + html + '</'+this._type_element_container+'>';
		}
		
		attc = this.attachElement(this._id);
		
		if(opt_click != null)
		{
			this._obj.onclick = opt_click;
		}
		
		if(opt_dblclick != null)
		{
			this._obj.ondblclick = opt_dblclick;
		}
		
		if(opt_change != null)
		{
			this._obj.onchange = opt_change;
		}
		
		if(opt_oncontext != null)
		{
			this._obj.oncontextmenu = opt_oncontext;
		}
	};

	this.attachElement = function(id)
	{
		if(this.valoreValido(id))
		{
			this._id  = id;
			this._obj = document.all[id];
			
			if(typeof this._obj == 'undefined')
			{
				this._obj = document.getElementsByName(id);
			}
			
			return this._obj != 'undefined';
		}
		else
		{
			return false;
		}
	};
	
	this.checkEventText = function(id)
	{
		var txt_chk = null;
		
		if(this.valoreValido(id))
		{
			txt_chk = typeof document.all[id] != 'undefined' ? document.all[id]:document.getElementsByName(id);;
			
			if(typeof txt_chk != 'undefined')
			{
				txt_chk.onkeypress = function()
									 {
										if(window.event.keyCode==13)
										{
											window.event.returnValue=false;
										}
									 };
			}
		}
	};
	
	this.attachElement(id);
	this.checkEventText(txt_chk);
};