"use client";

import { useState } from "react";
import { Button } from "@/src/elements/ui/button";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useReactFlow, type EdgeProps } from "@xyflow/react";
import { Trash2 } from "lucide-react";

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const { setEdges, screenToFlowPosition } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Use a timer to prevent flickering when moving between the path and the label
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setMousePos(position);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsHovered(false);
    }, 100); // Increased grace period to 200ms
    setHoverTimer(timer);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setMousePos(position);
    if (!isHovered) setIsHovered(true);
  };

  const onEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      {/* Interaction Path (Wider and invisible for better hover detection) */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={40}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="react-flow__edge-interaction nodrag nopan"
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
      />

      {/* Visual Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 3,
          stroke: isHovered ? "var(--indigo-600)" : "var(--violet-600)",
          transition: 'stroke 0.2s',
          pointerEvents: 'none'
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${mousePos.x}px,${mousePos.y}px)`,
            fontSize: 12,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
            transition: 'opacity 0.2s ease-in-out, visibility 0.2s',
            zIndex: 1000,
          }}
          className="nodrag nopan"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <Button
            style={{ pointerEvents: 'auto' }}
            className="flex h-8 w-auto px-3 items-center justify-center gap-2 rounded-full border border-violet-100 bg-white shadow-lg transition-all hover:bg-red-50 hover:text-red-600 text-gray-400 dark:bg-dark-gray dark:border-dark-accent dark:hover:bg-red-900/20 active:scale-95 group"
            onClick={onEdgeClick}
            title="Remove connection"
          >
            <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Delete</span>
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
