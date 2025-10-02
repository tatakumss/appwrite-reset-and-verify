# 🔧 PediaHerb Password Reset Setup Guide

## Quick Setup Checklist

### 1. Deploy Your Webpages
- [ ] Upload `email-verification.html` and `password-reset.html` to your hosting service
- [ ] Note your domain URL (e.g., `https://yourdomain.com` or `https://username.github.io/repo-name`)

### 2. Update Mobile App Configuration
Edit `lib/services/auth_service.dart`:

```dart
// Line 131: Update the URL to match your deployment
url: 'https://YOUR-DOMAIN.com/password-reset.html',
```

**Replace `YOUR-DOMAIN.com` with your actual domain!**

### 3. Update Webpage Configuration
Edit `password-reset.html` (lines 301-303):

```javascript
// ⚙️ CONFIGURATION - Update these values
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';  // Keep as-is
const APPWRITE_PROJECT_ID = '68d4f15b002baad3b7f6';           // Keep as-is  
const RESET_REDIRECT_URL = window.location.origin + '/password-reset.html'; // Auto-detects
```

### 4. Configure Appwrite Console
1. Go to your Appwrite Console → Authentication → Settings
2. Set **Password Recovery URL**:
   ```
   https://YOUR-DOMAIN.com/password-reset.html?userId={{userId}}&secret={{secret}}
   ```
3. Set **Email Verification URL**:
   ```
   https://YOUR-DOMAIN.com/email-verification.html?userId={{userId}}&secret={{secret}}
   ```

## Common Deployment URLs

### GitHub Pages
- Format: `https://USERNAME.github.io/REPOSITORY-NAME`
- Example: `https://johndoe.github.io/pediaherb-auth`

### Netlify
- Format: `https://SITE-NAME.netlify.app`
- Example: `https://pediaherb-auth.netlify.app`

### Vercel
- Format: `https://PROJECT-NAME.vercel.app`
- Example: `https://pediaherb-auth.vercel.app`

### Custom Domain
- Format: `https://your-domain.com`
- Example: `https://auth.pediaherb.com`

## Testing Your Setup

### Test Password Reset Flow:
1. **Request Reset**: Use the mobile app's "Forgot Password" feature
2. **Check Email**: Look for reset email in inbox/spam
3. **Click Link**: Should open your password reset webpage
4. **Set Password**: Enter new password and confirm
5. **Success**: Should redirect back to mobile app

### Common Issues:

**❌ "Invalid verification link"**
- Check that URLs in Appwrite console match your deployment
- Verify webpage configuration variables are correct

**❌ "User not found"**
- Ensure the email address has a registered account
- Check Appwrite console for user existence

**❌ "Network error"**
- Check internet connection
- Verify Appwrite endpoint and project ID are correct

**❌ "Reset link expired"**
- Reset links expire after a certain time
- Request a new password reset

## File Locations to Update

```
📁 Mobile App
└── lib/services/auth_service.dart (line 131)

📁 Webpages  
├── password-reset.html (lines 301-303)
└── email-verification.html (lines similar)

📁 Appwrite Console
└── Authentication → Settings → URLs
```

## Security Notes

- Reset links are single-use and time-limited
- All communication uses HTTPS
- Passwords are validated on both client and server
- No sensitive data is stored in the webpages

## Support

If you encounter issues:
1. Check browser developer console for errors
2. Verify all URLs match exactly (including https://)
3. Test with a fresh incognito/private browser window
4. Check Appwrite console logs for authentication events

---

**✅ Once configured, your password reset system will work seamlessly between your mobile app and web interface!**
