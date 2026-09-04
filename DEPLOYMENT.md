# Production container deployment

The root `Dockerfile` builds the React/CRACO frontend and packages its static
output with the FastAPI backend. The final image contains Python and the seven
backend runtime packages only; Node, Yarn, compilers, tests, source maps, and
frontend development dependencies remain in the build stage.

## Build

The default, recommended build uses same-origin API requests:

```sh
docker build --tag cgreen-web:latest .
```

If the backend is deliberately hosted on another origin, its public URL can be
compiled into the browser bundle. This value is public and must not contain a
secret:

```sh
docker build \
  --build-arg REACT_APP_BACKEND_URL=https://api.example.com \
  --tag cgreen-web:latest .
```

## Runtime configuration

Required variables (the service exits immediately with a clear error if any is
missing):

- `MONGO_URL`: MongoDB connection URI. Treat it as a secret.
- `DB_NAME`: MongoDB database name.
- `CORS_ORIGINS`: comma-separated browser origins, for example
  `https://cgreen.in,https://www.cgreen.in`. Do not use `*`.

Contact-form email (Zoho SMTP). Without these the form still saves to MongoDB,
but no notification is sent:

- `SMTP_HOST`: `smtp.zoho.in` for an India-region Zoho account, otherwise
  `smtp.zoho.com`.
- `SMTP_PORT`: `465` for implicit TLS (default) or `587` for STARTTLS.
- `SMTP_USER`: the Zoho mailbox, `info@cgreen.in`.
- `SMTP_PASSWORD`: a Zoho **app-specific password**, not the account login
  password. Treat it as a secret. Generate it under Zoho Mail > My Account >
  Security > App Passwords.
- `SENDER_EMAIL`: From address; defaults to `SMTP_USER`. Zoho rejects any
  address the authenticated user does not own.
- `SENDER_NAME`: display name on the From header; defaults to `CGreen Website`.
- `NOTIFY_EMAIL`: notification recipient; defaults to `info@cgreen.in`.
  Accepts a comma-separated list to notify several inboxes.

Other optional variables:

- `RESEND_API_KEY`: alternative email transport, tried only when SMTP is
  unconfigured or its send fails.
- `PORT`: listening port inside the container; defaults to `8080`.
- `WEB_CONCURRENCY`: Uvicorn worker count; defaults to `1`. Increase only after
  accounting for available memory and MongoDB connection capacity.

Example (prefer a server secret manager or an untracked env file in real use):

```sh
docker run --detach \
  --name cgreen-web \
  --restart unless-stopped \
  --publish 8080:8080 \
  --env MONGO_URL='mongodb://mongo-host:27017' \
  --env DB_NAME='cgreen' \
  --env CORS_ORIGINS='https://cgreen.in,https://www.cgreen.in' \
  --env SMTP_HOST='smtp.zoho.in' \
  --env SMTP_PORT='465' \
  --env SMTP_USER='info@cgreen.in' \
  --env SMTP_PASSWORD='replace-with-zoho-app-password' \
  cgreen-web:latest
```

The container exposes HTTP on port `8080` and provides its health endpoint at
`/api/`. Terminate TLS at the server load balancer or reverse proxy and forward
traffic to the container. MongoDB is an external required service and is not
embedded in this image.
