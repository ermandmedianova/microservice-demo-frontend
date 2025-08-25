import axios from 'axios';

const CRUD_API_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_CRUD_API_URL   // SSR → container içinden
    : process.env.NEXT_PUBLIC_CRUD_API_URL; // Client → public host/Ingress

const EMAIL_API_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_EMAIL_API_URL   // SSR → container içinden
    : process.env.NEXT_PUBLIC_EMAIL_API_URL; // Client → public host/Ingress

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserCreate {
  name: string;
  email: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
}

export interface EmailRequest {
  to_emails: string[];
  subject: string;
  body: string;
  html_body?: string;
}

export interface EmailResponse {
  task_id: string;
  message: string;
  status: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: string;
  result?: {
    status: string;
    message: string;
  };
}

// CRUD API Client
const crudApi = axios.create({
  baseURL: CRUD_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Email API Client
const emailApiClient = axios.create({
  baseURL: EMAIL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User CRUD Operations
export const userApi = {
  // Get all users
  getUsers: async (skip = 0, limit = 100): Promise<User[]> => {
    const response = await crudApi.get(`/users?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get user by ID
  getUser: async (id: number): Promise<User> => {
    const response = await crudApi.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (user: UserCreate): Promise<User> => {
    const response = await crudApi.post('/users', user);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, user: UserUpdate): Promise<User> => {
    const response = await crudApi.put(`/users/${id}`, user);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await crudApi.delete(`/users/${id}`);
  },
};

// Email Operations
export const emailApi = {
  // Send welcome email
  sendWelcomeEmail: async (userEmail: string, userName: string): Promise<EmailResponse> => {
    const emailRequest: EmailRequest = {
      to_emails: [userEmail],
      subject: 'Welcome to User Management System',
      body: `Hello ${userName},\n\nWelcome to our User Management System! Your account has been successfully created.\n\nBest regards,\nUser Management Team`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to User Management System</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Welcome to our User Management System! Your account has been successfully created.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Account Details:</strong></p>
            <p>Name: ${userName}</p>
            <p>Email: ${userEmail}</p>
          </div>
          <p>Best regards,<br>User Management Team</p>
        </div>
      `
    };

    const response = await emailApiClient.post('/send-email', emailRequest);
    return response.data;
  },

  // Get task status
  getTaskStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await emailApiClient.get(`/task-status/${taskId}`);
    return response.data;
  },
};
