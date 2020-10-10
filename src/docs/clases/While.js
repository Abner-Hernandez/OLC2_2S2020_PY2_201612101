import Count from'./Counters';
import Type from './Type';
import SymbolTable from './SymbolTable';
import { add_error_E } from './Reports';

class While {
    constructor(e, c, _row, _column) {
        this.row = _row;
        this.column = _column;
        this.exp = e;
        this.body = c;
    }

    operate(tab) {
        var count = new Count();
        var init = count.getNextLabel();
        count.putInstruction(init + ':');
        var r = this.exp.operate(tab);
        
        if (r === null) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        if (r.type !== Type.BOOL) {
            //olc2_p1.IDE.txtExec += "Error Sintactico, No se puede ejecutar la operacion " + aux.type.toString() + ", se necesita una condicion logica o relacional. Linea: " + row + " Columna: " + column + "\n";
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
        
        var aux = count.generateIf(r.value,'==',0);
        count.pushFinal(aux);
        count.pushInit(init);
        var s = new SymbolTable(tab);
        //for (int i = 0; i < body.size(); i++) {
        for (var i = 0; i < this.body.length; i++) {

            this.body[i].operate(s);
        }

        count.putInstruction('goto ' + init + ';');
        count.putInstruction(aux + ':');
        count.popInit();
        count.popFinal();

        return null;
    }
}
export default While;