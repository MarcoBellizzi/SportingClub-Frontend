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

  atleta: Atleta = { nome: "", cognome: "", telefono: 0, email: "", username: "", password: "", admin: false };
  prenotazioni: Prenotazione[] = [];
  debiti: Debito[] = [];
  aggiungiDebito: boolean = false;
  debito: Debito = {
    atleta: {nome: "", cognome: "", telefono: 0, email: "", username: "", password: "", admin: false },
    importo: 0, descrizione:""
  }
  atleti: Atleta[] = [];

  constructor(
    private atletaService: AtletaService,
    private prenotazioneService: PrenotazioneService,
    private debitoService: DebitoService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.atletaService.getAtleta(<string>sessionStorage.getItem("user")).subscribe(
      response => {
        this.atleta = response;
        let giorno = new Date();
        giorno.setDate(giorno.getDate() - 1);
        this.prenotazioneService.getPrenotazioniAfter(<number>this.atleta.id, giorno).subscribe(
          data => {
            this.prenotazioni = data;
          }
        );
        if(this.atleta.admin) {
          this.debitoService.getAllDebiti().subscribe(
            data => {
              this.debiti = data;
            }
          );
        }
        else {
          this.debitoService.getDebiti(<number> this.atleta.id).subscribe(
            data => {
              this.debiti = data;
            }
          );
        }
      }
    );
  }

  isAdmin(): boolean {
    return <boolean>this.atleta.admin;
  }

  visualizzaAggiungiDebito() {
    this.atletaService.getAtleti().subscribe(
      data => {
        this.atleti = data;
      }
    );
    this.aggiungiDebito = true;
  }

  salvaDebito() {
    this.debitoService.addDebito(this.debito).subscribe(
      response => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'debito salvato' });
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'debito non salvato' });
      }
    );
  }

  salda(debito: Debito) {
    this.debitoService.salda(<number> debito.id).subscribe(
      response => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'debito non saldato' });
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service message', detail: 'debito saldato' });
      }
    );
  }

  refresh(): void {
    window.location.reload();
  }

}
