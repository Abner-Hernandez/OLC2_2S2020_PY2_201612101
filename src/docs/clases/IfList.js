import Count from'./Counters';
import Type from './Type';
import SymbolTable from './SymbolTable';
import { add_error_E } from './Reports';

class IfList {
	constructor() {
		this.lif = [];
		this.elsebody = [];
	}

	operate(tab) {
		var count = new Count();

		var out = count.getNextLabel();
		for (var j = 0; j < this.lif.length; j++) {
			var r = this.lif[j].exp.operate(tab);
			if (r === null) {
				count.putError(Type.SINTACTICO, "No se puede ejecutar la instruccion If, se necesita una condicion logica o relacional.", this.lif[j].row, this.lif[j].column);
				return null;
			}
			if (r.type !== Type.BOOL) {
				try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
			}
			var aux = count.generateIf(r.value, '==', 0);
			var s = new SymbolTable(tab);
			for (var i = 0; i < this.lif[j].body.length; i++) {
				this.lif[j].body[i].operate(s);
			}

			count.putInstruction('goto ' + out + ';');
			count.putInstruction(aux + ':');


		}
		if (this.elsebody !== null) {
			//elsebody.used = used;
			//elsebody.execute(tab);
			var body = this.elsebody.body;
			var s = new SymbolTable(tab);
			for (var i = 0; i < body.length; i++) {

				body[i].operate(s);

			}
		}
		count.putInstruction(out + ':');
		/*for(var i = 0; i<outs.length; i++){
			count.putInstruction(outs[i] + ':');
		}*/
		return null;
	}

}
export default IfList;