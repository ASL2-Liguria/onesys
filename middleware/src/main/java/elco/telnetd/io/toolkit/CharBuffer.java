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

import java.util.ArrayList;

/**
 * Class implementing a character buffer.
 */
class CharBuffer {

	// Members
	private final ArrayList<Character> mBuffer;
	private final int mSize;

	public CharBuffer(int size) {
		mBuffer = new ArrayList<>(size);
		mSize = size;
	}

	public char getCharAt(int pos) {
		return mBuffer.get(pos).charValue();
	}

	public void setCharAt(int pos, char ch) {
		mBuffer.set(pos, new Character(ch));
	}

	public void insertCharAt(int pos, char ch) {
		mBuffer.add(pos, new Character(ch));
	}

	public void append(char aChar) {
		mBuffer.add(new Character(aChar));
	}

	public void append(String str) {
		for (int i = 0; i < str.length(); i++) {
			append(str.charAt(i));
		}
	}

	public void removeCharAt(int pos) {
		mBuffer.remove(pos);
	}

	public void clear() {
		mBuffer.clear();
	}

	public int size() {
		return mBuffer.size();
	}

	@Override
	public String toString() {
		StringBuilder sbuf = new StringBuilder();
		for (int i = 0; i < mBuffer.size(); i++) {
			sbuf.append(mBuffer.get(i).charValue());
		}
		return sbuf.toString();
	}

	public void ensureSpace(int chars) throws BufferOverflowException {
		if (chars > (mSize - mBuffer.size())) {
			throw new BufferOverflowException();
		}
	}
}
