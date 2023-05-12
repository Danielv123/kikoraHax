FROM node:alpine

# Copy the project into the container
COPY . /app
WORKDIR /app

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 8080

# Run the app
CMD ["npm", "start"]
