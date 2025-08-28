#!/bin/bash

until nc -z -v -w30 postgres 5432; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up, running prisma migrate deploy"
npx prisma migrate deploy

npm run start:prod