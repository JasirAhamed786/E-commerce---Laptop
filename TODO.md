# TODO: Implement Cart Persistence Across Sessions

## Backend Changes
- [ ] Add cart array to userModel.js
- [ ] Create backend/controllers/cartController.js with CRUD operations
- [ ] Create backend/routes/cartRoutes.js for API endpoints
- [ ] Update backend/server.js to include cart routes

## Frontend Changes
- [ ] Modify frontend/src/context/CartContext.jsx to sync with backend when logged in
- [ ] Remove cart clearing from logout in frontend/src/context/AuthContext.jsx

## Testing
- [ ] Test cart persistence across login/logout cycles
