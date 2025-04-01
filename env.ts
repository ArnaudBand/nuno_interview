export const env = {
  firebase: {
    projectId: String(process.env.FIREBASE_PROJECT_ID),
    key: String(process.env.FIREBASE_PRIVATE_KEY),
    email: String(process.env.FIREBASE_CLIENT_EMAIL)
  },
  google: {
    key: String(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  },
  vapi: {
    key: String(process.env.NEXT_PUBLIC_VAPI_API_KEY),
    workflow: String(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID)
  },
}