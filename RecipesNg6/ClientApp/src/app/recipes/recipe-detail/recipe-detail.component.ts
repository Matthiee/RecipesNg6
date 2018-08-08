import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(private recipeSvc: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id'];
        this.recipeSvc.getRecipe(this.id).subscribe(recipe => this.recipe = recipe);
      });

  }

  onRecipeChanged(recipe: Recipe) {
    this.recipe = recipe;
  }

  onAddToShoppingList() {
    this.recipeSvc.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.recipeSvc.deleteRecipe(this.id);

    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
