<#macro worklist>
    <div id='groupWK'>
        <div id='fixme'>
            <table id='idHeaderTableWk' class='classDataTable'>
                <!-- INTESTAZIONE COLONNE WORKLIST -->
                <#assign count = 0>
                <#assign keys = columns?keys>
                <tr>
                    <#list keys as key>
                        <th width='10%'><div>${columns[key]}</div></th>
                        <#assign count = count + 1>
                    </#list>
                </tr>
                <colgroup>
                    <#list 1..count as x><col width='10%'></#list>                
                </colgroup>
            </table>
        </div>
        <table onContextMenu='return MenuTxDx();' onClick='javascript:hideContextMenu();' id='oTable' class='classDataTable'>
            <!-- RECORD IN WORKLIST -->
            <#assign index = 0>
            <#list rows as row>
                <tr onMouseOver='javascript:rowSelect_over(this.sectionRowIndex);' onDblClick='javascript:try{apriChiudiInfoReferto();}catch(e){;}' onMouseOut='javascript:rowSelect_out(this.sectionRowIndex);' onClick='javascript:illumina(this.sectionRowIndex);' class='classNormalRow' id='idRow0_${index}' onContextMenu='javascript:rigaSelezionataDalContextMenu=this.sectionRowIndex;'>
                    <#list keys as key>
                        <td name='${key}' width='10%' title='${columns[key]}: ${row["${key}"]}'><div class='classDatiTabella'>${row["${key}"]}</div></td>
                    </#list>
                </tr>
                <#assign index = index + 1>
            </#list>
            <colgroup>
                <#list 1..count as x><col width='10%'></#list> 
            </colgroup>
        </table>
        <table class='classDataEntryTable'>
            <tr>
            </tr>
            <colgroup></colgroup>
        </table>
    </div>
</#macro>

<@worklist/>