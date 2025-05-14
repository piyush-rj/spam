import { Request, Response } from "express";
import prisma from "@repo/db";

export default async function userGroups(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    
    const userIdInt = parseInt(userId, 10);
    
    if (isNaN(userIdInt)) {
      res.status(400).json({ message: 'User ID must be a number' });
      return;
    }
    
    const groups = await prisma.chatGroup.findMany({
      where: {
        OR: [
          { user_id: userIdInt },
          { 
            GroupUsers: {
              some: { user_id: userIdInt }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        GroupUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(groups);
    return;
    
  } catch (error) {
    console.error('API error fetching user groups:', error);
    res.status(500).json({ message: 'Something went wrong' });
    return;
  }
}