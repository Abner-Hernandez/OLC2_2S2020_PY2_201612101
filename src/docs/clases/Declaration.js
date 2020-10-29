import Count from'./Counters';
import Type from './Type';
import Value from './Value';
import Symbol from './Symbol';
import { add_error_E } from './Reports';

class Declaration {
    constructor(_id, _value, _type, _type_exp, _type_var, _type_c, /*_type_o, _ambit,*/ _row, _column, nD) {
        this.id = _id;
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp;
        this.type_var = _type_var;
        this.type_c = _type_c;
        //this.type_o = _type_o;
        //this.ambit = _ambit;
        this.row = _row;
        this.column = _column;
        this.nDimension = nD;
    }

    operate(tab, count) {
        let tmpExp = null;
        if (this.value != null && this.value.type !== Type.OBJETO) {
            count.putInstruction('//Operando la expresion para la Declaracion');
            tmpExp = this.value.operate(tab, count);
            if (tmpExp === null) {
                try{ add_error_E( {error: "Hubo un error al realizar la declaracion de la variable ", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            if(this.type == undefined || this.type === Type.NULL){
                this.type = tmpExp.type;
                this.type_exp = tmpExp.type_exp;
            }
        }
        let a = false;
        if (this.type_var === Type.GLOBAL) {
            a = tab.exists(this.id); //[i]);
        } else {
            a = tab.existsDirect(this.id); //[i]);
        }
        count.putInstruction('//Declarando la variable ' + this.id); //[i]);
        if(this.type_exp === Type.VALOR)
        {
            if (tmpExp == null  && this.value == null && this.type != undefined && this.type !== Type.OBJETO) {
                switch (this.type) {
                    case Type.DECIMAL:
                        tmpExp = new Value(0.0, this.type, this.type_exp, this.type_var, this.row, this.column);
                        break;
                    case Type.ENTERO:
                        tmpExp = new Value(0, this.type, this.type_exp, this.type_var, this.row, this.column);
                        break;
                    case Type.CHAR:
                        tmpExp = new Value('\0', this.type, this.type_exp, this.type_var, this.row, this.column);
                        break;
                    case Type.BOOL:
                        tmpExp = new Value(false, this.type, this.type_exp, this.type_var, this.row, this.column);
                        break;
                }
            }
            if (a === false) {
    
                if(this.type !== Type.DECIMAL && this.type !== Type.ENTERO && this.type !== Type.BOOL && this.type !== Type.CADENA)
                {
                    if (this.type !== Type.ARREGLO)
                    {
                        let tag = this.assign_recursive_type(this.type, this.value.value, tab, count)
                        if(tag === null)
                        {
                            try{ add_error_E( {error: "Hubo un error al realizar la declaracion de la variable ", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                            
                        let r = count.getRelativePlus();
                        tab.addSymbolDirect(new Symbol(0, this.type, this.type_exp, this.type_var, this.type_c, /*this.type_o,*/ this.id/*[i]*/, r, tag));
                        count.putSymbol(0, this.type, this.type_exp, this.type_var, this.type_c, /*this.type_o,*/ this.id/*[i]*/, r, tag);
    
                    }
                }
                else
                {
                    let r = count.getRelativePlus();
                
                    if((tmpExp != null && tmpExp != undefined) && this.type != undefined){
                        let tag = count.generateDeclaration(this.type_var, tmpExp.value, r)
                        tab.addSymbolDirect(new Symbol(0, tmpExp.type, tmpExp.type_exp, this.type_var, this.type_c, /*this.type_o,*/ this.id/*[i]*/, r, tag));
                        count.putSymbol(0, tmpExp.type, tmpExp.type_exp, this.type_var, this.type_c, /*this.type_o,*/ this.id/*[i]*/, r, tag);
                    } else {
                        let tag = count.generateDeclaration(this.type_var, 0, r)
                        tab.addSymbolDirect(new Symbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, this.id, r, tag));
                        count.putSymbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, this.id, r, "null");
                    }
                }
    
                
            } else {
                try{ add_error_E( {error: "La variable " + this.id/*[i]*/ + " ya fue declarada en este ambito.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            }
    
            return null;
        }
        else if(this.type_exp === Type.ARREGLO)
        {
            if(a === false)
            {
                if (tmpExp !== null && (tmpExp.type === this.type || tmpExp.type === Type.NULL)) 
                {
                    let r = count.getRelativePlus();
                    let sim = new Symbol(0, tmpExp.type, Type.ARREGLO, this.type_var, this.type_c, /*this.type_o,*/ this.id/*[i]*/, r, tmpExp.value);
                    sim.nDimension = tmpExp.nDimension;
                    tab.addSymbolDirect(sim);
                    count.putSymbol(0, tmpExp.type, Type.ARREGLO, this.type_var, this.type_c, /*this.type_o,*/ this.id/*[i]*/, r, tmpExp.value);
            }
            }else {
                try{ add_error_E( {error: "La variable " + this.id/*[i]*/ + " ya fue declarada en este ambito.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
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
                if(Array.isArray(value[i]))
                {
                    tmpExp = this.arreglo_recursivo(tipo, value[i], count, tab);
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
                    position.push(tag);
                }else if (tipo === null || tipo === undefined && tmpExp.type !== null)
                {
                    tipo = tmpExp.type;
                    let tag = count.generateDeclaration(Type.GLOBAL, tmpExp.value, r)
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

    assign_recursive_type(types, value, tab, count)
    {
        let type = tab.find_type(types);
        let pointer = [];
        if(type !== null)
        {
            if(type.atributes.length === value.length)
            {
                for(let at2 of type.atributes)
                {
                    let bol = false;
                    for(let at of value)
                    {
                        if(at[0] === at2.name)
                        {
                            bol = true;
                            if(tab.find_type(at2.type) === null)
                            {
                                let temp = at[1].operate(tab, count);
                                if((temp === null || temp.type !== at2.type) && (this.type === Type.DECIMAL || this.type === Type.ENTERO || this.type === Type.BOOL || this.type === Type.CADENA) )
                                {
                                    try{ add_error_E( {error: "El atributo no es del tipo correcto: " + temp.type + "con el del type: " + at2.type, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                    return null;
                                }

                                let r = count.getRelativePlus();
                                if(temp != null && this.type != undefined && temp.type !== Type.NULL){
                                    count.putInstruction('//Declarando el atributo ' + at2.name); //[i]);
                                    let tag = count.generateDeclaration(Type.GLOBAL, temp.value, r)
                                    //tab.addSymbolDirect(new Symbol(0, temp.type, temp.type_exp, this.type_var, this.type_c, /*this.type_o,*/ at2.name/*[i]*/, r, tag));
                                    //count.putSymbol(0, temp.type, temp.type_exp, this.type_var, this.type_c, /*this.type_o,*/ at2.name/*[i]*/, r, tag);
                                    pointer.push([at2.number,at2.type, at2.name, tag]);
                                    break;
                                } else {
                                    //tab.addSymbolDirect(new Symbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, at2.name, r, null));
                                    let tag = count.generateDeclaration(Type.GLOBAL, 0, r)
                                    pointer.push([at2.number,at2.type, at2.name, tag]);
                                    //tab.addSymbolDirect(new Symbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, this.id, r, tag));
                                    //count.putSymbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, at2.name, r, "null");
                                }
                            }else
                            {
                                let temp = at[1].operate(tab, count);
                                if((temp === null || temp.type !== at2.type) && (this.type === Type.DECIMAL || this.type === Type.ENTERO || this.type === Type.BOOL || this.type === Type.CADENA) )
                                {
                                    try{ add_error_E( {error: "El atributo no es del tipo correcto: " + temp.type + "con el del type: " + at2.type, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                    return null;
                                }
                                
                                if (at[1].value !== null)
                                {                                    
                                    count.putInstruction('//Declarando el atributo ' + at2.name + ' Objeto: ' + '\n'); 
                                    let p = this.assign_recursive_type(at2.type, at[1].value, tab, count)
                                    if(p === null)
                                    {
                                        try{ add_error_E( {error: "Error al declarar un atributo de tipo objeto" + at2.type, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                        return null;
                                    }
                                    pointer.push([at2.number,at2.type, at2.name, p]);
                                    count.putInstruction('\n'); 
                                }
                                else
                                {
                                    let r = count.getRelativePlus();
                                    if(temp != null && this.type != undefined && temp.type !== Type.NULL){
                                        count.putInstruction('//Declarando el atributo ' + at2.name); //[i]);
                                        let tag = count.generateDeclaration(Type.GLOBAL, temp.value, r)
                                        //tab.addSymbolDirect(new Symbol(0, temp.type, temp.type_exp, this.type_var, this.type_c, /*this.type_o,*/ at2.name/*[i]*/, r, tag));
                                        //count.putSymbol(0, temp.type, temp.type_exp, this.type_var, this.type_c, /*this.type_o,*/ at2.name/*[i]*/, r, tag);
                                        pointer.push([at2.number,at2.type, at2.name, tag]);
                                    } else {
                                        //tab.addSymbolDirect(new Symbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, at2.name, r, null));
                                        let tag = count.generateDeclaration(Type.GLOBAL, 0, r)
                                        pointer.push([at2.number,at2.type, at2.name, tag]);
                                        //count.putSymbol(0, Type.NULL, Type.VALOR, this.type_var, this.type_c, at2.name, r, "null");
                                    }
                                }
                            }
                        }
                    }
                    if(!bol)
                    {
                        try{ add_error_E( {error: "El atributo no existe: " + at2.name , type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                }
                if(pointer.length > 0)
                {
                    count.putInstruction('//Declarando los punteros a los atributos del objeto ' + this.id);
                    let r = count.getRelativePlus();
                    let tag = count.generateDeclaration(Type.GLOBAL, pointer[0][3], r)
                    for(let i = 1; i < pointer.length; i++)
                    {
                        let r = count.getRelativePlus();
                        count.generateDeclaration(Type.GLOBAL, pointer[i][3], r)
                    }
                    return tag;
                }
            }else
                try{ add_error_E( {error: "Faltan atributos", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }else
        {
            try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
    }


}
export default Declaration;