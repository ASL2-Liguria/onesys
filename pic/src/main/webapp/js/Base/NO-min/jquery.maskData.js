/**
*  Mask input Data, version 1.0
*  (c) 2012 Jacopo Brovida, El.co s.r.l
*
*  
*  For details: jacopo.brovida@elco.it
*
*  Last Review: 18/10/2012
*/

/* OPTIONS
* 			separatorIn: 	ex. "/" 
*			separatorOut: 	ex. "-"
*			formatIn: 		ex. "d m Y"
*			formatOut: 		ex. "m d Y"
*			disabled:		ex. false
*
*/
(function ($) {

String.prototype.prev=function(index){				
				return this.charAt((this.length-index)-1) ;
			}	
	
	function MaskData(el, options) {
		this.el = $(el);
		this.currentValue = this.el.val();
		this.disabled=false;
		this.options = {
			separatorIn: "/",
			separatorOut: "/",
			formatIn: "d m Y",
			formatOut: "d m Y",
			disabled:false
		};
		this.initialize();
		this.setOptions(options);
	}
	
	

	$.fn.maskData = function (options, optionName) {
		var elcoDataControl;	
		elcoDataControl = new MaskData(this.get(0) || $('<input />'), options);		
		return elcoDataControl;
	};
	
	
	MaskData.prototype = {

		initialize: function () {
			var me;
			me = this;		
			this.el.keyup(function (e) { me.onKeyPress(e); });	
			this.el.keydown(function (e) { me.onKeyDown(e); });	
			this.el.focusout(function(){me.onFocusOut();});
		},

		extendOptions: function (options) {
			$.extend(this.options, options);
		},

		setOptions: function (options) {
			var o = this.options;
			this.extendOptions(options);
			if (o.disabled) {
				this.disable();
			}
		},
		disable: function () {
			this.disabled = true;
			this.el.attr("readonly","true"); 
		},

		enable: function () {
			this.disabled = false;
			this.el.removeAttr("readonly"); 
			
		},
		onKeyPress: function (e) {
			if (this.disabled) {return; }
			// return will exit the function
			// and event will not be prevented
			switch (e.keyCode) {
				case 27: //KEY_ESC:
					this.el.val("");
					break;
				case 8: //KEY_ESC:
					return;
					break;	
				case 13: //ENTER	
					this.el.val(this.verifyData(this.el.val()));
				break;	
				case 37: //KEY_LEFT
					return;
					break;
				case 39: //KEY_RIGHT:
					return;
					break;
				default:
					this.el.val(this.maskInput(this.el.val()));
					if (this.el.val().length == 10) {
						this.el.val(this.verifyData(this.el.val()));
					}
					return;
			}
			e.stopImmediatePropagation();
			e.preventDefault();
		},
		onFocusOut:function(){
			this.el.val(this.verifyData(this.el.val()));
		},
		maskInput:function(text){
				var c=text.charAt(parseInt(text.length)-1);			
			switch(parseInt(text.length)){
				
				case 0:
					return text;
				break;
					
				case 1:
					return isNumber(text)?text:"";
				break;
				
				case 2:
					if(this.isSeparator(c) || isNumber(c)) {
						return text;
						}else{
							return text.substr(0,text.length-1);
							}
				break;
				
				case 3:
					if(isMoD(text)){
						
						if(isNumber(c)){
							return text.substr(0,text.length-1)+this.options.separatorIn+c;
						}else{
							return text.substr(0,text.length-1)+this.options.separatorIn;
							}
						}
					if(this.isSeparator(text.prev(1))){
						if(isNumber(c)){
							return text;
						}else{
							return text.substr(0,text.length-1)
							}
						}	
					//return this.isSeparator(c)?data:(isNumber(data)?data.substr(0,data.length-1)+"/"+c:data.substr(0,data.length-1)+"/");					
				break;
				
				case 4:
						if(this.isSeparator(c) && !this.isSeparator(text.prev(1))){
							return text;
						}
														
						if(isNumber(c) && isNumber(text.prev(1))){
							return text;
						}
						if(this.isSeparator(text.prev(1))){
							if(isNumber(c)){
								return text;
							}						
						}
						
						return text.substr(0,text.length-1);									
				break;
				case 5:
					if(isMoD(text)){
						
						if(isNumber(c)){
							return text.substr(0,text.length-1)+this.options.separatorIn+c;
						}else{
							return text.substr(0,text.length-1)+this.options.separatorIn;
							}
						}
					if(this.isSeparator(text.prev(1))){
							if(isNumber(c)){
								return text;
							}						
						}
					if(this.isSeparator(c) && !this.isSeparator(text.prev(1)) ){
							return text;
						}
					if(isNumber(c) && isNumber(text.prev(1))){
							return text;
						}		
					return text.substr(0,text.length-1);	
				
				break;
				case 6:
					if(isMoD(text)){
						
						if(isNumber(c)){
							return text.substr(0,text.length-1)+this.options.separatorIn+c;
						}else{
							return text.substr(0,text.length-1)+this.options.separatorIn;
							}
						}
					if(this.isSeparator(text.prev(1))){
							if(isNumber(c)){
								return text;
							}						
						}
					if(this.isSeparator(c) && !this.isSeparator(text.prev(1)) ){
							return text;
						}
					if(isNumber(c) && isNumber(text.prev(1))){
							return text;
						}		
					return text.substr(0,text.length-1);	
				
				break;
				case 7:
					if(isNumber(c)){
						return text;
					}
					return text.substr(0,text.length-1);		
				break;
				case 8:
					if(isNumber(c)){
						return text;
					}
					return text.substr(0,text.length-1);		
				break;
				case 9:
					if(isNumber(c)){
						return text;
					}
					return text.substr(0,text.length-1);		
				break;
				case 10:
					if(isNumber(c)){
						return text;
					}
					return text.substr(0,text.length-1);		
				break;
				default:
				return text.substr(0,text.length-1);
				break;
				
				}
			},
		onKeyDown: function (e) {
			if (this.disabled) {return; }
			switch (e.keyCode) {
				case 9: //KEY_TAB:
					this.el.val(this.verifyData(this.el.val()));
					
				break;	
			}
		},
		isSeparator:function (c){
			//alert("huhu");
			var separator=this.options.separatorIn;
			//alert(separator);
			if (separator.localeCompare(c)==0)
			{
				return true;
			}
			return false;
		},	
		verifyData:function(data){
			try{
				//alert(this.options.separator);
						var splitData=data.split(this.options.separatorIn);
						
						//alert(splitData[0]+"*"+splitData[1]+"*"+splitData[2]);
						
						if(splitData[0].length==1){
							splitData[0]="0"+splitData[0]
							}
						if(splitData[1].length==1){
							splitData[1]="0"+splitData[1]
							}
						if(splitData[2].length==2){
							var currYears=new Date().getFullYear();
							
							if(parseInt(splitData[2])>parseInt(currYears.toString().substring(2))){
									splitData[2]="19"+splitData[2];
								}else{
									splitData[2]="20"+splitData[2];
									}			
							}
							anno = parseInt(splitData[2],10);
							mese = parseInt(splitData[1],10);
							giorno = parseInt(splitData[0],10);
							
							var Data=new Date(anno, mese-1, giorno);
							if(Data.getFullYear()==anno && Data.getMonth()+1==mese && Data.getDate()==giorno){
								$("#h-"+this.el.attr("id")).val(splitData[2]+splitData[1]+splitData[0]);
								return splitData[0]+this.options.separatorOut+splitData[1]+this.options.separatorOut+splitData[2];
								
							}else{
								$("#h-"+this.el.attr("id")).val("");
								return "";
							}		
			}catch(Exception){
				//alert("Impossibile Convertire");
				$("#h-"+this.el.attr("id")).val("");
				return "";
			}		
		}
	};
	
	
	function isMoD(data){ //is Month or Day??
	//alert(data.prev(1)+"-"+data.prev(2));
		if(isNumber(data.prev(1)) && isNumber(data.prev(2)))
		{
			return true;
		}	
		return false;
	}
	
	function isNumber(c){	
			var espressione = /[0-9]/;
			if (espressione.test(c))
			{
				return true;
			}
			return false;
	}

} (jQuery));