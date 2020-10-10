import Count from'./Counters';
import Type from './Type';
import SymbolTable from './SymbolTable';
import { add_error_E } from './Reports';

class Function {

    constructor(_ambit, _type, _type_exp, _type_o, _id, _param, _body, _size, _idd, _row, _col) {
        this.ambit = _ambit;
        this.type = _type;
        this.type_exp = _type_exp;
        this.type_o = _type_o;
        this.id = _id;
        if (_param === null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.body = _body;
        this.size = _size;
        this.row = _row;
        this.column = _col;
        this.idd = _idd;
        this.symbolTab = null;
    }

    addParamet() {
        this.symbolTab = new SymbolTable(null);
        //count.putInstruction('##Insertando return de Funcion. Posicion ' + 0)
        var r2 = 0;
        var tag2 = '';
        //count.putInstruction('stack[' + tag2 + '] = null;');

        this.symbolTab.addSymbolDirect(new Symbol(-1, this.type, this._type_exp, Type.LOCAL, Type.VAR, this.type_o, 'return', r2, tag2));
        if (this.param !== null) {

            for (var i = 0; i < this.param.length; i++) {
                //count.putInstruction('##Insertando parametros de Funcion. Posicion ' + (i + 1))
                //var r = count.getRelativePlus();
                //var tag = count.paramFunc(Type.LOCAL, r)
                this.symbolTab.addSymbolDirect(new Symbol(-1, this.param[i].type, Type.VALOR, Type.LOCAL, Type.VAR, this.type_o, this.param[i].id[0], i + 1, ''));

            }
        }
    }

    operate(tab) {

        var f = tab.getFunction(this.id);
        var count = new Count();
        if (f !== null) {


            var exit = count.getNextLabel();
            count.setExitRet(exit);
            count.putInstruction('##Insertando Funcion ' + this.id)
            count.putInstruction('proc ' + this.idd + ' begin')
            //var actual = count.getNextTemporal()
            this.ambit = count.getNextTemporal();
            count.newRelative();
            //count.putInstruction(actual + '= P;')
            //count.putInstruction('P = ' + this.ambit + ';')
            this.symbolTab.tsuper = tab;
            this.symbolTab.functions = tab.functions;
            count.putInstruction('##Insertando return de Funcion. Posicion ' + 0)
            var r2 = count.getRelativePlus();
            var tag2 = count.paramFunc(Type.LOCAL, r2)
            count.putInstruction('stack[' + tag2 + '] = null;');
            //this.symbolTab.addSymbolDirect(new Symbol(-1, this.type, this._type_exp, Type.LOCAL, Type.VAR, this.type_o, 'return', r2, tag2, false));
            this.symbolTab.symbols[0].pointer = r2;
            this.symbolTab.symbols[0].tag = tag2;
            if (this.param !== null) {

                for (var i = 0; i < this.param.length; i++) {
                    count.putInstruction('##Insertando parametros de Funcion. Posicion ' + (i + 1))
                    var r = count.getRelativePlus();
                    var tag = count.paramFunc(Type.LOCAL, r)
                    //this.symbolTab.addSymbolDirect(new Symbol(-1, this.param[i].type, Type.VALOR, Type.LOCAL, Type.VAR, this.type_o, this.param[i].id[0], r, tag, false));
                    this.symbolTab.symbols[i+1].pointer = r;
                    this.symbolTab.symbols[i+1].tag = tag;
                }
            }
            count.putInstruction('##Empezo el cuerpo de la funcion.')
            for (var i = 0; i < this.body.length; i++) {
                this.body[i].operate(this.symbolTab);
                count.putInstruction('');
            }


            /*switch(f.type){
                case Type.ENTERO:
    
                break;
                case Type.DECIMAL:
                break;
                case Type.CHAR:
                break;
                case Type.VOID:
                    if(symb.tag !== null){
                        count.putError(Type.SEMANTICO,'Se retorno una Expresion en la Funcion '+f.id+' de tipo Void',this.row,this.column);
                        return null;
                    }
                break;
                default:
                break;
            }*/
            this.size = count.getRelative() + 1;
            //count.putInstruction('P = P -' + this.size + ';')
            count.clearExitRet();
            count.putInstruction(exit + ':');
            count.putInstruction('end\n');
            count.resetRelative();
            if (this.param !== null) {
                count.putFunction(this.ambit, this.type, this.type_exp, this.type_o, this.id, this.param.length, this.size, this.row, this.column)
            } else {
                count.putFunction(this.ambit, this.type, this.type_exp, this.type_o, this.id, 0, this.size, this.row, this.column)
            }
        } else {
            try{ add_error_E( {error: 'Error Funcion ' + this.id + ' No encontrada.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }

        }
        return null;
    }

}
export default Function;