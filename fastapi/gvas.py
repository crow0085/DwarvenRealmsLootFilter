from pygvas.gvas import GvasFile

# 1. Load the binary file
with open(
    "/run/media/matt/Games/SteamLibrary/steamapps/compatdata/2015240/pfx/drive_c/users/steamuser/AppData/Local/ProjectAlpha/Saved/SaveGames/6a42d62671a5230e133ff1ce_WRL.sav",
    "rb",
) as f:
    gvas_data = GvasFile.read(f)

# 2. Convert to JSON string
json_string = gvas_data.to_json(indent=4)

# 3. Save JSON to disk
with open("my_save.json", "w", encoding="utf-8") as f:
    f.write(json_string)
