export const env = {
  firebase: {
    projectId: String(process.env.FIREBASE_PROJECT_ID),
    key: String(process.env.FIREBASE_PRIVATE_KEY),
    email: String(process.env.FIREBASE_CLIENT_EMAIL)
  }
}