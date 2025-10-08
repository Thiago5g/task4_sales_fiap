# Plataforma de Vendas de Veículos – Sales Microservice (NestJS)

Microserviço responsável pelo ciclo de vida de vendas e sincronização de pagamento de veículos. Construído em **NestJS** + **TypeORM** com migrações versionadas. Autenticação foi removida deste serviço (delegada ao API Gateway) para simplificar responsabilidades.

---

## 📋 Funcionalidades Principais

- Registro de venda com geração de código de pagamento (`codigoPagamento`).
- Atualização idempotente de status de pagamento e preço final recebido.
- Listagem e consulta por veículo.
- Campos e estados traduzidos para PT-BR para refletir linguagem de negócio.
- Mapeamento completo via Swagger (documentação em `/api/docs`).

---

## 🧾 Modelo de Dados (Tabela `vendas`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | PK | Identificador da venda |
| cliente_id | int | Identifica o cliente |
| veiculo_id | int | Identifica o veículo |
| preco | decimal(10,2) | Valor negociado/atual (pode ser ajustado no pagamento) |
| moeda | char(3) | Padrão `BRL` |
| codigo_pagamento | varchar(100) | Código único gerado (ex: `PAY-3-1A2B3C`) |
| status | varchar | `AGUARDANDO_PAGAMENTO` | `VENDIDO` | `CANCELADO` |
| status_pagamento | varchar | `PENDENTE` | `PAGO` | `CANCELADO` | `FALHOU` |
| pago_em | timestamp | Data/hora da confirmação de pagamento |
| vendido_em | timestamp | Data/hora da conclusão efetiva |
| criado_em | timestamp | Criado automaticamente |
| atualizado_em | timestamp | Atualizado automaticamente |

### Regras de Transição
| status_pagamento recebido | Efeito em status | Observações |
|---------------------------|------------------|-------------|
| PAGO | VENDIDO | Define `pagoEm` e `vendidoEm` se não definidos |
| CANCELADO | CANCELADO | Não pode voltar depois para outro |
| FALHOU | CANCELADO | Falha de processamento cancela a venda |
| PENDENTE | AGUARDANDO_PAGAMENTO (somente se ainda não VENDIDO) | Mantém histórico de timestamps |

Se a venda já estiver `CANCELADO`, qualquer tentativa de mudança diferente de manter `CANCELADO` retorna mensagem sem alterar.

---

## 🔁 Fluxo de Pagamento
1. Cliente cria a venda (POST `/vendas`): retorna `codigoPagamento` e status iniciais `AGUARDANDO_PAGAMENTO` / `PENDENTE`.
2. Sistema externo de pagamento processa e chama PATCH `/vendas/veiculo/:veiculoId/pagamento` enviando `statusPagamento` e opcionalmente `preco` ajustado.
3. Serviço aplica regras idempotentes, define timestamps e garante integridade das transições.

Exemplo de requisição PATCH:
```json
PATCH /vendas/veiculo/42/pagamento
{
	"statusPagamento": "PAGO",
	"preco": 19999.90
}
```
Resposta:
```json
{
	"message": "Pagamento atualizado com sucesso.",
	"venda": {
		"id": 7,
		"veiculoId": 42,
		"preco": 19999.90,
		"status": "VENDIDO",
		"statusPagamento": "PAGO",
		"codigoPagamento": "PAY-7-AB12CD",
		"pagoEm": "2025-10-07T22:15:00.123Z",
		"vendidoEm": "2025-10-07T22:15:00.123Z"
	}
}
```

---

## 🚀 Endpoints Principais
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/vendas` | Cria nova venda |
| GET | `/vendas` | Lista vendas |
| GET | `/vendas/veiculo/:veiculoId` | Obtém venda por veículo |
| PATCH | `/vendas/veiculo/:veiculoId/pagamento` | Atualiza status de pagamento e preço |

Documentação Swagger: `http://localhost:3001/api/docs`

---

## 🛠️ Stack Técnica
- **Node.js 20**
- **NestJS 11**
- **TypeORM 0.3** (migrações, sem `synchronize` em produção)
- **PostgreSQL**
- **Jest** (testes unitários + cobertura)
- **Swagger** para documentação

---

## 🗄️ Migrations
As migrações ficam em `src/migrations` e são executadas via scripts NPM:

```bash
npm run migration:run
npm run migration:revert
npm run migration:generate -- src/migrations/NomeMigration
```

Migrações importantes:
1. `CreateVendasTable`
2. `UpdateVendasPaymentFields` (campos de pagamento)
3. `RenameVendaColumnsPtBr` (tradução de colunas)
4. `TranslateStatusValuesPtBr` (tradução de valores e defaults)

---

## 🧪 Testes & Cobertura
Executar testes:
```bash
npm test
```
Cobertura completa:
```bash
npm run test:cov
```
Resultados atuais (referência):
```
Lines > 98% | Branches > 92% | Functions 100%
```

Pode-se ajustar thresholds no bloco `jest.coverageThreshold` do `package.json`.

---

## 🔐 Autenticação
Este microserviço não faz autenticação local. Assume validação a nível de gateway/API externa. Se necessário reintroduzir, usar guardas JWT e decorators removidos previamente.

---


## ♻️ Idempotência
Chamadas repetidas de PATCH com mesmo `statusPagamento` apenas retornam mensagem de "Nenhuma mudança" e preservam timestamps.

- **vendas**: processamento de vendas — registra a transação - atualiza status do pagamento.
 - **vendas**: listagens das vendas.
  - **vendas**: obter a venda de um veiculo pele ID.


## 🧩 Código de Pagamento
Gerado determinística e sequencialmente (`PAY-<contador>-<HEX>`). Implementado em `src/common/utils/gerar-codigo-pagamento.ts`.

---

## 🛡️ Boas Práticas Adotadas
- Migrations explícitas (sem sync automático)
- DTOs validados com `class-validator`
- Status e campos em PT-BR alinhados com domínio
- Testes unitários abrangendo fluxos de transição de pagamento
- Separação clara entre controller (I/O) e service (regra de negócio)

---

## ▶️ Como Rodar Localmente
1. `npm install`
2. Definir `DATABASE_URL` (ou usar fallback do datasource para desenvolvimento)
3. `npm run migration:run`
4. `npm run start:dev`
5. Acessar `/api/docs`

Variáveis úteis:
| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do serviço (default 3001) |
| `DATABASE_URL` | URL de conexão Postgres |
| `CORS_ORIGIN_1` | Origem liberada (ex: http://localhost:3000) |

---

## 🚧 Próximos Passos (Sugestões)
- Testes E2E cobrindo PATCH de pagamento com banco real.
- Publicar imagem Docker.
- Circuit breaker / retries para callbacks externos (se houver integração futura).

## 📄 Licença
Uso educacional / acadêmico.

1. Clone este repositório.
2. Instale dependências com `npm install`.
3. Rode a aplicação com `npm run start:dev`.

