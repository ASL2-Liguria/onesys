// JavaScript Document

document.write('<div id="dialog-form-casi" title="Casi rilevanti">');
document.write('	<form>');
document.write('	<fieldset style="background: #E8E8E8;">');
document.write('		<span class="spanCasiTitle"><label for="casiPatologie">Patologie</label></span>');
document.write('			<table  border="0" cellspacing="1" cellpadding="1" width="100%"><tr>     <td><select size="6" multiple="multiple" formato="S" id ="IN_IDEN_PATOLOGIE" ondblclick="javascript:add_selected_elements(\'IN_IDEN_PATOLOGIE\', \'OUT_IDEN_PATOLOGIE\', true);" >        </select></td>      <td><SPAN class="pulsanteInclusione"><a href="javascript:add_selected_elements(\'IN_IDEN_PATOLOGIE\', \'OUT_IDEN_PATOLOGIE\', true);" >Includi&gt;&gt;</a></SPAN><BR/>        <SPAN  class="pulsanteInclusione"><a href="javascript:add_selected_elements(\'OUT_IDEN_PATOLOGIE\', \'IN_IDEN_PATOLOGIE\', true);" >&lt;&lt;Escludi</a></SPAN></td>      <td><select size="6" multiple="multiple" id="OUT_IDEN_PATOLOGIE" formato="S" ondblclick="javascript:add_selected_elements(\'OUT_IDEN_PATOLOGIE\', \'IN_IDEN_PATOLOGIE\', true);" >        </select></td>    </tr>    </table>');
document.write('			<span class="spanCasiTitle"><label for="casiPatologie"><label for="casiTag">Parole chiave</label></label></span>');
document.write('			<table  border="0" cellspacing="1" cellpadding="1" width="100%"><tr><td><div class="ui-widget"><label >Tags: </label><input id="casiTag" onblur="javascript:this.value=this.value.toUpperCase();"/></div></td><td><SPAN class="pulsanteInclusione"><a href="javascript:controlloTagDoppio(document.getElementById(\'casiTag\'));" >Includi&gt;&gt;</a></SPAN><BR/>        <SPAN  class="pulsanteInclusione"><a href="javascript:remove_elem_by_sel(\'cmbTagCasi\');" >&lt;&lt;Escludi</a></SPAN></td>      <td><select size="6"  id="cmbTagCasi" formato="S" ondblclick="javascript:remove_elem_by_sel(this.id);" ></select></td>  </tr>    </table>');
document.write('		<span class="spanCasiTitle"><label for="selectableRilevanza">Rilevanza</label></span>');
document.write('			<ol id="selectableRilevanza">');
document.write('				<li class="ui-state-default" value="1">1</li>');
document.write('				<li class="ui-state-default" value="2">2</li>');
document.write('				<li class="ui-state-default" value="3">3</li>');
document.write('				<li class="ui-state-default" value="4">4</li>');
document.write('				<li class="ui-state-default" value="5">5</li>');
document.write('			</ol>');
document.write('	</fieldset>');
document.write('	</form>');
document.write('</div>');