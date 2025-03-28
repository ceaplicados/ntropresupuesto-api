# ntropresupuesto-api
API de la app de #NuestroPresupuesto, disponible en **https://api.nuestropresupuesto.mx/**

## Generales
### GET /Datos
Catálogo de datos, con sus fuentes, versiones y fechas de actualizazión. 

### GET /INPC
Serie de valores anuales del Índica Nacional de Precios al Consumidor de acuerdo a los valores publicados por el INEGI, utilizado para deflactar (quitar el efecto de la inflación) las series históricas de manera que se puedan comparar correctamente los montos entre distintos años.

### GET /Estados
Catálogo de Estados con su Nombre y su código de abreviación

## Datos federales
### GET /Federal/Presupuesto
Histórico del presupuesto federal, a valores corrientes. Fuente: [Transparencia Presupuestaria](https://www.transparenciapresupuestaria.gob.mx/).

### GET /Federal/GastoFederalizado
Histórico del total del gasto federalizado agrupado en Participaciones, Aportaciones, Convenios y Subsidios. Fuente: [Transparencia Presupuestaria](https://www.transparenciapresupuestaria.gob.mx/).

## Estados
### GET /CÓDIGO-DEL-ESTADO
Versiones del presupuesto disponibles para el estado en la base de datos de #NuestroPresupuesto

### GET /CÓDIGO-DEL-ESTADO/UPs/
Listado histórico de todas las Unidades Presupuestales en el estado.

### GET /CÓDIGO-DEL-ESTADO/UPs/Presupuesto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Listado las Unidades Presupuestales con el monto de presupuesto a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/URs/
Listado histórico de todas las Unidades Responsables en el estado.

### GET /CÓDIGO-DEL-ESTADO/URs/Presupuesto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Unidad Responsable a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

## Cuadernos
### GET /Cuadernos
Listado de los cuadernos de trabajo públicos

### POST /Cuadernos
Añade un nuevo cuaderno

### GET /Cuadernos/User
Listado de los cuadernos de trabajo del usuario autenticado

### GET /Cuadernos/:IdCuaderno
Muestra el detalle del cuaderno indicado en IdCuaderno mostrando los datos a valores corrientes. En caso de ser un cuaderno privado la llamada debe ser ejecutada por el usuario Owner, o cualquiera de los Usuarios.

### PUT /Cuadernos/:IdCuaderno
Actualiza la configuración del cuaderno indicado en IdCuaderno, la llamada debe ser ejecutada por el usuario Owner, o cualquiera de los Usuarios.

## Usuarios
### POST /auth/Google
Inicia sesión del usuario utilizando una credencial JWT de Google

### GET /User
Obtiene la información del usuario que está actualmente autenticado

### PUT /User
Actualiza la información del usuario que está actualmente autenticado