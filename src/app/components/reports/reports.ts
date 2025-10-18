import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService, ReportEntry } from '../../services/firebase';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {
  private firebaseService = inject(FirebaseService);

  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];

  reportData: ReportEntry[] | null = null;
  summary = { breakfasts: 0, lunches: 0, dinners: 0 };

  async generateReport() {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecciona ambas fechas.');
      return;
    }

    this.reportData = await this.firebaseService.getMealRecordsByDateRange(this.startDate, this.endDate);
    this.calculateSummary();
  }

  private calculateSummary() {
    if (!this.reportData) return;

    this.summary = this.reportData.reduce((acc, entry) => {
      if (entry.mealType === 'Desayuno') acc.breakfasts++;
      if (entry.mealType === 'Almuerzo') acc.lunches++;
      if (entry.mealType === 'Cena') acc.dinners++;
      return acc;
    }, { breakfasts: 0, lunches: 0, dinners: 0 });
  }

  async onDeleteMeal(mealId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este registro de comida?')) {
      await this.firebaseService.deleteMeal(mealId);
      this.generateReport();
    }
  }

  downloadExcel(): void {
    if (!this.reportData || this.reportData.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const dataForExcel = this.reportData.map(entry => ({
      Cedula: entry.userId,
      Fecha: entry.date,
      Empleado: entry.employeeName,
      Comida: entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Consumo');

    XLSX.writeFile(wb, `Reporte_Consumo_${this.startDate}_a_${this.endDate}.xlsx`);
  }

}
