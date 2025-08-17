import fs from 'fs';
import path from 'path';

// Simple markdown-to-HTML converter
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Store code blocks temporarily to avoid processing them
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, language, content) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        const lang = language ? ` class="language-${language}"` : '';
        const trimmedContent = content.trim();
        
        // Escape HTML entities to prevent code execution
        const escapedContent = trimmedContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
            
        codeBlocks.push(`<pre><code${lang}>${escapedContent}</code></pre>`);
        return placeholder;
    });
    
    // Convert headers
    html = html.replace(/^# (.*$)/gim, '<h1 id="header">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="with-separator">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert inline code (single backticks)
    html = html.replace(/`([^`]+)`/g, (match, content) => {
        // Escape HTML entities in inline code too
        const escapedContent = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        return `<code>${escapedContent}</code>`;
    });
    
    // Convert buttons (before regular links)
    // Support both [Text]{button} and [Text](url){button}
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)\{button\}/g, '<div style="margin-bottom: 10px;"><button type="button" class="yt-uix-button" onclick="window.open(\'$2\', \'_blank\')"><span class="yt-uix-button-content">$1</span></button></div>');
    html = html.replace(/\[([^\]]*)\]\{button\}/g, '<div style="margin-bottom: 10px;"><button type="button" class="yt-uix-button"><span class="yt-uix-button-content">$1</span></button></div>');
    
    // Convert interactive components
    html = html.replace(/\{user-id-decoder\}/g, '<div class="user-id-decoder-component"></div>');
    
    // Convert images with sizing: ![alt](src){width=500} or ![alt](src){scale=0.5}
    html = html.replace(/!\[([^\]]*)\]\(([^\)]*)\)\{([^}]*)\}/g, (match, alt, src, sizing) => {
        let styleAttrs = '';
        if (sizing.includes('scale=')) {
            const scale = sizing.match(/scale=([\d.]+)/)?.[1];
            if (scale) {
                const percentage = Math.round(parseFloat(scale) * 100);
                styleAttrs += `width: ${percentage}%; height: auto; `;
            }
        } else {
            if (sizing.includes('width=')) {
                const width = sizing.match(/width=(\d+)/)?.[1];
                if (width) styleAttrs += `width: ${width}px; `;
            }
            if (sizing.includes('height=')) {
                const height = sizing.match(/height=(\d+)/)?.[1];
                if (height) styleAttrs += `height: ${height}px; `;
            }
        }
        const style = styleAttrs ? ` style="${styleAttrs.trim()}"` : '';
        return `<img src="${src}" alt="${alt}"${style}>`;
    });
    
    // Convert regular images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, '<img src="$2" alt="$1">');
    
    // Handle existing HTML img tags with sizing: <img src="..."{scale=0.5}>
    html = html.replace(/<img src="([^"]*)">\{([^}]*)\}/g, (match, src, sizing) => {
        let styleAttrs = '';
        if (sizing.includes('scale=')) {
            const scale = sizing.match(/scale=([\d.]+)/)?.[1];
            if (scale) {
                const percentage = Math.round(parseFloat(scale) * 100);
                styleAttrs += `width: ${percentage}%; height: auto; `;
            }
        } else {
            if (sizing.includes('width=')) {
                const width = sizing.match(/width=(\d+)/)?.[1];
                if (width) styleAttrs += `width: ${width}px; `;
            }
            if (sizing.includes('height=')) {
                const height = sizing.match(/height=(\d+)/)?.[1];
                if (height) styleAttrs += `height: ${height}px; `;
            }
        }
        const style = styleAttrs ? ` style="${styleAttrs.trim()}"` : '';
        return `<img src="${src}"${style}>`;
    });
    
    
    // Convert links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '<a href="$2">$1</a>');
    
    // Convert ordered lists (numbered)
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ol class="lower-roman">$1</ol>');
    
    // Convert paragraphs
    const lines = html.split('\n');
    let inList = false;
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '') {
            continue;
        }
        
        if (line.startsWith('<h1') || line.startsWith('<h2') || line.startsWith('<h3')) {
            result.push(line);
        } else if (line.startsWith('<ol') || line.startsWith('</ol>')) {
            result.push(line);
            inList = line.startsWith('<ol');
        } else if (line.startsWith('<li>')) {
            result.push(line);
        } else if (line.startsWith('<pre>') || line.startsWith('__CODE_BLOCK_')) {
            result.push(line);
        } else if (line.startsWith('<div><button')) {
            result.push(line);
        } else {
            result.push(`<p>${line}</p>`);
        }
    }
    
    // Restore code blocks
    let finalHtml = result.join('\n                            ');
    codeBlocks.forEach((codeBlock, index) => {
        finalHtml = finalHtml.replace(`__CODE_BLOCK_${index}__`, codeBlock);
    });
    
    return finalHtml;
}

// Recursively scan folders and files
function scanDirectory(dir, basePath = '') {
    const items = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // First, collect all directory names
    const folderNames = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory()) {
            // This is a folder - treat as parent category
            const folderName = entry.name;
            const subItems = scanDirectory(fullPath, relativePath);
            
            items.push({
                type: 'folder',
                name: folderName,
                path: relativePath,
                children: subItems
            });
        } else if (entry.name.endsWith('.md')) {
            // This is a markdown file
            const content = fs.readFileSync(fullPath, 'utf8');
            const title = content.split('\n')[0].replace('# ', '');
            const filename = path.basename(entry.name, '.md');
            
            // Only add as a standalone file if there's no corresponding folder
            if (!folderNames.includes(filename)) {
                items.push({
                    type: 'file',
                    title,
                    filename,
                    content,
                    path: relativePath,
                    fullPath: fullPath
                });
            }
        }
    }
    
    return items;
}

// Generate navigation based on folder structure
function generateNavigation(structure, currentArticle, allArticles) {
    function renderItems(items, isRoot = false) {
        let html = '';
        
        for (const item of items) {
            if (item.type === 'folder') {
                // Convert snake_case to Title Case, with special case for 'overview'
                const folderTitle = item.name === 'overview' ? 'Overview' : 
                    item.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                // Check if there's a corresponding .md file with the same name as the folder
                const correspondingFile = allArticles.find(article => 
                    article.filename === item.name
                );
                
                const href = correspondingFile ? `/t/${item.name}` : '#';
                const isHighlighted = correspondingFile && correspondingFile.filename === currentArticle ? ' class="item-highlight"' : '';
                
                html += `
                            <li class="top-level">
                                <a href="${href}"${isHighlighted}>${folderTitle}</a>
                            </li>`;
                
                if (item.children && item.children.length > 0) {
                    html += `
                            <ol class="indented">`;
                    // Filter out files that have the same name as the parent folder
                    const filteredChildren = item.children.filter(child => 
                        !(child.type === 'file' && child.filename === item.name)
                    );
                    html += renderItems(filteredChildren);
                    html += `
                            </ol>`;
                }
            } else if (item.type === 'file') {
                const isHighlighted = item.filename === currentArticle ? ' class="item-highlight"' : '';
                html += `
                                <li class="sub-level">
                                    <a href="/t/${item.filename}"${isHighlighted}>${item.title}</a>
                                </li>`;
            }
        }
        
        return html;
    }
    
    const nav = `
                        <ol>
                            ${renderItems(structure, true)}
                        </ol>`;
    return nav;
}

// HTML template matching the sample with header and footer from Layout.tsx
function createHtmlTemplate(title, content, navigation) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TubeVault - ${title}</title>
    <meta name="description" content="Preserving YouTube's early history">
    <meta name="keywords" content="video, sharing, camera phone, video phone, free, upload">
    <!-- Link to the stylesheets -->
    <link rel="stylesheet" href="tubevault.css">
    <link rel="stylesheet" href="youtube-minimal.css">
    <!-- Prism.js for syntax highlighting -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <!-- Interactive components script -->
    <script type="module">
    import { userIdDecoderHTML, initializeUserIdDecoder } from './interactive-components.js'
    
    function initializeInteractiveComponents() {
      // Initialize user ID decoder components
      const decoderComponents = document.querySelectorAll('.user-id-decoder-component')
      decoderComponents.forEach(component => {
        component.innerHTML = userIdDecoderHTML
        initializeUserIdDecoder(component)
      })
    }
    
    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll()
      }
      initializeInteractiveComponents()
    })
    </script>
</head>
<body>
    <div id="page">
        <!-- Header -->
        <div id="masthead-container">
            <div id="masthead" style="padding: 0.69em 0 0.7em; box-sizing: border-box; max-width: 1200px; margin: 0 auto; padding-left: 20px; padding-right: 20px;">
                <div style="float: left; display: flex; align-items: center; margin-left: 7px;">
                    <div style="margin-left: 0px; display: flex; align-items: center;">
                        <a href="/" style="margin-right: 8px; text-decoration: none; display: flex; align-items: center;">
                            <img src="/tubevault.png" alt="TubeVault" style="height: 32px; width: auto;" />
                        </a>
                        <span style="font-size: 11px; color: #999; font-family: Arial, Helvetica, sans-serif; margin-right: 1px; margin-left: 4px; margin-top: 2px;">
                            Preserving YouTube's early history
                        </span>
                    </div>
                </div>
                <div id="masthead-utility" style="margin-right: 7px;">
                    <a href="/users" class="start">Oldest Users</a>
                    <a href="/videos">Oldest Videos</a>
                    <a href="/t/overview">Documentation</a>
                    <a href="/t/about" class="end">About</a>
                </div>
                <div class="clear"></div>
            </div>
        </div>

        <!-- Article Content (existing structure) -->
        <div class="about-pages">
            <!-- The main content area -->
            <div id="content">
                <div class="ytg-base">
                    <div class="ytg-wide">
                        <!-- Left Navigation Column -->
                        <div class="ytg-1col">${navigation}
                        </div>

                        <!-- Main Article Content -->
                        <div id="yts-article">
                            <div id="article-container">
                                ${content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Notice -->
        <footer class="footer-notice">
            <p class="disclaimer-text">
                This site is not affiliated with Google, YouTube, or any of their subsidiaries. 
                TubeVault is an independent preservation project.
            </p>
        </footer>
    </div>
</body>
</html>`;
}

// Collect all articles from the structure for processing
function collectArticles(structure, articlesDir) {
    const articles = [];
    
    function traverse(items, currentDir = articlesDir) {
        for (const item of items) {
            if (item.type === 'file') {
                articles.push(item);
            } else if (item.type === 'folder' && item.children) {
                // Check if there's a corresponding .md file for this folder
                const folderMdPath = path.join(currentDir, `${item.name}.md`);
                if (fs.existsSync(folderMdPath)) {
                    const content = fs.readFileSync(folderMdPath, 'utf8');
                    const title = content.split('\n')[0].replace('# ', '');
                    articles.push({
                        type: 'file',
                        title,
                        filename: item.name,
                        content,
                        path: `${item.name}.md`,
                        fullPath: folderMdPath
                    });
                }
                
                traverse(item.children, path.join(currentDir, item.name));
            }
        }
    }
    
    traverse(structure);
    return articles;
}

// Main build function
function buildArticles() {
    const articlesDir = './articles';
    const outputDir = './public/t';
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Copy CSS files
    fs.copyFileSync('./src/styles/tubevault.css', path.join(outputDir, 'tubevault.css'));
    fs.copyFileSync('./src/styles/youtube-minimal.css', path.join(outputDir, 'youtube-minimal.css'));
    
    // Copy interactive components
    fs.copyFileSync('./src/components/interactive-components.js', path.join(outputDir, 'interactive-components.js'));
    
    // Scan the articles directory for folder structure
    const structure = scanDirectory(articlesDir);
    const articles = collectArticles(structure, articlesDir);
    
    // Generate HTML for each article
    articles.forEach(article => {
        const htmlContent = markdownToHtml(article.content);
        const navigation = generateNavigation(structure, article.filename, articles);
        const html = createHtmlTemplate(article.title, htmlContent, navigation);
        
        fs.writeFileSync(path.join(outputDir, `${article.filename}.html`), html);
        console.log(`Generated ${article.filename}.html`);
    });
    
    console.log(`Built ${articles.length} articles to ${outputDir}/`);
}

// Run the build
buildArticles();