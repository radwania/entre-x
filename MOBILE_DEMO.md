# 📱 Mobile Demo Guide - Canadian Road Weather App

## Quick Start for Samsung S24 Plus

### Method 1: Physical Device (Recommended)

1. **Start the dev server on your laptop:**
   ```bash
   npm run dev
   ```

2. **Find your laptop's IP address:**
   - Linux: `hostname -I | awk '{print $1}'`
   - Mac: `ipconfig getifaddr en0`
   - Windows: `ipconfig` (look for IPv4 Address)

3. **On your Samsung S24 Plus:**
   - Connect to the **same WiFi network** as your laptop
   - Open Chrome browser
   - Go to: `http://YOUR_LAPTOP_IP:3000`
   - Example: `http://192.168.1.100:3000`

---

### Method 2: Android Studio Emulator

1. **Open Android Studio** and start an Android Virtual Device (AVD)

2. **Start the dev server on your laptop:**
   ```bash
   npm run dev
   ```

3. **In the Android emulator:**
   - Open Chrome browser
   - Navigate to: `http://10.0.2.2:3000`
   - (10.0.2.2 is the special address that points to your laptop from the emulator)

---

### Method 3: Use ngrok (Access from Anywhere)

If WiFi network blocks device communication:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **In a new terminal, run:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Open that URL on any device** - works from anywhere!

---

## Troubleshooting

### Can't connect from phone to laptop?

- ✅ Verify both devices are on the **same WiFi network**
- ✅ Check if your laptop's firewall is blocking port 3000
- ✅ Try disabling VPN on your laptop if running
- ✅ Some public/corporate WiFi networks block device-to-device communication
- ✅ Try creating a mobile hotspot from your phone and connect your laptop to it

### Android Emulator can't connect?

- ✅ Make sure you're using `10.0.2.2:3000` (not localhost or 127.0.0.1)
- ✅ Verify dev server is running
- ✅ Try restarting the emulator

### Firewall Issues on Linux?

```bash
# Allow port 3000 through firewall
sudo ufw allow 3000/tcp
```

### Firewall Issues on Windows?

```powershell
# Allow port 3000 through Windows Firewall
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3000
```

---

## Testing Checklist

Once the app loads on your mobile device:

- [ ] Try the "Load Sample Route" button
- [ ] Search for a city (e.g., "Toronto, ON")
- [ ] Add a waypoint
- [ ] Click "Get Weather Along Route"
- [ ] Check if map displays correctly
- [ ] Test weather markers by clicking on them
- [ ] Verify the app is responsive on mobile screen
- [ ] Try zooming/panning the map with touch gestures

---

## Notes

- This is a **web app**, not a native Android app
- No need to build anything in Android Studio
- The app is fully responsive and works great on mobile browsers
- For production, consider deploying to Vercel for a permanent URL
