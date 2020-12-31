import { Component, OnInit } from '@angular/core';
import { Atleta } from '../domain/Atleta';
import { AtletaService } from '../services/atleta.service';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss']
})
export class ProfiloComponent implements OnInit {

  atleta: Atleta = {};

  constructor(
    private atletaService: AtletaService
  ) { }

  ngOnInit() {
    this.atletaService.getAtleta(<string> sessionStorage.getItem("user")).subscribe(
      response => {
        this.atleta = response;
      }
    )
  }

  isAdmin(): boolean {
    return <boolean> this.atleta.admin;
  }

}
