FROM zcodeapp/ide-server

USER root

COPY test/github/entrypoint.sh /entrypoint.sh
COPY node_modules /var/www/node_modules
COPY dist /var/www/dist
COPY package.json /var/www

RUN mkdir -p /var/www /__w/_temp/_runner_file_commands \
    && chown node:node -R /__w \
    && chmod +w -R /__w \ 
    && apt-get update \
    && apt-get install git curl vim -y \
    && curl -sSL https://get.docker.com/ | sh \
    && usermod -aG docker node \
    && sed -i 's/docker:x:999:node/docker:x:998:node/g' /etc/group \
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf /var/lib/{apt,dpkg,cache,log}

USER node

ENTRYPOINT ["/entrypoint.sh"]