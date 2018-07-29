import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output()
  recipeSelected =  new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a test..', 'http://photos1.blogger.com/x/blogger/5763/1274/1600/885418/fruiet%20and%20nut%20blondies%20holiday%20R.jpg'),
    new Recipe('Spaghetti', 'Itialian spaghetti made with love blabla', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCCYz2ECNEhS2iw3VCFuoNTNRsToFwIp1fHQXECqidby2TGcKG')
  ];

  constructor() { }

  ngOnInit() {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }

}
