import { creaTabla } from "./funciones.js";
// Convierte un simbolo de entrada en el equivalente en el alfabeto que se esta trabajando.
const carAsimb = (caracter) => {
    let simbolo;
    switch (caracter) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            simbolo = 'digito';
            break;
        case ',':
        case '.':
            simbolo = 'decimal';
            break;
        case '-':
            simbolo = '-';
            break;
        default: simbolo = 'otro';
    }
    return simbolo;
};
export function esConstReal(codigoFuente, lexema, control) {
    let simbolo;
    (function (simbolo) {
        simbolo[simbolo["digito"] = 0] = "digito";
        simbolo[simbolo["-"] = 1] = "-";
        simbolo[simbolo["decimal"] = 2] = "decimal";
        simbolo[simbolo["otro"] = 3] = "otro";
    })(simbolo || (simbolo = {}));
    let estado;
    (function (estado) {
        estado[estado["q0"] = 0] = "q0";
        estado[estado["q1"] = 1] = "q1";
        estado[estado["q2"] = 2] = "q2";
        estado[estado["q3"] = 3] = "q3";
        estado[estado["q4"] = 4] = "q4";
        estado[estado["q5"] = 5] = "q5";
    })(estado || (estado = {}));
    let cantidadSimbolos = (Object.keys(simbolo).length / 2); // Porque es un enum numerico.
    let tablaTransiciones = [];
    creaTabla(tablaTransiciones, cantidadSimbolos);
    // ***** CARGA DE LA TABLA DE TRANSICIONES *****
    tablaTransiciones[estado.q0][simbolo.digito] = 3;
    tablaTransiciones[estado.q0][simbolo['-']] = 3;
    tablaTransiciones[estado.q0][simbolo.decimal] = 5;
    tablaTransiciones[estado.q0][simbolo.otro] = 5;
    tablaTransiciones[estado.q2][simbolo.digito] = 4;
    tablaTransiciones[estado.q2][simbolo['-']] = 5;
    tablaTransiciones[estado.q2][simbolo.decimal] = 5;
    tablaTransiciones[estado.q2][simbolo.otro] = 5;
    tablaTransiciones[estado.q3][simbolo.digito] = 3;
    tablaTransiciones[estado.q3][simbolo['-']] = 1;
    tablaTransiciones[estado.q3][simbolo.decimal] = 2;
    tablaTransiciones[estado.q3][simbolo.otro] = 1;
    //tablaTransiciones[estado.q4][simbolo.digito] = 4;
    //tablaTransiciones[estado.q4][simbolo['-']] = 1;
    //tablaTransiciones[estado.q4][simbolo.decimal] = 1;
    //tablaTransiciones[estado.q4][simbolo.otro] = 1;
    // ***** FIN CARGA DE LA TABLA DE TRANSICIONES *****
    // Elementos del analizador lexico
    let controlAnt = control;
    // Definicin de elementos necesarios para el automata
    let estadosFinales = [estado.q1];
    let estadoInicial = estado.q0;
    // Inicializando estado actual en el inicial.
    let estadoActual = estadoInicial;
    // estadoActual contendra el estado al que llego el automata tras analizar el caracter del codigo fuente.
    while (estadoActual == (0 | 2 | 3 | 4)) {
        // Toma un caracter del archivo y busca el estado siguiente en la tabla de transiciones.
        estadoActual = tablaTransiciones[estadoActual][simbolo[carAsimb(codigoFuente[control])]]; // as any esta ya que carAsimb devuelve un string, y se accede al index del enum con una string
        console.log(estadoActual);
        if (estadoActual == (0 | 2 | 3 | 4)) {
            lexema += codigoFuente[control];
        }
        control++;
    }
    if (estadosFinales.includes(estadoActual)) {
        return [true, control - 1, lexema];
    }
    else {
        return [false, controlAnt];
    }
}