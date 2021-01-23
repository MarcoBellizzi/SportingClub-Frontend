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

  giorno: Date = new Date();

  campi: Campo[] = [];
  fasceOrarie: FasciaOraria[] = [];

  atleta: Atleta = {};
  prenotazione: Prenotazione = { atleta: {}, campo: {}, fasceOrarie: [] };
  durataa: Ora = {};

  prenotazioni: Prenotazione[] = [];
  atleti: Atleta[] = [];
  admin: Atleta[] = [];

  visualizzaPrenotazione: boolean = false;
  visualizzaAddPrenotazione: boolean = false;

  fasceDisponibili: Ora[] = [
    { numero: 2, stringa: "1 ora" },
    { numero: 3, stringa: "1 ora e mezza" },
    { numero: 4, stringa: "2 ore" },
    { numero: 5, stringa: "2 ore e mezza" },
    { numero: 6, stringa: "3 ore" }
  ];

  nameSelected: boolean = false;
  oreSelected: boolean = false;
  selected: boolean = false;

  tipi: any[] = [{ tipo: "Tennis" }, { tipo: "Calcio" }];

  constructor(
    private campoService: CampoService,
    private fasciaOrariaService: FasciaOrariaService,
    private messageService: MessageService,
    private atletaService: AtletaService,
    private prenotazioneService: PrenotazioneService
  ) { }

  ngOnInit() {
    this.atletaService.getAtleta(<string>sessionStorage.getItem("nome"), <string>sessionStorage.getItem("cognome")).subscribe(
      response => {
        this.atleta = response;
      }
    );
    this.campoService.getCampi().subscribe(data => {
      this.campi = data;
    }
    );
    this.fasciaOrariaService.getFasceOrarie().subscribe(data => {
      this.fasceOrarie = data;
    });
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
    this.aggiornaPrenotazioni();
  }

  aggiornaPrenotazioni() {
    this.giorno.setHours(0, 0, 0, 0);  // importante
    this.giorno.setDate(this.giorno.getDate() + 1);  // perchè il back end lo legge uno in meno
    this.prenotazioneService.getPrenotazioni(this.giorno).subscribe(
      response => {
        this.prenotazioni = response;
      }
    );
    this.giorno.setDate(this.giorno.getDate() - 1);  // ripristino perchè non chiamo il refresh
  }

  reset() {
    this.nameSelected = false;
    this.oreSelected = false;
    this.selected = false;
    this.durataa = {};
  } 

  showAddPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.reset();
    let finito: boolean = false;
    for (let i = 1; i < 6; i++) {
      this.prenotazioni.forEach(prenotazione => {
        if (prenotazione.campo.id == campo.id) {
          let occupato: boolean = false;
          prenotazione.fasceOrarie?.forEach(fascia => {
            if (fascia.id == <number>fasciaOraria?.id + i) {
              occupato = true;
            }
          });
          if (occupato || <number>fasciaOraria?.id + i > 32) {
            this.fasceDisponibili[i - 1].disabled = true;
            finito = true;
          }
          else {
            this.fasceDisponibili[i - 1].disabled = finito;
          }
        }
      });
    }

    this.prenotazione = {
      atleta: {},
      campo: campo,
      fasceOrarie: [fasciaOraria],
      giorno: this.giorno
    };

    if (!this.atleta.admin) {
      this.prenotazione.atleta = this.atleta;
    }

    this.visualizzaAddPrenotazione = true;
  }

  prenota() {
    let id = <number>this.prenotazione.fasceOrarie[0].id;
    for (let i = 1; i < <number>this.durataa.numero; i++) {
      this.prenotazione.fasceOrarie.push({ id: id + i });
    }

    this.giorno.setDate(this.giorno.getDate() + 1);
    this.prenotazioneService.save(this.prenotazione).subscribe(
      data => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Esito', detail: 'prenotazioni effettuate' })
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'prenotazione non effettuata' });
      }
    )
    this.giorno.setDate(this.giorno.getDate() - 1);
    this.visualizzaAddPrenotazione = false;
  }

  prenotaLibera() {
    this.prenotazione.atleta = this.atleta;
    this.prenotazione.libera = true;
    this.prenota();
  }

  getPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): Prenotazione {
    let desiderata: Prenotazione = { atleta: {}, campo: {}, fasceOrarie: [] };
    this.prenotazioni.forEach(prenotazione => {
      if (prenotazione.campo.id == campo.id) {
        prenotazione.fasceOrarie?.forEach(fascia => {
          if (fascia.id == fasciaOraria.id) {
            desiderata = prenotazione;
          }
        });
      }
    });
    return desiderata;
  }

  annullaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.giorno.setDate(this.giorno.getDate() + 1);
    this.prenotazioneService.annullaPrenotazione(<number>this.getPrenotazione(fasciaOraria, campo).id).subscribe(
      data => {

      },
      niente => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione annullata' })
      }
    )
    this.giorno.setDate(this.giorno.getDate() - 1);

  }

  eliminaPrenotazione() {
    this.giorno.setDate(this.giorno.getDate() + 1);
    this.prenotazioneService.annullaPrenotazione(<number>this.prenotazione.id).subscribe(
      response => { },
      err => {
        this.aggiornaPrenotazioni();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'prenotazione annullata' });
      }
    )
    this.giorno.setDate(this.giorno.getDate() - 1);
    this.visualizzaPrenotazione = false;
  }

  isPrenotato(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let prenotato: boolean = false;
    this.prenotazioni.forEach(prenotazione => {
      if (prenotazione.campo.id == campo.id) {
        prenotazione.fasceOrarie?.forEach(fascia => {
          if (fascia.id == fasciaOraria.id) {
            prenotato = true;
          }
        });
      }
    });
    return prenotato;
  }

  tuaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let prenotazione = this.getPrenotazione(fasciaOraria, campo);
    return prenotazione.atleta.nome == this.atleta.nome && prenotazione.atleta?.cognome == this.atleta.cognome;
  }

  showPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.prenotazione = this.getPrenotazione(fasciaOraria, campo);
    this.visualizzaPrenotazione = true;
  }

  getNomePrenotazione(fasciaOraria: FasciaOraria, campo: Campo): string {
    let nome: string = "";
    let prenotazione = this.getPrenotazione(fasciaOraria, campo);
    if (prenotazione.libera) {
      nome = <string>prenotazione.nome;
    }
    else {
      nome += prenotazione.atleta.nome + " " + prenotazione.atleta.cognome;
    }
    return nome;
  }

  getAdminPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    return <boolean>this.getPrenotazione(fasciaOraria, campo).atleta.admin;
  }

  getLiberaPrenotazione(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    return <boolean>this.getPrenotazione(fasciaOraria, campo).libera;
  }

  prenotabile(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    let prenotabile: boolean = true;
    this.prenotazioni.forEach(prenotazione => {
      if (prenotazione.campo.id == campo.id) {
        prenotazione.fasceOrarie?.forEach(fascia => {
          if (fascia.id == <number>fasciaOraria.id + 1) {
            prenotabile = false;
          }
        });
      }
    });
    return prenotabile;
  }

  selectName() {
    this.nameSelected = true;
    this.selected = this.oreSelected;
  }

  selectOra() {
    this.oreSelected = true;
    this.selected = this.nameSelected;
  }

}
