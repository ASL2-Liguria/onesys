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
import java.util.concurrent.atomic.AtomicLong;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.impl.DefaultConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Roberto Rizzo
 */
public final class TimerConsumer extends DefaultConsumer {

	private static final Logger logger = LoggerFactory.getLogger(TimerConsumer.class);
	private final TimerEndpoint endpoint;
	private volatile TimerTask task;

	public TimerConsumer(TimerEndpoint endpoint, Processor processor) {
		super(endpoint, processor);
		this.endpoint = endpoint;
	}

	@Override
	protected void doStart() throws Exception {
		task = new TimerTask() {
			private final AtomicLong counter = new AtomicLong();

			@Override
			public void run() {
				if (!isTaskRunAllowed()) {
					// do not run timer task as it was not allowed
					return;
				}

				try {
					sendTimerExchange(counter.incrementAndGet());
				} catch (Exception ex) {
					// catch all to avoid the JVM closing the thread and not firing again
					logger.warn("Error processing exchange. This exception will be ignored, to let the timer be able to trigger again.", ex);
					cancel();
				}
			}
		};

		endpoint.startTimer(task);
	}

	@Override
	protected void doStop() throws Exception {
		if (task != null) {
			task.cancel();
		}
		task = null;

		endpoint.stopTimer();
	}

	/**
	 * Whether the timer task is allow to run or not
	 */
	protected boolean isTaskRunAllowed() {
		// only allow running the timer task if we can run and are not suspended,
		// and CamelContext must have been fully started
		return endpoint.getCamelContext().getStatus().isStarted() && isRunAllowed() && !isSuspended();
	}

	protected void sendTimerExchange(long counter) {
		Exchange exchange = endpoint.createExchange();
		exchange.setProperty(Exchange.CHARSET_NAME, endpoint.getEncoding());
		exchange.setProperty(Exchange.TIMER_COUNTER, counter);
		exchange.setProperty(Exchange.TIMER_NAME, endpoint.getTimerName());
		exchange.setProperty(Exchange.TIMER_TIME, endpoint.getTime());
		exchange.setProperty(Exchange.TIMER_PERIOD, endpoint.getPeriod());

		Date now = new Date();
		exchange.setProperty(Exchange.TIMER_FIRED_TIME, now);
		exchange.getIn().setHeader("firedTime", now);

		try {
			getProcessor().process(exchange);
		} catch (Exception ex) {
			exchange.setException(ex);
		}

		// handle any thrown exception
		if (exchange.getException() != null) {
			getExceptionHandler().handleException("Error processing exchange", exchange, exchange.getException());
		}
	}
}
