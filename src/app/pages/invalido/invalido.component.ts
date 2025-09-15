import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-invalido',
  imports: [ButtonModule, RouterLink],
  templateUrl: './invalido.component.html',
  styleUrl: './invalido.component.scss'
})
export class InvalidoComponent {
  
  code: any = ""
  code_description: string = ""

  constructor(
    private actRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    //-- Ao editar um cadastro
    this.actRouter.params.subscribe(async (params) => {
      this.code = params['code'];

      if (this.code != 401 && this.code != 404) this.code = 404

      if (this.code == 404) this.code_description = "A página que você está buscando não foi encontrada."
      else this.code_description = "Você não tem permissão para acessar a página atual."

    });
  }
}
