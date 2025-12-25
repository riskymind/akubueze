import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { emit } from "process"
import { use } from "react"

async function main() {
    // Create Admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
        where: { email: "admin@akubueze.com" },
        create: {
            email: "admin@akubueze.com",
            name: "System Adminstrator",
            phone: "+2348034049873",
            password: adminPassword,
            image: "",
            role: 'ADMIN'
        },
        update: {}
    })

    // Create Fin Sec
    const finSecPassword = await bcrypt.hash("finSec123", 10)
    const finSec = await prisma.user.upsert({
        where: {email: "finSec@akubueze.com"},
        update: {},
        create: {
            email: "finSec@akubueze.com",
            name: "Financial Secretary",
            phone: "+2348035818750",
            password: finSecPassword,
            image: "",
            role: 'FINANCIAL_SECRETARY'
        }
    })

    // Create Sample members
    const memberPassword = await bcrypt.hash("member123", 10)
    const members = [
        {name: "Chukwu Chukwudi", email: "chukwudi@gmail.com", phone: "+123456", image: ""},
        {name: "Mbata Cajetan", email: "cajetan@gmail.com", phone: "+34294", image: ""},
        {name: "Nwachukwu Chika", email: "chika@gmail.com", phone: "+987473", image: ""},
        {name: "Okere Tochi", email: "tochi@gmail.com", phone: "+31245", image: ""}
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
    const lastSunday = new Date()
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay())

    const allUsers = await prisma.user.findMany()
    const hostUser = allUsers[2]; // use the third as host

    const meeting = await prisma.meeting.create({
        data: {
            title: "November meeting",
            date: lastSunday,
            venue: "Mbata's Compound",
            description: "Last meeting of the year 2025",
            hostId: hostUser.id,
            dues: {
                create: allUsers.map(user => ({
                    memberId: user.id,
                    amount: user.id === hostUser.id ? 5000 : 1000,
                    isHost: user.id === hostUser.id,
                    status: 'PENDING',
                    dueDate: lastSunday
                }))
            }
        }
    })


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