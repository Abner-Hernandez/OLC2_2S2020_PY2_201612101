import Value from'./Value';
import Type from './Type';
import { add_error_E } from './Reports';
class Relational {
    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab, count){
        
        let tempL = null;
        let tempR = null;
        if (this.node_right !== null) {
            tempR = this.node_right.operate(tab, count);
        }

        if (this.node_left !== null) {
            tempL = this.node_left.operate(tab, count);
        }

        if (tempR !== null && tempL !== null) {
            if (tempR.type_exp === Type.VALOR && tempL.type_exp === Type.VALOR) {
                if (tempL.type === Type.ENTERO && tempR.type === Type.ENTERO) {
                    if (this.type === Type.IDENTICO) {
                        return new Value(count.operateRelational(tempL.value,'==', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.DIFERENTE) {
                        return new Value(count.operateRelational(tempL.value,'!=', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.MAYOR) {
                        return new Value(count.operateRelational(tempL.value,'>', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.MENOR) {
                        return new Value(count.operateRelational(tempL.value,'<', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.MAYORIGUAL) {
                        return new Value(count.operateRelational(tempL.value,'>=', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.MENORIGUAL) {
                        return new Value(count.operateRelational(tempL.value,'<=', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.CADENA) {
                    if (this.type === Type.IDENTICO) {
                        return new Value(count.operateRelational(tempL.value,'==', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.DIFERENTE) {
                        return new Value(count.operateRelational(tempL.value,'!=', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.REFERECIA) {
                        return new Value(count.operateRelational(tempL.value,'>', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    }
                } else if (tempL.type === Type.BOOL && tempR.type === Type.BOOL) {
                    if (this.type === Type.IDENTICO) {
                        return new Value(count.operateRelational(tempL.value, '==', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    } else if (this.type === Type.DIFERENTE) {
                        return new Value(count.operateRelational(tempL.value,'!=', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                    }
                }
            }

        }
        try{ add_error_E( {error: 'Operacion no permitida '+this.type, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        return null;
    }


}
export default Relational;