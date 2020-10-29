import Count from'./Counters';
import Type from './Type';
import Value from './Value';
import { add_error_E } from './Reports';

class Arithmetical {

    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab, count) {
        var tempL = null;
        var tempR = null;
        if (this.node_left != null) {
            if(!(this.node_left instanceof Array)){
                tempL = this.node_left.operate(tab, count);
            }else{
                tempL = this.node_left[0].operate(tab, count);
            }
            
        }

        if (this.node_right != null) {
            if(!(this.node_right instanceof Array)){
                tempR = this.node_right.operate(tab, count);
            }else{
                tempR = this.node_right[0].operate(tab, count);
            }
        }

        /*console.log("izq")
        console.log(this.node_left)
        console.log("der")
        console.log(this.node_right)*/

        if (tempR != null && tempL != null) {
            //var count = new Count();
            if (tempR.type_exp == Type.VALOR && tempL.type_exp == Type.VALOR) {
                if (tempL.type == Type.ENTERO && tempR.type == Type.ENTERO) {
                    if (null != this.type) {
                        
                        switch (this.type) {
                            case Type.SUMA:
                                var ret = count.generateInstruction(tempL.value, '+', tempR.value)
                                return new Value(ret, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                var ret = count.generateInstruction(tempL.value, '-', tempR.value)
                                return new Value(ret, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                var ret = count.generateInstruction(tempL.value, '*', tempR.value)
                                return new Value(ret, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                var ret = count.generateInstruction(tempL.value, '/', tempR.value)
                                return new Value(ret, Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.POTENCIA:
                                var op1 = count.generateInstruction(tempL.value,'', '')
                                var op2 = count.generateInstruction(tempR.value,'', '')
                                var l = count.generateInstruction(op1,'', '')
                                var tagin = count.getNextLabel();
                                var tagout = count.getNextLabel();
                                count.putInstruction(tagin+':');
                                count.putInstruction('if(2 > '+op2+') goto '+tagout+';');
                                count.putInstruction(l+' = '+l+' * '+op1+';');
                                count.putInstruction(op2+' = '+op2+' - 1;');
                                count.putInstruction('goto '+tagin+';');
                                count.putInstruction(tagout+':');
                                return new Value(l, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MODULO:
                                var ret = count.generateInstruction(tempL.value, '%', tempR.value)
                                return new Value(ret, Type.ENTERO, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.ENTERO && tempR.type === Type.DECIMAL) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.DECIMAL && tempR.type === Type.ENTERO) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.ENTERO && tempR.type === Type.CARACTER) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.CARACTER && tempR.type === Type.ENTERO) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.ENTERO && tempR.type === Type.CADENA) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.ENTERO) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.DECIMAL && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.DECIMAL) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.DECIMAL && tempR.type === Type.CARACTER) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.CARACTER && tempR.type === Type.DECIMAL) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.DECIMAL && tempR.type === Type.DECIMAL) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.CARACTER && tempR.type === Type.CARACTER) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(count.generateInstruction(tempL.value, '+', tempR.value), Type.CADENA, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(count.generateInstruction(tempL.value, '-', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(count.generateInstruction(tempL.value, '*', tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(count.generateInstruction(tempL.value, '/', tempR.value), Type.DECIMAL, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.CARACTER && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.CARACTER) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value.toString() + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.BOOL) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value.toString() + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.BOOL && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value.toString() + tempR.value.toString(), Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                }
            }
        }
        try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        return null;
    }

}

export default Arithmetical;