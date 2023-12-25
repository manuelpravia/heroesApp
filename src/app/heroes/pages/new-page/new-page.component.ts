import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('',{ nonNullable: true}),
    publisher:        new FormControl<Publisher>( Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    {id:'DC Comics', desc: 'DC - Comics'},
    {id:'Marvel Comics', desc: 'Marvel - Comics'}
  ];

  constructor(
    private heroeService: HeroesService,
    private activetedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
    ){}


  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activetedRoute.params
    .pipe(
      switchMap( ({id}) => this.heroeService.getHeroById(id)),
    ).subscribe( hero => {
      if( !hero ) return this.router.navigateByUrl('/');

      this.heroForm.reset( hero );
      return;
    });

  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {

    if ( this.heroForm.invalid ) return;

    if (this.currentHero.id) {
      this.heroeService.updateHero( this.currentHero)
      .subscribe( hero => {
        // TODO mostrar snackbar
        this.showSnackbar(`${hero.superhero} updated...!`)
      });

      return;
    }

    this.heroeService.addHero( this.currentHero)
    .subscribe( hero => {
      //TODO mostrar snacbar, y navegar a /heroes/edit/hero.id
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} created...!`);

    })


    /*console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value
    })*/
  }

  onDeleteHero(){

    if( !this.currentHero.id ) return;
    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result),
      switchMap(() => this.heroeService.deleteHero(this.currentHero.id)),
      filter( (wasDeleted: boolean) => wasDeleted )
    )
    .subscribe( () =>{
      this.router.navigate(['heroes']);
    });

    /*dialogRef.afterClosed()
    .subscribe(result => {
      if (!result) return;
      this.heroeService.deleteHero(this.currentHero.id)
      .subscribe(resp =>{
        if( resp )
        this.router.navigate(['heroes']);
      });

    });*/

  }

  showSnackbar( message: string ): void {
    this.snackbar.open( message, 'done',{
      duration: 2500,
    })
  }

}
