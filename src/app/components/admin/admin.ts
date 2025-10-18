import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Importamos NgForm
import { Observable } from 'rxjs';
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
  newEmployee: Employee = { id: '', name: '', employeeId: '' };

  ngOnInit(): void {
    this.employees$ = this.firebaseService.getEmployees();
  }

  onAddEmployee(form?: NgForm) {
    if (!this.newEmployee.id || !this.newEmployee.name || !this.newEmployee.employeeId) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.firebaseService.addEmployee(this.newEmployee)
      .then(() => {
        alert('¡Empleado añadido con éxito!');
        if (form) {
          form.resetForm();
        }
        this.newEmployee = { id: '', name: '', employeeId: '' }; // Limpiamos el objeto
      })
      .catch(err => alert('Error al añadir empleado: ' + err.message));
  }

  onDeleteEmployee(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar a este empleado?')) {
      this.firebaseService.deleteEmployee(id)
        .then(() => alert('Empleado eliminado con éxito.'))
        .catch(err => alert('Error al eliminar empleado: ' + err.message));
    }
  }
}
