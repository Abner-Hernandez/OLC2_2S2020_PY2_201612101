
%{
     let id = 0;
     let root;

     function createAST(root) {
          let ret = "digraph G {node[shape=rectangle];\n";
          ret += loopAST(root);
          ret += "\n}";
          return ret;
     }

     function loopAST(root) {
          let ret = "";
          if (root !== null) {
               //console.log(root.children.length);
               for (let i = 0; i < root.children.length; i++) {

                    if (root.children.length > 0) {
                         try
                         {
                         root.value = root.value.replace(/\"/g, "");
                         root.children[i].value = root.children[i].value.replace(/\"/g, "");
                         root.children[i].value = root.children[i].value.replace(/\\/g, "#");
                         ret += "\"" + root.id + ". " + root.value + "\"->\"" + root.children[i].id + ". " + root.children[i].value + "\"" + "\n";
                         ret += loopAST(root.children[i]);
                         }catch(e){ console.log(e); console.log(e)}
                    }
               }
          }
          return ret;
     }


     function check_to_add(node)
     {
          if(node.children.length === 1 && node.children[0].value === "epsilon")
               return false;
          else 
               return true;
     }
     /*
import Node from './clases/Node';
export 
     */
%}

/* Definición Léxica */
%lex

%options case-sensitive

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
"**"              return 'potencia';
"*"              return 'multiplicacion';
"/"              return 'slash';
"%"              return 'modulo';
"?"              return 'quest';

//relacionales
">="               return 'mayorigual';
"<="               return 'menorigual';
"<"                return 'menor';
">"                return 'mayor';
"=="               return 'identico';
"==="              return 'referencias';
"!="               return 'diferente';

//simbolos
"["              return 'llavea';     
"]"              return 'llavec';
"{"              return 'corchetea';     
"}"              return 'corchetec';
"("              return 'parenta';     
")"              return 'parentc';
","              return 'coma';
"."              return 'punto';
"="              return 'igual';
";"              return 'puntocoma';
":"              return 'dospuntos';

//logicos
"!"              return 'not';
"&&"              return 'and';
"||"              return 'or';



//Reservadas
"null"                  return 'resnull';
"undefined"             return 'resundefined';
"function"              return 'resfunction';
"Array"                 return 'resarray';
"number"                return 'resnumber';
"let"                   return 'reslet';
"const"                 return 'resconst';
"type"                  return 'restype';
"string"                return 'resstring';
"true"                  return 'restrue';
"false"                 return 'resfalse';
"if"                    return 'resif';
"else"                  return 'reselse';
"switch"                return 'resswitch';
"case"                  return 'rescase';
"default"               return 'resdefault';
"break"                 return 'resbreak';
"continue"              return 'rescontinue';
"return"                return 'resreturn';
"console.log"           return 'resprint';
"void"                  return 'resvoid';
"for"                   return 'resfor';
"while"                 return 'reswhile';
"do"                    return 'resdo';
"boolean"               return 'resboolean';
"in"                    return 'resin';
"of"                    return 'resof';
"push"                  return 'respush';
"length"                return 'reslength';
"graficar_ts"           return 'resgraficar_ts';
"CharAt"                return 'resCharAt';
"ToLowerCase"           return 'resToLowerCase';
"ToUpperCase"           return 'resToUpperCase';
"Concat"                return 'resConcat';
"new"                   return 'resnew';

/* Espacios en blanco */
[ \r\t\n]+                  {}
[0-9]+"."[0-9]+\b|[0-9]+\b    			                         return 'number';
([\"]("\\\""|[^"])*[^\\][\"])|[\"][\"]|[\'][^']*[\']|"`"[^`]*"`"        return 'cadena';
([a-zA-Z"_"])[a-z0-9A-Z"_""ñ""Ñ"]*                                    return 'id';
<<EOF>>                 return 'EOF';

.                       { }
/lex

/* Asociación de operadores y precedencia */

%right igual
%left incremento
%left decremento
%left or, quest
%left and
%left identico, diferente, referencias
%left mayor, menor, mayorigual, menorigual
%left suma, resta
%left multiplicacion, slash,modulo
%right potencia
%right not
%left parenta,parentc,llavea,llavec

%start ini

%% /* Definición de la gramática */

ini
	: INSTRUCTIONSG EOF { root = new Node(id++,"INSTRUCTIONSG"); root.children.push($1); let arbol = createAST(root); return arbol;}
     | EOF
;

DEFTYPES
     :restype id igual corchetea ATTRIB corchetec puntocoma {$$ = new Node(id++,"DEFTYPES"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4)); $$.children.push($5); $$.children.push(new Node(id++,$7)); }
;

ATTRIB
     :ATTRIB coma id dospuntos TYPES {$$ = new Node(id++,"ATTRIB");$$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4)); $$.children.push($5);}
     |id dospuntos TYPES {$$ = new Node(id++,"ATTRIB"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
;

INSTRUCTIONSG
	: INSTRUCTIONG INSTRUCTIONSG {$$ = new Node(id++,"INSTRUCTIONSG");$$.children.push($1); $$.children.push($2);}
	| INSTRUCTIONG {$$ = new Node(id++,"INSTRUCTIONSG");$$.children.push($1);}
;

INSTRUCTIONG
	: FUNCTIONG {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | DECLARATION puntocoma {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | ASSIGMENTWITHTYPE {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | DEFTYPES {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | IF {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | SWITCH {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | WHILE {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | DOWHILE puntocoma {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | FOR {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1);}
     | PRINT puntocoma {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | CALLF puntocoma {$$ = new Node(id++,"INSTRUCTIONG");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | GRAFICAR puntocoma {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | error { /*this is error*/ console.log($1); }
;

FUNCTIONG
    : resfunction id parenta LISTAPARAMETROS parentc RETURNT BLOCKF {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); $$.children.push(new Node(id++,$5)); if(check_to_add($6) === true) {$$.children.push($6)}; $$.children.push($7);}
    | resfunction id parenta parentc RETURNT BLOCKF {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4));  if(check_to_add($5) === true) {$$.children.push($5);} $$.children.push($6);}
;


FUNCTIONL
    : resfunction id parenta LISTAPARAMETROS parentc RETURNT BLOCKF {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); $$.children.push(new Node(id++,$5)); if(check_to_add($6) === true) {$$.children.push($6)}; $$.children.push($7);}
    | resfunction id parenta parentc RETURNT BLOCKF {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4));  if(check_to_add($5) === true) {$$.children.push($5);} $$.children.push($6);}
;

BLOCKF
     : corchetea BLOCK2F {$$ = new Node(id++,"BLOCKF");$$.children.push(new Node(id++,$1));$$.children.push($2);}
;

BLOCK2F
     : INSTRUCTIONSF corchetec {$$ = new Node(id++,"BLOCK2F");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | corchetec {$$ = new Node(id++,"BLOCK2F"); $$.children.push(new Node(id++,$1)); }
;

INSTRUCTIONSF
     : INSTRUCTIONF INSTRUCTIONSF {$$ = new Node(id++,"INSTRUCTIONF");$$.children.push($1);$$.children.push($2);}
     | INSTRUCTIONF {$$ = new Node(id++,"INSTRUCTIONF");$$.children.push($1);}
;

INSTRUCTIONF
     : INSTRUCTION {$$ = new Node(id++,"INSTRUCTIONF");$$.children.push($1);}
     | FUNCTIONL {$$ = new Node(id++,"INSTRUCTIONF");$$.children.push($1);}
;

RETURNT
     :dospuntos TYPESF {$$ = new Node(id++,"RETURNT");$$.children.push(new Node(id++,$1));$$.children.push($2);}
     | {$$ = new Node(id++,"RETURNT"); $$.children.push(new Node(id++,"epsilon"));}
;

TYPESF 
     : TYPES {$$ = new Node(id++,"TYPESF");$$.children.push($1);}
     | resvoid {$$ = new Node(id++,"TYPESF"); $$.children.push(new Node(id++,$1)); }
;

TYPE
     : resinteger {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resboolean {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resstring {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | id {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resnumber {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resundefined {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
;

TYPES
     : resarray menor TYPES mayor {$$ = new Node(id++,"TYPES"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4));}
     | TYPE MULTIDIMENSION {$$ = new Node(id++,"TYPES");$$.children.push($1); $$.children.push($2);}
     | TYPE {$$ = new Node(id++,"TYPES");$$.children.push($1);}
;

MULTIDIMENSION
     : llavea llavec MULTIDIMENSION {$$ = new Node(id++,"MULTIDIMENSION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
     | llavea llavec {$$ = new Node(id++,"MULTIDIMENSION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
;
/*
LISTAPARAMETROS
     : LISTAPARAMETROS coma id dospuntos TYPES {$$ = new Node(id++,"LISTAPARAMETROS"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4)); $$.children.push($5);}
     | id dospuntos TYPES {$$ = new Node(id++,"LISTAPARAMETROS"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
;
*/
LISTAPARAMETROS
     : LSPBETHA LISTAPARAMETROSPRIM { $$ = new Node(id++,"LISTAPARAMETROS"); $$.children.push($1);$$.children.push($2); }
;

LISTAPARAMETROSPRIM
     : LSALPHA LISTAPARAMETROSPRIM { $$ = new Node(id++,"LISTAPARAMETROSPRIM"); $$.children.push($1);$$.children.push($2); }
     | { $$ = new Node(id++,"epsilon"); }
;

LSPBETHA
     : id dospuntos TYPES { $$ = new Node(id++,"LSPBETHA"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
;

LSALPHA
     : coma id dospuntos TYPES { $$ = new Node(id++,"LSALPHA");  $$.children.push(new Node(id++,$1));  $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); }
;

TYPEVAR
     : resconst {$$ = new Node(id++,"TYPEVAR"); $$.children.push(new Node(id++,$1)); }
     | reslet {$$ = new Node(id++,"TYPEVAR"); $$.children.push(new Node(id++,$1)); }
;

DECLARATION
     : TYPEVAR LISTID {$$ = new Node(id++,"DECLARATION"); $$.children.push($1); $$.children.push($2);}
;

/*
LISTID
     : LISTID coma id dospuntos TYPES ASSVALUE {$$ = new Node(id++,"LISTID"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4)); $$.children.push($5); if(check_to_add($6) === true){$$.children.push($6);}}
     | id dospuntos TYPES ASSVALUE {$$ = new Node(id++,"LISTID"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); if(check_to_add($4) === true){$$.children.push($4);}}
     | LISTID coma id ASSVALUE {$$ = new Node(id++,"LISTID"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); if(check_to_add($4) === true){$$.children.push($4);}}
     | id ASSVALUE {$$ = new Node(id++,"LISTID");$$.children.push(new Node(id++,$1));if(check_to_add($2) === true){$$.children.push($2);}}
;
*/

LISTID
     : LISPBETHA LISTIDPRIM { $$ = new Node(id++,"LISTID"); $$.children.push($1);$$.children.push($2); }
;

LISTIDPRIM
     : LISALPHA LISTIDPRIM { $$ = new Node(id++,"LISTIDPRIM"); $$.children.push($1);$$.children.push($2); }
     | { $$ = new Node(id++,"epsilon"); }
;

LISPBETHA
     : id ASSVALUE {$$ = new Node(id++,"LISPBETHA");$$.children.push(new Node(id++,$1));if(check_to_add($2) === true){$$.children.push($2);}}
     | id dospuntos TYPES ASSVALUE {$$ = new Node(id++,"LISPBETHA"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); if(check_to_add($4) === true){$$.children.push($4);}}
;

LISALPHA
     : coma id ASSVALUE {$$ = new Node(id++,"LISALPHA"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); if(check_to_add($3) === true){$$.children.push($3);}} 
     | coma id dospuntos TYPES ASSVALUE {$$ = new Node(id++,"LISALPHA"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); if(check_to_add($5) === true){$$.children.push($5);}}
;

ASSVALUE
     : igual EXPRT {$$ = new Node(id++,"ASSVALUE");$$.children.push(new Node(id++,$1));$$.children.push($2);}
     //| igual llavea llavec {$$ = new Node(id++,"ASSVALUE"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3));}
     //| igual llavea DATAPRINT llavec {$$ = new Node(id++,"ASSVALUE"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4));}
     | igual DECASSTYPE {$$ = new Node(id++,"CONTENTASWT"); $$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | {$$ = new Node(id++,"ASSVALUE"); $$.children.push(new Node(id++,"epsilon"));}
;

BLOCK
     : corchetea BLOCK2 {$$ = new Node(id++,"BLOCK");$$.children.push(new Node(id++,'{'));$$.children.push($2);}
;

BLOCK2
     : INSTRUCTIONS corchetec {$$ = new Node(id++,"BLOCK2");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | corchetec {$$ = new Node(id++,"BLOCK2"); $$.children.push(new Node(id++,$1)); }
;

/*
INSTRUCTIONS
     : INSTRUCTIONS INSTRUCTION { $2 = "\n" + $2; $$ =  $1 + $2; }
     | INSTRUCTION { $$ = "\n" + $1; }
;
*/

INSTRUCTIONS
     : INSTRUCTION INSTRUCTIONS {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push($2);}
     | INSTRUCTION {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
;

/*
INSTRUCTIONPRIM
     : INSTRUCTION INSTRUCTIONPRIM { $$ = "\n" + $1 + $2; }
     | { $$ = ""; }
;
*/

INSTRUCTION
     : DECLARATION puntocoma {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | ASSIGMENTWITHTYPE {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
     | IF {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
     | SWITCH {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
     | WHILE {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
     | DOWHILE puntocoma {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | FOR {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
     | PRINT puntocoma {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | CALLF puntocoma {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | resbreak puntocoma {$$ = new Node(id++,"INSTRUCTION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
     | rescontinue puntocoma {$$ = new Node(id++,"INSTRUCTION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
     | resreturn EXPRT puntocoma {$$ = new Node(id++,"INSTRUCTION"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push(new Node(id++,$3));}
     | resreturn puntocoma {$$ = new Node(id++,"INSTRUCTION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
     | GRAFICAR puntocoma {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push(new Node(id++,$2));}
     | error { /*this is error*/ console.log($1); }
;
//FALTA THROW

ASSIGNMENT
    : IDVALOR OPERADOR igual EXPRT {$$ = new Node(id++,"ASSIGNMENT"); $$.children.push($1); $$.children.push($2); $$.children.push(new Node(id++,$3)); $$.children.push($4);}
    | id DECINC {$$ = new Node(id++,"ASSIGNMENT"); $$.children.push(new Node(id++,$1)); $$.children.push($2);}
    | IDVALOR igual EXPRT { $$ = new Node(id++,"ASSIGNMENT"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
;

OPERADOR
     : suma {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | resta {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | potencia {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | multiplicacion {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | slash {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | modulo {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
;

ASSIGMENTWITHTYPE
     : IDVALOR CONTENTASWT puntocoma {$$ = new Node(id++,"ASSIGMENTWITHTYPE"); $$.children.push($1); $$.children.push($2); $$.children.push(new Node(id++,$3));}
     | ASSIGNMENT puntocoma { $$ = $1; $$.children.push(new Node(id++,$2));}
     | IDVALORASS puntocoma { $$ = $1; $$.children.push(new Node(id++,$2));}
;

CONTENTASWT
     : /*igual llavea llavec {$$ = new Node(id++,"CONTENTASWT"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3));}
     | */igual DECASSTYPE {$$ = new Node(id++,"CONTENTASWT"); $$.children.push(new Node(id++,$1)); $$.children.push($2);}
;

DECASSTYPE
     : corchetea ASSIGNMENTTYPE   {$$ = new Node(id++,"DECASSTYPE"); $$.children.push(new Node(id++,$1)); $$.children.push($2);}
;

ASSIGNMENTTYPE
     : id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  {$$ = new Node(id++,"ASSIGNMENTTYPE"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push($4);}
;

ASSIGNMENTTYPEPRIM
     : coma id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  {$$ = new Node(id++,"ASSIGNMENTTYPEPRIM"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); $$.children.push($5); }
     | corchetec {$$ = new Node(id++,"ASSIGNMENTTYPEPRIM"); $$.children.push(new Node(id++,$1)); }
;

VALUETYPE 
     : EXPRT {$$ = new Node(id++,"VALUETYPE"); $$.children.push($1);}
     | DECASSTYPE {$$ = new Node(id++,"VALUETYPE"); $$.children.push($1);}
;


PARAMETROUNITARIO
     : parenta EXPRT parentc {$$ = new Node(id++,"PARAMETROUNITARIO"); $$.children.push(new Node(id++,"(")); $$.children.push($2); $$.children.push(new Node(id++,")"));}
;

IF
     : CELSE ELSE {$$ = new Node(id++,"IF"); $$.children.push($1); if(check_to_add($2) === true){$$.children.push($2);}}
;

CELSE
     : CELSE reselse IFF {$$ = new Node(id++,"CELSE"); $$.children.push($1); $$.children.push(new Node(id++,"else")); $$.children.push($3);}
     | IFF {$$ = new Node(id++,"CELSE"); $$.children.push($1);}
;

ELSE
     : reselse BLOCK {$$ = new Node(id++,"ELSE"); $$.children.push(new Node(id++,"else")); $$.children.push($2);}
     | {$$ = new Node(id++,"ELSE"); $$.children.push(new Node(id++,"epsilon"));}
;

IFF
     : resif PARAMETROUNITARIO BLOCK {$$ = new Node(id++,"IFF"); $$.children.push(new Node(id++,"if")); $$.children.push($2); $$.children.push($3);}
;

SWITCH
     : resswitch PARAMETROUNITARIO corchetea CASES DEFAULT corchetec {$$ = new Node(id++,"SWITCH"); $$.children.push(new Node(id++,"switch")); $$.children.push($2); $$.children.push(new Node(id++,"{")); $$.children.push($4); if(check_to_add($5) === true){$$.children.push($5);} $$.children.push(new Node(id++,"}"));}
;

//"<li><span class=\"caret\">EXPRESION</span>\n<ul class=\"nested\">\n" + $2 + "</ul>\n</li>"
CASES
     : CASES rescase EXPRT dospuntos INSTRUCTIONS {$$ = new Node(id++,"CASES"); $$.children.push($1); $$.children.push(new Node(id++,"case")); $$.children.push($3); $$.children.push(new Node(id++,":")); $$.children.push($5);}
     | CASES rescase EXPRT dospuntos {$$ = new Node(id++,"CASES"); $$.children.push($1); $$.children.push(new Node(id++,"case")); $$.children.push($3); $$.children.push(new Node(id++,":"));}
     | rescase EXPRT dospuntos INSTRUCTIONS {$$ = new Node(id++,"CASES"); $$.children.push(new Node(id++,"case")); $$.children.push($2); $$.children.push(new Node(id++,":")); $$.children.push($4);}
     | rescase EXPRT dospuntos {$$ = new Node(id++,"CASES"); $$.children.push(new Node(id++,"case")); $$.children.push($2); $$.children.push(new Node(id++,":")); }
;

DEFAULT
     : resdefault dospuntos INSTRUCTIONS {$$ = new Node(id++,"DEFAULT"); $$.children.push(new Node(id++,"default")); $$.children.push(new Node(id++,":")); $$.children.push($3);}
     | resdefault dospuntos {$$ = new Node(id++,"DEFAULT"); $$.children.push(new Node(id++,"default")); $$.children.push(new Node(id++,":"));}
     | {$$ = new Node(id++,"DEFAULT"); $$.children.push(new Node(id++,"epsilon"));}
;

WHILE
     : reswhile PARAMETROUNITARIO BLOCK {$$ = new Node(id++,"WHILE"); $$.children.push(new Node(id++,"while")); $$.children.push($2); $$.children.push($3);}
;

DOWHILE
     : resdo BLOCK reswhile PARAMETROUNITARIO {$$ = new Node(id++,"DOWHILE"); $$.children.push(new Node(id++,"do")); $$.children.push($2); $$.children.push(new Node(id++,"while")); $$.children.push($4);}
;

FOR
     : resfor parenta DEC puntocoma EXPRT puntocoma ASSIGNMENT parentc BLOCK {$$ = new Node(id++,"FOR");$$.children.push(new Node(id++,'for'));$$.children.push(new Node(id++,'('));if(check_to_add($3) === true){$$.children.push($3);}$$.children.push(new Node(id++,';'));$$.children.push($5);$$.children.push(new Node(id++,';'));$$.children.push($7);$$.children.push(new Node(id++,')'));$$.children.push($9);}
     | resfor parenta DECLARATION FINON IDVALOR parentc BLOCK {$$ = new Node(id++,"FOR");$$.children.push(new Node(id++,'for'));$$.children.push(new Node(id++,'('));$$.children.push($3);$$.children.push($4);$$.children.push($5);$$.children.push(new Node(id++,')'));$$.children.push($7);}
;

DEC
    : DECLARATION {$$ = new Node(id++,"DEC"); $$.children.push($1);}
    | ASSIGNMENT {$$ = new Node(id++,"DEC"); $$.children.push($1);}
    | {$$ = new Node(id++,"DEC"); $$.children.push(new Node(id++,"epsilon"));}
;

FINON
     :resof {$$ = new Node(id++,"FINON"); $$.children.push(new Node(id++,$1));}
     |resin {$$ = new Node(id++,"FINON"); $$.children.push(new Node(id++,$1));}
;

DECINC
     :incremento {$$ = new Node(id++,"DECINC"); $$.children.push(new Node(id++,$1));}
     |decremento {$$ = new Node(id++,"DECINC"); $$.children.push(new Node(id++,$1));}
;

PRINT
    : resprint parenta DATAPRINT parentc {$$ = new Node(id++,"PRINT");$$.children.push(new Node(id++,$1));$$.children.push(new Node(id++,"("));$$.children.push($3); $$.children.push(new Node(id++,")"));}
;

DATAPRINT
     : EXPRT coma DATAPRINT {$$ = new Node(id++,"DATAPRINT"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
     | EXPRT {$$ = new Node(id++,"DATAPRINT"); $$.children.push($1);}
;

EXPRT
	: EXPRT or EXPRT {$$ = new Node(id++,"EXPRT"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
     | EXPRT quest EXPRT dospuntos EXPRT {$$ = new Node(id++,"TERNARIO"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4)); $$.children.push($5);}
     | EXPRT2 {$$ = new Node(id++,"EXPRT"); $$.children.push($1);}
;

EXPRT2
     : EXPRT2 and EXPRT2 {$$ = new Node(id++,"EXPRT2"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
     | EXPR {$$ = new Node(id++,"EXPRT2"); $$.children.push($1);}
;
//-----------------------------------------------------------------------------------------------------------

//producciones para las operaciones relacionales
EXPR
	: EXPR diferente EXPR {$$ = new Node(id++,"EXPR"); $$.children.push($1); $$.children.push(new Node(id++,"!=")); $$.children.push($3);}
     | EXPR identico EXPR {$$ = new Node(id++,"EXPR"); $$.children.push($1); $$.children.push(new Node(id++,"==")); $$.children.push($3);}
	| EXPR referencias EXPR {$$ = new Node(id++,"EXPR"); $$.children.push($1); $$.children.push(new Node(id++,"===")); $$.children.push($3);}
     | EXPR1 {$$ = new Node(id++,"EXPR"); $$.children.push($1);}
;

EXPR1
     : EXPR1 mayor EXPR1 {$$ = new Node(id++,"EXPR1"); $$.children.push($1); $$.children.push(new Node(id++,">")); $$.children.push($3);}
     | EXPR1 menor EXPR1 {$$ = new Node(id++,"EXPR1"); $$.children.push($1); $$.children.push(new Node(id++,"<")); $$.children.push($3);}
     | EXPR1 mayorigual EXPR1 {$$ = new Node(id++,"EXPR1"); $$.children.push($1); $$.children.push(new Node(id++,">=")); $$.children.push($3);}
     | EXPR1 menorigual EXPR1 {$$ = new Node(id++,"EXPR1"); $$.children.push($1); $$.children.push(new Node(id++,"<=")); $$.children.push($3);}
     | EXP {$$ = new Node(id++,"EXPR1"); $$.children.push($1);}
;
//-----------------------------------------------------------------------------------------------------------

//producciones para operaciones aritmeticas
EXP  
     : EXP suma EXP {$$ = new Node(id++,"EXP"); $$.children.push($1); $$.children.push(new Node(id++,"+")); $$.children.push($3);}
     | EXP resta EXP {$$ = new Node(id++,"EXP"); $$.children.push($1); $$.children.push(new Node(id++,"-")); $$.children.push($3);}
     | EXP1 {$$ = new Node(id++,"EXP"); $$.children.push($1);}
;

EXP1 
     : EXP1 multiplicacion EXP1 {$$ = new Node(id++,"EXP1"); $$.children.push($1); $$.children.push(new Node(id++,"*")); $$.children.push($3);}
     | EXP1 slash EXP1 {$$ = new Node(id++,"EXP1"); $$.children.push($1); $$.children.push(new Node(id++,"/")); $$.children.push($3);}
     | EXP1 modulo EXP1 {$$ = new Node(id++,"EXP1"); $$.children.push($1); $$.children.push(new Node(id++,"%")); $$.children.push($3);}
     | EXP1 potencia EXP1 {$$ = new Node(id++,"EXP1"); $$.children.push($1); $$.children.push(new Node(id++,"^")); $$.children.push($3);}
     | EXP2 {$$= new Node(id++,"EXP1"); $$.children.push($1);}
;

EXP2
     : not EXP2 {$$ = new Node(id++,"EXP2");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | EXP3 {$$ = new Node(id++,"EXP2"); $$.children.push($1);}
;

EXP3
     : number {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1));}
     //| number ARREGLO {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | resta number {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
     | resta IDVALOR {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | parenta EXPRT parentc {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,"("));$$.children.push($2); $$.children.push(new Node(id++,")"));}
     | cadena {$$ = new Node(id++,"EXP3"); $$.children.push(new Node(id++,$1));}
     //| cadena ARREGLO {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | restrue {$$ = new Node(id++,"EXP3"); $$.children.push(new Node(id++,$1));}
     | resfalse {$$ = new Node(id++,"EXP3"); $$.children.push(new Node(id++,$1));}
     | CALLF {$$ = new Node(id++,"EXP3"); $$.children.push($1);}
     | resnull {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1));}
     | resundefined {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1));}
     | IDVALOR {$$ = new Node(id++,"EXP3"); $$.children.push($1);}
     | IDVALOR DECINC {$$ = new Node(id++,"EXP3"); $$.children.push($1); $$.children.push($2);}
     | llavea llavec {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1));$$.children.push(new Node(id++,$2));}
     | llavea DATAPRINT llavec {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push($2);$$.children.push(new Node(id++,$3));}
     | resnew resarray parenta EXPRT parentc {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1));$$.children.push(new Node(id++,$2));$$.children.push(new Node(id++,$3));$$.children.push($4);$$.children.push(new Node(id++,$5));}
     | cadena punto OPERADORC {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1));$$.children.push(new Node(id++,$2));$$.children.push($3);}
;

IDVALOR  
     : id IDVALOR2 {$$ = new Node(id++,"IDVALOR");$$.children.push(new Node(id++,$1)); if(check_to_add($2) === true){$$.children.push($2);}}
     | id ARREGLO IDVALOR2 {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1));  $$.children.push($2); $$.children.push($3);}
;

/*
MOREPOSITION
     : llavea EXPRT llavec MOREPOSITION {$$ = new Node(id++,"MOREPOSITION"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push(new Node(id++,$3)); $$.children.push($4); }
     | IDVALOR2 {$$ = new Node(id++,"MOREPOSITION"); $$.children.push($1); }
;
*/

ARREGLO
     : llavea EXPRT llavec ARREGLO {$$ = new Node(id++,"ARREGLO"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push(new Node(id++,$3)); $$.children.push($4); }
     | llavea EXPRT llavec {$$ = new Node(id++,"ARREGLO"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push(new Node(id++,$3)); }
;

IDVALOR2
     : punto IDVALOR {$$ = new Node(id++,"IDVALOR2");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | punto OPERADORC {$$ = new Node(id++,"IDVALOR2");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | {$$ = new Node(id++,"IDVALOR2"); $$.children.push(new Node(id++,"epsilon"));}
;

OPERADORC
     : reslength {$$ = new Node(id++,"OPERADORC"); $$.children.push(new Node(id++,$1));}
     | resCharAt parenta EXPRT parentc {$$ = new Node(id++,"OPERADORC"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4));}
     | resToLowerCase parenta parentc {$$ = new Node(id++,"OPERADORC"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3));}
     | resToUpperCase parenta parentc {$$ = new Node(id++,"OPERADORC"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3));}
     | resConcat parenta EXPRT parentc {$$ = new Node(id++,"OPERADORC"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4));}

;

CALLF
     :id parenta PARAMETERS {$$ = new Node(id++,"CALLF"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
;

PARAMETERS
     : EXPRT PARAMETERSPRIM  {$$ = new Node(id++,"PARAMETERS"); $$.children.push($1); $$.children.push($2); }
     | parentc {$$ = new Node(id++,"PARAMETERS"); $$.children.push(new Node(id++,$1)); }
;

PARAMETERSPRIM
     : coma EXPRT PARAMETERSPRIM {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push($3); }
     | parentc {$$ = new Node(id++,"PARAMETERSPRIM"); $$.children.push(new Node(id++,$1)); }
;

IDVALORASS  
     : id IDVALOR2ASS {$$ = new Node(id++,"IDVALORASS");$$.children.push(new Node(id++,$1)); if(check_to_add($2) === true){$$.children.push($2);}}
     | id ARREGLO IDVALOR2ASS {$$ = new Node(id++,"IDVALORASS"); $$.children.push(new Node(id++,$1));  $$.children.push($2); $$.children.push($3);}
;

IDVALOR2ASS
     : punto IDVALORASS {$$ = new Node(id++,"IDVALOR2ASS");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | punto respush parenta EXPRT parentc {$$ = new Node(id++,"IDVALOR2ASS"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); $$.children.push(new Node(id++,$5));}
;

GRAFICAR
     :resgraficar_ts parenta parentc {$$ = new Node(id++,"GRAFICAR"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); }
;