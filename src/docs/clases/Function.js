import Type from './Type';
import SymbolTable from './SymbolTable';
import Symbol from './Symbol';
import { add_error_E } from './Reports';

class Function {

    constructor(/*_ambit,*/ _type, _type_exp,/* _type_o,*/ _id, _param, _body, /*_size, _idd,*/ _row, _col) {
        //this.ambit = _ambit;
        this.type = _type;
        this.type_exp = _type_exp;
        //this.type_o = _type_o;
        this.id = _id;
        if (_param === null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.body = _body;
        //this.size = _size;
        this.row = _row;
        this.column = _col;
        this.idd = _id;
        this.symbolTab = null;
    }

    addParamet(count) {
        this.symbolTab = new SymbolTable(null);
        //count.putInstruction('##Insertando return de Funcion. Posicion ' + 0)
        let r2 = 0;
        let tag2 = '';
        //count.putInstruction('stack[(int)' + tag2 + '] = null;');

        this.symbolTab.addSymbolDirect(new Symbol(-1, this.type, this.type_exp, Type.LOCAL, Type.VAR, /*this.type_o,*/ 'return', r2, tag2));
        if (this.param !== null) {

            for (let i = 0; i < this.param.length; i++) {
                //count.putInstruction('//Insertando parametros de Funcion. Posicion ' + (i + 1))
                //let r = count.getRelativePlus();
                //let tag = count.paramFunc(Type.LOCAL, r)
                //let pointer_ac = count.getNextTemporal();
                //count.putInstruction(pointer_ac+' = p;');
                let simbolo = new Symbol(-1, this.param[i].type, this.param[i].type_exp, this.param[i].type_var, Type.VAR, /*this.type_o,*/ this.param[i].id, i + 1, '');
                //simbolo.pointer_stack_declarado = pointer_ac;
                this.symbolTab.addSymbolDirect(simbolo);
                
            }
        }
    }

    merge_table(tab, pointer, count)
    {
        console.log("ingreso");
        for(let d of tab.symbols)
        {
            if(!this.symbolTab.exists(d.id))
            {
                let nuevo = new Symbol(-1, d.type, d.type_exp, d.type_var, d.VAR, /*this.type_o,*/ d.id, d.pointer, d.tag);
                nuevo.tabla_padre = true;
                let sumr = count.getNextTemporal();
                count.putInstruction(sumr+' = '+ pointer +';');
                //nuevo.pointer_rel = sumr;
                nuevo.pointer_stack_declarado = d.pointer_stack_declarado;
                nuevo.nDimension = d.nDimension;
                this.symbolTab.addSymbolDirect(nuevo);
            }
        }

    }

    operate(tab, count) {

        let f = tab.getFunction(this.id);
        
        if (f !== null) {

            let exit = count.getNextLabel();
            count.setExitRet(exit);
            count.putInstruction('//Insertando Funcion ' + this.id)
            this.ambit = count.getNextTemporal();
            count.newRelative();
            //count.putInstruction(actual + '= P;')
            //count.putInstruction('P = ' + this.ambit + ';')
            this.symbolTab.functions = tab.functions;
            if(this.idd !== "main")
            {
                count.putInstruction('void ' + this.idd + '(){')
                this.symbolTab.tsuper = tab;
                count.putInstruction('//Insertando return de Funcion. Posicion ' + 0)
                let r2 = count.getRelativePlus();
                let tag2 = count.paramFunc(Type.LOCAL, r2)
                count.putInstruction('stack[(int)' + tag2 + '] = 0.0;');
                //this.symbolTab.addSymbolDirect(new Symbol(-1, this.type, this._type_exp, Type.LOCAL, Type.VAR, this.type_o, 'return', r2, tag2, false));
                this.symbolTab.symbols[0].pointer = r2;
                this.symbolTab.symbols[0].tag = tag2;
            }
            else
            {
                count.putInstruction('int ' + this.idd + '(){')
                this.symbolTab = tab;
            }
            
            
            //let actual = count.getNextTemporal()


            if (this.param !== null) {

                for (let i = 0; i < this.param.length; i++) {
                    count.putInstruction('//Insertando parametros de Funcion. Posicion ' + (i + 1))
                    let r = count.getRelativePlus();
                    let tag = count.paramFunc(Type.LOCAL, r)
                    //this.symbolTab.addSymbolDirect(new Symbol(-1, this.param[i].type, Type.VALOR, Type.LOCAL, Type.VAR, this.type_o, this.param[i].id[0], r, tag, false));
                    this.symbolTab.symbols[i+1].pointer = r;
                    this.symbolTab.symbols[i+1].tag = tag;
                }
            }
            count.putInstruction('//Empezo el cuerpo de la funcion.')
            for (let i = 0; i < this.body.length; i++) {
                this.body[i].operate(this.symbolTab, count);
                count.putInstruction('');
            }


            this.size = count.getRelative() + 1;
            //count.putInstruction('P = P -' + this.size + ';')
            count.clearExitRet();
            

            if(this.idd !== "main")
            {
                count.putInstruction(exit + ':');
                count.putInstruction('return;\n}\n');
            }
            else
            {
                count.putInstruction('return 0;\n}\n');
            }
            
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