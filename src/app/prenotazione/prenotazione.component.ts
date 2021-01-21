import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Atleta } from '../domain/Atleta';
import { Campo } from '../domain/Campo';
import { FasciaOraria } from '../domain/FasciaOraria';
import { Ora } from '../domain/Ora';
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
  admin: Atleta[] = [];
  visualizzaPrenotazione: boolean = false;
  visualizzaAddPrenotazione: boolean = false;
  atleta: Atleta = {nome:"", cognome:"", email:"", password:"", admin:false};
  prenotazione: Prenotazione = {
    atleta:{nome:"", cognome:"", email:"", password:"", admin:false},
    campo:{nome:""},
    fasciaOraria:{inizio:"", fine:""},
    giorno:new Date(),
    libera: false
  };
  fasceDisponibili:Ora[] = [
    {numero:2, stringa:"1 ora"}, 
    {numero:3, stringa:"1 ora e mezza"},
    {numero:4, stringa:"2 ore"}, 
    {numero:5, stringa:"2 ore e mezza"},
    {numero:6, stringa:"3 ore"}
  ];
  durataa: Ora = {} ;

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
        let prenotazione: Prenotazione = { atleta: response, campo: campo, fasciaOraria: fasciaOraria, giorno: this.giorno, libera:false };
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

  prenotazioneMultipla() {
    this.prenotazioneService.prenotazioneMultipla(this.prenotazione, <number> this.durataa.numero).subscribe(
      data => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'prenotazioni effettuate' })
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'prenotazione non effettuata' });
      }
    )
    this.giorno.setDate(this.giorno.getDate()-1);
    this.visualizzaAddPrenotazione = false;
  }

  prenotazioneLiberaMultipla() {
    this.prenotazione.atleta = this.atleta;
    this.prenotazione.libera = true;
    this.prenotazioneService.prenotazioneMultipla(this.prenotazione, <number> this.durataa.numero).subscribe(
      data => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'prenotazioni effettuate' })
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
    this.atleti.push
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
      giorno: this.giorno,
      libera: false
    };
    this.atletaService.getAdmin().subscribe(
      data => {
        this.admin = data;
      }
    );
    this.atletaService.getNotAdmin().subscribe(
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
        if(prenotazione.libera) {
          nome = <string> prenotazione.nome;
        }
        else {
          nome += prenotazione.atleta.nome + " " + prenotazione.atleta.cognome;
        }
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

  getLiberaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let libera: boolean = false;
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.fasciaOraria?.id === fasciaOraria.id && prenotazione.campo?.id === campo.id)  {
        libera = prenotazione.libera;
      }
    });
    return libera;
  }

  prenotabile(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let prenotabile: boolean = true;
    this.prenotazioni.forEach(prenotazione => {
      if(prenotazione.campo.id == campo.id && prenotazione.fasciaOraria.id == <number> fasciaOraria.id +1)
        prenotabile = false;
    })
    return prenotabile;
  }

}
