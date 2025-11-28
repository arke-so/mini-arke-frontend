FROM node:20-slim
WORKDIR /usr/src/app
COPY . .

# Remove node_modules if the directory exists 
# (avoid issues during local builds)
RUN rm -rf node_modules

RUN npm install --legacy-peer-deps
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Set up a non-root user
RUN addgroup --gid 1500 arke && \
    adduser --home /arke -uid 1500 --gid 1500 arke && \
    chown arke:arke /arke

USER arke:arke

ENV BODY_SIZE_LIMIT=15M

ENTRYPOINT [ "npm", "run", "start" ] 