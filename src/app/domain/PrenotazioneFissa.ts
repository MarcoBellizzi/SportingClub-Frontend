import { Campo } from "./Campo";
import { FasciaOraria } from "./FasciaOraria";

export interface PrenotazioneFissa {
    id?: number,
    giorno?: number,
    fasciaOraria: FasciaOraria,
    campo?: Campo,
    durata?: number,
    prenotazione?: string
}