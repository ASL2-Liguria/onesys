<#macro script defined>
    <script type='text/javascript' src='std/jscript/engine/jquery.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript2/engine/worklist_flex.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/engine/toolkit_pagina.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/fillLabels.js' language='JavaScript'></script>
    <script type='text/javascript' src='dwr/engine.js' language='JavaScript'></script>
    <script type='text/javascript' src='dwr/interface/eventDWR.js' language='JavaScript'></script>
    <script type='text/javascript' src='dwr/interface/toolKitDB.js' language='JavaScript'></script>
    <script type='text/javascript' src='dwr/util.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/colori_selezione.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/contextMenu.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/engine/eventi.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/engine/gestione.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/engine/gestione_wk.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/worklist/al_selRiga.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/SetPosShowLayer.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/engine/prototype.js' language='JavaScript'></script>

    <script type='text/javascript' src='std/jscript/engine/jquery.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/Schede_xml/resetRadioButton.js' language='JavaScript'></script>
    <script type='text/javascript' src='std/jscript/RicercaPazienti/Ricoverati/scheda_ricovero/gestioneProcedure/wkProcedure.js' language='JavaScript'></script>

    <#if defined == 1>
        <script>
            <#assign keys = array?keys>
            <#list keys as key>
                var ${array[key]} = new Array(<#assign first = 1><#list rows as row><#if first == 0>,<#else><#assign first = 0></#if>${row[key]}</#list>);
            </#list>
        </script>
    </#if>
</#macro>

<@script defined=enable/>