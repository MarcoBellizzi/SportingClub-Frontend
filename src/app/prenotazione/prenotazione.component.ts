import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Atleta } from '../domain/Atleta';
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
  atleti: Atleta[] = [];
  visualizzaPrenotazione: boolean = false;
  visualizzaAddPrenotazione: boolean = false;
  atleta: Atleta = {nome:"", cognome:"", email:"", password:"", admin:false};
  prenotazione: Prenotazione = {
    atleta:{nome:"", cognome:"", email:"", password:"", admin:false},
    campo:{nome:""},
    fasciaOraria:{inizio:"", fine:""},
    giorno:new Date()
  };

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
    this.atletaService.getAtleta(<string> sessionStorage.getItem("nome"), <string> sessionStorage.getItem("cognome")).subscribe(
      response => {
        this.atleta = response;
      }
    );
    this.aggiornaPrenotazioni();
  }

  aggiornaPrenotazioni() {
    this.giorno.setHours(0,0,0,0);  // importante
    this.giorno.setDate(this.giorno.getDate()+1);  // perchè il back end lo legge uno in meno
    this.prenotazioneService.getPrenotazioni(this.giorno).subscribe(
      response => {
        this.prenotazioni = response;
      }
    );
    this.giorno.setDate(this.giorno.getDate()-1);  // ripristino perchè non chiamo il refresh
  }

  prenota(fasciaOraria: FasciaOraria, campo: Campo) {
    this.atletaService.getAtleta(<string>sessionStorage.getItem("nome"), <string> sessionStorage.getItem("cognome")).subscribe(
      response => {
        this.giorno.setDate(this.giorno.getDate()+1); 
        let prenotazione: Prenotazione = { atleta: response, campo: campo, fasciaOraria: fasciaOraria, giorno: this.giorno };
        this.prenotazioneService.save(prenotazione).subscribe(
          response => {
            this.aggiornaPrenotazioni();
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'prenotazione effettuata' })
          },
          err => {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'prenotazione non effettuata' });
          }
        )
        this.giorno.setDate(this.giorno.getDate()-1);
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Atleta non trovato' });
      }
    );
  }

  aggiungiPrenotazione() {
    this.prenotazioneService.save(this.prenotazione).subscribe(
      response => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione effettuata' })
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'prenotazione non effettuata' });
      }
    )
    this.giorno.setDate(this.giorno.getDate()-1);
    this.visualizzaAddPrenotazione = false;
  }

  annullaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.giorno.setDate(this.giorno.getDate()+1); 
    this.prenotazioneService.annullaPrenotazione(<number>fasciaOraria.id, <number>campo.id, this.giorno).subscribe(
      response => {},
      err => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione annullata' })
      }
    )
    this.giorno.setDate(this.giorno.getDate()-1); 
    
  }

  eliminaPrenotazione() {
    this.giorno.setDate(this.giorno.getDate()+1); 
    this.prenotazioneService.annullaPrenotazione(<number>this.prenotazione.fasciaOraria.id, <number>this.prenotazione.campo.id, this.giorno).subscribe(
      response => {},
      err => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione annullata' });
      }
    )
    this.giorno.setDate(this.giorno.getDate()-1);
    this.visualizzaPrenotazione = false;
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
        if(prenotazione.atleta?.nome === sessionStorage.getItem("nome") && 
            prenotazione.atleta?.cognome === sessionStorage.getItem("cognome")) {
          tua = true;
        }
      }
    });
    return tua;
  }

  isAdmin(): boolean {
    return <boolean> this.atleta.admin;
  }

  showPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.fasciaOraria?.id === fasciaOraria.id && prenotazione.campo?.id === campo.id)  {
        this.prenotazione = prenotazione;
      }
    });
    this.visualizzaPrenotazione = true;
  }

  showAddPrenotazione(fasciaOraria:FasciaOraria, campo: Campo) {
    this.giorno.setDate(this.giorno.getDate()+1);
    this.prenotazione = {
      atleta:{nome:"", cognome:"", email:"", password:"", admin:false},
      campo: campo,
      fasciaOraria: fasciaOraria,
      giorno: this.giorno
    };
    this.atletaService.getAtleti().subscribe(
      data => {
        this.atleti = data;
      }
    );
    this.visualizzaAddPrenotazione = true;
  }

  getNomePrenotazione(fasciaOraria: FasciaOraria, campo: Campo): string{
    let nome:string = "";
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.fasciaOraria?.id === fasciaOraria.id && prenotazione.campo?.id === campo.id)  {
        nome += prenotazione.atleta.nome + " " + prenotazione.atleta.cognome;
      }
    });
    return nome;
  }

  getAdminPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let admin: boolean = false;
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.fasciaOraria?.id === fasciaOraria.id && prenotazione.campo?.id === campo.id)  {
        admin = prenotazione.atleta.admin;
      }
    });
    return admin;
  }

}
