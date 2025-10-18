// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, collectionData, query, where, getDocs, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Employee {
  id?: string;
  name: string;
  employeeId?: string;
}

export interface MealRecord {
  userId: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Cena';
  date: string; // Formato YYYY-MM-DD
}

// Una nueva interfaz para los reportes, que incluye el nombre del empleado
export interface ReportEntry extends MealRecord {
    employeeName: string;
}


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  // --- FUNCIONES EXISTENTES ---
  async getEmployee(barcodeId: string): Promise<Employee | null> {
    const employeeDocRef = doc(this.firestore, `employees/${barcodeId}`);
    const docSnap = await getDoc(employeeDocRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Employee) : null;
  }

  async getTodayMeals(barcodeId: string): Promise<MealRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    const recordsCollectionRef = collection(this.firestore, 'meal_records');
    const q = query(recordsCollectionRef, where('userId', '==', barcodeId), where('date', '==', today));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as MealRecord);
  }

  async registerMeal(record: MealRecord): Promise<void> {
    const docId = `${record.userId}_${record.date}_${record.mealType}`;
    const mealDocRef = doc(this.firestore, `meal_records/${docId}`);
    await setDoc(mealDocRef, record);
  }

  getEmployees(): Observable<Employee[]> {
    const employeesCollection = collection(this.firestore, 'employees');
    return collectionData(employeesCollection, { idField: 'id' }) as Observable<Employee[]>;
  }

  addEmployee(employee: Employee): Promise<void> {
    const employeeDocRef = doc(this.firestore, `employees/${employee.id!}`);
    return setDoc(employeeDocRef, { name: employee.name });
  }

  deleteEmployee(barcodeId: string): Promise<void> {
    const employeeDocRef = doc(this.firestore, `employees/${barcodeId}`);
    return deleteDoc(employeeDocRef);
  }

  // --- ¡NUEVA FUNCIÓN PARA REPORTES! ---
  async getMealRecordsByDateRange(startDate: string, endDate: string): Promise<ReportEntry[]> {
    const employeesMap = new Map<string, string>();
    const employeesSnapshot = await getDocs(collection(this.firestore, 'employees'));
    employeesSnapshot.forEach(doc => employeesMap.set(doc.id, doc.data()['name']));

    const recordsCollectionRef = collection(this.firestore, 'meal_records');
    const q = query(recordsCollectionRef, where('date', '>=', startDate), where('date', '<=', endDate));
    const querySnapshot = await getDocs(q);

    const reportEntries: ReportEntry[] = querySnapshot.docs.map(doc => {
      const record = doc.data() as MealRecord;
      return {
        ...record,
        employeeName: employeesMap.get(record.userId) || 'Empleado Desconocido'
      };
    });

    return reportEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
