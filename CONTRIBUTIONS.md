# Contributing

We welcome contributions of new articles about YouTube's early history, technical features, and archival techniques. Articles should focus on historical documentation and preservation.

## Folder Structure

Articles are organized in the `articles/` directory with a hierarchical structure:

```
articles/
├── article-name.md          # Standalone article
├── category-name.md         # Category overview article
└── category-name/           # Category folder
    ├── subcategory/         # Subcategory folder
    │   ├── feature1.md      # Individual articles
    │   └── feature2.md
    └── validation/
        ├── method1.md
        └── method2.md
```

### How It Works

1. **Standalone Articles**: Place `.md` files directly in `articles/` (e.g., `about.md`)
2. **Category Articles**: Create both `category.md` and `category/` folder for overview + sub-articles
3. **Sub-articles**: Place inside category folders for automatic grouping

The build system automatically:
- Generates navigation from folder structure
- Links category overview files with their folders
- Converts snake_case folder names to Title Case in navigation

## Markdown Features

### Basic Formatting

```markdown
# Main Article Title
## Section Header
**Bold text**
*Italic text*
`inline code`
```

### Code Blocks

````markdown
```html
<a href="#" onclick="yt.www.watch.user.blockUserLink('jNQXAC9IVRw', '/user/jawed');">Block User</a>
```

```xml
<published>2005-04-24T03:20:54+00:00</published>
```
````

### Images with Sizing

```markdown
# Regular image
![Alt text](image.png)

# Scaled image (25% size)
![Alt text](/assets/hide_view_count.png){scale=0.25}

# Fixed width
![Alt text](image.png){width=500}

# Fixed dimensions
![Alt text](image.png){width=500 height=300}
```

### Interactive Components

Currently supported interactive component:

```markdown
# User ID decoder widget
{user-id-decoder}
```

To add a custom widget:
1. Add the component HTML/JS to `src/components/interactive-components.js`
2. Register the component pattern in `build-articles.js` (line 55)
3. Add initialization logic in the template script section

```markdown
# User ID decoder widget
{user-id-decoder}
```

### Buttons

```markdown
# Link button
[Example Button](https://example.com){button}

# Simple button
[Click Me]{button}
```

### Lists

```markdown
1. First item
2. Second item
3. Third item
```

## Example Articles

Browse the `articles/` folder to see real examples:

- **Simple Feature Article**: `articles/overview/features/hiding.md` - Basic formatting with scaled images
- **Complex Technical Article**: `articles/overview/validation/incremental_ids.md` - Code blocks, interactive components, detailed research
- **Category Overview**: `articles/overview.md` - How to structure category landing pages

See the full folder structure at `articles/` for more examples of organization and formatting.

## Content Guidelines

### What We're Looking For

- **Historical Documentation**: Early YouTube features, discoveries, technical details, past incidents
- **Archival Research**: User ID analysis, timeline validation, lost media recovery recovery
- **Technical Deep-dives**: How early YouTube systems worked

### Evidence Requirements

- **Primary Sources**: Screenshots/videos, Wayback Machine links, source code
- **Technical Accuracy**: Precise technical details with references

### Writing Style

- **Clear and Concise**: Focus on facts over speculation
- **Technical but Accessible**: Explain complex concepts clearly
- **Well-Structured**: Use headers, lists, and formatting effectively

## Submission Process

### Option 1: Email Submission
Send to **contributions [at] youtube.museum** with:
- Article content as markdown file
- Any supporting images/assets
- Brief description of the research

### Option 2: Pull Request
1. Fork the repository
2. Create article in appropriate `articles/` subfolder
3. Add any images to `public/assets/`
4. Test locally: `npm run build-articles`
5. Submit PR with descriptive title

## Asset Management

- **Images**: Place in `public/assets/` directory
- **File Naming**: Use descriptive, web-safe names (no spaces)
- **Reference in Articles**: Use absolute paths `/assets/filename.png`
- **Optimization**: Compress images appropriately for web

## Building & Testing

```bash
# Build articles locally
npm run build-articles

# Start development server
npm run dev

# Check your article at
http://localhost:3000/t/your-article-name
```

Articles are automatically built to `public/t/` as HTML files with navigation, styling, and interactive components.

## Review Process

All submissions undergo review for:
- **Accuracy**: Claims must be verifiable
- **Relevance**: Must relate to YouTube history/preservation
- **Quality**: Well-written and properly formatted
- **Uniqueness**: Adds new information or perspective

Contributors will be credited in the site acknowledgments.