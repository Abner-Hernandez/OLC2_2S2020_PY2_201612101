Set objShell = WScript.CreateObject("WScript.Shell")
intReturn = objShell.Run("jison ast.jison", 1, true)
If intReturn <> 0 Then 
   Wscript.Echo "Error running program"
End If

Const ForReading = 1
Const ForWriting = 2
Const FileIn = "ast.js"
Const FileOut = "ast.js"

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile(FileIn, ForReading)

strText = objFile.ReadAll
objFile.Close

strNewText = Replace(strText,"var ast","import Node from './clases/Node';" & vbCrLf & "export var ast" )

Set objFile = objFSO.OpenTextFile(FileOut, ForWriting)
objFile.WriteLine strNewText
objFile.Close