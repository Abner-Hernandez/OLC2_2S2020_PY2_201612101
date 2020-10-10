
import Count from'./Counters';
import Type from './Type';
import { add_error_E } from './Reports';
class Print {
    constructor(val, _type, _type_exp, _row, _column) {
        this.value = val;
        this.type = _type;
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        var count = new Count();
        count.putInstruction('##Operando la expresion de Print');
        var e = null;
        if (!Array.isArray(this.value)) {
            e = this.value.operate(tab);
        } else {
            var e = this.value[0].operate(tab);       ///////////////////aca se debe modificar para la recursion de llamadas
        }

        if (e !== null) {
            if (Type.VALOR === e.type_exp && e.type !== Type.CADENA) {
                var type = '';
                switch (e.type) {
                    case Type.DECIMAL:
                        type = '%d'
                        break;
                    case Type.ENTERO:
                        type = '%i'
                        break;
                    case Type.CARACTER:
                        type = '%c'
                        break;
                    case Type.BOOL:
                        var l = count.getNextLabel();
                        var l2 = count.getNextLabel();
                        count.generateIf2(e.value,'==','0',l);
                        count.putInstruction('print("%c",116);');
                        count.putInstruction('print("%c",114);');
                        count.putInstruction('print("%c",117);');
                        count.putInstruction('print("%c",101);');
                        count.putInstruction('goto '+l2+';');
                        count.putInstruction(l+':');
                        count.putInstruction('print("%c",102);');
                        count.putInstruction('print("%c",97);');
                        count.putInstruction('print("%c",108);');
                        count.putInstruction('print("%c",115);');
                        count.putInstruction('print("%c",101);');
                        count.putInstruction(l2+':');
                        count.putInstruction('print("%c",' + 10 + ');');
                        return null;
                    case Type.CADENA:
                        type = '%i'
                        break;
                    default:
                        try{ add_error_E( {error: 'Operacion ' + e.type + ' imposible de realizar con la funcion print.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
                count.putInstruction('print("' + type + '",' + e.value + ');');
                count.putInstruction('print("%c",' + 10 + ');');
            } else if(e.type === Type.CADENA) {
                var punt = count.getNextTemporal();
                var punt2 = count.getNextTemporal();
                var c = count.getNextTemporal();
                var tmp = count.getNextTemporal();
                var tag = count.getNextLabel();
                var tago = count.getNextLabel();
                count.putInstruction(punt2+' = '+ e.value + ';');
                /*if(e.type_var !== Type.GLOBAL){
                    count.putInstruction('##asdasd');
                    
                }else{
                    count.putInstruction(punt2+' = '+ e.value + ';');
                }*/

                count.putInstruction(c + ' = 0;');
                count.putInstruction(tag + ':');
                
                count.putInstruction(punt+' = '+ punt2 + ' + ' + c + ';');
                count.putInstruction(tmp+' = heap[' + punt + '];');
                
                count.generateIf2(tmp,'==','0',tago);
                count.putInstruction('print("%c",' + tmp + ');');
                
                count.putInstruction(c+' = '+c+' + 1;');
                count.putInstruction('goto '+tag+';');
                count.putInstruction(tago + ':');
                count.putInstruction('print("%c",' + 10 + ');');
            }
        } else {

            try{ add_error_E( {error: "Hubo un error al Ejecutar Imprimir.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
        return null;
    }
}
export default Print;
