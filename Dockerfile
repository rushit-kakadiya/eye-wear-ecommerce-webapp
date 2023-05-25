FROM node:12.19.0

# Create app directory
WORKDIR /usr/src/app

# environment variables
ENV NODE_ENV=sandbox

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3008
CMD [ "node", "src/server.js" ]