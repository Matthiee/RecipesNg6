import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { flatMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  public ingredientListChanged = new Subject<Ingredient[]>();
  public editingStateChanged = new Subject<number>();

  constructor(private db: DataStorageService) { }

  public getIngredients(): Observable<Ingredient[]> {
    return this.db.getIngredients();
  }

  public getIngredient(id: number): Observable<Ingredient> {
    return this.db.getIngredients().pipe(flatMap(_ => _), filter(_ => _.id === id));
  }

  public async addIngredient(ingredient: Ingredient) {

    await this.addNewOrExistingIngredient(ingredient);

    this.ingredientListChanged.next();
  }

  private async addNewOrExistingIngredient(ingredient: Ingredient) {
    let existingIngredient: Ingredient = await this.getIngredients()
      .pipe(
        flatMap(_ => _),
        filter(_ => _.name === ingredient.name))
      .toPromise();

    if (!!existingIngredient)
      existingIngredient.amount = +existingIngredient.amount + +ingredient.amount;
    else {
      let result = await this.db.addIngredient(ingredient).toPromise();

      (await this.getIngredients().toPromise()).push(result);
    }
      
  }

  public async updateIngredient(id: number, newIngredient: Ingredient) {

    await this.db.updateIngredient(id, newIngredient);

  }

  public async addIngredients(ingredients: Ingredient[]) {

    ingredients.forEach(async (i: Ingredient) => await this.addNewOrExistingIngredient(i));

    this.ingredientListChanged.next();
  }

  public async removeIngredient(ingredient: Ingredient) {

    await this.db.removeIngredient(ingredient).toPromise();

    this.ingredientListChanged.next();
  }
}
