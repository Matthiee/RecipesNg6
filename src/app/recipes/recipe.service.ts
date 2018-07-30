import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();

  constructor() { }

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a test..', 'http://photos1.blogger.com/x/blogger/5763/1274/1600/885418/fruiet%20and%20nut%20blondies%20holiday%20R.jpg'),
    new Recipe('Spaghetti', 'Itialian spaghetti made with love blabla', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCCYz2ECNEhS2iw3VCFuoNTNRsToFwIp1fHQXECqidby2TGcKG')
  ];

  getRecipes() {
    return this.recipes.slice();
  }


}
