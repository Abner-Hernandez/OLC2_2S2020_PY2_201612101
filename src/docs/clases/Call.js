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

    operate(tab, count) {
        this.type_exp = Type.LLAMADA;

        let f = tab.getFunction(this.id);
        if (f === null) {
            try { add_error_E({ error: "Funcion: " + this.id + ", No Declarada.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
            return null;
        }
        let tt = count.getRelative();
        if (f.param !== null) {
            if (f.param.length !== this.param.length) {
                try { add_error_E({ error: "La Cantidad de parametros de la LLAMADA no Coinciden con la FUNCION.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                return null;
            }
            let t = count.getNextTemporal();
            //let rp = count.getPrevRelative()
            count.newRelative();
            count.addPrevRelative();
            count.getRelativePlus();
            
            for (let i = 0; i < f.param.length; i++) {
                var symb = f.symbolTab.getSymbol(f.param[i].id/*[0]*/);
                if (symb !== null) {
                    let tmpV = null;
                    count.putInstruction('//Insertando los parametros de llamada. Posicion ' + symb.pointer);
                    if (!(this.param[i].value instanceof Array)) {
                        tmpV = this.param[i].operate(tab, count);
                    } else {
                        tmpV = this.param[i].value[0].operate(tab, count);    ///////////////////aca se debe modificar para la recursion de llamadas
                    }

                    if (tmpV === null) {
                        try { add_error_E({ error: "Parametro en la posicion " + (i + 1) + " NO VALIDO.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                        return null;
                    }
                    if (tmpV.type !== f.param[i].type) {
                        try { add_error_E({ error: "Funcion: " + this.id + ", El tipo " + tmpV.type + " no coincide con el parametro " + f.param[i].id/*[0]*/ + " de la Funcion.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                        return null;
                    }
                    
                    count.putInstruction('');
                    count.putInstruction(t + ' = P + ' + count.getRelative() + ';')
                    //count.putInstruction(t + ' = P + ' + symb.pointer + ';')
                    //count.putInstruction(t + ' = ' + t + ' + ' + tt + ';')
                    //count.putInstruction(t + ' = ' + t + ' + ' + count.getRelative() + ';')
                    //count.putInstruction(t + ' = P + ' + (f.param.length + 1) + ';');
                    count.paramCall(Type.PRIMITIVO, t, tmpV.value, symb.pointer);
                    count.getRelativePlus()

                } else {
                    try { add_error_E({ error: "Funcion: " + this.id + ", Parametro invalido.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                    return null;
                }

            }



        }
        
        //let t2 = count.getNextTemporal();
        //count.putInstruction(t2 + ' = P;');
        //count.putInstruction('P = P + ' + tt + ';');
        count.putInstruction('P = P + ' + tt + ';');
        //s.symbols = ss.symbols;
        count.putInstruction('//Insertando la llama a la Funcion ' + f.id);
        count.putInstruction(f.idd + '();');

        count.resetRelative()

        //let symb = f.symbolTab.getSymbol('return');
        let tag2 = null;
        count.putInstruction('//Verificando si existe retorno.');
        let tag = count.getNextTemporal();
        tag2 = count.getNextTemporal();
        count.putInstruction(tag + ' = P + 0;')
        count.putInstruction(tag2 + ' = stack[(int)' + tag + '];')
        //count.putInstruction('P = ' + t2 + ';');
        count.putInstruction('P = P - ' + tt + ';');
        if (symb != null) {
            let ret = new Value(tag2, symb.type, symb.type_exp, this.row, this.column);
            ret.type_var = symb.type_var;
            return ret;
        }
    }
}
export default Call;
