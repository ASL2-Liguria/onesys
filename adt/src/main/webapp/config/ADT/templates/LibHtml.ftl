<#--
 * LibHtml
 * Library to output HTML tags
 -->

<#--
*******************************************************
*Elementi CHECK
*L'elemento base è divCheck che viene richiamato
*per costruire gli altri lementi più complessi
*******************************************************
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

<#macro divCheckColor idCheck option dataColSave="" configPlugin="">
    <div class="CheckBox" id="${idCheck}">
        <#assign idInput = 'h-${idCheck}'>
        <#assign valore = '${(dati_salvati[idInput].getValue())!""}'>
            <input name="${idCheck}" type="hidden" value="${valore}" data-col-save="${dataColSave}" id="h-${idCheck}"/>
        <#list option as opt>
            <div data-value="${opt.VALUE}" class="CBpuls CBcolorDefault ${opt.CLASS!""} <#if valore ='${opt.VALUE}'> CBpulsSel</#if>" title="${opt.DESCR}" id="${idCheck}_${opt.VALUE}" data-codice="${opt.CODICE_URGENZA}">

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
*******************************************************
*Elementi COMBO
ù*L'elemento base è SelectCombo che viene richiamato
*per costruire gli altri lementi più complessi
*******************************************************
-->
<#-- combo che vuole in entrata i dati in questo modo => option=dati_salvati.hmedici.getMatrixData() con parametri (IDEN,DESCRIZIONE)
<#macro tdComboMap id option>
<td class="tdCombo">
	<select name="${id?html}" value="" id="${id?html}">
	<option value="" id="${id}_"/>
		<#list option as opt>
    		<option data-value="${opt.VALUE}" data-descr="${opt.DESCR}" value="${opt.DESCR}" >${opt.DESCR}</option>
    	</#list>
	</select>
</td>
</#macro>
-->
<#--macro che prende in entrata il getMatrixData ma con parametri (VALUE , DESCR). Parametri presi dalla query che carica il campo -->
<#macro SelectCombo idCombo option dataColSave="">
	<select name="${idCombo}" value="" data-col-save="${dataColSave}" id="${idCombo}">
	<option value="" id="${idCombo}_"/>
		<#list option as opt>
    		<option
    		<#list opt?keys as key>
        		data-${key} = "${opt[key]}"
    		</#list>
    		value="${opt.VALUE}">${opt.DESCR}</option>
    	</#list>
	</select>
</#macro>

<#macro tdComboMap id option class="" dataColSave="" extra...>
<td class="tdCombo ${class}"
 <#list extra?keys as attr>
    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
    </#list>
    >
    <@lib.SelectCombo idCombo=id option=option dataColSave=dataColSave>
 </@lib.SelectCombo>
</td>
</#macro>

<#-- combo che vuole in entrata i dati in questo modo => option=option={"Key1":"Value1", "Key2":"Value2"} -->
<#macro tdCombo id option>
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
*Elementi DATA/ORA
*******************************************************
-->
<#macro tdData id readonly="false">
<td class="tdData">
			<input type="text" id="${id}"><button type="button" class="Zebra_DatePicker_Icon Zebra_DatePicker_Icon_Inside">Pick a date</button>
				<input name="h-${id}" type="hidden" value="" id="h-${id}">
			<script type="text/javascript">
				SCRIPT_PLUGIN.push("$('#${id}"').Zebra_DatePicker({readonly_element: ${readonly}, format: 'd/m/Y', startWithToday:true,months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});");
				var txtDataArriMask;
				SCRIPT_PLUGIN.push("txtDataArriMask = $('#${id}').maskData({});");
			</script>
</td>
</#macro>

<#macro tdLabelData id idlabel value readonly="false">
<td class="tdLbl  clickToOggi" id="${idlabel}">${value}</td>
<td class="tdData">
			<input type="text" id="${id}">
				<input name="h-${id}" type="hidden" value='${(dati_salvati[id].getValue())!""}' id="h-${id}">
				<script type="text/javascript">
                    SCRIPT_PLUGIN.push("$('#${id}').Zebra_DatePicker({readonly_element: ${readonly}, format: 'd/m/Y',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});");
                    var txtDataNascMask;
                    SCRIPT_PLUGIN.push("txtDataNascMask = $('#${id}').maskData({});");
                    SCRIPT_PLUGIN.push("DATE.setEventDataOggi({lblSorgente:'${idlabel}',txtDestinazione:'${id}',hDestinazioneIso:'h-${id}'})");
              </script>
          </td>
</#macro>

<#macro tdLabelOra id idlabel value>
<td class="tdLbl" id="${idlabel}">${value}</td>
<td class="tdText oracontrol w80px">
    <input type="text" id="${id}" class="hasPtTimeSelect isPtTimeSelectActive" value='${(dati_salvati[id].getValue())!""}'>
</td>
</#macro>

<#--
*******************************************************
*Elementi LABEL
*******************************************************
-->
<#macro tdLbl class id value extra...>
<td class="tdLbl ${class}" id="${id}"
    <#list extra?keys as attr>
    	${attr}="${extra[attr]}"<#if attr_has_next> </#if>
    </#list>
>
${value!"lblVuota"}
</td>
</#macro>

<#--
*******************************************************
*Elementi RADIO
*L'elemento base è divRadio che viene richiamato
*per costruire gli altri lementi più complessi
*******************************************************
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

<#-- Crea un tdRadio con le scelte SI\NO -->
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
*******************************************************
*Elementi TEXT
*******************************************************
-->
<#macro inputText idText readOnly="">
 	<#assign valore = '${(dati_salvati[idText].getValue())!""}'>
	<input name="${idText}" type="text" id="${idText}" value="${valore}" <#if readOnly != ''>readOnly</#if>>
</#macro>

<#macro tdText class id readOnly="" extra...>
<td class="tdText ${class}"
    <#list extra?keys as attr>
    ${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
    </#list>>
   	<@lib.inputText idText=id readOnly=readOnly></@lib.inputText>
</td>
</#macro>

<#macro tdTextHidden id extra...>
<td
    <#list extra?keys as attr>
    ${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
    </#list>
        >
    <#assign valore = '${(dati[id].getValue())!""}'>
<input name="${id?html}" type="hidden" id="${id?html}" value="${valore}">
</td>
</#macro>

<#macro tdTextarea id extra...>
<td class="tdTextarea"
    <#list extra?keys as attr>
    	${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
    </#list>
        >
    <#assign valore = '${(dati_salvati[id].getValue())!""}'>
    <textarea data-toupper="N" name="${id?html}" id="${id?html}" value ="${valore}" >${(dati_salvati[id].getValue())!""}</textarea>
</td>
</#macro>

<#macro tdAutoComplete idText idLbl tradLbl idAutoComplete query idWk datasource binds title extra...>
<#-- TD LABEL-->
<td class="tdACList">
	<span id="${idLbl}">${tradLbl}</span>
	<div class="acList hide" id="${idAutoComplete}">
		<div class="acListDiv">
			<div class="hRiq hRiq26">
				<span class="hSx"></span>
				<div class="hC">${title}</div>
				<span class="hDx"></span></div>
			<div class="contentDiv">
				<div class="acListFiltri">
					<table>
						<tbody>
							<tr>
								<td class="tdLbl " id="${idLbl}">${tradLbl}</td>
								<td class="tdText ">
									<input name="2" autocorrect="off" type="text" autocomplete="off" class="txtACLfiltro mousetrap" value="" autocapitalize="off" id="2">
									<span class="spanText" id=""></span>
								</td>
								<td>
									<!--div class="CBpuls CBcolorDefault">Ricerca Sensibile<i></i></div-->
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<script type="text/javascript">
					SCRIPT_PLUGIN.push("$('#${idLbl}').autocompleteList('${idAutoComplete}',{'onSelect':function(ret){},'binds':{ <#assign keys = binds?keys><#assign counter = 0><#list keys as b><#if counter = 0 >'${b}' : '${binds[b]}'<#else>,'${b}' : '${binds[b]}'</#if><#assign counter = counter + 1></#list>},'title':'${title}','id_wk':'${idWk}','auto_sensitive_search':'true'});");
				</script>
				<div class="acListWk"></div>
			</div>
			<div class="footerTabs sfDark">
				<div class="buttons" unselectable="on" style="-webkit-user-select: none;">
					<button type="button" class="btn acListCerca" id="${idLbl}@acListCerca">Cerca</button>
					<button type="button" class="btn acListChiudi" id="${idLbl}@acListChiudi">Chiudi</button>
				</div>
			</div>
		</div>
	</div>
</td>

<#-- TD INPUT TEXT readonly="true"-->
<td class="tdAC "
 	<#list extra?keys as attr>
    	${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
    </#list>
    >
	<input type="text" value="" id="${idText}" autocomplete="off">
	<input type="hidden" value="" id="h-${idText}">
	<script type="text/javascript">
		SCRIPT_PLUGIN.push("$('#${idText}').autocomplete({'storedQuery':'${query}','onSelect':function(data){},'minChars':'2','binds':{<#assign keys = binds?keys><#assign counter = 0><#list keys as b><#if counter < 1 >'${b}' : '${binds[b]}'<#else>,'${b}' : '${binds[b]}'</#if><#assign counter = counter + 1></#list>},'zIndex':'9999','width':'300','maxHeight':'400','deferRequestBy':'200','idList':'${idAutoComplete}','serviceUrl':'autocompleteAjax','maxResults':'30','datasource':'${datasource}'});");
	</script>
</td>
</#macro>