var a_filtri 	= new Array();

var __a_temp   	= null;
var __e_method 	= null;

function __valorizzaElenco(elenco)
{
	__a_temp = elenco;
};

function FILTRO_QUERY(id)
{
	var _my_class		  = this;
	
	this._id              = '';
	this._obj		      = null;
	this._sql_field_value = '';
	this._sql_descr_value = '';
	this._sql_from        = '';
	this._sql_where_base  = '';
	this._sql_where       = '';
	this._sql_order       = '';
	this._sql 		      = '';
	this._a_where         = new Array();
	this._evento		  = null;
	
	this.valoreValido = function(valore)
	{
		return typeof valore != 'undefined' && valore != null && valore != '';
	};
	
	this.setValueFieldQuery = function(field)
	{
		if(this.valoreValido(field))
			this._sql_field_value = field;
		else
			this._sql_field_value = '';
		
		this._sql = '';
	};
	
	this.setDescrFieldQuery = function(descr)
	{
		if(this.valoreValido(descr))
			this._sql_descr_value = descr;
		else
			this._sql_descr_value = '';
		
		this._sql = '';
	};
	
	this.setFromFieldQuery = function(from)
	{
		if(this.valoreValido(from))
			this._sql_from = from;
		else
			this._sql_from = '';
		
		this._sql = '';
	};
	
	this.setOrderQuery = function(order)
	{
		if(this.valoreValido(order))
			this._sql_order = order;
		else
			this._sql_order = '';
		
		this._sql = '';
	};
	
	this.setWhereBaseQuery = function(where)
	{
		if(this.valoreValido(where))
			this._sql_where_base = where;
		else
			this._sql_where_base = '';
		
		this._sql = '';
	};
	
	this.appendWhere = function(condizione, key_condizione)
	{
		if(this.valoreValido(key_condizione))
			if(condizione == '')
				this.removeWhere(key_condizione);
			else
				this._a_where[this.valoreValido(key_condizione) ? key_condizione:this._a_where.length] = condizione;
		
		this._sql = '';
	};
	
	this.attachWhere = function(condizione, key_condizione, operatore)
	{
		if(this.valoreValido(condizione) && this.valoreValido(key_condizione))
		{
			if(!this.valoreValido(condizione))
				operatore = ' and '
			else
				operatore = ' ' + operatore + ' ';
			
			if(typeof this._a_where[key_condizione] == 'undefined')
				this._a_where[key_condizione] = condizione;
			else
				this._a_where[key_condizione] += operatore + condizione;
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
				if(this._a_where[idx] != null && typeof this._a_where[idx] == 'string' && this.valoreValido(this._a_where[idx]))
					this._sql_where += (this._sql_where != '' ? ' and ':' ') + '(' + this._a_where[idx].toString() + ')';
			
			this._sql = "select '<OPTION value=\"' || " + this._sql_field_value + " || '\">' || " + this._sql_descr_value + " || '</OPTION>'";
			this._sql += ' from ' + this._sql_from;
			this._sql += this._sql_where_base != '' ? ' where ' + this._sql_where_base:'';
			
			if(this._sql_where != '')
				this._sql += (this._sql.toUpperCase().indexOf('WHERE') > 0 ? ' and ':'  where ') + this._sql_where;
			
			this._sql += this._sql_order != '' ? ' order by ' + this._sql_order:'';
		}
		
		return this._sql;
	};
	
	this.refreshList = function(condizione, key_condizione)
	{
		if(this._obj != null && typeof this._obj != 'undefined')
		{
			this.appendWhere(condizione, key_condizione);
			
			dwr.engine.setAsync(false);
			//alert(this.generateQuery());
			toolKitDB.getListResultData(this.generateQuery(), __valorizzaElenco);
			
			dwr.engine.setAsync(true);
			
			this.stopIntervallSearch();
			
			this.populateList(__a_temp);
		}
	};
	
	function startRefreshList()
	{
		_my_class.refreshList();
	};
	
	this.searchListRefresh = function(condizione, key_condizione)
	{
		if(this._obj != null && typeof this._obj != 'undefined')
		{
			this.stopIntervallSearch();
			this.appendWhere(condizione, key_condizione);
			this._evento = setTimeout(startRefreshList, 500);
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
		var html 			= elenco.toString().replace(/\,/g, '');
		var opt_click 		= this._obj.onclick;
		var opt_dblclick 	= this._obj.ondblclick;
		var opt_change 		= this._obj.onchange;
		var opt_oncontext	= this._obj.oncontextmenu;
		var attc 			= false;
		
		this._obj.options.outerHTML = this._obj.outerHTML.substr(0, this._obj.outerHTML.toUpperCase().indexOf('<OPTION') <= 0 ? this._obj.outerHTML.toUpperCase().indexOf('</SELECT'):this._obj.outerHTML.toUpperCase().indexOf('<OPTION')) + html + '</SELECT>';
		
		attc = this.attachElement(this._id);
		
		if(opt_click != null)
			this._obj.onclick = opt_click;
		
		if(opt_dblclick != null)
			this._obj.ondblclick = opt_dblclick;
		
		if(opt_change != null)
			this._obj.onchange = opt_change;
		
		if(opt_oncontext != null)
			this._obj.oncontextmenu = opt_oncontext;
	};
	
	this.attachElement = function(id)
	{
		if(this.valoreValido(id))
		{
			this._id  = id;
			this._obj = document.all[id];
			
			if(typeof this._obj == 'undefined')
				this._obj = document.getElementsByName(id);
			
			return this._obj != 'undefined';
		}
		else
			return false;
	};
	
	this.attachElement(id);
};