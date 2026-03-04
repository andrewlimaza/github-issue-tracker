require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = 'strangerstudios';

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/issues', async (req, res) => {
    const { label } = req.query;
    const LIMIT = 50;

    try {
        const repos = await fetchAllRepos();
        const reposWithIssues = repos.filter(r => r.open_issues > 0);
        const allIssues = [];
        
        const batchSize = 5;
        for (let i = 0; i < reposWithIssues.length && allIssues.length < LIMIT; i += batchSize) {
            const batch = reposWithIssues.slice(i, i + batchSize);
            
            const promises = batch.map(repo => 
                fetchIssuesByLabel(repo.name, label, LIMIT)
                    .catch(err => {
                        console.error(`Error fetching issues for ${repo.name}:`, err.message);
                        return [];
                    })
            );
            
            const results = await Promise.all(promises);
            results.forEach(issues => allIssues.push(...issues));
        }

        allIssues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const limitedIssues = allIssues.slice(0, LIMIT);

        res.json({ 
            issues: limitedIssues, 
            total: allIssues.length,
            showing: limitedIssues.length 
        });
    } catch (error) {
        console.error('Error fetching issues:', error.message);
        res.status(500).json({ error: error.message });
    }
});

async function fetchAllRepos() {
    const repos = [];
    let page = 1;
    const perPage = 100;

    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Issue-Crawler'
    };

    if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    while (true) {
        const response = await axios.get(`https://api.github.com/orgs/${ORG_NAME}/repos`, {
            params: {
                type: 'public',
                per_page: perPage,
                page: page
            },
            headers
        });

        const data = response.data;
        repos.push(...data);

        if (data.length < perPage) {
            break;
        }
        page++;
    }

    return repos
        .map(repo => ({
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            open_issues: repo.open_issues_count,
            pushed_at: repo.pushed_at
        }))
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
}

async function fetchIssuesByLabel(repoName, label, limit = 100) {
    const params = {
        state: 'open',
        per_page: Math.min(100, limit),
        sort: 'created',
        direction: 'desc'
    };

    if (label && label !== 'all') {
        params.labels = label;
    }

    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Issue-Crawler'
    };

    if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await axios.get(`https://api.github.com/repos/${ORG_NAME}/${repoName}/issues`, {
        params,
        headers
    });

    return response.data.slice(0, limit).map(issue => ({
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        labels: issue.labels.map(l => ({ name: l.name, color: l.color })),
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        user: issue.user.login,
        repo: repoName
    }));
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Organization: ${ORG_NAME}`);
    console.log(`GitHub Token: ${GITHUB_TOKEN ? 'Configured' : 'Not configured'}`);
});
