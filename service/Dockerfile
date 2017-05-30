FROM node:latest

MAINTAINER Andrew Branch <andrew@wheream.io>

# Install yarn
RUN apt-get update && \
    apt-get install apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install yarn

# Create directories on container
RUN mkdir -p /var/www /tmp
WORKDIR /var/www

# Install node modules
COPY package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN cp -a /tmp/node_modules ./

# Copy app from host to container
COPY . ./

# Build TypeScript project
RUN npm run build

# Start the app
EXPOSE 3000
CMD ["npm", "start"]