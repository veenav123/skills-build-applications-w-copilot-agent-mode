#!/bin/bash

# MongoDB Verification Script for OctoFit Tracker
# This script verifies that MongoDB is running and accessible

echo "=== MongoDB Status Check ==="
echo ""

# Check if Docker container is running
CONTAINER_STATUS=$(docker ps --filter "name=mongodb" --filter "status=running" --quiet)

if [ -z "$CONTAINER_STATUS" ]; then
    echo "❌ MongoDB container is NOT running"
    echo ""
    echo "To start MongoDB, run:"
    echo "  docker start mongodb"
    exit 1
else
    echo "✓ MongoDB container is running"
    CONTAINER_ID=$CONTAINER_STATUS
    echo "  Container ID: $CONTAINER_ID"
fi

echo ""

# Check if port 27017 is listening
if netstat -tlnp 2>/dev/null | grep -q 27017 || ss -tlnp 2>/dev/null | grep -q 27017; then
    echo "✓ Port 27017 is listening"
else
    echo "❌ Port 27017 is NOT listening"
    exit 1
fi

echo ""

# Test MongoDB connection
echo "Testing MongoDB connection..."
PING_RESULT=$(docker exec mongodb mongosh --eval "db.adminCommand('ping')" --username admin --password password --authenticationDatabase admin 2>&1)

if echo "$PING_RESULT" | grep -q "ok.*1"; then
    echo "✓ MongoDB is responding to connections"
else
    echo "❌ MongoDB is NOT responding"
    echo "Response: $PING_RESULT"
    exit 1
fi

echo ""

# Get MongoDB version
VERSION=$(docker exec mongodb mongosh --eval "print(db.version())" --username admin --password password --authenticationDatabase admin 2>&1)
echo "✓ MongoDB Version: $VERSION"

echo ""
echo "=== Connection Details ==="
echo "Host: localhost"
echo "Port: 27017"
echo "Username: admin"
echo "Password: password"
echo "Authentication Database: admin"
echo ""
echo "MongoDB URI for Django:"
echo "mongodb://admin:password@localhost:27017/octofit?authSource=admin"
echo ""
echo "All checks passed! ✓"
