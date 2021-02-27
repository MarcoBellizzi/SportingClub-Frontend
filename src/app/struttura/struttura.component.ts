import { Component, OnInit } from '@angular/core';
import { Ambiente } from '../domain/Ambiente';
import { CampoService } from '../services/campo.service';

@Component({
  selector: 'app-struttura',
  templateUrl: './struttura.component.html',
  styleUrls: ['./struttura.component.css']
})
export class StrutturaComponent implements OnInit {

  ambienti: Ambiente[] = [{
      nome: "Campo da Tennis in terra rossa 1",
      descrizione: "Campo da tennis in terra rossa centrale",
      photo: "campoTennis1-1.jpg"
    },{
      nome:"Campo da Tennis in terra rossa 1",
      descrizione: "Campo da tennis in terra rossa centrale",
      photo: "campoTennis1.jpg"
    },{
      nome: "Campo da Tennis in terra rossa 2", 
      descrizione: "Campo da tennis in terra rossa laterale", 
      photo: "campoTennis2.jpg"
    },{
      nome:"Campo da Tennis coperto",
      descrizione: "Campo da tennis coperto ideale per le giornate piovose o ventose",
      photo: "campoTennisCoperto.jpg"
    },{
      nome: "Campo da Tennis e Calcetto",
      descrizione: "Campo da tennis e da calcetto in erba sitetica. Si può usare sia per giocare a tennis che a calcetto",
      photo: "campoTennisCalcetto.jpg"
    },{
      nome:"Campo da Calcetto",
      descrizione: "Campo da Calcetto grande, ideale per giocare 5 contro 5",
      photo: "campoCalcetto1.jpg"
    },{
      nome:"Campo da Calcetto",
      descrizione: "Campo da Calcetto grande, ideale per giocare 5 contro 5",
      photo: "campoCalcetto.jpg"
    },{
      nome:"Area giochi",
      descrizione: "Un'area all'aperto dedicata a giochi e attività ricreative",
      photo: "areaGiochi.jpg"
    },{
      nome: "Parcheggio",
      descrizione: "Ampio parcheggio all' entrata della struttura.",
      photo: "parcheggio.jpg"
    },{
      nome:"Palestra",
      descrizione: "Palestra interna alla struttura con attrezzi per fitness e body-building.",
      photo: "palestra.jpg"
    }
  ];

  constructor() { }

  ngOnInit() {

  }

}
