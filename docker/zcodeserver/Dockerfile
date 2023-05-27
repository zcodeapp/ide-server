FROM node:20.1.0

USER root

RUN mkdir -p /var/www

COPY node_modules /var/www/node_modules
COPY dist /var/www/dist
COPY package.json /var/www

WORKDIR /var/www

USER node

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["dist/main.js"]