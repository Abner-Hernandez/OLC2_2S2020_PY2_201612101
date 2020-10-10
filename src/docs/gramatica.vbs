Set objShell = WScript.CreateObject("WScript.Shell")
intReturn = objShell.Run("jison grammar.jison", 1, true)
If intReturn <> 0 Then 
   Wscript.Echo "Error running program"
End If

Const ForReading = 1
Const ForWriting = 2
Const FileIn = "grammar.js"
Const FileOut = "grammar.js"

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile(FileIn, ForReading)

strText = objFile.ReadAll
objFile.Close

strNewText = Replace(strText,"var grammar","import { add_error_T } from './clases/Reports';" & vbCrLf &"import { add_simbol_T } from './clases/Reports';" & vbCrLf & "export var grammar" )

Set objFile = objFSO.OpenTextFile(FileOut, ForWriting)
objFile.WriteLine strNewText
objFile.Close