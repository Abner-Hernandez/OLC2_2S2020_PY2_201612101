import Count from'./Counters';
import { add_error_E } from './Reports';

class Continue{

    constructor(_type_exp, _row, _column) {
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        var count = new Count();
        if(count.getLengthInit() > 0){
            count.putInstruction('goto '+count.getLastInit()+';');
        }else{
            try{ add_error_E( {error: 'La instruccion CONTINUE solo puede estar dentro de While,For,DoWhile.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
    }
}
export default Continue;
