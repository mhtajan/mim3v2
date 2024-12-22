# Use the official Node.js 22 image
FROM node:22.11.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the bot files
COPY . .

# Expose the port (if needed, depending on your bot's configuration)
EXPOSE 3000

# Define the command to start the bot
CMD ["node", "index.js"]
