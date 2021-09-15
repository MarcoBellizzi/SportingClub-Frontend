import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: Router,
    private messageService: MessageService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Sporting Club - Home")
  }

  redirect(target: string): void {
    if (sessionStorage.getItem("nome")) {
      this.route.navigate([target]);
    }
    else {
      this.messageService.add({ key: 'nav', severity: 'error', summary: 'Permesso negato', detail: 'É necessario effettuare il log-in per accedere a questa sezione' });
    }
  }

  navigate(target: string): void {
    this.route.navigate([target]);
  }

}
