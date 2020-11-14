
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

    operate(tab, count) {
        
        count.putInstruction('//Operando la expresion de Print');
        let e = null;
        if (!Array.isArray(this.value)) {
            e = this.value.operate(tab, count);
        } else {
            e = this.value[0].operate(tab, count);       ///////////////////aca se debe modificar para la recursion de llamadas
        }

        if (e !== null) {
            if(e.type_exp === Type.ARREGLO)
            {
                if(e.nDimension === 0)
                {
                    count.putInstruction('//Obteniendo el valor del arreglo')
                    count.putInstruction(e.value + ' = heap[(int)' + e.value + '];')
                    e.type_exp = Type.VALOR;
                }
                else
                {
                    try{ add_error_E( {error: 'No se puede imprimir un arreglo', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }

            if (Type.VALOR === e.type_exp && (e.type === Type.ENTERO || e.type === Type.BOOL)) {
                let type = '';
                let cast = '';
                switch (e.type) {
                    case Type.ENTERO:
                        type = '%d'
                        cast = ''
                        break;
                    /*
                    case Type.ENTERO:
                        type = '%d'
                        cast = '(int)'
                        break;
                    case Type.CARACTER:
                        type = '%c'
                        cast = '(char)'
                        break;
                    */
                    case Type.BOOL:
                        let l = count.getNextLabel();
                        let l2 = count.getNextLabel();
                        count.generateIf2(e.value,'==','0',l);
                        count.putInstruction('printf("%c",116);');
                        count.putInstruction('printf("%c",114);');
                        count.putInstruction('printf("%c",117);');
                        count.putInstruction('printf("%c",101);');
                        count.putInstruction('goto '+l2+';');
                        count.putInstruction(l+':');
                        count.putInstruction('printf("%c",102);');
                        count.putInstruction('printf("%c",97);');
                        count.putInstruction('printf("%c",108);');
                        count.putInstruction('printf("%c",115);');
                        count.putInstruction('printf("%c",101);');
                        count.putInstruction(l2+':');
                        count.putInstruction('printf("%c",' + 10 + ');');
                        return null;
                    default:
                        try{ add_error_E( {error: 'Operacion ' + e.type + ' imposible de realizar con la funcion print.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
                count.putInstruction('printf("' + type + '",' + cast + " " + e.value + ');');
                count.putInstruction('printf("%c",' + 10 + ');');
            } else if( Type.VALOR === e.type_exp && e.type === Type.CADENA) {
                let t = count.getNextTemporal();
                count.putInstruction('//Insertando los parametros de llamada. Posicion 1');
                count.putInstruction('');
                count.putInstruction(t + ' = P + ' + count.getRelative() + ';')
                
                count.paramCall(Type.PRIMITIVO, t, e.value, null);
                
                let tt = count.getRelative();
                count.putInstruction('P = P + ' + tt + ';');
                count.putInstruction('//Insertando la llama a la Funcion print_3d_c');
                count.putInstruction('print_3d_c();');
                count.putInstruction('P = P - ' + tt + ';');

            }
        } else {

            try{ add_error_E( {error: "Hubo un error al Ejecutar Imprimir.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
        return null;
    }
}
export default Print;
