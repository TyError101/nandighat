export type SessionPayload = {
  userId: string;
  phone: string;
  role: "PILGRIM" | "ADMIN";
  verified: boolean;
};

export type SendOtpRequest = { mobile: string };
export type SendOtpResponse = { success: boolean; message: string };

export type VerifyOtpRequest = { mobile: string; otp: string };
export type VerifyOtpResponse = { success: boolean; message: string };