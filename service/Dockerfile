FROM node:latest

MAINTAINER Andrew Branch <andrew@wheream.io>

# Create directories on container
RUN mkdir -p /var/www /tmp
WORKDIR /var/www

# Install node modules
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules ./

# Copy app from host to container
COPY . ./

# Start the app
EXPOSE 3000
CMD ["npm", "start"]