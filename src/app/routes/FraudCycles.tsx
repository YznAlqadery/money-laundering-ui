import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { transformData } from "../../utils/transformData";
import { useAuth } from "../context/AuthContext";

export type NodeType = {
  id: string;
  label: string;
  properties: any;
  x?: number;
  y?: number;
};

export type LinkType = {
  source: string;
  target: string;
  label: string;
};

export type RawNode = {
  id: string;
  labels: string[];
  properties: any;
};

type RawRelationship = {
  id: string;
  startNode: number;
  endNode: number;
  type: string;
  properties: any;
};

export type RawData = {
  nodes: RawNode[];
  relationships: RawRelationship[];
};

export default function FraudCycles() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [graphData, setGraphData] = useState<{
    nodes: NodeType[];
    links: LinkType[];
  }>({
    nodes: [],
    links: [],
  });

  const fgRef = useRef<ForceGraphMethods>();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/fraud-cycles`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch fraud cycles");
        }

        const data: RawData = await response.json();
        const transformedData = transformData(data);
        setGraphData(transformedData);
      } catch (error) {
        console.error("Error fetching fraud cycles:", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;
    fg.d3Force("charge")?.strength(-300); // more repulsion
    fg.d3Force("link")?.distance(150); // more spacing
  }, [graphData]);

  if (!token) {
    return null; // nothing while redirecting
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ForceGraph2D
        ref={fgRef}
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
            ? `Account: ${node.properties.accountNumber.toString()}`
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
  );
}
