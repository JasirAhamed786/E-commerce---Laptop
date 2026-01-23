# Fix Duplicate Add to Cart Notifications

## Issue
User reported getting duplicate notifications when clicking "add to cart" on both shop page and product detail page.

## Root Cause
There were two `<Toaster />` components in the app:
- One in `frontend/src/main.jsx`
- One in `frontend/src/App.jsx`

This caused every toast to be displayed twice.

## Solution
Removed the duplicate `<Toaster />` from `App.jsx`, keeping only the one in `main.jsx`.

## Changes Made
- [x] Removed `<Toaster />` import and component from `frontend/src/App.jsx`

## Testing
- Verify that clicking "add to cart" on shop page shows only one notification
- Verify that clicking "add to cart" on product detail page shows only one notification
- Ensure toast functionality still works for other notifications (login, etc.)
