import Type from './Type'
const Globals = require('./Globals')

class InstructionTab {
    instructions = [];
    Roptimize = [];
    outputs = '';
    constructor() {
        this.instructions = []
        this.Roptimize = [];
        this.outputs = '';
    }

    putInstruction(instruction) {
        this.outputs += instruction + '\n';
    }

    putRInstruction(_no, _description, _row, _col) {
        //const global = new Globals();
        this.PutOptimize({ no: _no, description: _description, row: _row, column: _col })
    }

    PutOptimize(opt) {
        this.Roptimize.push(opt);
    }

    operate() {
        //const global = new Globals();
        for (var i = 0; i < this.instructions.length; i++) {
            switch (this.instructions[i].type) {
                case Type.ASSIGNMENT:
                    i = this.rule_assig_dec(i);
                    break;
                case Type.DECLARATION:
                    i = this.rule_assig_dec(i);
                    break;
                case Type.IF:
                    //i = this.rule_assig_dec(i);
                    i = this.rule_ifs(i);
                    //i++;
                    break;
                case Type.GOTO:
                    i = this.rule_gotos(i);
                    continue;
                    
            }
        }

        for (var i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i].type == Type.DECLARATION) {
                switch (this.instructions[i].t) {
                    case 1:
                        this.putInstruction('double ' + this.instructions[i].id + ';');
                        break;
                    case 2:
                        this.putInstruction('double ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';');
                        break;
                    case 3:
                        this.putInstruction('double ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';');
                        break;
                    case 4:
                        this.putInstruction('double stack[' + this.instructions[i].op + '];');
                        break;
                    case 5:
                        this.putInstruction('double heap[' + this.instructions[i].op + '];');
                        break;
                }
            } else if (this.instructions[i].type == Type.ASSIGNMENT) {
                switch (this.instructions[i].t) {
                    case 1:
                        this.putInstruction(this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';');
                        break;
                    case 2:
                        this.putInstruction(this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';');
                        break;
                    case 3:
                        this.putInstruction(this.instructions[i].id + ' = stack[' + this.instructions[i].right.id + '];');
                        break;
                    case 4:
                        this.putInstruction(this.instructions[i].id + ' = heap[' + this.instructions[i].right.id + '];');
                        break;
                    case 5:
                        this.putInstruction('stack[' + this.instructions[i].left.id + '] = ' + this.instructions[i].right.id + ';');
                        break;
                    case 6:
                        this.putInstruction('heap[' + this.instructions[i].left.id + '] = ' + this.instructions[i].right.id + ';');
                        break;
                }
            } else if (this.instructions[i].type == Type.LABEL) {
                this.putInstruction(this.instructions[i].id + ':');
            } else if (this.instructions[i].type == Type.GOTO) {
                this.putInstruction('goto ' + this.instructions[i].id + ';');
            } else if (this.instructions[i].type == Type.IF) {
                this.putInstruction('if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id + ';');
            } else if (this.instructions[i].type == Type.PRINT) {
                if(this.instructions[i].t == 1){
                    this.putInstruction('printf(' + this.instructions[i].left + ',' + this.instructions[i].right.id + ');');
                }else {
                    this.putInstruction('printf(' + this.instructions[i].left + ',(int)' + this.instructions[i].right.id + ');');
                }
            } else if (this.instructions[i].type == Type.RETURN) {
                if(this.instructions[i].t == 1){
                    this.putInstruction('return;');
                }else {
                    this.putInstruction('return ' + this.instructions[i].id + ';');
                }
            } else if (this.instructions[i].type == Type.IMPORT) {
                this.putInstruction(this.instructions[i].id);
            } else if (this.instructions[i].type == Type.PROTOTYPE) {
                this.putInstruction(this.instructions[i].op + ' ' + this.instructions[i].id + '();\n');
            } else if (this.instructions[i].type == Type.PROC) {
                this.putInstruction(this.instructions[i].op + ' ' + this.instructions[i].id + '() {');
            } else if (this.instructions[i].type == Type.END) {
                this.putInstruction('}');
            } else if (this.instructions[i].type == Type.CALL) {
                this.putInstruction(this.instructions[i].id + '();');
            }
        }

        return this.outputs;
    }

    operateBlock() {
        //const global = new Globals();
        var block = '';
        var last = 'INIT';
        var actual = 'INIT1';
        var connections = '';
        this.putInstruction('"INIT" [\nlabel = "INIT"\nshape = "record"\n];');
        for (var i = 0; i < this.instructions.length; i++) {
            switch (this.instructions[i].type) {
                case Type.DECLARATION:
                    switch (this.instructions[i].t) {
                        case 1:
                            block += 'double ' + this.instructions[i].id + ';\\n';
                            break;
                        case 2:
                            block += 'double ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';\\n';
                            break;
                        case 3:
                            block += 'double ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';\\n';
                            break;
                        case 4:
                            block += 'double Stack[];\\n';
                            break;
                        case 5:
                            block += 'double Heap[];\\n';
                            break;
                    }
                    break;
                case Type.ASSIGNMENT:
                    switch (this.instructions[i].t) {
                        case 1:
                            block += this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';\\n';
                            break;
                        case 2:
                            block += this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';\\n';
                            break;
                        case 3:
                            block += this.instructions[i].id + ' = Stack[' + this.instructions[i].right.id + '];\\n';
                            break;
                        case 4:
                            block += this.instructions[i].id + ' = Heap[' + this.instructions[i].right.id + '];\\n';
                            break;
                        case 5:
                            block += 'Stack[' + this.instructions[i].left.id + '] = ' + this.instructions[i].right.id + ';\\n';
                            break;
                        case 6:
                            block += 'Heap[' + this.instructions[i].left.id + '] = ' + this.instructions[i].right.id + ';\\n';
                            break;
                    }
                    break;
                case Type.LABEL:
                    if (block !== '') {
                        this.putInstruction('"' + actual + '" [\nlabel = "' + block + '"\nshape = "record"\n];');
                        block = '';
                        //global.putInstruction('"' + last + '" -> "' + actual + '"; ');
                        connections += '"' + last + '" -> "' + actual + '";\n';
                        last = actual;

                    }
                    actual = this.instructions[i].id;
                    block += this.instructions[i].id + ':\\n';
                    break;
                case Type.GOTO:
                    block += 'goto ' + this.instructions[i].id + ';\\n';
                    if (block !== '') {
                        this.putInstruction('"' + actual + '" [\nlabel = "' + block + '"\nshape = "record"\n];');
                        block = '';
                        //global.putInstruction('"' + last + '" -> "' + actual + '";');
                        connections += '"' + last + '" -> "' + actual + '";\n';
                        //global.putInstruction('"'+actual+'" -> "'+this.instructions[i].id+'";');
                        connections += '"' + actual + '" -> "' + this.instructions[i].id + '";\n';
                        last = actual;
                        actual = 'node' + i + '';
                    }
                    break;
                case Type.IF:
                    block += 'if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id + ';\\n';
                    if (block !== '') {
                        this.putInstruction('"' + actual + '" [\nlabel = "' + block + '"\nshape = "record"\n];');
                        block = '';
                        //global.putInstruction('"' + last + '" -> "' + actual + '";');
                        connections += '"' + last + '" -> "' + actual + '";\n';
                        //global.putInstruction('"'+actual+'" -> "'+this.instructions[i].id+'";');
                        last = actual;
                        actual = 'node' + i + '';
                    }
                    break;
                case Type.PRINT:
                    //block += 'print(' + this.instructions[i].left + ',' + this.instructions[i].right.id + ');\\n';
                    block += 'print(,' + this.instructions[i].right.id + ');\\n';
                    break;
                case Type.PROC:
                    if (block !== '') {
                        this.putInstruction('"' + actual + '" [\nlabel = "' + block + '"\nshape = "record"\n];');
                        block = '';
                        //global.putInstruction('"' + last + '" -> "' + actual + '"; ');
                        connections += '"' + last + '" -> "' + actual + '";\n';
                        last = actual;
                        //actual = this.instructions[i].id;
                        //block += 'proc ' + this.instructions[i].id + ' begin\\n';
                    }
                    block += 'proc ' + this.instructions[i].id + ' begin\\n';
                    actual = this.instructions[i].id;
                    break;
                case Type.END:
                    block += 'end\\n';
                    break;
                case Type.CALL:
                    block += 'call ' + this.instructions[i].id + ';\\n';
                    if (block !== '') {
                        this.putInstruction('"' + actual + '" [\nlabel = "' + block + '"\nshape = "record"\n];');
                        block = '';
                        //global.putInstruction('"' + last + '" -> "' + actual + '";');
                        connections += '"' + last + '" -> "' + actual + '";\n';
                        //global.putInstruction('"'+actual+'" -> "'+this.instructions[i].id+'";');
                        connections += '"' + actual + '" -> "' + this.instructions[i].id + '";\n';
                        last = actual;
                        actual = 'node' + i + '';
                    }
                    break;
            }
        }
        this.putInstruction('"' + actual + '" [\nlabel = "' + block + '"\nshape = "record"\n];');
        connections += '"' + last + '" -> "' + actual + '";\n';
        this.putInstruction('\nlabel = "Block Report";\n}');
        this.putInstruction(connections);
        connections = '';
        return this.outputs

    }

    rule_assig_dec(i) {
        if (this.instructions[i].op !== null && this.instructions[i].right !== null) {

            switch (this.instructions[i].op) {
                case '+':
                    if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id === this.instructions[i].id) {

                        this.putRInstruction(6, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i = i - 1;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id === this.instructions[i].id) {

                        this.putRInstruction(6, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i = i - 1;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(10, 'se elimino "+0" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id !== this.instructions[i].id) {

                        this.putRInstruction(10, 'se elimino "0+" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left = this.instructions[i].right;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && this.instructions[i].right.id === '0') {
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    }
                    break;
                case '-':
                    if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id === this.instructions[i].id) {

                        this.putRInstruction(7, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(11, 'se elimino "+0" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && this.instructions[i].right.id === '0') {
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    }
                    break;
                case '*':
                    if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '1' && this.instructions[i].left.id === this.instructions[i].id) {

                        this.putRInstruction(8, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (this.instructions[i].left.id === '1' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id === this.instructions[i].id) {

                        this.putRInstruction(8, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '1' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(12, 'se elimino "*1" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '1' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id !== this.instructions[i].id) {

                        this.putRInstruction(12, 'se elimino "1*" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left = this.instructions[i].right;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].right.id === '2') {

                        this.putRInstruction(14, 'se transformo "*2" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = this.instructions[i].left;
                        this.instructions[i].op = '+'
                        return i;
                    } else if (this.instructions[i].left.id === '2') {

                        this.putRInstruction(14, 'se transformo "2*" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left = this.instructions[i].right;
                        this.instructions[i].op = '+'
                        return i;
                    } else if (this.instructions[i].right.id === '0') {

                        this.putRInstruction(15, 'se transformo "*0" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left.id = '0';
                        this.instructions[i].left.type = Type.NUMBER;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0') {

                        this.putRInstruction(15, 'se transformo "0*" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left.id = '0';
                        this.instructions[i].left.type = Type.NUMBER;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    }
                    break;
                case '/':
                    if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '1' && this.instructions[i].left.id === this.instructions[i].id) {

                        this.putRInstruction(9, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '1' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(13, 'se elimino "*1" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id !== this.instructions[i].id) {

                        this.putRInstruction(16, 'se elimino "0/" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left.id = '0';
                        this.instructions[i].left.type = Type.NUMBER;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    }
                    break;
            }
        }
        return i;
    }

    rule_ifs(i) {
        if (this.instructions[i].left.type === Type.NUMBER && this.instructions[i].right.type === Type.NUMBER) {
            if (this.instructions[i].left.id === this.instructions[i].right.id) {
                if (i + 1 < this.instructions.length) {
                    if (this.instructions[i + 1].type === Type.GOTO) {
                        this.putRInstruction(3, 'se optimizo if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);
                        /*this.instructions[i].type = Type.GOTO;
                        this.instructions[i].left = null;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;*/
                        this.instructions.splice(i + 1, 1);
                        return i;
                    }
                }
            } else if (this.instructions[i].left.id !== this.instructions[i].right.id) {

                this.putRInstruction(4, 'se elimino if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);

                this.instructions.splice(i, 1);
                //i = i - 1;
                return i;
            }
        }
        return i;
    }

    rule_gotos(i) {
        var j = 0;
        var ind = 0;
        for (j = i + 1; j < this.instructions.length; j++) {
            if (this.instructions[j].type === Type.LABEL) {
                break;
            }
            if (this.instructions[j].type === Type.PROC) {
                break;
            }
            ind++;
        }

        //his.instructions.splice((i+1),ind);

        if (this.instructions[j].id === this.instructions[i].id) {
            this.putRInstruction(1, 'se elimino ' + ind + ' instrucciones no alcanzables de goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);
            this.instructions.splice(i+1, ind);
            return i+1;
        }/* else if (this.instructions[j].id !== this.instructions[i].id) {
            this.putRInstruction(20, 'se elimino ' + ind + ' instrucciones no alcanzables de goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);
            //this.instructions.splice(i,1);

            this.instructions.splice((i + 1), ind);
            return i;
        }*/
        return i;

    }
}
export default InstructionTab;