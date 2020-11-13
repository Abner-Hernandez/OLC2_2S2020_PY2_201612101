
%{
     let  local_function = [];
     let  parent_name = [];
     let  name_function = "";
     let  traduction = "";
     let  errores = [];
     let  vars_a = [];
     let  aux_string = "";
     let name_f = [];

     function add_traduction(content)
     {
          traduction += content;
     }

     function ordenar_localf()
     {
          local_function.sort(function (a, b) {
               if (a.name.length > b.name.length) {
                    return 1;
               }
               if (a.name.length < b.name.length) {
                    return -1;
               }
               // a must be equal to b
               return 0;
          });
     }
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
"==="              return 'referencias';
"=="               return 'identico';
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

.                      { try{ add_error_T( {error: yytext, type: 'LEXICO', line: yylloc.first_line, column: yylloc.first_column} ); }catch(e){ console.log(e); } }
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
	: INSTRUCTIONSG EOF {  add_traduction($1); return traduction; }
     | EOF
;

DEFTYPES
     :restype id igual corchetea ATTRIB corchetec puntocoma { $$ = $1 + " " + $2 + " " + $3 + " " + $4 + "\n    " + $5 + "\n" + $6 + $7 + "\n"; }
;

ATTRIB
     :ATTRIB coma id dospuntos TYPES { $$ = $1 + $2 + "\n    " + $3 + $4 + " " + $5; }
     |id dospuntos TYPES { $$ = $1 + $2 + " " + $3; }
;

INSTRUCTIONSG
	: INSTRUCTIONG INSTRUCTIONSG { $$ = "\n" +$1 +  $2; }
	| INSTRUCTIONG { $$ = $1; }
;

INSTRUCTIONG
	: FUNCTIONG { $$ = $1; }
     | DECLARATION puntocoma { $$ = $1 + $2;  for(let  a of vars_a){ if(a.ambit === undefined) a.ambit = "global"; add_simbol_T(a); } vars_a = []; }
     | ASSIGMENTWITHTYPE { $$ = $1; }
     | DEFTYPES { $$ = $1; }
     | IF { $$ = $1; }
     | SWITCH { $$ = $1; }
     | WHILE { $$ = $1; }
     | DOWHILE puntocoma { $$ = $1; }
     | FOR { $$ = $1; }
     | PRINT puntocoma { $$ = $1 + $2; }
     | CALLF puntocoma { $$ = $1 + $2; }
     | GRAFICAR puntocoma { $$ = $1 + $2 ; }
     | error { try{ add_error_T( {error: yytext, type: 'SINTACTICO', line: @1.first_line, column: @1.first_column} ); }catch(e){ console.log(e); } }
;

FUNCTIONG
    : resfunction FIDG parenta LISTAPARAMETROS parentc RETURNT BLOCKF { $$ = $1 + " " + $2 + " " + $3 + " " + $4 + " " + $5 + " " + $6 + " " ; ordenar_localf();  for(let d of name_f){$7 = $7.split(d[0]+"(").join(d[1]+"(");} $$ += $7; if(local_function.length > 0){ for (let entry of local_function){ entry = entry.contenido; for(let d of name_f){entry = entry.split(d[0]+"(").join(d[1]+"(");} $$ += "\n" + entry;}} parent_name = ""; name_f = [];}
    | resfunction FIDG parenta parentc RETURNT BLOCKF { $$ = $1 + " " + $2 + " " + $3 + " " + $4 + " " + $5 + " "  ; ordenar_localf(); for(let d of name_f){$6 = $6.split(d[0]+"(").join(d[1]+"(");} $$ += $6;  if(local_function.length > 0){ for (let entry of local_function){ entry = entry.contenido; for(let d of name_f){  entry = entry.split(d[0]+"(").join(d[1]+"(");} $$ += "\n" + entry;}} parent_name = ""; name_f = [];}
;

FIDG
     :id  { $$ = $1; local_function = []; parent_name = []; parent_name.push($1); }
;

FUNCTIONL
    : resfunction FIDL parenta LISTAPARAMETROS parentc RETURNT BLOCKF { name_function = ""; for(let i = parent_name.indexOf($2); i > 0 ; i--){ name_function = "___" + parent_name[i] + name_function;} name_function =  parent_name[0] + name_function; $$ = ""; local_function.push({contenido: $1 + " " + $2 + $3 + " " + $4 + " " + $5 + " " + $6 + " " + $7, name: name_function}); parent_name.pop(); name_f.push([$2, name_function]);}
    | resfunction FIDL parenta parentc RETURNT BLOCKF { name_function = ""; for(let i = parent_name.indexOf($2); i > 0 ; i--){ name_function = "___" + parent_name[i] + name_function;} name_function =  parent_name[0] + name_function; $$ = ""; local_function.push({contenido: $1 + " " + $2 + $3 + " " + $4 + " " + $5 + " " + $6, name: name_function}); parent_name.pop(); name_f.push([$2, name_function]);}
;

FIDL
     :id  { $$ = $1; parent_name.push($1); }
;

BLOCKF
     : corchetea BLOCK2F { $$ = $1 + $2; }
;

BLOCK2F
     : INSTRUCTIONSF corchetec { $1 = $1.replace(/\n/g, "\n    "); $$ = $1 +  "\n" + $2; }
     | corchetec { $$ = "\n" + $1;}
;

INSTRUCTIONSF
     : INSTRUCTIONF INSTRUCTIONSF { $$ = "\n" + $1 + $2; }
     | INSTRUCTIONF { $$ = "\n" + $1; }
;

INSTRUCTIONF
     : INSTRUCTION { $$ = $1; }
     | FUNCTIONL { $$ = $1; /* necesito aqui*/ }
;

RETURNT
     :dospuntos TYPESF { $$ = $1 + " " + $2; }
     | { $$ = ""; }
;

TYPESF 
     : TYPES { $$ = $1; }
     | resvoid { $$ = $1; }
;

TYPE
     : resinteger {$$ = $1;}
     | resboolean {$$ = $1;}
     | resstring {$$ = $1;}
     | id {$$ = $1;}
     | resnumber {$$ = $1;}
     | resundefined {$$ = $1;}
;

TYPES
     : resarray menor TYPES mayor { $$ = $1 + $2 + $3 + $4; }
     | TYPE MULTIDIMENSION { $$ = $1 + $2; }
     | TYPE { $$ = $1; }
;

MULTIDIMENSION
     : llavea llavec MULTIDIMENSION { $$ = $1 + $2 + $3; }
     | llavea llavec { $$ = $1 + $2; }
;

LISTAPARAMETROS
     : LSPBETHA LISTAPARAMETROSPRIM { $$ = aux_string; }
;

LISTAPARAMETROSPRIM
     : LSALPHA LISTAPARAMETROSPRIM { }
     | { aux_string = $1; }
;

LSPBETHA
     : id dospuntos TYPES { $$ = $1 + $2 + " " + $3; }
;

LSALPHA
     : coma id dospuntos TYPES { $$ = $0; $$ += $1 + " " + $2 + $3 + " " + $4; }
;

TYPEVAR
     : resconst {$$ = $1;}
     | reslet {$$ = $1;}
;

DECLARATION
     : TYPEVAR LISTID { $$ = $1 + " " + aux_string; aux_string = ""; }
;

LISTID
     : DECBETHA LISTIDPRIM { }
;

LISTIDPRIM
     : DECALPHA LISTIDPRIM { }
     | { aux_string = $1;}
;

DECBETHA
     : id dospuntos TYPES ASSVALUE { $$ = $1 + $2 + " " + $3 + " " + $4;  vars_a.push({name: $1, type: $3, ambit: undefined, row: @3.first_line, column: @3.first_column}); /*declaracion*/}
     | id ASSVALUE { $$ = $1 + " " + $2; vars_a.push({name: $1, type: "undefined", ambit: undefined, row: @1.first_line, column: @1.first_column}); /*declaracion*/}
;

DECALPHA
     : coma id dospuntos TYPES ASSVALUE{ $$ = $0; $$ += $1 + " " + $2 + $3 + " " + $4 + " " + $5;  vars_a.push({name: $2, type: undefined, ambit: undefined, row: @3.first_line, column: @3.first_column}); /*declaracion*/}
     | coma id ASSVALUE{ $$ = $0; $$ += $1 + " " + $2 + " " + $3; vars_a.push({name: $2, type: "undefined", ambit: undefined, row: @1.first_line, column: @1.first_column});/*declaracion*/}
;

ASSVALUE
     : igual EXPRT { $$ = $1 + " " + $2; }
     | igual DECASSTYPE { $$ = $1 + " " + $2; }
     | { $$ = ""; }
;

BLOCK
     : corchetea BLOCK2 { $$ = " " + $1 + $2;  }
;

BLOCK2
     : INSTRUCTIONS corchetec { $1 = $1.replace(/\n/g, "\n    "); $$ = $1 + "\n" + $2; }
     | corchetec { $$ = "\n" + $1;}
;

INSTRUCTIONS
     : INSTRUCTION INSTRUCTIONS { $$ = "\n" +  $1 + $2; /*local*/}
     | INSTRUCTION { $$ = "\n" +  $1; /*local*/}
;

INSTRUCTION
     : DECLARATION puntocoma { $$ = $1 + $2; for(let  a of vars_a){ if(a.ambit === undefined) a.ambit = "local"; add_simbol_T(a); } vars_a = []; }
     | ASSIGMENTWITHTYPE { $$ = $1; }
     | IF { $$ = $1; }
     | SWITCH { $$ = $1; }
     | WHILE { $$ = $1; }
     | DOWHILE puntocoma { $$ = $1; }
     | FOR { $$ = $1; }
     | PRINT puntocoma { $$ = $1 + $2 ; }
     | CALLF puntocoma { $$ = $1 + $2 ; }
     | resbreak puntocoma { $$ = $1 + $2 ; }
     | rescontinue puntocoma { $$ = $1 + $2 ; }
     | resreturn EXPRT puntocoma { $$ = $1 + " " + $2 + $3 ; }
     | resreturn puntocoma { $$ = $1 + $2 ; }
     | GRAFICAR puntocoma { $$ = $1 + $2 ; }
     | error { try{ add_error_T( {error: yytext, type: 'SINTACTICO', line: @1.first_line, column: @1.first_column} ); }catch(e){ console.log(e); } }
;
//FALTA THROW

ASSIGNMENT
    : IDVALOR OPERADOR igual EXPRT { $$ = $1 + $2 + $3 + " " + $4; }
    | id DECINC { $$ = $1 + $2; }
    | IDVALOR igual EXPRT { $$ = $1 + " " + $2 + $3; }
;

OPERADOR
     : suma { $$ = " " + $1; }
     | resta { $$ = " " + $1; }
     | potencia { $$ = " " + $1; }
     | multiplicacion { $$ = " " + $1; }
     | slash { $$ = " " + $1; }
     | modulo { $$ = " " + $1; }
;

ASSIGMENTWITHTYPE
     : IDVALOR CONTENTASWT puntocoma{ $$ = $1 + $2 + $3; }
     | ASSIGNMENT puntocoma { $$ = $1 + $2; }
     | IDVALORASS puntocoma { $$ = $1 + $2; }
;

CONTENTASWT
     : /*igual llavea llavec { $$ = $1 + " " + $2 + $3; }
     | */igual DECASSTYPE { $$ = $1 + " " + $2; }
;

DECASSTYPE
     : corchetea ASSIGNMENTTYPE   { $$ = $1 +  "\n    " + $2 ; }
;

ASSIGNMENTTYPE
     : id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  { $$ = $1 + $2 +  " " + $3 + $4 ; }
;

ASSIGNMENTTYPEPRIM
     : coma id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  { $$ = $1 + "\n    " + $2 +  $3 + " " +$4 +  $5; }
     | corchetec { $$ = "\n" + $1; }
;

VALUETYPE 
     : EXPRT { $$ = $1; }
     | DECASSTYPE { $$ = $1; }
;


PARAMETROUNITARIO
     : parenta EXPRT parentc { $$ = $1 + " " + $2 + " " + $3;  }
;

IF
     :  CELSE ELSE { $$ = $1 + $2; }
;

CELSE
     : CELSE reselse IFF { $$ = $1 + "\n" + $2 +  " " + $3; }
     | IFF { $$ = $1; }
;

ELSE
     : reselse BLOCK { $$ = $1 + $2; }
     | { $$ = ""; }
;

IFF
     : resif PARAMETROUNITARIO BLOCK { $$ = $1 + " " + $2 + " " + $3; }
;

SWITCH
     : resswitch PARAMETROUNITARIO corchetea CASES DEFAULT corchetec {  $$ = $1 + " " + $2 + " " + $3 + "\n" + $4 + $5 + "\n" + $6; }
;

CASES
     : CASES rescase EXPRT dospuntos INSTRUCTIONS { $$ = $1 + " " + $2 + " " + $3 + "\n" + $4 + $5 + "\n"; }
     | CASES rescase EXPRT dospuntos { $$ = $1 + $2 + " " + $3 + $4; }
     | rescase EXPRT dospuntos INSTRUCTIONS { $$ = $1 + " " + $2 + $3 + "\n    " + $4 ; }
     | rescase EXPRT dospuntos { $$ = $1 + " " + $2 + $3; }
;

DEFAULT
     : resdefault dospuntos INSTRUCTIONS { $$ = $1 + $2 + "\n" + $3; }
     | resdefault dospuntos { $$ = $1 + $2 + "\n"; }
     | {}
;

WHILE
     : reswhile PARAMETROUNITARIO BLOCK { $$ = $1 + $2 + $3; }
;

DOWHILE
     : resdo BLOCK reswhile PARAMETROUNITARIO { $$ = $1 + $2 + $3 + $4; }
;

FOR
     : resfor parenta DEC puntocoma EXPRT puntocoma ASSIG parentc BLOCK { $$ = $1 + $2 + $3 + $4 + " " + $5 + " " + $6 + " " + $7 + $8 + $9;  }
     | resfor parenta DECLARATION FINON IDVALOR parentc BLOCK { $$ = $1 + $2 + $3 + $4 + $5 + $6 + $7 ;  }
;

ASSIG
    : ASSIGNMENT { $$ = $1;}
;

DEC
    : DECLARATION {$$ = $1;}
    | ASSIGNMENT {$$ = $1;}
    | {$$ = "";}
;

FINON
     :resof { $$ = $1; }
     |resin { $$ = $1; }
;

DECINC
     :incremento {$$ = $1;}
     |decremento {$$ = $1;}
;

PRINT
    : resprint parenta DATAPRINT parentc { $$ = $1 + $2 + $3 + $4; }
;

DATAPRINT
     : EXPRT coma DATAPRINT { $$ = $1 + $2 + " " + $3; }
     | EXPRT { $$ = $1; }
;

EXPRT
	: EXPRT or EXPRT { $$ = $1 + " " + $2 + " " + $3; }
     | EXPRT quest EXPRT dospuntos EXPRT { $$ = $1 + " " + $2 + " " + $3 + " " + $4 + " " + $5; }
     | EXPRT2 { $$ = $1; }
;

EXPRT2
	: EXPRT2 and EXPRT2 { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR { $$ = $1; }
;
//-----------------------------------------------------------------------------------------------------------

//producciones para las operaciones relacionales
EXPR
	: EXPR diferente EXPR { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR identico EXPR { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR referencias EXPR { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR1 { $$ = $1; }
;

EXPR1
     : EXPR1 mayor EXPR1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR1 menor EXPR1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR1 mayorigual EXPR1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXPR1 menorigual EXPR1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXP { $$ = $1; }
;
//-----------------------------------------------------------------------------------------------------------

//producciones para operaciones aritmeticas
EXP  : EXP suma EXP { $$ = $1 + " " + $2 + " " + $3; }
     | EXP resta EXP { $$ = $1 + " " + $2 + " " + $3; }
     | EXP1 { $$ = $1; }
;

EXP1 : EXP1 multiplicacion EXP1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXP1 slash EXP1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXP1 modulo EXP1 { $$ = $1 + " " + $2 + " " + $3; }
     | EXP1 potencia EXP1 { $$ = $1 + " " + $2 + " " + $3; /*potencia*/}
     | EXP2 { $$ = $1; }
;

EXP2
     : not EXP2 { $$ = $1 + " " + $2; }
     | EXP3 { $$ = $1; }
;

EXP3
     : number { $$ = $1; }
     | resta number { $$ = $1 + " " + $2; }
     | resta IDVALOR { $$ = $1 + " " + $2; }
     | parenta EXPRT parentc { $$ = $1 + " " + $2 + " " + $3; }
     | cadena { $$ = $1; }
     | restrue { $$ = $1; }
     | resfalse { $$ = $1; }
     | CALLF { $$ = $1; }
     | resnull { $$ = $1; }
     | resundefined { $$ = $1; }
     | IDVALOR { $$ = $1; }
     | IDVALOR DECINC{ $$ = $1 + $2; }
     | llavea llavec { $$ = $1 + $2 ; }
     | llavea DATAPRINT llavec { $$ = $1 + $2 + $3; }
     | resnew resarray parenta EXPRT parentc { $$ = $1 + " " + $2 + $3 + $4 + $5; }
     | cadena punto OPCADENAS { $$ = $1 + $2 + $3; }
;

IDVALOR  
     : id IDVALOR2 { $$ = $1 + $2; }
     | id ARREGLO IDVALOR2 { $$ = $1 + $2 + $3; }
;

MOREPOSITION
     : llavea EXPRT llavec MOREPOSITION { $$ = $1 + $2 + $3 + $4; }
     | IDVALOR2 { $$ = $1; }
;

ARREGLO
     : llavea EXPRT llavec ARREGLO { $$ = $1 + $2 + $3 + $4; }
     | llavea EXPRT llavec { $$ = $1 + $2 + $3; }
;

IDVALOR2
     : punto IDVALOR { $$ = $1 + $2; }
     | punto OPCADENAS { $$ = $1 + $2; }
     | { $$ = ""; }
;

OPCADENAS
     : reslength { $$ = $1 ; }
     | resCharAt parenta EXPRT parentc { $$ = $1 + $2 + $3; }
     | resToLowerCase parenta parentc { $$ = $1 + $2 + $3; }
     | resToUpperCase parenta parentc { $$ = $1 + $2 + $3; }
     | resConcat parenta EXPRT parentc { $$ = $1 + $2 + $3 + $4; }
;

CALLF
     :id parenta PARAMETERS { $$ = $1 + $2 + $3; }
;

PARAMETERS
     : EXPRT PARAMETERSPRIM   { $$ = $1 + $2; }
     | parentc { $$ = $1; }
;

PARAMETERSPRIM
     : coma EXPRT PARAMETERSPRIM { $$ = $1 + " " + $2 + $3; }
     | parentc { $$ = $1; }
;

IDVALORASS  
     : id IDVALOR2ASS { $$ = $1 + $2; }
     | id ARREGLO IDVALOR2ASS { $$ = $1 + $2 + $3; }
;

IDVALOR2ASS
     : punto IDVALORASS { $$ = $1 + $2; }
     | punto respush parenta EXPRT parentc { $$ = $1 + $2 + $3 + $4 + $5; }
;

GRAFICAR
     :resgraficar_ts parenta parentc { $$ = $1 + $2 + $3; }
;