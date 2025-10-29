import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        address: 'Admin Address',
        role: Role.SYSTEM_ADMIN,
      },
    });
  }

  // Optional: create store owner
  const existingOwner = await prisma.user.findUnique({ where: { email: 'owner@example.com' } });
  if (!existingOwner) {
    const hashedPassword = await bcrypt.hash('Owner@1234', 10);
    await prisma.user.create({
      data: {
        name: 'Store Owner',
        email: 'owner@example.com',
        password: hashedPassword,
        address: 'Owner Address',
        role: Role.STORE_OWNER,
      },
    });
  }

  // Optional: create normal user
  const existingUser = await prisma.user.findUnique({ where: { email: 'user@example.com' } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('User@1234', 10);
    await prisma.user.create({
      data: {
        name: 'Normal User',
        email: 'user@example.com',
        password: hashedPassword,
        address: 'User Address',
        role: Role.NORMAL_USER,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
