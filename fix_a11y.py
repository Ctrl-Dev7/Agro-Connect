import os
import re

SCREENS_DIR = r"d:\Agro Connect\mobile-android\app\src\main\java\com\agroconnect\ui\screens"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Icon(Icons.Filled.CloudOff, contentDescription = null)
    # -> Icon(Icons.Filled.CloudOff, contentDescription = "CloudOff icon")
    
    def replacer(match):
        prefix = match.group(1) # Icon or Image
        resource = match.group(2) # Icons.Filled.CloudOff or painterResource(...)
        rest = match.group(3) # tint, modifiers, etc.
        
        # Try to extract a meaningful name
        desc = "Graphic Element"
        if "Icons.Filled." in resource or "Icons.Outlined." in resource or "Icons.Default." in resource:
            desc = resource.split('.')[-1] + " icon"
        elif "painterResource" in resource:
            # painterResource(R.drawable.wheat)
            match_res = re.search(r'R\.drawable\.([a-zA-Z0-9_]+)', resource)
            if match_res:
                desc = match_res.group(1).replace('_', ' ').capitalize() + " image"
        elif "imageVector" in resource:
            desc = "Vector Graphic"
            
        return f'{prefix}({resource}, contentDescription = "{desc}"{rest}'

    # Regex to match Icon(resource, contentDescription = null ...)
    pattern = r'(Icon|Image)\s*\(\s*([^,]+?)\s*,\s*contentDescription\s*=\s*null(.*?)'
    
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    
    # Catch any leftover stray contentDescription = null
    new_content = re.sub(r'contentDescription\s*=\s*null', 'contentDescription = "UI Element"', new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed A11y in {os.path.basename(filepath)}")

def main():
    for root, _, files in os.walk(SCREENS_DIR):
        for file in files:
            if file.endswith(".kt"):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
