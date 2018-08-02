import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  
  recipe: Recipe;
  id: number;

  constructor(private recipeSvc: RecipeService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeSvc.getRecipe(this.id);
      });

  }

  onRecipeChanged(recipe: Recipe) {
    this.recipe = recipe;
  }

  onAddToShoppingList() {
    this.recipeSvc.addIngredientsToShoppingList(this.recipe.ingredients);
  }

}
