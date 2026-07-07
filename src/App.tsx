import "./App.css";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { STAT_REGISTRY } from "./statRegistry";

export interface UnrealSaveRootPlayer {
  root: {
    properties: {
      HostPlayerData_0: HostPlayerDataStruct;
    };
  };
}

export interface HostPlayerDataStruct {
  Struct: {
    Struct: {
      InventoryItems_38_DFECB3064C26A43C4FD563A0E7C2958B_0: InventoryArray;
    };
  };
}

export interface InventoryArray {
  Array: {
    Struct: InventoryEntry;
  };
}

export interface InventoryEntry {
  value: InventoryValue[];
}

export interface InventoryValue {
  Struct: {
    GeneratedName_57_58091AD4472F71E411A2C1AF2D320DDC_0: {
      Str: string;
    };
    ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0: {
      Struct: {
        Struct: {
          RowName_0: {
            Name: string;
          };
        };
      };
    };
    AffixesPool_89_5A748ADA450AF2CA0408C286F360A594_0: {
      Struct: {
        Struct: {
          Inherent_3_BF5ACD534F25C65E5C4C83AC6D3C78D8_0: {
            Array: {
              Struct: {
                value: Stat[];
              };
            };
          };
          Pool1_5_5BC4C3914F78865C44F3959F84179108_0: {
            Array: {
              Struct: {
                value: Stat[];
              };
            };
          };
          Pool2_7_C9D5DBAD46BD46143554DE8BA77CF417_0: {
            Array: {
              Struct: {
                value: Stat[];
              };
            };
          };
          Pool3_9_03E0D74D4259F96DFDD896BB62805708_0: {
            Array: {
              Struct: {
                value: Stat[];
              };
            };
          };
        };
      };
    };
  };
}

interface Stat {
  Struct: {
    RowName_0: {
      Name: string;
    };
  };
}

function App() {
  //const [stashes, setStashes] = useState([]);
  const [inventory, setInventory] = useState<InventoryValue[]>([]);
  // const [filterAmnt, setFilterAmnt] = useState("1");
  const [statFilter, setStatFilter] = useState<string[]>([]);

  useEffect(() => {
    if (
      inventory &&
      inventory != undefined &&
      inventory != null &&
      inventory.length > 0
    ) {
      console.log("loaded inventory", inventory);
    }
  }, [inventory]);

  async function OpenSavePath() {
    const fpath =
      "/run/media/matt/Games/SteamLibrary/steamapps/compatdata/2015240/pfx/drive_c/users/steamuser/AppData/Local/ProjectAlpha/Saved/SaveGames/";

    const path = await open({
      multiple: false,
      directory: false,
      defaultPath: fpath,
      filters: [
        {
          name: "Save Files",
          extensions: ["sav"],
        },
      ],
    });

    if (path === null) return;

    const response = await invoke<string>("read_save", { filePath: path });
    const json = await JSON.parse(response);

    if (path.includes("WRL.sav")) handleStash(json);
    else handleInventory(json);
  }

  async function handleInventory(data: UnrealSaveRootPlayer) {
    const items: InventoryValue[] =
      data.root.properties.HostPlayerData_0.Struct.Struct
        .InventoryItems_38_DFECB3064C26A43C4FD563A0E7C2958B_0.Array.Struct
        .value;
    setInventory(items);
  }

  async function handleStash(json: JSON) {
    console.log(json);
  }

  // const handleFilterAmnt = (e: any) => setFilterAmnt(e.target.value);
  const handleStatFilterChange = (e: any) => {
    let curStatFilter = [...statFilter];

    type StatKey = keyof typeof STAT_REGISTRY;
    let stats = STAT_REGISTRY[e.target.id as StatKey];
    stats.patterns.map((p) => {
      if (curStatFilter.includes(p)) {
        curStatFilter = curStatFilter.filter((c) => c !== p);
      } else {
        curStatFilter.push(p);
      }
    });

    console.log(curStatFilter);
    setStatFilter(curStatFilter);
  };

  return (
    <div className="min-h-screen bg-gray-800 p-5!">
      <div>
        <button
          className="text-white border border-gray-700 p-2! w-fit! h-10! hover:bg-gray-900 hover:text-blue-300  whitespace-nowrap"
          onClick={OpenSavePath}
        >
          Open DR Save
        </button>
      </div>

      {inventory && inventory.length > 0 && (
        <div>
          <div className="flex gap-x-5">
            <p className="text-white">Inventory Loaded</p>
            {/* Amount of stats to check for*/}
            {/*<div className="text-white flex gap-x-3">
              <p>Stats:</p>
              <label>
                <input
                  type="radio"
                  name="amount"
                  value="1"
                  checked={filterAmnt === "1"}
                  onChange={handleFilterAmnt}
                />{" "}
                1
              </label>
              <label>
                <input
                  type="radio"
                  name="amount"
                  value="2"
                  checked={filterAmnt === "2"}
                  onChange={handleFilterAmnt}
                />{" "}
                2
              </label>
              <label>
                <input
                  type="radio"
                  name="amount"
                  value="3"
                  checked={filterAmnt === "3"}
                  onChange={handleFilterAmnt}
                />{" "}
                3
              </label>
            </div>*/}
          </div>
          {/* inventory tab */}
          <div className="flex gap-40">
            <StashTab
              InventoryValue={inventory}
              statFilter={statFilter}
              // filterAmnt={parseInt(filterAmnt, 10)}
            />

            {/* Stat list filter */}
            <div className="text-white p-5">
              <div className="grid grid-flow-col grid-rows-25 gap-x-8 gap-y-3">
                {Object.values(STAT_REGISTRY)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((stat) => (
                    <div key={stat.id} className="flex items-center gap-x-2">
                      <input
                        type="checkbox"
                        id={`${stat.id}`}
                        className="rounded accent-blue-500"
                        onChange={handleStatFilterChange}
                      />
                      <label
                        htmlFor={`${stat.id}`}
                        className="cursor-pointer select-none whitespace-nowrap"
                      >
                        {stat.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StashTabProps {
  InventoryValue: InventoryValue[];
  statFilter: string[];
  // filterAmnt: number;
}
function StashTab(props: StashTabProps) {
  return (
    <div className="flex">
      {/* Reduced the width constraint if necessary, or keep grid-cols-8 */}
      <div className="grid grid-cols-7 gap-x-5 gap-y-5 pt-5">
        {props.InventoryValue.map((item: InventoryValue, index: number) => {
          return (
            <ItemSlot
              key={index}
              InventoryValue={item}
              Index={index}
              statFilter={props.statFilter}
              // filterAmnt={props.filterAmnt}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ItemSlotProps {
  InventoryValue: InventoryValue;
  Index: number;
  statFilter: string[];
  // filterAmnt: number;
}
function ItemSlot(props: ItemSlotProps) {
  const [matched, setMatched] = useState(0);

  useEffect(() => {
    let count = 0;

    // stat pool 1
    let pool =
      props.InventoryValue.Struct
        .AffixesPool_89_5A748ADA450AF2CA0408C286F360A594_0.Struct.Struct
        .Pool1_5_5BC4C3914F78865C44F3959F84179108_0.Array.Struct.value;
    for (const stat of pool) {
      // console.log(
      //   `Item: ${props.InventoryValue.Struct.GeneratedName_57_58091AD4472F71E411A2C1AF2D320DDC_0.Str} | Stat Pool 1 stat: ${stat.Struct.RowName_0.Name}`,
      // );
      if (props.statFilter.includes(stat.Struct.RowName_0.Name)) {
        console.log("loop 1");
        count += 1;
        break;
      }
    }

    // stat pool 2
    pool =
      props.InventoryValue.Struct
        .AffixesPool_89_5A748ADA450AF2CA0408C286F360A594_0.Struct.Struct
        .Pool2_7_C9D5DBAD46BD46143554DE8BA77CF417_0.Array.Struct.value;
    for (const stat of pool) {
      // console.log(
      //   `Item: ${props.InventoryValue.Struct.GeneratedName_57_58091AD4472F71E411A2C1AF2D320DDC_0.Str} | Stat Pool 2 stat: ${stat.Struct.RowName_0.Name}`,
      // );
      if (props.statFilter.includes(stat.Struct.RowName_0.Name)) {
        console.log("loop 2");
        count += 1;
        break;
      }
    }

    // stat pool 3
    pool =
      props.InventoryValue.Struct
        .AffixesPool_89_5A748ADA450AF2CA0408C286F360A594_0.Struct.Struct
        .Pool3_9_03E0D74D4259F96DFDD896BB62805708_0.Array.Struct.value;
    for (const stat of pool) {
      // console.log(
      //   `Item: ${props.InventoryValue.Struct.GeneratedName_57_58091AD4472F71E411A2C1AF2D320DDC_0.Str} | Stat Pool 3 stat: ${stat.Struct.RowName_0.Name}`,
      // );
      if (props.statFilter.includes(stat.Struct.RowName_0.Name)) {
        console.log("loop 3");
        count += 1;
        break;
      }
    }

    console.log(count);
    setMatched(count);
  }, [props.statFilter, props.InventoryValue]);

  const BG = {
    normal: "/UI/normal-bg.PNG",
    one: "/UI/magic-bg.PNG",
    two: "/UI/unique-bg.PNG",
    three: "/UI/flawless-bg.PNG",
  };
  return (
    <div>
      <div className="relative h-12 w-12">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={
            matched >= 3
              ? BG["three"]
              : matched >= 2
                ? BG["two"]
                : matched >= 1
                  ? BG["one"]
                  : BG["normal"]
          }
          alt="background"
        />
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/UI/T_UI_Button_Frame_002.PNG"
          alt="frame"
        />

        {getImagePath(props.InventoryValue) !== "not found" && (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={getImagePath(props.InventoryValue)}
            alt="frame"
          />
        )}
      </div>
    </div>
  );
}

function getImagePath(item: InventoryValue) {
  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "bracers",
    )
  ) {
    return IMAGE_PATHS["Bracers"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "chest",
    )
  ) {
    return IMAGE_PATHS["Chest"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "pants",
    )
  ) {
    return IMAGE_PATHS["Pants"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "boots",
    )
  ) {
    return IMAGE_PATHS["Boots"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "gloves",
    )
  ) {
    return IMAGE_PATHS["Gloves"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "1h",
    )
  ) {
    return IMAGE_PATHS["Sword"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "sword",
    )
  ) {
    return IMAGE_PATHS["Sword"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "bow",
    )
  ) {
    return IMAGE_PATHS["Bow"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "polearm",
    )
  ) {
    return IMAGE_PATHS["Maul"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "spear",
    )
  ) {
    return IMAGE_PATHS["Spear"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "ring",
    )
  ) {
    return IMAGE_PATHS["Ring"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "relic",
    )
  ) {
    return IMAGE_PATHS["Relic"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "magery",
    )
  ) {
    return IMAGE_PATHS["Magery"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "fists",
    )
  ) {
    return IMAGE_PATHS["Fists"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "helm",
    )
  ) {
    return IMAGE_PATHS["Helmet"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "amulet",
    )
  ) {
    return IMAGE_PATHS["Amulet"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "necro",
    )
  ) {
    return IMAGE_PATHS["Scythe"];
  }

  if (
    item.Struct.ItemHandle_50_771C5BDE403723E59C4B96ADD5F26698_0.Struct.Struct.RowName_0.Name.toLowerCase().includes(
      "twohanded",
    )
  ) {
    return IMAGE_PATHS["Axe"];
  }

  return "not found";
}

const IMAGE_PATHS: Record<string, string> = {
  Bracers: "/UI/bracers_gold_2.PNG",
  Chest: "/UI/plate_chest_armor_5_-_Copy.PNG",
  Pants: "/UI/armor_pants_green_plate.PNG",
  Boots: "/UI/boots_armor_brown_1.PNG",
  Gloves: "/UI/armor_gloves_plate_blue.PNG",
  Sword: "/UI/dwarven_sword.PNG",
  Bow: "/UI/bow_stylized_icon_2.PNG",
  Maul: "/UI/weapons_maul.PNG",
  Spear: "/UI/weapon_spear_09.PNG",
  Ring: "/UI/grey_circle_jade_ring.PNG",
  Relic: "/UI/relic_shield_eye.PNG",
  Magery: "/UI/staff_1_march_2023_wand_3.PNG",
  Fists: "/UI/fists.png",
  Helmet: "/UI/armor_helmet_metaL_spange.PNG",
  Amulet: "/UI/red_amulet.PNG",
  Scythe: "/UI/scythe.png",
  Axe: "/UI/weapon_axe_6.PNG",
};

export default App;
