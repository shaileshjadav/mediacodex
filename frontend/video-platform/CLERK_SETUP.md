# Clerk Authentication Setup

This document explains how to configure Clerk authentication for the Video Platform.

## Prerequisites

1. Create a Clerk account at [https://clerk.com](https://clerk.com)
2. Create a new application in your Clerk dashboard

## Configuration

### 1. Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Get Your Clerk Keys

1. Go to your Clerk dashboard
2. Navigate to "API Keys" in the sidebar
3. Copy your "Publishable Key"
4. Update the `.env` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 3. Configure Clerk Settings

In your Clerk dashboard:

1. **Sign-in Options**: Configure which authentication methods you want (email, social providers, etc.)
2. **Redirects**: Set up redirect URLs for your local development:
   - Sign-in redirect: `http://localhost:5174/`
   - Sign-up redirect: `http://localhost:5174/`
3. **Domains**: Add `localhost:5174` to your allowed domains for development

## Usage

The authentication system provides:

- **Automatic sign-in/sign-out**: Users can sign in and out using Clerk's UI components
- **Authentication state**: Access user information and authentication status throughout the app
- **Protected routes**: Ready for implementing route guards for authenticated-only content
- **User context**: Global access to user data via the AuthContext

## Components

- **AuthProvider**: Wraps the app and provides authentication context
- **useAuth hook**: Simplified interface to Clerk authentication
- **SignInButton/SignOutButton**: Pre-built Clerk components for authentication actions

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5174` (or another port if 5174 is in use).

## Troubleshooting

- **"Missing Publishable Key" error**: Make sure your `.env` file has the correct `VITE_CLERK_PUBLISHABLE_KEY`
- **Authentication not working**: Check that your Clerk app is configured with the correct redirect URLs
- **CORS errors**: Ensure your domain is added to Clerk's allowed domains list