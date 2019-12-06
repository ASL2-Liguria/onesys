<#--
* LibHtml
* Library to output HTML tags
-->

<#--
							*******************************************************
							*                  Elementi CHECK                     *
							*L'elemento base è divCheck che viene richiamato      *
							*per costruire gli altri elementi più complessi       *
							*******************************************************
-->
	<#--
		divCheck prende in entrata il risultato di una query con parametri (VALUE , DESCR).
		esempio:  
		<@lib.divCheck idCheck="idCheck" option=dati_salvati.RisultatoQuery.getMatrixData() colorClass="rosso" dataColSave="DATI" configPlugin="{width:150,ctrl:false}" >
		- idCheck ***PARAMETRO OBBLIGATORIO***** => E' l'id che viene attribuito all'elemento divCheck creato(univoco).
		- option ***PARAMETRO OBBLIGATORIO***** => E' dove vengono caricati i dati per riempire il check. Con la funzione 
					getMatrixData viene caricato nel check il valore di RisultatoQuery. RisultatoQuery contiene appunto, 
					il risultato della query che è,	tramite il file data@1.xml della relativa pagina, dichiarata nel relativo file query_xxx.xml.
		- colorClass => Se viene valorizzato inserisce una classe aggiuntiva al check.
		- dataColSave => Se viene valorizzato inserisce un data-col-save, come nel nostro configuratore.
		- configPlugin => Se inserito funziona come quello del nostro configuratore. 
						Ad esempio = {width:300,ctrl:false}, per altri valori vedere: fenix\web\js\Base\NO-min\Check.js, fenix\src\sdj\extension\extCheck.java 
	-->
	<#macro divCheck idCheck option colorClass="" dataColSave="" configPlugin="">
	    <div class="CheckBox" id="${idCheck}">
	        <#assign idInput = 'h-${idCheck}'>
	        <#assign valore = '${(dati_salvati[idInput].getValue())!""}'>
	            <input name="${idCheck}" type="hidden" value="${valore}" data-col-save="${dataColSave}" id="h-${idCheck}"/>
	        <#list option as opt>
	            <div data-value="${opt.VALUE}" class="CBpuls CBcolorDefault ${colorClass}<#if valore ='${opt.VALUE}'>CBpulsSel</#if>" title="${opt.DESCR}" id="${idCheck}_${opt.VALUE}">
	                <i></i>
	                <span>${opt.DESCR}</span>
	            </div>
	        </#list>
	        <script>
	            var ${idCheck};
	            SCRIPT_PLUGIN.push("${idCheck} = $('#${idCheck}').CheckBox(${configPlugin});");
	            SCRIPT_PLUGIN.push("$('#${idCheck}').DisableSelection();");
	        </script>
	    </div>
	</#macro>
	<#--



	-->
	<#macro fldCheckModuli idTable option  option2  dataColSave="" configPlugin="">
		<#if !option2?is_string>
			<#list option2 as tipo>
            <fieldset class="fldCampi">
                <legend>${tipo.DESCRIZIONE}</legend>
            		<table class="campi tblCheckModuli_${tipo.CODICE_DECODIFICA}" id="${idTable}_${tipo.CODICE_DECODIFICA}">
                        <input name="${idTable}" type="hidden" value="" data-col-save="${dataColSave}" id="h-${idTable}"/>
						<#if !option?is_string>
							<#list option as opt>
								<#if opt.TIPO = tipo.CODICE_DECODIFICA>
									<tr class="trCheckModuli">
										<td class="tdCheck tdModulo">
											<div data-value="${opt.KEY_SCHEDA}" data-n_copie_f="${opt.N_COPIE_F}" data-n_copie="${opt.N_COPIE}" data-compilabile="${opt.COMPILABILE}" data-cancellabile="${opt.CANCELLABILE}" data-fnc_cancella="${opt.FNC_CANCELLA}" data-funzione="${opt.FUNZIONE}" data-parametri="${opt.NOME_REPORT}" data-key_scheda="${opt.KEY_SCHEDA}" data-tipo="${opt.TIPO}" class="CBpuls CBcolorDefault" title="${opt.DESCRIZIONE}" id="${idTable}_${opt.CODICE}">
												<i></i>
												<span>${opt.DESCRIZIONE}</span>
											</div>

										</td>
										<td class="tdFunzioni">
											<span class="spanOpen">
											</span>
											<span class="spanWarning">
											</span>
											<span class="spanError">
											</span>
                                                                                        <span class="spanDelete">
											</span>
										</td>
										<#if opt.DA_INVIARE = 'S'>
											<@lib.tdLbl id="lblDataInvio_${opt.KEY_SCHEDA}" value="Data Invio">
											</@lib.tdLbl>
											<td class="tdText tdDataInvio INVIO_${opt.NOME_REPORT}">
												<@lib.inputText idText="txtDataInvio" readOnly="S">
												</@lib.inputText>
											</td>
										<#else>
                                            <td class="tdLbl " id="lblDataStampa_${opt.KEY_SCHEDA}">
											</td>
                                            <td class="tdText tdDataInvio_${opt.KEY_SCHEDA} ">
											</td>
										</#if>
										<@lib.tdLbl id="lblDataStampa_${opt.KEY_SCHEDA}" value="Data Stampa">
										</@lib.tdLbl>
										<td class="tdText tdDataStampa ${opt.KEY_SCHEDA} ">
											<@lib.inputText idText="txtDataStampa_${opt.KEY_SCHEDA}" readOnly="S">
											</@lib.inputText>
										</td>
									</tr>

							</#if>
						</#list>

					</#if>
                        <script>
                            var ${idTable};
							var ${tipo.CODICE_DECODIFICA};
                            SCRIPT_PLUGIN.push("${idTable}_${tipo.CODICE_DECODIFICA} = $('#${idTable}_${tipo.CODICE_DECODIFICA}').CheckBox({width:250,ctrl:false});");
                            SCRIPT_PLUGIN.push("$('#${idTable}_${tipo.CODICE_DECODIFICA}').DisableSelection();");
                        </script>
				</table>
            </fieldset>
			</#list>
		</#if>
	</#macro>


<#--
    tdCheck viene costruita da un td con all'interno l'elemento divCheck precedentemente dichiarato.
    esempio:
    <@lib.tdCheck idCheck="idCheck" option=dati_salvati.hDati.getMatrixData()>
    - tdClass => Se presente aggiunge una classe al td del check
    - extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono
                aggiunti alla macro tdCheck. Questi parametri per essere processati correttamente devono
                essere del tipo	nativamente supportato dall'elemento html in questione.
                In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in
                considerazione è il td, che supporta nativamente il colspan.
-->
	<#macro tdCheck idCheck option tdClass="" colorClass="" dataColSave="" configPlugin="" extra...>
	<td class="tdCheck  ${tdClass}"
	 	<#list extra?keys as attr>
	    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
	    </#list>
	    >
		<@lib.divCheck idCheck=idCheck option=option colorClass=colorClass dataColSave=dataColSave configPlugin=configPlugin>
		</@lib.divCheck>
	</td>
	</#macro>
	<#--
		divCheckColor prende in entrata il risultato di una query con parametri (VALUE ,DESCR, CLASS) e crea un check 
		che colori diversi per goni pulsante (il nostro check della valutazione triagge). 
		Per il resto è uguale al div Check.
		esempio:
		<@lib.divCheckColor idCheck="idCheck" option=dati_salvati.hDati.getMatrixData()>
	-->
	<#macro divCheckColor idCheck option dataColSave="" configPlugin="">
	    <div class="CheckBox" id="${idCheck}">
	        <#assign idInput = 'h-${idCheck}'>
	        <#assign valore = '${(dati_salvati[idInput].getValue())!""}'>
	            <input name="${idCheck}" type="hidden" value="${valore}" data-col-save="${dataColSave}" id="h-${idCheck}"/>
	        <#list option as opt>
	            <div data-value="${opt.VALUE}" class="CBpuls CBcolorDefault ${opt.CLASS!""} <#if valore ='${opt.VALUE}'> CBpulsSel</#if>" title="${opt.DESCR}" id="${idCheck}_${opt.VALUE}">
	                <i></i>
	                <span>${opt.DESCR}</span>
	            </div>
	        </#list>
	        <script>
	            var ${idCheck};
	            SCRIPT_PLUGIN.push("${idCheck} = $('#${idCheck}').CheckBox(${configPlugin});");
	            SCRIPT_PLUGIN.push("$('#${idCheck}').DisableSelection();");
	        </script>
	    </div>
	</#macro>
	<#-- 
		tdCheckColor viene costruita da un td con all'interno l'elemento divCheckColor precedentemente dichiarato
		esempio:
		 <@lib.tdCheckColor idCheck="idCheck" option=dati_salvati.hDati.getMatrixData()>
	-->
	<#macro tdCheckColor idCheck option dataColSave="" configPlugin="" extra...>
	<td class="tdCheck"
	    <#list extra?keys as attr>
	    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
	    </#list>
	    >
	    <@lib.divCheckColor idCheck=idCheck option=option dataColSave=dataColSave configPlugin=configPlugin>
	    </@lib.divCheckColor>
	</td>
	</#macro>
	
<#--
							*******************************************************
							*                 Elementi COMBO                      *
							*L'elemento base è SelectCombo che viene richiamato   *
							*per costruire gli altri lementi più complessi        *
							*******************************************************
-->
	<#--
		SelectCombo prende in entrata il risultato di una query con parametri (VALUE , DESCR).
		esempio:  
		<@lib.SelectCombo idCombo="idCombo" option=dati_salvati.RisultatoQuery.getMatrixData() dataColSave="DATI" >
		- idCombo ***PARAMETRO OBBLIGATORIO***** => E' l'id che viene attribuito all'elemento SelectCombo creato(univoco).
		- option ***PARAMETRO OBBLIGATORIO***** => E' dove vengono caricati i dati per riempire il combo. Con la funzione 
					getMatrixData viene caricato nel combo il valore di RisultatoQuery. RisultatoQuery contiene appunto, 
					il risultato della query che è,	tramite il file data@1.xml della relativa pagina, dichiarata nel relativo file query_xxx.xml.
		- dataColSave => Se viene valorizzato inserisce un data-col-save, come nel nostro configuratore.
	-->
	<#macro SelectCombo idCombo option dataColSave="">
		<select name="${idCombo}" value="" data-col-save="${dataColSave}" id="${idCombo}">
		<option value="" id="${idCombo}_"/>
			<#list option as opt>
	    		<option data-value="${opt.VALUE}" data-descr="${opt.DESCR}" value="${opt.VALUE}" >${opt.DESCR}</option>
	    	</#list>
		</select>
	</#macro>
	<#-- 
		tdCombo viene costruita da un td con all'interno l'elemento divCheck precedentemente dichiarato.
		- tdClass => Se presente aggiunge una classe al td del combo
		- extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono 
					aggiunti alla macro tdCheck. Questi parametri per essere processati correttamente devono 
					essere del tipo	nativamente supportato dall'elemento html in questione.
					In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in 
					considerazione è il td, che supporta nativamente il colspan.
		esempio:
		<@lib.tdCombo idCombo="idCombo" tdClass="classeTd" option=dati_salvati.hDato.getMatrixData()>
	-->
	<#macro tdCombo idCombo option tdClass="" dataColSave="" extra...>
	<td class="tdCombo ${tdClass}"
	 <#list extra?keys as attr>
	    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
	    </#list>
	    >
	    <@lib.SelectCombo idCombo=idCombo option=option dataColSave=dataColSave>
	 </@lib.SelectCombo>
	</td>
	</#macro>
	<#-- 
		tdComboParam vuole in entrata i dati in questo modo => option=option={"Key1":"Value1", "Key2":"Value2"}.
		Per il resto è uguale al tdCombo.
		esempio:
		<@lib.tdComboParam idCombo="idCombo" option=option={"Key1":"Value1", "Key2":"Value2"}>
	-->
	<#macro tdComboParam id option>
	<td class="tdCombo">
		<select name="${id?html}" value="" id="${id?html}">
		<option value="" id="${id}_"/>
			<#assign keys = option?keys>
			<#list keys as opt>
	    		<option data-value="${option[opt]}" data-descr="${opt}" value="${option[opt]}" id="${id}_${option[opt]}">${opt}</option>
	    	</#list>
		</select>
	</td>
	</#macro>

<#--
							*******************************************************
							*                                                     *
							*                 Elementi DATA/ORA                   *
							*                                                     *
							*******************************************************
-->
	<#--
		tdLabelData crea un td con la label e un td con il plugin per la data.
		- id ***PARAMETRO OBBLIGATORIO***** => E' l'id da attribuire alla input che contiene il valore della data
		- idLabel ***PARAMETRO OBBLIGATORIO***** => E' l'id da attribuire al td che contiene alla label
		- value ***PARAMETRO OBBLIGATORIO***** => E' il valore del td (ossia il testo scritto)
		esempio:
		<@lib.tdLabelData id="idTextData" idlabel="idLabel" value="testo_della_label">	 
	-->
	<#macro tdLabelData id idlabel value>
	<td class="tdLbl  clickToOggi" id="${idlabel}">${value}</td>
	<td class="tdData">
				<input type="text" id="${id}">
					<input name="h-${id}" type="hidden" value="" id="h-${id}">
					<script type="text/javascript">
	                    SCRIPT_PLUGIN.push("$('#${id}').Zebra_DatePicker({readonly_element: false, format: 'd/m/Y',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});");
	                    var txtDataNascMask;
	                    SCRIPT_PLUGIN.push("txtDataNascMask = $('#${id}').maskData({});");
	                    SCRIPT_PLUGIN.push("DATE.setEventDataOggi({lblSorgente:'${idlabel}',txtDestinazione:'${id}',hDestinazioneIso:'h-${id}'})");
	              </script>
	          </td>
	</#macro>
	<#--
		tdLabelOra crea un td con la label e un td con il plugin per l'ora.
		- id ***PARAMETRO OBBLIGATORIO***** => E' l'id da attribuire alla input che contiene il valore del'ora
		- idLabel ***PARAMETRO OBBLIGATORIO***** => E' l'id da attribuire al td che contiene alla label
		esempio:
		<@lib.tdLabelOra id="idTextOra" idlabel="idLabel">	 
	-->
	<#macro tdLabelOra id idlabel>
	<td class="tdLbl" id="${idlabel}">Ora</td>
	<td class="tdText oracontrol w80px">
	    <input type="text" id="${id}" class="hasPtTimeSelect isPtTimeSelectActive" value="">
	</td>
	</#macro>

<#--
                            *******************************************************
							*                                                     *
							*                  Elementi LABEL                     *
							*                                                     *
							*******************************************************
-->
	<#--
		tdLbl crea un td con classe tdLbl e vi scirve all'interno
		esempio:
		<@lib.tdLbl class="" id="idLabel" value="testo_della_label">
		- id ***PARAMETRO OBBLIGATORIO***** => E' l'id da attribuire td
		- value ***PARAMETRO OBBLIGATORIO***** => E' il valore del td (ossia il testo scritto)
		- extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono 
					aggiunti alla macro. Questi parametri per essere processati correttamente devono 
					essere del tipo	nativamente supportato dall'elemento html in questione.
					In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in 
					considerazione è il td, che supporta nativamente il colspan.
	-->
	<#macro tdLbl id value class="" extra...>
	<td class="tdLbl ${class}" id="${id}"
	    <#list extra?keys as attr>
	    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
	    </#list>
	        >${value!""}</td>
	</#macro>

<#--
							*******************************************************
							*                  Elementi RADIO                     *
							*L'elemento base è divRadio che viene richiamato      *
							*per costruire gli altri lementi più complessi        *
							*******************************************************
-->
	<#--
		divRadio prende in entrata il risultato di una query con parametri (VALUE , DESCR).
		esempio:  
		<@lib.divRadio idRadio="idRadio" option=dati_salvati.RisultatoQuery.getMatrixData() dataColSave="DATI" configPlugin="{width:150,ctrl:false}" >
		- idCheck ***PARAMETRO OBBLIGATORIO***** => E' l'id che viene attribuito all'elemento divRadio creato(univoco).
		- option ***PARAMETRO OBBLIGATORIO***** => E' dove vengono caricati i dati per riempire il radio. Con la funzione 
					getMatrixData viene caricato nel radio il valore di RisultatoQuery. RisultatoQuery contiene appunto, 
					il risultato della query che è,	tramite il file data@1.xml della relativa pagina, dichiarata nel relativo file query_xxx.xml.
		- dataColSave => Se viene valorizzato inserisce un data-col-save, come nel nostro configuratore.
		- configPlugin => Se inserito funziona come quello del nostro configuratore. 
						Ad esempio = {width:300,ctrl:false}, per altri valori vedere: fenix\web\js\Base\NO-min\Check.js, fenix\src\sdj\extension\extCheck.java 
	-->
	<#macro divRadio idRadio option dataColSave="" configPlugin="">
		<div class="RadioBox" id="${idRadio}">
			<#assign idInput = 'h-${idRadio}'>
			<#assign valore = '${(dati_salvati[idInput].getValue())!""}'>
			<input name="${idRadio}" type=hidden value="${valore}" data-col-save="${dataColSave}" id="${idInput}">
		<#list option as opt>
				 <div data-value="${opt.VALUE}" class="RBpuls <#if valore ='${opt.VALUE}'>RBpulsSel</#if>" title="${opt.DESCR}" id="${idRadio}_${opt.VALUE}">
					<i></i>
					<span>${opt.DESCR}</span>
				</div>
	    	</#list>
			<script>
				var ${idRadio};
				SCRIPT_PLUGIN.push("${idRadio} = $('#${idRadio}').RadioBox(${configPlugin});");
				SCRIPT_PLUGIN.push("$('#${idRadio}').DisableSelection();");
			</script>
		</div>
	</#macro>
	<#-- 
		tdRadio viene costruita da un td con all'interno l'elemento divRadio precedentemente dichiarato.
		esempio:  
		<@lib.tdRadio idRadio="idRadio" option=dati_salvati.RisultatoQuery.getMatrixData() dataColSave="DATI" configPlugin="{width:150,ctrl:false}" >
		- tdClass => Se presente aggiunge una classe al td del radio
		- extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono 
					aggiunti alla macro tdRadio. Questi parametri per essere processati correttamente devono 
					essere del tipo	nativamente supportato dall'elemento html in questione.
					In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in 
					considerazione è il td, che supporta nativamente il colspan.
	-->
	<#macro tdRadio idRadio option tdClass="" dataColSave="" configPlugin="" extra...>
	<td class="tdRadio ${tdClass}"
		<#list extra?keys as attr>
	    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
	    </#list>
	    >
		<@lib.divRadio idRadio=idRadio option=option dataColSave=dataColSave configPlugin=configPlugin>
		</@lib.divRadio>
	</td>
	</#macro>
	<#--
		tdRadioSiNo crea un radio con due possibili scelte : SI, NO. Serve solo dargli un id(univoco).
		esempio:
		<@lib.tdRadioSiNo idRadio="id">
	-->
	<#macro tdRadioSiNo idRadio>
	<td class=tdRadio>
	<div class="RadioBox" id="${idRadio}">
	    <#assign idInput = 'h-${idRadio}'>
	    <#assign valore = '${(dati_salvati[idInput].getValue())!""}'>
	    <input name="${idRadio}" type=hidden value="${valore}" data-col-save="${idRadio}" id="h-${idRadio}">
	    <div data-value=S class="RBpuls <#if valore = 'S'>RBpulsSel</#if>" title="${traduzione.lblSi}" id="${idRadio}_S"><i></i><span>${traduzione.lblSi}</span></div>
	    <div data-value=N class="RBpuls <#if valore = 'N'>RBpulsSel</#if>" title="${traduzione.lblNo}" id="${idRadio}_N"><i></i><span>${traduzione.lblNo}</span></div>
	    <script>
	        var ${idRadio};
	        SCRIPT_PLUGIN.push("${idRadio} = $('#${idRadio}').RadioBox({width:'none'});");
	        SCRIPT_PLUGIN.push("$('#${idRadio}').DisableSelection();");
	    </script>
	</div>
	</td>
	</#macro>

    <#--
        divRadioColor prende in entrata il risultato di una query con parametri (VALUE , DESCR e CLASS).
        Ogni pulsante è colorato in modo diverso a seconda del risultato della query.
        Per il resto è uguale al divRadio.
    -->
    <#macro divRadioColor idRadio option dataColSave="" configPlugin="">
    <div class="RadioBox" id="${idRadio}">
        <#assign idInput = 'h-${idRadio}'>
        <#assign valore = '${(dati_salvati[idInput].getValue())!""}'>
        <input name="${idRadio}" type=hidden value="${valore}" data-col-save="${dataColSave}" id="${idInput}">
        <#list option as opt>
            <div data-value="${opt.VALUE}" class="RBpuls ${opt.CLASS!""} <#if valore ='${opt.VALUE}'>RBpulsSel</#if>" title="${opt.DESCR}" id="${idRadio}_${opt.VALUE}">
                <i></i>
                <span>${opt.DESCR}</span>
            </div>
        </#list>
        <script>
            var ${idRadio};
            SCRIPT_PLUGIN.push("${idRadio} = $('#${idRadio}').RadioBox(${configPlugin});");
            SCRIPT_PLUGIN.push("$('#${idRadio}').DisableSelection();");
        </script>
    </div>
    </#macro>

<#--
							*******************************************************
							*                                                     *
							*                 Elementi TEXT/TEXTAREA              *
							*                                                     *
							*******************************************************
-->
	<#--
		inputText crea un input di tipo testo
		- idText ***PARAMETRO OBBLIGATORIO***** => E' l'id che viene attribuito all'elemento inputText creato(univoco).
		- readOnly => Se viene inserito un valore diverso da null, l'input sarà readonly.
		esempio:
		<@lib.inputText idText="idInputText" readOnly="Sì">
	-->
	<#macro inputText idText readOnly="">
	 	<#assign valore = '${(dati[idText].getValue())!""}'>
		<input name="${idText}" type="text" id="${idText}" value="${valore}" <#if readOnly != ''>readOnly</#if>>
	</#macro>
	<#--
		tdText viene costruita da un td con all'interno l'elemento inputText precedentemente dichiarato.
		- tdClass => Se presente aggiunge una classe al td dell'input
		- extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono 
					aggiunti alla macro tdText. Questi parametri per essere processati correttamente devono 
					essere del tipo	nativamente supportato dall'elemento html in questione.
					In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in 
					considerazione è il td, che supporta nativamente il colspan.
		esempio:
		<@lib.tdText idText="idText" readOnly="Sì" tdClass="ClasseTD">
	-->	
	<#macro tdText idText tdClass="" readOnly="" extra...>
	<td class="tdText ${tdClass}"
	    <#list extra?keys as attr>
	    ${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
	    </#list>>
	   	<@lib.inputText idText=idText readOnly=readOnly></@lib.inputText>
	</td>
	</#macro>
	<#--
		tdTextHidden crea un input di tipo nascosto
		- id ***PARAMETRO OBBLIGATORIO***** => E' l'id che viene attribuito all'elemento inputText creato(univoco).
		- extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono 
					aggiunti alla macro. Questi parametri per essere processati correttamente devono 
					essere del tipo	nativamente supportato dall'elemento html in questione.
					In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in 
					considerazione è il td, che supporta nativamente il colspan.
		esempio:
		<@lib.tdTextHidden id="idText">
	-->
	<#macro tdTextHidden id extra...>
	<td>
	    <#list extra?keys as attr>
	    ${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
	    </#list>
	        >
	    <#assign valore = '${(dati[id].getValue())!""}'>
	<input name="${id?html}" type="hidden" id="${id?html}" value="${valore}">
	</td>
	</#macro>
	<#--
		tdTextarea crea una textarea dentro un td
		- id ***PARAMETRO OBBLIGATORIO***** => E' l'id che viene attribuito all'elemento tdTextarea creato(univoco).
		- extra => funzione di default di freemarker, processa da solo tutti i parametri in più che vengono 
					aggiunti alla macro. Questi parametri per essere processati correttamente devono 
					essere del tipo	nativamente supportato dall'elemento html in questione.
					In questo caso possiamo aggiungere un 'colspan' visto che l'elemento che prendiamo in 
					considerazione è il td, che supporta nativamente il colspan.
		esempio:
		<@lib.tdTextarea id="idTextarea">
	-->
	<#macro tdTextarea id extra...>
	<td class=tdTextarea
	    <#list extra?keys as attr>
	    ${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
	    </#list>
	        >
	    <#assign valore = '${(dati[id].getValue())!""}'>
	    <textarea name="${id?html}" id="${id?html}" value ="${valore}" >
	    </textarea>
	</td>
	</#macro>