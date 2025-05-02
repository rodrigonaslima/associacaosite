
// Espera o DOM inicial carregar
document.addEventListener('DOMContentLoaded', function() {

    const loadHTML = async (url, placeholderId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status} ao carregar ${url}`);
            }
            const data = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = data;
                console.log(`Conteúdo de ${url} carregado em #${placeholderId}.`);
            } else {
                console.error(`Placeholder #${placeholderId} não encontrado.`);
            }
        } catch (error) {
            console.error(`Falha ao carregar ${url}:`, error);
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar (${placeholderId})</p>`;
            }
        }
    };

    // Carrega header e footer em paralelo e SÓ DEPOIS inicializa os componentes
    Promise.all([
        loadHTML('_navbar.html', 'navbar-placeholder'), // Use o nome correto do seu arquivo de navbar!
        loadHTML('_footer.html', 'footer-placeholder')  // Use o nome correto do seu arquivo de footer!
    ]).then(() => {
        console.log("Header e Footer carregados. Chamando inicializações...");
        // Verifica se a função global existe antes de chamar
        if (typeof initializePageComponents === 'function') {
            initializePageComponents(); 
        } else {
            console.error("Função initializePageComponents() não encontrada no script.js!");
        }
    }).catch(error => {
        console.error("Erro ao carregar partials:", error);
    });

});