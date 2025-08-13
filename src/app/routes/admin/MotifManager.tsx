import { useState, useEffect } from "react";
import MotifForm from "../../../components/MotifForm";
import { useAuth } from "../../context/AuthContext";

export type Motif = {
  id: number;
  name: string;
  description: string;
  cypherQuery: string;
  active: boolean;
};

export default function MotifManager() {
  const { token } = useAuth();
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users once on mount
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUsers(data);
  //     } else {
  //       console.error("Failed to fetch users:", response.statusText);
  //     }
  //   };
  //   if (token) fetchUsers();
  // }, [token]);

  useEffect(() => {
    const fetchMotifs = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/motifs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMotifs(data);
      } else {
        console.error("Failed to fetch motifs:", response.statusText);
      }
    };
    if (token) fetchMotifs();
  }, [token]);

  const filteredMotifs = motifs.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (motif: Motif) => setSelectedMotif(motif);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this motif?")) {
      setMotifs(motifs.filter((m) => m.id !== id));
      if (selectedMotif?.id === id) setSelectedMotif(null);
    }
  };

  const handleSave = async (motif: Motif) => {
    // Update existing motif
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/motifs/${motif.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(motif),
      }
    );
    if (response.ok) {
      const updatedMotif = await response.json();
      setMotifs(
        motifs.map((motif) =>
          motif.id === updatedMotif.id ? updatedMotif : motif
        )
      );
      setSelectedMotif(null);
    } else {
      console.error("Failed to update motif:", response.statusText);
    }
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
                id: 0,
                name: "",
                description: "",
                cypherQuery: "",
                active: true,
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
                Status:{" "}
                <span
                  className={
                    motif.active
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {motif.active ? "Active" : "Inactive"}
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
