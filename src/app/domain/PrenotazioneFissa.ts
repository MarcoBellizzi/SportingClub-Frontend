import { Atleta } from "./Atleta";
import { Campo } from "./Campo";
import { FasciaOraria } from "./FasciaOraria";
import { Giorno } from "./Giorno";

export interface PrenotazioneFissa {
    id?: number,
    prenotazione?: Atleta,
    campo?: Campo,
    giorno?: number,
    fasciaOraria: FasciaOraria,
    durata?: number,
    prenotazioniDisdette?: Date[],
    prenotazioniDisdetteCustom?: Giorno[]
}