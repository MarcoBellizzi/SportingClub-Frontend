import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(
    private route: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        styleClass: 'nav',
        command: (event: any) => {
          this.redirect('home');
        }
      },
      {
        label: 'Struttura',
        icon: 'pi pi-eye',
        styleClass: 'nav',
        command: (event: any) => {
          this.redirect('struttura');
        }
      },
      {
        label: 'Prenotazione',
        icon: 'pi pi-book',
        styleClass: 'nav',
        command: (event: any) => {
          if (sessionStorage.getItem("nome")) {
            this.redirect('prenotazione');
          }
          else {
            this.messageService.add({ key: 'nav', severity: 'error', summary: 'Permesso negato', detail: 'É necessario effettuare il log-in per accedere a questa sezione'});
          }
        }
      },
      {
        label: 'Profilo',
        icon: 'pi pi-user',
        styleClass: 'nav',
        command: (event: any) => {
          if (sessionStorage.getItem("nome")) {
            this.redirect('profilo');
          }
          else {
            this.messageService.add({ key: 'nav', severity: 'error', summary: 'Permesso negato', detail: 'É necessario effettuare il log-in per accedere a questa sezione'});
          }
        }
      }
    ]

    if (sessionStorage.getItem("nome")) {
      this.items.push(
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          styleClass: 'nav',
          command: (event: any) => {
            sessionStorage.removeItem("nome");
            sessionStorage.removeItem("cognome");
            if(this.route.url === '/home') {
              window.location.reload();
            }
            else {
              this.redirect('home');
            }
          }
        }
      )
    }
    else {
      this.items.push(
        {
          label: 'LogIn',
          icon: 'pi pi-sign-in',
          styleClass: 'nav',
          command: (event: any) => {
            this.redirect('login');
          }
        }
      )
    }


  }

  redirect(target: string): void {
    this.route.navigate([target]);
  }

}
