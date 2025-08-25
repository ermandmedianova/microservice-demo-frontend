'use client';

import { useState, useEffect } from 'react';
import { userApi, emailApi, User } from '@/lib/api';
import { UserCreateForm, UserUpdateForm } from '@/lib/validations';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';
import { Plus, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await userApi.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: UserCreateForm) => {
    try {
      setIsSubmitting(true);
      
      // Create user
      const newUser = await userApi.createUser(data);
      setUsers(prev => [...prev, newUser]);
      
      // Send welcome email
      try {
        const emailResponse = await emailApi.sendWelcomeEmail(newUser.email, newUser.name);
        toast.success(`User created successfully! Welcome email queued (Task ID: ${emailResponse.task_id})`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        toast.success('User created successfully, but failed to send welcome email');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UserUpdateForm) => {
    if (!editingUser) return;
    
    try {
      setIsSubmitting(true);
      const updatedUser = await userApi.updateUser(editingUser.id, data);
      setUsers(prev => prev.map(user => user.id === editingUser.id ? updatedUser : user));
      toast.success('User updated successfully');
      setEditingUser(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: UserCreateForm | UserUpdateForm) => {
    if (editingUser) {
      await handleUpdateUser(data as UserUpdateForm);
    } else {
      await handleCreateUser(data as UserCreateForm);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await userApi.deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const openCreateForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">Manage users and send registration emails</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadUsers}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{users.length}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User List */}
        <UserList
          users={users}
          onEdit={openEditForm}
          onDelete={handleDeleteUser}
          isLoading={isLoading}
        />

        {/* User Form Modal */}
        {isFormOpen && (
          <UserForm
            user={editingUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
