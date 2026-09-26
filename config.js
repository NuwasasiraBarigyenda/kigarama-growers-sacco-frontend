/* =====================================================================
   Kigarama Growers SACCO — Frontend Runtime Config
   =====================================================================
   By default this frontend is served directly BY the Spring Boot backend
   (from backend/src/main/resources/static), so relative "/api" calls just
   work with no configuration needed.

   If you deploy this "frontend/public" folder separately (e.g. to Nginx,
   Netlify, Vercel, or any static host) while the backend runs elsewhere,
   set API_BASE_OVERRIDE below to the backend's full URL. You'll also need
   to add that origin to `sacco.cors.allowed-origins` in the backend's
   application.properties so the browser allows the cross-origin request.
   ===================================================================== */

window.SACCO_CONFIG = {
    API_BASE_OVERRIDE: 'http://localhost:8080'
};