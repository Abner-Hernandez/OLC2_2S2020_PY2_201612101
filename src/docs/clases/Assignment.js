import Type from './Type';
import { add_error_E } from './Reports';
import Value from './Value';

class Assignment {
    constructor(_id, val, _row, _column) {
        this.value = val;
        this.id = _id;
        this.row = _row;
        this.column = _column;
    }

    operate(tab, count) {
        //var count = new Count();
        if(this.id instanceof(Array))
        {
            if(this.id.length > 1)
            {
                if(this.id[this.id.length-1].id === ".pop()" || this.id[this.id.length-1].value === "reslength" || this.id[this.id.length-1].value === ".Concat()" || this.id[this.id.length-1].value === ".charAt()" || this.id[this.id.length-1].value === ".toLowerCase()" || this.id[this.id.length-1].value === ".toUpperCase()")
                {
                    try{ add_error_E( {error: "No se puede asignar un valor a una funcion de retorno", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }

            let i = 0;
            let aux_return = null;
            let r  =null;
            let dimArr = -1;
            while(i < this.id.length)
            {
                if (i === 0)
                {
                    let a = tab.exists(this.id[i].value+"");
                    if (a) {
                        r = tab.getSymbol(this.id[i].value+"");
                        dimArr = r.nDimension;
                        if(r.type_exp === Type.ARREGLO)
                        {
                            if(this.id[i].positions.length > 0)
                            {
                                let dimension_arr = r.nDimension;

                                if(this.id[i].positions.length > dimension_arr)
                                {
                                    try{ add_error_E( {error: "Hay acceso a una dimension que no existe", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                    return null;
                                }

                                let j = 0;
                                try
                                {
                                    //obteniendo el valor del arreglo
                                    let puntero = count.getNextTemporal();
                                    count.putInstruction(puntero + ' = '+ r.tag + ';')


                                    for(let p of this.id[i].positions)
                                    {
                                        let position = p.operate(tab, count);

                                        let t = count.getNextTemporal();
                                        let t2 = count.getNextTemporal();
                                        let t5 = count.getNextTemporal();
                                        let t6 = count.getNextTemporal();
                                        let t8 = count.getNextTemporal();
                                        
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
                                        let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
                                        count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
                            
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 1'); // debe ser el numero de elementos que tiene el arreglo
                                        count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                        count.putInstruction(t2 + ' = heap[(int)' + puntero + '];')
                                        count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');
                            
                                        
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 2'); // debe ser el acceso al arreglo
                                        count.putInstruction(t5 + ' = '+ t + ' + 1;')
                                        count.putInstruction('stack[(int)' + t5 + '] = '+ position.value +';');

                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 3'); // debe ser donde comienza los punteros a los elementos
                                        count.putInstruction(t6 + ' = '+ puntero + ' + 1;')
                                        count.putInstruction(t8 + ' = '+ t5 + ' + 1;')
                                        count.putInstruction('stack[(int)' + t8 + '] = '+ t6 +';');
                                            
                                        let tt = count.getRelative();
                                        count.putInstruction('P = P + ' + tt + ';');
                                        count.putInstruction('//Insertando la llama a la Funcion get_value_arr_3d_c');
                                        count.putInstruction('get_value_arr_3d_c();');
                            
                                        count.putInstruction('//Verificando si existe retorno.');
                                        var tag = count.getNextTemporal();
                                        let tag2r = count.getNextTemporal();
                                        count.putInstruction(tag + ' = P + 0;')
                                        count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
                                        count.putInstruction('P = P - ' + tt + ';');
                                        count.putInstruction(puntero + ' = '+ tag2r +';');
                        
                                        j++;
                                        dimArr--;
                                    }

                                    //dimension_ass = dimension_arr - j;
                                    aux_return = new Value(puntero, r.type, Type.ARREGLO, r.row, r.column);
                                    aux_return.nDimension = dimension_arr - j;
                                    
                                }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                            }else
                            {
                                //se retorna el arreglo
                                aux_return = r;
                            }
                        }else if(r.type !== Type.ENTERO && r.type !== Type.BOOL && r.type !== Type.CADENA)
                        {
                            i++;
                            let type = tab.find_type(r.type);
                            if(type !== null)
                            {
                                for(let da of type.atributes)
                                {
                                    if(da.name === this.id[i].value)
                                    {
                                        let position = da.number;

                                        let t = count.getNextTemporal();
                                        let t5 = count.getNextTemporal();
                                        let t8 = count.getNextTemporal();
                                        
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
                                        let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
                                        count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
                            
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 1'); // debe ser el numero de elementos que tiene el arreglo
                                        count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                        count.putInstruction('stack[(int)' + t + '] = '+ type.atributes.length +';');
                            
                                        
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 2'); // debe ser el acceso al arreglo
                                        count.putInstruction(t5 + ' = '+ t + ' + 1;')
                                        count.putInstruction('stack[(int)' + t5 + '] = '+ position +';');

                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 3'); // debe ser donde comienza los punteros a los elementos
                                        count.putInstruction(t8 + ' = '+ t5 + ' + 1;')
                                        count.putInstruction('stack[(int)' + t8 + '] = '+ r.tag +';');
                                            
                                        let tt = count.getRelative();
                                        count.putInstruction('P = P + ' + tt + ';');
                                        count.putInstruction('//Insertando la llama a la Funcion get_value_arr_3d_c');
                                        count.putInstruction('get_value_arr_3d_c();');
                            
                                        count.putInstruction('//Verificando si existe retorno.');
                                        var tag = count.getNextTemporal();
                                        let tag2r = count.getNextTemporal();
                                        count.putInstruction(tag + ' = P + 0;')
                                        count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
                                        count.putInstruction('P = P - ' + tt + ';');
                                        if(r.type_exp !== Type.ARREGLO)
                                            aux_return = new Value(tag2r, da.type, Type.VALOR, r.row, r.column);
                                        else
                                            aux_return = new Value(tag2r, da.type, Type.ARREGLO, r.row, r.column);
                                        break;
                                    }
                                }
                            }
                        }else if(r.type === Type.CADENA)
                        {
                            aux_return = r;
                        }
                    } else {
                        try{ add_error_E( {error: "El atributo / posicion arrego: " + this.id.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                }else
                {
                    try
                    {
                        if(aux_return !== null)
                        {
                            let type = tab.find_type(aux_return.type);
                            if(type !== null)
                            {
                                for(let da of type.atributes)
                                {
                                    if(da.name === this.id[i].value)
                                    {
                                        let position = da.number;

                                        let t = count.getNextTemporal();
                                        let t5 = count.getNextTemporal();
                                        let t8 = count.getNextTemporal();
                                        
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
                                        let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
                                        count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
                            
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 1'); // debe ser el numero de elementos que tiene el arreglo
                                        count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                        count.putInstruction('stack[(int)' + t + '] = '+ type.atributes.length +';');
                            
                                        
                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 2'); // debe ser el acceso al arreglo
                                        count.putInstruction(t5 + ' = '+ t + ' + 1;')
                                        count.putInstruction('stack[(int)' + t5 + '] = '+ position +';');

                                        count.putInstruction('//Insertando los parametros de llamada. Posicion 3'); // debe ser donde comienza los punteros a los elementos
                                        count.putInstruction(t8 + ' = '+ t5 + ' + 1;')
                                        count.putInstruction('stack[(int)' + t8 + '] = '+ aux_return.value +';');
                                            
                                        let tt = count.getRelative();
                                        count.putInstruction('P = P + ' + tt + ';');
                                        count.putInstruction('//Insertando la llama a la Funcion get_value_arr_3d_c');
                                        count.putInstruction('get_value_arr_3d_c();');
                            
                                        count.putInstruction('//Verificando si existe retorno.');
                                        var tag = count.getNextTemporal();
                                        let tag2r = count.getNextTemporal();
                                        count.putInstruction(tag + ' = P + 0;')
                                        count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
                                        count.putInstruction('P = P - ' + tt + ';');
                                        if(r.type_exp !== Type.ARREGLO)
                                            aux_return = new Value(tag2r, da.type, Type.VALOR, r.row, r.column);
                                        else
                                            aux_return = new Value(tag2r, da.type, Type.ARREGLO, r.row, r.column);
                                        break;
                                    }
                                }
                            }else
                            {
                                try{ add_error_E( {error: "No es un objeto para poder asignar un atributo", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                return null;
                            }
                        }
                        else
                        {
                            try{ add_error_E( {error: "No es un objeto para poder asignar un atributo", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                    }catch(e){ console.log(e); try{ add_error_E( {error: "La letiable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}

                }
                i = i + 1;
            }
            if(aux_return !== null)
            {
                if(r.type_exp !== Type.ARREGLO)
                {
                    if(aux_return instanceof Value)
                    {
                        if(aux_return.type === Type.ENTERO || aux_return.type === Type.BOOL || aux_return.type === Type.CADENA)
                        {
                            tmpExp = this.value.operate(tab, count);
                            if (tmpExp !== null && tmpExp.type === aux_return.type) 
                            {
                                //realizar la asignacion 
                                count.putInstruction('//Reasignando ');
                                count.putInstruction('heap[(int)' + aux_return.value + '] = ' + tmpExp.value + ';');
                            }
                        }
                    }
                }
                else
                {
                    tmpExp = this.value.operate(tab, count);
                    if (tmpExp !== null && (tmpExp.type === aux_return.type || tmpExp.type === Type.NULL) && dimArr === tmpExp.nDimension) 
                    {
                        //realizar la asignacion 
                        count.putInstruction('//Reasignando ');
                        count.putInstruction('heap[(int)' + aux_return.value + '] = ' + tmpExp.value + ';');
                    }

                }
                
            }
            //return new Value(aux_return.tag, aux_return.type, aux_return.type_exp, this.row, this.column);
        }
        else
        {
            var a = tab.getSymbol(this.id/*[0]*/.value);
            var tmpExp;
            console.log(this.value);
            count.putInstruction('//Iniciando la Asignacion de ' + this.id/*[0]*/.value);
            if (!(Array.isArray(this.value))) {
                tmpExp = this.value.operate(tab, count);
            } else {
                tmpExp = this.value[0].operate(tab, count);
            }
            if (tmpExp !== null) {
                if (a === null) {
                    try{ add_error_E( {error: "Variable " + this.id/*[0]*/ + " no encontrada.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
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
                        count.putInstruction('heap[(int)' + a.tag + '] = ' + tmpExp.value + ';');
                    } else {
                        count.putInstruction(t + ' = P + ' + a.pointer + ';');
                        count.putInstruction('stack[(int)' + t + '] = ' + tmpExp.value + ';');
                    }
                }
            } else {
                try{ add_error_E( {error: "Hubo un error al realizar la asignacion de la variable " + this.id/*[0]*/ + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            }
            return null;
        }

    }

    checkType(val, type, cont) {
        /*
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
        */
        return false;
    }
}

export default Assignment;