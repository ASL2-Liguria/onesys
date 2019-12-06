<html>
    <head>
	<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1" />

	<#include "/CSS.ftl">

    </head>
	
    <body onContextMenu='return MenuTxDx();' id='body' onload='javascript:try{fillLabels(arrayLabelName, arrayLabelValue);}catch(ex){}'>
        <form accept-charset='UNKNOWN' method='POST' name='dati' action='' enctype='application/x-www-form-urlencoded'>
            <div id='contextualMenu' style='position: Absolute; visibility:hidden;'>
                <table id='contextualMenu_table' cellspacing='0' cellpadding='0' class='ContextMenuLinks' border='0'>
                    <tr>
                        <td colspan='2' class='titleMenuOption'><label id='lblTitoloMenuContext'></label></td>
                    </tr>
                    <tr onClick='javascript:apriProcedure();'>
                        <td class='ContextIcon'><img height='30' width='30' src='imagexPix/contextMenu/ico_ins.gif'></td>
                        <td onMouseOver="javascript:this.className='ContextMenuOver'" onMouseOut="javascript:this.className='ContextMenuNormal'" class='ContextMenuNormal'>&nbsp;&nbsp;Inserisci Lesione Decubito&nbsp;</td>
                    </tr>
                    <tr onClick='javascript:cancellaProcedura();'>
                        <td class='ContextIcon'><img height='30' width='30' src='imagexPix/button/canc.png'></td>
                        <td onMouseOver="javascript:this.className='ContextMenuOver'" onMouseOut="javascript:this.className='ContextMenuNormal'" class='ContextMenuNormal'>&nbsp;&nbsp;Cancella Lesione Decubito&nbsp;</td>
                    </tr>
                </table>
            </div>

            <#include "/WORKLIST.ftl">

        </form>        

        <#include "/SCRIPT.ftl">

    </body>
</html>
