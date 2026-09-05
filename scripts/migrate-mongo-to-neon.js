require('dotenv').config();
const { MongoClient } = require('mongodb');
const { PrismaClient } = require('@prisma/client');
const dns = require('dns');

// Use public DNS resolvers (Google & Cloudflare) to ensure MongoDB SRV records resolve cleanly on Windows
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.log("Could not set custom DNS servers:", e.message);
}

const mongoUri = process.env.MONGODB_BACKUP_URL;
if (!mongoUri) {
    console.error("MONGODB_BACKUP_URL not set. Add it to .env with your MongoDB connection string.");
    process.exit(1);
}
const prisma = new PrismaClient();

async function migrate() {
    console.log("Connecting to MongoDB:", mongoUri.split('@')[1]);
    const mongoClient = new MongoClient(mongoUri, {
        connectTimeoutMS: 15000,
        serverSelectionTimeoutMS: 15000,
    });
    await mongoClient.connect();
    console.log("Connected to MongoDB successfully.");

    const db = mongoClient.db();
    const collections = await db.listCollections().toArray();
    console.log("Found collections in MongoDB:", collections.map(c => c.name));

    // Helper to safely convert Mongo document fields to Prisma format
    const cleanDoc = (doc) => {
        const { _id, ...rest } = doc;
        const id = _id ? _id.toString() : undefined;
        return { ...(id ? { id } : {}), ...rest };
    };

    // 1. Projects
    try {
        const projColl = db.collection('Project') || db.collection('projects');
        const projects = await projColl.find({}).toArray();
        console.log(`Migrating ${projects.length} Projects...`);
        for (const p of projects) {
            const data = cleanDoc(p);
            await prisma.project.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    title: data.title || '',
                    oneLiner: data.oneLiner || '',
                    logo: data.logo || '',
                    screenshot: data.screenshot || '',
                    projectType: data.projectType || 'full-stack',
                    liveURL: data.liveURL || null,
                    sourceURL: data.sourceURL || null,
                    description: data.description || '',
                    techStack: data.techStack || [],
                    keywords: data.keywords || [],
                    isPublished: data.isPublished !== false,
                    displayOrder: data.displayOrder || null,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                }
            }).catch(e => console.error("Error migrating project", p._id, e.message));
        }
    } catch (e) {
        console.log("Project migration note:", e.message);
    }

    // 2. Certification
    try {
        const certColl = db.collection('Certification') || db.collection('certifications');
        const certs = await certColl.find({}).toArray();
        console.log(`Migrating ${certs.length} Certifications...`);
        for (const c of certs) {
            const data = cleanDoc(c);
            await prisma.certification.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    title: data.title || '',
                    organizationName: data.organizationName || '',
                    completionDate: data.completionDate ? new Date(data.completionDate) : new Date(),
                    credentialID: data.credentialID || '',
                    certificateUrl: data.certificateUrl || '',
                    screenshot: data.screenshot || '',
                    learned: data.learned || [],
                    isPublished: data.isPublished !== false,
                    displayOrder: data.displayOrder || null,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                }
            }).catch(e => console.error("Error migrating cert", c._id, e.message));
        }
    } catch (e) {
        console.log("Cert migration note:", e.message);
    }

    // 3. Experience
    try {
        const expColl = db.collection('Experience') || db.collection('experiences');
        const exps = await expColl.find({}).toArray();
        console.log(`Migrating ${exps.length} Experiences...`);
        for (const e of exps) {
            const data = cleanDoc(e);
            await prisma.experience.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    positionName: data.positionName || '',
                    companyName: data.companyName || '',
                    companyLocation: data.companyLocation || '',
                    workMode: data.workMode || null,
                    startDate: data.startDate ? new Date(data.startDate) : new Date(),
                    endDate: data.endDate ? new Date(data.endDate) : null,
                    isCurrentlyWorking: !!data.isCurrentlyWorking,
                    learned: data.learned || [],
                    isPublished: data.isPublished !== false,
                    displayOrder: data.displayOrder || null,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                }
            }).catch(err => console.error("Error migrating experience", e._id, err.message));
        }
    } catch (e) {
        console.log("Exp migration note:", e.message);
    }

    // 4. Education
    try {
        const eduColl = db.collection('Education') || db.collection('educations');
        const edus = await eduColl.find({}).toArray();
        console.log(`Migrating ${edus.length} Educations...`);
        for (const ed of edus) {
            const data = cleanDoc(ed);
            await prisma.education.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    degree: data.degree || '',
                    fieldOfStudy: data.fieldOfStudy || '',
                    institution: data.institution || '',
                    location: data.location || null,
                    startDate: data.startDate ? new Date(data.startDate) : new Date(),
                    endDate: data.endDate ? new Date(data.endDate) : null,
                    isCurrently: !!data.isCurrently,
                    grade: data.grade || null,
                    achievements: data.achievements || [],
                    description: data.description || null,
                    isPublished: data.isPublished !== false,
                    displayOrder: data.displayOrder || null,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                }
            }).catch(err => console.error("Error migrating education", ed._id, err.message));
        }
    } catch (e) {
        console.log("Edu migration note:", e.message);
    }

    // 5. Techstack
    try {
        const tsColl = db.collection('Techstack') || db.collection('techstacks');
        const tss = await tsColl.find({}).toArray();
        console.log(`Migrating ${tss.length} Techstacks...`);
        for (const ts of tss) {
            const data = cleanDoc(ts);
            await prisma.techstack.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    title: data.title || '',
                    category: data.category || '',
                    url: data.url || '',
                    techstackType: data.techstackType || '',
                    imageUrl: data.imageUrl || '',
                    isPublished: data.isPublished !== false,
                    displayOrder: data.displayOrder || null,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                }
            }).catch(err => console.error("Error migrating techstack", ts._id, err.message));
        }
    } catch (e) {
        console.log("Techstack migration note:", e.message);
    }

    // 6. Admin
    try {
        const adminColl = db.collection('Admin') || db.collection('admins');
        const admins = await adminColl.find({}).toArray();
        console.log(`Migrating ${admins.length} Admins...`);
        for (const a of admins) {
            const data = cleanDoc(a);
            await prisma.admin.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    adminUserId: data.adminUserId || '',
                    name: data.name || '',
                    imageUrl: data.imageUrl || '',
                    resumeUrl: data.resumeUrl || null,
                    position: data.position || '',
                    location: data.location || '',
                    introduction: data.introduction || '',
                    education: data.education || '',
                    skills: data.skills || [],
                    github: data.github || null,
                    linkedIn: data.linkedIn || null,
                    whatsapp: data.whatsapp || null,
                    facebook: data.facebook || null,
                    instagram: data.instagram || null,
                    discord: data.discord || null,
                    gitlab: data.gitlab || null,
                    twitter: data.twitter || null,
                    email: data.email || null,
                    youtube: data.youtube || null,
                }
            }).catch(err => console.error("Error migrating admin", a._id, err.message));
        }
    } catch (e) {
        console.log("Admin migration note:", e.message);
    }

    // 7. Contact
    try {
        const contactColl = db.collection('Contact') || db.collection('contacts');
        const contacts = await contactColl.find({}).toArray();
        console.log(`Migrating ${contacts.length} Contacts...`);
        for (const ct of contacts) {
            const data = cleanDoc(ct);
            await prisma.contact.upsert({
                where: { id: data.id },
                update: {},
                create: {
                    id: data.id,
                    email: data.email || '',
                    smtpEmail: data.smtpEmail || null,
                    emailPassword: data.emailPassword || null,
                    phone: data.phone || '',
                    address: data.address || '',
                    smtpServer: data.smtpServer || null,
                    smtpPort: data.smtpPort || null,
                    smtpUsername: data.smtpUsername || null,
                    smtpPassword: data.smtpPassword || null,
                    emailIntegration: !!data.emailIntegration,
                    emailProvider: data.emailProvider || null,
                    mailboxSettings: data.mailboxSettings || null,
                }
            }).catch(err => console.error("Error migrating contact", ct._id, err.message));
        }
    } catch (e) {
        console.log("Contact migration note:", e.message);
    }

    // 8. PageSEO
    try {
        const seoColl = db.collection('PageSEO') || db.collection('pageseos');
        const seos = await seoColl.find({}).toArray();
        console.log(`Migrating ${seos.length} PageSEOs...`);
        for (const s of seos) {
            const data = cleanDoc(s);
            await prisma.pageSEO.upsert({
                where: { path: data.path },
                update: {},
                create: {
                    id: data.id,
                    path: data.path,
                    title: data.title || null,
                    description: data.description || null,
                    keywords: data.keywords || null,
                    noIndex: !!data.noIndex,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
                }
            }).catch(err => console.error("Error migrating pageSEO", s._id, err.message));
        }
    } catch (e) {
        console.log("PageSEO migration note:", e.message);
    }

    console.log("Migration complete!");
    await mongoClient.close();
    await prisma.$disconnect();
}

migrate().catch(async (e) => {
    console.error("Migration error:", e);
    await prisma.$disconnect();
    process.exit(1);
});
