import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject, Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { flatMap, filter } from 'rxjs/operators';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public recipeListChanged = new Subject<void>();

  constructor(private shoppingListSvc: ShoppingListService, private db: DataStorageService) { }

  updateRecipe(recipe: Recipe) {

    this.db.updateRecipe(recipe)
      .subscribe(
        done => {

          this.db.getRecipes()
            .pipe(flatMap(d => d), filter(d => d.id === recipe.id))
            .subscribe(
              result => {

                result = recipe;

                this.recipeListChanged.next();

              },
              err => console.error(err));

        },
        error => console.error(error));
  }

  addRecipe(recipe: Recipe) {

    this.db.addRecipe(recipe).subscribe(
      succes => {

        this.db.getRecipes().subscribe(recipes => recipes.push(succes), err => console.error(err));

      }, error => console.error(error));

    this.recipeListChanged.next();
  }

  getRecipes(): Observable<Recipe[]> {

    let obs = this.db.getRecipes();

    obs.subscribe(null, err => console.error(err));

    return obs;

  }

  getRecipe(id: number): Observable<Recipe> {
    return this.db.getRecipes().pipe(flatMap((data) => data), filter((data) => data.id === id));
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListSvc.addIngredients(ingredients);
  }

  deleteRecipe(index: number) {
    
    this.recipeListChanged.next();
  }
}
