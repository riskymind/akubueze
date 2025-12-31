/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { auth } from "@/auth";
import {prisma} from "@/lib/prisma"
import { createMeetingSchema, updateMeetingSchema } from "../validations";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";


// Get Latest Meetings
export async function getMeetingsAction({
    page,
    limit = PAGE_SIZE,
}: {limit?: number, page: number}) {
    try {
        const meetings = await prisma.meeting.findMany({
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                dues: {
                    include: {
                        payments: true
                    }
                }
            },
            orderBy: {date: "desc"},
            take: limit,
            skip: (page - 1) * limit
        })
        const dataCount = await prisma.meeting.count();

        return {success: true, meetings, totalPages: Math.ceil(dataCount / limit)}
    } catch (error) {
        console.error("Error fetching meetings:", error);
        return { error: "Failed to fetch meetings"}
    }
}

// Get Meeting by ID
export async function getMeetingByIdAction(meetingId: string) {
    try {
        if(!meetingId) {
            return {error: "Meeting ID is required"}
        }
        const meeting = await prisma.meeting.findUnique({
            where: {id: meetingId},
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                dues: {
                    include: {
                        member: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        payments: {
                            include: {
                                member: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    }
                                }
                            }
                        },
                    },
                }
            }
        })
        if(!meeting) {
            return {error: "Meeting not found."}
        }
        return {success: true, meeting}
    } catch (error) {
        console.error("Error fetching meeting", error);
        return {error: "Failed to fetch meeting"}
    }   
}

// Create meeting
export async function createMeetingAction(formData: FormData) {
    try {
        const session = await auth()
        if(!session || (session.user.role != "ADMIN" && session.user.role != "FINANCIAL_SECRETARY")) {
            return {error: "Unauthorized"}
        }
        const rawData = {
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            venue: formData.get('venue') as string,
            description: formData.get('description') as string,
            hostId: formData.get('hostId') as string,
        };

        const meetingValidatedData = createMeetingSchema.parse(rawData)

        const users = await prisma.user.findMany()

        const meeting = await prisma.meeting.create({
            data: {
                title: meetingValidatedData.title,
                date: new Date(meetingValidatedData.date),
                venue: meetingValidatedData.venue,
                description: meetingValidatedData.description,
                hostId: meetingValidatedData.hostId,
                dues: {
                    create: users.map(user => ({
                        memberId: user.id,
                        amount: user.id === meetingValidatedData.hostId ? 5000 : 1000,
                        isHost: user.id === meetingValidatedData.hostId,
                        status: "PENDING",
                        dueDate: new Date(meetingValidatedData.date)
                    }))
                }
            },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                dues: true
            }
        })

        revalidatePath("/meetings")
        revalidatePath("/dashboard")

        return {success: true, meeting}

    } catch (error: any) {
        if(error.errors) {
            return { error: error.errors[0].message };
        }
        console.error("Error creating meeting", error);
        return {error: "Failed to create meeting"}
    }
}

// Update Meeting
export async function updateMeetingAction(meetingId: string, formData: FormData) {
    try {
        const session = await auth()
        if(!session || (session.user.role != "ADMIN" && session.user.role != "FINANCIAL_SECRETARY")) {
            return {error: "Unauthorized"}
        }

        if (!meetingId) {
            return { error: 'Meeting ID is required' };
        }

        const rawData = {
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            venue: formData.get('venue') as string,
            description: formData.get('description') as string,
            hostId: formData.get('hostId') as string,
        };

        // Validate with Zod - filter out undefined values
        const dataToValidate = Object.fromEntries(
            Object.entries(rawData).filter(([_, v]) => v !== null && v !== '')
        );

        const validatedData = updateMeetingSchema.parse(dataToValidate)

        const meeting = await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                    ...(validatedData.title && { title: validatedData.title }),
                    ...(validatedData.date && { date: new Date(validatedData.date) }),
                    ...(validatedData.venue !== undefined && { venue: validatedData.venue }),
                    ...(validatedData.description !== undefined && { description: validatedData.description }),
                    ...(validatedData.hostId && { hostId: validatedData.hostId }),
                },
            include: {
                host: {

                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })
        revalidatePath('/meetings');
        revalidatePath(`/meetings/${meetingId}`);
        revalidatePath('/dashboard');
        return { success: true, meeting };
 
    } catch (error: any) {
        if(error.errors) {
            return { error: error.errors[0].message };
        }
        console.error("Error updating meeting", error);
        return {error: "Failed to update meeting"}
    }
}

// Delete Meeting
export async function deleteMeetingAction(meetingId: string) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'FINANCIAL_SECRETARY')) {
      return { error: 'Unauthorized' };
    }

    if (!meetingId) {
      return { error: 'Meeting ID is required' };
    }

    await prisma.meeting.delete({
      where: { id: meetingId },
    });

    revalidatePath('/meetings');
    revalidatePath('/dashboard');
    return { success: true, message: 'Meeting deleted successfully' };
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return { error: 'Failed to delete meeting' };
  }
}

