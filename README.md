# Campus Notification Practice Project

This repository is a practice implementation of a campus notification frontend. It is intentionally synthetic and does not include private assessment credentials, names, or protected endpoints.

## Structure

- `logging_middleware/` - reusable frontend logging helper.
- `notification_app_fe/` - React + TypeScript frontend.
- `notification_app_be/` - placeholder folder for the expected repository layout.
- `notification_system_design.md` - architecture and priority-ranking design.

## Run

```bash
cd notification_app_fe
npm install
npm run register
npm run dev
```

The frontend is configured to run on `http://localhost:3000`.

To connect to your own practice API, copy `.env.example` to `.env` inside `notification_app_fe` and fill in the values.

## Auth Setup

For protected APIs, configure either a ready token or the auth request values.

Option 1: paste an existing token:

```bash
VITE_AUTH_TOKEN=your_access_token
```

Option 2: let the app request the token:

```bash
VITE_REGISTER_API_URL=your_register_endpoint
VITE_AUTH_API_URL=your_auth_endpoint
VITE_NOTIFICATION_API_URL=your_notifications_endpoint
VITE_LOG_API_URL=your_logs_endpoint
VITE_AUTH_EMAIL=your_email
VITE_AUTH_NAME=your_name
VITE_AUTH_MOBILE_NO=your_mobile_number
VITE_AUTH_GITHUB_USERNAME=your_github_username
VITE_AUTH_ROLL_NO=your_roll_number
VITE_AUTH_ACCESS_CODE=your_access_code
VITE_AUTH_CLIENT_ID=your_client_id
VITE_AUTH_CLIENT_SECRET=your_client_secret
```

If `clientID` and `clientSecret` are not available yet, fill the registration fields and run:

```bash
npm run register
```

That command calls the registration endpoint once and writes `VITE_AUTH_CLIENT_ID` and `VITE_AUTH_CLIENT_SECRET` into your local `.env`.

Vite exposes frontend environment variables to the browser, so use these only for practice or test-server credentials.
