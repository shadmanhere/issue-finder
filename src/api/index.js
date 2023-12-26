import axios from 'axios';

// Api calls to github https://docs.github.com/en/rest/issues/issues

// fetchIssues('org/repo', 'filters');
// sample url to search repo issue by label - https://api.github.com/repos/chatwoot/chatwoot/issues?labels=good%20first%20issue
const API = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json'
    // Before running npm start, run
    // export REACT_APP_API_KEY=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
    // Except with your own key generated here https://github.com/settings/tokens
  }
});
const reposList =
  process.env.REACT_APP_REPOS_LIST_URL ||
  'https://raw.githubusercontent.com/shadmanhere/ycombinator_githubs/main/06_repos.json';

export const fetchRepos = async () => await axios.get(reposList);
export const fetchLabels = async (org, repo, access_token) =>
  await API.get(`/repos/${org}/${repo}/labels`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${access_token}`
    }
  });

export const fetchIssues = async (org, repo, label, access_token) =>
  await API.get(`/repos/${org}/${repo}/issues?labels=${label}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${access_token}`
    }
  });

export const getGitHubAuthKey = async (code) =>
  await axios.post('https://issue-finder-auth.vercel.app/api/', {
    code
  });
