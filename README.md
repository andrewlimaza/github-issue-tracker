# Stranger Studios Issue Crawler

A web application to browse and filter issues from the Stranger Studios GitHub organization.

## Features

- Browse issues from all strangerstudios repositories
- Filter issues by specific labels
- View the 50 newest issues (sorted by creation date)
- See issue details with labels, authors, and dates

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your GitHub Personal Access Token:
   ```bash
   GITHUB_TOKEN=your_github_token_here
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:8080 in your browser

## Getting a GitHub Personal Access Token

To use this application, you need a GitHub Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Stranger Studios Issue Crawler")
4. Select scopes: `public_repo` (for public repositories)
5. Click "Generate token"
6. Copy the token and add it to your `.env` file

**Note**: Keep your token secret! Never commit the `.env` file to a repository.

## Usage

1. Select a label filter from the dropdown
2. Click "Search Issues"
3. View the 50 newest issues matching your filter

The app will fetch issues from all public repositories in the strangerstudios organization and display them sorted by creation date (newest first).

## Labels

The app includes all labels used by the strangerstudios organization:
- Good First Bug
- Difficulty: Easy/Medium/Hard
- Type: Bug/Enhancement/Feature/Support/etc.
- Impact: High/Medium/Low/Highest
- Status: Needs Code/Fix/Thought/etc.

## Development

To run in development mode:
```bash
node server.js
```

The server runs on port 8080 by default. You can change this by setting the `PORT` environment variable in your `.env` file:
```bash
PORT=3000
```

## Configuration

The application is pre-configured to crawl the `strangerstudios` GitHub organization. The configuration is hardcoded in `server.js`:

- **Organization**: strangerstudios
- **Issue Limit**: 50 issues (newest first)
- **Authentication**: GitHub Personal Access Token (from `.env` file)
