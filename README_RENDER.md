# Deploying to Render

1. Create a new Web Service on Render (https://dashboard.render.com).

2. Connect your GitHub repo and select the repository containing this project.

3. Set the following build and start commands:

- Build Command: `npm install`
- Start Command: `node server.js`

4. Set the environment variables in Render's dashboard (Environment -> Environment Variables):

- CASHFREE_APP_ID
- CASHFREE_SECRET_KEY
- CASHFREE_ENV (set to 'production' for live)
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- FROM_EMAIL

5. Port: Render will provide `PORT` env var automatically. The app reads `process.env.PORT`.

6. (Optional) If you are serving static frontend from Vercel, you only need this backend for API and email.

7. After deploy, test the APIs:

- POST `https://<your-render-service>/api/create-order` with JSON `{ "email":"customer@example.com","amount":599 }`
- POST `https://<your-render-service>/api/send-book` with JSON `{ "email":"customer@example.com" }`
