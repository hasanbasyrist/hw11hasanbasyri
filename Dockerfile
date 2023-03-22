# Use Node.js 14 as base image
FROM node:14

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_DATABASE=database_name
ENV DB_USERNAME=database_username
ENV DB_PASSWORD=database_password

# Expose port 3000 for the app
EXPOSE 3000

# Start the app with npm
CMD ["npm", "start"]
