import jsPDF from "jspdf";
import "jspdf-autotable";
import RecipeShowServices from "../services/RecipeShowServices.js";
import RecipeStepServices from "../services/RecipeStepServices.js";
import { ref } from "vue";

export default {

  async generateRecipePDF(recipe) {

    console.log("Generating PDF for recipe: ", recipe);
    const recipeShows = ref([]);
    const recipeSteps = ref([]);

    const stepsHeading = [
      { title: "Step", dataKey: "stepNumber" },
      { title: "Instruction", dataKey: "instruction" },
      { title: "Shows", dataKey: "showList" },
    ];

    await RecipeShowServices.getRecipeShowsForRecipe(recipe.id)
      .then((response) => {
        recipeShows.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    await RecipeStepServices.getRecipeStepsForRecipeWithShows(
      recipe.id
    )
      .then((response) => {
        recipeSteps.value = response.data;
        recipeSteps.value.forEach((step) => {
          step.showList = step.recipeShow
            .map((ri) => ri.show.name)
            .join(", ");
        })

      })
      .catch((error) => {
        console.log(error);
      });

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
    });
    var img = new Image();




    img.src = "/oc-logo-white.png";
    doc.addImage(img, "PNG", 0.4, 0.78, 0.975, 0.56);

    let asof = "published as of " + new Date(Date.now()).toLocaleDateString();

    let footer = recipe.name + " " + asof;
    // text is placed using x, y coordinates
    doc.setFontSize(16).text(recipe.name, 1.0, 1.7);
    doc.setFontSize(12).text(recipe.description, 1.5, 2.0);

    // create a line under heading
    //doc.setLineWidth(0.01).line(0.5, 2.1, 8.0, 2.1);

    doc.setFontSize(16).text("Shows", 1.0, 2.5);
    var startY = 2.8
    recipeShows.value.forEach((show, index) => {
      doc.setFontSize(12).text(
        `${show.quantity} ${show.show.unit}${show.quantity > 1 ? "s" : ""
        } of ${show.show.name} ($${show.show.pricePerUnit
        }/${show.show.unit})`,
        1.5,
        startY
      );
      startY = startY + 0.3;
    });


    doc.setFontSize(16).text("Steps", 1.0, startY);

    startY = startY + 0.3;

    doc.autoTable({
      columns: stepsHeading,
      headStyles: {
        fillColor: [129, 20, 41],
        fontSize: 11,
      },
      startY: startY,
      body: recipeSteps.value,
      margin: { left: 0.5, top: 1.5 },
    })

    // Creating footer and saving file
    doc.setFontSize(10).text(footer, 0.5, doc.internal.pageSize.height - 0.5);
    doc.save(`recipeReport.pdf`);
  }
}
