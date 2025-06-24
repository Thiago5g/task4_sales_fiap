# Plataforma de Revenda de Veículos – Backend API

Esta é a API para uma plataforma de revenda de veículos construída com NestJS e TypeORM, como parte do desafio Sub Tech Challenge do curso SOAT – PósTech (fase 3).

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

- **auth**: autenticação/login de usuários via JWT.
- **usuarios**: validação da existência de usuários e associação a autenticação.
- **clientes**: cadastro e atualização de dados de clientes (quantidade de carros comprados, dados pessoais etc.).
- **veiculos**: CRUD de veículos e endpoints de listagem (disponíveis e vendidos).
- **vendas**: processamento de vendas — valida veículo, atualiza status e registra a transação.

Cada módulo está isolado com controladores, serviços e DTOs, utilizando TypeORM para persistência em banco de dados relacional.

---

## ⚙️ Requisitos para rodar localmente

1. Clone este repositório.
2. Instale dependências com `npm install`.
3. Rode a aplicação com `npm run start:dev`.