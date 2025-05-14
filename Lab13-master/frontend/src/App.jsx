import { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching users. Please check if the server is running.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/users`, user);
      setUsers([...users, response.data]);
      showNotification('User added successfully!');
      return true;
    } catch (err) {
      setError('Error adding user');
      console.error('Error adding user:', err);
      return false;
    }
  };

  const updateUser = async (id, user) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, user);
      setUsers(users.map(u => (u.id === id ? response.data : u)));
      setCurrentUser(null);
      showNotification('User updated successfully!');
      return true;
    } catch (err) {
      setError('Error updating user');
      console.error('Error updating user:', err);
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      showNotification('User deleted successfully!', 'info');
    } catch (err) {
      setError('Error deleting user');
      console.error('Error deleting user:', err);
    }
  };

  const editUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {notification && (
        <div 
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-500 transform translate-x-0 
            ${notification.type === 'success' ? 'bg-green-500' : 
             notification.type === 'info' ? 'bg-blue-500' : 
             notification.type === 'error' ? 'bg-red-500' : 'bg-gray-500'}`}
        >
          {notification.message}
        </div>
      )}
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            User Management System
          </h1>
          <p className="text-gray-400">Beautiful Dark Theme CRUD App with AWS RDS</p>
        </div>
        
        {error && (
          <div className="mb-8 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <UserForm 
              addUser={addUser} 
              updateUser={updateUser} 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser} 
            />
          </div>
          <div className="md:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <UserList 
                users={users} 
                deleteUser={deleteUser} 
                editUser={editUser} 
              />
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Beautiful Dark Theme CRUD App</p>
      </footer>
    </div>
  );
}

export default App;