FROM node:20.1.0-alpine3.17

USER root

RUN mkdir -p /var/www \
    && apk add --no-cache git


WORKDIR /var/www

USER node

ENTRYPOINT ["/bin/sh"]
CMD ["-"]