// Original file : https://github.com/PretendoNetwork/website/blob/master/src/cache.js.
// Slightly modified to work with Link-3DS organization.

const { GraphQLClient, gql } = require('graphql-request');
const logger = require('./logger');
const config = require('./config.json');

const github = new GraphQLClient('https://api.github.com/graphql', {
	headers: {
		Authorization: `bearer ${config.graphql_token}`,
	}
});

const getProjectsV2GQL = gql`
query getProjectsV2($orgName: String!, $cursor: String!) {
	organization(login: $orgName) {
		projectsV2(first: 10, after: $cursor) {
			nodes {
				id
				title
				repositories(first: 1) {
					nodes {
						url
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
}
`;

const getProjectsV2FieldsGQL = gql`
query getProjectsV2Fields($id: ID!, $cursor: String!) {
    node(id: $id) {
		... on ProjectV2 {
			items(first: 10, after: $cursor) {
				nodes {
					content {
						... on DraftIssue {
							title
						}
						... on Issue {
							title
						}
					}
					fieldValues(first: 20) {
						nodes {
							... on ProjectV2ItemFieldSingleSelectValue {
								name
								field {
									... on ProjectV2SingleSelectField {
										name
									}
								}
							}
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}
}
`;

let githubProjectsCache = {
	update_time: 0,
	sections: []
};

let githubCacheBeingFetched = false;

async function getGitHubProjectsV2(after='') {
	let projects = [];

	const data = await github.request(getProjectsV2GQL, {
		orgName: 'Link-3DS',
		cursor: after
	});

	for (const node of data.organization.projectsV2.nodes) {
		projects.push({
			id: node.id,
			title: node.title,
			url: node.repositories.nodes[0]?.url || `https://github.com/Link-3DS/${node.title}`,
		});
	}

	const { hasNextPage, endCursor } = data.organization.projectsV2.pageInfo;

	if (hasNextPage) {
		const nextPage = await getGitHubProjectsV2(endCursor);
		projects = [...projects, ...nextPage];
	}

	return projects;
}

async function getGitHubProjectsV2Fields(id, after='') {
	let fields = [];

	const data = await github.request(getProjectsV2FieldsGQL, {
		id: id,
		cursor: after
	});

	for (const node of data.node.items.nodes) {
		fields.push({
			title: node.content.title,
			column: node.fieldValues.nodes.find(fieldValue => fieldValue.field?.name === 'Status')?.name
		});
	}

	const { hasNextPage, endCursor } = data.node.items.pageInfo;

	if (hasNextPage) {
		const nextPage = await getGitHubProjectsV2Fields(id, endCursor);
		fields = [...fields, ...nextPage];
	}

	return fields;
}

async function getGithubProjectsCache() {
	if (githubCacheBeingFetched) {
		return githubProjectsCache;
	}

	try {
		if (!githubCacheBeingFetched && githubProjectsCache.update_time < Date.now() - (1000 * 60 * 60)) {
			githubCacheBeingFetched = true;
			githubProjectsCache = await updateGithubProjectsCache();
		}
	} catch (error) {
		logger.error(error);
	} finally {
		githubCacheBeingFetched = false;
	}

	return githubProjectsCache;
}

async function updateGithubProjectsCache() {
	const projectsCacheData = {
		update_time: Date.now(),
		sections: []
	};

	const projects = await getGitHubProjectsV2();

	for (const project of projects) {
		if (!project.url) {
			continue;
		}

		const extractedData = {
			title: project.title,
			url: project.url,
			cards: {
				done: [],
				in_progress: [],
				todo: []
			}
		};

		const fields = await getGitHubProjectsV2Fields(project.id);

		for (const field of fields) {
			extractedData.cards[field.column.toLowerCase().replace(' ', '_')]?.push(field.title);
		}

		projectsCacheData.sections.push(extractedData);
	}

	return projectsCacheData;
}

module.exports = {
	getGithubProjectsCache
};