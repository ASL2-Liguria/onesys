$(function()
{
	NS_FAMILIARITA.init();
	NS_FAMILIARITA.setEvents();
});

var NS_FAMILIARITA = {
		
		init: function()
		{
			$("#divButton").append(NS_FAMILIARITA.createButtons());

			$("#cmbFamiliarita").html(parent.$("#cmbFamiliaritaResult").html());
		},
		
		assignList: function(){

			if($('#cmbMalattie option:selected').length>0)
			{
				$('#cmbParenti option:selected').each(function(){

					var optgroup=$("#cmbFamiliarita").find('optgroup[value="'+$(this).val()+'"]');

					if(optgroup.length==0) {
						optgroup=$('<OPTGROUP label="'+$(this).text()+'" value='+$(this).val()+' />');
						$("#cmbFamiliarita").append(optgroup);
					}

					$('#cmbMalattie option:selected').each(function(){
						
						if ( optgroup.find("option[value='"+$(this).val()+"']").length > 0 )
						{
							home.NOTIFICA.warning({
								message: "Malattia gia' associata, impossibile associarla due volte per la stessa parentela",
								title: "Attenzione"
							});
						} 
						else if ($(this).text()!='') 
						{
							var option = $('<option value='+$(this).val()+'>'+$(this).text()+'</option>');
							optgroup.append(option);
						} 
						
					});
				});
			}
			else
			{
				home.NOTIFICA.warning({
		            message: "Prego, associare una malattia",
		            title: "Attenzione"
				});
			}
		},
		
		unassignList: function(){
			$('#cmbFamiliarita option:selected').each(function(){
				$("#cmbFamiliarita option[value='"+ $(this).val() +"']").remove();
			});
			$("#cmbFamiliarita").find("optgroup").each(function(){
				if($(this).find("option").length==0)
					$(this).remove();
			});
		},
		
		setEvents: function(){
			$("#idButAddOne").on("click", NS_FAMILIARITA.assignList );
			$("#idButRemoveOne").on("click", NS_FAMILIARITA.unassignList );
			$("#idButRemoveAll").click(function(){ $("#cmbFamiliarita optgroup").remove(); });
		},	
		
		createButtons : function (){
			var buttons=[];
			buttons.push($("<a/>").attr({href:"#",id:"idButAddOne"}).addClass("button").append($("<span/>").addClass("butAddOne").html("+")));
			buttons.push($("<a/>").attr({href:"#",id:"idButRemoveOne"}).addClass("button").append($("<span/>").addClass("butRemoveOne").html("-")));
			buttons.push($("<a/>").attr({href:"#",id:"idButRemoveAll"}).addClass("button").append($("<span/>").addClass("butRemoveAll").html("Rimuovi Tutti")));
			return buttons;
		}
};




