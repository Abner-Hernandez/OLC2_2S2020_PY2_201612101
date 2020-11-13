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
        let tempL = null;
        let tempR = null;
        if (this.node_left != null) {
            if(!(this.node_left instanceof Array)){
                tempL = this.node_left.operate(tab, count);
            }else{
                tempL = this.node_left[0].operate(tab, count);
            }
            if(tempL.type_exp === Type.ARREGLO)
            {
                if(tempL.nDimension === 0)
                {
                    count.putInstruction('//Obteniendo el valor del arreglo')
                    count.putInstruction(tempL.value + ' = heap[(int)' + tempL.value + '];')
                    tempL.type_exp = Type.VALOR;
                }
                else
                {
                    try{ add_error_E( {error: 'No se puede imprimir un arreglo', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }
        }

        if (this.node_right != null) {
            if(!(this.node_right instanceof Array)){
                tempR = this.node_right.operate(tab, count);
            }else{
                tempR = this.node_right[0].operate(tab, count);
            }
            if(tempR.type_exp === Type.ARREGLO)
            {
                if(tempR.nDimension === 0)
                {
                    count.putInstruction('//Obteniendo el valor del arreglo')
                    count.putInstruction(tempR.value + ' = heap[(int)' + tempR.value + '];')
                    tempR.type_exp = Type.VALOR;
                }
                else
                {
                    try{ add_error_E( {error: 'No se puede imprimir un arreglo', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }
        }


        if (tempR != null && tempL != null) {
            if (tempR.type_exp == Type.VALOR && tempL.type_exp == Type.VALOR) {
                if (tempL.type == Type.ENTERO && tempR.type == Type.ENTERO) {
                    if (null != this.type) {
                        
                        switch (this.type) {
                            case Type.SUMA:
                                let rets = count.generateInstruction(tempL.value, '+', tempR.value)
                                return new Value(rets, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                let retr = count.generateInstruction(tempL.value, '-', tempR.value)
                                return new Value(retr, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                let retm = count.generateInstruction(tempL.value, '*', tempR.value)
                                return new Value(retm, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                let retd = count.generateInstruction(tempL.value, '/', tempR.value)
                                return new Value(retd, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.POTENCIA:
                                let a1 = count.getNextTemporal();
                                count.putInstruction(a1 + ' = (int)' + tempL.value + ';');
                                let a2 = count.getNextTemporal();
                                count.putInstruction(a2 + ' = (int)' + tempR.value + ';');

                                let op1 = count.generateInstruction(a1,'', '')
                                let op2 = count.generateInstruction(a2,'', '')
                                let l = count.generateInstruction(op1,'', '')
                                let tagin = count.getNextLabel();
                                let tagout = count.getNextLabel();
                                count.putInstruction(tagin+':');
                                count.putInstruction('if(2 > '+op2+') goto '+tagout+';');
                                count.putInstruction(l+' = '+l+' * '+op1+';');
                                count.putInstruction(op2+' = '+op2+' - 1;');
                                count.putInstruction('goto '+tagin+';');
                                count.putInstruction(tagout+':');
                                return new Value(l, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MODULO:
                                let ret = this.getNextTemporal();
                                count.putInstruction(ret + ' =  fmod(' + tempL.value + ', ' + tempR.value + ');');
                                return new Value(ret, Type.ENTERO, Type.VALOR, this.row, this.column);
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
                                //Convertir numero a cadena
                                let cadena = this.numero_cadena(tempL.value, tempR.value, count, true);
                                return new Value(cadena, Type.CADENA, Type.VALOR, this.row, this.column);
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
                                //Convertir numero a cadena
                                let cadena = this.numero_cadena(tempR.value, tempL.value, count, false);
                                return new Value(cadena, Type.CADENA, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return this.concatenar_cadenas(tempL.value, tempR.value, count);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.CADENA && tempR.type === Type.BOOL) {
                    if (this.type === Type.SUMA) {
                        let a1 = count.getNextTemporal();
                        count.putInstruction(a1 + ' = ' + tempR.value + '+ 48;');
                        return this.concatenar_cadenas(tempL.value, a1, count);
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                } else if (tempL.type === Type.BOOL && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        let a1 = count.getNextTemporal();
                        count.putInstruction(a1 + ' = ' + tempL.value + '+ 48;');
                        return this.concatenar_cadenas(a1, tempR.value, count);                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                }
            }
        }
        try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        return null;
    }

    numero_cadena(numero, cadena, count, first)
    {
        let t = count.getNextTemporal();
        
        count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
        let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
        count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');

        count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
        count.putInstruction(t + ' = '+ tag2 + ' + 1;')

        count.putInstruction('stack[(int)' + t + '] = '+ numero +';');
            
        let tt = count.getRelative();
        count.putInstruction('P = P + ' + tt + ';');
        count.putInstruction('//Insertando la llama a la Funcion number_to_string_3d');
        count.putInstruction('number_to_string_3d();');

        let tag2r = null;
        count.putInstruction('//Verificando si existe retorno.');
        let tag = count.getNextTemporal();
        tag2r = count.getNextTemporal();
        count.putInstruction(tag + ' = P + 0;')
        count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
        count.putInstruction('P = P - ' + tt + ';');

        //llamar a concatenar
        let tc = count.getNextTemporal();
        let tc3 = count.getNextTemporal();
        
        count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
        let tcag2 = count.paramFunc(Type.LOCAL, count.getRelative())
        count.putInstruction('stack[(int)' + tcag2 + '] = 0.0;');

        count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
        count.putInstruction(tc + ' = '+ tcag2 + ' + 1;')

        if(first)
            count.putInstruction('stack[(int)' + tc + '] = '+ tag2r +';');
        else
            count.putInstruction('stack[(int)' + tc + '] = '+ cadena +';');

        
        count.putInstruction('//Insertando los parametros de llamada. Posicion 2');
        count.putInstruction(tc3 + ' = '+ tc + ' + 1;')

        if(first)
            count.putInstruction('stack[(int)' + tc3 + '] = '+ cadena +';');
        else
            count.putInstruction('stack[(int)' + tc3 + '] = '+ tag2r +';');
            
        let tct = count.getRelative();
        count.putInstruction('P = P + ' + tct + ';');
        count.putInstruction('//Insertando la llama a la Funcion Concat_3d_c');
        count.putInstruction('Concat_3d_c();');

        let tcag2r = null;
        count.putInstruction('//Verificando si existe retorno.');
        let tcag = count.getNextTemporal();
        tcag2r = count.getNextTemporal();
        count.putInstruction(tcag + ' = P + 0;')
        count.putInstruction(tcag2r + ' = stack[(int)' + tcag + '];')
        count.putInstruction('P = P - ' + tct + ';');
        return tcag2r;
    }

    concatenar_cadenas(cadena1, cadena2, count)
    {
        let t = count.getNextTemporal();
        let t3 = count.getNextTemporal();
        
        count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
        let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
        count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');

        count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
        count.putInstruction(t + ' = '+ tag2 + ' + 1;')            
        count.putInstruction('stack[(int)' + t + '] = '+ cadena1 +';');

        
        count.putInstruction('//Insertando los parametros de llamada. Posicion 2');
        count.putInstruction(t3 + ' = '+ t + ' + 1;')
        count.putInstruction('stack[(int)' + t3 + '] = '+ cadena2 +';');
            
        let tt = count.getRelative();
        count.putInstruction('P = P + ' + tt + ';');
        count.putInstruction('//Insertando la llama a la Funcion Concat_3d_c');
        count.putInstruction('Concat_3d_c();');

        let tag2r = null;
        count.putInstruction('//Verificando si existe retorno.');
        let tag = count.getNextTemporal();
        tag2r = count.getNextTemporal();
        count.putInstruction(tag + ' = P + 0;')
        count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
        count.putInstruction('P = P - ' + tt + ';');

        return new Value(tag2r, Type.CADENA, Type.VALOR, this.row, this.column);
    }

}

export default Arithmetical;