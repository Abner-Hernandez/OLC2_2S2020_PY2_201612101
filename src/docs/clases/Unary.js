import Count from'./Counters';
import Type from './Type';
import { add_error_E } from './Reports';

class Unary{
    constructor(_id, _type, _row, _col){
        this.id = _id;
        this.type = _type;
        this.row = _row;
        this.column = _col;
    }

    operate(tab){
        let count = new Count();
        var a = tab.getSymbol(this.id);
        if(a === null){
            //error
            try{ add_error_E( {error: 'No se Encontrado una Operacion Valida.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        var index = count.generateInstruction('P','+',a.pointer);
        var tag = count.getNextTemporal();
        if(a.type_ex === Type.GLOBAL){
            count.putInstruction(tag+' = heap['+index+'];')
        }else{
            count.putInstruction(tag+' = stack['+index+'];')
        }
        if(this.type === Type.INCREMENTO){
            count.putInstruction(tag+' = '+tag+' + 1;')
        }else{
            count.putInstruction(tag+' = '+tag+' - 1;')
        }
        
        if(a.type_ex === Type.GLOBAL){
            count.putInstruction('heap['+index+'] = '+tag+';')
        }else{
            count.putInstruction('stack['+index+'] = '+tag+';')
        }
        
        return null;
    }
}

export default Unary;
