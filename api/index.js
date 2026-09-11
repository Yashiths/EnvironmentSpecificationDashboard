import { app } from '../backend/server.js';

if (typeof module !== 'undefined') module.exports = app;
export default app;