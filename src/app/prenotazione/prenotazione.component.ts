import { Component, OnInit } from '@angular/core';
import { Campo } from '../domain/Campo';
import { FasciaOraria } from '../domain/FasciaOraria';
import { CampoService } from '../services/campo.service';
import { FasciaOrariaService } from '../services/fasciaOraria.service';

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.scss']
})
export class PrenotazioneComponent implements OnInit {

  campi: Campo[] = [];
  fasceOrarie: FasciaOraria[] = [];
  giorno!: Date;

  constructor(
    private campoService: CampoService,
    private fasciaOrariaService: FasciaOrariaService
  ) { }

  ngOnInit() {
    this.campoService.getCampi().subscribe(
      response => {
        this.campi = response;
      }
    )

    this.fasciaOrariaService.getFasceOrarie().subscribe(
      response => {
        this.fasceOrarie = response;
      }
    )
  }

}
