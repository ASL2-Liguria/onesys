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

import elco.telnetd.io.TerminalIO;

/**
 * A basic terminal implementation with the focus on vt100 related sequences. This terminal type is most common out there, with sequences that are normally also understood by its
 * successors.
 */
public abstract class BasicTerminal implements Terminal {

	// Associations
	protected Colorizer mColorizer;

	/**
	 * Constructs an instance with an associated colorizer.
	 */
	public BasicTerminal() {
		mColorizer = Colorizer.getReference();
	}

	@Override
	public int translateControlCharacter(int c) {
		switch (c) {
		case DEL:
			return TerminalIO.DELETE;
		case BS:
			return TerminalIO.BACKSPACE;
		case HT:
			return TerminalIO.TABULATOR;
		case ESC:
			return TerminalIO.ESCAPE;
		case SGR:
			return TerminalIO.COLORINIT;
		case EOT:
			return TerminalIO.LOGOUTREQUEST;
		default:
			return c;
		}
	}

	@Override
	public int translateEscapeSequence(int[] buffer) {
		try {
			if (buffer[0] == LSB) {
				switch (buffer[1]) {
				case A:
					return TerminalIO.UP;
				case B:
					return TerminalIO.DOWN;
				case C:
					return TerminalIO.RIGHT;
				case D:
					return TerminalIO.LEFT;
				default:
					break;
				}
			}
		} catch (ArrayIndexOutOfBoundsException ex) { // NOSONAR
			return TerminalIO.BYTEMISSING;
		}

		return TerminalIO.UNRECOGNIZED;
	}

	@Override
	public byte[] getCursorMoveSequence(int direction, int times) {
		byte[] sequence;

		if (times == 1) {
			sequence = new byte[3];
		} else {
			sequence = new byte[times * 3];
		}

		for (int g = 0; g < times * 3; g++) {
			sequence[g] = ESC;
			sequence[g + 1] = LSB;
			switch (direction) {
			case TerminalIO.UP:
				sequence[g + 2] = A;
				break;
			case TerminalIO.DOWN:
				sequence[g + 2] = B;
				break;
			case TerminalIO.RIGHT:
				sequence[g + 2] = C;
				break;
			case TerminalIO.LEFT:
				sequence[g + 2] = D;
				break;
			default:
				break;
			}
			g = g + 2;
		}

		return sequence;
	}

	@Override
	public byte[] getCursorPositioningSequence(int[] pos) {
		byte[] sequence;

		if (pos[0] == TerminalIO.HOME[0] && pos[1] == TerminalIO.HOME[1]) {
			sequence = new byte[3];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = H;
		} else {
			// first translate integer coords into digits
			byte[] rowdigits = translateIntToDigitCodes(pos[0]);
			byte[] columndigits = translateIntToDigitCodes(pos[1]);
			int offset = 0;
			// now build up the sequence:
			sequence = new byte[4 + rowdigits.length + columndigits.length];
			sequence[0] = ESC;
			sequence[1] = LSB;
			// now copy the digit bytes
			System.arraycopy(rowdigits, 0, sequence, 2, rowdigits.length);
			// offset is now 2+rowdigits.length
			offset = 2 + rowdigits.length;
			sequence[offset] = SEMICOLON;
			offset++;
			System.arraycopy(columndigits, 0, sequence, offset, columndigits.length);
			offset = offset + columndigits.length;
			sequence[offset] = H;
		}
		return sequence;
	}

	@Override
	public byte[] getEraseSequence(int eraseFunc) {
		byte[] sequence = null;

		switch (eraseFunc) {
		case TerminalIO.EEOL:
			sequence = new byte[3];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = LE;
			break;
		case TerminalIO.EBOL:
			sequence = new byte[4];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 49; // Ascii Code of 1
			sequence[3] = LE;
			break;
		case TerminalIO.EEL:
			sequence = new byte[4];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 50; // Ascii Code 2
			sequence[3] = LE;
			break;
		case TerminalIO.EEOS:
			sequence = new byte[3];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = SE;
			break;
		case TerminalIO.EBOS:
			sequence = new byte[4];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 49; // Ascii Code of 1
			sequence[3] = SE;
			break;
		case TerminalIO.EES:
			sequence = new byte[4];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 50; // Ascii Code of 2
			sequence[3] = SE;
			break;
		default:
			break;
		}

		return sequence;
	}

	@Override
	public byte[] getSpecialSequence(int function) {
		byte[] sequence = null;

		switch (function) {
		case TerminalIO.STORECURSOR:
			sequence = new byte[2];
			sequence[0] = ESC;
			sequence[1] = 55; // Ascii Code of 7
			break;
		case TerminalIO.RESTORECURSOR:
			sequence = new byte[2];
			sequence[0] = ESC;
			sequence[1] = 56; // Ascii Code of 8
			break;
		case TerminalIO.DEVICERESET:
			sequence = new byte[2];
			sequence[0] = ESC;
			sequence[1] = 99; // Ascii Code of c
			break;
		case TerminalIO.LINEWRAP:
			sequence = new byte[4];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 55; // Ascii code of 7
			sequence[3] = 104; // Ascii code of h
			break;
		case TerminalIO.NOLINEWRAP:
			sequence = new byte[4];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 55; // Ascii code of 7
			sequence[3] = 108; // Ascii code of l
			break;
		}
		return sequence;
	}

	@Override
	public byte[] getGRSequence(int type, int param) {
		byte[] sequence = new byte[0];
		int offset;

		switch (type) {
		case TerminalIO.FCOLOR:
		case TerminalIO.BCOLOR:
			byte[] color = translateIntToDigitCodes(param);
			sequence = new byte[3 + color.length];

			sequence[0] = ESC;
			sequence[1] = LSB;
			// now copy the digit bytes
			System.arraycopy(color, 0, sequence, 2, color.length);
			// offset is now 2+color.length
			offset = 2 + color.length;
			sequence[offset] = 109; // ASCII Code of m
			break;

		case TerminalIO.STYLE:
			byte[] style = translateIntToDigitCodes(param);
			sequence = new byte[3 + style.length];

			sequence[0] = ESC;
			sequence[1] = LSB;
			// now copy the digit bytes
			System.arraycopy(style, 0, sequence, 2, style.length);
			// offset is now 2+style.length
			offset = 2 + style.length;
			sequence[offset] = 109; // ASCII Code of m
			break;

		case TerminalIO.RESET:
			sequence = new byte[5];
			sequence[0] = ESC;
			sequence[1] = LSB;
			sequence[2] = 52; // ASCII Code of 4
			sequence[3] = 56; // ASCII Code of 8
			sequence[4] = 109; // ASCII Code of m
			break;
		}

		return sequence;
	}

	@Override
	public byte[] getScrollMarginsSequence(int topmargin, int bottommargin) {
		byte[] sequence = new byte[0];

		if (supportsScrolling()) {
			// first translate integer coords into digits
			byte[] topdigits = translateIntToDigitCodes(topmargin);
			byte[] bottomdigits = translateIntToDigitCodes(bottommargin);
			int offset;
			// now build up the sequence:
			sequence = new byte[4 + topdigits.length + bottomdigits.length];
			sequence[0] = ESC;
			sequence[1] = LSB;
			// now copy the digit bytes
			System.arraycopy(topdigits, 0, sequence, 2, topdigits.length);
			// offset is now 2+topdigits.length
			offset = 2 + topdigits.length;
			sequence[offset] = SEMICOLON;
			offset++;
			System.arraycopy(bottomdigits, 0, sequence, offset, bottomdigits.length);
			offset = offset + bottomdigits.length;
			sequence[offset] = r;
		}

		return sequence;
	}

	@Override
	public String format(String str) {
		return mColorizer.colorize(str, supportsSGR(), false);
	}

	@Override
	public String formatBold(String str) {
		return mColorizer.colorize(str, supportsSGR(), true);
	}

	@Override
	public byte[] getInitSequence() {
		return new byte[0];
	}

	@Override
	public int getAtomicSequenceLength() {
		return 2;
	}

	/**
	 * Translates an integer to a byte sequence of its digits.<br>
	 *
	 * @param in
	 *            integer to be translated.
	 * @return the byte sequence representing the digits.
	 */
	public byte[] translateIntToDigitCodes(int in) {
		return Integer.toString(in).getBytes();
	}
}
