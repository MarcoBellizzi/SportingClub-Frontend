import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[]=[];

  constructor(
    private route:Router
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
              label: 'Prenotazione',
              icon: 'pi pi-book'
          },
          {
            label: 'Logout',
            icon: 'pi pi-power-off',
            command: (event: any) => {
              this.redirect('login');
            }
          }
      ];
  }

  redirect(target: string): void {
    this.route.navigate([target]);
  }

}
