import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Employee, ApiResponse } from '@/types/employee';

const API_BASE_URL = '/api';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchEmployees = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/GetRecords`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      
      if (data.Success && Array.isArray(data.Data)) {
        employees.value = data.Data;
      } else {
        throw new Error(data.Msg || 'Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      error.value = err instanceof Error ? err.message : 'Failed to fetch employees';
      employees.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const saveEmployees = async (employeeData: Employee[]) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/SaveRecords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (!data.Success) {
        throw new Error(data.Msg || 'Failed to save employees');
      }

      await fetchEmployees();
    } catch (err) {
      console.error('Error saving employees:', err);
      error.value = err instanceof Error ? err.message : 'Failed to save employees';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    employees,
    isLoading,
    error,
    fetchEmployees,
    saveEmployees,
  };
});