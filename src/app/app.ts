import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ECODRILLAPP');

  constructor(private router: Router) {}

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
}
