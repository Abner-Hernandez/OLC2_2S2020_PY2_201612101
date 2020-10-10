import Count from'./Counters';
import Type from './Type';
import SymbolTable from './SymbolTable';
import { add_error_E } from './Reports';

class For{
    constructor(_decla, _exp,_assig, _body, _row, _col) {
        this.declaration = _decla;
        this.exp = _exp;
        this.assignment = _assig
        this.body = _body;
        this.row = _row;
        this.column = _col;
    }

    operate(tab) {
        var count = new Count();
        var s = new SymbolTable(tab);
        count.putInstruction('##Generando el For');
        if(this.declaration !== null){
            this.declaration.operate(s);
        }
        
        
        var tagin = count.getNextLabel();
        count.putInstruction(tagin+':');
        
        var r = this.exp.operate(s);
        if (r === null) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        if (r.type !== Type.BOOL) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        var e = count.generateIf(r.value,'==',0);
        count.pushFinal(e);
        var c = count.getNextLabel();
        count.pushInit(c);
        for(var i = 0; i<this.body.length; i++){
            this.body[i].operate(s)
        }
        
        if(this.assignment !== null){
            count.putInstruction(c+':');
            console.log(this.assignment);
            this.assignment.operate(s);
        }
        
        count.putInstruction('goto '+tagin+';');
        count.putInstruction(e+':');
        count.popInit();
        count.popFinal();
        return null;
    }
}
export default For;