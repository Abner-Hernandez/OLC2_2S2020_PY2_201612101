import Count from'./Counters';
import Type from './Type';
import { add_error_E } from './Reports';

class Switch {

    constructor(_exp, _body, _default, _row, _column) {
        this.exp = _exp;
        this.cases = _body;
        this.rdefault = _default;
        this.row = _row;
        this.column = _column;
        //this.elsebody = new LinkedList<>();
    }

    operate(tab) {
        var count = new Count();
        var a = 0;
        count.putInstruction('##Creando switch');
        var sa = count.getNextLabel();
        
        count.pushFinal(sa);
        if (this.exp === null) {
            try{ add_error_E( {error: "Se necesita una EXPRESION pra comparar en el Switch.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            count.putError(Type.SINTACTICO, "Se necesita una EXPRESION pra comparar en el Switch.", this.row, this.column);
            return null;
        }
        var tmpExp = this.exp.operate(tab);
        if (tmpExp === null || tmpExp.type_exp !== Type.VALOR) {
            try{ add_error_E( {error: "Error al Evaluar la EXPRESION en el Switch.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        //var tagout = count.getNextLabel();
        for (var i = 0; i < this.cases.length; i++) {
            var tmpV = this.cases[i].exp.operate(tab);
            if (tmpV === null || tmpV.type_exp !== Type.VALOR) {
                try{ add_error_E( {error: "Error al Evaluar la EXPRESSION en el Switch, se esperaba VALOR.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            //this.putInstruction('if('+tmpExp+' === '+tmpV+') goto '+tagout+';');
            var tagout = count.generateIf(tmpExp.value,'<>',tmpV.value);
            
            for (var s = 0; s < this.cases[i].body.length; s++) {

                this.cases[i].body[s].operate(tab);
            }
            count.putInstruction(tagout+':');
        }
        if (this.rdefault !== null) {
            for (var i = 0; i< this.rdefault.length; i++) {
                this.rdefault[i].operate(tab);

            }
        }
        count.putInstruction(sa+':');
        count.popFinal();
        return null;
    }

}
export default Switch;