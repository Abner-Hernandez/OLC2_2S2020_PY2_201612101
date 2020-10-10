
class Node {

    constructor(_id,_value) {
        this.id = _id;
        this.value = _value;
        this.children = [];
    }

    addNode(node){
        this.children.push(node);
    }
}
export default Node;