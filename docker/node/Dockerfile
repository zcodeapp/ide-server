FROM node:20.1.0

USER root

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
    && rm -rf /var/lib/{apt,dpkg,cache,log}/

WORKDIR /var/www

USER node

ENTRYPOINT ["/bin/bash"]
CMD ["-"]