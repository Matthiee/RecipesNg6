import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeSvc: RecipeService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.id = +params['id'];
      this.editMode = params['id'] != null;

      this.initForm();
    });
  }

  private initForm() {

    let recipeName = '';
    let recipeImgPath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.recipeSvc.getRecipe(this.id).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImgPath = recipe.imagePath;
        recipeDesc = recipe.description;

        if (recipe['ingredients']) {
          for (let i of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(i.name, Validators.required),
              'amount': new FormControl(i.amount, Validators.required)
            }));
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDesc, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    if (this.editMode)
      this.recipeSvc.updateRecipe(this.recipeForm.value);
    else
      this.recipeSvc.addRecipe(this.recipeForm.value);

    this.navigateToRecipes();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, Validators.required)
      })
    );
  }

  navigateToRecipes() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel() {
    this.navigateToRecipes();
  }

  onDeleteIngredient(idx: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(idx);
  }

}
