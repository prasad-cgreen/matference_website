# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS frontend-build

WORKDIR /build/frontend

# Yarn is used because package.json contains Yarn-specific "resolutions".
RUN npm install --global yarn@1.22.22

COPY frontend/package.json frontend/yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --non-interactive

COPY frontend/craco.config.js frontend/postcss.config.js frontend/tailwind.config.js ./
COPY frontend/jsconfig.json ./
COPY frontend/plugins ./plugins
COPY frontend/public ./public
COPY frontend/src ./src

# CRA variables are compiled into the browser bundle and are never secrets.
# Empty means that the browser calls the API on the same origin as the website.
ARG REACT_APP_BACKEND_URL=""
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL} \
    CI=true \
    GENERATE_SOURCEMAP=false

RUN yarn build


FROM python:3.12-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8080 \
    WEB_CONCURRENCY=1 \
    STATIC_DIR=/app/static

WORKDIR /app

RUN groupadd --system --gid 10001 cgreen \
    && useradd --system --uid 10001 --gid cgreen --no-create-home --home-dir /app cgreen

COPY backend/requirements.prod.txt ./requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --requirement requirements.txt

COPY --chown=cgreen:cgreen backend/server.py ./server.py
COPY --from=frontend-build --chown=cgreen:cgreen /build/frontend/build ./static

USER cgreen

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD python -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.environ['PORT'] + '/api/', timeout=2)" || exit 1

CMD ["sh", "-c", "exec uvicorn server:app --host 0.0.0.0 --port \"${PORT}\" --workers \"${WEB_CONCURRENCY}\" --no-server-header"]
