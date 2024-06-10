#!/bin/sh

apt update
apt install -y curl

until curl -sSf http://localhost:8080/ > /dev/null; do
  echo "Waiting for Keycloak to be ready..."
  sleep 5
done

echo "Keycloak is ready. Starting Flask application."

gunicorn -w 4 -b 0.0.0.0:5001 app:app