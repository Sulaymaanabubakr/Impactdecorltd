# Contributing to Impact Decor Limited Website

Thank you for your interest in contributing to the Impact Decor Limited website! This document provides guidelines for making changes and improvements.

## Code of Conduct

- Be respectful and professional
- Write clean, maintainable code
- Test your changes before submitting
- Document your code where necessary

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sulaymaanabubakr/Impactdecorltd.git
   cd Impactdecorltd
   ```

2. **Set up your development environment**
   - Follow the instructions in SETUP_GUIDE.md
   - Configure Firebase and Cloudinary for testing

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### HTML

- Use semantic HTML5 elements
- Maintain consistent indentation (2 spaces)
- Include proper meta tags and alt attributes
- Ensure accessibility compliance
- Validate HTML using W3C validator

### CSS

- Follow the existing CSS structure
- Use CSS variables for colors and common values
- Keep selectors specific but not overly complex
- Maintain mobile-first responsive design
- Comment complex CSS rules
- Test across different browsers

### JavaScript

- Use modern ES6+ syntax
- Keep functions small and focused
- Add comments for complex logic
- Handle errors gracefully
- Use async/await for asynchronous operations
- Avoid global variables where possible

### Naming Conventions

- **HTML/CSS**: Use kebab-case for classes and IDs (`primary-button`, `nav-menu`)
- **JavaScript**: Use camelCase for variables and functions (`loadImages`, `currentUser`)
- **Files**: Use kebab-case for file names (`admin-dashboard.js`, `styles.css`)

## Making Changes

### For Bug Fixes

1. Identify the bug and create an issue describing it
2. Create a branch: `git checkout -b fix/bug-description`
3. Make your changes
4. Test thoroughly
5. Commit with a clear message
6. Submit a pull request

### For New Features

1. Discuss the feature in an issue first
2. Create a branch: `git checkout -b feature/feature-name`
3. Implement the feature
4. Update documentation if needed
5. Test the feature
6. Submit a pull request

### For Documentation

1. Ensure accuracy and clarity
2. Use proper markdown formatting
3. Include code examples where helpful
4. Update table of contents if needed

## Testing Checklist

Before submitting changes, verify:

- [ ] Code follows the style guidelines
- [ ] All HTML files are well-formed
- [ ] CSS is valid and works across browsers
- [ ] JavaScript has no console errors
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Forms validate correctly
- [ ] Firebase integration works (if modified)
- [ ] Admin dashboard functions properly (if modified)
- [ ] No broken links
- [ ] Images and videos load correctly
- [ ] Animations are smooth

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

3. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the template with:
     - Description of changes
     - Screenshots (if applicable)
     - Testing performed
     - Related issues

5. **Wait for Review**
   - Address any feedback
   - Make requested changes
   - Push updates to the same branch

## Coding Standards

### Comments

```javascript
// Good: Explains why, not what
// Fetch latest projects to display on homepage
async function loadRecentProjects() { ... }

// Bad: States the obvious
// This function loads projects
async function loadRecentProjects() { ... }
```

### Error Handling

```javascript
// Always handle errors gracefully
try {
    await db.collection('media').add(data);
    showToast('Upload successful!', 'success');
} catch (error) {
    console.error('Upload error:', error);
    showToast('Upload failed. Please try again.', 'error');
}
```

### Async Operations

```javascript
// Use async/await instead of callbacks
// Good
async function uploadImage() {
    const url = await uploadToCloudinary(file);
    await saveToFirestore(url);
}

// Avoid nested callbacks
```

## File Structure

When adding new files, follow this structure:

```
Impactdecorltd/
├── [page-name].html      # New pages in root
├── css/
│   └── [feature].css     # Feature-specific styles
├── js/
│   └── [feature].js      # Feature-specific logic
└── assets/
    └── [asset-files]     # Images, videos, etc.
```

## Common Tasks

### Adding a New Page

1. Create HTML file in root directory
2. Copy header and footer from existing page
3. Update navigation links in all pages
4. Create associated CSS/JS if needed
5. Update README if significant

### Modifying Styles

1. Check if CSS variable exists first
2. Make changes in `css/styles.css`
3. Test responsive design
4. Verify color contrast for accessibility

### Adding New JavaScript Functionality

1. Create new JS file or add to existing
2. Keep functions modular and reusable
3. Include error handling
4. Test with console for errors
5. Update JSDoc comments

## Security Considerations

- **Never commit API keys or secrets**
- Use `.gitignore` for sensitive files
- Validate all user inputs
- Sanitize data before displaying
- Follow Firebase security best practices
- Keep dependencies updated

## Performance Best Practices

- Optimize images before committing
- Use lazy loading for media
- Minimize CSS and JavaScript for production
- Leverage browser caching
- Use CDN for external libraries
- Test with Lighthouse

## Browser Support

The website should work on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Questions?

If you have questions:
1. Check the README.md
2. Review existing code
3. Ask in an issue
4. Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Impact Decor Limited website! 🎉
