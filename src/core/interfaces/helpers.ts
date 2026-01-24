export interface SanitizeUserParams {
  id: number;
  name: string;
  email: string;
  roleId?: number;
}

export interface ResponseHandlerParams {
  status?: number;
  message?: string;
  data?: any;
}
