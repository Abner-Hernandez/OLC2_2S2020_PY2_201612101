export function add_error_E(errores)
{
     let arr = JSON.parse(localStorage.getItem('errores_E'));
     arr.push({Tipo: errores.type, Descripción: errores.error, Línea: errores.line, Columna: errores.column});
     localStorage.setItem('errores_E', JSON.stringify(arr));
}

export function add_simbol_E(simbol_table)
{
     let arr = JSON.parse(localStorage.getItem('simbtable_E'));
     arr.push({Nombre: simbol_table.name, Tipo: simbol_table.type, Ambito: simbol_table.ambit, Fila: simbol_table.row, Columna: simbol_table.column});
     localStorage.setItem('simbtable_E', JSON.stringify(arr));
}

export function add_error_T(errores)
{
     let arr = JSON.parse(localStorage.getItem('errores_T'));
     arr.push({Tipo: errores.type, Descripción: errores.error, Línea: errores.line, Columna: errores.column});
     localStorage.setItem('errores_T', JSON.stringify(arr));
}

export function add_simbol_T(simbol_table)
{
     let arr = JSON.parse(localStorage.getItem('simbtable_T'));
     arr.push({Nombre: simbol_table.name, Tipo: simbol_table.type, Ambito: simbol_table.ambit, Fila: simbol_table.row, Columna: simbol_table.column});
     localStorage.setItem('simbtable_T', JSON.stringify(arr));
}

export function add_console(text)
{
     let arr = localStorage.getItem('console');
     arr += text + "\n";
     localStorage.setItem('console', arr);
}