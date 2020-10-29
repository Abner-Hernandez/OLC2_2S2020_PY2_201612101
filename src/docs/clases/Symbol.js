class Symbol {
    
    constructor(_ambit, _type, _type_exp, _type_var,  _type_c, /*_type_o,*/ _id, _pointer,_tag){
        this.type = _type;
        this.type_exp = _type_exp;
        this.type_var = _type_var;
        this.type_c = _type_c;
        //this.type_o = _type_o;
        this.id = _id;
        this.ambit = _ambit;
        this.pointer = _pointer
        this.tag = _tag;
        this.arrayInfo = null;
        this.nDimension = -1;
    }
}
export default Symbol;