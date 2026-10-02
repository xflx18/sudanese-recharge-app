# Sudanese Recharge App

A complete Arabic recharge application for games and subscriptions built with Node.js and Express.

## Features
- Arabic landing page for games and subscription services
- Recharge order form with validation
- Service categories: games, subscriptions, streaming
- Admin page to view incoming orders
- Local storage/order persistence in JSON file

## Quick start

```bash
npm install
npm start
```

Then open:
- Home: http://localhost:3000/
- Admin: http://localhost:3000/admin

## Project structure

```text
.
├── public/
│   ├── admin.html
│   ├── admin.js
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── data/
│   └── orders.json
├── package.json
├── server.js
└── README.md
```

## Notes
This version is a functional MVP for a Sudanese recharge platform and can be extended later with a database, authentication, and payment integration.
