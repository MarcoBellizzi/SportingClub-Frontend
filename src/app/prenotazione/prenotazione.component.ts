import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Atleta } from '../domain/Atleta';
import { Campo } from '../domain/Campo';
import { FasciaOraria } from '../domain/FasciaOraria';
import { Ora } from '../domain/Ora';
import { Prenotazione } from '../domain/Prenotazione';
import { PrenotazioneFissa } from '../domain/PrenotazioneFissa';
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
  atleta: Atleta = {};
  prenotazione: Prenotazione = { atleta: {}, campo: {}, fasceOrarie: [] };
  durataa: Ora = {};
  nuovaPrenotazioneFissa: PrenotazioneFissa = { fasciaOraria: {} };

  campi: Campo[] = [];
  fasceOrarie: FasciaOraria[] = [];
  prenotazioni: Prenotazione[] = [];
  tuttiAtleti: Atleta[] = [];
  atleti: Atleta[] = [];
  admin: Atleta[] = [];
  prenotazioniFisse: PrenotazioneFissa[] = [];
  fasceDisponibili: Ora[] = [
    { numero: 2, stringa: "1 ora" },
    { numero: 3, stringa: "1 ora e mezza" },
    { numero: 4, stringa: "2 ore" },
    { numero: 5, stringa: "2 ore e mezza" },
    { numero: 6, stringa: "3 ore" }
  ];
  tipi: any[] = [
    { tipo: "Tennis" },
    { tipo: "Calcio" }
  ];
  giorniDellaSettimana: any[] = [
    { nome: "Domenica", valore: 0 },
    { nome: "Lunedì", valore: 1 },
    { nome: "Martedì", valore: 2 },
    { nome: "Mercoledì", valore: 3 },
    { nome: "Giovedì", valore: 4 },
    { nome: "Venerdì", valore: 5 },
    { nome: "Sabato", valore: 6 },
  ];

  nameSelected: boolean = false;
  oreSelected: boolean = false;
  selected: boolean = false;

  visualizzaPrenotazione: boolean = false;
  visualizzaAddPrenotazione: boolean = false;
  visualizzaNuovaPrenotazioneFissa: boolean = false;
  visualizzaBanner: boolean = true;
  visualizzaPrenotazioniFisse: boolean = false;
  visualizzaPrenotazioneFissa: boolean = false;


  constructor(
    private campoService: CampoService,
    private fasciaOrariaService: FasciaOrariaService,
    private messageService: MessageService,
    private atletaService: AtletaService,
    private prenotazioneService: PrenotazioneService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Sporting Club - Prenotazione")
    this.atletaService.getAtleta(<string>sessionStorage.getItem("nome"), <string>sessionStorage.getItem("cognome")).subscribe(
      response => {
        this.atleta = response;
      }
    );
    this.campoService.getCampi().subscribe(data => {
      this.campi = data;
    });
    this.fasciaOrariaService.getFasceOrarie().subscribe(data => {
      this.fasceOrarie = data;
    });
    this.atletaService.getAtleti().subscribe(data => {
      this.tuttiAtleti = data;
    })
    this.atletaService.getAdmin().subscribe(data => {
      this.admin = data;
    });
    this.atletaService.getNotAdmin().subscribe(data => {
      this.atleti = data;
    });
    this.aggiornaPrenotazioni();
    this.aggiornaPrenotazioniFisse();
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

  aggiornaPrenotazioniFisse() {
    this.prenotazioneService.getPrenotazioniFissa().subscribe(
      data => {
        this.prenotazioniFisse = data;
      }
    )
  }

  reset() {
    this.nameSelected = false;
    this.oreSelected = false;
    this.selected = false;
    this.durataa = {};
  }

  showAddPrenotazione(fasciaOraria: FasciaOraria, campo: Campo) {
    this.reset();

    // disabilita le fascia orarie non disponibili
    let finito: boolean = false;
    let occupato: boolean = false;
    for (let i = 1; i < 6; i++) {
      this.prenotazioni.forEach(prenotazione => {
        if (prenotazione.campo.id == campo.id) {
          prenotazione.fasceOrarie.forEach(fascia => {
            if (fascia.id == <number>fasciaOraria?.id + i) {
              occupato = true;
            }
          });
        }
      });
      this.prenotazioniFisse.forEach(prenotazione => {
        console.log(fasciaOraria.id + " " + prenotazione.fasciaOraria.id + " " + prenotazione.durata);
        if ((<Campo>prenotazione.campo).id === campo.id && prenotazione.giorno === this.giorno.getDay()) {
          if (<number>fasciaOraria.id + i >= <number>prenotazione.fasciaOraria.id &&
            <number>fasciaOraria.id + i < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {
            var disdetta: boolean = false;
            prenotazione.prenotazioniDisdetteCustom?.forEach(giorno => {
              if (giorno.giorno == this.giorno.getDate() && giorno.mese == this.giorno.getMonth() + 1 && giorno.anno == this.giorno.getFullYear()) {
                disdetta = true;
              }
            });
            if (!disdetta) {
              occupato = true;
            }
          }
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
    let desiderata: Prenotazione = { atleta: { admin: true }, campo: {}, fasceOrarie: [], libera: true };
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
    if (this.giorno.getDate() == new Date().getDate() && this.giorno.getMonth() == new Date().getMonth()) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Esito', detail: 'Non puoi annullare la prenotazione il giorno stesso. Si può annullare la prenotazione entro il giorno prima.' })
    }
    else {
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

  salvaPrenotazioneFissa() {
    this.prenotazioneService.addPrenotazioneFissa(this.nuovaPrenotazioneFissa).subscribe(
      response => {
        this.aggiornaPrenotazioniFisse();
        this.visualizzaNuovaPrenotazioneFissa = false;
        this.visualizzaPrenotazioniFisse = true;
        this.nuovaPrenotazioneFissa = { fasciaOraria: {} };
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'Prenotazione Fissa salvata' });
      }, error => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Service Message', detail: 'Prenotazione Fissa non salvata' });
      }
    )
  }

  eliminaPrenotazioneFissa(prenotazione: PrenotazioneFissa) {
    this.prenotazioneService.eliminaPrenotazioneFissa(<number>prenotazione.id).subscribe(
      response => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Service Message', detail: 'Prenotazione fissa non eliminata' });
      }, any => {
        this.aggiornaPrenotazioniFisse();
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'Prenotazione Fissa eliminata' });
      }
    )
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

  getColor(id: number) {
    if ((id - 1) % 4 < 2) return "white";
    return "#DBFCBF";
  }

  prenotatoDaPrenotazioneFissa(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    var condizione = false;
    var disdetta = false;
    this.prenotazioniFisse.forEach(prenotazione => {
      if ((<Campo>prenotazione.campo).id === campo.id && prenotazione.giorno === this.giorno.getDay()) {
        if (<number>fasciaOraria.id >= <number>prenotazione.fasciaOraria.id &&
          <number>fasciaOraria.id < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {
          condizione = true;

          prenotazione.prenotazioniDisdetteCustom?.forEach(giorno => {
            if (giorno.giorno == this.giorno.getDate() && giorno.mese == this.giorno.getMonth() + 1 && giorno.anno == this.giorno.getFullYear()) {
              disdetta = true;
            }
          });
        }
      }
    });
    return condizione && !disdetta;
  }

  // copia del metodo di sopra con l aggiunta del controllo sull atleta
  tuaPrenotazioneFissa(fasciaOraria: FasciaOraria, campo: Campo): boolean {
    var condizione = false;
    this.prenotazioniFisse.forEach(prenotazione => {
      if ((<Campo>prenotazione.campo).id === campo.id && prenotazione.giorno === this.giorno.getDay()) {
        if (<number>fasciaOraria.id >= <number>prenotazione.fasciaOraria.id &&
          <number>fasciaOraria.id < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {

          if (prenotazione.prenotazione?.id == this.atleta.id) {
            condizione = true;
          }

        }
      }
    })
    return condizione;
  }

  getNomePrenotazioneFissa(fasciaOraria: FasciaOraria, campo: Campo): string {
    let nome: string = "";
    this.prenotazioniFisse.forEach(prenotazione => {
      if ((<Campo>prenotazione.campo).id === campo.id && prenotazione.giorno === this.giorno.getDay()) {
        if (<number>fasciaOraria.id >= <number>prenotazione.fasciaOraria.id &&
          <number>fasciaOraria.id < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {
            if (prenotazione.prenotazione) {
              nome = <string>prenotazione.prenotazione?.username;
            } else {
              if (prenotazione.dettagli) {
                nome = prenotazione.dettagli;
              } else {
                nome = "Prenotato"
              }
            }
        }
      }
    });
    return nome;
  }

  showSingolaPrenotazioneFissa(fasciaOraria: FasciaOraria, campo: Campo) {
    this.prenotazioniFisse.forEach(prenotazione => {
      if ((<Campo>prenotazione.campo).id === campo.id && prenotazione.giorno === this.giorno.getDay()) {
        if (<number>fasciaOraria.id >= <number>prenotazione.fasciaOraria.id &&
          <number>fasciaOraria.id < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {
          this.prenotazione = {
            atleta: <Atleta>prenotazione.prenotazione,
            campo: <Campo>prenotazione.campo,
            fasceOrarie: [fasciaOraria],
          };
        }
      }
    });
    this.visualizzaPrenotazioneFissa = true;
  }

  eliminaSingolaPrenotazioneFissa() {
    this.prenotazioniFisse.forEach(prenotazione => {
      if ((<Campo>prenotazione.campo).id === this.prenotazione.campo.id && prenotazione.giorno === this.giorno.getDay()) {
        if (<number>this.prenotazione.fasceOrarie[0].id >= <number>prenotazione.fasciaOraria.id &&
          <number>this.prenotazione.fasceOrarie[0].id < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {
          this.giorno.setDate(this.giorno.getDate() + 1);
          this.prenotazioneService.aggiungiPrenotazioneDisdetta(<number>prenotazione.id, this.giorno).subscribe(data => {
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'Prenotazione disdetta con successo' });
            this.aggiornaPrenotazioniFisse();
          }, error => {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Service Message', detail: 'Prenotazione non eliminata' });
          })
          this.giorno.setDate(this.giorno.getDate() - 1);
        }
      }
    });
    this.visualizzaPrenotazioneFissa = false;
  }

  eliminaSingolaPrenotazioneFissaNoAdmin(fasciaOraria: FasciaOraria, campo: Campo) {
    if (this.giorno.getDate() == new Date().getDate() && this.giorno.getMonth() == new Date().getMonth()) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Esito', detail: 'Non puoi annullare la prenotazione il giorno stesso. Si può annullare la prenotazione entro il giorno prima.' })
    }
    else {
      this.prenotazioniFisse.forEach(prenotazione => {
        if ((<Campo>prenotazione.campo).id === campo.id && prenotazione.giorno === this.giorno.getDay()) {
          if (<number>fasciaOraria.id >= <number>prenotazione.fasciaOraria.id &&
            <number>fasciaOraria.id < (<number>prenotazione.fasciaOraria.id + <number>prenotazione.durata)) {
            this.giorno.setDate(this.giorno.getDate() + 1);
            this.prenotazioneService.aggiungiPrenotazioneDisdetta(<number>prenotazione.id, this.giorno).subscribe(data => {
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'Prenotazione disdetta con successo' });
              this.aggiornaPrenotazioniFisse();
            }, error => {
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Service Message', detail: 'Prenotazione non eliminata' });
            })
            this.giorno.setDate(this.giorno.getDate() - 1);
          }
        }
      })
    }
  }


}
