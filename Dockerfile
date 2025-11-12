# Use an official lightweight Node.js 16 image
# FROM node:16-alpine
FROM --platform=linux/amd64 node:19-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install --production

# Optionally capture build-time env values; override by passing --build-arg
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ARG NEXT_PUBLIC_ENV=production
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
# Copy local code to the container
COPY . .

# Build the application
RUN yarn build

# Expose the application on port 3000
EXPOSE 3000

# Expose the application on port 8000
EXPOSE 8000




# Start the application
CMD ["yarn", "start"]
