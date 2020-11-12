import Type from './Type';
import { add_error_E } from './Reports';
class Value {
    constructor(val, t, te, _row, _column) {
        this.value = val;
        this.type = t;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
        this.positions = [];
        this.nDimension = 0;
        this.type_var = Type.LOCAL;
    }

    add_positions(positions)
    {
        this.positions = positions;
    }
    
    operate(tab, count) {
        //const count = new Count();
        if (this.type_exp === Type.VALOR) {
            //LinkedList<Object> rr = new LinkedList<>();
            switch (this.type) {
                case Type.ENTERO:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.DEFAULT:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.CADENA:
                    this.value = this.value.replace(/\\n/g, '\n');
                    this.value = this.value.replace(/\\t/g, '\t');
                    this.value = this.value.replace(/\\r/g, '\r');
                    if (this.value.toString().startsWith("\"")) {
                        this.value = this.value.toString().substring(1, this.value.toString().length - 1);
                    }
                    this.value = this.value.toString().replace(/\\\"/g, "\"");
                    //return new this.Value(this.value.toString().replace("\"", ""), type, type_exp, row, column);
                    let ini = count.generateDeclaration(Type.GLOBAL,this.value.charCodeAt(0),0);
                    for(let i = 1; i<this.value.length; i++){
                        count.generateDeclaration(Type.GLOBAL,this.value.charCodeAt(i),0);
                    }
                    count.generateDeclaration(Type.GLOBAL,0,0);
                    return new Value(ini, this.type, this.type_exp, this.row, this.column);

                case Type.BOOL:
                    if(this.value === true){
                        return new Value(1, this.type, this.type_exp, this.row, this.column);
                    }
                    return new Value(0, this.type, this.type_exp, this.row, this.column);
                case Type.NULL:
                    return new Value('null', Type.NULL, Type.VALOR, this.row, this.column);
                case Type.ID:
                    let a = tab.exists(this.value);
                    
                    if (a) {
                        let r = tab.getSymbol(this.value);
                        if(r.type_exp === Type.ARREGLO)
                        {
                            return new Value(r.tag, r.type, r.type_exp, r.row, r.column);
                        }else if(r.type !== Type.ENTERO && r.type !== Type.BOOL && r.type !== Type.CADENA){
                            return new Value(r.tag, r.type, r.type_exp, r.row, r.column);
                        }

                        const tag = count.getNextTemporal();
                        const tag2 = count.getNextTemporal();
                        if (r.type_var === Type.GLOBAL) {
                            count.putInstruction(tag + ' = heap[(int)' + r.tag + '];');
                        } else {
                            count.putInstruction(tag2 + ' = P + ' + r.pointer + ';');
                            count.putInstruction(tag + ' = stack[(int)' + tag2 + '];');
                        }
                        let s = new Value(tag, r.type, r.type_exp, r.row, r.column);
                        s.type_var = r.type_var;
                        return s;

                    } else {
                        try{ add_error_E( {error: "variable " + this.value + " no encountrada.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                case Type.ARREGLO:
                    let unarydata = false;
                    if(this.value.length > 1)
                    {
                        if(this.value[this.value.length-1].value === ".pop()" || this.value[this.value.length-1].value === "reslength" || this.value[this.value.length-1].value === ".Concat()" || this.value[this.value.length-1].value === ".charAt()" || this.value[this.value.length-1].value === ".toLowerCase()" || this.value[this.value.length-1].value === ".toUpperCase()")
                        {
                            unarydata = true;
                        }
                    }

                    let i = 0;
                    let aux_return = null;
                    let r  =null;
                    let dimArr = 0;

                    while(i < this.value.length)
                    {
                        if (i === 0)
                        {
                            let a = tab.exists(this.value[i].value+"");
                            if (a) {
                                r = tab.getSymbol(this.value[i].value+"");
                                dimArr = r.nDimension;
                                if(r.type_exp === Type.ARREGLO)
                                {
                                    if(this.value[i].positions.length > 0)
                                    {
                                        let dimension_arr = r.nDimension;
        
                                        if(this.value[i].positions.length > dimension_arr)
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
                                            let start = true;
        
                                            for(let p of this.value[i].positions)
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
                                    
                                                if(start)
                                                {
                                                    count.putInstruction('//Insertando 1er. parametro: # elementos del arreglo'); // debe ser el numero de elementos que tiene el arreglo
                                                    count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                                    count.putInstruction(t2 + ' = heap[(int)' + puntero + '];')
                                                    count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');
                                                    start = false;
                                                }
                                                else
                                                {
                                                    count.putInstruction('//Insertando 1er. parametro: # elementos del arreglo'); // debe ser el numero de elementos que tiene el arreglo
                                                    count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                                    count.putInstruction(puntero + ' = heap[(int)' + puntero + '];')
                                                    count.putInstruction(t2 + ' = heap[(int)' + puntero + '];')
                                                    count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');
                                                }
                                                
                                                count.putInstruction('//Insertando 2do. parametro: # posicion acceder'); // debe ser el acceso al arreglo
                                                count.putInstruction(t5 + ' = '+ t + ' + 1;')
                                                count.putInstruction('stack[(int)' + t5 + '] = '+ position.value +';');
        
                                                count.putInstruction('//Insertando 3er. parametro: inicio de punteros elementos'); // debe ser donde comienza los punteros a los elementos
                                                count.putInstruction(t6 + ' = '+ puntero + ' + 1;')
                                                count.putInstruction(t8 + ' = '+ t5 + ' + 1;')
                                                count.putInstruction('stack[(int)' + t8 + '] = '+ t6 +';');
                                                    
                                                let tt = count.getRelative();
                                                count.putInstruction('P = P + ' + tt + ';');
                                                count.putInstruction('//Insertando la llama a la Funcion get_value_arr_3d_c');
                                                count.putInstruction('get_value_arr_3d_c();');
                                    
                                                count.putInstruction('//Verificando si existe retorno.');
                                                let tag = count.getNextTemporal();
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

                                            if(i + 1 < this.value.length)
                                            {
                                                count.putInstruction('//Obteniendo el elemento del puntero del arreglo')
                                                count.putInstruction(aux_return.value + ' = heap[(int)' + aux_return.value + '];')
                                            }
                                            
                                        }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                                    }else
                                    {
                                        //se retorna el arreglo
                                        let aux = new Value(r.tag, r.type, Type.ARREGLO, r.row, r.column);
                                        aux.nDimension = r.nDimension;
                                        aux_return = aux;
                                    }
                                }else if(r.type !== Type.ENTERO && r.type !== Type.BOOL && r.type !== Type.CADENA)
                                {
                                    i++;
                                    let type = tab.find_type(r.type);
                                    if(type !== null)
                                    {
                                        for(let da of type.atributes)
                                        {
                                            if(da.name === this.value[i].value)
                                            {
                                                let position = da.number;
        
                                                let t = count.getNextTemporal();
                                                let t5 = count.getNextTemporal();
                                                let t8 = count.getNextTemporal();
                                                
                                                count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
                                                let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
                                                count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
                                    
                                                count.putInstruction('//Insertando 1er. parametro: # de atributos objeto'); // debe ser el numero de elementos que tiene el arreglo
                                                count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                                count.putInstruction('stack[(int)' + t + '] = '+ type.atributes.length +';');
                                    
                                                
                                                count.putInstruction('//Insertando 2do. parametro: # del atributo'); // debe ser el acceso al arreglo
                                                count.putInstruction(t5 + ' = '+ t + ' + 1;')
                                                count.putInstruction('stack[(int)' + t5 + '] = '+ position +';');
        
                                                count.putInstruction('//Insertando 3er. parametro: inicio de punteros elementos'); // debe ser donde comienza los punteros a los elementos
                                                count.putInstruction(t8 + ' = '+ t5 + ' + 1;')
                                                count.putInstruction('stack[(int)' + t8 + '] = '+ r.tag +';');
                                                    
                                                let tt = count.getRelative();
                                                count.putInstruction('P = P + ' + tt + ';');
                                                count.putInstruction('//Insertando la llama a la Funcion get_value_arr_3d_c');
                                                count.putInstruction('get_value_arr_3d_c();');
                                    
                                                count.putInstruction('//Verificando si existe retorno.');
                                                let tag = count.getNextTemporal();
                                                let tag2r = count.getNextTemporal();
                                                count.putInstruction(tag + ' = P + 0;')
                                                count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
                                                count.putInstruction('P = P - ' + tt + ';');
                                                if(r.type_exp !== Type.ARREGLO)
                                                    aux_return = new Value(tag2r, r.type, Type.VALOR, r.row, r.column);
                                                else
                                                    aux_return = new Value(tag2r, r.type, Type.ARREGLO, r.row, r.column);
                                                break;
                                            }
                                        }
                                    }
                                    if(i + 1 < this.value.length)
                                    {
                                        count.putInstruction('//Obteniendo el puntero del atributo')
                                        count.putInstruction(aux_return.value + ' = heap[(int)' + aux_return.value + '];')
                                    }
                                }else if(r.type === Type.CADENA)
                                {
                                    aux_return = new Value(r.tag, r.type, r.type_exp, r.row, r.column);
                                }
                            } else {
                                try{ add_error_E( {error: "El atributo / posicion arrego: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                return null;
                            }
                        }else
                        {
                            try
                            {
                                if(r !== null && dimArr === 0)
                                {
                                    let type = tab.find_type(r.type);
                                    if(type !== null && aux_return !== null)
                                    {
                                        for(let da of type.atributes)
                                        {
                                            if(da.name === this.value[i].value)
                                            {
                                                let position = da.number;
        
                                                let t = count.getNextTemporal();
                                                let t5 = count.getNextTemporal();
                                                let t8 = count.getNextTemporal();
                                                
                                                count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
                                                let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
                                                count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
                                    
                                                count.putInstruction('//Insertando 1er. parametro: # de atributos objeto'); // debe ser el numero de elementos que tiene el arreglo
                                                count.putInstruction(t + ' = '+ tag2 + ' + 1;')
                                                count.putInstruction('stack[(int)' + t + '] = '+ type.atributes.length +';');
                                    
                                                
                                                count.putInstruction('//Insertando 2do. parametro: # del atributo'); // debe ser el acceso al arreglo
                                                count.putInstruction(t5 + ' = '+ t + ' + 1;')
                                                count.putInstruction('stack[(int)' + t5 + '] = '+ position +';');
        
                                                count.putInstruction('//Insertando 3er. parametro: inicio de punteros elementos'); // debe ser donde comienza los punteros a los elementos
                                                count.putInstruction(t8 + ' = '+ t5 + ' + 1;')

                                                count.putInstruction('stack[(int)' + t8 + '] = '+ aux_return.value +';');
                                                    
                                                let tt = count.getRelative();
                                                count.putInstruction('P = P + ' + tt + ';');
                                                count.putInstruction('//Insertando la llama a la Funcion get_value_arr_3d_c');
                                                count.putInstruction('get_value_arr_3d_c();');
                                    
                                                count.putInstruction('//Verificando si existe retorno.');
                                                let tag = count.getNextTemporal();
                                                let tag2r = count.getNextTemporal();
                                                count.putInstruction(tag + ' = P + 0;')
                                                count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
                                                count.putInstruction('P = P - ' + tt + ';');
                                                count.putInstruction('//Obteniendo la posicion del atributo: ' + da.name)
                                                count.putInstruction(tag2r + ' = heap[(int)' + tag2r + '];')
                                                aux_return = new Value(tag2r, da.type, Type.ARREGLO, r.row, r.column);
                                                aux_return.nDimension = dimArr;
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
                        if(unarydata === true && i === this.value.length -1)
                        {
                            return this.execute_native(this.value[i].value, count, aux_return, null);
                        }else if(unarydata === true && i === this.value.length -2 && this.value[this.value.length-1].value === ".Concat()" || this.value[this.value.length-1].value === ".charAt()")
                        {
                            let value = this.value[i].operate(tab, count);
                            return this.execute_native(this.value[i+1].value, count, aux_return, value);
                        }
                    }
                    if(aux_return !== null)
                    {
                        return aux_return;
                    }
                default:
                    try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
            }
        }else if(this.type_exp === Type.ARREGLO)
        {
            if(this.type === Type.NULL && !(this.value instanceof Array))
            {
                let tmpExp = this.value.operate(tab, count);
                if(tmpExp !== null && tmpExp.type === Type.ENTERO)
                {
                    let t = count.getNextTemporal();
                    
                    count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
                    let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
                    count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
        
                    count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
                    count.putInstruction(t + ' = '+ tag2 + ' + 1;')
        
                    count.putInstruction('stack[(int)' + t + '] = '+ tmpExp.value +';');
                        
                    let tt = count.getRelative();
                    count.putInstruction('P = P + ' + tt + ';');
                    count.putInstruction('//Insertando la llama a la Funcion new_array_3d_c');
                    count.putInstruction('new_array_3d_c();');
        
                    let tag2r = null;
                    count.putInstruction('//Verificando si existe retorno.');
                    let tag = count.getNextTemporal();
                    tag2r = count.getNextTemporal();
                    count.putInstruction(tag + ' = P + 0;')
                    count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
                    count.putInstruction('P = P - ' + tt + ';');
        
                    let ret = new Value(tag2r, Type.NULL, this.type_exp, this.row, this.column);
                    ret.nDimension = 1;
                    return ret;
                }
            }

            let tmpExp = null;
            let tipo = null;
            if(this.type !== Type.NULL)
                tipo = this.type;
            let position = [];
            let dim = 0;

            if (Array.isArray(this.value)) {
                for(let i = 0 ; i < this.value.length; i++)
                {
                    let r = count.getRelativePlus();
                    if(this.value[i].type_exp === Type.ARREGLO)
                    {
                        tmpExp = this.arreglo_recursivo(tipo, this.value[i].value, count, tab);
                        let tip = tmpExp[0];
                        let dimm = tmpExp[1];
                        tmpExp = tmpExp[2];
                        if(dim === 0)
                        {
                            dim = dimm + 1;
                            if (tipo === null || tipo === undefined && tip !== null || tipo === Type.NULL)
                                tipo = tip;
                        }
                        if(dim > 0 && dimm !== dim -1)
                        {
                            try{ add_error_E( {error: "Error el arreglo las dimensiones del arreglo no son correctas", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                        position.push(tmpExp.value);
                        continue;
                    }
                    else
                        tmpExp = this.value[i].operate(tab, count);
                    if(tipo !== null && tipo !== undefined && tipo === tmpExp.type)
                    {
                        
                        let tag = count.generateDeclaration(Type.GLOBAL, tmpExp.value, r)
                        if(tmpExp.type === Type.CADENA)
                        {
                            count.putInstruction('//Guardando el puntero de la cadena al arreglo')
                            count.putInstruction(tag + ' = heap[(int)' + tag + '];')
                        }
                        position.push(tag);
                    }else if ((tipo === null || tipo === undefined || tipo === Type.NULL) && (tmpExp.type !== null || tmpExp.type !== Type.NULL))
                    {
                        tipo = tmpExp.type;
                        let tag = count.generateDeclaration(Type.GLOBAL, tmpExp.value, r)
                        if(tmpExp.type === Type.CADENA)
                        {
                            count.putInstruction('//Guardando el puntero de la cadena al arreglo')
                            count.putInstruction(tag + ' = heap[(int)' + tag + '];')
                        }
                        position.push(tag);
                    }else
                    {
                        try{ add_error_E( {error: "Se quiere ingresar un valor que tiene un tipo distinto al tipo del arreglo.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    }
                }

                if(dim === 0)
                    dim++;
    
                let r = count.getRelativePlus();
                let nElementos = this.value.length;
                count.putInstruction('//Declarando la Expresion a Asignar');
                let tag = count.generateDeclaration(Type.GLOBAL, nElementos, r);
                // insertar primera posicion
                for(let element of position)
                {
                    let d = count.getRelativePlus();
                    count.generateDeclaration(Type.GLOBAL, element, d)
                }
                let rett = new Value(tag, tipo, Type.ARREGLO, this.row, this.column);
                rett.nDimension = dim;
                return rett;
                //tab.addSymbolDirect(new Symbol(0, tipo, Type.ARREGLO, this.type_var, this.type_c, /*this.type_o,*/ this.value/*[i]*/, r, tag));
                //count.putSymbol(0, tipo, Type.ARREGLO, this.type_var, this.type_c, /*this.type_o,*/ this.value/*[i]*/, r, tag);
            }
                
        } 
        else {
            switch (this.type_exp) {
                default:
                    try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
            }
        }
    }

    arreglo_recursivo(tipo, value, count, tab)
    {
        let tmpExp = null;
        let position = [];
        let dim = 0;


        if (Array.isArray(value)) {
            for(let i = 0 ; i < value.length; i++)
            {
                let r = count.getRelativePlus();
                if(value[i].type_exp === Type.ARREGLO)
                {
                    tmpExp = this.arreglo_recursivo(tipo, value[i].value, count, tab);
                    let tip = tmpExp[0];
                    let dimm = tmpExp[1];
                    tmpExp = tmpExp[2];
                    if(dim === 0)
                    {
                        dim = dimm + 1;
                        if (tipo === null || tipo === undefined && tip !== null)
                            tipo = tip;
                    }
                    else if(dimm >= dim)
                        dim = dim + 1;
                    position.push(tmpExp.value);
                    continue;
                }
                else
                    tmpExp = value[i].operate(tab, count);
                if(tipo !== null && tipo !== undefined && tipo === tmpExp.type)
                {
                    let tag = count.generateDeclaration(Type.GLOBAL, tmpExp.value, r)
                    if(tmpExp.type === Type.CADENA)
                    {
                        count.putInstruction('//Guardando el puntero de la cadena al arreglo')
                        count.putInstruction(tag + ' = heap[(int)' + tag + '];')
                    }
                    position.push(tag);
                }else if ((tipo === null || tipo === undefined || tipo === Type.NULL) && (tmpExp.type !== null || tmpExp.type !== Type.NULL))
                {
                    tipo = tmpExp.type;
                    let tag = count.generateDeclaration(Type.GLOBAL, tmpExp.value, r)
                    if(tmpExp.type === Type.CADENA)
                    {
                        count.putInstruction('//Guardando el puntero de la cadena al arreglo')
                        count.putInstruction(tag + ' = heap[(int)' + tag + '];')
                    }
                    position.push(tag);
                }else
                {
                    try{ add_error_E( {error: "Se quiere ingresar un valor que tiene un tipo distinto al tipo del arreglo.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }
            if(dim === 0)
                dim++;

            let r = count.getRelativePlus();
            let nElementos = value.length;
            let tag = count.generateDeclaration(Type.GLOBAL, nElementos, r)
            // insertar primera posicion
            for(let element of position)
            {
                let d = count.getRelativePlus();
                count.generateDeclaration(Type.GLOBAL, element, d)
            }

            return [tipo, dim,new Value(tag, tipo, Type.ARREGLO, this.row, this.column)];
        }
    }
    
    execute_native(typeop, count, value1, value2)
    {
        if(typeop === ".toLowerCase()" && value1.type === Type.CADENA)
        {
            let t = count.getNextTemporal();
            let t2 = count.getNextTemporal();
            
            count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
            let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
            count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');

            count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
            count.putInstruction(t + ' = '+ tag2 + ' + 1;')
            count.putInstruction(t2 + ' = stack[(int)' + value1.tag + '];')

            count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');
                
            let tt = count.getRelative();
            count.putInstruction('P = P + ' + tt + ';');
            count.putInstruction('//Insertando la llama a la Funcion toLowerCase_3d_c');
            count.putInstruction('toLowerCase_3d_c();');

            let tag2r = null;
            count.putInstruction('//Verificando si existe retorno.');
            let tag = count.getNextTemporal();
            tag2r = count.getNextTemporal();
            count.putInstruction(tag + ' = P + 0;')
            count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
            count.putInstruction('P = P - ' + tt + ';');

            let ret = new Value(tag2r, value1.type, this.type_exp, this.row, this.column);
            return ret;
        }else if(typeop === ".toUpperCase()" && value1.type === Type.CADENA)
        {
            let t = count.getNextTemporal();
            let t2 = count.getNextTemporal();
            
            count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
            let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
            count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');

            count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
            count.putInstruction(t + ' = '+ tag2 + ' + 1;')
            count.putInstruction(t2 + ' = stack[(int)' + value1.tag + '];')

            count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');
                
            let tt = count.getRelative();
            count.putInstruction('P = P + ' + tt + ';');
            count.putInstruction('//Insertando la llama a la Funcion toUpperCase_3d_c');
            count.putInstruction('toUpperCase_3d_c();');

            let tag2r = null;
            count.putInstruction('//Verificando si existe retorno.');
            let tag = count.getNextTemporal();
            tag2r = count.getNextTemporal();
            count.putInstruction(tag + ' = P + 0;')
            count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
            count.putInstruction('P = P - ' + tt + ';');

            let ret = new Value(tag2r, value1.type, this.type_exp, this.row, this.column);
            return ret;
        }else if(typeop === ".charAt()" && value1.type === Type.CADENA && value2.type === Type.ENTERO)
        {
            let t = count.getNextTemporal();
            let t2 = count.getNextTemporal();
            let t3 = count.getNextTemporal();
            
            count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
            let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
            count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');

            count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
            count.putInstruction(t + ' = '+ tag2 + ' + 1;')
            count.putInstruction(t2 + ' = stack[(int)' + value1.tag + '];')

            count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');

            
            count.putInstruction('//Insertando los parametros de llamada. Posicion 2');
            count.putInstruction(t3 + ' = '+ t + ' + 1;')

            count.putInstruction('stack[(int)' + t3 + '] = '+ value2.value +';');
                
            let tt = count.getRelative();
            count.putInstruction('P = P + ' + tt + ';');
            count.putInstruction('//Insertando la llama a la Funcion CharAt_3d_c');
            count.putInstruction('CharAt_3d_c();');

            let tag2r = null;
            count.putInstruction('//Verificando si existe retorno.');
            let tag = count.getNextTemporal();
            tag2r = count.getNextTemporal();
            count.putInstruction(tag + ' = P + 0;')
            count.putInstruction(tag2r + ' = stack[(int)' + tag + '];')
            count.putInstruction('P = P - ' + tt + ';');

            let ret = new Value(tag2r, value1.type, this.type_exp, this.row, this.column);
            return ret;
        }else if(typeop === ".Concat()" && value1.type === Type.CADENA && value2.type === Type.CADENA)
        {
            let t = count.getNextTemporal();
            let t2 = count.getNextTemporal();
            let t3 = count.getNextTemporal();
            
            count.putInstruction('//Insertando los parametros de llamada. Posicion 0');
            let tag2 = count.paramFunc(Type.LOCAL, count.getRelative())
            count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');

            count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
            count.putInstruction(t + ' = '+ tag2 + ' + 1;')
            count.putInstruction(t2 + ' = stack[(int)' + value1.tag + '];')

            count.putInstruction('stack[(int)' + t + '] = '+ t2 +';');

            
            count.putInstruction('//Insertando los parametros de llamada. Posicion 2');
            count.putInstruction(t3 + ' = '+ t + ' + 1;')

            count.putInstruction('stack[(int)' + t3 + '] = '+ value2.value +';');
                
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

            let ret = new Value(tag2r, value1.type, this.type_exp, this.row, this.column);
            return ret;
        }
    }
}
export default Value;