
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

                if (!response.ok) throw new Error('Falha na geração');

                const data = await response.json();
                renderMeditation(data);

            } catch (error) {
                console.error(error);
                resultContainer.innerHTML = `
                    <div class="p-4 border border-red-500/30 bg-red-500/10 rounded text-red-200 text-center">
                        Desculpe, ocorreu um erro ao gerar a meditação. Tente novamente mais tarde.
                    </div>
                `;
                medForm.classList.remove('hidden'); // Show form again
            } finally {
                loadingContainer.classList.add('hidden');
            }
        });
    }
});

function renderMeditation(data) {
    const container = document.getElementById('meditation-result');
    const resetBtn = document.createElement('button');
    resetBtn.className = "mt-8 text-paper hover:text-terracotta underline text-sm tracking-widest uppercase transition-colors";
    resetBtn.textContent = "Nova Meditação";
    resetBtn.onclick = () => {
        container.innerHTML = '';
        document.getElementById('meditation-form').classList.remove('hidden');
    };

    const sections = [
        { key: 'leitura', icon: '📖' },
        { key: 'meditacao', icon: '🧘' },
        { key: 'oracao', icon: '🙏' },
        { key: 'contemplacao', icon: '🕊️' }
    ];

    let html = `<div class="space-y-12 animate-fade-in">`;

    sections.forEach(sec => {
        const item = data[sec.key];
        if (item) {
            html += `
                <div class="border-l-2 border-slate/20 pl-6 py-2">
                    <h3 class="font-serif text-2xl text-paper mb-4 flex items-center gap-3">
                        <span class="opacity-50 text-xl">${sec.icon}</span> ${item.titulo}
                    </h3>
                    <div class="prose text-slate font-sans leading-relaxed whitespace-pre-line text-lg">
                        ${item.conteudo}
                    </div>
                </div>
            `;
        }
    });

    html += `</div>`;

    container.innerHTML = html;
    container.appendChild(resetBtn);
}
