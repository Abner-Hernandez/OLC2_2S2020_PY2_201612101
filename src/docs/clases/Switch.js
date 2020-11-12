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

    operate(tab, count) {
        
        let a = 0;
        count.putInstruction('//Creando switch');
        let sa = count.getNextLabel();
        
        count.pushFinal(sa);
        if (this.exp === null) {
            try{ add_error_E( {error: "Se necesita una EXPRESION pra comparar en el Switch.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            count.putError(Type.SINTACTICO, "Se necesita una EXPRESION pra comparar en el Switch.", this.row, this.column);
            return null;
        }
        let tmpExp = this.exp.operate(tab, count);
        if (tmpExp === null || tmpExp.type_exp !== Type.VALOR) {
            try{ add_error_E( {error: "Error al Evaluar la EXPRESION en el Switch.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        //let tagout = count.getNextLabel();
        for (let i = 0; i < this.cases.length; i++) {
            let tmpV = this.cases[i].exp.operate(tab, count);
            if (tmpV === null || tmpV.type_exp !== Type.VALOR) {
                try{ add_error_E( {error: "Error al Evaluar la EXPRESSION en el Switch, se esperaba VALOR.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            //this.putInstruction('if('+tmpExp+' === '+tmpV+') goto '+tagout+';');
            let tagout = count.generateIf(tmpExp.value,'!=',tmpV.value);
            
            for (let s = 0; s < this.cases[i].body.length; s++) {

                this.cases[i].body[s].operate(tab, count);
            }
            count.putInstruction(tagout+':');
        }
        if (this.rdefault !== null) {
            for (let i = 0; i< this.rdefault.length; i++) {
                this.rdefault[i].operate(tab, count);

            }
        }
        count.putInstruction(sa+':');
        count.popFinal();
        return null;
    }

}
export default Switch;