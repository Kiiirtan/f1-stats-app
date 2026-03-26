import fs from 'fs';
import path from 'path';

const uiComps = ['CursorGlow', 'ErrorBoundary', 'PageTransition', 'ScrollReveal', 'SkeletonCard', 'SmoothLoader', 'TiltCard', 'Tooltip'];
const featComps = ['DriverCard', 'LoginModal', 'MobileMenu', 'SearchModal'];

function walkAndFix(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkAndFix(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Fix ../components/X and ./components/X
            for (const c of uiComps) {
                // handle full path from anywhere
                content = content.replace(new RegExp(`from (['"])(.*)components/${c}(['"])`, 'g'), `from $1$2components/ui/${c}$3`);
            }
            for (const c of featComps) {
                content = content.replace(new RegExp(`from (['"])(.*)components/${c}(['"])`, 'g'), `from $1$2components/features/${c}$3`);
            }

            // Fix relatives inside components folder
            if (fullPath.includes('components')) {
                for (const c of uiComps) {
                    content = content.replace(new RegExp(`from (['"])\\.\\.?/${c}(['"])`, 'g'), `from $1../ui/${c}$2`);
                }
                for (const c of featComps) {
                    content = content.replace(new RegExp(`from (['"])\\.\\.?/${c}(['"])`, 'g'), `from $1../features/${c}$2`);
                }
            }

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed: ${fullPath}`);
            }
        }
    }
}

walkAndFix('./src');
