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

    static clienteModules = [
        {
            name: 'Hacer Pedido',
            path: ''
        },
        {
            name: "Reservar mesa",
            path: ''
        }
    ];
    static mozoModules = [
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
        }
    ]
    static socioModules = []
    static administradorModules = []
}