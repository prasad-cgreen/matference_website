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

Optional variables:

- `RESEND_API_KEY`: enables contact-form email notifications. Without it,
  submissions are still saved to MongoDB and a warning is logged.
- `SENDER_EMAIL`: verified Resend sender; defaults to `onboarding@resend.dev`.
- `NOTIFY_EMAIL`: notification recipient; defaults to `info@cgreen.in`.
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
  --env RESEND_API_KEY='replace-with-secret' \
  cgreen-web:latest
```

The container exposes HTTP on port `8080` and provides its health endpoint at
`/api/`. Terminate TLS at the server load balancer or reverse proxy and forward
traffic to the container. MongoDB is an external required service and is not
embedded in this image.
