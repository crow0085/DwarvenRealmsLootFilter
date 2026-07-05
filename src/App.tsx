import "./App.css";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

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
  const [stashes, setStashes] = useState([]);
  const [inventory, setInventory] = useState<InventoryValue[]>([]);
  const [hoveredItem, setHoveredItem] = useState<InventoryValue | null>();

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

  const affixes = [
    "Max Health",
    "Max Energy",
    "Health Regeneration",
    "Energy Regeneration",
    "Critical Chance",
    "Critical Damage Bonus",
    "Lifesteal Chance",
    "Lifesteal Bonus",
    "Lifesteal",
    "Arcane Damage Bonus",
    "Lightning Damage Bonus",
    "Fire Damage Bonus",
    "boss Damage",
    "Strength",
    "Strength Bonus",
    "Agility",
    "Agility Bonus",
    "Stamina",
    "Stamina Bonus",
    "Luck",
    "Luck Bonus",
    "Endurance",
    "Endurance Bonus",
    "Dexterity",
    "Dexterity Bonus",
    "Wisdom",
    "Wisdom Bonus",

    "Sword Damage",
    "Sword Critical Damage",
    "Sword Critical Chance",

    "Archery Damage",
    "Archery Critical Damage",
    "Archery Critical Chance",

    "Axe Damage",
    "Axe Critical Damage",
    "Axe Critical Chance",

    "Maul Damage",
    "Maul Critical Damage",
    "Maul Critical Chance",

    "Spear Damage",
    "Spear Critical Damage",
    "Spear Critical Chance",

    "Magery Damage",
    "Magery Critical Damage",
    "Magery Critical Chance",

    "Fist Damage",
    "Fist Critical Damage",
    "Fist Critical Chance",

    "Scythe Damage",
    "Scythe Critical Damage",
    "Scythe Critical Chance",
  ];

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
          <div>
            <p className="text-white">Inventory Loaded</p>
          </div>
          <div className="flex gap-40">
            <StashTab
              InventoryValue={inventory}
              setHoveredItem={setHoveredItem}
            />
            <div className="text-white p-5">
              <div className="grid grid-flow-col grid-rows-25 gap-x-8 gap-y-3">
                {affixes.map((item, index) => (
                  <div key={index} className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      id={`stat-${index}`}
                      className="rounded accent-blue-500"
                    />
                    <label
                      htmlFor={`stat-${index}`}
                      className="cursor-pointer select-none whitespace-nowrap"
                    >
                      {item}
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
  setHoveredItem: (item: InventoryValue | null) => void;
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
              setHoveredItem={props.setHoveredItem}
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
  setHoveredItem: (item: InventoryValue | null) => void;
}
function ItemSlot(props: ItemSlotProps) {
  const handleMouseEnter = (event: any) => {
    props.setHoveredItem(props.InventoryValue);
  };

  const handleMouseLeave = (event: any) => {
    props.setHoveredItem(null);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="relative h-12 w-12">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="src/UI/normal-bg.PNG"
          alt="background"
        />

        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="src/UI/T_UI_Button_Frame_002.PNG"
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
  Bracers: "src/UI/bracers_gold_2.PNG",
  Chest: "src/UI/plate_chest_armor_5_-_Copy.PNG",
  Pants: "src/UI/armor_pants_green_plate.PNG",
  Boots: "src/UI/boots_armor_brown_1.PNG",
  Gloves: "src/UI/armor_gloves_plate_blue.PNG",
  Sword: "src/UI/dwarven_sword.PNG",
  Bow: "src/UI/bow_stylized_icon_2.PNG",
  Maul: "src/UI/weapons_maul.PNG",
  Spear: "src/UI/weapon_spear_09.PNG",
  Ring: "src/UI/grey_circle_jade_ring.PNG",
  Relic: "src/UI/relic_shield_eye.PNG",
  Magery: "src/UI/staff_1_march_2023_wand_3.PNG",
  Fists: "src/UI/fists.png",
  Helmet: "src/UI/armor_helmet_metaL_spange.PNG",
  Amulet: "src/UI/red_amulet.PNG",
  Scythe: "src/UI/scythe.png",
  Axe: "src/UI/weapon_axe_6.PNG",
};

export default App;
