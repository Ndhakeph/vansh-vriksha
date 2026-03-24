"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import type { TreeNode } from "@/types/database";

// Branch colors — one per great-grandfather's child lineage
const BRANCH_COLORS = [
  "#2D6A4F", // forest green
  "#40916C", // sage
  "#B08930", // dark gold
  "#8B5E3C", // warm brown
  "#6B4E71", // muted plum
  "#3D6B7E", // teal
];

interface FamilyTreeProps {
  data: TreeNode;
}

interface D3TreeNode {
  id: string;
  name: string;
  person: TreeNode["person"];
  spouse: TreeNode["spouse"];
  children?: D3TreeNode[];
  _branchColor?: string;
}

function assignBranchColors(node: D3TreeNode, colorIndex?: number): void {
  if (node.children) {
    node.children.forEach((child, i) => {
      const color =
        colorIndex !== undefined ? colorIndex : i % BRANCH_COLORS.length;
      child._branchColor = BRANCH_COLORS[color];
      assignBranchColors(child, color);
    });
  }
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function FamilyTree({ data }: FamilyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    node: TreeNode;
  } | null>(null);
  const router = useRouter();

  const renderTree = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create a group for zoom/pan
    const g = svg.append("g");

    // Set up zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Prepare the D3 hierarchy
    const treeData = JSON.parse(JSON.stringify(data)) as D3TreeNode;
    treeData._branchColor = BRANCH_COLORS[0];
    assignBranchColors(treeData);

    const root = d3.hierarchy(treeData, (d) => d.children);

    // Layout config
    const nodeWidth = 200;
    const nodeHeight = 280;
    const treeLayout = d3
      .tree<D3TreeNode>()
      .nodeSize([nodeWidth, nodeHeight])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.6));

    treeLayout(root);

    // Center the tree
    const nodes = root.descendants();
    const xExtent = d3.extent(nodes, (d) => d.x) as [number, number];
    const yExtent = d3.extent(nodes, (d) => d.y) as [number, number];
    const treeWidth = xExtent[1] - xExtent[0];
    const treeHeight = yExtent[1] - yExtent[0];

    const initialScale = Math.min(
      (width - 100) / (treeWidth + nodeWidth),
      (height - 100) / (treeHeight + nodeHeight),
      1
    );
    const initialX = width / 2 - ((xExtent[0] + xExtent[1]) / 2) * initialScale;
    const initialY = 60;

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(initialX, initialY).scale(initialScale)
    );

    // Draw links (curved paths)
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const sx = d.source.x ?? 0;
        const sy = (d.source.y ?? 0) + 55;
        const tx = d.target.x ?? 0;
        const ty = (d.target.y ?? 0) - 45;
        return `M${sx},${sy}C${sx},${(sy + ty) / 2} ${tx},${(sy + ty) / 2} ${tx},${ty}`;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => d.target.data._branchColor ?? "#1B4332")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.4);

    // Draw nodes
    const nodeGroups = g
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    // Node background card
    nodeGroups
      .append("rect")
      .attr("x", -70)
      .attr("y", -45)
      .attr("width", 140)
      .attr("height", (d) => (d.data.spouse ? 110 : 85))
      .attr("rx", 12)
      .attr("fill", "#FDF8F0")
      .attr("stroke", (d) => d.data._branchColor ?? "#1B4332")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.3)
      .attr("filter", "url(#shadow)");

    // Add shadow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "shadow");
    filter
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 2)
      .attr("stdDeviation", 4)
      .attr("flood-color", "#1B4332")
      .attr("flood-opacity", 0.08);

    // Photo circle
    nodeGroups
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -15)
      .attr("r", 22)
      .attr("fill", (d) => d.data._branchColor ?? "#1B4332")
      .attr("opacity", 0.15);

    nodeGroups
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -15)
      .attr("r", 22)
      .attr("fill", "none")
      .attr("stroke", (d) => d.data._branchColor ?? "#1B4332")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);

    // Initials text (fallback for no photo)
    nodeGroups
      .append("text")
      .attr("x", 0)
      .attr("y", -11)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", (d) => d.data._branchColor ?? "#1B4332")
      .text((d) =>
        getInitials(d.data.person.first_name, d.data.person.last_name)
      );

    // Person name
    nodeGroups
      .append("text")
      .attr("x", 0)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#1B4332")
      .text((d) => d.data.person.first_name);

    // Last name
    nodeGroups
      .append("text")
      .attr("x", 0)
      .attr("y", 31)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("font-weight", "400")
      .attr("fill", "#1B4332")
      .attr("opacity", 0.6)
      .text((d) => d.data.person.last_name);

    // Spouse name (smaller, below)
    nodeGroups
      .filter((d) => d.data.spouse !== null)
      .append("text")
      .attr("x", 0)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#D4A843")
      .attr("font-style", "italic")
      .text((d) => {
        const s = d.data.spouse;
        return s ? `& ${s.first_name}` : "";
      });

    // Hover and click interactions
    nodeGroups
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .attr("stroke-opacity", 0.8)
          .attr("stroke-width", 2.5);

        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltip({ x, y: y - 10, node: d.data as unknown as TreeNode });
      })
      .on("mouseleave", function () {
        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .attr("stroke-opacity", 0.3)
          .attr("stroke-width", 1.5);

        setTooltip(null);
      })
      .on("click", (_event, d) => {
        router.push(`/person/${d.data.id}`);
      });
  }, [data, router]);

  useEffect(() => {
    renderTree();

    const handleResize = () => renderTree();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderTree]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg border border-forest/10 bg-white px-4 py-3 shadow-lg"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 30,
          }}
        >
          <p className="font-display text-sm font-semibold text-forest">
            {tooltip.node.name}
          </p>
          {tooltip.node.person.birth_date && (
            <p className="mt-0.5 text-xs text-forest/60">
              Born: {new Date(tooltip.node.person.birth_date).getFullYear()}
              {tooltip.node.person.death_date &&
                ` — ${new Date(tooltip.node.person.death_date).getFullYear()}`}
            </p>
          )}
          {tooltip.node.person.occupation && (
            <p className="text-xs text-forest/60">
              {tooltip.node.person.occupation}
            </p>
          )}
          {tooltip.node.spouse && (
            <p className="mt-1 text-xs italic text-gold">
              Spouse: {tooltip.node.spouse.first_name}{" "}
              {tooltip.node.spouse.last_name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
