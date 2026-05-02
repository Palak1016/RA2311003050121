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
npm run dev
```

The frontend is configured to run on `http://localhost:3000`.

To connect to your own practice API, copy `.env.example` to `.env` inside `notification_app_fe` and fill in the values.

