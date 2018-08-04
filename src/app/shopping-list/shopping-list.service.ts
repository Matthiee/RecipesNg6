import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { EditingState } from '../shared/editing-state';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  public ingredientListChanged = new Subject<Ingredient[]>();
  public editingStateChanged = new Subject<EditingState>();

  private ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10)
  ];

  constructor() { }

  public getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  public getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  public addIngredient(ingredient: Ingredient) {

    this.addNewOrExistingIngredient(ingredient);

    this.ingredientListChanged.next(this.ingredients.slice());
  }

  private addNewOrExistingIngredient(ingredient: Ingredient) {
    let existingIngredient: Ingredient = this.ingredients.find(i => i.name === ingredient.name);

    if (!existingIngredient)
      this.ingredients.push(ingredient);
    else
      existingIngredient.amount = +existingIngredient.amount + +ingredient.amount;
  }

  public updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientListChanged.next(this.ingredients.slice());
  }

  public addIngredients(ingredients: Ingredient[]) {

    ingredients.forEach((i: Ingredient) => this.addNewOrExistingIngredient(i));

    this.ingredientListChanged.next(this.ingredients.slice());
  }
}
