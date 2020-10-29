import Count from'./Counters';
import Type from './Type';
import Value from './Value';
import { add_error_E } from './Reports';

class Logical {
    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab, count) {
        //var count = new Count();
        var tempL = null;
        var tempR = null;
        /*var tf = '';
        if (count.getTagsSize() === 0) {
            tf = count.getNextLabel();
            //count.pushTagsvf(tf);
        } else {
            tf = count.getTagsvf();
            //count.pushTagsvf(tf);
        }*/
        if (this.node_right !== null) {
            tempR = this.node_right.operate(tab, count);
        }

        if (this.node_left !== null) {
            tempL = this.node_left.operate(tab, count);
        }

        if (tempR !== null && tempL !== null) {
            if (tempL.type_exp === Type.VALOR && tempR.type_exp === Type.VALOR) {
                if (tempL.type === Type.BOOL && tempR.type === Type.BOOL) {
                    if (null !== this.type) {
                        var tf = count.getNextLabel();
                        var to = count.getNextLabel();
                        var t1 = count.getNextTemporal();
                        switch (this.type) {
                            case Type.AND:
                                //return new Value(tempL.value && tempR.value, Type.BOOL, Type.VALOR, this.row, this.column);
                                //return new Value(count.generateInstruction(tempL.value, '&&', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);

                                count.putInstruction('if(' + tempL.value + ' != 1) goto ' + tf + ';');
                                count.putInstruction('if(' + tempR.value + ' != 1) goto ' + tf + ';');
                                //count.popTagsvf()
                                /*if (count.getTagsSize() === 0) {
                                    var to = count.getNextLabel();
                                    count.putInstruction(t1 + ' = 1' + ';');
                                    count.putInstruction('goto ' + to + ';');
                                    count.putInstruction(tf + ':');
                                    count.putInstruction(t1 + ' = 0' + ';');
                                    count.putInstruction(to + ':');
                                    return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                                }*/
                                count.putInstruction(t1 + ' = 1' + ';');
                                count.putInstruction('goto ' + to + ';');
                                count.putInstruction(tf + ':');
                                count.putInstruction(t1 + ' = 0' + ';');
                                count.putInstruction(to + ':');
                                return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                            case Type.OR:
                                //return new Value(tempL.value || tempR.value, Type.BOOL, Type.VALOR, this.row, this.column);
                                //return new Value(count.generateInstruction(tempL.value, '||', tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                                count.putInstruction('if(' + tempL.value + ' == 1) goto ' + tf + ';');
                                count.putInstruction('if(' + tempR.value + ' == 1) goto ' + tf + ';');
                                //count.popTagsvf()
                                /*if (count.getTagsSize() === 0) {
                                    var to = count.getNextLabel();
                                    count.putInstruction(t1 + ' = 0' + ';');
                                    count.putInstruction('goto ' + to + ';');
                                    count.putInstruction(tf + ':');
                                    count.putInstruction(t1 + ' = 1' + ';');
                                    count.putInstruction(to + ':');
                                    return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                                }*/
                                count.putInstruction(t1 + ' = 0' + ';');
                                count.putInstruction('goto ' + to + ';');
                                count.putInstruction(tf + ':');
                                count.putInstruction(t1 + ' = 1' + ';');
                                count.putInstruction(to + ':');
                                return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                            case Type.XOR:
                                //return new Value(!(tempL.value === tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                                //return new Value(count.generateInstruction(!(tempL.value, '==', tempR.value)), Type.BOOL, Type.VALOR, this.row, this.column);
                                count.putInstruction('if(' + tempL.value + ' != ' + tempR.value + ') goto ' + tf + ';');
                                //count.popTagsvf()
                                /*if (count.getTagsSize() === 0) {
                                    var to = count.getNextLabel();
                                    count.putInstruction(t1 + ' = 0' + ';');
                                    count.putInstruction('goto ' + to + ';');
                                    count.putInstruction(tf + ':');
                                    count.putInstruction(t1 + ' = 1' + ';');
                                    count.putInstruction(to + ':');
                                    return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                                }*/
                                count.putInstruction(t1 + ' = 0' + ';');
                                count.putInstruction('goto ' + to + ';');
                                count.putInstruction(tf + ':');
                                count.putInstruction(t1 + ' = 1' + ';');
                                count.putInstruction(to + ':');
                                return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                            default:
                                break;
                        }
                    }
                    //olc2_p1.IDE.txtExec += "Error Semantico, No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida. Linea: " + this.row + " Columna: " + this.column + "\n";
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }
        } else if (tempR === null && tempL !== null) {
            if (tempL.type_exp === Type.VALOR) {
                if (this.type === Type.NOT) {
                    var tf = count.getNextLabel();
                    var to = count.getNextLabel();
                    var t1 = count.getNextTemporal();
                    count.putInstruction('if(' + tempL.value + ' == 1) goto ' + tf + ';');

                    count.putInstruction(t1 + ' = 1' + ';');
                    count.putInstruction('goto ' + to + ';');
                    count.putInstruction(tf + ':');
                    count.putInstruction(t1 + ' = 0' + ';');
                    count.putInstruction(to + ':');
                    /*if (tempL.value === true) {
                        //count.popTagsvf()
                        return new Value(0, Type.BOOL, Type.VALOR, this.row, this.column);
                    } else {
                        //count.popTagsvf()
                        return new Value(1, Type.BOOL, Type.VALOR, this.row, this.column);
                    }*/
                    return new Value(t1, Type.BOOL, Type.VALOR, this.row, this.column);
                }
            }
            //count.popTagsvf()
            //olc2_p1.IDE.txtExec += "Error Semantico, No se puede ejecutar la operacion " + type.toString() + ", No reconocida o No Permitida. Linea: " + row + " Columna: " + column + "\n";
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
        return null;
    }

}
export default Logical;