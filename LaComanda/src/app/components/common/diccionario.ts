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
        postre: 'postre',
        cerveza: 'cerveza'
    }

    static estadosUsuarios = {
        activo: 'activo',
        suspendido: 'suspendido'
    }

    static labeldEstadosUsuarios = {
        activo: 'Activo',
        suspendido: 'Suspendido'
    }

    static estadoProductos = {
        pedido: 'pedido',
        enPreparacion: 'enPreparacion',
        listo: 'listo'
    }

    static estadoPedidos = {
        enPreparacion: 'enPreparacion',
        listo: 'listo',
        cuentaSolicitada: 'cuentaSolicitada',
        entregado: 'entregado',
        cerrado: 'cerrado',
        cancelado: 'cancelado'
    }

    static estadoMesas = {
        libre: 'libre',
        esperandoPedido: 'esperandoPedido',
        clienteComiendo: 'clienteComiendo',
        clientePagando: 'clientePagando'
    }

    static labelsEstadosMesas = {
        libre: 'Libre',
        esperandoPedido: 'Cliente esperando pedido',
        clienteComiendo: 'Cliente comiendo',
        clientePagando: 'Cliente Pagando'        
    }

    static clienteModules = [
        {
            name: 'Menu',
            path: '/menu'
        },
        {
            name: "Mis Pedidos",
            path: '/mis-pedidos'
        }
    ];
    
    static mozoModules = [
        {
            name: 'Hacer Pedido',
            path: '/hacer-pedido'
        },
        {
            name: 'Pedidos',
            path: '/pedidos'
        },
        {
            name: 'Mesas',
            path: '/mesas'
        },
    ]

    static bartenderModules = [
        {
            name: 'Bebidas',
            path: '/bebidas'
        },
        {
            name: 'Pedidos',
            path: '/pedidos'
        }
    ];
    static cerveceroModules = [
        {
            name: 'Cervezas',
            path: '/cervezas'
        },
        {
            name: 'Pedidos',
            path: '/pedidos'
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
        },
        {
            name: 'Pedidos',
            path: '/pedidos'
        }
    ]
    static administradorModules = [
        {
            name: 'Empleados',
            path: '/empleados'
        },
        {
            name: 'Reportes',
            path: '/reportes'
        }
    ]
    static socioModules = [
        {
            name: 'Empleados',
            path: '/empleados'
        },
        {
            name: 'Pedidos',
            path: '/pedidos'
        },   
    ]

}