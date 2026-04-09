import os
import re

files_to_update = {
    'Drivers.tsx': ('Driver Standings', 'Official Formula 1 driver championship standings, statistics, and detailed performance telemetry.'),
    'DriverProfile.tsx': ('Driver Profile', 'Comprehensive Formula 1 driver profile, statistics, and history.'),
    'Circuits.tsx': ('Circuit Encyclopedia', 'Explore official Formula 1 circuit layouts, history, and physical track data.'),
    'Races.tsx': ('Race Archive', 'Historical F1 race archives, round-by-round results, and seasonal performance.'),
    'Results.tsx': ('Race Results', 'Detailed F1 race results, classifications, and historical lap-by-lap analytics.'),
    'News.tsx': ('Live Updates', 'Latest Formula 1 news, paddock analysis, and live motorsport updates.'),
    'Settings.tsx': ('Settings', 'Configure F1 Stats application preferences, appearance, and notifications.'),
    'Contact.tsx': ('Contact', 'Get in touch with the F1 Stats development team.'),
    'Credits.tsx': ('Credits', 'Acknowledgments and data attribution for the F1 Stats application.'),
    'Privacy.tsx': ('Privacy Policy', 'F1 Stats privacy policy and user data management guidelines.'),
    'Terms.tsx': ('Terms of Service', 'Terms of service and usage conditions for F1 Stats.'),
    'Cookies.tsx': ('Cookie Policy', 'Cookie policy and tracking information for F1 Stats.'),
    'NotFound.tsx': ('Page Not Found', 'The requested page could not be found.'),
    'ConstructorProfile.tsx': ('Team Profile', 'Official Formula 1 constructor profile, history, and statistics.'),
    'ConstructorSeasonDetails.tsx': ('Season Data', 'Detailed performance telemetry for F1 constructors across historical seasons.')
}

base_dir = r"c:/Users/VICTUS/Projects/demo/src/pages"

for filename, (title, desc) in files_to_update.items():
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'useDocumentMeta' in content:
        continue
        
    # Insert import
    import_statement = "import { useDocumentMeta } from '../hooks/useDocumentMeta';\n"
    last_import_idx = content.rfind('import ')
    if last_import_idx != -1:
        end_of_line = content.find('\n', last_import_idx)
        content = content[:end_of_line+1] + import_statement + content[end_of_line+1:]
    else:
        content = import_statement + content
        
    # Find export default function
    match = re.search(r'export default function \w+\([^)]*\)\s*{', content)
    if match:
        insert_idx = match.end()
        hook_call = f"\n  useDocumentMeta('{title}', '{desc}');"
        content = content[:insert_idx] + hook_call + content[insert_idx:]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Updated titles')
