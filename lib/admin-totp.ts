import { prisma } from "@/lib/prisma";
import { matchTOTP } from "@/lib/totp";

export async function verifyAndConsumeAdminTOTP(token: string, secret: string): Promise<boolean> {
  let step: number | null;
  try {
    step = matchTOTP(token, secret);
  } catch {
    return false;
  }
  if (step === null) return false;
  const nextStep = BigInt(step);
  try {
    await prisma.adminTotpState.create({ data: { id: "owner", lastStep: nextStep } });
    return true;
  } catch (error) {
    if (!(typeof error === "object" && error !== null && "code" in error && error.code === "P2002")) throw error;
  }
  const updated = await prisma.adminTotpState.updateMany({
    where: { id: "owner", lastStep: { lt: nextStep } },
    data: { lastStep: nextStep },
  });
  return updated.count === 1;
}
