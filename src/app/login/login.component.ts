import { Component, OnInit } from '@angular/core';
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

  username: string = "";
  password: string = "";

  constructor(
    private route: Router,
    private messageService: MessageService,
    private atletaService: AtletaService
  ) { }

  ngOnInit() {
  }

  logIn() {
    this.atletaService.login(this.username, this.password).subscribe(
      response => {
        sessionStorage.setItem("user", this.username);   // perchè non response.username ??
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
