import { useNavigate } from "react-router-dom";

export default function BackButton({ page }: { page: number }) {
  const navigate = useNavigate();
  return (
    <button
      className="absolute top-4 left-4 bg-san-marino-600 text-san-marino-50 hover:bg-san-marino-700 p-2 rounded shadow z-10 hover:cursor-pointer"
      onClick={() => navigate(page)}
    >
      Back
    </button>
  );
}
