#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   🚗 Canadian Road Weather App - Mobile Demo           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Get IP address
IP=$(hostname -I | awk '{print $1}' 2>/dev/null || ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -1)

echo "📱 DEMO ON PHYSICAL SAMSUNG S24 PLUS:"
echo "   1. Connect your phone to the same WiFi as this laptop"
echo "   2. Open Chrome browser on your phone"
echo "   3. Navigate to: http://${IP}:3000"
echo ""
echo "🖥️  DEMO ON ANDROID STUDIO EMULATOR:"
echo "   1. Start an Android emulator in Android Studio"
echo "   2. Open Chrome in the emulator"
echo "   3. Navigate to: http://10.0.2.2:3000"
echo ""
echo "💻 DEMO ON THIS LAPTOP:"
echo "   Open browser and go to: http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting development server..."
echo ""

npm run dev
