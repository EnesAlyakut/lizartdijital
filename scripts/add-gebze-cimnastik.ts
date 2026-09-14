import { PrismaClient } from "../src/generated/prisma";
import { REFERENCES } from "../prisma/seed-referanslar";
const prisma = new PrismaClient();
async function main() {
 const ref = REFERENCES.find(r => r.shot === "gebze-cimnastik")!;
 const {shot, gallery, ...fields} = ref;
 const data = {...fields, liveUrl: ref.liveUrl || null, services: JSON.stringify(ref.services), technologies: JSON.stringify(ref.technologies), deliverables: JSON.stringify(ref.deliverables), gallery: JSON.stringify(gallery), coverImage: gallery![0], mobileImage: gallery![1]};
 const result = await prisma.portfolioProject.upsert({where:{slug:ref.slug},create:data,update:data});
 console.log("Referans eklendi:",result.slug);
}
main().finally(()=>prisma.$disconnect());
