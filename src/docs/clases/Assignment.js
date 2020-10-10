import Count from'./Counters';
import Type from './Type';
import { add_error_E } from './Reports';

class Assignment {
    constructor(_id, val, _row, _column) {
        this.value = val;
        this.id = _id;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        var count = new Count();
        var a = tab.getSymbol(this.id[0].value);
        var tmpExp;
        count.putInstruction('##Iniciando la Asignacion de ' + this.id[0].value);
        if (!(Array.isArray(this.value))) {
            tmpExp = this.value.operate(tab);
        } else {
            tmpExp = this.value[0].operate(tab);
        }
        if (tmpExp !== null) {
            if (a === null) {
                try{ add_error_E( {error: "Variable " + this.id[0] + " no encontrada.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            } else {
                if (a.type_c === Type.CONST) {
                    try{ add_error_E( {error: 'No se puede asignar VALOR a ' + a.id + ' por que es de tipo CONSTANTE.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                }
                if (this.checkType(tmpExp, a.type, count)) {
                    return null;
                }
                a.type_exp = tmpExp.type_exp;
                a.type = tmpExp.type;
                var t = count.getNextTemporal();
                if (a.type_var === Type.GLOBAL) {
                    count.putInstruction('heap[' + a.tag + '] = ' + tmpExp.value + ';');
                } else {
                    count.putInstruction(t + ' = P + ' + a.pointer + ';');
                    count.putInstruction('stack[' + t + '] = ' + tmpExp.value + ';');
                }

            }
        } else {
            try{ add_error_E( {error: "Hubo un error al realizar la asignacion de la variable " + this.id[0] + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
        return null;
    }

    checkType(val, type, cont) {
        switch (type) {
            case Type.ENTERO:
                if (val.type === Type.ENTERO) {
                    return false;
                } else if (val.type === Type.CARACTER) {
                    val.type = Type.ENTERO;
                    return false;
                } else {
                    try{ add_error_E( {error: 'Tipo de la EXPRESION ' + val.type + ' No Asignable a un ENTERO.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return true;
                }
                break;
            case Type.DECIMAL:
                if (val.type === Type.DECIMAL) {
                    return false;
                } else if (val.type === Type.ENTERO) {
                    val.type = Type.DECIMAL;
                    return false;
                } else if (val.type === Type.CARACTER) {
                    val.type = Type.DECIMAL;
                    return false;
                } else {
                    try{ add_error_E( {error: 'Tipo de la EXPRESION ' + val.typ + ' No Asignable a un DOUBLE.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return true;
                }
                break;
            case Type.CARACTER:
                if (val.type !== Type.CARACTER) {
                    try{ add_error_E( {error: 'Tipo de la EXPRESION ' + val.type + ' No Asignable a un CARACTER.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return true;
                }
        }
        return false;
    }
}

export default Assignment;