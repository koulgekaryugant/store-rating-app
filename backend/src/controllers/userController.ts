import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const updatePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, password: newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating password.', error });
  }
};