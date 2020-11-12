import Type from './Type';
import SymbolTable from './SymbolTable';
import { add_error_E } from './Reports';

class DoWhile {
    constructor(e, c, _row, _column) {
        this.row = _row;
        this.column = _column;
        this.exp = e;
        this.body = c;
    }

    operate(tab, count) {
        let init = count.getNextLabel();
        count.putInstruction('//Iniciando el Do While');
        count.putInstruction(init + ':');
        count.pushInit(init);
        let s = new SymbolTable(tab);
        let r = this.exp.operate(tab, count);
        let l = count.getNextLabel();
        count.pushFinal(l);
        if (r === null) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        if (r.type !== Type.BOOL) {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        
        for (let i = 0; i < this.body.length; i++) {

            this.body[i].operate(s, count);
        }

        count.generateIf2(r.value,'==',0,l);
        //count.pushFinal(aux);
        count.putInstruction('goto ' + init + ';');
        count.putInstruction(l + ':');
        count.popFinal();
        count.popInit();
        count.putInstruction('');
        return null;
    }
}
export default DoWhile;