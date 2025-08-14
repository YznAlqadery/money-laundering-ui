import { useEffect, useRef, useState } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { transformData } from "../../utils/transformData";
import { useAuth } from "../context/AuthContext";
import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";

export type NodeType = {
  id: string;
  label: string;
  properties: any;
  x?: number;
  y?: number;
};
export type LinkType = { source: string; target: string; label: string };
export type RawNode = { id: string; labels: string[]; properties: any };
type RawRelationship = {
  id: string;
  startNode: number;
  endNode: number;
  type: string;
  properties: any;
};
export type RawData = { nodes: RawNode[]; relationships: RawRelationship[] };

export type Motif = {
  id: number;
  name: string;
  description: string;
  cypherQuery: string;
  active: boolean;
};

export default function FraudCycles() {
  const { token } = useAuth();
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);
  const [graphData, setGraphData] = useState<{
    nodes: NodeType[];
    links: LinkType[];
  }>({
    nodes: [],
    links: [],
  });

  const fgRef = useRef<ForceGraphMethods>();

  // Fetch motifs
  useEffect(() => {
    if (!token) return;

    const fetchMotifs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/motifs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch motifs");
        const data = await res.json();
        setMotifs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMotifs();
  }, [token]);

  // Fetch graph data when motif changes
  useEffect(() => {
    if (!selectedMotif || !token) return;

    const fetchGraph = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/fraud-cycles/${selectedMotif.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch fraud cycles");
        const data: RawData = await res.json();
        setGraphData(transformData(data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchGraph();
  }, [selectedMotif, token]);

  // Graph physics
  useEffect(() => {
    if (!fgRef.current) return;
    const fg = fgRef.current;
    fg.d3Force("charge")?.strength(-300);
    fg.d3Force("link")?.distance(150);
  }, [graphData]);

  if (!token) return null;

  return (
    <div className="h-screen w-screen flex flex-col font-poppins bg-san-marino-50">
      <Navbar />
      <div className="relative flex-1">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <BackButton page={-3} />
        </div>

        {/* Motif Selector */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg z-20 border border-san-marino-200">
          <label className="block text-sm font-semibold text-san-marino-900 mb-2">
            Select Motif
          </label>
          <select
            value={selectedMotif?.id ?? ""}
            onChange={(e) =>
              setSelectedMotif(
                motifs.find((m) => m.id === Number(e.target.value)) || null
              )
            }
            className="w-56 border border-san-marino-300 rounded-md p-2 focus:ring-2 focus:ring-san-marino-600 focus:outline-none text-sm"
          >
            <option value="">-- Choose Motif --</option>
            {motifs.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Show motif description if selected */}
          {selectedMotif && (
            <p className="mt-3 text-xs text-san-marino-700 italic max-w-xs">
              {selectedMotif.description}
            </p>
          )}
        </div>

        {/* Force Graph */}
        <ForceGraph2D
          ref={fgRef}
          width={window.innerWidth}
          height={window.innerHeight}
          graphData={graphData}
          nodeAutoColorBy="label"
          linkCurvature={0.25}
          linkDirectionalArrowLength={8}
          linkDirectionalArrowRelPos={0.95}
          linkDirectionalArrowColor={() => "rgba(0,0,0,0.6)"}
          linkWidth={1.5}
          linkLabel={(link) => link.label}
          nodeLabel={(node) =>
            node.label === "Account"
              ? `Account: ${node.properties.accountNumber}`
              : `Txn: £${node.properties.amountPaid?.toLocaleString() ?? "N/A"}`
          }
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label =
              node.label === "Account"
                ? "Account"
                : `£${node.properties.amountPaid?.toLocaleString() ?? ""}`;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = node.label === "Account" ? "#f97316" : "#60a5fa"; // orange / blue
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, 12, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x!, node.y! + 14);
          }}
        />
      </div>
    </div>
  );
}
