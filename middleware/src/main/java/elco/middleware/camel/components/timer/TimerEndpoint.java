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
package elco.middleware.camel.components.timer;

import java.util.Date;
import java.util.TimerTask;

import org.apache.camel.Component;
import org.apache.camel.Consumer;
import org.apache.camel.Processor;
import org.apache.camel.Producer;
import org.apache.camel.RuntimeCamelException;
import org.apache.camel.api.management.ManagedAttribute;
import org.apache.camel.api.management.ManagedResource;
import org.apache.camel.impl.DefaultEndpoint;

import elco.insc.Constants;
import elco.insc.Timer;

/**
 * @author Roberto Rizzo
 */
@ManagedResource(description = "Managed TimerEndpoint")
public final class TimerEndpoint extends DefaultEndpoint {

	private Timer timer = null;
	private String timerName = null;
	private long period = 1; // one second
	private long delay = 1; // one second
	private Date time;
	private String charset = Constants.DEFAULT_VM_CHARSET;

	public TimerEndpoint() {
		// OK
	}

	public TimerEndpoint(String uri, Component component, String timerName) {
		super(uri, component);
		this.timerName = timerName;
	}

	@Override
	public Producer createProducer() throws Exception {
		throw new RuntimeCamelException("Cannot produce to a TimerEndpoint: " + getEndpointUri());
	}

	@Override
	public Consumer createConsumer(Processor processor) throws Exception {
		return new TimerConsumer(this, processor);
	}

	@Override
	protected void doStop() throws Exception {
		stopTimer();
		super.doStop();
	}

	@ManagedAttribute(description = "Timer Name")
	public String getTimerName() {
		if (timerName == null) {
			timerName = getEndpointUri();
		}

		return timerName;
	}

	@ManagedAttribute(description = "Timer Name")
	public void setTimerName(String timerName) {
		this.timerName = timerName;
	}

	@ManagedAttribute(description = "Initial Delay Period")
	public long getDelay() {
		return delay;
	}

	@ManagedAttribute(description = "Initial Delay Period")
	public void setDelay(long delay) {
		this.delay = delay;
	}

	@ManagedAttribute(description = "Timer Period")
	public long getPeriod() {
		return period;
	}

	@ManagedAttribute(description = "Timer Period")
	public void setPeriod(long period) {
		this.period = period;
	}

	@ManagedAttribute(description = "Exchange Charset")
	public String getEncoding() {
		return charset;
	}

	@ManagedAttribute(description = "Exchange Charset")
	public void setEncoding(String charset) {
		this.charset = charset;
	}

	@Override
	@ManagedAttribute(description = "Singleton")
	public boolean isSingleton() {
		return true;
	}

	@ManagedAttribute(description = "Camel id")
	public String getCamelId() {
		return this.getCamelContext().getName();
	}

	@ManagedAttribute(description = "Endpoint State")
	public String getState() {
		return getStatus().name();
	}

	public Date getTime() {
		return time;
	}

	public synchronized void startTimer(TimerTask task) {
		if (timer == null) {
			time = new Date();
			timer = new Timer(task, delay, period);
			timer.start();
		}
	}

	public synchronized void stopTimer() {
		if (timer != null) {
			timer.stop();
			timer.shutdownNow();
			timer = null;
		}
	}
}
