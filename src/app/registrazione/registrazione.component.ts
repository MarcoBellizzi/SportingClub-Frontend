import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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

  atleta: Atleta = {id:0, nome:"", cognome:"", password:"", admin:false};
  livelli: any[] = [{nome: "Base"},{nome:"Medio"},{nome:"Avanzato"}]

  constructor(
    private route: Router,
    private atletaService: AtletaService,
    private messageService: MessageService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Sporting Club - Registrazione");
  }

  registrati() {
    this.atletaService.save(this.atleta).subscribe(
      response => {
        sessionStorage.setItem("nome", <string> this.atleta.nome);
        sessionStorage.setItem("cognome", <string> this.atleta.cognome);
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
    this.route.navigate(['home']);
  }

}
