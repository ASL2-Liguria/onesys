function initCarousel(){
	
	var collection;
	var i =0;
	var strToEval = "";
	try{
		// prendo la collection dei carousel
		collection = getElementsByAttribute(document.body, "*", "className", "stepcarousel");		
		for (i=0;i<collection.length;i++){
//			alert(collection[i].id);
			strToEval = "stepcarousel.setup({galleryid: '" + collection[i].id + "', beltclass: 'beltCarousel', panelclass: 'panelCarousel', autostep: {enable:false, moveby:1, pause:3000}, panelbehavior: {speed:300, wraparound:true, persist:true}, defaultbuttons: {enable: true, moveby: 2, leftnav: ['imagexPix/room/arrowl.png', -5, 20], rightnav: ['imagexPix/room/arrowr.png', -20, 20]}, 	statusvars: ['statusA', 'statusB', 'statusC'], contenttype: ['inline']})";
			eval (strToEval);
		}
		
	}
	catch(e){
		alert("initCarousel - Error: " + e.description);
	}
	
}

