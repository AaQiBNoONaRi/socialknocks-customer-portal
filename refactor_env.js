import fs from 'fs';
import path from 'path';

const files = [
    'components/Team.tsx',
    'components/SocialProfiles.tsx',
    'components/Scheduler.tsx',
    'components/ProfileSettings.tsx',
    'components/Posts.tsx',
    'components/Onboarding.tsx',
    'components/Login.tsx',
    'components/DesignRequests.tsx',
    'components/CustomerSupport.tsx',
    'components/ComposeModal.tsx',
    'components/AcceptInvite.tsx',
    'App.tsx',
    'services/predisService.ts'
];

files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${file}, not found.`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace standard string declarations
    content = content.replace(/'http:\/\/localhost:8000'/g, "(import.meta.env.VITE_API_URL || 'http://localhost:8000')");
    content = content.replace(/"http:\/\/localhost:8000"/g, "(import.meta.env.VITE_API_URL || 'http://localhost:8000')");
    
    // Replace concatenated strings like 'http://localhost:8000/api/workspaces'
    content = content.replace(/'http:\/\/localhost:8000\//g, " `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/");
    // Ensure we close the template literal if we replaced the opening quote
    // Wait, the above transforms 'http://localhost:8000/api/...' to `${import.meta.env...}/api/...'
    // This leaves the closing quote as a single quote, which is invalid syntax. 
    // We should safely replace instead:
    
});
