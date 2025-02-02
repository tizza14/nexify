<template>
  <div class="p-4">
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <button
          @click="addNewEmployee"
          :disabled="isLoading"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Add' }}
        </button>
        <button
          @click="handleSave"
          :disabled="isLoading"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {{ isLoading ? 'Saving...' : 'Save' }}
        </button>
        <button
          @click="handleRefresh"
          :disabled="isLoading"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Update' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="!employees.length" class="text-center py-8 text-gray-500">
      No employees found. Click "Add" to create one.
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left font-medium text-gray-700 tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left font-medium text-gray-700 tracking-wider">Birthday</th>
            <th scope="col" class="px-6 py-3 text-left font-medium text-gray-700 tracking-wider">Salary</th>
            <th scope="col" class="px-6 py-3 text-left font-medium text-gray-700 tracking-wider">Address</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(employee, index) in employees" :key="index">
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                name="name"
                v-model="employee.Name"
                class="border rounded px-2 py-1 w-full"
                type="text"
                placeholder="Enter name"
                autocomplete="name"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                name="birthday"
                :value="formatDate(employee.DateOfBirth)" @input="updateBirthday(employee, $event)"
                class="border rounded px-2 py-1"
                type="date"
                autocomplete="bday"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <input
                  name="salary"
                  v-model.number="employee.Salary"
                  class="w-32"
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  autocomplete="salary"
                />
                <span class="text-sm text-gray-600">{{ employee.Salary }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                name="address"
                v-model="employee.Address"
                class="border rounded px-2 py-1 w-full"
                type="text"
                placeholder="Enter address"
                autocomplete="address"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from '@/stores/employee';
import type { Employee } from '@/types/employee';
import { formatDate } from '@/utils/dateFormat';

const store = useEmployeeStore();
const { employees, isLoading, error } = storeToRefs(store);

onMounted(async () => {
  try {
    await store.fetchEmployees();
  } catch (err) {
    console.error('Failed to load employees:', err);
  }
});

const updateBirthday = (employee: Employee, event: Event) => {
  const input = event.target as HTMLInputElement;
  employee.DateOfBirth = input.value;
}

const addNewEmployee = () => {
  const newEmployee: Employee = {
    Name: '',
    DateOfBirth: new Date().toISOString().split('T')[0],
    Salary: 0,
    Address: '',
  };
  employees.value = [newEmployee, ...employees.value];
};

const handleSave = async () => {
  try {
    const formattedEmployees = employees.value.map(emp => ({
      ...emp,
      DateOfBirth: formatDate(emp.DateOfBirth)
    }));
    await store.saveEmployees(formattedEmployees);
  } catch (err) {
    console.error('Failed to save employees:', err);
  }
};

const handleRefresh = async () => {
  try {
    await store.fetchEmployees();
  } catch (err) {
    console.error('Failed to refresh employees:', err);
  }
};
</script>