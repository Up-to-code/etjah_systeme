#!/bin/bash

# Check if Prisma Client exists
if [ ! -d "node_modules/@prisma/client" ]; then
  # If not, generate Prisma Client
  echo "Generating Prisma Client..."
  prisma generate
fi

# Now run the build command
bun run build
