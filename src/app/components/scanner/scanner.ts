import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService, Employee, MealRecord } from '../../services/firebase';

type MealType = 'Desayuno' | 'Almuerzo' | 'Cena';
type NotificationType = 'success' | 'error';

@Component({
  selector: 'app-scanner',
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.css'
})
export class Scanner {

  private firebaseService = inject(FirebaseService);
  
  barcodeId: string = '';
  scannedEmployee: Employee | null = null;
  todayMeals: MealType[] = [];
  notification: { message: string, type: NotificationType } = { message: '', type: 'success' };

  // Nuevas propiedades para el modo manual
  isManualMode: boolean = false;
  manualMealType: MealType = 'Almuerzo'; // Valor por defecto

 async onRegisterMeal() {if (!this.barcodeId) {
      this.showNotification('Por favor, ingresa un código de barras.', 'error');
      return;
    }

    // 1. Buscar al empleado
    this.scannedEmployee = await this.firebaseService.getEmployee(this.barcodeId);
    if (!this.scannedEmployee) {
      this.showNotification('Empleado no encontrado. Verifica el código.', 'error');
      return;
    }

    // 2. Revisar las comidas que ya ha tomado hoy
    const meals = await this.firebaseService.getTodayMeals(this.barcodeId);
    this.todayMeals = meals.map(m => m.mealType);

    // 3. Determinar qué comida registrar (Automático vs Manual)
    const mealToRegister = this.isManualMode ? this.manualMealType : this.getMealTypeByTime();

    // 4. Verificar si ya tomó esa comida
    if (this.todayMeals.includes(mealToRegister)) {
      this.showNotification(`Este empleado ya registró el ${mealToRegister} de hoy.`, 'error');
      return;
    }

    // 5. Crear el registro y guardarlo en Firebase
    const newRecord: MealRecord = {
      userId: this.barcodeId,
      mealType: mealToRegister,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      await this.firebaseService.registerMeal(newRecord);
      this.todayMeals.push(mealToRegister);
      this.showNotification(`¡${mealToRegister.charAt(0).toUpperCase() + mealToRegister.slice(1)} registrado para ${this.scannedEmployee.name} exitosamente!`, 'success');
    } catch (error) {
      this.showNotification('Ocurrió un error al registrar la comida.', 'error');
    }
  }

  // Devuelve el tipo de comida según la hora actual
  private getMealTypeByTime(): MealType {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) { // 5:00 AM - 10:59 AM
      return 'Desayuno';
    } else if (hour >= 11 && hour < 16) { // 11:00 AM - 3:59 PM
      return 'Almuerzo';
    } else { // 4:00 PM en adelante
      return 'Cena';
    }
  }

  // Muestra una notificación y la borra después de 5 segundos
  private showNotification(message: string, type: NotificationType) {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification.message = '';
    }, 5000);
  }

  // Devuelve la clase CSS para los badges de comida (D, A, C)
  getMealBadgeClass(meal: MealType): string {
    const baseClass = 'w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg';
    if (this.todayMeals.includes(meal)) {
      return `${baseClass} bg-[#cddc39] text-gray-800`;
    }
    return `${baseClass} bg-gray-200 text-gray-400`;
  }
}
