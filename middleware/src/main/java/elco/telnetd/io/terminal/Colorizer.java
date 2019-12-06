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
package elco.telnetd.io.terminal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Singleton utility class for translating internal color/style markup into ANSI defined escape sequences. It uses a very simple but effective lookup table, and does the job
 * without sophisticated parsing routines. It should therefore perform quite fast.
 */
public final class Colorizer {

	private static Logger logger = LoggerFactory.getLogger(Colorizer.class);

	private static Object cSelf; // Singleton instance reference
	private final int[] mColorMapping; // translation table

	// Constants
	private static final int S = 30; // black
	private static final int s = 40;
	private static final int R = 31; // red
	private static final int r = 41;
	private static final int G = 32; // green
	private static final int g = 42;
	private static final int Y = 33; // yellow
	private static final int y = 43;
	private static final int B = 34; // blue
	private static final int b = 44;
	private static final int M = 35; // magenta
	private static final int m = 45;
	private static final int C = 36; // cyan
	private static final int c = 46;
	private static final int W = 37; // white
	private static final int w = 47;

	private static final int f = 1; /* bold */

	private static final int d = 22; /* !bold */ // normal color or normal intensity
	private static final int i = 3; /* italic */
	private static final int j = 23; /* !italic */
	private static final int u = 4; /* underlined */
	private static final int v = 24; /* !underlined */
	private static final int e = 5; /* blink */
	private static final int n = 25; /* steady = !blink */
	private static final int h = 8; /* hide = concealed characters */
	private static final int a = 0; /* all out */

	private static int testcount = 0;
	private static Colorizer myColorizer;

	/**
	 * Constructs a Colorizer with its translation table.
	 */
	private Colorizer() {

		mColorMapping = new int[128];

		mColorMapping[83] = S;
		mColorMapping[82] = R;
		mColorMapping[71] = G;
		mColorMapping[89] = Y;
		mColorMapping[66] = B;
		mColorMapping[77] = M;
		mColorMapping[67] = C;
		mColorMapping[87] = W;

		mColorMapping[115] = s;
		mColorMapping[114] = r;
		mColorMapping[103] = g;
		mColorMapping[121] = y;
		mColorMapping[98] = b;
		mColorMapping[109] = m;
		mColorMapping[99] = c;
		mColorMapping[119] = w;

		mColorMapping[102] = f;
		mColorMapping[100] = d;
		mColorMapping[105] = i;
		mColorMapping[106] = j;
		mColorMapping[117] = u;
		mColorMapping[118] = v;
		mColorMapping[101] = e;
		mColorMapping[110] = n;
		mColorMapping[104] = h;
		mColorMapping[97] = a;

		cSelf = this;
	}

	/**
	 * Translates all internal markups within the String into ANSI Escape sequences.<br>
	 * The method is hooked into BasicTerminalIO.write(String str), so it is not necessary to call it directly.
	 *
	 * @param str
	 *            String with internal color/style markups.
	 * @param support
	 *            boolean that represents Terminals ability to support GR sequences. if false, the internal markups are ripped out of the string.
	 * @return String with ANSI escape sequences (Graphics Rendition), if support is true, String without internal markups or ANSI escape sequences if support is false.
	 */
	public String colorize(String str, boolean support) {
		return colorize(str, support, false);
	}// colorize

	/**
	 * Translates all internal markups within the String into ANSI Escape sequences.<br>
	 * The method is hooked into BasicTerminalIO.write(String str), so it is not necessary to call it directly.
	 *
	 * @param str
	 *            String with internal color/style markups.
	 * @param support
	 *            boolean that represents Terminals ability to support GR sequences. if false, the internal markups are ripped out of the string.
	 * @param forcebold
	 *            boolean that forces the output to be bold at any time.
	 * @return String with ANSI escape sequences (Graphics Rendition), if support is true, String without internal markups or ANSI escape sequences if support is false.
	 */
	public String colorize(String str, boolean support, boolean forcebold) {
		StringBuilder out = new StringBuilder(str.length() + 20);
		int parsecursor = 0;
		int foundcursor;

		boolean done = false;
		while (!done) {
			foundcursor = str.indexOf(ColorHelper.MARKER_CODE, parsecursor);
			if (foundcursor != -1) {
				out.append(str.substring(parsecursor, foundcursor));
				if (support) {
					out.append(addEscapeSequence(str.substring(foundcursor + 1, foundcursor + 2), forcebold));
				}
				parsecursor = foundcursor + 2;
			} else {
				out.append(str.substring(parsecursor, str.length()));
				done = true;
			}
		}

		/*
		 * This will always add a "reset all" escape sequence behind the input string. Basically this is a good idea, because developers tend to forget writing colored strings
		 * properly.
		 */
		if (support) {
			out.append(addEscapeSequence("a", false));
		}

		return out.toString();
	}// colorize

	private String addEscapeSequence(String attribute, boolean forcebold) {

		StringBuilder tmpbuf = new StringBuilder(10);

		byte[] tmpbytes = attribute.getBytes();
		int key = tmpbytes[0];

		tmpbuf.append((char) 27);
		tmpbuf.append((char) 91);
		int attr = mColorMapping[key];
		tmpbuf.append(attr);
		if (forcebold && attr != f) {
			tmpbuf.append((char) 59);
			tmpbuf.append(f);
		}
		tmpbuf.append((char) 109);

		return tmpbuf.toString();
	}// addEscapeSequence

	/**
	 * Returns the reference of the Singleton instance.
	 *
	 * @return reference to Colorizer singleton instance.
	 */
	public static Colorizer getReference() {
		if (cSelf != null) {
			return (Colorizer) cSelf;
		}
		return new Colorizer();
	}// getReference

	/**
	 * Test Harness *
	 */

	private static void announceResult(boolean res) {
		if (res) {
			logger.info("[#" + testcount + "] ok.");
		} else {
			logger.info("[#" + testcount + "] failed (see possible StackTrace).");
		}
	}// announceResult

	private static void announceTest(String what) {
		testcount++;
		logger.info("Test #" + testcount + " [" + what + "]:");
	}// announceTest

	private static void bfcolorTest(String color) {
		logger.info("->" + myColorizer.colorize(ColorHelper.boldcolorizeText("COLOR", color), true) + "<-");
	}// bfcolorTest

	private static void fcolorTest(String color) {
		logger.info("->" + myColorizer.colorize(ColorHelper.colorizeText("COLOR", color), true) + "<-");
	}// fcolorTest

	private static void bcolorTest(String color) {
		logger.info("->" + myColorizer.colorize(ColorHelper.colorizeBackground("     ", color), true) + "<-");
	}// bcolorTest

	/**
	 * Invokes the build in test harness, and will produce styled and colored output directly on the terminal.
	 */
	public static void main(String[] args) {
		try {
			announceTest("Instantiation");
			myColorizer = Colorizer.getReference();
			announceResult(true);

			announceTest("Textcolor Tests");
			fcolorTest(ColorHelper.BLACK);
			fcolorTest(ColorHelper.RED);
			fcolorTest(ColorHelper.GREEN);
			fcolorTest(ColorHelper.YELLOW);
			fcolorTest(ColorHelper.BLUE);
			fcolorTest(ColorHelper.MAGENTA);
			fcolorTest(ColorHelper.CYAN);
			fcolorTest(ColorHelper.WHITE);
			announceResult(true);

			announceTest("Bold textcolor Tests");
			bfcolorTest(ColorHelper.BLACK);
			bfcolorTest(ColorHelper.RED);
			bfcolorTest(ColorHelper.GREEN);
			bfcolorTest(ColorHelper.YELLOW);
			bfcolorTest(ColorHelper.BLUE);
			bfcolorTest(ColorHelper.MAGENTA);
			bfcolorTest(ColorHelper.CYAN);
			bfcolorTest(ColorHelper.WHITE);
			announceResult(true);

			announceTest("Background Tests");
			bcolorTest(ColorHelper.BLACK);
			bcolorTest(ColorHelper.RED);
			bcolorTest(ColorHelper.GREEN);
			bcolorTest(ColorHelper.YELLOW);
			bcolorTest(ColorHelper.BLUE);
			bcolorTest(ColorHelper.MAGENTA);
			bcolorTest(ColorHelper.CYAN);
			bcolorTest(ColorHelper.WHITE);
			announceResult(true);

			announceTest("Mixed Color Tests");
			logger.info("->" + myColorizer.colorize(ColorHelper.colorizeText("COLOR", ColorHelper.WHITE, ColorHelper.BLUE), true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.colorizeText("COLOR", ColorHelper.YELLOW, ColorHelper.GREEN), true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.boldcolorizeText("COLOR", ColorHelper.WHITE, ColorHelper.BLUE), true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.boldcolorizeText("COLOR", ColorHelper.YELLOW, ColorHelper.GREEN), true) + "<-");

			announceResult(true);

			announceTest("Style Tests");
			logger.info("->" + myColorizer.colorize(ColorHelper.boldText("Bold"), true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.italicText("Italic"), true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.underlinedText("Underlined"), true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.blinkingText("Blinking"), true) + "<-");

			announceResult(true);

			announceTest("Mixed Color/Style Tests");
			logger.info("->" + myColorizer.colorize(ColorHelper.boldText(ColorHelper.colorizeText("RED", ColorHelper.RED, false)
					+ ColorHelper.colorizeText("BLUE", ColorHelper.BLUE, false) + ColorHelper.colorizeText("GREEN", ColorHelper.GREEN, false)), true) + "<-");
			logger.info(
					"->" + myColorizer
							.colorize(
									ColorHelper.boldText(ColorHelper.colorizeBackground("RED", ColorHelper.RED, false)
											+ ColorHelper.colorizeBackground("BLUE", ColorHelper.BLUE, false) + ColorHelper.colorizeBackground("GREEN", ColorHelper.GREEN, false)),
					true) + "<-");
			logger.info("->" + myColorizer.colorize(ColorHelper.boldText(
					ColorHelper.colorizeText("RED", ColorHelper.WHITE, ColorHelper.RED, false) + ColorHelper.colorizeText("BLUE", ColorHelper.WHITE, ColorHelper.BLUE, false)
							+ ColorHelper.colorizeText("GREEN", ColorHelper.WHITE, ColorHelper.GREEN, false)),
					true) + "<-");

			announceResult(true);

			announceTest("Visible length test");
			String colorized = ColorHelper.boldcolorizeText("STRING", ColorHelper.YELLOW);

			logger.info("->" + myColorizer.colorize(colorized, true) + "<-");
			logger.info("Visible length=" + ColorHelper.getVisibleLength(colorized));

			colorized = ColorHelper.boldcolorizeText("BANNER", ColorHelper.WHITE, ColorHelper.BLUE) + ColorHelper.colorizeText("COLOR", ColorHelper.WHITE, ColorHelper.BLUE)
					+ ColorHelper.underlinedText("UNDER");
			logger.info("->" + myColorizer.colorize(colorized, true) + "<-");
			logger.info("Visible length=" + ColorHelper.getVisibleLength(colorized));

			announceResult(true);

			logger.info("Forcing bold");
			logger.info(myColorizer.colorize(ColorHelper.colorizeText("RED", ColorHelper.RED), true, true));

		} catch (Exception ex) {
			announceResult(false);
			logger.error("", ex);
		}
	}// main (test routine)
}
