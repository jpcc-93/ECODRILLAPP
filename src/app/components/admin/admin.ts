import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { FirebaseService, Employee } from '../../services/firebase';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private firebaseService = inject(FirebaseService);

  employees$!: Observable<Employee[]>;
  newEmployee: Employee = { id: '', name: '' };
  isLoading = false;

  ngOnInit(): void {
    this.employees$ = this.firebaseService.getEmployees();
  }

  async onAddEmployee(form: NgForm) {
    if (!form.valid) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.isLoading = true;
    try {
      // Obtenemos la lista actual de empleados una sola vez
      const employees = await firstValueFrom(this.firebaseService.getEmployees());
      const employeeExists = employees.some(emp => emp.id === this.newEmployee.id);

      if (employeeExists) {
        alert('Ya existe un empleado con este ID.');
      } else {
        await this.firebaseService.addEmployee(this.newEmployee);
        alert('¡Empleado añadido con éxito!');
        form.resetForm();
        this.newEmployee = { id: '', name: '' }; // Limpiamos el objeto manualmente
      }
    } catch (err) {
      alert('Error al añadir empleado: ' + (err as Error).message);
    } finally {
      this.isLoading = false;
    }
  }

  onDeleteEmployee(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar a este empleado?')) {
      this.firebaseService.deleteEmployee(id)
        .then(() => alert('Empleado eliminado con éxito.'))
        .catch(err => alert('Error al eliminar empleado: ' + err.message));
    }
  }
}
