import { Atleta } from "./Atleta";
import { Campo } from "./Campo";
import { FasciaOraria } from "./FasciaOraria";

export interface Prenotazione {
    id?: number;
    atleta: Atleta;
    campo: Campo;
    fasciaOraria: FasciaOraria;
    giorno: Date;
    libera: boolean;
    nome?: string;
}