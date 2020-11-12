Set objShell = WScript.CreateObject("WScript.Shell")
intReturn = objShell.Run("jison c3dBlock.jison", 1, true)
If intReturn <> 0 Then 
   Wscript.Echo "Error running program"
End If

Const ForReading = 1
Const ForWriting = 2
Const FileIn = "c3dBlock.js"
Const FileOut = "c3dBlock.js"

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile(FileIn, ForReading)

strText = objFile.ReadAll
objFile.Close

strNewText = Replace(strText,"var c3dBlock","import InstructionTab from './optimize/InstructionTab';" & vbCrLf &"import Instruction from './optimize/Instruction';" & vbCrLf &"import Type from './optimize/Type';" & vbCrLf & "import { add_console } from './clases/Reports';" & vbCrLf & "export var c3dBlock" )

Set objFile = objFSO.OpenTextFile(FileOut, ForWriting)
objFile.WriteLine strNewText
objFile.Close