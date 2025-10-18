import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  errorMessage: string | null = null;
  isLoading = false;

  async onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const response = await this.firebaseService.login(form.value);
      console.log(response);
      this.router.navigate(['/scanner']); // Redirige al scanner después del login
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Credenciales inválidas. Por favor, intenta de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}