export enum Role {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export const JWT_SECRET = 'your-secret-key'; // 生产环境应该从环境变量获取
export const JWT_EXPIRES_IN = '2h'; // token有效期2小时
export const EMAIL_CODE_EXPIRES_IN = 5 * 60; // 邮箱验证码有效期5分钟
