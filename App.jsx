import { useState, useEffect } from "react";

// URL ka tvojim receptima u Gist-u
const GIST_URL = "https://gist.github.com/elysiumems/12d3d140451ef191fa4f63abacb0b699 "; 
const GIST_ID = "12d3d140451ef191fa4f63abacb0b699"; // ID iz URL-a
const GITHUB_TOKEN = ""; // OSTAVI PRAZNO AKO JE GIST JAVAN

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    materials: [{ materialName: "", quantity: 1, timePerUnit: 0, isRecipe: false, recipeName: "" }],
    output: 1,
  });
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [quantityToMake, setQuantityToMake] = useState(1);
  const [activeRecipes, setActiveRecipes] = useState([]);

  // --- Učitaj iz Gist-a ---
  useEffect(() => {
    async function fetchRecipesFromGist() {
      try {
        const res = await fetch(GIST_URL);
        if (!res.ok) throw new Error("Greška pri učitavanju Gist-a");
        const data = await res.json();
        setRecipes(data || []);
      } catch (err) {
        console.error("Ne mogu da učitam Gist:", err);
        setRecipes([]);
      }
    }

    fetchRecipesFromGist();
  }, []);

  // --- Sačuvaj u Gist ---
  const saveRecipesToGist = async (updatedRecipes) => {
    try {
      const gistData = {
        files: {
          "recepti.json": {
            content: JSON.stringify(updatedRecipes, null, 2),
          },
        },
      };

      const response = await fetch(`https://api.github.com/gists/${GIST_ID}`,  {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
        },
        body: JSON.stringify(gistData),
      });

      if (!response.ok) throw new Error("Greška pri čuvanju u Gist");

      console.log("Recepti su uspešno sačuvani!");
    } catch (err) {
      console.error("Greška pri čuvanju u Gist", err);
    }
  };

  // Kad se promeni lista recepata, pošalji ih u Gist
  useEffect(() => {
    if (recipes.length > 0) {
      saveRecipesToGist(recipes);
    }
  }, [recipes]);

  // --- Ostatak koda ostaje nepromenjen (funkcije i render) ---

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Tvoj JSX ostaje isti */}
    </div>
  );
}
