# Firebase Storage Security Rules

## Recommended Rules for ID Photo Uploads

Copy and paste these rules into your Firebase Console:
1. Go to Firebase Console > Storage > Rules
2. Replace the existing rules with the rules below
3. Click "Publish"

## Rules (Public Access - No Authentication Required)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to id-photos folder
    // No authentication required - Storage rules handle access
    match /id-photos/{deviceId}/{fileName} {
      allow read: if true;  // Public read access
      allow write: if request.resource.size < 15 * 1024 * 1024  // 15MB limit
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## More Secure Rules (Optional - If You Want Authentication)

If you want to add authentication later, you can use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ID photos folder - requires authentication
    match /id-photos/{deviceId}/{fileName} {
      // Allow read if authenticated
      allow read: if request.auth != null;
      
      // Allow write if:
      // 1. Authenticated
      // 2. File size < 15MB
      // 3. Content type is an image
      allow write: if request.auth != null
                   && request.resource.size < 15 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing the Rules

After publishing the rules, test them:

1. Try uploading an image - should succeed
2. Try uploading a file > 15MB - should fail
3. Try uploading a non-image file - should fail
4. Try accessing other paths - should fail

## Notes

- **File Size Limit**: 15MB (15 * 1024 * 1024 bytes)
- **Allowed Content Types**: Any image type (image/*)
- **Folder Structure**: `id-photos/{deviceId}/{timestamp}-{originalFileName}`
- **Authentication**: No authentication required (Storage rules handle access)
- **Security**: Rules restrict access to only the `id-photos/` folder

## Production Considerations

For production, consider:
1. Adding rate limiting (via Cloud Functions or App Check)
2. Implementing file validation (check actual image dimensions)
3. Adding virus scanning (via Cloud Functions)
4. Using App Check to prevent abuse
5. Implementing proper user authentication if needed

