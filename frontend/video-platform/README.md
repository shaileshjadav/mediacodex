# Media codex UI

A modern React-based video management platform with upload, processing status tracking, and embedding capabilities.

## Features

- **Authentication**: Clerk integration for secure user authentication
- **Video Upload**: Drag-and-drop interface with presigned URL uploads
- **Real-time Status**: Live processing status updates similar to Vercel's interface
- **Video Management**: Grid-based video library with pagination
- **Embed Generation**: Generate embed scripts for external websites
- **Responsive Design**: Clean, Vimeo-inspired interface with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Clerk** for authentication
- **ESLint & Prettier** for code quality

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contexts/      # React contexts for state management
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Requirements

This project implements the video platform UI as specified in the requirements document, including:

- Requirement 9.1: Separate directory structure from existing frontend
- Requirement 9.4: Modern React patterns and component organization