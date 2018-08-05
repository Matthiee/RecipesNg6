import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public recipeListChanged = new Subject<Recipe[]>();

  constructor(private shoppingListSvc: ShoppingListService, private db: DataStorageService) { }

  private recipes: Recipe[];

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;

    this.recipeListChanged.next(this.getRecipes());
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);

    this.recipeListChanged.next(this.getRecipes());
  }

  getRecipes(): Recipe[] {

    if (this.recipes)
      return this.recipes.slice();

    let recipes = this.db.getRecipes().subscribe(
      (resp) => {

        this.recipes = resp;

        this.recipeListChanged.next(this.getRecipes());

      },
      error => {
        console.log(error);
      });

    return [];
  }

  getRecipe(id: number): Recipe {
    return this.getRecipes().find(r => r.id === id);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListSvc.addIngredients(ingredients);
  }

  deleteRecipe(index: number) {

    this.recipes.splice(index, 1);

    this.recipeListChanged.next(this.getRecipes());
  }
}
