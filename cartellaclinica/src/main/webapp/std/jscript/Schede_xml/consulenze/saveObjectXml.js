// JavaScript Document
//DEPRECATO, DA CANCELLARE POST AGGIORNAMENTO
saveXml = {
	initXml 	: '<?xml version="1.0"?><?xml-stylesheet type="text/xsl"?>',
	initialTag	: '<PAGINA><CAMPI>',
	closeTag	: '</CAMPI></PAGINA>',
	tagToRetrieve : ['id','type'],
	arrayObject :[],
	
	retrieveXml: function(obj,id){
		var ret = saveXml.initXml+saveXml.initialTag+saveXml.searchKeyCampo(obj,id)+saveXml.closeTag;
		return ret;
	},
	
		
	searchKeyCampo:function(obj,id){
		var ret = '';
		saveXml.arrayObject=[];
		obj.find('div#'+id).children().each(function(){
//        obj.children().each(function(){
			alert($(this).attr('id')+'\n'+$(this).attr('type')+'\n'+$(this)[0].nodeName);
			if ($(this)[0].nodeName =='LABEL'){
				objInput 			= $.extend(true,{}, label);
				objInput.key_campo 	= $(this).attr('id');
				objInput.type 		= $(this)[0].nodeName.toLowerCase();
				objInput.text       = $(this).text();
                objInput.cls        = $(this).attr('class');
				saveXml.arrayObject.push(objInput);
			}
            if ($(this)[0].nodeName =='INPUT' && ($(this).attr('type')=='text' || $(this).attr('type')=='checkbox' || $(this).attr('type')=='hidden')){
				objInput 			= $.extend(true,{}, input);
				objInput.key_campo 	= $(this).attr('id');
				objInput.type 		= $(this)[0].nodeName.toLowerCase();
				objInput.typeinput 	= $(this).attr('type');
				if ($(this).attr('type')=='checkbox')
					objInput.value		= $(this).attr('checked')==true?'S':'N';
				else
					objInput.value		= $(this).val();				
				saveXml.arrayObject.push(objInput);
			}

			if ($(this)[0].nodeName =='INPUT' && $(this).attr('type')=='radio'){
				var idRadio = $(this).attr('id');
				var result = $.grep(saveXml.arrayObject, function(e){ return e.key_campo == idRadio });
				if (result.length<1){
					objInput 			= $.extend(true,{}, radioSelect);
					objInput.key_campo 	= $(this).attr('id');
					objInput.type 		= $(this)[0].nodeName.toLowerCase();
					objInput.typeinput 	= $(this).attr('type');
					$(this).parent().find('input[type="radio"]').each(function(){
                        //alert($(this).val()+'  txt:'+$(this).text()+'   type:'+$(this).attr('type'));
						objInput.setOptionRadVal({'val':$(this).val(),'txt':$(this).attr('text'),'type':$(this).attr('type'),'check':$(this).attr('checked')==true?true:false});
					});
					saveXml.arrayObject.push(objInput);
				}
			}

			if ($(this)[0].nodeName =='SELECT'){
				objInput 			= $.extend(true,{}, radioSelect);
				objInput.key_campo 	= $(this).attr('id');
				objInput.type 		= $(this)[0].nodeName.toLowerCase();
				objInput.typeinput 	= $(this).attr('type');
				$(this).children().each(function(){
					objInput.setOptionRadVal({'val':$(this).val(),'txt':$(this).text(),'type':$(this)[0].nodeName.toLowerCase(),'check':$(this).attr('selected')==true?true:false});
				});
				saveXml.arrayObject.push(objInput);
			}
		});

		for (var i=0;i<saveXml.arrayObject.length;i++){
			ret +=saveXml.arrayObject[i].getXmlValue();
		}
		return ret;
	}
	
};

label = {
	key_campo :'',
	type : '',
	text:'',
    cls:'',
	getXmlValue:function(){
		return 	'<CAMPO KEY_CAMPO = "'+this.key_campo+'" '+ 
				'TYPE = "'+this.type+'" '+
				'TEXT = "'+this.text+'" '+
				'CLASS = "'+this.cls+'" '+
                '/>';
	}
};

input = {
	key_campo :'',
	type : '',
	typeinput:'',
	value:'',
	getXmlValue:function(){
		return 	'<CAMPO KEY_CAMPO = "'+this.key_campo+'" '+ 
				'TYPE = "'+this.type+'" '+
				'TYPEINPUT = "'+this.typeinput+'" '+
				'>'+this.value+'</CAMPO>';
	}
};

radioSelect = {
	key_campo :'',
	type : '',
	typeinput:'',
	radValAll:[],
	setOptionRadVal:function(val){
		this.radValAll.push(val);
	},
	
	getXmlValue:function(){
		var ret = 	'<CAMPO KEY_CAMPO = "'+this.key_campo+'" '+ 
					'TYPE = "'+this.type+'" '+
					'TYPEINPUT = "'+this.typeinput+'" '+
					'>'+this.getXmlRadio()+'</CAMPO>';
		
		return 	ret;
	},
	
	getXmlRadio:function(){
		var ret = '';
		for (var key in this.radValAll){
			if (this.radValAll[key].type == 'radio')
				if (this.radValAll[key].check)
					ret += '<OPTIONVAL CHECKED="true" VALUE="'+this.radValAll[key].val+' "TEXT="'+this.radValAll[key].txt+'"/>';
				else
					ret += '<OPTIONVAL VALUE="'+this.radValAll[key].val+'" TEXT="'+this.radValAll[key].txt+'"/>';	
			else
				if (this.radValAll[key].check)					
					ret += '<OPTIONVAL SELECTED="true" VALUE="'+this.radValAll[key].val+'" TEXT="'+this.radValAll[key].txt+'"/>';
				else	
					ret += '<OPTIONVAL VALUE="'+this.radValAll[key].val+'" TEXT="'+this.radValAll[key].txt+'"/>';
		}
		return ret;
	}
};