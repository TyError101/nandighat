import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Phone numbers that should NEVER be deleted (your admin login, etc.)
const PROTECTED_PHONES = ["9511560012"];

async function main() {
  console.log("🧹 Resetting test data...\n");

  const usersToWipe = await prisma.user.findMany({
    where: { phone: { notIn: PROTECTED_PHONES } },
    select: { id: true, phone: true },
  });

  if (usersToWipe.length === 0) {
    console.log("No test users found to delete. Nothing to do.");
    return;
  }

  const userIds = usersToWipe.map((u) => u.id);

  const pilgrims = await prisma.pilgrim.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  });
  const pilgrimIds = pilgrims.map((p) => p.id);

  const parikramas = await prisma.parikrama.findMany({
    where: { pilgrimId: { in: pilgrimIds } },
    select: { id: true },
  });
  const parikramaIds = parikramas.map((p) => p.id);

  // Delete in FK-safe order: children first, parents last
  const familyDeleted = await prisma.familyMember.deleteMany({
    where: { parikramaId: { in: parikramaIds } },
  });
  const certsDeleted = await prisma.certificate.deleteMany({
    where: { parikramaId: { in: parikramaIds } },
  });
  const invitesDeleted = await prisma.inviteLink.deleteMany({
    where: { parikramaId: { in: parikramaIds } },
  });
  const parikramasDeleted = await prisma.parikrama.deleteMany({
    where: { id: { in: parikramaIds } },
  });
  const pilgrimsDeleted = await prisma.pilgrim.deleteMany({
    where: { id: { in: pilgrimIds } },
  });
  
  const usersDeleted = await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  console.log(`✅ Deleted:`);
  console.log(`   FamilyMembers:  ${familyDeleted.count}`);
  console.log(`   Certificates:   ${certsDeleted.count}`);
  console.log(`   InviteLinks:    ${invitesDeleted.count}`);
  console.log(`   Parikramas:     ${parikramasDeleted.count}`);
  console.log(`   Pilgrims:       ${pilgrimsDeleted.count}`);
  console.log(`   Users:          ${usersDeleted.count}`);
  console.log(`\n🛡️  Protected (kept): ${PROTECTED_PHONES.join(", ")}`);
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });