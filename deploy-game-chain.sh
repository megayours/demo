#!/bin/bash

# Run the chr deployment create command
output=$(chr deployment create \
  --network devnet1 \
  --blockchain game \
  --secret .secret \
  -y)

# Extract the chain ID from the output
chain_id=$(echo "$output" | grep -oP '(?<=game: x")[^"]*')

if [ -z "$chain_id" ]; then
  echo "Failed to extract chain ID from output"
  exit 1
fi

# Update the chromia.yml file
if [ -f "chromia.yml" ]; then
  yq e ".deployments.devnet1.chains.game = \"$chain_id\"" -i chromia.yml
  echo "Updated chromia.yml with new chain ID: $chain_id"
else
  echo "chromia.yml not found. Creating new file."
  echo "deployments:
  devnet1:
    chains:
      game: \"$chain_id\"" > chromia.yml
fi

echo "Deployment and configuration update complete."