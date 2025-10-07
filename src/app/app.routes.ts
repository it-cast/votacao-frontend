import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { LoginComponent } from './pages/login/login.component';

import { CamaraComponent } from './pages/camara/camara.component';
import { AdicionarComponent } from './pages/camara/adicionar/adicionar.component';

import { DashboardSistemaComponent } from './pages/dashboard-sistema/dashboard-sistema.component';

import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AdicionarComponent as AdicionarUsuarioComponent } from './pages/usuario/adicionar/adicionar.component';

import { UsuarioCamaraComponent } from './pages/usuario-camara/usuario-camara.component';
import { AdicionarComponent as AdicionarUsuarioCamaraComponent } from './pages/usuario-camara/adicionar/adicionar.component';

import { InvalidoComponent } from './pages/invalido/invalido.component';

import { MandatoComponent } from './pages/mandato/mandato.component';
import { AdicionarComponent as AdicionarMandatoComponent  } from './pages/mandato/adicionar/adicionar.component';

import { VereadorMandatoComponent } from './pages/vereador-mandato/vereador-mandato.component';
import { AdicionarComponent as AdicionarVereadorMandatoComponent } from './pages/vereador-mandato/adicionar/adicionar.component';

import { ComissaoComponent } from './pages/comissao/comissao.component';
import { AdicionarComponent as AdicionarComissaoComponent } from './pages/comissao/adicionar/adicionar.component';

import { ComissaoMembroComponent } from './pages/comissao-membro/comissao-membro.component';
import { AdicionarComponent as AdicionarComissaoMembroComponent } from './pages/comissao-membro/adicionar/adicionar.component';

import { VereadorComponent} from './pages/vereador/vereador.component';
import { AdicionarComponent as AdicionarVereadorComponent } from './pages/vereador/adicionar/adicionar.component';



import { AcessoComponent } from './pages/acesso/acesso.component';




export const routes: Routes = [
  

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', redirectTo: '', pathMatch: 'full' }, 
      { path: 'invalido/:code', component: InvalidoComponent }
    ]
  },
  
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardSistemaComponent },

      { path: 'camara', component: CamaraComponent },
      { path: 'camara/adicionar', component: AdicionarComponent },
      { path: 'camara/editar/:id', component: AdicionarComponent},

      { path: 'usuario', component: UsuarioComponent},
      { path: 'usuario/adicionar', component: AdicionarUsuarioComponent},
      { path: 'usuario/editar/:id', component: AdicionarUsuarioComponent},

      { path: 'camara/usuarios/:camaraId', component: UsuarioCamaraComponent},
      { path: 'camara/usuarios/:camaraId/adicionar', component: AdicionarUsuarioCamaraComponent},
      { path: 'camara/usuarios/:camaraId/editar/:id', component: AdicionarUsuarioCamaraComponent},

      { path: 'mandato', component: MandatoComponent},
      { path: 'mandato/adicionar', component: AdicionarMandatoComponent},
      { path: 'mandato/editar/:id', component: AdicionarMandatoComponent},

      { path: 'mandato/vereadores/:mandatoId', component: VereadorMandatoComponent},
      { path: 'mandato/vereadores/:mandatoId/adicionar', component: AdicionarVereadorMandatoComponent},
      { path: 'mandato/vereadores/:mandatoId/editar/:id', component: AdicionarVereadorMandatoComponent},

      { path: 'comissao', component: ComissaoComponent},
      { path: 'comissao/adicionar', component: AdicionarComissaoComponent},
      { path: 'comissao/editar/:id', component: AdicionarComissaoComponent},

      { path: 'comissao/membros/:comissaoId', component: ComissaoMembroComponent},
      { path: 'comissao/membros/:comissaoId/adicionar', component: AdicionarComissaoMembroComponent},
      { path: 'comissao/membros/:comissaoId/editar/:id', component: AdicionarComissaoMembroComponent},

      {path: 'vereador', component: VereadorComponent},
      {path: 'vereador/adicionar', component: AdicionarVereadorComponent},
      {path: 'vereador/editar/:id', component: AdicionarVereadorComponent},



      { path: 'acesso', component: AcessoComponent }
    ]
  },

  
  { path: '**', redirectTo: 'invalido/404' }
];
