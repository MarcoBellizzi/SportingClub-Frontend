import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AtletaService } from '../services/atleta.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  telefono?: number;
  password?: string;

  constructor(
    private route: Router,
    private messageService: MessageService,
    private atletaService: AtletaService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Sporting Club - Login")
  }

  logIn() {
    this.atletaService.login(this.telefono, this.password).subscribe(
      response => {
        sessionStorage.setItem("nome", <string> response.nome);
        sessionStorage.setItem("cognome", <string> response.cognome)
        this.route.navigate(['home']);
      },
      err => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username o password errati' });
      }
    )
  }

  redirect(target: string) {
    this.route.navigate([target])
  }

}
