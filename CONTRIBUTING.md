# Contributing to Creative Freelance Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone git@github.com:YOUR_USERNAME/creative-freelance-platform.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit with descriptive messages
6. Push to your fork
7. Create a Pull Request

## Development Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Run development servers
npm run dev
```

## Code Standards

### JavaScript/Node.js
- Use ES6+ syntax
- Follow ESLint rules
- Use async/await over callbacks
- Add JSDoc comments for functions
- Keep functions small and focused

### React/Frontend
- Use functional components with hooks
- Keep components under 200 lines
- Extract reusable logic to custom hooks
- Use proper prop types
- Follow React best practices

### API Development
- RESTful endpoint design
- Proper HTTP status codes
- Consistent error handling
- Input validation
- Authentication where needed

## Commit Messages

Follow conventional commits:
```
feat: add user profile editing
fix: resolve payment processing bug
docs: update API documentation
style: format code with prettier
refactor: restructure auth middleware
test: add tests for gig creation
chore: update dependencies
```

## Pull Request Process

1. Update README.md with any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Bug Reports

When reporting bugs, include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

## Feature Requests

For feature requests:
- Check existing issues first
- Describe the problem it solves
- Propose a solution
- Consider implementation impact

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Questions?

Open an issue or reach out to maintainers.

Thank you for contributing! 🎉
