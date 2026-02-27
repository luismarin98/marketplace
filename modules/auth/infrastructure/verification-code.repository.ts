import { ObjectId } from "mongodb";
import { getCollection, ensureIndexes } from "@/lib/mongodb";
import type { IVerificationCode } from "@/modules/auth/domain/verification-code.entity";
import { VERIFICATION_CODES_COLLECTION } from "@/modules/auth/domain/verification-code.entity";

export class VerificationCodeRepository {
  private async collection() {
    await ensureIndexes();
    return getCollection<IVerificationCode>(VERIFICATION_CODES_COLLECTION);
  }

  async create(data: {
    userId: string;
    code: string;
    expiresAt: Date;
  }): Promise<IVerificationCode> {
    const col = await this.collection();

    // Invalidate any existing codes for this user
    await col.updateMany(
      { userId: new ObjectId(data.userId), used: false } as Partial<IVerificationCode>,
      { $set: { used: true } }
    );

    const doc: Omit<IVerificationCode, "_id"> = {
      userId: new ObjectId(data.userId),
      code: data.code,
      expiresAt: data.expiresAt,
      used: false,
    };

    const result = await col.insertOne(doc as IVerificationCode);
    return { ...doc, _id: result.insertedId } as IVerificationCode;
  }

  async findValidCode(
    userId: string,
    code: string
  ): Promise<IVerificationCode | null> {
    const col = await this.collection();
    return col.findOne({
      userId: new ObjectId(userId),
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    } as Partial<IVerificationCode>);
  }

  async markAsUsed(id: string): Promise<void> {
    const col = await this.collection();
    await col.updateOne(
      { _id: new ObjectId(id) } as Partial<IVerificationCode>,
      { $set: { used: true } }
    );
  }
}
