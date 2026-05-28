export type LoginFormState =
  | {
      errors?: {
        login?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type LoginResponse = {
  success: boolean;
  message?: string;
  data: {
    token: string;
    refreshToken: string;
    sessionId: string;
  };
};
