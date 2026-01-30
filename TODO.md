# Cart Persistence Fix

## Problem
When users log out and log back in, their cart items disappear because the cart was only stored in localStorage and cleared on logout.

## Solution Implemented
- Added `cart` field to the User model in `backend/models/userModel.js`
- Modified `frontend/src/context/AuthContext.jsx` to remove cart clearing on logout
- Updated `frontend/src/context/CartContext.jsx` to:
  - Load cart from backend when user logs in
  - Sync cart changes to backend for logged-in users
  - Maintain localStorage for guest users
  - Merge guest cart with backend cart on login to preserve items added while logged out

## Changes Made
- [x] Added cart schema to User model
- [x] Removed cart clearing from AuthContext logout
- [x] Added backend sync functionality to CartContext
- [x] Added cart loading from backend on login
- [x] Added guest cart merging with backend cart on login

## Testing Required
- Test adding items to cart as guest user
- Test logging in and verifying cart persists
- Test logging out and verifying cart notification disappears
- Test logging out and logging back in
- Test cart sync when modifying items while logged in
- Test merging guest cart with backend cart on login

## Follow-up Steps
- Restart the backend server to apply model changes
- Test the functionality thoroughly
- Consider migrating existing user carts if any were stored elsewhere
