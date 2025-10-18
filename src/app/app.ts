import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FirebaseService } from './services/firebase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule], // Añadir CommonModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ECODRILLAPP');

  isLoggedIn = false;
  userRole: string | null = null;

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.authState$().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.firebaseService.getUserRole(user.uid).then(role => {
          this.userRole = role;
        });
      } else {
        this.isLoggedIn = false;
        this.userRole = null;
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getActiveClass(path: string): string {
    const baseClass = 'transition duration-200 py-2 px-4 rounded-md';
    if (this.router.url === path) {
      return `${baseClass} bg-[#cddc39] text-gray-800 font-semibold`;
    }
    return `${baseClass} text-gray-300 hover:text-white`;
  }

  async logout() {
    await this.firebaseService.logout();
    this.router.navigate(['/login']);
  }
}
