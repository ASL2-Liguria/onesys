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
package it.elco.whale.freemarker;

import java.sql.ResultSet;

import freemarker.template.SimpleScalar;
import freemarker.template.TemplateHashModel;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;
import freemarker.template.TemplateSequenceModel;

/**
 * 
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class ResultSetModel implements TemplateSequenceModel {

    private ResultSet rs = null;

    /**
     * 
     * @param rs 
     */
    public ResultSetModel(ResultSet rs) {
        this.rs = rs;
    }

    /**
     * 
     * @param i
     * @return
     * @throws TemplateModelException 
     */
    public TemplateModel get(int i) throws TemplateModelException {
        try {
            rs.next();
        } catch (Exception e) {
            throw new TemplateModelException(e.toString());
        }
        TemplateModel model = new Row(rs);
        return model;
    }

    /**
     * 
     * @return
     * @throws TemplateModelException 
     */
    public int size() throws TemplateModelException {
        int size = 0;
        try {
            rs.last();
            size = rs.getRow();
            rs.beforeFirst();
        } catch (Exception e) {
            throw new TemplateModelException(e.toString());
        }
        return size;
    }

    /**
     * 
     */
    class Row implements TemplateHashModel {

        private ResultSet rs = null;

        public Row(ResultSet rs) {
            this.rs = rs;
        }

        /**
         * 
         * @param s
         * @return
         * @throws TemplateModelException 
         */
        public TemplateModel get(String s) throws TemplateModelException {
            TemplateModel model = null;
            try {
                model = new SimpleScalar(rs.getString(s));
            } catch (Exception e) {
                e.printStackTrace();
            }
            return model;
        }

        /**
         * 
         * @return
         * @throws TemplateModelException 
         */
        public boolean isEmpty() throws TemplateModelException {
            boolean isEmpty = false;
            if (rs == null) {
                isEmpty = true;
            }
            return isEmpty;
        }
    }
}