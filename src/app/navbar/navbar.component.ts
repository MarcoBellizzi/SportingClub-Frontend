import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: (event: any) => {
          this.redirect('home');
        }
      },
      {
        label: 'Struttura',
        icon: 'pi pi-eye',
        command: (event: any) => {
          this.redirect('struttura');
        }
      },
      {
        label: 'Prenotazione',
        icon: 'pi pi-book',
        command: (event: any) => {
          if (sessionStorage.getItem("nome")) {
            this.redirect('prenotazione');
          }
          else {
            this.redirect('login');
          }
        }
      },
      {
        label: 'Profilo',
        icon: 'pi pi-user',
        command: (event: any) => {
          if (sessionStorage.getItem("nome")) {
            this.redirect('profilo');
          }
          else {
            this.redirect('login');
          }
        }
      }
    ]

    if (sessionStorage.getItem("nome")) {
      this.items.push(
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
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
