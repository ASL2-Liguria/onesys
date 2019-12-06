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
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.elco.whale.actions.scopes.Database;

import core.Global;
import imago.crypto.CryptPasswordInterface;
import imago.crypto.ImagoCryptoException;
import imago.sql.UtilsPoolConnection;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionResponse;

import java.sql.SQLException;

import javax.naming.NamingException;
import javax.servlet.ServletContext;
import javax.sql.DataSource;

import oracle.ucp.jdbc.PoolDataSource;

/**
 *
 * @author francescog
 */
public class GetDataSourceFromContext extends Action {

    public class GetDataSourceFromContextResponse extends ActionResponse {

        private final DataSource dataSource;

        private GetDataSourceFromContextResponse(DataSource dataSource) {
            this.dataSource = dataSource;
        }

        public DataSource getDataSource() {
            return dataSource;
        }

    }

    private final String poolName, user, password, cryptType;

    public GetDataSourceFromContext(String poolName, String user, String password, String cryptType) {
        this.poolName = poolName;
        this.user = user;
        this.password = password;
        this.cryptType = cryptType;
    }

    public GetDataSourceFromContext(String poolName, String user, String password) {
        this(poolName, user, password, null);
    }

    public GetDataSourceFromContext(String poolName) {
        this(poolName, getUser(poolName, "dati"), getPassword(poolName, "dati"));
    }

    public GetDataSourceFromContext(String poolName, ServletContext ctx) {
        this(poolName, getUser(poolName, "dati" ,ctx), getPassword(poolName, "dati",ctx));
    }    
    
    private static String getUser(String poolName, String catalogo) {
        if (catalogo != null) {
            return Global.context.getInitParameter(poolName + "[" + catalogo + "]" + "[user]");
        } else {
            return Global.context.getInitParameter(poolName + "[user]");
        }
    }

    private static String getPassword(String poolName, String catalogo) {
        if (catalogo != null) {
            return Global.context.getInitParameter(poolName + "[" + catalogo + "]" + "[password]");
        } else {
            return Global.context.getInitParameter(poolName + "[password]");
        }
    }

    private static String getUser(String poolName, String catalogo, ServletContext ctx) {
        if (catalogo != null) {
            return ctx.getInitParameter(poolName + "[" + catalogo + "]" + "[user]");
        } else {
            return ctx.getInitParameter(poolName + "[user]");
        }
    }

    private static String getPassword(String poolName, String catalogo, ServletContext ctx) {
        if (catalogo != null) {
            return ctx.getInitParameter(poolName + "[" + catalogo + "]" + "[password]");
        } else {
            return ctx.getInitParameter(poolName + "[password]");
        }
    }    
    
    /**
     *
     * @return @throws java.sql.SQLException
     */
    @Override
    public GetDataSourceFromContextResponse execute() throws SQLException {
        try {
            PoolDataSource dataSource = new UtilsPoolConnection(poolName).lookupPool();

            dataSource.setUser(user);

            dataSource.setPassword(cryptType == null ? password : decryptPassword());

            return new GetDataSourceFromContextResponse(dataSource);
        } catch (ImagoCryptoException ex) {
            throw new SQLException(ex);
        } catch (InstantiationException ex) {
            throw new SQLException(ex);
        } catch (ClassNotFoundException ex) {
            throw new SQLException(ex);
        } catch (IllegalAccessException ex) {
            throw new SQLException(ex);
        } catch (NamingException ex) {
            throw new SQLException(ex);
        }
    }

    private String decryptPassword() throws ImagoCryptoException, InstantiationException, ClassNotFoundException, IllegalAccessException {
        CryptPasswordInterface cpi;
        Class clazz = Class.forName(this.cryptType);
        cpi = (CryptPasswordInterface) (clazz.newInstance());
        return cpi.deCrypt(password.getBytes());
    }

}
