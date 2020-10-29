const Count = require('./Counters');
const Type = require('./Type');

class Cast {
    constructor(_type, _exp, _row, _column) {
        this.type = _type;
        this.exp = _exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab, count) {
        //var count = new Count();
        var e = this.exp.operate(tab, count);
        if (e === null) {
            count.putError(Type.SEMANTICO, 'Expresion No valida para Castear.', this.row, this.column);
            return null;
        }
        if(e.type_exp !== Type.VALOR){
            count.putError(Type.SEMANTICO, 'Los Casteos solo pueden ser aplicados a VALORES, tipo '+e.type_exp+' No Permitido.', this.row, this.column);
            return null;
        }
        
        switch (this.type) {
            case Type.ENTERO:
                if (e.type === Type.DECIMAL) {
                    var t1 = count.getNextTemporal();
                    e.type = Type.ENTERO;
                    count.putInstruction(t1+' = '+e.value+' % 1;');
                    count.putInstruction(t1+' = '+e.value+' - '+t1+';');
                    e.value = t1;
                    return e;
                } else {
                    count.putError(Type.SEMANTICO, 'No se puede Castear a INTEGER el tipo ' + e.type + '.', this.row, this.column);
                    return null;
                }
                break;
            case Type.CARACTER:
                if (e.type === Type.DECIMAL) {
                    var t1 = count.getNextTemporal();
                    e.type = Type.CARACTER;
                    count.putInstruction(t1+' = '+e.value+' % 1;');
                    count.putInstruction(t1+' = '+e.value+' - '+t1+';');
                    e.value = t1;
                    return e;
                } else if (e.type === Type.ENTERO) {
                    e.type = Type.CARACTER;
                    return e;
                } else {
                    count.putError(Type.SEMANTICO, 'No se puede Castear a INTEGER el tipo ' + e.type + '.', this.row, this.column);
                    return null;
                }
                break;
            default:
                count.putError(Type.SEMANTICO, 'El tipo ' + this.type + ' No es permitido para Casteos.', this.row, this.column);
                return null;
        }
    }
}

module.exports = Cast;