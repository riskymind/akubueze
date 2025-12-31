import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
    // Create Admin user
    const adminPassword = await bcrypt.hash("aku@admin123", 10)
    const admins = [
        {name: "Ukaegbu Charles", email: "charles@akubueze.com", phone: "+447564684472", image: ""},
        {name: "Awulonu Chika", email: "chi@akubueze.com", phone: "+2349167213865", image: ""},
        {name: "Opara Kelechi", email: "kelechi@akubueze.com", phone: "+2347046193975", image: ""},
    ]
     for (const admin of admins) {
        await prisma.user.upsert({
            where: {email: admin.email},
            create: {
                ...admin,
                password: adminPassword,
                role: "ADMIN"
            },
            update: {}
        })
    }
    // await prisma.user.upsert({
    //     where: { email: "kelechi@akubueze.com" },
    //     create: {
    //         email: "kelechi@akubueze.com",
    //         name: "Opara Kelechi",
    //         phone: "+2347046193975",
            
    //         image: "",
    //         role: 'ADMIN'
    //     },
    //     update: {}
    // })


    // Create Fin Sec
    const finSecPassword = await bcrypt.hash("aku@finsec123", 10)
    await prisma.user.upsert({
        where: {email: "noel@akubueze.com"},
        update: {},
        create: {
            email: "noel@akubueze.com",
            name: "Chukwu Noel",
            phone: "+2348035818750",
            password: finSecPassword,
            image: "",
            role: 'FINANCIAL_SECRETARY'
        }
    })

    // Create Sample members
    const memberPassword = await bcrypt.hash("aku@member123", 10)
    const members = [
        {name: "Chukwu Chukwudi", email: "chukwudi@akubueze.com", phone: "+2347037979386", image: ""},
        {name: "Mbata Cajetan", email: "cajetan@akubueze.com", phone: "+2347062473766", image: ""},
        {name: "Nwachukwu Chika", email: "chika@akubueze.com", phone: "+2349135025079", image: ""},
        {name: "Okere Tochi", email: "tochi@akubueze.com", phone: "+2347035652296", image: ""},
        {name: "Nnadi Chibueze", email: "chibueze@akubueze.com", phone: "+2347045393423", image: ""},
        {name: "Duru Chioma", email: "chioma@akubueze.com", phone: "+2348147846204", image: ""},
        {name: "Ndukwu Tochi", email: "ndukwu@akubueze.com", phone: "+2349130775583", image: ""},
        {name: "Iheanacho Samson", email: "samson@akubueze.com", phone: "+2348138571912", image: ""},
        {name: "Maduagwu Chidinma", email: "chidinma@akubueze.com", phone: "+447827215265", image: ""},
        {name: "Opara Oluchi", email: "oluchi@akubueze.com", phone: "+2348145555787", image: ""},
        {name: "Opara Ugochukwu", email: "ugochukwu@akubueze.com", phone: "+2348108323501", image: ""},
        {name: "Nkwocha Princewill", email: "princewill@akubueze.com", phone: "+2347034536357", image: ""},
        {name: "Anukam Ugochukwu", email: "anukam@akubueze.com", phone: "+2347032178821", image: ""},
        {name: "Umunakwe Richard", email: "richard@akubueze.com", phone: "+2349167213865", image: ""},
    ]

    for (const member of members) {
        await prisma.user.upsert({
            where: {email: member.email},
            create: {
                ...member,
                password: memberPassword,
                role: "MEMBER"
            },
            update: {}
        })
    }

    // Create a sample meeting
    // const lastSunday = new Date()
    // lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay())

    // const allUsers = await prisma.user.findMany()
    // const hostUser = allUsers[2]; // use the third as host

    // const meeting = await prisma.meeting.create({
    //     data: {
    //         title: "November meeting",
    //         date: lastSunday,
    //         venue: "Mbata's Compound",
    //         description: "Last meeting of the year 2025",
    //         hostId: hostUser.id,
    //         dues: {
    //             create: allUsers.map(user => ({
    //                 memberId: user.id,
    //                 amount: user.id === hostUser.id ? 5000 : 1000,
    //                 isHost: user.id === hostUser.id,
    //                 status: 'PENDING',
    //                 dueDate: lastSunday
    //             }))
    //         }
    //     }
    // })


    console.log('Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('==================');
    console.log('\nAdmin:');
    console.log('Email: admin@akubueze.com');
    console.log('Password: admin123');
    console.log('\nFinancial Secretary:');
    console.log('Email: fs@akubueze.com');
    console.log('Password: fs123');
    console.log('\nMember:');
    console.log('Email: chukwudi@example.com');
    console.log('Password: member123');
    console.log('\n(All members use password: member123)');
}

main()
.catch((e)=> {
    console.error(e);
    process.exit(1)
})
.finally(async ()=> {
    await prisma.$disconnect()
})