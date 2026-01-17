#!/bin/bash
# Script to update transcripts from ChatPRD/lennys-podcast-transcripts

set -e

echo "Pulling latest transcripts from ChatPRD/lennys-podcast-transcripts..."

# Remove old data and clone fresh
rm -rf data
git clone --depth 1 https://github.com/ChatPRD/lennys-podcast-transcripts.git data
rm -rf data/.git

echo "Done! Transcripts updated."
echo "Episode count: $(ls data/episodes | wc -l)"
