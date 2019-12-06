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
package elco.logback.appenders.snmp;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;

/**
 * @author Roberto Rizzo
 */
public final class SNMPTrapAppender extends AppenderBase<ILoggingEvent> {

	private SNMPService snmpService;
	private final SNMPConfig snmpConfig;
	private String priority;
	private String escalation;

	public SNMPTrapAppender() {
		snmpConfig = new SNMPConfig();
		snmpConfig.setSystemName(getUserName());
	}

	@Override
	protected void append(ILoggingEvent iLoggingEvent) {
		if (snmpService == null) {
			snmpService = new SNMPServiceImpl(snmpConfig);
		}

		StringBuilder sbuf = new StringBuilder(128);
		sbuf.append(iLoggingEvent.getTimeStamp() - iLoggingEvent.getLoggerContextVO().getBirthTime()).append(" ").append(iLoggingEvent.getLevel()).append(" [")
				.append(iLoggingEvent.getThreadName()).append("] ").append(iLoggingEvent.getLoggerName()).append(" - ").append(iLoggingEvent.getFormattedMessage());

		snmpService.sendEvent(iLoggingEvent.getMessage(), sbuf.toString(), priority, escalation);
	}

	private String getUserName() {
		String username = System.getProperty("user.name");
		if (username != null) {
			return username + ": ";
		}

		return "";
	}

	public void setCommunity(String community) {
		snmpConfig.setCommunity(community);
	}

	public void setEnterpriseId(String enterpriseId) {
		snmpConfig.setEnterpriseId(enterpriseId);
	}

	public void setHost(String host) {
		snmpConfig.setHost(host);
	}

	public void setPort(String port) {
		snmpConfig.setPort(port);
	}

	public void setSpecificTrapType(String specificTrapType) {
		snmpConfig.setSpecificTrapType(specificTrapType);
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public void setEscalation(String escalation) {
		this.escalation = escalation;
	}
}
