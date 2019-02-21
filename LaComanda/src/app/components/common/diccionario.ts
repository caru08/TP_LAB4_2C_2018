export class Diccionario {

    static roles = {
        cliente: 'cliente',
        bartener: 'bartender',
        mozo: 'mozo',
        cervezero: 'cervezero',
        cocinero: 'cocinero',
        socio: 'socio',
        administrador: 'administrador'
    }

    static tipoProductos = {
        bebida: 'bebida',
        comida: 'comida',
        postre: 'postre'
    }

    static clienteModules = [
        {
            name: 'Hacer Pedido',
            path: '/hacer-pedido'
        },
        {
            name: "Reservar mesa",
            path: ''
        }
    ];
    static mozoModules = [
        {
            name: 'empleados',
            path: '/empleados'
        }
    ]

    static bartenderModules = [
        {
            name: 'Bebidas',
            path: '/bebidas'
        }
    ]
    static cocineroModules = [
        {
            name: 'Comida',
            path: '/comidas'
        },
        {
            name: 'Postres',
            path: '/postres'
        }
    ]
    static administradorModules = [
        {
            name: 'empleados',
            path: '/empleados'
        },
        {
            name: 'Postres',
            path: '/postres'
        }
    ]
    static socioModules = []

}