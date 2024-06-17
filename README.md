## Grupo

| Número | Nome          |
| -------- | ------- |
| a100066 | Ricardo Miguel Queirós de Jesus |
| a100659 | Rui Pedro Fernandes Madeira Pinto |
| a100557 | Pedro Miguel Costa Azevedo |


# Índice

- [Grupo](#grupo)
- [Introdução](#1-introdução)
- [Objetivo](#2-objetivo)
- [Análise e Especificação](#3-análise-e-especificação)
  - [Descrição do problema](#31-descrição-do-problema)
  - [Levantamento de Requisitos](#32-levantamento-de-requisitos)
    - [Requisitos Funcionais](#321-requisitos-funcionais)
    - [Requisitos Extra](#322-requisitos-extra)
- [Estrutura / Desenvolvimento](#4-estrutura--desenvolvimento)
  - [API de dados](#41-api-de-dados)
    - [curjos.js](#411-curjosjs)
    - [recursos.js](#412-recursosjs)
    - [users.js](#413-usersjs)
  - [UniMaterial](#42-unimaterial)
    - [admin.js](#421-adminjs)
    - [index.js](#422-indexjs)
    - [recursos.js](#423-recursosjs)
    - [users.js](#424-usersjs)
  - [Autenticação](#43-autenticação)
- [Interface desenvolvida](#5-interface-desenvolvida)
  - [Pagina de autenticação](#51-pagina-de-autenticação)
  - [Pagina de registo](#52-pagina-de-registo)
  - [Página de notícias](#53-página-de-notícias)
  - [Página de recursos](#54-página-de-recursos)
  - [Página de publicação de um recurso](#55-página-de-publicação-de-um-recurso)
  - [Página de edição de um recurso](#56-página-de-edição-de-um-recurso)
  - [Página do painel do administrador](#57-página-do-painel-do-administrador)
  - [Página de perfil](#58-página-de-perfil)
  - [Página de edição de perfil](#59-página-de-edição-de-perfil)
- [Modo de funcionamento](#6-modo-de-funcionamento)
- [Conclusão](#7-conclusão)


# 1. Introdução 

Este relatório apresenta o trabálho prático realizado no âmbito da unidade curricular de Engenharia Web, realizado durante o 2º semestre do 3º ano do curso de Licenciatura em Engenharia Informática. 

Neste projeto, o grupo decidiu escolher a prosposta "Plataforma de Gestão e Disponibilização de Recursos Educativos" tendo sido esta, a proposta que despertou mais interesse no nosso grupo

Ao longo deste relatório, iremos falar sobre a análise e especificação, descrevendo o problema a ser resolvido e establencendo os requisitos necessários. Posteriormente, iremos detalhar a estrutura do projeto, mostrando em mais detalhe, como foi feita a organização em termos de codificação. Após isto, iremos mostrar, com auxílio de print's, a interface desenvolvida. Por fim, iremos explicar como executar o projeto e respetiva conclusão do relatório.

# 2. Objetivo

O objetivo deste projeto é criar uma plataforma que os alunos, professores, entre outros, de uma escola/universidade, possam utilizar, para fornecer recursos que possam ser visualizados pelos restantes utilizadores da plataforma.

# 3. Análise e Especificação

## 3.1 Descrição do problema

O objetivo deste trabalho é desenvolver uma plataforma a ser usada por vários utilizadores desde professores, alunos, tendo também a possibilidade de ter um administrador com controlo total sobre o resto dos utilizadores.

Os utilizadores desta plataforma têm a possibilidade de publicar os seus próprios recursos, avaliar os recursos publicados por outros utilizadores e comentar tanto os próprios recursos como os recursos publicados por outros utilizadores.

## 3.2 Levantamento de Requisitos

Durante o desenvolvimento desta plataforma, o grupo levantou diversos requisitos de forma a ajudar na orientação e desenvolvimento do projeto.

### 3.2.1 Requisitos Funcionais

Neste projeto fomos capazes de implementar todos os objetivos principais.

Cada utilizador é capaz de criar conta, criar publicações onde pode dizer o nome, tema, uma descrição e os ficheiros pretendidos.

Um utilizador é capaz de comentar e avaliar os diversos posts.

Criamos ainda um admin, capaz de fazer tudo o que faz o utilizador normal, porém tem ainda um painel de admin capaz de editar ou eliminar utilizadores.

### 3.2.2 Requisitos Extra

De requisitos extras adicionamos a opção de favoritos, onde um utilizador pode criar uam lista com as suas publicações favoritas.

Adicionamos também, na parte da  publicação, a opção de acesso restrito, podendo este ser público, restrito ao curso, departamento ou escola.

Na secção do perfil, cada utilizador tem uma tabela com as suas respetivas publicações.

Na aba de publicações, é possível pesquisar por autor, nome, tema, escola, departamento ou curso. É ainda possível ordenar as publicações por ordem de publicação, melhores avaliações e mais avaliações.

# 4. Estrutura / Desenvolvimento

Neste capítulo iremos falar de como o foi feita a estrutuação do projeto. Este proejto foi estruturado entre duas sub-aplicações, a API de dados e a UniMaterial(interface).
Cada uma destas partes desempenha um importante papel no funcionamento da plataforma desenvolvidoa, trabalhando de forma conjunta de forma a funcionar na totalidade. A estruturação nestas duas partes distintas, permite que o projeto seja dividido nestes dois módulos independentes, facilitando o desenvolvimento, manutenção e escalabilidade da plataforma. Neste capítulo iremos também falar sobre como funciona a autenticação.

## 4.1 API de dados

A API de dados, tal como ensinado nas aulas práticas, foi divida em models, routes e controllers.

No model temos os cursos.js, recursos.js e users.js que indicam de que maneira serão guardados os dados em cada uma das collections.

### 4.1.1 cursos.js

As routes dos cursos chamam as funcções definidas no controller deste sendo que as definidas são usadas para encontrar os cursos todos, curso correspondente a um dado id e mais duas rotas, uma para criar um curso e outra para remover.

### 4.1.2 recursos.js

Listagem e Pesquisa de Recursos
A rota GET / permite listar todos os recursos disponíveis ou procurar recursos específicos através de parâmetros de consulta. Os recursos podem ser filtrados por nome, autor, email, ID, escola, departamento, curso ou tema. Além disso, é possível ordenar os recursos por classificação, data de criação ou número de classificações.

Inserção de Novos Recursos
A rota POST / é utilizada para adicionar novos recursos. O corpo da requisição deve conter os dados necessários para criar um novo recurso, que são processados pelo controlador RecursoController.

Atualização de Recursos
A rota POST /update/:id permite atualizar um recurso existente. Esta operação requer que o ID do recurso seja especificado na URL, e que o corpo da requisição contenha as alterações a serem aplicadas.

Remoção de Recursos
Existem várias rotas para a remoção de recursos. A rota DELETE /:id é usada para remover um recurso específico pelo seu ID. Outras rotas, como DELETE /deleteAll/:email e DELETE /deleteComments/:email, permitem remover todos os recursos ou comentários associados a um email específico, respectivamente.

Adição de Comentários e Avaliações
As rotas POST /:id/comentarios e POST /:id/avaliar são utilizadas para adicionar comentários e avaliações a um recurso específico, respectivamente. Estas operações requerem autenticação e, no caso da rota de remoção por email, também verificação de administração.

Este conjunto de rotas oferece uma base robusta para gerenciar recursos numa aplicação, permitindo interações detalhadas e específicas conforme as necessidades dos usuários. A implementação faz uso extensivo de operações assíncronas para garantir que as interações com a base de dados sejam eficientes e não bloqueiem o servidor.

### 4.1.3 users.js

Configuração do Passport
O Passport é configurado para usar LocalStrategy com o campo 'email' como identificador. Os métodos serializeUser e deserializeUser do modelo UserModel são utilizados para gerir sessões de usuário.

Rotas de Usuário
Listar Usuários (GET /)
Esta rota autenticada lista todos os usuários registrados.

Perfil de Usuário (GET /profile/:email)
Recupera detalhes de um usuário específico pelo seu e-mail. Retorna erro se o usuário não for encontrado.

Favoritos de Usuário (GET /:email/favs)
Lista os itens favoritos de um usuário, identificados pelo e-mail, requer autenticação.

Obtenção de Usuário por Token (GET /token)
Recupera informações do usuário com base no token de autenticação fornecido.

Autenticação e Registo
Login (POST /login)
Autentica um usuário utilizando o Passport. Em caso de sucesso, um token JWT é gerado com duração de uma hora.

Registo (POST /registo)
Permite o registo de um novo usuário, configurando atributos básicos e a senha, que é processada e armazenada de forma segura.

Gestão de Favoritos
Adicionar Favorito (POST /favoritos/add)
Adiciona um recurso aos favoritos de um usuário, verificando primeiro se o usuário existe e se o item já não está na lista de favoritos.

Remover Favorito (POST /favoritos/:recursoId/remove)
Remove um item dos favoritos do usuário. A rota exige autenticação e verifica se o usuário existe antes de realizar a operação.

Atualizações e Deleção
Atualizar Usuário (POST /:email)
Permite a atualização de detalhes de um usuário, exigindo autenticação para acessar esta rota.

Atualizar Cargo (PUT /:email/cargo)
Permite ao administrador atualizar o cargo de um usuário, exigindo privilégios de administrador.

Deletar Usuário (DELETE /delete/:userId)
Permite que um administrador delete um usuário, exigindo autenticação de administrador.

Cada uma dessas rotas é cuidadosamente protegida com verificações de autenticação e, em certos casos, verificações de privilégios administrativos, assegurando que operações sensíveis sejam realizadas de maneira segura e controlada.

## 4.2 UniMaterial

Na parte da interface já não temos nem models nem controllers, apenas os routes, e acrescentamos as pastas views e public.
Nas views temos todos os ficherios .pug que nos permitem ter o aspeto visual da nossa aplicação.
Na pasta public, temos a pasta fileStore, usasada para armazenar os ficheiros que os utilizadores dão upload e a pasta stylesheets que contém os ficheiros .css que são utilizados para melhorar o design da nossa página.

### 4.2.1 admin.js

Painel Administrativo
Listagem de Utilizadores e Cursos (GET /)
Esta rota autenticada apresenta o painel administrativo, listando todos os utilizadores e cursos disponíveis no sistema, caso o utilizador autenticado seja um administrador. Em caso contrário, uma mensagem de erro de acesso é apresentada.

Gestão de Perfil de Utilizador
Edição de Perfil (GET /edit/:email)
Permite ao administrador acessar a página de edição de um utilizador específico através do seu email. A rota recupera informações detalhadas do utilizador e de todos os cursos disponíveis para possibilitar alterações.

Atualização de Perfil (POST /perfil/:email/update)
Esta rota permite ao administrador atualizar informações como nome, curso, escola e departamento de um utilizador, redirecionando para o painel administrativo após a atualização bem-sucedida.

Gestão de Utilizadores
Eliminação de Utilizador (POST /users/delete/:id/:email)
Permite ao administrador eliminar um utilizador específico pelo seu ID. Além disso, todos os recursos e comentários associados ao email do utilizador são também eliminados, garantindo uma limpeza de dados relacionados.

Gestão de Cursos
Adição de Curso (GET /adicionarCurso e POST /cursos/create)
A rota GET leva ao formulário para adicionar novos cursos. A rota POST processa a criação do curso, verificando se todos os campos necessários foram preenchidos antes de enviar os dados para a API backend.

Eliminação de Curso (POST /cursos/delete/:cursoNome)
Permite ao administrador eliminar um curso específico pelo nome, com a ação sendo realizada através de uma chamada à API backend que gerencia os dados do curso.

Segurança e Autenticação
Todas as rotas administrativas requerem que o utilizador seja autenticado como administrador. Isso é garantido pelo middleware auth.getUserMail que, além de autenticar, verifica o papel do utilizador. O uso de tokens JWT para autenticação é uma prática comum para APIs, proporcionando uma segurança robusta através do controle de sessões e acesso.

Implementação com Axios e Express.js
O uso de axios para fazer chamadas à API interna mostra uma separação clara entre a camada de frontend e backend, permitindo uma arquitetura de serviços mais desacoplada e escalável. Cada chamada à API é protegida por tokens de autenticação, e as respostas são geridas de forma apropriada para cada cenário de erro ou sucesso.

### 4.2.2 index.js 

Rotas de Autenticação e Sessão
Página de Login (GET / e POST /login):
A rota GET carrega a página inicial, que é tipicamente a página de login. A rota POST processa as credenciais de login (email e senha), utilizando a API externa para autenticar o usuário. Se bem-sucedida, armazena um token JWT em um cookie e redireciona para a página de recursos.

Página de Logout (GET /logout):
Esta rota limpa o cookie de sessão (token) e redireciona o usuário para a página de login, efetivamente terminando a sessão do usuário.

Registro e Gestão de Perfil
Página de Registro (GET /registo e POST /registo):
A rota GET carrega a página de registro, recuperando a lista de cursos disponíveis através de uma chamada à API. A rota POST processa os dados do formulário de registro, submetendo-os à API para criar um novo usuário e redireciona para a página inicial.

Perfil do Usuário (GET /perfil e GET /perfil/:email):
Estas rotas permitem visualizar e editar o perfil do usuário. A primeira carrega o perfil do usuário logado, enquanto a segunda carrega o perfil de um usuário específico, ambos apresentando informações detalhadas e recursos relacionados ao usuário.

Atualização de Perfil (POST /perfil/:email/update):
Processa a atualização dos dados do perfil de um usuário, como nome, curso, escola, e departamento, usando uma chamada à API para salvar as alterações.

Gestão de Notícias e Conteúdo
Página de Notícias (GET /noticias):
Carrega a página de notícias mais recentes, fazendo uma chamada à API para buscar recursos marcados como recentes e exibindo-os numa página renderizada.

Gestão de Arquivos
Visualização de Arquivos (GET /fileContent/:name):
Permite visualizar o conteúdo de um arquivo armazenado no servidor, lendo o arquivo do disco e enviando seu conteúdo como resposta.

Download de Arquivos (GET /download/:name):
Habilita o download de um arquivo específico, fornecendo uma rota direta para baixar o arquivo do servidor.

Página de Upload e Rota de Upload (GET /upload e POST /files):
A rota GET carrega a página para o upload de arquivos, enquanto a POST processa o upload de múltiplos arquivos. Os arquivos são armazenados localmente e seus metadados são salvos tanto no disco quanto submetidos a uma API para criar registros de recursos associados.

Conclusão
As rotas configuradas no index.js fornecem uma estrutura completa para a funcionalidade básica da aplicação "UniMaterial", cobrindo desde autenticação até gestão de conteúdo. A integração com uma API externa através de chamadas axios para autenticação e gestão de dados garante uma arquitetura flexível e escalável, enquanto o uso de cookies para sessões e multer para o manuseio de arquivos facilita o gerenciamento eficiente de estado e dados de usuário.

### 4.2.3 recursos.js

Lista de Recursos (GET /):
Esta rota principal carrega uma lista de recursos, permitindo filtrar os resultados com base em vários critérios como autor, nome, tema, escola, departamento e curso. Os recursos são filtrados adicionalmente no lado do cliente, dependendo do nível de restrição e do papel do usuário (admin ou não).

Favoritos (GET /favorites):
Carrega uma lista dos recursos favoritos do usuário autenticado, utilizando a sub-rota no backend específica para esse fim.

Editar Recurso (GET /:id/editar):
Permite ao usuário acessar uma página para editar um recurso específico, verificando se já avaliou o recurso e se é o autor do mesmo, para apresentar opções apropriadas.

Detalhes do Recurso (GET /:id):
Similar à rota de edição, mas destinada apenas à visualização detalhada do recurso, incluindo a verificação de avaliações anteriores e autoria.

Comentários e Avaliações
Adicionar Comentário (POST /:recursoId/comentarios):
Permite aos usuários autenticados postar comentários em recursos específicos, enviando os dados relevantes para a API de backend.

Avaliar Recurso (POST /:recursoId/avaliar):
Os usuários podem avaliar recursos, sendo esta informação submetida à API de backend que armazena as avaliações.

Atualização e Remoção
Atualizar Recurso (POST /:recursoId/update):
Esta rota permite que os detalhes de um recurso sejam atualizados através de uma submissão de formulário, com a API de backend processando as alterações.

Eliminar Recurso (GET /:id/DELETE):
Oferece a funcionalidade de eliminar um recurso especificado pelo ID, com a operação de eliminação sendo gerida pela API de backend.

Funcionalidades Gerais
Todas estas rotas são protegidas por autenticação, garantindo que apenas usuários autenticados possam acessar as funcionalidades sensíveis. Além disso, muitas das rotas requerem que o usuário tenha um papel de administrador para acessar ou modificar informações sensíveis, especialmente nas operações de edição e eliminação de recursos.

Este conjunto de rotas fornece uma interface robusta para a gestão de recursos dentro da plataforma "UniMaterial", integrando-se com uma API de backend para realizar operações complexas enquanto mantém a segurança e integridade dos dados do usuário e do sistema.

### 4.2.4 users.js

Adicionar aos Favoritos (POST /favoritos/:recursoId/adicionar):
Esta rota permite ao utilizador autenticado adicionar um recurso específico aos seus favoritos. O processo envolve enviar um pedido POST ao backend com o identificador do recurso e o e-mail do utilizador, utilizando um token JWT para autorização.

Remover dos Favoritos (POST /favoritos/:recursoId/remover):
Funciona de forma semelhante à rota de adicionar, mas neste caso, remove um recurso dos favoritos do utilizador. Um pedido POST é enviado ao backend para processar a remoção, também autorizado através de um token JWT.

Visualização de Perfil
Perfil de Utilizador (GET /profile/:email):
Esta rota carrega o perfil de um utilizador específico, usando o seu e-mail como parâmetro. Realiza um pedido GET ao backend para obter os dados do utilizador e, adicionalmente, busca os recursos associados a esse e-mail. Esta informação é utilizada para renderizar uma página de perfil, que inclui dados pessoais do utilizador e os recursos que publicou ou marcou como favoritos.

Alteração de Cargo
Alterar Cargo (POST /alterarCargo/:email/:cargo):
Permite a um administrador alterar o cargo de um utilizador, alternando entre "aluno" e "professor". A rota verifica primeiro se o utilizador que faz o pedido tem permissões de administrador. Se tiver, envia um pedido PUT ao backend para atualizar o cargo do utilizador especificado, com a autorização realizada via token JWT.

Considerações de Segurança
Todas estas rotas requerem que o utilizador esteja autenticado, assegurado pelo middleware auth.getUserMail que verifica o token do utilizador. Operações críticas como a alteração de cargo são restritas a utilizadores com permissões de administrador, reforçando a segurança e integridade do sistema.

Integração e Usabilidade
O uso de Axios para interagir com o backend API facilita a manutenção e escalabilidade da aplicação, permitindo que a lógica de negócios seja gerida centralmente. Além disso, o design das rotas favorece uma experiência de utilizador fluída, redirecionando apropriadamente após cada operação e fornecendo feedback visual através de páginas renderizadas.

Em resumo, estas rotas fornecem funcionalidades essenciais para a gestão de utilizadores no sistema "UniMaterial", desde a manipulação de favoritos até a gestão de perfis e cargos, com uma camada de segurança robusta garantida através de autenticação e autorizações específicas de acesso.

## 4.3 Autenticação

-- Falar da autenticação --

# 5. Interface desenvolvida

## 5.1 Pagina de autenticação

![auth_page](imagens/auth_page.png)

## 5.2 Pagina de registo

![register_page](imagens/register_page.png)

## 5.3 Página de notícias

-- por print das noticias --

## 5.4 Página de recursos

-- print da pagina de recursos --

## 5.5 Página de publicação de um recurso

![publicar_rec_push](imagens/publicar_page.png)

## 5.6 Página de edição de um recurso

![edit_recurso](imagens/edit_recurso_page.png)

## 5.7 Página do painel do administrador

![admin_panel](imagens/admin_panel_page.png)

## 5.8 Página de perfil

![perfil](imagens/perfil_page.png)

## 5.9 Página de edição de perfil

![edit_perfil](imagens/edit_perfil_page.png)

# 6. Modo de funcionamento 

-- dizer como correr o programa --

# 7. Conclusão

Em conclusão, finalizamos este projeto com uma plataforma funcional e que permite fazer todas as funcionalidades a que o grupo se propôs a implementar, tanto a nível de autenticação, níveis de acesso a recursos, entre outros. 

Para trabalhos futuros, existem sempre várias oportunidades e ideias que permitam uma expansão da plataforma. 

No geral, este projeto proporcionou uma oportunidade valiosa para aplicar os conhecimentos desenvolvidos ao longo do semestre durante as aulas teóricas e práticas desta unidade curricular, permitindo desenvolver uma plataforma completa.
