import { useState, useEffect } from "react";
import MotifForm from "../../../components/MotifForm";
import { useAuth } from "../../context/AuthContext";

export type MotifQuery = {
  id: string;
  name: string;
  description: string;
  query: string;
  assignedTo: number[]; // user IDs as numbers now
  isActive: boolean;
};

type User = {
  id: number; // number type to match API
  username: string;
};

export default function MotifManager() {
  const { token } = useAuth();
  const [motifs, setMotifs] = useState<MotifQuery[]>([]);
  const [selectedMotif, setSelectedMotif] = useState<MotifQuery | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Your existing motif loading logic here (replace with real API later)
  useEffect(() => {
    setMotifs([
      {
        id: "1",
        name: "Circular Transactions",
        description: "Detect cycles in transaction graph.",
        query: "MATCH (a)-[:SENT]->(b)-[:SENT]->(c)-[:SENT]->(a) RETURN a,b,c",
        assignedTo: [1, 2], // number user IDs
        isActive: true,
      },
      {
        id: "2",
        name: "Rapid Layering",
        description: "Funds moving fast through many accounts.",
        query:
          "MATCH (a)-[:SENT*3..5]->(b) WHERE duration.between(a.first_tx_time,b.last_tx_time).hours < 24 RETURN a,b",
        assignedTo: [3],
        isActive: false,
      },
    ]);
  }, []);

  const filteredMotifs = motifs.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (motif: MotifQuery) => setSelectedMotif(motif);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this motif?")) {
      setMotifs(motifs.filter((m) => m.id !== id));
      if (selectedMotif?.id === id) setSelectedMotif(null);
    }
  };

  const handleSave = (motif: MotifQuery) => {
    if (motif.id) {
      setMotifs((ms) => ms.map((m) => (m.id === motif.id ? motif : m)));
    } else {
      motif.id = Date.now().toString();
      setMotifs((ms) => [...ms, motif]);
    }
    setSelectedMotif(null);
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Left panel */}
      <div className="flex-1 max-w-lg">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search motifs..."
            className="flex-grow border rounded-md px-3 py-2 mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() =>
              setSelectedMotif({
                id: "",
                name: "",
                description: "",
                query: "",
                assignedTo: [],
                isActive: true,
              })
            }
          >
            + Add New
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] border rounded-md divide-y">
          {filteredMotifs.length === 0 && (
            <p className="p-4 text-gray-500 text-center">No motifs found</p>
          )}
          {filteredMotifs.map((motif) => (
            <div
              key={motif.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 flex flex-col ${
                selectedMotif?.id === motif.id
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : ""
              }`}
              onClick={() => handleSelect(motif)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{motif.name}</h3>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(motif.id);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold px-2"
                    title="Delete motif"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {motif.description}
              </p>
              <p className="mt-1 text-xs">
                Assigned To:{" "}
                {motif.assignedTo.length > 0
                  ? motif.assignedTo
                      .map(
                        (id) => users.find((u) => u.id === id)?.username || id
                      )
                      .join(", ")
                  : "None"}
              </p>
              <p className="mt-1 text-xs">
                Status:{" "}
                <span
                  className={
                    motif.isActive
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {motif.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 max-w-lg">
        {selectedMotif ? (
          <MotifForm
            motif={selectedMotif}
            onSave={handleSave}
            onCancel={() => setSelectedMotif(null)}
            users={users}
          />
        ) : (
          <p className="text-gray-500 text-center mt-12">
            Select or add a motif query to edit
          </p>
        )}
      </div>
    </div>
  );
}
