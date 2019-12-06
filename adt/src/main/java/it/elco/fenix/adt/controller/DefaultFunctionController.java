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
package it.elco.fenix.adt.controller;

import it.elco.baseObj.factory.baseFactory;
import it.elco.baseObj.iBase.iBasePC;
import it.elco.baseObj.iBase.iBaseUser;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.caronte.factory.utils.ElcoCaronteFactory;
import it.elco.database.actions.GetResultSet;
import it.elco.database.converters.SqlParameter;
import it.elco.json.actions.Stringify;
import org.apache.commons.dbutils.handlers.MapListHandler;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by alessandro.arrighi on 05/02/2016.
 */
public class DefaultFunctionController {

    private static final Logger logger = Logger.getLogger(DefaultFunctionController.class.getName());

    protected Connection getConnection() throws SQLException {
        return getConnection("ADT");
    }

    protected Connection getConnection(String keyConnection) throws SQLException {
        return new ElcoCaronteFactory(CaronteFactory.getApplicationContext()).createDataSource(keyConnection).getConnection();
    }

    protected String getResult(HttpSession session, String idQuery, SqlParameter... sqlParams) throws SQLException, IOException {
        return getResult(session, "ADT", idQuery, sqlParams);
    }

    protected String getResult(HttpSession session, String keyConnection, String idQuery, SqlParameter... sqlParams) throws SQLException, IOException {

        iBaseUser baseUser = baseFactory.getBaseUser(session);
        iBasePC basePc = baseFactory.getBasePC(session);
        String clientId = ("".equals(baseUser.getWebuser()) ? "UNKNOWN" : baseUser.getWebuser()) + "@" + ("".equals(basePc.getIp()) ? "UNKNOWN" : basePc.getIp());

        Connection conn = null;
        ResultSet rs = null;

        String sql = CaronteFactory.getFactory().createDataManager(keyConnection, clientId).getQueryManager().getQuery(idQuery);

        try {
            conn = getConnection(keyConnection);
            rs = new GetResultSet(conn, sql, sqlParams).execute();

            return new Stringify(new MapListHandler().handle(rs)).execute();

        } catch (SQLException | IOException ex) {
            logger.log(Level.SEVERE, null, ex);
            throw ex;
        } finally {

            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException ex) {
                logger.log(Level.SEVERE, null, ex);
            }

            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                logger.log(Level.SEVERE, null, ex);
                throw ex;
            }
        }
    }
}
