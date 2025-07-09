import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { saveAs } from "file-saver";
import { fighters } from "./data/constants";
import toml from "toml";
import DropZone from "./components/DropZone";
import FighterEditor from "./components/FighterEditor";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  const [enabled, setEnabled] = useState([]);
  const [configMap, setConfigMap] = useState({});
  const [selectedFighter, setSelectedFighter] = useState(null);

  const [comboFrame, setComboFrame] = useState(75);
  const [cooldownFrame, setCooldownFrame] = useState(16);
  const [comboHits, setComboHits] = useState("2,3,4,5");
  const [vfxType, setVfxType] = useState("dream_team");
  const [sfxType, setSfxType] = useState("dream_team");

  const disabled = fighters.filter(f => !enabled.includes(f));

  const handleEditFighter = (name) => {
    const existing = configMap[name];
    const config = existing || {
      vfxType: "dream_team",
      sfxType: "dream_team",
      comboFrame: 75,
      cooldownFrame: 16,
      comboHits: "2,3,4,5"
    };
  
    if (!existing) {
      setConfigMap(prev => ({
        ...prev,
        [name]: config
      }));
    }
  
    if (selectedFighter !== name) {
      setSelectedFighter(name);
      setComboFrame(config.comboFrame);
      setCooldownFrame(config.cooldownFrame);
      setComboHits(config.comboHits);
      setVfxType(config.vfxType);
      setSfxType(config.sfxType);
    }
  };

  useEffect(() => {
    if (!selectedFighter) return;
    setConfigMap(prev => ({
      ...prev,
      [selectedFighter]: {
        comboFrame,
        cooldownFrame,
        comboHits,
        vfxType,
        sfxType
      }
    }));
  }, [comboFrame, cooldownFrame, comboHits, vfxType, sfxType, selectedFighter]);

  function generateToml() {
    const data = enabled.map(name => {
      const config = configMap[name] || {
        vfxType: "dream_team",
        sfxType: "dream_team",
        comboFrame: 75,
        cooldownFrame: 16,
        comboHits: "2,3,4,5"
      };
      const hitsArray = config.comboHits
        .split(',')
        .map(n => parseInt(n.trim(), 10))
        .filter(n => !isNaN(n) && n > 0)
        .sort((a, b) => a - b);

      return `[[${name}]]\nvfx_type = "${config.vfxType}"
sfx_type = "${config.sfxType}"
combo_frame = ${Math.max(0, config.comboFrame)}
cooldown_frame = ${Math.max(0, config.cooldownFrame)}
combo_hits = [${hitsArray.join(",")}]
`;
    }).join("\n");

    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "combo_fx.toml");
  }

  function handleImportToml(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = toml.parse(text);

        const newMap = {};
        for (const [key, val] of Object.entries(parsed)) {
          if (Array.isArray(val)) {
            val.forEach(entry => {
              newMap[key] = {
                vfxType: entry.vfx_type || "dream_team",
                sfxType: entry.sfx_type || "dream_team",
                comboFrame: entry.combo_frame ?? 75,
                cooldownFrame: entry.cooldown_frame ?? 16,
                comboHits: (entry.combo_hits || [2, 3, 4, 5]).join(",")
              };
            });
          } else {
            newMap[key] = {
              vfxType: val.vfx_type || "dream_team",
              sfxType: val.sfx_type || "dream_team",
              comboFrame: val.combo_frame ?? 75,
              cooldownFrame: val.cooldown_frame ?? 16,
              comboHits: (val.combo_hits || [2, 3, 4, 5]).join(",")
            };
          }
        }

        setConfigMap(newMap);
        setEnabled(Object.keys(newMap));
        setSelectedFighter(null);
      } catch (err) {
        alert("Failed to parse TOML: " + err.message);
      }
    };

    reader.readAsText(file);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-6 space-y-4 mx-auto max-w-[1300px]">
        <h1 className="font-bold"><code>combo_fx.toml</code> Generator</h1>

        <div className="grid grid-cols-4 gap-4 items-start">
          {/* Form */}
          <div className="col-span-3">
            <FighterEditor
              selectedFighter={selectedFighter}
              comboFrame={comboFrame}
              cooldownFrame={cooldownFrame}
              comboHits={comboHits}
              vfxType={vfxType}
              sfxType={sfxType}
              setComboFrame={setComboFrame}
              setCooldownFrame={setCooldownFrame}
              setComboHits={setComboHits}
              setVfxType={setVfxType}
              setSfxType={setSfxType}
              onClearSelected={() => setSelectedFighter(null)}
              setAllConfig={() => {
                const config = {
                  comboFrame,
                  cooldownFrame,
                  comboHits,
                  vfxType,
                  sfxType
                };
                const updatedMap = { ...configMap };
                fighters.forEach(name => {
                  updatedMap[name] = config;
                });
                setConfigMap(updatedMap);
              }}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 flex flex-col gap-2 p-2 mt-2">
            <button
              onClick={generateToml}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Export <code>combo_fx.toml</code>
            </button>
            <input
              type="file"
              accept=".toml"
              id="import-toml"
              hidden
              onChange={handleImportToml}
            />
            <label
              htmlFor="import-toml"
              className="px-4 py-2 bg-gray-300 text-black rounded text-center cursor-pointer"
            >
              Import <code>combo_fx.toml</code>
            </label>
          </div>
        </div>

        {/* Characters */}
        <div className="flex gap-4 flex-nowrap items-start">
          {/* Enabled */}
          <DropZone
            title="Enabled"
            fighters={enabled}
            setFighters={setEnabled}
            otherFighters={disabled}
            setOtherFighters={(newDisabled) => {
              setEnabled(fighters.filter(f => !newDisabled.includes(f)));
            }}
            onClick={handleEditFighter}
          />

          {/* Swap buttons */}
          <div className="flex flex-col justify-center gap-2">
            <button
              className="text-2xl px-3 py-1 bg-gray-200 hover:bg-gray-300 text-black rounded"
              onClick={() => {
                setEnabled([...fighters]);
                setSelectedFighter(null);
              }}
            >
              <span className="fixbtntxt">←</span>
            </button>
            <button
              className="text-2xl px-3 py-1 bg-gray-200 hover:bg-gray-300 text-black rounded"
              onClick={() => {
                setEnabled([]);
                setSelectedFighter(null);
              }}
            >
              <span className="fixbtntxt">→</span>
            </button>
          </div>
          
          {/* Disabled */}
          <DropZone
            title="Disabled"
            fighters={disabled}
            setFighters={() => {}}
            otherFighters={enabled}
            setOtherFighters={setEnabled}
            onClick={handleEditFighter}
          />
        </div>

        <SiteFooter></SiteFooter>
      </div>
    </DndProvider>
  );
}
