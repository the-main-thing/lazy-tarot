import {defineCliConfig} from 'sanity/cli'

const {projectId, dataset} = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: 'production',
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
