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

### GET /CÓDIGO-DEL-ESTADO/Historico
Presupuesto histórico a pesos corrientes para el estado señalado para las versiones marcadas como actuales de cada año.

### GET /CÓDIGO-DEL-ESTADO/UPs/
Listado histórico de todas las Unidades Presupuestales en el estado.

### GET /CÓDIGO-DEL-ESTADO/UPs/Presupuesto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Listado las Unidades Presupuestales con el monto de presupuesto a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/UPs/Presupuesto?/:ClaveUnidadPresupuestal{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Versión del Presupuesto a pesos corrientes para la Unidad Presupuestal definida en :ClaveUnidadPresupuestal, por default arroja la última versión disponible. Se puedes especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/UPs/Presupuesto/:ClaveUnidadPresupuestal/:Filtro?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto a pesos corrientes de la Unidad Presupuestal definida en :ClaveUnidadPresupuestal para el filtro especificado, el cual puede ser la clave de un Objeto de Gasto, Partida Genérica, Concepto General o de un Capítulo de Gasto, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/URs?{q=BÚSQUEDA}
Listado histórico de todas las Unidades Responsables en el estado. Se puede especificar un término de búsqueda como variable (q) de la URL.

### GET /CÓDIGO-DEL-ESTADO/URs/Presupuesto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Unidad Responsable a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/URs/Presupuesto/:ClaveUnidadResponsable?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Versión de Presupuesto a pesos corrientes para la Unidad Responsable definida en :ClaveUnidadResponsable, por default arroja la última versión disponible. Se puedes especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/URs/Presupuesto/:ClaveUnidadResponsable/:Filtro?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto a pesos corrientes agrupado por Versión de Presupuesto de la Unidad Responsable definida en :ClaveUnidadResponsable para el filtro especificado, el cual puede ser la clave de un Objeto de Gasto, Partida Genérica, Concepto General o de un Capítulo de Gasto, por default arroja la última versión disponible. Se pueden especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/URs/Programas/:ClaveUnidadResponsable?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Listado de Programas Presupuestales con su presupuesto asignado a pesos corrientes para la Unidad Responsable definida en :ClaveUnidadResponsable.  Por default arroja la última versión disponible. Se puedes especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.


### GET /CÓDIGO-DEL-ESTADO/CapituloGasto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Capítulo de Gasto a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/CapituloGasto/:ClaveCapituloGasto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Versiones de Presupuesto a pesos corrientes para el Capítulo de Gasto especificado, por default arroja la última versión disponible. Se puede especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/ConceptosGenerales?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Conceptos Generales a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/ConceptosGenerales/:Filtro?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Conceptos Generales y Versiones de Presupuesto a pesos corrientes para el filtro especificado, el cual puede ser la clave de un Concepto General o de un Capítulo de Gasto, por default arroja la última versión disponible. Se puede especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/PartidasGenericas?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por PartidasGenericas a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/PartidasGenericas/:Filtro?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Partidas Genéricas y Versiones de Presupuesto a pesos corrientes para el filtro especificado, el cual puede ser la clave de una Partida Genérica, Concepto General o de un Capítulo de Gasto, por default arroja la última versión disponible. Se puede especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/ObjetoDeGasto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/ObjetoDeGasto/:Filtro?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Objetos de Gasto y Versiones de Presupuesto a pesos corrientes para el filtro especificado, el cual puede ser la clave de un Objeto de Gasto, Partida Genérica, Concepto General o de un Capítulo de Gasto, por default arroja la última versión disponible. Se puede especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/Programas?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO,q=CANTIDAD}
Listado de los top (q) programas presupuestarios a pesos corrientes ordenados descendentemente por el monto asignado, por default q=25.  En caso de que q=0 se muestra el listado completo de programas presupuestarios. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/Programas?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO,b=BUSCAR}
Listado de los programas presupuestarios a pesos corrientes coincidentes con el término de búsqueda (b) ordenados por el monto clave. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/Programas/:ClavePrograma?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO,b=BUSCAR}
Presupuestos para el Programa Presupuestal especificado en :ClavePrograma a pesos corrientes.  Por default arroja la última versión disponible. Se puede especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

### GET /CÓDIGO-DEL-ESTADO/Indicadores/:ClavePrograma
Arroja los indicadores registrados para el Programa Presupuestal especificado en :ClavePrograma.

### GET /CÓDIGO-DEL-ESTADO/Programas/:ClavePrograma?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO,b=BUSCAR}
Presupuestos para el Programa Presupuestal especificado en :ClavePrograma a pesos corrientes.  Por default arroja la última versión disponible. Se puede especificar los años deseados (a) o las versiones del presupuesto (v) separados por comas como variables de la URL.

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

### GET /auth/refresh
Obtiene un nuevo access token para el usuario autentificado

### GET /auth/logout
Cierra la sesión de un usuario

### GET /User
Obtiene la información del usuario que está actualmente autenticado

### PUT /User
Actualiza la información del usuario que está actualmente autenticado