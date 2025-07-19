# Font Setup

## Sage Font

Para que a fonte 'Sage' seja exibida corretamente nos nomes dos noivos, é necessário:

1. Adicionar o arquivo `sage.otf` na raiz do projeto
2. O arquivo deve estar no mesmo diretório que o `index.html`

### Estrutura esperada:
```
renarina/
├── index.html
├── style.css
├── sage.otf  ← Arquivo necessário
└── ...
```

### Fallback
Caso o arquivo `sage.otf` não esteja presente, a fonte 'Dancing Script' será utilizada como fallback.