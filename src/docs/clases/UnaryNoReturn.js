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

   operate(tab){
      let a;
      if(this.id instanceof Array)
      {
         a = tab.getSymbol(this.id[0].value);
      }else
         a = tab.getSymbol(this.id);
      
      if(this.type === Type.GRAFICAR)
      {
         //{name: $1, type: "undefined", ambit: undefined, row: @1.first_line, column: @1.first_column}
         add_simbol_E({name: "Inicio", type: "Tabla", ambit: "simbolos", row: this.row, column: "Inicio"});
         tab.add_simbols_report();
         add_simbol_E({name: "Fin", type: "Tabla", ambit: "simbolos", row: this.row, column: "Fin"});
         return null;
      }

      if(a === null && this.type)
      {
         try{ add_error_E( {error: "EXPRESION INVALIDA para el operador unario se esperaba ENTERO.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
      }
      else if(a.type === Type.ENTERO)
      {
         if (this.type === Type.INCREMENTO) {
            a.value = a.value + 1;
         }else if (this.type === Type.DECREMENTO) {
            a.value = a.value - 1;
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