import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

@Component({
  selector: 'app-scanner',
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.css'
})
export class Scanner {
  barcodeValue: string = '';
  scannedUser: any = null; // Aquí guardaremos la info del usuario escaneado
  notification = { message: '', type: 'success' };

  // Esta es la función que se llama al presionar el botón
  registrarComida() {
    console.log('Registrando código:', this.barcodeValue);

    // LÓGICA DE EJEMPLO (AQUÍ IRÁ LA CONEXIÓN A FIREBASE)
    if (this.barcodeValue === '123456') {
      this.scannedUser = {
        name: 'Carlos Andrade',
        employeeId: 'EMP-101',
        meals: { breakfast: true, lunch: false, dinner: false } // Datos de ejemplo
      };
      this.showNotification('¡Almuerzo registrado con éxito!', 'success');
    } else {
      this.scannedUser = null;
      this.showNotification('Error: Empleado no encontrado.', 'error');
    }

    this.barcodeValue = ''; // Limpiamos el input
  }

  // Función para mostrar la notificación
  showNotification(message: string, type: 'success' | 'error') {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification.message = ''; // Oculta la notificación después de 3 segundos
    }, 3000);
  }

  // Función para darle color al estado de la comida
  getMealStatusClass(meal: 'breakfast' | 'lunch' | 'dinner'): string {
    if (this.scannedUser?.meals[meal]) {
      return 'bg-green-200 text-green-800'; // Comida registrada
    }
    return 'bg-gray-200 text-gray-800'; // Comida pendiente
  }

}
