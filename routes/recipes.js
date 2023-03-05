import express from "express";
import prisma from "../db/index.js"

export default function setupRecipeRouter(passport) {
    const router = express.Router();

    //GET all recipes from all users (for anyone who is not logged in/ public)
    router.get("/", async (request, response) => {

        const allRecipes = await prisma.recipe.findMany();

        response.status(200).json({
            success: true,
            recipe: allRecipes,
        })
    });



    //GET all recipes for currently logged in user
    router.get("/user", passport.authenticate("jwt", { session: false }), async (request, response) => {
        console.log("This is the request.user", request.user);

        const allUserRecipe = await prisma.recipe.findMany({
            where: {
                userId: request.user.id,
            },
            include: {
                user: true
            }
        });

        response.status(200).json({
            success: true,
            allUserRecipe
        })
    });



    //GET one recipe by its id# (for anyone who is not logged in/ public)
    router.get("/:recipeid", async (request, response) => {
        // Get the param id number that is passed in the url
        const recipeId = parseInt(request.params.recipeid)

        try {
            const singleRecipeById = await prisma.recipe.findUniqueOrThrow({
                where: {
                    id: recipeId
                },
            });

            response.status(200).json({
                success: true,
                recipe: singleRecipeById,
            });

           
        } catch (error) {
            response.status(404).json({
                success: false,
                message: "recipe does not exist"
            });
            
        }

    });






    //POST only signed in users recipe
    router.post("/", passport.authenticate("jwt", { session: false }), async (request, response) => {
        const newRecipe = await prisma.recipe.create({
            data: {
                recipe: request.body.recipe,
                userId: request.user.id,
                description: request.body.description
            },
        });

        console.log(newRecipe);

        response.status(201).json({
            success: true,
            newRecipe
        });
    });


    //PUT only signed in users recipe
    router.put("/:recipeid", passport.authenticate("jwt", { session: false }), async (request, response) => {
        const recipeId = parseInt(request.params.recipeid);

        const editRecipe = await prisma.recipe.updateMany({
            //AND forced where property to take more than one argument inside it. Must meet both requirements.
            where: {
                AND: [
                    { userId: request.user.id },
                    { id: recipeId },
                ]
            },
            data: {
                recipe: request.body.recipe,
                description: request.body.description,

            },
        })

        // updateMany() returns a count of 0 if it updated nothing. And a count of 1 if it did.
        if (editRecipe.count === 0) {
            response.status(404).json({
                success: false,
                message: "recipe does not exist for this user"
            });
        } else {
            response.status(200).json({
                success: true,
            });
        }

        // console.log(editRecipe);

    });



    //DELETE only signed in users recipe
    router.delete("/:recipeid", passport.authenticate("jwt", { session: false }), async (request, response) => {
        const recipeId = parseInt(request.params.recipeid);
        // deleteMany() allows you to have more than one argument inside of the where property. Compared to just using delete() which only allows the where prop to have one argument inside it.
        const deleteRecipe = await prisma.recipe.deleteMany({
            where: {
                userId: request.user.id,
                id: recipeId
            },

        });

        // deleteMany() returns a count of 0 if it deleted nothing. And a count of 1 if it did.
        if (deleteRecipe.count === 0) {
            response.status(404).json({
                success: false,
                message: "recipe does not exist for this user"
            });
        } else {
            response.status(200).json({
                success: true,
            });
        }

        // console.log(deleteRecipe);

    });

    return router;

}
