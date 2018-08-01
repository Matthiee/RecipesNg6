import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  @Input()
  recipe: Recipe;

  constructor(private recipeSvc: RecipeService) { }

  ngOnInit() {
  }

  onRecipeChanged(recipe: Recipe) {
    this.recipe = recipe;
  }

  onAddToShoppingList() {
    this.recipeSvc.addIngredientsToShoppingList(this.recipe.ingredients);
  }

}
