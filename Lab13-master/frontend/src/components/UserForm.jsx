import { useState, useEffect } from 'react';

const UserForm = ({ addUser, updateUser, currentUser, setCurrentUser }) => {
  const initialFormState = {
    name: '',
    email: '',
    phone: ''
  };

  const [user, setUser] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  // Update form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(initialFormState);
    }
  }, [currentUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    
    // Basic validation
    if (!user.name || !user.email) {
      return;
    }
    
    let success;
    
    if (currentUser) {
      success = await updateUser(currentUser.id, user);
    } else {
      success = await addUser(user);
    }
    
    if (success) {
      setUser(initialFormState);
      setSubmitted(false);
    }
  };

  const cancelEdit = () => {
    setCurrentUser(null);
    setUser(initialFormState);
    setSubmitted(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white font-medium text-lg">
        {currentUser ? 'Edit User' : 'Add New User'}
      </div>
      <div className="p-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
              Name
            </label>
            <input
              type="text"
              className={`w-full bg-gray-700 border ${
                submitted && !user.name ? 'border-red-500' : 'border-gray-600'
              } rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
              id="name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Enter name"
            />
            {submitted && !user.name && (
              <div className="text-red-500 mt-1 text-sm">Name is required</div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              className={`w-full bg-gray-700 border ${
                submitted && !user.email ? 'border-red-500' : 'border-gray-600'
              } rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
            {submitted && !user.email && (
              <div className="text-red-500 mt-1 text-sm">Email is required</div>
            )}
          </div>
          
          <div className="mb-5">
            <label htmlFor="phone" className="block text-gray-300 mb-2 font-medium">
              Phone
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              id="phone"
              name="phone"
              value={user.phone || ''}
              onChange={handleInputChange}
              placeholder="Enter phone (optional)"
            />
          </div>
          
          <div className="flex justify-between">
            <button 
              type="submit" 
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentUser 
                  ? 'bg-amber-500 hover:bg-amber-600 text-gray-900' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
              }`}
            >
              {currentUser ? 'Update' : 'Add User'}
            </button>
            {currentUser && (
              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all duration-300"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;