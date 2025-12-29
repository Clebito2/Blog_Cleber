# Meditatio & Blog Pessoal - Cléber Donato

## Sobre o Projeto
Este repositório hospeda o blog pessoal e profissional de Cléber Donato, focado na intersecção entre **Humanismo Digital**, **Espiritualidade** e **Eficiência Operacional**.

O projeto inclui:
1.  **Blog Editorial:** Artigos sobre cultura, filosofia e tecnologia.
2.  **Laboratório de IA:** Curadoria de ferramentas e conteúdos processados por Inteligência Artificial (NotebookLM).
3.  **Meditatio:** Uma ferramenta de **Lectio Divina** assistida por IA, que gera meditações católicas personalizadas baseadas em temas como *Exame de Consciência*, *Casamento* e *Anjo da Guarda*.

## Identidade Visual

A estética busca transmitir **elegança, serenidade e profundidade**. Evitamos o visual "tech" padrão em favor de uma textura mais orgânica e tipografia clássica.

### Cores
*   **Charcoal (`#1A1A1A`)**: Preto suave para textos principais e fundos de destaque.
*   **Paper (`#F7F7F2`)**: Off-white quente para o fundo, simulando papel.
*   **Terracotta (`#9A3B3B`)**: Cor de destaque (accent), remetendo à terra e tradição.
*   **Sand (`#E5E5E0`)**: Tons de areia para bordas e separadores sutis.

### Tipografia
*   **Merriweather (Serif)**: Para títulos e textos de leitura on-screen (humanidade).
*   **Inter (Sans)**: Para textos de apoio e interface (clareza).
*   **JetBrains Mono (Mono)**: Para detalhes técnicos e navegação (precisão).

## Meditatio - Engenharia de Prompts

A ferramenta `Meditatio` utiliza a API do Google Gemini (`gemini-flash-latest`) para gerar conteúdo. O prompt foi desenhado para atuar como um diretor espiritual.

### Estrutura do Prompt Base
> "Você é um diretor espiritual e teólogo católico, especialista em guiar fiéis na prática da Lectio Divina. Sua missão é criar uma meditação temática profunda e pastoral [...] estruturada nos quatro passos da Lectio Divina."

### Fontes de Conhecimento (Contexto)
A IA é instruída a se basear nas seguintes obras:
1.  *Imitação de Cristo* (Tomás de Kempis)
2.  *Filoteia* (São Francisco de Sales)
3.  *Glórias de Maria Santíssima* (Santo Afonso)
4.  *A Arte de Aproveitar-se das Próprias Faltas* (Pe. José Tissot)
5.  *Catecismo da Igreja Católica*
6.  *História de uma Alma* (Santa Teresinha)

### Instruções Específicas por Tema
*   **Exame de Consciência:** Foco em mandamentos, pecados capitais e contrição.
*   **Casamento:** Baseado em Monsenhor Tihamér Tóth ("Casamento e Família").
*   **Anjo da Guarda:** Introduzido a devoção e confiança no protetor celeste.

## Log de Alterações Recentes

*   **Segurança:** Remoção de chaves de API expostas e migração para variáveis de ambiente (`process.env`).
*   **Backend:** Substituição da biblioteca `@google/generative-ai` por chamadas `fetch` nativas para resolver conflitos de deploy no Netlify.
*   **Rebranding:** Mudança de "Medicatholic" para "**Meditatio**".
*   **Conteúdo:** Inclusão de guias estáticos para "Santo Rosário" e "Exame de Consciência".
*   **Refinamentos UI:** Ajustes de bordas, transparências e reduções de rodapé para um visual mais leve.

## Identidade Visual v2 & Instruções Técnicas (Pesquisa Posterior)

### 1. Textura de Fundo
*   **Padrão:** `cubes.png` (Isometric Cubes).
*   **Fonte:** [Transparent Textures](https://www.transparenttextures.com/patterns/cubes.png).
*   **Implementação:** CSS na classe `.texture-overlay`.
    *   `background-image: url(...)`
    *   `background-attachment: fixed` (Essencial para o efeito de paralaxe estática).
    *   `opacity: 0.15` (Ajustado para sutileza sem sumir no modo claro).

### 2. Efeito "Spotlight" (Luz do Cursor)
*   **Elemento:** `<div id="cursor-light">`.
*   **CSS:**
    *   `background: radial-gradient(circle closest-side, rgba(255, 255, 255, 0.8), transparent)`: Cria o facho de luz suave.
    *   `mix-blend-mode: overlay`: Permite que a luz interaja com a textura e o fundo.
    *   `z-index: 1`: Fica acima da textura (`z-0`) mas abaixo do conteúdo.
*   **JavaScript:** Event listener `mousemove` que atualiza `style.left` e `style.top`.

### 3. Rodapé Compacto
*   **Diretriz:** O rodapé deve ser uma faixa fina (`py-2`) mas manter todo o texto original.
*   **Layout:** Margens internas de títulos e textos foram reduzidas (`mb-1`, `mb-0`) para maximizar a economia de espaço vertical.

### 4. Deep Linking de Posts
*   **Sistema:** Roteamento via Hash.
*   **Formato:** `index.html#post?id=ID_DO_POST`.
*   **Lógica:** O script `app.js` detecta mudanças no hash (`window.onhashchange`), oculta a home e exibe o post correspondente carregado de `data.js`.

---
*Ecossistema Live © 2025*
