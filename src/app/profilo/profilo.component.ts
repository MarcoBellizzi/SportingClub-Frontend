import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Atleta } from '../domain/Atleta';
import { Debito } from '../domain/Debito';
import { Prenotazione } from '../domain/Prenotazione';
import { AtletaService } from '../services/atleta.service';
import { DebitoService } from '../services/debito.service';
import { PrenotazioneService } from '../services/prenotazione.service';


@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss']
})
export class ProfiloComponent implements OnInit {

  atleta: Atleta = { nome: "", cognome: "", email: "", password: "", admin: false };
  prenotazioni: Prenotazione[] = [];
  debiti: Debito[] = [];
  aggiungiDebito: boolean = false;
  debito: Debito = {
    atleta: { nome: "", cognome: "", email: "", password: "", admin: false },
    descrizione: ""
  }
  atleti: Atleta[] = [];

  constructor(
    private atletaService: AtletaService,
    private prenotazioneService: PrenotazioneService,
    private debitoService: DebitoService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
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
      atleta: { nome: "", cognome: "", email: "", password: "", admin: false },
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

  getInizio(prenotazione: Prenotazione) : string {
    let min = 100;
    let inizio = "";
    prenotazione.fasceOrarie.forEach(fascia => {
      if(<number> fascia.id < min) {
        min = <number> fascia.id;
        inizio = <string> fascia.inizio;
      }
    });
    return inizio;
  }

  getFine(prenotazione: Prenotazione) : string {
    let max = 0;
    let fine = "";
    prenotazione.fasceOrarie.forEach(fascia => {
      if(<number> fascia.id > max) {
        max = <number> fascia.id;
        fine = <string> fascia.fine;
      }
    });
    return fine;
  }

}
