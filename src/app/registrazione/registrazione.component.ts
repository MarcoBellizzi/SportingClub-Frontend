import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Atleta } from '../domain/Atleta';
import { AtletaService } from '../services/atleta.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {

  atleta: Atleta = {};

  constructor(
    private route: Router,
    private atletaService: AtletaService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  registrati() {
    this.atletaService.save(this.atleta).subscribe(
      response => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Service Message', detail: 'Utente registrato' });
      },
      any => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Registrazione utente fallita' });
      }
    )
  }

  annulla() {
    this.route.navigate(['login']);
  }

  vaiAllaHome() {
    sessionStorage.setItem("user", <string>this.atleta.username);
    this.route.navigate(['home']);
  }

}