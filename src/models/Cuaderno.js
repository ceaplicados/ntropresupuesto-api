import Usuario from '../models/Usuario.js';

export default class Cuaderno{
    constructor(){
        this.Id  = null
        this.Owner  = new Usuario()
        this.DateBorn = null
        this.Nombre = null
        this.Descripcion = null
        this.Publico = false
        this.AnioINPC = null
        this.Anios = []
        this.Renglones = []
        this.Usuarios = []
        this.VersionesPresupuesto = []
        this.Datos = []
    }
}