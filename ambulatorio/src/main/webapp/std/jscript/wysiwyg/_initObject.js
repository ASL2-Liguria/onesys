// JavaScript Document
//<![CDATA[
	var W3
	window.addEvent('domready',function(){
		initW3();
		
		
	});

	
//]]>



	function initW3(){
		W3 = new wysiwyg({
			textarea: $('objReportControl').getElement('textarea'),
			buttons: ['strong','em','u','superscript','subscript',null,'ul','ol',null,'left', 'center', 'right', null, 'indent', 'outdent', null, 'h1', 'h2', 'h3', null,'toggle'],
			/*buttons: ['strong','em','u','superscript','subscript',null,'ul','ol',null,'left', 'center', 'right', null, 'indent', 'outdent', null, 'h1', 'h2', 'h3', null,'p'],*/				
			src:'_wysiwyg.html'
		} );
	}
