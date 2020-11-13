%{
%}

/* Definición Léxica */
%lex

%options case-insensitive

%%

"//".*                              // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas

//SIMBOLOS
//incremento y decremento
"++"              return 'incremento';
"--"              return 'decremento';

//aritmeticos
"+"              return 'suma';
"-"              return 'resta';   
"*"              return 'multiplicacion';
"/"              return 'slash';
"%"              return 'modulo';

//relacionales
"!="               return 'diferente';
">="               return 'mayorigual';
"<="               return 'menorigual';
"<"                return 'menor';
">"                return 'mayor';
"=="               return 'identico';


//simbolos
"["              return 'llavea';     
"]"              return 'llavec';
"("              return 'parenta';     
")"              return 'parentc';
"{"              return 'corchetea';     
"}"              return 'corchetec';
","              return 'coma';
"."              return 'punto';
"="              return 'igual';
";"              return 'puntocoma';
":"              return 'dospuntos';

//Reservadas
"double"                return 'resvar';
"if"                    return 'resif';
"printf"                return 'resprint';
"stack"                 return 'resstack';
"heap"                  return 'resheap';
"goto"                  return 'resgoto';
"null"                  return 'resnull';
"void"                  return 'resvoid';
"int"                   return 'resint';
"return"                return 'resreturn';

"#include <stdio.h>"    return 'resinclude1';
"#include <math.h>"    return 'resinclude2';

/* Espacios en blanco */
[ \r\t]+                  {}
\n                  {}


//\"[^\"]*\"                            return 'cadena';
[0-9]+"."[0-9]+\b|[0-9]+\b    			     return 'number';
([a-zA-Z])[a-z0-9A-Z"_""ñ""Ñ"]*              return 'id';
["][%][c|i|d]["]                             return 'cprint';
//[t][0-9]+                                    return 'temporal';
//[L][0-9]+                                    return 'etiqueta';
//([\"]("\\\""|[^])*[^\\][\"])|[\"][\"] return 'cadena';
//([\"](\\\"|[^\"])*[^\\][\"])|[\"][\"]
//(["\""]("\\\""|~["\""])*~["\\"]["\""])|["\""]["\""]
//simbol = "\\\""
//part1 = [\"]({simbol}|[^\"])* [^\\] [\"]
//cadena = {part1}|[\"][\"]

<<EOF>>                 return 'EOF';

.                       {/*count.putError(Type.LEXICO,'Este es un error léxico: ' + yytext, yylloc.first_line, yylloc.first_column);*/}
/lex

/* Asociación de operadores y precedencia */

%right igual
%left identico, diferente
%left mayor, menor, mayorigual, menorigual
%left suma, resta
%left multiplicacion, slash,modulo
%left parenta,parentc,llavea,llavec

%start ini

%% /* Definición de la gramática */

ini
     : IMPORT IMPORT DECLA INSTRUCTIONS EOF {
          let tab = new InstructionTab();
          $$ = $1;
          $$ = $$.concat($2);
          $$ = $$.concat($3);
          $$ = $$.concat($4);
          //console.log($1)
          tab.instructions = $$;
          //return tab.operateBlock();
          //tab.operate()
          let m = tab.operate();
          //console.log(m);
          for(let aux of tab.Roptimize)
          {
               try{ add_console( JSON.stringify(aux) ); }catch(e){ console.log(e); }
          }
          //console.log(tab.Roptimize);
          return m;

     }
     | EOF {let tab1 = new InstructionTab(); tab.instructions = []; return tab.operateBlock();}
;

IMPORT
     : resinclude1 { $$ = [new Instruction($1,null,null,null,Type.IMPORT,0,this._$.first_line,this._$.first_column)]; }
     | resinclude2 { $$ = [new Instruction($1,null,null,null,Type.IMPORT,0,this._$.first_line,this._$.first_column)]; }
;

DECLA
     : DECLA DECLARATION {$$ = $1; $$ = $$.concat($2);}
     | DECLARATION {$$ = $1;}
;

LISTID
     : LISTID coma id {$$ = $1; $$ += ','+$3;}
     | id {$$ = ''+$1;}
;

DECLARATION
     : resvar LISTID puntocoma {$$ = [new Instruction($2,null,null,null,Type.DECLARATION,1,this._$.first_line,this._$.first_column)];}
     | resvar id igual EXP puntocoma {$$ = [new Instruction($2,$4.op,$4.left,$4.right,Type.DECLARATION,2,this._$.first_line,this._$.first_column)];}
     | resvar id igual EXP2 puntocoma {$$ = [new Instruction($2,null,$4,null,Type.DECLARATION,3,this._$.first_line,this._$.first_column)];}
     | resvar resstack llavea number llavec puntocoma {$$ = [new Instruction(Type.STACK,$4,'[',']',Type.DECLARATION,4,this._$.first_line,this._$.first_column)];}
     | resvar resheap llavea number llavec puntocoma {$$ = [new Instruction(Type.HEAP,$4,'[',']',Type.DECLARATION,5,this._$.first_line,this._$.first_column)];}
;

BLOCK
     : INSTRUCTIONS {$$ = $1;}
     | {$$ = [];}
;

INSTRUCTIONS
     : INSTRUCTIONS INSTRUCTION {$$ = $1; $$ = $$.concat($2);}
     | INSTRUCTION {$$ = []; $$ = $$.concat($1)}
;

INSTRUCTION
    : ASSIGNMENT {$$ = $1;}
    | LABEL {$$ = $1;}
    | GOTO {$$ = $1;}
    | IF {$$ = $1;}
    | PRINT {$$ = $1;}
    | PROC {$$ = $1;}
    | CALL {$$ = $1;}
    | RETURNTT {$$ = $1;}
;


ASSIGNMENT
     : id igual EXP puntocoma {$$ = [new Instruction($1,$3.op,$3.left,$3.right,Type.ASSIGNMENT,1,this._$.first_line,this._$.first_column)];}
     | id igual EXP2 puntocoma {$$ = [new Instruction($1,null,$3,null,Type.ASSIGNMENT,2,this._$.first_line,this._$.first_column)];}
     //| id igual resstack llavea parenta resint parentc EXP2 llavec puntocoma {$$ = [new Instruction($1,null,Type.STACK,$8,Type.ASSIGNMENT,3,this._$.first_line,this._$.first_column)];}
     | id igual resstack llavea EXP2 llavec puntocoma {$$ = [new Instruction($1,null,Type.STACK,$5,Type.ASSIGNMENT,3,this._$.first_line,this._$.first_column)];}
     //| id igual resheap llavea parenta resint parentc EXP2 llavec puntocoma {$$ = [new Instruction($1,null,Type.HEAP,$8,Type.ASSIGNMENT,4,this._$.first_line,this._$.first_column)];}
     | id igual resheap llavea EXP2 llavec puntocoma {$$ = [new Instruction($1,null,Type.HEAP,$5,Type.ASSIGNMENT,4,this._$.first_line,this._$.first_column)];}
     //| resstack llavea parenta resint parentc EXP2 llavec igual EXP2 puntocoma {$$ = [new Instruction(Type.STACK,null,$6,$9,Type.ASSIGNMENT,5,this._$.first_line,this._$.first_column)];}
     | resstack llavea EXP2 llavec igual EXP2 puntocoma {$$ = [new Instruction(Type.STACK,null,$3,$6,Type.ASSIGNMENT,5,this._$.first_line,this._$.first_column)];}
     //| resheap llavea parenta resint parentc EXP2 llavec igual EXP2 puntocoma {$$ = [new Instruction(Type.HEAP,null,$6,$9,Type.ASSIGNMENT,6,this._$.first_line,this._$.first_column)];}
     | resheap llavea EXP2 llavec igual EXP2 puntocoma {$$ = [new Instruction(Type.HEAP,null,$3,$6,Type.ASSIGNMENT,6,this._$.first_line,this._$.first_column)];}
;

LABEL
     : id dospuntos {$$ = [new Instruction($1,null,null,null,Type.LABEL,0,this._$.first_line,this._$.first_column)];}
;

GOTO
     : resgoto id puntocoma {$$ = [new Instruction($2,null,null,null,Type.GOTO,0,this._$.first_line,this._$.first_column)];}
;

IF
     : resif parenta EXPRT parentc resgoto id puntocoma {$$ = [new Instruction($6,$3.op,$3.left,$3.right,Type.IF,0,this._$.first_line,this._$.first_column)];}
;

PRINT
    : resprint parenta cprint coma EXP2 parentc puntocoma {$$ = [new Instruction(null,null,$3,$5,Type.PRINT,1,this._$.first_line,this._$.first_column)];}
    | resprint parenta cprint coma parenta resint parentc EXP2 parentc puntocoma {$$ = [new Instruction(null,null,$3,$8,Type.PRINT,2,this._$.first_line,this._$.first_column)];}
;

PROC
     : RETT id parenta parentc corchetea BLOCK corchetec {$$ = [new Instruction($2,$1,null,null,Type.PROC,0,this._$.first_line,this._$.first_column)]; $$ = $$.concat($6); $$.push(new Instruction('end',null,null,null,Type.END,this._$.first_line,this._$.first_column))}
     | RETT id parenta parentc puntocoma { $$ = [new Instruction($2,$1,null,null,Type.PROTOTYPE,0,this._$.first_line,this._$.first_column)]; }
;

RETT
     :resvoid
     |resint
;

CALL
     : id parenta parentc puntocoma {$$ = [new Instruction($1,null,null,null,Type.CALL,0,this._$.first_line,this._$.first_column)];}
;

RETURNTT
     :resreturn puntocoma {$$ = [new Instruction(null,null,null,null,Type.RETURN,1,this._$.first_line,this._$.first_column)];}
     |resreturn number puntocoma {$$ = [new Instruction($2,null,null,null,Type.RETURN,2,this._$.first_line,this._$.first_column)];}
;

//producciones para las operaciones relacionales
EXPRT
     : EXP2 diferente EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 identico EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 mayor EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 menor EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 mayorigual EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 menorigual EXP2 {$$ = {left: $1, op: $2, right: $3};}
;

//-----------------------------------------------------------------------------------------------------------

//producciones para operaciones aritmeticas
EXP
     : EXP2 suma EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 resta EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 multiplicacion EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 slash EXP2 {$$ = {left: $1, op: $2, right: $3};}
     | EXP2 modulo EXP2 {$$ = {left: $1, op: $2, right: $3};}
;

EXP2
     : number {$$ = {id: $1, type: Type.NUMBER};}
     | resta number {$$ = {id: '-'+$2, type: Type.NUMBER};}
     | parenta resint parentc id {$$ = {id: '(int)'+$4, type: Type.NUMBER};}
     | parenta resint parentc number {$$ = {id: '(int)'+$4, type: Type.NUMBER};}
     | resnull {$$ = {id: $1, type: Type.NULL};}
     | id {$$ = {id: $1, type: Type.ID};}
     | resta id {$$ = {id: '-'+$2, type: Type.ID};}
;