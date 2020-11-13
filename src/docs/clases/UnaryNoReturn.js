import Type from'./Type';
import Value from'./Value';
import { add_error_E, add_simbol_E } from './Reports';

class UnaryNoReturn{
   constructor(_id, _type, _row, _col){
      this.id = _id;
      this.type = _type;
      this.row = _row;
      this.column = _col;
   }

   operate(tab, count){
      let a = tab.getSymbol(this.id);
      count.putInstruction("//Ejecutando el operador Unario")
      if(a === null){
          try{ add_error_E( {error: 'No se Encontrado una Operacion Valida.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
          return null;
      }
      let index = count.generateInstruction('P','+',a.pointer);
      let tag = count.getNextTemporal();
      if(a.type_ex === Type.GLOBAL){
          count.putInstruction(tag+' = heap[(int)'+index+'];')
      }else{
          count.putInstruction(tag+' = stack[(int)'+index+'];')
      }

      if(a === null && this.type)
      {
         try{ add_error_E( {error: "EXPRESION INVALIDA para el operador unario se esperaba ENTERO.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
      }
      else if(a.type === Type.ENTERO)
      {
         if (this.type === Type.INCREMENTO) {
            count.putInstruction(tag + ' = '+ tag + ' + 1;')
         }else if (this.type === Type.DECREMENTO) {
            count.putInstruction(tag + ' = '+ tag + ' - 1;')
         }

         if(a.type_ex === Type.GLOBAL){
            count.putInstruction('heap[(int)'+index+'] = '+tag+';')
         }else{
            count.putInstruction('stack[(int)'+index+'] = '+tag+';')
         }
         return null;
      }
      else if (a.type === Type.ARREGLO && this.type === ".push()")
      {
         
      }
      return null;      
   }
}


export default UnaryNoReturn;