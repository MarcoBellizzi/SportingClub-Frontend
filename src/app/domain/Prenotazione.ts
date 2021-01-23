import { Atleta } from "./Atleta";
import { Campo } from "./Campo";
import { FasciaOraria } from "./FasciaOraria";

export interface Prenotazione {
    id?: number;
    atleta: Atleta;
    campo: Campo;
    fasceOrarie: FasciaOraria[];
    giorno?: Date;
    libera?: boolean;
    nome?: string;
    tipo?: string;
}