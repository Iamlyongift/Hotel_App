import { Request } from "express";

interface adminRequest extends Request {
  user?: Record<string, any>;
}

export default adminRequest;
