import { Component, OnInit } from '@angular/core';
import { Ambiente } from '../domain/Ambiente';
import { CampoService } from '../services/campo.service';

@Component({
  selector: 'app-struttura',
  templateUrl: './struttura.component.html',
  styleUrls: ['./struttura.component.css']
})
export class StrutturaComponent implements OnInit {

  ambienti: Ambiente[] = [];

  constructor(
    private campoService: CampoService
  ) { }

  ngOnInit() {

    this.ambienti.push({nome:"Palestra", descrizione: "Palestra interna alla struttura con attrezzi per fitness e body-building.", photo: "palestra.jpg"});
    this.ambienti.push({ nome: "Parcheggio", descrizione: "Ampio parcheggio all' entrata della struttura.", photo: "parcheggio.jpg" });
    this.campoService.getCampi().subscribe(
      campi => {
        campi.forEach(campo => {
          this.ambienti.push({ nome: campo.nome, descrizione: campo.descrizione, photo: campo.photo })
        });
      }
    );
  }

}
