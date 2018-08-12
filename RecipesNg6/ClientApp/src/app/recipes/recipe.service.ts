import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { flatMap, filter, switchMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private _recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);

  constructor(private shoppingListSvc: ShoppingListService, private db: DataStorageService) {
    this.loadInitialRecipes();
  }

  private loadInitialRecipes(): void {
    this.db.getRecipes().pipe(first()).subscribe(
      recipes => {

        console.info(`Loaded ${recipes.length} recipes`, 'color: green');

        this._recipes.next(recipes);

      },
      error => this._recipes.error(error));
  }

  public getRecipes(id?: number): Observable<Recipe[]> {
    return this._recipes.asObservable();
  }

  public getRecipe(id: number): Observable<Recipe> {
    return this._recipes.pipe(
      switchMap(_ => _),
      filter(_ => _.id === id)
    );
  }

  public updateRecipe(id: number, recipe: Recipe): void {

    recipe.id = id;

    this.db.updateRecipe(id, recipe)
      .pipe(
        first())
      .subscribe(
        done => {

          console.info(`Updated #${recipe.id} ${recipe.name} in the DB!`, 'color: green');

          let recipes = this._recipes.value;

          const idx = recipes.findIndex(r => r.id === id);

          recipes[idx] = recipe;

          this._recipes.next(recipes);
        },
        err => this._recipes.error(err));
  }

  public addRecipe(recipe: Recipe): void {

    this.db.addRecipe(recipe)
      .pipe(
        first())
      .subscribe(
        result => {

          console.info(`Added ${recipe.name} in the DB!`, 'color: green');

          let recipes = this._recipes.value;

          recipes.push(result);

          this._recipes.next(recipes);
        },
        err => this._recipes.error(err));
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListSvc.addIngredients(ingredients);
  }

  deleteRecipe(id: number) {

    this.db.removeRecipe(id)
      .pipe(
        first())
      .subscribe(
        result => {

          console.info(`Removed recipes #${id} from the DB!`, 'color: green');

          let recipes = this._recipes.value;

          const idx = recipes.findIndex(r => r.id === id);

          const removedRecipes = recipes.splice(idx, 1);

          if (!!removedRecipes && removedRecipes.length > 0)
            this._recipes.next(recipes);

        },
      err => this._recipes.error(err));

  }
}
