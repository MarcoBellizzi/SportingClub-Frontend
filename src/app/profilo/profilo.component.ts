import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Atleta } from '../domain/Atleta';
import { Debito } from '../domain/Debito';
import { Prenotazione } from '../domain/Prenotazione';
import { PrenotazioneFissa } from '../domain/PrenotazioneFissa';
import { AtletaService } from '../services/atleta.service';
import { DebitoService } from '../services/debito.service';
import { PrenotazioneService } from '../services/prenotazione.service';


@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss']
})
export class ProfiloComponent implements OnInit {

  atleta: Atleta = { nome: "", cognome: "", password: "", admin: false };
  prenotazioni: Prenotazione[] = [];
  prenotazioniFisse: PrenotazioneFissa[] = [];
  debiti: Debito[] = [];
  aggiungiDebito: boolean = false;
  debito: Debito = {
    atleta: { nome: "", cognome: "", password: "", admin: false },
    descrizione: ""
  }
  atleti: Atleta[] = [];
  modificaDati: boolean = false;

  constructor(
    private atletaService: AtletaService,
    private prenotazioneService: PrenotazioneService,
    private debitoService: DebitoService,
    private messageService: MessageService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Sporting Club - Profilo");
    this.atletaService.getAtleta(<string>sessionStorage.getItem("nome"), <string>sessionStorage.getItem("cognome")).subscribe(
      response => {
        this.atleta = response;
        let giorno = new Date();
        giorno.setDate(giorno.getDate() - 1);
        this.prenotazioneService.getPrenotazioniAfter(<number>this.atleta.id, giorno).subscribe(
          data => {
            this.prenotazioni = data;
          }
        );

        this.prenotazioneService.getPrenotazioniFisseByAtleta(<number>this.atleta.id).subscribe(data => {
          this.prenotazioniFisse = data;
        })
        if (this.atleta.admin) {
          this.debitoService.getAllDebiti().subscribe(
            data => {
              this.debiti = data;
            }
          );
        }
        else {
          this.debitoService.getDebiti(<number>this.atleta.id).subscribe(
            data => {
              this.debiti = data;
            }
          );
        }
      }
    );
    this.atletaService.getAtleti().subscribe(
      data => {
        this.atleti = data;
      }
    );
  }

  isAdmin(): boolean {
    return <boolean>this.atleta.admin;
  }

  visualizzaAggiungiDebito() {
    this.debito = {
      atleta: { nome: "", cognome: "", password: "", admin: false },
      descrizione: ""
    }
    this.aggiungiDebito = true;
  }

  salvaDebito() {
    this.debitoService.addDebito(this.debito).subscribe(
      response => {
        this.debitoService.getAllDebiti().subscribe(
          data => {
            this.debiti = data;
          }
        );
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'debito salvato' });
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Esito', detail: 'debito non salvato' });
      }
    );
    this.aggiungiDebito = false;
  }

  salda(debito: Debito) {
    this.debitoService.salda(<number>debito.id).subscribe(
      response => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Errore', detail: 'debito non saldato' });
      },
      err => {
        this.debitoService.getAllDebiti().subscribe(
          data => {
            this.debiti = data;
          }
        );
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'debito saldato' });
      }
    );
  }

  getInizio(prenotazione: Prenotazione): string {
    let min = 100;
    let inizio = "";
    prenotazione.fasceOrarie.forEach(fascia => {
      if (<number>fascia.id < min) {
        min = <number>fascia.id;
        inizio = <string>fascia.inizio;
      }
    });
    return inizio;
  }

  getFine(prenotazione: Prenotazione): string {
    let max = 0;
    let fine = "";
    prenotazione.fasceOrarie.forEach(fascia => {
      if (<number>fascia.id > max) {
        max = <number>fascia.id;
        fine = <string>fascia.fine;
      }
    });
    return fine;
  }

  convertiGiorno(giorno: number): string {
    if (giorno == 0) return "Domenica";
    if (giorno == 1) return "Lunedì";
    if (giorno == 2) return "Martedì";
    if (giorno == 3) return "Mercoledì";
    if (giorno == 4) return "Giovedì";
    if (giorno == 5) return "Venerdì";
    if (giorno == 6) return "Sabato";
    return "";
  }

  convertiDurata(durata: number): string {
    if (durata == 2) return "1 ora";
    if (durata == 3) return "1 ora e mezza";
    if (durata == 4) return "2 ore";
    if (durata == 5) return "2 ore e mezza";
    if (durata == 6) return "3 ore";
    return "";
  }

  modifica(): void {
    this.atletaService.update(this.atleta).subscribe(
      data => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'Dati modificati' });
        this.modificaDati = false;
        sessionStorage.setItem("nome", <string> this.atleta.nome);
        sessionStorage.setItem("cognome", <string> this.atleta.cognome)
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Esito', detail: 'Dati non modificati' });
        this.modificaDati = false;
      },
    )
  }

}
