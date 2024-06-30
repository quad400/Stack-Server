import bcrypt from "bcrypt";

export class Hash {
  async encrypt(text: string) {
    return await bcrypt.hash(text, 12);
  }

  async compare(hash: string, text: string) {
    return await bcrypt.compare(text, hash);
  }

}
