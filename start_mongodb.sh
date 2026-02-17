#!/bin/bash

# MongoDB Startup Script for OctoFit Tracker
# This script starts the MongoDB container and ensures it persists

set -e

echo "Starting MongoDB for OctoFit Tracker..."

# Check if container already exists
if docker ps -a --filter "name=mongodb" --filter "status=exited" --quiet > /dev/null; then
    echo "Found stopped MongoDB container, starting it..."
    docker start mongodb
    sleep 3
elif docker ps --filter "name=mongodb" --filter "status=running" --quiet > /dev/null; then
    echo "MongoDB is already running"
    exit 0
else
    echo "Creating new MongoDB container..."
    docker run -d \
        --name mongodb \
        --restart unless-stopped \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        -v mongodb_data:/data/db \
        -v mongodb_config:/data/configdb \
        mongo:latest
    
    echo "Waiting for MongoDB to be ready..."
    sleep 5
fi

# Verify MongoDB is running
if docker exec mongodb mongosh --eval "db.adminCommand('ping')" --username admin --password password --authenticationDatabase admin > /dev/null 2>&1; then
    echo "✓ MongoDB is running and ready!"
    echo ""
    echo "Connection details:"
    echo "  Host: localhost"
    echo "  Port: 27017"
    echo "  Username: admin"
    echo "  Password: password"
    echo "  URI: mongodb://admin:password@localhost:27017/octofit?authSource=admin"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi
