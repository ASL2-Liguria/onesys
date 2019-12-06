$(function(){

	NS_GRAFICI.init();
	
});

var NS_GRAFICI = {
		graphPeso24Mesi:null,
		graphLunghezza24Mesi:null,
		graphBMI24Mesi:null,
		graphCirCran24Mesi:null,
		graphPeso19Anni:null,
		graphAltezza19Anni:null,
		graphBMI19Anni:null,
		percentili: {},
		valori: {},
		init:function(){

			NS_GRAFICI.setEvents();

			if (home.ASSISTITO.ETA < 2)
				$("#li-tab24Mesi").trigger("click");
			else				
				$("#li-tab19Anni").trigger("click");
		},
		
		setEvents:function(){

			$("div#tabMain li").on("click", function() {
				switch($(this).data("tab")) {
					case 'tab24Mesi':
						if (NS_GRAFICI.graphPeso24Mesi == null) {
							NS_GRAFICI.initPeso24Mesi();
							NS_GRAFICI.initLunghezza24Mesi();
							NS_GRAFICI.initBMI24Mesi();
							NS_GRAFICI.initCirCran24Mesi();
						} 	break;
					case 'tab19Anni':
						if (NS_GRAFICI.graphPeso19Anni == null) {
							NS_GRAFICI.initPeso19Anni();
							NS_GRAFICI.initAltezza19Anni();
							NS_GRAFICI.initBMI19Anni();
						}	break;
					default:
						logger.error("NS_GRAFICI.setEvents :: case not found");
				}
			});
			
			$(".butStampa").on("click", NS_GRAFICI.print );
		},
		
		initPeso24Mesi : function () {
			var 
				series = [this.getValori("GRAFICI.PESO", 365),
				          this.getPercentile("PESO","P3"),
			              this.getPercentile("PESO","P10"),
			              this.getPercentile("PESO","P25"),
			              this.getPercentile("PESO","P50"),
			              this.getPercentile("PESO","P75"),
			              this.getPercentile("PESO","P90"),
			              this.getPercentile("PESO","P97")
			              ],
			    options = { 
					title:'Peso nei 24 mesi', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1}  
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
					axes: {
						xaxis : {
			        		label:'eta\' [anni]',
			        		min:0,
			        		max:2,
			        		numberTicks:3,
			        		show:false
			        	},
			        	x2axis : {
			        		label:'eta\' [mesi]',
			        		min:0,
			        		max:24,
			        		numberTicks:25,
			        		show : true
			        	},
						yaxis : {
							label:'peso [Kg]',
							min:0,
							max:16,
							numberTicks:17
						}
					},
			        legend: { show:true, location: 'se' }
			};
			NS_GRAFICI.graphPeso24Mesi = $.jqplot("divPeso24Mesi",  series, options);
			NS_GRAFICI.addResizers($("#divOuterPeso24Mesi"),NS_GRAFICI.graphPeso24Mesi);
		},
		initLunghezza24Mesi : function () {
			var series = [this.getValori("GRAFICI.ALTEZZA", 365),
			              this.getPercentile("ALTEZZA","P3"),
			              this.getPercentile("ALTEZZA","P10"),
			              this.getPercentile("ALTEZZA","P25"),
			              this.getPercentile("ALTEZZA","P50"),
			              this.getPercentile("ALTEZZA","P75"),
			              this.getPercentile("ALTEZZA","P90"),
			              this.getPercentile("ALTEZZA","P97")
			              ];
			var options = { 
					title:'Lunghezza nei 24 mesi', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1}  
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
			        axes: {
			        	xaxis : {
			        		label:'eta\' [anni]',
			        		min:0,
			        		max:2,
			        		numberTicks:3,
			        		show:false
			        	},
			        	x2axis : {
			        		label:'eta\' [mesi]',
			        		min:0,
			        		max:24,
			        		numberTicks:25,
			        		show : true
			        	},
			        	yaxis : {
			        		label:'lunghezza [cm]',
			        		min:37,
			        		max:95,
			        		numberTicks:30
			        	}
			        },
			        legend: { show:true, location: 'se' }
			};
			
			NS_GRAFICI.graphLunghezza24Mesi = $.jqplot("divLunghezza24Mesi",  series, options);
			NS_GRAFICI.addResizers($("#divOuterLunghezza24Mesi"),NS_GRAFICI.graphLunghezza24Mesi);
		},
		initBMI24Mesi : function () {
			var series = [this.getValori("GRAFICI.BMI", 365),
			              this.getPercentile("BMI","P3"),
			              this.getPercentile("BMI","P10"),
			              this.getPercentile("BMI","P25"),
			              this.getPercentile("BMI","P50"),
			              this.getPercentile("BMI","P75"),
			              this.getPercentile("BMI","P90"),
			              this.getPercentile("BMI","P97")];
			var options = { 
					title:'B.M.I. nei 24 mesi', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1}  
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
			        axes: {
			        	xaxis : {
			        		label:'eta\' [anni]',
			        		min:0,
			        		max:2,
			        		numberTicks:3,
			        		show:false
			        	},
			        	x2axis : {
			        		label:'eta\' [mesi]',
			        		min:0,
			        		max:24,
			        		numberTicks:25,
			        		show : true
			        	},
			        	yaxis : {
			        		label:'B.M.I.',
			        		min:10,
			        		max:50,
			        		numberTicks:21
			        	}
			        },
			        legend: { show: false, location: 'se' }
			};
			
			NS_GRAFICI.graphBMI24Mesi = $.jqplot("divBMI24Mesi",  series, options);
			NS_GRAFICI.addResizers($("#divBMI24Mesi"),NS_GRAFICI.graphBMI24Mesi);
		},
		initCirCran24Mesi : function () {
			var series = [this.getValori("GRAFICI.CIRCONFERENZA_CRANICA", 365),
			              this.getPercentile("CIRC_CRANICA","P3"),
			              this.getPercentile("CIRC_CRANICA","P10"),
			              this.getPercentile("CIRC_CRANICA","P25"),
			              this.getPercentile("CIRC_CRANICA","P50"),
			              this.getPercentile("CIRC_CRANICA","P75"),
			              this.getPercentile("CIRC_CRANICA","P90"),
			              this.getPercentile("CIRC_CRANICA","P97")
			              ];
			var options = { 
					title:'Circonferenza cranica nei 24 mesi', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1} 
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
			        axes: {
			        	xaxis : {
			        		label:'eta\' [anni]',
			        		min:0,
			        		max:2,
			        		numberTicks:3,
			        		show:false
			        	},
			        	x2axis : {
			        		label:'eta\' [mesi]',
			        		min:0,
			        		max:24,
			        		numberTicks:25,
			        		show : true
			        	},
			        	yaxis : {
			        		label:'circonferenza cranica [cm]',
			        		min:24,
			        		max:57,
			        		numberTicks:34
			        	}
			        },
			        legend: { show:true, location: 'se' }
			};
			
			NS_GRAFICI.graphCirCran24Mesi = $.jqplot("divCirCran24Mesi",  series, options);
			NS_GRAFICI.addResizers($("#divOuterCirCran24Mesi"),NS_GRAFICI.graphCirCran24Mesi);
		},
		initPeso19Anni : function () {
			var series = [this.getValori("GRAFICI.PESO", 365),
			              this.getPercentile("PESO","P3"),
			              this.getPercentile("PESO","P10"),
			              this.getPercentile("PESO","P25"),
			              this.getPercentile("PESO","P50"),
			              this.getPercentile("PESO","P75"),
			              this.getPercentile("PESO","P90"),
			              this.getPercentile("PESO","P97")
			              ];
			var options = { 
					title:'Peso nei 19 anni', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1} 
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
					axes: {
						xaxis : {
							label:'eta\' [anni]',
							min:0,
							max:18,
							numberTicks:19
						},
						yaxis : {
							label:'peso [Kg]',
							min:0,
							max:120,
							numberTicks:25
						}
					},
					legend: { show:true, location: 'se' }
			};
			
			NS_GRAFICI.graphPeso19Anni = $.jqplot("divPeso19Anni",  series, options);
			NS_GRAFICI.addResizers($("#divOuterPeso19Anni"),NS_GRAFICI.graphPeso19Anni);
		},
		initAltezza19Anni : function () {
			var series = [this.getValori("GRAFICI.ALTEZZA", 365),
			              this.getPercentile("ALTEZZA","P3"),
			              this.getPercentile("ALTEZZA","P10"),
			              this.getPercentile("ALTEZZA","P25"),
			              this.getPercentile("ALTEZZA","P50"),
			              this.getPercentile("ALTEZZA","P75"),
			              this.getPercentile("ALTEZZA","P90"),
			              this.getPercentile("ALTEZZA","P97")
			              ];
			var options = { 
					title:'Altezza nei 19 anni', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1} 
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
			        axes: {
			        	xaxis : {
			        		label:'eta\' [anni]',
			        		min:0,
			        		max:18,
			        		numberTicks:19
			        	},
			        	yaxis : {
			        		label:'altezza [cm]',
			        		min:0,
			        		max:210,
			        		numberTicks:22
			        	}
			        },
			        legend: { show:true, location: 'se' }
			};
			
			NS_GRAFICI.graphAltezza19Anni = $.jqplot("divAltezza19Anni",  series, options);
			NS_GRAFICI.addResizers($("#divOuterAltezza19Anni"),NS_GRAFICI.graphAltezza19Anni);
		},
		initBMI19Anni : function () {
			var series = [this.getValori("GRAFICI.BMI", 365),
			              this.getPercentile("BMI","P3"),
			              this.getPercentile("BMI","P10"),
			              this.getPercentile("BMI","P25"),
			              this.getPercentile("BMI","P50"),
			              this.getPercentile("BMI","P75"),
			              this.getPercentile("BMI","P90"),
			              this.getPercentile("BMI","P97")];
			var options = { 
					title:'B.M.I. nei 19 anni', 
					seriesColors: ["black", "red", "yellow", "green", "gray", "pink", "orange", "violet"],
					series:[ 
					        {label:'rilevazioni',showMarker:true, pointLabels: { show:true },lineWidth:3 },
					        {label:'3o centile',showMarker:false,lineWidth:1}, 
					        {label:'10mo centile',showMarker:false,lineWidth:1},
					        {label:'25mo centile',showMarker:false,lineWidth:1},
					        {label:'50mo centile',showMarker:false,lineWidth:1},
					        {label:'75mo centile',showMarker:false,lineWidth:1},
					        {label:'90mo centile',showMarker:false,lineWidth:1}, 
					        {label:'97mo centile',showMarker:false,lineWidth:1}  
					        ],
			        axesDefaults: {
			            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			        },
			        axes: {
			        	xaxis : {
			        		label:'eta\' [anni]',
			        		min:0,
			        		max:18,
			        		numberTicks:19
			        	},
			        	yaxis : {
			        		label:'B.M.I.',
			        		min:10,
			        		max:50,
			        		numberTicks:21
			        	}
			        },
			        legend: { show: false, location: 'se' }
			};
			
			NS_GRAFICI.graphBMI19Anni = $.jqplot("divBMI19Anni",  series, options);
			NS_GRAFICI.addResizers($("#divOuterBMI19Anni"),NS_GRAFICI.graphBMI19Anni);
		},
		getValori : function (pTipo, pConversione) 
		{
			var arValori = [];
			var arCoord = [];
			if (typeof NS_GRAFICI.valori[pTipo]=='undefined') 
			{
				dwr.engine.setAsync(false);
				toolKitDB.getResultDatasource(pTipo,"MMG_DATI",{ iden_anag: home.ASSISTITO.IDEN_ANAG, iden_med: home.baseUser.IDEN_PER, data_ini : "19000101", data_fine: "29990101"},null,function(resp){
					arValori = resp;
				});
				if (arValori.length==0) 
				{
					arValori.push({"GIORNI": -1, "VALORE" :-1});
				}
				dwr.engine.setAsync(true);
				NS_GRAFICI.valori[pTipo] = arValori;
			}
			else 
			{
				arValori = NS_GRAFICI.valori[pTipo];
			}
			for (var i = 0; i<arValori.length; i++)
			{
				arCoord.push([arValori[i]["GIORNI"]/pConversione,arValori[i]["VALORE"]]);	
			}

			return arCoord;
			
		},
		
		loadPercentili: function(pTipo) 
		{
			var arPerc1 = [], arPerc2 = [],arPerc3 = [],arPerc4 = [],arPerc5 = [],arPerc6 = [],arPerc7 = [];
			dwr.engine.setAsync(false);
			toolKitDB.getResultDatasource("GRAFICI.PERCENTILE","MMG_DATI",{tipo:pTipo, sesso:home.ASSISTITO.SESSO},null,function(resp){
				$.each(resp,function(k,v){
					arPerc1.push([v["ETA"],v["P3"]]);				
					arPerc2.push([v["ETA"],v["P10"]]);				
					arPerc3.push([v["ETA"],v["P25"]]);				
					arPerc4.push([v["ETA"],v["P50"]]);				
					arPerc5.push([v["ETA"],v["P75"]]);				
					arPerc6.push([v["ETA"],v["P90"]]);				
					arPerc7.push([v["ETA"],v["P97"]]);				
				});
			});
			dwr.engine.setAsync(true);
			NS_GRAFICI.percentili[pTipo] = {
					P3 : arPerc1,
					P10 : arPerc2,
					P25 : arPerc3,
					P50 : arPerc4,
					P75 : arPerc5,
					P90 : arPerc6,
					P97 : arPerc7
			};
		},
		
		getPercentile: function(pTipo,pPercentile) 
		{
			if (typeof NS_GRAFICI.percentili[pTipo]=='undefined') 
				NS_GRAFICI.loadPercentili(pTipo);
			
			return NS_GRAFICI.percentili[pTipo][pPercentile];
		},
		
		getPercentileOld: function(pTipoGrafico, pRange, pCurva, pSesso) {
			if (typeof NS_GRAFICI.percentili[pTipoGrafico+"#"+pRange+"#"+pCurva+"#"+pSesso]=='undefined') 
			{
				var arPercentile = [];
				dwr.engine.setAsync(false);
				toolKitDB.getResultDatasource("GRAFICI.PERCENTILE","MMG_DATI",{tipo_grafico:pTipoGrafico,range:pRange,curva:pCurva,sesso:pSesso},null,function(resp){
					$.each(resp,function(k,v){
						arPercentile.push([v["COORD_X"],v["COORD_Y"]]);				
					});
				});
				dwr.engine.setAsync(true);
				NS_GRAFICI.percentili[pTipoGrafico+"#"+pRange+"#"+pCurva+"#"+pSesso] = arPercentile;
				return arPercentile;
			} else 
			{
				return NS_GRAFICI.percentili[pTipoGrafico+"#"+pRange+"#"+pCurva+"#"+pSesso];
			}
		},
		addResizers: function(divContainer, plot) {
			var 
				iconResizeFull	= $( document.createElement('i') ).addClass('icon-resize-full-1').attr('title', 'Espandi').on("click",
					function() { 
						$(this).hide();
						divContainer.siblings().hide();
						divContainer.find(".icon-resize-small-1").show();
						divContainer.width("98%").height($(".contentTabs").height() - 15);
						plot.replot({resetAxes:false});
						
					}),
			
				iconResizeSmall	= $( document.createElement('i') ).addClass('icon-resize-small-1').attr('title', 'Restringi').on("click",
					function() { 
						$(this).hide();
						divContainer.siblings().show();
						divContainer.find(".icon-resize-full-1").show();
						var pWidth = "49%";//Math.floor( 100 / ( divContainer.siblings().length / 2 + 1 ) ) - 1;  
						divContainer.width(pWidth+"%").height("");
						plot.replot({resetAxes:false});
					});
			divContainer.prepend(iconResizeFull,iconResizeSmall);
		},
		
		print: function() {
			
			
			var newWindow = window.open();
			newWindow.document.write("<html><head><style>img { margin: 15px; width: 45%;}</style></head><body><center><h2>"+home.ASSISTITO.NOME_COMPLETO+"</h2></center><div id='grafici'></div></body></html>");
			newWindow.document.close();
			
			if ($("#li-tab24Mesi").hasClass("tabActive")) {
				
//				var peso24Mesi = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divPeso24Mesi').jqplotToImageStr({}));
//				var lunghezza24Mesi = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divLunghezza24Mesi').jqplotToImageStr({}));
//				var BMI24Mesi = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divBMI24Mesi').jqplotToImageStr({}));
//				var cirCran24Mesi = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divCirCran24Mesi').jqplotToImageStr({}));
				$("#grafici", newWindow.document).append("<img src='" + $('#divPeso24Mesi').jqplotToImageStr({}) + "' />");
				$("#grafici", newWindow.document).append("<img src='" + $('#divLunghezza24Mesi').jqplotToImageStr({}) + "' />");
				$("#grafici", newWindow.document).append("<img src='" + $('#divBMI24Mesi').jqplotToImageStr({}) + "' />");
				$("#grafici", newWindow.document).append("<img src='" + $('#divCirCran24Mesi').jqplotToImageStr({}) + "' />");
			} else {
//				var peso19Anni = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divPeso19Anni').jqplotToImageStr({}));
//				var altezza19Anni = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divAltezza19Anni').jqplotToImageStr({}));
//				var BMI19Anni = $('<img/>'/*, {style : "width: 100%"}*/).attr('src', $('#divBMI19Anni').jqplotToImageStr({}));
				$("#grafici", newWindow.document).append("<img src='" + $('#divPeso19Anni').jqplotToImageStr({}) + "' />");
				$("#grafici", newWindow.document).append("<img src='" + $('#divAltezza19Anni').jqplotToImageStr({}) + "' />");
				$("#grafici", newWindow.document).append("<img src='" + $('#divBMI19Anni').jqplotToImageStr({}) + "' />");
			}
		}
		
		
};