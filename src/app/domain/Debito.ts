import { Atleta } from "./Atleta";

export interface Debito {
    id?: number;
    atleta: Atleta;
    importo?: number;
    descrizione: string;
}