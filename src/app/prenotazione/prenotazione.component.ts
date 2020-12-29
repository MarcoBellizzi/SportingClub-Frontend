import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Campo } from '../domain/Campo';
import { FasciaOraria } from '../domain/FasciaOraria';
import { Prenotazione } from '../domain/Prenotazione';
import { AtletaService } from '../services/atleta.service';
import { CampoService } from '../services/campo.service';
import { FasciaOrariaService } from '../services/fasciaOraria.service';
import { PrenotazioneService } from '../services/prenotazione.service';

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.scss']
})
export class PrenotazioneComponent implements OnInit {

  campi: Campo[] = [];
  fasceOrarie: FasciaOraria[] = [];
  giorno: Date = new Date();
  prenotazioni: Prenotazione[] = [];

  constructor(
    private campoService: CampoService,
    private fasciaOrariaService: FasciaOrariaService,
    private messageService: MessageService,
    private atletaService: AtletaService,
    private prenotazioneService: PrenotazioneService
  ) { }

  ngOnInit() {
    this.campoService.getCampi().subscribe(
      response => {
        this.campi = response;
      }
    );
    this.fasciaOrariaService.getFasceOrarie().subscribe(
      response => {
        this.fasceOrarie = response;
      }
    );
    this.aggiornaPrenotazioni()
  }

  aggiornaPrenotazioni() {
    this.giorno.setHours(0,0,0,0);
    this.prenotazioneService.getPrenotazioni(this.giorno).subscribe(
      response => {
        this.prenotazioni = response;
      }
    );
  }

  prenota(fasciaOraria: FasciaOraria, campo: Campo) {
    this.atletaService.getAtleta(<string>sessionStorage.getItem("user")).subscribe(
      response => {
        let prenotazione: Prenotazione = { atleta: response, campo: campo, fasciaOraria: fasciaOraria, giorno: this.giorno };
        this.prenotazioneService.save(prenotazione).subscribe(
          response => {
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione effettuata' })
          },
          err => {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'prenotazione non effettuata' });
          }
        )
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Atleta non trovato' });
      }
    );
  }

  annullaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.prenotazioneService.annullaPrenotazione(<number>fasciaOraria.id, <number>campo.id).subscribe(
      response => {},
      err => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione annullata' })
     
      }
    )
  }

  isPrenotato(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let prenotato: boolean = false;
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.fasciaOraria?.id === fasciaOraria.id && prenotazione.campo?.id === campo.id)  {
        prenotato = true;
      }
    });
    return prenotato;
  }

  tuaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let tua: boolean = false;
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.fasciaOraria?.id === fasciaOraria.id && prenotazione.campo?.id === campo.id)  {
        if(prenotazione.atleta?.username === sessionStorage.getItem("user")) {
          tua = true;
        }
      }
    });
    return tua;
  }

  refresh(): void {
    window.location.reload();
  }

}
