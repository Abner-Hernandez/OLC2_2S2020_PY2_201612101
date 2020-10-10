import Count from'./Counters';
import Type from './Type';
import { add_error_E } from './Reports';

class Return {

    constructor(_ambit, _value, _type, _type_exp, _row, _column) {
        this.ambit = _ambit;
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        var count = new Count();
        var symb = null;
        var i = 0;
        symb = tab.getSymbol('return');
        /*for(i; i< tab.symbols.length; i++){
            if(tab.symbols[i].id === "return"){
                symb = tab.symbols[i];
                break;
            }
        }*/
        if (symb === null) {
            //error
            return null;
        }
        if (this.value !== null) {
            var tmpExp = null;
            if(!(this.value instanceof Array)){
                tmpExp = this.value.operate(tab);
            }else{
                tmpExp = this.value[0].operate(tab);
            }
            
            if (tmpExp === null) {
                try{ add_error_E( {error: 'Error en la expresion de Retorno.', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            
            //tab.symbols[i].value = tmpExp.value;
            //tab.symbols[i].type = tmpExp.type;
            //tab.symbols[i].type_exp = tmpExp.type_exp;
            symb.value = tmpExp.value;
            symb.type = tmpExp.type;
            symb.type_exp = tmpExp.type_exp;
            count.generateDeclaration(Type.LOCAL, tmpExp.value, symb.pointer);
        } else {
            count.generateDeclaration(Type.LOCAL, null, tab.symbols[i].pointer);
        }
        count.putInstruction('goto '+count.getExitRet()+';')
    }

}
export default Return;