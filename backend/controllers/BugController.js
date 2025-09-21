const {z} = require('zod');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

export const createBugSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description must be at most 2000 characters"),
  severity: z.enum(["Low", "Medium", "High"], {
    required_error: "Severity is required",
  }),
  status: z.enum(["Open", "InProgress", "Closed"]).optional(),
});

async function createBug(req,res){
    try{
        const bugData = createBugSchema.parse(req.body);
        const newBug = await prisma.bug.create({data:{...bugData,reporterId:req.user.id}});
        ;
        res.status(201).json(newBug);
    }
    catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({errors:error.errors});
        }
        return res.status(500).json({error:"Internal Server Error"});
    }
}

async function getAllBugs(req,res){
    try{
        const bugs = await prisma.bug.findMany();
        res.status(200).json(bugs);
    }
    catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}

async function getBugsByUser(req,res){
    const userId = parseInt(req.params.userId);
    if(isNaN(userId) || userId <= 0){
        return res.status(400).json({error:"Invalid User ID"});
    }
    try{
        const bugs = await prisma.bug.findMany({where:{reporterId:userId}});
        res.status(200).json(bugs);
    }
    catch(error){
        res.status(404).json("Could not find any bugs.")
    }
}

async function updateBugStatus(req,res){
    try{
        const bugId = parseInt(req.params.bugId, 10);
        const {status} = req.body;
        
        if (isNaN(bugId) || bugId <= 0) {
            return res.status(400).json({ error: "Invalid Bug ID" });
        }

        if (status !== "Open" && status !== "InProgress" && status !== "Closed") {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedBug = await prisma.bug.update({
            where: {id:bugId},
            data: {status}
        });

        res.status(200).json(updatedBug)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteBug(req, res) {
  try {
    const bugId = parseInt(req.params.bugId, 10);

    // Check if bug exists
    const findBug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!findBug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    if (req.user.role !== "Admin" && findBug.reporterId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this bug" });
    }

    await prisma.bug.delete({
      where: { id: bugId },
    });

    res.status(200).json({ message: "Bug deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {createBug,getAllBugs,getBugsByUser,updateBugStatus,deleteBug};
