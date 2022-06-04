import {creaTabla} from "./funciones.js";

// Convierte un simbolo de entrada en el equivalente en el alfabeto que se esta trabajando.
const carAsimb = (caracter:string):string => {
    let simbolo:string;
      switch(caracter){
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
          simbolo = 'decimal'
        break;
        case '-':
          simbolo = '-'
        break;
          default: simbolo = 'otro';
    }
    return simbolo
  }

  export function esConstReal(codigoFuente:string,lexema:string,control:number):Array<any>{
    enum simbolo{
      'digito',
      '-',
      'decimal',
      'otro'
    }
    
    enum estado{
      q0,
      q1,
      q2,
      q3,
      q4,
      q5
    }
    
    let cantidadSimbolos: number= (Object.keys(simbolo).length / 2); // Porque es un enum numerico.
    let tablaTransiciones: Array<any> = [];
    creaTabla(tablaTransiciones,cantidadSimbolos);
  
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
    let estadosFinales:Array<number> = [estado.q1];
    let estadoInicial: number = estado.q0;
  
    // Inicializando estado actual en el inicial.
    let estadoActual: number = estadoInicial;
    // estadoActual contendra el estado al que llego el automata tras analizar el caracter del codigo fuente.
    while(estadoActual == (0|2|3|4)){
      // Toma un caracter del archivo y busca el estado siguiente en la tabla de transiciones.
      estadoActual = tablaTransiciones[estadoActual][simbolo[carAsimb(codigoFuente[control]) as any]]; // as any esta ya que carAsimb devuelve un string, y se accede al index del enum con una string
      if (estadoActual == (0|2|3|4)) {
        lexema+=codigoFuente[control];
      }
      control++;
    }
  
    if (estadosFinales.includes(estadoActual)){
      return [true,control-1,lexema]
    } else {
      return [false,controlAnt]
    }
   }