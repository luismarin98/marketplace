import { ObjectId } from "mongodb";
import { getCollection, ensureIndexes } from "@/lib/mongodb";
import type { IUser } from "@/modules/auth/domain/user.entity";
import { USERS_COLLECTION } from "@/modules/auth/domain/user.entity";
import type { RegisterDTO } from "@/modules/auth/domain/auth.types";

export class UserRepository {
  private async collection() {
    await ensureIndexes();
    return getCollection<IUser>(USERS_COLLECTION);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const col = await this.collection();
    return col.findOne({ email: email.toLowerCase() } as Partial<IUser>);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const col = await this.collection();
    return col.findOne({ username: username.toLowerCase() } as Partial<IUser>);
  }

  async findById(id: string): Promise<IUser | null> {
    const col = await this.collection();
    return col.findOne(
      { _id: new ObjectId(id) } as Partial<IUser>,
      { projection: { password: 0 } }
    );
  }

  async create(
    data: Omit<RegisterDTO, "confirmPassword"> & { password: string }
  ): Promise<IUser> {
    const col = await this.collection();
    const now = new Date();
    const doc: Omit<IUser, "_id"> = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      birthDate: new Date(data.birthDate),
      role: data.role,
      password: data.password,
      createdAt: now,
      updatedAt: now,
    };
    const result = await col.insertOne(doc as IUser);
    return { ...doc, _id: result.insertedId } as IUser;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const col = await this.collection();
    await col.updateOne(
      { _id: new ObjectId(userId) } as Partial<IUser>,
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
  }
}
