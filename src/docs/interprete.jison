%{
     var symbolt = new SymbolTable(null);
     //var global_var = [];
     var structures = [];
     var nuevo_arreglo = false;
     var existe = false;
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
"**"             return 'potencia';


//aritmeticos
"+"              return 'suma';
"-"              return 'resta';   
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
"undefined"             return 'resundefined';
"null"                  return 'resnull';
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
"pop"                   return 'respop';
"length"                return 'reslength';
"graficar_ts"           return 'resgraficar_ts';

/* Espacios en blanco */
[ \r\t\n]+                  {}
[0-9]+"."[0-9]+\b|[0-9]+\b    			     return 'number';
([\"]("\\\""|[^"])*[^\\][\"])|[\"][\"]|[\'][^']*[\']|"`"[^`]*"`"        return 'cadena';
([a-zA-Z"_"])[a-z0-9A-Z"_""ñ""Ñ"]*                     return 'id';
<<EOF>>                 return 'EOF';

.                       { try{ add_error_E( {error: yytext, type: 'LEXICO', line: yylloc.first_line, column: yylloc.first_column} ); }catch(e){ console.log(e); } }
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
	: INSTRUCTIONSG EOF {
          try
          {
               console.log("todo termino bien")
               symbolt.add_types(structures);
               var tmp = $1;
               for(let aux of tmp)
               {
                    aux.operate(symbolt);
               }
               structures = [];
               symbolt = new SymbolTable(null);
          }catch(e){console.log(e); structures = []; symbolt = new SymbolTable(null);}
     }
     | EOF { console.log("termino vacio") }
;

DEFTYPES
     :restype TYPEDEFID igual corchetea ATTRIB corchetec puntocoma{ }
;

TYPEDEFID
     :id { existe = false; for(var d of structures){if(d.name === $1) { existe = true; break;}} if(!existe) structures.push({name: $1, atributes: []}); else try{ add_error_E( {error: "Ya existe un type con el nombre" + $1, type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } }
;

ATTRIB
     :ATTRIB coma id dospuntos TYPES { if(!existe) structures[structures.length - 1].atributes.push({name: $3, type: $5.id}); }
     |id dospuntos TYPES { if(!existe) structures[structures.length - 1].atributes.push({name: $1, type: $3.id}); }
;

INSTRUCTIONSG
	: INSTRUCTIONG INSTRUCTIONSG  { if(Array.isArray($1)){ for(var a of $1){ if(a !== null)$2.unshift(a); }}else{if($1 !== null)$2.unshift($1);}  $$ = $2; /*deb*/}
	| INSTRUCTIONG { if(Array.isArray($1)){ $$ = $1; }else{ if($1 !== null)$$ = [$1];else $$ = [];  } /*deb*/}
;

INSTRUCTIONG
	: FUNCTION { symbolt.addFunction($1); $$ = null; }
     | DECLARATION puntocoma { if($1 !== null){$1.type_var = Type.GLOBAL; /*global_var.push($1);*/} $$ = $1;/* declaration inst */}
     | ASSIGMENTWITHTYPE puntocoma{ $$ = $1; }
     | DEFTYPES { $$ = null; }
     | IF { $$ = $1; }
     | SWITCH { $$ = $1; }
     | WHILE { $$ = $1; }
     | DOWHILE puntocoma { $$ = $1; }
     | FOR { $$ = $1; }
     | PRINT puntocoma { $$ = $1; }
     | CALLF puntocoma { $$ = $1; }
     | GRAFICAR puntocoma { $$ = $1; }
     | error { try{ add_error_E( {error: yytext, type: 'SINTACTICO', line: @1.first_line, column: @1.first_column} ); }catch(e){ console.log(e); } }
;
//(_type, _type_exp, _id, _param, _body, _row, _col)
FUNCTION
    : resfunction id parenta LISTAPARAMETROS parentc RETURNT BLOCK { $$ = new Function(/*0,*/$6.id,$6.access,$2,$4,$7,this._$.first_line,this._$.first_column); }
    | resfunction id parenta parentc RETURNT BLOCK { $$ = new Function(/*0,*/$5.id,$5.access,$2,null,$6,this._$.first_line,this._$.first_column); }
;

RETURNT
     : dospuntos TYPESF { $$ = $2; }
     | { $$ = {id: Type.VOID, access: Type.VALOR, type: Type.VALOR}; }
;

TYPESF 
     : TYPES { $$ = $1; }
     | resvoid { $$ = {id: Type.VOID, access: Type.VALOR, type: Type.VALOR}; }
;

TYPE
     : resnumber { $$ = Type.ENTERO; }
     | resboolean { $$ = Type.BOOL; }
     | resstring { $$ = Type.CADENA; }
     | id { $$ = $1; }
     //| resundefined { $$ = Type.OBJETO; }
;

TYPES
     : resarray menor TYPES mayor { $$ = {id: Type.ARREGLO, access: Type.ARREGLO, type: Type.PRIMITIVO}; }
     | TYPE MULTIDIMENSION { $$ = {id: Type.ARREGLO, access: Type.ARREGLO, type: Type.PRIMITIVO}; if($1 !== Type.ENTERO && $1 !== Type.BOOL && $1 !== Type.CADENA) $$.type = Type.OBJETO; }
     | TYPE { $$ = {id: $1, access: Type.VALOR, type: Type.VALOR}; if($1 !== Type.ENTERO && $1 !== Type.BOOL && $1 !== Type.CADENA) $$.type = Type.OBJETO; }
;

MULTIDIMENSION
     : llavea llavec MULTIDIMENSION { $$ = $1 + $2 + $3; }
     | llavea llavec { $$ = $1 + $2; }
;

/*
LISTAPARAMETROS
     : LISTAPARAMETROS coma id dospuntos TYPES { $$ = $1; $$.push(new Declaration([$3],null,$5.id,$5.access,Type.LOCAL,Type.VAR,Type.PRIMITIVO,0,this._$.first_line,this._$.first_column)); }
     | id dospuntos TYPES { $$ = []; $$.push(new Declaration([$1],null,$2.id,$2.access,Type.LOCAL,Type.VAR,Type.PRIMITIVO,0,this._$.first_line,this._$.first_column)); }
;
*/

LISTAPARAMETROS
     : BETHA LISTAPARAMETROSPRIMA { $$ = $2; } 
;

LISTAPARAMETROSPRIMA
     : ALPHA LISTAPARAMETROSPRIMA { $$ = $0;}
     | {$$ = $1;}
;

BETHA
     : id dospuntos TYPES { $$ = []; $$.push(new Declaration($1,null,$3.id,$3.access,Type.LOCAL,Type.VAR,/*Type.PRIMITIVO,*/this._$.first_line,this._$.first_column)); }
;

ALPHA
     : coma id dospuntos TYPES { $$ = $0; $$.push(new Declaration($2,null,$4.id,$4.access,Type.LOCAL,Type.VAR,/*Type.PRIMITIVO,*/this._$.first_line,this._$.first_column)); }
;

TYPEVAR
     : resconst {$$ = Type.CONST;}
     | reslet {$$ = Type.VAR;}
;

DECLARATION
     : TYPEVAR LISTID { for(var a of $2){a.type_c = $1;} $$ = $2; $$ = $2; }
;

LISTID
     : DECBETHA LISTIDPRIM { $$ = $2;  /*testdec*/ }
;

LISTIDPRIM
     : DECALPHA LISTIDPRIM { $$ = $1; /*testdec*/ } 
     | { $$ = $1;}
;

DECBETHA
     : id dospuntos TYPES ASSVALUE { $$ = []; $$.push(new Declaration($1,$4,$3.id,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column)); if(nuevo_arreglo) {$$[$$.length-1].type = Type.ARREGLO; $$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false;}
     | id ASSVALUE{ $$ = []; $$.push(new Declaration($1,$2,undefined,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column)); if(nuevo_arreglo) {$$[$$.length-1].type = Type.ARREGLO; $$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false;}
;

DECALPHA
     : coma id dospuntos TYPES ASSVALUE { $$ = $0; $$.push(new Declaration($2,$5,$4.id,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column)); /*testdec*/  if(nuevo_arreglo) {$$[$$.length-1].type = Type.ARREGLO; $$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false;  }
     | coma id ASSVALUE{ $$ = $0; $$.push(new Declaration($2,$3,undefined,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column)); /*testdec*/ if(nuevo_arreglo) {$$[$$.length-1].type = Type.ARREGLO; $$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false;}
;

ASSVALUE
     : igual EXPRT { $$ = $2; }
     //| igual llavea llavec { $$ = undefined; nuevo_arreglo = true; }
     //| igual llavea DATAPRINT llavec { $$ = $3; nuevo_arreglo = true; }     
     | igual DECASSTYPE { $$ = $2; }
     | { $$ = undefined; }
;

BLOCK
     : corchetea BLOCK2 { $$ = $2;  }//INSTRUCTIONS corchetec
;

BLOCK2
     : INSTRUCTIONS corchetec { $$ = $1; /*here*/}
     | corchetec { $$ = []; }
;

INSTRUCTIONS
     : INSTRUCTION INSTRUCTIONS { if(Array.isArray($1)){ for(var a of $1){ $2.unshift(a); }}else{$2.unshift($1);}  $$ = $2; /*deb*/}
     | INSTRUCTION { if(Array.isArray($1)){ $$ = $1; }else{ $$ = [$1]; } /*deb*/}
;

INSTRUCTION
     : DECLARATION puntocoma { $$ = $1; }
     | ASSIGMENTWITHTYPE puntocoma{ $$ = $1; }
     | IF { $$ = $1; }
     | SWITCH { $$ = $1; }
     | WHILE { $$ = $1; }
     | DOWHILE puntocoma { $$ = $1; }
     | FOR { $$ = $1; }
     | PRINT puntocoma { $$ = $1; }
     | CALLF puntocoma { $$ = $1; }
     | resbreak puntocoma {$$ = new Break(Type.BREAK,this._$.first_line,this._$.first_column)}
     | rescontinue puntocoma {$$ = new Continue(Type.CONTINUE,this._$.first_line,this._$.first_column)}
     | resreturn EXPRT puntocoma {$$ = new Return($2,Type.RETURN,Type.RETURN,this._$.first_line,this._$.first_column);}
     | resreturn puntocoma {$$ = new Return(null,Type.RETURN,Type.RETURN,this._$.first_line,this._$.first_column);}
     | GRAFICAR puntocoma { $$ = $1; }
     | error { try{ add_error_E( {error: yytext, type: 'SINTACTICO', line: @1.first_line, column: @1.first_column} ); }catch(e){ console.log(e); } }
;

ASSIGNMENT
    : IDVALOR OPERADOR igual EXPRT { if($1.length === 1 && $1[0].type === Type.ID){ $1 = $1[0]; } $$ = new Assignment($1,new Arithmetical($1,$4,$2,Type.VALOR,this._$.first_line,this._$.first_column),this._$.first_line,this._$.first_column); $$.change_tipe($2);}
    | id DECINC { $$ = new UnaryNoReturn($1,$2,this._$.first_line,this._$.first_column); }
    | IDVALOR igual EXPRT { /*DEBERIA AQUI*/if($1.length === 1 && $1[0].type === Type.ID){ $1 = $1[0]; } $$ = new Assignment($1,$3,this._$.first_line,this._$.first_column); }
;

OPERADOR
     : suma { $$ = Type.SUMA; }
     | resta { $$ = Type.RESTA; }
     | potencia { $$ = Type.POTENCIA; }
     | multiplicacion { $$ = Type.MULTIPLICACION; }
     | slash { $$ = Type.DIVISION; }
     | modulo { $$ = Type.MODULO; }
;

ASSIGMENTWITHTYPE
     : IDVALOR CONTENTASWT { $$ = $2; $$.id = $1; }
     | ASSIGNMENT  { $$ = $1; }
     | IDVALORASS { $$ = new UnaryNoReturn($1,".push()",this._$.first_line,this._$.first_column); }
;

CONTENTASWT
     : /*igual llavea llavec { $$ = new Assignment(undefined,undefined,this._$.first_line,this._$.first_column); $$.change_tipe(Type.ARREGLO);}
     | */igual DECASSTYPE { $$ = new Assignment(undefined,$2,this._$.first_line,this._$.first_column); }
;

DECASSTYPE
     : corchetea ASSIGNMENTTYPE   { $$ = new Value($2,Type.OBJETO,Type.VALOR,this._$.first_line,this._$.first_column); }
;

ASSIGNMENTTYPE
     : id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  { $$ = $4; $$.unshift([$1, $3]); }
;

ASSIGNMENTTYPEPRIM
     : coma id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  { $$ = $5; $$.unshift([$2, $4]); }
     | corchetec { $$ = []; }
;

VALUETYPE 
     : EXPRT { $$ = $1; }
     | DECASSTYPE { $$ = $1; }
;

PARAMETROUNITARIO
     : parenta EXPRT parentc {$$ = $2;}
;

IF
     :  CELSE ELSE {var tf = $1;tf.elsebody = $2;$$ = tf;}
;

CELSE
     : CELSE reselse IFF {var tc = $1; tc.lif.push($3); $$ = tc;}
     | IFF {var t = new IfList();t.lif.push($1);$$ = t;}
;

ELSE
     : reselse BLOCK {$$ = new Else($2,this._$.first_line,this._$.first_column);}
     | {$$ = null;}
;

IFF
     : resif PARAMETROUNITARIO BLOCK {$$ = new If($2,$3,Type.IF,this._$.first_line,this._$.first_column);}
;

SWITCH
     : resswitch PARAMETROUNITARIO corchetea CASES DEFAULT corchetec {var ts = new Switch($2,$4,$5,this._$.first_line,this._$.first_column);console.log("entrooo");$$ = ts;}
;

//"<li><span class=\"caret\">EXPRESION</span>\n<ul class=\"nested\">\n" + $2 + "</ul>\n</li>"
CASES
     : CASES rescase EXPRT dospuntos INSTRUCTIONS {$1.push(new If($3,$5,Type.IF,this._$.first_line,this._$.first_column));}
     | CASES rescase EXPRT dospuntos {$1.push(new If($3,[],Type.IF,this._$.first_line,this._$.first_column));}
     | rescase EXPRT dospuntos INSTRUCTIONS { $$ = []; $$.push(new If($2,$4,Type.IF,this._$.first_line,this._$.first_column));}
     | rescase EXPRT dospuntos { $$ = []; $$.push(new If($2,[],Type.IF,this._$.first_line,this._$.first_column));}
;

DEFAULT
     : resdefault dospuntos INSTRUCTIONS {$$ = $3;}
     | resdefault dospuntos {$$ = []}
     | {$$ = null;}
;

WHILE
     : reswhile PARAMETROUNITARIO BLOCK {$$ = new While($2,$3,this._$.first_line,this._$.first_column);}
;

DOWHILE
     : resdo BLOCK reswhile PARAMETROUNITARIO {$$ = new DoWhile($4,$2,this._$.first_line,this._$.first_column);}
;

FOR
     : resfor parenta DEC puntocoma EXPRT puntocoma ASSIG parentc BLOCK { $$ = new For($3,$5,$7,$9,this._$.first_line,this._$.first_column); }
     | resfor parenta DECLARATION FINON EXP parentc BLOCK { $$ = new For($3[0],$4,$5,$7,this._$.first_line,this._$.first_column); }
;

ASSIG
    : ASSIGNMENT {$$ = $1;}
;

DEC
    : DECLARATION {$$ = $1[0];}
    | ASSIGNMENT {$$ = $1;}
    | {$$ = "";}
;

FINON
     : resof { $$ = $1; }
     | resin { $$ = $1; }
;

DECINC
     :incremento {$$ = Type.INCREMENTO;}
     |decremento {$$ = Type.DECREMENTO;}
;


PRINT
    : resprint parenta DATAPRINT parentc {$$ = new Print($3,Type.IMPRIMIR, Type.IMPRIMIR,this._$.first_line,this._$.first_column);}
;

DATAPRINT
     : EXPRT coma DATAPRINT { $3.unshift($1); $$ = $3; /*print*/}
     | EXPRT { $$ = [$1]; /*print*/}
;

EXPRT
	: EXPRT or EXPRT {$$ = new Logical($1,$3,Type.OR,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPRT quest EXPRT dospuntos EXPRT { $$ = new TernaryOperator($1, $3, $5, this._$.first_line,this._$.first_column); }
     | EXPRT2 {$$ = $1;}
;

EXPRT2
	: EXPRT2 and EXPRT2 {$$ = new Logical($1,$3,Type.AND,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPR {$$ = $1;}
;
//-----------------------------------------------------------------------------------------------------------

//producciones para las operaciones relacionales
EXPR
	: EXPR diferente EXPR {$$ = new Relational($1,$3,Type.DIFERENTE,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPR identico EXPR {$$ = new Relational($1,$3,Type.IDENTICO,Type.VALOR,this._$.first_line,this._$.first_column);}
	| EXPR referencias EXPR {$$ = new Relational($1,$3,Type.REFERENCIA,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPR1 {$$ = $1;}
;

EXPR1
     : EXPR1 mayor EXPR1 {$$ = new Relational($1,$3,Type.MAYOR,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPR1 menor EXPR1 {$$ = new Relational($1,$3,Type.MENOR,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPR1 mayorigual EXPR1 {$$ = new Relational($1,$3,Type.MAYORIGUAL,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXPR1 menorigual EXPR1 {$$ = new Relational($1,$3,Type.MENORIGUAL,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXP {$$ = $1;}
;
//-----------------------------------------------------------------------------------------------------------

//producciones para operaciones aritmeticas
EXP : EXP suma EXP {$$ = new Arithmetical($1,$3,Type.SUMA,Type.VALOR,this._$.first_line,this._$.first_column);}
    | EXP resta EXP {$$ = new Arithmetical($1,$3,Type.RESTA,Type.VALOR,this._$.first_line,this._$.first_column);}
    | EXP1 {$$ = $1;}
;

EXP1 : EXP1 multiplicacion EXP1 {$$ = new Arithmetical($1,$3,Type.MULTIPLICACION,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXP1 slash EXP1 {$$ = new Arithmetical($1,$3,Type.DIVISION,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXP1 modulo EXP1 {$$ = new Arithmetical($1,$3,Type.MODULO,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXP1 potencia EXP1 {$$ = new Arithmetical($1,$3,Type.POTENCIA,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXP2 {$$ = $1;}
;

EXP2
     : not EXP2 {$$ = new Logical($2,null,Type.NOT,Type.VALOR,this._$.first_line,this._$.first_column);}
     | EXP3 {$$ = $1;}
;

EXP3
     : number {$$ = new Value(Number($1),Type.ENTERO,Type.VALOR,this._$.first_line,this._$.first_column); }
     | resta IDVALOR { if($2.length === 1 && $2[0].type === Type.ID){ $$ = new Unary($2[0],Type.RESTA,this._$.first_line,this._$.first_column); }else{ $$ = new Unary($1,Type.RESTA,this._$.first_line,this._$.first_column); } }
     | resta number { $$ = new Value(-1*Number($2),Type.ENTERO,Type.VALOR,this._$.first_line,this._$.first_column); }
     | parenta EXPRT parentc { $$ = $2; }
     | cadena {$$ = new Value($1,Type.CADENA,Type.VALOR,this._$.first_line,this._$.first_column);}
     | restrue {$$ = new Value(true,Type.BOOL,Type.VALOR,this._$.first_line,this._$.first_column);}
     | resfalse {$$ = new Value(false,Type.BOOL,Type.VALOR,this._$.first_line,this._$.first_column);}
     | resnull {$$ = new Value(null,Type.NULL,Type.VALOR,this._$.first_line,this._$.first_column);}
     | resundefined {$$ = new Value(null,Type.NULL,Type.VALOR,this._$.first_line,this._$.first_column);}
     | CALLF { $$ = $1; }
     | IDVALOR { if($1.length === 1 && $1[0].type === Type.ID){ $$ = $1[0]; }else{ $$ = new Value($1,Type.ARREGLO,Type.VALOR,this._$.first_line,this._$.first_column); } }
     | IDVALOR DECINC { if($1.length === 1 && $1[0].type === Type.ID){ $$ = new Unary($1[0],$2,this._$.first_line,this._$.first_column); }else{ $$ = new Unary($1,$2,this._$.first_line,this._$.first_column); } }
     | igual llavea llavec { $$ = undefined; nuevo_arreglo = true; }
     | igual llavea DATAPRINT llavec { $$ = $3; nuevo_arreglo = true; }   
;


IDVALOR  
     : id IDVALOR2 { $$ = $2; $$.unshift(new Value($1,Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)); }
     | IDARR IDVALOR2 { $$ = $2; $$.unshift($1); }
;

IDARR
     : id ARREGLO { $$ = new Value($1,Type.ARREGLO,Type.VALOR,this._$.first_line,this._$.first_column); $$.add_positions($2); }
;

ARREGLO
     : llavea EXPRT llavec ARREGLO { $$ = $4; $$.unshift($2);}
     | llavea EXPRT llavec { $$ = []; $$.push($2); }
;

IDVALOR2
     : punto IDVALOR { $$ = $2;  }
     | punto respop parenta parentc { $$ = [new Value(".pop()",Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
     | punto reslength { $$ = [new Value($2,Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
     | { $$ = []; }
;

CALLF
     :id parenta PARAMETERS { $$ = new Call($1,Type.LLAMADA,null,$3,this._$.first_line,this._$.first_column); }
;

PARAMETERS
     : PARALPHA PARAMETERSPRIM   { $$ = $2; /*return parametros*/}
     | parentc { $$ = null; }
;

PARALPHA
     : EXPRT { $$ = []; $$.push($1); }
;

PARAMETERSPRIM
     : PARBETHA PARAMETERSPRIM { $$ = $1; /*parametros call*/}
     | parentc { $$ = $0; /*parametros call*/}
;

PARBETHA
     : coma EXPRT { $$ = $0; $$.push($2); }
;

IDVALORASS  
     : id IDVALOR2ASS { $$ = $2; $$.unshift(new Value($1,Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)); }
     | IDARR IDVALOR2ASS { $$ = $2; $$.unshift($1); }
;

IDVALOR2ASS
     : punto IDVALORASS { $$ = $2;  }
     | punto respush parenta EXPRT parentc { $$ = [$4]; }
;

GRAFICAR
     :resgraficar_ts parenta parentc { $$ = new UnaryNoReturn($1,Type.GRAFICAR,this._$.first_line,this._$.first_column); }
;