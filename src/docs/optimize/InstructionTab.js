const Type = require('./Type')
const Globals = require('./Globals')

class InstructionTab {
    constructor() {
        this.instructions = []
        this.Roptimize = [];
        this.outputs = '';
    }

    putInstruction(instruction) {
        this.outputs += instruction +'\n';
    }

    putRInstruction(_no, _description, _row, _col) {
        const global = new Globals();
        global.PutOptimize({ no: _no, description: _description, row: _row, column: _col })
    }

    operate() {
        const global = new Globals();
        for (var i = 0; i < this.instructions.length; i++) {

            switch (this.instructions[i].type) {
                case Type.ASSIGNMENT:
                    i = this.rules8_18(i);
                    break;
                case Type.DECLARATION:
                    i = this.rules8_18(i);
                    break;
                case Type.IF:
                    //i = this.rules8_18(i);
                    i = this.rule3_5(i);
                    //i++;
                    break;
                case Type.GOTO:
                    i = this.rule2_20(i);
                    continue;
                    
            }
        }

        for (var i = 0; i < this.instructions.length; i++) {
            switch (this.instructions[i].type) {
                case Type.DECLARATION:
                    switch (this.instructions[i].t) {
                        case 1:
                            global.putInstruction('var ' + this.instructions[i].id + ';');
                            break;
                        case 2:
                            global.putInstruction('var ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';');
                            break;
                        case 3:
                            global.putInstruction('var ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';');
                            break;
                        case 4:
                            global.putInstruction('var Stack[];');
                            break;
                        case 5:
                            global.putInstruction('var Heap[];');
                            break;
                    }
                    break;
                case Type.ASSIGNMENT:
                    switch (this.instructions[i].t) {
                        case 1:
                            global.putInstruction(this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';');
                            break;
                        case 2:
                            global.putInstruction(this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';');
                            break;
                        case 3:
                            global.putInstruction(this.instructions[i].id + ' = Stack[' + this.instructions[i].right.id + '];');
                            break;
                        case 4:
                            global.putInstruction(this.instructions[i].id + ' = Heap[' + this.instructions[i].right.id + '];');
                            break;
                        case 5:
                            global.putInstruction('Stack[' + this.instructions[i].left.id + '] = ' + this.instructions[i].right.id + ';');
                            break;
                        case 6:
                            global.putInstruction('Heap[' + this.instructions[i].left.id + '] = ' + this.instructions[i].right.id + ';');
                            break;
                    }
                    break;
                case Type.LABEL:
                    global.putInstruction(this.instructions[i].id + ':');
                    break;
                case Type.GOTO:
                    global.putInstruction('goto ' + this.instructions[i].id + ';');
                    break;
                case Type.IF:
                    global.putInstruction('if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id + ';');
                    break;
                case Type.PRINT:
                    global.putInstruction('print(' + this.instructions[i].left + ',' + this.instructions[i].right.id + ');');
                    break;
                case Type.PROC:
                    global.putInstruction('proc ' + this.instructions[i].id + ' begin');
                    break;
                case Type.END:
                    global.putInstruction('end');
                    break;
                case Type.CALL:
                    global.putInstruction('call ' + this.instructions[i].id + ';');
                    break;
            }
        }


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
                            block += 'var ' + this.instructions[i].id + ';\\n';
                            break;
                        case 2:
                            block += 'var ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ';\\n';
                            break;
                        case 3:
                            block += 'var ' + this.instructions[i].id + ' = ' + this.instructions[i].left.id + ';\\n';
                            break;
                        case 4:
                            block += 'var Stack[];\\n';
                            break;
                        case 5:
                            block += 'var Heap[];\\n';
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
                        connections += '"'+actual+'" -> "'+this.instructions[i].id+'";\n';
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
                        connections += '"'+actual+'" -> "'+this.instructions[i].id+'";\n';
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

    rules8_18(i) {
        if (this.instructions[i].op !== null && this.instructions[i].right !== null) {

            switch (this.instructions[i].op) {
                case '+':
                    if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id === this.instructions[i].id) {

                        this.putRInstruction(8, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i = i - 1;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id === this.instructions[i].id) {

                        this.putRInstruction(8, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i = i - 1;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(12, 'se elimino "+0" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id !== this.instructions[i].id) {

                        this.putRInstruction(12, 'se elimino "0+" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

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

                        this.putRInstruction(9, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '0' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(13, 'se elimino "+0" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

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

                        this.putRInstruction(10, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (this.instructions[i].left.id === '1' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id === this.instructions[i].id) {

                        this.putRInstruction(10, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '1' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(14, 'se elimino "*1" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '1' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id !== this.instructions[i].id) {

                        this.putRInstruction(14, 'se elimino "1*" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left = this.instructions[i].right;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].right.id === '2') {

                        this.putRInstruction(16, 'se transformo "*2" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = this.instructions[i].left;
                        return i;
                    } else if (this.instructions[i].left.id === '2') {

                        this.putRInstruction(16, 'se transformo "2*" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left = this.instructions[i].right;
                        return i;
                    } else if (this.instructions[i].right.id === '0') {

                        this.putRInstruction(17, 'se transformo "*0" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].left.id = '0';
                        this.instructions[i].left.type = Type.NUMBER;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0') {

                        this.putRInstruction(17, 'se transformo "0*" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

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

                        this.putRInstruction(11, 'se elimino ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions.splice(i, 1);
                        i--;
                        return i;
                    } else if (/*this.instructions[i].left.type === Type.ID &&*/ this.instructions[i].right.id === '1' && this.instructions[i].left.id !== this.instructions[i].id) {

                        this.putRInstruction(15, 'se elimino "*1" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions[i].t = 2;
                        return i;
                    } else if (this.instructions[i].left.id === '0' && /*this.instructions[i].right.type === Type.ID &&*/ this.instructions[i].right.id !== this.instructions[i].id) {

                        this.putRInstruction(18, 'se elimino "0/" de ' + this.instructions[i].id + '= ' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id, this.instructions[i].row, this.instructions[i].column);

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

    rule3_5(i) {
        if (this.instructions[i].left.type === Type.NUMBER && this.instructions[i].right.type === Type.NUMBER) {
            if (this.instructions[i].left.id === this.instructions[i].right.id) {
                if (i + 1 < this.instructions.length) {
                    if (this.instructions[i + 1].type === Type.GOTO) {
                        this.putRInstruction(4, 'se elimino if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);
                        this.instructions[i].type = Type.GOTO;
                        this.instructions[i].left = null;
                        this.instructions[i].right = null;
                        this.instructions[i].op = null;
                        this.instructions.splice(i + 1, 1);
                        return i;
                    }
                }
            } else if (this.instructions[i].left.id !== this.instructions[i].right.id) {

                this.putRInstruction(5, 'se elimino if(' + this.instructions[i].left.id + this.instructions[i].op + this.instructions[i].right.id + ') goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);

                this.instructions.splice(i, 1);
                //i = i - 1;
                return i;
            }
        }
        return i;
    }

    rule2_20(i) {
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
            this.putRInstruction(2, 'se elimino ' + ind + ' instrucciones no alcanzables de goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);
            this.instructions.splice(i,ind+1);
            return i;
        } else if (this.instructions[j].id !== this.instructions[i].id) {
            this.putRInstruction(20, 'se elimino ' + ind + ' instrucciones no alcanzables de goto ' + this.instructions[i].id, this.instructions[i].row, this.instructions[i].column);
            //this.instructions.splice(i,1);
            
            this.instructions.splice((i+1),ind);
            return i;
        }
        return i;

    }
}
export default InstructionTab;