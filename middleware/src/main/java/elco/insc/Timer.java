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
package elco.insc;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * Timer class
 *
 * @author Roberto Rizzo
 */
public final class Timer {

	private ScheduledExecutorService ses = null;
	private ScheduledFuture<?> sf = null;
	private Runnable runnable = null;
	private long initialDelay = 1L;
	private long delay = 10L;

	/**
	 * Create a new Timer and start it
	 *
	 * @param runnable
	 *            Class implementing Runnable interface
	 * @param initialDelay
	 *            the delay between the termination of one execution and the commencement of the next
	 * @param delay
	 *            execution delay time in seconds
	 */
	public Timer(Runnable runnable, long initialDelay, long delay) {
		this.runnable = runnable;
		this.initialDelay = initialDelay;
		this.delay = delay;
		ses = Executors.newSingleThreadScheduledExecutor();
	}

	/**
	 * Start Timer
	 */
	public void start() {
		sf = ses.scheduleWithFixedDelay(runnable, initialDelay, delay, TimeUnit.SECONDS);
	}

	/**
	 * Stop Timer
	 */
	public void stop() {
		if (sf != null) {
			sf.cancel(false);
			sf = null;
		}
	}

	/**
	 * Shutdown Timer
	 */
	public void shutdownNow() {
		if (ses != null) {
			ses.shutdownNow();
			ses = null;
		}
	}

	@Override
	protected void finalize() throws Throwable { // NOSONAR
		stop();
		shutdownNow();
		super.finalize();
	}
}
