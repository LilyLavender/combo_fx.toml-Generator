import React from "react";
import { useDrag } from "react-dnd";

export default function DraggableFighter({ name, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "fighter",
    item: { name },
    collect: monitor => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <img
      ref={drag}
      src={`stock-icons/chara_2_${name}.png`}
      alt={name}
      onClick={() => onClick(name)}
      style={{ opacity: isDragging ? 0.3 : 1, width: 48, height: 48, margin: 2, cursor: 'pointer' }}
    />
  );
}
