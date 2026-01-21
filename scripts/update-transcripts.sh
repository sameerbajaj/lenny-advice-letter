#!/bin/bash
# Script to update transcripts from ChatPRD/lennys-podcast-transcripts
# Run this periodically to get new episodes

set -e

echo "🔄 Pulling latest transcripts from ChatPRD/lennys-podcast-transcripts..."

# Remove old data and clone fresh
rm -rf data
git clone --depth 1 https://github.com/ChatPRD/lennys-podcast-transcripts.git data
rm -rf data/.git

# Count episodes
EPISODE_COUNT=$(find data/episodes -name "transcript.md" | wc -l | tr -d ' ')

echo ""
echo "✅ Done! Transcripts updated."
echo "📊 Episode count: $EPISODE_COUNT"
echo ""
echo "⚠️  Remember to update episode count in these files if it changed:"
echo "   - app/page.tsx (footer)"
echo "   - components/LoadingState.tsx"
echo "   - README.md"
