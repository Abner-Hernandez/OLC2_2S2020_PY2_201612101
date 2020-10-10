

function Globals (){
    this.clear = function(){
        Globals.Roptimize = [];
        Globals.output = '';
    }

    this.PutOptimize = function(opt){
        Globals.Roptimize.push(opt);
    }

    this.getOptimize = function(){
        return Globals.Roptimize;
    }

    this.putInstruction = function(inst) {
        Globals.output += inst +'\n';
    }

    this.getInstructions = function(inst) {
        return Globals.output;
    }

    this.concat = function(inst) {
        Globals.output += inst;
    }
}


Globals.Roptimize = [];
Globals.output = '';
export default Globals;