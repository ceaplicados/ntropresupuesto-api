# ntropresupuesto-api
API de la app de #NuestroPresupuesto, disponible en **https://api.nuestropresupuesto.mx/**

## Generales
### /Datos
Catálogo de datos, con sus fuentes, versiones y fechas de actualizazión. 

### /INPC
Serie de valores anuales del Índica Nacional de Precios al Consumidor de acuerdo a los valores publicados por el INEGI, utilizado para deflactar (quitar el efecto de la inflación) las series históricas de manera que se puedan comparar correctamente los montos entre distintos años.

### /Estados
Catálogo de Estados con su Nombre y su código de abreviación

## Datos federales
### /Federal/Presupuesto
Histórico del presupuesto federal, a valores corrientes. Fuente: [Transparencia Presupuestaria](https://www.transparenciapresupuestaria.gob.mx/).

### /Federal/GastoFederalizado
Histórico del total del gasto federalizado agrupado en Participaciones, Aportaciones, Convenios y Subsidios. Fuente: [Transparencia Presupuestaria](https://www.transparenciapresupuestaria.gob.mx/).

## Estados
### /CÓDIGO-DEL-ESTADO
Versiones del presupuesto disponibles para el estado en la base de datos de #NuestroPresupuesto

### /CÓDIGO-DEL-ESTADO/UPs/
Listado histórico de todas las Unidades Presupuestales en el estado.

### /CÓDIGO-DEL-ESTADO/URs/
Listado histórico de todas las Unidades Responsables en el estado.

### /CÓDIGO-DEL-ESTADO/URs/Presupuesto?{v=VERSION_DEL_PRESUPUESTO,a=AÑO_DEL_PRESUPUESTO}
Presupuesto agrupado por Unidad Responsable a pesos corrientes, por default arroja la última versión disponible. Se puede especificar el año deseado (a) o la versión del presupuesto (v) como variables de la URL.

## Cuadernos
### /Cuadernos
Listado de los cuadernos de trabajo públicos

### /Cuadernos/User
Listado de los cuadernos de trabajo del usuario autenticado
