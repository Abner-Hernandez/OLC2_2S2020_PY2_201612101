import Type from './Type';
import Value from'./Value';
import { add_error_E } from './Reports';

class Unary{
    constructor(_id, _type, _row, _col){
        this.id = _id;
        this.type = _type;
        this.row = _row;
        this.column = _col;
    }

    operate(tab, count){
        
        let a = tab.getSymbol(this.id);
        count.putInstruction("//Ejecutando el operador Unario")
        if(a === null){
            //error
            try{ add_error_E( {error: 'No se Encontrado una Operacion Valida.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        let index = count.generateInstruction('P','+',a.pointer);
        let tag = count.getNextTemporal();
        if(a.type_ex === Type.GLOBAL){
            count.putInstruction(tag+' = heap[(int)'+index+'];')
        }else{
            count.putInstruction(tag+' = stack[(int)'+index+'];')
        }
        let aux = tag;
        if(this.type === Type.INCREMENTO){
            count.putInstruction(tag+' = '+tag+' + 1;')
        }else{
            count.putInstruction(tag+' = '+tag+' - 1;')
        }
        
        if(a.type_ex === Type.GLOBAL){
            count.putInstruction('heap[(int)'+index+'] = '+tag+';')
        }else{
            count.putInstruction('stack[(int)'+index+'] = '+tag+';')
        }
        return new Value(aux, a.type, a.type_exp, a.row, a.column);
    }
}

export default Unary;
