# Como implementar uma nova tela no Tagnos

Este manual visa exemplificar o processo para criar de uma tela no Tagnos

## 1 - Crie os Arquivos

Vá até a pasta `src/domains` e verifique se já existe o nome do "módulo"
 ao qual a entidade que será usada melhor se encaixa. Caso não exista,
 será preciso criar o "módulo".

Uma vez que o "módulo" foi criado cria uma pasta com o nome da entidade
 que será a principal responsável pela gestão dos dados que irá fazer
 uso.

Dentro dessa pasta crie 3 pastas básicas: Prototype, Service e View.
O resultado deverá ser algo parecido com isso.
```
/src
  /domains
    /<módulo>
      /<entidade>
        /Prototype
        /Service
        /View
```
Em seguida crie o arquivos referentes à cada pasta usando o nome da
 entidade que pretende criar como nome ou prefixo. Dentro de `Service`
 crie um arquivo .js com o nome da entidade (ou rotina) representada
 seguido da palavra Service (`<Entidade>Service.js`). Em seguida vá crie
 em `Prototype` um arquivo .js com o nome da entidade (`<Entidade>.js`).
 Em seguida podemos criar os arquivos na pasta View e o arquivo do i18n.
 O resultado esperado é parecido com o que está abaixo.
```
/src
  /domains
    /<Módulo>
      /<Entidade>
        /Prototype
          <Entidade>.js
        /Service
          <Entidade>Service.js
        /View
          <Entidade>Form.vue
          <Entidade>table.vue
        pt-br.js
```
> Não se esqueça de registrar o arquivo de idioma no i18n

## 2 - Configurar rotas

Ainda na parte de implementação é precisa configurar as rotas para os
novos recursos serem acessíveis pelo menu.
Vá até o arquivo `src/config/app/routes` e adicione a(s) nova(s) rota(s).

## 3 - i18n

Ainda na parte de implementação é precisa configurar o i18n para que
tenhamos centralizados a label dos fields, e mensagens.
Vá até o arquivo `src/i18n/pt-br/domains/nomeDomain` e adicione o novo arquivo no pt-br

## 4 - Administração

Acesso o Tagnos e registre os novos recursos nos seguintes menus:
- Funções
- Permissões
- Cadastro Menu

## 5 - Segurança

Não se esqueça de adicionar a nova permissão ao perfil que será usado
 pelo usuário para acessar à aplicação. Esta opção fica no menu:
- Permissão por Perfil
