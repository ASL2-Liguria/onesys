<?xml version="1.0" encoding="UTF-8"?>
<CRS>
    <CNTRL>
        <CMD>${CNTRL.CMD}</CMD>
        <SYS>${CNTRL.SYS}</SYS>
        <PRD>${CNTRL.PRD}</PRD>
        <GRPR1>${CNTRL.GRPR1}</GRPR1>
        <AUTH>${CNTRL.AUTH}</AUTH>
    </CNTRL>
    <PERSON>
        <AGEY>${PERSON.AGEY}</AGEY>
        <GNDR>${PERSON.GNDR}</GNDR>
        <PID>${PERSON.PID}</PID>
    </PERSON>
    <ENCOUNTER>
        <DSP>${ENCOUNTER.DSP}</DSP>
        <ADT>${ENCOUNTER.ADT}</ADT>
        <DDT>${ENCOUNTER.DDT}</DDT>
        <CLAIM>
            <#list ENCOUNTER.CLAIM.I9DXP as i9dxp_item>
                  <I9DXP>
                        <VALUE>${i9dxp_item.VALUE}</VALUE>
                  </I9DXP>
            </#list>
            <#list ENCOUNTER.CLAIM.I9DX as i9dx_item>
                  <I9DX>
                        <VALUE>${i9dx_item.VALUE}</VALUE>
                  </I9DX>
            </#list>
            <#list ENCOUNTER.CLAIM.I9PRP as i9prp_item>
                  <I9PRP>
                        <VALUE>${i9prp_item.VALUE}</VALUE>
                  </I9PRP>
            </#list>
            <#list ENCOUNTER.CLAIM.I9PR as i9pr_item>
                  <I9PR>
                        <VALUE>${i9pr_item.VALUE}</VALUE>
                  </I9PR>
            </#list>
        </CLAIM>
    </ENCOUNTER>
</CRS>