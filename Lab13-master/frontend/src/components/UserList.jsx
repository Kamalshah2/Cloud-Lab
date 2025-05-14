import { useState } from 'react';

const UserList = ({ users, deleteUser, editUser }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white font-medium text-lg flex justify-between items-center">
        <span>User List</span>
        <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">
          {users.length} {users.length === 1 ? 'User' : 'Users'}
        </span>
      </div>
      <div className="p-5">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292V19a1 1 0 01-1.553.833l-2-1.2a1 1 0 00-1.027.05L5.42 19.9a1 1 0 01-1.42-.91V10.5a4 4 0 116.5-4.933 4 4 0 115.5 4.933v3.5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3.5a1 1 0 011-1h2" />
            </svg>
            <p className="text-center">No users found. Add one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(user => (
                  <tr 
                    key={user.id} 
                    className={`transition-colors duration-200 ${
                      hoveredRow === user.id ? 'bg-gray-700' : 'bg-gray-800'
                    } hover:bg-gray-700`}
                    onMouseEnter={() => setHoveredRow(user.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className="text-amber-400 hover:text-amber-300 font-medium mr-3 transition-colors duration-200"
                        onClick={() => editUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            deleteUser(user.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
