import React from "react";
import { useDrop } from "react-dnd";
import DraggableFighter from "./DraggableFighter";

export default function DropZone({ title, fighters, setFighters, otherFighters, setOtherFighters, onClick }) {
  const [, drop] = useDrop(() => ({
  accept: "fighter",
  drop: (item) => {
    const name = item.name;
    setFighters(prev => (prev.includes(name) ? prev : [...prev, name]));
    setOtherFighters(prev => prev.filter(f => f !== name));
    onClick(name);
  }
}));

  return (
    <div ref={drop} className="p-2 border rounded w-1/2">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="flex flex-wrap">
        {fighters.map(f => (
          <DraggableFighter key={f} name={f} onClick={onClick} />
        ))}
      </div>
    </div>
  );
}
