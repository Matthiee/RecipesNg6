import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { first, map, switchMap, tap } from 'rxjs/operators';

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
      .pipe(
        map(params => +params['id']),
        tap(id => this.id = id),
        switchMap(id => this.recipeSvc.getRecipe(id))
      )
      .subscribe((data: Recipe) => this.recipe = data);

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
