import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  
  selectedRecipe: Recipe;

  constructor(private recipeSvc: RecipeService) { }

  ngOnInit() {

    this.recipeSvc.recipeSelected
      .subscribe((recipe: Recipe) => {
        this.selectedRecipe = recipe;
      });

  }

  onRecipeSelected(recipe: Recipe) {
    this.selectedRecipe = recipe;
  }

}
