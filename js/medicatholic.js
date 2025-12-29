
document.addEventListener('DOMContentLoaded', () => {
    const medForm = document.getElementById('meditation-form');
    const resultContainer = document.getElementById('meditation-result');
    const loadingContainer = document.getElementById('meditation-loading');

    if (medForm) {
        medForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // UI State: Loading
            medForm.classList.add('hidden');
            loadingContainer.classList.remove('hidden');
            resultContainer.innerHTML = ''; // Clear previous

            const formData = new FormData(medForm);
            const theme = formData.get('theme');

            try {
                const response = await fetch('/.netlify/functions/meditation', {
                    method: 'POST',
                    body: JSON.stringify({ theme }),
                    headers: { 'Content-Type': 'application/json' }
                });

                let data;
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await response.json();
                } else {
                    const text = await response.text();
                    throw new Error(`Resposta não esperada do servidor: ${text.substring(0, 100)}...`);
                }

                if (!response.ok) {
                    throw new Error(data.error || `Erro do servidor: ${response.status}`);
                }

                renderMeditation(data);

            } catch (error) {
                console.error("Erro na geração:", error);

                let errorMsg = "Ocorreu um erro ao gerar a meditação.";
                if (error.message.includes("500")) {
                    errorMsg = "Erro interno no servidor. Tente novamente.";
                } else if (error.message.includes("Unexpected token")) {
                    errorMsg = "Erro ao processar resposta do servidor.";
                }

                resultContainer.innerHTML = `
                    <div class="p-6 border border-red-500/30 bg-red-500/10 rounded-lg text-center space-y-4 animate-fade-in">
                        <p class="text-terracotta font-serif text-xl">Ops, algo deu errado.</p>
                        <p class="text-slate/80 font-mono text-xs">${error.message}</p>
                        <button onclick="document.getElementById('meditation-form').classList.remove('hidden'); this.parentElement.remove();" 
                                class="text-xs uppercase tracking-widest border-b border-terracotta text-terracotta hover:text-charcoal transition-colors pb-1">
                            Tentar Novamente
                        </button>
                    </div>
                `;
            } finally {
                loadingContainer.classList.add('hidden');
            }
        });
    }
});

function renderMeditation(data) {
    const container = document.getElementById('meditation-result');
    const medForm = document.getElementById('meditation-form');

    const resetBtn = document.createElement('button');
    resetBtn.className = "mt-12 mx-auto block text-slate dark:text-slate-300 hover:text-terracotta underline decoration-1 underline-offset-4 text-xs tracking-[0.2em] uppercase transition-colors";
    resetBtn.textContent = "Nova Meditação";
    resetBtn.onclick = () => {
        container.innerHTML = '';
        medForm.classList.remove('hidden');
        // Scroll back to top of form
        medForm.scrollIntoView({ behavior: 'smooth' });
    };

    const sections = [
        { key: 'leitura', icon: '📖' },
        { key: 'meditacao', icon: '🧘' },
        { key: 'oracao', icon: '🙏' },
        { key: 'contemplacao', icon: '🕊️' }
    ];

    let html = `<div class="space-y-16 animate-fade-in pb-12">`;

    sections.forEach(sec => {
        const item = data[sec.key];
        if (item) {
            html += `
                <div class="relative pl-8 md:pl-12 group">
                    <!-- Vertical Line -->
                    <div class="absolute left-0 top-2 bottom-0 w-[1px] bg-terracotta/30 group-hover:bg-terracotta transition-colors"></div>
                    
                    <h3 class="font-serif text-2xl md:text-3xl text-charcoal dark:text-paper mb-6 flex items-center gap-4">
                        <span class="text-2xl opacity-40 grayscale group-hover:grayscale-0 transition-all">${sec.icon}</span> 
                        ${item.titulo}
                    </h3>
                    
                    <div class="prose prose-lg max-w-none text-slate dark:text-slate-200 font-light leading-relaxed whitespace-pre-line">
                        ${item.conteudo}
                    </div>
                    
                    ${item.referencia ? `<p class="mt-4 text-xs font-mono text-terracotta uppercase tracking-wide opacity-70">— ${item.referencia}</p>` : ''}
                </div>
            `;
        }
    });

    html += `</div>`;

    container.innerHTML = html;
    container.appendChild(resetBtn);
}
