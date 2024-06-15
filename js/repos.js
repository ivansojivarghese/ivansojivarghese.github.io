
import { Octokit } from "https://esm.sh/@octokit/rest";

const octokit = new Octokit(); // REFERENCE: https://github.com/octokit/rest.js

// Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
octokit.rest.repos
    .listForOrg({
        org: "octokit",
        type: "public",
    })
    .then(({ data }) => {
        // handle data
    });

