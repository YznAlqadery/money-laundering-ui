import { useState, useEffect } from "react";
import type { Motif } from "../app/routes/admin/MotifManager";

interface MotifFormProps {
  motif: Motif;
  onSave: (motif: Motif) => void;
  onCancel: () => void;
}

export default function MotifForm({ motif, onSave, onCancel }: MotifFormProps) {
  const [name, setName] = useState(motif.name);
  const [description, setDescription] = useState(motif.description);
  const [cypherQuery, setCypherQuery] = useState(motif.cypherQuery);
  const [isActive, setIsActive] = useState(motif.active);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Update local state when motif prop changes (e.g. selecting a different motif)
    setName(motif.name);
    setDescription(motif.description);
    setCypherQuery(motif.cypherQuery);
    setIsActive(motif.active);
    setErrors({});
  }, [motif]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!cypherQuery.trim()) newErrors.cypherQuery = "Query is required";
    if (!description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      ...motif,
      name: name.trim(),
      description: description.trim(),
      cypherQuery: cypherQuery.trim(),
      active: isActive,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-md shadow-md border"
    >
      <h2 className="text-2xl mb-4">
        {motif.id ? "Edit Motif" : "Add New Motif"}
      </h2>

      <label className="block mb-1 font-semibold">
        Name <span className="text-red-500">*</span>
      </label>
      <input
        className={`w-full border p-2 rounded-md mb-2 ${
          errors.name ? "border-red-500" : "border-gray-300"
        }`}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <p className="text-red-500 mb-2">{errors.name}</p>}

      <label className="block mb-1 font-semibold">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        className="w-full border border-gray-300 p-2 rounded-md mb-2"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="block mb-1 font-semibold">
        Cypher Query <span className="text-red-500">*</span>
      </label>
      <textarea
        className={`w-full font-mono border p-2 rounded-md mb-2 resize-y ${
          errors.query ? "border-red-500" : "border-gray-300"
        }`}
        rows={6}
        value={cypherQuery}
        onChange={(e) => setCypherQuery(e.target.value)}
      />
      {errors.cypherQuery && (
        <p className="text-red-500 mb-2">{errors.cypherQuery}</p>
      )}

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => setIsActive(!isActive)}
          className="mr-2"
        />
        Active
      </label>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
