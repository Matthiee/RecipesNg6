import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { filter, switchMap, first } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private _recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);

  constructor(private shoppingListSvc: ShoppingListService, private db: DataStorageService, private toast: NotifierService) {
    this.init();
  }

  private init(): void {
    this.db.getRecipes().pipe(first()).subscribe(
      recipes => {

        this._recipes.next(recipes);

        this.toast.notify('info', `Loaded ${recipes.length} recipes`);
      },
      error => {
        this.showError("Unable to get the recipes");
        this._recipes.error(error);
      });
  }

  private showError(msg: string): void {
    this.toast.notify('error', msg);
  }

  public getRecipes(): Observable<Recipe[]> {
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
        _done => {

          console.info(`Updated #${recipe.id} ${recipe.name} in the DB!`, 'color: green');

          let recipes = this._recipes.value;

          const idx = recipes.findIndex(r => r.id === id);

          recipes[idx] = recipe;

          this._recipes.next(recipes);

          this.toast.notify('success', `Updated '${recipe.name}'!`);
        },
        error => {
          this.showError("Unable to update the recipe");
          this._recipes.error(error);
        });
  }

  public addRecipe(recipe: Recipe): void {

    this.db.addRecipe(recipe)
      .pipe(
        first())
      .subscribe(
        result => {
          let recipes = this._recipes.value;

          recipes.push(result);

          this._recipes.next(recipes);

          this.toast.notify('success', `Added '${recipe.name}'!`);
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
        _result => {
          let recipes = this._recipes.value;

          const idx = recipes.findIndex(r => r.id === id);

          const removedRecipes = recipes.splice(idx, 1);

          if (!!removedRecipes && removedRecipes.length > 0)
            this._recipes.next(recipes);

          this.toast.notify('success', "Recipe removed!");

        },
        error => {
          this.showError("Unable to delete the recipe");
          this._recipes.error(error);
        });

  }
}
