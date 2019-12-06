/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// JavaScript Document
NS_SAVE_CONSOLLE_XML = {
	initXml 	: '<?xml version="1.0" encoding="ISO-8859-1"?><?xml-stylesheet type="text/xsl"?>',
	initialTag	: '<PAGINA><CAMPI>',
	closeTag	: '</CAMPI></PAGINA>',
	tagToRetrieve : ['id','type'],
	arrayObject :[],
	
	retrieveXml: function(obj,objTxt,type){
		var ret = NS_SAVE_CONSOLLE_XML.initXml+NS_SAVE_CONSOLLE_XML.initialTag+NS_SAVE_CONSOLLE_XML.searchKeyCampo(obj,objTxt,type)+NS_SAVE_CONSOLLE_XML.closeTag;
		return ret;
	},
	
		
	searchKeyCampo:function(obj,txt,type){
		var ret = '';
		NS_SAVE_CONSOLLE_XML.arrayObject=[];
        var objTypecontainer = 'div';
        var objType = typeof type=='undefined'?objTypecontainer+'#'+txt:objTypecontainer+'.'+txt;
		obj.find(objType).children().each(function(){
        //obj.children().each(function(){      
			if ($(this)[0].nodeName =='LABEL'){
				objInput 			= $.extend(true,{}, label);
				objInput.key_campo 	= $(this).attr('id');
				objInput.type 		= $(this)[0].nodeName.toLowerCase();
				objInput.text       = $(this).text();
                objInput.cls        = $(this).attr('class');
				NS_SAVE_CONSOLLE_XML.arrayObject.push(objInput);
			}
            if ($(this)[0].nodeName =='INPUT' && ($(this).attr('type')=='text' || $(this).attr('type')=='checkbox' || $(this).attr('type')=='hidden')){
                objInput 			= $.extend(true,{}, input);
				objInput.key_campo 	= $(this).attr('id');
				objInput.type 		= $(this)[0].nodeName.toLowerCase();
				objInput.typeinput 	= $(this).attr('type');
                objInput.text       = $(this).attr('text');
				if ($(this).attr('type')=='checkbox'){
					objInput.value		= $(this).attr('checked')==true?'S':'N';
                }
				else{
					objInput.value		= $(this).val();				
                }
				NS_SAVE_CONSOLLE_XML.arrayObject.push(objInput);
			}

/*            if ($(this)[0].nodeName =='TEXTAREA' ){
				objInput 			= $.extend(true,{}, textarea);
				objInput.key_campo 	= $(this).attr('id');
				objInput.type 		= $(this)[0].nodeName.toLowerCase();
				objInput.typeinput 	= $(this).attr('type');
				objInput.value		= tinyMCE.get($(this).attr('id')).getContent();
				NS_SAVE_CONSOLLE_XML.arrayObject.push(objInput);
			}
*/
			if ($(this)[0].nodeName =='INPUT' && $(this).attr('type')=='radio'){

				var idRadio = $(this).attr('id');
				if(idRadio==''){
					idRadio=$(this).attr('name');
				}
				var result = $.grep(NS_SAVE_CONSOLLE_XML.arrayObject, function(e){ return e.key_campo == idRadio });
				if (result.length<1){
					objInput 			= $.extend(true,{}, radioSelect);
					objInput.key_campo 	= idRadio;
					objInput.type 		= $(this)[0].nodeName.toLowerCase();
					objInput.typeinput 	= $(this).attr('type');
					$(this).parent().find('input[type="radio"]').each(function(){
						objInput.setOptionRadVal({'val':$(this).val(),'txt':$(this).attr('text'),'type':$(this).attr('type'),'check':$(this).attr('checked')==true?true:false});
					});
					NS_SAVE_CONSOLLE_XML.arrayObject.push(objInput);
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
				NS_SAVE_CONSOLLE_XML.arrayObject.push(objInput);
			}
		});

		for (var i=0;i<NS_SAVE_CONSOLLE_XML.arrayObject.length;i++){
			ret +=NS_SAVE_CONSOLLE_XML.arrayObject[i].getXmlValue();
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
    text:'',
	getXmlValue:function(){
		return 	'<CAMPO KEY_CAMPO = "'+this.key_campo+'" '+ 
				'TYPE = "'+this.type+'" '+
				'TYPEINPUT = "'+this.typeinput+'" '+
				'TEXT = "'+this.text+'" '+
				'>'+this.value+'</CAMPO>';
	}
};

/*textarea = {
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
*/

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
					ret += '<OPTIONVAL CHECKED="true" VALUE="'+this.radValAll[key].val+'" TEXT="'+this.radValAll[key].txt+'"/>';
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

