

class Instruction{
    constructor(_id, _op, _left, _right, _type, _t, _row, _column){
        this.id = _id;
        this.left = _left;
        this.op = _op
        this.right = _right;
        this.type = _type;
        this.t = _t;
        this.row = _row;
        this.column = _column;
    }
}
export default Instruction;