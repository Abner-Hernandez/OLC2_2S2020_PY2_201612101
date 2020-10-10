import Count from'./Counters';
import Type from './Type';
import { add_error_E } from './Reports';
class Value {
    type_var = '';
    constructor(val, t, te, _row, _column) {
        this.value = val;
        this.type = t;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        const count = new Count();
        if (this.type_exp === Type.VALOR) {
            //LinkedList<Object> rr = new LinkedList<>();
            switch (this.type) {
                case Type.ENTERO:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.DECIMAL:
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
                    var ini = count.generateDeclaration(Type.GLOBAL,this.value.charCodeAt(0),0);
                    for(var i = 1; i<this.value.length; i++){
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
                case Type.CARACTER:
                    var ret = this.value.replace(/'/g,'');
                    
                    if(String(ret) === "\\n"){
                        return new Value(10, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if(ret === "\\r"){
                        return new Value(8, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if(ret === "\\t"){
                        return new Value(9, Type.CARACTER, Type.VALOR, this.row, this.column);
                    }
                    return new Value(ret.charCodeAt(0), Type.CARACTER, Type.VALOR, this.row, this.column);
                case Type.ID:
                    var a = tab.exists(this.value);
                    if (a) {
                        var r = tab.getSymbol(this.value);
                        const tag = count.getNextTemporal();
                        const tag2 = count.getNextTemporal();
                        if (r.type_var === Type.GLOBAL) {
                            count.putInstruction(tag + ' = heap[' + r.tag + '];');
                        } else {
                            count.putInstruction(tag2 + ' = P + ' + r.pointer + ';');
                            count.putInstruction(tag + ' = stack[' + tag2 + '];');
                        }
                        var s = new Value(tag, r.type, r.type_exp, r.row, r.column);
                        s.type_var = r.type_var;
                        return s;

                    } else {
                        try{ add_error_E( {error: "Variable " + this.value + " no encountrada.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                default:
                    try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
            }
        } else {
            switch (this.type_exp) {
                default:
                    try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
            }
        }
    }

}
export default Value;