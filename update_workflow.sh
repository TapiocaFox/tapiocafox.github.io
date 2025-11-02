#!/bin/bash

MIN=15
MAX=30
WORKFLOW_FILE=".github/workflows/trigger.yml"
oldmin=$(grep -E "cron:" "$WORKFLOW_FILE" | head -n1 | sed -E "s/cron: '([0-9]+) .*/\1/" | tr -dc '0-9')

echo "Old minute: $oldmin"
rand=$(( RANDOM % (MAX-MIN+1) + $MIN ))
newmin=$(( (oldmin + rand + 60) % 60 ))

echo "Random add: $rand"
echo "New minute: $newmin"

sed -i.bak -E "s/(cron: ')[0-5]?[0-9]( \* \* \* \*')/\1$newmin\2/" "$WORKFLOW_FILE"

echo "Updated cron line in $WORKFLOW_FILE"
