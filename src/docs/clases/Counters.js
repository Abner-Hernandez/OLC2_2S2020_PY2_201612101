import Type from './Type';

class Counter
{
    constructor(_type_exp, _row, _column) {
        this.temporals = 0;
        this.temporalsArr = 0;
        this.temporalsArrD = [];
        this.labels = 0;
        this.output = '';
        this.errors = '';
        this.exitret = [];
        this.id = 0;
        this.p = 0;
        this.h = 0;
        this.relative = [];
        this.inits = [];
        this.finals = [];
        this.Rsymbol = [];
        this.Rerror = [];
        this.Rfunction = [];
        this.tagsvf = [];
    }

    clearAll() {
        this.temporals = 0;
        this.labels = 0;
        this.output = '';
        this.errors = '';
        this.exitret = [];
        this.id = 0;
        this.p = 0;
        this.h = 0;
        this.relative = [];
        this.inits = [];
        this.finals = [];
        this.Rsymbol = [];
        this.Rerror = [];
        this.Rfunction = [];
        this.tagsvf = [];
    }

    setExitRet(tag) {
        this.exitret.push(tag);
    }

    clearExitRet() {
        this.exitret.pop();
    }

    getExitRet() {
        return this.exitret[this.exitret.length - 1];
    }

    getLastFinal() {
        return this.finals[this.finals.length - 1];
    }

    getLengthFinal() {
        return this.finals.length;
    }

    pushFinal(tag) {
        this.finals.push(tag);
    }

    popFinal(tag) {
        this.finals.pop();
    }

    pushTagsvf(tag) {
        this.tagsvf.push(tag);
    }

    popTagsvf() {
        this.tagsvf.pop();
    }

    getTagsvf() {
        return this.tagsvf[this.tagsvf.length-1];
    }

    getTagsSize() {
        return this.tagsvf.length;
    }

    getLastInit() {
        return this.inits[this.inits.length - 1];
    }

    getLengthInit() {
        return this.inits.length;
    }

    pushInit(tag) {
        this.inits.push(tag);
    }

    popInit(tag) {
        this.inits.pop();
    }

    getPPlus() {
        const r = this.p;
        this.p++
        return r;
    }

    getHPlus() {
        const r = this.h;
        this.h++;
        return r;
    }

    getP() {
        return this.p;
    }

    getH() {
        return this.h;
    }

    getRelativePlus() {
        const r = this.relative[this.relative.length - 1];
        this.relative[this.relative.length - 1]++;
        return r;
    }

    addPrevRelative() {
        this.relative[this.relative.length - 1] += this.relative[this.relative.length - 2];
    }

    getRelative() {
        return this.relative[this.relative.length - 1];
    }

    newRelative() {
        this.relative.push(0);
    }

    resetRelative() {
        this.relative.pop();
    }

    generateInstruction(left, op, right) {
        let t = this.getNextTemporal();
        this.putInstruction(t + ' = ' + left + ' ' + op + ' ' + right + ';');
        return t;
    }

    generateIf(left, op, right) {
        let t = this.getNextLabel();
        this.putInstruction('if(' + right + ' ' + op + ' ' + left + ') goto ' + t + ';');
        return t;
    }

    generateIf2(left, op, right, t) {
        //let t = this.getNextLabel();
        this.putInstruction('if(' + right + ' ' + op + ' ' + left + ') goto ' + t + ';');

    }

    operateRelational(left, op, right) {
        let tv = this.getNextLabel();
        let to = this.getNextLabel();
        let t1 = this.getNextTemporal();
        this.putInstruction('if(' + left + ' ' + op + ' ' + right + ') goto ' + tv + ';');
        this.putInstruction(t1 + ' = 0;');
        this.putInstruction('goto ' + to + ';');
        this.putInstruction(tv + ':');
        this.putInstruction(t1 + ' = 1;');
        this.putInstruction(to + ':');
        return t1;
    }

    generateDeclaration(tipo, value, relative) {
        let t = this.getNextTemporal();
        if (Type.GLOBAL === tipo) {
            this.putInstruction(t + ' = H;');
            this.putInstruction('H = H + 1;');
            //this.tempor++;
            this.putInstruction('heap[(int)' + t + '] = ' + value + ';')
        } else {

            this.putInstruction(t + ' = P + ' + relative + ';');
            this.putInstruction('stack[(int)' + t + '] = ' + value + ';')
        }
        return t;
    }

    paramFunc(tipo, relative) {
        let t = this.getNextTemporal();
        if (Type.GLOBAL === tipo) {
            this.putInstruction(t + ' = H;');
            this.putInstruction('H = H + 1;');
        } else {

            this.putInstruction(t + ' = P + ' + relative + ';');
        }
        return t;
    }

    paramCall(tipo, ambit, value, relative) {
        let t = this.getNextTemporal();
        if (Type.GLOBAL === tipo) {
            this.putInstruction(t + ' = H;');
            this.putInstruction('H = H + 1;');
            //this.tempor++;
            this.putInstruction('heap[(int)' + t + '] = ' + value + ';')
        } else {

            //this.putInstruction(t + ' = ' + ambit + ' + ' + relative + ';');
            this.putInstruction('stack[(int)' + ambit + '] = ' + value + ';')
        }
        return t;
    }

    getNextTemporal() {
        let n = this.temporals;
        this.temporals++
        return 't' + n;
    }

    getNextTemporalArr(nDimension) {
        let n = this.temporalsArr;
        this.temporalsArr++
        this.temporalsArrD.push(['arr' + n, nDimension]);
        return 'arr' + n;
    }

    getNextLabel() {
        let r = this.labels;
        this.labels++;
        return 'l' + r;
    }

    getActualTemporal() {
        return 't' + this.temporals;
    }

    getActualLabel() {
        return 'l' + this.labels;
    }

    getOutput() {
        let temp = '#include <stdio.h>\n#include <math.h>\ndouble heap[16384];\ndouble stack[16394];\ndouble P = 0;\ndouble H = 0;\ndouble t0';
        for (let i = 1; i <= this.temporals; i++) {
            temp += ',t' + i
        }
        temp += ';\n\n'
        
        if(this.temporalsArrD.length > 0 )
        {
            temp += 'double ' + this.temporalsArrD[0][0] + "["+ this.temporalsArrD[0][1] +"]"
            for (let i = 1; i <= this.temporalsArrD; i++) {
                temp += ',' + this.temporalsArrD[i][0] + "["+ this.temporalsArrD[i][1] +"]"
            }
            temp += ';\n\n'
        }

        this.output = temp + this.output;
        return this.output;
    }

    getGlobals() {
        let r = this.output;
        this.output = '';
        return r;
    }

    joinString(s1) {
        this.output = s1 + '\n' + this.output;
    }

    putPrincipal(idd, L) {
        this.output = idd + '();\n\n' + this.output;
    }

    putInstruction(instruction) {
        this.output += instruction + '\n';
    }

    getError() {
        //return this.errors;
        return this.Rerror;
    }

    putError(type, instruction, row, column) {
        //this.errors += 'ERROR ' + type + ', ' + instruction + ', Fila: ' + row + ', Columna: ' + column + '\n';
        this.Rerror.push({type: type, message: instruction, row: row, column: column});
    }

    getSymbol() {
        //return this.errors;
        return this.Rsymbol;
    }

    putSymbol(_ambit, _type, _type_exp, _type_var,  _type_c, /*_type_o,*/ _id, _pointer,_tag) {
        //this.errors += 'ERROR ' + type + ', ' + instruction + ', Fila: ' + row + ', Columna: ' + column + '\n';
        this.Rsymbol.push({ambit: _ambit, type: _type, type_exp: _type_exp, type_var: _type_var, type_c:  _type_c, /*type_o: _type_o,*/ id: _id, pointer: _pointer});
    }

    getFunction() {
        //return this.errors;
        return this.Rfunction;
    }

    putFunction(_ambit, _type, _type_exp, _type_o, _id, _param, _size, _row, _col) {
        //this.errors += 'ERROR ' + type + ', ' + instruction + ', Fila: ' + row + ', Columna: ' + column + '\n';
        this.Rfunction.push({ambit: _ambit, type: _type, type_exp: _type_exp, type_o: _type_o, id: _id, param: _param, size: _size, row: _row, column: _col});
    }

    newId() {
        return this.id++;
    }

    getId() {
        return this.id;
    }

}

export default Counter;