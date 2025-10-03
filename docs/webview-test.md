# WebView Testing Checklist

## Manual Test Checklist

### 1. App Launch & Loading
- [ ] App launches with splash screen
- [ ] WebView loads the configured URL (check logs for `wv_load_start`)
- [ ] Loading indicator shows while page loads
- [ ] Page loads successfully (check logs for `wv_load_finish`)
- [ ] No configuration errors on startup

### 2. Navigation Testing
- [ ] Navigate within the website (internal links)
- [ ] Android back button behavior:
  - [ ] On internal pages → goes back within WebView
  - [ ] On site root → shows exit prompt
  - [ ] Double back press → exits app
- [ ] Pull-to-refresh reloads the page
- [ ] External links open in system browser

### 3. File Upload & Media
- [ ] File upload forms work (if site has them)
- [ ] Camera permission requested when needed
- [ ] Photo picker opens for file selection
- [ ] Uploads complete successfully

### 4. Error Handling
- [ ] Offline test: Toggle Airplane mode before launch
  - [ ] Native error state appears
  - [ ] Error message is clear
  - [ ] Retry button works when back online
- [ ] Network errors show retry option
- [ ] Invalid URLs show configuration error

### 5. JavaScript Error Forwarding
- [ ] JS errors from the website are logged
- [ ] Check console for `js_error_forwarded` logs
- [ ] Unhandled promise rejections are captured
- [ ] Error details include URL and stack trace

### 6. Performance & Logging
- [ ] App starts quickly (check `app_start` log)
- [ ] WebView loads in reasonable time
- [ ] All navigation events are logged
- [ ] No memory leaks during extended use
- [ ] Smooth scrolling and interactions

## Expected Log Events

When testing, you should see these structured JSON logs:

```json
{"event":"app_start","ts":"2024-01-15T10:30:00.000Z","level":"info","meta":{"timestamp":"2024-01-15T10:30:00.000Z"}}
{"event":"wv_load_start","ts":"2024-01-15T10:30:01.000Z","level":"info","meta":{"url":"https://***.vercel.app/"}}
{"event":"wv_load_finish","ts":"2024-01-15T10:30:03.000Z","level":"info","meta":{"url":"https://***.vercel.app/"}}
{"event":"nav_back","ts":"2024-01-15T10:30:05.000Z","level":"info","meta":{"action":"webview_back"}}
{"event":"external_link_opened","ts":"2024-01-15T10:30:07.000Z","level":"info","meta":{"url":"https://external-site.com"}}
```

## Troubleshooting

### App Won't Start
- Check `.env` file has valid HTTPS URL
- Verify `EXPO_PUBLIC_APP_URL` is set correctly
- Check console for configuration errors

### WebView Won't Load
- Verify website URL is accessible in browser
- Check network connectivity
- Look for `wv_error` logs with details

### Navigation Issues
- Test back button behavior on different pages
- Verify external links open in browser
- Check `nav_back` logs for expected behavior

### File Upload Problems
- Ensure camera permissions are granted
- Test with different file types
- Check if website supports file uploads

## Notes

- This is a WebView wrapper - push notifications and offline functionality require additional setup
- Deep linking and background tasks need separate configuration
- Performance depends on the website's mobile optimization
- Some advanced web features may not work in WebView context
