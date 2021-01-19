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

  atleta: Atleta = {id:0, nome:"", cognome:"", email:"", password:"", admin:false};

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
        this.messageService.add({ sticky: true, key: 'tc', severity: 'success', summary: 'Utente registrato', detail: 'Benvenuto allo Sporting Club!' });
      },
      any => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Esito', detail: 'Registrazione utente fallita' });
      }
    )
  }

  annulla() {
    this.route.navigate(['login']);
  }

  vaiAllaHome() {
    sessionStorage.setItem("nome", <string> this.atleta.nome);
    sessionStorage.setItem("cognome", <string> this.atleta.cognome);
    this.route.navigate(['home']);
  }

}
