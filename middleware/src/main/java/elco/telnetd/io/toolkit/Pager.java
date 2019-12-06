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
import java.io.InputStream;
import java.io.StringReader;
import java.util.ArrayList;

import elco.telnetd.io.BasicTerminalIO;
import elco.telnetd.io.terminal.ColorHelper;

/**
 * Class implementing a pager.
 */
public class Pager {

	// Associations
	private final BasicTerminalIO mIO;
	// Members
	private StringReader mSource;
	private String mPrompt;
	private int mStopKey;
	private ArrayList<String> mChunks;
	private int mChunkPos;
	private int mLastNewChunk;
	private boolean mEOS;
	private int mTermRows;
	private int mTermCols;
	private boolean mNoPrompt;
	private boolean mShowPos;
	private Statusbar mStatus;

	/**
	 * Constant definitions
	 */
	private static final char DEFAULT_STOPKEY = 's';
	private static final String DEFAULT_PROMPT = "[Cursor Up,Cursor Down,Space,s (stop)] ";
	private static final int SPACE = 32;

	/**
	 * Constructor method
	 */
	public Pager(BasicTerminalIO io) {
		mIO = io;
		setPrompt(DEFAULT_PROMPT);
		setStopKey(DEFAULT_STOPKEY);
		mTermRows = mIO.getRows();
		mTermCols = mIO.getColumns();
		mStatus = new Statusbar(mIO, "Pager Status");
		mStatus.setAlignment(Statusbar.ALIGN_LEFT);
	}// constructor

	/**
	 * Constructor method for a pager with a prompt set and a default stop key.
	 *
	 * @param prompt
	 *            String that represents the paging prompt.
	 * @param stopKey
	 *            String that represents the stop key.
	 */
	public Pager(BasicTerminalIO io, String prompt, char stopKey) {
		mIO = io;
		setPrompt(prompt);
		mStopKey = stopKey;
		mTermRows = mIO.getRows();
		mTermCols = mIO.getColumns();
		mStatus.setAlignment(Statusbar.ALIGN_LEFT);
	}// constructor

	/**
	 * Mutator method for the pagers stop key.
	 *
	 * @param key
	 *            char that represents the new stop key.
	 */
	public void setStopKey(char key) {
		mStopKey = key;
	}// setStopKey

	/**
	 * Mutator method for the pagers prompt.
	 *
	 * @param prompt
	 *            String that represents the new promptkey.
	 */
	public void setPrompt(String prompt) {
		mPrompt = prompt;
	}// setPrompt

	private void updateStatus() {
		if (mShowPos) {
			mStatus.setStatusText(mPrompt + " [" + (mChunkPos + 1) + "/" + mChunks.size() + "]");
		} else {
			mStatus.setStatusText(mPrompt);
		}
	}// updateStatus

	/**
	 * Method to make the pager add pager postion to the prompt.
	 */
	public void setShowPosition(boolean b) {
		mShowPos = b;
	}// setShowPosition

	/**
	 * Method that pages the String to the client terminal, being aware of its geometry, and its geometry changes.
	 *
	 * @param str
	 *            String to be paged.
	 */
	public void page(String str) throws IOException {
		terminalGeometryChanged();
		boolean autoflush = mIO.isAutoflushing();
		mIO.setAutoflushing(true);
		// store raw
		mSource = new StringReader(str);
		// do renderchunks
		mChunkPos = 0;
		mLastNewChunk = 0;
		mEOS = false;
		mNoPrompt = false;

		renderChunks();
		if (mChunks.size() == 1) {
			mIO.write(mChunks.get(0));
		} else {
			mIO.homeCursor();
			mIO.eraseScreen();
			mIO.write(mChunks.get(mChunkPos));
			updateStatus();
			mStatus.draw();
			// storage for read byte
			int in;
			do {
				mNoPrompt = false;

				// get next key
				in = mIO.read();
				if (terminalGeometryChanged()) {
					try {
						mSource.reset();
					} catch (Exception ex) {
					}
					renderChunks();
					mChunkPos = 0;
					mLastNewChunk = 0;
					mEOS = false;
					mNoPrompt = false;
					mIO.homeCursor();
					mIO.eraseScreen();
					mIO.write(mChunks.get(mChunkPos));
					updateStatus();
					mStatus.draw();
					continue;
				}
				switch (in) {
				case BasicTerminalIO.UP:
					drawPreviousPage();
					break;
				case BasicTerminalIO.DOWN:
					drawNextPage();
					break;
				case SPACE:
					drawNextPage();
					break;
				default:
					// test for stopkey, cant be switched because not constant
					if (in == mStopKey) {
						// flag loop over
						in = -1;
						continue; // so that we omit prompt and return
					}
					mIO.bell();
					continue;
				}
				if (mEOS) {
					in = -1;
					continue;
				}
				// prompt
				if (!mNoPrompt) {
					updateStatus();
					mStatus.draw();
				}
			} while (in != -1);
			mIO.eraseToEndOfLine();

		}
		mIO.write("\n");
		mSource.close();
		mIO.setAutoflushing(autoflush);
	}// page(String)

	/**
	 * Method that pages text read from an InputStream.
	 *
	 * @param in
	 *            InputStream representing a source for paging.
	 */
	public void page(InputStream in) throws IOException {
		// buffer prepared for about 3k
		StringBuilder inbuf = new StringBuilder(3060);

		// int buffering read
		int b = 0;

		while (b != -1) {
			b = in.read();
			if (b != -1) {
				inbuf.append((char) b);
			}
		}

		// now page the string
		page(inbuf.toString());
	}// page(InputStream)

	private void drawNextPage() throws IOException {
		if (mChunkPos == mLastNewChunk) {
			drawNewPage();
		} else {
			mIO.homeCursor();
			mIO.eraseScreen();
			mIO.write(mChunks.get(++mChunkPos));
		}
	}// drawNextPage

	private void drawPreviousPage() throws IOException {
		if (mChunkPos > 0) {
			mIO.homeCursor();
			mIO.eraseScreen();
			mIO.write(mChunks.get(--mChunkPos));
		} else {
			mIO.bell();
			mNoPrompt = true;
		}
	}// drawPreviousPage

	private void drawNewPage() throws IOException {
		// increase counters
		mChunkPos++;
		mLastNewChunk++;
		if (mChunkPos < mChunks.size()) {
			mIO.homeCursor();
			mIO.eraseScreen();
			mIO.write(mChunks.get(mChunkPos));
		} else {
			// flag end
			mEOS = true;
			mNoPrompt = true;
		}
	}// drawNewPage

	private void renderChunks() {
		// prepare with 10 as default, shouldnt be much larger normally
		mChunks = new ArrayList<>(20);
		// prepare a buffer the size of cols + security span
		StringBuilder sbuf = new StringBuilder((mTermCols + 25) * 25);
		int b = 0;
		int cols = 0;
		int rows = 0;
		boolean colorskip = false;

		do {
			// check rows to advance chunks
			if (rows == mTermRows - 1) {
				// add chunk to vector
				mChunks.add(sbuf.toString());
				// replace for new buffer
				sbuf = new StringBuilder((mTermCols + 25) * 25);
				// reset counters
				cols = 0;
				rows = 0;
			}
			// try read next byte
			try {
				b = mSource.read();
			} catch (IOException ioex) {
				b = -1;
			}
			if (b == -1) {
				mChunks.add(sbuf.toString());
				continue; // will end the loop
			} else if (b == ColorHelper.MARKER_CODE || colorskip) {
				// add it, flag right for next byte and skip counting
				sbuf.append((char) b);
				if (!colorskip) {
					colorskip = true;
				} else {
					colorskip = false;
				}
				continue;
			} else if (b == 13) {
				// advance a row
				rows++;
				// reset cols
				cols = 0;
				// append a newline char
				sbuf.append("\n");
				// skip newline if given
				try {
					b = mSource.read();
				} catch (IOException ex) {
					b = -1;
				}
				if (b == -1) {
					continue;
				}
				if (b != 10) {
					sbuf.append((char) b);
				}
				// go into next loop run
				continue;
			} else if (b == 10) {
				// advance a row
				rows++;
				// reset cols
				cols = 0;
				// append a newline char
				sbuf.append("\n");
				continue;
			} else {
				sbuf.append((char) b);
				cols++;
			}

			// check cols to advance rows
			if (cols == mTermCols) {
				rows++;
				// append a newline
				sbuf.append("\n");
				// reset cols!!!
				cols = 0;
			}
		} while (b != -1);
	}// renderChunks

	private boolean terminalGeometryChanged() {
		if (mTermRows != mIO.getRows() || mTermCols != mIO.getColumns()) {
			mTermRows = mIO.getRows();
			mTermCols = mIO.getColumns();
			return true;
		}
		return false;
	}// terminalGeometryChanged
}
