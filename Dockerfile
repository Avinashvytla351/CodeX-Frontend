# Use an official Node.js runtime as a base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Set environment variable for the app to run on port 4000
ENV PORT=4000

# Expose port 4000
EXPOSE 4000

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY package-lock.json ./

# Install app dependencies
RUN npm install --silent

# Install react-scripts globally
RUN npm install react-scripts@5.0.1 -g --silent

# Copy the entire application code to the working directory
COPY . ./

# Command to run the app
CMD ["npm", "start"]
