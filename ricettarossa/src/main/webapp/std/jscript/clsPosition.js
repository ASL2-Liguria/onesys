var clsPosition={
	get: function(obj)
		{
			alert(obj);
			this.curleft = this.curtop =  0;this.curwidth = obj.offsetWidth;this.curheight = obj.offsetHeight;	
			
			function getDocumentElement(obj){
				var objDocument=obj;do{objDocument = objDocument.parentNode;}while(objDocument.parentNode);return objDocument;
			}
			function getPositionInDocument(obj){
				this.left=this.top=0;if(obj.offsetParent){do{this.left+=obj.offsetLeft-obj.scrollLeft;this.top+=obj.offsetTop-obj.scrollTop;}while(obj=obj.offsetParent);}
			}

			var objIndicato=obj;
			var objDocument=objIndicato;

			//dell'oggetto originale calcolo la posizione relativa al proprio documento
			//a questo punto il nuovo oggetto di cui calcolare la posizione diventa il frame contenitore se il document è diverso
			//da quello contenente il dragdrop
			
			var objDaCalcolare = obj;
			var objDocument = getDocumentElement(objDaCalcolare);
			var pos;
			var continuaSuFrameSuperiore = true;

			do{

				pos=new getPositionInDocument(objDaCalcolare);
				this.curleft+=pos.left;
				this.curtop+=pos.top;
				
				continuaSuFrameSuperiore=(objDocument!=document);
				
				if(objDocument.parentWindow.frameElement!=null){
					objDaCalcolare = objDocument.parentWindow.frameElement;
					objDocument = getDocumentElement(objDaCalcolare);					
				}

			} while (continuaSuFrameSuperiore);
		}
}