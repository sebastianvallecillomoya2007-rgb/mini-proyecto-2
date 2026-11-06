# Diagrama entidad-relación

El modelo mantiene `Usuario` independiente del dominio bancario. Las relaciones de las cuentas con clientes, tipos y sucursales son de muchos a uno; cada cuenta puede tener varias transacciones.

```mermaid
erDiagram
    CLIENTES ||--o{ CUENTAS : posee
    TIPOS_CUENTA ||--o{ CUENTAS : clasifica
    SUCURSALES ||--o{ CUENTAS : administra
    CUENTAS ||--o{ TRANSACCIONES : registra

    CLIENTES {
        int id_cliente PK
        string nombre
        string apellido
        string correo UK
        string telefono
        string direccion
        datetime fecha_registro
    }

    TIPOS_CUENTA {
        int id_tipo_cuenta PK
        string nombre UK
        text descripcion
    }

    SUCURSALES {
        int id_sucursal PK
        string nombre UK
        string direccion
        string ciudad
    }

    CUENTAS {
        int id_cuenta PK
        int id_cliente FK
        int id_tipo_cuenta FK
        int id_sucursal FK
        decimal saldo
        datetime fecha_apertura
        string estado
    }

    TRANSACCIONES {
        int id_transaccion PK
        int id_cuenta FK
        string tipo_transaccion
        decimal monto
        datetime fecha
        string descripcion
    }

    USUARIOS {
        int id_usuario PK
        string nombre
        string correo UK
        string password_hash
        datetime fecha_creacion
    }
```

`usuarios.password` se almacena como hash bcrypt; el nombre `password_hash` del diagrama expresa que el valor persistido no es texto plano.
