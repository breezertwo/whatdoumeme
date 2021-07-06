// src/server.ts

import { MemeServer } from './MemeServer';

const app = new MemeServer().app;

export { app };
