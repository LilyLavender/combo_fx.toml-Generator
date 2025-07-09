import React from "react";
import { types } from "../data/constants";

export default function FighterEditor({
  selectedFighter,
  comboFrame, cooldownFrame, comboHits, vfxType, sfxType,
  setComboFrame, setCooldownFrame, setComboHits, setVfxType, setSfxType,
  onClearSelected, setAllConfig
}) {
  const hitsArray = comboHits.split(",").map(s => s.trim());

  const updateHitAtIndex = (index, value) => {
    const updated = [...hitsArray];
    updated[index] = value;
    setComboHits(updated.join(","));
  };

  return (
    <div className="border p-4 mt-4 rounded relative">
      {selectedFighter ? (
        <button
          onClick={onClearSelected}
          className="x-button"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "transparent",
            border: "none",
            fontSize: "18px",
            lineHeight: 1,
            cursor: "pointer"
          }}
        >
          🗙
        </button>
      ) : (
        <button
          onClick={setAllConfig}
          className="x-button"
        >
          Set for All
        </button>
      )}

      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <img
          src={`stock-icons/chara_2_${selectedFighter ?? "random"}.png`}
          alt={selectedFighter ?? "random"}
          style={{ width: 32, height: 32 }}
        />
        {selectedFighter ?? <span>No fighter selected</span>}
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {/* VFX/SFX */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-2">
              📺 VFX Type:
              <img
                src={`excellents/${vfxType}_excellent.png`}
                alt={vfxType}
                style={{ height: 32 }}
              />
            </label>
            <select value={vfxType} onChange={e => setVfxType(e.target.value)} className="w-full">
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              🔊 SFX Type:
              <img
                src={`excellents/${sfxType}_excellent.png`}
                alt={sfxType}
                style={{ height: 32 }}
              />
            </label>
            <select value={sfxType} onChange={e => setSfxType(e.target.value)} className="w-full">
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Frame Data */}
        <div className="flex flex-col gap-4">
          <span className="font-bold block mb-2">Frame Data:</span>
          <div>
            <label className="me-2" htmlFor="combo-frame">Combo frames:</label>
            <input
              id="combo-frame"
              type="number"
              value={comboFrame}
              min={0}
              onChange={e => setComboFrame(+e.target.value)}
              className="w-24"
            />
          </div>

          <div>
            <label className="me-2" htmlFor="cooldown-frame">Cooldown frames:</label>
            <input
              id="cooldown-frame"
              type="number"
              value={cooldownFrame}
              min={0}
              onChange={e => setCooldownFrame(+e.target.value)}
              className="w-24"
            />
          </div>
        </div>

        {/* Hits to Activate */}
        <div>
          <span className="font-bold block mb-2">Hits to activate:</span>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-right me-2" htmlFor="hit-ok">OK</label>
            <input
              id="hit-ok"
              type="number"
              value={hitsArray[0] || ""}
              min="1"
              onChange={e => updateHitAtIndex(0, e.target.value)}
              className="w-16"
            />

            <label className="text-right me-2" htmlFor="hit-good">GOOD</label>
            <input
              id="hit-good"
              type="number"
              value={hitsArray[1] || ""}
              min="2"
              onChange={e => updateHitAtIndex(1, e.target.value)}
              className="w-16"
            />

            <label className="text-right me-2" htmlFor="hit-great">GREAT</label>
            <input
              id="hit-great"
              type="number"
              value={hitsArray[2] || ""}
              min="3"
              onChange={e => updateHitAtIndex(2, e.target.value)}
              className="w-16"
            />

            <label className="text-right me-2" htmlFor="hit-excellent">EXCELLENT</label>
            <input
              id="hit-excellent"
              type="number"
              value={hitsArray[3] || ""}
              min="4"
              onChange={e => updateHitAtIndex(3, e.target.value)}
              className="w-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
