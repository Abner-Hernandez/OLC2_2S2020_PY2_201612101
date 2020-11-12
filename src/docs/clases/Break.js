import { add_error_E } from './Reports';

class Break{

    constructor(_type_exp, _row, _column) {
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab, count) {
        //var count = new Count();
        if(count.getLengthFinal() > 0){
            count.putInstruction('goto '+count.getLastFinal()+';');
            return;
        }else{
            try{ add_error_E( {error: 'La instruccion BREAK solo puede estar dentro de While,For,DoWhile,Switch.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
    }
}

export default Break;