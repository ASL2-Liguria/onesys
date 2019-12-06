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

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.snmp4j.CommunityTarget;
import org.snmp4j.PDUv1;
import org.snmp4j.Snmp;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.smi.IpAddress;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

/**
 * @author Roberto Rizzo
 */
public final class SNMPServiceImpl implements SNMPService {

	private static final String PUBLIC_COMMUNITY = "public";
	private final SNMPConfig config;
	public static final int RETRIES = 1;
	public static final int TIMEOUT = 2000;

	public SNMPServiceImpl(SNMPConfig config) {
		this.config = config;
	}

	@Override
	public void sendEvent(String message, String detail, String priority, String escalation) {
		Snmp snmp = null;

		try {
			// Use default UDP Transport Mapping unless informed otherwise
			// Default is as good a place as any to start
			snmp = new Snmp(new DefaultUdpTransportMapping());
			snmp.listen();

			// Create primary SNMP trap target
			CommunityTarget target = new CommunityTarget();
			target.setCommunity(new OctetString(config.getCommunity() != null ? config.getCommunity() : PUBLIC_COMMUNITY));
			target.setAddress(new UdpAddress(getOpenNmsHostIpAddress().getHostAddress() + "/" + config.getPort()));
			target.setRetries(RETRIES);
			target.setTimeout(TIMEOUT);
			target.setVersion(SnmpConstants.version1);

			String enterpriseOID = config.getEnterpriseId();

			// Create the SNMP Trap message
			PDUv1 pdu = new PDUv1();
			// Sets the specific trap ID. If this value is set, setGenericTrap(int genericTrap) must be called with value ENTERPRISE_SPECIFIC.
			pdu.setGenericTrap(PDUv1.ENTERPRISE_SPECIFIC);
			// pdu.setSpecificTrap(Integer.parseInt(config.getSpecificTrapType()));
			pdu.setEnterprise(new OID(enterpriseOID));
			pdu.setAgentAddress(new IpAddress(getAgentAddress()));

			// Bind the Exception details to the OID
			pdu.add(new VariableBinding(new OID(enterpriseOID + ".1"), new OctetString(config.getSystemName())));
			pdu.add(new VariableBinding(new OID(enterpriseOID + ".2"), new OctetString(message == null ? new OctetString("") : new OctetString(message))));
			pdu.add(new VariableBinding(new OID(enterpriseOID + ".3"), new OctetString(priority)));
			// escalation can be null if a ResolveAlarm event is being sent
			pdu.add(new VariableBinding(new OID(enterpriseOID + ".4"), escalation == null ? new OctetString("") : new OctetString(escalation)));
			if (detail != null) {
				pdu.add(new VariableBinding(new OID(enterpriseOID + ".5"), new OctetString(detail)));
			}

			// send to SNMP traps
			ResponseEvent responseEvent = snmp.send(pdu, target);
			if (responseEvent != null) {
				responseEvent.getResponse();
			}
		} catch (Exception ex) {
			throw new RuntimeException(ex); // NOSONAR
		} finally {
			// Close the snmp connection
			try {
				if (snmp != null) {
					snmp.close();
				}
			} catch (Exception ioe) { // NOSONAR
				System.err.println("Unable to close snmp connection " + ioe.getLocalizedMessage()); // NOSONAR
			}
		}
	}

	private InetAddress getOpenNmsHostIpAddress() throws UnknownHostException {
		return InetAddress.getByName(config.getHost());
	}

	private InetAddress getUserIpAddress() throws UnknownHostException {
		return InetAddress.getByName(System.getProperty("user.name"));
	}

	private InetAddress getHostIpAddress() throws UnknownHostException {
		return InetAddress.getLocalHost();
	}

	public InetAddress getAgentAddress() throws UnknownHostException {
		InetAddress inetAddress;

		try {
			inetAddress = getUserIpAddress();
		} catch (UnknownHostException uhe) { // NOSONAR
			inetAddress = getHostIpAddress(); // NOSONAR
		}

		return inetAddress;
	}
}
