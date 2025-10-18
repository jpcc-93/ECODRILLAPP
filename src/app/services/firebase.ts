// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, collectionData, query, where, getDocs, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Employee {
  id?: string;
  name: string;
  employeeId: string;
}

export interface MealRecord {
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  // --- FUNCIONES PARA EL ESCÁNER ---
  async getEmployee(barcodeId: string): Promise<Employee | null> {
    const employeeDocRef = doc(this.firestore, `employees/${barcodeId}`);
    const docSnap = await getDoc(employeeDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Employee;
    } else {
      return null;
    }
  }

  async getTodayMeals(barcodeId: string): Promise<MealRecord[]> {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const recordsCollectionRef = collection(this.firestore, 'meal_records');
    const q = query(
      recordsCollectionRef,
      where('userId', '==', barcodeId),
      where('date', '==', today)
    );

    const querySnapshot = await getDocs(q);
    const meals: MealRecord[] = [];
    querySnapshot.forEach((doc) => {
      meals.push(doc.data() as MealRecord);
    });
    return meals;
  }

  async registerMeal(record: MealRecord): Promise<void> {
    // Creamos un ID único para el documento para evitar registros duplicados
    const docId = `${record.userId}_${record.date}_${record.mealType}`;
    const mealDocRef = doc(this.firestore, `meal_records/${docId}`);
    await setDoc(mealDocRef, record);
  }

  // --- ¡NUEVAS FUNCIONES PARA EL ADMIN! ---

  // 1. Obtener TODOS los empleados
  getEmployees(): Observable<Employee[]> {
    const employeesCollection = collection(this.firestore, 'employees');
    return collectionData(employeesCollection, { idField: 'id' }) as Observable<Employee[]>;
  }

  // 2. Añadir un nuevo empleado
  addEmployee(employee: Employee): Promise<void> {
    // Usamos el ID del carné como ID del documento para evitar duplicados
    const employeeDocRef = doc(this.firestore, `employees/${employee.id!}`);
    return setDoc(employeeDocRef, { name: employee.name, employeeId: employee.employeeId });
  }

  // 3. Eliminar un empleado
  deleteEmployee(barcodeId: string): Promise<void> {
    const employeeDocRef = doc(this.firestore, `employees/${barcodeId}`);
    return deleteDoc(employeeDocRef);
  }
}