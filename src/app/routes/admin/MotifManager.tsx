import { useState, useEffect } from "react";
import MotifForm from "../../../components/MotifForm";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export type Motif = {
  id: number | null;
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

  useEffect(() => {
    const fetchMotifs = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/motifs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this motif? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/motifs/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      setMotifs(motifs.filter((m) => m.id !== id));
      setSelectedMotif(null);
    } else {
      console.error("Failed to delete motif:", response.statusText);
    }
  };

  const handleSave = async (motif: Motif) => {
    if (!motif.id) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/motifs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(motif),
      });
      if (response.ok) {
        const newMotif = await response.json();
        setMotifs([...motifs, newMotif]);
        setSelectedMotif(null);
      } else {
        console.error("Failed to create motif:", response.statusText);
      }
    } else {
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
          motifs.map((m) => (m.id === updatedMotif.id ? updatedMotif : m))
        );
        setSelectedMotif(null);
      } else {
        console.error("Failed to update motif:", response.statusText);
      }
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6 font-poppins bg-san-marino-100 min-h-screen">
      {/* Left Panel */}
      <div className="flex-1 max-w-lg bg-san-marino-50 shadow-lg rounded-xl p-4 flex flex-col">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search motifs..."
            className="flex-grow border border-san-marino-300 rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-san-marino-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-san-marino-600 text-san-marino-50 px-4 py-2 rounded-lg hover:bg-san-marino-700 transition"
            onClick={() =>
              setSelectedMotif({
                id: null,
                name: "",
                description: "",
                cypherQuery: "",
                active: false,
              })
            }
          >
            + Add New
          </button>
          <Link
            to="/users"
            className="ml-4 bg-san-marino-400 text-san-marino-950 px-4 py-2 rounded-lg hover:bg-san-marino-500 transition"
          >
            Users
          </Link>
        </div>

        <div className="overflow-y-auto max-h-[70vh] border border-san-marino-200 rounded-lg divide-y divide-san-marino-200">
          {filteredMotifs.length === 0 && (
            <p className="p-4 text-san-marino-600 text-center italic">
              No motifs found
            </p>
          )}
          {filteredMotifs.map((motif) => (
            <div
              key={motif.id}
              className={`p-4 cursor-pointer hover:bg-san-marino-100 flex flex-col rounded-lg transition ${
                selectedMotif?.id === motif.id
                  ? "bg-san-marino-200 border-l-4 border-san-marino-600"
                  : ""
              }`}
              onClick={() => handleSelect(motif)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-san-marino-900">
                  {motif.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(motif.id!);
                  }}
                  className="text-red-500 hover:text-red-700 font-bold px-2 transition"
                  title="Delete motif"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-san-marino-700 truncate">
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

      {/* Right Panel */}
      <div className="flex-1 max-w-lg bg-san-marino-50 shadow-lg rounded-xl p-6 flex flex-col">
        {selectedMotif ? (
          <MotifForm
            motif={selectedMotif}
            onSave={handleSave}
            onCancel={() => setSelectedMotif(null)}
          />
        ) : (
          <p className="text-san-marino-600 text-center mt-12 italic">
            Select or add a motif query to edit
          </p>
        )}
      </div>
    </div>
  );
}
