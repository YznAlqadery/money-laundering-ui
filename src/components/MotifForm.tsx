import { useState, useEffect } from "react";
import type { MotifQuery } from "../app/routes/admin/MotifManager";

type User = {
  id: number;
  username: string;
};

interface MotifFormProps {
  motif: MotifQuery;
  users: User[];
  onSave: (motif: MotifQuery) => void;
  onCancel: () => void;
}

export default function MotifForm({
  motif,
  users,
  onSave,
  onCancel,
}: MotifFormProps) {
  const [name, setName] = useState(motif.name);
  const [description, setDescription] = useState(motif.description);
  const [query, setQuery] = useState(motif.query);
  const [assignedTo, setAssignedTo] = useState<number[]>(motif.assignedTo);
  const [isActive, setIsActive] = useState(motif.isActive);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Update local state when motif prop changes (e.g. selecting a different motif)
    setName(motif.name);
    setDescription(motif.description);
    setQuery(motif.query);
    setAssignedTo(motif.assignedTo);
    setIsActive(motif.isActive);
    setErrors({});
  }, [motif]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!query.trim()) newErrors.query = "Query is required";
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
      query: query.trim(),
      assignedTo,
      isActive,
    });
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((opt) => Number(opt.value));
    setAssignedTo(selectedIds);
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

      <label className="block mb-1 font-semibold">Description</label>
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {errors.query && <p className="text-red-500 mb-2">{errors.query}</p>}

      <label className="block mb-1 font-semibold">
        Assign To (select users)
      </label>
      <select
        multiple
        className="w-full border border-gray-300 p-2 rounded-md mb-4"
        value={assignedTo.map(String)}
        onChange={handleUserSelect}
        size={Math.min(5, users.length)} // limit visible rows to 5 max
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

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
