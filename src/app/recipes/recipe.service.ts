import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private shoppingListSvc: ShoppingListService) { }

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe',
      'This is a test..',
      'http://photos1.blogger.com/x/blogger/5763/1274/1600/885418/fruiet%20and%20nut%20blondies%20holiday%20R.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Fries', 20)
      ]),
    new Recipe('Spaghetti',
      'Itialian spaghetti made with love blabla',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCCYz2ECNEhS2iw3VCFuoNTNRsToFwIp1fHQXECqidby2TGcKG',
      [
        new Ingredient('Bun', 1),
        new Ingredient('Meat', 1),
        new Ingredient('Spaghetti', 1)
      ])
  ];

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListSvc.addIngredients(ingredients);
  }
}
