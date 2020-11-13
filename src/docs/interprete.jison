%{
     let symbolt = new SymbolTable(null);
     symbolt.functions = [];
     let global_var = [];
     let structures = [];
     let nuevo_arreglo = false;
     let existe = false;
     let nDimension = -1;
     let idAtributo = 0;

     function crear_metodos_nativos(count)
     {
          //insertando metodo para imprimir ---------------------------------------------------------------
          count.putInstruction('//Insertando Funcion print_3d_c')
          count.putInstruction('void print_3d_c(){')
          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tag1 = count.paramFunc(Type.LOCAL, 0)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let punt = count.getNextTemporal();
          let punt2 = count.getNextTemporal();
          let c = count.getNextTemporal();
          let tmp = count.getNextTemporal();
          let tag = count.getNextLabel();
          let tago = count.getNextLabel();
          count.putInstruction(punt2+' = stack[(int)'+ tag1 + '];');

          count.putInstruction(c + ' = 0;');
          count.putInstruction(tag + ':');
                
          count.putInstruction(punt+' = '+ punt2 + ' + ' + c + ';');
          count.putInstruction(tmp+' = heap[(int)' + punt + '];');
                
          count.generateIf2(tmp,'==','0',tago);
          count.putInstruction('printf("%c",(int)' + tmp + ');');
                
          count.putInstruction(c+' = '+c+' + 1;');
          count.putInstruction('goto '+tag+';');
          count.putInstruction(tago + ':');
          count.putInstruction('printf("%c",(int)' + 10 + ');');
          count.putInstruction('return;\n}\n');

          count.resetRelative();


          //insertando metodo para toLowerCase -----------------------------------------------------------
          count.putInstruction('//Insertando Funcion toLowerCase_3d_c')
          count.putInstruction('void toLowerCase_3d_c(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let tag2l = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + tag2l + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tag1l = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let puntl = count.getNextTemporal();
          let punt2l = count.getNextTemporal();
          let cl = count.getNextTemporal();
          let tmpl = count.getNextTemporal();
          let tagl = count.getNextLabel();
          let tagol = count.getNextLabel();
          let tago1l = count.getNextLabel();
          let tago1ll = count.getNextLabel();
          count.putInstruction(punt2l+' = stack[(int)'+ tag1l + '];');

          count.putInstruction(cl + ' = 0;');
          count.putInstruction(tagl + ':');
                
          count.putInstruction(puntl+' = '+ punt2l + ' + ' + cl + ';');
          count.putInstruction(tmpl+' = heap[(int)' + puntl + '];');
                
          count.generateIf2(tmpl,'==','0',tagol);
          count.generateIf2('65','<',tmpl,tago1ll);
          count.generateIf2('90','>',tmpl,tago1ll);
          count.putInstruction(tmpl+' = ' + tmpl + ' + 32;');
          
          count.putInstruction(tago1ll + ':');
          count.generateIf2('0','>',cl,tago1l);
          let ini = count.generateDeclaration(Type.GLOBAL,tmpl,0);
          count.putInstruction(cl+' = '+cl+' + 1;');
          count.putInstruction('goto '+tagl+';');

          count.putInstruction(tago1l + ':');
          let t = count.getNextTemporal();
          count.putInstruction(t + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + t + '] = ' + tmpl + ';')

          count.putInstruction(cl+' = '+cl+' + 1;');
          count.putInstruction('goto '+tagl+';');
          count.putInstruction(tagol + ':');
          count.generateDeclaration(Type.GLOBAL,0,0);
          count.putInstruction('stack[(int)' + tag2l + '] = ' + ini + ';');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

          //insertando metodo para toUpperCase -------------------------------------------------------------
          count.putInstruction('//Insertando Funcion toUpperCase_3d_c')
          count.putInstruction('void toUpperCase_3d_c(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let tag2u = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + tag2u + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tag1u = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let puntu = count.getNextTemporal();
          let punt2u = count.getNextTemporal();
          let cu = count.getNextTemporal();
          let tmpu = count.getNextTemporal();
          let tagu = count.getNextLabel();
          let tagou = count.getNextLabel();
          let tago1uu = count.getNextLabel();
          let tago1u = count.getNextLabel();
          count.putInstruction(punt2u+' = stack[(int)'+ tag1u + '];');

          count.putInstruction(cu + ' = 0;');
          count.putInstruction(tagu + ':');
                
          count.putInstruction(puntu+' = '+ punt2u + ' + ' + cu + ';');
          count.putInstruction(tmpu+' = heap[(int)' + puntu + '];');
                
          count.generateIf2(tmpu,'==','0',tagou);
          count.generateIf2('97','<',tmpu,tago1uu);
          count.generateIf2('122','>',tmpu,tago1uu);
          count.putInstruction(tmpu+' = ' + tmpu + ' - 32;');

          count.putInstruction(tago1uu + ':');
          count.generateIf2('0','>',cu,tago1u);
          let iniu = count.generateDeclaration(Type.GLOBAL,tmpu,0);
          count.putInstruction(cu+' = '+cu+' + 1;');
          count.putInstruction('goto '+tagu+';');

          count.putInstruction(tago1u + ':');
          let tu = count.getNextTemporal();
          count.putInstruction(tu + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + tu + '] = ' + tmpu + ';')

          count.putInstruction(cu+' = '+cu+' + 1;');
          count.putInstruction('goto '+tagu+';');
          count.putInstruction(tagou + ':');
          count.generateDeclaration(Type.GLOBAL,0,0);
          count.putInstruction('stack[(int)' + tag2u + '] = ' + iniu + ';');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

          //insertando metodo para CharAt() ----------------------------------------------------------
          count.putInstruction('//Insertando Funcion CharAt_3d_c')
          count.putInstruction('void CharAt_3d_c(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let retc = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + retc + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tag1c1 = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Insertando parametros de Funcion. Posicion 2')
          let tag1c2 = count.paramFunc(Type.LOCAL, 2)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let puntch = count.getNextTemporal();
          let punt2ch = count.getNextTemporal();
          let punt2ch2 = count.getNextTemporal();
          let cch = count.getNextTemporal();
          let tmpch = count.getNextTemporal();
          let tagch = count.getNextLabel();
          let tagoch = count.getNextLabel();
          count.putInstruction(punt2ch+' = stack[(int)'+ tag1c1 + '];');
          count.putInstruction(punt2ch2+' = stack[(int)'+ tag1c2 + '];');
          let tcc = count.getNextTemporal();
          count.putInstruction(tcc + ' = ' + punt2ch2 + ' - 1;');

          count.putInstruction(cch + ' = 0;');
          count.putInstruction(tagch + ':');
                
          count.putInstruction(puntch+' = '+ punt2ch + ' + ' + cch + ';');
          count.putInstruction(tmpch+' = heap[(int)' + puntch + '];');
                
          count.generateIf2(tmpch,'==','0',tagoch);
          count.generateIf2(tcc,'==',cch,tagoch);
                
          count.putInstruction(cch +' = '+cch+' + 1;');
          count.putInstruction('goto '+tagch+';');
          count.putInstruction(tagoch + ':');
          let retp = count.getNextTemporal();
          count.putInstruction(retp+' = heap[(int)'+ cch + '];');
          let tc = count.getNextTemporal();
          count.putInstruction(tc + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + tc + '] = ' + retp + ';')
          count.generateDeclaration(Type.GLOBAL,0,0);

          count.putInstruction('stack[(int)' + retc + '] = ' + tc + ';');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

          //insertando metodo para Concat() -----------------------------------------------------
          count.putInstruction('//Insertando Funcion Concat_3d_c')
          count.putInstruction('void Concat_3d_c(){')

          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let retcon = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + retcon + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tagcon1 = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Insertando parametros de Funcion. Posicion 2')
          let tagcon2 = count.paramFunc(Type.LOCAL, 2)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let puntcon = count.getNextTemporal();
          let punt2con = count.getNextTemporal();
          let punt23con = count.getNextTemporal();
          let ccon = count.getNextTemporal();
          let tmpcon = count.getNextTemporal();
          let tagcon = count.getNextLabel();
          let tagcon2e = count.getNextLabel();
          let tconstr1 = count.getNextLabel();
          let tagocon = count.getNextLabel();
          let finishcon = count.getNextLabel();
          count.putInstruction(punt2con+' = stack[(int)'+ tagcon1 + '];');
          count.putInstruction(punt23con+' = stack[(int)'+ tagcon2 + '];');

          count.putInstruction(ccon + ' = 0;');
          count.putInstruction(tagcon + ':');
                
          count.putInstruction(puntcon+' = '+ punt2con + ' + ' + ccon + ';');
          count.putInstruction(tmpcon+' = heap[(int)' + puntcon + '];');
          
          //primera cadena
          count.generateIf2(tmpcon,'==','0',tagocon);
          count.generateIf2('0','>',ccon,tconstr1);
          let iniucon = count.generateDeclaration(Type.GLOBAL,tmpcon,0);
          count.putInstruction(ccon+' = '+ccon+' + 1;');
          count.putInstruction('goto '+tagcon+';');

          count.putInstruction(tconstr1 + ':');
          let tucon = count.getNextTemporal();
          count.putInstruction(tucon + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + tucon + '] = ' + tmpcon + ';')

          count.putInstruction(ccon+' = '+ccon+' + 1;');
          count.putInstruction('goto '+tagcon+';');

          //segunda cadena
          count.putInstruction(tagocon + ':');
          count.putInstruction(ccon + ' = 0;');
          count.putInstruction(tagcon2e + ':');

          count.putInstruction(puntcon+' = '+ punt23con + ' + ' + ccon + ';');
          count.putInstruction(tmpcon+' = heap[(int)' + puntcon + '];');
          
          count.generateIf2(tmpcon,'==','0',finishcon);
          count.putInstruction(tucon + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + tucon + '] = ' + tmpcon + ';')

          count.putInstruction(ccon+' = '+ccon+' + 1;');
          count.putInstruction('goto '+tagcon2e+';');


          count.putInstruction(finishcon + ':');
          count.generateDeclaration(Type.GLOBAL,0,0);
          count.putInstruction('stack[(int)' + retcon + '] = ' + iniucon + ';');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

          // get value array ----------------------------------------------------------------------------------------------------
          count.putInstruction('//Insertando Funcion get_value_arr_3d_c')
          count.putInstruction('void get_value_arr_3d_c(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let retarr = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + retarr + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1') // debe ser el numero de elementos que tiene el arreglo
          let tagarr1 = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Insertando parametros de Funcion. Posicion 2') // debe ser el acceso al arreglo
          let tagarr2 = count.paramFunc(Type.LOCAL, 2)

          count.putInstruction('//Insertando parametros de Funcion. Posicion 3') // debe ser donde comienza los punteros a los elementos
          let tagarr3 = count.paramFunc(Type.LOCAL, 3)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let puntarr = count.getNextTemporal();
          let punt2arr = count.getNextTemporal();
          let punt2arr1 = count.getNextTemporal();
          let punt2arr2 = count.getNextTemporal();
          let punt2arr3 = count.getNextTemporal();
          let carr = count.getNextTemporal();
          let tmparr = count.getNextTemporal();
          let tagarr = count.getNextLabel();
          let tagoarr = count.getNextLabel();
          let tagoarr1 = count.getNextLabel();
          count.putInstruction(punt2arr +' = stack[(int)'+ tagarr1 + '];');
          count.putInstruction(punt2arr1 +' = stack[(int)'+ tagarr2 + '];');
          count.putInstruction(punt2arr2 +' = stack[(int)'+ tagarr3 + '];');

          count.generateIf2(punt2arr,'>',punt2arr1,tagoarr);
          count.putInstruction(carr + ' = 0;');
          count.putInstruction(tagarr + ':');
                
          count.putInstruction(puntarr+' = '+ punt2arr2 + ' + ' + carr + ';');

          count.generateIf2(carr,'<=',punt2arr,tagoarr);
          count.generateIf2(carr,'==',punt2arr1,tagoarr1);
          count.putInstruction(carr+' = '+carr+' + 1;');
          count.putInstruction('goto '+tagarr+';');

          count.putInstruction(tagoarr1 + ':');
          count.putInstruction(punt2arr3+' = '+puntarr+';');
          count.putInstruction('stack[(int)' + retarr + '] = '+punt2arr3+';');
          count.putInstruction(tagoarr + ':');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

          //metodo para new array -----------------------------------------------------------
          count.putInstruction('//Insertando Funcion new_array_3d_c')
          count.putInstruction('void new_array_3d_c(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let tagnarr = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + tagnarr + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tag1narr = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let punt2narr = count.getNextTemporal();
          let cnarr = count.getNextTemporal();
          let tmplnarr = count.getNextTemporal();
          let taglnarr = count.getNextLabel();
          let tagolnarr = count.getNextLabel();
          let tago1lnarr = count.getNextLabel();
          let tago1llnarr = count.getNextLabel();
          count.putInstruction(punt2narr+' = stack[(int)'+ tag1narr + '];');

          count.putInstruction(cnarr + ' = 0;');
          
          let tta = count.getNextTemporal();
          count.putInstruction(tta + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + tta + '] = '+punt2narr+';')

          count.putInstruction(taglnarr + ':');

          count.generateIf2(cnarr,'<=',punt2narr,tagolnarr);
          let tnarr = count.getNextTemporal();
          count.putInstruction(tnarr + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + tnarr + '] = 0;')

          count.putInstruction(cnarr+' = '+cnarr+' + 1;');
          count.putInstruction('goto '+taglnarr+';');

          count.putInstruction(tagolnarr + ':');
          count.putInstruction('stack[(int)' + tagnarr + '] = ' + tta + ';');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

          //Codigo para convertir numero ya sea decimal a cadena soy crack
          count.putInstruction('//Insertando Funcion number_to_string_3d()')
          count.putInstruction('void number_to_string_3d(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let tans = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + tans + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tans1 = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let par1ns = count.getNextTemporal();
          let csn = count.getNextTemporal();
          let auxsn = count.getNextTemporal();
          let bsn = count.getNextTemporal();
          let nnsn = count.getNextTemporal();
          let pshsn = count.getNextTemporal();
          let zero = count.getNextTemporal();
          let a1 = count.getNextTemporal();
          let a2 = count.getNextTemporal();
          let dot = count.getNextTemporal();
          count.putInstruction(par1ns + ' = stack[(int)'+ tans1 + '];');
          let wh1 = count.getNextLabel();
          let wh2 = count.getNextLabel();
          let wh3 = count.getNextLabel();
          let endsn = count.getNextLabel();
          let dec1 = count.getNextLabel();
          let dec2 = count.getNextLabel();
          let dec3 = count.getNextLabel();
          let returnsn = 0;
          let decsn = count.generateDeclaration(Type.GLOBAL,48,0);

          count.putInstruction(csn + ' = 0;');
          count.putInstruction(dot + ' = 0;');
          count.putInstruction(zero + ' = 0;');
          count.putInstruction(wh1 + ':');
          count.putInstruction(par1ns + ' = ' + par1ns + ' / 10;');
          count.putInstruction(csn + ' = ' + csn + ' + 1;');
          count.putInstruction(auxsn + ' = (int)' + par1ns + ';');

          count.generateIf2(auxsn,'<','0',wh1);
          count.putInstruction(bsn + ' = 0;');

          count.putInstruction(wh2 + ':');
          count.generateIf2(csn,'==','0',wh3);
          count.putInstruction(par1ns + ' = ' + par1ns + ' * 10;');
          count.putInstruction(a1 + ' = (int)' + par1ns + ';');
          count.putInstruction(a2 + ' = ' + bsn + ' * 10;');
          count.putInstruction(nnsn + ' = ' + a1 + ' - ' + a2 + ';');
          count.putInstruction(par1ns + ' = ' + par1ns + ' - ' + a2 + ';');
          count.putInstruction(bsn + ' = ' + nnsn + ' ;');
          count.putInstruction(csn + ' = ' + csn + ' - 1;');

          count.putInstruction(bsn + ' = ' + bsn + ' + 48;');
          count.generateIf2(zero,'!=','0',dec1);
          let aa1 = count.generateDeclaration(Type.GLOBAL,bsn,0);
          count.putInstruction(decsn + ' = ' + aa1 + ';');
          count.putInstruction(zero + ' = 1;');
          count.putInstruction(bsn + ' = ' + bsn + ' - 48;');
          count.putInstruction('goto '+wh2+';');

          count.putInstruction(dec1 + ':');
          count.putInstruction(pshsn + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + pshsn + '] = '+bsn+';')
          count.putInstruction(bsn + ' = ' + bsn + ' - 48;');
          count.putInstruction('goto '+wh2+';');

          count.putInstruction(wh3 + ':');
          count.putInstruction(par1ns + ' = ' + par1ns + ' * 10;');
          count.putInstruction(a1 + ' = (int)' + par1ns + ';');
          count.putInstruction(a2 + ' = ' + bsn + ' * 10;');
          count.putInstruction(nnsn + ' = ' + a1 + ' - ' + a2 + ';');
          count.putInstruction(par1ns + ' = ' + par1ns + ' - ' + a2 + ';');
          count.putInstruction(bsn + ' = ' + nnsn + ' ;');
          count.generateIf2(bsn,'==','0',endsn);

          count.putInstruction(bsn + ' = ' + bsn + ' + 48;');
          count.generateIf2(zero,'!=','0',dec2);
          let aa2 = count.generateDeclaration(Type.GLOBAL,48,0);
          count.putInstruction(decsn + ' = ' + aa2 + ';');
          count.putInstruction(pshsn + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + pshsn + '] = '+46+';')
          count.putInstruction(pshsn + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + pshsn + '] = '+bsn+';')
          count.putInstruction(zero + ' = 1;');
          count.putInstruction(bsn + ' = ' + bsn + ' - 48;');
          count.putInstruction('goto '+wh3+';');

          count.putInstruction(dec2 + ':');
          count.generateIf2(dot,'!=','0',dec3);
          count.putInstruction(dot + ' = 1;');
          count.putInstruction(pshsn + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + pshsn + '] = '+46+';')

          count.putInstruction(dec3 + ':');
          count.putInstruction(pshsn + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + pshsn + '] = '+bsn+';')
          count.putInstruction(bsn + ' = ' + bsn + ' - 48;');

          count.putInstruction('goto '+wh3+';');

          count.putInstruction(endsn + ':');
          count.putInstruction(pshsn + ' = H;');
          count.putInstruction('H = H + 1;');
          count.putInstruction('heap[(int)' + pshsn + '] = '+0+';')
          count.putInstruction('stack[(int)' + tans + '] = ' + decsn + ';');
          count.putInstruction('return;\n}\n');

          //insertando metodo para length -----------------------------------------------------------
          count.putInstruction('//Insertando Funcion length_3d_c')
          count.putInstruction('void length_3d_c(){')
          count.putInstruction('//Insertando return de Funcion. Posicion 0')
          let tag2lle = count.paramFunc(Type.LOCAL, 0)
          count.putInstruction('stack[(int)' + tag2lle + '] = 0.0;');

          count.putInstruction('//Insertando parametros de Funcion. Posicion 1')
          let tag1lle = count.paramFunc(Type.LOCAL, 1)

          count.putInstruction('//Empezo el cuerpo de la funcion.')
          let puntlle = count.getNextTemporal();
          let punt2lle = count.getNextTemporal();
          let clle = count.getNextTemporal();
          let tmplle = count.getNextTemporal();
          let taglle = count.getNextLabel();
          let tagolle = count.getNextLabel();
          count.putInstruction(punt2lle + ' = stack[(int)'+ tag1lle + '];');

          count.putInstruction(clle + ' = 0;');
          count.putInstruction(taglle + ':');
                
          count.putInstruction(puntlle + ' = '+ punt2lle + ' + ' + clle + ';');
          count.putInstruction(tmplle+' = heap[(int)' + puntlle + '];');
                
          count.generateIf2(tmplle,'==','0',tagolle);
          count.putInstruction(clle+' = '+clle+' + 1;');
          count.putInstruction('goto '+taglle+';');
          count.putInstruction(tagolle + ':');
          count.putInstruction('stack[(int)' + tag2lle + '] = ' + clle + ';');
          count.putInstruction('return;\n}\n');

          count.resetRelative();

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
"length"                return 'reslength';
"graficar_ts"           return 'resgraficar_ts';
"CharAt"                return 'resCharAt';
"ToLowerCase"           return 'resToLowerCase';
"ToUpperCase"           return 'resToUpperCase';
"Concat"                return 'resConcat';
"new"                   return 'resnew';

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
               let count = new Count();
               symbolt.add_types(structures);

               console.log($1);

               symbolt.functions.unshift(new Function(Type.VOID, Type.VALOR, "main", null, $1, 0, 0))
               for(let i = 0; i<symbolt.functions.length; i++){
                    symbolt.functions[i].addParamet(count);
               }
               for(let i = 1; i<symbolt.functions.length; i++){
                    count.putInstruction('void '+ symbolt.functions[i].id + '();');
               }
               count.putInstruction('\n');

               crear_metodos_nativos(count);
               count.putInstruction('\n');

               let principal = -1;
               let lout = count.getNextLabel();

               let a = count.getGlobals();

               for(let i = 0; i<symbolt.functions.length; i++){
                    if(i != principal){
                         symbolt.functions[i].operate(symbolt, count);
                    }
               //count.resetRelative();
               //symbolt.functions[i].operate(symbolt);
               }

               count.joinString(a);
               let salida = count.getOutput();
               console.log(salida);

               console.log(count.getError())
               a = '';

               structures = [];
               symbolt = new SymbolTable(null);
               symbolt.functions = [];
               global_var = []
               nuevo_arreglo = false;
               existe = false;
               return salida;
          }catch(e){
               console.log(e); 
               structures = [];
               symbolt = new SymbolTable(null);
               symbolt.functions = [];
               global_var = []
               nuevo_arreglo = false;
               existe = false;
          }
     }
     | EOF { console.log("termino vacio") }
;

DEFTYPES
     :restype TYPEDEFID igual corchetea ATTRIB corchetec puntocoma{ }
;

TYPEDEFID
     :id { idAtributo = 0; existe = false; for(let d of structures){if(d.name === $1) { existe = true; break;}} if(!existe) structures.push({name: $1, atributes: []}); else try{ add_error_E( {error: "Ya existe un type con el nombre" + $1, type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } }
;

ATTRIB
     :ATTRIB coma id dospuntos TYPES { if(!existe) structures[structures.length - 1].atributes.push({name: $3, type: $5.id, number: idAtributo++}); }
     |id dospuntos TYPES { if(!existe) structures[structures.length - 1].atributes.push({name: $1, type: $3.id, number: idAtributo++}); }
;

INSTRUCTIONSG
	: INSTRUCTIONG INSTRUCTIONSG  { if(Array.isArray($1)){ for(let a of $1){ if(a !== null)$2.unshift(a); }}else{if($1 !== null){$2.unshift($1);}}  $$ = $2; }
	| INSTRUCTIONG { if(Array.isArray($1)){ $$ = $1; }else{ if($1 !== null){$$ = [$1];}else $$ = [];}  } }
;

INSTRUCTIONG
	: FUNCTION { symbolt.addFunction($1); $$ = null; }
     | DECLARATION puntocoma { if(Array.isArray($1)){ for(let a of $1){a.type_var = Type.GLOBAL}} } // if(a instanceof DECLARATION){a.type_var = Type.GLOBAL}
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

FUNCTION
    : resfunction id parenta LISTAPARAMETROS parentc RETURNT BLOCK { $$ = new Function( $6.id,$6.access,$2,$4,$7,this._$.first_line,this._$.first_column); }
    | resfunction id parenta parentc RETURNT BLOCK { $$ = new Function( $5.id,$5.access,$2,null,$6,this._$.first_line,this._$.first_column); }
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
;

TYPES
     : resarray menor TYPES mayor { $$ = {id: Type.ARREGLO, access: Type.ARREGLO, type: Type.PRIMITIVO}; }
     | TYPE MULTIDIMENSION { $$ = {id: $1, access: Type.ARREGLO, type: Type.PRIMITIVO}; if($1 !== Type.ENTERO && $1 !== Type.BOOL && $1 !== Type.CADENA) $$.type = Type.OBJETO; }
     | TYPE { $$ = {id: $1, access: Type.VALOR, type: Type.VALOR}; if($1 !== Type.ENTERO && $1 !== Type.BOOL && $1 !== Type.CADENA) $$.type = Type.OBJETO; }
;

MULTIDIMENSION
     : llavea llavec MULTIDIMENSION { $$ = $1 + $2 + $3; nDimension++;}
     | llavea llavec { $$ = $1 + $2; nDimension++;}
;

LISTAPARAMETROS
     : BETHA LISTAPARAMETROSPRIMA { $$ = $2; } 
;

LISTAPARAMETROSPRIMA
     : ALPHA LISTAPARAMETROSPRIMA { $$ = $0;}
     | {$$ = $1;}
;

BETHA
     : id dospuntos TYPES { $$ = []; $$.push(new Declaration($1,null,$3.id,$3.access,Type.LOCAL,Type.VAR,/*Type.PRIMITIVO,*/this._$.first_line,this._$.first_column, nDimension)); nDimension = -1; }
;

ALPHA
     : coma id dospuntos TYPES { $$ = $0; $$.push(new Declaration($2,null,$4.id,$4.access,Type.LOCAL,Type.VAR,/*Type.PRIMITIVO,*/this._$.first_line,this._$.first_column, nDimension)); nDimension = -1; }
;

TYPEVAR
     : resconst {$$ = Type.CONST;}
     | reslet {$$ = Type.VAR;}
;

DECLARATION
     : TYPEVAR LISTID { for(let a of $2){a.type_c = $1;} $$ = $2; $$ = $2; }
;

LISTID
     : DECBETHA LISTIDPRIM { $$ = $2; }
;

LISTIDPRIM
     : DECALPHA LISTIDPRIM { $$ = $1; } 
     | { $$ = $1;}
;

DECBETHA
     : id dospuntos TYPES ASSVALUE { $$ = []; $$.push(new Declaration($1,$4,$3.id,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column, nDimension)); if(nuevo_arreglo) {/*$$[$$.length-1].type = Type.ARREGLO; */$$[$$.length-1].type_exp = Type.ARREGLO; } nuevo_arreglo = false; nDimension = -1;}
     | id ASSVALUE{ $$ = []; $$.push(new Declaration($1,$2,undefined,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column, nDimension)); if(nuevo_arreglo) {/*$$[$$.length-1].type = Type.ARREGLO; */$$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false; nDimension = -1;}
;

DECALPHA
     : coma id dospuntos TYPES ASSVALUE { $$ = $0; $$.push(new Declaration($2,$5,$4.id,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column, nDimension)); /*testdec*/  if(nuevo_arreglo) {/*$$[$$.length-1].type = Type.ARREGLO; */$$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false; nDimension = -1;}
     | coma id ASSVALUE{ $$ = $0; $$.push(new Declaration($2,$3,undefined,Type.VALOR,Type.LOCAL,null,/*Type.PRIMITIVO,0,*/this._$.first_line,this._$.first_column, nDimension)); /*testdec*/ if(nuevo_arreglo) {/*$$[$$.length-1].type = Type.ARREGLO; */$$[$$.length-1].type_exp = Type.ARREGLO;} nuevo_arreglo = false; nDimension = -1;}
;

ASSVALUE
     : igual EXPRT { $$ = $2; }
     | igual DECASSTYPE { $$ = $2; }
     | { $$ = undefined; }
;

BLOCK
     : corchetea BLOCK2 { $$ = $2; }
;

BLOCK2
     : INSTRUCTIONS corchetec { $$ = $1; }
     | corchetec { $$ = []; }
;

INSTRUCTIONS
     : INSTRUCTION INSTRUCTIONS { if(Array.isArray($1)){ for(let a of $1){ $2.unshift(a); }}else{$2.unshift($1);}  $$ = $2; }
     | INSTRUCTION { if(Array.isArray($1)){ $$ = $1; }else{ $$ = [$1]; } }
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
    | id DECINC { $$ = new Unary($1,$2,this._$.first_line,this._$.first_column); }
    | IDVALOR igual EXPRT { if($1.length === 1 && $1[0].type === Type.ID){ $1 = $1[0]; } $$ = new Assignment($1,$3,this._$.first_line,this._$.first_column); }
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
     | IDVALORASS { $$ = new Unary($1,".push()",this._$.first_line,this._$.first_column); }
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
     :  CELSE ELSE {let tf = $1;tf.elsebody = $2;$$ = tf;}
;

CELSE
     : CELSE reselse IFF {let tc = $1; tc.lif.push($3); $$ = tc;}
     | IFF {let t = new IfList();t.lif.push($1);$$ = t;}
;

ELSE
     : reselse BLOCK {$$ = new Else($2,this._$.first_line,this._$.first_column);}
     | {$$ = null;}
;

IFF
     : resif PARAMETROUNITARIO BLOCK {$$ = new If($2,$3,Type.IF,this._$.first_line,this._$.first_column);}
;

SWITCH
     : resswitch PARAMETROUNITARIO corchetea CASES DEFAULT corchetec {let ts = new Switch($2,$4,$5,this._$.first_line,this._$.first_column);console.log("entrooo");$$ = ts;}
;

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
     //| resta IDVALOR { if($2.length === 1 && $2[0].type === Type.ID){ $$ = new Unary($2[0],Type.RESTA,this._$.first_line,this._$.first_column); }else{ $$ = new Unary($1,Type.RESTA,this._$.first_line,this._$.first_column); } }
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
     | llavea llavec {$$ = new Value(new Value(0, Type.ENTERO, Type.VALOR, this._$.first_line,this._$.first_column),Type.NULL,Type.ARREGLO,this._$.first_line,this._$.first_column);}
     | llavea DATAPRINT llavec {$$ = new Value($2,Type.NULL,Type.ARREGLO,this._$.first_line,this._$.first_column);}
     | resnew resarray parenta EXPRT parentc {$$ = new Value($4,Type.NULL,Type.ARREGLO,this._$.first_line,this._$.first_column);}
     | cadena punto OPCADENAS { $3.unshift(new Value($1,Type.CADENA,Type.VALOR,this._$.first_line,this._$.first_column)); $$ = new Value($3,Type.ARREGLO,Type.VALOR,this._$.first_line,this._$.first_column); }
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
     | punto OPCADENAS { $$ = $2; }
     | { $$ = []; }
;

OPCADENAS
     : reslength { $$ = [new Value(".length()",Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
     | resCharAt parenta EXPRT parentc { $$ = [$3,new Value(".charAt()",Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
     | resToLowerCase parenta parentc { $$ = [new Value(".toLowerCase()",Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
     | resToUpperCase parenta parentc { $$ = [new Value(".toUpperCase()",Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
     | resConcat parenta EXPRT parentc { $$ = [$3,new Value(".Concat()",Type.ID,Type.VALOR,this._$.first_line,this._$.first_column)];  }
;


CALLF
     :id parenta PARAMETERS { $$ = new Call($1,Type.LLAMADA,Type.LLAMADA,$3,this._$.first_line,this._$.first_column); }
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
     :resgraficar_ts parenta parentc { $$ = new Unary($1,Type.GRAFICAR,this._$.first_line,this._$.first_column); }
;