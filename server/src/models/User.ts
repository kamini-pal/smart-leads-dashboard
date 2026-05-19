import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types';

/**
 * User Model — defines what a User looks like in MongoDB.
 *
 * HOW BCRYPT PASSWORD HASHING WORKS (beginner explanation):
 * ┌──────────────────────────────────────────────────────────┐
 * │ Plain password: "mypassword123"                          │
 * │         ↓ bcrypt.hash(password, 10)                      │
 * │ Hashed password: "$2a$10$N9qo8uLOickgx2ZMRZoMy..."      │
 * │                                                          │
 * │ The "10" is the salt rounds (how many times it hashes).  │
 * │ More rounds = more secure but slower.                    │
 * │ 10 is the standard for most apps.                        │
 * │                                                          │
 * │ WHY hash? If your database gets hacked, attackers see    │
 * │ gibberish instead of real passwords.                     │
 * │                                                          │
 * │ Hashing is ONE-WAY — you can't reverse it back to the   │
 * │ original password. To verify, you hash the input again   │
 * │ and compare the hashes.                                  │
 * └──────────────────────────────────────────────────────────┘
 */

// Mongoose document type — combines our IUser interface with Mongoose's Document
type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true, // Stores email in lowercase (prevents duplicates like "A@b.com" vs "a@b.com")
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // IMPORTANT: Excludes password from query results by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SALES,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook — runs BEFORE saving a user to the database.
 *
 * WHY check isModified('password')?
 * Without this check, the password would get re-hashed every time
 * you update ANY field (like name or email). We only want to hash
 * when the password itself changes (on register or password reset).
 */
userSchema.pre('save', async function () {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method — compares a plain-text password with the hashed one.
 *
 * USAGE: const isMatch = await user.comparePassword('mypassword123');
 *
 * HOW: bcrypt.compare hashes the input and checks if it matches
 * the stored hash. We never decrypt the stored password.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
