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
package elco.telnetd.io;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.io.terminal.Terminal;
import elco.telnetd.io.terminal.TerminalManager;
import elco.telnetd.net.Connection;
import elco.telnetd.net.ConnectionData;
import elco.telnetd.net.ConnectionEvent;

/**
 * Class for Terminal specific I/O. It represents the layer between the application layer and the generic telnet I/O. Terminal specific I/O is achieved via pluggable terminal
 * classes
 *
 * @see elco.telnetd.io.TelnetIO
 * @see elco.telnetd.io.terminal.Terminal
 */
public class TerminalIO implements BasicTerminalIO {

	private static Logger log = LoggerFactory.getLogger(TerminalIO.class);
	private TelnetIO mTelnetIO; // low level I/O

	private final Connection mConnection; // the connection this instance is working for
	private final ConnectionData mConnectionData; // holds data of the connection
	private Terminal mTerminal; // active terminal object

	// Members
	private boolean mAcousticSignalling; // flag for accoustic signalling
	private boolean mAutoflush; // flag for autoflushing mode
	private boolean mForceBold; // flag for forcing bold output
	private boolean mLineWrapping;

	/** Constants Declaration **********************************************/

	/**
	 * Terminal independent representation constants for terminal functions.
	 */
	public static final int[] HOME = { 0, 0 }; // NOSONAR

	public static final int IOERROR = -1; // IO error
	public static final int UP = 1001; // one up
	public static final int DOWN = 1002; // one down
	public static final int RIGHT = 1003; // one left
	public static final int LEFT = 1004; // one right
	// HOME=1005, //Home cursor pos(0,0)

	public static final int STORECURSOR = 1051; // store cursor position + attributes
	public static final int RESTORECURSOR = 1052; // restore cursor + attributes

	public static final int EEOL = 1100; // erase to end of line
	public static final int EBOL = 1101; // erase to beginning of line
	public static final int EEL = 1103; // erase entire line
	public static final int EEOS = 1104; // erase to end of screen
	public static final int EBOS = 1105; // erase to beginning of screen
	public static final int EES = 1106; // erase entire screen

	public static final int ESCAPE = 1200; // Escape
	public static final int BYTEMISSING = 1201; // another byte needed
	public static final int UNRECOGNIZED = 1202; // escape match missed

	public static final int ENTER = 1300; // LF is ENTER at the moment
	public static final int TABULATOR = 1301; // Tabulator
	public static final int DELETE = 1302; // Delete
	public static final int BACKSPACE = 1303; // BACKSPACE
	public static final int COLORINIT = 1304; // Color initiated
	public static final int HANDLED = 1305;
	public static final int LOGOUTREQUEST = 1306; // CTRL-D beim login

	/**
	 * Internal UpdateType Constants
	 */
	public static final int LINEUPDATE = 475;
	public static final int CHARACTERUPDATE = 476;
	public static final int SCREENPARTUPDATE = 477;

	/**
	 * Internal BufferType Constants
	 */
	public static final int EDITBUFFER = 575;
	public static final int LINEEDITBUFFER = 576;

	/**
	 * Network Virtual Terminal Specific Keys Thats what we have to offer at least.
	 */
	public static final int BEL = 7;
	public static final int BS = 8;
	public static final int DEL = 127;
	public static final int CR = 13;
	public static final int LF = 10;

	public static final int FCOLOR = 10001;
	public static final int BCOLOR = 10002;
	public static final int STYLE = 10003;
	public static final int RESET = 10004;
	public static final int BOLD = 1;
	public static final int BOLD_OFF = 22;
	public static final int ITALIC = 3;
	public static final int ITALIC_OFF = 23;
	public static final int BLINK = 5;
	public static final int BLINK_OFF = 25;
	public static final int UNDERLINED = 4;
	public static final int UNDERLINED_OFF = 24;
	public static final int DEVICERESET = 10005;
	public static final int LINEWRAP = 10006;
	public static final int NOLINEWRAP = 10007;

	/** end Constants Declaration ******************************************/

	/**
	 * Constructor of the TerminalIO class.
	 *
	 * @param con
	 *            Connection the instance will be working for
	 */
	public TerminalIO(Connection con) {
		mConnection = con;
		mAcousticSignalling = true;
		mAutoflush = true;

		// store the associated ConnectionData instance
		mConnectionData = mConnection.getConnectionData();
		try {
			// create a new telnet io
			mTelnetIO = new TelnetIO();
			mTelnetIO.setConnection(con);
			mTelnetIO.initIO();
		} catch (Exception ex) {
			log.error("", ex);
		}

		// set default terminal
		try {
			setDefaultTerminal();
		} catch (Exception ex) {
			log.error("TerminalIO()", ex);
		}
	}// constructor

	/************************************************************************
	 * Visible character I/O methods *
	 ************************************************************************/

	/**
	 * Read a single character and take care for terminal function calls.
	 *
	 * @return
	 * 		<ul>
	 *         <li>character read
	 *         <li>IOERROR in case of an error
	 *         <li>DELETE,BACKSPACE,TABULATOR,ESCAPE,COLORINIT,LOGOUTREQUEST
	 *         <li>UP,DOWN,LEFT,RIGHT
	 *         </ul>
	 */
	@Override
	public synchronized int read() throws IOException {
		int i = mTelnetIO.read();
		// translate possible control sequences
		i = mTerminal.translateControlCharacter(i);

		// catch & fire a logoutrequest event
		if (i == LOGOUTREQUEST) {
			mConnection.processConnectionEvent(new ConnectionEvent(mConnection, ConnectionEvent.CONNECTION_LOGOUTREQUEST));
			i = HANDLED;
		} else if (i > 256 && i == ESCAPE) {
			// translate an incoming escape sequence
			i = handleEscapeSequence(i);
		}

		// return i holding a char or a defined special key
		return i;
	}// read

	@Override
	public synchronized void write(byte b) throws IOException {
		mTelnetIO.write(b);
		if (mAutoflush) {
			flush();
		}
	}// write

	@Override
	public synchronized void write(char ch) throws IOException {
		mTelnetIO.write(ch);
		if (mAutoflush) {
			flush();
		}
	}// write(char)

	@Override
	public synchronized void write(String str) throws IOException {
		if (mForceBold) {
			mTelnetIO.write(mTerminal.formatBold(str));
		} else {
			mTelnetIO.write(mTerminal.format(str));
		}
		if (mAutoflush) {
			flush();
		}
	}// write(String)

	/*** End of Visible character I/O methods ******************************/

	/**
	 * ********************************************************************* Erase methods * **********************************************************************
	 */

	@Override
	public synchronized void eraseToEndOfLine() throws IOException {
		doErase(EEOL);
	}// eraseToEndOfLine

	@Override
	public synchronized void eraseToBeginOfLine() throws IOException {
		doErase(EBOL);
	}// eraseToBeginOfLine

	@Override
	public synchronized void eraseLine() throws IOException {
		doErase(EEL);
	}// eraseLine

	@Override
	public synchronized void eraseToEndOfScreen() throws IOException {
		doErase(EEOS);
	}// eraseToEndOfScreen

	@Override
	public synchronized void eraseToBeginOfScreen() throws IOException {
		doErase(EBOS);
	}// eraseToBeginOfScreen

	@Override
	public synchronized void eraseScreen() throws IOException {
		doErase(EES);
	}// eraseScreen

	private synchronized void doErase(int funcConst) throws IOException {
		mTelnetIO.write(mTerminal.getEraseSequence(funcConst));
		if (mAutoflush) {
			flush();
		}
	}

	/*** End of Erase methods **********************************************/

	/**
	 * ********************************************************************* Cursor related methods * **********************************************************************
	 */

	@Override
	public synchronized void moveCursor(int direction, int times) throws IOException {
		mTelnetIO.write(mTerminal.getCursorMoveSequence(direction, times));
		if (mAutoflush) {
			flush();
		}
	}// moveCursor

	@Override
	public synchronized void moveLeft(int times) throws IOException {
		moveCursor(LEFT, times);
	}// moveLeft

	@Override
	public synchronized void moveRight(int times) throws IOException {
		moveCursor(RIGHT, times);
	}// moveRight

	@Override
	public synchronized void moveUp(int times) throws IOException {
		moveCursor(UP, times);
	}// moveUp

	@Override
	public synchronized void moveDown(int times) throws IOException {
		moveCursor(DOWN, times);
	}// moveDown

	@Override
	public synchronized void setCursor(int row, int col) throws IOException {
		int[] pos = new int[2];
		pos[0] = row;
		pos[1] = col;
		mTelnetIO.write(mTerminal.getCursorPositioningSequence(pos));
		if (mAutoflush) {
			flush();
		}
	}// setCursor

	@Override
	public synchronized void homeCursor() throws IOException {
		mTelnetIO.write(mTerminal.getCursorPositioningSequence(HOME));
		if (mAutoflush) {
			flush();
		}
	}// homeCursor

	@Override
	public synchronized void storeCursor() throws IOException {
		mTelnetIO.write(mTerminal.getSpecialSequence(STORECURSOR));
	}// store Cursor

	@Override
	public synchronized void restoreCursor() throws IOException {
		mTelnetIO.write(mTerminal.getSpecialSequence(RESTORECURSOR));
	}// restore Cursor

	/*** End of cursor related methods **************************************/

	/**
	 * ********************************************************************* Special terminal function methods *
	 * **********************************************************************
	 */

	@Override
	public synchronized void setSignalling(boolean bool) {
		mAcousticSignalling = bool;
	}// setAcousticSignalling

	@Override
	public synchronized boolean isSignalling() {
		return mAcousticSignalling;
	}// isAcousticSignalling

	/**
	 * Method to write the NVT defined BEL onto the stream. If signaling is off, the method simply returns, without any action.
	 */
	@Override
	public synchronized void bell() throws IOException {
		if (mAcousticSignalling) {
			mTelnetIO.write(BEL);
		}
		if (mAutoflush) {
			flush();
		}
	}// bell

	/**
	 * EXPERIMENTAL, not defined in the interface.
	 */
	@Override
	public synchronized boolean defineScrollRegion(int topmargin, int bottommargin) throws IOException {
		if (mTerminal.supportsScrolling()) {
			mTelnetIO.write(mTerminal.getScrollMarginsSequence(topmargin, bottommargin));
			flush();
			return true;
		}
		return false;
	}// defineScrollRegion

	@Override
	public synchronized void setForegroundColor(int color) throws IOException {
		if (mTerminal.supportsSGR()) {
			mTelnetIO.write(mTerminal.getGRSequence(FCOLOR, color));
			if (mAutoflush) {
				flush();
			}
		}
	}// setForegroundColor

	@Override
	public synchronized void setBackgroundColor(int color) throws IOException {
		if (mTerminal.supportsSGR()) {
			// this method adds the offset to the fg color by itself
			mTelnetIO.write(mTerminal.getGRSequence(BCOLOR, color + 10));
			if (mAutoflush) {
				flush();
			}
		}
	}// setBackgroundColor

	@Override
	public synchronized void setBold(boolean b) throws IOException {
		if (mTerminal.supportsSGR()) {
			if (b) {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, BOLD));
			} else {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, BOLD_OFF));
			}
			if (mAutoflush) {
				flush();
			}
		}
	}// setBold

	@Override
	public synchronized void forceBold(boolean b) {
		mForceBold = b;
	}// forceBold

	@Override
	public synchronized void setUnderlined(boolean b) throws IOException {
		if (mTerminal.supportsSGR()) {
			if (b) {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, UNDERLINED));
			} else {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, UNDERLINED_OFF));
			}
			if (mAutoflush) {
				flush();
			}

		}
	}// setUnderlined

	@Override
	public synchronized void setItalic(boolean b) throws IOException {
		if (mTerminal.supportsSGR()) {
			if (b) {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, ITALIC));
			} else {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, ITALIC_OFF));
			}
			if (mAutoflush) {
				flush();
			}
		}
	}// setItalic

	@Override
	public synchronized void setBlink(boolean b) throws IOException {
		if (mTerminal.supportsSGR()) {
			if (b) {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, BLINK));
			} else {
				mTelnetIO.write(mTerminal.getGRSequence(STYLE, BLINK_OFF));
			}
			if (mAutoflush) {
				flush();
			}
		}
	}// setItalic

	@Override
	public synchronized void resetAttributes() throws IOException {
		if (mTerminal.supportsSGR()) {
			mTelnetIO.write(mTerminal.getGRSequence(RESET, 0));
		}
	}// resetGR

	/*** End of special terminal function methods ***************************/

	/************************************************************************
	 * Auxiliary I/O methods *
	 ************************************************************************/

	/**
	 * Method that parses forward for escape sequences
	 */
	private int handleEscapeSequence(int i) throws IOException {
		if (i == ESCAPE) {
			int[] bytebuf = new int[mTerminal.getAtomicSequenceLength()];
			// fill atomic length
			// FIXME: ensure CAN, broken Escapes etc.
			for (int m = 0; m < bytebuf.length; m++) {
				bytebuf[m] = mTelnetIO.read();
			}
			return mTerminal.translateEscapeSequence(bytebuf);
		}
		if (i == BYTEMISSING) {
			// FIXME:longer escapes etc...
		}

		return HANDLED;
	}// handleEscapeSequence

	/**
	 * Accessor method for the autoflushing mechanism.
	 */
	@Override
	public boolean isAutoflushing() {
		return mAutoflush;
	}// isAutoflushing

	@Override
	public synchronized void resetTerminal() throws IOException {
		mTelnetIO.write(mTerminal.getSpecialSequence(DEVICERESET));
	}

	@Override
	public synchronized void setLinewrapping(boolean b) throws IOException {
		if (b && !mLineWrapping) {
			mTelnetIO.write(mTerminal.getSpecialSequence(LINEWRAP));
			mLineWrapping = true;
			return;
		}
		if (!b && mLineWrapping) {
			mTelnetIO.write(mTerminal.getSpecialSequence(NOLINEWRAP));
			mLineWrapping = false;
			return;
		}
	}// setLineWrapping

	@Override
	public boolean isLineWrapping() {
		return mLineWrapping;
	}//

	/**
	 * Mutator method for the autoflushing mechanism.
	 */
	@Override
	public synchronized void setAutoflushing(boolean b) {
		mAutoflush = b;
	}// setAutoflushing

	/**
	 * Method to flush the Low-Level Buffer
	 */
	@Override
	public synchronized void flush() throws IOException {
		mTelnetIO.flush();
	}// flush (implements the famous iToilet)

	@Override
	public synchronized void close() {
		mTelnetIO.closeOutput();
		mTelnetIO.closeInput();
	}// close

	/*** End of Auxiliary I/O methods **************************************/

	/************************************************************************
	 * Terminal management specific methods *
	 ************************************************************************/

	/**
	 * Accessor method to get the active terminal object
	 *
	 * @return Object that implements Terminal
	 */
	public Terminal getTerminal() {
		return mTerminal;
	}// getTerminal

	/**
	 * Sets the default terminal ,which will either be the negotiated one for the connection, or the systems default.
	 */
	@Override
	public void setDefaultTerminal() throws IOException {
		// set the terminal passing the negotiated string
		setTerminal(mConnectionData.getNegotiatedTerminalType());
	}// setDefaultTerminal

	/**
	 * Mutator method to set the active terminal object If the String does not name a terminal we support then the vt100 is the terminal of selection automatically.
	 *
	 * @param terminalName
	 *            String that represents common terminal name
	 */
	@Override
	public void setTerminal(String terminalName) throws IOException {
		mTerminal = TerminalManager.getReference().getTerminal(terminalName);
		// Terminal is set we init it....
		initTerminal();
		// debug message
		log.debug("Set terminal to " + mTerminal.toString());
	}// setTerminal

	/**
	 * Terminal initialization
	 */
	private synchronized void initTerminal() throws IOException {
		mTelnetIO.write(mTerminal.getInitSequence());
		flush();
	}// initTerminal

	/**
	 *
	 */
	@Override
	public int getRows() {
		return mConnectionData.getTerminalRows();
	}// getRows

	/**
	 *
	 */
	@Override
	public int getColumns() {
		return mConnectionData.getTerminalColumns();
	}// getColumns

	/**
	 * Accessor Method for the terminal geometry changed flag
	 */
	public boolean isTerminalGeometryChanged() {
		return mConnectionData.isTerminalGeometryChanged();
	}// isTerminalGeometryChanged

	/*** End of terminal management specific methods ***********************/
}
