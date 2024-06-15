
import { Octokit } from "https://esm.sh/@octokit/rest";

// const octokit = new Octokit(); // REFERENCE: https://github.com/octokit/rest.js
const octokit = new Octokit();

// Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
octokit.rest.repos
    .listForOrg({
        org: "octokit",
        type: "public",
    })
    .then(({ data }) => {
        // handle data

        
    });

await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/status', {
    owner: 'ivansojivarghese',
    repo: 'ivansojivarghese.github.io',
    ref: 'c1dc3b188e2ed1193b8dd209432cc9880aa233e0',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
});

