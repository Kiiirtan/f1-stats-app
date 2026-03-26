import fs from 'fs';
import path from 'path';

function walkAndReplaceColor(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkAndReplaceColor(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Replace all inline tailwind brackets bg-[#E10600] to bg-[var(--theme-accent)]
            content = content.replace(/\[#E10600\]/gi, '[var(--theme-accent)]');
            
            // For style={{ color: '#E10600' }} mapping
            content = content.replace(/['"]#E10600['"]/gi, '`var(--theme-accent)`');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated colors in: ${fullPath}`);
            }
        }
    }
}

walkAndReplaceColor('./src');
