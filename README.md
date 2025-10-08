# Plataforma de Revenda de Veículos – Microservico de Vendas

Esta é um microserivco para uma plataforma de revenda de veículos construída com NestJS e TypeORM, como parte do desafio Sub Tech Challenge do curso SOAT – PósTech (fase 4).

---

## 📋 Descrição do Projeto

O sistema permite:
- Cadastro, edição e listagem de veículos (disponíveis e vendidos), ordenados por preço.
- Cadastro e atualização de clientes.
- Registro de vendas de veículos (inclui atualização do status do veículo para "VENDIDO").
- Autenticação de usuários (via módulo `auth`), com login, validação e verificação de permissões.

A autenticação está implementada internamente com JWT, mas pode ser migrada para serviço externo conforme requisito.

---

## 🧱 Arquitetura e Módulos


- **vendas**: processamento de vendas — registra a transação - atualiza status do pagamento.
 - **vendas**: listagens das vendas.
  - **vendas**: obter a venda de um veiculo pele ID.

Cada módulo está isolado com controladores, serviços e DTOs, utilizando TypeORM para persistência em banco de dados relacional.

---

## ⚙️ Requisitos para rodar localmente

1. Clone este repositório.
2. Instale dependências com `npm install`.
3. Rode a aplicação com `npm run start:dev`.
