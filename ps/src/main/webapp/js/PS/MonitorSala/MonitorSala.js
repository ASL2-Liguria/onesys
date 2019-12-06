var username;

$(function(){
	NS_MONITOR.init();
	NS_MONITOR.setEvents();
});

var NS_MONITOR ={
		init : function(){
			username = home.baseUser.USERNAME;
			NS_MONITOR.initWkMonitor();			
		},
		setEvents : function(){
			
		},
		initWkMonitor : function() {
			if (!NS_MONITOR.WkMonitor) {
				$("div#divWkMonitor").height("300px");
				NS_MONITOR.WkMonitor = new WK({
					id : "PS_WK_MONITOR_SALA",
					container : "divWkMonitor",
					aBind : [ 'nome','cognome','provenienza','username' ],
					aVal : [ '%25','%25','%25',username]
				});
				NS_MONITOR.WkMonitor.loadWk();
			}
		},
		 setColorUrgenza : function(data, td){
		        switch (data.CODICE){
		            case 'ROSSO':
		                td.css({"background-color":"red", "text-align":"center"});
		                break;
		            case 'GIALLO':
		                td.css({"background-color":"yellow", "text-align":"center"});
		                break;
		            case 'VERDE':
		                td.css({"background-color":"green", "text-align":"center"});
		                break;
		            case 'BIANCO':
		                td.css({"text-align":"center"});
		                break;
		            default : break;
		        }
		        return data.CODICE;
		    }
};