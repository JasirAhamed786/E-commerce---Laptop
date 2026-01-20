# Profile Picture Persistence Fix

## Completed Tasks
- [x] Identified the issue: getUserProfile endpoint missing profilePicture in response
- [x] Added profilePicture to getUserProfile response in authController.js
- [x] Added profilePicture to updateUserProfile response in authController.js

## Summary
The profile picture was disappearing on refresh because the getUserProfile API endpoint (used for token verification on app load) did not include the profilePicture field in its response. This caused the AuthContext to overwrite the localStorage user data without the profilePicture, even though it was stored in the database.

## Changes Made
- Modified `backend/controllers/authController.js` to include `profilePicture: user.profilePicture` in both getUserProfile and updateUserProfile responses.

## Testing
- Upload a profile picture
- Refresh the page
- Verify the profile picture persists

# Product Images Fix

## Completed Tasks
- [x] Identified the issue: Seeder using imageURL instead of image field
- [x] Fixed seeder to use 'image' field
- [x] Updated ShopPage to use product.image directly instead of /uploads/ prefix

## Summary
Product images were not showing because the seeder was setting 'imageURL' but the model expects 'image'. Additionally, the ShopPage was prefixing the image URL with /uploads/, but since the seeder uses external Unsplash URLs, it should use the image directly.

## Changes Made
- Modified `backend/data/seed.js` to set 'image' instead of 'imageURL'
- Modified `frontend/src/components/ShopPage.jsx` to use `src={product.image}` instead of `src={`http://192.168.176.185:5000/uploads/${product.image}`}`

## Testing
- Run the seeder to populate products with images
- Visit the shop page
- Verify product images load from Unsplash
