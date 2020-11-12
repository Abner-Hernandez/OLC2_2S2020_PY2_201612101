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

    operate(tab, count) {
        let s = new SymbolTable(tab);
        count.putInstruction('//Generando el For');
        if(this.declaration !== null){
            this.declaration.operate(s, count);
        }
        
        
        let tagin = count.getNextLabel();
        count.putInstruction(tagin+':');
        
        let r = this.exp.operate(s, count);
        if (r === null) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        if (r.type !== Type.BOOL) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        let e = count.generateIf(r.value,'==',0);
        count.pushFinal(e);
        let c = count.getNextLabel();
        count.pushInit(c);
        for(let i = 0; i<this.body.length; i++){
            this.body[i].operate(s, count)
        }
        
        if(this.assignment !== null){
            count.putInstruction(c+':');
            this.assignment.operate(s, count);
        }
        
        count.putInstruction('goto '+tagin+';');
        count.putInstruction(e+':');
        count.popInit();
        count.popFinal();
        return null;
    }
}
export default For;