/* Copyright (c) 2018, EL.CO. SRL.  All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED FREE OF CHARGE AND ON AN "AS IS" BASIS,
 * WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED INCLUDING
 * WITHOUT LIMITATION THE WARRANTIES THAT IT IS FREE OF DEFECTS, MERCHANTABLE,
 * FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING. THE ENTIRE RISK
 * AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU.
 * SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
 * NECESSARY SERVICING, REPAIR, OR CORRECTION.
 * IN NO EVENT SHALL ELCO SRL BE LIABLE TO YOU FOR DAMAGES, INCLUDING
 * ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING
 * OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING, BUT NOT
 * LIMITED TO, LOSS OF DATA, DATA BEING RENDERED INACCURATE, LOSS OF
 * BUSINESS PROFITS, LOSS OF BUSINESS INFORMATION, BUSINESS INTERRUPTIONS,
 * LOSS SUSTAINED BY YOU OR THIRD PARTIES, OR A FAILURE OF THE SOFTWARE
 * TO OPERATE WITH ANY OTHER SOFTWARE) EVEN IF ELCO SRL HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.
 */
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cartellaclinica.gestioneAppuntamenti.components;

import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;

/**
 *
 * @author francescog
 */
public class Table {
    
    private ArrayList<Row> rows;    
    
    public Table(){
        this.rows = new ArrayList<Row>();        
    }
    
    public void addRow(Row row){
        
        Row found = this.getItem(row.getData());
        
        if(found == null){
            rows.add(row);
        }else{
            found.mergeWith(row);
        }
    }    
    
    public void sortRows(){
        Collections.sort(rows);
    }
    
    public ArrayList<Row> getRows(){
        Collections.sort(rows);
        return this.rows;
    }
    
    private Row getItem(String pData){
        
        for(Row row: this.rows){
            if(row.getData().equals(pData)){
                return row;
            }
        }
        
        return null;
    }
    
    public StringBuilder toHtml(ArrayList<ColumnHeader> colonne) throws InvocationTargetException, IllegalAccessException{
        StringBuilder sb = new StringBuilder();
        for (Row row : this.getRows()) {
            if (row.getGiorno_dimissione().equals("S")){

                String data = row.getData();
                SimpleDateFormat dateformatJavaInput = new SimpleDateFormat("yyyyMMdd");
                SimpleDateFormat dateformatJavaOutput = new SimpleDateFormat("dd/MM/yyyy");

                try {
                    data = dateformatJavaOutput.format(dateformatJavaInput.parse(data));
                } catch (ParseException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }

                sb.append("<div class = \"divricovero\" > Data dimissione "+data+" </div>");
            }

            sb.append(row.toHtml(colonne));
        }    
        return sb;
    }
}
