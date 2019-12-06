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
package elco.manager;

import org.apache.camel.component.netty4.ChannelHandlerFactories;
import org.apache.camel.component.netty4.ChannelHandlerFactory;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

import elco.insc.Constants;
import elco.insc.DeleteOldExternalFileLogs;
import elco.internaldb.DeleteOldLogs;
import elco.logback.CompressOldFileLogs;
import elco.logback.DeleteOldFileLogs;
import elco.manager.conditions.InternalDBCondition;
import elco.manager.multicast.InternalMulticastConsumer;

/**
 * Spring configuration class
 *
 * @author Roberto Rizzo
 */
@Configuration
public class ManagerBeanFactory {

	@Bean
	@Conditional(InternalDBCondition.class)
	public DataSource internaldbPool() {
		DataSource ds = new DataSource();
		ds.setDriverClassName(Constants.DBDRIVER);
		ds.setUrl(Constants.DBURL);
		ds.setUsername(Constants.DBUSER);
		ds.setPassword(Constants.DBPWD);
		ds.setRemoveAbandoned(true);
		ds.setRemoveAbandonedTimeout(120);
		ds.setTestOnBorrow(true);
		ds.setTestOnReturn(false);
		ds.setTestWhileIdle(false);
		ds.setTimeBetweenEvictionRunsMillis(60000);
		ds.setMinEvictableIdleTimeMillis(300000);
		ds.setMaxActive(50);
		ds.setMaxIdle(10);
		ds.setMinIdle(1);
		ds.setInitialSize(1);
		ds.setMaxWait(10000);
		ds.setValidationQuery("select 1 from dual");
		ds.setValidationQueryTimeout(20);
		ds.setJdbcInterceptors("org.apache.tomcat.jdbc.pool.interceptor.StatementCache(prepared=true,callable=true,max=100)");
		ds.setDefaultAutoCommit(true);

		return ds;
	}

	@Bean
	public CompressOldFileLogs compressionoldfilelogs() {
		return new CompressOldFileLogs();
	}

	@Bean
	public DeleteOldFileLogs deleteoldfilelogs() {
		return new DeleteOldFileLogs();
	}

	@Bean
	public DeleteOldLogs deleteoldlogs() {
		return new DeleteOldLogs();
	}

	@Bean
	public CamelManager camelManager() {
		return new CamelManager();
	}

	@Bean
	public SendInfoMail sendInfoMail() {
		return new SendInfoMail();
	}

	@Bean
	public DeleteOldExternalFileLogs deleteoldexternalfilelogs() {
		return new DeleteOldExternalFileLogs();
	}

	@Bean(name = "netty-length-decoder")
	public ChannelHandlerFactory nettylengthdecoder() {
		return ChannelHandlerFactories.newLengthFieldBasedFrameDecoder(1048576, 0, 4, 0, 4);
	}

	@Bean
	public InternalMulticastConsumer internalmulticastconsumer() {
		return new InternalMulticastConsumer();
	}
}
