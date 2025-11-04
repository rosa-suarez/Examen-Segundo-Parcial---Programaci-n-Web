module.exports = [
  {
    id: 1,
    text: "¿Cuál de las siguientes afirmaciones sobre Python es correcta?",
    options: [
      "Python es un lenguaje compilado fuertemente tipado",
      "Python requiere declaración explícita de tipos",
      "Python es interpretado y dinámicamente tipado",
      "Python no permite programación orientada a objetos"
    ],
    correct: "Python es interpretado y dinámicamente tipado"
  },
  {
    id: 2,
    text: "¿Qué salida produce el siguiente código: print(type([]))?",
    options: [
      "&lt;class 'list'&gt;",
      "&lt;type 'list'&gt;",
      "list",
      "None"
    ],
    correct: "<class 'list'>"
  },
  {
    id: 3,
    text: "¿Cuál es el resultado de: bool(0) and bool([])?",
    options: [
      "True",
      "False",
      "None",
      "Error"
    ],
    correct: "False"
  },
  {
    id: 4,
    text: "¿Qué palabra clave se usa para definir una clase?",
    options: [
      "object",
      "define",
      "class",
      "type"
    ],
    correct: "class"
  },
  {
    id: 5,
    text: "¿Cuál es la diferencia entre 'is' y '==' en Python?",
    options: [
      "'is' compara valores, '==' compara identidades",
      "'==' compara valores, 'is' compara identidades",
      "Ambos son equivalentes",
      "'is' solo funciona con enteros"
    ],
    correct: "'==' compara valores, 'is' compara identidades"
  },
  {
    id: 6,
    text: "¿Qué estructura de control permite manejar excepciones?",
    options: [
      "try-except",
      "if-else",
      "for-while",
      "switch-case"
    ],
    correct: "try-except"
  },
  {
    id: 7,
    text: "¿Cuál es el propósito de la función 'enumerate()'?",
    options: [
      "Ordenar listas",
      "Iterar con índice",
      "Eliminar duplicados",
      "Convertir a cadena"
    ],
    correct: "Iterar con índice"
  },
  {
    id: 8,
    text: "¿Qué librería se usa para manipular arreglos multidimensionales?",
    options: [
      "math",
      "numpy",
      "os",
      "re"
    ],
    correct: "numpy"
  },
  {
    id: 9,
    text: "¿Qué operador se usa para importar todo desde un módulo?",
    options: [
      "import *",
      "from module",
      "include all",
      "load *"
    ],
    correct: "import *"
  },
  {
    id: 10,
    text: "¿Cuál es el resultado de: 'Python'[1:4]?",
    options: [
      "'yth'",
      "'Pyt'",
      "'tho'",
      "'ytho'"
    ],
    correct: "'yth'"
  },
  {
    id: 11,
    text: "¿Qué método convierte una cadena en minúsculas?",
    options: [
      "lower()",
      "downcase()",
      "min()",
      "toLower()"
    ],
    correct: "lower()"
  },
  {
    id: 12,
    text: "¿Qué tipo de error lanza una división entre cero?",
    options: [
      "ZeroDivisionError",
      "ArithmeticError",
      "ValueError",
      "TypeError"
    ],
    correct: "ZeroDivisionError"
  },
  {
    id: 13,
    text: "¿Cuál es el propósito de '__init__' en una clase?",
    options: [
      "Destruir objetos",
      "Inicializar atributos",
      "Importar módulos",
      "Crear funciones globales"
    ],
    correct: "Inicializar atributos"
  },
  {
    id: 14,
    text: "¿Qué función devuelve el número de elementos en una lista?",
    options: [
      "length()",
      "count()",
      "size()",
      "len()"
    ],
    correct: "len()"
  },
  {
    id: 15,
    text: "¿Qué estructura permite recorrer elementos sin índice?",
    options: [
      "for elemento in lista",
      "while i < len(lista)",
      "for i in range(len(lista))",
      "foreach lista as elemento"
    ],
    correct: "for elemento in lista"
  },
  {
    id: 16,
    text: "¿Cuál es el resultado de: set([1, 2, 2, 3])?",
    options: [
      "{1, 2, 2, 3}",
      "[1, 2, 3]",
      "{1, 2, 3}",
      "(1, 2, 3)"
    ],
    correct: "{1, 2, 3}"
  }
];