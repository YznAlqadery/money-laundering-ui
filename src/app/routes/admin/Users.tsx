import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type User = {
  id: number | null;
  username: string;
  role: string;
  password?: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roles, setRoles] = useState<string[]>([]); // ["USER", "ADMIN"]
  const [newUser, setNewUser] = useState<User>({
    id: null,
    username: "",
    role: "USER",
    password: "",
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/delete-user/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) setUsers(users.filter((u) => u.id !== id));
      else console.error("Failed to delete user");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser),
        }
      );
      if (res.ok) {
        const created = await res.json();
        setUsers([...users, created]);
        setShowCreateForm(false);
        setNewUser({ id: 0, username: "", role: "USER", password: "" });
      } else console.error("Failed to create user");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 font-poppins bg-san-marino-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-san-marino-900">Users</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-san-marino-600 text-san-marino-50 px-4 py-2 rounded-lg hover:bg-san-marino-700 transition"
        >
          + Create New User
        </button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="bg-san-marino-50 p-6 rounded-xl shadow-md mb-6 border border-san-marino-200"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="border border-san-marino-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-san-marino-500 transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border border-san-marino-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-san-marino-500 transition"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border border-san-marino-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-san-marino-500 transition"
              required
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto bg-san-marino-50 rounded-xl shadow-md border border-san-marino-200">
        <table className="min-w-full">
          <thead className="bg-san-marino-200 text-san-marino-900">
            <tr>
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Username</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-san-marino-200 hover:bg-san-marino-100 transition"
                >
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(user.id!)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-4 px-4 text-center text-san-marino-600"
                  colSpan={4}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
