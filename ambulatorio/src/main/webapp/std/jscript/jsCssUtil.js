// JavaScript Document

function CSSRule(selText) { 
        for(i = 0; i < document.styleSheets.length;i++) { 
                var st = document.styleSheets(i); 
                for (ir = 0; ir < st.rules.length; ir++) { 
								//alert("ir: "+st.rules(ir).selectorText);				
                        if (st.rules(ir).selectorText == selText) { 
                                return st.rules(ir); 
                        } 
                } 
        } 
} 
/*

	for (var k=0;k<document.styleSheets.length;k++){
		for (var j=0;j<document.styleSheets[k].rules.length;j++){
			if (document.styleSheets[k].rules[j].selectorText ==".contentFeto_0"){
				document.styleSheets[k].rules[j].style.backgroundColor = "#FFFFF0";
			}
		}
	}*/