import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiPessoas } from '../servico/api-pessoas';
import { Pessoa } from '../modelo/Pessoa';
import { MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, ReactiveFormsModule],
  templateUrl: './crud.html',
  styleUrl: './crud.css',
})
export class Crud {

  // Visiblidade dos botões
  btnCadastrar:boolean = true;

  // Colunas da tabela
  colunas:String[] = ['id', 'nome', 'cidade', 'selecionar'];

  // Vetor para armazenar as pessoas
  vetor:Pessoa[] = [];

  // Objeto - FormulÃ¡rio Reativo
  formularioPessoa = new FormGroup({
    id     : new FormControl(),
    nome   : new FormControl(),
    cidade : new FormControl()
  });

  //Construtor
  constructor(private servico:ApiPessoas){}

  // ngOnInit - Executa este mÃ©todo apÃ³s o componente ser montado
  ngOnInit():void{
    this.listar();
  }

  // Método para selecionar todas as pessoas da API
  listar():void{
    this.servico.listar().subscribe(pessoas => this.vetor = pessoas);
  }

  // MÃ©todo para cadastrar pessoas
cadastrar():void{
  // Criar um novo objeto
  let obj = {...this.formularioPessoa.value}; // Copia todas as caracterÃ­sticas do nosso formulÃ¡rio reativo (via spred operator).
  delete obj.id; // Remove o id, para que nossa API receba um objeto contendo apenas o nome e a cidade.

  // Realizar a requisiÃ§Ã£o de cadastro (POST) e atualizar o vetor
  this.servico.cadastrar(obj).subscribe(pessoa => this.vetor = [...this.vetor, pessoa]);

  // Limpar o formulÃ¡rio
  this.formularioPessoa.reset();
}

// Método para selecionar uma pessoa especÃ­fica
selecionarPessoa(id:string):void{
  this.servico.selecionarPessoa(id).subscribe(pessoa => {
    
    // Disponibiliza um objeto com as caracterÃ­sticas: id, nome e cidade para o nosso formulário reativo
    this.formularioPessoa.patchValue(pessoa);

    // Visibilidade dos botÃµes
    this.btnCadastrar = false;
  });
}

  // Método para cancelar as aÃ§Ãµes de alteraÃ§Ã£o e remoÃ§Ã£o
  cancelar():void{
    this.formularioPessoa.reset();
    this.btnCadastrar = true;
  }

  // Método para alterar dados
alterar():void{
  this.servico.alterar(this.formularioPessoa.value)
  .subscribe(pessoa => {

    // Obter o Ã­ndice da pessoa alterada no vetor
    const indicePessoaAlterada = this.vetor.findIndex(obj => obj.id === pessoa.id);

    // Atualizar valor do vetor
    this.vetor[indicePessoaAlterada] = pessoa;

    // ForÃ§ar a atualizaÃ§Ã£o do vetor (para exibir corretamente na tabela)
    this.vetor = [...this.vetor];

    // Visibilidade dos botÃµes e limpeza dos campos
    this.cancelar();
  });
}

// Método para remover pessoas
remover():void{
  this.servico.remover(this.formularioPessoa.value.id)
  .subscribe(pessoa => {

    // Obter o Ã­ndice da pessoa removida no vetor
    const indicePessoaRemovida = this.vetor.findIndex(obj => obj.id === pessoa.id);

    // Efetuar a remoÃ§Ã£o no vetor
    this.vetor.splice(indicePessoaRemovida, 1);

    // ForÃ§ar a atualizaÃ§Ã£o do vetor (para exibir corretamente na tabela)
    this.vetor = [...this.vetor];

    // Visibilidade dos botÃµes e limpeza dos campos
    this.cancelar();
  });
}


}
