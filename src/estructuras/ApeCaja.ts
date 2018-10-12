import { DateTime } from "ionic-angular";

export interface ApeCaja{
    IDCJ:number
    IDSU:number
    IDUS:number
    IDPV:number
    FechaApertura:DateTime
    FechaCierre:DateTime
    MontoAperturaEfectivo:number
    MontoCierreEfectivo:number
    //--------- Punto Venta
    NombrePV:string
    //--------- Usuario
    NombreUS:string
    ApellidoUS:string
    LoginUS:string
    EstadoUS:Boolean
}