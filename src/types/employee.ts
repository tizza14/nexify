export interface Employee {
  Name: string;
  DateOfBirth: string;
  Salary: number;
  Address: string;
}

export interface ApiResponse {
  Success: boolean;
  Msg: string | null;
  Data: Employee[] | null;
}