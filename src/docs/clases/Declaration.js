import Count from'./Counters';
import Type from './Type';
import Value from './Value';
import Symbol from './Symbol';
import { add_error_E } from './Reports';

class Declaration {
    constructor(_id, _value, _type, _type_exp, _type_var, _type_c, _type_o, _ambit, _row, _column) {
        this.id = _id;
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp;
        this.type_var = _type_var;
        this.type_c = _type_c;
        this.type_o = _type_o;
        this.ambit = _ambit;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        const count = new Count();


        var tmpExp = null;

        if (this.value !== null) {
            count.putInstruction('##Operando la expresion para la Declaracion');

            if (!Array.isArray(this.value)) {
                tmpExp = this.value.operate(tab);
            } else {
                tmpExp = this.value[0].operate(tab);
            }
            if (tmpExp === null) {
                try{ add_error_E( {error: "Hubo un error al realizar la declaracion de la variable ", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            if (this.checkType(tmpExp, count)) {
                return null;
            }
        }
        for (var i = 0; i < this.id.length; i++) {
            var a = false;
            if (this.type_var === Type.GLOBAL) {
                a = tab.exists(this.id[i]);
            } else {
                a = tab.existsDirect(this.id[i]);
            }
            count.putInstruction('##Declarando la variable ' + this.id[i]);
            if (tmpExp === null) {
                switch (this.type) {
                    case Type.DECIMAL:
                        tmpExp = new Value(null, 0.0, this.type, this.type_exp, this.type_var, this.ambit, this.row, this.column);
                        break;
                    case Type.ENTERO:
                        tmpExp = new Value(null, 0, this.type, this.type_exp, this.type_var, this.ambit, this.row, this.column);
                        break;
                    case Type.CHAR:
                        tmpExp = new Value(null, '\0', this.type, this.type_exp, this.type_var, this.ambit, this.row, this.column);
                        break;
                    case Type.BOOL:
                        tmpExp = new Value(null, false, this.type, this.type_exp, this.type_var, this.ambit, this.row, this.column);
                        break;
                }
            }
            if (a === false) {
                var r = count.getRelativePlus();
                var tag = count.generateDeclaration(this.type_var, tmpExp.value, r)
                tab.addSymbolDirect(new Symbol(this.ambit, tmpExp.type, tmpExp.type_exp, this.type_var, this.type_c, this.type_o, this.id[i], r, tag));
                
                count.putSymbol(this.ambit, tmpExp.type, tmpExp.type_exp, this.type_var, this.type_c, this.type_o, this.id[i], r, tag);
            } else {
                try{ add_error_E( {error: "La variable " + this.id[i] + " ya fue declarada en este ambito.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            }

        }
        return null;
    }

    checkType(val, count) {
        switch (this.type) {
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
                    try{ add_error_E( {error: 'Tipo de la EXPRESION ' + val.type + ' No Asignable a un CARACTER.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return true;
                }
                break;
            case Type.CARACTER:
                if (val.type !== Type.CARACTER) {
                    try{ add_error_E( {error: 'Tipo de la EXPRESION ' + val.type + ' No Asignable a un CARACTER.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return true;
                }
        }
        return false;
    }
}
export default Declaration;