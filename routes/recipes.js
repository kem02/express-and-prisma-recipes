import express, { request, response } from "express";
import { prisma } from "../db/index.js"

const router = express.Router();

//GET all recipes
router.get("/", async (request, response) => {
    const allRecipes = await prisma.recipe.findMany({
        where: {
            userId: 1
        },
        include: {
            user: true
        }
    });

    response.status(200).json({
        success: true,
        recipe: allRecipes,
    })
});

//GET one recipe by its id#
router.get("/:recipeid", async (request, response) => {
    // Get the param id number that is passed in the url
    const recipeId = parseInt(request.params.recipeid)
    // 
    const singleRecipeById = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        },
    });

    response.status(200).json({
        success: true,
        recipe: singleRecipeById,
    });
});

//POST
router.post("/", async (request, response) => {
    const newRecipe = await prisma.recipe.create({
        data: {
            name: request.body.recipe,
            userId: 1,
            description: request.body.description
        },
    });

    console.log(newRecipe);

    response.status(201).json({
        success: true,
    });
});

export default router;