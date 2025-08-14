import { useNavigate } from "react-router-dom";

export default function BackButton({ page }: { page: number }) {
  const navigate = useNavigate();
  return (
    <button
      className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded shadow z-10"
      onClick={() => {
        navigate(page);
      }}
    >
      Back
    </button>
  );
}
