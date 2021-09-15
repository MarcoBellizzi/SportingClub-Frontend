import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-struttura',
  templateUrl: './struttura.component.html',
  styleUrls: ['./struttura.component.css']
})
export class StrutturaComponent implements OnInit {

  immagini: any[] = [];

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Sporting Club - Struttura");

    this.immagini = [
      {
        src: "../../assets/immagini/home.jpeg",
        alt: "Home",
        title: "Home"
      },{
        src: "../../assets/immagini/areaGiochi.jpg",
        alt: "Area giochi",
        title: "AreaGiochi"
      },{
        src: "../../assets/immagini/campoCalcetto.jpg",
        alt: "Campo calcetto",
        title: "Campo calcetto"
      },{
        src: "../../assets/immagini/campoCalcetto1.jpg",
        alt: "Campo calcetto",
        title: "Campo calcetto"
      },{
        src: "../../assets/immagini/campoTennis1_1.jpg",
        alt: "Campo Tennis",
        title: "Campo Tennis"
      },{
        src: "../../assets/immagini/campoTennis1.jpg",
        alt: "Campo Tennis",
        title: "Campo Tennis"
      },{
        src: "../../assets/immagini/campoTennis2.jpg",
        alt: "Campo Tennis",
        title: "Campo Tennis"
      },{
        src: "../../assets/immagini/campoTennisCalcetto.jpg",
        alt: "Campo Tennis Calcetto",
        title: "Campo Tennis Calcetto"
      },{
        src: "../../assets/immagini/campoTennisCoperto.jpg",
        alt: "Campo Tennis Coperto",
        title: "Campo Tennis Coperto"
      },{
        src: "../../assets/immagini/campoTennisNotte.jpeg",
        alt: "Campo Tennis Notte",
        title: "Campo Tennis Notte"
      },{
        src: "../../assets/immagini/palestra1.jpeg",
        alt: "Palestra",
        title: "Palestra"
      },{
        src: "../../assets/immagini/palestra2.jpeg",
        alt: "Palestra",
        title: "Palestra"
      },{
        src: "../../assets/immagini/palestra3.jpeg",
        alt: "Palestra",
        title: "Palestra"
      },{
        src: "../../assets/immagini/parcheggio.jpg",
        alt: "Parcheggio",
        title: "Parcheggio"
      }
    ];

  }
}
