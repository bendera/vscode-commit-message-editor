FROM node:14

RUN npm i -g vsce@1

COPY "entrypoint.sh" "/entrypoint.sh"
ENTRYPOINT ["/entrypoint.sh"]
