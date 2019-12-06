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
package elco.telnetd.io.toolkit;

import java.io.IOException;

import elco.telnetd.io.BasicTerminalIO;

/**
 * Class that implements an Editline
 */
class Editline {

	// Aggregations (inner class!)
	private final Buffer mBuffer;
	// Members
	private final BasicTerminalIO mIO;
	private int mCursor = 0;
	private boolean mInsertMode = true;
	private int mLastSize = 0;
	private boolean mHardWrapped = false;
	private char mLastRead;
	private int mLastCursPos = 0;

	/**
	 * Constructs an Editline.
	 */
	public Editline(BasicTerminalIO io) {
		mIO = io;
		// allways full length
		mBuffer = new Buffer(mIO.getColumns() - 1);
		mCursor = 0;
		mInsertMode = true;
	}// constructor

	/**
	 * Accessor method for line buffer size. @ return int that represents the number of chars in the fields buffer.
	 */
	public int size() {
		return mBuffer.size();
	}// getSize

	public String getValue() {
		return mBuffer.toString();
	}// getValue

	public void setValue(String str) throws BufferOverflowException, IOException {
		storeSize();
		// buffer
		mBuffer.clear();
		// cursor
		mCursor = 0;

		// screen
		mIO.moveLeft(mLastSize);
		mIO.eraseToEndOfLine();
		append(str);
	}// setValue

	public void clear() throws IOException {

		storeSize();
		// Buffer
		mBuffer.clear();
		// Cursor
		mCursor = 0;
		// Screen
		draw();
	}// clear

	public String getSoftwrap() throws IOException {
		// Wrap from Buffer
		String content = mBuffer.toString();
		int idx = content.lastIndexOf(' ');
		if (idx == -1) {
			content = "";
		} else {
			content = content.substring(idx + 1, content.length());

			// Cursor
			// remeber relative cursor pos
			mCursor = size();
			mCursor = mCursor - content.length();

			// buffer
			for (int i = 0; i < content.length(); i++) {
				mBuffer.removeCharAt(mCursor);
			}

			// screen
			mIO.moveLeft(content.length());
			mIO.eraseToEndOfLine();
		}
		return content + getLastRead();
	}// getSoftWrap

	public String getHardwrap() throws IOException {
		// Buffer
		String content = mBuffer.toString();
		content = content.substring(mCursor, content.length());
		int lastsize = mBuffer.size();
		for (int i = mCursor; i < lastsize; i++) {
			mBuffer.removeCharAt(mCursor);
		}
		// cursor stays
		// screen
		mIO.eraseToEndOfLine();
		return content;
	}// getHardWrap

	private void setCharAt(int pos, char ch) throws IOException {
		// buffer
		mBuffer.setCharAt(pos, ch);
		// cursor
		// implements overwrite mode no change
		// screen
		draw();
	}// setCharAt

	private void insertCharAt(int pos, char ch) throws BufferOverflowException, IOException {
		storeSize();
		// buffer
		mBuffer.ensureSpace(1);
		mBuffer.insertCharAt(pos, ch);
		// cursor adjustment (so that it stays in "same" pos)
		if (mCursor >= pos) {
			mCursor++;
		}
		// screen
		draw();
	}// insertCharAt

	private void removeCharAt(int pos) throws IOException {
		storeSize();
		// buffer
		mBuffer.removeCharAt(pos);

		// cursor
		if (mCursor > pos) {
			mCursor--;
		}
		// screen
		draw();

	}// removeChatAt

	@SuppressWarnings("unused")
	private void insertStringAt(int pos, String str) throws BufferOverflowException, IOException {
		storeSize();
		// buffer
		mBuffer.ensureSpace(str.length());
		for (int i = 0; i < str.length(); i++) {
			mBuffer.insertCharAt(pos, str.charAt(i));
			// Cursor
			mCursor++;
		}
		// screen
		draw();

	}// insertStringAt

	public void append(char ch) throws BufferOverflowException, IOException {
		storeSize();
		// buffer
		mBuffer.ensureSpace(1);
		mBuffer.append(ch);
		// cursor
		mCursor++;
		// screen
		mIO.write(ch);
	}// append(char)

	public void append(String str) throws BufferOverflowException, IOException {
		storeSize();
		// buffer
		mBuffer.ensureSpace(str.length());
		for (int i = 0; i < str.length(); i++) {
			mBuffer.append(str.charAt(i));
			// Cursor
			mCursor++;
		}
		// screen
		mIO.write(str);
	}// append(String)

	public int getCursorPosition() {
		return mCursor;
	}// getCursorPosition

	public void setCursorPosition(int pos) {
		if (mBuffer.size() < pos) {
			mCursor = mBuffer.size();
		} else {
			mCursor = pos;
		}
	}// setCursorPosition

	private char getLastRead() {
		return mLastRead;
	}// getLastRead

	private void setLastRead(char ch) {
		mLastRead = ch;
	}// setLastRead

	public boolean isInInsertMode() {
		return mInsertMode;
	}// isInInsertMode

	public void setInsertMode(boolean b) {
		mInsertMode = b;
	}// setInsertMode

	public boolean isHardwrapped() {
		return mHardWrapped;
	}// isHardwrapped

	public void setHardwrapped(boolean b) {
		mHardWrapped = b;
	}// setHardwrapped

	/**
	 * Method that will be reading and processing input.
	 */
	public int run() throws IOException {
		int in;
		// myIO.flush();
		do {
			// get next key
			in = mIO.read();
			// store cursorpos
			mLastCursPos = mCursor;

			switch (in) {
			case BasicTerminalIO.LEFT:
				if (!moveLeft()) {
					return in;
				}
				break;
			case BasicTerminalIO.RIGHT:
				if (!moveRight()) {
					return in;
				}
				break;
			case BasicTerminalIO.BACKSPACE:
				try {
					if (mCursor == 0) {
						return in;
					}
					removeCharAt(mCursor - 1);
				} catch (IndexOutOfBoundsException ioobex) {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.DELETE:
				try {
					removeCharAt(mCursor);
				} catch (IndexOutOfBoundsException ioobex) {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.ENTER:
			case BasicTerminalIO.UP:
			case BasicTerminalIO.DOWN:
			case BasicTerminalIO.TABULATOR:
				return in;
			default:
				try {
					handleCharInput(in);
				} catch (BufferOverflowException boex) {
					setLastRead((char) in);
					return in;
				}
			}
			mIO.flush();
		} while (true);
	}// run

	public void draw() throws IOException {
		mIO.moveLeft(mLastCursPos);
		mIO.eraseToEndOfLine();
		mIO.write(mBuffer.toString());
		// adjust screen cursor hmm
		if (mCursor < mBuffer.size()) {
			mIO.moveLeft(mBuffer.size() - mCursor);
		}
	}// draw

	private boolean moveRight() throws IOException {
		// cursor
		if (mCursor < mBuffer.size()) {
			mCursor++;
			// screen
			mIO.moveRight(1);
			return true;
		}
		return false;
	}// moveRight

	private boolean moveLeft() throws IOException {
		// cursor
		if (mCursor > 0) {
			mCursor--;
			// screen
			mIO.moveLeft(1);
			return true;
		}
		return false;
	}// moveLeft

	private boolean isCursorAtEnd() {
		return (mCursor == mBuffer.size());
	}// isCursorAtEnd

	private void handleCharInput(int ch) throws BufferOverflowException, IOException {
		if (isCursorAtEnd()) {
			append((char) ch);
		} else {
			if (isInInsertMode()) {
				try {
					insertCharAt(mCursor, (char) ch);
				} catch (BufferOverflowException ex) {
					// ignore buffer overflow on insert
					mIO.bell();
				}
			} else {
				setCharAt(mCursor, (char) ch);
			}
		}
	}// handleCharInput

	private void storeSize() {
		mLastSize = mBuffer.size();
	}// storeSize

	// inner class Buffer
	class Buffer extends CharBuffer {
		public Buffer(int size) {
			super(size);
		}// constructor
	}
}
