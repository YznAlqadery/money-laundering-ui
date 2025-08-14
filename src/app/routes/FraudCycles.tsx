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

  // Fetch graph data on motif selection
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
    <>
      <div>
        <Navbar />
      </div>
      <div className="relative w-screen h-screen">
        {/* Motif Selector Overlay */}
        <BackButton page={-3} />
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow z-10">
          <label className="mr-2 font-semibold">Select Motif:</label>
          <select
            value={selectedMotif?.id ?? ""}
            onChange={(e) =>
              setSelectedMotif(
                motifs.find((m) => m.id === Number(e.target.value)) || null
              )
            }
            className="border p-1 rounded"
          >
            <option value="">-- Choose Motif --</option>
            {motifs.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Force Graph */}
        <ForceGraph2D
          ref={fgRef}
          width={window.innerWidth}
          height={window.innerHeight}
          graphData={graphData}
          nodeAutoColorBy="label"
          linkCurvature={0.25}
          linkDirectionalArrowLength={10}
          linkDirectionalArrowRelPos={0.95}
          linkDirectionalArrowColor={() => "rgba(0,0,0,0.8)"}
          linkWidth={2}
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
            ctx.fillStyle = node.label === "Account" ? "orange" : "lightblue";
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, 14, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x!, node.y! + 14);
          }}
        />
      </div>
    </>
  );
}
