import { Atleta } from "./Atleta";
import { Campo } from "./Campo";
import { FasciaOraria } from "./FasciaOraria";

export class Prenotazione {
    id?: number;
    atleta?: Atleta;
    campo?: Campo;
    fasciaOraria?: FasciaOraria;
    giorno?: Date;
}