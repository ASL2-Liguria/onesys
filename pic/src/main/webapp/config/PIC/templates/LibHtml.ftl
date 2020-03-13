<#--
 * LibHtml
 * Library to output HTML tags
 -->

<#macro tdLbl class id value extra...>
<td class="${class!"tdLbl"}" id="${id}"
    <#list extra?keys as attr>
    ${attr}="${extra[attr]}"<#if attr_has_next> </#if>
    </#list>
        >${value!""}</td>
</#macro>

<#macro tdText class id extra...>
<td class="${class}"
    <#list extra?keys as attr>
    ${attr}="${extra[attr]?html}"<#if attr_has_next> </#if>
    </#list>
        >
    <#assign valore = '${(dati[id].getValue())!""}'>
<input name="${id?html}" type="text" id="${id?html}" value="${valore}">
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