import Count from'./Counters';
import Type from './Type';
import Value from './Value';
import { add_error_E } from './Reports';

class Call {
    constructor(_id, _type, _type_exp, _param, _row, _column) {
        this.id = _id;
        this.type = _type;
        if (_param === null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.type_exp = _type_exp;
        this.column = _column;
        this.row = _row;

    }

    operate(tab) {
        var count = new Count();

        this.type_exp = Type.LLAMADA;

        var f = tab.getFunction(this.id);
        if (f === null) {
            try{ add_error_E( {error: "Funcion: " + this.id + ", No Declarada.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        if (f.param !== null) {
            if (f.param.length !== this.param.length) {
                try{ add_error_E( {error: "La Cantidad de parametros de la LLAMADA no Coinciden con la FUNCION.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            var f1 = 0;
            var f2 = 0;
            for (var i = 0; i < this.param.length; i++) {
                if (this.param[i].id === null) {
                    f1++;
                } else {
                    f2++;
                }
            }
            if (this.param.length === 0) {
                f1++;
            }
            var t = count.getNextTemporal();
            count.newRelative();
            count.getRelativePlus()
            if (f1 !== 0 && f2 === 0) {
                for (var i = 0; i < f.param.length; i++) {
                    var symb = f.symbolTab.getSymbol(f.param[i].id[0]);
                    if (symb !== null) {
                        var tmpV = null;
                        if (!(this.param[i].value instanceof Array)) {
                            tmpV = this.param[i].value.operate(tab);
                        } else {
                            var tmpV = this.param[i].value[0].operate(tab);    ///////////////////aca se debe modificar para la recursion de llamadas
                        }

                        if (tmpV === null) {
                            try{ add_error_E( {error: "Parametro en la posicion " + (i + 1) + " NO VALIDO.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                        if (tmpV.type !== f.param[i].type) {
                            try{ add_error_E( {error: "Funcion: " + this.id + ", El tipo " + tmpV.type + " no coincide con el parametro " + f.param[i].id[0] + " de la Funcion.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                        count.putInstruction('##Insertando los parametros de llamada. Posicion ' + (i + 1));
                        count.putInstruction(t + ' = P + ' + (f.param.length + 1) + ';')
                        count.paramCall(Type.PRIMITIVO, t, tmpV.value, symb.pointer);
                        count.getRelativePlus()

                    } else {
                        try{ add_error_E( {error: "Funcion: " + this.id + ", Parametro invalido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }

                }
            } else if (f1 === 0 && f2 !== 0) {
                for (var i = 0; i < f.param.length; i++) {
                    var symb = f.symbolTab.getSymbol(this.param[i].id);
                    /*if (symb !== null) {
                        var tmpV = this.param[i].value.operate(tab);
                        if (tmpV === null) {
                            //olc2_p1.IDE.txtExec += "Error Semantico, Parametro en la posicion " + (i + 1) + " NO VALIDO. Linea: " + row + " Columna: " + column + "\n";
                            count.putError(Type.SEMANTICO, "Parametro en la posicion " + (i + 1) + " NO VALIDO.", this.row, this.column);
                            return null;
                        }
                        if (tmpV.type !== f.param[i].type) {
                            count.putError(Type.SEMANTICO, "Funcion: " + this.id + ", El tipo " + tmpV.type + " no coincide con el parametro " + f.param[i].id[0] + " de la Funcion.", this.row, this.column);
                            return null;
                        }
                        count.putInstruction('##Insertando los parametros de llamada. Posicion ' + i);
                        count.paramCall(Type.PRIMITIVO, 'P', tmpV.value, symb.pointer);

                    } else {
                        count.putError(Type.SEMANTICO, "Funcion: " + this.id + ", Parametro invalido.", this.row, this.column);
                        return null;
                    }*/
                    if (symb !== null) {
                        var tmpV = null;
                        if (!(this.param[i].value instanceof Array)) {
                            tmpV = this.param[i].value.operate(tab);
                        } else {
                            var tmpV = this.param[i].value[0].operate(tab);    ///////////////////aca se debe modificar para la recursion de llamadas
                        }

                        if (tmpV === null) {
                            //olc2_p1.IDE.txtExec += "Error Semantico, Parametro en la posicion " + (i + 1) + " NO VALIDO. Linea: " + row + " Columna: " + column + "\n";
                            try{ add_error_E( {error: "Parametro en la posicion " + (i + 1) + " NO VALIDO.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                        if (tmpV.type !== f.param[i].type) {
                            try{ add_error_E( {error: "Funcion: " + this.id + ", El tipo " + tmpV.type + " no coincide con el parametro " + f.param[i].id[0] + " de la Funcion.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
                        count.putInstruction('##Insertando los parametros de llamada. Posicion ' + (i + 1));
                        count.putInstruction(t + ' = P + ' + (f.param.length + 1) + ';')
                        count.paramCall(Type.PRIMITIVO, t, tmpV.value, symb.pointer);
                        count.getRelativePlus()

                    } else {
                        try{ add_error_E( {error: "Funcion: " + this.id + ", Parametro invalido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }

                }
            } else {
                try{ add_error_E( {error: "Solo se pude usar un tipo de parametro a la vez.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }


        }
        count.putInstruction('P = P + ' + count.getRelative() + ';');
        //s.symbols = ss.symbols;
        count.putInstruction('##Insertando la llama a la Funcion ' + f.id);
        count.putInstruction('call ' + f.idd + ';');

        count.resetRelative()
        
        //var symb = f.symbolTab.getSymbol('return');
        var tag2 = null;
        count.putInstruction('##Verificando si existe retorno.');
        var tag = count.getNextTemporal();
        tag2 = count.getNextTemporal();
        count.putInstruction(tag + ' = P + 0;')
        count.putInstruction(tag2 + ' = stack[' + tag + '];')
        count.putInstruction('P = P - ' + count.getRelative() + ';');
        if (symb !== null) {
            var ret = new Value(tag2, symb.type, symb.type_exp, this.row, this.column);
            ret.type_var = symb.type_var;
            return ret;
        }
    }
}
export default Call;
