# GitHub Issue Tracker

A static web app to browse, filter, and export issues from any GitHub organization.

**Live on GitHub Pages**: https://andrewlimaza.github.io/github-issue-tracker/

## Features

- Browse issues from any GitHub organization
- Filter issues by label
- Export filtered issues to JSON (for AI analysis)
- Works entirely client-side - no server needed
- Optional GitHub token for higher rate limits
- Organization and settings saved in browser localStorage

## Usage

1. Open the app in your browser
2. Enter a GitHub organization name (e.g., `strangerstudios`, `facebook`, `microsoft`)
3. (Optional) Enter a GitHub Personal Access Token for higher rate limits
4. Select a label filter from the dropdown
5. Click "Search Issues" to view results
6. Click "Export JSON" to download all matching issues

## GitHub Token (Optional)

Without a token, GitHub's API limits you to 60 requests/hour. With a token, you get 5000 requests/hour.

To create a token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name and select `public_repo` scope
4. Paste the token into the app

Your token is stored in your browser's localStorage only - it never leaves your machine.

## Export Format

The JSON export includes:

```json
{
  "label": "Type: Bug",
  "total": 23,
  "generated_at": "2026-04-02T07:00:00.000Z",
  "organization": "strangerstudios",
  "issues": [
    {
      "number": 123,
      "title": "Issue title",
      "url": "https://github.com/org/repo/issues/123",
      "labels": [{"name": "Type: Bug", "color": "ff0000"}],
      "created_at": "2026-03-01T00:00:00Z",
      "updated_at": "2026-03-02T00:00:00Z",
      "user": "username",
      "repo": "repo-name"
    }
  ]
}
```

This format is designed for passing to AI tools for analysis.

## Development

This is a static site - just open `index.html` in your browser, or serve it with any static file server.

To deploy to GitHub Pages:
1. Push to the `main` branch
2. Enable GitHub Pages in repo settings (Source: main branch, root folder)

## License

MIT
