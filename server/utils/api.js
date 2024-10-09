// api links
const spoonacularAPI = "https://api.spoonacular.com/recipes/complexSearch";
const edamamAPI = "https://api.edamam.com/api/recipes/v2?&type=public";
const tastyAPI = "https://tasty.p.rapidapi.com/recipes/list";

export const getSpoonacularRecipes = async (
  query = null,
  mealType = [],
  goal = null,
  dietaryPreferences = []
) => {
  if (!Array.isArray(mealType)) {
    mealType = [mealType];
  }
  const calorieRanges = {
    muscle_gain: {
      minCalories: 200,
      maxCalories: 750,
    },
    weight_loss: {
      minCalories: 200,
      maxCalories: 500,
    },
    maintenance: {
      minCalories: 200,
      maxCalories: 600,
    },
  };
  const { minCalories, maxCalories } = goal ? calorieRanges[goal] : {};
  const dietaryPref =
    dietaryPreferences.length > 0 ? dietaryPreferences[0] : null;

  try {
    const response = await axios.get(`${spoonacularAPI}`, {
      params: {
        number: 40,
        addRecipeInformation: true,
        addRecipeInstructions: true,
        addRecipeNutrition: true,
        fillIngredients: true,
        ...(query && { query: query }),
        ...(mealType.length > 0 && { type: mealType.join(",") }),
        ...(goal && { minCalories: minCalories }),
        ...(goal && { maxCalories: maxCalories }),
        ...(dietaryPref && { diet: dietaryPref }),
        apiKey: process.env.SPOONACULAR_API_KEY2,
      },
    });

    return response.data.results;
  } catch (error) {
    console.log("error fetching from spoonaclular", error);
    throw error;
  }
};
// edamam recipes
export const getEdamamRecipes = async (
  ingredients = [],
  type = null,
  goal = null,
  dietaryPreferences = []
) => {
  try {
    const calorieRanges = {
      muscle_gain: "200-750",
      weight_loss: "200-500",
      maintenance: "200-600",
    };
    const calorieRange = goal ? calorieRanges[goal] : {};
    const query = ingredients.length > 0 ? ingredients.join(",") : "recipe";

    const healthLabel =
      dietaryPreferences.length > 0 ? dietaryPreferences[0] : undefined;
    const response = await axios.get(`${edamamAPI}`, {
      params: {
        q: query,
        app_id: process.env.EDAMAM_APP_ID1,
        app_key: process.env.EDAMAM_APP_KEY1,
        from: 0,
        to: 20,
        ...(type && { mealType: type }),
        ...(goal && { calories: calorieRange }),
        ...(healthLabel && { health: healthLabel }),
      },
    });
    return response.data.hits;
  } catch (error) {
    console.log("error fetching from edamam", error);
    throw error;
  }
};

// get tastyAPI recipes
export const getTastyAPIRecipes = async (ingredients = []) => {
  const query = ingredients.length > 0 ? ingredients.join(",") : null;
  try {
    const response = await axios.get(`${tastyAPI}`, {
      params: {
        from: 0,
        size: 20,
        tags: "under_30_minutes",
        q: query,
      },
      headers: {
        "x-rapidapi-key": process.env.RAPID_APIKEY,
        "x-rapidapi-host": "tasty.p.rapidapi.com",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("error occured", error);
    throw error;
  }
};
