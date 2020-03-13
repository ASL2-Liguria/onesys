Option Explicit

If WScript.Arguments.Named.Exists("elevated") = False Then
  CreateObject("Shell.Application").ShellExecute "wscript.exe", """" & WScript.ScriptFullName & """ /elevated", "", "runas", 1
  WScript.Quit
End If

Sub DeleteKeys(ByVal objReg, ByVal intRegistryHive, ByVal strRegistryKey)
	Dim arrSubkeys, strSubkey

	objReg.EnumKey intRegistryHive, strRegistryKey, arrSubkeys
	
	If IsArray(arrSubkeys) Then
		For Each strSubkey In arrSubkeys
			DeleteKeys objReg, intRegistryHive, strRegistryKey & "\" & strSubkey
		Next
	End If

	objReg.DeleteKey intRegistryHive, strRegistryKey
End Sub

Const HCR = &H80000000
Const PATH_ELCO = "elco"
Const FILE_NAME = "run.vbs"

Dim objReg
Dim aSubKey
Dim oWS
Dim pathRun
Dim FSO
Dim fileRun 

Set oWS = WScript.CreateObject("WScript.Shell")
Set objReg = GetObject("winmgmts:\\.\root\default:StdRegProv")
Set FSO = CreateObject("Scripting.FileSystemObject")

pathRun = oWS.ExpandEnvironmentStrings("%ALLUSERSPROFILE%") & "\elco"

If(Not FSO.FolderExists(pathRun)) Then
	FSO.CreateFolder pathRun
End If

pathRun = pathRun & "\" & FILE_NAME

If(FSO.FileExists(pathRun)) Then
	FSO.DeleteFile pathRun, True
End If

Set fileRun = FSO.CreateTextFile(pathRun, True)

fileRun.Write "Option Explicit" & vbCrlf & vbCrlf
fileRun.Write "if(WScript.Arguments.Count > 0) Then" & vbCrlf
fileRun.Write vbTab & "Dim url, objShell, offline, objFS, params" & vbCrlf & vbCrlf
fileRun.Write vbTab & "url = replace(WScript.Arguments.Item(0), ""elco://"", """")" & vbCrlf
fileRun.Write vbTab & "if (InStr(url,""#offline"") > 0) Then" & vbCrlf
fileRun.Write vbTab & vbTab & "offline = """"""-offline"""" """ & vbCrlf
fileRun.Write vbTab & vbTab & "url = replace(url, ""#offline"", """")" & vbCrlf
fileRun.Write vbTab & "end if" & vbCrlf
fileRun.Write vbTab & "params = offline & """""""" & url & """"""""" & vbCrlf
fileRun.Write vbTab & "Set objShell = WScript.CreateObject(""WScript.Shell"")" & vbCrlf
fileRun.Write vbTab & "Set objFS = WScript.CreateObject(""Scripting.FileSystemObject"")" & vbCrlf
fileRun.Write vbTab & "if ( objFS.FileExists(objShell.ExpandEnvironmentStrings( ""%ProgramData%"") & ""\Oracle\Java\javapath\javaws.exe"")) Then" & vbCrlf
fileRun.Write vbTab & vbTab & "objShell.Run(""""""%ProgramData%\Oracle\Java\javapath\javaws.exe"""" "" & params)" & vbCrlf
fileRun.Write vbTab & "else" & vbCrlf
fileRun.Write vbTab & vbTab & "objShell.Run(""""""javaws.exe"""" "" & params)" & vbCrlf
fileRun.Write vbTab & "end if" & vbCrlf

'fileRun.Write vbTab & "Dim i" & vbCrlf
'fileRun.Write vbTab & "i = 0" & vbCrlf
'fileRun.Write vbTab & "Do While i < 10" & vbCrlf
'fileRun.Write vbTab & vbTab & "If(objShell.AppActivate(""Console Java - ElcoWebStart - Componente esterno per stampa, scanner, firma, notifiche"")) Then" & vbCrlf
'fileRun.Write vbTab & vbTab & vbTab & "If(objShell.AppActivate(""FeniX Login"")) Then" & vbCrlf
'fileRun.Write vbTab & vbTab & vbTab & vbTab & "WScript.Sleep 1000" & vbCrlf
'fileRun.Write vbTab & vbTab & vbTab & vbTab & "objShell.SendKeys ""{F5}""" & vbCrlf
'fileRun.Write vbTab & vbTab & vbTab & "End If" & vbCrlf
'fileRun.Write vbTab & vbTab & vbTab & "Exit Do" & vbCrlf
'fileRun.Write vbTab & vbTab & "End If" & vbCrlf
'fileRun.Write vbTab & vbTab & "i = i + 1" & vbCrlf
'fileRun.Write vbTab & vbTab & "WScript.Sleep 1000" & vbCrlf
'fileRun.Write vbTab & "Loop" & vbCrlf

fileRun.Write vbTab & "Set objShell = Nothing" & vbCrlf
fileRun.Write "end if"

fileRun.Close

objReg.EnumKey HCR, PATH_ELCO, aSubKey

DeleteKeys objReg, HCR, PATH_ELCO

objReg.CreateKey HCR, PATH_ELCO
objReg.CreateKey HCR, PATH_ELCO & "\DefaultIcon"
objReg.CreateKey HCR, PATH_ELCO & "\Shell"
objReg.CreateKey HCR, PATH_ELCO & "\Shell\Open"
objReg.CreateKey HCR, PATH_ELCO & "\Shell\Open\Command"

objReg.SetStringValue HCR, PATH_ELCO, , "URL:elco protocol"
objReg.SetStringValue HCR, PATH_ELCO, "URL Protocol", ""
objReg.SetExpandedStringValue HCR, PATH_ELCO & "\Shell\Open\Command", , """%SystemRoot%\System32\WScript.exe"" ""%ALLUSERSPROFILE%\elco\run.vbs"" ""%1"""

'Credo non sia necessario
'If(oWS.AppActivate("FeniX Login")) Then
'	WScript.Sleep 1500
'	oWS.SendKeys "{F5}"
'End If

Set oWS = Nothing
Set objReg = Nothing
Set FSO = Nothing